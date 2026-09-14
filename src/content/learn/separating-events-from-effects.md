---
title: Separare eventi ed Effetti
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/separating-events-from-effects.md).

</Note>

<Intro>

I gestori di eventi vengono rieseguiti solo quando ripeti la stessa interazione. A differenza dei gestori di eventi, gli Effetti si re-sincronizzano se un valore che leggono, come una prop o una variabile di state, è diverso rispetto all'ultima renderizzazione. A volte vuoi anche un mix di entrambi i comportamenti: un Effetto che si riesegue in risposta ad alcuni valori ma non ad altri. Questa pagina ti insegna come fare.

</Intro>

<YouWillLearn>

- Come scegliere tra un gestore di eventi e un Effetto
- Perché gli Effetti sono reattivi e i gestori di eventi no
- Cosa fare quando vuoi che una parte del codice del tuo Effetto non sia reattiva
- Cosa sono gli Effect Event e come estrarli dai tuoi Effetti
- Come leggere le props e lo state più recenti dagli Effetti usando gli Effect Event

</YouWillLearn>

## Scegliere tra gestori di eventi ed Effetti {/*choosing-between-event-handlers-and-effects*/}

Per prima cosa, riassumiamo la differenza tra gestori di eventi ed Effetti.

Immagina di implementare un componente chat room. I tuoi requisiti sono questi:

1. Il tuo componente dovrebbe connettersi automaticamente alla chat room selezionata.
1. Quando clicchi il pulsante "Send", dovrebbe inviare un messaggio alla chat.

Supponiamo che tu abbia già implementato il codice per entrambi, ma non sei sicuro dove metterlo. Dovresti usare gestori di eventi o Effetti? Ogni volta che devi rispondere a questa domanda, considera [*perché* il codice deve essere eseguito.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### I gestori di eventi vengono eseguiti in risposta a interazioni specifiche {/*event-handlers-run-in-response-to-specific-interactions*/}

Dal punto di vista dell'utente, l'invio di un messaggio dovrebbe avvenire *perché* è stato cliccato il particolare pulsante "Send". L'utente si arrabbierebbe se inviassi il suo messaggio in qualsiasi altro momento o per qualsiasi altra ragione. Ecco perché l'invio di un messaggio dovrebbe essere un gestore di eventi. I gestori di eventi ti permettono di gestire interazioni specifiche:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

Con un gestore di eventi, puoi essere sicuro che `sendMessage(message)` verrà eseguito *solo* se l'utente preme il pulsante.

### Gli Effetti vengono eseguiti quando serve la sincronizzazione {/*effects-run-whenever-synchronization-is-needed*/}

Ricorda che devi anche mantenere il componente connesso alla chat room. Dove va quel codice?

Il *motivo* per eseguire questo codice non è una particolare interazione. Non importa perché o come l'utente è arrivato alla schermata della chat room. Ora che la sta guardando e potrebbe interagirci, il componente deve restare connesso al server di chat selezionato. Anche se il componente chat room fosse la schermata iniziale della tua app e l'utente non avesse compiuto alcuna interazione, dovresti *comunque* connetterti. Ecco perché è un Effetto:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Con questo codice, puoi essere sicuro che c'è sempre una connessione attiva al server di chat attualmente selezionato, *indipendentemente* dalle interazioni specifiche compiute dall'utente. Che l'utente abbia solo aperto la tua app, selezionato una stanza diversa o navigato verso un'altra schermata e poi tornato indietro, il tuo Effetto garantisce che il componente *resti sincronizzato* con la stanza attualmente selezionata e si [ricollegherà ogni volta che è necessario.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
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
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

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
input, select { margin-right: 20px; }
```

</Sandpack>

## Valori reattivi e logica reattiva {/*reactive-values-and-reactive-logic*/}

Intuitivamente, potresti dire che i gestori di eventi vengono sempre attivati "manualmente", per esempio cliccando un pulsante. Gli Effetti, invece, sono "automatici": vengono eseguiti e rieseguiti quanto spesso serve per restare sincronizzati.

C'è un modo più preciso di pensarci.

Props, state e variabili dichiarate nel corpo del componente si chiamano <CodeStep step={2}>valori reattivi</CodeStep>. In questo esempio, `serverUrl` non è un valore reattivo, ma `roomId` e `message` lo sono. Partecipano al flusso di dati della renderizzazione:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Valori reattivi come questi possono cambiare a causa di una ri-renderizzazione. Per esempio, l'utente può modificare il `message` o scegliere un `roomId` diverso in un menu a tendina. Gestori di eventi ed Effetti rispondono ai cambiamenti in modo diverso:

- **La logica all'interno dei gestori di eventi *non è reattiva.*** Non verrà rieseguita a meno che l'utente non compia di nuovo la stessa interazione (per esempio, un click). I gestori di eventi possono leggere valori reattivi senza "reagire" ai loro cambiamenti.
- **La logica all'interno degli Effetti *è reattiva.*** Se il tuo Effetto legge un valore reattivo, [devi specificarlo come dipendenza.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Poi, se una ri-renderizzazione fa cambiare quel valore, React rieseguirà la logica del tuo Effetto con il nuovo valore.

Rivediamo l'esempio precedente per illustrare questa differenza.

### La logica all'interno dei gestori di eventi non è reattiva {/*logic-inside-event-handlers-is-not-reactive*/}

Dai un'occhiata a questa riga di codice. Questa logica dovrebbe essere reattiva o no?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Dal punto di vista dell'utente, **un cambiamento al `message` _non_ significa che vogliono inviare un messaggio.** Significa solo che l'utente sta digitando. In altre parole, la logica che invia un messaggio non dovrebbe essere reattiva. Non dovrebbe rieseguirsi solo perché il <CodeStep step={2}>valore reattivo</CodeStep> è cambiato. Ecco perché appartiene al gestore di eventi:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

I gestori di eventi non sono reattivi, quindi `sendMessage(message)` verrà eseguito solo quando l'utente clicca il pulsante Send.

### La logica all'interno degli Effetti è reattiva {/*logic-inside-effects-is-reactive*/}

Ora torniamo a queste righe:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Dal punto di vista dell'utente, **un cambiamento al `roomId` *significa* che vogliono connettersi a una stanza diversa.** In altre parole, la logica per connettersi alla stanza dovrebbe essere reattiva. *Vuoi* che queste righe di codice "tengano il passo" con il <CodeStep step={2}>valore reattivo</CodeStep> e vengano rieseguite se quel valore è diverso. Ecco perché appartiene a un Effetto:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Gli Effetti sono reattivi, quindi `createConnection(serverUrl, roomId)` e `connection.connect()` verranno eseguiti per ogni valore distinto di `roomId`. Il tuo Effetto mantiene la connessione alla chat sincronizzata con la stanza attualmente selezionata.

## Estrarre la logica non reattiva dagli Effetti {/*extracting-non-reactive-logic-out-of-effects*/}

Le cose si complicano quando vuoi mescolare logica reattiva con logica non reattiva.

Per esempio, immagina di voler mostrare una notifica quando l'utente si connette alla chat. Leggi il tema attuale (scuro o chiaro) dalle props così da poter mostrare la notifica nel colore corretto:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

Tuttavia, `theme` è un valore reattivo (può cambiare a causa di una ri-renderizzazione) e [ogni valore reattivo letto da un Effetto deve essere dichiarato come sua dipendenza.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Ora devi specificare `theme` come dipendenza del tuo Effetto:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
```

Gioca con questo esempio e vedi se riesci a individuare il problema con questa esperienza utente:

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

Quando `roomId` cambia, la chat si ricollega come ti aspetteresti. Ma poiché `theme` è anche una dipendenza, la chat si *ricollega anche* ogni volta che passi dal tema scuro a quello chiaro. Non è il massimo!

In altre parole, *non* vuoi che questa riga sia reattiva, anche se si trova all'interno di un Effetto (che è reattivo):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Hai bisogno di un modo per separare questa logica non reattiva dall'Effetto reattivo che la circonda.

### Dichiarare un Effect Event {/*declaring-an-effect-event*/}

Usa un Hook speciale chiamato [`useEffectEvent`](/reference/react/useEffectEvent) per estrarre questa logica non reattiva dal tuo Effetto:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

Qui, `onConnected` si chiama un *Effect Event.* Fa parte della logica del tuo Effetto, ma si comporta molto più come un gestore di eventi. La logica al suo interno non è reattiva e "vede" sempre i valori più recenti delle tue props e del tuo state.

Ora puoi chiamare l'Effect Event `onConnected` dall'interno del tuo Effetto:

```js {2-4,9,13}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Questo risolve il problema. Nota che hai dovuto *rimuovere* `theme` dall'elenco delle dipendenze del tuo Effetto, perché non è più usato nell'Effetto. Non devi neanche *aggiungere* `onConnected`, perché **gli Effect Event non sono reattivi e devono essere omessi dalle dipendenze.**

Verifica che il nuovo comportamento funzioni come ti aspetteresti:

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

Puoi pensare agli Effect Event come molto simili ai gestori di eventi. La differenza principale è che i gestori di eventi vengono eseguiti in risposta a interazioni dell'utente, mentre gli Effect Event vengono attivati da te dagli Effetti. Gli Effect Event ti permettono di "rompere la catena" tra la reattività degli Effetti e il codice che non dovrebbe essere reattivo.

### Leggere le props e lo state più recenti con gli Effect Event {/*reading-latest-props-and-state-with-effect-events*/}

Gli Effect Event ti permettono di correggere molti pattern in cui potresti essere tentato di sopprimere il linter delle dipendenze.

Per esempio, supponiamo che tu abbia un Effetto per registrare le visite alle pagine:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

In seguito, aggiungi più route al tuo sito. Ora il tuo componente `Page` riceve una prop `url` con il percorso attuale. Vuoi passare l'`url` come parte della tua chiamata `logVisit`, ma il linter delle dipendenze si lamenta:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Pensa a cosa vuoi che faccia il codice. *Vuoi* registrare una visita separata per URL diversi, poiché ogni URL rappresenta una pagina diversa. In altre parole, questa chiamata `logVisit` *dovrebbe* essere reattiva rispetto all'`url`. Ecco perché, in questo caso, ha senso seguire il linter delle dipendenze e aggiungere `url` come dipendenza:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

Ora supponiamo che tu voglia includere il numero di articoli nel carrello insieme a ogni visita alla pagina:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Hai usato `numberOfItems` all'interno dell'Effetto, quindi il linter ti chiede di aggiungerlo come dipendenza. Tuttavia, *non* vuoi che la chiamata `logVisit` sia reattiva rispetto a `numberOfItems`. Se l'utente mette qualcosa nel carrello e `numberOfItems` cambia, questo *non significa* che l'utente ha visitato di nuovo la pagina. In altre parole, *visitare la pagina* è, in un certo senso, un "evento". Avviene in un momento preciso nel tempo.

Dividi il codice in due parti:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

Qui, `onVisit` è un Effect Event. Il codice al suo interno non è reattivo. Ecco perché puoi usare `numberOfItems` (o qualsiasi altro valore reattivo!) senza preoccuparti che causerà la riesecuzione del codice circostante al cambiamento.

D'altra parte, l'Effetto stesso resta reattivo. Il codice all'interno dell'Effetto usa la prop `url`, quindi l'Effetto si rieseguirà dopo ogni ri-renderizzazione con un `url` diverso. Questo, a sua volta, chiamerà l'Effect Event `onVisit`.

Di conseguenza, chiamerai `logVisit` per ogni cambiamento all'`url` e leggerai sempre l'`numberOfItems` più recente. Tuttavia, se `numberOfItems` cambia da solo, questo non causerà la riesecuzione di nessun codice.

<Note>

Potresti chiederti se potresti chiamare `onVisit()` senza argomenti e leggere l'`url` al suo interno:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Funzionerebbe, ma è meglio passare questo `url` all'Effect Event esplicitamente. **Passando `url` come argomento al tuo Effect Event, stai dicendo che visitare una pagina con un `url` diverso costituisce un "evento" separato dal punto di vista dell'utente.** L'`visitedUrl` è una *parte* dell'"evento" che è accaduto:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Poiché il tuo Effect Event "chiede" esplicitamente l'`visitedUrl`, ora non puoi rimuovere accidentalmente `url` dalle dipendenze dell'Effetto. Se rimuovi la dipendenza `url` (facendo sì che visite a pagine distinte vengano contate come una sola), il linter ti avviserà. Vuoi che `onVisit` sia reattivo rispetto all'`url`, quindi invece di leggere l'`url` all'interno (dove non sarebbe reattivo), lo passi *dal* tuo Effetto.

Questo diventa particolarmente importante se c'è della logica asincrona all'interno dell'Effetto:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Delay logging visits
  }, [url]);
```

Qui, l'`url` all'interno di `onVisit` corrisponde all'`url` *più recente* (che potrebbe essere già cambiato), ma `visitedUrl` corrisponde all'`url` che ha originariamente causato l'esecuzione di questo Effetto (e di questa chiamata `onVisit`).

</Note>

<DeepDive>

#### Va bene sopprimere il linter delle dipendenze? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Nei codebase esistenti, a volte potresti vedere la regola del linter soppressa così:

```js {expectedErrors: {'react-compiler': [8]}} {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Consigliamo di **non sopprimere mai il linter**.

Il primo svantaggio di sopprimere la regola è che React non ti avviserà più quando il tuo Effetto deve "reagire" a una nuova dipendenza reattiva che hai introdotto nel tuo codice. Nell'esempio precedente, hai aggiunto `url` alle dipendenze *perché* React te lo ha ricordato. Non riceverai più questi promemoria per future modifiche a quell'Effetto se disabiliti il linter. Questo porta a bug.

Ecco un esempio di un bug confuso causato dalla soppressione del linter. In questo esempio, la funzione `handleMove` dovrebbe leggere il valore attuale della variabile di state `canMove` per decidere se il punto deve seguire il cursore. Tuttavia, `canMove` è sempre `true` all'interno di `handleMove`.

Riesci a capire perché?

<Sandpack>

```js {expectedErrors: {'react-compiler': [16]}}
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


Il problema con questo codice è nella soppressione del linter delle dipendenze. Se rimuovi la soppressione, vedrai che questo Effetto dovrebbe dipendere dalla funzione `handleMove`. Ha senso: `handleMove` è dichiarata nel corpo del componente, il che la rende un valore reattivo. Ogni valore reattivo deve essere specificato come dipendenza, altrimenti può diventare obsoleto nel tempo!

L'autore del codice originale ha "mentito" a React dicendo che l'Effetto non dipende (`[]`) da alcun valore reattivo. Ecco perché React non ha re-sincronizzato l'Effetto dopo che `canMove` è cambiato (e `handleMove` con esso). Poiché React non ha re-sincronizzato l'Effetto, il `handleMove` attaccato come listener è la funzione `handleMove` creata durante la renderizzazione iniziale. Durante la renderizzazione iniziale, `canMove` era `true`, ecco perché `handleMove` dalla renderizzazione iniziale vedrà per sempre quel valore.

**Se non sopprimi mai il linter, non vedrai mai problemi con valori obsoleti.**

Con `useEffectEvent`, non c'è bisogno di "mentire" al linter e il codice funziona come ti aspetteresti:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Questo non significa che `useEffectEvent` sia *sempre* la soluzione corretta. Dovresti applicarlo solo alle righe di codice che non vuoi siano reattive. Nella sandbox sopra, non volevi che il codice dell'Effetto fosse reattivo rispetto a `canMove`. Ecco perché aveva senso estrarre un Effect Event.

Leggi [Rimuovere le dipendenze degli Effetti](/learn/removing-effect-dependencies) per altre alternative corrette alla soppressione del linter.

</DeepDive>

### Limitazioni degli Effect Event {/*limitations-of-effect-events*/}

Gli Effect Event sono molto limitati nel modo in cui puoi usarli:

* **Chiamali solo dall'interno degli Effetti.**
* **Non passarli mai ad altri componenti o Hooks.**

Per esempio, non dichiarare e passare un Effect Event così:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Avoid: Passing Effect Events

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Need to specify "callback" in dependencies
}
```

Invece, dichiara sempre gli Effect Event direttamente accanto agli Effetti che li usano:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: Only called locally inside an Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No need to specify "onTick" (an Effect Event) as a dependency
}
```

Gli Effect Event sono "pezzi" non reattivi del codice del tuo Effetto. Dovrebbero stare accanto all'Effetto che li usa.

<Recap>

- I gestori di eventi vengono eseguiti in risposta a interazioni specifiche.
- Gli Effetti vengono eseguiti quando serve la sincronizzazione.
- La logica all'interno dei gestori di eventi non è reattiva.
- La logica all'interno degli Effetti è reattiva.
- Puoi spostare la logica non reattiva dagli Effetti negli Effect Event.
- Chiama gli Effect Event solo dall'interno degli Effetti.
- Non passare gli Effect Event ad altri componenti o Hooks.

</Recap>

<Challenges>

#### Correggi una variabile che non si aggiorna {/*fix-a-variable-that-doesnt-update*/}

Questo componente `Timer` mantiene una variabile di state `count` che aumenta ogni secondo. Il valore di cui aumenta è memorizzato nella variabile di state `increment`. Puoi controllare la variabile `increment` con i pulsanti più e meno.

Tuttavia, non importa quante volte clicchi il pulsante più, il contatore viene ancora incrementato di uno ogni secondo. Cosa c'è di sbagliato in questo codice? Perché `increment` è sempre uguale a `1` all'interno del codice dell'Effetto? Trova l'errore e correggilo.

<Hint>

Per correggere questo codice, basta seguire le regole.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Come al solito, quando cerchi bug negli Effetti, inizia cercando le soppressioni del linter.

Se rimuovi il commento di soppressione, React ti dirà che il codice di questo Effetto dipende da `increment`, ma hai "mentito" a React affermando che questo Effetto non dipende da alcun valore reattivo (`[]`). Aggiungi `increment` all'array di dipendenze:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Ora, quando `increment` cambia, React re-sincronizzerà il tuo Effetto, che riavvierà l'intervallo.

</Solution>

#### Correggi un contatore che si blocca {/*fix-a-freezing-counter*/}

Questo componente `Timer` mantiene una variabile di state `count` che aumenta ogni secondo. Il valore di cui aumenta è memorizzato nella variabile di state `increment`, che puoi controllare con i pulsanti più e meno. Per esempio, prova a premere il pulsante più nove volte e nota che il `count` ora aumenta ogni secondo di dieci anziché di uno.

C'è un piccolo problema con questa interfaccia utente. Potresti notare che se continui a premere i pulsanti più o meno più velocemente di una volta al secondo, il timer stesso sembra bloccarsi. Riprende solo dopo che è passato un secondo dall'ultima volta che hai premuto uno dei due pulsanti. Scopri perché succede e correggi il problema in modo che il timer scatti *ogni* secondo senza interruzioni.

<Hint>

Sembra che l'Effetto che configura il timer "reagisca" al valore `increment`. La riga che usa il valore attuale di `increment` per chiamare `setCount` ha davvero bisogno di essere reattiva?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Il problema è che il codice all'interno dell'Effetto usa la variabile di state `increment`. Poiché è una dipendenza del tuo Effetto, ogni cambiamento a `increment` causa la re-sincronizzazione dell'Effetto, che fa pulire l'intervallo. Se continui a pulire l'intervallo ogni volta prima che abbia la possibilità di scattare, sembrerà che il timer si sia bloccato.

Per risolvere il problema, estrai un Effect Event `onTick` dall'Effetto:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Poiché `onTick` è un Effect Event, il codice al suo interno non è reattivo. Il cambiamento a `increment` non attiva alcun Effetto.

</Solution>

#### Correggi un ritardo non regolabile {/*fix-a-non-adjustable-delay*/}

In questo esempio, puoi personalizzare il ritardo dell'intervallo. È memorizzato in una variabile di state `delay` che viene aggiornata da due pulsanti. Tuttavia, anche se premi il pulsante "plus 100 ms" finché il `delay` non è 1000 millisecondi (cioè, un secondo), noterai che il timer incrementa ancora molto velocemente (ogni 100 ms). È come se i tuoi cambiamenti al `delay` venissero ignorati. Trova e correggi il bug.

<Hint>

Il codice all'interno degli Effect Event non è reattivo. Ci sono casi in cui _vorresti_ che la chiamata `setInterval` venga rieseguita?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Il problema con l'esempio sopra è che ha estratto un Effect Event chiamato `onMount` senza considerare cosa il codice dovrebbe effettivamente fare. Dovresti estrarre gli Effect Event solo per un motivo specifico: quando vuoi che una parte del tuo codice non sia reattiva. Tuttavia, la chiamata `setInterval` *dovrebbe* essere reattiva rispetto alla variabile di state `delay`. Se il `delay` cambia, vuoi configurare l'intervallo da zero! Per correggere questo codice, riporta tutto il codice reattivo all'interno dell'Effetto:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

In generale, dovresti diffidare di funzioni come `onMount` che si concentrano sul *momento* piuttosto che sullo *scopo* di un pezzo di codice. All'inizio può sembrare "più descrittivo" ma oscura il tuo intento. Come regola generale, gli Effect Event dovrebbero corrispondere a qualcosa che accade dal punto di vista dell'*utente*. Per esempio, `onMessage`, `onTick`, `onVisit` o `onConnected` sono buoni nomi per Effect Event. Il codice al loro interno probabilmente non avrebbe bisogno di essere reattivo. D'altra parte, `onMount`, `onUpdate`, `onUnmount` o `onAfterRender` sono così generici che è facile metterci accidentalmente codice che *dovrebbe* essere reattivo. Ecco perché dovresti chiamare i tuoi Effect Event in base a *cosa l'utente pensa sia accaduto,* non a quando del codice è stato eseguito.

</Solution>

#### Correggi una notifica ritardata {/*fix-a-delayed-notification*/}

Quando ti unisci a una chat room, questo componente mostra una notifica. Tuttavia, non mostra la notifica immediatamente. Invece, la notifica è artificialmente ritardata di due secondi così che l'utente abbia la possibilità di guardarsi intorno nell'UI.

Funziona quasi, ma c'è un bug. Prova a cambiare il menu a tendina da "general" a "travel" e poi a "music" molto velocemente. Se lo fai abbastanza in fretta, vedrai due notifiche (come previsto!) ma *entrambe* diranno "Welcome to music".

Correggilo in modo che quando passi da "general" a "travel" e poi a "music" molto velocemente, vedi due notifiche, la prima "Welcome to travel" e la seconda "Welcome to music". (Per una sfida aggiuntiva, assumendo che tu abbia *già* fatto sì che le notifiche mostrino le stanze corrette, modifica il codice in modo che venga visualizzata solo l'ultima notifica.)

<Hint>

Il tuo Effetto sa a quale stanza si è connesso. C'è qualche informazione che potresti voler passare al tuo Effect Event?

</Hint>

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
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
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

<Solution>

All'interno del tuo Effect Event, `roomId` è il valore *al momento in cui l'Effect Event è stato chiamato.*

Il tuo Effect Event viene chiamato con un ritardo di due secondi. Se passi rapidamente dalla stanza travel a quella music, quando la notifica della stanza travel appare, `roomId` è già `"music"`. Ecco perché entrambe le notifiche dicono "Welcome to music".

Per correggere il problema, invece di leggere l'`roomId` *più recente* all'interno dell'Effect Event, rendilo un parametro del tuo Effect Event, come `connectedRoomId` sotto. Poi passa `roomId` dal tuo Effetto chiamando `onConnected(roomId)`:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
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

L'Effetto che aveva `roomId` impostato su `"travel"` (quindi si è connesso alla stanza `"travel"`) mostrerà la notifica per `"travel"`. L'Effetto che aveva `roomId` impostato su `"music"` (quindi si è connesso alla stanza `"music"`) mostrerà la notifica per `"music"`. In altre parole, `connectedRoomId` proviene dal tuo Effetto (che è reattivo), mentre `theme` usa sempre il valore più recente.

Per risolvere la sfida aggiuntiva, salva l'ID del timeout della notifica e cancellalo nella funzione di cleanup del tuo Effetto:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
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

Questo garantisce che le notifiche già programmate (ma non ancora visualizzate) vengano annullate quando cambi stanza.

</Solution>

</Challenges>
