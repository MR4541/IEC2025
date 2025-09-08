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
      <Link href='/analysis'>AI 財務分析</Link>
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
