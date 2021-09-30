---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

Se carichi React da un tag `<script>`, queste API di alto livello sono disponibili nell'oggetto globale `ReactDOM`. Se usi ES6 con npm, puoi scrivere `import ReactDOM from 'react-dom'`. Se usi ES5 con npm, puoi scrivere `var ReactDOM = require('react-dom')`.

## Panoramica {#overview}

Il *package* `react-dom` fornisce dei metodi specifici per il DOM che possono essere usati al livello più in alto nella tua app e come scorciatoie per uscire fuori dal modello di React qualora ne avessi bisogno. La maggior parte dei tuoi componenti non dovrebbero aver bisogno di usare questo modulo.

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### Supporto ai browser {#browser-support}

React supporta tutti i browser più popolari, incluso Internet Explorer 9 e superiori, anche se [sono richiesti alcuni polyfill](/docs/javascript-environment-requirements.html) per i browser più vecchi come IE 9 e IE 10.

> Nota
>
> Non diamo supporto ai browser più vecchi che non supportano metodi di ES5, le tue app potrebbero comunque funzionare su browser più vecchi se nella pagina sono inclusi polyfill come [es5-shim e es5-sham](https://github.com/es-shims/es5-shim). Se scegli questa strada, dovrai vedertela da solo.

* * *

## Riferimento {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

Renderizza un elemento React nel DOM all'interno del [`container`](docs/composition-vs-inheritance.html#containment) fornito in input e ritorna un [riferimento](/docs/more-about-refs.html) al componente (o ritorna `null` per i [componenti funzione](/docs/components-and-props.html#function-and-class-components)).

Se l'elemento React era stato precedentemente renderizzato nel `container`, verrà eseguito un aggiornamento dell'elemento e verrà modificato solo il DOM necessario in modo da rispecchiare l'ultimo elemento React.

Se viene fornita la callback opzionale, essa sarà eseguita dopo che il componente è stato renderizzato o aggiornato.

> Nota:
>
> `ReactDOM.render()` controlla il contenuto del nodo contenitore che passi in input. Qualunque elemento DOM esistente all'interno di esso viene sostituito non appena viene invocato questo metodo. Le chiamate successive utilizzano l'algoritmo di [diffing](/docs/reconciliation.html#the-diffing-algorithm) del DOM di React per effettuare aggiornamenti più efficienti.
>
> `ReactDOM.render()` non modifica il nodo contenitore (modifica solamente i figli del contenitore). Potrebbe essere possibile inserire un componente in un nodo DOM esistente senza sovrascrivere i figli esistenti.
>
> `ReactDOM.render()` attualmente ritorna un riferimento all'instanza principale di `ReactComponent`. Tuttavia, l'utilizzo di questo valore di ritorno è obsoleto 
> e dovrebbe essere evitato perché le versioni future di React potrebbero renderizzare i componenti in maniera asincrona in alcuni casi. Se hai bisogno di un riferimento all'istanza principale di `ReactComponent`, la soluzione preferita è quella di connettere una 
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) all'elemento principale.
>
> Usare `ReactDOM.render()` per fare l'hydrate di un contenitore renderizzato lato server è deprecato e sarà rimosso in React 17. A questo scopo, usare il metodo [`hydrate()`](#hydrate).

* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

Identico a [`render()`](#render), ma viene utilizzato per fare l'hydrate di un contenitore il cui HTML è stato renderizzato da [`ReactDOMServer`](/docs/react-dom-server.html). React proverà a connettere i listener degli eventi al markup esistente.

React si aspetta che il contenuto renderizzato sia identico tra server e client. Può risolvere autonomamente differenze di testo, ma altre discrepanze dovresti trattarle come bug e risolverle. In modalità sviluppo, React avvisa quando ci sono eventuali discrepanze durante l'hydration. Non viene garantita la riparazione automatica nel caso di differenze negli attributi. Questo è importante per ragioni di performance perché nella maggior parte delle app, le discrepanze sono rare e quindi validare tutto il markup diventerebbe troppo costoso.

Se l'attributo o il testo di un singolo elemento è inevitabilmente diverso tra server e client (per esempio, un timestamp), potresti silenziare il warning aggiungendo `suppressHydrationWarning={true}` all'elemento. Questo funziona solamente ad un livello di profondità ed è un modo per aggirare il problema. Non abusarne. A meno che non sia testo, React non tenterà di ripararlo, perciò rimarrà inconsistente fino ad aggiornamenti futuri.

Se hai bisogno di renderizzare intenzionalmente qualcosa di diverso sul server e sul client, puoi eseguire una renderizzazione in due passaggi. I componenti che renderizzano qualcosa di diverso sul client possono leggere una variabile dello state come `this.state.isClient`, che setterai a `true` in `componentDidMount()`. In questo modo il passo iniziale renderizzerà lo stesso contenuto del server, evitando discrepanze, ma il passo successivo avverrà in maniera sincrona appena dopo l'hydration. Notare come questo approccio renda i tuoi componenti più lenti perché devono renderizzare due volte, quindi usalo con cautela.

Ricorda di essere consapevole dell'esperienza utente su connessioni lente. Il codice JavaScript potrebbe caricarsi significativamente più tardi rispetto allla renderizzazione iniziale dell'HTML, perciò se renderizzi qualcosa di diverso nel passaggio solo client, la transizione può risultare irritante. Tuttavia, se eseguito bene, può essere vantaggioso renderizzare uno "scheletro" dell'applicazione sul server, e mostrare solo alcuni dei widget supplementari sul client. Per capire come fare ciò senza imbattersi in problemi di discrepanze nel markup, consulta la spiegazione nel precedente paragrafo.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

Rimuove un componente React montato dal DOM e ripulisce i suoi gestori degli eventi e il suo state. Se nessun componente era stato montato nel contenitore, chiamare questa funzione non fa nulla. Ritorna `true` se un componente è stato smontato e `false` se non c'era nessun componente da smontare.

* * *

### `findDOMNode()` {#finddomnode}

> Nota:
>
> `findDOMNode` è un modo per accedere al nodo DOM sottostante. Nella maggior parte dei casi, l'uso di questo metodo è scoraggiato perché attraversa l'astrazione del componente. [E' stato deprecato in `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
Se questo componente è stato montato nel DOM, ritorna il corrispondente elemento DOM nativo del browser. Questo metodo è utile per leggere valori fuori dal DOM, come i valori dei campi di un form o per eseguire misurazioni del DOM. **Nella maggior parte dei casi, puoi collegare un ref al nodo DOM ed evitare l'uso di `findDOMNode`.**

Quando un componente renderizza come `null` o `false`, `findDOMNode` ritorna `null`. Quando un componente renderizza come stringa, `findDOMNode` ritorna un nodo DOM testuale contenente quel valore. A partire da React 16, un componente può ritornare un frammento con diversi figli, in tal caso `findDOMNode` ritornerà il nodo DOM corrispondente al primo figlio non vuoto. 

> Nota:
>
> `findDOMNode` funziona solo su componenti montati (ossia, componenti che sono stati piazzati nel DOM). Se provi a chiamarlo su un componente che non è stato ancora montato (come chiamare `findDOMNode()` nella `render()` di un componente non ancora creato) verrà lanciata un'eccezione.
>
> `findDOMNode` non può essere usata su componenti funzione.

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Crea un portale. I portali forniscono un modo per [renderizzare dei figli in un nodo DOM che esiste al di fuori della gerarchia del componente DOM](/docs/portals.html).
