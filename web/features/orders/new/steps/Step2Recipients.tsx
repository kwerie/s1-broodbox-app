"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveRecipients } from "../actions";
import { RecipientDraft, useWizard } from "../WizardContext";
import { RecipientCard } from "../RecipientCard";
import { RecipientDialog } from "../RecipientDialog";
import { OrderSummary } from "../OrderSummary";

export function Step2Recipients() {
    const { state, dispatch } = useWizard();
    const [pending, startTransition] = useTransition();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<RecipientDraft | null>(null);

    function openAdd() {
        setEditing(null);
        setDialogOpen(true);
    }

    function openEdit(recipient: RecipientDraft) {
        setEditing(recipient);
        setDialogOpen(true);
    }

    function saveRecipient(recipient: RecipientDraft) {
        const exists = state.recipients.some((current) => current.tempId === recipient.tempId);
        const recipients = exists
            ? state.recipients.map((current) => (current.tempId === recipient.tempId ? recipient : current))
            : [...state.recipients, recipient];
        dispatch({ type: "setRecipients", recipients });
    }

    function deleteRecipient(tempId: string) {
        dispatch({
            type: "setRecipients",
            recipients: state.recipients.filter((current) => current.tempId !== tempId),
        });
    }

    function next() {
        startTransition(async () => {
            await saveRecipients(
                state.draftId,
                state.recipients.map((recipient) => ({
                    name: recipient.name,
                    lockerNumber: recipient.lockerNumber,
                    allergyIds: recipient.allergyIds,
                    preferences: recipient.preferences,
                })),
            );
            dispatch({ type: "setStep", step: 3 });
        });
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-lg font-medium">Ontvangers ({state.recipients.length})</h2>
                            <p className="text-sm text-muted-foreground">
                                Voor wie is deze bestelling? Allergieën en voorkeuren gaan mee naar de keuken.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={openAdd}>
                            <Plus /> Ontvanger toevoegen
                        </Button>
                    </div>

                    {state.recipients.length === 0 && (
                        <p className="text-sm text-muted-foreground">Nog geen ontvangers toegevoegd.</p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        {state.recipients.map((recipient) => (
                            <RecipientCard
                                key={recipient.tempId}
                                recipient={recipient}
                                allergies={state.allergies}
                                onEdit={() => openEdit(recipient)}
                                onDelete={() => deleteRecipient(recipient.tempId)}
                            />
                        ))}
                    </div>
                </div>

                <OrderSummary
                    showRecipients
                    cta={{
                        label: "Volgende stap",
                        onClick: next,
                        disabled: state.recipients.length === 0,
                        pending,
                    }}
                />
            </div>

            <div>
                <Button variant="outline" size="sm" onClick={() => dispatch({ type: "setStep", step: 1 })}>
                    <ArrowLeft /> Terug
                </Button>
            </div>

            <RecipientDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                allergies={state.allergies}
                initial={editing}
                onSave={saveRecipient}
            />
        </div>
    );
}
