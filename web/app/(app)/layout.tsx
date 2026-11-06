import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/sidebar/Sidebar"

export const instant = false;

export default function AppLayout({ children }: LayoutProps<"/">) {
    return (
        <SidebarProvider>
            <Sidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
