import './globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DE OMNI - AI Assistant',
  description: 'Advanced AI-powered chat interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
