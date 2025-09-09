// daily.js

let dailyData = {
    incomes: [],
    expenses: []
};

function addIncome() {
    const source = document.getElementById('incomeSource').value.trim();
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    if (!source || isNaN(amount) || amount <= 0) {
        alert('Enter valid income details');
        return;
    }
    dailyData.incomes.push({ source, amount });
    updateLocalStorage();
    renderSummary();
    renderHistory();
    clearInputs('income');
}

function addExpense() {
    const item = document.getElementById('expenseItem').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    if (!item || isNaN(amount) || amount <= 0) {
        alert('Enter valid expense details');
        return;
    }
    dailyData.expenses.push({ item, amount });
    updateLocalStorage();
    renderSummary();
    renderHistory();
    clearInputs('expense');
}

function clearInputs(type) {
    if (type === 'income') {
        document.getElementById('incomeSource').value = '';
        document.getElementById('incomeAmount').value = '';
    } else {
        document.getElementById('expenseItem').value = '';
        document.getElementById('expenseAmount').value = '';
    }
}

function renderSummary() {
    const totalIncome = dailyData.incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = dailyData.expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    document.getElementById('summary').innerHTML = `
        <strong>Total Income:</strong> ₹${totalIncome.toFixed(2)}<br>
        <strong>Total Expense:</strong> ₹${totalExpense.toFixed(2)}<br>
        <strong>Balance:</strong> ₹${balance.toFixed(2)}
    `;
}

function renderHistory() {
    const list = document.getElementById('historyList');
    let html = '<h3>Incomes</h3>';
    dailyData.incomes.forEach((i, index) => {
        html += `<div>💰 ${i.source}: ₹${i.amount.toFixed(2)}</div>`;
    });
    html += '<h3>Expenses</h3>';
    dailyData.expenses.forEach((e, index) => {
        html += `<div>💸 ${e.item}: ₹${e.amount.toFixed(2)}</div>`;
    });
    list.innerHTML = html;
}

function updateLocalStorage() {
    localStorage.setItem('dailyTrackerData', JSON.stringify(dailyData));
}

function loadFromStorage() {
    const data = localStorage.getItem('dailyTrackerData');
    if (data) {
        dailyData = JSON.parse(data);
        renderSummary();
        renderHistory();
    }
}

function clearHistory() {
    if (confirm('Are you sure you want to clear today\'s records?')) {
        dailyData = { incomes: [], expenses: [] };
        updateLocalStorage();
        renderSummary();
        renderHistory();
    }
}

window.onload = loadFromStorage;
