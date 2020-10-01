---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

L'oggetto `ReactDOMServer` ti permette di renderizzare componenti in markup statici. Tipicamente viene usato con un server Node:

```js
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Panoramica {#overview}

I seguenti metodi possono essere usati sia nel server che nel browser:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

Questi metodi aggiuntivi dipendono da un package (`stream`) che è **disponibile solo sul server**, mentre non funziona nel browser.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Riferimento {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Renderizza un elemento React nel suo HTML iniziale. React ritornerà una stringa HTML. Puoi usare questo metodo per generare HTML sul server e inviare il markup nella richiesta iniziale per rendere più veloce il caricamento della pagina e consentire ai motori di ricerca di indicizzare le tue pagine per scopi di SEO.

Se invochi [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) su un nodo che già possiede questo markup renderizzato lato server, React lo preserverà e aggancerà solamente i gestori degli eventi, consentendoti di avere un caricamento iniziale molto performante.


* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Simile a [`renderToString`](#rendertostring), tranne per il fatto che non crea attributi DOM aggiuntivi che React usa internamente, come `data-reactroot`. Questo metodo è utile se vuoi usare React come un semplice generatore di pagine statiche, in quanto sbarazzarsi di attributi aggiuntivi può farti risparmiare dei bytes.

Se hai intenzione di usare React sul client per creare un markup interattivo, non usare questo metodo. Utilizza, invece, [`renderToString`](#rendertostring) sul server e [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sul client.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Renderizza un elemento React nel suo HTML iniziale. Ritorna uno [stream Readable](https://nodejs.org/api/stream.html#stream_readable_streams) che produce una stringa HTML. Lo HTML prodotto da questo stream è esattamente identico a quello che ritornerebbe [`ReactDOMServer.renderToString`](#rendertostring). Puoi usare questo metodo per generare HTML sul server e inviare il markup nella richiesta iniziale per rendere più veloce il caricamento della pagina e consentire ai motori di ricerca di indicizzare le tue pagine per scopi di SEO.

Se invochi [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) su un nodo che già possiede questo markup renderizzato lato server, React lo preserverà e aggancerà solamente i gestori degli eventi, consentendoti di avere un caricamento iniziale molto performante.

> Nota:
>
> Solo server. Questa API non è disponibile nel browser.
>
> Lo stream ritornato da questo metodo sarà uno stream di bytes codificato in utf-8. Se hai bisogno di uno stream in un'altra codifica, da uno sguardo a un progetto tipo [iconv-lite](https://www.npmjs.com/package/iconv-lite), il quale fornisce stream di trasformazione per la transcodifica del testo.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Simile a [`renderToNodeStream`](#rendertonodestream), tranne per il fatto che non crea attributi DOM aggiuntivi che React usa internamente, come `data-reactroot`. Questo metodo è utile se vuoi usare React come un semplice generatore di pagine statiche, in quanto sbarazzarsi di attributi aggiuntivi può farti risparmiare dei bytes.

Lo HTML prodotto da questo stream è esattamente identico a quello che ritornerebbe [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup).

Se hai intenzione di usare React sul client per creare un markup interattivo, non usare questo metodo. Utilizza, invece, [`renderToString`](#rendertostring) sul server e [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sul client.

> Nota:
>
> Solo server. Questa API non è disponibile nel browser.
>
> Lo stream ritornato da questo metodo sarà uno stream di bytes codificato in utf-8. Se hai bisogno di uno stream in un'altra codifica, da uno sguardo a un progetto tipo [iconv-lite](https://www.npmjs.com/package/iconv-lite), il quale fornisce stream di trasformazione per la transcodifica del testo.
