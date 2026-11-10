"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Address } from "@/lib/api/dtos";
import { deleteAddress, setDefaultAddress } from "./actions";
import { useWizard } from "./WizardContext";
import { AddressLines } from "./AddressLines";
import { AddressDialog } from "./AddressDialog";

export function AddressBook() {
    const { state, dispatch } = useWizard();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Address | null>(null);
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

    function makeDefault(id: number, kind: { invoice?: boolean; shipping?: boolean }) {
        startTransition(async () => {
            setAddresses(await setDefaultAddress(id, kind));
        });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between border-b">
                <div className="flex flex-col gap-1">
                    <CardTitle>Adresboek</CardTitle>
                    <p className="text-muted-foreground">
                        Beheer je opgeslagen adressen en kies je standaardadressen.
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
                {state.addresses.map((address) => (
                    <div key={address.id} className="flex items-start justify-between gap-4 rounded-lg border p-3">
                        <div className="flex flex-col gap-2">
                            <AddressLines address={address} />
                            <div className="flex flex-wrap gap-1.5">
                                {address.isDefaultInvoice && <Badge variant="secondary">Standaard factuuradres</Badge>}
                                {address.isDefaultShipping && <Badge variant="secondary">Standaard bezorgadres</Badge>}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Bewerken"
                                onClick={() => openEdit(address)}
                            >
                                <Pencil />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <Button variant="ghost" size="icon-sm" aria-label="Instellen als">
                                            <MoreHorizontal />
                                        </Button>
                                    }
                                />
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Instellen als…</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => makeDefault(address.id, { invoice: true })}>
                                        Factuuradres
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => makeDefault(address.id, { shipping: true })}>
                                        Bezorgadres
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialog>
                                <AlertDialogTrigger
                                    render={
                                        <Button variant="ghost" size="icon-sm" aria-label="Verwijderen">
                                            <Trash2 className="text-destructive" />
                                        </Button>
                                    }
                                />
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
                                            onClick={() => remove(address.id)}
                                        >
                                            Verwijderen
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </CardContent>

            <AddressDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={editing} onSaved={setAddresses} />
        </Card>
    );
}
