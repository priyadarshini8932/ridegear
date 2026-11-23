import { Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['500', '700', '800'], variable: '--font-montserrat' });

export const metadata = { title: 'RideGear – Bike & Car Accessories', description: 'Premium bike and car accessories with free delivery and COD.' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
