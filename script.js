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
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (password === confirmPassword) {
        // Save user details to local storage
        localStorage.setItem('user', JSON.stringify({ email, username, password }));
        showFeedbackPopup("Sign-Up successful!"); // Show success message
        resetSignupForm(); // Reset the form after successful sign-up
    } else {
        showFeedbackPopup("Passwords don't match. Try again!"); // Show error message
    }
});

// Handle Log In
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page
    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;

    // Retrieve user data from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    // Validate credentials
    if (user && user.email === loginEmail && user.password === loginPassword) {
        showFeedbackPopup("Successfully logged in!"); // Success message
        setTimeout(() => {
            document.getElementById('auth-section').style.display = 'none'; // Hide auth section
            document.getElementById('expense-section').style.display = 'block'; // Show expense section
            initializeMonthlyCalendar(); // Initialize the calendar on login
        }, 4000); // Redirect after 4 seconds
    } else {
        showFeedbackPopup("Invalid credentials. Try again!"); // Error message
    }
});


// Handle Logout
document.getElementById('logout-button').addEventListener('click', function() {
    showFeedbackPopup("Logged out successfully!"); // Show feedback pop-up
    setTimeout(() => {
        document.getElementById('expense-section').style.display = 'none';
        document.getElementById('auth-section').style.display = 'block'; // Show auth section again
    }, 4000); // Redirect after 4 seconds
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
        }, 500); // Ensure popup fades out
    }, 4000);
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

   const prevMonthButton = document.getElementById('prev-month');
   const nextMonthButton = document.getElementById('next-month');

   prevMonthButton.removeEventListener('click', handlePrevMonth);
   nextMonthButton.removeEventListener('click', handleNextMonth);

   prevMonthButton.addEventListener('click', handlePrevMonth);
   nextMonthButton.addEventListener('click', handleNextMonth);
}

// Handle previous month button click
function handlePrevMonth() {
   currentMonthIndex = (currentMonthIndex - 1 + 12) % 12; // Go to previous month
   displayCurrentMonth();
}

// Handle next month button click
function handleNextMonth() {
   currentMonthIndex = (currentMonthIndex + 1) % 12; // Go to next month
   displayCurrentMonth();
}

// Handle SAVE button click
document.getElementById('save-expenses').addEventListener('click', function() {
   showFeedbackPopup("Saved successfully!"); // Show feedback pop-up for saving expenses
});

// Function to display expenses for the current month
function displayExpenses() {
   const expenses = JSON.parse(localStorage.getItem('expenses')) || []; // Get expenses from local storage

   const expenseList = document.getElementById('expense-list');
   expenseList.innerHTML = ''; // Clear existing list

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
       triangle.onclick = function() { openUpdateModal(expense, index); }; 
       li.appendChild(triangle); 

       expenseList.appendChild(li); 
   });

   const totalAmount = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
   document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}

// Open modal for updating expense
function openUpdateModal(expense, index) {
   const modal = document.getElementById('update-modal');
   const closeButton = document.querySelector('.close');
   const updateAmountInput = document.getElementById('update-amount');

   modal.style.display = 'block'; 
   updateAmountInput.value = ''; 

   // Add event listeners for update buttons with feedback messages
   document.getElementById('add-amount').onclick = function() {
       const amountToAdd = parseFloat(updateAmountInput.value);
       if (!isNaN(amountToAdd)) {
           expense.amount += amountToAdd;
           updateExpense(index, expense);
           showFeedbackPopup("Amount successfully added!"); // Feedback message for adding amount
           modal.style.display = 'none'; 
       }
   };

   document.getElementById('subtract-amount').onclick = function() {
       const amountToSubtract = parseFloat(updateAmountInput.value);
       if (!isNaN(amountToSubtract)) {
           expense.amount -= amountToSubtract;
           updateExpense(index, expense);
           showFeedbackPopup("Amount successfully subtracted!"); // Feedback message for subtracting amount
           modal.style.display = 'none'; 
       }
   };

   document.getElementById('reset-amount').onclick = function() {
       expense.amount = 0;
       updateExpense(index, expense);
       showFeedbackPopup("Amount successfully reset!"); // Feedback message for resetting amount
       modal.style.display = 'none'; 
   };

   document.getElementById('enter-new-amount').onclick = function() {
       const newAmount = parseFloat(updateAmountInput.value);
       if (!isNaN(newAmount)) {
           expense.amount = newAmount;
           updateExpense(index, expense);
           showFeedbackPopup("New amount successfully entered!"); // Feedback message for entering new amount
           modal.style.display = 'none'; 
       }
   };

   closeButton.onclick = function() {
       modal.style.display = 'none'; 
   };

   window.onclick = function(event) {
       if (event.target === modal) {
           modal.style.display = 'none'; 
       }
   };
}

// Update expense in local storage and refresh display
function updateExpense(index, updatedExpense) {
   const expenses = JSON.parse(localStorage.getItem('expenses')) || []; 

   if (updatedExpense.month === currentMonthIndex) {
       expenses[index] = updatedExpense; 
   }

   localStorage.setItem('expenses', JSON.stringify(expenses)); 
   displayCurrentMonth(); 
}

// Call displayExpenses on page load to show existing expenses
displayCurrentMonth();
