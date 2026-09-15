import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontend Grow Plan — личная база знаний",
  description: "Личный тренажёр для системного изучения frontend-тем",
};

// Блокирующий инлайн-скрипт: выставляет класс "dark" на <html> ДО того,
// как React гидратируется и до первой отрисовки — иначе при перезагрузке
// страницы в тёмной теме на долю секунды мелькнёт светлая вёрстка.
const themeInitScript = `
try {
  var raw = localStorage.getItem('frontend-grow-plan:theme');
  var theme = raw ? JSON.parse(raw).state.theme : null;
  var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
