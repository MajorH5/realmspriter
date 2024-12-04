import './globals.css';

export const metadata = {
  title: 'RealmSpriter - Draw',
  description: 'RealmSpriter is a free online tool that allows you to create custom sprites for Realm of the Mad God.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
