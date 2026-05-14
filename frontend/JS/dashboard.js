(function () {
  const welcomeText = document.getElementById('welcomeText');
  const walletBalance = document.getElementById('walletBalance');
  const logoutBtn = document.getElementById('logoutBtn');
  const addFundsBtn = document.getElementById('addFundsBtn');
  const buyStocksBtn = document.getElementById('buyStocksBtn');
  const user = JSON.parse(localStorage.getItem('tradeflow_auth'));

  let stompClient = null;

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

  // WebSocket Connection
  function connectWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws-stock-updates');
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, function(frame) {
      console.log('✅ WebSocket connected for dashboard');
      
      stompClient.subscribe('/topic/stock-updates', function(response) {
        const update = JSON.parse(response.body);
        console.log('📡 Stock update received, refreshing dashboard...');
        
        // Refresh dashboard data
        loadWalletBalance();
        loadPortfolioValue();
      });
      
    }, function(error) {
      console.log('❌ WebSocket error, retrying in 5 seconds...');
      setTimeout(connectWebSocket, 5000);
    });
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
      document.getElementById('portfolioValue').textContent = formatCurrency(portfolioValue);
    } catch (error) {
      console.error('Error loading portfolio value:', error);
      document.getElementById('portfolioValue').textContent = 'Unavailable';
    }
  }


  async function loadTotalOrders() {
    try {
        // Get user data from localStorage
        const authData = JSON.parse(localStorage.getItem('tradeflow_auth'));
        
        // Extract user ID (handles both possible structures)
        const userId = authData?.id || authData?.user?.id;
        
        // Validate user ID exists
        if (!userId) {
            console.error('User ID not found in localStorage');
            // Try to redirect to login if no user found
            window.location.href = 'login.html';
            return;
        }
        
        // Validate user ID is a number
        const parsedUserId = parseInt(userId, 10);
        if (isNaN(parsedUserId)) {
            console.error('Invalid User ID:', userId);
            return;
        }
        
        // Fetch orders from API
        const response = await fetch(`http://localhost:8080/api/orders/user/${parsedUserId}`);
        
        // Check if response is OK
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Orders endpoint not found');
                return;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Parse JSON response
        let orders = [];
        try {
            orders = await response.json();
        } catch (parseError) {
            console.error('Failed to parse orders response:', parseError);
            return;
        }
        
        // Ensure orders is an array
        const orderCount = Array.isArray(orders) ? orders.length : 0;
        
        // Update DOM element
        const totalOrdersElement = document.getElementById('totalOrders');
        if (totalOrdersElement) {
            totalOrdersElement.textContent = orderCount;
        } else {
            console.warn('Element #totalOrders not found in DOM');
        }
        
        // Optional: Log for debugging
        console.log(`✅ Total orders loaded: ${orderCount}`);
        
    } catch (error) {
        console.error('Error loading total orders:', error.message);
        
        // Optional: Show fallback value in UI
        const totalOrdersElement = document.getElementById('totalOrders');
        if (totalOrdersElement && totalOrdersElement.textContent === '') {
            totalOrdersElement.textContent = '0';
        }
    }
  }

  async function loadProfitLoss() {
    try {
        const userId = user.id;
        
        // Get current portfolio value
        const portfolioResponse = await fetch(
            `http://localhost:8080/api/portfolio/${userId}/value`
        );
        const portfolioValue = await portfolioResponse.json();
        
        // Get total invested amount
        const investedResponse = await fetch(
            `http://localhost:8080/api/portfolio/${userId}/invested`
        );
        const totalInvested = await investedResponse.json();
        
        // Calculate P&L
        const profitLoss = portfolioValue - totalInvested;
        const isProfit = profitLoss >= 0;
        
        // Update DOM
        const pnlElement = document.getElementById('profitLoss');
        if (pnlElement) {
            pnlElement.textContent = formatCurrency(Math.abs(profitLoss));
            pnlElement.style.color = isProfit ? '#00ff88' : '#ff4444';
            
            // Add + or - sign
            const sign = isProfit ? '+' : '-';
            pnlElement.innerHTML = `${sign} ${formatCurrency(Math.abs(profitLoss))}`;
        }
        
        // Also update the percentage return
        const percentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
        const percentElement = document.getElementById('pnlPercentage');
        if (percentElement) {
            percentElement.textContent = `${isProfit ? '+' : ''}${percentage.toFixed(2)}%`;
            percentElement.style.color = isProfit ? '#00ff88' : '#ff4444';
        }
        
    } catch (error) {
        console.error('Error loading P&L:', error);
        const pnlElement = document.getElementById('profitLoss');
        if (pnlElement) pnlElement.textContent = formatCurrency(0);
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

  // Initialize
  loadTotalOrders();
  loadProfitLoss();
  loadWalletBalance();
  loadPortfolioValue();
  connectWebSocket();
})();