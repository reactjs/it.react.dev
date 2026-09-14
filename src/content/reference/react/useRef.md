---
title: useRef
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useRef.md).

</Note>

<Intro>

`useRef` è un Hook React che ti permette di referenziare un valore non necessario per la renderizzazione.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Chiama `useRef` al top level del tuo componente per dichiarare un [ref.](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `initialValue`: Il valore con cui vuoi inizializzare la proprietà `current` dell'oggetto ref. Può essere un valore di qualsiasi tipo. Questo argomento viene ignorato dopo la renderizzazione iniziale.

#### Returns {/*returns*/}

`useRef` restituisce un oggetto con una singola proprietà:

* `current`: Inizialmente è impostato al valore `initialValue` che hai passato. Puoi impostarlo su qualcos'altro in seguito. Se passi l'oggetto ref a React come attributo `ref` di un nodo JSX, React imposterà la sua proprietà `current`.

Nelle renderizzazioni successive, `useRef` restituirà lo stesso oggetto.

#### Caveats {/*caveats*/}

* Puoi mutare la proprietà `ref.current`. A differenza dello state, è mutabile. Tuttavia, se contiene un oggetto usato per la renderizzazione (ad esempio, una porzione del tuo state), non dovresti mutare quell'oggetto.
* Quando cambi la proprietà `ref.current`, React non ri-renderizza il tuo componente. React non è a conoscenza di quando la modifichi perché un ref è un normale oggetto JavaScript.
* Non scrivere _né leggere_ `ref.current` durante la renderizzazione, tranne per [l'inizializzazione.](#avoiding-recreating-the-ref-contents) Questo rende imprevedibile il comportamento del tuo componente.
* In Strict Mode, React **chiamerà la funzione del tuo componente due volte** per [aiutarti a trovare impurità accidentali.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Questo è un comportamento solo in development e non influisce sulla production. Ogni oggetto ref verrà creato due volte, ma una delle versioni verrà scartata. Se la funzione del tuo componente è pura (come dovrebbe essere), non dovrebbe influire sul comportamento.

---

## Usage {/*usage*/}

### Referenziare un valore con un ref {/*referencing-a-value-with-a-ref*/}

Chiama `useRef` al top level del tuo componente per dichiarare uno o più [ref.](/learn/referencing-values-with-refs)

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` restituisce un <CodeStep step={1}>oggetto ref</CodeStep> con una singola <CodeStep step={2}>proprietà `current`</CodeStep> inizialmente impostata al <CodeStep step={3}>valore iniziale</CodeStep> che hai fornito.

Nelle renderizzazioni successive, `useRef` restituirà lo stesso oggetto. Puoi cambiare la sua proprietà `current` per conservare informazioni e leggerle in seguito. Potrebbe ricordarti lo [state](/reference/react/useState), ma c'è una differenza importante.

**Modificare un ref non avvia una ri-renderizzazione.** Questo significa che i ref sono perfetti per conservare informazioni che non influenzano l'output visivo del tuo componente. Ad esempio, se devi conservare un [ID di intervallo](https://developer.mozilla.org/it/docs/Web/API/setInterval) e recuperarlo in seguito, puoi metterlo in un ref. Per aggiornare il valore all'interno del ref, devi modificare manualmente la sua <CodeStep step={2}>proprietà `current`</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

In seguito, puoi leggere quell'ID di intervallo dal ref per poter [cancellare l'intervallo](https://developer.mozilla.org/it/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Usando un ref, ti assicuri che:

- Puoi **conservare informazioni** tra le ri-renderizzazioni (a differenza delle variabili normali, che si azzerano a ogni renderizzazione).
- Modificarlo **non avvia una ri-renderizzazione** (a differenza delle variabili di state, che avviano una ri-renderizzazione).
- Le **informazioni sono locali** a ogni copia del tuo componente (a differenza delle variabili esterne, che sono condivise).

Modificare un ref non avvia una ri-renderizzazione, quindi i ref non sono appropriati per conservare informazioni che vuoi mostrare sullo schermo. Usa lo state per quello. Leggi di più su [scegliere tra `useRef` e `useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="Esempi di referenziare un valore con useRef" titleId="examples-value">

#### Contatore di click {/*click-counter*/}

Questo componente usa un ref per tenere traccia di quante volte è stato cliccato il pulsante. Nota che va bene usare un ref invece dello state qui perché il conteggio dei click viene letto e scritto solo in un gestore di eventi.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Se mostri `{ref.current}` nel JSX, il numero non si aggiornerà al click. Questo perché impostare `ref.current` non avvia una ri-renderizzazione. Le informazioni usate per la renderizzazione dovrebbero essere state.

<Solution />

#### Un cronometro {/*a-stopwatch*/}

Questo esempio usa una combinazione di state e ref. Sia `startTime` che `now` sono variabili di state perché vengono usate per la renderizzazione. Ma dobbiamo anche conservare un [ID di intervallo](https://developer.mozilla.org/it/docs/Web/API/setInterval) per poter fermare l'intervallo alla pressione del pulsante. Poiché l'ID di intervallo non viene usato per la renderizzazione, è appropriato tenerlo in un ref e aggiornarlo manualmente.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**Non scrivere _né leggere_ `ref.current` durante la renderizzazione.**

React si aspetta che il corpo del tuo componente [si comporti come una funzione pura](/learn/keeping-components-pure):

- Se gli input ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory) e [context](/learn/passing-data-deeply-with-context)) sono gli stessi, dovrebbe restituire esattamente lo stesso JSX.
- Chiamarlo in un ordine diverso o con argomenti diversi non dovrebbe influenzare i risultati delle altre chiamate.

Leggere o scrivere un ref **durante la renderizzazione** viola queste aspettative.

```js {expectedErrors: {'react-compiler': [4]}} {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Non scrivere un ref durante la renderizzazione
  myRef.current = 123;
  // ...
  // 🚩 Non leggere un ref durante la renderizzazione
  return <h1>{myOtherRef.current}</h1>;
}
```

Puoi leggere o scrivere i ref **nei gestori di eventi o negli Effetti**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ Puoi leggere o scrivere ref negli Effetti
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ Puoi leggere o scrivere ref nei gestori di eventi
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Se _devi_ leggere [o scrivere](/reference/react/useState#storing-information-from-previous-renders) qualcosa durante la renderizzazione, [usa lo state](/reference/react/useState).

Quando violi queste regole, il tuo componente potrebbe funzionare comunque, ma la maggior parte delle funzionalità più recenti che stiamo aggiungendo a React si baserà su queste aspettative. Leggi di più su [mantenere i tuoi componenti puri.](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

</Pitfall>

---

### Manipolare il DOM con un ref {/*manipulating-the-dom-with-a-ref*/}

È particolarmente comune usare un ref per manipolare il [DOM.](https://developer.mozilla.org/it/docs/Web/API/HTML_DOM_API) React ha supporto integrato per questo.

Per prima cosa, dichiara un <CodeStep step={1}>oggetto ref</CodeStep> con un <CodeStep step={3}>valore iniziale</CodeStep> di `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Poi passa il tuo oggetto ref come attributo `ref` al JSX del nodo DOM che vuoi manipolare:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

Dopo che React crea il nodo DOM e lo mette sullo schermo, React imposterà la <CodeStep step={2}>proprietà `current`</CodeStep> del tuo oggetto ref su quel nodo DOM. Ora puoi accedere al nodo DOM dell'`<input>` e chiamare metodi come [`focus()`](https://developer.mozilla.org/it/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React reimposterà la proprietà `current` su `null` quando il nodo viene rimosso dallo schermo.

Leggi di più su [manipolare il DOM con i ref.](/learn/manipulating-the-dom-with-refs)

<Recipes titleText="Esempi di manipolare il DOM con useRef" titleId="examples-dom">

#### Mettere a fuoco un input di testo {/*focusing-a-text-input*/}

In questo esempio, cliccare il pulsante metterà a fuoco l'input:

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

<Solution />

#### Scorrere un'immagine in vista {/*scrolling-an-image-into-view*/}

In questo esempio, cliccare il pulsante farà scorrere un'immagine in vista. Usa un ref al nodo DOM della lista, e poi chiama l'API DOM [`querySelectorAll`](https://developer.mozilla.org/it/docs/Web/API/Document/querySelectorAll) per trovare l'immagine verso cui scorrere.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // Questa riga assume una particolare struttura DOM:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
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

<Solution />

#### Riprodurre e mettere in pausa un video {/*playing-and-pausing-a-video*/}

Questo esempio usa un ref per chiamare [`play()`](https://developer.mozilla.org/it/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/it/docs/Web/API/HTMLMediaElement/pause) su un nodo DOM `<video>`.

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
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Esporre un ref al tuo componente {/*exposing-a-ref-to-your-own-component*/}

A volte, potresti voler lasciare che il componente genitore manipoli il DOM all'interno del tuo componente. Ad esempio, forse stai scrivendo un componente `MyInput`, ma vuoi che il genitore possa mettere a fuoco l'input (a cui il genitore non ha accesso). Puoi creare un `ref` nel genitore e passarlo come prop al componente figlio. Leggi una [guida dettagliata](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) qui.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
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

<Solution />

</Recipes>

---

### Evitare di ricreare il contenuto del ref {/*avoiding-recreating-the-ref-contents*/}

React salva il valore iniziale del ref una volta e lo ignora nelle renderizzazioni successive.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Sebbene il risultato di `new VideoPlayer()` venga usato solo per la renderizzazione iniziale, stai comunque chiamando questa funzione a ogni renderizzazione. Questo può essere inefficiente se crea oggetti costosi.

Per risolvere, puoi inizializzare il ref così:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Normalmente, scrivere o leggere `ref.current` durante la renderizzazione non è consentito. Tuttavia, va bene in questo caso perché il risultato è sempre lo stesso, e la condizione viene eseguita solo durante l'inizializzazione, quindi è completamente prevedibile.

<DeepDive>

#### Come evitare controlli null quando inizializzi useRef in seguito {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Se usi un type checker e non vuoi controllare sempre `null`, puoi provare un pattern come questo:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Qui, `playerRef` stesso è nullable. Tuttavia, dovresti riuscire a convincere il tuo type checker che non c'è alcun caso in cui `getPlayer()` restituisca `null`. Poi usa `getPlayer()` nei tuoi gestori di eventi.

</DeepDive>

---

## Troubleshooting {/*troubleshooting*/}

### Non riesco a ottenere un ref a un componente personalizzato {/*i-cant-get-a-ref-to-a-custom-component*/}

Se provi a passare un `ref` al tuo componente così:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

Potresti ottenere un errore nella console:

<ConsoleBlock level="error">

TypeError: Cannot read properties of null

</ConsoleBlock>

Per impostazione predefinita, i tuoi componenti non espongono ref ai nodi DOM al loro interno.

Per risolvere, trova il componente a cui vuoi ottenere un ref:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

E poi aggiungi `ref` all'elenco delle props che il tuo componente accetta e passa `ref` come prop al [componente integrato](/reference/react-dom/components/common) figlio pertinente, così:

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

Poi il componente genitore può ottenere un ref ad esso.

Leggi di più su [accedere ai nodi DOM di un altro componente.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
