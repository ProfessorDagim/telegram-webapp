import './globals.css'

export const metadata = {
  title: 'DE OMNI - Advanced AI Assistant',
  description: 'Advanced AI • Infinite Possibilities • Your Digital Companion',
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
