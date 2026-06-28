<?php
require_once __DIR__ . '/helpers.php';

class PatientManager {
    private $conn;
    
    public function __construct($dbConnection) {
        $this->conn = $dbConnection;
    }

    /**
     * Validate patient input data
     */
    private function validatePatientData($data, $isUpdate = false) {
        $errors = [];

        // ── Required fields ──────────────────────────────────────────────
        if (empty($data['full_name'])) {
            $errors[] = 'Full name is required.';
        } elseif (!preg_match('/^[\p{L}\s\-\.\']+$/u', $data['full_name'])) {
            $errors[] = 'Full name must contain letters only (no numbers or special characters).';
        } elseif (strlen($data['full_name']) > 100) {
            $errors[] = 'Full name must not exceed 100 characters.';
        }

        if (empty($data['birth_date'])) {
            $errors[] = 'Birth date is required.';
        } else {
            $date = DateTime::createFromFormat('Y-m-d', $data['birth_date']);
            if (!$date || $date->format('Y-m-d') !== $data['birth_date']) {
                $errors[] = 'Birth date must be a valid date (YYYY-MM-DD).';
            } elseif ($date > new DateTime()) {
                $errors[] = 'Birth date cannot be in the future.';
            }
        }

        // ── Optional text fields ──────────────────────────────────────────
        if (!empty($data['gender'])) {
            $allowed = ['Male', 'Female', 'Other', 'Prefer not to say'];
            if (!in_array($data['gender'], $allowed)) {
                $errors[] = 'Gender must be one of: ' . implode(', ', $allowed) . '.';
            }
        }

        if (!empty($data['blood_type'])) {
            $allowed = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
            if (!in_array($data['blood_type'], $allowed)) {
                $errors[] = 'Blood type must be one of: ' . implode(', ', $allowed) . '.';
            }
        }

        if (!empty($data['triage'])) {
            $allowed = ['Low', 'Medium', 'High', 'Critical'];
            if (!in_array($data['triage'], $allowed)) {
                $errors[] = 'Triage must be one of: ' . implode(', ', $allowed) . '.';
            }
        }

        // ── Numeric fields ────────────────────────────────────────────────
        if (!empty($data['weight'])) {
            if (!is_numeric($data['weight'])) {
                $errors[] = 'Weight must be a number.';
            } elseif ($data['weight'] <= 0 || $data['weight'] > 500) {
                $errors[] = 'Weight must be between 0.1 and 500 kg.';
            }
        }

        if (!empty($data['height'])) {
            if (!is_numeric($data['height'])) {
                $errors[] = 'Height must be a number.';
            } elseif ($data['height'] <= 0 || $data['height'] > 300) {
                $errors[] = 'Height must be between 0.1 and 300 cm.';
            }
        }

        if (!empty($data['head_circumference'])) {
            if (!is_numeric($data['head_circumference'])) {
                $errors[] = 'Head circumference must be a number.';
            } elseif ($data['head_circumference'] <= 0 || $data['head_circumference'] > 100) {
                $errors[] = 'Head circumference must be between 0.1 and 100 cm.';
            }
        }

        // ── Contact fields ────────────────────────────────────────────────
        if (!empty($data['contact_number'])) {
            if (!preg_match('/^[\d\+\-\(\)\s]+$/', $data['contact_number'])) {
                $errors[] = 'Contact number must contain numbers only (spaces, +, -, () allowed).';
            } elseif (strlen($data['contact_number']) > 20) {
                $errors[] = 'Contact number must not exceed 20 characters.';
            }
        }

        if (!empty($data['emergency_phone'])) {
            if (!preg_match('/^[\d\+\-\(\)\s]+$/', $data['emergency_phone'])) {
                $errors[] = 'Emergency phone must contain numbers only (spaces, +, -, () allowed).';
            } elseif (strlen($data['emergency_phone']) > 20) {
                $errors[] = 'Emergency phone must not exceed 20 characters.';
            }
        }

        if (!empty($data['emergency_contact'])) {
            if (!preg_match('/^[\p{L}\s\-\.\']+$/u', $data['emergency_contact'])) {
                $errors[] = 'Emergency contact name must contain letters only.';
            } elseif (strlen($data['emergency_contact']) > 100) {
                $errors[] = 'Emergency contact name must not exceed 100 characters.';
            }
        }

        // ── Date fields ───────────────────────────────────────────────────
        if (!empty($data['last_visit'])) {
            $date = DateTime::createFromFormat('Y-m-d', $data['last_visit']);
            if (!$date || $date->format('Y-m-d') !== $data['last_visit']) {
                $errors[] = 'Last visit must be a valid date (YYYY-MM-DD).';
            } elseif ($date > new DateTime()) {
                $errors[] = 'Last visit date cannot be in the future.';
            }
        }

        // ── Text length limits ────────────────────────────────────────────
        if (!empty($data['address']) && strlen($data['address']) > 500) {
            $errors[] = 'Address must not exceed 500 characters.';
        }

        if (!empty($data['allergies']) && strlen($data['allergies']) > 1000) {
            $errors[] = 'Allergies field must not exceed 1000 characters.';
        }

        if (!empty($data['existing_conditions']) && strlen($data['existing_conditions']) > 1000) {
            $errors[] = 'Existing conditions field must not exceed 1000 characters.';
        }

        if (!empty($data['condition']) && strlen($data['condition']) > 255) {
            $errors[] = 'Condition field must not exceed 255 characters.';
        }

        return $errors;
    }

    /**
     * Generate unique patient ID
     */
    public function generatePatientId() {
        $year = date('Y');
        $prefix = "PAT-{$year}-";
        
        $stmt = $this->conn->prepare("
            SELECT patient_id 
            FROM patients 
            WHERE patient_id LIKE ? 
            ORDER BY id DESC 
            LIMIT 1
        ");
        $stmt->execute([$prefix . '%']);
        $last = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($last) {
            $num = intval(substr($last['patient_id'], -4)) + 1;
        } else {
            $num = 1;
        }
        
        return $prefix . str_pad($num, 4, '0', STR_PAD_LEFT);
    }
    
    /**
     * Create new patient
     */
    public function createPatient($data) {
        try {
            // Validate input
            $errors = $this->validatePatientData($data);
            if (!empty($errors)) {
                return ['success' => false, 'error' => implode(' ', $errors), 'errors' => $errors];
            }

            $patientId = $this->generatePatientId();
            $birthDate = $data['birth_date'];
            
            $age      = calculateAge($birthDate);
            $isChild  = isChild($birthDate);

            $bmi = null;
            $bmiCategory = null;
            if (!empty($data['weight']) && !empty($data['height']) && $data['height'] > 0) {
                $bmi = calculateBMI($data['weight'], $data['height']);
                if ($bmi) {
                    $category    = getBMICategory($bmi);
                    $bmiCategory = $category['category'];
                }
            }
            
            $sql = "INSERT INTO patients (
                patient_id, full_name, birth_date, age, gender, blood_type,
                weight, height, head_circumference, bmi, bmi_category,
                is_child, needs_growth_tracking,
                triage, `condition`, allergies, existing_conditions,
                address, contact_number, emergency_contact, emergency_phone,
                last_visit, created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?
            )";
            
            $stmt   = $this->conn->prepare($sql);
            $result = $stmt->execute([
                $patientId,
                trim($data['full_name']),
                $birthDate,
                $age,
                $data['gender'] ?? null,
                $data['blood_type'] ?? null,
                !empty($data['weight'])             ? (float)$data['weight']             : null,
                !empty($data['height'])             ? (float)$data['height']             : null,
                !empty($data['head_circumference']) ? (float)$data['head_circumference'] : null,
                $bmi,
                $bmiCategory,
                $isChild ? 1 : 0,
                $isChild ? 1 : 0,
                $data['triage']    ?? 'Low',
                $data['condition'] ?? 'Stable',
                $data['allergies']            ?? null,
                $data['existing_conditions']  ?? null,
                $data['address']              ?? null,
                $data['contact_number']       ?? null,
                $data['emergency_contact']    ?? null,
                $data['emergency_phone']      ?? null,
                $data['last_visit']           ?? date('Y-m-d'),
                $data['created_by']           ?? null
            ]);
            
            if (!$result) {
                $errorInfo = $stmt->errorInfo();
                return ['success' => false, 'error' => 'Execute failed: ' . print_r($errorInfo, true)];
            }
            
            $dbId = $this->conn->lastInsertId();
            
            if ($isChild && !empty($data['weight']) && !empty($data['height'])) {
                try {
                    $this->createGrowthRecord([
                        'patient_id'        => $dbId,
                        'weight'            => $data['weight'],
                        'height'            => $data['height'],
                        'head_circumference'=> $data['head_circumference'] ?? null,
                        'record_date'       => $data['measurement_date']   ?? date('Y-m-d')
                    ]);
                } catch (Exception $e) {
                    error_log('Growth record creation failed: ' . $e->getMessage());
                }
            }
            
            if ($bmi) {
                try {
                    $this->createBMIHistory([
                        'patient_id'  => $dbId,
                        'weight'      => $data['weight'],
                        'height'      => $data['height'],
                        'bmi'         => $bmi,
                        'record_date' => $data['measurement_date'] ?? date('Y-m-d')
                    ]);
                } catch (Exception $e) {
                    error_log('BMI history creation failed: ' . $e->getMessage());
                }
            }
            
            return [
                'success'    => true,
                'id'         => $dbId,
                'patient_id' => $patientId,
                'message'    => 'Patient registered successfully'
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Exception: ' . $e->getMessage()];
        }
    }
    
    /**
     * Create growth record
     */
    public function createGrowthRecord($data) {
        try {
            $sql = "INSERT INTO growth_records (
                patient_id, record_date, age_months,
                weight, height, head_circumference, bmi,
                nutritional_status, notes, recorded_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare("SELECT birth_date FROM patients WHERE id = ?");
            $stmt->execute([$data['patient_id']]);
            $patient = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$patient) return false;
            
            $ageMonths = calculateAgeInMonths($patient['birth_date']);
            $bmi       = calculateBMI($data['weight'] ?? 0, $data['height'] ?? 0);
            $category  = $bmi ? getBMICategory($bmi) : null;
            
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([
                $data['patient_id'],
                $data['record_date']        ?? date('Y-m-d'),
                $ageMonths,
                $data['weight']             ?? null,
                $data['height']             ?? null,
                $data['head_circumference'] ?? null,
                $bmi,
                $category ? $category['category'] : null,
                $data['notes']              ?? null,
                $data['recorded_by']        ?? null
            ]);
        } catch (Exception $e) {
            error_log('Create growth record error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create BMI history
     */
    public function createBMIHistory($data) {
        try {
            $category = getBMICategory($data['bmi']);
            
            $sql = "INSERT INTO bmi_history (
                patient_id, record_date, weight, height, bmi, bmi_category, recorded_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([
                $data['patient_id'],
                $data['record_date'] ?? date('Y-m-d'),
                $data['weight'],
                $data['height'],
                $data['bmi'],
                $category['category'],
                $data['recorded_by'] ?? null
            ]);
        } catch (Exception $e) {
            error_log('Create BMI history error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get all patients
     */
    public function getAllPatients() {
        $sql = "SELECT 
            p.*,
            CASE 
                WHEN p.weight IS NOT NULL AND p.height IS NOT NULL THEN 'Complete'
                WHEN p.weight IS NOT NULL OR p.height IS NOT NULL THEN 'Partial'
                ELSE 'Missing'
            END as growth_data_status
        FROM patients p
        ORDER BY p.created_at DESC";
        
        $result = $this->conn->query($sql);
        return $result ? $result->fetchAll(PDO::FETCH_ASSOC) : [];
    }
    
    /**
     * Get patient by ID
     */
    public function getPatient($id) {
        $stmt = $this->conn->prepare("SELECT * FROM patients WHERE id = ?");
        $stmt->execute([$id]);
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($patient) {
            $patient['age']       = calculateAge($patient['birth_date']);
            $patient['age_months']= calculateAgeInMonths($patient['birth_date']);
            $patient['is_child']  = isChild($patient['birth_date']);
        }
        
        return $patient;
    }
    
    /**
     * Get patient by patient_id
     */
    public function getPatientByPatientId($patientId) {
        $stmt = $this->conn->prepare("SELECT * FROM patients WHERE patient_id = ?");
        $stmt->execute([$patientId]);
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($patient) {
            $patient['age']       = calculateAge($patient['birth_date']);
            $patient['age_months']= calculateAgeInMonths($patient['birth_date']);
            $patient['is_child']  = isChild($patient['birth_date']);
        }
        
        return $patient;
    }
    
    /**
     * Update patient
     */
    public function updatePatient($id, $data) {
        try {
            // Validate input
            $errors = $this->validatePatientData($data, true);
            if (!empty($errors)) {
                return ['success' => false, 'error' => implode(' ', $errors), 'errors' => $errors];
            }

            $birthDate = $data['birth_date'];
            $age       = calculateAge($birthDate);
            $isChild   = isChild($birthDate);
            
            $bmi = null;
            $bmiCategory = null;
            if (!empty($data['weight']) && !empty($data['height']) && $data['height'] > 0) {
                $bmi = calculateBMI($data['weight'], $data['height']);
                if ($bmi) {
                    $category    = getBMICategory($bmi);
                    $bmiCategory = $category['category'];
                }
            }
            
            $sql = "UPDATE patients SET 
                full_name = ?, birth_date = ?, age = ?, gender = ?, blood_type = ?,
                weight = ?, height = ?, head_circumference = ?, bmi = ?, bmi_category = ?,
                is_child = ?, needs_growth_tracking = ?, triage = ?, `condition` = ?,
                allergies = ?, existing_conditions = ?, address = ?,
                contact_number = ?, emergency_contact = ?, emergency_phone = ?, last_visit = ?
            WHERE id = ?";
            
            $stmt   = $this->conn->prepare($sql);
            $result = $stmt->execute([
                trim($data['full_name']),
                $birthDate,
                $age,
                $data['gender']     ?? null,
                $data['blood_type'] ?? null,
                !empty($data['weight'])             ? (float)$data['weight']             : null,
                !empty($data['height'])             ? (float)$data['height']             : null,
                !empty($data['head_circumference']) ? (float)$data['head_circumference'] : null,
                $bmi,
                $bmiCategory,
                $isChild ? 1 : 0,
                $isChild ? 1 : 0,
                $data['triage']    ?? 'Low',
                $data['condition'] ?? 'Stable',
                $data['allergies']           ?? null,
                $data['existing_conditions'] ?? null,
                $data['address']             ?? null,
                $data['contact_number']      ?? null,
                $data['emergency_contact']   ?? null,
                $data['emergency_phone']     ?? null,
                $data['last_visit']          ?? date('Y-m-d'),
                $id
            ]);
            
            if (!$result) {
                return ['success' => false, 'error' => 'Update failed'];
            }
            
            return ['success' => true, 'message' => 'Patient updated successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Update failed: ' . $e->getMessage()];
        }
    }
    
    /**
     * Search patients
     */
    public function searchPatients($keyword) {
        $sql = "SELECT * FROM patients 
                WHERE full_name LIKE ? OR patient_id LIKE ? OR contact_number LIKE ?
                ORDER BY full_name ASC";
        $searchTerm = '%' . $keyword . '%';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Delete patient
     */
    public function deletePatient($id) {
        try {
            $stmt   = $this->conn->prepare("DELETE FROM patients WHERE id = ?");
            $result = $stmt->execute([$id]);
            return ['success' => $result, 'message' => $result ? 'Patient deleted successfully' : 'Delete failed'];
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Delete failed: ' . $e->getMessage()];
        }
    }
    
    /**
     * Get patient statistics
     */
    public function getPatientStatistics() {
        $stats = [];
        $stmt  = $this->conn->query("SELECT COUNT(*) as total FROM patients");
        $stats['total'] = $stmt ? $stmt->fetch(PDO::FETCH_ASSOC)['total'] : 0;

        $stmt = $this->conn->query("SELECT COUNT(*) as total FROM patients WHERE is_child = 1");
        $stats['children'] = $stmt ? $stmt->fetch(PDO::FETCH_ASSOC)['total'] : 0;

        $stats['adults'] = $stats['total'] - $stats['children'];
        return $stats;
    }
}
?>