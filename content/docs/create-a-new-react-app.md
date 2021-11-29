---
id: create-a-new-react-app
title: Creare una Nuova App React
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Utilizza una toolchain integrata per avere la migliore esperienza utente e di sviluppo.

Questa pagina descrive alcune toolchains popolari di React che ti aiuteranno per compiti come:

* Scalare su molti file e componenti.
* Utilizzare librerie di terze parti importate da npm.
* Individuare subito errori comuni.
* Visualizzare in tempo reale l'effetto delle modifiche al codice JavaScript e CSS durante lo sviluppo.
* Ottimizzare l'output per la produzione.

Le toolchains raccomandate in questa pagina **non hanno bisogno di una configurazione per essere utilizzate**.

## Potresti Non Avere Bisogno di una Toolchain {#you-might-not-need-a-toolchain}

Se non hai a che fare con i problemi descritti sopra o non ti senti a tuo agio ad utilizzare questi strumenti JavaScript, considera se [aggiungere React come un semplice tag `<script>` a una pagina HTML](/docs/add-react-to-a-website.html), opzionalmente [utilizzando JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Questo è anche **il modo più semplice di integrare React in un sito esistente.** Puoi sempre aggiungere una toolchain più estesa in seguito se trovi che sia utile!

## Toolchains Raccomandate {#recommended-toolchains}

Il team di React raccomanda prima di tutto queste soluzioni:

- Se stai **imparando React** o **creando una nuova applicazione [single-page](/docs/glossary.html#single-page-application),** utilizza [Create React App](#create-react-app).
- Se stai realizzando un **sito renderizzato lato server con Node.js,** prova [Next.js](#nextjs).
- Se stai realizzando un **sito orientato al contenuto statico,** prova [Gatsby](#gatsby).
- Se stai realizzando una **libreria di componenti** o **integrando una base di codice preesistente**, prova con le [Toolchains Più Flessibili](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) è un ambiente confortevole per **imparare React**, ed è il modo migliore per iniziare a costruire **una nuova applicazione [single-page](/docs/glossary.html#single-page-application)** in React.

Si occupa di configurare il tuo ambiente di sviluppo in modo da poter utilizzare le caratteristiche più recenti di JavaScript, fornisce un'ottima esperienza di sviluppo e ottimizza la tua applicazione per la produzione. Avrai bisogno di avere installato [Node >= 14.0.0 and npm >= 5.6](https://nodejs.org/en/) nella tua macchina. Per creare un progetto, esegui:

```bash
npx create-react-app mia-app
cd mia-app
npm start
```

>Nota
>
>`npx` nella prima riga non è un errore di battitura -- è [un esecutore di pacchetti incluso in npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App non gestisce la logica di backend o i database; crea soltanto una catena di build per il frontend, quindi puoi utilizzarlo con qualsiasi backend. Al suo interno utilizza [Babel](https://babeljs.io/) e [webpack](https://webpack.js.org/), ma non hai bisogno di sapere nulla a tal riguardo.

Quando sei pronto a rilasciare in produzione, esegui il comando `npm run build` e verrà creata una build ottimizzata della tua applicazione nella cartella `build`. Puoi sapere di più su Create React App [leggendo il README](https://github.com/facebookincubator/create-react-app#create-react-app--) e la [Guida per gli Utenti](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) è un framework popolare e leggero per le **applicazioni statiche e renderizzate lato server** realizzate con React. Include di serie **soluzioni per il routing e l'applicazione degli stili**, e assume che tu stia utilizzando [Node.js](https://nodejs.org/) come ambiente server.

Impara ad utilizzare Next.js seguendo [la sua guida ufficiale](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) è il miglior modo di creare **siti statici** con React. Ti consente di utilizzare componenti React, ma il suo output è costituito interamente da codice HTML e CSS pre-renderizzato, in modo da garantire tempi di caricamento i più rapidi possibile.

Impara ad utilizzare Gatsby dalla [sua guida ufficiale](https://www.gatsbyjs.org/docs/) e da questa [galleria di kit di partenza](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Toolchains Più Flessibili {#more-flexible-toolchains}

Le toolchains seguenti offrono più scelta e flessibilità. Le raccomandiamo per gli utenti più esperti:

- **[Neutrino](https://neutrinojs.org/)** combina la potenza di [webpack](https://webpack.js.org/) con la semplicità dei presets, e include un preset per le [applicazioni React](https://neutrinojs.org/packages/react/) e per i [componenti React](https://neutrinojs.org/packages/react-components/).

- **[Nx](https://nx.dev/react)** è uno strumento che permette lo sviluppo di monorepo full-stack, con supporto integrato per React, Next.js, [Express](https://expressjs.com/), ed altro.

- **[Parcel](https://parceljs.org/)** è un builder di applicazioni rapido e senza configurazioni che [funziona con React](https://parceljs.org/recipes/react/).

- **[Razzle](https://github.com/jaredpalmer/razzle)** è un framework di renderizzazione lato server che non ha bisogno di configurazioni, ma offre più flessibilità di Next.js.

## Creare una Toolchain da Zero {#creating-a-toolchain-from-scratch}

Una toolchain JavaScript di build tipicamente comprende i seguenti strumenti:

* Un **gestore di pacchetti**, come [Yarn](https://yarnpkg.com/) o [npm](https://www.npmjs.com/). Ti consente di trarre vantaggio da un vasto ecosistema di pacchetti di terze parti, occupandosi della loro installazione e aggiornamento.

* Un **bundler**, come [webpack](https://webpack.js.org/) o [Parcel](https://parceljs.org/). Ti consente di scrivere codice modulare e racchiuderlo in piccoli pacchetti per ottimizzare i tempi di caricamento.

* Un **compilatore** come [Babel](https://babeljs.io/). Ti consente di scrivere codice JavaScript moderno che funziona anche nei vecchi browser.

Se preferisci realizzare la tua toolchain JavaScript da zero, [leggi questa guida](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) in cui alcune delle funzionalità di Create React App vengono ricreate.

Non dimenticarti di controllare che la tua toolchain personalizzata [sia impostata correttamente per la produzione](/docs/optimizing-performance.html#use-the-production-build).
