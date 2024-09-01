// Boilerplate expenses
const defaultExpenses = [
    { name: "Rent", amount: 0 },
    { name: "Condo fee", amount: 0 },
    { name: "Tax property fee", amount: 0 },
    { name: "Groceries", amount: 0 },
    { name: "Utilities", amount: 0 },
    { name: "Health Plan", amount: 0 },
    { name: "Medicines", amount: 0 },
    { name: "Doctors appointments", amount: 0 },
    { name: "Psychotherapy", amount: 0 },
    { name: "Gym", amount: 0 },
    { name: "Leisure", amount: 0 },
    { name: "Others", amount: 0 },
];

// Handle Sign Up
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Save to local storage
    localStorage.setItem('user', JSON.stringify({ email, username, password }));
    alert('User signed up successfully!');
});

// Handle Log In
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === loginEmail && user.password === loginPassword) {
        alert('Login successful!');
        document.getElementById('auth-section').style.display = 'none'; // Hide auth section
        document.getElementById('expense-section').style.display = 'block'; // Show expense section
        initializeMonthlyCalendar(); // Initialize the calendar on login
    } else {
        alert('Invalid credentials!');
    }
});

// Initialize monthly calendar
let currentMonthIndex = new Date().getMonth(); // Get current month index (0-11)
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Function to initialize the monthly calendar
function initializeMonthlyCalendar() {
    displayCurrentMonth(); // Call to display the current month
}

// Function to display the current month
function displayCurrentMonth() {
    document.getElementById('current-month').textContent = months[currentMonthIndex];
    displayExpenses(); // Display expenses for the current month
}

// Handle previous month button click
document.getElementById('prev-month').addEventListener('click', function() {
    currentMonthIndex = (currentMonthIndex - 1 + 12) % 12; // Go to previous month
    displayCurrentMonth();
});

// Handle next month button click
document.getElementById('next-month').addEventListener('click', function() {
    currentMonthIndex = (currentMonthIndex + 1) % 12; // Go to next month
    displayCurrentMonth();
});

// Handle Expense Submission
document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = document.getElementById('expense-amount').value;

    // Create an expense object
    const expense = {
        name: expenseName,
        amount: parseFloat(expenseAmount),
        month: currentMonthIndex // Store the month of the expense
    };

    // Get existing expenses from local storage or initialize an empty array
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense); // Add new expense to the array

    // Save updated expenses to local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Reset the form
    document.getElementById('expense-form').reset();

    // Update the expense list display
    displayCurrentMonth();
});

// Handle SAVE button click
document.getElementById('save-expenses').addEventListener('click', function() {
    alert('Expenses saved successfully!'); // Placeholder for save functionality
});

// Function to display expenses for the current month
function displayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = ''; // Clear existing list

    // Initialize default expenses for the current month
    const currentMonthExpenses = defaultExpenses.map(item => {
        const existingExpense = expenses.find(exp => exp.name === item.name && exp.month === currentMonthIndex);
        return existingExpense ? existingExpense : { ...item, month: currentMonthIndex, amount: 0 }; // Ensure amount is initialized
    });

    currentMonthExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.textContent = `${expense.name}: `; // Set the text content for the expense name
        const amountSpan = document.createElement('span'); // Create a span for the amount
        amountSpan.textContent = `$${expense.amount.toFixed(2)}`; // Set the amount text
        li.appendChild(amountSpan); // Append the amount span to the list item
        
        // Create triangle icon for options
        const triangle = document.createElement('div');
        triangle.className = 'triangle';
        triangle.onclick = function() {
            openUpdateModal(expense, index);
        };
        
        li.appendChild(triangle);
        expenseList.appendChild(li);
    });

    // Calculate and display total amount for the current month
    const totalAmount = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}

// Open modal for updating expense
function openUpdateModal(expense, index) {
    const modal = document.getElementById('update-modal');
    const closeButton = document.querySelector('.close');
    const updateAmountInput = document.getElementById('update-amount');

    modal.style.display = 'block'; // Show modal
    updateAmountInput.value = ''; // Clear input

    // Add event listeners for update buttons
    document.getElementById('add-amount').onclick = function() {
        const amountToAdd = parseFloat(updateAmountInput.value);
        if (!isNaN(amountToAdd)) {
            expense.amount += amountToAdd;
            updateExpense(index, expense);
            modal.style.display = 'none'; // Close modal
        }
    };

    document.getElementById('subtract-amount').onclick = function() {
        const amountToSubtract = parseFloat(updateAmountInput.value);
        if (!isNaN(amountToSubtract)) {
            expense.amount -= amountToSubtract;
            updateExpense(index, expense);
            modal.style.display = 'none'; // Close modal
        }
    };

    document.getElementById('reset-amount').onclick = function() {
        expense.amount = 0;
        updateExpense(index, expense);
        modal.style.display = 'none'; // Close modal
    };

    document.getElementById('enter-new-amount').onclick = function() {
        const newAmount = parseFloat(updateAmountInput.value);
        if (!isNaN(newAmount)) {
            expense.amount = newAmount;
            updateExpense(index, expense);
            modal.style.display = 'none'; // Close modal
        }
    };

    closeButton.onclick = function() {
        modal.style.display = 'none'; // Close modal
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Close modal on outside click
        }
    };
}

// Update expense in local storage and refresh display
function updateExpense(index, updatedExpense) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    if (updatedExpense.month === currentMonthIndex) {
        expenses[index] = updatedExpense; // Update the specific expense
    }
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Save updated expenses
    displayCurrentMonth(); // Refresh the expense list display
}

// Call displayExpenses on page load to show existing expenses
displayCurrentMonth();