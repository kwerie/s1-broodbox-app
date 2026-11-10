"use client";

import { useEffect } from "react";
import { Address, Allergy, Dish, Order } from "@/lib/api/dtos";
import { WizardProvider, useWizard } from "./WizardContext";
import { Stepper } from "./Stepper";
import { Step1Dishes } from "./steps/Step1Dishes";
import { Step2Recipients } from "./steps/Step2Recipients";
import { Step3Addresses } from "./steps/Step3Addresses";
import { Step4Review } from "./steps/Step4Review";
import { Step5Confirmation } from "./steps/Step5Confirmation";

function WizardBody() {
    const { state, dispatch } = useWizard();

    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set("step", String(state.step));
        window.history.replaceState(window.history.state, "", url);
    }, [state.step]);

    return (
        <div className="flex flex-col gap-6">
            {state.step < 5 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Nieuwe bestelling</h1>
                    <Stepper
                        current={state.step}
                        onStepClick={(step) => dispatch({ type: "setStep", step })}
                    />
                </div>
            )}

            {state.step === 1 && <Step1Dishes />}
            {state.step === 2 && <Step2Recipients />}
            {state.step === 3 && <Step3Addresses />}
            {state.step === 4 && <Step4Review />}
            {state.step === 5 && <Step5Confirmation />}
        </div>
    );
}

export function OrderWizard({
    draft,
    dishes,
    allergies,
    addresses,
    initialStep,
}: {
    draft: Order;
    dishes: Dish[];
    allergies: Allergy[];
    addresses: Address[];
    initialStep: number;
}) {
    return (
        <WizardProvider init={{ draft, dishes, allergies, addresses, initialStep }}>
            <WizardBody />
        </WizardProvider>
    );
}
