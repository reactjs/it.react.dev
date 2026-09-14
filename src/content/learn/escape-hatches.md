---
title: Soluzioni alternative
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/escape-hatches.md).

</Note>

<Intro>

Alcuni dei tuoi componenti potrebbero dover controllare e sincronizzarsi con sistemi esterni a React. Per esempio, potresti dover mettere a fuoco un input usando le API del browser, avviare e mettere in pausa un lettore video implementato senza React, o connetterti e ascoltare messaggi da un server remoto. In questo capitolo imparerai gli escape hatch che ti permettono di "uscire" da React e connetterti a sistemi esterni. La maggior parte della logica della tua applicazione e del flusso di dati non dovrebbe basarsi su queste funzionalità.

</Intro>

<YouWillLearn isChapter={true}>

* [Come "ricordare" informazioni senza ri-renderizzare](/learn/referencing-values-with-refs)
* [Come accedere agli elementi DOM gestiti da React](/learn/manipulating-the-dom-with-refs)
* [Come sincronizzare i componenti con sistemi esterni](/learn/synchronizing-with-effects)
* [Come rimuovere Effetti non necessari dai tuoi componenti](/learn/you-might-not-need-an-effect)
* [In che modo il ciclo di vita di un Effetto è diverso da quello di un componente](/learn/lifecycle-of-reactive-effects)
* [Come impedire che alcuni valori riattivino gli Effetti](/learn/separating-events-from-effects)
* [Come far rieseguire un Effetto meno spesso](/learn/removing-effect-dependencies)
* [Come condividere logica tra componenti](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Referenziare valori con i ref {/*referencing-values-with-refs*/}

Quando vuoi che un componente "ricordi" un'informazione, ma non vuoi che quell'informazione [avvii nuove renderizzazioni](/learn/render-and-commit), puoi usare un *ref*:

```js
const ref = useRef(0);
```

Come lo state, i ref vengono conservati da React tra le ri-renderizzazioni. Tuttavia, impostare lo state ri-renderizza un componente. Modificare un ref no! Puoi accedere al valore corrente di quel ref tramite la proprietà `ref.current`.

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

Un ref è come una tasca segreta del tuo componente che React non traccia. Per esempio, puoi usare i ref per memorizzare [ID di timeout](https://developer.mozilla.org/it/docs/Web/API/setTimeout#return_value), [elementi DOM](https://developer.mozilla.org/it/docs/Web/API/Element) e altri oggetti che non influenzano l'output di renderizzazione del componente.

<LearnMore path="/learn/referencing-values-with-refs">

Leggi **[Referenziare valori con i ref](/learn/referencing-values-with-refs)** per imparare a usare i ref per ricordare informazioni.

</LearnMore>

## Manipolare il DOM con i ref {/*manipulating-the-dom-with-refs*/}

React aggiorna automaticamente il DOM per corrispondere al tuo output di renderizzazione, quindi i tuoi componenti non dovranno spesso manipolarlo. Tuttavia, a volte potresti aver bisogno di accedere agli elementi DOM gestiti da React — per esempio, per mettere a fuoco un nodo, scorrere fino ad esso o misurarne dimensioni e posizione. Non c'è un modo integrato in React per fare queste cose, quindi avrai bisogno di un ref al nodo DOM. Per esempio, cliccando il pulsante metterà a fuoco l'input usando un ref:

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

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Leggi **[Manipolare il DOM con i ref](/learn/manipulating-the-dom-with-refs)** per imparare ad accedere agli elementi DOM gestiti da React.

</LearnMore>

## Sincronizzare con gli Effetti {/*synchronizing-with-effects*/}

Alcuni componenti devono sincronizzarsi con sistemi esterni. Per esempio, potresti voler controllare un componente non-React in base allo state di React, impostare una connessione al server o inviare un log di analytics quando un componente appare sullo schermo. A differenza dei gestori di eventi, che ti permettono di gestire eventi particolari, gli *Effetti* ti permettono di eseguire del codice dopo la renderizzazione. Usali per sincronizzare il tuo componente con un sistema esterno a React.

Premi Play/Pause qualche volta e osserva come il lettore video resta sincronizzato con il valore della prop `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Molti Effetti si "ripuliscono" anche da soli. Per esempio, un Effetto che imposta una connessione a un server di chat dovrebbe restituire una *funzione di cleanup* che dice a React come disconnettere il tuo componente da quel server:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

In sviluppo, React eseguirà e ripulirà immediatamente il tuo Effetto un'ulteriore volta. Ecco perché vedi `"✅ Connecting..."` stampato due volte. Questo garantisce che non dimentichi di implementare la funzione di cleanup.

<LearnMore path="/learn/synchronizing-with-effects">

Leggi **[Sincronizzare con gli Effetti](/learn/synchronizing-with-effects)** per imparare a sincronizzare i componenti con sistemi esterni.

</LearnMore>

## Potresti non avere bisogno di un Effetto {/*you-might-not-need-an-effect*/}

Gli Effetti sono un escape hatch dal paradigma di React. Ti permettono di "uscire" da React e sincronizzare i tuoi componenti con un sistema esterno. Se non c'è un sistema esterno coinvolto (per esempio, se vuoi aggiornare lo state di un componente quando cambiano alcune props o lo state), non dovresti aver bisogno di un Effetto. Rimuovere Effetti non necessari renderà il tuo codice più facile da seguire, più veloce da eseguire e meno soggetto a errori.

Ci sono due casi comuni in cui non hai bisogno degli Effetti:
- **Non hai bisogno degli Effetti per trasformare dati per la renderizzazione.**
- **Non hai bisogno degli Effetti per gestire eventi dell'utente.**

Per esempio, non hai bisogno di un Effetto per regolare dello state in base ad altro state:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Invece, calcola il più possibile durante la renderizzazione:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Tuttavia, *hai* bisogno degli Effetti per sincronizzarti con sistemi esterni.

<LearnMore path="/learn/you-might-not-need-an-effect">

Leggi **[Potresti non avere bisogno di un Effetto](/learn/you-might-not-need-an-effect)** per imparare a rimuovere Effetti non necessari.

</LearnMore>

## Ciclo di vita degli Effetti reattivi {/*lifecycle-of-reactive-effects*/}

Gli Effetti hanno un ciclo di vita diverso dai componenti. I componenti possono montare, aggiornarsi o smontarsi. Un Effetto può fare solo due cose: avviare la sincronizzazione di qualcosa e, in seguito, fermarla. Questo ciclo può ripetersi più volte se il tuo Effetto dipende da props e state che cambiano nel tempo.

Questo Effetto dipende dal valore della prop `roomId`. Le props sono *valori reattivi,* il che significa che possono cambiare a ogni ri-renderizzazione. Nota che l'Effetto si *re-sincronizza* (e si riconnette al server) se `roomId` cambia:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
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

React fornisce una regola del linter per verificare che tu abbia specificato correttamente le dipendenze del tuo Effetto. Se dimentichi di specificare `roomId` nell'elenco delle dipendenze nell'esempio sopra, il linter troverà automaticamente quel bug.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Leggi **[Ciclo di vita degli Effetti reattivi](/learn/lifecycle-of-reactive-effects)** per imparare in che modo il ciclo di vita di un Effetto è diverso da quello di un componente.

</LearnMore>

## Separare eventi ed Effetti {/*separating-events-from-effects*/}

I gestori di eventi vengono rieseguiti solo quando ripeti la stessa interazione. A differenza dei gestori di eventi, gli Effetti si re-sincronizzano se un valore che leggono, come una prop o lo state, è diverso rispetto all'ultima renderizzazione. A volte vuoi un mix di entrambi i comportamenti: un Effetto che si riesegue in risposta ad alcuni valori ma non ad altri.

Tutto il codice all'interno degli Effetti è *reattivo.* Verrà eseguito di nuovo se un valore reattivo che legge è cambiato a causa di una ri-renderizzazione. Per esempio, questo Effetto si riconnetterà alla chat se `roomId` o `theme` sono cambiati:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Non è ideale. Vuoi riconnetterti alla chat solo se `roomId` è cambiato. Cambiare il `theme` non dovrebbe riconnetterti alla chat! Sposta il codice che legge `theme` fuori dal tuo Effetto in un *Effect Event*:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Il codice all'interno degli Effect Event non è reattivo, quindi cambiare il `theme` non fa più riconnettere il tuo Effetto.

<LearnMore path="/learn/separating-events-from-effects">

Leggi **[Separare eventi ed Effetti](/learn/separating-events-from-effects)** per imparare a impedire che alcuni valori riattivino gli Effetti.

</LearnMore>

## Rimuovere le dipendenze degli Effetti {/*removing-effect-dependencies*/}

Quando scrivi un Effetto, il linter verifica che tu abbia incluso ogni valore reattivo (come props e state) che l'Effetto legge nell'elenco delle dipendenze del tuo Effetto. Questo garantisce che il tuo Effetto resti sincronizzato con le props e lo state più recenti del tuo componente. Dipendenze non necessarie possono far eseguire il tuo Effetto troppo spesso, o persino creare un loop infinito. Il modo in cui le rimuovi dipende dal caso.

Per esempio, questo Effetto dipende dall'oggetto `options` che viene ricreato ogni volta che modifichi l'input:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

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
  // A real implementation would actually connect to the server
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

Non vuoi che la chat si riconnetta ogni volta che inizi a digitare un messaggio in quella chat. Per risolvere questo problema, sposta la creazione dell'oggetto `options` all'interno dell'Effetto in modo che l'Effetto dipenda solo dalla stringa `roomId`:

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
  // A real implementation would actually connect to the server
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

Nota che non hai iniziato modificando l'elenco delle dipendenze per rimuovere la dipendenza `options`. Sarebbe sbagliato. Invece, hai cambiato il codice circostante in modo che la dipendenza diventasse *non necessaria.* Pensa all'elenco delle dipendenze come a un elenco di tutti i valori reattivi usati dal codice del tuo Effetto. Non scegli intenzionalmente cosa mettere in quell'elenco. L'elenco descrive il tuo codice. Per cambiare l'elenco delle dipendenze, cambia il codice.

<LearnMore path="/learn/removing-effect-dependencies">

Leggi **[Rimuovere le dipendenze degli Effetti](/learn/removing-effect-dependencies)** per imparare a far rieseguire un Effetto meno spesso.

</LearnMore>

## Riutilizzare logica con Custom Hook {/*reusing-logic-with-custom-hooks*/}

React include diversi Hook integrati come `useState`, `useContext` e `useEffect`. A volte vorresti che esistesse un Hook per uno scopo più specifico: ad esempio, per recuperare dati, per tenere traccia se l'utente è online o per connettersi a una chat room. Per farlo, puoi creare i tuoi Hook per le esigenze della tua applicazione.

In questo esempio, il custom Hook `usePointerPosition` tiene traccia della posizione del cursore, mentre il custom Hook `useDelayedValue` restituisce un valore che "resta indietro" rispetto al valore che hai passato di un certo numero di millisecondi. Muovi il cursore sull'area di anteprima della sandbox per vedere una scia di punti che segue il cursore:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
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

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Puoi creare custom Hook, comporli insieme, passare dati tra loro e riutilizzarli tra componenti. Man mano che la tua app cresce, scriverai meno Effetti a mano perché potrai riutilizzare i custom Hook che hai già scritto. Ci sono anche molti ottimi custom Hook mantenuti dalla community React.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Leggi **[Riutilizzare logica con Custom Hook](/learn/reusing-logic-with-custom-hooks)** per imparare a condividere logica tra componenti.

</LearnMore>

## Cosa fare dopo? {/*whats-next*/}

Vai su [Referenziare valori con i ref](/learn/referencing-values-with-refs) per iniziare a leggere questo capitolo pagina per pagina!
