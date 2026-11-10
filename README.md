# S1 BroodBox case bestelproces

Deze repository bevat de broncode voor de realisatie van het bestelportaal van De BroodBox.

## Benodigdheden voor het opzetten van de lokale ontwikkelomgeving

- Docker -- er wordt gebruik gemaakt van docker om bijvoorbeeld de database op te spinnen.
  - De API en de front-end van de app dienen later nog in de Docker setup opgenomen te worden
- .NET 10 -- nodig om de API te builden en lokaal te draaien
- Node v24 (of nieuwer)
- PNPM - pnpm is de gekozen package manager voor de front-end van het project

## Het opstarten van het project

1. In de repository root, start de database door middel van `docker compose up db`. Dit zorgt ervoor dat de database container wordt opgestart en dat er een database, database user icm password worden aangemaakt.
2. Zodra de database is gestart, voer in de `api/` directory `dotnet run` uit, deze maakt automatisch een connectie met de database, voert migraties uit zodat het database schema wordt aangemaakt en zorgt ervoor dat er al enige data in de database wordt gevoed.
3. In de `web/` directory, voer als eerst `pnpm i` uit zodat alle dependencies worden geïnstalleerd en voer vervolgens `pnpm dev` uit zodat de frontend wordt opgespint.
4. De frontend is bereikbaar via `https://localhost:3000` en er kan met de volgende gegevens worden ingelogd:
   1. Customer service:
      - email: service@broodbox.test
      - wachtwoord: welkom01
   2. Customer1:
      - email: customer@broodbox.test
      - wachtwoord: welkom01
   3. Customer2:
      - email: customer2@broodbox.test
      - wachtwoord: welkom01
