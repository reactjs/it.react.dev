---
title: Avviare un Nuovo Progetto React
---

<Intro>

Se vuoi costruire una nuova app o un nuovo sito web interamente con React, ti consigliamo di scegliere uno dei framework basati su React piú popolari nella comunità. I framework forniscono funzionalità che la maggior parte delle app e dei siti web necessitano a un certo punto, come il routing, il recupero dei dati e la generazione di HTML.

</Intro>

<Note>

**È necessario installare [Node.js](https://nodejs.org/en/) per lo sviluppo locale.** Puoi *anche* scegliere di utilizzare Node.js in produzione, ma non è obbligatorio. Molti framework React supportano l'esportazione in una cartella statica HTML/CSS/JS.

</Note>

## Framework React di qualità professionale {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) è un framework React full-stack.** È versatile e ti consente di creare app React di qualsiasi dimensione, da un blog principalmente statico a un'applicazione dinamica complessa. Per creare un nuovo progetto Next.js, esegui il seguente comando nel tuo terminale:

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

<<<<<<< HEAD
Se sei nuovo in Next.js, dai un'occhiata al [tutorial di Next.js.](https://nextjs.org/learn/foundations/about-nextjs)
=======
If you're new to Next.js, check out the [learn Next.js course.](https://nextjs.org/learn)
>>>>>>> af54fc873819892f6050340df236f33a18ba5fb8

Next.js è mantenuto da [Vercel](https://vercel.com/). Puoi [distribuire un'app Next.js](https://nextjs.org/docs/app/building-your-application/deploying) su qualsiasi hosting Node.js o serverless, o sul tuo server personale. [Le app Next.js completamente statiche](https://nextjs.org/docs/advanced-features/static-html-export) possono essere distribuite su qualsiasi hosting statico.

### Remix {/*remix*/}

**[Remix](https://remix.run/) è un framework React full-stack con routing nidificato.** Ti consente di suddividere la tua app in parti nidificate che possono caricare dati in parallelo e aggiornarsi in risposta alle azioni dell'utente. Per creare un nuovo progetto Remix, esegui il seguente comando:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Se sei nuovo in Remix, dai un'occhiata al [blog tutorial](https://remix.run/docs/en/main/tutorials/blog) (breve) e al [app tutorial](https://remix.run/docs/en/main/tutorials/jokes) (lungo).

Remix è mantenuto da [Shopify](https://www.shopify.com/). Quando crei un progetto Remix, devi [scegliere il tuo target di distribuzione](https://remix.run/docs/en/main/guides/deployment). Puoi distribuire un'app Remix su qualsiasi hosting Node.js o serverless utilizzando o scrivendo un [adattatore](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) è un framework React per siti web CMS veloci.** Il suo ricco ecosistema di plugin e il suo livello di dati GraphQL semplificano l'integrazione di contenuti, API e servizi in un unico sito web. Per creare un nuovo progetto Gatsby, esegui il seguente comando:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Se sei nuovo in Gatsby, dai un'occhiata al [Gatsby tutorial.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby è mantenuto da [Netlify](https://www.netlify.com/). Puoi [distribuire un sito Gatsby completamente statico](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) su qualsiasi hosting statico. Se opti per l'utilizzo di funzionalità server-side, assicurati che il tuo provider di hosting supporti tali funzionalità per Gatsby.

### Expo (for native apps) {/*expo*/}

**[Expo](https://expo.dev/) è un framework per React che ti consente di creare app universali per Android, iOS e web con interfacce utente veramente native.** Fornisce un SDK per [React Native](https://reactnative.dev/) che semplifica l'utilizzo delle parti native. Per creare un nuovo progetto Expo, esegui il seguente comando:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Se sei nuovo in Expo, puoi seguire [Expo tutorial](https://docs.expo.dev/tutorial/introduction/).

Expo è mantenuto da [Expo (l'azienda)](https://expo.dev/about). La creazione di app con Expo è gratuita e puoi inviarle agli app store di Google e Apple senza restrizioni. Expo fornisce inoltre servizi cloud a pagamento opzionali.

<DeepDive>

#### È possibile utilizzare React senza un framework? {/*can-i-use-react-without-a-framework*/}

Puoi sicuramente usare React senza un framework: è così che [useresti React per una parte della tua pagina.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **Tuttavia, se stai creando una nuova app o un sito completamente con React, ti consigliamo di utilizzare un framework.**

Ecco perché.

Anche se all'inizio potresti non aver bisogno di routing o di recupero dati, è probabile che tu voglia aggiungere alcune librerie per queste funzionalità in seguito. Man mano che il tuo bundle JavaScript cresce con ogni nuova funzionalità, potresti dover capire come suddividere il codice per ogni singola route in modo individuale. Man mano che le tue esigenze di recupero dati diventano più complesse, è probabile che incontri situazioni in cui la rete tra server e client crea un effetto di cascata che rende la tua app molto lenta. Man mano che il tuo pubblico include più utenti con condizioni di rete scadenti o dispositivi di fascia bassa, potresti aver bisogno di generare HTML dai tuoi componenti per mostrare il contenuto in modo anticipato, sia lato server che durante la fase di build. Modificare la configurazione per eseguire parte del tuo codice sul server o durante la fase di build può essere molto complicato.

**Questi problemi non sono specifici di React. Questo è il motivo per cui Svelte ha SvelteKit, Vue ha Nuxt e così via.** Per risolvere questi problemi da soli, sarà necessario integrare il tuo bundler con il tuo router e con la tua libreria di recupero dati. Non è difficile far funzionare una configurazione iniziale, ma ci sono molte sottigliezze coinvolte nel creare un'applicazione che si carichi rapidamente anche man mano che cresce nel tempo. Vorrai inviare solo il minimo necessario di codice dell'applicazione, ma farlo in un unico roundtrip client-server, in parallelo con i dati richiesti per la pagina. Probabilmente vorrai che la pagina sia interattiva prima ancora che il tuo codice JavaScript venga eseguito, per supportare il miglioramento progressivo. Potresti voler generare una cartella di file HTML completamente statici per le tue pagine di marketing che possono essere ospitate ovunque e funzionare ancora con JavaScript disabilitato. Costruire queste capacità da soli richiede un vero lavoro.

**I framework React presenti in questa pagina risolvono questi problemi di default, senza alcun lavoro aggiuntivo da parte tua.** Ti permettono di iniziare con una configurazione leggera e poi scalare la tua app in base alle tue esigenze. Ogni framework React ha una comunità, quindi trovare risposte alle domande e aggiornare gli strumenti è più facile. Inoltre, i framework forniscono una struttura al tuo codice, aiutando te stesso e gli altri a mantenere il contesto e le competenze tra diversi progetti. Al contrario, con una configurazione personalizzata è più facile rimanere bloccati con versioni di dipendenze non supportate, e alla fine finirai per creare il tuo framework, anche se in modo meno strutturato e senza una comunità o un percorso di aggiornamento (e se è simile a quelli che abbiamo creato in passato, potrebbe essere progettato in modo più casuale).

Se non sei ancora convinto, o se la tua app ha vincoli insoliti che non sono soddisfatti da questi framework e desideri creare la tua configurazione personalizzata, non possiamo fermarti - fallo!  Prendi `react` e `react-dom` da npm, configura il tuo processo di build personalizzato con un bundler come [Vite](https://vitejs.dev/) o [Parcel](https://parceljs.org/), e aggiungi altri strumenti man mano che ne hai bisogno per il routing, la generazione statica o il rendering lato server, e altro ancora.
</DeepDive>

## Framework React all'avanguardia {/*bleeding-edge-react-frameworks*/}

Come abbiamo esplorato come migliorare continuamente React, abbiamo realizzato che integrare React in modo più stretto con i framework (in particolare con il routing, il bundling e le tecnologie server) è la nostra più grande opportunità per aiutare gli utenti di React a costruire app migliori. Il team di Next.js ha accettato di collaborare con noi nella ricerca, nello sviluppo, nell'integrazione e nei test di funzionalità di React all'avanguardia, indipendenti dai framework, come [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

Queste funzionalità stanno diventando sempre più vicine alla prontezza per la produzione ogni giorno, e abbiamo avviato discussioni con altri sviluppatori di bundler e framework per integrarle. La nostra speranza è che tra un anno o due, tutti i framework elencati in questa pagina avranno il pieno supporto per queste funzionalità. (Se sei un autore di framework interessato a collaborare con noi per sperimentare con queste funzionalità, ti preghiamo di farcelo sapere!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Il router dell'app di Next.js's](https://beta.nextjs.org/docs/getting-started) è una ridisegnazione delle API di Next.js che mira a realizzare la visione di architettura full-stack del team di React.** Consente di recuperare dati in componenti asincroni che vengono eseguiti sul server o addirittura durante la fase di build.

Next.js è mantenuto da [Vercel](https://vercel.com/). Puoi [distribuire un'app  Next.js](https://nextjs.org/docs/deployment) su qualsiasi hosting Node.js o serverless, o sul tuo server. Next.js supporta anche [l'esportazione statica](https://beta.nextjs.org/docs/configuring/static-export) che non richiede un server.

<DeepDive>

#### Quali caratteristiche compongono la visione di architettura full-stack del team di React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Il bundler del router dell'app di Next.js implementa completamente la specifica ufficiale dei [React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Questo consente di mescolare componenti generati a tempo di build, componenti esclusivamente server-side e componenti interattivi all'interno di un singolo albero di React.

Ad esempio, è possibile scrivere un componente React esclusivamente server-side come una funzione `async` che legge da un database o da un file. Successivamente, è possibile passare i dati ai componenti interattivi:

```js
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

Il router dell'app di Next.js integra anche il [recupero dei dati con Suspense.](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Questo consente di specificare uno stato di caricamento (come un segnaposto scheletro) per diverse parti dell'interfaccia utente direttamente nell'albero di React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components e Suspense sono funzionalità di React che possono essere adottate a livello di framework. Al momento, il router dell'app di Next.js è l'implementazione più completa di queste funzionalità tra i vari framework. Il team di React sta anche lavorando con gli sviluppatori di bundler per rendere più semplice l'implementazione di queste funzionalità nella prossima generazione di framework.

</DeepDive>
