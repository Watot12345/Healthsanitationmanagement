<?php
require_once __DIR__ . '/../config/database.php';

class Auth {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function login($username, $password, $ip_address = '') {
        if (!$this->conn) {
            return ['success' => false, 'message' => 'Database connection failed'];
        }

        try {
            $stmt = $this->conn->prepare(
                "SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1 LIMIT 1"
            );
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password_hash'])) {
                // Update last login
                $this->conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?")
                           ->execute([$user['id']]);
                
                // Generate token
                $token = bin2hex(random_bytes(32));
                
                return [
                    'success' => true,
                    'user_id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role'],
                    'full_name' => $user['full_name'],
                    'session_token' => $token,
                    'message' => 'Login successful'
                ];
            }
            
            return ['success' => false, 'message' => 'Invalid username or password'];
            
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
?>