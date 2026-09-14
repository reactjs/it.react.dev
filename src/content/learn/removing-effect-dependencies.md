---
title: Rimuovere le dipendenze degli Effetti
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e potrebbe beneficiare di una revisione umana. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/removing-effect-dependencies.md).

</Note>

<Intro>

Quando scrivi un Effetto, il linter verifica che tu abbia incluso ogni valore reattivo (come props e state) che l'Effetto legge nell'elenco delle dipendenze del tuo Effetto. Questo garantisce che il tuo Effetto resti sincronizzato con le props e lo state più recenti del tuo componente. Dipendenze non necessarie possono far eseguire il tuo Effetto troppo spesso, o persino creare un loop infinito. Segui questa guida per rivedere e rimuovere le dipendenze non necessarie dai tuoi Effetti.

</Intro>

<YouWillLearn>

- Come correggere loop infiniti di dipendenze degli Effetti
- Cosa fare quando vuoi rimuovere una dipendenza
- Come leggere un valore dal tuo Effetto senza "reagire" ad esso
- Come e perché evitare dipendenze su oggetti e funzioni
- Perché sopprimere il linter delle dipendenze è pericoloso, e cosa fare invece

</YouWillLearn>

## Le dipendenze devono corrispondere al codice {/*dependencies-should-match-the-code*/}

Quando scrivi un Effetto, per prima cosa specifichi come [avviare e fermare](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) ciò che vuoi che il tuo Effetto faccia:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Poi, se lasci vuote le dipendenze dell'Effetto (`[]`), il linter suggerirà le dipendenze corrette:

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
  }, []); // <-- Fix the mistake here!
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

Compilale in base a ciò che dice il linter:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

[Gli Effetti "reagiscono" ai valori reattivi.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Poiché `roomId` è un valore reattivo (può cambiare a causa di una ri-renderizzazione), il linter verifica che tu l'abbia specificato come dipendenza. Se `roomId` riceve un valore diverso, React re-sincronizzerà il tuo Effetto. Questo garantisce che la chat resti connessa alla stanza selezionata e "reagisca" al menu a tendina:

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

### Per rimuovere una dipendenza, dimostra che non lo è {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Nota che non puoi "scegliere" le dipendenze del tuo Effetto. Ogni <CodeStep step={2}>valore reattivo</CodeStep> usato dal codice del tuo Effetto deve essere dichiarato nell'elenco delle dipendenze. L'elenco delle dipendenze è determinato dal codice circostante:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

I [valori reattivi](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) includono le props e tutte le variabili e funzioni dichiarate direttamente all'interno del tuo componente. Poiché `roomId` è un valore reattivo, non puoi rimuoverlo dall'elenco delle dipendenze. Il linter non lo permetterebbe:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

E il linter avrebbe ragione! Poiché `roomId` può cambiare nel tempo, questo introdurrebbe un bug nel tuo codice.

**Per rimuovere una dipendenza, "dimostra" al linter che *non ha bisogno* di essere una dipendenza.** Per esempio, puoi spostare `roomId` fuori dal tuo componente per dimostrare che non è reattivo e non cambierà alle ri-renderizzazioni:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

Ora che `roomId` non è un valore reattivo (e non può cambiare a una ri-renderizzazione), non ha bisogno di essere una dipendenza:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

Ecco perché ora puoi specificare un [elenco di dipendenze vuoto (`[]`).](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Il tuo Effetto *davvero non* dipende più da alcun valore reattivo, quindi *davvero non* ha bisogno di rieseguirsi quando cambiano le props o lo state del componente.

### Per cambiare le dipendenze, cambia il codice {/*to-change-the-dependencies-change-the-code*/}

Potresti aver notato uno schema nel tuo flusso di lavoro:

1. Per prima cosa, **cambi il codice** del tuo Effetto o il modo in cui i tuoi valori reattivi sono dichiarati.
2. Poi, segui il linter e adatti le dipendenze per **corrispondere al codice che hai cambiato.**
3. Se non sei soddisfatto dell'elenco delle dipendenze, **torni al primo passo** (e cambi di nuovo il codice).

L'ultima parte è importante. **Se vuoi cambiare le dipendenze, cambia prima il codice circostante.** Puoi pensare all'elenco delle dipendenze come [un elenco di tutti i valori reattivi usati dal codice del tuo Effetto.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Non *scegli* cosa mettere in quell'elenco. L'elenco *descrive* il tuo codice. Per cambiare l'elenco delle dipendenze, cambia il codice.

Potrebbe sembrare di risolvere un'equazione. Potresti partire con un obiettivo (per esempio, rimuovere una dipendenza) e devi "trovare" il codice che corrisponde a quell'obiettivo. Non a tutti piace risolvere equazioni, e lo stesso si potrebbe dire della scrittura degli Effetti! Per fortuna, c'è un elenco di ricette comuni che puoi provare qui sotto.

<Pitfall>

Se hai una codebase esistente, potresti avere alcuni Effetti che sopprimono il linter così:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Quando le dipendenze non corrispondono al codice, c'è un rischio molto alto di introdurre bug.** Sopprimendo il linter, "menti" a React riguardo ai valori da cui dipende il tuo Effetto.

Usa invece le tecniche qui sotto.

</Pitfall>

<DeepDive>

#### Perché sopprimere il linter delle dipendenze è così pericoloso? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Sopprimere il linter porta a bug molto poco intuitivi, difficili da trovare e correggere. Ecco un esempio:

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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

Supponiamo che tu voglia eseguire l'Effetto "solo al montaggio". Hai letto che le [dipendenze vuote (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) fanno questo, quindi hai deciso di ignorare il linter e hai specificato forzatamente `[]` come dipendenze.

Questo contatore doveva incrementare ogni secondo dell'importo configurabile con i due pulsanti. Tuttavia, poiché hai "mentito" a React che questo Effetto non dipende da nulla, React continua per sempre a usare la funzione `onTick` dalla renderizzazione iniziale. [Durante quella renderizzazione,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` era `0` e `increment` era `1`. Ecco perché `onTick` da quella renderizzazione chiama sempre `setCount(0 + 1)` ogni secondo, e vedi sempre `1`. Bug come questo sono più difficili da correggere quando sono sparsi tra più componenti.

C'è sempre una soluzione migliore che ignorare il linter! Per correggere questo codice, devi aggiungere `onTick` all'elenco delle dipendenze. (Per garantire che l'intervallo venga configurato una sola volta, [rendi `onTick` un Effect Event.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Ti consigliamo di trattare l'errore del linter delle dipendenze come un errore di compilazione. Se non lo sopprimi, non vedrai mai bug come questo.** Il resto di questa pagina documenta le alternative per questo e altri casi.

</DeepDive>

## Rimuovere le dipendenze non necessarie {/*removing-unnecessary-dependencies*/}

Ogni volta che adatti le dipendenze dell'Effetto per riflettere il codice, guarda l'elenco delle dipendenze. Ha senso che l'Effetto si riesegua quando cambia una di queste dipendenze? A volte, la risposta è "no":

* Potresti voler rieseguire *parti diverse* del tuo Effetto in condizioni diverse.
* Potresti voler leggere solo l'*ultimo valore* di una dipendenza invece di "reagire" ai suoi cambiamenti.
* Una dipendenza può cambiare troppo spesso *involontariamente* perché è un oggetto o una funzione.

Per trovare la soluzione giusta, dovrai rispondere ad alcune domande sul tuo Effetto. Esaminiamole.

### Questo codice dovrebbe essere spostato in un gestore di eventi? {/*should-this-code-move-to-an-event-handler*/}

La prima cosa a cui dovresti pensare è se questo codice dovrebbe essere un Effetto in assoluto.

Immagina un form. All'invio, imposti la variabile di state `submitted` su `true`. Devi inviare una richiesta POST e mostrare una notifica. Hai messo questa logica dentro un Effetto che "reagisce" a `submitted` che diventa `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Più tardi, vuoi stilizzare il messaggio di notifica in base al tema corrente, quindi leggi il tema corrente. Poiché `theme` è dichiarato nel corpo del componente, è un valore reattivo, quindi lo aggiungi come dipendenza:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Facendo così, hai introdotto un bug. Immagina di inviare prima il form e poi di passare tra i temi Dark e Light. Il `theme` cambierà, l'Effetto si rieseguirà e quindi mostrerà di nuovo la stessa notifica!

**Il problema qui è che questo non dovrebbe essere un Effetto in primo luogo.** Vuoi inviare questa richiesta POST e mostrare la notifica in risposta all'*invio del form,* che è una particolare interazione. Per eseguire del codice in risposta a una particolare interazione, metti quella logica direttamente nel corrispondente gestore di eventi:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Buono: la logica specifica dell'evento è chiamata dai gestori di eventi
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }

  // ...
}
```

Ora che il codice è in un gestore di eventi, non è reattivo — quindi verrà eseguito solo quando l'utente invia il form. Leggi di più su [scegliere tra gestori di eventi ed Effetti](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) e [come eliminare Effetti non necessari.](/learn/you-might-not-need-an-effect)

### Il tuo Effetto fa diverse cose non correlate? {/*is-your-effect-doing-several-unrelated-things*/}

La prossima domanda che dovresti farti è se il tuo Effetto fa diverse cose non correlate.

Immagina di creare un form di spedizione in cui l'utente deve scegliere la città e l'area. Recuperi l'elenco di `cities` dal server in base al `country` selezionato per mostrarle in un menu a tendina:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ All dependencies declared

  // ...
```

Questo è un buon esempio di [recupero dati in un Effetto.](/learn/you-might-not-need-an-effect#fetching-data) Stai sincronizzando lo state `cities` con la rete in base alla prop `country`. Non puoi farlo in un gestore di eventi perché devi recuperare i dati non appena `ShippingForm` viene visualizzato e ogni volta che `country` cambia (indipendentemente da quale interazione lo causa).

Ora supponiamo che tu stia aggiungendo un secondo menu a tendina per le aree della città, che dovrebbe recuperare le `areas` per la `city` attualmente selezionata. Potresti iniziare aggiungendo una seconda chiamata `fetch` per l'elenco delle aree all'interno dello stesso Effetto:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ All dependencies declared

  // ...
```

Tuttavia, poiché l'Effetto ora usa la variabile di state `city`, hai dovuto aggiungere `city` all'elenco delle dipendenze. Questo, a sua volta, ha introdotto un problema: quando l'utente seleziona una città diversa, l'Effetto si rieseguirà e chiamerà `fetchCities(country)`. Di conseguenza, recupererai inutilmente l'elenco delle città molte volte.

**Il problema con questo codice è che stai sincronizzando due cose diverse e non correlate:**

1. Vuoi sincronizzare lo state `cities` con la rete in base alla prop `country`.
1. Vuoi sincronizzare lo state `areas` con la rete in base allo state `city`.

Dividi la logica in due Effetti, ciascuno dei quali reagisce alla prop con cui deve sincronizzarsi:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ All dependencies declared

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ All dependencies declared

  // ...
```

Ora il primo Effetto si riesegue solo se `country` cambia, mentre il secondo Effetto si riesegue quando `city` cambia. Li hai separati per scopo: due cose diverse sono sincronizzate da due Effetti separati. Due Effetti separati hanno due elenchi di dipendenze separati, quindi non si attiveranno a vicenda involontariamente.

Il codice finale è più lungo dell'originale, ma dividere questi Effetti resta corretto. [Ogni Effetto dovrebbe rappresentare un processo di sincronizzazione indipendente.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) In questo esempio, eliminare un Effetto non rompe la logica dell'altro Effetto. Questo significa che *sincronizzano cose diverse,* ed è bene dividerli. Se ti preoccupa la duplicazione, puoi migliorare questo codice [estraendo la logica ripetitiva in un custom Hook.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Stai leggendo dello state per calcolare il prossimo state? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Questo Effetto aggiorna la variabile di state `messages` con un array appena creato ogni volta che arriva un nuovo messaggio:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Usa la variabile `messages` per [creare un nuovo array](/learn/updating-arrays-in-state) che inizia con tutti i messaggi esistenti e aggiunge il nuovo messaggio alla fine. Tuttavia, poiché `messages` è un valore reattivo letto da un Effetto, deve essere una dipendenza:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ All dependencies declared
  // ...
```

E includere `messages` tra le dipendenze introduce un problema.

Ogni volta che ricevi un messaggio, `setMessages()` fa ri-renderizzare il componente con un nuovo array `messages` che include il messaggio ricevuto. Tuttavia, poiché questo Effetto ora dipende da `messages`, questo *re-sincronizzerà anche* l'Effetto. Quindi ogni nuovo messaggio farà riconnettere la chat. L'utente non gradirebbe!

Per correggere il problema, non leggere `messages` all'interno dell'Effetto. Passa invece una [funzione updater](/reference/react/useState#updating-state-based-on-the-previous-state) a `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

**Nota come il tuo Effetto non legge affatto la variabile `messages` ora.** Devi solo passare una funzione updater come `msgs => [...msgs, receivedMessage]`. React [mette la tua funzione updater in coda](/learn/queueing-a-series-of-state-updates) e le fornirà l'argomento `msgs` durante la prossima renderizzazione. Ecco perché l'Effetto stesso non ha più bisogno di dipendere da `messages`. Come risultato di questa correzione, ricevere un messaggio in chat non farà più riconnettere la chat.

### Vuoi leggere un valore senza "reagire" ai suoi cambiamenti? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

Supponiamo che tu voglia riprodurre un suono quando l'utente riceve un nuovo messaggio, a meno che `isMuted` non sia `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Poiché il tuo Effetto ora usa `isMuted` nel suo codice, devi aggiungerlo alle dipendenze:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ All dependencies declared
  // ...
```

Il problema è che ogni volta che `isMuted` cambia (per esempio, quando l'utente preme l'interruttore "Muted"), l'Effetto si re-sincronizzerà e si riconnetterà alla chat. Questa non è l'esperienza utente desiderata! (In questo esempio, anche disabilitare il linter non funzionerebbe — se lo fai, `isMuted` resterebbe "bloccato" con il suo vecchio valore.)

Per risolvere questo problema, devi estrarre la logica che non dovrebbe essere reattiva dall'Effetto. Non vuoi che questo Effetto "reagisca" ai cambiamenti di `isMuted`. [Sposta questo pezzo di logica non reattiva in un Effect Event:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Gli Effect Event ti permettono di dividere un Effetto in parti reattive (che dovrebbero "reagire" a valori reattivi come `roomId` e ai loro cambiamenti) e parti non reattive (che leggono solo i loro valori più recenti, come `onMessage` legge `isMuted`). **Ora che leggi `isMuted` dentro un Effect Event, non ha bisogno di essere una dipendenza del tuo Effetto.** Di conseguenza, la chat non si riconnetterà quando attivi e disattivi l'impostazione "Muted", risolvendo il problema originale!

#### Avvolgere un gestore di eventi dalle props {/*wrapping-an-event-handler-from-the-props*/}

Potresti incontrare un problema simile quando il tuo componente riceve un gestore di eventi come prop:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ All dependencies declared
  // ...
```

Supponiamo che il componente genitore passi una funzione `onReceiveMessage` *diversa* a ogni renderizzazione:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Poiché `onReceiveMessage` è una dipendenza, farebbe re-sincronizzare l'Effetto dopo ogni ri-renderizzazione del genitore. Questo lo farebbe riconnettere alla chat. Per risolvere, avvolgi la chiamata in un Effect Event:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Gli Effect Event non sono reattivi, quindi non devi specificarli come dipendenze. Di conseguenza, la chat non si riconnetterà più anche se il componente genitore passa una funzione diversa a ogni ri-renderizzazione.

#### Separare codice reattivo e non reattivo {/*separating-reactive-and-non-reactive-code*/}

In questo esempio, vuoi registrare una visita ogni volta che `roomId` cambia. Vuoi includere l'attuale `notificationCount` con ogni log, ma *non* vuoi che un cambiamento di `notificationCount` attivi un evento di log.

La soluzione è ancora una volta dividere il codice non reattivo in un Effect Event:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

Vuoi che la tua logica sia reattiva rispetto a `roomId`, quindi leggi `roomId` all'interno del tuo Effetto. Tuttavia, non vuoi che un cambiamento di `notificationCount` registri una visita extra, quindi leggi `notificationCount` all'interno dell'Effect Event. [Scopri di più sulla lettura delle props e dello state più recenti dagli Effetti usando gli Effect Event.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Qualche valore reattivo cambia involontariamente? {/*does-some-reactive-value-change-unintentionally*/}

A volte, *vuoi* che il tuo Effetto "reagisca" a un certo valore, ma quel valore cambia più spesso di quanto vorresti — e potrebbe non riflettere alcun cambiamento reale dal punto di vista dell'utente. Per esempio, supponiamo che tu crei un oggetto `options` nel corpo del tuo componente, e poi legga quell'oggetto dall'interno del tuo Effetto:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Questo oggetto è dichiarato nel corpo del componente, quindi è un [valore reattivo.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Quando leggi un valore reattivo così all'interno di un Effetto, lo dichiari come dipendenza. Questo garantisce che il tuo Effetto "reagisca" ai suoi cambiamenti:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

È importante dichiararlo come dipendenza! Questo garantisce, per esempio, che se `roomId` cambia, il tuo Effetto si riconnetterà alla chat con le nuove `options`. Tuttavia, c'è anche un problema con il codice sopra. Per vederlo, prova a digitare nell'input nella sandbox qui sotto e osserva cosa succede nella console:

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

Nella sandbox sopra, l'input aggiorna solo la variabile di state `message`. Dal punto di vista dell'utente, questo non dovrebbe influire sulla connessione della chat. Tuttavia, ogni volta che aggiorni `message`, il tuo componente si ri-renderizza. Quando il tuo componente si ri-renderizza, il codice al suo interno viene eseguito di nuovo da zero.

Un nuovo oggetto `options` viene creato da zero a ogni ri-renderizzazione del componente `ChatRoom`. React vede che l'oggetto `options` è un *oggetto diverso* dall'oggetto `options` creato durante l'ultima renderizzazione. Ecco perché re-sincronizza il tuo Effetto (che dipende da `options`), e la chat si riconnette mentre digiti.

**Questo problema riguarda solo oggetti e funzioni. In JavaScript, ogni oggetto e funzione appena creati sono considerati distinti da tutti gli altri. Non importa che il contenuto al loro interno possa essere lo stesso!**

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**Le dipendenze su oggetti e funzioni possono far re-sincronizzare il tuo Effetto più spesso di quanto ti serva.**

Ecco perché, quando possibile, dovresti cercare di evitare oggetti e funzioni come dipendenze del tuo Effetto. Prova invece a spostarli fuori dal componente, dentro l'Effetto, o a estrarre valori primitivi da essi.

#### Spostare oggetti e funzioni statici fuori dal componente {/*move-static-objects-and-functions-outside-your-component*/}

Se l'oggetto non dipende da props e state, puoi spostare quell'oggetto fuori dal tuo componente:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

In questo modo, *dimostri* al linter che non è reattivo. Non può cambiare a causa di una ri-renderizzazione, quindi non ha bisogno di essere una dipendenza. Ora ri-renderizzare `ChatRoom` non farà re-sincronizzare il tuo Effetto.

Funziona anche per le funzioni:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

Poiché `createOptions` è dichiarata fuori dal tuo componente, non è un valore reattivo. Ecco perché non ha bisogno di essere specificata nelle dipendenze del tuo Effetto, e perché non farà mai re-sincronizzare il tuo Effetto.

#### Spostare oggetti e funzioni dinamici dentro l'Effetto {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Se il tuo oggetto dipende da un valore reattivo che può cambiare a causa di una ri-renderizzazione, come una prop `roomId`, non puoi tirarlo *fuori* dal tuo componente. Puoi, tuttavia, spostare la sua creazione *dentro* il codice del tuo Effetto:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Ora che `options` è dichiarato dentro il tuo Effetto, non è più una dipendenza del tuo Effetto. Invece, l'unico valore reattivo usato dal tuo Effetto è `roomId`. Poiché `roomId` non è un oggetto o una funzione, puoi essere sicuro che non sarà *involontariamente* diverso. In JavaScript, numeri e stringhe sono confrontati per il loro contenuto:

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

Grazie a questa correzione, la chat non si riconnette più se modifichi l'input:

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

Tuttavia, *si* riconnette quando cambi il menu a tendina `roomId`, come ti aspetteresti.

Funziona anche per le funzioni:

```js {7-12,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Puoi scrivere le tue funzioni per raggruppare pezzi di logica dentro il tuo Effetto. Finché le dichiari anche *dentro* il tuo Effetto, non sono valori reattivi, e quindi non hanno bisogno di essere dipendenze del tuo Effetto.

#### Leggere valori primitivi dagli oggetti {/*read-primitive-values-from-objects*/}

A volte, potresti ricevere un oggetto dalle props:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

Il rischio qui è che il componente genitore creerà l'oggetto durante la renderizzazione:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Questo farebbe re-sincronizzare il tuo Effetto ogni volta che il componente genitore si ri-renderizza. Per correggere, leggi le informazioni dall'oggetto *fuori* dall'Effetto, ed evita di avere dipendenze su oggetti e funzioni:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

La logica diventa un po' ripetitiva (leggi alcuni valori da un oggetto fuori dall'Effetto, e poi crei un oggetto con gli stessi valori dentro l'Effetto). Ma rende molto esplicito da quali informazioni il tuo Effetto *effettivamente* dipende. Se un oggetto viene ricreato involontariamente dal componente genitore, la chat non si riconnetterebbe. Tuttavia, se `options.roomId` o `options.serverUrl` sono davvero diversi, la chat si riconnetterebbe.

#### Calcolare valori primitivi dalle funzioni {/*calculate-primitive-values-from-functions*/}

Lo stesso approccio può funzionare per le funzioni. Per esempio, supponiamo che il componente genitore passi una funzione:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Per evitare di renderla una dipendenza (e farla riconnettere alle ri-renderizzazioni), chiamala fuori dall'Effetto. Questo ti dà i valori `roomId` e `serverUrl` che non sono oggetti, e che puoi leggere dall'interno del tuo Effetto:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

Questo funziona solo per funzioni [puri](/learn/keeping-components-pure) perché sono sicure da chiamare durante la renderizzazione. Se la tua funzione è un gestore di eventi, ma non vuoi che i suoi cambiamenti re-sincronizzino il tuo Effetto, [avvolgila in un Effect Event invece.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Le dipendenze devono sempre corrispondere al codice.
- Quando non sei soddisfatto delle tue dipendenze, ciò che devi modificare è il codice.
- Sopprimere il linter porta a bug molto confusi, e dovresti sempre evitarlo.
- Per rimuovere una dipendenza, devi "dimostrare" al linter che non è necessaria.
- Se del codice dovrebbe essere eseguito in risposta a una specifica interazione, sposta quel codice in un gestore di eventi.
- Se parti diverse del tuo Effetto dovrebbero rieseguirsi per motivi diversi, dividilo in più Effetti.
- Se vuoi aggiornare dello state in base allo state precedente, passa una funzione updater.
- Se vuoi leggere l'ultimo valore senza "reagire" ad esso, estrai un Effect Event dal tuo Effetto.
- In JavaScript, oggetti e funzioni sono considerati diversi se sono stati creati in momenti diversi.
- Cerca di evitare dipendenze su oggetti e funzioni. Spostali fuori dal componente o dentro l'Effetto.

</Recap>

<Challenges>

#### Correggere un intervallo che si resetta {/*fix-a-resetting-interval*/}

Questo Effetto configura un intervallo che scatta ogni secondo. Hai notato qualcosa di strano: sembra che l'intervallo venga distrutto e ricreato ogni volta che scatta. Correggi il codice in modo che l'intervallo non venga ricreato costantemente.

<Hint>

Sembra che il codice di questo Effetto dipenda da `count`. C'è un modo per non aver bisogno di questa dipendenza? Dovrebbe esserci un modo per aggiornare lo state `count` in base al suo valore precedente senza aggiungere una dipendenza su quel valore.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

Vuoi aggiornare lo state `count` a `count + 1` dall'interno dell'Effetto. Tuttavia, questo fa dipendere il tuo Effetto da `count`, che cambia a ogni tick, ed ecco perché il tuo intervallo viene ricreato a ogni tick.

Per risolvere, usa la [funzione updater](/reference/react/useState#updating-state-based-on-the-previous-state) e scrivi `setCount(c => c + 1)` invece di `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Invece di leggere `count` dentro l'Effetto, passi a React un'istruzione `c => c + 1` ("incrementa questo numero!"). React la applicherà alla prossima renderizzazione. E poiché non hai più bisogno di leggere il valore di `count` dentro il tuo Effetto, puoi mantenere vuote le dipendenze del tuo Effetto (`[]`). Questo impedisce al tuo Effetto di ricreare l'intervallo a ogni tick.

</Solution>

#### Correggere un'animazione che si riattiva {/*fix-a-retriggering-animation*/}

In questo esempio, quando premi "Show", un messaggio di benvenuto appare con un fade-in. L'animazione dura un secondo. Quando premi "Remove", il messaggio di benvenuto scompare immediatamente. La logica per l'animazione fade-in è implementata nel file `animation.js` come semplice [animation loop](https://developer.mozilla.org/it/docs/Web/API/window/requestAnimationFrame) JavaScript. Non devi cambiare quella logica. Puoi trattarla come una libreria di terze parti. Il tuo Effetto crea un'istanza di `FadeInAnimation` per il nodo DOM, e poi chiama `start(duration)` o `stop()` per controllare l'animazione. La `duration` è controllata da uno slider. Regola lo slider e osserva come cambia l'animazione.

Questo codice funziona già, ma c'è qualcosa che vuoi cambiare. Attualmente, quando muovi lo slider che controlla la variabile di state `duration`, l'animazione si riattiva. Cambia il comportamento in modo che l'Effetto non "reagisca" alla variabile `duration`. Quando premi "Show", l'Effetto dovrebbe usare la `duration` corrente sullo slider. Tuttavia, muovere lo slider di per sé non dovrebbe riattivare l'animazione.

<Hint>

C'è una riga di codice dentro l'Effetto che non dovrebbe essere reattiva? Come puoi spostare il codice non reattivo fuori dall'Effetto?

</Hint>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
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
```

</Sandpack>

<Solution>

Il tuo Effetto ha bisogno di leggere l'ultimo valore di `duration`, ma non vuoi che "reagisca" ai cambiamenti di `duration`. Usi `duration` per avviare l'animazione, ma avviare l'animazione non è reattivo. Estrai la riga di codice non reattiva in un Effect Event, e chiama quella funzione dal tuo Effetto.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
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
```

</Sandpack>

Gli Effect Event come `onAppear` non sono reattivi, quindi puoi leggere `duration` al loro interno senza riattivare l'animazione.

</Solution>

#### Correggere una chat che si riconnette {/*fix-a-reconnecting-chat*/}

In questo esempio, ogni volta che premi "Toggle theme", la chat si riconnette. Perché succede? Correggi l'errore in modo che la chat si riconnetta solo quando modifichi l'URL del Server o scegli una chat room diversa.

Tratta `chat.js` come una libreria di terze parti esterna: puoi consultarla per verificare la sua API, ma non modificarla.

<Hint>

C'è più di un modo per correggere questo, ma in ultima analisi vuoi evitare di avere un oggetto come dipendenza.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Il tuo Effetto si riesegue perché dipende dall'oggetto `options`. Gli oggetti possono essere ricreati involontariamente, dovresti cercare di evitarli come dipendenze dei tuoi Effetti quando possibile.

La correzione meno invasiva è leggere `roomId` e `serverUrl` subito fuori dall'Effetto, e poi far dipendere l'Effetto da quei valori primitivi (che non possono cambiare involontariamente). Dentro l'Effetto, crea un oggetto e passalo a `createConnection`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Sarebbe ancora meglio sostituire la prop oggetto `options` con le props più specifiche `roomId` e `serverUrl`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Attenersi a props primitive quando possibile rende più facile ottimizzare i tuoi componenti in seguito.

</Solution>

#### Correggere una chat che si riconnette, di nuovo {/*fix-a-reconnecting-chat-again*/}

Questo esempio si connette alla chat con o senza crittografia. Attiva/disattiva la checkbox e nota i messaggi diversi nella console quando la crittografia è attiva o disattiva. Prova a cambiare stanza. Poi, prova ad attivare/disattivare il tema. Quando sei connesso a una chat room, riceverai nuovi messaggi ogni pochi secondi. Verifica che il loro colore corrisponda al tema che hai scelto.

In questo esempio, la chat si riconnette ogni volta che provi a cambiare il tema. Correggi questo. Dopo la correzione, cambiare il tema non dovrebbe riconnettere la chat, ma attivare/disattivare le impostazioni di crittografia o cambiare stanza dovrebbe riconnettere.

Non cambiare alcun codice in `chat.js`. A parte questo, puoi cambiare qualsiasi codice purché produca lo stesso comportamento. Per esempio, potresti trovare utile cambiare quali props vengono passate.

<Hint>

Stai passando due funzioni: `onMessage` e `createConnection`. Entrambe vengono create da zero ogni volta che `App` si ri-renderizza. Sono considerate nuovi valori ogni volta, ed ecco perché riattivano il tuo Effetto.

Una di queste funzioni è un gestore di eventi. Conosci un modo per chiamare un gestore di eventi da un Effetto senza "reagire" ai nuovi valori della funzione gestore di eventi? Sarebbe utile!

Un'altra di queste funzioni esiste solo per passare dello state a un metodo API importato. Questa funzione è davvero necessaria? Qual è l'informazione essenziale che viene passata? Potresti dover spostare alcuni import da `App.js` a `ChatRoom.js`.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

C'è più di un modo corretto per risolvere questo, ma ecco una possibile soluzione.

Nell'esempio originale, attivare/disattivare il tema causava la creazione e il passaggio di funzioni `onMessage` e `createConnection` diverse. Poiché l'Effetto dipendeva da queste funzioni, la chat si riconnetterebbe ogni volta che attivi/disattivi il tema.

Per correggere il problema con `onMessage`, dovevi avvolgerlo in un Effect Event:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

A differenza della prop `onMessage`, l'Effect Event `onReceiveMessage` non è reattivo. Ecco perché non ha bisogno di essere una dipendenza del tuo Effetto. Di conseguenza, i cambiamenti a `onMessage` non faranno riconnettere la chat.

Non puoi fare lo stesso con `createConnection` perché *dovrebbe* essere reattivo. *Vuoi* che l'Effetto si riattivi se l'utente passa tra una connessione crittografata e una non crittografata, o se l'utente cambia la stanza corrente. Tuttavia, poiché `createConnection` è una funzione, non puoi verificare se le informazioni che legge sono *effettivamente* cambiate o no. Per risolvere, invece di passare `createConnection` dal componente `App`, passa i valori grezzi `roomId` e `isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Ora puoi spostare la funzione `createConnection` *dentro* l'Effetto invece di passarla dal `App`:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

Dopo queste due modifiche, il tuo Effetto non dipende più da alcun valore funzione:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

Di conseguenza, la chat si riconnette solo quando cambia qualcosa di significativo (`roomId` o `isEncrypted`):

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
