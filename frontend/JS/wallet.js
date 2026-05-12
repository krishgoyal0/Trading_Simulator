(function () {
  const amountButtons = document.querySelectorAll('.amount-btn');
  const amountInput = document.getElementById('amountInput');
  const addFundsBtn = document.getElementById('addFundsBtn');
  const continueBtn = document.getElementById('continueBtn');
  const currentBalance = document.getElementById('currentBalance');
  const message = document.getElementById('message');

  const userData = JSON.parse(localStorage.getItem('tradeflow_auth'));

  if (!userData || !userData.id) {
    window.location.href = 'index.html';
    return;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
  }

  function setSelectedButton(amount) {
    amountButtons.forEach(button => {
      if (Number(button.dataset.amount) === amount) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  amountButtons.forEach(button => {
    button.addEventListener('click', function () {
      const amount = Number(this.dataset.amount);
      amountInput.value = amount;
      setSelectedButton(amount);
    });
  });

  amountInput.addEventListener('input', function () {
    setSelectedButton(Number(this.value));
  });

  addFundsBtn.addEventListener('click', async function () {
    const amount = Number(amountInput.value);

    if (!amount || amount <= 0) {
      showMessage('Please enter a valid amount.', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/wallet/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userData.id,
          amount: amount
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        showMessage(errorText || 'Failed to add funds.', 'error');
        return;
      }

      const updatedWallet = await response.json();

      currentBalance.textContent = formatCurrency(updatedWallet.balance);

      console.log('Funds added successfully:', updatedWallet);
      showMessage('Virtual funds added successfully.', 'success');

      continueBtn.disabled = false;
    } catch (error) {
      console.error('Wallet error:', error);
      showMessage('Unable to connect to server.', 'error');
    }
  });

  continueBtn.addEventListener('click', function () {
    window.location.href = 'dashboard.html';
  });
})();