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
I seguenti metodi possono essere usati sia nel server che nel browser:
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.dev/learn/nodejs-streams):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

<<<<<<< HEAD
Questi metodi aggiuntivi dipendono da un package (`stream`) che è **disponibile solo sul server**, mentre non funziona nel browser.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Riferimento {#reference}
=======
## Reference {#reference}
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

<<<<<<< HEAD
Renderizza un elemento React nel suo HTML iniziale. React ritornerà una stringa HTML. Puoi usare questo metodo per generare HTML sul server e inviare il markup nella richiesta iniziale per rendere più veloce il caricamento della pagina e consentire ai motori di ricerca di indicizzare le tue pagine per scopi di SEO.

Se invochi [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) su un nodo che già possiede questo markup renderizzato lato server, React lo preserverà e aggancerà solamente i gestori degli eventi, consentendoti di avere un caricamento iniziale molto performante.

=======
Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

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

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

<<<<<<< HEAD
Simile a [`renderToString`](#rendertostring), tranne per il fatto che non crea attributi DOM aggiuntivi che React usa internamente, come `data-reactroot`. Questo metodo è utile se vuoi usare React come un semplice generatore di pagine statiche, in quanto sbarazzarsi di attributi aggiuntivi può farti risparmiare dei bytes.

Se hai intenzione di usare React sul client per creare un markup interattivo, non usare questo metodo. Utilizza, invece, [`renderToString`](#rendertostring) sul server e [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sul client.
=======
Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

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

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

<<<<<<< HEAD
Renderizza un elemento React nel suo HTML iniziale. Ritorna uno [stream Readable](https://nodejs.org/api/stream.html#stream_readable_streams) che produce una stringa HTML. Lo HTML prodotto da questo stream è esattamente identico a quello che ritornerebbe [`ReactDOMServer.renderToString`](#rendertostring). Puoi usare questo metodo per generare HTML sul server e inviare il markup nella richiesta iniziale per rendere più veloce il caricamento della pagina e consentire ai motori di ricerca di indicizzare le tue pagine per scopi di SEO.

Se invochi [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) su un nodo che già possiede questo markup renderizzato lato server, React lo preserverà e aggancerà solamente i gestori degli eventi, consentendoti di avere un caricamento iniziale molto performante.
=======
Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

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
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

> Nota:
>
> Solo server. Questa API non è disponibile nel browser.
>
<<<<<<< HEAD
> Lo stream ritornato da questo metodo sarà uno stream di bytes codificato in utf-8. Se hai bisogno di uno stream in un'altra codifica, da uno sguardo a un progetto tipo [iconv-lite](https://www.npmjs.com/package/iconv-lite), il quale fornisce stream di trasformazione per la transcodifica del testo.
=======
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

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

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
