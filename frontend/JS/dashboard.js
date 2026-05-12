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

  async function loadWalletBalance() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/wallet/${user.id}/balance`
      );

      if (!response.ok) {
        throw new Error('Failed to load balance');
      }

      const balance = await response.json();

      walletBalance.textContent = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(balance);
    } catch (error) {
      console.error('Error loading wallet balance:', error);
      walletBalance.textContent = 'Unavailable';
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

  loadWalletBalance();
})();