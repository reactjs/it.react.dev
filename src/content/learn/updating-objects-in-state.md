---
title: Aggiornare gli Oggetti nello State
---

<Intro>

Lo State può contenere qualsiasi tipo di valore JavaScript, inclusi gli oggetti. Tuttavia, non dovresti modificare direttamente gli oggetti contenuti nello State. Quando vuoi aggiornare un oggetto, dovresti invece crearne uno nuovo (o copiare quello esistente) e, infine, impostare la copia nello state.

</Intro>

<YouWillLearn>

- Come aggiornare correttamente un oggetto nello state di React
- Come aggiornare un oggetto nidificato senza mutarlo
- Cos'è l'immutabilità, e come non violarla
- Come rendere la copia di oggetti meno ripetitiva con Immer

</YouWillLearn>

## Cos'è una mutazione? {/*whats-a-mutation*/}

Nello state, puoi memorizzare qualsiasi tipo di valore JavaScript.

```js
const [x, setX] = useState(0);
```

Fino a ora, hai lavorato con numeri, stringhe, e booleani. Questi tipi di valori JavaScript sono "immutabili", cioè non modificabili o "di sola lettura". Puoi triggerare una ri-renderizzazione per _sostituire_ un valore:

```js
setX(5);
```

Lo state `x` è cambiato da `0` a `5`, ma il _numero `0` in sé_ non è cambiato. Non è possibile apportare modifiche ai valori primitivi incorporati come numeri, stringhe e booleani in JavaScript.

Considera ora un oggetto nello state:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Tecnicamente, è possibile modificare il contenuto dell'_oggetto in sé_. **Questa è detta mutazione:**

```js
position.x = 5;
```

Tuttavia, nonostante gli oggetti nello state di React siano tecnicamente mutabili, dovresti trattarli **come se** fossero immutabili, come numeri, booleani e stringhe. Invece di mutarli, dovresti sempre sostituirli.

## Tratta lo state come se fosse di sola lettura {/*treat-state-as-read-only*/}

In altre parole, dovresti **trattare qualsiasi oggetto JavaScript che metti nello state come se fosse di sola lettura.**

Questo esempio conserva un oggetto nello state per rappresentare la posizione attuale del puntatore. Il punto rosso dovrebbe muoversi quando tocchi o muovi il cursore sull'area di anteprima. Tuttavia, il punto rimane nella posizione iniziale:

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Il problema è in questa parte di codice.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Questo codice modifica l'oggetto assegnato a `position` dalla [renderizzazione precedente.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) Ma senza utilizzare la funzione d'impostazione dello state, React non ha idea che l'oggetto sia cambiato. Quindi, React non fa nulla in risposta. È come cercare di cambiare l'ordine dopo aver già mangiato il pasto. Sebbene mutare lo state possa funzionare in alcuni casi, non lo consigliamo. Dovresti trattare il valore dello state a cui hai accesso in una renderizzazione come se fosse di sola lettura.

Per [triggerare una ri-renderizzazione](/learn/state-as-a-snapshot#setting-state-triggers-renders) in questo caso, **crea un *nuovo* oggetto e passalo alla funzione d'impostazione dello state:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

Con `setPosition`, stai dicendo a React:

* Sostituisci `position` con questo nuovo oggetto
* E renderizza nuovamente questo componente

Nota come il punto rosso ora segue il tuo puntatore quando tocchi o muovi il mouse sopra l'area di anteprima:

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Va bene mutare localmente {/*local-mutation-is-fine*/}

Codice come questo è problematico perché modifica un oggetto *esistente* nello state:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Tuttavia codice come questo è **assolutamente valido** perché stai mutando un oggetto che hai *appena creato*:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

Difatti, equivale del tutto a scrivere questo:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutare è un problema solo quando modifichi oggetti *esistenti* che sono già nello state. Mutare un oggetto che hai appena creato va bene perché *nessun altro codice lo utilizza ancora.* Modificarlo non impatterà accidentalmente qualcosa che dipende da esso. Questa si definisce come "mutazione locale". Puoi persino mutare localmente [durante la renderizzazione.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Molto comodo e perfettamente valido!

</DeepDive>  

## Copiare gli oggetti con la sintassi di spread {/*copying-objects-with-the-spread-syntax*/}

Nell'esempio precedente, l'oggetto `position` è creato sempre da zero a partire dalla posizione del puntatore attuale. Tuttavia, spesso vorrai includere dati *esistenti* nel nuovo oggetto che stai creando. Ad esempio, potresti voler aggiornare *solo un* campo in un form, ma mantenere i valori precedenti per tutti gli altri campi.

Questi input non funzionano perché gli handler degli `onChange` mutano lo state:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Ad esempio, questa riga muta lo state di una renderizzazione precedente:

```js
person.firstName = e.target.value;
```

Il modo affidabile per ottenere il comportamento voluto è di creare un oggetto nuovo e passarlo a `setPerson`. Qui però, dovresti anche **copiare i dati esistenti in esso** perché solo uno dei campi è cambiato:

```js
setPerson({
  firstName: e.target.value, // Nuovo valore dall'input
  lastName: person.lastName,
  email: person.email
});
```

Puoi usare la sintassi [spread degli oggetti](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) `...` in modo da non dover copiare ogni singola proprietà.

```js
setPerson({
  ...person, // Copia i campi vecchi
  firstName: e.target.value // Ma sovrascrivi questo
});
```

Ora il form funziona!

Nota come non hai dichiarato una variabile state separata per ciascun input. Per i form grandi, conservare tutti i dati raggruppati in un oggetto è molto comodo, purché venga aggiornato correttamente!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Nota che la sintassi di spread `...` è "superficiale", cioè copia solo il primo livello di profondità. Questo la rende veloce, ma significa anche che se vuoi aggiornare una proprietà nidificata, dovrai usarla più volte.

<DeepDive>

#### Usare un singolo event handler per più campi {/*using-a-single-event-handler-for-multiple-fields*/}

Puoi anche usare le parentesi `[` e `]` dentro alla definizione dell'oggetto per specificare una proprietà con nome dinamico. Ecco lo stesso esempio, ma con un solo event handler invece di tre:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Qui, `e.target.name` fa riferimento alla proprietà `name` data all'elemento DOM `<input>`.

</DeepDive>

## Aggiornare un oggetto nidificato {/*updating-a-nested-object*/}

Considera una struttura di oggetti nidificati come questa:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Se vuoi aggiornare `person.artwork.city`, è chiaro come farlo con una mutazione:

```js
person.artwork.city = 'New Delhi';
```

Ma in React, trattiamo lo state come immutabile! Per modificare `city`, dovresti prima produrre il nuovo oggetto `artwork` (pre-popolato con i dati di quello precedente), e poi produrre il nuovo oggetto `person` che punta al nuovo `artwork`:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

O, scritto come una singola chiamata alla funzione:

```js
setPerson({
  ...person, // Copia gli altri campi
  artwork: { // ma sostituisci artwork
    ...person.artwork, // con lo stesso
    city: 'New Delhi' // ma in New Delhi!
  }
});
```

Questo diventa un po' verboso, ma funziona bene per molti casi:

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

<DeepDive>

#### Gli oggetti non sono realmente nidificati {/*objects-are-not-really-nested*/}

Un oggetto come questo appare "nidificato" nel codice:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Tuttavia, la "nidificazione" è una modo impreciso di pensare al comportamento degli oggetti. Quando il codice viene eseguito, non esiste una cosa come un oggetto "nidificato". Sono in realtà due oggetti differenti:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

L'oggetto `obj1` non è "dentro" `obj2`. Ad esempio, anche `obj3` potrebbe "puntare" a `obj1`:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

Se dovessi mutare `obj3.artwork.city`, questo impatterebbe sia `obj2.artwork.city` che `obj1.city`. Questo perché `obj3.artwork`, `obj2.artwork` e `obj1` sono lo stesso oggetto. Questo è difficile da capire quando pensi agli oggetti come "nidificati". Invece, sono oggetti separati che si "puntano" a vicenda tramite le proprietà.

</DeepDive>  

### Scrivi logica di aggiornamento concisa con Immer {/*write-concise-update-logic-with-immer*/}

Se il tuo state è profondamente nidificato, potresti voler considerare di [appiattirlo.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) Ma, se non vuoi modificare la struttura dello state, potresti preferire una scorciatoia rispetto agli spread nidificati. [Immer](https://github.com/immerjs/use-immer) è una popolare libreria che ti consente di scrivere utilizzando la comoda ma mutevole sintassi e si prende cura di produrre le copie per te. Con Immer, il codice che scrivi appare come se stessi "violando le regole" e mutando un oggetto:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Ma a differenza di una mutazione normale, non sovrascrive lo state precedente!

<DeepDive>

#### Come funziona Immer? {/*how-does-immer-work*/}

La `bozza` fornita da Immer è uno speciale oggetto, chiamato [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), che "registra" cosa fai con esso. Questo è il motivo per cui puoi mutarlo liberamente! Sotto al cofano, Immer capisce quali parti della `bozza` sono state modificate, e produce un oggetto completamente nuovo che contiene le tue modifiche.

</DeepDive>

Per provare Immer:

1. Esegui `npm install use-immer` per aggiungere Immer come dipendenza
2. Poi sostituisci `import { useState } from 'react'` con `import { useImmer } from 'use-immer'`

Ecco l'esempio precedente convertito a Immer:

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

Nota come gli event handler siano molto più concisi. Puoi usare sia `useState` che `useImmer` nello stesso componente quante volte desideri. Immer è un ottimo modo per mantenere gli update handler concisi, specialmente se c'è nidificazione nel tuo state e copiare gli oggetti porta a codice ripetitivo.

<DeepDive>

#### Perché mutare lo state non è consigliato in React? {/*why-is-mutating-state-not-recommended-in-react*/}

Per diversi motivi:

* **Fare debugging:** Se usi `console.log` e non muti lo state, i tuoi log passati non verranno sovrascritti dai cambiamenti allo state più recenti. Così puoi chiaramente vedere come lo state cambia tra le varie renderizzazioni.
* **Ottimizzazioni:** Le comuni [strategie di ottimizzazione](/reference/react/memo) di React si basano sull'evitare lavoro se le props o lo state precedenti sono gli stessi di quelli successivi. Se `prevObj === obj`, si può essere sicuri che nulla sia cambiato al suo interno.
* **Nuove funzionalità:** Le nuove funzionalità di React che stiamo costruendo si basano sul [trattare lo state come un'istantanea.](/learn/state-as-a-snapshot) Se stai mutando versioni passate dello state, questo ti potrebbe impedire di usare le nuove funzionalità.
* **Modifiche dei requisiti:** Alcune funzionalità, come implementare Undo/Redo, mostrare una cronologia dei cambiamenti, o consentire all'utente di resettare un form a dei valori precedenti, sono più semplici da attuare quando nulla viene mutato. Questo perché puoi conservare copie passate dello state in memoria, e riutilizzarle quando è appropriato. Se inizi con un approccio mutabile, funzionalità come queste possono essere difficili da aggiungere in seguito.
* **Implementazione facilitata:** Poiché React non si basa sulle mutazioni, non ha bisogno di fare nulla di speciale con i tuoi oggetti. Non ha bisogno di controllare le loro proprietà, continuamente wrapparle in dei Proxy, o fare altro lavoro all'inizializzazione come molte soluzioni "reattive". Questo è anche il motivo per cui React ti consente d'inserire qualsiasi oggetto nello state, indipendentemente dalla dimensione, senza ulteriori problemi di prestazioni o correttezza.

Nella pratica, spesso puoi "farla franca" con le mutazioni dello state in React, ma consigliamo caldamente di non farlo in modo da poter utilizzare le nuove funzionalità di React sviluppate in base a questo approccio. I futuri contributori e forse persino il te del futuro ne saranno grati!

</DeepDive>

<Recap>

* Tratta tutto lo state in React come immutabile.
* Quando memorizzi oggetti nello state, mutarli non triggera renderizzazioni e modifica lo state nelle "istantanee" delle renderizzazioni precedenti.
* Invece di mutare un oggetto, crea una *nuova* versione di esso, e triggera una re-renderizzazione impostandolo nello state.
* Puoi usare la sintassi di spread degli oggetti `{...obj, something: 'newValue'}` per creare copie di oggetti.
* La sintassi di spread è superficiale: copia solo il primo livello di profondità.
* Per aggiornare un oggetto nidificato, devi creare copie risalendo fino all'oggetto principale.
* Per ridurre la ripetizione del codice quando copi gli oggetti, usa Immer.

</Recap>



<Challenges>

#### Correggi gli aggiornamenti di state sbagliati {/*fix-incorrect-state-updates*/}

Questo form presenta alcuni bug. Clicca il bottone che incrementa il punteggio alcune volte. Nota come non viene incrementato. Poi modifica il nome, e nota come il punteggio improvvisamente "recupera" i tuoi cambiamenti. Infine, modifica il cognome, e nota come il punteggio scompare del tutto.

Il tuo compito è correggere tutti questi bug. Mentre lo fai, cerca di spiegare perché ciascuno di essi si presenta.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Ecco una versione con entrambi i bug corretti:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Il problema di `handlePlusClick` era mutare l'oggetto `player`. Di conseguenza, React non sapeva di dover ri-renderizzare, e non aggiornava il punteggio sullo schermo. Questo è il motivo per cui, quando modificavi il nome, lo state veniva aggiornare, triggerando una ri-renderizzazione che aggiornava _anche_ il punteggio sullo schermo.

Il problema di `handleLastNameChange` era non copiare i campi esistenti di `...player` nel nuovo oggetto. Questo è il motivo per cui il punteggio veniva perso una volta modificato il cognome.

</Solution>

#### Trova e correggi la mutazione {/*find-and-fix-the-mutation*/}

C'è una scatola trascinabile su uno sfondo statico. Puoi modificare il colore della scatola con l'elenco a discesa.

Tuttavia c'è un bug. Se muovi la scatola come prima cosa, e poi cambi il suo colore, lo sfondo (che non dovrebbe muoversi!) "salterà" sulla posizione della scatola. Questo però non dovrebbe accadere: la prop `position` di `Background` è impostata su `initialPosition`, che equivale a `{ x: 0, y: 0 }`. Perché lo sfondo si muove dopo la modifica del colore?

Trova il bug e correggilo.

<Hint>

Se accade qualcosa d'inaspettato, c'è una mutazione. Trova la mutazione in `App.js` e correggila.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Il problema era nella mutazione dentro `handleMove`. Mutava `shape.position`, ma è lo stesso oggetto a cui punta `initialPosition`. Questo è il motivo per cui sia la forma che lo sfondo si muovono. (È una mutazione, quindi la modifica non si riflette sullo schermo finché un aggiornamento non correlato, la modifica del colore, non triggera una ri-renderizzazione.)

La soluzione è rimuovere la mutazione in `handleMove` e usare la sintassi di spread per copiare la forma. Nota che `+=` è una mutazione, quindi hai bisogno di sostituirlo con una normale operazione `+`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Aggiornare un oggetto con Immer {/*update-an-object-with-immer*/}

Questo è lo stesso esempio difettoso della sfida precedente. Questa volta, correggi la mutazione usando Immer. Per tua comodità, `useImmer` è già importato, quindi devi fare in modo che la variabile state `shape` lo usi.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

Questa è la soluzione riscritta con Immer. Nota come gli event handler siano scritti come se attuassero una mutazione, ma il bug non si verifica. Questo perché sotto il cofano, Immer non muta mai gli oggetti preesistenti.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
