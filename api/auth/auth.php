<?php
require_once __DIR__ . '/../../config/database.php';
session_start();

class Auth {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function login($username, $password, $ip_address = '127.0.0.1') {
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
            $this->conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?")
                       ->execute([$user['id']]);
            
            $token = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
            $stmt = $this->conn->prepare("INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)");
            $stmt->execute([$user['id'], $token, $expiresAt]);
            
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['userName'] = $user['full_name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['session_token'] = $token;
            
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
        return ['success' => false, 'message' => 'Database error'];
    }
}

    public function logout() {
        session_destroy();
        return ['success' => true, 'message' => 'Logged out'];
    }

    public function checkAuth() {
        if (isset($_SESSION['user_id'])) {
            return [
                'authenticated' => true,
                'role' => $_SESSION['role'],
                'userName' => $_SESSION['userName'],
                'email' => $_SESSION['email']
            ];
        }
        return ['authenticated' => false];
    }
}
?>