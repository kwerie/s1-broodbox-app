import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getOpenOrders } from "../getOpenOrders";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    OrderStatusLabel,
    calculateOrderTotal,
    currency,
    formatOrdeDate,
    formatOrderContents,
} from "../orderPresentation";

export async function OpenOrders() {
    const orders = await getOpenOrders(5);

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>Recente bestellingen</CardTitle>
                <p className="text-gray-500">Je laatste 5 bestellingen</p>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
}
