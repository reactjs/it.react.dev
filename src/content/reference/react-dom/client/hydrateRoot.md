---
title: hydrateRoot
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/client/hydrateRoot.md).

</Note>

<Intro>

`hydrateRoot` ti permette di visualizzare componenti React all'interno di un nodo DOM del browser il cui contenuto HTML è stato generato in precedenza da [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

Chiama `hydrateRoot` per "collegare" React all'HTML esistente che era già stato renderizzato da React in un ambiente server.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React si collegherà all'HTML che esiste all'interno del `domNode` e prenderà in carico la gestione del DOM al suo interno. Un'app interamente costruita con React avrà di solito una sola chiamata a `hydrateRoot` con il suo componente root.

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `domNode`: Un [elemento DOM](https://developer.mozilla.org/it/docs/Web/API/Element) che era stato renderizzato come elemento root sul server.

* `reactNode`: Il *nodo React* usato per renderizzare l'HTML esistente. Di solito sarà un pezzo di JSX come `<App />` che era stato renderizzato con un metodo `ReactDOM Server` come `renderToPipeableStream(<App />)`.

* **optional** `options`: Un oggetto con opzioni per questa root React.

  * **optional** `onCaughtError`: Callback chiamata quando React cattura un errore in un contenitore di errori. Viene chiamata con l'`error` catturato dal contenitore di errori e un oggetto `errorInfo` che contiene il `componentStack`.
  * **optional** `onUncaughtError`: Callback chiamata quando viene lanciato un errore e non viene catturato da un contenitore di errori. Viene chiamata con l'`error` lanciato e un oggetto `errorInfo` che contiene il `componentStack`.
  * **optional** `onRecoverableError`: Callback chiamata quando React recupera automaticamente dagli errori. Viene chiamata con un `error` lanciato da React e un oggetto `errorInfo` che contiene il `componentStack`. Alcuni errori recuperabili possono includere la causa originale dell'errore come `error.cause`.
  * **optional** `identifierPrefix`: Un prefisso stringa che React usa per gli ID generati da [`useId`.](/reference/react/useId) Utile per evitare conflitti quando usi più root sulla stessa pagina. Deve essere lo stesso prefisso usato sul server.
  * **optional** `formState`: Lo state del form da un invio di form gestito da una [Server Function](/reference/rsc/server-functions). Se la pagina è stata renderizzata sul server in risposta all'invio di un form che usa [`useActionState`](/reference/react/useActionState) con un `permalink`, passa lo state del form risultante così che `useActionState` restituisca lo state inviato invece dell'`initialState`. Deve essere lo stesso valore del `formState` passato al [renderer server.](/reference/react-dom/server/renderToPipeableStream#parameters) Di solito viene passato dal tuo framework.


#### Returns {/*returns*/}

`hydrateRoot` restituisce un oggetto con due metodi: [`render`](#root-render) e [`unmount`.](#root-unmount)

#### Caveats {/*caveats*/}

* `hydrateRoot()` si aspetta che il contenuto renderizzato sia identico al contenuto renderizzato lato server. Dovresti trattare le discrepanze come bug e correggerle.
* In modalità development, React avvisa sulle discrepanze durante l'idratazione. Non ci sono garanzie che le differenze negli attributi verranno corrette in caso di discrepanze. Questo è importante per motivi di performance perché nella maggior parte delle app le discrepanze sono rare, e quindi validare tutto il markup sarebbe proibitivamente costoso.
* Probabilmente avrai una sola chiamata a `hydrateRoot` nella tua app. Se usi un framework, potrebbe eseguire questa chiamata per te.
* Se la tua app è renderizzata lato client senza HTML già renderizzato, l'uso di `hydrateRoot()` non è supportato. Usa [`createRoot()`](/reference/react-dom/client/createRoot) al suo posto.

---

### `root.render(reactNode)` {/*root-render*/}

Chiama `root.render` per aggiornare un componente React all'interno di una root React idratata per un elemento DOM del browser.

```js
root.render(<App />);
```

React aggiornerà `<App />` nella `root` idratata.

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*root-render-parameters*/}

* `reactNode`: Un *nodo React* che vuoi aggiornare. Di solito sarà un pezzo di JSX come `<App />`, ma puoi anche passare un elemento React costruito con [`createElement()`](/reference/react/createElement), una stringa, un numero, `null` o `undefined`.


#### Returns {/*root-render-returns*/}

`root.render` restituisce `undefined`.

#### Caveats {/*root-render-caveats*/}

* Se chiami `root.render` prima che la root abbia finito di idratare, React cancellerà il contenuto HTML esistente renderizzato lato server e passerà l'intera root alla renderizzazione lato client.

---

### `root.unmount()` {/*root-unmount*/}

Chiama `root.unmount` per distruggere un albero renderizzato all'interno di una root React.

```js
root.unmount();
```

Un'app interamente costruita con React di solito non avrà chiamate a `root.unmount`.

È soprattutto utile se il nodo DOM della tua root React (o uno dei suoi antenati) può essere rimosso dal DOM da altro codice. Ad esempio, immagina un pannello a schede jQuery che rimuove le schede inattive dal DOM. Se una scheda viene rimossa, tutto al suo interno (incluse le root React al suo interno) verrebbe rimosso dal DOM. In quel caso, devi dire a React di "smettere" di gestire il contenuto della root rimossa chiamando `root.unmount`. Altrimenti, i componenti all'interno della root rimossa non saprebbero di dover fare pulizia e liberare risorse globali come le sottoscrizioni.

Chiamare `root.unmount` smonterà tutti i componenti nella root e "scollegherà" React dal nodo DOM root, inclusa la rimozione di qualsiasi gestore di eventi o state nell'albero.


#### Parameters {/*root-unmount-parameters*/}

`root.unmount` non accetta parametri.


#### Returns {/*root-unmount-returns*/}

`root.unmount` restituisce `undefined`.

#### Caveats {/*root-unmount-caveats*/}

* Chiamare `root.unmount` smonterà tutti i componenti nell'albero e "scollegherà" React dal nodo DOM root.

* Una volta chiamato `root.unmount` non puoi chiamare di nuovo `root.render` sulla stessa root. Tentare di chiamare `root.render` su una root smontata lancerà un errore "Cannot update an unmounted root".

---

## Usage {/*usage*/}

### Idratare HTML renderizzato lato server {/*hydrating-server-rendered-html*/}

Se l'HTML della tua app è stato generato da [`react-dom/server`](/reference/react-dom/client/createRoot), devi *idratarlo* sul client.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

Questo idraterà l'HTML del server all'interno del <CodeStep step={1}>nodo DOM del browser</CodeStep> con il <CodeStep step={2}>componente React</CodeStep> della tua app. Di solito, lo fai una sola volta all'avvio. Se usi un framework, potrebbe farlo dietro le quinte per te.

Per idratare la tua app, React "collegherà" la logica dei tuoi componenti all'HTML iniziale generato dal server. L'idratazione trasforma l'istantanea HTML iniziale dal server in un'app completamente interattiva che gira nel browser.

<Sandpack>

```html public/index.html
<!--
  Il contenuto HTML all'interno di <div id="root">...</div>
  è stato generato da App con react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

Non dovresti aver bisogno di chiamare di nuovo `hydrateRoot` o di chiamarlo in più punti. Da questo momento in poi, React gestirà il DOM della tua applicazione. Per aggiornare l'UI, i tuoi componenti [useranno lo state](/reference/react/useState) al suo posto.

<Pitfall>

L'albero React che passi a `hydrateRoot` deve produrre **lo stesso output** che aveva prodotto sul server.

Questo è importante per l'esperienza utente. L'utente passerà del tempo a guardare l'HTML generato dal server prima che il tuo codice JavaScript venga caricato. La renderizzazione lato server crea l'illusione che l'app si carichi più velocemente mostrando l'istantanea HTML del suo output. Mostrare all'improvviso contenuto diverso rompe quell'illusione. Per questo l'output della renderizzazione lato server deve corrispondere all'output della renderizzazione iniziale sul client.

Le cause più comuni che portano a errori di idratazione includono:

* Spazi bianchi extra (come le newline) attorno all'HTML generato da React all'interno del nodo root.
* Usare controlli come `typeof window !== 'undefined'` nella logica di renderizzazione.
* Usare API disponibili solo nel browser come [`window.matchMedia`](https://developer.mozilla.org/it/docs/Web/API/Window/matchMedia) nella logica di renderizzazione.
* Renderizzare dati diversi sul server e sul client.

React recupera da alcuni errori di idratazione, ma **devi correggerli come qualsiasi altro bug.** Nel caso migliore, causeranno un rallentamento; nel caso peggiore, i gestori di eventi possono essere collegati agli elementi sbagliati.

</Pitfall>

---

### Idratare un intero documento {/*hydrating-an-entire-document*/}

Le app interamente costruite con React possono renderizzare l'intero documento come JSX, incluso il tag [`<html>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/html):

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

Per idratare l'intero documento, passa la variabile globale [`document`](https://developer.mozilla.org/it/docs/Web/API/Window/document) come primo argomento a `hydrateRoot`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### Sopprimere errori inevitabili di discrepanza nell'idratazione {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Se l'attributo o il contenuto testuale di un singolo elemento è inevitabilmente diverso tra server e client (ad esempio, un timestamp), puoi silenziare l'avviso di discrepanza nell'idratazione.

Per silenziare gli avvisi di idratazione su un elemento, aggiungi `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  Il contenuto HTML all'interno di <div id="root">...</div>
  è stato generato da App con react-dom/server.
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Funziona solo a un livello di profondità ed è pensato come via di fuga. Non abusarne. React **non** tenterà di correggere il contenuto testuale non corrispondente.

---

{/* TODO: Remove this subsection when browser is available in Stable. */}

### Gestire contenuto diverso tra client e server {/*handling-different-client-and-server-content*/}

Se hai intenzionalmente bisogno di renderizzare qualcosa di diverso sul server e sul client, puoi fare una renderizzazione in due passaggi. I componenti che renderizzano qualcosa di diverso sul client possono leggere una [variabile di state](/reference/react/useState) come `isClient`, che puoi impostare su `true` in un [Effetto](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  Il contenuto HTML all'interno di <div id="root">...</div>
  è stato generato da App con react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

{/* kind of an edge case, seems fine to use this hack here */}
```js {expectedErrors: {'react-compiler': [7]}} src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

In questo modo il passaggio di renderizzazione iniziale renderizzerà lo stesso contenuto del server, evitando le discrepanze, ma un passaggio aggiuntivo avverrà in modo sincrono subito dopo l'idratazione.

Usa questo approccio quando vuoi che il contenuto renderizzato sul client sia diverso dall'HTML iniziale renderizzato lato server.

Se un componente deve renderizzare solo nel browser, chiama [`use(browser())`](/reference/react/use#use-browser) invece di aspettare un Effetto.

<Pitfall>

Questo approccio rende l'idratazione più lenta perché i tuoi componenti devono renderizzare due volte. Tieni presente l'esperienza utente su connessioni lente. Il codice JavaScript può caricarsi molto più tardi rispetto alla renderizzazione HTML iniziale, quindi renderizzare un'UI diversa subito dopo l'idratazione può anche risultare brusco per l'utente.

</Pitfall>

---

### Aggiornare un componente root idratato {/*updating-a-hydrated-root-component*/}

Dopo che la root ha finito di idratare, puoi chiamare [`root.render`](#root-render) per aggiornare il componente React root. **A differenza di [`createRoot`](/reference/react-dom/client/createRoot), di solito non devi farlo perché il contenuto iniziale era già stato renderizzato come HTML.**

Se chiami `root.render` in un momento successivo all'idratazione, e la struttura dell'albero dei componenti corrisponde a quanto renderizzato in precedenza, React [preserverà lo state.](/learn/preserving-and-resetting-state) Nota come puoi digitare nell'input, il che significa che gli aggiornamenti dalle ripetute chiamate a `render` ogni secondo in questo esempio non sono distruttivi:

<Sandpack>

```html public/index.html
<!--
  Tutto il contenuto HTML all'interno di <div id="root">...</div> è stato
  generato renderizzando <App /> con react-dom/server.
-->
<div id="root"><h1>Hello, world! <!-- -->0</h1><input placeholder="Type something here"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

È poco comune chiamare [`root.render`](#root-render) su una root idratata. Di solito, [aggiornerai lo state](/reference/react/useState) all'interno di uno dei componenti al suo posto.

### Registrazione degli errori in produzione {/*error-logging-in-production*/}

Per impostazione predefinita, React registrerà tutti gli errori nella console. Per implementare la tua segnalazione errori, puoi fornire le opzioni root opzionali per i gestori di errori `onUncaughtError`, `onCaughtError` e `onRecoverableError`:

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack", 15]]
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

L'opzione <CodeStep step={1}>onCaughtError</CodeStep> è una funzione chiamata con due argomenti:

1. L'<CodeStep step={2}>error</CodeStep> che è stato lanciato.
2. Un oggetto <CodeStep step={3}>errorInfo</CodeStep> che contiene il <CodeStep step={4}>componentStack</CodeStep> dell'errore.

Insieme a `onUncaughtError` e `onRecoverableError`, puoi implementare il tuo sistema di segnalazione errori:

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // L'implementazione specifica dipende da te.
  // `console.error()` è usato solo a scopo dimostrativo.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
hydrateRoot(container, <App />, {
  // Tieni presente di rimuovere queste opzioni in development per sfruttare
  // i gestori predefiniti di React o implementare il tuo overlay per development.
  // I gestori sono specificati incondizionatamente qui solo a scopo dimostrativo.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
```

```js src/App.js
import { Component, useState } from "react";

function Boom() {
  foo.bar = "baz";
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Qualcosa è andato storto.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [triggerUncaughtError, settriggerUncaughtError] = useState(false);
  const [triggerCaughtError, setTriggerCaughtError] = useState(false);

  return (
    <>
      <button onClick={() => settriggerUncaughtError(true)}>
        Attiva errore non catturato
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        Attiva errore catturato
      </button>
      {triggerCaughtError && (
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )}
    </>
  );
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Si usa intenzionalmente contenuto HTML che differisce dal contenuto renderizzato lato server per attivare errori recuperabili.
-->
<div id="root">Server content before hydration.</div>
</body>
</html>
```
</Sandpack>

## Troubleshooting {/*troubleshooting*/}


### Ricevo un errore: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Un errore comune è passare le opzioni per `hydrateRoot` a `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

Per risolvere, passa le opzioni root a `hydrateRoot(...)`, non a `root.render(...)`:
```js {2,5}
// 🚩 Sbagliato: root.render accetta un solo argomento.
root.render(App, {onUncaughtError});

// ✅ Corretto: passa le opzioni a hydrateRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
