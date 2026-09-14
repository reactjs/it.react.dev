---
title: renderToStaticMarkup
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/server/renderToStaticMarkup.md).

</Note>

<Intro>

`renderToStaticMarkup` renderizza un albero React non interattivo in una stringa HTML.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

Sul server, chiama `renderToStaticMarkup` per renderizzare la tua app in HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

Produrrà un output HTML non interattivo dei tuoi componenti React.

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: Un nodo React che vuoi renderizzare in HTML. Ad esempio, un elemento JSX come `<Page />`.
* **optional** `options`: Un oggetto per la renderizzazione sul server.
  * **optional** `identifierPrefix`: Un prefisso stringa che React usa per gli ID generati da [`useId`.](/reference/react/useId) Utile per evitare conflitti quando usi più root sulla stessa pagina.

#### Returns {/*returns*/}

Una stringa HTML.

#### Caveats {/*caveats*/}

* L'output di `renderToStaticMarkup` non supporta l'hydration.

* `renderToStaticMarkup` ha un supporto limitato a Suspense. Se un componente sospende, `renderToStaticMarkup` invia immediatamente il suo fallback come HTML.

* `renderToStaticMarkup` funziona nel browser, ma usarlo nel codice client non è consigliato. Se devi renderizzare un componente in HTML nel browser, [ottieni l'HTML renderizzandolo in un nodo DOM.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## Usage {/*usage*/}

### Renderizzare un albero React non interattivo come HTML in una stringa {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Chiama `renderToStaticMarkup` per renderizzare la tua app in una stringa HTML che puoi inviare con la risposta del server:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// La sintassi del route handler dipende dal tuo framework backend
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

Questo produrrà l'output HTML non interattivo iniziale dei tuoi componenti React.

<Pitfall>

Questo metodo renderizza **HTML non interattivo che non supporta l'hydration.** È utile se vuoi usare React come semplice generatore di pagine statiche, o se renderizzi contenuto completamente statico come email.

Le app interattive dovrebbero usare [`renderToString`](/reference/react-dom/server/renderToString) sul server e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) sul client.

</Pitfall>
