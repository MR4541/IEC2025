function createRow(name, value, revenue) {
  const row = document.createElement('tr');
  const rowName = document.createElement('th');
  rowName.innerHTML = name;
  row.appendChild(rowName)
  const valueCell = document.createElement('td');
  valueCell.innerHTML = value.toLocaleString();
  row.appendChild(valueCell);
  const percentageCell = document.createElement('td');
  percentageCell.innerHTML = (value / revenue * 100).toFixed(2) + '%';
  row.appendChild(percentageCell);
  return row
}

let incomeStatement = {
  revenue: 750000,
  cost: 350000,
  expense: 270000,
  otherIncome: 10000,
  tax: 50000,
};

const incomeTableBody = document.getElementById('income-table-tbody');
incomeTableBody.appendChild(createRow('營業收入', incomeStatement.revenue, incomeStatement.revenue));
incomeTableBody.appendChild(createRow('營業成本', incomeStatement.cost, incomeStatement.revenue));
incomeTableBody.appendChild(createRow(
  '營業毛利',
  incomeStatement.revenue
  - incomeStatement.cost,
  incomeStatement.revenue
));
incomeTableBody.appendChild(createRow('營業費用', incomeStatement.expense, incomeStatement.revenue));
incomeTableBody.appendChild(createRow(
  '營業利益',
  incomeStatement.revenue
  - incomeStatement.cost
  - incomeStatement.expense,
  incomeStatement.revenue
));
incomeTableBody.appendChild(createRow('業外損益', incomeStatement.otherIncome, incomeStatement.revenue));
incomeTableBody.appendChild(createRow(
  '稅前淨利',
  incomeStatement.revenue
  - incomeStatement.cost
  - incomeStatement.expense
  + incomeStatement.otherIncome,
  incomeStatement.revenue
));
incomeTableBody.appendChild(createRow('所得稅', incomeStatement.tax, incomeStatement.revenue));
incomeTableBody.appendChild(createRow(
  '稅後淨利',
  incomeStatement.revenue
  - incomeStatement.cost
  - incomeStatement.expense
  + incomeStatement.otherIncome
  - incomeStatement.tax,
  incomeStatement.revenue
));

new Chart(document.getElementById('revenue-chart'), {
  type: 'bar',
  data: {
    labels: Array.from({length: 12}, (_, i) => i + 1 + '月'),
    datasets: [{
      label: '營收（萬新台幣）',
      data: [14, 22, 25, 43, 35, 52, 65, 134, 116, 104, 81, 75],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

new Chart(document.getElementById('sales-chart'), {
  type: 'pie',
  data: {
    labels: [
      '漢堡',
      '蛋餅',
      '蘿蔔糕'
    ],
    datasets: [{
      label: '銷售量（萬新台幣）',
      data: [4, 2.5, 1],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  }
});

