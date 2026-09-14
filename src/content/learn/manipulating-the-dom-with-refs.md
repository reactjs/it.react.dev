---
title: Manipolare il DOM con i ref
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e potrebbe beneficiare di una revisione umana. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/manipulating-the-dom-with-refs.md).

</Note>

<Intro>

React aggiorna automaticamente il [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) in modo che corrisponda all'output della renderizzazione, quindi i tuoi componenti non dovranno spesso manipolarlo. Tuttavia, a volte potresti aver bisogno di accedere agli elementi DOM gestiti da React — ad esempio, per mettere a fuoco un nodo, scorrere fino a esso o misurarne dimensione e posizione. Non esiste un modo integrato per fare queste cose in React, quindi avrai bisogno di un *ref* al nodo DOM.

</Intro>

<YouWillLearn>

- Come accedere a un nodo DOM gestito da React con l'attributo `ref`
- Come l'attributo JSX `ref` si collega all'Hook `useRef`
- Come accedere al nodo DOM di un altro componente
- In quali casi è sicuro modificare il DOM gestito da React

</YouWillLearn>

## Ottenere un ref al nodo {/*getting-a-ref-to-the-node*/}

Per accedere a un nodo DOM gestito da React, per prima cosa importa l'Hook `useRef`:

```js
import { useRef } from 'react';
```

Poi, usalo per dichiarare un ref all'interno del tuo componente:

```js
const myRef = useRef(null);
```

Infine, passa il ref come attributo `ref` al tag JSX per cui vuoi ottenere il nodo DOM:

```js
<div ref={myRef}>
```

L'Hook `useRef` restituisce un oggetto con una singola proprietà chiamata `current`. Inizialmente, `myRef.current` sarà `null`. Quando React crea un nodo DOM per questo `<div>`, React inserirà un riferimento a questo nodo in `myRef.current`. Puoi quindi accedere a questo nodo DOM dai tuoi [gestori di eventi](/learn/responding-to-events) e usare le [API del browser](https://developer.mozilla.org/docs/Web/API/Element) integrate definite su di esso.

```js
// Puoi usare qualsiasi API del browser, ad esempio:
myRef.current.scrollIntoView();
```

### Esempio: mettere a fuoco un input di testo {/*example-focusing-a-text-input*/}

In questo esempio, cliccare il bottone metterà a fuoco l'input:

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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Per implementarlo:

1. Dichiara `inputRef` con l'Hook `useRef`.
2. Passalo come `<input ref={inputRef}>`. Questo dice a React di **inserire il nodo DOM di questo `<input>` in `inputRef.current`.**
3. Nella funzione `handleClick`, leggi il nodo DOM dell'input da `inputRef.current` e chiama [`focus()`](https://developer.mozilla.org/it/docs/Web/API/HTMLElement/focus) su di esso con `inputRef.current.focus()`.
4. Passa il gestore di eventi `handleClick` a `<button>` con `onClick`.

Sebbene la manipolazione del DOM sia il caso d'uso più comune per i ref, l'Hook `useRef` può essere usato per conservare altre cose fuori da React, come gli ID dei timer. Analogamente allo state, i ref restano tra le renderizzazioni. I ref sono come variabili di state che non avviano ri-renderizzazioni quando li imposti. Leggi sui ref in [Referenziare valori con i ref.](/learn/referencing-values-with-refs)

### Esempio: scorrere fino a un elemento {/*example-scrolling-to-an-element*/}

Puoi avere più di un ref in un componente. In questo esempio, c'è un carosello di tre immagini. Ogni bottone centra un'immagine chiamando il metodo del browser [`scrollIntoView()`](https://developer.mozilla.org/it/docs/Web/API/Element/scrollIntoView) sul nodo DOM corrispondente:

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

#### Come gestire una lista di ref usando un ref callback {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Negli esempi sopra, c'è un numero predefinito di ref. Tuttavia, a volte potresti aver bisogno di un ref per ogni elemento in una lista, e non sai quanti ne avrai. Qualcosa del genere **non funzionerebbe**:

```js
<ul>
  {items.map((item) => {
    // Non funziona!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Questo perché **gli Hooks devono essere chiamati solo al top level del tuo componente.** Non puoi chiamare `useRef` in un ciclo, in una condizione o dentro una chiamata a `map()`.

Una possibile soluzione è ottenere un singolo ref al loro elemento genitore, e poi usare metodi di manipolazione del DOM come [`querySelectorAll`](https://developer.mozilla.org/it/docs/Web/API/Document/querySelectorAll) per "trovare" i singoli nodi figli. Tuttavia, questo è fragile e può rompersi se la struttura del DOM cambia.

Un'altra soluzione è **passare una funzione all'attributo `ref`.** Questo si chiama [`ref` callback.](/reference/react-dom/components/common#ref-callback) React chiamerà il tuo ref callback con il nodo DOM quando è il momento di impostare il ref, e chiamerà la funzione di pulizia restituita dal callback quando è il momento di cancellarlo. Questo ti permette di mantenere il tuo array o una [Map](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Map), e accedere a qualsiasi ref per indice o per qualche tipo di ID.

Questo esempio mostra come puoi usare questo approccio per scorrere fino a un nodo arbitrario in una lista lunga:

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
      // Initialize the Map on first usage.
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

In questo esempio, `itemsRef` non contiene un singolo nodo DOM. Invece, contiene una [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) dall'ID dell'elemento al nodo DOM. ([I ref possono contenere qualsiasi valore!](/learn/referencing-values-with-refs)) Il [`ref` callback](/reference/react-dom/components/common#ref-callback) su ogni elemento della lista si occupa di aggiornare la Map:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Add to the Map
    map.set(cat, node);

    return () => {
      // Remove from the Map
      map.delete(cat);
    };
  }}
>
```

Questo ti permette di leggere singoli nodi DOM dalla Map in seguito.

<Note>

Quando Strict Mode è abilitato, i ref callback verranno eseguiti due volte in sviluppo.

Leggi di più su [come questo aiuta a trovare bug](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) nei callback ref.

</Note>

</DeepDive>

## Accedere ai nodi DOM di un altro componente {/*accessing-another-components-dom-nodes*/}

<Pitfall>
I ref sono un escape hatch. Manipolare manualmente i nodi DOM di _un altro_ componente può fragilizzare il tuo codice.
</Pitfall>

Puoi passare ref dal componente genitore ai componenti figlio [come qualsiasi altra prop](/learn/passing-props-to-a-component).

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

Nell'esempio sopra, un ref viene creato nel componente genitore, `MyForm`, e viene passato al componente figlio, `MyInput`. `MyInput` poi passa il ref a `<input>`. Poiché `<input>` è un [componente integrato](/reference/react-dom/components/common), React imposta la proprietà `.current` del ref sul nodo DOM `<input>`.

L'`inputRef` creato in `MyForm` ora punta al nodo DOM `<input>` restituito da `MyInput`. Un gestore di click creato in `MyForm` può accedere a `inputRef` e chiamare `focus()` per impostare il focus su `<input>`.

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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<DeepDive>

#### Esporre un sottoinsieme dell'API con un handle imperativo {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

Nell'esempio sopra, il ref passato a `MyInput` viene passato all'elemento input DOM originale. Questo permette al componente genitore di chiamare `focus()` su di esso. Tuttavia, questo permette anche al componente genitore di fare qualcos'altro — ad esempio, cambiare i suoi stili CSS. In casi rari, potresti voler limitare la funzionalità esposta. Puoi farlo con [`useImperativeHandle`](/reference/react/useImperativeHandle):

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
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
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

</Sandpack>

Qui, `realInputRef` dentro `MyInput` contiene il nodo DOM input effettivo. Tuttavia, [`useImperativeHandle`](/reference/react/useImperativeHandle) istruisce React a fornire il tuo oggetto speciale come valore di un ref al componente genitore. Quindi `inputRef.current` dentro il componente `Form` avrà solo il metodo `focus`. In questo caso, l'handle del ref non è il nodo DOM, ma l'oggetto personalizzato che crei dentro la chiamata a [`useImperativeHandle`](/reference/react/useImperativeHandle).

</DeepDive>

## Quando React collega i ref {/*when-react-attaches-the-refs*/}

In React, ogni aggiornamento è diviso in [due fasi](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Durante la **renderizzazione,** React richiama i tuoi componenti per capire cosa dovrebbe essere a schermo.
* Durante la **fase di commit,** React applica le modifiche al DOM.

In generale, [non vuoi](/learn/referencing-values-with-refs#best-practices-for-refs) accedere ai ref durante la renderizzazione. Questo vale anche per i ref che contengono nodi DOM. Durante la prima renderizzazione, i nodi DOM non sono ancora stati creati, quindi `ref.current` sarà `null`. E durante la renderizzazione degli aggiornamenti, i nodi DOM non sono ancora stati aggiornati. Quindi è troppo presto per leggerli.

React imposta `ref.current` durante la fase di commit. Prima di aggiornare il DOM, React imposta i valori `ref.current` interessati a `null`. Dopo aver aggiornato il DOM, React li imposta immediatamente sui nodi DOM corrispondenti.

**Di solito, accederai ai ref dai gestori di eventi.** Se vuoi fare qualcosa con un ref, ma non c'è un evento particolare in cui farlo, potresti aver bisogno di un Effetto. Parleremo degli Effetti nelle pagine successive.

<DeepDive>

#### Svuotare gli aggiornamenti di state in modo sincrono con flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Considera codice come questo, che aggiunge un nuovo todo e scorre lo schermo fino all'ultimo figlio della lista. Nota come, per qualche motivo, scorre sempre fino al todo che era *proprio prima* dell'ultimo aggiunto:

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
        Add
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

In React, [gli aggiornamenti di state vengono messi in coda.](/learn/queueing-a-series-of-state-updates) Di solito, è quello che vuoi. Tuttavia, qui causa un problema perché `setTodos` non aggiorna immediatamente il DOM. Quindi quando scorri la lista fino al suo ultimo elemento, il todo non è ancora stato aggiunto. Ecco perché lo scorrimento "rimane indietro" di un elemento.

Per risolvere questo problema, puoi forzare React ad aggiornare ("svuotare") il DOM in modo sincrono. Per farlo, importa `flushSync` da `react-dom` e **avvolgi l'aggiornamento di state** in una chiamata a `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Questo istruirà React ad aggiornare il DOM in modo sincrono subito dopo l'esecuzione del codice avvolto in `flushSync`. Di conseguenza, l'ultimo todo sarà già nel DOM quando provi a scorrere fino a esso:

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
        Add
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

## Best practice per la manipolazione del DOM con i ref {/*best-practices-for-dom-manipulation-with-refs*/}

I ref sono un escape hatch. Dovresti usarli solo quando devi "uscire da React". Esempi comuni includono la gestione del focus, della posizione di scorrimento o la chiamata ad API del browser che React non espone.

Se ti attieni ad azioni non distruttive come mettere a fuoco e scorrere, non dovresti incontrare problemi. Tuttavia, se provi a **modificare** manualmente il DOM, puoi rischiare di entrare in conflitto con le modifiche che React sta facendo.

Per illustrare questo problema, questo esempio include un messaggio di benvenuto e due bottoni. Il primo bottone ne alterna la presenza usando [renderizzazione condizionale](/learn/conditional-rendering) e [state](/learn/state-a-components-memory), come faresti di solito in React. Il secondo bottone usa l'[API DOM `remove()`](https://developer.mozilla.org/it/docs/Web/API/Element/remove) per rimuoverlo forzatamente dal DOM fuori dal controllo di React.

Prova a premere "Toggle with setState" alcune volte. Il messaggio dovrebbe scomparire e riapparire. Poi premi "Remove from the DOM". Questo lo rimuoverà forzatamente. Infine, premi "Toggle with setState":

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
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
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

Dopo aver rimosso manualmente l'elemento DOM, provare a usare `setState` per mostrarlo di nuovo causerà un crash. Questo perché hai cambiato il DOM, e React non sa come continuare a gestirlo correttamente.

**Evita di cambiare nodi DOM gestiti da React.** Modificare, aggiungere figli o rimuovere figli da elementi gestiti da React può portare a risultati visivi inconsistenti o crash come quello sopra.

Tuttavia, questo non significa che non puoi farlo affatto. Richiede cautela. **Puoi modificare in sicurezza parti del DOM che React _non ha motivo_ di aggiornare.** Ad esempio, se un `<div>` è sempre vuoto nel JSX, React non avrà motivo di toccare la sua lista di figli. Pertanto, è sicuro aggiungere o rimuovere manualmente elementi lì.

<Recap>

- I ref sono un concetto generico, ma più spesso li userai per contenere elementi DOM.
- Istruisci React a inserire un nodo DOM in `myRef.current` passando `<div ref={myRef}>`.
- Di solito, userai i ref per azioni non distruttive come mettere a fuoco, scorrere o misurare elementi DOM.
- Un componente non espone i suoi nodi DOM per impostazione predefinita. Puoi scegliere di esporre un nodo DOM usando la prop `ref`.
- Evita di cambiare nodi DOM gestiti da React.
- Se modifichi nodi DOM gestiti da React, modifica parti che React non ha motivo di aggiornare.

</Recap>



<Challenges>

#### Riproduci e metti in pausa il video {/*play-and-pause-the-video*/}

In questo esempio, il bottone alterna una variabile di state per passare tra uno stato di riproduzione e uno di pausa. Tuttavia, per riprodurre o mettere in pausa effettivamente il video, alternare lo state non basta. Devi anche chiamare [`play()`](https://developer.mozilla.org/it/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/it/docs/Web/API/HTMLMediaElement/pause) sull'elemento DOM per `<video>`. Aggiungi un ref ad esso e fai funzionare il bottone.

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
        {isPlaying ? 'Pause' : 'Play'}
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

Per una sfida extra, mantieni il bottone "Play" sincronizzato con il fatto che il video sia in riproduzione anche se l'utente clicca con il tasto destro sul video e lo riproduce usando i controlli multimediali integrati del browser. Potresti voler ascoltare `onPlay` e `onPause` sul video per farlo.

<Solution>

Dichiara un ref e mettilo sull'elemento `<video>`. Poi chiama `ref.current.play()` e `ref.current.pause()` nel gestore di eventi a seconda dello state successivo.

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
        {isPlaying ? 'Pause' : 'Play'}
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

Per gestire i controlli integrati del browser, puoi aggiungere gestori `onPlay` e `onPause` all'elemento `<video>` e chiamare `setIsPlaying` da essi. In questo modo, se l'utente riproduce il video usando i controlli del browser, lo state si adatterà di conseguenza.

</Solution>

#### Mettere a fuoco il campo di ricerca {/*focus-the-search-field*/}

Fai in modo che cliccare il bottone "Search" metta a fuoco il campo.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
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
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
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

Questo carosello di immagini ha un bottone "Next" che cambia l'immagine attiva. Fai scorrere la galleria orizzontalmente fino all'immagine attiva al click. Vorrai chiamare [`scrollIntoView()`](https://developer.mozilla.org/it/docs/Web/API/Element/scrollIntoView) sul nodo DOM dell'immagine attiva:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Non hai bisogno di un ref per ogni immagine per questo esercizio. Dovrebbe bastare avere un ref per l'immagine attualmente attiva, o per la lista stessa. Usa `flushSync` per assicurarti che il DOM sia aggiornato *prima* di scorrere.

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
          Next
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
                alt={'Cat #' + cat.id}
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

Quando `index === i`, significa che l'immagine è quella selezionata, il `<li>` riceverà `selectedRef`. React si assicurerà che `selectedRef.current` punti sempre al nodo DOM corretto.

Nota che la chiamata a `flushSync` è necessaria per forzare React ad aggiornare il DOM prima dello scorrimento. Altrimenti, `selectedRef.current` punterebbe sempre all'elemento selezionato in precedenza.

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
          Next
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
                alt={'Cat #' + cat.id}
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

Fai in modo che cliccare il bottone "Search" metta a fuoco il campo. Nota che ogni componente è definito in un file separato e non dovrebbe essere spostato fuori da esso. Come li colleghi insieme?

<Hint>

Dovrai passare `ref` come prop per scegliere di esporre un nodo DOM dal tuo componente come `SearchInput`.

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
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Dovrai aggiungere una prop `onClick` a `SearchButton`, e fare in modo che `SearchButton` la passi al `<button>` del browser. Passerai anche un ref a `<SearchInput>`, che lo inoltrerà al vero `<input>` e lo popolerà. Infine, nel gestore di click, chiamerai `focus` sul nodo DOM conservato dentro quel ref.

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
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Looking for something?"
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
