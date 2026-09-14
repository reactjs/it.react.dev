---
title: useDeferredValue
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useDeferredValue.md).

</Note>

<Intro>

`useDeferredValue` è un Hook React che ti permette di differire l'aggiornamento di una parte dell'UI.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

Chiama `useDeferredValue` al top level del tuo componente per ottenere una versione differita di quel valore.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `value`: Il valore che vuoi differire. Può essere di qualsiasi tipo.
* **optional** `initialValue`: Un valore da usare durante la renderizzazione iniziale del componente. Se ometti questa opzione, `useDeferredValue` non differirà durante la renderizzazione iniziale, perché non esiste una versione precedente di `value` da renderizzare al suo posto.


#### Returns {/*returns*/}

- `currentValue`: Durante la renderizzazione iniziale, il valore differito restituito sarà `initialValue`, oppure lo stesso del valore che hai fornito. Durante gli aggiornamenti, React proverà prima a ri-renderizzare con il vecchio valore (quindi restituirà il vecchio valore), e poi tenterà un'altra ri-renderizzazione in background con il nuovo valore (quindi restituirà il valore aggiornato).

#### Caveats {/*caveats*/}

- Quando un aggiornamento avviene all'interno di una Transizione, `useDeferredValue` restituisce sempre il nuovo `value` e non avvia una renderizzazione differita, perché l'aggiornamento è già differito.

- I valori che passi a `useDeferredValue` dovrebbero essere valori primitivi (come stringhe e numeri) oppure oggetti creati al di fuori della renderizzazione. Se crei un nuovo oggetto durante la renderizzazione e lo passi subito a `useDeferredValue`, sarà diverso a ogni renderizzazione, causando ri-renderizzazioni in background non necessarie.

- Quando `useDeferredValue` riceve un valore diverso (rispetto a [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), oltre alla renderizzazione corrente (quando usa ancora il valore precedente), pianifica una ri-renderizzazione in background con il nuovo valore. La ri-renderizzazione in background è interrompibile: se c'è un altro aggiornamento a `value`, React riavvierà la ri-renderizzazione in background da zero. Per esempio, se l'utente digita in un input più velocemente di quanto un grafico che riceve il suo valore differito riesca a ri-renderizzarsi, il grafico si ri-renderizzerà solo dopo che l'utente smette di digitare.

- `useDeferredValue` è integrato con [`<Suspense>`.](/reference/react/Suspense) Se l'aggiornamento in background causato da un nuovo valore sospende l'UI, l'utente non vedrà il fallback. Vedrà il vecchio valore differito finché i dati non saranno caricati.

- `useDeferredValue` da solo non impedisce richieste di rete extra.

- Non c'è un ritardo fisso causato da `useDeferredValue` in sé. Non appena React termina la ri-renderizzazione originale, inizierà subito a lavorare sulla ri-renderizzazione in background con il nuovo valore differito. Qualsiasi aggiornamento causato da eventi (come la digitazione) interromperà la ri-renderizzazione in background e avrà priorità su di essa.

- La ri-renderizzazione in background causata da `useDeferredValue` non esegue gli Effetti finché non viene committata sullo schermo. Se la ri-renderizzazione in background sospende, i suoi Effetti verranno eseguiti dopo che i dati saranno caricati e l'UI sarà aggiornata.

---

## Usage {/*usage*/}

### Mostrare contenuto obsoleto mentre il contenuto aggiornato è in caricamento {/*showing-stale-content-while-fresh-content-is-loading*/}

Chiama `useDeferredValue` al top level del tuo componente per differire l'aggiornamento di una parte dell'UI.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

Durante la renderizzazione iniziale, il <CodeStep step={2}>valore differito</CodeStep> sarà lo stesso del <CodeStep step={1}>valore</CodeStep> che hai fornito.

Durante gli aggiornamenti, il <CodeStep step={2}>valore differito</CodeStep> resterà "indietro" rispetto all'ultimo <CodeStep step={1}>valore</CodeStep>. In particolare, React ri-renderizzerà prima *senza* aggiornare il valore differito, e poi proverà a ri-renderizzare con il valore appena ricevuto in background.

**Vediamo un esempio per capire quando questo è utile.**

<Note>

Questo esempio presuppone che tu usi una sorgente dati che [attiva un boundary Suspense](/reference/react/Suspense#what-activates-a-suspense-boundary), come una Promise che leggi con [`use`](/reference/react/use).

[Scopri di più su Suspense.](/reference/react/Suspense)

</Note>


In questo esempio, il componente `SearchResults` [sospende](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) mentre recupera i risultati della ricerca. Prova a digitare `"a"`, attendi i risultati, e poi modifica in `"ab"`. I risultati per `"a"` vengono sostituiti dal fallback di caricamento.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Nota: il modo in cui fai data fetching dipende dal
// framework che usi insieme a Suspense.
// Di solito, la logica di caching sarebbe dentro un framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Aggiunge un ritardo fittizio per evidenziare l'attesa.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

Un pattern UI alternativo comune consiste nel *differire* l'aggiornamento dell'elenco dei risultati e continuare a mostrare i risultati precedenti finché quelli nuovi non sono pronti. Chiama `useDeferredValue` per passare in giù una versione differita della query:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` si aggiornerà subito, quindi l'input mostrerà il nuovo valore. Tuttavia, `deferredQuery` manterrà il valore precedente finché i dati non saranno caricati, quindi `SearchResults` mostrerà per un po' i risultati obsoleti.

Digita `"a"` nell'esempio sotto, attendi che i risultati si carichino, e poi modifica l'input in `"ab"`. Nota come, invece del fallback Suspense, ora vedi l'elenco obsoleto dei risultati finché quelli nuovi non sono caricati:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Nota: il modo in cui fai data fetching dipende dal
// framework che usi insieme a Suspense.
// Di solito, la logica di caching sarebbe dentro un framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Aggiunge un ritardo fittizio per evidenziare l'attesa.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### Come funziona il differimento di un valore sotto il cofano? {/*how-does-deferring-a-value-work-under-the-hood*/}

Puoi pensarlo come un processo in due passaggi:

1. **Per prima cosa, React ri-renderizza con la nuova `query` (`"ab"`) ma con la vecchia `deferredQuery` (ancora `"a"`).** Il valore `deferredQuery`, che passi all'elenco dei risultati, è *differito:* resta "indietro" rispetto al valore `query`.

2. **In background, React prova a ri-renderizzare con *entrambi* `query` e `deferredQuery` aggiornati a `"ab"`.** Se questa ri-renderizzazione si completa, React la mostrerà sullo schermo. Tuttavia, se sospende (i risultati per `"ab"` non sono ancora caricati), React abbandonerà questo tentativo di renderizzazione e riproverà questa ri-renderizzazione dopo che i dati saranno caricati. L'utente continuerà a vedere il valore differito obsoleto finché i dati non saranno pronti.

La renderizzazione "in background" differita è interrompibile. Per esempio, se digiti di nuovo nell'input, React la abbandonerà e ripartirà con il nuovo valore. React userà sempre l'ultimo valore fornito.

Nota che c'è comunque una richiesta di rete per ogni pressione di tasto. Ciò che viene differito qui è la visualizzazione dei risultati (finché non sono pronti), non le richieste di rete in sé. Anche se l'utente continua a digitare, le risposte per ogni pressione di tasto vengono messe in cache, quindi premere Backspace è istantaneo e non effettua di nuovo il fetch.

</DeepDive>

---

### Indicare che il contenuto è obsoleto {/*indicating-that-the-content-is-stale*/}

Nell'esempio sopra, non c'è alcuna indicazione che l'elenco dei risultati per l'ultima query sia ancora in caricamento. Questo può confondere l'utente se i nuovi risultati impiegano un po' a caricarsi. Per evidenziare che l'elenco dei risultati non corrisponde all'ultima query, puoi aggiungere un'indicazione visiva quando viene mostrato l'elenco obsoleto:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Con questa modifica, non appena inizi a digitare, l'elenco obsoleto dei risultati viene leggermente attenuato finché il nuovo elenco non si carica. Puoi anche aggiungere una transizione CSS per ritardare l'attenuazione in modo che risulti graduale, come nell'esempio sotto:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Nota: il modo in cui fai data fetching dipende dal
// framework che usi insieme a Suspense.
// Di solito, la logica di caching sarebbe dentro un framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Aggiunge un ritardo fittizio per evidenziare l'attesa.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### Differire la ri-renderizzazione di una parte dell'UI {/*deferring-re-rendering-for-a-part-of-the-ui*/}

Puoi anche usare `useDeferredValue` come ottimizzazione delle prestazioni. È utile quando una parte dell'UI è lenta da ri-renderizzare, non c'è un modo semplice per ottimizzarla, e vuoi evitare che blocchi il resto dell'UI.

Immagina di avere un campo di testo e un componente (come un grafico o un elenco lungo) che si ri-renderizza a ogni pressione di tasto:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

Per prima cosa, ottimizza `SlowList` per saltare la ri-renderizzazione quando le sue props sono le stesse. Per farlo, [avvolgilo in `memo`:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

Tuttavia, questo aiuta solo se le props di `SlowList` sono *le stesse* rispetto alla renderizzazione precedente. Il problema che affronti ora è che è lento quando sono *diverse*, e quando devi effettivamente mostrare un output visivo diverso.

In concreto, il problema principale di prestazioni è che ogni volta che digiti nell'input, `SlowList` riceve nuove props, e ri-renderizzare l'intero albero rende la digitazione a scatti. In questo caso, `useDeferredValue` ti permette di dare priorità all'aggiornamento dell'input (che deve essere veloce) rispetto all'aggiornamento dell'elenco dei risultati (che può essere più lento):

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

Questo non rende più veloce la ri-renderizzazione di `SlowList`. Tuttavia, dice a React che la ri-renderizzazione dell'elenco può essere deprioritizzata in modo da non bloccare le pressioni di tasto. L'elenco resterà "indietro" rispetto all'input e poi "recupererà". Come prima, React proverà ad aggiornare l'elenco il prima possibile, ma non bloccherà l'utente dalla digitazione.

<Recipes titleText="La differenza tra useDeferredValue e la ri-renderizzazione non ottimizzata" titleId="examples">

#### Ri-renderizzazione differita dell'elenco {/*deferred-re-rendering-of-the-list*/}

In questo esempio, ogni elemento del componente `SlowList` è **artificialmente rallentato** così puoi vedere come `useDeferredValue` ti permette di mantenere l'input reattivo. Digita nell'input e nota come la digitazione resta fluida mentre l'elenco resta "indietro".

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log una volta. Il rallentamento effettivo è dentro SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Non fa nulla per 1 ms per elemento per emulare codice estremamente lento
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
  max-height: 300px;
  overflow: auto;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### Ri-renderizzazione non ottimizzata dell'elenco {/*unoptimized-re-rendering-of-the-list*/}

In questo esempio, ogni elemento del componente `SlowList` è **artificialmente rallentato**, ma non c'è `useDeferredValue`.

Nota come digitare nell'input risulta molto a scatti. Questo perché senza `useDeferredValue`, ogni pressione di tasto costringe l'intero elenco a ri-renderizzarsi subito in modo non interrompibile.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log una volta. Il rallentamento effettivo è dentro SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Non fa nulla per 1 ms per elemento per emulare codice estremamente lento
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
  max-height: 300px;
  overflow: auto;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

Questa ottimizzazione richiede che `SlowList` sia avvolto in [`memo`.](/reference/react/memo) Questo perché ogni volta che `text` cambia, React deve poter ri-renderizzare rapidamente il componente genitore. Durante quella ri-renderizzazione, `deferredText` ha ancora il valore precedente, quindi `SlowList` può saltare la ri-renderizzazione (le sue props non sono cambiate). Senza [`memo`,](/reference/react/memo) dovrebbe ri-renderizzarsi comunque, vanificando lo scopo dell'ottimizzazione.

</Pitfall>

<DeepDive>

#### In che modo differire un valore è diverso da debouncing e throttling? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Ci sono due tecniche di ottimizzazione comuni che potresti aver usato prima in questo scenario:

- *Debouncing* significa che aspetteresti che l'utente smetta di digitare (per esempio per un secondo) prima di aggiornare l'elenco.
- *Throttling* significa che aggiorneresti l'elenco ogni tanto (per esempio al massimo una volta al secondo).

Se queste tecniche sono utili in alcuni casi, `useDeferredValue` è più adatto a ottimizzare la renderizzazione perché è profondamente integrato con React e si adatta al dispositivo dell'utente.

A differenza di debouncing o throttling, non richiede di scegliere un ritardo fisso. Se il dispositivo dell'utente è veloce (per esempio un laptop potente), la ri-renderizzazione differita avverrebbe quasi subito e non sarebbe percettibile. Se il dispositivo dell'utente è lento, l'elenco resterà "indietro" rispetto all'input in proporzione a quanto è lento il dispositivo.

Inoltre, a differenza di debouncing o throttling, le ri-renderizzazioni differite fatte da `useDeferredValue` sono interrompibili per impostazione predefinita. Questo significa che se React è nel mezzo della ri-renderizzazione di un elenco grande, ma l'utente preme un altro tasto, React abbandonerà quella ri-renderizzazione, gestirà la pressione di tasto, e poi ricomincerà a renderizzare in background. Al contrario, debouncing e throttling producono comunque un'esperienza a scatti perché sono *bloccanti:* posticipano solo il momento in cui la renderizzazione blocca la pressione di tasto.

Se il lavoro che stai ottimizzando non avviene durante la renderizzazione, debouncing e throttling restano utili. Per esempio, possono farti effettuare meno richieste di rete. Puoi anche usare queste tecniche insieme.

</DeepDive>
