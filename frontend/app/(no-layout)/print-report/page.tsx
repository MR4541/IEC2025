'use client'

import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import * as rc from 'recharts';

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

export default function Report() {
  useEffect(() => {
    console.log('Using effect!')
  }, []);

  return (
    <main className={styles.pageContent}>
      <SlidePage heading=''>
        <div></div>
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
        <div></div>
      </SlidePage>
      <SlidePage heading='成本結構'>
        <div></div>
      </SlidePage>
      <SlidePage heading='銷售成本'>
        <div></div>
      </SlidePage>
      <SlidePage heading='顧客概況'>
        <div></div>
      </SlidePage>
      <SlidePage heading='月現金流'>
        <div></div>
      </SlidePage>
      <SlidePage heading='趨勢分析'>
        <div></div>
      </SlidePage>
    </main>
  );
}

