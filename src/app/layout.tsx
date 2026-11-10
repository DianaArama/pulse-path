import type { Metadata } from 'next';
import Link from 'next/link';

import User from '@/components/ui/User';
import './globals.css';

export const metadata: Metadata = {
  title: 'PulsePath',
  description: 'AI habit coach for movement, nutrition, and recovery.',
};

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    iconPath: 'M4 12h6V4H4v8Zm10 8h6V4h-6v16ZM4 20h6v-6H4v6Zm10 0h6v-10h-6v10Z',
  },
  {
    href: '/workouts',
    label: 'Workouts',
    iconPath: 'M7 6h10v4H7V6Zm-3 8h16v4H4v-4Zm3 6h10v2H7v-2Z',
  },
  {
    href: '/nutrition',
    label: 'Nutrition',
    iconPath:
      'M12 4c-3.9 0-7 3.1-7 7 0 2.3 1.1 4.4 2.8 5.8V20h8.4v-3.2C17.9 15.4 19 13.3 19 11c0-3.9-3.1-7-7-7Zm-1 4h2v4h-2V8Zm0 6h2v2h-2v-2Z',
  },
  {
    href: '/stress',
    label: 'Stress',
    iconPath: 'M7 5h10v2H7V5Zm-2 4h14v2H5V9Zm2 4h10v2H7v-2Zm-2 4h14v2H5v-2Z',
  },
  {
    href: '/profile',
    label: 'Profile',
    iconPath:
      'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z',
  },
];

const NavIcon = ({ path }: { path: string }) => (
  <svg viewBox='0 0 24 24' className='h-5 w-5 fill-current' aria-hidden='true'>
    <path d={path} />
  </svg>
);

const navButtonClass =
  'flex flex-col items-center justify-center gap-1 rounded-3xl px-3 py-3 text-[11px] font-semibold text-[#5f5a51] transition';

const navButtonAccentClass =
  'border border-[rgba(79,111,53,0.22)] bg-[linear-gradient(180deg,rgba(79,111,53,0.12)_0%,rgba(79,111,53,0.05)_100%)] text-[#4f6f35] shadow-sm hover:-translate-y-0.5 hover:border-[rgba(79,111,53,0.34)] hover:bg-[linear-gradient(180deg,rgba(79,111,53,0.16)_0%,rgba(79,111,53,0.08)_100%)]';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full antialiased'>
      <body className='min-h-full text-[#1e1a17]'>
        <div className='min-h-screen px-3 py-3 pb-24 sm:px-4 sm:py-4 sm:pb-24 lg:px-6 lg:py-6 lg:pb-6'>
          <div className='mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1600px] gap-4 lg:grid-cols-[96px_minmax(0,1fr)]'>
            <aside className='hidden self-start rounded-[34px] border border-[#d9cec0] bg-[#fffdf9] p-3 shadow-[0_24px_60px_rgba(126,74,35,0.10)] lg:flex lg:flex-col lg:items-stretch'>
              <div className='flex h-16 items-center justify-center rounded-[28px] border border-[rgba(79,111,53,0.18)] bg-[linear-gradient(180deg,rgba(79,111,53,0.16)_0%,rgba(79,111,53,0.08)_100%)] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]'>
                <div className='flex h-12 min-w-12 items-center justify-center rounded-3xl bg-[#2f4a2b] px-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#fffaf4] shadow-[0_10px_24px_rgba(79,111,53,0.18)]'>
                  PulsePath
                </div>
              </div>
              <nav className='mt-4 grid grid-cols-1 gap-3'>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${navButtonClass} ${navButtonAccentClass}`}
                    aria-label={item.label}
                  >
                    <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#4f6f35]'>
                      <NavIcon path={item.iconPath} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className='mt-4 flex flex-col gap-2 rounded-3xl border border-[#e6d8ca] bg-[#fbf7f2] p-3 text-[#1e1a17]/90'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.24em]'>
                  Today
                </p>
                <p className='text-sm font-semibold'>4 tasks ready</p>
              </div>
            </aside>

            <div className='flex min-w-0 flex-col gap-4'>
              <header className='relative z-40 overflow-visible rounded-[30px] border border-[#e6d8ca] bg-white/90 px-5 py-4 shadow-[0_18px_48px_rgba(126,74,35,0.10)] backdrop-blur'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-[10px] font-semibold uppercase tracking-[0.36em] text-[#6a1b75]'>
                      PulsePath
                    </p>
                    <h1 className='mt-1 text-lg font-semibold text-[#1e1a17] sm:text-xl'>
                      Active health overview
                    </h1>
                  </div>

                  <div className='flex items-center gap-3'>
                    <label className='hidden items-center gap-2 rounded-full border border-[#e6d8ca] bg-white px-4 py-2 text-sm text-[#84796f] shadow-sm sm:flex'>
                      Search
                    </label>
                    <User />
                  </div>
                </div>
              </header>

              <main className='min-w-0 flex-1'>{children}</main>
            </div>
          </div>
        </div>

        <nav className='fixed bottom-0 left-0 right-0 z-50 border-t border-[#e6d8ca] bg-[#fffdf9]/95 px-3 py-3 shadow-[0_-10px_30px_rgba(126,74,35,0.08)] backdrop-blur lg:hidden'>
          <div className='mx-auto grid max-w-6xl grid-cols-5 gap-2'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${navButtonClass} ${navButtonAccentClass}`}
              >
                <span className='flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#4f6f35]'>
                  <NavIcon path={item.iconPath} />
                </span>
                <span className='truncate'>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </body>
    </html>
  );
}
