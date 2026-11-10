"use client";

import { useState, useTransition } from "react";
import { FileText, MoreHorizontal, Pencil, Plus, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Address } from "@/lib/api/dtos";
import { deleteAddress } from "./actions";
import { useWizard } from "./WizardContext";
import { AddressLines } from "./AddressLines";
import { AddressDialog } from "./AddressDialog";

export function AddressBook() {
    const { state, dispatch } = useWizard();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Address | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    function setAddresses(addresses: Address[]) {
        dispatch({ type: "setAddresses", addresses });
    }

    function openAdd() {
        setEditing(null);
        setDialogOpen(true);
    }

    function openEdit(address: Address) {
        setEditing(address);
        setDialogOpen(true);
    }

    function selectForOrder(id: number, slot: "invoice" | "shipping") {
        dispatch({ type: slot === "invoice" ? "setInvoiceAddress" : "setShippingAddress", id });
    }

    function remove(id: number) {
        setError(null);
        startTransition(async () => {
            try {
                setAddresses(await deleteAddress(id));
                if (state.invoiceAddressId === id) {
                    dispatch({ type: "setInvoiceAddress", id: null });
                }
                if (state.shippingAddressId === id) {
                    dispatch({ type: "setShippingAddress", id: null });
                }
            } catch {
                setError("Dit adres is gekoppeld aan een bestelling en kan niet worden verwijderd.");
            }
        });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between border-b">
                <div className="flex flex-col gap-1">
                    <CardTitle>Adresboek</CardTitle>
                    <p className="text-muted-foreground">
                        Beheer je opgeslagen adressen en kies de adressen voor deze bestelling.
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={openAdd}>
                    <Plus /> Adres toevoegen
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {error && <p className="text-sm text-destructive">{error}</p>}
                {state.addresses.length === 0 && (
                    <p className="py-2 text-sm text-muted-foreground">
                        Nog geen adressen. Voeg er een toe om verder te gaan.
                    </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                    {state.addresses.map((address) => (
                        <div key={address.id} className="relative flex flex-col gap-2 rounded-lg border p-3">
                            <div className="absolute top-2 right-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button variant="ghost" size="icon-sm" aria-label="Acties">
                                                <MoreHorizontal />
                                            </Button>
                                        }
                                    />
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openEdit(address)}>
                                            <Pencil />
                                            Bewerken
                                        </DropdownMenuItem>
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Instellen als…</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => selectForOrder(address.id, "invoice")}>
                                                <FileText />
                                                Factuuradres
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => selectForOrder(address.id, "shipping")}>
                                                <Truck />
                                                Bezorgadres
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => setDeletingId(address.id)}
                                        >
                                            <Trash2 />
                                            Verwijderen
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <AddressLines address={address} companyName={state.companyName} />

                            <div className="flex flex-col items-start gap-1.5">
                                {address.id === state.invoiceAddressId && (
                                    <Badge variant="secondary" className="gap-1">
                                        <FileText />
                                        Factuuradres voor deze bestelling
                                    </Badge>
                                )}
                                {address.id === state.shippingAddressId && (
                                    <Badge variant="secondary" className="gap-1">
                                        <Truck />
                                        Bezorgadres voor deze bestelling
                                    </Badge>
                                )}
                                {address.isDefaultInvoice && (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        Standaard factuuradres
                                    </Badge>
                                )}
                                {address.isDefaultShipping && (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        Standaard bezorgadres
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <AddressDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={editing} onSaved={setAddresses} />

            <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Adres verwijderen?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Weet je zeker dat je dit adres uit je adresboek wilt verwijderen?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={() => {
                                if (deletingId !== null) {
                                    remove(deletingId);
                                }
                                setDeletingId(null);
                            }}
                        >
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
