---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## Impacchettamento {#bundling}

Molte applicazioni React hanno i loro file "impacchettati" usando strumenti come [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) oppure [Browserify](http://browserify.org/). Il processo di "impacchettamento" avviene prendendo tutti i file importati e unendoli tutti in un unico file, chiamato "bundle". Questo file può essere poi incluso all'interno della pagina web per caricare l'intera applicazione tutta in una volta.

#### Esempio {#example}

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Nota:
>
> I tuoi pacchetti avranno un aspetto molto diverso da questo.

Se state usando [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), o qualche tool simile, potreste avere una configurazione di Webpack che effettua il processo d'impacchettamento della tua applicazione.

In caso contrario è necessario impostare l'impacchettamento dell'applicazione manualmente. Ad esempio puoi seguire queste guide sulla documentazione di Webpack, [Installation](https://webpack.js.org/guides/installation/) e [Getting Started](https://webpack.js.org/guides/getting-started/).

## Code Splitting {#code-splitting}

Il processo d'impacchettamento va bene, ma se l'applicazione cresce allora, di conseguenza, pure il bundle cresce, e questo specialmente se si includono librerie di terze parti. E' necessario prestare attenzione al codice che si include all'interno del proprio bundle, in modo tale da non renderlo troppo pesante per non causare rallentamenti nella sua esecuzione.

Per evitare di avere un bundle enorme, è buona pratica iniziare a suddividere il proprio bundle. Il Code-Splitting (letteralmente "spezzamento del codice") è una funzionalità supportata da [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) e Browserify (attraverso [factor-bundle](https://github.com/browserify/factor-bundle))
i quali creano molteplici bundle che possono essere caricati dinamicamente a tempo di esecuzione.

Spezzare il codice della propria applicazione può aiutare ad effettuare il "lazy-load (caricamento pigro)" di funzionalità che sono necessarie in quel preciso istante, e questo processo può incrementare di parecchio le performance della propria applicazione. Anche se non è stato ridotto la quantità complessiva di codice dell'applicazione, abbiamo evitato di caricare codice di cui l'utente potrebbe non avere mai bisogno ed è stata ridotta la quantità di codice necessaria durante il caricamento iniziale.

## `import()` {#import}

Il miglior modo per introdurre il code splitting all'interno dell'applicazione è attraverso la sintassi `import()`.

**Prima:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**Dopo:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

Quando Webpack incontra questa sintassi, inizia automaticamente il code splitting dell'applicazione. Se state utilizzando Create React App, questo è già automaticamente configurato per te e tu puoi [iniziare ad utilizzarlo](https://create-react-app.dev/docs/code-splitting/) immediatamente. E' anche supportato da [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

Se state configurando Webpack autonomamente, probabilmente dovrai leggere la guida sul ["code splitting" di Webpack](https://webpack.js.org/guides/code-splitting/). Il tuo webpack dovrebbe [assomigliare a questo](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Quando usate [Babel](https://babeljs.io/) dovete assicurarvi che esso possa effettuare il parsing degli import dinamici. Per fare questo avete bisogno di [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

<<<<<<< HEAD
> Nota:
>
> `React.lazy` and Suspense are not yet available for server-side rendering. If you want to do code-splitting in a server rendered app, we recommend [Loadable Components](https://github.com/gregberge/loadable-components). It has a nice [guide for bundle splitting with server-side rendering](https://loadable-components.com/docs/server-side-rendering/).

La funzione `React.lazy` ti permette di effettuare un import dinamico come se fosse un normale componente.
=======
The `React.lazy` function lets you render a dynamic import as a regular component.
>>>>>>> ee7705675d2304c53c174b9fb316e2fbde1e9fb3

**Prima:**

```js
import OtherComponent from './OtherComponent';
```

**Dopo:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

L'istruzione sopra carica il pezzo di codice contenente il componente `OtherComponent` quando viene renderizzato per la prima volta.

La funzione `React.lazy` prende in ingresso una funzione che, dinamicamente, chiama il metodo `import()`. Quello che viene restituito è una `Promise` che si risolve in un modulo contente  l'export di default del componente React.

Il componente "pigro" viene poi renderizzato all'interno di un componente `Suspense` il quale ci permette di mostrare dei contenuti di fallback (come ad esempio degli indicatori di caricamente) mentre stiamo aspettando che il componente sia completamente caricato.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

La prop `fallback` accetta un qualsiasi elemento React che si vuole renderizzare nel mentre stiamo aspettando che il componente sia caricato. E' possibile mettere il componente `Suspense` ovunque sopra il componente da caricare in modo lazy. E' anche possibile circondare il componente da caricare in modo lazy col componente `Suspense`.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

<<<<<<< HEAD
### Contenitori di Errori {#error-boundaries}
=======
### Avoiding fallbacks {#avoiding-fallbacks}
Any component may suspend as a result of rendering, even components that were already shown to the user. In order for screen content to always be consistent, if an already shown component suspends, React has to hide its tree up to the closest `<Suspense>` boundary. However, from the user's perspective, this can be disorienting.

Consider this tab switcher:

```js
import React, { Suspense } from 'react';
import Tabs from './Tabs';
import Glimmer from './Glimmer';

const Comments = React.lazy(() => import('./Comments'));
const Photos = React.lazy(() => import('./Photos'));

function MyComponent() {
  const [tab, setTab] = React.useState('photos');
  
  function handleTabSelect(tab) {
    setTab(tab);
  };

  return (
    <div>
      <Tabs onTabSelect={handleTabSelect} />
      <Suspense fallback={<Glimmer />}>
        {tab === 'photos' ? <Photos /> : <Comments />}
      </Suspense>
    </div>
  );
}

```

In this example, if tab gets changed from `'photos'` to `'comments'`, but `Comments` suspends, the user will see a glimmer. This makes sense because the user no longer wants to see `Photos`, the `Comments` component is not ready to render anything, and React needs to keep the user experience consistent, so it has no choice but to show the `Glimmer` above.

However, sometimes this user experience is not desirable. In particular, it is sometimes better to show the "old" UI while the new UI is being prepared. You can use the new [`startTransition`](/docs/react-api.html#starttransition) API to make React do this:

```js
function handleTabSelect(tab) {
  startTransition(() => {
    setTab(tab);
  });
}
```

Here, you tell React that setting tab to `'comments'` is not an urgent update, but is a [transition](/docs/react-api.html#transitions) that may take some time. React will then keep the old UI in place and interactive, and will switch to showing `<Comments />` when it is ready. See [Transitions](/docs/react-api.html#transitions) for more info.

### Error boundaries {#error-boundaries}
>>>>>>> ee7705675d2304c53c174b9fb316e2fbde1e9fb3

Se altri moduli falliscono nel caricamente (ad esempio a causa di problemi di rete), verrà sollevato un errore. Puoi gestire questi errori per mostrare un [Contenitore di Errori](/docs/error-boundaries.html). Una volta che è stato creato il proprio contenitore di errori, è possibile utilizzarlo ovunque sopra i componenti lazy per mostrare uno stato di errore quando ci sono errori di rete.

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Code splitting basato su rotte {#route-based-code-splitting}

Decidere dove, nella propria app, introdurre il code splitting può essere complicato. Assicurati di scegliere posti che divideranno i pacchetti in modo uniforme, senza diminuire l'esperienza dell'utente.

Un buon posto per iniziare sono le rotte. La maggior parte delle persone sul Web è abituata a caricare le transizioni di pagina che richiedono un po 'di tempo. Tendi anche a rieseguire il rendering dell'intera pagina contemporaneamente, quindi è improbabile che i tuoi utenti interagiscano contemporaneamente con altri elementi della pagina.

Qui di seguito possiamo vedere un esempio code splitting, basato sulle rotte, utilizzando libreria come [React Router](https://reactrouter.com/) con `React.lazy`.

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

## Named Exports {#named-exports}

Ad oggi `React.lazy` supporta solamente gli export di default. Se il modulo che vogliamo importare utilizza export nominali, possiamo creare un modulo intermedio che lo re-esporta come default. In questo modo ci assicuriamo  che il tree shaking continui a funzionare e che non vengano caricati componenti non utilizzati.
```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
