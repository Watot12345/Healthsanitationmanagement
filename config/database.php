<?php
class Database {
    private $hosts = ["127.0.0.1", "localhost"];
    private $db_name = "health_sanitation_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        foreach ($this->hosts as $host) {
            try {
                $this->conn = new PDO(
                    "mysql:host=" . $host . ";dbname=" . $this->db_name,
                    $this->username,
                    $this->password
                );
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $this->conn;
            } catch(PDOException $e) {
                continue;
            }
        }
        return null;
    }
}
?>