import { requireRole } from "@/lib/auth/guard";
import { getAddresses, getAllergies, getDishes, getOrCreateDraft } from "@/features/orders/new/data";
import { OrderWizard } from "@/features/orders/new/OrderWizard";

export const instant = false;

export default async function NewOrderPage() {
    await requireRole("customer");

    const [draft, dishes, allergies, addresses] = await Promise.all([
        getOrCreateDraft(),
        getDishes(),
        getAllergies(),
        getAddresses(),
    ]);

    return <OrderWizard draft={draft} dishes={dishes} allergies={allergies} addresses={addresses} />;
}
