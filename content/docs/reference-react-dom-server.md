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

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Riferimento {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Renderizza un elemento React nel suo HTML iniziale. React ritornerà una stringa HTML. Puoi usare questo metodo per generare HTML sul server e inviare il markup nella richiesta iniziale per rendere più veloce il caricamento della pagina e consentire ai motori di ricerca di indicizzare le tue pagine per scopi di SEO.

Se invochi [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) su un nodo che già possiede questo markup renderizzato lato server, React lo preserverà e aggancerà solamente i gestori degli eventi, consentendoti di avere un caricamento iniziale molto performante.

<<<<<<< HEAD
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Simile a [`renderToString`](#rendertostring), tranne per il fatto che non crea attributi DOM aggiuntivi che React usa internamente, come `data-reactroot`. Questo metodo è utile se vuoi usare React come un semplice generatore di pagine statiche, in quanto sbarazzarsi di attributi aggiuntivi può farti risparmiare dei bytes.

<<<<<<< HEAD
Se hai intenzione di usare React sul client per creare un markup interattivo, non usare questo metodo. Utilizza, invece, [`renderToString`](#rendertostring) sul server e [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sul client.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Renderizza un elemento React nel suo HTML iniziale. Ritorna uno [stream Readable](https://nodejs.org/api/stream.html#stream_readable_streams) che produce una stringa HTML. Lo HTML prodotto da questo stream è esattamente identico a quello che ritornerebbe [`ReactDOMServer.renderToString`](#rendertostring). Puoi usare questo metodo per generare HTML sul server e inviare il markup nella richiesta iniziale per rendere più veloce il caricamento della pagina e consentire ai motori di ricerca di indicizzare le tue pagine per scopi di SEO.

<<<<<<< HEAD
Se invochi [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) su un nodo che già possiede questo markup renderizzato lato server, React lo preserverà e aggancerà solamente i gestori degli eventi, consentendoti di avere un caricamento iniziale molto performante.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

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

<<<<<<< HEAD
Se hai intenzione di usare React sul client per creare un markup interattivo, non usare questo metodo. Utilizza, invece, [`renderToString`](#rendertostring) sul server e [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sul client.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> Nota:
>
> Solo server. Questa API non è disponibile nel browser.
>
> Lo stream ritornato da questo metodo sarà uno stream di bytes codificato in utf-8. Se hai bisogno di uno stream in un'altra codifica, da uno sguardo a un progetto tipo [iconv-lite](https://www.npmjs.com/package/iconv-lite), il quale fornisce stream di trasformazione per la transcodifica del testo.
