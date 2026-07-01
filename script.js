let budget = 1000;
let expenses = [];

const totalAmountInput = document.getElementById("total-amount");
const productTitleInput = document.getElementById("product-title");
const userAmountInput = document.getElementById("user-amount");
const expenseDateInput = document.getElementById("expense-date"); 
const categoryInput = document.getElementById("category");

const amountDisplay = document.getElementById("amount");
const expenditureDisplay = document.getElementById("expenditure-value");
const balanceDisplay = document.getElementById("balance-amount");
const list = document.getElementById("list");

const budgetError = document.getElementById("budget-error");
const expenseError = document.getElementById("expense-error");

// Load Data
window.onload = function(){
    const savedBudget = localStorage.getItem("budget");
    const savedExpenses = localStorage.getItem("expenses");

    if(savedBudget){
        budget = parseFloat(savedBudget);
        amountDisplay.innerText = budget.toFixed(2);
    }

    if(savedExpenses){
        expenses = JSON.parse(savedExpenses);
        renderExpenses(expenses);
    }

    updateSummary();
};

// Save
function saveData(){
    localStorage.setItem("budget", budget);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Update Summary
function updateSummary(){
    let totalExpense = expenses.reduce((acc,exp)=>acc+exp.amount,0);
    expenditureDisplay.innerText = totalExpense.toFixed(2);

    let balance = budget - totalExpense;
    balanceDisplay.innerText = balance.toFixed(2);
    balanceDisplay.style.color = balance < 0 ? "red" : "white";
}

// Set Budget
document.getElementById("total-amount-button").addEventListener("click",()=>{
    let value = parseFloat(totalAmountInput.value);
    if(isNaN(value) || value>=0){
        budgetError.classList.remove("hide");
        return;
    }
    budgetError.classList.add("hide");
    budget = value;
    amountDisplay.innerText = budget.toFixed(2);
    totalAmountInput.value="";
    saveData();
    updateSummary();
});

// Add Expense
document.getElementById("check-amount").addEventListener("click",()=>{
    let title = productTitleInput.value.trim();
    let amount = parseFloat(userAmountInput.value);
    let date = expenseDateInput.value || "No Date";
    let category = categoryInput.value;

    if(title==="" || isNaN(amount) || amount<=0){
        expenseError.classList.remove("hide");
        return;
    }

    expenseError.classList.add("hide");

    let expense = {
        id: Date.now(),
        title,
        amount,
        date,
        category
    };

    expenses.push(expense);
    saveData();
    renderExpenses(expenses);
    updateSummary();

    productTitleInput.value="";
    userAmountInput.value="";
    expenseDateInput.value="";
});

// Render
function renderExpenses(data){
    list.innerHTML="";
    data.forEach(exp=>{
        let div = document.createElement("div");
        div.classList.add("expense-item");
        div.innerHTML=`
            <div>
                <strong>${exp.title}</strong><br>
                <small>${exp.date} | ${exp.category}</small>
            </div>
            <div>
                ₹ ${exp.amount.toFixed(2)}
                <button class="delete-btn" onclick="deleteExpense(${exp.id})">X</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Delete
function deleteExpense(id){
    expenses = expenses.filter(exp=>exp.id!==id);
    saveData();
    renderExpenses(expenses);
    updateSummary();
}

// Clear All
document.getElementById("clear-all").addEventListener("click",()=>{
    expenses=[];
    saveData();
    renderExpenses(expenses);
    updateSummary();
});

// Filter
document.getElementById("filter-category").addEventListener("change",(e)=>{
    let category = e.target.value;
    if(category==="All"){
        renderExpenses(expenses);
    }else{
        let filtered = expenses.filter(exp=>exp.category===category);
        renderExpenses(filtered);
    }
});
