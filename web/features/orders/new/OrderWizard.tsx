"use client";

import { Address, Allergy, Dish, Order } from "@/lib/api/dtos";
import { WizardProvider, useWizard } from "./WizardContext";
import { Stepper } from "./Stepper";
import { Step1Dishes } from "./steps/Step1Dishes";
import { Step2Recipients } from "./steps/Step2Recipients";
import { Step3Addresses } from "./steps/Step3Addresses";

function StepPlaceholder({ step }: { step: number }) {
    return <div className="text-muted-foreground">Stap {step}</div>;
}

function WizardBody() {
    const { state } = useWizard();

    return (
        <div className="flex flex-col gap-6">
            {state.step < 5 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Nieuwe bestelling</h1>
                    <Stepper current={state.step} />
                </div>
            )}

            {state.step === 1 && <Step1Dishes />}
            {state.step === 2 && <Step2Recipients />}
            {state.step === 3 && <Step3Addresses />}
            {state.step === 4 && <StepPlaceholder step={4} />}
            {state.step === 5 && <StepPlaceholder step={5} />}
        </div>
    );
}

export function OrderWizard({
    draft,
    dishes,
    allergies,
    addresses,
}: {
    draft: Order;
    dishes: Dish[];
    allergies: Allergy[];
    addresses: Address[];
}) {
    return (
        <WizardProvider init={{ draft, dishes, allergies, addresses }}>
            <WizardBody />
        </WizardProvider>
    );
}
