'use client'

import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import * as rc from 'recharts';

function Shortage() {
  const [shortages, setShortages] = useState<string[]>();
  useEffect(() => {
    const checkShortage = () => fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/shortage`)
      .then((res) => res.json())
      .then((data) => setShortages(data));
    const interval = setInterval(checkShortage, 1000);
    return () => clearInterval(interval);
  }, []);
  if (!shortages?.length) return null;
  return (
    <p className={styles.warning}>{shortages.join('、')}不足，請儘快補貨。</p>
  );
}

function StockLine({ dataKey, color }: { dataKey: string, color: string }) {
  return (
    <rc.Line
      dataKey={dataKey}
      stroke={color}
      type='monotone'
      dot={false}
      isAnimationActive={false}
    />
  );
}

export default function Stock() {
  const [stockHistory, setStockHistory] = useState<Object[]>();

  useEffect(() => {
    const getStock = () => fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/stock`)
      .then((res) => res.json())
      .then((data) => setStockHistory(data));
    const interval = setInterval(getStock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.pageContent}>
      <Shortage />
      <rc.ResponsiveContainer height={600}>
        <rc.LineChart data={stockHistory}>
          <rc.XAxis
            type='number'
            dataKey='time'
            domain={['dataMin', 'dataMax']}
            tickCount={10}
            tickFormatter={(value) => {
              const date = new Date(value * 1000);
              const zeroPad = (n: number) => n.toString().padStart(2, '0');
              return `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}:${zeroPad(date.getSeconds())}`
            }}
          />
          <rc.YAxis />
          <rc.Tooltip />
          <rc.Legend />
          <StockLine dataKey='麵包' color='#fe640b' />
          <StockLine dataKey='生菜' color='#40a02b' />
          <StockLine dataKey='鮪魚' color='#dd7878' />
          <StockLine dataKey='蛋' color='#df8e1d' />
        </rc.LineChart>
      </rc.ResponsiveContainer>
    </main>
  );
}

