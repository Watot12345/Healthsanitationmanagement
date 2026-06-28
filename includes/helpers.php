<?php
/**
 * Calculate age from birth date
 */
function calculateAge($birthDate) {
    if (!$birthDate) return null;
    $birth = new DateTime($birthDate);
    $now = new DateTime();
    $diff = $birth->diff($now);
    return $diff->y;
}

/**
 * Calculate age in months
 */
function calculateAgeInMonths($birthDate) {
    if (!$birthDate) return null;
    $birth = new DateTime($birthDate);
    $now = new DateTime();
    $diff = $birth->diff($now);
    return ($diff->y * 12) + $diff->m;
}

/**
 * Check if patient is child (≤ 5 years)
 */
function isChild($birthDate) {
    if (!$birthDate) return false;
    $age = calculateAge($birthDate);
    return $age !== null && $age <= 5;
}

/**
 * Calculate BMI
 */
function calculateBMI($weight, $height) {
    if (!$weight || !$height || $height <= 0) return null;
    $heightInMeters = $height / 100;
    return round($weight / ($heightInMeters * $heightInMeters), 1);
}

/**
 * Get BMI Category
 */
function getBMICategory($bmi) {
    if (!$bmi) return ['category' => 'N/A', 'color' => '#6c757d', 'emoji' => '⚪'];
    if ($bmi < 18.5) return ['category' => 'Underweight', 'color' => '#ffc107', 'emoji' => '⚠️'];
    if ($bmi < 25) return ['category' => 'Normal', 'color' => '#28a745', 'emoji' => '✅'];
    if ($bmi < 30) return ['category' => 'Overweight', 'color' => '#fd7e14', 'emoji' => '⚖️'];
    if ($bmi < 35) return ['category' => 'Obese Class I', 'color' => '#dc3545', 'emoji' => '🔴'];
    if ($bmi < 40) return ['category' => 'Obese Class II', 'color' => '#c82333', 'emoji' => '🔴'];
    return ['category' => 'Obese Class III', 'color' => '#721c24', 'emoji' => '🚨'];
}
?>