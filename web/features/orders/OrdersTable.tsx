import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/api/dtos";
import {
    OrderStatusLabel,
    calculateOrderTotal,
    currency,
    formatOrdeDate,
    formatOrderContents,
} from "./orderPresentation";

export function OrdersTable({ orders }: { orders: Order[] }) {
    if (orders.length === 0) {
        return <p className="p-4 text-sm text-muted-foreground">Geen bestellingen.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-gray-600">Bestelling</TableHead>
                    <TableHead className="text-gray-600">Datum</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Inhoud</TableHead>
                    <TableHead className="text-right text-gray-600">Bedrag</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>#{order.orderNumber}</TableCell>
                        <TableCell className="text-gray-600">{formatOrdeDate(order.orderedAt)}</TableCell>
                        <TableCell>
                            <OrderStatusLabel status={order.status} />
                        </TableCell>
                        <TableCell className="text-gray-600">{formatOrderContents(order)}</TableCell>
                        <TableCell className="text-right tabular-nums">
                            {currency.format(calculateOrderTotal(order))}
                        </TableCell>
                        <TableCell>
                            <Link href={`/order/${order.id}`}>
                                <Button variant="outline" size="sm">
                                    Bekijken
                                </Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
