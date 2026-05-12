(function () {
  const loginContainer = document.getElementById('loginFormContainer');
  const registerContainer = document.getElementById('registerFormContainer');

  const tabLogin = document.getElementById('tabLoginBtn');
  const tabRegister = document.getElementById('tabRegisterBtn');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  const loginError = document.getElementById('loginError');
  const regError = document.getElementById('regError');

  function clearErrors() {
    loginError.textContent = '';
    regError.textContent = '';
  }

  function setLoginError(message) {
    loginError.textContent = message;
  }

  function setRegError(message) {
    regError.textContent = message;
  }

  function setActiveTab(tab) {
    clearErrors();

    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');

      loginContainer.style.display = 'block';
      registerContainer.style.display = 'none';
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');

      loginContainer.style.display = 'none';
      registerContainer.style.display = 'block';
    }
  }

  tabLogin.addEventListener('click', function () {
    setActiveTab('login');
  });

  tabRegister.addEventListener('click', function () {
    setActiveTab('register');
  });

  async function loginUser(email, password) {
    if (!email || !email.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return false;
    }

    if (!password || !password.trim()) {
      setLoginError('Password cannot be empty.');
      return false;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setLoginError(errorText || 'Invalid email or password.');
        return false;
      }

      const user = await response.json();

      console.log('User verified successfully:', user);

      localStorage.setItem('tradeflow_auth', JSON.stringify(user));

      console.log('Successful login');

      return true;
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Unable to connect to server.');
      return false;
    }
  }

  async function registerUser(name, email, password) {
    if (!name || name.trim().length < 2) {
      setRegError('Please enter your full name.');
      return false;
    }

    if (!email || !email.includes('@')) {
      setRegError('Valid email required.');
      return false;
    }

    if (!password || password.length < 4) {
      setRegError('Password must be at least 4 characters.');
      return false;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setRegError(errorText || 'Registration failed.');
        return false;
      }

      const user = await response.json();
      
      console.log('User registered successfully:', user);
      localStorage.setItem('tradeflow_auth', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setRegError('Unable to connect to server.');
      return false;
    }
  }

  function redirectToDashboard() {
    console.log('Login successful');
    window.location.href = 'dashboard.html';
  }

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (await loginUser(email, password)) {
      redirectToDashboard();
    }
  });

  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    if (await registerUser(name, email, password)) {
      window.location.href = 'wallet.html';
    }
  });
})();