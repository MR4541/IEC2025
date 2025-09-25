'use client'

import { IncomeStatement } from '@/lib/types';
import { IncomeTable } from '@/lib/components';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import * as rc from 'recharts';
import {useRouter} from 'next/navigation';

function SlidePage({ heading, children }: { heading: string, children: React.ReactNode }) {
  return (
    <div className={styles.slidePage}>
      <div className={styles.slideContent}>
        <div className={styles.slideHeading}>{heading}</div>
        <div className={styles.slideBody}>{children}</div>
      </div>
    </div>
  )
}

function Chart({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {children}
    </div>
  )
}

export default function Report() {
  const router = useRouter();

  const now = new Date();

  const [incomes, setIncomes] = useState<IncomeStatement>({
    revenue: 0,
    cost: 0,
    expense: 0,
    otherIncome: 0,
    tax: 0,
  });

  const customers = [
    { month: '一月', value: 274 },
    { month: '二月', value: 348 },
    { month: '三月', value: 385 },
    { month: '四月', value: 412 },
    { month: '五月', value: 346 },
    { month: '六月', value: 582 },
  ]

  const cashflow = [
    { month: '一月', value: 6358 },
    { month: '二月', value: 8346 },
    { month: '三月', value: 8642 },
    { month: '四月', value: 9235 },
    { month: '五月', value: 8934 },
    { month: '六月', value: 10034 },
  ]

  const finance = [
    { month: '一月', revenue: 14, cost: 13 },
    { month: '二月', revenue: 22, cost: 20 },
    { month: '三月', revenue: 25, cost: 21 },
    { month: '四月', revenue: 43, cost: 40 },
    { month: '五月', revenue: 35, cost: 30 },
    { month: '六月', revenue: 52, cost: 50 },
    { month: '七月', revenue: 65, cost: 59 },
    { month: '八月', revenue: 134, cost: 70 },
    { month: '九月', revenue: 116, cost: 87 },
    { month: '十月', revenue: 104, cost: 91 },
    { month: '十一月', revenue: 81, cost: 76 },
    { month: '十二月', revenue: 75, cost: 54 },
  ];

  const sales = [
    { item: '漢堡', value: 4.0 },
    { item: '蛋餅', value: 2.5 },
    { item: '蘿蔔糕', value: 1.0 },
  ]

  const costs = [
    { item: '原物料', value: 400000 },
    { item: '人事', value: 250000 },
    { item: '維護', value: 100000 },
  ]

  const pieColors = ['#069', '#690', '#960'];

  useEffect(() => {
    fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/finance`)
      .then((res) => res.json())
      .then((data) => {
        setIncomes(data)
        setTimeout(() => {
          print()
          router.back()
        })
      });
  }, []);

  return (
    <main className={styles.pageContent}>
      <SlidePage heading=''>
        <p className={styles.slideSubTitle}>{now.getFullYear()} 年 {now.getMonth()} 月</p>
        <p className={styles.slideTitle}>營運報告</p>
        <p className={styles.slideSubTitle}>大而美早餐店</p>
      </SlidePage>
      <SlidePage heading='目錄'>
        <ul style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          height: '100%'
        }}>
          <li>營運概況</li>
          <li>成本結構</li>
          <li>銷售表現</li>
          <li>顧客概況</li>
          <li>⽉現⾦流</li>
          <li>趨勢分析</li>
        </ul>
      </SlidePage>
      <SlidePage heading='營運概況'>
        <IncomeTable incomes={incomes} />
      </SlidePage>
      <SlidePage heading='成本結構'>
        <Chart>
          <rc.PieChart width={600} height={600}>
            <rc.Tooltip />
            <rc.Legend />
            <rc.Pie data={costs} dataKey='value' nameKey='item' isAnimationActive={false}>
              {costs.map((_, i) => <rc.Cell key={i} fill={pieColors[i]} />)}
            </rc.Pie>
          </rc.PieChart>
        </Chart>
      </SlidePage>
      <SlidePage heading='銷售表現'>
        <Chart>
          <rc.BarChart width={1000} height={600} data={sales}>
            <rc.XAxis dataKey='item' />
            <rc.YAxis />
            <rc.Tooltip />
            <rc.Legend />
            <rc.Bar dataKey='value' name='營收（新台幣萬元）' fill='#069' isAnimationActive={false} />
          </rc.BarChart>
        </Chart>
      </SlidePage>
      <SlidePage heading='顧客概況'>
        <Chart>
          <rc.LineChart width={1000} height={600} data={customers}>
            <rc.XAxis dataKey='month' />
            <rc.YAxis />
            <rc.Tooltip />
            <rc.Legend />
            <rc.Line type='monotone' dataKey="value" name='顧客人數' isAnimationActive={false} />
          </rc.LineChart>
        </Chart>
      </SlidePage>
      <SlidePage heading='月現金流'>
        <Chart>
          <rc.LineChart width={1000} height={600} data={cashflow}>
            <rc.XAxis dataKey='month' />
            <rc.YAxis />
            <rc.Tooltip />
            <rc.Legend />
            <rc.Line type='monotone' dataKey="value" name='現金流（新台幣元）' isAnimationActive={false} />
          </rc.LineChart>
        </Chart>
      </SlidePage>
      <SlidePage heading='趨勢分析'>
        <Chart>
          <rc.LineChart width={1000} height={600} data={finance}>
            <rc.XAxis dataKey='month' />
            <rc.YAxis />
            <rc.Tooltip />
            <rc.Legend />
            <rc.Line type='monotone' dataKey="revenue" name='營收（新台幣萬元）' isAnimationActive={false} />
            <rc.Line type='monotone' dataKey="cost" name='成本（新台幣萬元）' stroke='#f66' isAnimationActive={false} />
          </rc.LineChart>
        </Chart>
      </SlidePage>
    </main>
  );
}

