const USER_ID = 1;
const BASE_URL = 'http://localhost:8080/api/portfolio';

let stompClient = null;

async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

function formatCurrency(value) {
    return '$' + Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatPnL(value) {
    const sign = value >= 0 ? '+' : '';
    return sign + formatCurrency(value);
}

function getPnLClass(value) {
    return value >= 0 ? 'positive' : 'negative';
}

// WebSocket Connection
function connectWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws-stock-updates');
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, function(frame) {
        console.log('✅ WebSocket connected for portfolio');
        
        stompClient.subscribe('/topic/stock-updates', function(response) {
            const update = JSON.parse(response.body);
            console.log('📡 Stock update received, refreshing portfolio...');
            
            // Reload portfolio data
            loadSummary();
            loadPortfolio();
        });
        
    }, function(error) {
        console.log('❌ WebSocket error, retrying in 5 seconds...');
        setTimeout(connectWebSocket, 5000);
    });
}

async function loadSummary() {
    const [portfolioValue, netWorth] = await Promise.all([
        fetchJson(`${BASE_URL}/${USER_ID}/value`),
        fetchJson(`${BASE_URL}/${USER_ID}/getNetWorth`)
    ]);

    document.getElementById('totalValue').textContent = formatCurrency(portfolioValue);
    document.getElementById('netWorth').textContent = formatCurrency(netWorth);

    const pnl = netWorth - portfolioValue;
    const pnlElement = document.getElementById('pnl');

    pnlElement.textContent = formatPnL(pnl);
    pnlElement.className = `stat-value ${getPnLClass(pnl)}`;
}

function createActionButtons(portfolioId) {
    return `
        <div class="action-buttons">
            <button onclick="buyStock(${portfolioId})">Buy</button>
            <button onclick="sellStock(${portfolioId})">Sell</button>
        </div>
    `;
}

function renderPortfolio(portfolio) {
    const tbody = document.getElementById('portfolioBody');
    tbody.innerHTML = '';

    if (!portfolio || portfolio.length === 0) {
        document.getElementById('username').textContent = 'Unknown';
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">No stocks in portfolio</td>
            </tr>
        `;
        return;
    }

    document.getElementById('username').textContent = portfolio[0].user.name;

    portfolio.forEach(item => {
        const stock = item.stock;
        const quantity = item.quantity;
        const avgPrice = item.averageBuyPrice;
        const currentPrice = stock.price;

        const value = quantity * currentPrice;
        const pnl = (currentPrice - avgPrice) * quantity;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${stock.symbol}</td>
            <td>${quantity}</td>
            <td>${formatCurrency(avgPrice)}</td>
            <td>${formatCurrency(currentPrice)}</td>
            <td>${formatCurrency(value)}</td>
            <td class="${getPnLClass(pnl)}">${formatPnL(pnl)}</td>
            <td>${createActionButtons(item.id)}</td>
        `;

        tbody.appendChild(row);
    });
}

async function loadPortfolio() {
    const portfolio = await fetchJson(`${BASE_URL}/${USER_ID}`);
    renderPortfolio(portfolio);
}

function buyStock(portfolioId) {
    console.log('Buy stock for portfolio:', portfolioId);
    window.location.href = 'stocks.html';
}

function sellStock(portfolioId) {
    console.log('Sell stock for portfolio:', portfolioId);
    window.location.href = 'stocks.html';
}

async function initializePage() {
    try {
        await Promise.all([
            loadSummary(),
            loadPortfolio()
        ]);
    } catch (error) {
        console.error('Failed to load portfolio:', error);
        alert('Failed to load portfolio data');
    }
}

// Initialize
initializePage();
connectWebSocket();