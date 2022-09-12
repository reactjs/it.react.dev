---
title: Iniziare un progetto React
---

<Intro>

Se stai iniziando un nuovo progetto, ti raccomandiamo di utilizzare una toolchain o un framework. Questi strumenti offrono un ambiente di sviluppo confortevole ma richiedono una installazione locale di Node.js.

</Intro>

<YouWillLearn>

* In che modo le toolchains differiscono dai frameworks
* Come iniziare un progetto con una toolchain minimale
* Come iniziare un progetto con un framework che offre tutte le funzionalità
* Cosa è incluso nelle toolchain e frameworks più popolari

</YouWillLearn>

## Scegli la tua avventura {/*choose-your-own-adventure*/}

React è una libreria che ti permette di organizzare il codice UI spezzandolo in pezzi più piccoli chiamati componenti. React non si interessa di routing o gestione dei dati. Ciò significa che esistono diversi modi per iniziare un nuovo progetto React:

<<<<<<< HEAD:beta/src/pages/learn/start-a-new-react-project.md
* [Iniziare con un **file HTML ed un tag script**.](/learn/add-react-to-a-website) Questo non richiede l'impostazione di Node.js ma offre funzionalità limitate.
* Iniziare con una **toolchain minimale,** aggiungendo più funzionalità al tuo progetto lungo la strada. (Ottimo per imparare!)
* Iniziare con un **framework supponente** che ha le funzionalità più comuni quali data fetching e routing già incluse.
=======
* [Start with an **HTML file and a script tag.**](/learn/add-react-to-a-website) This doesn't require Node.js setup but offers limited features.
* Start with a **minimal toolchain,** adding more features to your project as you go. (Great for learning!)
* Start with an **opinionated framework** that has common features like data fetching and routing built-in.
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/start-a-new-react-project.md

## Iniziare con una toolchain minimale {/*getting-started-with-a-minimal-toolchain*/}

<<<<<<< HEAD:beta/src/pages/learn/start-a-new-react-project.md
Se stai **imparando React,** ti raccomandiamo [Create React App](https://create-react-app.dev/). Si tratta del modo più popolare per provare React e sviluppare una nuova applicazione client-side a pagina singola. È fatto per React ma non è supponente relativamente al routing o al data fetching.

Prima di tutto, installa [Node.js](https://nodejs.org/en/). Poi apri il tuo terminale ed esegui questo comando per creare un progetto:
=======
If you're **learning React,** we recommend [Create React App.](https://create-react-app.dev/) It is the most popular way to try out React and build a new single-page, client-side application. It's made for React but isn't opinionated about routing or data fetching.

First, install [Node.js.](https://nodejs.org/en/) Then open your terminal and run this line to create a project:
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/start-a-new-react-project.md

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Adesso puoi lanciare la tua app con:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

<<<<<<< HEAD:beta/src/pages/learn/start-a-new-react-project.md
Per maggiori informazioni, [dai uno sguardo alla guida ufficiale](https://create-react-app.dev/docs/getting-started).
=======
For more information, [check out the official guide.](https://create-react-app.dev/docs/getting-started)
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/start-a-new-react-project.md

> Create React App non gestisce logica backend o databases. Puoi usarlo con qualunque backend. Quando creerai un progetto, otterrai una cartella con HTML statico, CSS e JS. Dato che Create React App non fa uso di alcun server, non offre il meglio delle prestazioni. Se cerchi tempi di caricamento più veloci e funzionalità incluse quali routing e logica server-side, ti raccomandiamo l'uso di un framework.

### Alternative popolari {/*popular-alternatives*/}

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/getting-started/webapp/)

## Iniziare con un framework completo {/*building-with-a-full-featured-framework*/}

Se intendi **iniziare un progetto pronto al rilascio in produzione,** [Next.js](https://nextjs.org/) è un ottimo punto di partenza. Next.js è un popolare framework leggero per la generazione di contenuto statico generato server-side con React. Include funzioni quali routing, styling e server-side rendering, che ti permetteranno di lanciare il tuo progetto rapidamente.

Il tutorial [Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) rappresenta una ottima introduzione allo sviluppo con React e Next.js.

### Alternative popolari {/*popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)

## Toolchains personalizzate {/*custom-toolchains*/}

Potresti preferire la creazione e configurazione di una tua toolchain. Una toolchain generalmente è composta da:

<<<<<<< HEAD:beta/src/pages/learn/start-a-new-react-project.md
* Un **package manager** che ti permette di installare, aggiornare e gestire pacchetti di terze parti. Package managers popolari: [npm](https://www.npmjs.com/) (incluso in Node.js), [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/).
* Un **compiler** che ti permette di compilare funzioni moderne del linguaggio e sintassi addizionale come JSX o annotazioni dei tipi per i browsers. Compilers popolari: [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/), [swc](https://swc.rs/).
* Un **bundler** che ti permette di scrivere codice modulare e raggrupparlo a partire da pacchetti più piccoli per ottimizzare i tempi di caricamento. Bundlers popolari: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc](https://swc.rs/).
* Un **minifier** che ti permette di rendere il tuo codice più compatto per far sì che si carichi più rapidamente. Minifiers popolari: [Terser](https://terser.org/), [swc](https://swc.rs/).
* Un **server** che gestisce le richieste server per far si che renderizzi i componenti in HTML. Servers popolari: [Express](https://expressjs.com/).
* Un **linter** che controlla che il codice non contenga errori comuni. Linters popolari: [ESLint](https://eslint.org/).
* Un **test runner** che ti permette di eseguire tests sul tuo codice. Test runners popolari: [Jest](https://jestjs.io/).

Se preferisci impostare la tua toolchain JavaScript partendo da zero, [da uno sguardo a questa guida](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) che mostra come ricreare alcune delle funzionalità offerte da Create React App. Un framework offrirà inoltre anche soluzioni per il routing ed il data fetching. Per progetti più grandi, potresti aver bisogno di dover gestire pacchetti multipli in una repository singola usando tools come [Nx](https://nx.dev/react) o [Turborepo](https://turborepo.org/).
=======
* A **package manager** lets you install, update, and manage third-party packages. Popular package managers: [npm](https://www.npmjs.com/) (built into Node.js), [Yarn](https://yarnpkg.com/), [pnpm.](https://pnpm.io/)
* A **compiler** lets you compile modern language features and additional syntax like JSX or type annotations for the browsers. Popular compilers: [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/), [swc.](https://swc.rs/)
* A **bundler** lets you write modular code and bundle it together into small packages to optimize load time. Popular bundlers: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc.](https://swc.rs/)
* A **minifier** makes your code more compact so that it loads faster. Popular minifiers: [Terser](https://terser.org/), [swc.](https://swc.rs/)
* A **server** handles server requests so that you can render components to HTML. Popular servers: [Express.](https://expressjs.com/)
* A **linter** checks your code for common mistakes. Popular linters: [ESLint.](https://eslint.org/)
* A **test runner** lets you run tests against your code. Popular test runners: [Jest.](https://jestjs.io/)

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality. A framework will usually also provide a routing and a data fetching solution. In a larger project, you might also want to manage multiple packages in a single repository with a tool like [Nx](https://nx.dev/react) or [Turborepo.](https://turborepo.org/)
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/start-a-new-react-project.md

