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
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Panoramica {#overview}

<<<<<<< HEAD
Questi metodi sono disponibili solo in **ambienti con [Node.js Streams](https://nodejs.dev/learn/nodejs-streams):**
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.org/api/stream.html):**
>>>>>>> 47adefd30c46f486428d8231a68e639d62f02c9e

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Obsoleto)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

Questi metodi sono disponibili solo in **ambienti con [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (ciò include browsers, Deno, ed alcune runtimes moderne edge):

- [`renderToReadableStream()`](#rendertoreadablestream)

I metodi seguenti possono essere usati in ambienti che non supportano streams:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

## Riferimento {#reference}

### `renderToPipeableStream()` {#rendertopipeablestream}

> Try the new React documentation for [`renderToPipeableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToPipeableStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Renderizza un elemento React nel suo HTML iniziale. Ritorna uno stream con un metodo `pipe(res)` al pipe con l'output ed `abort()` per abortire la richiesta. Supporta completamente Suspense e lo streaming di HTML con blocchi di contenuto "ritardati" visualizzati in seguito mediante multipli tags `<script>`. [Maggiori informazioni](https://github.com/reactwg/react-18/discussions/37)

Se chiami [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) su un nodo che ha già il suo markup generato dal server, React lo preserverà ed applicherà solo gli event handlers, permettendo di avere una esperienza di caricamento iniziale molto performante.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

Guarda la [lista completa delle opzioni](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Nota:
>
> Si tratta di una API specifica di Node.js. Ambienti con [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), come Deno e runtimes edge moderne, dovrebbero invece usare [`renderToReadableStream`](#rendertoreadablestream).
>

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

> Try the new React documentation for [`renderToReadableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToReadableStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

Effettua lo streaming di un elemento Reacto al suo HTML iniziale. Ritorna una Promise che risolve a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Supporta pienamente Suspense e lo streaming di HTML. [Maggiori informazioni](https://github.com/reactwg/react-18/discussions/127)

Se chiami [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) su un nodo che ha già il suo markup generato dal server, React lo preserverà ed applicherà solo gli event handlers, permettendo di avere una esperienza di caricamento iniziale molto performante.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );

  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
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

Guarda la [lista completa delle opzioni](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Nota:
>
> Questa API dipende su [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Per Node.js, utilizza [`renderToPipeableStream`](#rendertopipeablestream).
>

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

> Try the new React documentation for [`renderToNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToNodeStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Renderizza un elemento React con il suo HTML iniziale. Ritorna un [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) che ritorna a sua bolta una stringa HTML. L'HTML in output da questo stream è esattamente uguale a quello che ritorna [`ReactDOMServer.renderToString`](#rendertostring). Puoi utilizzare questo metodo per generare HTML nel server ed inviare il markup con la prima richiesta per caricamenti più veloci e per permettere ai motori di ricerca di indicizzare le tue pagine per SEO.

Se chiami [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) su un nodo che ha già il suo markup generato dal server, React lo preserverà ed applicherà solo gli event handlers, permettendo di avere una esperienza di caricamento iniziale molto performante.

> Nota:
>
> Solo server. Questa API non è disponibile nel browser.
>
> Lo stream ritornato da questo metodo sarà uno stream di bytes codificato in utf-8. Se hai bisogno di uno stream in un'altra codifica, da uno sguardo a un progetto tipo [iconv-lite](https://www.npmjs.com/package/iconv-lite), il quale fornisce stream di trasformazione per la transcodifica del testo.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

> Try the new React documentation for [`renderToStaticNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticNodeStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Simile a [`renderToNodeStream`](#rendertonodestream), tranne per il fatto che non crea attributi DOM aggiuntivi che React usa internamente, come `data-reactroot`. Questo metodo è utile se vuoi usare React come un semplice generatore di pagine statiche, in quanto sbarazzarsi di attributi aggiuntivi può farti risparmiare dei bytes.

Lo HTML prodotto da questo stream è esattamente identico a quello che ritornerebbe [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup).

Se intendi utilizzare React su un client rendendo il markup interattivo, non utilizzare questo metodo. Utilizza invece [`renderToNodeStream`](#rendertonodestream) sul server e [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) sul client.

> Nota:
>
> Solo server. Questa API non è disponibile nel browser.
>
> Lo stream ritornato da questo metodo ritornerà uno stream di bytes con encoding utf-8. Se hai bisogno di un altro encoding, dai uno sguardo a progetti come [iconv-lite](https://www.npmjs.com/package/iconv-lite), che permettono di transformare streams per il transcoding del testo.

* * *

### `renderToString()` {#rendertostring}

> Try the new React documentation for [`renderToString`](https://beta.reactjs.org/reference/react-dom/server/renderToString).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

> Try the new React documentation for [`renderToStaticMarkup`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticMarkup).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
