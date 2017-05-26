Live visning af webaplikationen:
https://s7lan.herokuapp.com/

-------------------------------

Installation
1) For at kunne køre denne applikation, skal node.js være installeret: https://nodejs.org/en/
2) Efter installationen af node.js, åbnes kommandoprompten som administrator. 
3) Udpak ZIP-filen. Dette kan tage nogle minutter. 
4) Navigér via kommandoprompten ind i projektmappen og videre ind i mappen "kode".
5) Kør kommandoen "npm install".
6) Kør kommandoen "bower install".
7) Kør kommandoen "node app" for at starte serveren. 
8) Åben et browservindue og skriv denne URL: "localhost:3000".

En visuel guide af installationen kan ses her:
Windows:  https://www.youtube.com/watch?v=L8PhUN1pe5E
Mac:      https://www.youtube.com/watch?v=K3p0QcSL87U

Nogle funktioner virker endnu ikke i firefox. 
Da projektet blev designet med browseren chrome, foreslås det at søge til denne browser ved problemer. 

Skulle der forekomme problemer ved brugen af siden, eller tvivl om sidens funktionaliten, er der udført en video af samtlige af sidens funktioner i brug:
https://www.youtube.com/watch?v=02foGrJMJKo

-------------------------------

Sådan bruges admin-funktionerne i webapplikationens:
* LAN
    For at opdaterer oplysninger om et lan, udfyldes alle felterne på siden, og der trykkes på knappen "Opdater oplysninger".
* Siddegruppe
    Ved redigering af grupper, kan gruppens navn, adgangskode og gruppens medlemmer blive ændret.
* Opslag
    Ud for hvert opslag, vælger en checkbox om dette opslag bliver vist på forsiden. 
    Efter ændring af disse, trykkes på knappen "Gem instillinger" i bunden af dokumentet. 
* Brugere
    Knapperne øverst i dokumentet påvirker de brugere, der er valgt med en checkbox. 
* Turneringer
    Ved oprettelse af turneringer, fyldes hele formen ud før der trykkes på knappen "Opret".
    Redigering af turneringer virker endnu ikke. 
    Tildmelding til turneringer virker endnu ikke. 
* Pladskort
    Den øverste række af knapper justerer i kortets størrelse.
    Den næste række af knapper vælger hvilken type blok der bliver tegnet med.
    Efter optegning, gemmes filen som en JSON-streng.
    Til sidst trykkes "Gem kort".
    Reservation af pladser virker endnu ikke. 
* Mails
    I modtagerfeltet vælges den eller de ønskede modtagere. 
    ALL USERS sender en mail til alle registrerede brugere.
    ALL UNPAID sender en mail til alle registrerede brugere, der har valgt at de skal til dette lan, men endnu ikke har betalt. 
* Galleri
    Ved knappen "Vælg filer", uploades billeder til galleriet. 
    Ved knapperne "Slet billede" ved hvert billede, slettes tilhørende billede. 
