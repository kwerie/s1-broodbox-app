export enum OrderStatus {
    Received = 0,
    Accepted = 1,
    InPreparation = 2,
    Done = 3,
}

export enum AllergyType {
    Gluten = 0,
    Crustaceans = 1,
    Eggs = 2,
    Fish = 3,
    Peanuts = 4,
    Soybeans = 5,
    Milk = 6,
    Nuts = 7,
    Celery = 8,
    Mustard = 9,
    Sesame = 10,
    Sulphites = 11,
    Lupin = 12,
    Molluscs = 13,
}

export type Dish = {
    id: number;
    name: string;
    preparationTime: number;
    price: number;
};

export type OrderDish = {
    dish: Dish;
    quantity: number;
};

export type Allergy = {
    id: number;
    type: AllergyType;
    description: string;
};

export type Preference = {
    id: number;
    description: string;
};

export type Recipient = {
    id: number;
    name: string;
    lockerNumber: string;
    allergies: Allergy[];
    preferences: Preference[];
};

export type Address = {
    id: number;
    street: string;
    houseNumber: number;
    addition: string | null;
    postalCode: string;
    city: string;
    isDefaultInvoice: boolean;
    isDefaultShipping: boolean;
};

export type Order = {
    id: number;
    orderedAt: string;
    orderNumber: string;
    customerName: string;
    companyName: string;
    status: OrderStatus;
    dishes: OrderDish[];
    recipients: Recipient[];
    deliveryAddress: Address | null;
    invoiceAddress: Address | null;
    note: string | null;
};
