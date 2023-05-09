---
title: Renderizzare Liste
---

<Intro>

Spesso vorrai visualizzare più componenti simili da una collezione di dati. Puoi usare i [metodi degli array di JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) per manipolare un array di dati. In questa pagina, userai [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) e [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) con React per filtrare e trasformare il tuo array di dati in un array di componenti.


</Intro>

<YouWillLearn>

* Come renderizzare componenti da un array usando `map()` di JavaScript
* Come renderizzare solo componenti specifici usando `filter()` di JavaScript
* Quando e perché usare le React keys

</YouWillLearn>

## Renderizzare dati da un array {/*rendering-data-from-arrays*/}

Immagina di avere una lista di contenuti.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

L'unica differenza tra questi elementi della lista è il loro contenuto, i loro dati. Avrai spesso bisogno di mostrare diverse istanze dello stesso componente usando dati diversi quando costruisci interfacce: dalle liste di commenti alle gallerie di immagini del profilo. In queste situazioni, puoi memorizzare quei dati in oggetti e array JavaScript e usare metodi come [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) e [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) per renderizzare liste di componenti da essi.

Qui un breve esempio di come fenerare una lista di elementi da un array:

1. **Sposta** i dati in un array:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. **Mappa** i membri di `people` in un array di nodi JSX, `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Ritorna** `listItems` dal tuo componenta all'interno di `<ul>`:

```js
return <ul>{listItems}</ul>;
```

Qui puoi vedere il risultato:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Nota che il sandbox sopra visualizza un errore di console:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Imparerai a risolvere questo errore più avanti in questa pagina. Prima di arrivare a quello, aggiungiamo un po' di struttura ai tuoi dati.

## Filtrare array di elementi {/*filtering-arrays-of-items*/}

Questi dati possono essere strutturati ancora di più.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

Diciamo che vuoi ottenere un modo per mostrare solo le persone il cui professione è `'chemist'`. Puoi usare il metodo `filter()` di JavaScript per ritornare solo quelle persone. Questo metodo prende un array di elementi, li passa attraverso un "test" (una funzione che ritorna `true` o `false`), e ritorna un nuovo array solo con gli elementi che hanno passato il test (ritornato `true`).

Vuoi solamente gli elementi dove `profession` è uguale a`'chemist'`. La funzione "test" per questo scopo è `(person) => person.profession === 'chemist'`. Ecco come mettere insieme il tutto:

1. **Crea** un nuovo array di sole persone 'chemist', `chemists`, chiamando `filter()` su `people` filtrando per `person.profession === 'chemist'`:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. Adesso **mappa** `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       known for {person.accomplishment}
     </p>
  </li>
);
```

3. Infine, **ritorna** `listItems` dal tuo componente:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Le arrow functions ritornano implicitamente l'espressione che segue `=>`, quindi non hai bisogno di una dichiarazione `return`:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Implicit return!
);
```

Tuttavia **devi** scrivere `return` esplicitamente se il tuo `=>` è seguito da una `{` parentesi graffa!

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

Le arrow functions che contengono `=> {` sono dette avere un ["block body".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) Ti permettono di scrivere più di una singola linea di codice, ma **devi** scrivere tu stesso una dichiarazione `return`. Se la dimentichi, non viene ritornato nulla!

</Pitfall>

## Manetenere liste di elementi in ordine con `key` {/*keeping-list-items-in-order-with-key*/}

Avrai notato che tutte le sandbox sopra mostrano un errore nella console:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Devi assegnare ad ogni elemento dell'array una `key` -- una stringa o un numero che lo identifica univocamente tra gli altri elementi di quell'array:

```js
<li key={person.id}>...</li>
```

<Note>

Gli elementi JSX direttamente all'interno di un `map()` hanno sempre bisogno di una `key`!

</Note>

Le keys dicono a React a quale elemento dell'array corrisponde ogni componente, così che possa associarli in seguito. Questo diventa importante se gli elementi dell'array possono muoversi (ad esempio a causa di un ordinamento), essere inseriti o eliminati. Una `key` ben scelta aiuta React a capire cosa è successo esattamente, e a fare gli aggiornamenti corretti al DOM tree.

Piuttosto che generare le keys al volo, dovresti includerle nei tuoi dati:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Usato in JSX come key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Usato in JSX come key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Usato in JSX come key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Usato in JSX come key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Usato in JSX come key
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Visualizzare vari nodi DOM per ogni elemento della lista {/*displaying-several-dom-nodes-for-each-list-item*/}

Cosa farai se ogni elemento della lista deve renderizzare non uno, ma diversi nodi DOM?

La breve sintassi [`<>...</>` Fragment](/reference/react/Fragment) non ti permette di passare una `key`, quindi devi o raggrupparli in un singolo `<div>`, o usare la sintassi leggermente più lunga e [più esplicita `<Fragment>`:](/reference/react/Fragment#rendering-a-list-of-fragments)


```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

I Fragment scompaiono dal DOM, quindi questo produrrà una lista piatta di `<h1>`, `<p>`, `<h1>`, `<p>`, e così via.

</DeepDive>

### Da dove prendere la `key` {/*where-to-get-your-key*/}

Diverse fonti di dati forniscono diverse fonti di keys:


* **Dati provenienti da un database:** Se i tuoi dati provengono da un database, puoi usare le chiavi / ID del database, che sono uniche per natura.
* **Dati generati localmente:** Se i tuoi dati sono generati e mantenuti localmente (ad esempio note in un'app per prendere appunti), usa un contatore crescente, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) o un pacchetto come [`uuid`](https://www.npmjs.com/package/uuid) quando crei gli elementi.

### Regole delle key {/*rules-of-keys*/}

* **Le key devono essere uniche tra i loro simili.** Tuttavia, è possibile utilizzare le stesse key per i nodi JSX in array _diversi_.
* **Le key non devono cambiare** o questo ne annulla lo scopo! Non generarle durante il rendering.

### Perchè React ha bisogno delle key? {/*why-does-react-need-keys*/}

Immagina se i file sul tuo desktop non avessero nomi. Al contrario, ti riferiresti a loro in base al loro ordine: il primo file, il secondo file e così via. Potresti abituarti, ma una volta eliminato un file, sarebbe confuso. Il secondo file diventerebbe il primo file, il terzo file sarebbe il secondo file e così via. 

I nomi dei file in una cartella e le key JSX in un array servono a uno scopo simile. Ci consentono di identificare univocamente un elemento tra i suoi simili. Una key ben scelta fornisce più informazioni rispetto alla posizione all'interno dell'array. Anche se la _posizione_ cambia a causa del riordinamento, la `key` consente a React di identificare l'elemento per tutta la sua durata.

<Pitfall>

Potresti essere tentato di usare l'indice di un elemento nell'array come sua `key`. In realtà, è quello che React userà se non specifici una `key` affatto. Ma l'ordine in cui renderizzi gli elementi cambierà nel tempo se un elemento viene inserito, eliminato o se l'array viene riordinato. L'indice come chiave spesso porta a bug impercettibili e confusi.

Similmente, non generare le key al volo, ad esempio con `key={Math.random()}`. Questo farà sì che le chiavi non corrispondano mai tra i render, portando a tutti i tuoi componenti e DOM che vengono ricreati ogni volta. Non solo questo è lento, ma perderà anche qualsiasi input dell'utente all'interno degli elementi della lista. Invece, usa un ID stabile basato sui dati.

Nota che il tuo componente non ricevere `key` come prop. Viene utilizzato solo come suggerimento da React stesso. Se il tuo componente ha bisogno di un ID, devi passarlo come prop separato: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

In questa pagina hai imparato:

* Come muovere i dati fuori dai componenti e in strutture dati come array e oggetti.
* Come generare una lista coomponenti simili con `map()` di JavaScript.
* Come creare array di elementi filtrati con `filter()` di JavaScript.
* Il perchè e il come impostare `key` su ogni componente in una collezione in modo che React possa tener traccia di ognuno di essi anche se la loro posizione o i dati cambiano.

</Recap>



<Challenges>

#### Dividere una lista in due {/*splitting-a-list-in-two*/}

Questo esempio mostra una lista di tutte le persone.

Cambialo in modo da mostrare due liste separate una dopo l'altra: **Chemists** e **Everyone Else.**. Come in precedenza, puoi determinare se una persona è un chimico controllando se `person.profession === 'chemist'`.


<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Potresti usare `filter()` due volte per creare due array separati, e poi `map` su entrambi:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

In questa soluzione, il `map` è inserito direttamente nei tag `<ul>` genitori, ma potresti anche introdurre delle variabili se lo trovi più leggibile.


Come puoi vedere, questa soluzione è un po' ripetitiva. Puoi andare oltre e estrarre le parti ripetitive in un componente `<ListSection>`:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Un lettore molto attento potrebbe notare che con due chiamate `filter`, controlliamo la professione di ogni persona due volte. Controllare una proprietà è molto veloce, quindi in questo esempio va bene. Se la tua logica fosse più costosa di così, potresti sostituire le chiamate `filter` con un ciclo che costruisce manualmente gli array e controlla ogni persona una volta sola.

Inoltre, se `people` non cambia mai, potresti spostare questo codice fuori dal componente. Dal punto di vista di React, l'unica cosa che conta è che alla fine gli dai un array di nodi JSX. Non importa come produci quell'array:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Liste annidate in un componente {/*nested-lists-in-one-component*/}

Crea una lista di ricette! Per ogni ricetta nell'array, visualizza il suo nome come `<h2>` e elenca i suoi ingredienti in un `<ul>`.

<Hint>

Qui abbiamo bisogno di due cicli `map` annidati.

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Potresti procedere così:

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Ogni `recipe` nell'array ha già un campo `id`, quindi è quello che il ciclo esterno usa per il suo `key`. Non c'è nessun ID che potresti usare per ciclare sugli ingredienti. Tuttavia, è ragionevole supporre che lo stesso ingrediente non sarà elencato due volte all'interno della stessa ricetta, quindi il suo nome può servire come `key`. In alternativa, potresti cambiare la struttura dei dati per aggiungere gli ID, o usare l'indice come `key` (con il caveat che non puoi riordinare gli ingredienti in modo sicuro).

</Solution>

#### Estrarre un componente elemento di lista {/*extracting-a-list-item-component*/}

Questo componente `RecipeList` contiene due chiamate `map` annidate. Per semplificarlo, estrai un componente `Recipe` da esso che accetterà le props `id`, `name` e `ingredients`. Dove posizioneresti la `key` esterno e perché?

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Puoi copia-incollare il JSX dal ciclo esterno `map` in un nuovo componente `Recipe` e restituire quel JSX. Quindi puoi cambiare `recipe.name` in `name`, `recipe.id` in `id`, e così via, e passarli come props al `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

In questo caso, `<Recipe {...recipe} key={recipe.id} />` è una shortcut sintattica che dice "passa tutte le proprietà dell'oggetto `recipe` come props al componente `Recipe`". Puoi anche scrivere ogni prop esplicitamente: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Nota che la `key` è specificata sul `<Recipe>` stesso piuttosto che sul `<div>` alla base ritornato da `Recipe`.** Questo perché questa `key` è necessaria direttamente nel contesto dell'array circostante. In precedenza, avevi un array di `<div>` quindi ognuno di loro aveva bisogno di una `key`, ma ora hai un array di `<Recipe>`. In altre parole, quando estrai un componente, non dimenticare di lasciare la `key` fuori dal JSX che copi e incolli.

</Solution>

#### Lista con un separatore {/*list-with-a-separator*/}

Questo esempio renderizza un famoso haiku di Katsushika Hokusai, con ogni riga avvolta in un tag `<p>`. Il tuo compito è inserire un separatore `<hr />` tra ogni paragrafo. La tua struttura risultante dovrebbe assomigliare a questa:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

Un haiku contiene solo tre righe, ma la tua soluzione dovrebbe funzionare con qualsiasi numero di righe. Nota che gli elementi `<hr />` appaiono solo *tra* gli elementi `<p>`, non all'inizio o alla fine!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Questo è un raro caso in cui l'indice come key è accettabile perché le righe di una poesia non si riordineranno mai.)

<Hint>

Dovrai convertire `map` in un loop manuale o utilizzare un frammento.

</Hint>

<Solution>

Puoi scrivere un loop manuale, inserendo `<hr />` e `<p>...</p>` nell'array di output come di seguito:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Se usi l'indice originale come `key` non funziona più perché ogni separatore e paragrafo sono ora nello stesso array. Tuttavia, puoi dare a ciascuno di essi una key distinta usando un suffisso, ad esempio `key={i + '-text'}`.

In alternativa, potresti renderizzare una collection di fragments che contengono `<hr />` e `<p>...</p>`. Tuttavia, la sintassi abbreviata `<>...</>` non supporta il passaggio di key, quindi dovresti scrivere `<Fragment>` esplicitamente:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Ricorda, i fragment (spesso scritti come `<>...</>`) ti consentono di raggruppare i nodi JSX senza aggiungere extra `<div>`!

</Solution>

</Challenges>
