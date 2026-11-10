import { Address } from "@/lib/api/dtos";

export function AddressLines({ address }: { address: Address }) {
    const houseNumber = address.addition
        ? `${address.houseNumber} ${address.addition}`
        : `${address.houseNumber}`;

    return (
        <div className="text-sm text-muted-foreground">
            <p>
                {address.street} {houseNumber}
            </p>
            <p>
                {address.postalCode} {address.city}
            </p>
            <p>Nederland</p>
        </div>
    );
}
