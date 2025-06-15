import { getUser } from "@/actions/user_actions";
import Sidebar from "@/components/shared/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChatGPT",
  description: "Your AI companion for intelligent conversations.",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const data = await getUser() || null

  return (
    <>      
      <div className="flex overflow-hidden">
        <div className="w-full">
          {children}
        </div>
      </div>
    </>
  );
}
