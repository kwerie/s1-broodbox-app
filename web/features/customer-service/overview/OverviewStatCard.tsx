import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type OverviewStat = {
    readableStatus: string;
    count: number;
    subtitle: string;
    icon: LucideIcon;
    highlight?: boolean;
};

export function OverviewStatCard({ readableStatus, count, subtitle, icon: Icon, highlight }: OverviewStat) {
    return (
        <Card className={cn("flex-1 p-4 shadow-xs", highlight && "ring-red-400")}>
            <div className="flex items-center justify-between">
                <span>{readableStatus}</span>
                <Icon className={cn("h-4 w-4 text-muted-foreground", highlight && "text-red-500")} />
            </div>
            <p className={cn("text-3xl font-semibold leading-[1em]", highlight && "text-red-500")}>{count}</p>
            <span className="text-xs text-muted-foreground">{subtitle}</span>
        </Card>
    );
}
