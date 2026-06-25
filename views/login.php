<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health & Sanitation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../css/login.css">
</head>
<body>

    <div class="container-panel" id="mainContainer">

        <div class="form-container sign-up-container max-w-lg mx-auto md:max-w-none justify-center">
            <div class="text-center mb-8 transition-opacity duration-500 mt-8 md:mt-0">
                <h1 class="text-3xl md:text-4xl font-serif-custom text-gray-900 leading-tight">Health & Sanitation</h1>
                <h1 class="text-3xl md:text-4xl font-serif-custom text-gray-900 mb-3 leading-tight">Management</h1>
                <p class="text-sm font-bold text-blue-600 tracking-widest uppercase">Create an Account</p>
            </div>

            <form id="signUpForm" class="space-y-4 max-w-sm mx-auto w-full pb-8 md:pb-0">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                    <input type="text" required class="custom-input w-full px-4 py-3.5 text-base rounded-xl" placeholder="John Doe">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                    <input type="email" required class="custom-input w-full px-4 py-3.5 text-base rounded-xl" placeholder="name@example.com">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                    <input type="text" required class="custom-input w-full px-4 py-3.5 text-base rounded-xl" placeholder="+63 900 000 0000">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                    <input type="password" required class="custom-input w-full px-4 py-3.5 text-base rounded-xl" placeholder="••••••••">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Confirm Password</label>
                    <input type="password" required class="custom-input w-full px-4 py-3.5 text-base rounded-xl" placeholder="••••••••">
                </div>
                
                <div class="flex items-start mt-5 mb-6">
                    <input type="checkbox" class="custom-checkbox mt-1 w-5 h-5 mr-3 flex-shrink-0" required>
                    <p class="text-sm text-gray-500 leading-relaxed">
                        I agree to the <a href="#" class="text-blue-600 hover:underline">terms</a>, <a href="#" class="text-blue-600 hover:underline">conditions</a> and system usage privacy policies.
                    </p>
                </div>

                <button type="submit" id="actualSignUpBtn" class="w-full bg-gray-900 text-white font-bold py-3.5 text-base rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    SIGN UP NOW
                </button>

                <div class="text-center mt-8 md:hidden">
                    <p class="text-sm text-gray-500">Already have an account? <br>
                        <button type="button" class="text-blue-600 font-bold hover:underline inline-block mt-2 toggle-to-login">Sign in to your account</button>
                    </p>
                </div>
            </form>
        </div>


        <div class="form-container sign-in-container max-w-lg mx-auto md:max-w-none justify-center">
            <div class="text-center mb-10 transition-opacity duration-500 mt-8 md:mt-0">
                <h1 class="text-3xl md:text-4xl font-serif-custom text-gray-900 leading-tight">Health & Sanitation</h1>
                <h1 class="text-3xl md:text-4xl font-serif-custom text-gray-900 mb-3 leading-tight">Management</h1>
                <p class="text-sm font-bold text-blue-600 tracking-widest uppercase">Welcome Back</p>
            </div>

            <div id="errorMessage" class="hidden bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-sm mb-6 text-sm max-w-sm mx-auto w-full font-medium"></div>
            <div id="successMessage" class="hidden bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded shadow-sm mb-6 text-sm max-w-sm mx-auto w-full font-medium"></div>

            <form id="loginForm" class="space-y-6 max-w-sm mx-auto w-full pb-8 md:pb-0">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                    <input type="text" id="username" required class="custom-input w-full px-4 py-3.5 rounded-xl text-base" placeholder="name@example.com">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                    <input type="password" id="password" required class="custom-input w-full px-4 py-3.5 rounded-xl text-base" placeholder="••••••••">
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-4 mt-2">
                    <label class="flex items-center text-gray-600 cursor-pointer font-medium hover:text-gray-900 transition-colors">
                        <input type="checkbox" class="custom-checkbox w-5 h-5 mr-2">
                        Remember me
                    </label>
                    <a href="#" class="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-center sm:text-right transition-colors">Forgot Password?</a>
                </div>

                <button type="submit" id="loginButton" class="w-full bg-gray-900 text-white font-bold py-3.5 text-base rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mt-6">
                    SIGN IN
                </button>

                <div class="text-center mt-10 md:hidden">
                    <p class="text-sm text-gray-500">Don't have an account yet? <br>
                        <button type="button" class="text-blue-600 font-bold hover:underline inline-block mt-2 toggle-to-signup">Create an account here</button>
                    </p>
                </div>
            </form>
        </div>


        <div class="overlay-container">
            <div class="overlay">
                
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
                
                <div class="overlay-panel overlay-left">
                    <div class="absolute top-10 left-12 flex items-center space-x-8 text-sm font-bold tracking-wider">
                        <button id="signInBtnNav" class="bg-white text-blue-800 px-8 py-2.5 rounded-full hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-0.5 transition-all">LOGIN</button>
                        <a href="/index.php" class="text-blue-50 hover:text-white hover:underline transition-all">ABOUT</a>
                        <a href="/contact.php" class="text-blue-50 hover:text-white hover:underline transition-all">CONTACT</a>
                        <a href="/download.php" class="text-blue-50 hover:text-white hover:underline transition-all">DOWNLOAD</a>
                    </div>
                    
                    <div class="text-left w-full pl-12 pr-8 pb-16">
                        <h2 class="text-5xl lg:text-6xl font-serif-custom mb-6 tracking-wide drop-shadow-md">HELLO, <br>FRIEND!</h2>
                        <p class="text-sm lg:text-base leading-relaxed text-blue-100 max-w-md font-light">
                            Enter your personal details and start your journey with us. We are committed to maintaining the highest standards of health and sanitation for everyone.
                        </p>
                    </div>
                </div>

                <div class="overlay-panel overlay-right">
                    <div class="absolute top-10 right-12 flex items-center space-x-8 text-sm font-bold tracking-wider">
                        <a href="/Healthsanitationmanagement/index.php">ABOUT</a>
                        <a href="/contact.php" class="text-blue-50 hover:text-white hover:underline transition-all">CONTACT</a>
                        <a href="/download.php" class="text-blue-50 hover:text-white hover:underline transition-all">DOWNLOAD</a>
                        <button id="signUpBtnNav" class="bg-white text-blue-800 px-8 py-2.5 rounded-full hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-0.5 transition-all">SIGN UP</button>
                    </div>

                    <div class="text-right w-full pr-12 pl-8 pb-16">
                        <h2 class="text-5xl lg:text-6xl font-serif-custom mb-6 tracking-wide drop-shadow-md">WELCOME <br>BACK!</h2>
                        <p class="text-sm lg:text-base leading-relaxed text-blue-100 max-w-md ml-auto font-light">
                            To keep connected with us please login with your personal info. Access your dashboard to monitor health and sanitation metrics securely.
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <script src="../views/js/login.js"defer></script>
</body>
</html>