---
title: renderToString
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/server/renderToString.md).

</Note>

<Pitfall>

`renderToString` non supporta lo streaming né l'attesa dei dati. [Vedi le alternative.](#alternatives)

</Pitfall>

<Intro>

`renderToString` renderizza un albero React in una stringa HTML.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

Sul server, chiama `renderToString` per renderizzare la tua app in HTML.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

Sul client, chiama [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) per idratare l'HTML generato sul server e attivarne l'interattività.

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: Un nodo React che vuoi renderizzare in HTML. Ad esempio, un nodo JSX come `<App />`.

* **optional** `options`: Un oggetto per la renderizzazione sul server.
  * **optional** `identifierPrefix`: Un prefisso stringa che React usa per gli ID generati da [`useId`.](/reference/react/useId) Utile per evitare conflitti quando usi più root sulla stessa pagina. Deve essere lo stesso prefisso passato a [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### Returns {/*returns*/}

Una stringa HTML.

#### Caveats {/*caveats*/}

* `renderToString` ha un supporto limitato per Suspense. Se un componente sospende, `renderToString` invia immediatamente il suo fallback come HTML.

* `renderToString` funziona nel browser, ma usarlo nel codice client [non è consigliato.](#removing-rendertostring-from-the-client-code)

---

## Usage {/*usage*/}

### Renderizzare un albero React come HTML in una stringa {/*rendering-a-react-tree-as-html-to-a-string*/}

Chiama `renderToString` per renderizzare la tua app in una stringa HTML che puoi inviare con la risposta del server:

```js {5-6}
import { renderToString } from 'react-dom/server';

// La sintassi del route handler dipende dal tuo framework backend
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

Questo produrrà l'output HTML iniziale non interattivo dei tuoi componenti React. Sul client, dovrai chiamare [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) per *idratare* quell'HTML generato sul server e attivarne l'interattività.


<Pitfall>

`renderToString` non supporta lo streaming né l'attesa dei dati. [Vedi le alternative.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrare da `renderToString` a una renderizzazione in streaming sul server {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` restituisce una stringa immediatamente, quindi non supporta lo streaming del contenuto man mano che viene caricato.

Quando possibile, consigliamo di usare queste alternative complete:

* Se usi Node.js, usa [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* Se usi Deno o un moderno edge runtime con [Web Streams](https://developer.mozilla.org/it/docs/Web/API/Streams_API), usa [`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

Puoi continuare a usare `renderToString` se il tuo ambiente server non supporta gli stream.

---

### Migrare da `renderToString` a un prerender statico sul server {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

`renderToString` restituisce una stringa immediatamente, quindi non supporta l'attesa del caricamento dei dati per la generazione di HTML statico.

Consigliamo di usare queste alternative complete:

* Se usi Node.js, usa [`prerenderToNodeStream`.](/reference/react-dom/static/prerenderToNodeStream)
* Se usi Deno o un moderno edge runtime con [Web Streams](https://developer.mozilla.org/it/docs/Web/API/Streams_API), usa [`prerender`.](/reference/react-dom/static/prerender)

Puoi continuare a usare `renderToString` se il tuo ambiente di generazione di siti statici non supporta gli stream.

---

### Rimuovere `renderToString` dal codice client {/*removing-rendertostring-from-the-client-code*/}

A volte, `renderToString` viene usato sul client per convertire un componente in HTML.

```js {1-2}
// 🚩 Non necessario: usare renderToString sul client
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // Ad esempio, "<svg>...</svg>"
```

Importare `react-dom/server` **sul client** aumenta inutilmente la dimensione del bundle e va evitato. Se devi renderizzare un componente in HTML nel browser, usa [`createRoot`](/reference/react-dom/client/createRoot) e leggi l'HTML dal DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // Ad esempio, "<svg>...</svg>"
```

La chiamata a [`flushSync`](/reference/react-dom/flushSync) è necessaria affinché il DOM venga aggiornato prima di leggere la proprietà [`innerHTML`](https://developer.mozilla.org/it/docs/Web/API/Element/innerHTML).

---

## Troubleshooting {/*troubleshooting*/}

### Quando un componente sospende, l'HTML contiene sempre un fallback {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` non supporta completamente Suspense.

Se un componente sospende (ad esempio, perché è definito con [`lazy`](/reference/react/lazy) o recupera dati), `renderToString` non attenderà che il suo contenuto venga risolto. Invece, `renderToString` troverà il boundary [`<Suspense>`](/reference/react/Suspense) più vicino sopra di esso e renderizzerà la sua `fallback` nell'HTML. Il contenuto non apparirà finché non viene caricato il codice client.

Per risolvere, usa una delle [soluzioni di streaming consigliate.](#alternatives) Per la renderizzazione sul server, possono fare streaming del contenuto a chunk man mano che viene risolto sul server, così l'utente vede la pagina riempirsi progressivamente prima che venga caricato il codice client. Per la generazione di siti statici, possono attendere che tutto il contenuto venga risolto prima di generare l'HTML statico.

