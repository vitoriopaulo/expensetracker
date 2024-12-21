// Boilerplate expenses
const defaultExpenses = [
    { name: "Rent", amount: 0 },
    { name: "Condo Fee", amount: 0 },
    { name: "Property Tax", amount: 0 },
    { name: "Groceries", amount: 0 },
    { name: "Utilities", amount: 0 },
    { name: "Health Plan", amount: 0 },
    { name: "Medicines", amount: 0 },
    { name: "Doctors Appointments", amount: 0 },
    { name: "Psychotherapy", amount: 0 },
    { name: "Gym Membership", amount: 0 },
    { name: "Fitness Classes", amount: 0 },
    { name: "Dining Out", amount: 0 },
    { name: "Movies and Events", amount: 0 },
    { name: "Hobbies", amount: 0 },
    { name: "Travel Expenses", amount: 0 },
    { name: "Personal Care", amount: 0 },
    { name: "Education", amount: 0 },
    { name: "Miscellaneous", amount: 0 }
];

// Global variables
let monthlyBudget = 0;

// Handle Sign Up
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        showFeedbackPopup("Passwords don't match. Try again!");
        return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret-key').toString();
    localStorage.setItem('user', JSON.stringify({ email, username, password: encryptedPassword }));
    showFeedbackPopup("Sign up successful!");
    resetSignupForm();
});

// Handle Log In
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.email === loginEmail) {
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret-key').toString(CryptoJS.enc.Utf8);
        if (decryptedPassword === loginPassword) {
            showFeedbackPopup("Successfully logged in!");
            setTimeout(() => {
                document.getElementById('auth-section').style.display = 'none';
                document.getElementById('expense-section').style.display = 'block';
                initializeMonthlyCalendar();
                displayBudget();
                displayExpenses(); // Ensure expenses are displayed on login
            }, 4000);
        } else {
            showFeedbackPopup("Invalid credentials. Try again!");
        }
    } else {
        showFeedbackPopup("Invalid credentials. Try again!");
    }
});

// Handle Logout
document.getElementById('logout-button').addEventListener('click', function () {
    showFeedbackPopup("Logged out successfully!");
    setTimeout(() => {
        document.getElementById('expense-section').style.display = 'none';
        document.getElementById('auth-section').style.display = 'block';
    }, 4000);
});

// Function to show feedback popup with progress bar
function showFeedbackPopup(message) {
    const popup = document.getElementById('feedback-popup');
    popup.innerHTML = `${message} <div class='progress-bar'></div>`;
    popup.style.display = 'block';
    popup.style.opacity = '1';

    const progressBar = popup.querySelector('.progress-bar');
    progressBar.style.width = '0';
    progressBar.style.transition = 'width 4s linear';

    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 10);

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 500);
    }, 4000);
}

// Function to reset the Sign Up form
function resetSignupForm() {
    document.getElementById('signup-form').reset();
}

// Initialize monthly calendar
let currentMonthIndex = new Date().getMonth();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function initializeMonthlyCalendar() {
    displayCurrentMonth();
}

function displayCurrentMonth() {
    document.getElementById('current-month').textContent = months[currentMonthIndex];
    displayExpenses();
    displayBudget();
}

// Function to display the budget
function displayBudget() {
    const budgetDisplay = document.getElementById('budget-display');
    budgetDisplay.textContent = `Budget: $${monthlyBudget.toFixed(2)}`;
}

// Function to open budget modal
document.querySelector('.budget-triangle').addEventListener('click', function () {
    const modal = document.getElementById('budget-modal');
    modal.style.display = 'block';
});

// Handle OK button in the budget modal
document.getElementById('budget-ok-button').addEventListener('click', function () {
    const budgetInput = document.getElementById('budget-input').value;
    const modal = document.getElementById('budget-modal');

    if (!isNaN(parseFloat(budgetInput)) && parseFloat(budgetInput) > 0) {
        monthlyBudget = parseFloat(budgetInput);
        showFeedbackPopup("Monthly budget successfully added!");
        displayBudget();
        modal.style.display = 'none';
    } else {
        showFeedbackPopup("Please enter a valid budget amount!");
    }
});

// Handle close modal via X button
document.querySelector('#budget-modal .close').addEventListener('click', function () {
    document.getElementById('budget-modal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function (event) {
    const modal = document.getElementById('budget-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Function to display expenses
function displayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    const currentMonthExpenses = defaultExpenses.map(item => {
        const existingExpense = expenses.find(exp => exp && exp.name === item.name && exp.month === currentMonthIndex);
        return existingExpense ? existingExpense : { ...item, month: currentMonthIndex, amount: 0 };
    });

    currentMonthExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.textContent = `${expense.name}: `;

        const amountSpan = document.createElement('span');
        amountSpan.textContent = `$${expense.amount.toFixed(2)}`;
        li.appendChild(amountSpan);

        const triangle = document.createElement('div');
        triangle.className = 'triangle';
        triangle.onclick = function () { openUpdateModal(expense, index); };
        li.appendChild(triangle);

        expenseList.appendChild(li);
    });

    const totalAmount = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}

// Open modal for updating expense
function openUpdateModal(expense, index) {
    const modal = document.getElementById('update-modal');
    modal.style.display = 'block';

    document.getElementById('update-amount').value = '';

    document.getElementById('add-amount').onclick = function () {
        const amountToAdd = parseFloat(document.getElementById('update-amount').value);
        if (!isNaN(amountToAdd)) {
            expense.amount += amountToAdd;
            updateExpense(index, expense);
            showFeedbackPopup("Amount successfully added!");
            modal.style.display = 'none';
        }
    };

    document.getElementById('subtract-amount').onclick = function () {
        const amountToSubtract = parseFloat(document.getElementById('update-amount').value);
        if (!isNaN(amountToSubtract)) {
            expense.amount -= amountToSubtract;
            updateExpense(index, expense);
            showFeedbackPopup("Amount successfully subtracted!");
            modal.style.display = 'none';
        }
    };

    document.getElementById('reset-amount').onclick = function () {
        expense.amount = 0;
        updateExpense(index, expense);
        showFeedbackPopup("Amount successfully reset!");
        modal.style.display = 'none';
    };

    document.getElementById('enter-new-amount').onclick = function () {
        const newAmount = parseFloat(document.getElementById('update-amount').value);
        if (!isNaN(newAmount)) {
            expense.amount = newAmount;
            updateExpense(index, expense);
            showFeedbackPopup("New amount successfully entered!");
            modal.style.display = 'none';
        }
    };
}

// Update expenses in local storage and refresh display
function updateExpense(index, updatedExpense) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses[index] = updatedExpense;
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayCurrentMonth();
}

// Initialize the app
initializeMonthlyCalendar();
