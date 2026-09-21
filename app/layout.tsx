import "./globals.css";
import { AppProvider, Toaster, ReconnectModal } from "@/lib/store";

export const metadata = {
  title: "Aura — Sua IA pessoal",
  description: "Assistente pessoal com IA: chat, memória, integrações, financeiro e automações.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("aura-theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-bg text-ink antialiased">
        <AppProvider>
          {children}
          <Toaster />
          <ReconnectModal />
        </AppProvider>
      </body>
    </html>
  );
}
