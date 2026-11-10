import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { ActivePageTitle } from "@/components/ActivePageTitle";

export const instant = false;

export default function AppLayout({ children }: LayoutProps<"/">) {
    return (
        <SidebarProvider>
            <Sidebar />
            <main className="w-full">
                <div className="border-b w-full p-6 flex items-center">
                    <SidebarTrigger />
                    <span className="mx-2 text-gray-400">|</span>
                    <ActivePageTitle />
                </div>
                <div className="px-8 py-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
