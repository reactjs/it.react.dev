---
title: API React DOM del server
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/server/index.md).

</Note>

<Intro>

Le API `react-dom/server` ti permettono di renderizzare componenti React in HTML sul server. Queste API vengono usate solo sul server, al livello superiore della tua app, per generare l'HTML iniziale. Un [framework](/learn/creating-a-react-app#full-stack-frameworks) può chiamarle per te. La maggior parte dei tuoi componenti non deve importarle o usarle.

</Intro>

---

## API del server per Web Stream {/*server-apis-for-web-streams*/}

Questi metodi sono disponibili solo negli ambienti con [Web Streams](https://developer.mozilla.org/it/docs/Web/API/Streams_API), che includono browser, Deno e i moderni edge runtime:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) renderizza un albero React in uno [Stream Web Readable.](https://developer.mozilla.org/it/docs/Web/API/ReadableStream)
* [`resume`](/reference/react-dom/server/resume) riprende [`prerender`](/reference/react-dom/static/prerender) in uno [Stream Web Readable](https://developer.mozilla.org/it/docs/Web/API/ReadableStream).


<Note>

Node.js include anche questi metodi per compatibilità, ma non sono consigliati a causa delle prestazioni inferiori. Usa invece le [API Node.js dedicate](#server-apis-for-nodejs-streams).

</Note>
---

## API del server per Node.js Stream {/*server-apis-for-nodejs-streams*/}

Questi metodi sono disponibili solo negli ambienti con [Node.js Stream:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renderizza un albero React in uno [Stream Node.js pipeable.](https://nodejs.org/api/stream.html)
* [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) riprende [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) in uno [Stream Node.js pipeable.](https://nodejs.org/api/stream.html)

---

## API legacy del server per ambienti senza streaming {/*legacy-server-apis-for-non-streaming-environments*/}

Questi metodi possono essere usati negli ambienti che non supportano gli stream:

* [`renderToString`](/reference/react-dom/server/renderToString) renderizza un albero React in una stringa.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) renderizza un albero React non interattivo in una stringa.

Hanno funzionalità limitate rispetto alle API di streaming.
