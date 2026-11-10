import { TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order, Recipient } from "@/lib/api/dtos";
import { allergyLabel, getInitials } from "../orderPresentation";

function AllergyBadge({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-600">
            <TriangleAlert className="h-3 w-3" />
            {label}
        </span>
    );
}

function RecipientItem({ recipient }: { recipient: Recipient }) {
    const preferences = recipient.preferences.map((preference) => preference.description).join(", ");
    const hasDetails = recipient.allergies.length > 0 || preferences.length > 0;

    return (
        <li className="flex gap-3 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {getInitials(recipient.name)}
            </span>
            <div className="flex min-w-0 flex-col gap-1.5">
                <p className="text-sm font-medium">{recipient.name}</p>
                {recipient.allergies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {recipient.allergies.map((allergy) => (
                            <AllergyBadge key={allergy.id} label={allergyLabel(allergy.type)} />
                        ))}
                    </div>
                )}
                {preferences.length > 0 && (
                    <p className="text-[13px] text-muted-foreground">{preferences}</p>
                )}
                {!hasDetails && (
                    <p className="text-[13px] text-muted-foreground">Geen allergieën of voorkeuren</p>
                )}
            </div>
        </li>
    );
}

export function OrderRecipientsCard({ order }: { order: Order }) {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>Ontvangers ({order.recipients.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="divide-y">
                    {order.recipients.map((recipient) => (
                        <RecipientItem key={recipient.id} recipient={recipient} />
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
