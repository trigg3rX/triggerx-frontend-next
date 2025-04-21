import { Providers } from './providers';
import './global.css';

export const metadata = {
  title: 'TriggerX',
  description: 'Web3 Automation Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
