---
title: Aggiornare gli Array nello State
---

<Intro>

In Javascript gli array sono mutabili, ma li dovresti trattare come immutabili quando li memorizzi nello state. Come per gli oggetti, quando vuoi aggiornare un array memorizzato nello state, devi crearne uno nuovo (o fare una copia di quello esistente) e impostare lo state per usare il nuovo array.

</Intro>

<YouWillLearn>

- Come aggiungere, rimuovere o cambiare elementi in un array in React state
- Come aggiornare un oggetto contenuto in un array
- Come copiare gli array in maniera meno ripetitiva con Immer

</YouWillLearn>

## Copiare gli array senza mutazione {/*updating-arrays-without-mutation*/}

In JavaScript, gli array sono solo un altro tipo di oggetto. [Come per gli oggetti](/learn/updating-objects-in-state), **in React state, dovresti trattare gli array come read-only.** Questo significa che non dovresti riassegnare un elemento dentro un array come `arr[0] = 'bird'` e inoltre non dovresti usare metodi che mutano gli array, come `push()` e `pop()`.

Invece, ogni volta che vuoi aggiornare un array, dovresti passare un *nuovo* array alla funzione setting dello state. Per fare ciò, puoi creare un nuovo array dall'array originale nello state richiamando i suoi metodi immutabili come `filter()` e `map()`. Infine puoi impostare il tuo state all'array che viene ritornato.

Qui c'è una tabella dove far riferimento per le più comuni operazioni sugli array. Quando hai a che fare con gli array contenuti in React state, dovrai evitare di utilizzare i metodi nella colonna di sinistra e, invece, preferire i metodi nella colonna di destra:

|             | Evita (muta l'array)                 | Preferisci (ritorna un nuovo array)                                   |
| ----------- | ------------------------------------ | --------------------------------------------------------------------- |
| aggiunta    | `push`, `unshift`                    | `concat`, `[...arr]` sintassi spread ([esempio](#adding-to-an-array)) |
| rimozione   | `pop`, `shift`, `splice`             | `filter`, `slice` ([esempio](#removing-from-an-array))                |
| sostituzione| `splice`, `arr[i] = ...` assegnazione| `map` ([esempio](#replacing-items-in-an-array))                       |
| ordinamento | `reverse`, `sort`                    | prima copia l'array ([esempio](#making-other-changes-to-an-array))    |

In alternativa, puoi [usare Immer](#write-concise-update-logic-with-immer) che ti permette di utilizzare i metodi di entrambe le colonne.

<Pitfall>

Sfortunatamente, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) e [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) sono chiamati in maniera simile ma sono molto differenti:

* `slice` ti permette di copiare un array o parte di esso.
* `splice` **muta** l'array (per inserire o eliminare elementi).

In React, dovresti usare `slice` (non `p`!) molto più spesso perché non vuoi mutare oggetti o array nello state. [Aggiornare gli Oggetti](/learn/updating-objects-in-state) spiega cos'è una mutazione e il perché non è consigliata per lo state.

</Pitfall>

### Aggiungere ad un array {/*adding-to-an-array*/}

`push()` muta l'array, cosa che non vuoi:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Invece, crea un *nuovo* array che contiene gli elementi presenti *e* un nuovo elemento alla fine. Ci sono molteplici modi per raggiungere questo risultato, ma il più semplice è l'uso della sintassi `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Sostituisce lo state 
  [ // con un nuovo array
    ...artists, // che contiene tutti i vecchi elementi
    { id: nextId++, name: name } // e ne aggiunge uno nuovo alla fine
  ]
);
```

Ora funziona correttamente:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

La sintassi array spread ti consente inoltre di prepend (aggiungere) un elemento mettendolo *prima* dell'originale `...artists`:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Mette i vecchi elementi alla fine
]);
```

In questo modo, lo spread fa il lavoro sia di `push()` aggiungendo un elemento alla fine dell'array sia di `unshift()` aggiungendo un elemento all'inizio di un array. Provalo nella sandbox sopra!

### Rimozione da un array {/*removing-from-an-array*/}

Il modo più semplice per rimuovere un elemento dall'array è di *filtrarlo via*. In altre parole, devi creare un nuovo array che non conterrà quell'elemento. Per fare ciò, usa il metodo `filter`, per esempio:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Clicca il bottone "Delete" un paio di volte, e guarda il suo click handler.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Qui, `artists.filter(a => a.id !== artist.id)` significa "crea un array che è composto da questi `artists` i cui ID sono differenti da `artist.id`". In altre parole, ogni bottone "Delete" dell'artista filtrerà via dall'array _quel_ artista e infine ri-renderizzerà l'array ritornato. Tieni presente che `filter` non modifica l'array originale.

### Trasformazione di un array {/*transforming-an-array*/}

Se vuoi cambiare qualche o tutti gli elementi di un array, puoi usare `map()` per creare un **nuovo** array. La funzione che passerai a `map` può decidere cosa fare con ogni elemento, basandosi sui suoi dati o sul suo indice (o entrambi.)

In questo esempio, un array contiene delle coordinate di due cerchi e un quadrato. Quando premi il bottone, sposta in basso solotanto i cerchi di 50 pixel. Fa questo creando un nuovo array di dati usando `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // Nessun cambiamento
        return shape;
      } else {
        // Ritorna un nuovo cerchio in basso di 50px
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Ri-renderizza con il nuovo array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Sostituzione degli elementi in un array {/*replacing-items-in-an-array*/}

È particolarmente comune il voler sostituire uno o più elementi in un array. Le assegnazioni come `arr[0] = 'bird'` mutano l'array originale,  invece dovresti utilizzare `map` anche in questo caso.

Per sostituire un elemento, crea un nuovo array con `map`. Dentro la tua chiamata `map`, riceverai l'indice di un elemento come secondo argomento. Usalo per decidere se ritornare l'elemento originale (il primo argomento) o qualcos'altro:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Incrementa il contatore cliccato
        return c + 1;
      } else {
        // Il resto non è cambiato
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Inserimento in un array {/*inserting-into-an-array*/}

A volte, potresti voler inserire un elemento in una specifica posizione che non è nè all'inizio e nè alla fine. Per fare ciò, puoi usare la sintassi array spread `...` assieme al metodo `slice()`. Il metodo `slice()` ti permette di tagliare una fetta ("slice") dell'array. Per inserire un elemento, crea un array che metta (spreads) la fetta _prima_ del punto di inserzione, poi il nuovo elemento e infine il resto dell'array originale.

In questo esempio, il bottone Insert inserisce sempre all'indice `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Può essere qualsiasi indice
    const nextArtists = [
      // Elementi prima del punto di inserzione:
      ...artists.slice(0, insertAt),
      // Nuovo elemento:
      { id: nextId++, name: name },
      // Elementi dopo il punto di inserzione:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Altri cambiamenti ad un array {/*making-other-changes-to-an-array*/}

Ci sono determinate cose che non puoi fare utilizzando la sintassi spread e i metodi non mutanti come `map()` e `filter()` da soli. Per esempio, potresti voler invertire od ordinare un array. I metodi `reverse()` e `sort()` di Javascript mutano l'array originale, quindi non li puoi utilizzare direttamente.

**Tuttavia, puoi prima copiare l'array e dopo applicare i cambiamenti.**

Per esempio:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Qua, puoi usare la sintassi spread `[...list]` per creare prima una copia dell'array originale. Ora che hai una copia, puoi usare i metodi mutanti come `nextList.reverse()` o `nextList.sort()`, oppure puoi anche assegnare elementi individuali con`nextList[0] = "something"`.

Tuttavia, **anche se copi un array, non puoi mutare gli elementi presenti _dentro_ di esso direttamente.** Questo perchè è una shallow copy (copia poco profonda)--il nuovo array conterrà gli stessi elementi dell'originale. Dunque, se modifichi un oggetto dentro un array copiato, stai mutando lo state esistente. Per esempio, codice come questo è un problema.

```js
const nextList = [...list];
nextList[0].seen = true; //Problema: muta list[0]
setList(nextList);
```

Sebbene `nextList` e `list` siano due array differenti, **`nextList[0]` e `list[0]` puntano allo stesso oggetto.** Dunque, cambiando `nextList[0].seen`, stai anche cambiando `list[0].seen`. Questa è una mutazione dello state, che dovresti evitare! Puoi risolvere questo problema in maniera simile come [aggiornare oggetti Javascript annidati](/learn/updating-objects-in-state#updating-a-nested-object)-- copiando individualmente gli elementi che vuoi cambiare invece di mutarli. Ecco come.

## Aggiornare oggetti dentro agli array {/*updating-objects-inside-arrays*/}

Gli oggetti non sono _veramente_ collocati "dentro" agli array. Dal codice potrebbero sembrare "dentro", ma ogni oggetto in un array è un valore separato, al quale l'aray punta. Ecco perché devi fare attenzione quando cambi dei campi annidati come `list[0]`. Una lista di artwork di un'altra persona potrebbe puntare allo stesso elemento dell'array!

**Quando aggiorni uno state annidato, hai bisogno di creare copie dal punto in cui vuoi aggiornarlo, fino al livello superiore.** Vediamo come funziona.

In questo esempio, due liste di artwork separate hanno lo stesso state iniziale. Dovrebbero essere isolate, ma a causa della mutazione, il loro state è accidentalmente condiviso, e spuntando una casella in una lista, viene impattata anche l'altra lista:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Il problema è nel codice:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```
Sebbene lo stesso array `myNextList` sia nuovo, gli *elementi stessi* sono quelli dell'array originale `myList`. Quindi cambiare `artwork.seen` cambia l'*originale* elemento artwork. Quell'elemento artwork è presente anche in`yourList`, il quale causa il bug. I bugs come questo posso essere difficili da notare, ma fortunatamente scompaiono se eviti di mutare lo state.

**Puoi usare `map` per sostituire un vecchio elemento con la sua versione aggiornata senza mutazioni**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Crea un *nuovo* oggetto con gli aggiornamenti
    return { ...artwork, seen: nextSeen };
  } else {
    // Nessun aggiornamento
    return artwork;
  }
}));
```

Qua, `...` è la sintassi dello spread dell'oggetto usata per [creare una copia dell'oggetto.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

Con questo approccio, nessuno degli state esistenti viene mutat, e il bug è risolto:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Crea un *nuovo* oggetto con i cambi
        return { ...artwork, seen: nextSeen };
      } else {
        // Nessun cambio
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Crea un *nuovo* oggetto con i cambi
        return { ...artwork, seen: nextSeen };
      } else {
        // Nessun cambio
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

In generale, **dovresti mutare solamente gli oggetti che hai appena creato.** Se stessi inserendo un *nuovo* artwork, avresti potuto mutarlo, ma se stai avendo a che fare con qualcosa che è già presente nello state, hai bisogno di farne una copia.

### Scrivi logica di aggiornamento coincisa con Immer {/*write-concise-update-logic-with-immer*/}

Aggiornare array annidati senza mutazione può essere un tantino ripetitivo. [Come per gli oggetti](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Generalmente, non dovresti aver bisogno di aggiornare lo state per più di un paio di livelli di profondità. Se i tuoi oggetti dello state sono molto profondi, potresti volerli [strutturare in maniera differente](/learn/choosing-the-state-structure#avoid-deeply-nested-state) affinché siano piatti.
- Se non vuoi che cambiare la struttura dello state, potresti preferire usare [Immer](https://github.com/immerjs/use-immer), che ti permette di scrivere in modo conveniente ma con sintassi mutevole e generando le copie per te.

Questo è l'esempio dell'Art Bucket List riscritto con Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Nota come con Immer, **le mutazioni come `artwork.seen = nextSeen` ora vadano bene:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```
Questo è perché non stai mutando lo state _originale_, ma stai mutando un oggetto speciale `draft` fornito da Immer. Analogamente, puoi applicare metodi di mutazione come `push()` e `pop()` al contenuto di `draft`.

Dietro le quinte, Immer costruisce sempre il prossimo state da zero in accordo con i cambiamenti che hai applicato a `draft`. Questo mantiene i tuoi event handler molto coincisi senza mai mutare lo state.

<Recap>

- Puoi mettere gli array nello state, ma non puoi cambiarli.
- Invece di mutare un array, crea una *nuova* versione di esso e aggiorna lo state.
- Puoi usare la sintassi array spread `[...arr, newItem]` per creare array con nuovi elementi.
- Puoi usare `filter()` e `map()` per creare nuovi array con elementi filtrati o transformati.
- Puoi usare Immer per mantenere il tuo codice coinciso.

</Recap>



<Challenges>

#### Aggiorna un elemento nello shopping cart {/*update-an-item-in-the-shopping-cart*/}

Compila `handleIncreaseClick` così che premendo "+" si increamenti il numero corrispondente:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Puoi usare la funzione `map` per creare un nuovo array e infine utilizzare la sintassi oggetto spread `...` per creare una copia dell'oggetto aggiornato per il nuovo array:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Rimuovi un elemento dallo shopping cart {/*remove-an-item-from-the-shopping-cart*/}

Questo shopping cart ha un bottone "+" che funziona, ma il bottone "–" non fa niente. Hai bisogno di aggiungergli un event handler così che premendolo diminuisce il `count` del prodotto corrispondente. Se premi "–" quando il count è ad 1, il prodotto dovrebbe essere automaticamente rimosso dal cart. Assicurati che non mostri mai 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Puoi per primo usare `map` per creare un nuovo array e dopo usare `filter` per rimuovere i prodotti con il `count` a `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Correggi le mutazioni usando metodi non mutanti {/*fix-the-mutations-using-non-mutative-methods*/}

In questo esempio, tutti gli event handler contenuti in `App.js` usano mutazioni. Il risultato è che la modifica e l'eliminazione dei todos non funzionano. Riscrivi `handleAddTodo`, `handleChangeTodo` e `handleDeleteTodo` per usare dei metodi non mutanti:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

In `handleAddTodo`, puoi usare la sintassi array spread. In `handleChangeTodo`, puoi creare un nuovo array con `map`. In `handleDeleteTodo`, puoi creare un nuovo array con `filter`. Ora la lista funziona correttamente:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Correggi le mutazioni usando Immer {/*fix-the-mutations-using-immer*/}

Questo esempio è lo stesso della sfida precedente. Questa volta, correggi le mutazioni usando Immer. Per tua convenienza, `useImmer` è già importato, quindi hai bisogno di cambiare la variabile state `todos` per usarlo.

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

Con Immer, puoi scrivere codice in maniera mutevole, fintanto che vengano mutate solamente le parti di `draft` che Immer ti fornisce. Qui, tutte le mutazioni sono compiute su `draft` così che il codice funzioni:

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Puoi anche mischiare gli approcci mutanti e non mutanti con Immer.

Per esempio, in questa versione `handleAddTodo` è implementato mutando`draft` di Immer, mentre `handleChangeTodo` e `handleDeleteTodo` usano i metodi non mutanti `map` e`filter`:

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Con Immer, puoi scegliere lo stile che ti sembra più naturale in ciascun caso distinto.

</Solution>

</Challenges>
