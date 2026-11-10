import { requireRole } from "@/lib/auth/guard";
import { getAddresses, getAllergies, getDishes, getOrCreateDraft } from "@/features/orders/new/data";
import { OrderWizard } from "@/features/orders/new/OrderWizard";

export const instant = false;

export default async function NewOrderPage({ searchParams }: PageProps<"/order/new">) {
    await requireRole("customer");

    const { step } = await searchParams;
    const initialStep = Number(Array.isArray(step) ? step[0] : step) || 1;

    const [draft, dishes, allergies, addresses] = await Promise.all([
        getOrCreateDraft(),
        getDishes(),
        getAllergies(),
        getAddresses(),
    ]);

    return (
        <OrderWizard
            draft={draft}
            dishes={dishes}
            allergies={allergies}
            addresses={addresses}
            initialStep={initialStep}
        />
    );
}
