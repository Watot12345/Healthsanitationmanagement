const container = document.getElementById('mainContainer');
const signUpDesktop = document.getElementById('signUpBtnNav');
const signInDesktop = document.getElementById('signInBtnNav');

// Desktop Event Listeners
if (signUpDesktop && signInDesktop) {
  signUpDesktop.addEventListener('click', () => container.classList.add('right-panel-active'));
  signInDesktop.addEventListener('click', () => container.classList.remove('right-panel-active'));
}

// Mobile Event Listeners
document.querySelectorAll('.toggle-to-signup').forEach(btn => {
  btn.addEventListener('click', () => {
    container.classList.add('right-panel-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
document.querySelectorAll('.toggle-to-login').forEach(btn => {
  btn.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Original Login Logic
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginButton = document.getElementById('loginButton');
  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');

  errorDiv.classList.add('hidden');
  successDiv.classList.add('hidden');

  loginButton.disabled = true;
  loginButton.innerHTML = 'Signing in...';

  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await fetch('../api/auth/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = { success: false, message: 'Invalid server response.' };
    }

    if (data.success) {
      localStorage.setItem('session_token', data.session_token);
      localStorage.setItem('user_data', JSON.stringify({
        id: data.user_id, username: data.username, role: data.role, full_name: data.full_name
      }));
      successDiv.textContent = 'Login successful! Redirecting...';
      successDiv.classList.remove('hidden');
      setTimeout(() => window.location.href = '../dashboard.php', 1000);
    } else {
      errorDiv.textContent = data.message || 'Login failed.';
      errorDiv.classList.remove('hidden');
    }
  } catch (error) {
    errorDiv.textContent = 'Cannot connect to server.';
    errorDiv.classList.remove('hidden');
  } finally {
    loginButton.disabled = false;
    loginButton.innerHTML = 'SIGN IN';
  }
});

// Sign Up Auto-Slide back to Login page
document.getElementById('signUpForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = document.getElementById('actualSignUpBtn');
  btn.innerHTML = 'Creating account...';
  btn.disabled = true;

  setTimeout(() => {
    alert('Sign Up Successful! Auto-sliding back to Login page...');
    btn.innerHTML = 'SIGN UP NOW';
    btn.disabled = false;
    this.reset();
    container.classList.remove('right-panel-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1200);
});