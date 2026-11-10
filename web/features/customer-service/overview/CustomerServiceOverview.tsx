import { InboxIcon, BellIcon, ClockIcon } from "lucide-react";
import { OrderStatus } from "@/lib/api/dtos";
import { getRecentOrders } from "./getRecentOrders";
import { OverviewStatCard, OverviewStat } from "./OverviewStatCard";
import { OrderList } from "./OrderList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusBucket: Record<OrderStatus, "open" | "inProgress" | "closed"> = {
    [OrderStatus.Received]: "open",
    [OrderStatus.Accepted]: "open",
    [OrderStatus.InPreparation]: "inProgress",
    [OrderStatus.Done]: "closed",
};

export async function CustomerServiceOverview() {
    const recentOrders = await getRecentOrders();

    const stats = {
        open: {
            count: 0,
            readableStatus: "Openstaand",
            subtitle: "bestellingen die nog wachten op verwerking",
            icon: InboxIcon,
        },
        withNotes: {
            count: 0,
            readableStatus: "Met meldingen",
            subtitle: "bestellingen vragen aandacht",
            icon: BellIcon,
            highlight: true,
        },
        inProgress: {
            count: 0,
            readableStatus: "In behandeling",
            subtitle: "bestellingen die momenteel worden verwerkt",
            icon: ClockIcon,
        },
    } satisfies Record<string, OverviewStat>;

    for (const order of recentOrders) {
        const bucket = statusBucket[order.status];
        if (bucket !== "open" && bucket !== "inProgress") {
            continue;
        }

        stats[bucket].count += 1;
        if (order.note) {
            stats.withNotes.count += 1;
        }
    }

    const openOrders = recentOrders.filter((order) => statusBucket[order.status] === "open");
    const handledOrders = recentOrders.filter((order) => statusBucket[order.status] !== "open");

    return (
        <div className="flex flex-col flex-1 gap-6">
            <div className="flex flex-1 gap-6">
                {Object.entries(stats).map(([key, stat]) => (
                    <OverviewStatCard key={key} {...stat} />
                ))}
            </div>
            <div className="flex flex-1 gap-6">
                <Card className="flex-1">
                    <CardHeader className="border-b">
                        <CardTitle>Openstaande bestellingen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderList orders={openOrders} />
                    </CardContent>
                </Card>
                <Card className="flex-1 self-start">
                    <CardHeader className="border-b">
                        <CardTitle>Recent verwerkt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderList orders={handledOrders} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
