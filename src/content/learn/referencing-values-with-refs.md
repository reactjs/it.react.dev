---
title: Referenziare valori con i ref
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/referencing-values-with-refs.md).

</Note>

<Intro>

Quando vuoi che un componente "ricordi" un'informazione, ma non vuoi che quell'informazione [avvii nuove renderizzazioni](/learn/render-and-commit), puoi usare un *ref*.

</Intro>

<YouWillLearn>

- Come aggiungere un ref al tuo componente
- Come aggiornare il valore di un ref
- In cosa i ref differiscono dallo state
- Come usare i ref in sicurezza

</YouWillLearn>

## Aggiungere un ref al tuo componente {/*adding-a-ref-to-your-component*/}

Puoi aggiungere un ref al tuo componente importando l'Hook `useRef` da React:

```js
import { useRef } from 'react';
```

All'interno del tuo componente, chiama l'Hook `useRef` e passa il valore iniziale che vuoi referenziare come unico argomento. Ad esempio, ecco un ref al valore `0`:

```js
const ref = useRef(0);
```

`useRef` restituisce un oggetto come questo:

```js
{
  current: 0 // Il valore che hai passato a useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Una freccia con scritto 'current' infilata in una tasca con scritto 'ref'." />

Puoi accedere al valore corrente di quel ref tramite la proprietà `ref.current`. Questo valore è intenzionalmente mutabile, il che significa che puoi sia leggerlo che scriverci. È come una tasca segreta del tuo componente che React non traccia. (È questo che lo rende un "escape hatch" dal [flusso di dati unidirezionale](/learn/passing-props-to-a-component) di React — ne parleremo più avanti!)

Qui, un bottone incrementerà `ref.current` a ogni click:

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

Il ref punta a un numero, ma, come lo [state](/learn/state-a-components-memory), potresti puntare a qualsiasi cosa: una stringa, un oggetto o persino una funzione. A differenza dello state, un ref è un normale oggetto JavaScript con la proprietà `current` che puoi leggere e modificare.

Nota che **il componente non si ri-renderizza a ogni incremento.** Come lo state, i ref vengono conservati da React tra le ri-renderizzazioni. Tuttavia, impostare lo state ri-renderizza un componente. Modificare un ref no!

## Esempio: costruire un cronometro {/*example-building-a-stopwatch*/}

Puoi combinare ref e state in un singolo componente. Ad esempio, creiamo un cronometro che l'utente può avviare o fermare premendo un bottone. Per mostrare quanto tempo è trascorso da quando l'utente ha premuto "Start", dovrai tenere traccia di quando è stato premuto il bottone Start e di qual è l'ora corrente. **Questa informazione viene usata per la renderizzazione, quindi la conserverai nello state:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Quando l'utente preme "Start", userai [`setInterval`](https://developer.mozilla.org/it/docs/Web/API/setInterval) per aggiornare l'ora ogni 10 millisecondi:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
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
    </>
  );
}
```

</Sandpack>

Quando viene premuto il bottone "Stop", devi annullare l'intervallo esistente in modo che smetta di aggiornare la variabile di state `now`. Puoi farlo chiamando [`clearInterval`](https://developer.mozilla.org/it/docs/Web/API/clearInterval), ma devi passargli l'ID dell'intervallo restituito in precedenza dalla chiamata a `setInterval` quando l'utente ha premuto Start. Devi conservare l'ID dell'intervallo da qualche parte. **Poiché l'ID dell'intervallo non viene usato per la renderizzazione, puoi conservarlo in un ref:**

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

Quando un'informazione viene usata per la renderizzazione, conservala nello state. Quando un'informazione è necessaria solo ai gestori di eventi e modificarla non richiede una ri-renderizzazione, usare un ref può essere più efficiente.

## Differenze tra ref e state {/*differences-between-refs-and-state*/}

Forse stai pensando che i ref sembrino meno "rigidi" dello state — puoi mutarli invece di dover sempre usare una funzione d'impostazione dello state, per esempio. Ma nella maggior parte dei casi, vorrai usare lo state. I ref sono un "escape hatch" di cui non avrai spesso bisogno. Ecco come si confrontano state e ref:

| ref                                                                                   | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` restituisce `{ current: initialValue }`                        | `useState(initialValue)` restituisce il valore corrente di una variabile di state e una funzione d'impostazione dello state (`[value, setValue]`) |
| Non avvia una ri-renderizzazione quando lo modifichi.                                 | Avvia una ri-renderizzazione quando lo modifichi.                                                                         |
| Mutabile — puoi modificare e aggiornare il valore di `current` fuori dal processo di renderizzazione. | "Immutabile" — devi usare la funzione d'impostazione dello state per modificare le variabili di state e mettere in coda una ri-renderizzazione. |
| Non dovresti leggere (o scrivere) il valore di `current` durante la renderizzazione. | Puoi leggere lo state in qualsiasi momento. Tuttavia, ogni renderizzazione ha la propria [istantanea](/learn/state-as-a-snapshot) dello state che non cambia.

Ecco un bottone contatore implementato con lo state:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

Poiché il valore di `count` viene visualizzato, ha senso usare una variabile di state per esso. Quando il valore del contatore viene impostato con `setCount()`, React ri-renderizza il componente e lo schermo si aggiorna per riflettere il nuovo conteggio.

Se provassi a implementarlo con un ref, React non ri-renderizzerebbe mai il componente, quindi non vedresti mai il conteggio cambiare! Guarda come cliccare questo bottone **non aggiorna il suo testo**:

<Sandpack>

```js {expectedErrors: {'react-compiler': [13]}}
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

Ecco perché leggere `ref.current` durante la renderizzazione porta a codice inaffidabile. Se ne hai bisogno, usa lo state.

<DeepDive>

#### Come funziona useRef internamente? {/*how-does-use-ref-work-inside*/}

Sebbene sia `useState` che `useRef` siano forniti da React, in linea di principio `useRef` potrebbe essere implementato _sopra_ `useState`. Puoi immaginare che all'interno di React, `useRef` sia implementato così:

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Durante la prima renderizzazione, `useRef` restituisce `{ current: initialValue }`. Questo oggetto viene conservato da React, quindi durante la renderizzazione successiva verrà restituito lo stesso oggetto. Nota come la funzione d'impostazione dello state non venga usata in questo esempio. È superflua perché `useRef` deve sempre restituire lo stesso oggetto!

React fornisce una versione integrata di `useRef` perché è abbastanza comune nella pratica. Ma puoi pensarlo come una normale variabile di state senza una funzione d'impostazione. Se hai familiarità con la programmazione orientata agli oggetti, i ref potrebbero ricordarti i campi di istanza — ma invece di `this.something` scrivi `somethingRef.current`.

</DeepDive>

## Quando usare i ref {/*when-to-use-refs*/}

Tipicamente, userai un ref quando il tuo componente deve "uscire" da React e comunicare con API esterne — spesso un'API del browser che non influisce sull'aspetto del componente. Ecco alcune di queste situazioni rare:

- Conservare [ID di timeout](https://developer.mozilla.org/it/docs/Web/API/setTimeout)
- Conservare e manipolare [elementi DOM](https://developer.mozilla.org/it/docs/Web/API/Element), che trattiamo [nella pagina successiva](/learn/manipulating-the-dom-with-refs)
- Conservare altri oggetti non necessari per calcolare il JSX.

Se il tuo componente deve conservare un valore, ma non influisce sulla logica di renderizzazione, scegli i ref.

## Best practice per i ref {/*best-practices-for-refs*/}

Seguire questi principi renderà i tuoi componenti più prevedibili:

- **Tratta i ref come un escape hatch.** I ref sono utili quando lavori con sistemi esterni o API del browser. Se gran parte della logica della tua applicazione e del flusso di dati si basa sui ref, potresti voler ripensare il tuo approccio.
- **Non leggere o scrivere `ref.current` durante la renderizzazione.** Se un'informazione è necessaria durante la renderizzazione, usa lo [state](/learn/state-a-components-memory). Poiché React non sa quando `ref.current` cambia, anche leggerlo durante la renderizzazione rende difficile prevedere il comportamento del componente. (L'unica eccezione a questo è codice come `if (!ref.current) ref.current = new Thing()` che imposta il ref una sola volta durante la prima renderizzazione.)

Le limitazioni dello state di React non si applicano ai ref. Ad esempio, lo state si comporta come un'[istantanea per ogni renderizzazione](/learn/state-as-a-snapshot) e [non si aggiorna in modo sincrono.](/learn/queueing-a-series-of-state-updates) Ma quando muti il valore corrente di un ref, cambia immediatamente:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Questo perché **il ref stesso è un normale oggetto JavaScript,** e quindi si comporta come tale.

Non devi neanche preoccuparti di [evitare la mutazione](/learn/updating-objects-in-state) quando lavori con un ref. Finché l'oggetto che stai mutando non viene usato per la renderizzazione, a React non importa cosa fai con il ref o il suo contenuto.

## Ref e DOM {/*refs-and-the-dom*/}

Puoi puntare un ref a qualsiasi valore. Tuttavia, il caso d'uso più comune per un ref è accedere a un elemento DOM. Ad esempio, è utile se vuoi mettere a fuoco un input programmaticamente. Quando passi un ref a un attributo `ref` in JSX, come `<div ref={myRef}>`, React inserirà l'elemento DOM corrispondente in `myRef.current`. Una volta che l'elemento viene rimosso dal DOM, React aggiornerà `myRef.current` impostandolo a `null`. Puoi leggere di più su questo in [Manipolare il DOM con i ref.](/learn/manipulating-the-dom-with-refs)

<Recap>

- I ref sono un escape hatch per conservare valori non usati per la renderizzazione. Non ne avrai spesso bisogno.
- Un ref è un normale oggetto JavaScript con una singola proprietà chiamata `current`, che puoi leggere o impostare.
- Puoi chiedere a React di darti un ref chiamando l'Hook `useRef`.
- Come lo state, i ref ti permettono di conservare informazioni tra le ri-renderizzazioni di un componente.
- A differenza dello state, impostare il valore `current` di un ref non avvia una ri-renderizzazione.
- Non leggere o scrivere `ref.current` durante la renderizzazione. Questo rende il componente difficile da prevedere.

</Recap>



<Challenges>

#### Correggere un input chat rotto {/*fix-a-broken-chat-input*/}

Digita un messaggio e clicca "Send". Noterai che c'è un ritardo di tre secondi prima di vedere l'alert "Sent!". Durante questo ritardo, puoi vedere un bottone "Undo". Cliccalo. Questo bottone "Undo" dovrebbe impedire la comparsa del messaggio "Sent!". Lo fa chiamando [`clearTimeout`](https://developer.mozilla.org/it/docs/Web/API/clearTimeout) per l'ID del timeout salvato durante `handleSend`. Tuttavia, anche dopo aver cliccato "Undo", il messaggio "Sent!" compare comunque. Scopri perché non funziona e correggilo.

<Hint>

Le variabili regolari come `let timeoutID` non "sopravvivono" tra le ri-renderizzazioni perché ogni renderizzazione esegue il componente (e inizializza le sue variabili) da zero. Dovresti conservare l'ID del timeout altrove?

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Ogni volta che il componente si ri-renderizza (ad esempio quando imposti lo state), tutte le variabili locali vengono inizializzate da zero. Ecco perché non puoi salvare l'ID del timeout in una variabile locale come `timeoutID` e poi aspettarti che un altro gestore di eventi lo "veda" in futuro. Invece, conservalo in un ref, che React preserverà tra le renderizzazioni.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Correggere un componente che non si ri-renderizza {/*fix-a-component-failing-to-re-render*/}

Questo bottone dovrebbe alternare tra mostrare "On" e "Off". Tuttavia, mostra sempre "Off". Cosa c'è che non va in questo codice? Correggilo.

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

In questo esempio, il valore corrente di un ref viene usato per calcolare l'output della renderizzazione: `{isOnRef.current ? 'On' : 'Off'}`. Questo è un segnale che questa informazione non dovrebbe essere in un ref, e avrebbe dovuto essere messa nello state. Per correggerlo, rimuovi il ref e usa lo state:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Correggere il debouncing {/*fix-debouncing*/}

In questo esempio, tutti i gestori di eventi dei bottoni sono ["debounced".](https://kettanaito.com/blog/debounce-vs-throttle) Per capire cosa significa, premi uno dei bottoni. Nota come il messaggio compare un secondo dopo. Se premi il bottone mentre aspetti il messaggio, il timer si resetta. Quindi se continui a cliccare lo stesso bottone velocemente molte volte, il messaggio non comparirà fino a un secondo *dopo* che smetti di cliccare. Il debouncing ti permette di ritardare un'azione finché l'utente "smette di fare cose".

Questo esempio funziona, ma non del tutto come previsto. I bottoni non sono indipendenti. Per vedere il problema, clicca uno dei bottoni, e poi clicca immediatamente un altro bottone. Ti aspetteresti che, dopo un ritardo, vedresti i messaggi di entrambi i bottoni. Ma compare solo il messaggio dell'ultimo bottone. Il messaggio del primo bottone viene perso.

Perché i bottoni interferiscono l'uno con l'altro? Trova e correggi il problema.

<Hint>

L'ultima variabile ID del timeout è condivisa tra tutti i componenti `DebouncedButton`. Ecco perché cliccare un bottone resetta il timeout di un altro bottone. Puoi conservare un ID timeout separato per ogni bottone?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

Una variabile come `timeoutID` è condivisa tra tutti i componenti. Ecco perché cliccare sul secondo bottone resetta il timeout in sospeso del primo bottone. Per correggere, puoi conservare il timeout in un ref. Ogni bottone avrà il proprio ref, quindi non entreranno in conflitto. Nota come cliccare due bottoni velocemente mostrerà entrambi i messaggi.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Leggere lo state più recente {/*read-the-latest-state*/}

In questo esempio, dopo aver premuto "Send", c'è un piccolo ritardo prima che il messaggio venga mostrato. Digita "hello", premi Send, e poi modifica rapidamente l'input di nuovo. Nonostante le tue modifiche, l'alert mostrerebbe comunque "hello" (che era il valore dello state [al momento](/learn/state-as-a-snapshot#state-over-time) in cui è stato cliccato il bottone).

Di solito, questo comportamento è quello che vuoi in un'app. Tuttavia, ci possono essere casi occasionali in cui vuoi che del codice asincrono legga l'*ultima* versione dello state. Riesci a pensare a un modo per far sì che l'alert mostri il testo *corrente* dell'input piuttosto che quello che era al momento del click?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

Lo state funziona [come un'istantanea](/learn/state-as-a-snapshot), quindi non puoi leggere lo state più recente da un'operazione asincrona come un timeout. Tuttavia, puoi conservare l'ultimo testo dell'input in un ref. Un ref è mutabile, quindi puoi leggere la proprietà `current` in qualsiasi momento. Poiché il testo corrente viene anche usato per la renderizzazione, in questo esempio avrai bisogno *sia* di una variabile di state (per la renderizzazione), *sia* di un ref (per leggerlo nel timeout). Dovrai aggiornare manualmente il valore corrente del ref.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
