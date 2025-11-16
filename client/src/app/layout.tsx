//client/src/app/layout.tsx

import "./globals.css";
import Providers from "./providers";
import '@mysten/dapp-kit/dist/index.css';

export const metadata = {
  title: "SUI Betting",
  description: "On-chain betting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
