---
title: 'Manipolare il DOM con i Refs'
---

<Intro>

React aggiorna automaticamente il [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) per corrispondere al tuo output di rendering, quindi i tuoi componenti non avranno spesso bisogno di manipolarlo. Tuttavia, a volte potresti aver bisogno di accedere agli elementi DOM gestiti da React--per esempio, per mettere a fuoco un nodo, scorrere fino ad esso o misurarne le dimensioni e la posizione. Non c'è un modo integrato per fare queste cose in React, quindi avrai bisogno di un *ref* al nodo DOM.

</Intro>

<YouWillLearn>

- Come accedere a un nodo DOM gestito da React con l'attributo `ref`
- Come l'attributo JSX `ref` si relaziona all'Hook `useRef`
- Come accedere al nodo DOM di un altro componente
- In quali casi è sicuro modificare il DOM gestito da React

</YouWillLearn>

## Ottenere un ref al nodo {/*getting-a-ref-to-the-node*/}

Per accedere a un nodo DOM gestito da React, prima importa l'Hook `useRef`:

```js
import { useRef } from 'react';
```

Quindi, usalo per dichiarare un ref all'interno del tuo componente:

```js
const myRef = useRef(null);
```

Infine, passa il tuo ref come attributo `ref` al tag JSX per il quale vuoi ottenere il nodo DOM:

```js
<div ref={myRef}>
```

L'Hook `useRef` restituisce un oggetto con una singola proprietà chiamata `current`. Inizialmente, `myRef.current` sarà `null`. Quando React crea un nodo DOM per questo `<div>`, React metterà un riferimento a questo nodo in `myRef.current`. Potrai quindi accedere a questo nodo DOM dai tuoi [gestori di eventi](/learn/responding-to-events) e usare le [API del browser](https://developer.mozilla.org/docs/Web/API/Element) integrate definite su di esso.

```js
// Puoi usare qualsiasi API del browser, per esempio:
myRef.current.scrollIntoView();
```

### Esempio: Mettere a fuoco un input di testo {/*example-focusing-a-text-input*/}

In questo esempio, cliccando il pulsante verrà messo a fuoco l'input:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Metti a fuoco l'input
      </button>
    </>
  );
}
```

</Sandpack>

Per implementare questo:

1. Dichiara `inputRef` con l'Hook `useRef`.
2. Passalo come `<input ref={inputRef}>`. Questo dice a React di **mettere il nodo DOM di questo `<input>` in `inputRef.current`.**
3. Nella funzione `handleClick`, leggi il nodo DOM dell'input da `inputRef.current` e chiama [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) su di esso con `inputRef.current.focus()`.
4. Passa il gestore di eventi `handleClick` a `<button>` con `onClick`.

Sebbene la manipolazione del DOM sia il caso d'uso più comune per i ref, l'Hook `useRef` può essere usato per memorizzare altre cose al di fuori di React, come ID di timer. Similmente allo stato, i ref rimangono tra i rendering. I ref sono come variabili di stato che non attivano ri-rendering quando le imposti. Leggi sui ref in [Referenziare Valori con Refs.](/learn/referencing-values-with-refs)

### Esempio: Scorrere fino a un elemento {/*example-scrolling-to-an-element*/}

Puoi avere più di un singolo ref in un componente. In questo esempio, c'è un carosello di tre immagini. Ogni pulsante centra un'immagine chiamando il metodo del browser [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) sul nodo DOM corrispondente:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### Come gestire una lista di refs usando una callback ref {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Negli esempi precedenti, c'è un numero predefinito di ref. Tuttavia, a volte potresti aver bisogno di un ref per ogni elemento della lista, e non sai quanti ne avrai. Qualcosa del genere **non funzionerebbe**:

```js
<ul>
  {items.map((item) => {
    // Non funziona!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Questo perché **gli Hooks devono essere chiamati solo al livello superiore del tuo componente.** Non puoi chiamare `useRef` in un loop, in una condizione o all'interno di una chiamata `map()`.

Un modo possibile per aggirare questo è ottenere un singolo ref al loro elemento genitore, e poi usare metodi di manipolazione del DOM come [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) per "trovare" i singoli nodi figli da esso. Tuttavia, questo è fragile e può rompersi se la struttura del DOM cambia.

Un'altra soluzione è **passare una funzione all'attributo `ref`.** Questo è chiamato una [`ref` callback.](/reference/react-dom/components/common#ref-callback) React chiamerà la tua callback ref con il nodo DOM quando è il momento di impostare il ref, e chiamerà la funzione di pulizia restituita dalla callback quando è il momento di cancellarlo. Questo ti permette di mantenere il tuo array o una [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), e accedere a qualsiasi ref tramite il suo indice o qualche tipo di ID.

Questo esempio mostra come puoi usare questo approccio per scorrere fino a un nodo arbitrario in una lunga lista:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Inizializza la Map al primo utilizzo.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[8])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat.imageUrl} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catCount = 10;
  const catList = new Array(catCount)
  for (let i = 0; i < catCount; i++) {
    let imageUrl = '';
    if (i < 5) {
      imageUrl = "https://placecats.com/neo/320/240";
    } else if (i < 8) {
      imageUrl = "https://placecats.com/millie/320/240";
    } else {
      imageUrl = "https://placecats.com/bella/320/240";
    }
    catList[i] = {
      id: i,
      imageUrl,
    };
  }
  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

In questo esempio, `itemsRef` non contiene un singolo nodo DOM. Invece, contiene una [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) da ID elemento a un nodo DOM. ([I Refs possono contenere qualsiasi valore!](/learn/referencing-values-with-refs)) La [`ref` callback](/reference/react-dom/components/common#ref-callback) su ogni elemento della lista si occupa di aggiornare la Map:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Aggiungi alla Map
    map.set(cat, node);

    return () => {
      // Rimuovi dalla Map
      map.delete(cat);
    };
  }}
>
```

Questo ti permette di leggere singoli nodi DOM dalla Map successivamente.

<Note>

Quando la Strict Mode è abilitata, le callback ref verranno eseguite due volte in sviluppo.

Leggi di più su [come questo aiuta a trovare bug](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) nelle callback ref.

</Note>

</DeepDive>

## Accedere ai nodi DOM di un altro componente {/*accessing-another-components-dom-nodes*/}

<Pitfall>
I refs sono una via di fuga. Manipolare manualmente i nodi DOM di _un altro_ componente può rendere il tuo codice fragile.
</Pitfall>

Puoi passare i refs dal componente genitore ai componenti figli [proprio come qualsiasi altra prop](/learn/passing-props-to-a-component).

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

Nell'esempio sopra, un ref viene creato nel componente genitore, `MyForm`, e viene passato al componente figlio, `MyInput`. `MyInput` poi passa il ref a `<input>`. Poiché `<input>` è un [componente integrato](/reference/react-dom/components/common) React imposta la proprietà `.current` del ref all'elemento DOM `<input>`.

L'`inputRef` creato in `MyForm` ora punta all'elemento DOM `<input>` restituito da `MyInput`. Un gestore di clic creato in `MyForm` può accedere a `inputRef` e chiamare `focus()` per impostare il focus su `<input>`.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Metti a fuoco l'input
      </button>
    </>
  );
}
```

</Sandpack>

<DeepDive>

#### Esporre un sottoinsieme dell'API con un handle imperativo {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

Nell'esempio sopra, il ref passato a `MyInput` viene passato all'elemento input DOM originale. Questo permette al componente genitore di chiamare `focus()` su di esso. Tuttavia, questo permette anche al componente genitore di fare qualcos'altro--per esempio, cambiare i suoi stili CSS. In casi non comuni, potresti voler limitare la funzionalità esposta. Puoi farlo con [`useImperativeHandle`](/reference/react/useImperativeHandle):

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Esponi solo focus e nient'altro
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Metti a fuoco l'input</button>
    </>
  );
}
```

</Sandpack>

Qui, `realInputRef` all'interno di `MyInput` contiene il nodo DOM input effettivo. Tuttavia, [`useImperativeHandle`](/reference/react/useImperativeHandle) istruisce React a fornire il tuo oggetto speciale come valore di un ref al componente genitore. Quindi `inputRef.current` all'interno del componente `Form` avrà solo il metodo `focus`. In questo caso, l'"handle" del ref non è il nodo DOM, ma l'oggetto personalizzato che crei all'interno della chiamata [`useImperativeHandle`](/reference/react/useImperativeHandle).

</DeepDive>

## Quando React collega i refs {/*when-react-attaches-the-refs*/}

In React, ogni aggiornamento è diviso in [due fasi](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Durante il **rendering,** React chiama i tuoi componenti per capire cosa dovrebbe essere sullo schermo.
* Durante il **commit,** React applica i cambiamenti al DOM.

In generale, [non vuoi](/learn/referencing-values-with-refs#best-practices-for-refs) accedere ai refs durante il rendering. Questo vale anche per i refs che contengono nodi DOM. Durante il primo rendering, i nodi DOM non sono ancora stati creati, quindi `ref.current` sarà `null`. E durante il rendering degli aggiornamenti, i nodi DOM non sono ancora stati aggiornati. Quindi è troppo presto per leggerli.

React imposta `ref.current` durante il commit. Prima di aggiornare il DOM, React imposta i valori `ref.current` interessati a `null`. Dopo aver aggiornato il DOM, React li imposta immediatamente ai nodi DOM corrispondenti.

**Di solito, accederai ai refs dai gestori di eventi.** Se vuoi fare qualcosa con un ref, ma non c'è un evento particolare per farlo, potresti aver bisogno di un Effect. Discuteremo degli Effects nelle prossime pagine.

<DeepDive>

#### Svuotare gli aggiornamenti di stato in modo sincrono con flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Considera un codice come questo, che aggiunge un nuovo todo e scorre la schermata fino all'ultimo figlio della lista. Nota come, per qualche motivo, scorre sempre al todo che era *appena prima* dell'ultimo aggiunto:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Aggiungi
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

Il problema è con queste due righe:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

In React, [gli aggiornamenti di stato sono messi in coda.](/learn/queueing-a-series-of-state-updates) Di solito, questo è ciò che vuoi. Tuttavia, qui causa un problema perché `setTodos` non aggiorna immediatamente il DOM. Quindi nel momento in cui scorri la lista al suo ultimo elemento, il todo non è ancora stato aggiunto. Ecco perché lo scorrimento è sempre "indietro" di un elemento.

Per risolvere questo problema, puoi forzare React ad aggiornare ("svuotare") il DOM in modo sincrono. Per farlo, importa `flushSync` da `react-dom` e **avvolgi l'aggiornamento di stato** in una chiamata `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Questo istruirà React ad aggiornare il DOM in modo sincrono subito dopo che il codice avvolto in `flushSync` viene eseguito. Di conseguenza, l'ultimo todo sarà già nel DOM nel momento in cui provi a scorrere fino ad esso:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Aggiungi
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Migliori pratiche per la manipolazione del DOM con i refs {/*best-practices-for-dom-manipulation-with-refs*/}

I refs sono una via di fuga. Dovresti usarli solo quando devi "uscire da React". Esempi comuni di questo includono la gestione del focus, la posizione di scorrimento o la chiamata ad API del browser che React non espone.

Se ti attieni ad azioni non distruttive come il focus e lo scorrimento, non dovresti incontrare problemi. Tuttavia, se provi a **modificare** il DOM manualmente, puoi rischiare di entrare in conflitto con i cambiamenti che React sta facendo.

Per illustrare questo problema, questo esempio include un messaggio di benvenuto e due pulsanti. Il primo pulsante attiva la sua presenza usando il [rendering condizionale](/learn/conditional-rendering) e lo [stato](/learn/state-a-components-memory), come faresti normalmente in React. Il secondo pulsante usa l'[API DOM `remove()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) per rimuoverlo forzatamente dal DOM al di fuori del controllo di React.

Prova a premere "Attiva con setState" alcune volte. Il messaggio dovrebbe scomparire e apparire di nuovo. Poi premi "Rimuovi dal DOM". Questo lo rimuoverà forzatamente. Infine, premi "Attiva con setState":

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Attiva con setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Rimuovi dal DOM
      </button>
      {show && <p ref={ref}>Ciao mondo</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

Dopo aver rimosso manualmente l'elemento DOM, provare a usare `setState` per mostrarlo di nuovo porterà a un crash. Questo perché hai cambiato il DOM, e React non sa come continuare a gestirlo correttamente.

**Evita di cambiare i nodi DOM gestiti da React.** Modificare, aggiungere figli a o rimuovere figli da elementi che sono gestiti da React può portare a risultati visivi inconsistenti o crash come sopra.

Tuttavia, questo non significa che non puoi farlo affatto. Richiede cautela. **Puoi modificare in sicurezza parti del DOM che React non ha _alcun motivo_ di aggiornare.** Per esempio, se qualche `<div>` è sempre vuoto nel JSX, React non avrà un motivo per toccare la sua lista di figli. Pertanto, è sicuro aggiungere o rimuovere elementi manualmente lì.

<Recap>

- I refs sono un concetto generico, ma più spesso li userai per contenere elementi DOM.
- Istruisci React a mettere un nodo DOM in `myRef.current` passando `<div ref={myRef}>`.
- Di solito, userai i refs per azioni non distruttive come il focus, lo scorrimento o la misurazione degli elementi DOM.
- Un componente non espone i suoi nodi DOM per default. Puoi scegliere di esporre un nodo DOM usando la prop `ref`.
- Evita di cambiare i nodi DOM gestiti da React.
- Se modifichi i nodi DOM gestiti da React, modifica le parti che React non ha motivo di aggiornare.

</Recap>



<Challenges>

#### Avviare e mettere in pausa il video {/*play-and-pause-the-video*/}

In questo esempio, il pulsante attiva una variabile di stato per passare tra uno stato di riproduzione e uno stato di pausa. Tuttavia, per effettivamente avviare o mettere in pausa il video, attivare lo stato non è sufficiente. Devi anche chiamare [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) sull'elemento DOM per il `<video>`. Aggiungi un ref ad esso e fai funzionare il pulsante.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pausa' : 'Avvia'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Per una sfida extra, mantieni il pulsante "Avvia" sincronizzato con il fatto che il video stia riproducendo o meno anche se l'utente fa clic destro sul video e lo riproduce usando i controlli media integrati del browser. Potresti voler ascoltare `onPlay` e `onPause` sul video per farlo.

<Solution>

Dichiara un ref e mettilo sull'elemento `<video>`. Poi chiama `ref.current.play()` e `ref.current.pause()` nel gestore di eventi a seconda del prossimo stato.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pausa' : 'Avvia'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Per gestire i controlli integrati del browser, puoi aggiungere i gestori `onPlay` e `onPause` all'elemento `<video>` e chiamare `setIsPlaying` da essi. In questo modo, se l'utente riproduce il video usando i controlli del browser, lo stato si adatterà di conseguenza.

</Solution>

#### Mettere a fuoco il campo di ricerca {/*focus-the-search-field*/}

Fai in modo che cliccando il pulsante "Cerca" metta a fuoco il campo.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Cerca</button>
      </nav>
      <input
        placeholder="Stai cercando qualcosa?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Aggiungi un ref all'input e chiama `focus()` sul nodo DOM per metterlo a fuoco:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Cerca
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Stai cercando qualcosa?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Scorrere un carosello di immagini {/*scrolling-an-image-carousel*/}

Questo carosello di immagini ha un pulsante "Successivo" che cambia l'immagine attiva. Fai in modo che la galleria scorra orizzontalmente all'immagine attiva al clic. Vorrai chiamare [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) sul nodo DOM dell'immagine attiva:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Non hai bisogno di avere un ref per ogni immagine per questo esercizio. Dovrebbe essere sufficiente avere un ref all'immagine attualmente attiva, o alla lista stessa. Usa `flushSync` per assicurarti che il DOM sia aggiornato *prima* di scorrere.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Successivo
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Gatto #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

Puoi dichiarare un `selectedRef`, e poi passarlo condizionalmente solo all'immagine corrente:

```js
<li ref={index === i ? selectedRef : null}>
```

Quando `index === i`, il che significa che l'immagine è quella selezionata, il `<li>` riceverà il `selectedRef`. React si assicurerà che `selectedRef.current` punti sempre al nodo DOM corretto.

Nota che la chiamata `flushSync` è necessaria per forzare React ad aggiornare il DOM prima dello scorrimento. Altrimenti, `selectedRef.current` punterebbe sempre all'elemento precedentemente selezionato.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          Successivo
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Gatto #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Mettere a fuoco il campo di ricerca con componenti separati {/*focus-the-search-field-with-separate-components*/}

Fai in modo che cliccando il pulsante "Cerca" metta a fuoco il campo. Nota che ogni componente è definito in un file separato e non dovrebbe essere spostato da esso. Come li colleghi insieme?

<Hint>

Avrai bisogno di passare `ref` come una prop per scegliere di esporre un nodo DOM dal tuo componente come `SearchInput`.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Cerca
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Stai cercando qualcosa?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Dovrai aggiungere una prop `onClick` a `SearchButton`, e far sì che `SearchButton` la passi al `<button>` del browser. Passerai anche un ref a `<SearchInput>`, che lo inoltrerà al vero `<input>` e lo popolerà. Infine, nel gestore del clic, chiamerai `focus` sul nodo DOM memorizzato all'interno di quel ref.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Cerca
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Stai cercando qualcosa?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
