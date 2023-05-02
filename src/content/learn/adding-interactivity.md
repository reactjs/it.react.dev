---
title: Aggiungere le Interazioni
---

<Intro>

Alcune cose sullo schermo si aggiornano in risposta all'input dell'utente. Ad esempio, cliccare su una galleria d'immagini modifica l'immagine corrente. In React, i dati che cambiano nel tempo vengono chiamati *state.* Puoi aggiungere lo state a qualsiasi componente e aggiornarlo secondo necessità. In questo capitolo, imparerai a scrivere componenti che gestiscono interazioni, aggiornano il loro state, e visualizzano diversi output nel tempo.

</Intro>

<YouWillLearn isChapter={true}>

* [Come gestire gli eventi originati dall'utente](/learn/responding-to-events)
* [Come far "ricordare" le informazioni ai componenti tramite lo state](/learn/state-a-components-memory)
* [Come React aggiorna la UI in due fasi](/learn/render-and-commit)
* [Perché lo state non si aggiorna subito dopo averlo modificato](/learn/state-as-a-snapshot)
* [Come accodare più aggiornamenti dello state](/learn/queueing-a-series-of-state-updates)
* [Come aggiornare un oggetto nello state](/learn/updating-objects-in-state)
* [Come aggiornare un array nello state](/learn/updating-arrays-in-state)

</YouWillLearn>

## Rispondere agli Eventi {/*responding-to-events*/}

React ti consente di aggiungere degli *event handler* al tuo JSX. Gli event handler sono le tue funzioni personalizzate che vengono chiamate in risposta alle interazioni dell'utente, come il click, il passaggio del mouse, la messa a fuoco degli input del form e così via.

Componenti integrati come `<button>` supportano solo eventi integrati del browser come `onClick`. Tuttavia, è possibile anche creare i propri componenti e dare ai loro event handler dei nomi specifici, contestualizzati all'applicazione.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

Leggi **[Rispondere agli Eventi](/learn/responding-to-events)** per imparare ad aggiungere gli event handler.

</LearnMore>

## State: La Memoria di un Componente {/*state-a-components-memory*/}

Spesso i componenti devono cambiare ciò che c'è sullo schermo in seguito a un'interazione. Scrivere nel form deve aggiornare l'input, cliccare "avanti" su un carosello deve cambiare l'immagine mostrata, cliccare "acquista" inserisce un prodotto nel carrello. I componenti devono "ricordare" le cose: l'attuale valore dell'input, l'attuale immagine, il carrello. In React, questo specifico tipo di memoria è detto *state.*

Puoi aggiungere lo state a un componente con un hook [`useState`](/reference/react/useState). Gli *Hook* sono speciali funzioni che consentono ai componenti di usare le funzionalità di React (lo state è una di queste). L'hook `useState` consente di dichiarare una variabile state. Prende lo state iniziale e restituisce una coppia di valori: lo state attuale e una funzione *state setter* che consente di aggiornarlo.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Ecco come una galleria di immagini usa e aggiorna lo state al click:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Leggi **[State: La Memoria di un Componente](/learn/state-a-components-memory)** per imparare a memorizzare un valore e aggiornarlo in base alle interazioni.

</LearnMore>

## Renderizzazione e Commit {/*render-and-commit*/}

Prima che i tuoi componenti siano visualizzati sullo schermo, devono essere renderizzati da React. Comprendere le fasi di questo processo ti aiuterà a riflettere su come viene eseguito il tuo codice e a spiegarne il comportamento.

Immagina che i tuoi componenti siano cuochi in cucina, che assemblano deliziosi piatti. In questo scenario, React è il cameriere che prende le comande dai clienti e porta loro gli ordini. Questo processo di richiesta e servizio della UI ha tre fasi:

1. **Triggerare** un render (portare la comanda in cucina)
2. **Renderizzare** il componente (preparare l'ordine in cucina)
3. **Committare i cambiamenti** al DOM (portare l'ordine al tavolo)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React come cameriere in un ristorante, che prende le comande dagli utenti e li porta alla cucina dei componenti." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Renderizzazione" alt="Il cuoco Card consegna a React un nuovo componente Card." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React porta la Card al tavolo dell'utente." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Leggi **[Renderizzazione e Commit](/learn/render-and-commit)** per imparare il ciclo di vita di un aggiornamento UI.

</LearnMore>

## Lo State come Istantanea {/*state-as-a-snapshot*/}

A differenza delle normali variabili JavaScript, lo state di React si comporta più come un'istantanea. Impostarlo non modifica la variabile state che già possiedi, ma triggera un re-render. Questo può sorprendere all'inizio!

```js
console.log(count);  // 0
setCount(count + 1); // Richiedi un re-render con 1
console.log(count);  // Ancora 0!
```

Questo comportamento aiuta a evitare bug difficili da individuare. Ecco una piccola app di messaggistica. Prova a indovinare cosa succede se premi "Send" e *poi* selezioni il destinatario Bob. Quale nome apparirà nell'`alert` cinque secondi dopo?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Leggi **[Lo State come Istantanea](/learn/state-as-a-snapshot)** per imparare perché lo state appare "fisso" e inalterabile dentro gli event handler.

</LearnMore>

## Accodare più Aggiornamenti dello State {/*queueing-a-series-of-state-updates*/}

Questo componente è difettoso: cliccare "+3" incrementa lo score soltanto una volta.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[Lo State come Istantanea](/learn/state-as-a-snapshot) spiega a cosa è dovuto questo. Impostare lo state richiede un nuovo re-render, ma non lo modifica nel codice già eseguito. Quindi `score` continua a essere `0` subito dopo aver chiamato `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Puoi risolvere questo problema passando una funzione *updater* quando imposti lo state. Nota come sostituire `setScore(score + 1)` con `setScore(s => s + 1)` aggiusta il bottone "+3". Questo consente di accodare più aggiornamenti dello state.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Leggi **[Accodare più Aggiornamenti dello State](/learn/queueing-a-series-of-state-updates)** per imparare ad accodare una sequenza di aggiornamenti dello state.

</LearnMore>

## Aggiornare gli Oggetti nello State {/*updating-objects-in-state*/}

Lo State può contenere qualsiasi tipo di valore JavaScript, inclusi gli oggetti. Tuttavia, non dovresti modificare direttamente gli oggetti e gli array contenuti nello State. Quando vuoi aggiornare un oggetto o un array, dovresti invece crearne uno nuovo (o copiare quello esistente) e, infine, impostare la copia nello state.

Solitamente, userai la sintassi di spread `...` per copiare gli oggetti e gli array che desideri modificare. Ad esempio, l'aggiornamento di un oggetto nidificato potrebbe apparire così:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Se copiare gli oggetti diventa tedioso, puoi usare una libreria come [Immer](https://github.com/immerjs/use-immer) per ridurre il codice ripetitivo:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

Leggi **[Aggiornare gli Oggetti nello State](/learn/updating-objects-in-state)** per imparare ad aggiornare gli oggetti correttamente.

</LearnMore>

## Aggiornare gli Array nello State {/*updating-arrays-in-state*/}

Gli array sono un altro tipo di oggetti JavaScript mutabili che puoi memorizzare nello state e che dovresti trattare come read-only. Come per gli oggetti, quando vuoi aggiornare un array contenuto nello state, devi crearne uno nuovo (o copiare l'esistente), e infine impostare il nuovo array nello state.

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
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
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

Se copiare gli array diventa tedioso, puoi usare una libreria come [Immer](https://github.com/immerjs/use-immer) per ridurre il codice ripetitivo:

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
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
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
        artworks={list}
        onToggle={handleToggle} />
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

<LearnMore path="/learn/updating-arrays-in-state">

Leggi **[Aggiornare gli Array nello State](/learn/updating-arrays-in-state)** per imparare ad aggiornare gli array correttamente.

</LearnMore>

## Qual è il Prossimo Passo? {/*whats-next*/}

Dirigiti su [Rispondere agli Eventi](/learn/responding-to-events) per iniziare a leggere questo capitolo pagina per pagina!

Oppure, se hai già familiarità con questi argomenti, perché non leggere [Gestire lo State](/learn/managing-state)?
