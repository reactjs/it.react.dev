---
title: "Deprecazione di Create React App"
author: Matt Carroll and Ricky Hanlon
date: 2025/02/14
description: Oggi depreciamo Create React App per le nuove app e incoraggiamo le app esistenti a migrare a un framework o a un build tool come Vite, Parcel o RSBuild. Forniamo anche documentazione per quando un framework non è adatto al tuo progetto, vuoi costruire il tuo framework o vuoi semplicemente imparare come funziona React costruendo un'app React da zero.
translationStatus: ai-draft
---

February 14, 2025 by [Matt Carroll](https://twitter.com/mattcarrollcode) and [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2025/02/14/sunsetting-create-react-app.md).

</Note>

<Intro>

Oggi depreciamo [Create React App](https://create-react-app.dev/) per le nuove app e incoraggiamo le app esistenti a migrare a un [framework](#how-to-migrate-to-a-framework) o a [migrare a un build tool](#how-to-migrate-to-a-build-tool) come Vite, Parcel o RSBuild.

Forniamo anche documentazione per quando un framework non è adatto al tuo progetto, vuoi costruire il tuo framework o vuoi semplicemente imparare come funziona React [costruendo un'app React da zero](/learn/build-a-react-app-from-scratch).

</Intro>

-----

Quando abbiamo rilasciato Create React App nel 2016, non c'era un modo chiaro per costruire una nuova app React.

Per creare un'app React, dovevi installare un mucchio di strumenti e collegarli insieme per supportare funzionalità di base come JSX, linting e hot reloading. Era molto difficile farlo correttamente, quindi la [community](https://github.com/react-boilerplate/react-boilerplate) [ha creato](https://github.com/kriasoft/react-starter-kit) [boilerplate](https://github.com/petehunt/react-boilerplate) per [setup](https://github.com/gaearon/react-hot-boilerplate) [comuni](https://github.com/erikras/react-redux-universal-hot-example). Tuttavia, i boilerplate erano difficili da aggiornare e la frammentazione rendeva difficile per React rilasciare nuove funzionalità.

Create React App ha risolto questi problemi combinando diversi strumenti in una singola configurazione raccomandata. Questo ha permesso alle app un modo semplice per aggiornarsi alle nuove funzionalità del tooling e ha permesso al team React di distribuire cambiamenti di tooling non banali (supporto Fast Refresh, regole lint React Hooks) al pubblico più ampio possibile.

Questo modello è diventato così popolare che oggi esiste un'intera categoria di strumenti che funzionano in questo modo.

## Deprecating Create React App {/*deprecating-create-react-app*/}

Sebbene Create React App renda facile iniziare, [ci sono diverse limitazioni](#limitations-of-build-tools) che rendono difficile costruire app di produzione ad alte performance. In linea di principio, potremmo risolvere questi problemi evolvendo essenzialmente Create React App in un [framework](#why-we-recommend-frameworks).

Tuttavia, poiché Create React App attualmente non ha maintainer attivi e ci sono molti framework esistenti che risolvono già questi problemi, abbiamo deciso di deprecare Create React App.

A partire da oggi, se installi una nuova app, vedrai un avviso di deprecazione:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

create-react-app is deprecated.
{'\n\n'}
You can find a list of up-to-date React frameworks on react.dev
For more info see: react.dev/link/cra
{'\n\n'}
This error message will only be shown once per install.

</ConsoleLogLine>
</ConsoleBlockMulti>

Abbiamo anche aggiunto un avviso di deprecazione al [sito web](https://create-react-app.dev/) e al [repo](https://github.com/facebook/create-react-app) GitHub di Create React App. Create React App continuerà a funzionare in modalità manutenzione, e abbiamo pubblicato una nuova versione di Create React App compatibile con React 19.

## How to Migrate to a Framework {/*how-to-migrate-to-a-framework*/}
Raccomandiamo di [creare nuove app React](/learn/creating-a-react-app) con un framework. Tutti i framework che raccomandiamo supportano client-side rendering ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)) e single-page app ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)), e possono essere distribuiti su un CDN o un servizio di hosting statico senza un server.

Per le app esistenti, queste guide ti aiuteranno a migrare a una SPA solo client:

* [Guida di migrazione Create React App di Next.js](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)
* [Guida all'adozione framework di React Router](https://reactrouter.com/upgrading/component-routes).
* [Guida di migrazione Expo webpack a Expo Router](https://docs.expo.dev/router/migrate/from-expo-webpack/)

## How to Migrate to a Build Tool {/*how-to-migrate-to-a-build-tool*/}

Se la tua app ha vincoli insoliti, preferisci risolvere questi problemi costruendo il tuo framework, o vuoi semplicemente imparare come funziona React da zero, puoi creare la tua configurazione personalizzata con React usando Vite, Parcel o Rsbuild.

Per le app esistenti, queste guide ti aiuteranno a migrare a un build tool:

* [Guida di migrazione Create React App con Vite](https://www.robinwieruch.de/vite-create-react-app/)
* [Guida di migrazione Create React App con Parcel](https://parceljs.org/migration/cra/)
* [Guida di migrazione Create React App con Rsbuild](https://rsbuild.dev/guide/migration/cra)

Per aiutarti a iniziare con Vite, Parcel o Rsbuild, abbiamo aggiunto nuova documentazione per [Building a React App from Scratch](/learn/build-a-react-app-from-scratch).

<DeepDive>

#### Do I need a framework? {/*do-i-need-a-framework*/}

La maggior parte delle app trarrebbe beneficio da un framework, ma ci sono casi validi per costruire un'app React da zero. Una buona regola empirica è che se la tua app ha bisogno di routing, probabilmente trarresti beneficio da un framework.

Proprio come Svelte ha Sveltekit, Vue ha Nuxt e Solid ha SolidStart, [React raccomanda di usare un framework](#why-we-recommend-frameworks) che integra completamente il routing in funzionalità come data-fetching e code-splitting out of the box. Questo evita il dolore di dover scrivere configurazioni complesse e costruire essenzialmente un framework da solo.

Tuttavia, puoi sempre [costruire un'app React da zero](/learn/build-a-react-app-from-scratch) usando un build tool come Vite, Parcel o Rsbuild.

</DeepDive>

Continua a leggere per saperne di più sulle [limitazioni dei build tool](#limitations-of-build-tools) e [perché raccomandiamo i framework](#why-we-recommend-frameworks).

## Limitations of Build Tools {/*limitations-of-build-tools*/}

Create React App e build tool simili rendono facile iniziare a costruire un'app React. Dopo aver eseguito `npx create-react-app my-app`, ottieni un'app React completamente configurata con un development server, linting e una build di produzione.

Ad esempio, se stai costruendo uno strumento admin interno, puoi iniziare con una landing page:

```js
export default function App() {
  return (
    <div>
      <h1>Welcome to the Admin Tool!</h1>
    </div>
  )
}
```

Questo ti consente di iniziare immediatamente a scrivere codice in React con funzionalità come JSX, regole lint predefinite e un bundler da usare sia in development che in produzione. Tuttavia, questo setup manca degli strumenti necessari per costruire una vera app di produzione.

La maggior parte delle app di produzione ha bisogno di soluzioni a problemi come routing, data fetching e code splitting.

### Routing {/*routing*/}

Create React App non include una soluzione di routing specifica. Se stai iniziando, un'opzione è usare `useState` per passare tra le route. Ma farlo significa che non puoi condividere link alla tua app — ogni link andrebbe alla stessa pagina — e strutturare la tua app diventa difficile nel tempo:

```js
import {useState} from 'react';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App() {
  // ❌ Routing in state does not create URLs
  const [route, setRoute] = useState('home');
  return (
    <div>
      {route === 'home' && <Home />}
      {route === 'dashboard' && <Dashboard />}
    </div>
  )
}
```

Ecco perché la maggior parte delle app che usano Create React App aggiunge il routing con una libreria di routing come [React Router](https://reactrouter.com/) o [Tanstack Router](https://tanstack.com/router/latest). Con una libreria di routing, puoi aggiungere route aggiuntive all'app, che fornisce opinioni sulla struttura della tua app e ti consente di iniziare a condividere link alle route. Ad esempio, con React Router puoi definire le route:

```js
import {RouterProvider, createBrowserRouter} from 'react-router';

import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Each route has it's own URL
const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/dashboard', element: <Dashboard />}
]);

export default function App() {
  return (
    <RouterProvider value={router} />
  )
}
```

Con questo cambiamento, puoi condividere un link a `/dashboard` e l'app navigherà alla pagina dashboard. Una volta che hai una libreria di routing, puoi aggiungere funzionalità aggiuntive come route annidate, route guards e transizioni di route, che sono difficili da implementare senza una libreria di routing.

Qui c'è un tradeoff: la libreria di routing aggiunge complessità all'app, ma aggiunge anche funzionalità difficili da implementare senza di essa.

### Data Fetching {/*data-fetching*/}

Un altro problema comune in Create React App è il data fetching. Create React App non include una soluzione di data fetching specifica. Se stai iniziando, un'opzione comune è usare `fetch` in un Effetto per caricare i dati.

Ma farlo significa che i dati vengono recuperati dopo che il componente renderizza, il che può causare network waterfall. I network waterfall sono causati dal recuperare dati quando la tua app renderizza invece che in parallelo mentre il codice si sta scaricando:

```js
export default function Dashboard() {
  const [data, setData] = useState(null);

  // ❌ Fetching data in a component causes network waterfalls
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

Recuperare dati in un Effetto significa che l'utente deve aspettare più a lungo per vedere il contenuto, anche se i dati avrebbero potuto essere recuperati prima. Per risolvere, puoi usare una libreria di data fetching come [TanStack Query](https://tanstack.com/query/), [SWR](https://swr.vercel.app/), [Apollo](https://www.apollographql.com/docs/react) o [Relay](https://relay.dev/) che forniscono opzioni per prefetchare i dati così la richiesta inizia prima che il componente renderizzi.

Queste librerie funzionano al meglio quando integrate con il pattern "loader" del tuo routing per specificare le dipendenze dati a livello di route, il che consente al router di ottimizzare i tuoi fetch di dati:

```js
export async function loader() {
  const response = await fetch(`/api/data`);
  const data = await response.json();
  return data;
}

// ✅ Fetching data in parallel while the code is downloading
export default function Dashboard({loaderData}) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

Al caricamento iniziale, il router può recuperare i dati immediatamente prima che la route venga renderizzata. Mentre l'utente naviga nell'app, il router è in grado di recuperare sia i dati che la route contemporaneamente, parallelizzando i fetch. Questo riduce il tempo necessario per vedere il contenuto sullo schermo e può migliorare l'esperienza utente.

Tuttavia, questo richiede di configurare correttamente i loader nella tua app e scambia complessità per performance.

### Code Splitting {/*code-splitting*/}

Un altro problema comune in Create React App è il [code splitting](https://www.patterns.dev/vanilla/bundle-splitting). Create React App non include una soluzione di code splitting specifica. Se stai iniziando, potresti non considerare affatto il code splitting.

Ciò significa che la tua app viene spedita come un singolo bundle:

```txt
- bundle.js    75kb
```

Ma per performance ideali, dovresti "dividere" il tuo codice in bundle separati così l'utente deve scaricare solo ciò di cui ha bisogno. Questo riduce il tempo che l'utente deve aspettare per caricare la tua app, scaricando solo il codice necessario per vedere la pagina in cui si trova.

```txt
- core.js      25kb
- home.js      25kb
- dashboard.js 25kb
```

Un modo per fare code-splitting è con `React.lazy`. Tuttavia, ciò significa che il codice non viene recuperato finché il componente non renderizza, il che può causare network waterfall. Una soluzione più ottimale è usare una funzionalità del router che recupera il codice in parallelo mentre il codice si sta scaricando. Ad esempio, React Router fornisce un'opzione `lazy` per specificare che una route deve essere code split e ottimizzare quando viene caricata:

```js
import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Routes are downloaded before rendering
const router = createBrowserRouter([
  {path: '/', lazy: () => import('./Home')},
  {path: '/dashboard', lazy: () => import('Dashboard')}
]);
```

Un code-splitting ottimizzato è difficile da fare bene, ed è facile commettere errori che possono far scaricare all'utente più codice del necessario. Funziona al meglio quando integrato con le soluzioni di router e data loading per massimizzare la cache, parallelizzare i fetch e supportare pattern ["import on interaction"](https://www.patterns.dev/vanilla/import-on-interaction).

### And more... {/*and-more*/}

Questi sono solo alcuni esempi delle limitazioni di Create React App.

Una volta integrato routing, data-fetching e code splitting, devi anche considerare pending state, interruzioni di navigazione, messaggi di errore all'utente e revalidazione dei dati. Ci sono intere categorie di problemi che gli utenti devono risolvere come:

<div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}}>
  <ul>
    <li>Accessibility</li>
    <li>Asset loading</li>
    <li>Authentication</li>
    <li>Caching</li>
  </ul>
  <ul>
    <li>Error handling</li>
    <li>Mutating data</li>
    <li>Navigations</li>
    <li>Optimistic updates</li>
  </ul>
  <ul>
    <li>Progressive enhancement</li>
    <li>Server-side rendering</li>
    <li>Static site generation</li>
    <li>Streaming</li>
  </ul>
</div>

Tutti questi lavorano insieme per creare la [loading sequence](https://www.patterns.dev/vanilla/loading-sequence) più ottimale.

Risolvere ciascuno di questi problemi individualmente in Create React App può essere difficile poiché ogni problema è interconnesso con gli altri e può richiedere competenze approfondite in aree che gli utenti potrebbero non conoscere. Per risolvere questi problemi, gli utenti finiscono per costruire soluzioni su misura sopra Create React App, che era esattamente il problema che Create React App cercava di risolvere.

## Why we Recommend Frameworks {/*why-we-recommend-frameworks*/}

Sebbene potresti risolvere tutti questi pezzi da solo in un build tool come Create React App, Vite o Parcel, è difficile farlo bene. Proprio come quando Create React App stesso integrava diversi build tool insieme, hai bisogno di uno strumento che integri tutte queste funzionalità insieme per offrire la migliore esperienza agli utenti.

Questa categoria di strumenti che integra build tool, rendering, routing, data fetching e code splitting è nota come "framework" — o se preferisci chiamare React stesso un framework, potresti chiamarli "metaframework".

I framework impongono alcune opinioni sulla strutturazione della tua app per fornire un'esperienza utente molto migliore, nello stesso modo in cui i build tool impongono alcune opinioni per rendere il tooling più facile. Ecco perché abbiamo iniziato a raccomandare framework come [Next.js](https://nextjs.org/), [React Router](https://reactrouter.com/) ed [Expo](https://expo.dev/) per i nuovi progetti.

I framework forniscono la stessa esperienza di getting started di Create React App, ma forniscono anche soluzioni ai problemi che gli utenti devono comunque risolvere nelle app di produzione reali.

<DeepDive>

#### Server rendering is optional {/*server-rendering-is-optional*/}

I framework che raccomandiamo offrono tutti l'opzione di creare un'app [client-side rendered (CSR)](https://developer.mozilla.org/en-US/docs/Glossary/CSR).

In alcuni casi, CSR è la scelta giusta per una pagina, ma spesso non lo è. Anche se la maggior parte della tua app è client-side, spesso ci sono singole pagine che potrebbero trarre beneficio da funzionalità di server rendering come [static-site generation (SSG)](https://developer.mozilla.org/en-US/docs/Glossary/SSG) o [server-side rendering (SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR), ad esempio una pagina Terms of Service o documentazione.

Il server rendering in genere invia meno JavaScript al client e un documento HTML completo che produce un [First Contentful Paint (FCP)](https://web.dev/articles/fcp) più veloce riducendo il [Total Blocking Time (TBD)](https://web.dev/articles/tbt), il che può anche abbassare l'[Interaction to Next Paint (INP)](https://web.dev/articles/inp). Ecco perché il [team Chrome ha incoraggiato](https://web.dev/articles/rendering-on-the-web) gli sviluppatori a considerare static o server-side render rispetto a un approccio completamente client-side per ottenere le migliori performance possibili.

Ci sono tradeoff nell'usare un server, e non è sempre l'opzione migliore per ogni pagina. Generare pagine sul server comporta costi aggiuntivi e richiede tempo per generare, il che può aumentare il [Time to First Byte (TTFB)](https://web.dev/articles/ttfb). Le app con le migliori performance sono in grado di scegliere la strategia di rendering giusta pagina per pagina, in base ai tradeoff di ciascuna strategia.

I framework offrono l'opzione di usare un server su qualsiasi pagina se lo desideri, ma non ti obbligano a usare un server. Questo ti consente di scegliere la strategia di rendering giusta per ogni pagina nella tua app.

#### What About Server Components {/*server-components*/}

I framework che raccomandiamo includono anche supporto per React Server Components.

I Server Component aiutano a risolvere questi problemi spostando routing e data fetching sul server, e consentendo al code splitting di essere fatto per i componenti client in base ai dati che renderizzi, invece che solo alla route renderizzata, e riducendo la quantità di JavaScript spedita per la migliore [loading sequence](https://www.patterns.dev/vanilla/loading-sequence) possibile.

I Server Component non richiedono un server. Possono essere eseguiti al build time sul tuo server CI per creare un'app static-site generated (SSG), a runtime su un web server per un'app server-side rendered (SSR).

Consulta [Introducing zero-bundle size React Server Components](/blog/2020/12/21/data-fetching-with-react-server-components) e [la documentazione](/reference/rsc/server-components) per maggiori informazioni.

</DeepDive>

<Note>

#### Server Rendering is not just for SEO {/*server-rendering-is-not-just-for-seo*/}

Un malinteso comune è che il server rendering serva solo per la [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO).

Sebbene il server rendering possa migliorare la SEO, migliora anche le performance riducendo la quantità di JavaScript che l'utente deve scaricare e parsare prima di poter vedere il contenuto sullo schermo.

Ecco perché il team Chrome [ha incoraggiato](https://web.dev/articles/rendering-on-the-web) gli sviluppatori a considerare static o server-side render rispetto a un approccio completamente client-side per ottenere le migliori performance possibili.

</Note>

---

_Grazie a [Dan Abramov](https://bsky.app/profile/danabra.mov) per aver creato Create React App, e a [Joe Haddad](https://github.com/Timer), [Ian Schmitz](https://github.com/ianschmitz), [Brody McKee](https://github.com/mrmckeb) e [molti altri](https://github.com/facebook/create-react-app/graphs/contributors) per aver mantenuto Create React App nel corso degli anni. Grazie a [Brooks Lybrand](https://bsky.app/profile/brookslybrand.bsky.social), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Devon Govett](https://bsky.app/profile/devongovett.bsky.social), [Eli White](https://x.com/Eli_White), [Jack Herrington](https://bsky.app/profile/jherr.dev), [Joe Savona](https://x.com/en_JS), [Lauren Tan](https://bsky.app/profile/no.lol), [Lee Robinson](https://x.com/leeerob), [Mark Erikson](https://bsky.app/profile/acemarke.dev), [Ryan Florence](https://x.com/ryanflorence), [Sophie Alpert](https://bsky.app/profile/sophiebits.com), [Tanner Linsley](https://bsky.app/profile/tannerlinsley.com) e [Theo Browne](https://x.com/theo) per la revisione e il feedback su questo post._
