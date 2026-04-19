import './globals.css';

export const metadata = {
  title: 'AINABI - Neural Analysis',
  description: 'AI-driven problem solving platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-ainabi-dark text-ainabi-silver">
        {children}
      </body>
    </html>
  )
}
