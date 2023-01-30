---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

Il pacchetto `react-dom` offre metodi DOM-specifici che possono essere usati al livello più alto della tua applicazione come una forma di uscita di emergenza per permetterti di uscire dal modello React qualora ne avessi bisogno.

```js
import * as ReactDOM from 'react-dom';
```

Se usi ES5 con npm, puoi scrivere:

```js
var ReactDOM = require('react-dom');
```

Il pacchetto `react-dom` offre inoltre moduli specifici per applicazioni client e server:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)

## Panoramica {#overview}

Il pacchetto `react-dom` esporta questi metodi:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)

Anche questi metodi sono esportati da `react-dom`, ma sono considerati legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Nota:
>
> Entrambi `render` e `hydrate` sono stati sostituiti dai nuovi [metodi client](/docs/react-dom-client.html) in React 18. Questi metodi daranno un avviso alla tua applicazione e si comporteranno come se stessi utilizzando React 17 (maggiori informazioni [qui](https://reactjs.org/link/switch-to-createroot)).

### Supporto ai browser {#browser-support}

React supporta tutti i browser moderni, comunque [alcune polyfills sono richieste](/docs/javascript-environment-requirements.html) per versioni meno recenti.

> Nota
>
> Non supportiamo browser meno recenti che non supportano metodi ES5 o microtasks come Internet Explorer. Puoi trovare che le tue applicazioni funzionano in browser meno recenti utilizzando polyfills come [es5-shim ed es5-sham](https://github.com/es-shims/es5-shim), ma se procedi per questa strada assicurati di sapere cosa stai facendo.

## Riferimento {#reference}

### `createPortal()` {#createportal}

> Try the new React documentation for [`createPortal`](https://beta.reactjs.org/reference/react-dom/createPortal).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
createPortal(child, container)
```

Crea un portale. I portali permettono di [renderizzare un nodo figlio all'interno di un nodo DOM che esiste all'esterno della gerarchia del componente DOM](/docs/portals.html).

### `flushSync()` {#flushsync}

> Try the new React documentation for [`flushSync`](https://beta.reactjs.org/reference/react-dom/flushSync).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

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

> Try the new React documentation for [`render`](https://beta.reactjs.org/reference/react-dom/render).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).

Se l'elemento React era stato precedentemente renderizzato nel `container`, verrà eseguito un aggiornamento dell'elemento e verrà modificato solo il DOM necessario in modo da rispecchiare l'ultimo elemento React.

Se viene fornita la callback opzionale, essa sarà eseguita dopo che il componente è stato renderizzato o aggiornato.

> Nota:
>
> `render()` controlla il contenuto del nodo contenitore. Ogni nodo DOM allàinterno viene sostituito alla prima chiamata. Chiamate successive utilizzano l'algoritmo di diffing di React per aggiornamenti efficienti.
>
> `render()` non modifica il nodo contenitore (modifica solo i figli dello stesso). Potrebbe essere possibile inserire un componente in un nodo DOM esistente sovrascrivendo il figlio preesistente.
>
> `render()` attualmente ritorna una reference alla root dell'istanza `ReactComponent`. Comunque, l'utilizzo di questo valore è considerato legacy
> e bisognerebbe evitarlo in quanto versioni future di React potrebbero renderizzare questi componenti in modalità asincrona in alcuni casi. Se hai bisogno di una reference all'istanza root di `ReactComponent`, la soluzione preferenziale è quella di utilizzare una [callback ref](/docs/refs-and-the-dom.html#callback-refs).
>
> Utilizzare `render()` per reidratare un containere renderizzato dal server è deprecato. Usa invece [`hydrateRoot()`](/docs/react-dom-client.html#hydrateroot).

* * *

### `hydrate()` {#hydrate}

> Try the new React documentation for [`hydrate`](https://beta.reactjs.org/reference/react-dom/hydrate).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
hydrate(element, container[, callback])
```

> Nota:
>
> `hydrate` è stato sostituito con `hydrateRoot` in React 18. Guarda [hydrateRoot](/docs/react-dom-client.html#hydrateroot) per maggiori informazioni.

Come [`render()`](#render), ma viene usato per idratare un contenitore il quale HTML è stato renderizzato da [`ReactDOMServer`](/docs/react-dom-server.html). React tenterà di collegare eventuali listeners al markup esistente.

React si aspetta che il contenuto renderizzato sia identico tra server e client. Può risolvere autonomamente differenze di testo, ma altre discrepanze dovresti trattarle come bug e risolverle. In modalità sviluppo, React avvisa quando ci sono eventuali discrepanze durante l'hydration. Non viene garantita la riparazione automatica nel caso di differenze negli attributi. Questo è importante per ragioni di performance perché nella maggior parte delle app, le discrepanze sono rare e quindi validare tutto il markup diventerebbe troppo costoso.

Se l'attributo o il testo di un singolo elemento è inevitabilmente diverso tra server e client (per esempio, un timestamp), potresti silenziare il warning aggiungendo `suppressHydrationWarning={true}` all'elemento. Questo funziona solamente ad un livello di profondità ed è un modo per aggirare il problema. Non abusarne. A meno che non sia testo, React non tenterà di ripararlo, perciò rimarrà inconsistente fino ad aggiornamenti futuri.

Se hai bisogno di renderizzare intenzionalmente qualcosa di diverso sul server e sul client, puoi eseguire una renderizzazione in due passaggi. I componenti che renderizzano qualcosa di diverso sul client possono leggere una variabile dello state come `this.state.isClient`, che setterai a `true` in `componentDidMount()`. In questo modo il passo iniziale renderizzerà lo stesso contenuto del server, evitando discrepanze, ma il passo successivo avverrà in maniera sincrona appena dopo l'hydration. Notare come questo approccio renda i tuoi componenti più lenti perché devono renderizzare due volte, quindi usalo con cautela.

Ricorda di essere consapevole dell'esperienza utente su connessioni lente. Il codice JavaScript potrebbe caricarsi significativamente più tardi rispetto allla renderizzazione iniziale dell'HTML, perciò se renderizzi qualcosa di diverso nel passaggio solo client, la transizione può risultare irritante. Tuttavia, se eseguito bene, può essere vantaggioso renderizzare uno "scheletro" dell'applicazione sul server, e mostrare solo alcuni dei widget supplementari sul client. Per capire come fare ciò senza imbattersi in problemi di discrepanze nel markup, consulta la spiegazione nel precedente paragrafo.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

> Try the new React documentation for [`unmountComponentAtNode`](https://beta.reactjs.org/reference/react-dom/unmountComponentAtNode).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
unmountComponentAtNode(container)
```

> Nota:
>
> `unmountComponentAtNode` è stato sostituito da `root.unmount()` in React 18. Guarda [createRoot](/docs/react-dom-client.html#createroot) per maggiori informazioni.

Rimuove un componente React montato dal DOM e ripulisce eventuali event handlers e state. Se non esistono componenti montati nel container, chiamare questa funzione non fa nulla. Ritorna `true` se un componente è stato smontato e `false` se non c'era nulla da smontare.

* * *

### `findDOMNode()` {#finddomnode}

<<<<<<< HEAD
> Nota:
=======
> Try the new React documentation for [`findDOMNode`](https://beta.reactjs.org/reference/react-dom/findDOMNode).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

> Note:
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b
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
