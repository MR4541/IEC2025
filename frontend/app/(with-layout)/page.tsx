'use client'

import { IncomeStatement } from '@/lib/types';
import * as rc from 'recharts';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';

function IncomeTableRow({ name, value, revenue }: { name: string, value: number, revenue: number }) {
  return (
    <tr>
      <th>{name}</th>
      <td>{value.toLocaleString()}</td>
      <td>{`${(value / revenue * 100).toFixed(2)}%`}</td>
    </tr>
  )
}

function IncomeTable({ incomes }: { incomes: IncomeStatement }) {
  return (
    <table className={styles.incomeTable}>
      <thead>
        <tr>
          <th>項目</th>
          <th>金額（新台幣）</th>
          <th>佔比</th>
        </tr>
      </thead>
      <tbody>
        <IncomeTableRow name='營業收入' value={incomes.revenue} revenue={incomes.revenue}/>
        <IncomeTableRow name='營業成本' value={incomes.cost} revenue={incomes.revenue}/>
        <IncomeTableRow name='營業毛利' value={incomes.revenue - incomes.cost} revenue={incomes.revenue}/>
        <IncomeTableRow name='營業費用' value={incomes.expense} revenue={incomes.revenue}/>
        <IncomeTableRow name='營業利益' value={incomes.revenue - incomes.cost - incomes.expense} revenue={incomes.revenue}/>
        <IncomeTableRow name='業外損益' value={incomes.otherIncome} revenue={incomes.revenue}/>
        <IncomeTableRow name='稅前淨利' value={incomes.revenue - incomes.cost - incomes.expense + incomes.otherIncome} revenue={incomes.revenue}/>
        <IncomeTableRow name='所得稅'   value={incomes.tax} revenue={incomes.revenue}/>
        <IncomeTableRow name='稅後淨利' value={incomes.revenue - incomes.cost - incomes.expense + incomes.otherIncome - incomes.tax} revenue={incomes.revenue}/>
      </tbody>
    </table>
  )
}

function Chart({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className={styles.chart}>
      <h1>{title}</h1>
      {children}
    </div>
  )
}

function ChartDiv({ direction, children }: { direction: 'row' | 'column', children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: direction }}>
      {children}
    </div>
  )
}

export default function Home() {
  const [incomes, setIncomes] = useState<IncomeStatement>({
    revenue: 0,
    cost: 0,
    expense: 0,
    otherIncome: 0,
    tax: 0,
  });

  useEffect(() => {
    fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/finance`)
      .then((res) => res.json())
      .then((data) => setIncomes(data));
  }, [])

  const revenues = [
    { month: '1 月', value: 14 }, { month: '2 月', value: 22 }, { month: '3 月', value: 25 },
    { month: '4 月', value: 43 }, { month: '5 月', value: 35 }, { month: '6 月', value: 52 },
    { month: '7 月', value: 65 }, { month: '8 月', value: 134 }, { month: '9 月', value: 116 },
    { month: '10 月', value: 104 }, { month: '11 月', value: 81 }, { month: '12 月', value: 75 },
  ];

  const sales = [
    { item: '漢堡', value: 400000 },
    { item: '蛋餅', value: 250000 },
    { item: '蘿蔔糕', value: 100000 },
  ]

  const pieColors = ['#069', '#690', '#960'];

  return (
    <main className={styles.pageContent}>
      <ChartDiv direction='row'>
        <ChartDiv direction='column'>
          <Chart title='損益表'>
            <IncomeTable incomes={incomes} />
          </Chart>
          <Chart title='每月營收'>
            <rc.ResponsiveContainer height={300}>
              <rc.BarChart data={revenues}>
                <rc.XAxis dataKey='month' />
                <rc.YAxis />
                <rc.Tooltip />
                <rc.Legend />
                <rc.Bar dataKey='value' name='營收（新台幣萬元）' fill='#069' />
              </rc.BarChart>
            </rc.ResponsiveContainer>
          </Chart>
        </ChartDiv>
        <Chart title='營收來源品項佔比'>
          <rc.ResponsiveContainer height='90%'>
            <rc.PieChart>
              <rc.Tooltip />
              <rc.Legend />
              <rc.Pie data={sales} dataKey='value' nameKey='item'>
                {sales.map((_, i) => <rc.Cell key={i} fill={pieColors[i]} />)}
              </rc.Pie>
            </rc.PieChart>
          </rc.ResponsiveContainer>
        </Chart>
      </ChartDiv>
    </main>
  );
}

