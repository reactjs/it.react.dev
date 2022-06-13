---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
Se carichi React da un tag `<script>`, queste API di alto livello sono disponibili nell'oggetto globale `ReactDOM`. Se usi ES6 con npm, puoi scrivere `import ReactDOM from 'react-dom'`. Se usi ES5 con npm, puoi scrivere `var ReactDOM = require('react-dom')`.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

## Panoramica {#overview}

<<<<<<< HEAD
Il *package* `react-dom` fornisce dei metodi specifici per il DOM che possono essere usati al livello più in alto nella tua app e come scorciatoie per uscire fuori dal modello di React qualora ne avessi bisogno. La maggior parte dei tuoi componenti non dovrebbero aver bisogno di usare questo modulo.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### Supporto ai browser {#browser-support}

<<<<<<< HEAD
React supporta tutti i browser più popolari, incluso Internet Explorer 9 e superiori, anche se [sono richiesti alcuni polyfill](/docs/javascript-environment-requirements.html) per i browser più vecchi come IE 9 e IE 10.
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

> Nota
>
<<<<<<< HEAD
> Non diamo supporto ai browser più vecchi che non supportano metodi di ES5, le tue app potrebbero comunque funzionare su browser più vecchi se nella pagina sono inclusi polyfill come [es5-shim e es5-sham](https://github.com/es-shims/es5-shim). Se scegli questa strada, dovrai vedertela da solo.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

## Riferimento {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
Renderizza un elemento React nel DOM all'interno del [`container`](docs/composition-vs-inheritance.html#containment) fornito in input e ritorna un [riferimento](/docs/more-about-refs.html) al componente (o ritorna `null` per i [componenti funzione](/docs/components-and-props.html#function-and-class-components)).
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This ensures that the DOM is updated immediately.

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> Note:
> 
> `flushSync` can significantly hurt performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

Se l'elemento React era stato precedentemente renderizzato nel `container`, verrà eseguito un aggiornamento dell'elemento e verrà modificato solo il DOM necessario in modo da rispecchiare l'ultimo elemento React.

Se viene fornita la callback opzionale, essa sarà eseguita dopo che il componente è stato renderizzato o aggiornato.

> Nota:
>
<<<<<<< HEAD
> `ReactDOM.render()` controlla il contenuto del nodo contenitore che passi in input. Qualunque elemento DOM esistente all'interno di esso viene sostituito non appena viene invocato questo metodo. Le chiamate successive utilizzano l'algoritmo di [diffing](/docs/reconciliation.html#the-diffing-algorithm) del DOM di React per effettuare aggiornamenti più efficienti.
>
> `ReactDOM.render()` non modifica il nodo contenitore (modifica solamente i figli del contenitore). Potrebbe essere possibile inserire un componente in un nodo DOM esistente senza sovrascrivere i figli esistenti.
>
> `ReactDOM.render()` attualmente ritorna un riferimento all'instanza principale di `ReactComponent`. Tuttavia, l'utilizzo di questo valore di ritorno è obsoleto 
> e dovrebbe essere evitato perché le versioni future di React potrebbero renderizzare i componenti in maniera asincrona in alcuni casi. Se hai bisogno di un riferimento all'istanza principale di `ReactComponent`, la soluzione preferita è quella di connettere una 
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) all'elemento principale.
>
> Usare `ReactDOM.render()` per fare l'hydrate di un contenitore renderizzato lato server è deprecato e sarà rimosso in React 17. A questo scopo, usare il metodo [`hydrate()`](#hydrate).
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
Identico a [`render()`](#render), ma viene utilizzato per fare l'hydrate di un contenitore il cui HTML è stato renderizzato da [`ReactDOMServer`](/docs/react-dom-server.html). React proverà a connettere i listener degli eventi al markup esistente.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

React si aspetta che il contenuto renderizzato sia identico tra server e client. Può risolvere autonomamente differenze di testo, ma altre discrepanze dovresti trattarle come bug e risolverle. In modalità sviluppo, React avvisa quando ci sono eventuali discrepanze durante l'hydration. Non viene garantita la riparazione automatica nel caso di differenze negli attributi. Questo è importante per ragioni di performance perché nella maggior parte delle app, le discrepanze sono rare e quindi validare tutto il markup diventerebbe troppo costoso.

Se l'attributo o il testo di un singolo elemento è inevitabilmente diverso tra server e client (per esempio, un timestamp), potresti silenziare il warning aggiungendo `suppressHydrationWarning={true}` all'elemento. Questo funziona solamente ad un livello di profondità ed è un modo per aggirare il problema. Non abusarne. A meno che non sia testo, React non tenterà di ripararlo, perciò rimarrà inconsistente fino ad aggiornamenti futuri.

Se hai bisogno di renderizzare intenzionalmente qualcosa di diverso sul server e sul client, puoi eseguire una renderizzazione in due passaggi. I componenti che renderizzano qualcosa di diverso sul client possono leggere una variabile dello state come `this.state.isClient`, che setterai a `true` in `componentDidMount()`. In questo modo il passo iniziale renderizzerà lo stesso contenuto del server, evitando discrepanze, ma il passo successivo avverrà in maniera sincrona appena dopo l'hydration. Notare come questo approccio renda i tuoi componenti più lenti perché devono renderizzare due volte, quindi usalo con cautela.

Ricorda di essere consapevole dell'esperienza utente su connessioni lente. Il codice JavaScript potrebbe caricarsi significativamente più tardi rispetto allla renderizzazione iniziale dell'HTML, perciò se renderizzi qualcosa di diverso nel passaggio solo client, la transizione può risultare irritante. Tuttavia, se eseguito bene, può essere vantaggioso renderizzare uno "scheletro" dell'applicazione sul server, e mostrare solo alcuni dei widget supplementari sul client. Per capire come fare ciò senza imbattersi in problemi di discrepanze nel markup, consulta la spiegazione nel precedente paragrafo.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
Rimuove un componente React montato dal DOM e ripulisce i suoi gestori degli eventi e il suo state. Se nessun componente era stato montato nel contenitore, chiamare questa funzione non fa nulla. Ritorna `true` se un componente è stato smontato e `false` se non c'era nessun componente da smontare.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

* * *

### `findDOMNode()` {#finddomnode}

> Nota:
>
> `findDOMNode` è un modo per accedere al nodo DOM sottostante. Nella maggior parte dei casi, l'uso di questo metodo è scoraggiato perché attraversa l'astrazione del componente. [E' stato deprecato in `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```
Se questo componente è stato montato nel DOM, ritorna il corrispondente elemento DOM nativo del browser. Questo metodo è utile per leggere valori fuori dal DOM, come i valori dei campi di un form o per eseguire misurazioni del DOM. **Nella maggior parte dei casi, puoi collegare un ref al nodo DOM ed evitare l'uso di `findDOMNode`.**

Quando un componente renderizza come `null` o `false`, `findDOMNode` ritorna `null`. Quando un componente renderizza come stringa, `findDOMNode` ritorna un nodo DOM testuale contenente quel valore. A partire da React 16, un componente può ritornare un frammento con diversi figli, in tal caso `findDOMNode` ritornerà il nodo DOM corrispondente al primo figlio non vuoto. 

> Nota:
>
> `findDOMNode` funziona solo su componenti montati (ossia, componenti che sono stati piazzati nel DOM). Se provi a chiamarlo su un componente che non è stato ancora montato (come chiamare `findDOMNode()` nella `render()` di un componente non ancora creato) verrà lanciata un'eccezione.
>
> `findDOMNode` non può essere usata su componenti funzione.

* * *
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Crea un portale. I portali forniscono un modo per [renderizzare dei figli in un nodo DOM che esiste al di fuori della gerarchia del componente DOM](/docs/portals.html).
=======
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b
