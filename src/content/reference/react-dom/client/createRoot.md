---
title: createRoot
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/client/createRoot.md).

</Note>

<Intro>

`createRoot` ti permette di creare una root per visualizzare componenti React all'interno di un nodo DOM del browser.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Chiama `createRoot` per creare una root React che visualizza contenuto all'interno di un elemento DOM del browser.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React creerà una root per il `domNode` e prenderà in carico la gestione del DOM al suo interno. Dopo aver creato una root, devi chiamare [`root.render`](#root-render) per visualizzare un componente React al suo interno:

```js
root.render(<App />);
```

Un'app interamente costruita con React avrà di solito una sola chiamata a `createRoot` per il componente root. Una pagina che integra React solo in alcune parti può avere tutte le root separate necessarie.

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `domNode`: Un [elemento DOM.](https://developer.mozilla.org/it/docs/Web/API/Element) React creerà una root per questo elemento DOM e ti permetterà di chiamare funzioni sulla root, come `render` per visualizzare contenuto React renderizzato.

* **optional** `options`: Un oggetto con opzioni per questa root React.

  * **optional** `onCaughtError`: Callback chiamata quando React cattura un errore in un contenitore di errori. Viene chiamata con l'`error` catturato dal contenitore di errori e un oggetto `errorInfo` che contiene il `componentStack`.
  * **optional** `onUncaughtError`: Callback chiamata quando viene lanciato un errore e non viene catturato da un contenitore di errori. Viene chiamata con l'`error` lanciato e un oggetto `errorInfo` che contiene il `componentStack`.
  * **optional** `onRecoverableError`: Callback chiamata quando React recupera automaticamente dagli errori. Viene chiamata con un `error` lanciato da React e un oggetto `errorInfo` che contiene il `componentStack`. Alcuni errori recuperabili possono includere la causa originale dell'errore come `error.cause`.
  * **optional** `identifierPrefix`: Un prefisso stringa che React usa per gli ID generati da [`useId`.](/reference/react/useId) Utile per evitare conflitti quando usi più root sulla stessa pagina.

#### Returns {/*returns*/}

`createRoot` restituisce un oggetto con due metodi: [`render`](#root-render) e [`unmount`.](#root-unmount)

#### Caveats {/*caveats*/}
* Se la tua app è renderizzata lato server, l'uso di `createRoot()` non è supportato. Usa [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) al suo posto.
* Probabilmente avrai una sola chiamata a `createRoot` nella tua app. Se usi un framework, potrebbe eseguire questa chiamata per te.
* Quando vuoi renderizzare un pezzo di JSX in una parte diversa dell'albero DOM che non è un figlio del tuo componente (ad esempio, una modale o un tooltip), usa [`createPortal`](/reference/react-dom/createPortal) invece di `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Chiama `root.render` per visualizzare un pezzo di [JSX](/learn/writing-markup-with-jsx) ("nodo React") nel nodo DOM del browser della root React.

```js
root.render(<App />);
```

React visualizzerà `<App />` nella `root` e prenderà in carico la gestione del DOM al suo interno.

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*root-render-parameters*/}

* `reactNode`: Un *nodo React* che vuoi visualizzare. Di solito sarà un pezzo di JSX come `<App />`, ma puoi anche passare un elemento React costruito con [`createElement()`](/reference/react/createElement), una stringa, un numero, `null` o `undefined`.


#### Returns {/*root-render-returns*/}

`root.render` restituisce `undefined`.

#### Caveats {/*root-render-caveats*/}

* La prima volta che chiami `root.render`, React cancellerà tutto il contenuto HTML esistente all'interno della root React prima di renderizzare il componente React al suo interno.

* Se il nodo DOM della tua root contiene HTML generato da React sul server o durante la build, usa [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) al suo posto, che collega i gestori di eventi all'HTML esistente.

* Se chiami `render` sulla stessa root più di una volta, React aggiornerà il DOM secondo necessità per riflettere l'ultimo JSX che hai passato. React deciderà quali parti del DOM possono essere riutilizzate e quali devono essere ricreate ["confrontandole"](/learn/preserving-and-resetting-state) con l'albero renderizzato in precedenza. Chiamare `render` sulla stessa root di nuovo è simile a chiamare la [funzione `set`](/reference/react/useState#setstate) sul componente root: React evita aggiornamenti DOM non necessari.

* Sebbene la renderizzazione sia sincrona una volta avviata, `root.render(...)` non lo è. Ciò significa che il codice dopo `root.render()` può essere eseguito prima che vengano attivati gli Effetti (`useLayoutEffect`, `useEffect`) di quella specifica renderizzazione. Di solito va bene e raramente richiede aggiustamenti. Nei rari casi in cui il timing degli Effetti è importante, puoi avvolgere `root.render(...)` in [`flushSync`](https://react.dev/reference/react-dom/flushSync) per assicurarti che la renderizzazione iniziale avvenga completamente in modo sincrono.

  ```js
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
  // 🚩 L'HTML non includerà ancora <App /> renderizzato:
  console.log(document.body.innerHTML);
  ```

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

* Una volta chiamato `root.unmount` non puoi chiamare di nuovo `root.render` sulla stessa root. Tentare di chiamare `root.render` su una root smontata lancerà un errore "Cannot update an unmounted root". Tuttavia, puoi creare una nuova root per lo stesso nodo DOM dopo che la root precedente per quel nodo è stata smontata.

---

## Usage {/*usage*/}

### Renderizzare un'app interamente costruita con React {/*rendering-an-app-fully-built-with-react*/}

Se la tua app è interamente costruita con React, crea una singola root per l'intera app.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Di solito, devi eseguire questo codice solo una volta all'avvio. Farà quanto segue:

1. Troverà il <CodeStep step={1}>nodo DOM del browser</CodeStep> definito nel tuo HTML.
2. Visualizzerà il <CodeStep step={2}>componente React</CodeStep> della tua app al suo interno.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Questo è il nodo DOM -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
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
      Mi hai cliccato {count} volte
    </button>
  );
}
```

</Sandpack>

**Se la tua app è interamente costruita con React, non dovresti aver bisogno di creare altre root o di chiamare di nuovo [`root.render`](#root-render).**

Da questo punto in poi, React gestirà il DOM dell'intera app. Per aggiungere altri componenti, [annidali all'interno del componente `App`.](/learn/importing-and-exporting-components) Quando devi aggiornare l'UI, ciascuno dei tuoi componenti può farlo [usando lo state.](/reference/react/useState) Quando devi visualizzare contenuto extra come una modale o un tooltip fuori dal nodo DOM, [renderizzalo con un portal.](/reference/react-dom/createPortal)

<Note>

Quando il tuo HTML è vuoto, l'utente vede una pagina bianca finché il codice JavaScript dell'app non viene caricato ed eseguito:

```html
<div id="root"></div>
```

Questo può sembrare molto lento! Per risolvere, puoi generare l'HTML iniziale dai tuoi componenti [sul server o durante la build.](/reference/react-dom/server) Così i visitatori possono leggere testo, vedere immagini e cliccare link prima che venga caricato qualsiasi codice JavaScript. Consigliamo di [usare un framework](/learn/creating-a-react-app#full-stack-frameworks) che esegue questa ottimizzazione out of the box. A seconda di quando viene eseguita, si parla di *server-side rendering (SSR)* o *static site generation (SSG)*.

</Note>

<Pitfall>

**Le app che usano la renderizzazione lato server o la generazione statica devono chiamare [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) invece di `createRoot`.** React *idraterà* (riutilizzerà) i nodi DOM dal tuo HTML invece di distruggerli e ricrearli.

</Pitfall>

---

### Renderizzare una pagina parzialmente costruita con React {/*rendering-a-page-partially-built-with-react*/}

Se la tua pagina [non è interamente costruita con React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), puoi chiamare `createRoot` più volte per creare una root per ogni pezzo di UI di primo livello gestito da React. Puoi visualizzare contenuto diverso in ciascuna root chiamando [`root.render`.](#root-render)

Qui, due componenti React diversi vengono renderizzati in due nodi DOM definiti nel file `index.html`:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>Questo paragrafo non è renderizzato da React (apri index.html per verificare).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode);
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode);
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

Potresti anche creare un nuovo nodo DOM con [`document.createElement()`](https://developer.mozilla.org/it/docs/Web/API/Document/createElement) e aggiungerlo manualmente al documento.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // Puoi aggiungerlo ovunque nel documento
```

Per rimuovere l'albero React dal nodo DOM e pulire tutte le risorse usate da esso, chiama [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Questo è soprattutto utile se i tuoi componenti React sono all'interno di un'app scritta in un framework diverso.

---

### Aggiornare un componente root {/*updating-a-root-component*/}

Puoi chiamare `render` più di una volta sulla stessa root. Finché la struttura dell'albero dei componenti corrisponde a quanto renderizzato in precedenza, React [preserverà lo state.](/learn/preserving-and-resetting-state) Nota come puoi digitare nell'input, il che significa che gli aggiornamenti dalle ripetute chiamate a `render` ogni secondo in questo esempio non sono distruttivi:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

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
      <input placeholder="Digita qualcosa qui" />
    </>
  );
}
```

</Sandpack>

È poco comune chiamare `render` più volte. Di solito, i tuoi componenti [aggiorneranno lo state](/reference/react/useState) al suo posto.

### Registrazione degli errori in produzione {/*error-logging-in-production*/}

Per impostazione predefinita, React registrerà tutti gli errori nella console. Per implementare la tua segnalazione errori, puoi fornire le opzioni root opzionali per i gestori di errori `onUncaughtError`, `onCaughtError` e `onRecoverableError`:

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack", 15]]
import { createRoot } from "react-dom/client";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  // Tieni presente di rimuovere queste opzioni in development per sfruttare
  // i gestori predefiniti di React o implementare il tuo overlay per development.
  // I gestori sono specificati incondizionatamente qui solo a scopo dimostrativo.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
root.render(<App />);
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

</Sandpack>

## Troubleshooting {/*troubleshooting*/}

### Ho creato una root, ma non viene visualizzato nulla {/*ive-created-a-root-but-nothing-is-displayed*/}

Assicurati di non aver dimenticato di *renderizzare* effettivamente la tua app nella root:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Finché non lo fai, non viene visualizzato nulla.

---

### Ricevo un errore: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Un errore comune è passare le opzioni per `createRoot` a `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

Per risolvere, passa le opzioni root a `createRoot(...)`, non a `root.render(...)`:
```js {2,5}
// 🚩 Sbagliato: root.render accetta un solo argomento.
root.render(App, {onUncaughtError});

// ✅ Corretto: passa le opzioni a createRoot.
const root = createRoot(container, {onUncaughtError});
root.render(<App />);
```

---

### Ricevo un errore: "Target container is not a DOM element" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Questo errore significa che ciò che passi a `createRoot` non è un nodo DOM.

Se non sei sicuro di cosa stia succedendo, prova a registrarlo:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Ad esempio, se `domNode` è `null`, significa che [`getElementById`](https://developer.mozilla.org/it/docs/Web/API/Document/getElementById) ha restituito `null`. Succederà se non c'è nessun nodo nel documento con l'ID dato al momento della chiamata. Potrebbero esserci alcune ragioni:

1. L'ID che stai cercando potrebbe differire dall'ID usato nel file HTML. Controlla gli errori di battitura!
2. Il tag `<script>` del tuo bundle non può "vedere" nessun nodo DOM che appare *dopo* di esso nell'HTML.

Un altro modo comune per ottenere questo errore è scrivere `createRoot(<App />)` invece di `createRoot(domNode)`.

---

### Ricevo un errore: "Functions are not valid as a React child." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Questo errore significa che ciò che passi a `root.render` non è un componente React.

Può succedere se chiami `root.render` con `Component` invece di `<Component />`:

```js {2,5}
// 🚩 Sbagliato: App è una funzione, non un Component.
root.render(App);

// ✅ Corretto: <App /> è un componente.
root.render(<App />);
```

Oppure se passi una funzione a `root.render`, invece del risultato della sua chiamata:

```js {2,5}
// 🚩 Sbagliato: createApp è una funzione, non un componente.
root.render(createApp);

// ✅ Corretto: chiama createApp per restituire un componente.
root.render(createApp());
```

---

### Il mio HTML renderizzato lato server viene ricreato da zero {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Se la tua app è renderizzata lato server e include l'HTML iniziale generato da React, potresti notare che creare una root e chiamare `root.render` cancella tutto quell'HTML e ricrea tutti i nodi DOM da zero. Questo può essere più lento, resetta focus e posizioni di scroll e può perdere altri input dell'utente.

Le app renderizzate lato server devono usare [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) invece di `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Nota che la sua API è diversa. In particolare, di solito non ci sarà un'ulteriore chiamata a `root.render`.
