<?php
session_start();

$page = $_GET['page'] ?? 'home';
$error = '';

// Simple user check (hardcoded)
$users = [
    'admin' => ['password' => 'admin', 'role' => 'admin'],
    'professor' => ['password' => 'professor', 'role' => 'professor'],
    'student' => ['password' => 'student', 'role' => 'student'],
];

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'], $_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (isset($users[$username]) && $users[$username]['password'] === $password) {
        $_SESSION['role'] = $users[$username]['role'];
        header('Location: index.php?page=dashboard');
        exit;
    } else {
        $error = 'Invalid username or password.';
        $page = 'login';
    }
}

// Handle logout
if ($page === 'logout') {
    session_destroy();
    header('Location: index.php?page=login');
    exit;
}

// Redirect to the correct dashboard if logged in
if ($page === 'dashboard' && isset($_SESSION['role'])) {
    $role = $_SESSION['role'];
    if ($role === 'admin')
        $page = 'admin-dashboard';
    elseif ($role === 'professor')
        $page = 'professor-dashboard';
    elseif ($role === 'student')
        $page = 'student-dashboard';
    else {
        session_destroy();
        header('Location: index.php?page=login');
        exit;
    }
}

// If not logged in and trying to access dashboard, redirect to login
if (in_array($page, ['admin-dashboard', 'professor-dashboard', 'student-dashboard']) && !isset($_SESSION['role'])) {
    header('Location: index.php?page=login');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Portal</title>
    <link rel="stylesheet" href="styles/header.css">
    <link rel="stylesheet" href="styles/home.css">
    <link rel="stylesheet" href="styles/update-password.css">
    <link rel="stylesheet" href="styles/footer.css">
    <link rel="stylesheet" href="styles/admin-dashboard.css">
    <link rel="stylesheet" href="styles/student-dashboard.css">

    <link rel="stylesheet" href="styles/admin/student-management.css">
    <link rel="stylesheet" href="styles/admin/professor-management.css">
    <link rel="stylesheet" href="styles/admin/course_unit_management.css">
    <link rel="stylesheet" href="styles/admin/report-generation.css">
    <link rel="stylesheet" href="styles/admin/admin_user_management.css">

    <link rel="stylesheet" href="styles/professor-dashboard.css">

    <link rel="stylesheet" href="styles/student/view-attendence.css">
    <link rel="stylesheet" href="styles/student/student-profile.css">

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">

    <?php if ($page === 'login')
        echo '<link rel="stylesheet" href="styles/login.css">'; ?>
</head>

<body style="display: flex; flex-direction: column; min-height: 100vh;">

    <?php include "pages/header.php"; ?>

    <main style="flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <?php
        if ($error) {
            echo '<p style="color:red; margin-bottom: 1rem;">' . htmlspecialchars($error) . '</p>';
        }

        // Load requested page
        if ($page === 'login') {
            include "pages/login.php";
        } elseif ($page === 'admin-dashboard') {
            include "pages/admin-dashboard.php";
        } elseif ($page === 'professor-dashboard') {
            include "pages/professor-dashboard.php";
        } elseif ($page === 'student-dashboard') {
            include "pages/student-dashboard.php";
        } elseif ($page === "update-password") {
            include "pages/update-password.php";
        } else {
            include "pages/home.php";
        }
        ?>
    </main>

    <?php include "pages/footer.php"; ?>

    <script src="controller/header.js"></script>
    <script src="controller/footer.js"></script>
    <script src="controller/admin-dashboard.js"></script>
    <script src="controller/professor-dashboard.js"></script>
    <script src="controller/student-dashboard.js"></script>

    <script src="controller/admin/admin_user_management.js"></script>
    <script src="controller/admin/report-generation.js"></script>
    <script src="controller/admin/course_unit_management.js"></script>
    <script src="controller/admin/professor-management.js"></script>
    <script src="controller/admin/student-management.js"></script>

    <script src="controller/student/view-attendance.js"></script>
    <script src="controller/student/student-profile.js"></script>

    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- jsPDF CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <!-- Flatpickr for date range picker -->
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</body>

</html>