<?php
class Database {
    public $conn;
    public $lastError = '';
    
    public function __construct() {
        // DETECT: Are we on local or production?
        $isLocal = (
            $_SERVER['SERVER_NAME'] === 'localhost' || 
            $_SERVER['SERVER_NAME'] === '127.0.0.1' ||
            strpos($_SERVER['SERVER_NAME'], '.test') !== false
        );
        
        if ($isLocal) {
            // 💻 LOCAL - Your working local credentials
            $host = '127.0.0.1';
            $port = '3306';
            $dbname = 'health_sanitation_db';
            $user = 'root';
            $pass = '';
        } else {
            // 🚀 PRODUCTION - Awardspace credentials
            $host = 'fdb1033.awardspace.net';
            $port = '3306';
            $dbname = '4742694_me';
            $user = '4742694_me';
            $pass = 'Joshua143';
        }
        
        try {
            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
            
            $this->conn = new PDO($dsn, $user, $pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
        } catch(PDOException $e) {
            $this->lastError = $e->getMessage();
            $this->conn = null;
        }
    }
    
    public function getConnection() {
        return $this->conn;
    }
    
    public function getLastError() {
        return $this->lastError;
    }
}
?>