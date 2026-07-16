<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Municipal Health & Sanitation Portal | Smart City Dashboard</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        gov: {
                            50: '#f0f4f8',
                            100: '#d9e2ec',
                            200: '#bcccdc',
                            300: '#9fb3c8',
                            400: '#829ab1',
                            500: '#627d98',
                            600: '#486581',
                            700: '#334e68',
                            800: '#243b53',
                            900: '#102a43',
                            950: '#0b1d33',
                        },
                        blue: {
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                            800: '#1e40af',
                        },
                        emerald: {
                            50: '#ecfdf5',
                            100: '#d1fae5',
                            500: '#10b981',
                            600: '#059669',
                            700: '#047857',
                        },
                        teal: {
                            50: '#f0fdfa',
                            100: '#ccfbf1',
                            500: '#14b8a6',
                            600: '#0d9488',
                            700: '#0f766e',
                        }
                    },
                    fontFamily: {
                        sans: ['Outfit', 'Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        /* Custom Loading Shimmer Effect */
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .shimmer-active {
            position: relative;
            overflow: hidden;
        }
        .shimmer-active::after {
            content: '';
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            transform: translateX(-100%);
            background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%);
            animation: shimmer 2s infinite ease-in-out;
        }
        /* Pulse indicators */
        @keyframes radar {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(2.4); opacity: 0; }
        }
        .radar-pulse {
            animation: radar 2.5s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        /* Slow background mesh animation */
        @keyframes mesh-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .mesh-gradient {
            background-size: 200% 200%;
            animation: mesh-move 20s ease infinite;
        }
        /* Slow floating keyframes */
        @keyframes float-y {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1.5deg); }
        }
        @keyframes float-y-reverse {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(12px) rotate(-1.5deg); }
        }
        .animate-float-1 { animation: float-y 7s ease-in-out infinite; }
        .animate-float-2 { animation: float-y-reverse 8s ease-in-out infinite; }
        /* Official seal pulse glow */
        @keyframes seal-breathing {
            0%, 100% { filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.2)); }
            50% { filter: drop-shadow(0 0 16px rgba(99, 102, 241, 0.5)); }
        }
        .seal-glow {
            animation: seal-breathing 4s ease-in-out infinite;
        }
        /* Directional Scroll Reveals */
        .reveal-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-scale {
            opacity: 0;
            transform: scale(0.95);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-visible {
            opacity: 1;
            transform: translate(0) scale(1);
        }
        /* 3D card tilt styling */
        .card-tilt {
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            transform-style: preserve-3d;
            perspective: 1000px;
        }
        /* Hover links animated line */
        .hover-underline {
            position: relative;
        }
        .hover-underline::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 2px;
            bottom: -4px;
            left: 0;
            background-color: #2563eb;
            transform-origin: bottom right;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-underline:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
        }
        /* Expandable Subsystem Drawer heights */
        .subsystem-drawer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* FAQ Accordion height animation */
        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .accordion-active .accordion-content {
            max-height: 300px;
        }
        /* Button ripple container helper */
        .ripple-btn {
            position: relative;
            overflow: hidden;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased overflow-x-hidden opacity-0 transition-opacity duration-700" onload="document.body.classList.remove('opacity-0')">
    <!-- Official Top Bar -->
    <header class="w-full relative z-50">
        <div class="bg-gov-900 text-slate-400 text-[11px] py-2 px-4 border-b border-gov-800 select-none">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="flex space-x-0.5 h-3">
                        <div class="w-1 bg-blue-600"></div>
                        <div class="w-1 bg-yellow-500"></div>
                        <div class="w-1 bg-red-600"></div>
                    </div>
                    <span class="font-medium tracking-wide">Official Smart City Network — Department of Sanitation & Health Services</span>
                </div>
                <div class="hidden lg:flex items-center space-x-6">
                    <span class="font-semibold text-slate-300">Audit Status: Compliant</span>
                    <span class="text-slate-700">|</span>
                    <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Text Size:</span>
                        <button onclick="changeFontSize(-1)" class="hover:text-white px-1">A-</button>
                        <button onclick="changeFontSize(0)" class="hover:text-white px-1 font-bold">A</button>
                        <button onclick="changeFontSize(1)" class="hover:text-white px-1">A+</button>
                    </div>
                </div>
            </div>
        </div>
        <nav class="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 border-b border-slate-100 transition-all duration-300">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="flex justify-between items-center h-20">
                    <div class="flex items-center space-x-3">
                        <!-- Custom Government Logo Crest -->
                        <svg class="w-12 h-12 text-blue-700 seal-glow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="4" fill="#f8fafc"/>
                            <circle cx="50" cy="50" r="38" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
                            <path d="M50 25 L65 40 L65 65 L50 80 L35 65 L35 40 Z" fill="#1e40af" opacity="0.12"/>
                            <path d="M50 22 L67 37 L67 63 L50 78 L33 63 L33 37 Z" stroke="#1e40af" stroke-width="1.5"/>
                            <path d="M50 35 V65 M35 50 H65" stroke="#059669" stroke-width="5" stroke-linecap="round"/>
                        </svg>
                        <div>
                            <div class="flex items-center space-x-1.5">
                                <span class="text-lg font-bold tracking-tight text-gov-900">MUNICIPAL HEALTH</span>
                                <span class="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-extrabold uppercase">District</span>
                            </div>
                            <span class="text-[11px] text-slate-500 block -mt-0.5">Health & Sanitation Management System</span>
                        </div>
                    </div>
                    <!-- Navigation Links -->
                    <div class="hidden lg:flex items-center space-x-8 text-sm font-semibold">
                        <a href="#subsystems" class="text-gov-800 hover:text-blue-600 transition-colors hover-underline">Subsystems</a>
                        <a href="#dashboard" class="text-gov-800 hover:text-blue-600 transition-colors hover-underline">Surveillance</a>
                        <a href="#leadership" class="text-gov-800 hover:text-blue-600 transition-colors hover-underline">Leadership</a>
                        <a href="#map" class="text-gov-800 hover:text-blue-600 transition-colors hover-underline">District Map</a>
                        <a href="#emergency" class="text-rose-600 hover:text-rose-700 transition-colors flex items-center hover-underline">
                            <span class="w-1.5 h-1.5 rounded-full bg-rose-600 alert-pulse mr-1.5"></span>
                            Emergency Response
                        </a>
                        <a href="#timeline" class="text-gov-800 hover:text-blue-600 transition-colors hover-underline">Programs</a>
                    </div>
                    <!-- Actions -->
                    <div class="flex items-center space-x-4">
                        <a href="views/login.php" class="text-gov-900 hover:text-blue-600 font-bold text-sm hover-underline">Portal Sign In</a>
                        <a href="views/login.php" class="ripple-btn bg-gov-900 text-white px-5 py-2.5 rounded-lg hover:bg-gov-800 transition-all font-bold text-sm shadow-sm hover:shadow active:scale-98">
                            Access Portal
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </header>
    <main>
        <!-- Hero Section with JS Canvas Particles -->
        <section id="hero" class="relative min-h-[calc(100vh-120px)] bg-slate-900 text-white flex items-center justify-center py-20 px-4 sm:px-6 overflow-hidden select-none">
            <!-- Dynamic Background Mesh and Canvas -->
            <div class="absolute inset-0 bg-gradient-to-tr from-gov-950 via-slate-950 to-gov-900 mesh-gradient z-0"></div>
            <canvas id="particle-canvas" class="absolute inset-0 z-10 pointer-events-none opacity-40"></canvas>
            
            <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-20 w-full">
                <!-- Text contents -->
                <div class="lg:col-span-7 text-center lg:text-left">
                    <div class="inline-flex items-center space-x-2 bg-blue-950/50 border border-blue-800/40 px-4 py-1.5 rounded-full mb-6">
                        <span class="w-2 h-2 bg-emerald-500 rounded-full alert-pulse"></span>
                        <span class="text-emerald-400 text-xs font-bold uppercase tracking-wider">Secure Gov Network</span>
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Building a Healthier, Safer, and More Resilient Community <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Through Digital Public Services</span>
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 font-light">
                        Connecting residents and health administrators to support sanitary licensing audits, localized disease monitoring, and integrated immunization records.
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <a href="views/login.php" class="ripple-btn bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all text-base text-center shadow-md hover:shadow-lg flex items-center justify-center">
                            Request Public Services
                            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                        <a href="#subsystems" class="border border-slate-700 text-slate-300 px-8 py-3.5 rounded-xl font-bold hover:bg-white/5 hover:border-slate-500 hover:text-white transition-all text-base text-center">
                            Explore Subsystems Overview
                        </a>
                    </div>
                </div>
                <!-- Stats Cards Group (Hero Right Side) -->
                <div class="lg:col-span-5 grid grid-cols-2 gap-4 relative">
                    <!-- Parallax icons / floating elements -->
                    <div class="absolute -top-12 -left-6 z-10 animate-float-1 hidden md:block">
                        <div class="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-xl backdrop-blur-sm">
                            <span class="text-lg">🏥</span>
                            <span class="text-xs font-bold text-white">RHU Operations</span>
                        </div>
                    </div>
                    <div class="absolute -bottom-12 -right-6 z-10 animate-float-2 hidden md:block">
                        <div class="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-xl backdrop-blur-sm">
                            <span class="text-lg">🚰</span>
                            <span class="text-xs font-bold text-white">Water Auditing</span>
                        </div>
                    </div>
                    <!-- Main Stat Tiles -->
                    <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col justify-between hover:border-blue-500/20 transition-all select-none">
                        <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl mb-4 font-bold animate-float">👤</div>
                        <div>
                            <span class="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white block">15,000+</span>
                            <span class="text-[10px] text-slate-400 uppercase tracking-widest block mt-1">Citizens Served</span>
                        </div>
                    </div>
                    <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col justify-between hover:border-emerald-500/20 transition-all select-none">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-4 font-bold animate-float">💉</div>
                        <div>
                            <span class="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white block">8,500+</span>
                            <span class="text-[10px] text-slate-400 uppercase tracking-widest block mt-1">Immunizations Tracked</span>
                        </div>
                    </div>
                    <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col justify-between hover:border-teal-500/20 transition-all select-none">
                        <div class="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-xl mb-4 font-bold animate-float">🔍</div>
                        <div>
                            <span class="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white block">2,300+</span>
                            <span class="text-[10px] text-slate-400 uppercase tracking-widest block mt-1">Permits Processed</span>
                        </div>
                    </div>
                    <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col justify-between hover:border-blue-500/20 transition-all select-none">
                        <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl mb-4 font-bold animate-float">🏥</div>
                        <div>
                            <span class="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white block">48</span>
                            <span class="text-[10px] text-slate-400 uppercase tracking-widest block mt-1">Health Programs</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Wave divider at bottom -->
            <div class="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
                <svg class="relative block w-full h-[60px] text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,70.05,25.24,121.39,39.57c60.33,16.89,139.71,27.78,200,16.87Z"></path>
                </svg>
            </div>
        </section>
        <!-- Trusted By Section -->
        <section class="bg-white border-b border-slate-100 py-10 px-4 sm:px-6 reveal-scale">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <span class="text-xs uppercase tracking-widest text-slate-400 font-bold">Authorized Entities:</span>
                <div class="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-slate-500 font-bold text-sm tracking-tight">
                    <span class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span> Municipal Health Office</span>
                    <span class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-2"></span> Sanitation Department</span>
                    <span class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-teal-600 mr-2"></span> Rural Health Units</span>
                    <span class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2"></span> Community Volunteers</span>
                </div>
            </div>
        </section>
        <!-- Subsystem Information Architecture Refactored Section -->
        <section id="subsystems" class="py-24 px-4 sm:px-6 max-w-7xl mx-auto reveal-up">
            <div class="text-center max-w-3xl mx-auto mb-12">
                <span class="text-blue-600 font-bold uppercase tracking-widest text-xs">Information Architecture</span>
                <h2 class="text-3xl font-extrabold text-gov-900 mt-2">Government Subsystems & Operational Modules</h2>
                <div class="w-12 h-1 bg-emerald-600 mx-auto mt-4 rounded-full"></div>
                <p class="text-slate-500 mt-4 text-sm max-w-xl mx-auto">
                    The platform coordinates 1 main system, 5 core subsystems, and 30+ operational modules designed for transparent municipal health management.
                </p>
            </div>
            <!-- Hierarchy Diagram Node Visualization -->
            <div class="bg-slate-100/70 border border-slate-200 rounded-3xl p-6 md:p-8 mb-16 shadow-inner max-w-4xl mx-auto overflow-x-auto select-none">
                <span class="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-6 text-center">System Hierarchy Architecture Diagram</span>
                
                <div class="min-w-[640px] flex flex-col items-center font-semibold text-xs text-gov-900 text-center">
                    <!-- Root node -->
                    <div class="bg-gov-900 text-white px-5 py-3 rounded-xl shadow-md border border-gov-800">
                        <span class="block text-emerald-400 text-[10px] uppercase font-extrabold tracking-wider">Main Information System</span>
                        Health & Sanitation Management System
                    </div>
                    
                    <!-- Vertical Connector -->
                    <div class="w-0.5 h-8 bg-slate-300"></div>
                    
                    <!-- Subsystems Row -->
                    <div class="grid grid-cols-5 gap-4 w-full relative">
                        <!-- Horizontal connector track overlay -->
                        <div class="absolute top-0 left-[10%] right-[10%] h-0.5 bg-slate-300 z-0"></div>
                        
                        <!-- Col 1 -->
                        <div class="flex flex-col items-center relative z-10">
                            <div class="w-0.5 h-4 bg-slate-300"></div>
                            <div class="bg-white border border-slate-200 p-3 rounded-lg shadow-sm w-full">
                                <span class="block text-blue-600 text-[9px] uppercase font-extrabold">Subsystem 1</span>
                                Health Services
                            </div>
                        </div>
                        <!-- Col 2 -->
                        <div class="flex flex-col items-center relative z-10">
                            <div class="w-0.5 h-4 bg-slate-300"></div>
                            <div class="bg-white border border-slate-200 p-3 rounded-lg shadow-sm w-full">
                                <span class="block text-emerald-600 text-[9px] uppercase font-extrabold">Subsystem 2</span>
                                Environmental Sanitation
                            </div>
                        </div>
                        <!-- Col 3 -->
                        <div class="flex flex-col items-center relative z-10">
                            <div class="w-0.5 h-4 bg-slate-300"></div>
                            <div class="bg-white border border-slate-200 p-3 rounded-lg shadow-sm w-full">
                                <span class="block text-teal-600 text-[9px] uppercase font-extrabold">Subsystem 3</span>
                                Immunization & Nutrition
                            </div>
                        </div>
                        <!-- Col 4 -->
                        <div class="flex flex-col items-center relative z-10">
                            <div class="w-0.5 h-4 bg-slate-300"></div>
                            <div class="bg-white border border-slate-200 p-3 rounded-lg shadow-sm w-full">
                                <span class="block text-blue-600 text-[9px] uppercase font-extrabold">Subsystem 4</span>
                                Wastewater & Septic
                            </div>
                        </div>
                        <!-- Col 5 -->
                        <div class="flex flex-col items-center relative z-10">
                            <div class="w-0.5 h-4 bg-slate-300"></div>
                            <div class="bg-white border border-slate-200 p-3 rounded-lg shadow-sm w-full">
                                <span class="block text-rose-600 text-[9px] uppercase font-extrabold">Subsystem 5</span>
                                Surveillance & Analytics
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Subsystem Cards Grid -->
            <div class="space-y-6 max-w-5xl mx-auto">
                <!-- Subsystem 1: Health Services -->
                <div class="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <button onclick="toggleSubsystemDrawer(this)" class="w-full flex flex-col md:flex-row md:items-center justify-between p-8 text-left focus:outline-none transition-colors hover:bg-slate-50/50">
                        <div class="flex items-center space-x-5">
                            <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl font-bold flex-shrink-0">🏥</div>
                            <div>
                                <h3 class="text-xl font-bold text-gov-900">Health Services Subsystem</h3>
                                <p class="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                                    Coordinates primary outpatients clinical registries, secure medical record-keeping, and diagnostic scheduling databases.
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 md:mt-0 flex items-center space-x-4">
                            <span class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold font-mono">6 Operational Modules</span>
                            <!-- Arrow Indicator -->
                            <svg class="w-5 h-5 text-slate-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </button>
                    <!-- Expandable Drawer -->
                    <div class="subsystem-drawer border-t border-slate-100 bg-slate-50/40">
                        <div class="p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-600 font-extrabold uppercase font-mono block">Module 1.1</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Patient Registration</h4>
                                <p class="text-xs text-slate-500 mt-1">Electronic citizen intake profiles.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-600 font-extrabold uppercase font-mono block">Module 1.2</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Medical Records</h4>
                                <p class="text-xs text-slate-500 mt-1">Secure clinical chart archives.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-600 font-extrabold uppercase font-mono block">Module 1.3</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Appointment Scheduling</h4>
                                <p class="text-xs text-slate-500 mt-1">Outpatient clinical queues management.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-600 font-extrabold uppercase font-mono block">Module 1.4</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Consultations</h4>
                                <p class="text-xs text-slate-500 mt-1">Diagnostics intake evaluations logs.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-600 font-extrabold uppercase font-mono block">Module 1.5</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Maternal Care</h4>
                                <p class="text-xs text-slate-500 mt-1">Pregnancy analytics tracking indices.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-600 font-extrabold uppercase font-mono block">Module 1.6</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Senior Citizen Monitoring</h4>
                                <p class="text-xs text-slate-500 mt-1">Geriatric wellness tracking schedules.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Subsystem 2: Environmental Health & Sanitation -->
                <div class="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <button onclick="toggleSubsystemDrawer(this)" class="w-full flex flex-col md:flex-row md:items-center justify-between p-8 text-left focus:outline-none transition-colors hover:bg-slate-50/50">
                        <div class="flex items-center space-x-5">
                            <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl font-bold flex-shrink-0">🔍</div>
                            <div>
                                <h3 class="text-xl font-bold text-gov-900">Environmental Health & Sanitation Subsystem</h3>
                                <p class="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                                    Enforces municipal sanitation codes, issues digital commercial permits, and tracks sanitary violation audit histories.
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 md:mt-0 flex items-center space-x-4">
                            <span class="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold font-mono">6 Operational Modules</span>
                            <svg class="w-5 h-5 text-slate-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </button>
                    <div class="subsystem-drawer border-t border-slate-100 bg-slate-50/40">
                        <div class="p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-emerald-600 font-extrabold uppercase font-mono block">Module 2.1</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Permit Application</h4>
                                <p class="text-xs text-slate-500 mt-1">Digital filing for establishment clearances.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-emerald-600 font-extrabold uppercase font-mono block">Module 2.2</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Permit Renewal</h4>
                                <p class="text-xs text-slate-500 mt-1">Annual clearance verification cycles.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-emerald-600 font-extrabold uppercase font-mono block">Module 2.3</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Establishment Inspection</h4>
                                <p class="text-xs text-slate-500 mt-1">Audit logs from sanitary officers.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-emerald-600 font-extrabold uppercase font-mono block">Module 2.4</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Compliance Monitoring</h4>
                                <p class="text-xs text-slate-500 mt-1">Tracking real-time corrective actions.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-emerald-600 font-extrabold uppercase font-mono block">Module 2.5</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Violation Tracking</h4>
                                <p class="text-xs text-slate-500 mt-1">Archived health violation databases.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-emerald-600 font-extrabold uppercase font-mono block">Module 2.6</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Inspection Scheduling</h4>
                                <p class="text-xs text-slate-500 mt-1">Dispatch calendars for sanitary visits.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Subsystem 3: Immunization & Nutrition Management -->
                <div class="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <button onclick="toggleSubsystemDrawer(this)" class="w-full flex flex-col md:flex-row md:items-center justify-between p-8 text-left focus:outline-none transition-colors hover:bg-slate-50/50">
                        <div class="flex items-center space-x-5">
                            <div class="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-3xl font-bold flex-shrink-0">💉</div>
                            <div>
                                <h3 class="text-xl font-bold text-gov-900">Immunization & Nutrition Management Subsystem</h3>
                                <p class="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                                    Coordinates child development index logging, community vaccination registers, and automated booster advisory schedules.
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 md:mt-0 flex items-center space-x-4">
                            <span class="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-bold font-mono">6 Operational Modules</span>
                            <svg class="w-5 h-5 text-slate-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </button>
                    <div class="subsystem-drawer border-t border-slate-100 bg-slate-50/40">
                        <div class="p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-teal-600 font-extrabold uppercase font-mono block">Module 3.1</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Vaccination Registry</h4>
                                <p class="text-xs text-slate-500 mt-1">Complete municipal immunization logs.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-teal-600 font-extrabold uppercase font-mono block">Module 3.2</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Immunization Scheduling</h4>
                                <p class="text-xs text-slate-500 mt-1">Scheduled dose and booster planning.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-teal-600 font-extrabold uppercase font-mono block">Module 3.3</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Nutrition Assessment</h4>
                                <p class="text-xs text-slate-500 mt-1">Malnutrition risk indexes tracking.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-teal-600 font-extrabold uppercase font-mono block">Module 3.4</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Child Growth Monitoring</h4>
                                <p class="text-xs text-slate-500 mt-1">Growth charts and height/weight trackers.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-teal-600 font-extrabold uppercase font-mono block">Module 3.5</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Supplement Distribution</h4>
                                <p class="text-xs text-slate-500 mt-1">Stock and allocation registers.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-teal-600 font-extrabold uppercase font-mono block">Module 3.6</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Reminder Notifications</h4>
                                <p class="text-xs text-slate-500 mt-1">Automated SMS/Email vaccine alert cycles.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Subsystem 4: Wastewater & Septic Management -->
                <div class="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <button onclick="toggleSubsystemDrawer(this)" class="w-full flex flex-col md:flex-row md:items-center justify-between p-8 text-left focus:outline-none transition-colors hover:bg-slate-50/50">
                        <div class="flex items-center space-x-5">
                            <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-3xl font-bold flex-shrink-0">🚰</div>
                            <div>
                                <h3 class="text-xl font-bold text-gov-900">Wastewater & Septic Management Subsystem</h3>
                                <p class="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                                    Coordinates municipal drainage operations, desludging dispatch calendars, and sewage environmental quality controls.
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 md:mt-0 flex items-center space-x-4">
                            <span class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold font-mono">6 Operational Modules</span>
                            <svg class="w-5 h-5 text-slate-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </button>
                    <div class="subsystem-drawer border-t border-slate-100 bg-slate-50/40">
                        <div class="p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-700 font-extrabold uppercase font-mono block">Module 4.1</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Septic Registry</h4>
                                <p class="text-xs text-slate-500 mt-1">Directory of municipal septic structures.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-700 font-extrabold uppercase font-mono block">Module 4.2</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Desludging Scheduling</h4>
                                <p class="text-xs text-slate-500 mt-1">Booking calendars for municipal trucks.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-700 font-extrabold uppercase font-mono block">Module 4.3</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Wastewater Monitoring</h4>
                                <p class="text-xs text-slate-500 mt-1">Water quality chemical analytics.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-700 font-extrabold uppercase font-mono block">Module 4.4</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Maintenance Requests</h4>
                                <p class="text-xs text-slate-500 mt-1">Filing physical infrastructure repairs.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-700 font-extrabold uppercase font-mono block">Module 4.5</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Compliance Tracking</h4>
                                <p class="text-xs text-slate-500 mt-1">Verifying sewage standards codes.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-blue-700 font-extrabold uppercase font-mono block">Module 4.6</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Service Management</h4>
                                <p class="text-xs text-slate-500 mt-1">Operator dispatch and billing logs.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Subsystem 5: Health Surveillance & Analytics -->
                <div class="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <button onclick="toggleSubsystemDrawer(this)" class="w-full flex flex-col md:flex-row md:items-center justify-between p-8 text-left focus:outline-none transition-colors hover:bg-slate-50/50">
                        <div class="flex items-center space-x-5">
                            <div class="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-3xl font-bold flex-shrink-0">📈</div>
                            <div>
                                <h3 class="text-xl font-bold text-gov-900">Health Surveillance & Analytics Subsystem</h3>
                                <p class="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                                    Aggregates public health trends, isolates outbreak hotspots, and distributes urgent community advisories automatically.
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 md:mt-0 flex items-center space-x-4">
                            <span class="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold font-mono">6 Operational Modules</span>
                            <svg class="w-5 h-5 text-slate-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </button>
                    <div class="subsystem-drawer border-t border-slate-100 bg-slate-50/40">
                        <div class="p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-rose-600 font-extrabold uppercase font-mono block">Module 5.1</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Disease Surveillance</h4>
                                <p class="text-xs text-slate-500 mt-1">Active virus tracking and metrics registry.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-rose-600 font-extrabold uppercase font-mono block">Module 5.2</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Outbreak Detection</h4>
                                <p class="text-xs text-slate-500 mt-1">Automated algorithmic alarm triggers.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-rose-600 font-extrabold uppercase font-mono block">Module 5.3</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Case Monitoring</h4>
                                <p class="text-xs text-slate-500 mt-1">Active case quarantine/status logs.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-rose-600 font-extrabold uppercase font-mono block">Module 5.4</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Health Analytics</h4>
                                <p class="text-xs text-slate-500 mt-1">Reporting trends and epidemiology curves.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-rose-600 font-extrabold uppercase font-mono block">Module 5.5</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Alert Management</h4>
                                <p class="text-xs text-slate-500 mt-1">Dispatching advisory channels alerts.</p>
                            </div>
                            <div class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <span class="text-[10px] text-rose-600 font-extrabold uppercase font-mono block">Module 5.6</span>
                                <h4 class="font-bold text-gov-900 text-sm mt-1">Community Reports</h4>
                                <p class="text-xs text-slate-500 mt-1">Citizen advisory logs and reporting dashboards.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Public Health Dashboard Preview -->
        <section id="dashboard" class="py-24 px-4 sm:px-6 bg-slate-100 border-y border-slate-200/60 reveal-scale">
            <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
                <!-- Left: Info -->
                <div class="lg:col-span-5">
                    <span class="text-emerald-600 font-bold uppercase tracking-widest text-xs">Real-Time Data Integration</span>
                    <h2 class="text-3xl font-extrabold text-gov-900 mt-2">Public Health Surveillance</h2>
                    <p class="text-slate-600 mt-4 text-sm leading-relaxed">
                        Enabling public accountability through live updates. Statistics reflect data gathered across all rural healthcare units.
                    </p>
                    
                    <div class="mt-8 space-y-4">
                        <div class="flex items-start space-x-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm hover:translate-y-[-2px] transition-transform">
                            <span class="text-emerald-600 text-lg">🛡️</span>
                            <div>
                                <h4 class="font-bold text-gov-900 text-sm">HIPAA Compliant Records</h4>
                                <p class="text-xs text-slate-500 mt-0.5">Municipal patient records are secure and fully encrypted.</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm hover:translate-y-[-2px] transition-transform">
                            <span class="text-blue-600 text-lg">📈</span>
                            <div>
                                <h4 class="font-bold text-gov-900 text-sm">Automated Trend Analyses</h4>
                                <p class="text-xs text-slate-500 mt-0.5">Statistical metrics update automatically from rural health centers.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Right: Dashboard Preview Mockup -->
                <div class="lg:col-span-7">
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden">
                        <div class="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                            <span class="text-xs font-bold text-gov-900 uppercase tracking-widest flex items-center">
                                <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 alert-pulse"></span>
                                Live System Metrics
                            </span>
                            <span class="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-bold font-mono">CODE: M-DASH-2026</span>
                        </div>
                        <!-- Skeleton State with Shimmer Animation -->
                        <div id="skeleton-loader" class="space-y-6">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="h-24 bg-slate-100 rounded-xl shimmer-active"></div>
                                <div class="h-24 bg-slate-100 rounded-xl shimmer-active"></div>
                            </div>
                            <div class="h-40 bg-slate-100 rounded-xl shimmer-active"></div>
                        </div>
                        <!-- Active State (revealed by JS) -->
                        <div id="active-dashboard" class="hidden space-y-6">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                                    <div>
                                        <span class="text-xs text-slate-500 block">Active Health Cases</span>
                                        <span class="text-2xl font-bold text-gov-900 block mt-1" data-count="32">0</span>
                                    </div>
                                    <span class="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-bold font-mono">Stable</span>
                                </div>
                                <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                                    <div>
                                        <span class="text-xs text-slate-500 block">Sanitation Compliance</span>
                                        <span class="text-2xl font-bold text-gov-900 block mt-1">96.4%</span>
                                    </div>
                                    <span class="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold font-mono">Excellent</span>
                                </div>
                            </div>
                            <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                                <div class="flex justify-between items-center mb-4">
                                    <span class="text-xs text-gov-900 font-bold uppercase tracking-wider">Vaccination Coverage Rate</span>
                                    <span class="text-xs text-slate-500 font-semibold">Goal: 95%</span>
                                </div>
                                <div class="flex items-center space-x-6">
                                    <!-- Radial Circular SVG Progress -->
                                    <div class="relative w-20 h-20 flex-shrink-0">
                                        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <path class="text-slate-200" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                            <path class="text-emerald-600 stroke-dashoffset-anim" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" data-dash="88"/>
                                        </svg>
                                        <span class="absolute inset-0 flex items-center justify-center text-sm font-bold text-gov-900 font-mono">88%</span>
                                    </div>
                                    <div class="flex-1 space-y-2">
                                        <div class="flex justify-between text-xs font-semibold text-slate-600">
                                            <span>Polio Vaccine Coverage</span>
                                            <span>92%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div class="bg-blue-600 h-full transition-all duration-1000 w-0" data-width="92%"></div>
                                        </div>
                                        <div class="flex justify-between text-xs font-semibold text-slate-600">
                                            <span>Measles MMR Coverage</span>
                                            <span>84%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div class="bg-blue-600 h-full transition-all duration-1000 w-0" data-width="84%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Municipality Leadership Section -->
        <section id="leadership" class="py-24 px-4 sm:px-6 max-w-7xl mx-auto reveal-up">
            <div class="grid lg:grid-cols-12 gap-12 items-center">
                <!-- Profile card with gradient border -->
                <div class="lg:col-span-4 bg-gov-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-md">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-xl animate-pulse"></div>
                    
                    <div class="w-20 h-20 bg-slate-800 rounded-full border-2 border-emerald-500 flex items-center justify-center text-4xl mb-6 shadow-md animate-float-1">👨‍⚕️</div>
                    <h3 class="text-xl font-bold tracking-tight">Municipal Health Office</h3>
                    <span class="text-xs text-emerald-400 font-medium block mt-1 uppercase tracking-wider">Health Leadership Team</span>
                    
                    <div class="mt-8 pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-4">
                        <p class="leading-relaxed">"Delivering administrative equity to ensure safe water, complete vaccinations, and rapid health compliance audits for all."</p>
                        <span class="font-bold text-white block mt-2">— Dr. Aaron Reyes, Chief Health Officer</span>
                    </div>
                </div>
                <!-- Mission Text -->
                <div class="lg:col-span-8 space-y-8">
                    <div>
                        <span class="text-blue-600 font-bold uppercase tracking-widest text-xs">Mission & Focus</span>
                        <h2 class="text-3xl font-extrabold text-gov-900 mt-2">Public Health Mission & Community Wellness Goals</h2>
                        <div class="w-12 h-1 bg-emerald-600 mt-4 rounded-full"></div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 class="font-bold text-gov-900 flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span> Public Health Mission</h4>
                            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                                To establish digital health protocols that safeguard the local population, coordinate disease prevention strategies, and enforce sanitation laws fairly.
                            </p>
                        </div>
                        <div>
                            <h4 class="font-bold text-gov-900 flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-2"></span> Wellness Goals</h4>
                            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                                To maintain zero outbreaks of water-borne illnesses, scale health-center integration to all outer barangays, and archive audit compliance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Community Impact Map -->
        <section id="map" class="py-24 px-4 sm:px-6 bg-white border-t border-slate-100 reveal-scale">
            <div class="max-w-7xl mx-auto">
                <div class="text-center max-w-3xl mx-auto mb-16">
                    <span class="text-blue-600 font-bold uppercase tracking-widest text-xs">Geographic Monitoring</span>
                    <h2 class="text-3xl font-extrabold text-gov-900 mt-2">Community Impact Map</h2>
                    <div class="w-12 h-1 bg-emerald-600 mx-auto mt-4 rounded-full"></div>
                </div>
                <div class="grid lg:grid-cols-12 gap-12 items-center">
                    <!-- SVG Interactive Map Placeholders -->
                    <div class="lg:col-span-7 flex justify-center">
                        <div class="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <span class="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-4">Click districts to query metrics:</span>
                            <!-- SVG District Map -->
                            <svg viewBox="0 0 400 300" class="w-full h-auto">
                                <!-- District A -->
                                <path id="district-a" d="M50 50 L180 30 L220 120 L80 150 Z" class="fill-blue-500/10 stroke-blue-600 hover:fill-blue-500/25 cursor-pointer transition-colors" stroke-width="2" onclick="selectDistrict('District A (North)', '8,400 served', '98% Coverage', 'Active Monitoring')"/>
                                <text x="100" y="90" class="fill-blue-800 text-xs font-bold pointer-events-none">District A</text>
                                
                                <!-- District B -->
                                <path id="district-b" d="M180 30 L350 50 L320 180 L220 120 Z" class="fill-emerald-500/10 stroke-emerald-600 hover:fill-emerald-500/25 cursor-pointer transition-colors" stroke-width="2" onclick="selectDistrict('District B (East)', '4,200 served', '94% Coverage', 'Operational')"/>
                                <text x="250" y="100" class="fill-emerald-800 text-xs font-bold pointer-events-none">District B</text>
                                <!-- District C -->
                                <path id="district-c" d="M80 150 L220 120 L280 250 L100 270 Z" class="fill-teal-500/10 stroke-teal-600 hover:fill-teal-500/25 cursor-pointer transition-colors" stroke-width="2" onclick="selectDistrict('District C (Central)', '12,100 served', '88% Coverage', 'Active Audit')"/>
                                <text x="160" y="200" class="fill-teal-800 text-xs font-bold pointer-events-none">District C</text>
                                <!-- District D -->
                                <path id="district-d" d="M220 120 L320 180 L350 280 L280 250 Z" class="fill-slate-500/15 stroke-slate-600 hover:fill-slate-500/25 cursor-pointer transition-colors" stroke-width="2" onclick="selectDistrict('District D (South)', '2,900 served', '91% Coverage', 'Operational')"/>
                                <text x="280" y="220" class="fill-slate-800 text-xs font-bold pointer-events-none">District D</text>
                            </svg>
                        </div>
                    </div>
                    <!-- Map Details Sidecard -->
                    <div class="lg:col-span-5">
                        <div class="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                            <h4 id="district-name" class="text-xl font-bold text-gov-900">District C (Central)</h4>
                            <span class="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold uppercase px-2 py-0.5 rounded block w-max mt-1 tracking-wider" id="district-status">Active Audit</span>
                            
                            <div class="mt-6 space-y-4 text-sm">
                                <div class="flex justify-between py-2 border-b border-slate-200">
                                    <span class="text-slate-500">Barangays Served</span>
                                    <span id="district-served" class="font-bold text-gov-900">12,100 served</span>
                                </div>
                                <div class="flex justify-between py-2 border-b border-slate-200">
                                    <span class="text-slate-500">Health Coverage</span>
                                    <span id="district-coverage" class="font-bold text-gov-900">88% Coverage</span>
                                </div>
                                <div class="flex justify-between py-2 border-b border-slate-200">
                                    <span class="text-slate-500">Sanitation Auditing</span>
                                    <span class="font-bold text-slate-800">Bi-weekly</span>
                                </div>
                                <div class="flex justify-between py-2">
                                    <span class="text-slate-500">Wastewater Check</span>
                                    <span class="font-bold text-emerald-600">Compliant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Emergency Response Command -->
        <section id="emergency" class="py-24 px-4 sm:px-6 max-w-7xl mx-auto reveal-up">
            <div class="bg-rose-50 border border-rose-200/80 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm">
                <!-- Red blur overlay -->
                <div class="absolute -top-12 -right-12 w-32 h-32 bg-rose-600/10 rounded-full blur-2xl"></div>
                
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-rose-200/60">
                    <div>
                        <span class="text-rose-600 font-bold uppercase tracking-widest text-xs flex items-center">
                            <span class="w-2 h-2 rounded-full bg-rose-600 alert-pulse mr-2"></span>
                            Emergency Response Command
                        </span>
                        <h3 class="text-2xl font-extrabold text-gov-900 mt-2">Active Surveillance & Disease Alert Controls</h3>
                    </div>
                    <a href="views/login.php" class="ripple-btn mt-4 md:mt-0 bg-rose-700 hover:bg-rose-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow transition-colors">
                        File Emergency Report
                    </a>
                </div>
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white p-5 rounded-2xl border border-rose-100/80 flex flex-col justify-between">
                        <div>
                            <span class="text-xl">⚠️</span>
                            <h4 class="font-bold text-gov-900 text-sm mt-3">Outbreak Detection</h4>
                            <p class="text-xs text-slate-500 mt-1">Automatic alert notifications triggered when cases spike in monitored areas.</p>
                        </div>
                        <span class="text-emerald-600 text-xs font-bold mt-4 flex items-center">Status: Nominal</span>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-rose-100/80 flex flex-col justify-between">
                        <div>
                            <span class="text-xl">📢</span>
                            <h4 class="font-bold text-gov-900 text-sm mt-3">Health Alerts Board</h4>
                            <p class="text-xs text-slate-500 mt-1">Distribute urgent sanitary bulletins and vaccine schedules directly to community groups.</p>
                        </div>
                        <span class="text-slate-400 text-xs font-bold mt-4">2 Active Alerts</span>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-rose-100/80 flex flex-col justify-between">
                        <div>
                            <span class="text-xl">📝</span>
                            <h4 class="font-bold text-gov-900 text-sm mt-3">Emergency Reporting</h4>
                            <p class="text-xs text-slate-500 mt-1">Allows citizens to report illegal wastewater dumps or sanitary hazards.</p>
                        </div>
                        <span class="text-rose-600 text-xs font-bold mt-4 flex items-center">Report Online</span>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-rose-100/80 flex flex-col justify-between">
                        <div>
                            <span class="text-xl">📊</span>
                            <h4 class="font-bold text-gov-900 text-sm mt-3">Epidemic Surveillance</h4>
                            <p class="text-xs text-slate-500 mt-1">Analyzed epidemiological curve logs shared directly with municipal boards.</p>
                        </div>
                        <span class="text-blue-600 text-xs font-bold mt-4 flex items-center">View Stats</span>
                    </div>
                </div>
            </div>
        </section>
        <!-- Health Programs Timeline with Scroll Filling Track -->
        <section id="timeline" class="py-24 px-4 sm:px-6 bg-slate-100 border-t border-slate-200/60 reveal-scale">
            <div class="max-w-7xl mx-auto">
                <div class="text-center max-w-3xl mx-auto mb-16">
                    <span class="text-blue-600 font-bold uppercase tracking-widest text-xs">Roadmap</span>
                    <h2 class="text-3xl font-extrabold text-gov-900 mt-2">Health Programs Timeline</h2>
                    <div class="w-12 h-1 bg-emerald-600 mx-auto mt-4 rounded-full"></div>
                </div>
                <div class="relative max-w-2xl mx-auto">
                    <!-- Central Timeline Line (Background Track) -->
                    <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 transform -translate-x-1/2 z-0"></div>
                    <!-- Scroll filling track -->
                    <div id="timeline-track-fill" class="absolute left-1/2 top-0 w-0.5 bg-blue-600 transform -translate-x-1/2 z-0 origin-top h-0 transition-all duration-300"></div>
                    <!-- Year 2026 -->
                    <div class="timeline-step relative z-10 grid grid-cols-12 gap-4 items-center mb-12 opacity-50 transition-opacity duration-500">
                        <div class="col-span-5 text-right hidden sm:block">
                            <span class="text-2xl font-extrabold text-gov-900 font-mono">2026</span>
                            <span class="text-xs text-emerald-600 font-bold block">Phase 1 Integration</span>
                        </div>
                        <div class="col-span-2 flex justify-center">
                            <div class="w-8 h-8 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow"></div>
                        </div>
                        <div class="col-span-10 sm:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <span class="text-xs text-slate-400 font-bold sm:hidden">2026 - Phase 1</span>
                            <h4 class="font-bold text-gov-900 text-base mt-1">Vaccination Campaign</h4>
                            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                                Complete digitalization of child health records and vaccine supply inventories across all rural health centers.
                            </p>
                        </div>
                    </div>
                    <!-- Year 2027 -->
                    <div class="timeline-step relative z-10 grid grid-cols-12 gap-4 items-center mb-12 opacity-50 transition-opacity duration-500">
                        <div class="col-span-10 sm:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left sm:text-right">
                            <span class="text-xs text-slate-400 font-bold sm:hidden">2027 - Phase 2</span>
                            <h4 class="font-bold text-gov-900 text-base mt-1">Sanitation Expansion</h4>
                            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                                Automated inspections tracking and sewage dispatch systems covering 100% of municipal business permits.
                            </p>
                        </div>
                        <div class="col-span-2 flex justify-center">
                            <div class="w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow"></div>
                        </div>
                        <div class="col-span-5 text-left hidden sm:block">
                            <span class="text-2xl font-extrabold text-gov-900 font-mono">2027</span>
                            <span class="text-xs text-emerald-600 font-bold block">Phase 2 Expansion</span>
                        </div>
                    </div>
                    <!-- Year 2028 -->
                    <div class="timeline-step relative z-10 grid grid-cols-12 gap-4 items-center opacity-50 transition-opacity duration-500">
                        <div class="col-span-5 text-right hidden sm:block">
                            <span class="text-2xl font-extrabold text-gov-900 font-mono">2028</span>
                            <span class="text-xs text-emerald-600 font-bold block">Phase 3 Objectives</span>
                        </div>
                        <div class="col-span-2 flex justify-center">
                            <div class="w-8 h-8 rounded-full bg-teal-500 border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow"></div>
                        </div>
                        <div class="col-span-10 sm:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <span class="text-xs text-slate-400 font-bold sm:hidden">2028 - Phase 3</span>
                            <h4 class="font-bold text-gov-900 text-base mt-1">Community Health Program</h4>
                            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                                Full predictive health analytics and localized smart city disease surveillance integration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Public Transparency Section -->
        <section class="py-24 px-4 sm:px-6 max-w-7xl mx-auto reveal-up">
            <div class="bg-gov-900 text-white rounded-3xl p-8 md:p-12 grid lg:grid-cols-12 gap-8 items-center">
                <div class="lg:col-span-7">
                    <span class="text-emerald-400 font-bold uppercase tracking-widest text-xs font-mono">Audit & Compliance</span>
                    <h2 class="text-3xl font-extrabold mt-2">Public Transparency Dashboard</h2>
                    <p class="text-slate-300 mt-4 text-sm leading-relaxed">
                        In accordance with community accountability goals, our audit logs and performance statistics are archived and published regularly.
                    </p>
                    
                    <div class="grid grid-cols-2 gap-6 mt-8">
                        <div>
                            <span class="text-3xl font-bold font-mono tracking-tight text-white block">100%</span>
                            <span class="text-xs text-slate-400 uppercase tracking-wider block mt-1">Reports Generated</span>
                        </div>
                        <div>
                            <span class="text-3xl font-bold font-mono tracking-tight text-white block">98.2%</span>
                            <span class="text-xs text-slate-400 uppercase tracking-wider block mt-1">Audit Compliance</span>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-5 flex justify-center lg:justify-end">
                    <!-- Compliance Badge Shield -->
                    <div class="bg-white/5 border border-white/10 p-8 rounded-2xl text-center backdrop-blur-sm max-w-xs w-full">
                        <div class="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h4 class="font-bold text-white text-base">Audit Verified</h4>
                        <p class="text-xs text-slate-400 mt-2">Verified secure databases compliance standards. System logs are secure and encrypted.</p>
                    </div>
                </div>
            </div>
        </section>
        <!-- Frequently Asked Questions -->
        <section id="faq" class="py-24 px-4 sm:px-6 max-w-4xl mx-auto reveal-up">
            <div class="text-center mb-16">
                <span class="text-blue-600 font-bold uppercase tracking-widest text-xs">FAQ</span>
                <h2 class="text-3xl font-extrabold text-gov-900 mt-2">Frequently Asked Questions</h2>
                <div class="w-12 h-1 bg-emerald-600 mx-auto mt-4 rounded-full"></div>
            </div>
            <div class="space-y-4">
                <div class="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button onclick="toggleFaq(this)" class="w-full flex justify-between items-center p-6 text-left focus:outline-none transition-colors hover:bg-slate-50">
                        <span class="font-bold text-gov-900 text-sm md:text-base">What requirements are needed for a Sanitation Permit?</span>
                        <svg class="w-5 h-5 text-slate-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="accordion-content">
                        <div class="p-6 pt-0 text-xs md:text-sm text-slate-600 border-t border-slate-100 leading-relaxed font-light">
                            Establishments must submit health cards of food handlers, recent wastewater test logs, and schedule a physical facility sanitary audit. Applications can be drafted directly in the citizen portal.
                        </div>
                    </div>
                </div>
                <div class="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button onclick="toggleFaq(this)" class="w-full flex justify-between items-center p-6 text-left focus:outline-none transition-colors hover:bg-slate-50">
                        <span class="font-bold text-gov-900 text-sm md:text-base">How does water monitoring surveillance operate?</span>
                        <svg class="w-5 h-5 text-slate-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="accordion-content">
                        <div class="p-6 pt-0 text-xs md:text-sm text-slate-600 border-t border-slate-100 leading-relaxed font-light">
                            District inspectors sample wastewater nodes weekly. Results are updated in the surveillance section, signaling any sanitation compliance updates directly to local administration.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <!-- Government Footer -->
    <footer class="bg-gov-900 text-slate-400 py-16 border-t border-gov-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                    <h3 class="text-white font-bold text-sm mb-4 uppercase tracking-wider flex items-center">
                        <span class="w-2.5 h-2.5 bg-blue-600 rounded-full mr-2"></span>
                        <span>M-HSM Public Portal</span>
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                        Connecting municipal health departments, sanitation authorities, and citizen service workflows inside an audit-logged portal.
                    </p>
                </div>
                <div>
                    <h3 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Public Subsystems</h3>
                    <ul class="space-y-2 text-xs">
                        <li><a href="views/login.php" class="hover:text-white transition-colors">Sanitation Applications</a></li>
                        <li><a href="views/login.php" class="hover:text-white transition-colors">Immunization Logs</a></li>
                        <li><a href="views/login.php" class="hover:text-white transition-colors">Sewage Drainage Booking</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Security & Trust</h3>
                    <ul class="space-y-2 text-xs text-slate-500">
                        <li>Encrypted Records DB</li>
                        <li>Audit Log Trails</li>
                        <li>Citizen Privacy Compliance</li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Resources</h3>
                    <ul class="space-y-2 text-xs">
                        <li><a href="#emergency" class="hover:text-white transition-colors">Health Advisories</a></li>
                        <li><a href="#timeline" class="hover:text-white transition-colors">Programs Timeline</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gov-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                <p class="text-slate-600 mb-4 md:mb-0">
                    &copy; 2026 Municipal District Health & Sanitation Administration. All rights reserved.
                </p>
                <div class="flex space-x-6 text-slate-500">
                    <a href="#" class="hover:text-white transition-colors">Privacy Charter</a>
                    <a href="#" class="hover:text-white transition-colors">Compliance Certification</a>
                </div>
            </div>
        </div>
    </footer>
    <!-- Interactive script -->
    <script>
        // FontSize adjusting logic
        let baseSize = 100;
        function changeFontSize(dir) {
            if (dir === 0) {
                baseSize = 100;
            } else {
                baseSize += dir * 5;
                if (baseSize < 85) baseSize = 85;
                if (baseSize > 115) baseSize = 115;
            }
            document.documentElement.style.fontSize = `${baseSize}%`;
        }
        // FAQ Toggle
        function toggleFaq(btn) {
            const wrap = btn.parentElement;
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('svg');
            const isActive = wrap.classList.contains('accordion-active');
            document.querySelectorAll('#faq .border').forEach(el => {
                el.classList.remove('accordion-active');
                el.querySelector('.accordion-content').style.maxHeight = null;
                el.querySelector('button svg').classList.remove('rotate-180');
            });
            if (!isActive) {
                wrap.classList.add('accordion-active');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.classList.add('rotate-180');
            }
        }
        // Subsystem Drawer Expand/Collapse
        function toggleSubsystemDrawer(btn) {
            const card = btn.parentElement;
            const drawer = btn.nextElementSibling;
            const icon = btn.querySelector('svg');
            const isOpen = card.classList.contains('active-subsystem');
            // Close all
            document.querySelectorAll('#subsystems .bg-white').forEach(el => {
                el.classList.remove('active-subsystem');
                el.classList.remove('border-blue-600/30');
                const dr = el.querySelector('.subsystem-drawer');
                if (dr) dr.style.maxHeight = null;
                const ic = el.querySelector('button svg');
                if (ic) ic.classList.remove('rotate-180');
            });
            if (!isOpen) {
                card.classList.add('active-subsystem');
                card.classList.add('border-blue-600/30');
                drawer.style.maxHeight = drawer.scrollHeight + 'px';
                icon.classList.add('rotate-180');
                
                // Stagger reveal modules inside drawer
                const modules = drawer.querySelectorAll('.bg-white');
                modules.forEach((mod, idx) => {
                    mod.style.opacity = '0';
                    mod.style.transform = 'translateY(10px)';
                    mod.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                    setTimeout(() => {
                        mod.style.opacity = '1';
                        mod.style.transform = 'translateY(0)';
                    }, idx * 60);
                });
            }
        }
        // District map selections
        function selectDistrict(name, served, coverage, status) {
            document.getElementById('district-name').textContent = name;
            document.getElementById('district-served').textContent = served;
            document.getElementById('district-coverage').textContent = coverage;
            document.getElementById('district-status').textContent = status;
            
            const badge = document.getElementById('district-status');
            if (status.includes('Audit')) {
                badge.className = "text-[10px] bg-rose-50 text-rose-700 font-extrabold uppercase px-2 py-0.5 rounded block w-max mt-1 tracking-wider";
            } else {
                badge.className = "text-[10px] bg-emerald-50 text-emerald-700 font-extrabold uppercase px-2 py-0.5 rounded block w-max mt-1 tracking-wider";
            }
        }
        // Canvas Particle Network
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        function resize() {
            if (!canvas) return;
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = (Math.random() - 0.5) * 0.25;
                this.r = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.fill();
            }
        }
        function initParticles() {
            particles = [];
            const count = Math.min(50, Math.floor(canvas.width / 25));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * (1 - dist/120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        requestAnimationFrame(animateParticles);
        // 3D Card Tilt Effect
        document.querySelectorAll('.card-tilt').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const tiltX = (yc - y) / 14;
                const tiltY = (x - xc) / 14;
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.boxShadow = '0 15px 30px rgba(16, 42, 67, 0.12)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.boxShadow = '';
            });
        });
        // Button Click Ripple
        document.querySelectorAll('.ripple-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const rect = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.position = 'absolute';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.width = '0px';
                ripple.style.height = '0px';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.35)';
                ripple.style.transform = 'translate(-50%, -50%)';
                ripple.style.pointerEvents = 'none';
                ripple.style.transition = 'width 0.5s ease-out, height 0.5s ease-out, opacity 0.5s ease-out';
                
                btn.appendChild(ripple);
                ripple.offsetHeight; // trigger reflow
                
                const size = Math.max(rect.width, rect.height) * 2.5;
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                ripple.style.opacity = '0';
                
                setTimeout(() => {
                    ripple.remove();
                }, 500);
            });
        });
        // Timeline Scroll Connection Filler
        const timelineTrack = document.getElementById('timeline-track-fill');
        const timelineSection = document.getElementById('timeline');
        const timelineSteps = document.querySelectorAll('.timeline-step');
        
        window.addEventListener('scroll', () => {
            if (!timelineSection || !timelineTrack) return;
            const rect = timelineSection.getBoundingClientRect();
            const winHeight = window.innerHeight;
            
            // Fill line
            const scrollPercent = Math.max(0, Math.min(1, (winHeight - rect.top) / (rect.height + 100)));
            timelineTrack.style.height = `${scrollPercent * 100}%`;
            // Step highlights
            timelineSteps.forEach(step => {
                const stepRect = step.getBoundingClientRect();
                if (stepRect.top < winHeight * 0.75) {
                    step.classList.remove('opacity-50');
                    step.classList.add('opacity-100');
                } else {
                    step.classList.add('opacity-50');
                    step.classList.remove('opacity-100');
                }
            });
        });
        // Directional Scroll Reveals
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    
                    // Trigger active dashboard progress indicators when revealed
                    if (entry.target.id === 'dashboard') {
                        triggerDashboardAnimations();
                    }
                    observer.unobserve(entry.target);
                }
            });
        };
        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px'
        });
        function triggerDashboardAnimations() {
            setTimeout(() => {
                const radial = document.querySelector('.stroke-dashoffset-anim');
                if (radial) {
                    const targetDash = parseInt(radial.getAttribute('data-dash'), 10);
                    radial.style.transition = 'stroke-dasharray 1.2s ease-out';
                    radial.style.strokeDasharray = `${targetDash}, 100`;
                }
                document.querySelectorAll('[data-width]').forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.width = targetWidth;
                });
                document.querySelectorAll('[data-count]').forEach(el => {
                    const targetVal = parseInt(el.getAttribute('data-count'), 10);
                    let currentVal = 0;
                    const duration = 1200; // ms
                    const step = Math.ceil(targetVal / (duration / 16));
                    
                    const countInterval = setInterval(() => {
                        currentVal += step;
                        if (currentVal >= targetVal) {
                            el.textContent = targetVal.toLocaleString();
                            clearInterval(countInterval);
                        } else {
                            el.textContent = currentVal.toLocaleString();
                        }
                    }, 16);
                });
            }, 1300);
        }
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.reveal-up, .reveal-scale').forEach(section => {
                revealObserver.observe(section);
            });
            // Skeletons hide timer
            setTimeout(() => {
                const loader = document.getElementById('skeleton-loader');
                const active = document.getElementById('active-dashboard');
                if (loader && active) {
                    loader.classList.add('hidden');
                    active.classList.remove('hidden');
                }
            }, 1200);
        });
    </script>
</body>
</html>