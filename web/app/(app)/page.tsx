import { getRole, requireAuth } from "@/lib/auth/guard";
import { CustomerServiceHome } from "@/features/customer-service/overview/CustomerServiceHome";
import { CustomerHome } from "@/features/customer/overview/CustomerHome";

export const instant = false;

export default async function Home() {
    await requireAuth();
    const role = await getRole();

    if (role === "customer-service") {
        return <CustomerServiceHome />;
    }

    return <CustomerHome />;
}
