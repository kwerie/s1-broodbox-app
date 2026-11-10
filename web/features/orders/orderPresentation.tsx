import { AllergyType, Order, OrderStatus } from "@/lib/api/dtos";
import { cn } from "@/lib/utils";

const allergyLabels: Record<AllergyType, string> = {
    [AllergyType.Gluten]: "Gluten",
    [AllergyType.Crustaceans]: "Schaaldieren",
    [AllergyType.Eggs]: "Eieren",
    [AllergyType.Fish]: "Vis",
    [AllergyType.Peanuts]: "Pinda's",
    [AllergyType.Soybeans]: "Soja",
    [AllergyType.Milk]: "Zuivel",
    [AllergyType.Nuts]: "Noten",
    [AllergyType.Celery]: "Selderij",
    [AllergyType.Mustard]: "Mosterd",
    [AllergyType.Sesame]: "Sesam",
    [AllergyType.Sulphites]: "Sulfiet",
    [AllergyType.Lupin]: "Lupine",
    [AllergyType.Molluscs]: "Weekdieren",
};

export function allergyLabel(type: AllergyType) {
    return allergyLabels[type];
}

export function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export const currency = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
});

function pluralize(count: number, singular: string, plural: string) {
    return `${count} ${count === 1 ? singular : plural}`;
}

export function calculateOrderTotal(order: Order) {
    return order.dishes.reduce((sum, dish) => sum + dish.dish.price * dish.quantity, 0);
}

export function formatOrderContents(order: Order) {
    const dishCount = order.dishes.reduce((total, dish) => total + dish.quantity, 0);
    const preferenceCount = order.recipients.reduce(
        (total, recipient) => total + recipient.preferences.length,
        0,
    );

    return [
        pluralize(dishCount, "gerecht", "gerechten"),
        preferenceCount > 0 ? pluralize(preferenceCount, "voorkeur", "voorkeuren") : null,
        pluralize(order.recipients.length, "ontvanger", "ontvangers"),
    ]
        .filter(Boolean)
        .join(" · ");
}

export function formatOrdeDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

const statusMap: Record<Order["status"], { label: string; color: string; backgroundColor: string; border: string }> = {
    [OrderStatus.Received]: { label: "Ontvangen", color: "text-gray-600", backgroundColor: "bg-gray-50", border: "border-gray-600" },
    [OrderStatus.InPreparation]: { label: "In behandeling", color: "text-yellow-600", backgroundColor: "bg-yellow-50", border: "border-yellow-600" },
    [OrderStatus.Accepted]: { label: "Bevestigd", color: "text-green-600", backgroundColor: "bg-green-50", border: "border-green-600" },
    [OrderStatus.Done]: { label: "Afgehandeld", color: "text-blue-600", backgroundColor: "bg-blue-50", border: "border-blue-600" },
};

export function OrderStatusLabel({ status }: { status: Order["status"] }) {
    const { label, color, backgroundColor, border } = statusMap[status];

    return <span className={cn(color, backgroundColor, border, "border rounded-lg py-1 px-1 text-xs leading-[1em]")}>{label}</span>;
}
