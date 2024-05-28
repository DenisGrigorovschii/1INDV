document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('result');
    const tableBody = document.querySelector('#transactionTable tbody');
    let transactions = [];

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            transactions = JSON.parse(event.target.result);
            displayResult('Транзакции успешно загружены.');
            displayTransactions(transactions);
        };

        reader.onerror = function() {
            displayResult('Произошла ошибка при чтении файла.');
        };

        reader.readAsText(file);
    });

    function displayResult(message) {
        resultDiv.textContent = message;
    }

    function displayTransactions(transactions) {
        tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением новых строк
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.transaction_id}</td>
                <td>${transaction.transaction_date}</td>
                <td>${transaction.transaction_amount}</td>
                <td>${transaction.transaction_type}</td>
                <td>${transaction.transaction_description}</td>
                <td>${transaction.merchant_name}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function displayAnalysisResult(result) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    }

    function getUniqueTransactionTypes(transactions) {
        return [...new Set(transactions.map(transaction => transaction.transaction_type))];
    }

    function calculateTotalAmount(transactions) {
        return transactions.reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    function calculateTotalAmountByDate(transactions, year, month, day) {
        return transactions.reduce((total, transaction) => {
            const date = new Date(transaction.transaction_date);
            const matchesYear = year ? date.getFullYear() === year : true;
            const matchesMonth = month ? date.getMonth() + 1 === month : true;
            const matchesDay = day ? date.getDate() === day : true;
            if (matchesYear && matchesMonth && matchesDay) {
                return total + parseFloat(transaction.transaction_amount);
            }
            return total;
        }, 0);
    }

    function getTransactionByType(transactions, type) {
        return transactions.filter(transaction => transaction.transaction_type === type);
    }

    function getTransactionsInDateRange(transactions, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactions.filter(transaction => {
            const date = new Date(transaction.transaction_date);
            return date >= start && date <= end;
        });
    }

    function getTransactionsByMerchant(transactions, merchantName) {
        return transactions.filter(transaction => transaction.merchant_name === merchantName);
    }

    function calculateAverageTransactionAmount(transactions) {
        const totalAmount = calculateTotalAmount(transactions);
        return totalAmount / transactions.length;
    }

    function getTransactionsByAmountRange(transactions, minAmount, maxAmount) {
        return transactions.filter(transaction => {
            const amount = parseFloat(transaction.transaction_amount);
            return amount >= minAmount && amount <= maxAmount;
        });
    }

    function calculateTotalDebitAmount(transactions) {
        return transactions
            .filter(transaction => transaction.transaction_type === 'debit')
            .reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    function findMostTransactionsMonth(transactions) {
        const months = transactions.map(transaction => new Date(transaction.transaction_date).getMonth());
        const monthCounts = {};
        months.forEach(month => {
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });
        return Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b);
    }

    function findMostDebitTransactionMonth(transactions) {
        const debitTransactions = transactions.filter(transaction => transaction.transaction_type === 'debit');
        return findMostTransactionsMonth(debitTransactions);
    }

    function mostTransactionTypes(transactions) {
        const debitCount = transactions.filter(transaction => transaction.transaction_type === 'debit').length;
        const creditCount = transactions.filter(transaction => transaction.transaction_type === 'credit').length;
        if (debitCount > creditCount) return 'debit';
        if (creditCount > debitCount) return 'credit';
        return 'equal';
    }

    function getTransactionsBeforeDate(transactions, date) {
        const cutoff = new Date(date);
        return transactions.filter(transaction => new Date(transaction.transaction_date) < cutoff);
    }

    function findTransactionById(transactions, id) {
        return transactions.find(transaction => transaction.transaction_id == id);
    }

    function mapTransactionDescriptions(transactions) {
        return transactions.map(transaction => transaction.transaction_description);
    }

    // Добавление обработчиков событий для кнопок
    document.getElementById('uniqueTransactionTypesBtn').addEventListener('click', () => {
        displayAnalysisResult(getUniqueTransactionTypes(transactions));
    });

    document.getElementById('totalAmountBtn').addEventListener('click', () => {
        displayAnalysisResult(calculateTotalAmount(transactions));
    });

    document.getElementById('totalAmountByDateBtn').addEventListener('click', () => {
        const year = prompt('Введите год');
        const month = prompt('Введите месяц');
        const day = prompt('Введите день');
        displayAnalysisResult(calculateTotalAmountByDate(transactions, parseInt(year), parseInt(month), parseInt(day)));
    });

    document.getElementById('transactionByTypeBtn').addEventListener('click', () => {
        const type = prompt('Введите тип транзакции (debit или credit)');
        displayAnalysisResult(getTransactionByType(transactions, type));
    });

    document.getElementById('transactionsInDateRangeBtn').addEventListener('click', () => {
        const startDate = prompt('Введите начальную дату (YYYY-MM-DD)');
        const endDate = prompt('Введите конечную дату (YYYY-MM-DD)');
        displayAnalysisResult(getTransactionsInDateRange(transactions, startDate, endDate));
    });

    document.getElementById('transactionsByMerchantBtn').addEventListener('click', () => {
        const merchantName = prompt('Введите название магазина');
        displayAnalysisResult(getTransactionsByMerchant(transactions, merchantName));
    });

    document.getElementById('averageTransactionAmountBtn').addEventListener('click', () => {
        displayAnalysisResult(calculateAverageTransactionAmount(transactions));
    });

    document.getElementById('transactionsByAmountRangeBtn').addEventListener('click', () => {
        const minAmount = prompt('Введите минимальную сумму');
        const maxAmount = prompt('Введите максимальную сумму');
        displayAnalysisResult(getTransactionsByAmountRange(transactions, parseFloat(minAmount), parseFloat(maxAmount)));
    });

    document.getElementById('totalDebitAmountBtn').addEventListener('click', () => {
        displayAnalysisResult(calculateTotalDebitAmount(transactions));
    });

    document.getElementById('mostTransactionsMonthBtn').addEventListener('click', () => {
        displayAnalysisResult(findMostTransactionsMonth(transactions));
    });

    document.getElementById('mostDebitTransactionMonthBtn').addEventListener('click', () => {
        displayAnalysisResult(findMostDebitTransactionMonth(transactions));
    });

    document.getElementById('mostTransactionTypesBtn').addEventListener('click', () => {
        displayAnalysisResult(mostTransactionTypes(transactions));
    });

    document.getElementById('transactionsBeforeDateBtn').addEventListener('click', () => {
        const date = prompt('Введите дату (YYYY-MM-DD)');
        displayAnalysisResult(getTransactionsBeforeDate(transactions, date));
    });

    document.getElementById('findTransactionByIdBtn').addEventListener('click', () => {
        const id = prompt('Введите ID транзакции');
        displayAnalysisResult(findTransactionById(transactions, id));
    });

    document.getElementById('mapTransactionDescriptionsBtn').addEventListener('click', () => {
        displayAnalysisResult(mapTransactionDescriptions(transactions));
    });
});
