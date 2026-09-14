---
title: useEffect
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useEffect.md).

</Note>

<Intro>

`useEffect` è un Hook React che ti permette di [sincronizzare un componente con un sistema esterno.](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Chiama `useEffect` al top level del tuo componente per dichiarare un Effetto:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `setup`: La funzione con la logica del tuo Effetto. La funzione di setup può anche restituire opzionalmente una funzione di *cleanup*. Quando il tuo [componente esegue la fase di commit](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom), React eseguirà la funzione di setup. Dopo ogni fase di commit con dipendenze cambiate, React eseguirà prima la funzione di cleanup (se l'hai fornita) con i valori precedenti, e poi eseguirà la funzione di setup con i nuovi valori. Dopo che il componente viene rimosso dal DOM, React eseguirà la funzione di cleanup.

* **optional** `dependencies`: L'elenco di tutti i valori reattivi referenziati all'interno del codice di `setup`. I valori reattivi includono props, state e tutte le variabili e funzioni dichiarate direttamente nel corpo del componente. Se il tuo linter è [configurato per React](/learn/editor-setup#linting), verificherà che ogni valore reattivo sia specificato correttamente come dipendenza. L'elenco delle dipendenze deve avere un numero costante di elementi ed essere scritto inline come `[dep1, dep2, dep3]`. React confronterà ogni dipendenza con il suo valore precedente usando il confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se ometti questo argomento, il tuo Effetto verrà rieseguito dopo ogni fase di commit del componente. [Vedi la differenza tra passare un array di dipendenze, un array vuoto e nessuna dipendenza.](#examples-dependencies)

#### Returns {/*returns*/}

`useEffect` restituisce `undefined`.

#### Caveats {/*caveats*/}

* `useEffect` è un Hook, quindi puoi chiamarlo **solo al top level del tuo componente** o dei tuoi Hook. Non puoi chiamarlo all'interno di loop o condizioni. Se ne hai bisogno, estrai un nuovo componente e sposta lo state al suo interno.

* Se **non stai cercando di sincronizzarti con un sistema esterno,** [probabilmente non ti serve un Effetto.](/learn/you-might-not-need-an-effect)

* Quando Strict Mode è attivo, React **eseguirà un ciclo setup+cleanup extra solo in development** prima del primo setup reale. È un test di stress che verifica che la logica di cleanup "specchi" la logica di setup e che fermi o annulli ciò che fa il setup. Se questo causa un problema, [implementa la funzione di cleanup.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Se alcune delle tue dipendenze sono oggetti o funzioni definite all'interno del componente, c'è il rischio che **facciano rieseguire l'Effetto più spesso del necessario.** Per risolvere, rimuovi le dipendenze [oggetto](#removing-unnecessary-object-dependencies) e [funzione](#removing-unnecessary-function-dependencies) non necessarie. Puoi anche [estrarre gli aggiornamenti di state](#updating-state-based-on-previous-state-from-an-effect) e la [logica non reattiva](#reading-the-latest-props-and-state-from-an-effect) fuori dall'Effetto.

* Se il tuo Effetto non è stato causato da un'interazione (come un click), React in genere lascerà che il browser **dipinga lo schermo aggiornato prima di eseguire l'Effetto.** Se il tuo Effetto fa qualcosa di visivo (ad esempio, posizionare un tooltip) e il ritardo è evidente (ad esempio, sfarfalla), sostituisci `useEffect` con [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Se il tuo Effetto è causato da un'interazione (come un click), **React può eseguire l'Effetto prima che il browser dipinga lo schermo aggiornato**. Questo garantisce che il risultato dell'Effetto possa essere osservato dal sistema di eventi. Di solito funziona come previsto. Tuttavia, se devi posticipare il lavoro fino a dopo il paint, come un `alert()`, puoi usare `setTimeout`. Vedi [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128) per maggiori informazioni.

* Anche se il tuo Effetto è stato causato da un'interazione (come un click), **React può permettere al browser di ridipingere lo schermo prima di elaborare gli aggiornamenti di state all'interno dell'Effetto.** Di solito funziona come previsto. Tuttavia, se devi impedire al browser di ridipingere lo schermo, devi sostituire `useEffect` con [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Gli Effetti **vengono eseguiti solo sul client.** Non vengono eseguiti durante la renderizzazione lato server.

---

## Usage {/*usage*/}

### Connettersi a un sistema esterno {/*connecting-to-an-external-system*/}

Alcuni componenti devono restare connessi alla rete, a qualche API del browser o a una libreria di terze parti mentre sono visualizzati nella pagina. Questi sistemi non sono controllati da React, quindi vengono chiamati *esterni.*

Per [connettere il tuo componente a un sistema esterno,](/learn/synchronizing-with-effects) chiama `useEffect` al top level del tuo componente:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

Devi passare due argomenti a `useEffect`:

1. Una *funzione di setup* con <CodeStep step={1}>codice di setup</CodeStep> che si connette a quel sistema.
   - Dovrebbe restituire una *funzione di cleanup* con <CodeStep step={2}>codice di cleanup</CodeStep> che si disconnette da quel sistema.
2. Un <CodeStep step={3}>elenco di dipendenze</CodeStep> che include ogni valore del componente usato all'interno di quelle funzioni.

**React chiama le funzioni di setup e cleanup quando è necessario, il che può accadere più volte:**

1. Il tuo <CodeStep step={1}>codice di setup</CodeStep> viene eseguito quando il componente viene aggiunto alla pagina *(monta)*.
2. Dopo ogni fase di commit del componente in cui le <CodeStep step={3}>dipendenze</CodeStep> sono cambiate:
   - Prima, il tuo <CodeStep step={2}>codice di cleanup</CodeStep> viene eseguito con le props e lo state precedenti.
   - Poi, il tuo <CodeStep step={1}>codice di setup</CodeStep> viene eseguito con le nuove props e il nuovo state.
3. Il tuo <CodeStep step={2}>codice di cleanup</CodeStep> viene eseguito un'ultima volta dopo che il componente viene rimosso dalla pagina *(smonta)*.

**Illustriamo questa sequenza per l'esempio sopra.**

Quando il componente `ChatRoom` sopra viene aggiunto alla pagina, si connetterà alla chat room con i valori iniziali di `serverUrl` e `roomId`. Se `serverUrl` o `roomId` cambiano a seguito di una fase di commit (ad esempio, se l'utente sceglie una chat room diversa in un menu a tendina), il tuo Effetto *si disconnetterà dalla room precedente e si connetterà alla successiva.* Quando il componente `ChatRoom` viene rimosso dalla pagina, il tuo Effetto si disconnetterà un'ultima volta.

**Per [aiutarti a trovare bug,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) in development React esegue <CodeStep step={1}>setup</CodeStep> e <CodeStep step={2}>cleanup</CodeStep> un'extra volta prima del <CodeStep step={1}>setup</CodeStep>.** È un test di stress che verifica che la logica del tuo Effetto sia implementata correttamente. Se questo causa problemi visibili, alla funzione di cleanup manca della logica. La funzione di cleanup dovrebbe fermare o annullare ciò che faceva la funzione di setup. La regola generale è che l'utente non dovrebbe poter distinguere tra il setup chiamato una volta (come in production) e una sequenza *setup* → *cleanup* → *setup* (come in development). [Vedi soluzioni comuni.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**Cerca di [scrivere ogni Effetto come un processo indipendente](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) e [pensa a un singolo ciclo setup/cleanup alla volta.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** Non dovrebbe importare se il componente sta montando, aggiornando o smontando. Quando la logica di cleanup "specchia" correttamente la logica di setup, il tuo Effetto è resiliente all'esecuzione di setup e cleanup quanto spesso serve.

<Note>

Un Effetto ti permette di [mantenere il componente sincronizzato](/learn/synchronizing-with-effects) con un sistema esterno (come un servizio di chat). Qui, *sistema esterno* indica qualsiasi pezzo di codice non controllato da React, come:

* Un timer gestito con <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/it/docs/Web/API/setInterval)</CodeStep> e <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/it/docs/Web/API/clearInterval)</CodeStep>.
* Una sottoscrizione a eventi usando <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/it/docs/Web/API/EventTarget/addEventListener)</CodeStep> e <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/it/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* Una libreria di animazione di terze parti con un'API come <CodeStep step={1}>`animation.start()`</CodeStep> e <CodeStep step={2}>`animation.reset()`</CodeStep>.

**Se non ti stai connettendo a nessun sistema esterno, [probabilmente non ti serve un Effetto.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Esempi di connessione a un sistema esterno" titleId="examples-connecting">

#### Connessione a un server di chat {/*connecting-to-a-chat-server*/}

In questo esempio, il componente `ChatRoom` usa un Effetto per restare connesso a un sistema esterno definito in `chat.js`. Premi "Open chat" per far apparire il componente `ChatRoom`. Questa sandbox è in modalità development, quindi c'è un ciclo extra di connessione e disconnessione, come [spiegato qui.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) Prova a cambiare `roomId` e `serverUrl` usando il menu a tendina e l'input, e osserva come l'Effetto si riconnette alla chat. Premi "Close chat" per vedere l'Effetto disconnettersi un'ultima volta.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Ascoltare un evento globale del browser {/*listening-to-a-global-browser-event*/}

In questo esempio, il sistema esterno è il DOM del browser stesso. Normalmente specificheresti i listener di eventi con JSX, ma non puoi ascoltare l'oggetto globale [`window`](https://developer.mozilla.org/it/docs/Web/API/Window) in questo modo. Un Effetto ti permette di connetterti all'oggetto `window` e ascoltare i suoi eventi. Ascoltare l'evento `pointermove` ti permette di tracciare la posizione del cursore (o del dito) e aggiornare il punto rosso affinché si muova con esso.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Attivare un'animazione {/*triggering-an-animation*/}

In questo esempio, il sistema esterno è la libreria di animazione in `animation.js`. Fornisce una classe JavaScript chiamata `FadeInAnimation` che accetta un nodo DOM come argomento ed espone i metodi `start()` e `stop()` per controllare l'animazione. Questo componente [usa un ref](/learn/manipulating-the-dom-with-refs) per accedere al nodo DOM sottostante. L'Effetto legge il nodo DOM dal ref e avvia automaticamente l'animazione per quel nodo quando il componente appare.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Salta immediatamente alla fine
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Inizia l'animazione
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Abbiamo ancora altri frame da dipingere
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### Controllare una finestra modale {/*controlling-a-modal-dialog*/}

In questo esempio, il sistema esterno è il DOM del browser. Il componente `ModalDialog` renderizza un elemento [`<dialog>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/dialog). Usa un Effetto per sincronizzare la prop `isOpen` con le chiamate ai metodi [`showModal()`](https://developer.mozilla.org/it/docs/Web/API/HTMLDialogElement/showModal) e [`close()`](https://developer.mozilla.org/it/docs/Web/API/HTMLDialogElement/close).

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Tracciare la visibilità di un elemento {/*tracking-element-visibility*/}

In questo esempio, il sistema esterno è di nuovo il DOM del browser. Il componente `App` mostra una lista lunga, poi un componente `Box`, e poi un'altra lista lunga. Scorri la lista verso il basso. Nota che quando l'intero componente `Box` è completamente visibile nel viewport, il colore di sfondo diventa nero. Per implementarlo, il componente `Box` usa un Effetto per gestire un [`IntersectionObserver`](https://developer.mozilla.org/it/docs/Web/API/Intersection_Observer_API). Questa API del browser ti notifica quando l'elemento DOM è visibile nel viewport.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Avvolgere gli Effetti in custom Hook {/*wrapping-effects-in-custom-hooks*/}

Gli Effetti sono una ["via di fuga":](/learn/escape-hatches) li usi quando devi "uscire da React" e quando non esiste una soluzione integrata migliore per il tuo caso d'uso. Se ti ritrovi spesso a scrivere Effetti manualmente, di solito è un segnale che devi estrarre alcuni [custom Hook](/learn/reusing-logic-with-custom-hooks) per i comportamenti comuni su cui si basano i tuoi componenti.

Per esempio, questo custom Hook `useChatRoom` "nasconde" la logica del tuo Effetto dietro un'API più dichiarativa:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Poi puoi usarlo da qualsiasi componente così:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Ci sono anche molti ottimi custom Hook per ogni scopo disponibili nell'ecosistema React.

[Scopri di più sull'avvolgere gli Effetti in custom Hook.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Esempi di avvolgimento degli Effetti in custom Hook" titleId="examples-custom-hooks">

#### Custom Hook `useChatRoom` {/*custom-usechatroom-hook*/}

Questo esempio è identico a uno degli [esempi precedenti,](#examples-connecting) ma la logica è estratta in un custom Hook.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Custom Hook `useWindowListener` {/*custom-usewindowlistener-hook*/}

Questo esempio è identico a uno degli [esempi precedenti,](#examples-connecting) ma la logica è estratta in un custom Hook.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Custom Hook `useIntersectionObserver` {/*custom-useintersectionobserver-hook*/}

Questo esempio è identico a uno degli [esempi precedenti,](#examples-connecting) ma la logica è parzialmente estratta in un custom Hook.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Controllare un widget non-React {/*controlling-a-non-react-widget*/}

A volte vuoi mantenere un sistema esterno sincronizzato con una prop o lo state del tuo componente.

Per esempio, se hai un widget mappa di terze parti o un componente video player scritto senza React, puoi usare un Effetto per chiamare metodi su di esso che fanno corrispondere il suo state allo state attuale del tuo componente React. Questo Effetto crea un'istanza di una classe `MapWidget` definita in `map-widget.js`. Quando cambi la prop `zoomLevel` del componente `Map`, l'Effetto chiama `setZoom()` sull'istanza della classe per mantenerla sincronizzata:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
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

```js src/App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

In questo esempio, una funzione di cleanup non è necessaria perché la classe `MapWidget` gestisce solo il nodo DOM che le è stato passato. Dopo che il componente React `Map` viene rimosso dall'albero, sia il nodo DOM che l'istanza della classe `MapWidget` verranno automaticamente garbage-collected dal motore JavaScript del browser.

---

### Recuperare dati con gli Effetti {/*fetching-data-with-effects*/}

Puoi usare un Effetto per recuperare dati per il tuo componente. Nota che [se usi un framework,](/learn/creating-a-react-app#full-stack-frameworks) usare il meccanismo di data fetching del framework sarà molto più efficiente che scrivere Effetti manualmente.

Se vuoi recuperare dati da un Effetto manualmente, il tuo codice potrebbe assomigliare a questo:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Nota la variabile `ignore` che è inizializzata a `false` e viene impostata a `true` durante il cleanup. Questo garantisce [che il codice non soffra di "race condition":](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) le risposte di rete possono arrivare in un ordine diverso da quello in cui le hai inviate.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Puoi anche riscrivere usando la sintassi [`async` / `await`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Statements/async_function), ma devi comunque fornire una funzione di cleanup:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Scrivere il data fetching direttamente negli Effetti diventa ripetitivo e rende difficile aggiungere ottimizzazioni come caching e server rendering in seguito. [È più semplice usare un custom Hook — il tuo o mantenuto dalla community.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Quali sono buone alternative al data fetching negli Effetti? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Scrivere chiamate `fetch` all'interno degli Effetti è un [modo popolare per recuperare dati](https://www.robinwieruch.de/react-hooks-fetch-data/), specialmente nelle app completamente client-side. Tuttavia, è un approccio molto manuale e ha svantaggi significativi:

- **Gli Effetti non vengono eseguiti sul server.** Questo significa che l'HTML iniziale renderizzato lato server includerà solo uno state di caricamento senza dati. Il computer client dovrà scaricare tutto il JavaScript e renderizzare l'app solo per scoprire che ora deve caricare i dati. Non è molto efficiente.
- **Recuperare dati direttamente negli Effetti rende facile creare "network waterfall".** Renderizzi il componente padre, recuperi dei dati, renderizza i componenti figli, e poi iniziano a recuperare i loro dati. Se la rete non è molto veloce, è significativamente più lento rispetto a recuperare tutti i dati in parallelo.
- **Recuperare dati direttamente negli Effetti di solito significa che non precarichi o memorizzi nella cache i dati.** Per esempio, se il componente smonta e poi rimonta, dovrebbe recuperare i dati di nuovo.
- **Non è molto ergonomico.** C'è parecchio codice boilerplate quando scrivi chiamate `fetch` in modo che non soffra di bug come le [race condition.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Questo elenco di svantaggi non è specifico di React. Si applica al recupero dati al mount con qualsiasi libreria. Come con il routing, il data fetching non è banale da fare bene, quindi raccomandiamo i seguenti approcci:

- **Se usi un [framework](/learn/creating-a-react-app#full-stack-frameworks), usa il suo meccanismo di data fetching integrato.** I framework React moderni hanno meccanismi di data fetching integrati che sono efficienti e non soffrono delle insidie sopra.
- **Altrimenti, considera di usare o costruire una cache lato client.** Soluzioni open source popolari includono [TanStack Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/) e [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Puoi costruire anche la tua soluzione, nel qual caso useresti Effetti sotto il cofano ma aggiungeresti anche logica per deduplicare le richieste, memorizzare nella cache le risposte ed evitare network waterfall (precaricando i dati o sollevando i requisiti di dati alle route).

Puoi continuare a recuperare dati direttamente negli Effetti se nessuno di questi approcci ti conviene.

</DeepDive>

---

### Specificare le dipendenze reattive {/*specifying-reactive-dependencies*/}

**Nota che non puoi "scegliere" le dipendenze del tuo Effetto.** Ogni <CodeStep step={2}>valore reattivo</CodeStep> usato dal codice del tuo Effetto deve essere dichiarato come dipendenza. L'elenco delle dipendenze del tuo Effetto è determinato dal codice circostante:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // Questo è un valore reattivo
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Anche questo è un valore reattivo

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Questo Effetto legge questi valori reattivi
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ Quindi devi specificarli come dipendenze del tuo Effetto
  // ...
}
```

Se `serverUrl` o `roomId` cambiano, il tuo Effetto si riconnetterà alla chat usando i nuovi valori.

**I [valori reattivi](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) includono props e tutte le variabili e funzioni dichiarate direttamente all'interno del componente.** Poiché `roomId` e `serverUrl` sono valori reattivi, non puoi rimuoverli dalle dipendenze. Se provi a ometterli e [il tuo linter è configurato correttamente per React,](/learn/editor-setup#linting) il linter segnalerà questo come un errore da correggere:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**Per rimuovere una dipendenza, devi ["dimostrare" al linter che *non ha bisogno* di essere una dipendenza.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** Per esempio, puoi spostare `serverUrl` fuori dal componente per dimostrare che non è reattivo e non cambierà alle ri-renderizzazioni:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Non è più un valore reattivo

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tutte le dipendenze dichiarate
  // ...
}
```

Ora che `serverUrl` non è un valore reattivo (e non può cambiare a una ri-renderizzazione), non ha bisogno di essere una dipendenza. **Se il codice del tuo Effetto non usa valori reattivi, il suo elenco di dipendenze dovrebbe essere vuoto (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Non è più un valore reattivo
const roomId = 'music'; // Non è più un valore reattivo

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Tutte le dipendenze dichiarate
  // ...
}
```

[Un Effetto con dipendenze vuote](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) non viene rieseguito quando cambiano le props o lo state del componente.

<Pitfall>

Se hai una codebase esistente, potresti avere alcuni Effetti che sopprimono il linter così:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Evita di sopprimere il linter così:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Quando le dipendenze non corrispondono al codice, c'è un alto rischio di introdurre bug.** Sopprimendo il linter, "menti" a React sui valori da cui dipende il tuo Effetto. [Invece, dimostra che sono non necessarie.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Esempi di passaggio di dipendenze reattive" titleId="examples-dependencies">

#### Passare un array di dipendenze {/*passing-a-dependency-array*/}

Se specifichi le dipendenze, il tuo Effetto viene eseguito **dopo la fase di commit iniziale _e_ dopo le fasi di commit con dipendenze cambiate.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Viene rieseguito se a o b sono diversi
```

Nell'esempio sotto, `serverUrl` e `roomId` sono [valori reattivi,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) quindi entrambi devono essere specificati come dipendenze. Di conseguenza, selezionare una room diversa nel menu a tendina o modificare l'input dell'URL del server fa riconnettere la chat. Tuttavia, poiché `message` non è usato nell'Effetto (e quindi non è una dipendenza), modificare il messaggio non riconnette la chat.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Passare un array di dipendenze vuoto {/*passing-an-empty-dependency-array*/}

Se il tuo Effetto davvero non usa valori reattivi, verrà eseguito solo **dopo la fase di commit iniziale.**

```js {3}
useEffect(() => {
  // ...
}, []); // Non viene rieseguito (tranne una volta in development)
```

**Anche con dipendenze vuote, setup e cleanup [verranno eseguiti un'extra volta in development](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) per aiutarti a trovare bug.**


In questo esempio, sia `serverUrl` che `roomId` sono hardcoded. Poiché sono dichiarati fuori dal componente, non sono valori reattivi e quindi non sono dipendenze. L'elenco delle dipendenze è vuoto, quindi l'Effetto non viene rieseguito alle ri-renderizzazioni.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### Non passare affatto un array di dipendenze {/*passing-no-dependency-array-at-all*/}

Se non passi affatto un array di dipendenze, il tuo Effetto viene eseguito **dopo ogni singola fase di commit** del componente.

```js {3}
useEffect(() => {
  // ...
}); // Viene sempre rieseguito
```

In questo esempio, l'Effetto viene rieseguito quando cambi `serverUrl` e `roomId`, il che ha senso. Tuttavia, viene rieseguito *anche* quando cambi `message`, il che probabilmente è indesiderato. Ecco perché di solito specificherai l'array di dipendenze.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // Nessun array di dipendenze

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Aggiornare lo state in base allo state precedente da un Effetto {/*updating-state-based-on-previous-state-from-an-effect*/}

Quando vuoi aggiornare lo state in base allo state precedente da un Effetto, potresti imbatterti in un problema:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Vuoi incrementare il contatore ogni secondo...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... ma specificare `count` come dipendenza resetta sempre l'intervallo.
  // ...
}
```

Poiché `count` è un valore reattivo, deve essere specificato nell'elenco delle dipendenze. Tuttavia, ciò fa sì che l'Effetto esegua cleanup e setup di nuovo ogni volta che `count` cambia. Non è ideale.

Per risolvere, [passa l'updater di state `c => c + 1`](/reference/react/useState#updating-state-based-on-the-previous-state) a `setCount`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Passa un updater di state
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Ora count non è una dipendenza

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Ora che passi `c => c + 1` invece di `count + 1`, [il tuo Effetto non ha più bisogno di dipendere da `count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) Come risultato di questa correzione, non dovrà eseguire cleanup e setup dell'intervallo di nuovo ogni volta che `count` cambia.

---


### Rimuovere dipendenze oggetto non necessarie {/*removing-unnecessary-object-dependencies*/}

Se il tuo Effetto dipende da un oggetto o una funzione creati durante la renderizzazione, potrebbe essere eseguito troppo spesso. Per esempio, questo Effetto si riconnette dopo ogni fase di commit perché l'oggetto `options` è [diverso a ogni renderizzazione:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 Questo oggetto viene creato da zero a ogni ri-renderizzazione
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // Viene usato all'interno dell'Effetto
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 Di conseguenza, queste dipendenze sono sempre diverse a ogni fase di commit
  // ...
```

Evita di usare un oggetto creato durante la renderizzazione come dipendenza. Invece, crea l'oggetto all'interno dell'Effetto:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Ora che crei l'oggetto `options` all'interno dell'Effetto, l'Effetto stesso dipende solo dalla stringa `roomId`.

Con questa correzione, digitare nell'input non riconnette la chat. A differenza di un oggetto che viene ricreato, una stringa come `roomId` non cambia a meno che non la imposti a un altro valore. [Leggi di più sulla rimozione delle dipendenze.](/learn/removing-effect-dependencies)

---

### Rimuovere dipendenze funzione non necessarie {/*removing-unnecessary-function-dependencies*/}

Se il tuo Effetto dipende da un oggetto o una funzione creati durante la renderizzazione, potrebbe essere eseguito troppo spesso. Per esempio, questo Effetto si riconnette dopo ogni fase di commit perché la funzione `createOptions` è [diversa a ogni renderizzazione:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 Questa funzione viene creata da zero a ogni ri-renderizzazione
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // Viene usata all'interno dell'Effetto
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 Di conseguenza, queste dipendenze sono sempre diverse a ogni fase di commit
  // ...
```

Di per sé, creare una funzione da zero a ogni ri-renderizzazione non è un problema. Non devi ottimizzare quello. Tuttavia, se la usi come dipendenza del tuo Effetto, farà rieseguire l'Effetto dopo ogni fase di commit.

Evita di usare una funzione creata durante la renderizzazione come dipendenza. Invece, dichiarala all'interno dell'Effetto:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Ora che definisci la funzione `createOptions` all'interno dell'Effetto, l'Effetto stesso dipende solo dalla stringa `roomId`. Con questa correzione, digitare nell'input non riconnette la chat. A differenza di una funzione che viene ricreata, una stringa come `roomId` non cambia a meno che non la imposti a un altro valore. [Leggi di più sulla rimozione delle dipendenze.](/learn/removing-effect-dependencies)

---

### Leggere le props e lo state più recenti da un Effetto {/*reading-the-latest-props-and-state-from-an-effect*/}

Per impostazione predefinita, quando leggi un valore reattivo da un Effetto, devi aggiungerlo come dipendenza. Questo garantisce che il tuo Effetto "reagisca" a ogni cambiamento di quel valore. Per la maggior parte delle dipendenze, è il comportamento che vuoi.

**Tuttavia, a volte vorrai leggere le props e lo state *più recenti* da un Effetto senza "reagire" ad essi.** Per esempio, immagina di voler registrare il numero di articoli nel carrello per ogni visita alla pagina:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ Tutte le dipendenze dichiarate
  // ...
}
```

**E se volessi registrare una nuova visita alla pagina dopo ogni cambiamento di `url`, ma *non* se cambia solo `shoppingCart`?** Non puoi escludere `shoppingCart` dalle dipendenze senza violare le [regole di reattività.](#specifying-reactive-dependencies) Tuttavia, puoi esprimere che *non vuoi* che un pezzo di codice "reagisca" ai cambiamenti anche se viene chiamato dall'interno di un Effetto. [Dichiara un *Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event) con l'Hook [`useEffectEvent`](/reference/react/useEffectEvent) e sposta il codice che legge `shoppingCart` al suo interno:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Tutte le dipendenze dichiarate
  // ...
}
```

**Gli Effect Event non sono reattivi e devono sempre essere omessi dalle dipendenze del tuo Effetto.** Questo ti permette di mettere codice non reattivo (dove puoi leggere il valore più recente di props e state) al loro interno. Leggendo `shoppingCart` all'interno di `onVisit`, garantisci che `shoppingCart` non farà rieseguire il tuo Effetto.

[Leggi di più su come gli Effect Event ti permettono di separare codice reattivo e non reattivo.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### Mostrare contenuti diversi sul server e sul client {/*displaying-different-content-on-the-server-and-the-client*/}

Se la tua app usa la renderizzazione lato server (sia [direttamente](/reference/react-dom/server) che tramite un [framework](/learn/creating-a-react-app#full-stack-frameworks)), il componente verrà renderizzato in due ambienti diversi. Sul server, verrà renderizzato per produrre l'HTML iniziale. Sul client, React eseguirà di nuovo il codice di renderizzazione così da poter collegare i gestori di eventi a quell'HTML. Ecco perché, affinché l'[hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) funzioni, l'output della renderizzazione iniziale deve essere identico sul client e sul server.

In casi rari, potresti aver bisogno di mostrare contenuti diversi sul client. Per esempio, se la tua app legge dei dati da [`localStorage`](https://developer.mozilla.org/it/docs/Web/API/Window/localStorage), non può farlo sul server. Ecco come potresti implementarlo:


{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [5]}}
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
}
```

Mentre l'app si carica, l'utente vedrà l'output della renderizzazione iniziale. Poi, quando è caricata e idratata, il tuo Effetto verrà eseguito e imposterà `didMount` a `true`, avviando una ri-renderizzazione. Questo passerà all'output di renderizzazione solo client. Gli Effetti non vengono eseguiti sul server, ecco perché `didMount` era `false` durante la renderizzazione iniziale lato server.

Usa questo pattern con parsimonia. Tieni presente che gli utenti con una connessione lenta vedranno il contenuto iniziale per parecchio tempo — potenzialmente, molti secondi — quindi non vuoi fare cambiamenti bruschi all'aspetto del componente. In molti casi, puoi evitare la necessità di questo mostrando condizionalmente cose diverse con CSS.

---

## Troubleshooting {/*troubleshooting*/}

### Il mio Effetto viene eseguito due volte quando il componente monta {/*my-effect-runs-twice-when-the-component-mounts*/}

Quando Strict Mode è attivo, in development, React esegue setup e cleanup un'extra volta prima del setup effettivo.

È un test di stress che verifica che la logica del tuo Effetto sia implementata correttamente. Se questo causa problemi visibili, alla funzione di cleanup manca della logica. La funzione di cleanup dovrebbe fermare o annullare ciò che faceva la funzione di setup. La regola generale è che l'utente non dovrebbe poter distinguere tra il setup chiamato una volta (come in production) e una sequenza setup → cleanup → setup (come in development).

Leggi di più su [come questo aiuta a trovare bug](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) e [come correggere la logica.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Il mio Effetto viene eseguito dopo ogni ri-renderizzazione {/*my-effect-runs-after-every-re-render*/}

Per prima cosa, verifica di non aver dimenticato di specificare l'array di dipendenze:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 Nessun array di dipendenze: viene rieseguito dopo ogni fase di commit!
```

Se hai specificato l'array di dipendenze ma il tuo Effetto continua a rieseguirsi in loop, è perché una delle dipendenze è diversa a ogni ri-renderizzazione.

Puoi debuggare questo problema registrando manualmente le dipendenze nella console:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Poi puoi fare clic destro sugli array di ri-renderizzazioni diverse nella console e selezionare "Store as a global variable" per entrambi. Supponendo che il primo sia stato salvato come `temp1` e il secondo come `temp2`, puoi usare la console del browser per verificare se ogni dipendenza in entrambi gli array è la stessa:

```js
Object.is(temp1[0], temp2[0]); // La prima dipendenza è la stessa tra gli array?
Object.is(temp1[1], temp2[1]); // La seconda dipendenza è la stessa tra gli array?
Object.is(temp1[2], temp2[2]); // ... e così via per ogni dipendenza ...
```

Quando trovi la dipendenza che è diversa a ogni ri-renderizzazione, di solito puoi correggerla in uno di questi modi:

- [Aggiornare lo state in base allo state precedente da un Effetto](#updating-state-based-on-previous-state-from-an-effect)
- [Rimuovere dipendenze oggetto non necessarie](#removing-unnecessary-object-dependencies)
- [Rimuovere dipendenze funzione non necessarie](#removing-unnecessary-function-dependencies)
- [Leggere le props e lo state più recenti da un Effetto](#reading-the-latest-props-and-state-from-an-effect)

Come ultima risorsa (se questi metodi non hanno aiutato), avvolgi la sua creazione con [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) o [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (per le funzioni).

---

### Il mio Effetto continua a rieseguirsi in un ciclo infinito {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Se il tuo Effetto viene eseguito in un ciclo infinito, queste due cose devono essere vere:

- Il tuo Effetto sta aggiornando dello state.
- Quello state porta a una ri-renderizzazione, che fa cambiare le dipendenze dell'Effetto.

Prima di iniziare a correggere il problema, chiediti se il tuo Effetto si sta connettendo a un sistema esterno (come DOM, rete, un widget di terze parti, e così via). Perché il tuo Effetto ha bisogno di impostare lo state? Si sincronizza con quel sistema esterno? O stai cercando di gestire il flusso di dati dell'applicazione con esso?

Se non c'è un sistema esterno, considera se [rimuovere l'Effetto del tutto](/learn/you-might-not-need-an-effect) semplificherebbe la logica.

Se ti stai sincronizzando genuinamente con un sistema esterno, pensa a perché e in quali condizioni il tuo Effetto dovrebbe aggiornare lo state. È cambiato qualcosa che influisce sull'output visivo del componente? Se devi tenere traccia di dati non usati dalla renderizzazione, un [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (che non avvia ri-renderizzazioni) potrebbe essere più appropriato. Verifica che il tuo Effetto non aggiorni lo state (e avvii ri-renderizzazioni) più del necessario.

Infine, se il tuo Effetto aggiorna lo state al momento giusto, ma c'è ancora un loop, è perché quell'aggiornamento di state fa cambiare una delle dipendenze dell'Effetto. [Leggi come debuggare i cambiamenti delle dipendenze.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### La mia logica di cleanup viene eseguita anche se il componente non ha smontato {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

La funzione di cleanup viene eseguita non solo durante lo smontaggio, ma prima di ogni ri-renderizzazione con dipendenze cambiate. Inoltre, in development, React [esegue setup+cleanup un'extra volta subito dopo il mount del componente.](#my-effect-runs-twice-when-the-component-mounts)

Se hai codice di cleanup senza codice di setup corrispondente, di solito è un code smell:

```js {2-5}
useEffect(() => {
  // 🔴 Evita: logica di cleanup senza logica di setup corrispondente
  return () => {
    doSomething();
  };
}, []);
```

La logica di cleanup dovrebbe essere "simmetrica" alla logica di setup, e dovrebbe fermare o annullare ciò che ha fatto il setup:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Scopri come il lifecycle dell'Effetto è diverso dal lifecycle del componente.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Il mio Effetto fa qualcosa di visivo e vedo uno sfarfallio prima che venga eseguito {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Se il tuo Effetto deve impedire al browser di [dipingere lo schermo,](/learn/render-and-commit#epilogue-browser-paint) sostituisci `useEffect` con [`useLayoutEffect`](/reference/react/useLayoutEffect). Nota che **non dovrebbe servire per la stragrande maggioranza degli Effetti.** Ne avrai bisogno solo se è cruciale eseguire l'Effetto prima del paint del browser: per esempio, per misurare e posizionare un tooltip prima che l'utente lo veda.
