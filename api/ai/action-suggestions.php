<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

session_start();
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit(json_encode(['status'=>'error','message'=>'Not authenticated.']));
}

$config=require __DIR__.'/../../config/env.php';
$apiKey=trim($config['gemini_key']??'');

if($apiKey===''){
    http_response_code(500);
    exit(json_encode(['status'=>'error','message'=>'Gemini API key missing.']));
}

function countValue(PDO $c,string $sql):int{
    try{return (int)$c->query($sql)->fetchColumn();}
    catch(Throwable $e){return 0;}
}

function parseAiJson(string $t):?array{
    $t=trim($t);
    // Remove markdown code blocks
    $t=preg_replace('/^```(?:json)?\s*/i','',$t);
    $t=preg_replace('/```\s*$/','',$t);
    
    // First try direct decode
    $d=json_decode($t,true);
    if(is_array($d)) return $d;
    
    // Try to extract JSON object with regex
    if(preg_match('/\{.*\}/s',$t,$m)){
        $d=json_decode($m[0],true);
        if(is_array($d)) return $d;
    }
    
    // Try to fix truncated JSON by completing it
    $t = rtrim($t, ",\n\r\t ");
    // Count brackets
    $openBraces = substr_count($t, '{');
    $closeBraces = substr_count($t, '}');
    $openBrackets = substr_count($t, '[');
    $closeBrackets = substr_count($t, ']');
    
    // Add missing closing brackets
    while ($openBrackets > $closeBrackets) {
        $t .= ']';
        $closeBrackets++;
    }
    while ($openBraces > $closeBraces) {
        $t .= '}';
        $closeBraces++;
    }
    
    // Try to parse the fixed JSON
    $d=json_decode($t,true);
    if(is_array($d)) return $d;
    
    // If still failing, try to extract valid suggestions array
    if(preg_match('/"suggestions"\s*:\s*\[(.*)\]/s', $t, $m)) {
        $suggestionsText = '[' . $m[1] . ']';
        // Fix truncated objects in array
        $suggestionsText = preg_replace('/,\s*$/','',$suggestionsText);
        // Complete any truncated objects
        $openObjBraces = substr_count($suggestionsText, '{');
        $closeObjBraces = substr_count($suggestionsText, '}');
        while ($openObjBraces > $closeObjBraces) {
            $suggestionsText .= '}';
            $closeObjBraces++;
        }
        $suggestionsArray = json_decode($suggestionsText, true);
        if(is_array($suggestionsArray)) {
            return ['suggestions' => $suggestionsArray];
        }
    }
    
    return null;
}

try{
    $db=new Database();
    $conn=$db->getConnection();
    $conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

    $context=[
        'pending_permits'=>countValue($conn,"SELECT COUNT(*) FROM permits WHERE status='Pending'")
    ];

    $prompt = "You are a municipal health management AI assistant. Based on this data:\n";
    $prompt .= json_encode($context, JSON_PRETTY_PRINT);
    $prompt .= "\n\nGenerate 3 actionable suggestions. Return ONLY a valid JSON object with a 'suggestions' array. Each suggestion object must have these exact fields:\n";
    $prompt .= "- 'title': A short action-oriented title (max 8 words)\n";
    $prompt .= "- 'priority': One of 'High', 'Medium', or 'Low'\n";
    $prompt .= "- 'detail': A one-sentence explanation of why this action matters\n";
    $prompt .= "- 'module': One of 'Permits', 'Operations', 'Quality Control', 'Administration', or 'General'\n\n";
    $prompt .= "Example: {\"suggestions\":[{\"title\":\"Review Pending Permits\",\"priority\":\"High\",\"detail\":\"Ensure timely processing of all pending permit applications\",\"module\":\"Permits\"}]}\n\n";
    $prompt .= "Keep it brief. Do not wrap in markdown. Return ONLY the JSON.";

    if(!function_exists('curl_init')){
        throw new Exception('PHP cURL extension is not enabled.');
    }

    $url = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' . urlencode($apiKey);

    $payload=[
        'contents'=>[['parts'=>[['text'=>$prompt]]]],
        'generationConfig'=>[
            'temperature'=>0.2,
            'maxOutputTokens'=>800
        ]
    ];

    $ch=curl_init($url);
    curl_setopt_array($ch,[
        CURLOPT_POST=>true,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_HTTPHEADER=>['Content-Type: application/json'],
        CURLOPT_POSTFIELDS=>json_encode($payload),
        CURLOPT_TIMEOUT=>30
    ]);

    $response=curl_exec($ch);
    $curlError=curl_error($ch);
    $httpCode=curl_getinfo($ch,CURLINFO_HTTP_CODE);
    curl_close($ch);

    if($response===false){
        throw new Exception("cURL Error: ".$curlError);
    }

    if($httpCode>=400){
        if($httpCode === 429) {
            $errorData = json_decode($response, true);
            $retryAfter = 60;
            if(isset($errorData['error']['details'])) {
                foreach($errorData['error']['details'] as $detail) {
                    if(isset($detail['retryDelay'])) {
                        $retryAfter = (int)str_replace('s', '', $detail['retryDelay']) + 5;
                        break;
                    }
                }
            }
            http_response_code(429);
            echo json_encode([
                'status' => 'error',
                'message' => 'Rate limit exceeded. Please try again in ' . $retryAfter . ' seconds.',
                'retry_after' => $retryAfter
            ]);
            exit;
        }
        throw new Exception("Gemini HTTP {$httpCode}: ".$response);
    }

    $result=json_decode($response,true);

    if(isset($result['error'])){
        throw new Exception(json_encode($result['error']));
    }

    $text=$result['candidates'][0]['content']['parts'][0]['text']??'';
    $decoded=parseAiJson($text);

    // If JSON parsing failed, use fallback suggestions
    if(!$decoded){
        $decoded = ['suggestions' => []];
        
        // Try to extract any text as suggestions
        if (!empty($text)) {
            $lines = array_filter(explode("\n", $text), function($line) {
                return strlen(trim($line)) > 10;
            });
            
            if (!empty($lines)) {
                $decoded['suggestions'] = array_values($lines);
            }
        }
    }

    // Format suggestions for frontend compatibility
    $rawSuggestions = $decoded['suggestions'] ?? [];
    $formattedSuggestions = [];

    // If still no suggestions, provide defaults
    if (empty($rawSuggestions)) {
        $rawSuggestions = [
            "Review all pending permits for completeness",
            "Prioritize urgent permit applications",
            "Schedule inspections for pending permits"
        ];
    }

    foreach ($rawSuggestions as $index => $suggestion) {
        if (is_string($suggestion)) {
            // Convert plain strings to structured format
            $module = 'General';
            if (stripos($suggestion, 'permit') !== false) {
                $module = 'Permits';
            } elseif (stripos($suggestion, 'resource') !== false || stripos($suggestion, 'staff') !== false || stripos($suggestion, 'allocate') !== false) {
                $module = 'Administration';
            } elseif (stripos($suggestion, 'prioritize') !== false || stripos($suggestion, 'urgent') !== false) {
                $module = 'Operations';
            } elseif (stripos($suggestion, 'review') !== false || stripos($suggestion, 'check') !== false) {
                $module = 'Quality Control';
            }
            
            $priority = 'Medium';
            if ($index === 0 || stripos($suggestion, 'urgent') !== false || stripos($suggestion, 'immediately') !== false || stripos($suggestion, 'critical') !== false) {
                $priority = 'High';
            } elseif ($index >= 2 && (stripos($suggestion, 'consider') !== false || stripos($suggestion, 'optional') !== false)) {
                $priority = 'Low';
            }
            
            $formattedSuggestions[] = [
                'title' => $suggestion,
                'priority' => $priority,
                'detail' => 'AI-generated suggestion based on current data analysis',
                'module' => $module
            ];
        } else {
            // Already structured by Gemini
            $formattedSuggestions[] = [
                'title' => $suggestion['title'] ?? $suggestion['action'] ?? 'Unnamed Suggestion',
                'priority' => in_array($suggestion['priority'] ?? '', ['High', 'Medium', 'Low']) ? $suggestion['priority'] : 'Medium',
                'detail' => $suggestion['detail'] ?? $suggestion['description'] ?? 'No details provided',
                'module' => $suggestion['module'] ?? 'General'
            ];
        }
    }

    echo json_encode([
        'status' => 'success',
        'source' => 'gemini',
        'suggestions' => $formattedSuggestions
    ]);

}catch(Throwable $e){
    http_response_code(500);
    echo json_encode([
        'status'=>'error',
        'message'=>$e->getMessage(),
        'file'=>$e->getFile(),
        'line'=>$e->getLine()
    ],JSON_PRETTY_PRINT);
}