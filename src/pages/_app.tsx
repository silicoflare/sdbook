import "@/styles/globals.css";
import { inter } from "@/utils/fonts";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div
        className={`w-screen h-screen flex flex-col items-center gap-2 ${inter}`}
      >
        <Component {...pageProps} />
      </div>
      <Toaster richColors />
    </SessionProvider>
  );
}
