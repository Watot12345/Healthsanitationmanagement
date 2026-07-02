<?php
// debug_mysql8.php - DELETE AFTER TESTING!
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>🔧 MySQL 8.0 Debug</h2>";

// Your credentials
$host = 'fdb1033.awardspace.net';
$port = '3306';
$dbname = '4742694_me';
$user = '4742694_me';
$pass = 'Joshua143';

echo "Host: $host<br>";
echo "Port: $port<br>";
echo "Database: $dbname<br>";
echo "User: $user<br>";
echo "Password: " . str_repeat('*', strlen($pass)) . "<br><br>";

// Test 1: Standard connection
echo "<h3>Test 1: Standard Connection</h3>";
try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4",
        $user,
        $pass
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Connected!<br>";
    
    $result = $pdo->query("SELECT VERSION() as version, DATABASE() as db, NOW() as time");
    $row = $result->fetch();
    echo "MySQL Version: " . $row['version'] . "<br>";
    echo "Database: " . $row['db'] . "<br>";
    echo "Time: " . $row['time'] . "<br>";
} catch (PDOException $e) {
    echo "❌ Failed: " . $e->getMessage() . "<br>";
}

// Test 2: With MySQL 8.0 options
echo "<h3>Test 2: MySQL 8.0 Options</h3>";
try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
        ]
    );
    echo "✅ Connected with MySQL 8.0 options!<br>";
    
    $result = $pdo->query("SELECT VERSION() as version");
    $row = $result->fetch();
    echo "MySQL Version: " . $row['version'] . "<br>";
} catch (PDOException $e) {
    echo "❌ Failed: " . $e->getMessage() . "<br>";
}

// Test 3: Try localhost
echo "<h3>Test 3: Try localhost</h3>";
try {
    $pdo = new PDO(
        "mysql:host=localhost;port=3306;dbname={$dbname};charset=utf8mb4",
        $user,
        $pass
    );
    echo "✅ Connected via localhost!<br>";
} catch (PDOException $e) {
    echo "❌ localhost failed: " . $e->getMessage() . "<br>";
}
?>