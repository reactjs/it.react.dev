---
title: lazy
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/lazy.md).

</Note>

<Intro>

`lazy` ti permette di posticipare il caricamento del codice del componente fino alla sua prima renderizzazione.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `lazy(load)` {/*lazy*/}

Chiama `lazy` fuori dai tuoi componenti per dichiarare un componente React caricato in lazy:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `load`: Una funzione che restituisce una [Promise](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise) o un altro *thenable* (un oggetto simile a una Promise con un metodo `then`). React non chiamerà `load` fino al primo tentativo di renderizzare il componente restituito. Dopo la prima chiamata a `load`, React attenderà che venga risolta e poi renderizzerà la proprietà `.default` del valore risolto come componente React. Sia la Promise restituita sia il valore risolto della Promise verranno memorizzati in cache, quindi React non chiamerà `load` più di una volta. Se la Promise viene rifiutata, React `throw`erà il motivo del rifiuto affinché lo gestisca il contenitore di errori più vicino.

#### Returns {/*returns*/}

`lazy` restituisce un componente React che puoi renderizzare nel tuo albero. Mentre il codice del componente lazy è ancora in caricamento, il tentativo di renderizzarlo lo farà *andare in sospensione.* Usa [`<Suspense>`](/reference/react/Suspense) per mostrare un indicatore di caricamento mentre è in caricamento.

---

### Funzione `load` {/*load*/}

#### Parameters {/*load-parameters*/}

`load` non riceve parametri.

#### Returns {/*load-returns*/}

Devi restituire una [Promise](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise) o un altro *thenable* (un oggetto simile a una Promise con un metodo `then`). Deve risolversi infine in un oggetto la cui proprietà `.default` è un tipo componente React valido, come una funzione, un componente [`memo`](/reference/react/memo) o un componente [`forwardRef`](/reference/react/forwardRef).

---

## Usage {/*usage*/}

### Lazy-loading dei componenti con Suspense {/*suspense-for-code-splitting*/}

Di solito, importi i componenti con la dichiarazione statica [`import`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Statements/import):

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Per posticipare il caricamento del codice di questo componente fino alla sua prima renderizzazione, sostituisci questa importazione con:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

Questo codice si basa su [`import()` dinamico,](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/import) che potrebbe richiedere il supporto del tuo bundler o framework. Usare questo pattern richiede che il componente lazy che importi sia stato esportato come export `default`.

Ora che il codice del tuo componente si carica on demand, devi anche specificare cosa mostrare mentre è in caricamento. Puoi farlo avvolgendo il componente lazy o uno dei suoi genitori in un boundary [`<Suspense>`](/reference/react/Suspense):

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Anteprima</h2>
  <MarkdownPreview />
</Suspense>
```

In questo esempio, il codice di `MarkdownPreview` non verrà caricato finché non tenti di renderizzarlo. Se `MarkdownPreview` non si è ancora caricato, al suo posto verrà mostrato `Loading`. Prova a selezionare la checkbox:

<Sandpack>

```js src/App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Mostra anteprima
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Anteprima</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Aggiungi un ritardo fisso per poter vedere lo state di caricamento
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js src/Loading.js
export default function Loading() {
  return <p><i>Caricamento...</i></p>;
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Questa demo usa un ritardo artificiale. La prossima volta che deselezioni e selezioni di nuovo la checkbox, `Anteprima` sarà in cache, quindi non ci sarà alcuno state di caricamento. Per vedere di nuovo lo state di caricamento, fai clic su "Reset" nella sandbox.

[Scopri di più sulla gestione degli state di caricamento con Suspense.](/reference/react/Suspense)

---

## Troubleshooting {/*troubleshooting*/}

### Lo state del mio componente `lazy` viene resettato in modo imprevisto {/*my-lazy-components-state-gets-reset-unexpectedly*/}

Non dichiarare componenti `lazy` *all'interno* di altri componenti:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Sbagliato: questo farà resettare tutto lo state alle ri-renderizzazioni
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Dichiarali invece sempre al top level del tuo modulo:

```js {3-4}
import { lazy } from 'react';

// ✅ Corretto: dichiara i componenti lazy fuori dai tuoi componenti
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
