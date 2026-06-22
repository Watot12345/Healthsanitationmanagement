<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health & Sanitation Management System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
        }
        .card-hover:hover {
            transform: translateY(-5px);
            transition: all 0.3s ease;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-bold text-xl">+</span>
                    </div>
                    <div>
                        <span class="text-xl font-bold text-gray-800">H&SM</span>
                        <span class="text-sm text-gray-500 block -mt-1">Management System</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="views/login.html" class="text-gray-600 hover:text-blue-600 font-medium">Sign In</a>
                    <a href="views/login.html" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Access System
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="gradient-bg text-white">
        <div class="max-w-7xl mx-auto px-4 py-20">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 class="text-5xl font-bold mb-6 leading-tight">
                        Health & Sanitation Management System
                    </h1>
                    <p class="text-xl mb-8 text-blue-100">
                        A comprehensive digital platform for managing public health services, sanitation permits, immunization tracking, and wastewater management.
                    </p>
                    <div class="flex space-x-4">
                        <a href="views/login.html" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg">
                            Get Started
                        </a>
                        <a href="#modules" class="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors text-lg">
                            Learn More
                        </a>
                    </div>
                </div>
                <div class="hidden md:block">
                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-white/20 rounded-lg p-4 text-center">
                                <div class="text-3xl font-bold">🏥</div>
                                <div class="text-sm mt-2">Health Center</div>
                            </div>
                            <div class="bg-white/20 rounded-lg p-4 text-center">
                                <div class="text-3xl font-bold">🔍</div>
                                <div class="text-sm mt-2">Sanitation</div>
                            </div>
                            <div class="bg-white/20 rounded-lg p-4 text-center">
                                <div class="text-3xl font-bold">💉</div>
                                <div class="text-sm mt-2">Immunization</div>
                            </div>
                            <div class="bg-white/20 rounded-lg p-4 text-center">
                                <div class="text-3xl font-bold">🚰</div>
                                <div class="text-sm mt-2">Wastewater</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modules Section -->
    <div id="modules" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">System Modules</h2>
                <p class="text-xl text-gray-600">Comprehensive tools for health and sanitation management</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Health Center Services -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                        <span class="text-3xl">🏥</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Health Center Services</h3>
                    <p class="text-gray-600 mb-4">
                        Manage patient records, appointments, and health service delivery efficiently.
                    </p>
                    <ul class="space-y-2 text-sm text-gray-500">
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Patient Registration
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Medical Records
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Appointment Scheduling
                        </li>
                    </ul>
                </div>

                <!-- Sanitation Permit & Inspection -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <span class="text-3xl">🔍</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Sanitation Permit & Inspection</h3>
                    <p class="text-gray-600 mb-4">
                        Issue permits, schedule inspections, and ensure compliance with sanitation standards.
                    </p>
                    <ul class="space-y-2 text-sm text-gray-500">
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Permit Applications
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Inspection Reports
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Compliance Tracking
                        </li>
                    </ul>
                </div>

                <!-- Immunization & Nutrition Tracker -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                        <span class="text-3xl">💉</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Immunization & Nutrition Tracker</h3>
                    <p class="text-gray-600 mb-4">
                        Track vaccination schedules and monitor nutritional status of community members.
                    </p>
                    <ul class="space-y-2 text-sm text-gray-500">
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Vaccination Records
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Nutrition Assessment
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Schedule Reminders
                        </li>
                    </ul>
                </div>

                <!-- Wastewater & Septic Services -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
                    <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                        <span class="text-3xl">🚰</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Wastewater & Septic Services</h3>
                    <p class="text-gray-600 mb-4">
                        Manage wastewater treatment and septic system maintenance operations.
                    </p>
                    <ul class="space-y-2 text-sm text-gray-500">
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Treatment Monitoring
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Septic Tank Records
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Maintenance Scheduling
                        </li>
                    </ul>
                </div>

                <!-- Health Surveillance System -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <span class="text-3xl">📈</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Health Surveillance System</h3>
                    <p class="text-gray-600 mb-4">
                        Monitor public health trends and detect potential outbreaks early.
                    </p>
                    <ul class="space-y-2 text-sm text-gray-500">
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Disease Surveillance
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Data Analytics
                        </li>
                        <li class="flex items-center">
                            <span class="text-green-500 mr-2">✓</span> Alert System
                        </li>
                    </ul>
                </div>

                <!-- System Features -->
                <div class="card-hover bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
                    <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                        <span class="text-3xl">⚙️</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3">System Features</h3>
                    <p class="text-blue-100 mb-4">
                        Advanced features for efficient management and reporting.
                    </p>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <span class="mr-2">✓</span> Role-based Access Control
                        </li>
                        <li class="flex items-center">
                            <span class="mr-2">✓</span> Real-time Analytics
                        </li>
                        <li class="flex items-center">
                            <span class="mr-2">✓</span> Secure Data Storage
                        </li>
                        <li class="flex items-center">
                            <span class="mr-2">✓</span> Audit Logging
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-gray-100 py-16">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <div class="text-4xl font-bold text-blue-600">5</div>
                    <div class="text-gray-600 mt-2">Core Modules</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-blue-600">24/7</div>
                    <div class="text-gray-600 mt-2">System Access</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-blue-600">100%</div>
                    <div class="text-gray-600 mt-2">Secure</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-blue-600">Multi</div>
                    <div class="text-gray-600 mt-2">User Roles</div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="gradient-bg text-white py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <h2 class="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p class="text-xl text-blue-100 mb-8">
                Access the Health & Sanitation Management System to streamline your operations.
            </p>
            <div class="flex justify-center space-x-4">
                <a href="views/login.html" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg">
                    Sign In
                </a>
                <a href="setup.php" class="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors text-lg">
                    System Setup
                </a>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">Health & Sanitation Management</h3>
                    <p class="text-sm">
                        A comprehensive digital solution for managing public health and sanitation services.
                    </p>
                </div>
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">Quick Links</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="views/login.html" class="hover:text-white transition-colors">System Login</a></li>
                        <li><a href="views/dashboard.html" class="hover:text-white transition-colors">Dashboard</a></li>
                        <li><a href="#modules" class="hover:text-white transition-colors">Modules</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">System Modules</h3>
                    <ul class="space-y-2 text-sm">
                        <li>Health Center Services</li>
                        <li>Sanitation Permit & Inspection</li>
                        <li>Immunization & Nutrition Tracker</li>
                        <li>Wastewater & Septic Services</li>
                        <li>Health Surveillance System</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                <p>&copy; <?php echo date('Y'); ?> Health & Sanitation Management System. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>