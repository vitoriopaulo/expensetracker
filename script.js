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

// Handle Sign Up
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Save to local storage
    localStorage.setItem('user', JSON.stringify({ email, username, password }));
    showFeedbackPopup("Sign up successful!"); // Show feedback pop-up
    resetSignupForm(); // Reset the form after showing feedback
});

// Handle Log In
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === loginEmail && user.password === loginPassword) {
        showFeedbackPopup("Log in successful!"); // Show feedback pop-up
        setTimeout(() => {
            document.getElementById('auth-section').style.display = 'none'; // Hide auth section
            document.getElementById('expense-section').style.display = 'block'; // Show expense section
            initializeMonthlyCalendar(); // Initialize the calendar on login
        }, 5000); // Redirect after 5 seconds
    } else {
        alert('Invalid credentials!');
    }
});

// Handle Logout
document.getElementById('logout-button').addEventListener('click', function() {
    // Logout logic here (if applicable)
    showFeedbackPopup("Logged out successfully!"); // Show feedback pop-up
    setTimeout(() => {
        // Redirect to authentication page (first level of navigation)
        document.getElementById('expense-section').style.display = 'none';
        document.getElementById('auth-section').style.display = 'block';
    }, 5000); // Redirect after 5 seconds
});

// Function to show feedback popup
function showFeedbackPopup(message) {
    const popup = document.getElementById('feedback-popup');
    popup.textContent = message;
    popup.style.display = 'block'; // Show the popup

    setTimeout(() => {
        popup.style.display = 'none'; // Hide the popup after 5 seconds
    }, 5000);
}

// Function to reset the Sign Up form
function resetSignupForm() {
    document.getElementById('signup-form').reset();
}

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

    // Remove existing event listeners to prevent duplication
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    prevMonthButton.removeEventListener('click', handlePrevMonth);
    nextMonthButton.removeEventListener('click', handleNextMonth);

    // Add new event listeners
    prevMonthButton.addEventListener('click', handlePrevMonth);
    nextMonthButton.addEventListener('click', handleNextMonth);
}

// Handle previous month button click
function handlePrevMonth() {
    currentMonthIndex = (currentMonthIndex - 1 + 12) % 12; // Go to previous month
    console.log('Current Month Index (Prev):', currentMonthIndex); // Debugging
    displayCurrentMonth();
}

// Handle next month button click
function handleNextMonth() {
    currentMonthIndex = (currentMonthIndex + 1) % 12; // Go to next month
    console.log('Current Month Index (Next):', currentMonthIndex); // Debugging
    displayCurrentMonth();
}

// Handle SAVE button click
document.getElementById('save-expenses').addEventListener('click', function() {
    // Save expenses logic here (if applicable)
    showFeedbackPopup("Saved successfully!"); // Show feedback pop-up
});

// Function to display expenses for the current month
function displayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || []; // Get expenses from local storage
    console.log('Expenses:', expenses); // Debugging: Check expenses in console
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = ''; // Clear existing list

    // Initialize default expenses for the current month
    const currentMonthExpenses = defaultExpenses.map(item => {
        const existingExpense = expenses.find(exp => exp && exp.name === item.name && exp.month === currentMonthIndex);
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
        li.appendChild(triangle); // Append the triangle icon to the list item
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
        } else {
            console.error('Invalid amount to add:', updateAmountInput.value); // Debugging
        }
    };

    document.getElementById('subtract-amount').onclick = function() {
        const amountToSubtract = parseFloat(updateAmountInput.value);
        if (!isNaN(amountToSubtract)) {
            expense.amount -= amountToSubtract;
            updateExpense(index, expense);
            modal.style.display = 'none'; // Close modal
        } else {
            console.error('Invalid amount to subtract:', updateAmountInput.value); // Debugging
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
        } else {
            console.error('Invalid new amount:', updateAmountInput.value); // Debugging
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
    const expenses = JSON.parse(localStorage.getItem('expenses')) || []; // Get expenses from local storage
    if (updatedExpense.month === currentMonthIndex) {
        expenses[index] = updatedExpense; // Update the specific expense
    }
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Save updated expenses
    displayCurrentMonth(); // Refresh the expense list display
}

// Call displayExpenses on page load to show existing expenses
displayCurrentMonth();
