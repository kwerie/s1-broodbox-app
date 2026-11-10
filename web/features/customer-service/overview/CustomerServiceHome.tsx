import { CustomerServiceOverview } from "./CustomerServiceOverview";

export function CustomerServiceHome() {
    return (
        <div className="flex flex-col flex-1">
            <div>
                <h1 className="text-2xl font-bold">Welkom terug!</h1>
                <p className="mb-4 text-muted-foreground">Dit speelt er vandaag.</p>
            </div>
            <CustomerServiceOverview />
        </div>
    );
}
