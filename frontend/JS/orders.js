const USER_ID = 1;
const BASE_URL = 'http://localhost:8080/api/orders';

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

function createTypeBadge(type) {
    const cssClass = type === 'BUY' ? 'badge-buy' : 'badge-sell';
    return `<span class="badge ${cssClass}">${type}</span>`;
}

function createStatusBadge(status) {
    return `<span class="badge badge-status">${status}</span>`;
}

function updateSummary(orders) {
    const totalOrders = orders.length;
    const buyOrders = orders.filter(order => order.type === 'BUY').length;
    const sellOrders = orders.filter(order => order.type === 'SELL').length;

    const totalTraded = orders.reduce((sum, order) => {
        return sum + (order.price * order.quantity);
    }, 0);

    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('buyOrders').textContent = buyOrders;
    document.getElementById('sellOrders').textContent = sellOrders;
    document.getElementById('totalTraded').textContent = formatCurrency(totalTraded);
}

function renderOrders(orders) {
    const tbody = document.getElementById('ordersBody');
    tbody.innerHTML = '';

    if (!orders || orders.length === 0) {
        document.getElementById('username').textContent = 'Unknown';

        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">No orders found</td>
            </tr>
        `;

        updateSummary([]);
        return;
    }

    document.getElementById('username').textContent = orders[0].user.name;

    const sortedOrders = [...orders].sort((a, b) => b.id - a.id);

    sortedOrders.forEach(order => {
        const total = order.price * order.quantity;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.stock.symbol}</td>
            <td>${order.stock.name}</td>
            <td>${createTypeBadge(order.type)}</td>
            <td>${order.quantity}</td>
            <td>${formatCurrency(order.price)}</td>
            <td>${formatCurrency(total)}</td>
            <td>${createStatusBadge(order.status)}</td>
        `;

        tbody.appendChild(row);
    });

    updateSummary(sortedOrders);
}

async function loadOrders() {
    const orders = await fetchJson(`${BASE_URL}/user/${USER_ID}`);
    renderOrders(orders);
}

async function initializePage() {
    try {
        await loadOrders();
    } catch (error) {
        console.error('Failed to load order history:', error);
        alert('Failed to load order history');
    }
}

initializePage();