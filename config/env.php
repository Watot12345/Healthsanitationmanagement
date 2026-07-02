<?php
// env.php - Separate host and port for MySQL 8.0

// Detect if on production
$isProduction = (
    strpos($_SERVER['SERVER_NAME'] ?? '', 'awardspace.net') !== false ||
    strpos($_SERVER['SERVER_NAME'] ?? '', 'fdb1033') !== false ||
    getenv('APP_ENV') === 'production'
);

if ($isProduction) {
    // 🚀 PRODUCTION - MySQL 8.0
    return [
        'db_host' => 'fdb1033.awardspace.net',
        'db_port' => '3306',
        'db_name' => '4742694_me',
        'db_user' => '4742694_me',
        'db_pass' => 'Joshua143',
    ];
} else {
    // 💻 LOCAL
    return [
        'db_host' => '127.0.0.1',
        'db_port' => '33066',
        'db_name' => 'health_sanitation_db',
        'db_user' => 'root',
        'db_pass' => '',
    ];
}
?>