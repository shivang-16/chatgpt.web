import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChatGPT | Login",
  description: "Login to ChatGpt",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
        <div>
          {children}
        </div>
    </>
  );
}
