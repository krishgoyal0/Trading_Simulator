(function () {
  const stocksTableBody = document.getElementById('stocksTableBody');
  const searchInput = document.getElementById('searchInput');
  const dashboardBtn = document.getElementById('dashboardBtn');

  const tradeModal = document.getElementById('tradeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalSymbol = document.getElementById('modalSymbol');
  const modalPrice = document.getElementById('modalPrice');
  const quantityInput = document.getElementById('quantityInput');
  const totalAmount = document.getElementById('totalAmount');
  const confirmTradeBtn = document.getElementById('confirmTradeBtn');
  const tradeMessage = document.getElementById('tradeMessage');

  const modalTitle = document.getElementById('modalTitle');
  const totalLabel = document.getElementById('totalLabel');

  const lastUpdatedTime = document.getElementById('lastUpdatedTime');
  const usaClock = document.getElementById('usaClock');

  const marketStatusText = document.getElementById('marketStatusText');
  const marketStatusDot = document.getElementById('marketStatusDot');
  const sessionProgress = document.getElementById('sessionProgress');
  const sessionMarker = document.getElementById('sessionMarker');
  const sessionMessage = document.getElementById('sessionMessage');
  const sessionTimeText = document.getElementById('sessionTimeText');

  const user = JSON.parse(localStorage.getItem('tradeflow_auth'));

  if (!user || !user.id) {
    window.location.href = 'login.html';
    return;
  }

  let allStocks = [];
  let selectedStock = null;
  let tradeType = 'buy';
  let previousPrices = {};
  let stompClient = null;
  let marketStatusData = null;

  // Market hours constants (ET)
  const MARKET_OPEN_HOUR = 9;
  const MARKET_OPEN_MINUTE = 30;
  const MARKET_CLOSE_HOUR = 16;
  const MARKET_CLOSE_MINUTE = 0;

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  }

  function updateLastUpdatedTime() {
    const now = new Date();
    if (lastUpdatedTime) {
      lastUpdatedTime.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }
  }

  function updateUsaClock() {
    const now = new Date();
    if (usaClock) {
      usaClock.textContent = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }
  }

  // Get current time in EST
  function getCurrentEstTime() {
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  }

  // Get market open time for a given date
  function getMarketOpenTime(date) {
    const openTime = new Date(date);
    openTime.setHours(MARKET_OPEN_HOUR, MARKET_OPEN_MINUTE, 0, 0);
    return openTime;
  }

  // Get market close time for a given date
  function getMarketCloseTime(date) {
    const closeTime = new Date(date);
    closeTime.setHours(MARKET_CLOSE_HOUR, MARKET_CLOSE_MINUTE, 0, 0);
    return closeTime;
  }

  // Check if market is open based on time (fallback)
  function isMarketOpenByTime() {
    const estNow = getCurrentEstTime();
    const day = estNow.getDay();
    // Weekend: Saturday (6) or Sunday (0)
    if (day === 0 || day === 6) return false;
    
    const openTime = getMarketOpenTime(estNow);
    const closeTime = getMarketCloseTime(estNow);
    return estNow >= openTime && estNow <= closeTime;
  }

  // Calculate progress percentage for the bar
  function getMarketProgressPercentage(estNow, openTime, closeTime) {
    if (estNow < openTime) return 0;
    if (estNow > closeTime) return 100;
    const totalDuration = closeTime - openTime;
    const elapsed = estNow - openTime;
    return (elapsed / totalDuration) * 100;
  }

  // Get next market open (for display when closed)
  function getNextMarketOpen() {
    const estNow = getCurrentEstTime();
    const nextOpen = new Date(estNow);
    
    // If after market close, try tomorrow
    const closeTime = getMarketCloseTime(estNow);
    if (estNow > closeTime) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
    
    // Skip Saturday and Sunday
    while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
    
    nextOpen.setHours(MARKET_OPEN_HOUR, MARKET_OPEN_MINUTE, 0, 0);
    return nextOpen;
  }

  function formatMarketTime(date) {
    if (!date || isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  async function loadMarketStatus() {
    try {
      const response = await fetch('http://localhost:8080/api/market/status');
      
      if (!response.ok) {
        throw new Error('API returned ' + response.status);
      }
      
      marketStatusData = await response.json();
      console.log('Market status received:', marketStatusData);
      
    } catch (error) {
      console.error('Error loading market status:', error);
      marketStatusData = null;
    }
    
    updateMarketSessionBar();
  }

  function updateMarketSessionBar() {
    // Get current EST time
    const estNow = getCurrentEstTime();
    const openTime = getMarketOpenTime(estNow);
    const closeTime = getMarketCloseTime(estNow);
    
    // Determine if market is open
    let isOpen = false;
    let sessionType = 'closed';
    let nextEventTime = null;
    let eventType = 'Opens';
    
    // First try API data (correct field names)
    if (marketStatusData && marketStatusData.isOpen !== undefined) {
      isOpen = marketStatusData.isOpen;
      sessionType = marketStatusData.session || (isOpen ? 'regular' : 'closed');
    } else {
      // Fallback to time-based calculation
      isOpen = isMarketOpenByTime();
      sessionType = isOpen ? 'regular' : 'closed';
    }
    
    // Calculate progress percentage
    let progressPercent = 0;
    if (isOpen) {
      progressPercent = getMarketProgressPercentage(estNow, openTime, closeTime);
      nextEventTime = closeTime;
      eventType = 'Closes';
    } else {
      nextEventTime = getNextMarketOpen();
      eventType = 'Opens';
      progressPercent = 0;
    }
    
    // Update progress bar
    if (sessionProgress) {
      sessionProgress.style.width = `${progressPercent}%`;
      if (isOpen) {
        sessionProgress.classList.remove('closed');
      } else {
        sessionProgress.classList.add('closed');
      }
    }
    
    // Update marker
    if (sessionMarker) {
      sessionMarker.style.left = `${progressPercent}%`;
      if (isOpen) {
        sessionMarker.classList.remove('closed');
      } else {
        sessionMarker.classList.add('closed');
      }
    }
    
    // Update status text and dot
    if (marketStatusText) {
      marketStatusText.textContent = isOpen ? 'Market Open' : 'Market Closed';
    }
    
    if (marketStatusDot) {
      if (isOpen) {
        marketStatusDot.classList.remove('closed');
      } else {
        marketStatusDot.classList.add('closed');
      }
    }
    
    // Update session message
    if (sessionMessage) {
      if (nextEventTime) {
        sessionMessage.textContent = `${eventType} ${formatMarketTime(nextEventTime)}`;
      } else {
        sessionMessage.textContent = isOpen ? 'Regular Trading Hours' : 'Market Closed';
      }
    }
    
    // Update session time display
    if (sessionTimeText) {
      sessionTimeText.textContent = `${MARKET_OPEN_HOUR}:${MARKET_OPEN_MINUTE.toString().padStart(2, '0')} AM - ${MARKET_CLOSE_HOUR}:${MARKET_CLOSE_MINUTE.toString().padStart(2, '0')} PM ET`;
    }
    
    console.log(`Market status: ${isOpen ? 'OPEN' : 'CLOSED'}, Progress: ${progressPercent.toFixed(1)}%`);
  }

  function connectWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws-stock-updates');
    stompClient = Stomp.over(socket);

    stompClient.connect(
      {},
      function () {
        console.log('✅ WebSocket connected for stocks');

        stompClient.subscribe('/topic/stock-updates', function (response) {
          const update = JSON.parse(response.body);
          console.log('📡 Stock update received:', update);

          loadStocks();
          loadMarketStatus();
        });
      },
      function () {
        console.log('❌ WebSocket error, retrying in 5 seconds...');
        setTimeout(connectWebSocket, 5000);
      }
    );
  }

  async function loadStocks() {
    if (stocksTableBody) {
      stocksTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">Loading market data...</td></tr>';
    }

    try {
      const response = await fetch('http://localhost:8080/api/stocks');

      if (!response.ok) {
        throw new Error('Failed to load stocks');
      }

      allStocks = await response.json();
      allStocks.sort((a, b) => a.name.localeCompare(b.name));
      renderStocks(allStocks);
      updateLastUpdatedTime();
    } catch (error) {
      console.error('Error loading stocks:', error);
      if (stocksTableBody) {
        stocksTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">Unable to load market data. </td></tr>';
      }
    }
  }

  function getPriceCell(stock) {
    const previousPrice = previousPrices[stock.symbol];
    const currentPrice = stock.price;

    let className = '';
    let arrow = '';

    if (previousPrice !== undefined) {
      if (currentPrice > previousPrice) {
        className = 'price-up';
        arrow = '<span class="price-arrow">↑</span>';
      } else if (currentPrice < previousPrice) {
        className = 'price-down';
        arrow = '<span class="price-arrow">↓</span>';
      }
    }

    previousPrices[stock.symbol] = currentPrice;

    return `
      <span class="${className}">
        ${formatCurrency(currentPrice)} ${arrow}
      </span>
    `;
  }

  function renderStocks(stocks) {
    if (!stocksTableBody) return;
    
    if (!stocks.length) {
      stocksTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">No stocks found. </td></tr>';
      return;
    }

    stocksTableBody.innerHTML = stocks.map(stock => `
      <tr>
        <td class="symbol">${stock.symbol}</td>
        <td class="company">${stock.name}</td>
        <td>${getPriceCell(stock)}</td>
        <td>
          <button class="buy-btn" data-symbol="${stock.symbol}">
            Buy
          </button>
        </td>
        <td>
          <button class="sell-btn" data-symbol="${stock.symbol}">
            Sell
          </button>
        </td>
      </td>
    `).join('');

    document.querySelectorAll('.buy-btn').forEach(button => {
      button.addEventListener('click', function () {
        const symbol = this.dataset.symbol;
        selectedStock = allStocks.find(stock => stock.symbol === symbol);
        tradeType = 'buy';
        openModal();
      });
    });

    document.querySelectorAll('.sell-btn').forEach(button => {
      button.addEventListener('click', function () {
        const symbol = this.dataset.symbol;
        selectedStock = allStocks.find(stock => stock.symbol === symbol);
        tradeType = 'sell';
        openModal();
      });
    });
  }

  function openModal() {
    if (modalTitle) modalTitle.textContent = tradeType === 'buy' ? 'Buy Stock' : 'Sell Stock';
    if (totalLabel) totalLabel.textContent = tradeType === 'buy' ? 'Total Cost' : 'Total Value';
    if (confirmTradeBtn) confirmTradeBtn.textContent = tradeType === 'buy' ? 'Confirm Buy' : 'Confirm Sell';
    if (modalSymbol) modalSymbol.textContent = selectedStock.symbol;
    if (modalPrice) modalPrice.textContent = formatCurrency(selectedStock.price);
    if (quantityInput) quantityInput.value = 1;
    if (tradeMessage) tradeMessage.textContent = '';
    updateTotal();
    if (tradeModal) tradeModal.classList.remove('hidden');
  }

  function closeModal() {
    if (tradeModal) tradeModal.classList.add('hidden');
  }

  function updateTotal() {
    const quantity = Number(quantityInput ? quantityInput.value : 0) || 0;
    const total = quantity * selectedStock.price;
    if (totalAmount) totalAmount.textContent = formatCurrency(total);
  }

  function showTradeMessage(text, type) {
    if (tradeMessage) {
      tradeMessage.textContent = text;
      tradeMessage.className = `trade-message ${type}`;
    }
  }

  async function executeTrade() {
    const quantity = Number(quantityInput ? quantityInput.value : 0);

    if (!quantity || quantity <= 0) {
      showTradeMessage('Please enter a valid quantity.', 'error');
      return;
    }

    try {
      const endpoint = tradeType === 'buy'
        ? 'http://localhost:8080/api/trading/buy'
        : 'http://localhost:8080/api/trading/sell';

      const response = await fetch(
        `${endpoint}?userId=${user.id}&stockId=${selectedStock.id}&quantity=${quantity}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const errorText = await response.text();
        showTradeMessage(errorText || 'Trade failed.', 'error');
        return;
      }

      const result = await response.json();
      console.log(`${tradeType} order executed:`, result);

      showTradeMessage(
        tradeType === 'buy' ? 'Stock purchased successfully.' : 'Stock sold successfully.',
        'success'
      );

      setTimeout(function () {
        closeModal();
        loadStocks();
        loadMarketStatus();
      }, 1200);
    } catch (error) {
      console.error('Trade error:', error);
      showTradeMessage('Unable to connect to server.', 'error');
    }
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const keyword = this.value.toLowerCase();
      const filtered = allStocks.filter(stock =>
        stock.symbol.toLowerCase().includes(keyword) ||
        stock.name.toLowerCase().includes(keyword)
      );
      renderStocks(filtered);
    });
  }

  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', function () {
      window.location.href = 'dashboard.html';
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (tradeModal) {
    tradeModal.addEventListener('click', function (event) {
      if (event.target === tradeModal) {
        closeModal();
      }
    });
  }

  if (quantityInput) {
    quantityInput.addEventListener('input', updateTotal);
  }

  if (confirmTradeBtn) {
    confirmTradeBtn.addEventListener('click', executeTrade);
  }

  // Initialize
  updateUsaClock();
  setInterval(updateUsaClock, 1000);
  
  loadStocks();
  loadMarketStatus();
  connectWebSocket();
  
  // Refresh market status bar every second (for smooth progress animation)
  setInterval(function() {
    updateMarketSessionBar();
  }, 1000);
  
  // Refresh market status from API every minute
  setInterval(loadMarketStatus, 60000);
})();