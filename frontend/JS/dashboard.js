(function () {
  const welcomeText = document.getElementById('welcomeText');
  const walletBalance = document.getElementById('walletBalance');
  const logoutBtn = document.getElementById('logoutBtn');
  const addFundsBtn = document.getElementById('addFundsBtn');
  const buyStocksBtn = document.getElementById('buyStocksBtn');
  const user = JSON.parse(localStorage.getItem('tradeflow_auth'));

  if (!user || !user.id) {
    window.location.href = 'login.html';
    return;
  }

  welcomeText.textContent = `Welcome, ${user.name}`;

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  }

  async function loadWalletBalance() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/wallet/${user.id}/balance`
      );

      if (!response.ok) {
        throw new Error('Failed to load balance');
      }

      const balance = await response.json();

      walletBalance.textContent = formatCurrency(balance);
    } catch (error) {
      console.error('Error loading wallet balance:', error);
      walletBalance.textContent = 'Unavailable';
    }
  }

  async function loadPortfolioValue() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/portfolio/${user.id}/value`
      );

      if (!response.ok) {
        throw new Error('Failed to load portfolio value');
      }

      const portfolioValue = await response.json();

      document.getElementById('portfolioValue').textContent =
        formatCurrency(portfolioValue);
    } catch (error) {
      console.error('Error loading portfolio value:', error);
      document.getElementById('portfolioValue').textContent = 'Unavailable';
    }
  }

  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('tradeflow_auth');
    window.location.href = 'login.html';
  });

  addFundsBtn.addEventListener('click', function () {
    window.location.href = 'wallet.html';
  });

  buyStocksBtn.addEventListener('click', function () {
    window.location.href = 'stocks.html';
  });

  document.getElementById('portfolioCard').addEventListener('click', function () {
    window.location.href = 'portfolio.html';
  });

  loadWalletBalance();
  loadPortfolioValue();
})();