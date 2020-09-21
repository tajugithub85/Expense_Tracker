(function () {

    // initial array of expenses, reading from localStorage

    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    document.getElementById('exp-Form').addEventListener('submit', function (e) {

        e.preventDefault();

        // get type, name, date, and amount
        let type = document.getElementById('type').value;
        let name = document.getElementById('name').value;
        let date = document.getElementById('date').value;
        var amount = parseInt(document.getElementById('amount').value);
        if (type == 'chooseOne' || name.length <= 0 || date == '') {
            return;
        }

        var expense = {
            type,
            name,
            date,
            amount,
            id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
        }

        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses))
        totalExpense();
        document.getElementById('exp-Form').reset();
        showExpenses();

    });

    console.log(expenses);

    let cardTotal, cashTotal, cryptoTotal, othersTotal;
    let cardArray = [];
    let cashArray = [];
    let cryptoArray = [];
    let othersArray = [];
    expenses.forEach(function (expense) {
        if (expense.type === 'cash') {
            cashArray.push(expense.amount);
            cashTotal = cashArray.reduce((a, b) => a + b, 0);
        } else if (expense.type === 'card') {
            cardArray.push(expense.amount);
            cardTotal = cardArray.reduce((a, b) => a + b, 0);
        } else if (expense.type === 'cryptocoin') {
            cryptoArray.push(expense.amount)
            cryptoTotal = cryptoArray.reduce((a, b) => a + b, 0);
        } else if (expense.type === 'other') {
            othersArray.push(expense.amount)
            othersTotal = othersArray.reduce((a, b) => a + b, 0);
        }
    });

    var amountArray = [cardTotal, cashTotal, cryptoTotal, othersTotal];

    console.log(amountArray)



    function totalExpense() {
        var totalExpense = document.getElementById("expense-amount");
        let total = expenses.reduce((sum, a) => {
            return sum + a.amount;
        }, 0);
        totalExpense.innerText = total;

    }


    function showExpenses() {

        const expenseTable = document.getElementById('expenseTable');
        expenseTable.innerHTML = '';

        if (expenses.length > 0) {
            for (let i = 0; i < expenses.length; i++) {

                expenseTable.appendChild(createDataRow(expenses[i]));

            } // end of for loop
        } else {
            // expenses count is 0
            expenseTable.appendChild(createEmptyRow());
        }

    }

    function createEmptyRow() {
        const expenseRowEl = document.createElement('TR');

        const expenseTdTypeEl = document.createElement('TD');
        expenseTdTypeEl.setAttribute('colspan', 5);
        expenseTdTypeEl.textContent =
            'No expense items yet! Please add one up top...';
        expenseRowEl.appendChild(expenseTdTypeEl);

        return expenseRowEl;
    }

    function createDataRow(expense) {

        const expenseRowEl = document.createElement('TR');

        const expenseTdTypeEl = document.createElement('TD');
        expenseTdTypeEl.textContent = expense.type;
        expenseRowEl.appendChild(expenseTdTypeEl);

        const expenseTdNameEl = document.createElement('TD');
        expenseTdNameEl.textContent = expense.name;
        expenseRowEl.appendChild(expenseTdNameEl);

        const expenseTdDateEl = document.createElement('TD');
        expenseTdDateEl.textContent = expense.date;
        expenseRowEl.appendChild(expenseTdDateEl);

        const expenseTdAmountEl = document.createElement('TD');
        expenseTdAmountEl.textContent = '$' + expense.amount;
        expenseRowEl.appendChild(expenseTdAmountEl);

        const expenseTdOptionsEl = document.createElement('TD');
        const deleteAnchorEl = document.createElement('A');
        deleteAnchorEl.className = "deleteButton";
        deleteAnchorEl.onclick = function (e) {
            deleteExpense(expense.id);


            // localStorage
            localStorage.setItem('expenses', JSON.stringify(expenses));
            showExpenses();
        }

        deleteAnchorEl.innerHTML = `<button type="button" id= "rem" class="btn btn-danger pt-2"><i class="fa fa-trash" aria-hidden="true"></i></button>`;
        expenseRowEl.appendChild(deleteAnchorEl);

        const expenseTdOptionsE2 = document.createElement('TD');
        const ModifyAnchorE2 = document.createElement('A');
        ModifyAnchorE2.className = "ModifyButton";
        ModifyAnchorE2.onclick = function (e) {
            let name = document.getElementById('name').value;
            if (name.value == "") {
                alert('please enter Modify')
            } else {
                ModifyExpense(expense.id);

                localStorage.setItem('expenses', JSON.stringify(expenses));
                showExpenses();
            }
        }
        // ModifyAnchorE2.innerHTML = '<button type="button" id= "modify" class="btn btn-primary ml-2" >Modify</button>';
        expenseRowEl.appendChild(ModifyAnchorE2);


        return expenseRowEl;

    }

    function deleteExpense(id) {
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].id == id) {
                expenses.splice(i, 1);

            }
            totalExpense()
        }


    }

    showExpenses();

    function ModifyExpense(id) {
        let name = document.getElementById('name').value;
        if (name === '') {
            alert('please enter modify')
        } else {
            for (let i = 0; i < expenses.length; i++) {
                if (expenses[i].id == id) {
                    expenses.splice(i, 1);
                    let type = document.getElementById('type').value;
                    let name = document.getElementById('name').value;
                    let date = document.getElementById('date').value;
                    let amount = document.getElementById('amount').value;
                    if (type == 'chooseOne' || name.length <= 0 || date == '') {
                        return;
                    }
                    const expense = {
                        type,
                        name,
                        date,
                        amount,
                        id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
                    }

                    expenses.push(expense);
                    // localStorage 
                    localStorage.setItem('expenses', JSON.stringify(expenses));

                    document.getElementById('exp-Form').reset();
                    showExpenses();
                    totalExpense();
                }
            }
        }
    }




    showExpenses();

    totalExpense();

    let weeklyTransactionsChart = document.getElementById('transactionsChart').getContext('2d');
    let monthlyTransactionsChart = document.getElementById('transactionsChart').getContext('2d');
    let yearlyTransactionsChart = document.getElementById('transactionsChart').getContext('2d');

    // import { amountArray } from 'app.js;'

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Source Sans Pro, sans-serif';
    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontColor = 'black';
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.tooltips.enabled = true;
    Chart.defaults.scale.gridLines.display = false;
    Chart.defaults.scale.ticks.beginAtZero = true;

    window.onload = expenseData();

    function expenseData() {
        let ExpenseChart = new Chart(monthlyTransactionsChart, {
            type: 'doughnut',
            data: {
                labels: ['Card', 'Cash', 'Cryptocoin', 'Others'],
                datasets: [{
                    label: 'TotalExpense',

                    data: amountArray.map(amount => amount),
                    backgroundColor: ["red", "blue", "green", "yellow"],

                }]

            },
            options: {
                responsive: true,
                legend: {
                    display: true,
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: true,
                        }
                    }]
                },

            }
        });
    }
})();