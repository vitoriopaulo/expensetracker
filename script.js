// Reset local storage for testing
localStorage.removeItem('user');
console.log("Local storage has been reset for testing.");





localStorage.clear();
console.log("Local storage has been reset for testing.");



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
let expensePieChart;



function initializeMonthlyCalendar() {
    displayCurrentMonth();
}



// Handle Sign Up
// Handle Sign Up
// Handle Sign Up
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    console.log("Entered email during Sign Up:", email); // Debugging log for email
    console.log("Entered username during Sign Up:", username); // Debugging log for username

    if (!email || !username || !password) {
        showFeedbackPopup("All fields are required. Please fill out the form.");
        return;
    }

    if (password !== confirmPassword) {
        showFeedbackPopup("Passwords do not match. Try again!");
        return;
    }

    // Encrypt the password
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret-key').toString();

    // Save the user data
    const userData = { email, username, password: encryptedPassword };
    localStorage.setItem('user', JSON.stringify(userData));

    console.log("User data saved after Sign Up:", userData); // Debugging log for saved data
    showFeedbackPopup("Sign Up successful!");
    resetSignupForm();
});






// Handle Log In
// Handle Log In
// Handle Log In
// Handle Log In
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const loginEmail = document.getElementById('login-email').value.trim();
    const loginPassword = document.getElementById('login-password').value.trim();

    console.log("Entered email during Log In:", loginEmail); // Debugging log for login email

    if (!loginEmail || !loginPassword) {
        showFeedbackPopup("Please enter your email and password.");
        return;
    }

    // Retrieve user data from local storage
    const storedData = localStorage.getItem('user');
    if (!storedData) {
        showFeedbackPopup("No user data found. Please Sign Up first.");
        console.error("No user data in local storage.");
        return;
    }

    const user = JSON.parse(storedData);
    console.log("Stored user data during Log In:", user); // Debugging log for stored data

    // Compare email
    if (user.email !== loginEmail) {
        showFeedbackPopup("Email not found or mismatch. Please try again.");
        console.error(`Login failed: Entered email (${loginEmail}) does not match stored email (${user.email}).`);
        return;
    }

    // Decrypt and compare password
    const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret-key').toString(CryptoJS.enc.Utf8);
    console.log("Decrypted password during Log In:", decryptedPassword);

    if (decryptedPassword !== loginPassword) {
        showFeedbackPopup("Invalid password. Please try again.");
        console.error(`Login failed: Entered password (${loginPassword}) does not match decrypted password (${decryptedPassword}).`);
        return;
    }

    // Successful login
    showFeedbackPopup("Successfully logged in!");
    setTimeout(() => {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('expense-section').style.display = 'block';
        initializeMonthlyCalendar();
        displayBudget();
        displayExpenses();
        renderExpenseChart();
    }, 2000);
});







// Handle SAVE button click
document.getElementById('save-expenses').addEventListener('click', function () {
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Map current expenses from display to store in localStorage
    const currentMonthExpenses = Array.from(document.querySelectorAll('#expense-list li')).map((item, index) => {
        const amountText = item.querySelector('span').textContent;
        const amount = parseFloat(amountText.replace('$', ''));
        return { ...defaultExpenses[index], amount, month: currentMonthIndex };
    });

    // Filter out the current month from the existing data and merge
    const updatedExpenses = allExpenses.filter(exp => exp.month !== currentMonthIndex).concat(currentMonthExpenses);

    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    showFeedbackPopup("Expenses saved successfully!");
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
    renderExpenseChart();
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
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);

    // If no data exists for the current month, initialize it
    const currentMonthExpenses = currentMonthData
        ? currentMonthData.data
        : defaultExpenses.map(exp => ({ ...exp, month: currentMonthIndex }));

    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

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


function renderExpenseChart() {
    const ctx = document.getElementById('expense-pie-chart').getContext('2d');

    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);

    if (!currentMonthData || currentMonthData.data.every(exp => exp.amount === 0)) {
        console.log("No expenses to display in Pie Chart");
        return;
    }

    const labels = currentMonthData.data.map(exp => exp.name);
    const data = currentMonthData.data.map(exp => exp.amount);

    if (expensePieChart) {
        expensePieChart.destroy();
    }

    expensePieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6347'
                ]
            }]
        },
        options: {
            plugins: {
                legend: { display: true, position: 'top' }
            }
        }
    });
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
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Find or initialize current month's data
    let currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);
    if (!currentMonthData) {
        currentMonthData = { month: currentMonthIndex, data: [...defaultExpenses] };
        allExpenses.push(currentMonthData);
    }

    // Update the specific expense
    currentMonthData.data[index] = updatedExpense;

    // Save back to local storage
    localStorage.setItem('expenses', JSON.stringify(allExpenses));
    displayCurrentMonth(); // Refresh UI
}


// Initialize the app
initializeMonthlyCalendar();



document.getElementById('prev-month').addEventListener('click', function () {
    currentMonthIndex = (currentMonthIndex - 1 + 12) % 12;
    displayCurrentMonth();
});

document.getElementById('next-month').addEventListener('click', function () {
    currentMonthIndex = (currentMonthIndex + 1) % 12;
    displayCurrentMonth();
});




function initializeApp() {
    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([]));
    }
    initializeMonthlyCalendar();
}
initializeApp();


