import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.scss';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IEC Reboot',
  description: 'Site rewritten in Next.js',
};

function NavBar() {
  return (
    <nav className='NavBar'>
      <Link href='/'>首頁</Link>
      <Link href='/record'>財務紀錄</Link>
      <Link href='/stock'>存貨量統計</Link>
      <Link href='/analysis'>AI 財務分析</Link>
      <Link href='/print-report'>匯出財務報告</Link>
      <Link href='https://crm.vitalyun.com/f53310b205f6adb7148bdd7233f920b1/Customer.mvc/Index'>CRM</Link>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${inter.className}`}>
        <header className='page-header'>
          <NavBar />
        </header>
        {children}
      </body>
    </html>
  );
}
