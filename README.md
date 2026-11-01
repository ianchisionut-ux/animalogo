# AnimaLogo

Aplicație educativă în română pentru desktop, telefon și tabletă, cu 36 de animale și insecte. Interfață compactă, jocuri de ascultare, asociere cu habitatul și hrana și exerciții „Ascultă și repetă”.

## Comportament

- Adultul pornește manual indiciul audio.
- Greșeala produce două note blânde și o animație discretă; copilul poate încerca din nou.
- Răspunsul corect produce feedback sonor și steluțe animate.
- Ecranele de joc nu conțin instrucțiuni, saluturi sau încurajări scrise adresate copilului. Feedbackul vizibil folosește simboluri și animații; numele animalelor, onomatopeele și comenzile pentru adult sunt păstrate.
- Jocul trece automat la runda următoare după 1,4 secunde. Nu există buton „Mai departe”.
- Aventurile amestecă implicit cele patru tipuri de joc, fără două jocuri identice consecutive. Prima rundă respectă jocul ales; adultul poate dezactiva amestecarea. Pozițiile elementelor și ordinea cardurilor de joc sunt aleatorii.
- Butonul „Oprește” este activ numai când se redă audio și oprește atât înregistrările, cât și semnalele sonore.
- Jocurile, ecranul principal și progresul se adaptează la înălțimea ecranului. Catalogul animalelor poate fi derulat.
- Panoul adultului este împărțit în taburi pentru setări, sunete și progres.
- Setările, progresul și modelele audio personalizate se salvează în browser; înregistrările nu sunt încărcate pe un server.
- Aplicația poate fi adăugată pe ecranul principal. După încărcarea și memorarea fișierelor de către service worker, funcționează și offline.

## Dezvoltare

Necesită Node.js 22 sau mai nou. Aplicația este statică și nu are dependențe de runtime.

```sh
npm run dev
npm run build
```

Serverul local: `http://127.0.0.1:3188`.

`npm run build` verifică existența înregistrărilor reale pentru toate cele 36 de animale și generează cache-ul offline cu o versiune derivată din conținutul fișierelor.

## Audio

Sunetele animalelor sunt înregistrări reale, cu proveniență și licență individuală în [audio-manifest.json](public/audio-manifest.json) și [audio-credits.txt](public/audio-credits.txt). Fragmentele sunt scurtate și normalizate. Licențele fiecărui fișier audio rămân aplicabile. Nu sunt necesare servicii sau chei API pentru redare.

Importul de modele audio acceptă maximum 15 MB / 60 secunde. Înregistrarea modelului adultului durează maximum 15 secunde și solicită acces la microfon. Citirea numelor folosește cele 36 de pronunții românești incluse în `public/names`, obținute prin serviciul de pronunție Google Translate. Nu necesită voci sau software instalate pe dispozitiv și nu apelează servicii externe în timpul redării. Proveniența fișierelor este în `public/name-audio-manifest.json`.

## Verificare

```sh
node tests/layout.cjs
npm test
```

Testele de browser folosesc Playwright și Google Chrome instalat pe PC. Rulează `npm install` înaintea testelor pe un alt calculator. Sunt verificate dimensiunile 320×568, 360×640, 390×844, 412×915, 768×1024, 1366×768 și 844×390, feedbackul, trasarea, avansarea automată și salvarea progresului.

## Publicare

Proiect Vercel: `animalogo`, în echipa `pmcustoms`. Repository: `ianchisionut-ux/animalogo`. Director publicat: `public`. Fișierele de autentificare, `.env*`, `.vercel` și directoarele de cercetare nu sunt incluse în Git.

Ilustrațiile și sigla provin din prima versiune AnimaLogo: sigla furnizată de utilizator și ilustrații generate pentru proiect.

Tema ilustrată comună tuturor ecranelor este în `public/theme.css`. Fundalul, bannerul cu vulpița și pictogramele jocurilor au fost generate pentru această aplicație; detaliile sunt în `public/visual-credits.txt`. Navigarea folosește SVG, iar textul și comenzile rămân elemente HTML accesibile.
