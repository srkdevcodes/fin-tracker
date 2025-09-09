let budgetData = {};

async function calculateBudget() {
    const income = parseFloat(document.getElementById('income').value);
    if (!income || income <= 0) {
        alert("Please enter a valid income.");
        return;
    }

    document.getElementById("animatedIncome").innerHTML = `Your Monthly Income: ₹${income}`;
    document.getElementById("animatedIncome").style.opacity = 1;

    const needs = income * 0.5;
    const wants = income * 0.2;
    const savings = income * 0.3;

    budgetData = { income, needs, wants, savings };

    document.getElementById('budgetResults').innerHTML = `
        <strong>📊 Budget Breakdown:</strong><br>
        50% Needs: ₹${needs.toFixed(2)}<br>
        20% Enjoyment: ₹${wants.toFixed(2)}<br>
        30% Savings: ₹${savings.toFixed(2)}
    `;

    await fetch("/add_expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income, needs, wants, savings})
      });

    renderChart(needs, wants, savings);
    saveToHistory(income, needs, wants, savings);
}

function addExpenseField() {
    const container = document.getElementById('expensesList');
    const div = document.createElement('div');
    div.classList.add('expense-group');
    div.innerHTML = `
        <input type="text" class="expense-name" placeholder="Expense name">
        <input type="number" class="expense-amount" placeholder="Amount">
    `;
    container.appendChild(div);
}

function checkExpenses() {
    const amounts = document.querySelectorAll('.expense-amount');
    let totalExpense = 0;
    amounts.forEach(input => {
        totalExpense += parseFloat(input.value) || 0;
    });

    const status = document.getElementById('expenseStatus');
    const extraNeeded = totalExpense - budgetData.needs;
    const remaining = budgetData.needs - totalExpense;

    let message = `Total 50% Needs Expenses You made: ₹${totalExpense.toFixed(2)}<br>`;

    if (extraNeeded > 0) {
        message += `<span class="minus">⚠ Over budget by ₹${extraNeeded.toFixed(2)}.<br>You can adjust from 20% Enjoyment (₹${budgetData.wants.toFixed(2)}).</span>`;
    } else {
        message += `<span>✅ You are within your 50% Needs budget.</span>`;
        message += `<br>🟢 Remaining from 50% Needs after expenses: ₹${remaining.toFixed(2)}`;
    }

    status.innerHTML = message;
}

function renderChart(needs, wants, savings) {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Needs (50%)', 'Enjoyment (20%)', 'Savings (30%)'],
            datasets: [{
                data: [needs, wants, savings],
                backgroundColor: ['#FF6384', '#36A2EB', '#4CAF50']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function saveToHistory(income, needs, wants, savings) {
    let history = JSON.parse(localStorage.getItem('budgetHistory') || '[]');
    const now = new Date();
    const record = `${now.getMonth() + 1}/${now.getFullYear()}: ₹${income} → Needs ₹${needs}, Enjoyment ₹${wants}, Savings ₹${savings}`;
    history.unshift(record);
    if (history.length > 12) history.pop();
    localStorage.setItem('budgetHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('budgetHistory') || '[]');
    const list = document.getElementById('historyList');
    list.innerHTML = history.map(item => `<div>📌 ${item}</div>`).join('');
}

window.onload = renderHistory;

document.getElementById("clear-monthly").addEventListener("click", function () {
    localStorage.removeItem("budgetHistory"); // Corrected key
    const list = document.getElementById('historyList');
    list.innerHTML = ""; // Clear displayed list
    alert("Monthly records cleared successfully!");
});


