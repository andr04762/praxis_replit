import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session as any}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
