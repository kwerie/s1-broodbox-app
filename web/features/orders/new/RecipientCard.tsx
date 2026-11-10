"use client";

import { Pencil, Trash2, TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Allergy } from "@/lib/api/dtos";
import { allergyLabel, getInitials } from "@/features/orders/orderPresentation";
import { RecipientDraft } from "./WizardContext";

export function RecipientCard({
    recipient,
    allergies,
    onEdit,
    onDelete,
}: {
    recipient: RecipientDraft;
    allergies: Allergy[];
    onEdit: () => void;
    onDelete: () => void;
}) {
    const preferences = recipient.preferences.join(", ");
    const hasDetails = recipient.allergyIds.length > 0 || preferences.length > 0;

    function labelFor(id: number) {
        const allergy = allergies.find((candidate) => candidate.id === id);
        return allergy ? allergyLabel(allergy.type) : "";
    }

    return (
        <Card>
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>{getInitials(recipient.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">{recipient.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Bewerken" onClick={onEdit}>
                            <Pencil />
                        </Button>
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
                                    <AlertDialogTitle>Ontvanger verwijderen?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Weet je zeker dat je {recipient.name} wilt verwijderen uit deze bestelling?
                                        Allergieën en voorkeuren van deze ontvanger worden niet meer meegenomen.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                        onClick={onDelete}
                                    >
                                        Verwijderen
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {recipient.allergyIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {recipient.allergyIds.map((id) => (
                            <Badge key={id} variant="outline" className="gap-1 border-red-200 bg-red-50 text-red-600">
                                <TriangleAlert />
                                {labelFor(id)}
                            </Badge>
                        ))}
                    </div>
                )}

                {preferences.length > 0 && <p className="text-[13px] text-muted-foreground">{preferences}</p>}
                {!hasDetails && (
                    <p className="text-[13px] text-muted-foreground">Geen allergieën of voorkeuren</p>
                )}
            </CardContent>
        </Card>
    );
}
