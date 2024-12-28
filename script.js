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


function getCurrentMonthExpenses() {
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);

    // Debugging log to ensure correct data fetching
    console.log("Fetching current month's expenses:", currentMonthData);

    return currentMonthData ? currentMonthData.data : [];
}





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




document.getElementById('export-button').addEventListener('click', () => {
    console.log("Export button clicked");

    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.style.display = 'block';
        console.log("Export modal opened"); // Debugging log
    } else {
        console.error("Export modal not found!");
    }
});





// Close modal when X is clicked
document.querySelector('#export-modal .close').addEventListener('click', () => {
    document.getElementById('export-modal').style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('export-modal')) {
        document.getElementById('export-modal').style.display = 'none';
    }
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
    document.getElementById('current-month').textContent = months[currentMonthIndex];
    console.log("Displaying current month:", months[currentMonthIndex]); // Debug log

    displayExpenses();
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
    const currentMonthExpenses = getCurrentMonthExpenses();

    // Debug log to ensure current month expenses are fetched
    console.log("Displaying expenses for current month:", currentMonthExpenses);

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.warn("No expenses available to display."); // Warning log
        return;
    }

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
        triangle.onclick = () => openUpdateModal(expense, index);
        li.appendChild(triangle);

        expenseList.appendChild(li);
    });

    const totalAmount = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log("Total amount calculated:", totalAmount); // Debug log
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}



    // Update total amount
    const currentMonthExpenses = getCurrentMonthExpenses();
    const totalAmount = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    function displayExpenses() {
        const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        let currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);
    
        // Initialize current month data if not found
        if (!currentMonthData) {
            currentMonthData = {
                month: currentMonthIndex,
                data: defaultExpenses.map(exp => ({ ...exp })),
            };
            allExpenses.push(currentMonthData);
            localStorage.setItem('expenses', JSON.stringify(allExpenses));
        }
    
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = ''; // Clear the list
    
        currentMonthData.data.forEach((expense, index) => {
            const li = document.createElement('li');
            li.textContent = `${expense.name}: `;
    
            const amountSpan = document.createElement('span');
            amountSpan.textContent = `$${expense.amount.toFixed(2)}`;
            li.appendChild(amountSpan);
    
            const triangle = document.createElement('div');
            triangle.className = 'triangle';
            triangle.onclick = () => openUpdateModal(expense, index);
            li.appendChild(triangle);
    
            expenseList.appendChild(li);
        });
    
        // Update total amount
        const totalAmount = currentMonthData.data.reduce((total, expense) => total + expense.amount, 0);
        document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    }
    



    document.getElementById('export-pdf').addEventListener('click', () => {
        const currentMonthExpenses = getCurrentMonthExpenses();
        if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
            console.error("No data available for export.");
            showFeedbackPopup("No data to export for this month!");
            return;
        }
    
        const canvas = document.getElementById('expense-pie-chart');
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 40, 180, 160);
        pdf.save('expense-chart.pdf');
        showFeedbackPopup("Pie Chart exported as PDF successfully!");
        document.getElementById('export-modal').style.display = 'none';
    });
    
    
    

    


    
    document.getElementById('export-csv').addEventListener('click', () => {
        const currentMonthExpenses = getCurrentMonthExpenses();
        if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
            console.error("No data available for export.");
            showFeedbackPopup("No data to export for this month!");
            return;
        }
    
        const csvContent = "data:text/csv;charset=utf-8," +
            currentMonthExpenses.map(e => `${e.name},${e.amount}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'monthly-expenses.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        showFeedbackPopup("Data exported as CSV successfully!");
        document.getElementById('export-modal').style.display = 'none';
    });
    
    
    



    
    document.getElementById('export-ods').addEventListener('click', () => {
        const currentMonthExpenses = getCurrentMonthExpenses();
        if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
            console.error("No data available for export.");
            showFeedbackPopup("No data to export for this month!");
            return;
        }
    
        const odsContent = `Name\tAmount\n` +
            currentMonthExpenses.map(e => `${e.name}\t${e.amount}`).join("\n");
        const blob = new Blob([odsContent], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'monthly-expenses.ods';
        link.click();
    
        showFeedbackPopup("Data exported as ODS successfully!");
        document.getElementById('export-modal').style.display = 'none';
    });    
    
    
    document.getElementById('export-modal').style.display = 'none';






    function exportData() {
        const currentMonthData = expenses.find(exp => exp.month === currentMonthIndex);
        if (!currentMonthData || !currentMonthData.data.length) {
            console.error("No data available for export."); // Debugging log for missing data
            showFeedbackPopup('No data to export for this month!'); 
            return; // This is valid only inside a function
        }
    
        // Proceed with data export logic here...
    }

    
    



    function renderExpenseChart() {
        const ctx = document.getElementById('expense-pie-chart').getContext('2d');
        const currentMonthExpenses = getCurrentMonthExpenses();
    
        // Debug log for chart data
        console.log("Rendering chart for current month expenses:", currentMonthExpenses);
    
        if (!currentMonthExpenses || currentMonthExpenses.every(exp => exp.amount === 0)) {
            console.warn("No valid data to render chart."); // Warning log
            return;
        }
    
        const labels = currentMonthExpenses.map(exp => exp.name);
        const data = currentMonthExpenses.map(exp => exp.amount);
    
        console.log("Labels for Pie Chart:", labels); // Debug log
        console.log("Data for Pie Chart:", data); // Debug log
    
        if (expensePieChart) {
            expensePieChart.destroy();
        }
    
        expensePieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6347']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
    
    



/// Export Data as CSV
document.getElementById('export-csv').addEventListener('click', () => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    console.log("Exporting to CSV. Current month expenses:", currentMonthExpenses); // Debug log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Error log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," +
        currentMonthExpenses.map(e => `${e.name},${e.amount}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'monthly-expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showFeedbackPopup("Data exported as CSV successfully!");
    document.getElementById('export-modal').style.display = 'none';
});


// Export Data as ODS
document.getElementById('export-ods').addEventListener('click', () => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    console.log("Exporting to ODS. Current month expenses:", currentMonthExpenses); // Debug log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Error log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const odsContent = `Name\tAmount\n` +
        currentMonthExpenses.map(e => `${e.name}\t${e.amount}`).join("\n");
    const blob = new Blob([odsContent], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'monthly-expenses.ods';
    link.click();

    showFeedbackPopup("Data exported as ODS successfully!");
    document.getElementById('export-modal').style.display = 'none';
});


// Export Pie Chart as PDF
document.getElementById('export-pdf').addEventListener('click', () => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    console.log("Exporting to PDF. Current month expenses:", currentMonthExpenses); // Debug log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Error log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const canvas = document.getElementById('expense-pie-chart');
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 40, 180, 160);
    pdf.save('expense-chart.pdf');
    showFeedbackPopup("Pie Chart exported as PDF successfully!");
    document.getElementById('export-modal').style.display = 'none';
});






document.getElementById('export-pdf').addEventListener('click', () => {
    console.log("Export PDF button clicked."); // Debugging log
    exportPieChartAsPDF();
});


document.getElementById('export-csv').addEventListener('click', () => {
    console.log("Export CSV button clicked."); // Debugging log
    exportDataAsCSV();
});

document.getElementById('export-ods').addEventListener('click', () => {
    console.log("Export ODS button clicked."); // Debugging log
    exportDataAsODS();
});






function exportPieChartAsPDF() {
    // Ensure the canvas element exists
    const canvas = document.getElementById('expense-pie-chart');
    if (!canvas) {
        console.error("Pie chart canvas not found."); // Debugging log
        showFeedbackPopup("Pie chart not found. Cannot export as PDF.");
        return;
    }

    // Import jsPDF if necessary (in case it's not globally available)
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error("jsPDF library is not loaded."); // Debugging log
        showFeedbackPopup("Failed to load PDF library. Please try again.");
        return;
    }

    // Generate PDF
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 15, 40, 180, 160);
    pdf.save('expense-chart.pdf');

    // Feedback for successful export
    showFeedbackPopup("Pie Chart exported as PDF successfully!");
    document.getElementById('export-modal').style.display = 'none';
}






function exportDataAsCSV() {
    const currentMonthExpenses = getCurrentMonthExpenses();

    console.log("Exporting data as CSV for current month:", currentMonthExpenses); // Debugging log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Debugging log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," +
        currentMonthExpenses.map(exp => `${exp.name},${exp.amount}`).join("\n");

    console.log("CSV Content:", csvContent); // Debugging log

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'monthly-expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showFeedbackPopup("Data exported as CSV successfully!");
    console.log("Data exported as CSV."); // Debugging log
}







function exportDataAsODS() {
    const currentMonthExpenses = getCurrentMonthExpenses();

    console.log("Exporting data as ODS for current month:", currentMonthExpenses); // Debugging log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Debugging log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const odsContent = `Name\tAmount\n` +
        currentMonthExpenses.map(exp => `${exp.name}\t${exp.amount}`).join("\n");

    console.log("ODS Content:", odsContent); // Debugging log

    const blob = new Blob([odsContent], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'monthly-expenses.ods';
    link.click();

    showFeedbackPopup("Data exported as ODS successfully!");
    console.log("Data exported as ODS."); // Debugging log
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
                    position: 'top'
                }
            }
        }
    });




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




document.getElementById('export-button').addEventListener('click', () => {
    const modal = document.getElementById('export-modal');
    modal.style.display = 'block';
    console.log("Export modal opened"); // Debug
});

// Close modal
document.querySelector('#export-modal .close').addEventListener('click', () => {
    document.getElementById('export-modal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('export-modal')) {
        document.getElementById('export-modal').style.display = 'none';
    }
});





// Initialize the app
initializeMonthlyCalendar();



document.getElementById('prev-month').addEventListener('click', () => {
    currentMonthIndex = (currentMonthIndex - 1 + 12) % 12;
    displayCurrentMonth();
    console.log("Previous month displayed:", months[currentMonthIndex]);
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonthIndex = (currentMonthIndex + 1) % 12;
    displayCurrentMonth();
    console.log("Next month displayed:", months[currentMonthIndex]);
});






function initializeApp() {
    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([]));
        console.log("Expenses initialized in local storage."); // Debug log
    }

    // Debug log to confirm initialization
    console.log("Initializing app...");
    initializeMonthlyCalendar();
}
initializeApp();