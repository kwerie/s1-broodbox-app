"use client";

import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";
import { Address, Allergy, Dish, Order } from "@/lib/api/dtos";

export type DishLine = { dishId: number; quantity: number };

export type RecipientDraft = {
    tempId: string;
    name: string;
    lockerNumber: string;
    allergyIds: number[];
    preferences: string[];
};

export type WizardState = {
    draftId: number;
    step: number;
    dishes: DishLine[];
    recipients: RecipientDraft[];
    invoiceAddressId: number | null;
    shippingAddressId: number | null;
    availableDishes: Dish[];
    allergies: Allergy[];
    addresses: Address[];
    confirmedOrder: Order | null;
};

type Action =
    | { type: "setStep"; step: number }
    | { type: "setDishes"; dishes: DishLine[] }
    | { type: "setRecipients"; recipients: RecipientDraft[] }
    | { type: "setInvoiceAddress"; id: number | null }
    | { type: "setShippingAddress"; id: number | null }
    | { type: "setAddresses"; addresses: Address[] }
    | { type: "setConfirmedOrder"; order: Order };

function reducer(state: WizardState, action: Action): WizardState {
    switch (action.type) {
        case "setStep":
            return { ...state, step: action.step };
        case "setDishes":
            return { ...state, dishes: action.dishes };
        case "setRecipients":
            return { ...state, recipients: action.recipients };
        case "setInvoiceAddress":
            return { ...state, invoiceAddressId: action.id };
        case "setShippingAddress":
            return { ...state, shippingAddressId: action.id };
        case "setAddresses":
            return { ...state, addresses: action.addresses };
        case "setConfirmedOrder":
            return { ...state, confirmedOrder: action.order };
    }
}

export type WizardInit = {
    draft: Order;
    dishes: Dish[];
    allergies: Allergy[];
    addresses: Address[];
};

function buildInitialState({ draft, dishes, allergies, addresses }: WizardInit): WizardState {
    return {
        draftId: draft.id,
        step: 1,
        dishes: draft.dishes.map((orderDish) => ({
            dishId: orderDish.dish.id,
            quantity: orderDish.quantity,
        })),
        recipients: draft.recipients.map((recipient) => ({
            tempId: crypto.randomUUID(),
            name: recipient.name,
            lockerNumber: recipient.lockerNumber,
            allergyIds: recipient.allergies.map((allergy) => allergy.id),
            preferences: recipient.preferences.map((preference) => preference.description),
        })),
        invoiceAddressId:
            draft.invoiceAddress?.id ?? addresses.find((address) => address.isDefaultInvoice)?.id ?? null,
        shippingAddressId:
            draft.deliveryAddress?.id ?? addresses.find((address) => address.isDefaultShipping)?.id ?? null,
        availableDishes: dishes,
        allergies,
        addresses,
        confirmedOrder: null,
    };
}

const WizardContext = createContext<{ state: WizardState; dispatch: Dispatch<Action> } | null>(null);

export function WizardProvider({ init, children }: { init: WizardInit; children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, init, buildInitialState);

    return <WizardContext.Provider value={{ state, dispatch }}>{children}</WizardContext.Provider>;
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (!context) {
        throw new Error("useWizard must be used within a WizardProvider");
    }
    return context;
}
