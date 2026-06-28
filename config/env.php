<?php
$localConfig = __DIR__ . '/env.local.php';

if (file_exists($localConfig)) {
    return require $localConfig;
}

return [
    'gemini_key' => getenv('gemini_api_key') ?: '',
    'db_host' => getenv('DB_HOST') ?: '127.0.0.1',
    'db_port' => getenv('DB_PORT') ?: '3307',
    'db_name' => getenv('DB_NAME') ?: 'health_sanitation_db',
    'db_user' => getenv('DB_USER') ?: 'root',
    'db_pass' => getenv('DB_PASS') ?: '',
];
