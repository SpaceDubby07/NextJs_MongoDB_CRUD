import '../styles/globals.css';
import Providers from './providers';
import { SessionProvider } from 'next-auth/react';
import Header from '../components/Header';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Providers>
        <div className="lightbg darkbg dark:text-gray-200 text-gray-800 min-h-screen select-none">
          <Header />
          <Component {...pageProps} />
        </div>
      </Providers>
    </SessionProvider>
  );
}
