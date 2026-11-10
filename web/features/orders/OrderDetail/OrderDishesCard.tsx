import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Order } from "@/lib/api/dtos";
import { calculateOrderTotal, currency } from "../orderPresentation";

export function OrderDishesCard({ order }: { order: Order }) {
    const dishCount = order.dishes.reduce((total, dish) => total + dish.quantity, 0);

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>Gerechten ({dishCount})</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-600">Gerecht</TableHead>
                            <TableHead className="text-gray-600">Aantal</TableHead>
                            <TableHead className="text-gray-600">Prijs</TableHead>
                            <TableHead className="text-right text-gray-600">Subtotaal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.dishes.map((orderDish) => (
                            <TableRow key={orderDish.dish.id}>
                                <TableCell className="font-medium">{orderDish.dish.name}</TableCell>
                                <TableCell className="text-gray-600">{orderDish.quantity}</TableCell>
                                <TableCell className="tabular-nums text-gray-600">
                                    {currency.format(orderDish.dish.price)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {currency.format(orderDish.dish.price * orderDish.quantity)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} className="font-medium">Totaal</TableCell>
                            <TableCell className="text-right font-medium tabular-nums">
                                {currency.format(calculateOrderTotal(order))}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
}
