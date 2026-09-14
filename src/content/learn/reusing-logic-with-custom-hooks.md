---
title: Riutilizzare logica con Custom Hook
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/reusing-logic-with-custom-hooks.md).

</Note>

<Intro>

React include diversi Hook integrati come `useState`, `useContext` e `useEffect`. A volte vorresti che esistesse un Hook per uno scopo più specifico: ad esempio, per recuperare dati, per tenere traccia se l'utente è online o per connettersi a una chat room. Potresti non trovare questi Hook in React, ma puoi creare i tuoi Hook per le esigenze della tua applicazione.

</Intro>

<YouWillLearn>

- Cosa sono i custom Hook e come scriverne uno tuo
- Come riutilizzare logica tra componenti
- Come nominare e strutturare i tuoi custom Hook
- Quando e perché estrarre custom Hook

</YouWillLearn>

## Custom Hook: condividere logica tra componenti {/*custom-hooks-sharing-logic-between-components*/}

Immagina di sviluppare un'app che dipende molto dalla rete (come la maggior parte delle app). Vuoi avvisare l'utente se la connessione di rete si è interrotta accidentalmente mentre usava la tua app. Come procederesti? Sembra che ti serviranno due cose nel tuo componente:

1. Una variabile di state che tiene traccia se la rete è online.
2. Un Effetto che si sottoscrive agli eventi globali [`online`](https://developer.mozilla.org/it/docs/Web/API/Window/online_event) e [`offline`](https://developer.mozilla.org/it/docs/Web/API/Window/offline_event), e aggiorna lo state.

Questo manterrà il tuo componente [sincronizzato](/learn/synchronizing-with-effects) con la connessione di rete. Potresti iniziare con qualcosa del genere:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

Prova ad attivare e disattivare la rete, e nota come questo `StatusBar` si aggiorna in risposta alle tue azioni.

Ora immagina di voler usare *anche* la stessa logica in un componente diverso. Vuoi implementare un pulsante Save che diventa disabilitato e mostra "Reconnecting..." invece di "Save" mentre la rete è offline.

Per iniziare, puoi copiare e incollare lo state `isOnline` e l'Effetto in `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

Verifica che, se disattivi la rete, il pulsante cambi aspetto.

Questi due componenti funzionano bene, ma la duplicazione di logica tra loro è sfortunata. Sembra che, anche se hanno un *aspetto visivo* diverso, tu voglia riutilizzare la logica tra loro.

### Estrarre un custom Hook da un componente {/*extracting-your-own-custom-hook-from-a-component*/}

Immagina per un momento che, simile a [`useState`](/reference/react/useState) e [`useEffect`](/reference/react/useEffect), esistesse un Hook integrato `useOnlineStatus`. Allora entrambi questi componenti potrebbero essere semplificati e potresti rimuovere la duplicazione tra loro:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

Anche se non esiste un Hook integrato del genere, puoi scriverlo tu. Dichiara una funzione chiamata `useOnlineStatus` e sposta tutto il codice duplicato al suo interno dai componenti che hai scritto prima:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Alla fine della funzione, restituisci `isOnline`. Questo permette ai tuoi componenti di leggere quel valore:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Verifica che attivare e disattivare la rete aggiorni entrambi i componenti.

Ora i tuoi componenti non hanno più tanta logica ripetitiva. **Ancora più importante, il codice al loro interno descrive *cosa vogliono fare* (usare lo status online!) piuttosto che *come farlo* (sottoscrivendosi agli eventi del browser).**

Quando estrai logica in custom Hook, puoi nascondere i dettagli complessi di come gestisci un sistema esterno o un'API del browser. Il codice dei tuoi componenti esprime la tua intenzione, non l'implementazione.

### I nomi degli Hook iniziano sempre con `use` {/*hook-names-always-start-with-use*/}

Le applicazioni React sono costruite da componenti. I componenti sono costruiti da Hook, sia integrati che custom. Probabilmente userai spesso custom Hook creati da altri, ma occasionalmente potresti scriverne uno tu!

Devi seguire queste convenzioni di denominazione:

1. **I nomi dei componenti React devono iniziare con una lettera maiuscola,** come `StatusBar` e `SaveButton`. I componenti React devono anche restituire qualcosa che React sa come visualizzare, come un pezzo di JSX.
2. **I nomi degli Hook devono iniziare con `use` seguito da una lettera maiuscola,** come [`useState`](/reference/react/useState) (integrato) o `useOnlineStatus` (custom, come prima in questa pagina). Gli Hook possono restituire valori arbitrari.

Questa convenzione garantisce che tu possa sempre guardare un componente e sapere dove potrebbero "nascondersi" il suo state, gli Effetti e altre funzionalità React. Ad esempio, se vedi una chiamata a `getColor()` dentro il tuo componente, puoi essere sicuro che non può contenere state React al suo interno perché il suo nome non inizia con `use`. Tuttavia, una chiamata a funzione come `useOnlineStatus()` conterrà molto probabilmente chiamate ad altri Hook al suo interno!

<Note>

Se il tuo linter è [configurato per React,](/learn/editor-setup#linting) applicherà questa convenzione di denominazione. Scorri fino al sandbox sopra e rinomina `useOnlineStatus` in `getOnlineStatus`. Nota che il linter non ti permetterà più di chiamare `useState` o `useEffect` al suo interno. Solo gli Hook e i componenti possono chiamare altri Hook!

</Note>

<DeepDive>

#### Tutte le funzioni chiamate durante la renderizzazione devono iniziare con il prefisso use? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

No. Le funzioni che non *chiamano* Hook non devono *essere* Hook.

Se la tua funzione non chiama alcun Hook, evita il prefisso `use`. Scrivila invece come una funzione regolare *senza* il prefisso `use`. Ad esempio, `useSorted` qui sotto non chiama Hook, quindi chiamala `getSorted`:

```js
// 🔴 Avoid: A Hook that doesn't use Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good: A regular function that doesn't use Hooks
function getSorted(items) {
  return items.slice().sort();
}
```

Questo garantisce che il tuo codice possa chiamare questa funzione regolare ovunque, incluse le condizioni:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ It's ok to call getSorted() conditionally because it's not a Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

Dovresti dare il prefisso `use` a una funzione (e quindi renderla un Hook) se usa almeno un Hook al suo interno:

```js
// ✅ Good: A Hook that uses other Hooks
function useAuth() {
  return useContext(Auth);
}
```

Tecnicamente, React non lo impone. In linea di principio, potresti creare un Hook che non chiama altri Hook. Questo è spesso confuso e limitante, quindi è meglio evitare quel pattern. Tuttavia, ci possono essere casi rari in cui è utile. Ad esempio, forse la tua funzione non usa alcun Hook adesso, ma prevedi di aggiungere chiamate ad Hook in futuro. Allora ha senso nominarla con il prefisso `use`:

```js {3-4}
// ✅ Good: A Hook that will likely use some other Hooks later
function useAuth() {
  // TODO: Replace with this line when authentication is implemented:
  // return useContext(Auth);
  return TEST_USER;
}
```

Allora i componenti non potranno chiamarlo condizionalmente. Questo diventerà importante quando aggiungerai effettivamente chiamate ad Hook al suo interno. Se non prevedi di usare Hook al suo interno (adesso o in futuro), non renderlo un Hook.

</DeepDive>

### I custom Hook ti permettono di condividere logica con state, non lo state stesso {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

Nell'esempio precedente, quando attivavi e disattivavi la rete, entrambi i componenti si aggiornavano insieme. Tuttavia, è sbagliato pensare che una singola variabile di state `isOnline` sia condivisa tra loro. Guarda questo codice:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Funziona allo stesso modo di prima che tu estraessi la duplicazione:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Queste sono due variabili di state ed Effetti completamente indipendenti! Hanno avuto lo stesso valore nello stesso momento perché li hai sincronizzati con lo stesso valore esterno (se la rete è attiva).

Per illustrarlo meglio, avremo bisogno di un esempio diverso. Considera questo componente `Form`:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

C'è della logica ripetitiva per ogni campo del form:

1. C'è una variabile di state (`firstName` e `lastName`).
1. C'è un gestore di cambiamento (`handleFirstNameChange` e `handleLastNameChange`).
1. C'è un pezzo di JSX che specifica gli attributi `value` e `onChange` per quell'input.

Puoi estrarre la logica ripetitiva in questo custom Hook `useFormInput`:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Nota che dichiara solo *una* variabile di state chiamata `value`.

Tuttavia, il componente `Form` chiama `useFormInput` *due volte:*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

Ecco perché funziona come dichiarare due variabili di state separate!

**I custom Hook ti permettono di condividere *logica con state* ma non *lo state stesso.* Ogni chiamata a un Hook è completamente indipendente da ogni altra chiamata allo stesso Hook.** Ecco perché i due sandbox sopra sono completamente equivalenti. Se vuoi, scorri indietro e confrontali. Il comportamento prima e dopo l'estrazione di un custom Hook è identico.

Quando devi condividere lo state stesso tra più componenti, [sollevalo e passalo in giù](/learn/sharing-state-between-components).

## Passare valori reattivi tra Hook {/*passing-reactive-values-between-hooks*/}

Il codice all'interno dei tuoi custom Hook verrà rieseguito ad ogni ri-renderizzazione del tuo componente. Ecco perché, come i componenti, i custom Hook [devono essere puri.](/learn/keeping-components-pure) Pensa al codice dei custom Hook come parte del corpo del tuo componente!

Poiché i custom Hook si ri-renderizzano insieme al tuo componente, ricevono sempre le props e lo state più recenti. Per capire cosa significa, considera questo esempio di chat room. Cambia l'URL del server o la chat room:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Quando cambi `serverUrl` o `roomId`, l'Effetto ["reagisce" ai tuoi cambiamenti](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) e si re-sincronizza. Puoi capirlo dai messaggi in console che la chat si riconnette ogni volta che cambi le dipendenze del tuo Effetto.

Ora sposta il codice dell'Effetto in un custom Hook:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Questo permette al tuo componente `ChatRoom` di chiamare il tuo custom Hook senza preoccuparsi di come funziona al suo interno:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

Sembra molto più semplice! (Ma fa la stessa cosa.)

Nota che la logica *risponde ancora* ai cambiamenti di props e state. Prova a modificare l'URL del server o la room selezionata:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Nota come stai prendendo il valore restituito da un Hook:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

e lo stai passando come input a un altro Hook:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Ogni volta che il tuo componente `ChatRoom` si ri-renderizza, passa i valori più recenti di `roomId` e `serverUrl` al tuo Hook. Ecco perché il tuo Effetto si riconnette alla chat ogni volta che i loro valori sono diversi dopo una ri-renderizzazione. (Se hai mai lavorato con software di elaborazione audio o video, concatenare Hook in questo modo potrebbe ricordarti la concatenazione di effetti visivi o audio. È come se l'output di `useState` "alimentasse" l'input di `useChatRoom`.)

### Passare gestori di eventi ai custom Hook {/*passing-event-handlers-to-custom-hooks*/}

Quando inizi a usare `useChatRoom` in più componenti, potresti voler permettere ai componenti di personalizzarne il comportamento. Ad esempio, attualmente la logica per cosa fare quando arriva un messaggio è hardcoded dentro l'Hook:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Supponiamo che tu voglia spostare questa logica di nuovo nel tuo componente:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

Per far funzionare tutto, modifica il tuo custom Hook per accettare `onReceiveMessage` come una delle sue opzioni nominate:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared
}
```

Funzionerà, ma c'è un altro miglioramento che puoi fare quando il tuo custom Hook accetta gestori di eventi.

Aggiungere una dipendenza su `onReceiveMessage` non è ideale perché farà riconnettersi la chat ogni volta che il componente si ri-renderizza. [Avvolgi questo gestore di eventi in un Effect Event per rimuoverlo dalle dipendenze:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
}
```

Ora la chat non si riconnetterà ogni volta che il componente `ChatRoom` si ri-renderizza. Ecco una demo completamente funzionante del passaggio di un gestore di eventi a un custom Hook con cui puoi sperimentare:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Nota come non hai più bisogno di sapere *come* funziona `useChatRoom` per usarlo. Potresti aggiungerlo a qualsiasi altro componente, passare qualsiasi altra opzione, e funzionerebbe allo stesso modo. Questo è il potere dei custom Hook.

## Quando usare i custom Hook {/*when-to-use-custom-hooks*/}

Non devi estrarre un custom Hook per ogni piccolo pezzo di codice duplicato. Un po' di duplicazione va bene. Ad esempio, estrarre un Hook `useFormInput` per avvolgere una singola chiamata a `useState` come prima è probabilmente inutile.

Tuttavia, ogni volta che scrivi un Effetto, considera se sarebbe più chiaro avvolgerlo anche in un custom Hook. [Non dovresti aver bisogno degli Effetti molto spesso,](/learn/you-might-not-need-an-effect) quindi se ne stai scrivendo uno, significa che devi "uscire da React" per sincronizzarti con un sistema esterno o fare qualcosa per cui React non ha un'API integrata. Avvolgerlo in un custom Hook ti permette di comunicare con precisione la tua intenzione e come i dati fluiscono attraverso di esso.

Ad esempio, considera un componente `ShippingForm` che mostra due menu a tendina: uno mostra l'elenco delle città e l'altro mostra l'elenco delle zone nella città selezionata. Potresti iniziare con del codice che assomiglia a questo:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // This Effect fetches cities for a country
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // This Effect fetches areas for the selected city
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Anche se questo codice è piuttosto ripetitivo, [è corretto mantenere questi Effetti separati l'uno dall'altro.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Sincronizzano due cose diverse, quindi non dovresti unirli in un unico Effetto. Invece, puoi semplificare il componente `ShippingForm` sopra estraendo la logica comune tra loro nel tuo Hook `useData`:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Ora puoi sostituire entrambi gli Effetti nei componenti `ShippingForm` con chiamate a `useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Estrarre un custom Hook rende esplicito il flusso dei dati. Passi l'`url` in ingresso e ottieni i `data` in uscita. "Nascondendo" il tuo Effetto dentro `useData`, impedisci anche a chi lavora sul componente `ShippingForm` di aggiungere [dipendenze non necessarie](/learn/removing-effect-dependencies). Con il tempo, la maggior parte degli Effetti della tua app sarà in custom Hook.

<DeepDive>

#### Mantieni i tuoi custom Hook focalizzati su casi d'uso concreti ad alto livello {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Inizia scegliendo il nome del tuo custom Hook. Se fai fatica a scegliere un nome chiaro, potrebbe significare che il tuo Effetto è troppo accoppiato al resto della logica del componente e non è ancora pronto per essere estratto.

Idealmente, il nome del tuo custom Hook dovrebbe essere abbastanza chiaro che anche una persona che non scrive codice spesso potrebbe indovinare cosa fa il tuo custom Hook, cosa accetta e cosa restituisce:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Quando ti sincronizzi con un sistema esterno, il nome del tuo custom Hook può essere più tecnico e usare il gergo specifico di quel sistema. Va bene purché sia chiaro per una persona familiare con quel sistema:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Mantieni i custom Hook focalizzati su casi d'uso concreti ad alto livello.** Evita di creare e usare custom Hook "lifecycle" che agiscono come alternative e wrapper di comodità per l'API `useEffect` stessa:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Ad esempio, questo Hook `useMount` cerca di garantire che del codice venga eseguito solo "al mount":

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Avoid: using custom "lifecycle" Hooks
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Avoid: creating custom "lifecycle" Hooks
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**I custom Hook "lifecycle" come `useMount` non si adattano bene al paradigma React.** Ad esempio, questo esempio di codice ha un errore (non "reagisce" ai cambiamenti di `roomId` o `serverUrl`), ma il linter non ti avviserà perché controlla solo le chiamate dirette a `useEffect`. Non conoscerà il tuo Hook.

Se stai scrivendo un Effetto, inizia usando direttamente l'API React:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Good: two raw Effects separated by purpose

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Poi, puoi (ma non devi) estrarre custom Hook per diversi casi d'uso ad alto livello:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: custom Hooks named after their purpose
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Un buon custom Hook rende il codice chiamante più dichiarativo limitando ciò che fa.** Ad esempio, `useChatRoom(options)` può solo connettersi alla chat room, mentre `useImpressionLog(eventName, extraData)` può solo inviare un log di impressione all'analytics. Se l'API del tuo custom Hook non limita i casi d'uso ed è molto astratta, a lungo termine probabilmente introdurrà più problemi di quanti ne risolva.

</DeepDive>

### I custom Hook ti aiutano a migrare verso pattern migliori {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Gli Effetti sono una ["via di fuga"](/learn/escape-hatches): li usi quando devi "uscire da React" e quando non c'è una soluzione integrata migliore per il tuo caso d'uso. Con il tempo, l'obiettivo del team React è ridurre al minimo il numero di Effetti nella tua app fornendo soluzioni più specifiche a problemi più specifici. Avvolgere i tuoi Effetti in custom Hook rende più facile aggiornare il codice quando queste soluzioni diventano disponibili.

Torniamo a questo esempio:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Nell'esempio sopra, `useOnlineStatus` è implementato con una coppia di [`useState`](/reference/react/useState) e [`useEffect`.](/reference/react/useEffect) Tuttavia, questa non è la soluzione migliore possibile. Ci sono diversi casi limite che non considera. Ad esempio, assume che quando il componente monta, `isOnline` sia già `true`, ma questo potrebbe essere sbagliato se la rete era già offline. Puoi usare l'API del browser [`navigator.onLine`](https://developer.mozilla.org/it/docs/Web/API/Navigator/onLine) per verificarlo, ma usarla direttamente non funzionerebbe sul server per generare l'HTML iniziale. In breve, questo codice potrebbe essere migliorato.

React include un'API dedicata chiamata [`useSyncExternalStore`](/reference/react/useSyncExternalStore) che si occupa di tutti questi problemi per te. Ecco il tuo Hook `useOnlineStatus`, riscritto per sfruttare questa nuova API:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

```

</Sandpack>

Nota come **non hai dovuto cambiare nessuno dei componenti** per fare questa migrazione:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Questa è un'altra ragione per cui avvolgere gli Effetti in custom Hook è spesso vantaggioso:

1. Rendi molto esplicito il flusso dei dati verso e dagli Effetti.
2. Permetti ai tuoi componenti di concentrarsi sull'intenzione piuttosto che sull'implementazione esatta degli Effetti.
3. Quando React aggiunge nuove funzionalità, puoi rimuovere quegli Effetti senza cambiare nessuno dei tuoi componenti.

Simile a un [design system,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) potresti trovare utile iniziare a estrarre idiomi comuni dai componenti della tua app in custom Hook. Questo manterrà il codice dei componenti focalizzato sull'intenzione e ti permetterà di evitare di scrivere Effetti grezzi molto spesso. Molti ottimi custom Hook sono mantenuti dalla community React.

<DeepDive>

#### React fornirà una soluzione integrata per il data fetching? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

Oggi, con l'API [`use`](/reference/react/use#streaming-data-from-server-to-client), i dati possono essere letti in render passando una [Promise](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise) a `use`:

```js {1,4,11}
import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Stiamo ancora definendo i dettagli, ma ci aspettiamo che in futuro scriverai il data fetching così:

```js {1,4,6}
import { use } from 'react';

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

Se usi custom Hook come `useData` sopra nella tua app, richiederà meno cambiamenti per migrare all'approccio eventualmente raccomandato rispetto a scrivere Effetti grezzi in ogni componente manualmente. Tuttavia, il vecchio approccio funzionerà ancora bene, quindi se ti senti a tuo agio a scrivere Effetti grezzi, puoi continuare a farlo.

</DeepDive>

### C'è più di un modo per farlo {/*there-is-more-than-one-way-to-do-it*/}

Supponiamo che tu voglia implementare un'animazione fade-in *da zero* usando l'API del browser [`requestAnimationFrame`](https://developer.mozilla.org/it/docs/Web/API/window/requestAnimationFrame). Potresti iniziare con un Effetto che configura un loop di animazione. Durante ogni frame dell'animazione, potresti cambiare l'opacità del nodo DOM che [tieni in un ref](/learn/manipulating-the-dom-with-refs) finché non raggiunge `1`. Il tuo codice potrebbe iniziare così:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
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

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Per migliorare la leggibilità del componente, potresti estrarre la logica in un custom Hook `useFadeIn`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Potresti mantenere il codice di `useFadeIn` così com'è, ma potresti anche rifattorizzarlo ulteriormente. Ad esempio, potresti estrarre la logica per configurare il loop di animazione da `useFadeIn` in un custom Hook `useAnimationLoop`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Tuttavia, non *dovevi* farlo. Come con le funzioni regolari, alla fine decidi tu dove tracciare i confini tra le diverse parti del tuo codice. Potresti anche adottare un approccio molto diverso. Invece di mantenere la logica nell'Effetto, potresti spostare la maggior parte della logica imperativa dentro una [classe](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes) JavaScript:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // We still have more frames to paint
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Gli Effetti ti permettono di connettere React a sistemi esterni. Più coordinazione tra Effetti è necessaria (ad esempio, per concatenare più animazioni), più ha senso estrarre quella logica dagli Effetti e dagli Hook *completamente* come nel sandbox sopra. Allora, il codice che hai estratto *diventa* il "sistema esterno". Questo permette ai tuoi Effetti di restare semplici perché devono solo inviare messaggi al sistema che hai spostato fuori da React.

Gli esempi sopra assumono che la logica fade-in debba essere scritta in JavaScript. Tuttavia, questa particolare animazione fade-in è sia più semplice che molto più efficiente da implementare con una semplice [animazione CSS:](https://developer.mozilla.org/it/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
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

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

A volte, non hai nemmeno bisogno di un Hook!

<Recap>

- I custom Hook ti permettono di condividere logica tra componenti.
- I custom Hook devono essere nominati iniziando con `use` seguito da una lettera maiuscola.
- I custom Hook condividono solo logica con state, non lo state stesso.
- Puoi passare valori reattivi da un Hook a un altro, e restano aggiornati.
- Tutti gli Hook vengono rieseguiti ogni volta che il tuo componente si ri-renderizza.
- Il codice dei tuoi custom Hook dovrebbe essere puro, come il codice del tuo componente.
- Avvolgi i gestori di eventi ricevuti dai custom Hook in Effect Event.
- Non creare custom Hook come `useMount`. Mantieni il loro scopo specifico.
- Spetta a te come e dove scegliere i confini del tuo codice.

</Recap>

<Challenges>

#### Estrarre un Hook `useCounter` {/*extract-a-usecounter-hook*/}

Questo componente usa una variabile di state e un Effetto per visualizzare un numero che incrementa ogni secondo. Estrai questa logica in un custom Hook chiamato `useCounter`. Il tuo obiettivo è far sì che l'implementazione del componente `Counter` assomigli esattamente a questo:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

Dovrai scrivere il tuo custom Hook in `useCounter.js` e importarlo nel file `App.js`.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
// Write your custom Hook in this file!
```

</Sandpack>

<Solution>

Il tuo codice dovrebbe assomigliare a questo:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Nota che `App.js` non ha più bisogno di importare `useState` o `useEffect`.

</Solution>

#### Configurare il delay del contatore {/*make-the-counter-delay-configurable*/}

In questo esempio, c'è una variabile di state `delay` controllata da uno slider, ma il suo valore non viene usato. Passa il valore `delay` al tuo custom Hook `useCounter`, e modifica l'Hook `useCounter` per usare il `delay` passato invece di hardcodare `1000` ms.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Passa il `delay` al tuo Hook con `useCounter(delay)`. Poi, dentro l'Hook, usa `delay` invece del valore hardcodato `1000`. Dovrai aggiungere `delay` alle dipendenze del tuo Effetto. Questo garantisce che un cambiamento in `delay` resetti l'intervallo.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Estrarre `useInterval` da `useCounter` {/*extract-useinterval-out-of-usecounter*/}

Attualmente, il tuo Hook `useCounter` fa due cose. Configura un intervallo e incrementa anche una variabile di state ad ogni tick dell'intervallo. Separa la logica che configura l'intervallo in un Hook separato chiamato `useInterval`. Dovrebbe accettare due argomenti: la callback `onTick` e il `delay`. Dopo questo cambiamento, la tua implementazione di `useCounter` dovrebbe assomigliare a questo:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Scrivi `useInterval` nel file `useInterval.js` e importalo nel file `useCounter.js`.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Write your Hook here!
```

</Sandpack>

<Solution>

La logica dentro `useInterval` dovrebbe configurare e cancellare l'intervallo. Non ha bisogno di fare altro.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Nota che c'è un piccolo problema con questa soluzione, che risolverai nella sfida successiva.

</Solution>

#### Correggere un intervallo che si resetta {/*fix-a-resetting-interval*/}

In questo esempio, ci sono *due* intervalli separati.

Il componente `App` chiama `useCounter`, che chiama `useInterval` per aggiornare il contatore ogni secondo. Ma il componente `App` *chiama anche* `useInterval` per aggiornare casualmente il colore di sfondo della pagina ogni due secondi.

Per qualche motivo, la callback che aggiorna lo sfondo della pagina non viene mai eseguita. Aggiungi dei log dentro `useInterval`:

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

I log corrispondono a ciò che ti aspetti che succeda? Se alcuni dei tuoi Effetti sembrano re-sincronizzarsi inutilmente, riesci a indovinare quale dipendenza causa questo? C'è un modo per [rimuovere quella dipendenza](/learn/removing-effect-dependencies) dal tuo Effetto?

Dopo aver corretto il problema, dovresti aspettarti che lo sfondo della pagina si aggiorni ogni due secondi.

<Hint>

Sembra che il tuo Hook `useInterval` accetti un listener di eventi come argomento. Riesci a pensare a un modo per avvolgere quel listener di eventi in modo che non debba essere una dipendenza del tuo Effetto?

</Hint>

<Sandpack>

```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

Dentro `useInterval`, avvolgi la callback tick in un Effect Event, come hai fatto [prima in questa pagina.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

Questo ti permetterà di omettere `onTick` dalle dipendenze del tuo Effetto. L'Effetto non si re-sincronizzerà ad ogni ri-renderizzazione del componente, quindi l'intervallo di cambio colore dello sfondo della pagina non verrà resettato ogni secondo prima di avere la possibilità di attivarsi.

Con questo cambiamento, entrambi gli intervalli funzionano come previsto e non interferiscono l'uno con l'altro:

<Sandpack>


```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Implementare un movimento a scalare {/*implement-a-staggering-movement*/}

In questo esempio, l'Hook `usePointerPosition()` tiene traccia della posizione attuale del puntatore. Prova a muovere il cursore o il dito sull'area di anteprima e vedi il punto rosso seguire il tuo movimento. La sua posizione è salvata nella variabile `pos1`.

In realtà, vengono renderizzati cinque (!) punti rossi diversi. Non li vedi perché attualmente appaiono tutti nella stessa posizione. Questo è ciò che devi correggere. Quello che vuoi implementare invece è un movimento "a scalare": ogni punto dovrebbe "seguire" il percorso del punto precedente. Ad esempio, se muovi rapidamente il cursore, il primo punto dovrebbe seguirlo immediatamente, il secondo punto dovrebbe seguire il primo con un piccolo ritardo, il terzo punto dovrebbe seguire il secondo, e così via.

Devi implementare il custom Hook `useDelayedValue`. La sua implementazione attuale restituisce il `value` fornito. Invece, vuoi restituire il valore di `delay` millisecondi fa. Potresti aver bisogno di dello state e di un Effetto per farlo.

Dopo aver implementato `useDelayedValue`, dovresti vedere i punti muoversi seguendosi a vicenda.

<Hint>

Dovrai memorizzare `delayedValue` come variabile di state dentro il tuo custom Hook. Quando `value` cambia, vorrai eseguire un Effetto. Questo Effetto dovrebbe aggiornare `delayedValue` dopo il `delay`. Potresti trovare utile chiamare `setTimeout`.

Questo Effetto ha bisogno di cleanup? Perché sì o perché no?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Ecco una versione funzionante. Mantieni `delayedValue` come variabile di state. Quando `value` si aggiorna, il tuo Effetto programma un timeout per aggiornare `delayedValue`. Ecco perché `delayedValue` "rimane indietro" rispetto al `value` effettivo.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

Nota che questo Effetto *non* ha bisogno di cleanup. Se chiamassi `clearTimeout` nella funzione di cleanup, ogni volta che `value` cambia, resetterebbe il timeout già programmato. Per mantenere il movimento continuo, vuoi che tutti i timeout vengano eseguiti.

</Solution>

</Challenges>
