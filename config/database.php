<?php
class Database {
    private $hosts = ["127.0.0.1:3307", "localhost:3307", "127.0.0.1", "localhost"];
    private $db_name = "health_sanitation_db";
    private $username = "root";
    private $password = "";
    public $conn;
    public $lastError = '';

    public function __construct() {
        $configFile = __DIR__ . '/env.php';
        $config = file_exists($configFile) ? require $configFile : [];

        $this->db_name = $config['db_name'] ?? $this->db_name;
        $this->username = $config['db_user'] ?? $this->username;
        $this->password = $config['db_pass'] ?? $this->password;

        if (!empty($config['db_host'])) {
            $host = $config['db_host'];
            if (!empty($config['db_port'])) {
                $host .= ':' . $config['db_port'];
            }
            array_unshift($this->hosts, $host);
            $this->hosts = array_values(array_unique($this->hosts));
        }
    }

    public function getConnection() {
        foreach ($this->hosts as $host) {
            try {
                $this->conn = new PDO(
                    "mysql:host=" . $host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                    $this->username,
                    $this->password
                );
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                return $this->conn;
            } catch(PDOException $e) {
                $this->lastError = $e->getMessage();
                continue;
            }
        }
        return null;
    }

    public function getLastError() {
        return $this->lastError;
    }
}
?>
