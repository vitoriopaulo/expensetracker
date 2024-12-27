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
    
    const currentMonthExpenses = Array.from(document.querySelectorAll('#expense-list li')).map((item, index) => {
        const amountText = item.querySelector('span').textContent;
        const amount = parseFloat(amountText.replace('$', ''));
        return { ...defaultExpenses[index], amount, month: currentMonthIndex };
    });

    const filteredExpenses = allExpenses.filter(exp => exp.month !== currentMonthIndex);

    localStorage.setItem('expenses', JSON.stringify([...filteredExpenses, { month: currentMonthIndex, data: currentMonthExpenses }]));

    console.log("Expenses Saved for Current Month:", currentMonthExpenses); // Debug
    showFeedbackPopup("Expenses saved successfully!");
});








// Handle Logout
document.getElementById('logout-button').addEventListener('click', function () {
    showFeedbackPopup("Logged out successfully!");
    setTimeout(() => {
        document.getElementById('expense-section').style.display = 'none';
        document.getElementById('auth-section').style.display = 'block';

        // Optionally, reset or reinitialize global variables if needed
        currentMonthIndex = new Date().getMonth();
        initializeMonthlyCalendar();
    }, 2000);
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
let currentMonthIndex = new Date().getMonth(); // Ensure this is initialized
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function initializeMonthlyCalendar() {
    displayCurrentMonth(); // Ensure this function is called to render the calendar
}





// Event listener for Previous button
document.getElementById('prev-month').addEventListener('click', function () {
    console.log("Previous button clicked"); // Debugging log
    currentMonthIndex = (currentMonthIndex - 1 + 12) % 12; // Move to previous month
    displayCurrentMonth();
});

// Event listener for Next button
document.getElementById('next-month').addEventListener('click', function () {
    console.log("Next button clicked"); // Debugging log
    currentMonthIndex = (currentMonthIndex + 1) % 12; // Move to next month
    displayCurrentMonth();
});

// Function to display the current month
function displayCurrentMonth() {
    // Ensure the calendar shows the current month
    document.getElementById('current-month').textContent = months[currentMonthIndex];

    // Fetch and display the current month's expenses
    displayExpenses();

    // Optionally render any related charts
    renderExpenseChart();
}

<<<<<<< HEAD
function displayCurrentMonth() {
    document.getElementById('current-month').textContent = months[currentMonthIndex];
    displayExpenses();
    displayBudget();
    renderExpenseChart(); // Updates Pie Chart
    updateLineChart();    // Updates Line Chart
}
=======






>>>>>>> dev


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
        triangle.onclick = function () {
            openUpdateModal(expense, index);
        };
        li.appendChild(triangle);

        expenseList.appendChild(li);
    });

    const totalAmount = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}


    // Update total amount
    const totalAmount = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
function displayExpenses() {
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);

    // If no data for the current month, initialize with default expenses
    if (!currentMonthData) {
        currentMonthData = {
            month: currentMonthIndex,
            data: defaultExpenses.map(exp => ({ ...exp }))
        };
        allExpenses.push(currentMonthData);
        localStorage.setItem('expenses', JSON.stringify(allExpenses));
    }

    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = ''; // Clear the current list

    currentMonthData.data.forEach((expense, index) => {
        const li = document.createElement('li');
        li.textContent = `${expense.name}: `;

        const amountSpan = document.createElement('span');
        amountSpan.textContent = `$${expense.amount.toFixed(2)}`;
        li.appendChild(amountSpan);

        const triangle = document.createElement('div');
        triangle.className = 'triangle';
        triangle.onclick = function () {
            openUpdateModal(expense, index);
        };
        li.appendChild(triangle);

        expenseList.appendChild(li);
    });

    // Update total amount
    const totalAmount = currentMonthData.data.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}



function renderExpenseChart() {
    const ctx = document.getElementById('expense-pie-chart').getContext('2d');

    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);

    console.log("Current Month Data for Pie Chart:", currentMonthData); // Debug

    if (!currentMonthData || !currentMonthData.data) {
        console.log("No data available for the current month. Initializing empty chart.");
        if (expensePieChart) {
            expensePieChart.destroy();
        }
        expensePieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: []
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
        return;
    }

    const labels = currentMonthData.data.map(exp => exp.name);
    const data = currentMonthData.data.map(exp => exp.amount);

    console.log("Labels for Pie Chart:", labels); // Debug
    console.log("Data for Pie Chart:", data); // Debug

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
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#D3D3D3', // Light gray text for legend
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `$${context.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}



<<<<<<< HEAD
function renderLineChart(labels, data) {
    const ctx = document.getElementById('expense-line-chart').getContext('2d');
    const expenseLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // X-axis labels (Months)
            datasets: [{
                label: 'Monthly Expenses',
                data: data, // Y-axis data
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4, // Smooth curve
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#D3D3D3', // Light gray text for legend
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `$${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Months',
                        color: '#D3D3D3' // Light gray text for X-axis title
                    },
                    ticks: {
                        color: '#D3D3D3' // Light gray text for X-axis tick labels
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Total Expense ($)',
                        color: '#D3D3D3' // Light gray text for Y-axis title
                    },
                    ticks: {
                        color: '#D3D3D3', // Light gray text for Y-axis tick labels
                    },
                    beginAtZero: true
                }
            }
        }
    });

    console.log("Line Chart Rendered", labels, data); // Debugging log
}



function updateLineChart() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const monthlyTotals = Array(12).fill(0); // Initialize totals for 12 months

    expenses.forEach(expense => {
        if (expense && expense.month >= 0 && expense.month < 12) {
            monthlyTotals[expense.month] += expense.amount;
        }
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    renderLineChart(months, monthlyTotals);
}









=======
>>>>>>> dev
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

    // Find or initialize current month data
    let currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);
    if (!currentMonthData) {
        currentMonthData = {
            month: currentMonthIndex,
            data: defaultExpenses.map(exp => ({ ...exp }))
        };
        allExpenses.push(currentMonthData);
    }

    // Update the specific expense
    currentMonthData.data[index] = updatedExpense;

    // Save back to localStorage
    localStorage.setItem('expenses', JSON.stringify(allExpenses));
    displayCurrentMonth(); // Refresh UI
}



// Initialize the app
initializeMonthlyCalendar();



document.getElementById('prev-month').addEventListener('click', function () {
    currentMonthIndex = (currentMonthIndex - 1 + 12) % 12; // Go to previous month
    displayCurrentMonth(); // Update the display
});

document.getElementById('next-month').addEventListener('click', function () {
    currentMonthIndex = (currentMonthIndex + 1) % 12; // Go to next month
    displayCurrentMonth(); // Update the display
});





function initializeApp() {
    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([]));
    }
    initializeMonthlyCalendar();
}
initializeApp();


