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

  const user = JSON.parse(localStorage.getItem('tradeflow_auth'));

  const lastUpdatedTime = document.getElementById('lastUpdatedTime');
  const usaClock = document.getElementById('usaClock');

  if (!user || !user.id) {
    window.location.href = 'login.html';
    return;
  }

  let allStocks = [];
  let selectedStock = null;
  let tradeType = 'buy';
  let previousPrices = {};
  let stompClient = null;

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  }

  function updateLastUpdatedTime() {
    const now = new Date();
    lastUpdatedTime.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  function updateUsaClock() {
    const now = new Date();
    const usaTime = now.toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    usaClock.textContent = usaTime;
  }

  function connectWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws-stock-updates');
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, function () {
      console.log('✅ WebSocket connected for stocks');
      
      stompClient.subscribe('/topic/stock-updates', function (response) {
        const update = JSON.parse(response.body);
        console.log('📡 Stock update received:', update);
        loadStocks();
      });
    }, function () {
      console.log('❌ WebSocket error, retrying in 5 seconds...');
      setTimeout(connectWebSocket, 5000);
    });
  }

  async function loadStocks() {
    stocksTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">Loading market data...</td></tr>';

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
      stocksTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">Unable to load market data.</td></tr>';
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
    if (!stocks.length) {
      stocksTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">No stocks found.</td></tr>';
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
      </tr>
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
    modalTitle.textContent = tradeType === 'buy' ? 'Buy Stock' : 'Sell Stock';
    totalLabel.textContent = tradeType === 'buy' ? 'Total Cost' : 'Total Value';
    confirmTradeBtn.textContent = tradeType === 'buy' ? 'Confirm Buy' : 'Confirm Sell';

    modalSymbol.textContent = selectedStock.symbol;
    modalPrice.textContent = formatCurrency(selectedStock.price);

    quantityInput.value = 1;
    tradeMessage.textContent = '';

    updateTotal();

    tradeModal.classList.remove('hidden');
  }

  function closeModal() {
    tradeModal.classList.add('hidden');
  }

  function updateTotal() {
    const quantity = Number(quantityInput.value) || 0;
    const total = quantity * selectedStock.price;
    totalAmount.textContent = formatCurrency(total);
  }

  function showTradeMessage(text, type) {
    tradeMessage.textContent = text;
    tradeMessage.className = `trade-message ${type}`;
  }

  async function executeTrade() {
    const quantity = Number(quantityInput.value);

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

      setTimeout(() => {
        closeModal();
        loadStocks();
      }, 1200);
    } catch (error) {
      console.error('Trade error:', error);
      showTradeMessage('Unable to connect to server.', 'error');
    }
  }

  searchInput.addEventListener('input', function () {
    const keyword = this.value.toLowerCase();
    const filtered = allStocks.filter(stock =>
      stock.symbol.toLowerCase().includes(keyword) ||
      stock.name.toLowerCase().includes(keyword)
    );
    renderStocks(filtered);
  });

  dashboardBtn.addEventListener('click', function () {
    window.location.href = 'dashboard.html';
  });

  closeModalBtn.addEventListener('click', closeModal);

  tradeModal.addEventListener('click', function (event) {
    if (event.target === tradeModal) {
      closeModal();
    }
  });

  quantityInput.addEventListener('input', updateTotal);
  confirmTradeBtn.addEventListener('click', executeTrade);

  // Initialize clocks
  updateUsaClock();
  setInterval(updateUsaClock, 1000);

  // Initialize page
  loadStocks();
  connectWebSocket();
})();