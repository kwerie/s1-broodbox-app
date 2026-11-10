import { Address } from "@/lib/api/dtos";

export function AddressLines({ address, companyName }: { address: Address; companyName?: string }) {
    const houseNumber = address.addition
        ? `${address.houseNumber} ${address.addition}`
        : `${address.houseNumber}`;

    return (
        <div className="text-sm">
            {companyName && <p className="font-medium text-foreground">{companyName}</p>}
            <div className="text-muted-foreground">
                <p>
                    {address.street} {houseNumber}
                </p>
                <p>
                    {address.postalCode} {address.city}
                </p>
                <p>Nederland</p>
            </div>
        </div>
    );
}
