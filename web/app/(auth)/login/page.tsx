import { LoginForm } from "@/features/login/LoginForm"
import bbLogo from "@/public/broodbox-logo.png"

import Image from "next/image"

export default function Login() {
    return (
        <main>
            <div className="flex h-screen">
                <div className="w-5/12 bg-primary-foreground flex items-center justify-center">
                    <Image src={bbLogo} alt="Logo" width={400} height={400} />
                </div>
                <div className="w-7/12 bg-white flex flex-col items-center gap-4 justify-center">
                    <div className="mesasge text-center">
                        <h1 className="text-2xl xl:text-4xl font-bold text-gray-800">Welkom terug!</h1>
                        <h2 className="text-md xl:text-lg text-gray-600">Voer je e-mailadres en wachtwoord in om verder te gaan.</h2>
                    </div>
                    <div className="w-1/2">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </main>
    )
}
