---
title: Ciclo di vita degli Effetti reattivi
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e potrebbe beneficiare di una revisione umana. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/lifecycle-of-reactive-effects.md).

</Note>

<Intro>

Gli Effetti hanno un ciclo di vita diverso dai componenti. I componenti possono montare, aggiornarsi o smontarsi. Un Effetto può fare solo due cose: avviare la sincronizzazione di qualcosa e, in seguito, fermarla. Questo ciclo può ripetersi più volte se il tuo Effetto dipende da props e state che cambiano nel tempo. React fornisce una regola del linter per verificare che tu abbia specificato correttamente le dipendenze del tuo Effetto. Questo mantiene il tuo Effetto sincronizzato con le props e lo state più recenti.

</Intro>

<YouWillLearn>

- In che modo il ciclo di vita di un Effetto è diverso dal ciclo di vita di un componente
- Come pensare a ciascun singolo Effetto in isolamento
- Quando il tuo Effetto deve re-sincronizzarsi e perché
- Come vengono determinate le dipendenze del tuo Effetto
- Cosa significa che un valore è reattivo
- Cosa significa un array di dipendenze vuoto
- Come React verifica che le tue dipendenze siano corrette con un linter
- Cosa fare quando non sei d'accordo con il linter

</YouWillLearn>

## Il ciclo di vita di un Effetto {/*the-lifecycle-of-an-effect*/}

Ogni componente React attraversa lo stesso ciclo di vita:

- Un componente _monta_ quando viene aggiunto allo schermo.
- Un componente _si aggiorna_ quando riceve nuove props o state, di solito in risposta a un'interazione.
- Un componente _smonta_ quando viene rimosso dallo schermo.

**È un buon modo di pensare ai componenti, ma _non_ agli Effetti.** Invece, prova a pensare a ciascun Effetto indipendentemente dal ciclo di vita del tuo componente. Un Effetto descrive come [sincronizzare un sistema esterno](/learn/synchronizing-with-effects) con le props e lo state attuali. Man mano che il tuo codice cambia, la sincronizzazione dovrà avvenire più o meno spesso.

Per illustrare questo punto, considera questo Effetto che connette il tuo componente a un server di chat:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Il corpo del tuo Effetto specifica come **avviare la sincronizzazione:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

La funzione di cleanup restituita dal tuo Effetto specifica come **fermare la sincronizzazione:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Intuitivamente, potresti pensare che React **avvii la sincronizzazione** quando il tuo componente monta e **la fermi** quando il tuo componente smonta. Tuttavia, non è tutto qui! A volte può essere necessario **avviare e fermare la sincronizzazione più volte** mentre il componente resta montato.

Vediamo _perché_ è necessario, _quando_ succede e _come_ puoi controllare questo comportamento.

<Note>

Alcuni Effetti non restituiscono affatto una funzione di cleanup. [Nella maggior parte dei casi,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) vorrai restituirne una — ma se non lo fai, React si comporterà come se avessi restituito una funzione di cleanup vuota.

</Note>

### Perché la sincronizzazione può dover avvenire più di una volta {/*why-synchronization-may-need-to-happen-more-than-once*/}

Immagina che questo componente `ChatRoom` riceva una prop `roomId` che l'utente seleziona in un menu a tendina. Supponiamo che inizialmente l'utente scelga la stanza `"general"` come `roomId`. La tua app mostra la chat room `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Dopo che l'UI è stata visualizzata, React eseguirà il tuo Effetto per **avviare la sincronizzazione.** Si connette alla stanza `"general"`:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
  }, [roomId]);
  // ...
```

Fin qui, tutto bene.

In seguito, l'utente sceglie una stanza diversa nel menu a tendina (per esempio, `"travel"`). Per prima cosa, React aggiornerà l'UI:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Pensa a cosa dovrebbe succedere dopo. L'utente vede che `"travel"` è la chat room selezionata nell'UI. Tuttavia, l'Effetto eseguito l'ultima volta è ancora connesso alla stanza `"general"`. **La prop `roomId` è cambiata, quindi ciò che il tuo Effetto ha fatto in precedenza (connettersi alla stanza `"general"`) non corrisponde più all'UI.**

A questo punto, vuoi che React faccia due cose:

1. Fermare la sincronizzazione con il vecchio `roomId` (disconnettersi dalla stanza `"general"`)
2. Avviare la sincronizzazione con il nuovo `roomId` (connettersi alla stanza `"travel"`)

**Per fortuna, hai già insegnato a React come fare entrambe le cose!** Il corpo del tuo Effetto specifica come avviare la sincronizzazione e la tua funzione di cleanup specifica come fermarla. Tutto ciò che React deve fare ora è chiamarle nell'ordine corretto e con le props e lo state corretti. Vediamo esattamente come avviene.

### Come React re-sincronizza il tuo Effetto {/*how-react-re-synchronizes-your-effect*/}

Ricorda che il tuo componente `ChatRoom` ha ricevuto un nuovo valore per la prop `roomId`. Prima era `"general"`, ora è `"travel"`. React deve re-sincronizzare il tuo Effetto per riconnetterti a una stanza diversa.

Per **fermare la sincronizzazione,** React chiamerà la funzione di cleanup che il tuo Effetto ha restituito dopo essersi connesso alla stanza `"general"`. Poiché `roomId` era `"general"`, la funzione di cleanup si disconnette dalla stanza `"general"`:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
    // ...
```

Poi React eseguirà l'Effetto che hai fornito durante questa renderizzazione. Questa volta, `roomId` è `"travel"`, quindi **avvierà la sincronizzazione** con la chat room `"travel"` (finché anche la sua funzione di cleanup non verrà chiamata):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "travel" room
    connection.connect();
    // ...
```

Grazie a questo, ora sei connesso alla stessa stanza che l'utente ha scelto nell'UI. Disastro evitato!

Ogni volta che il tuo componente si ri-renderizza con un `roomId` diverso, il tuo Effetto si re-sincronizzerà. Per esempio, supponiamo che l'utente cambi `roomId` da `"travel"` a `"music"`. React **fermerà di nuovo la sincronizzazione** del tuo Effetto chiamando la sua funzione di cleanup (disconnettendoti dalla stanza `"travel"`). Poi **riavvierà la sincronizzazione** eseguendo il suo corpo con la nuova prop `roomId` (connettendoti alla stanza `"music"`).

Infine, quando l'utente va a una schermata diversa, `ChatRoom` smonta. Ora non c'è più bisogno di restare connessi. React **fermerà la sincronizzazione** del tuo Effetto un'ultima volta e ti disconnetterà dalla chat room `"music"`.

### Pensare dal punto di vista dell'Effetto {/*thinking-from-the-effects-perspective*/}

Ricapitoliamo tutto ciò che è successo dal punto di vista del componente `ChatRoom`:

1. `ChatRoom` monta con `roomId` impostato su `"general"`
1. `ChatRoom` si aggiorna con `roomId` impostato su `"travel"`
1. `ChatRoom` si aggiorna con `roomId` impostato su `"music"`
1. `ChatRoom` smonta

Durante ciascuno di questi punti del ciclo di vita del componente, il tuo Effetto ha fatto cose diverse:

1. Il tuo Effetto si è connesso alla stanza `"general"`
1. Il tuo Effetto si è disconnesso dalla stanza `"general"` e si è connesso alla stanza `"travel"`
1. Il tuo Effetto si è disconnesso dalla stanza `"travel"` e si è connesso alla stanza `"music"`
1. Il tuo Effetto si è disconnesso dalla stanza `"music"`

Ora pensiamo a cosa è successo dal punto di vista dell'Effetto stesso:

```js
  useEffect(() => {
    // Your Effect connected to the room specified with roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...until it disconnected
      connection.disconnect();
    };
  }, [roomId]);
```

La struttura di questo codice potrebbe ispirarti a vedere ciò che è successo come una sequenza di periodi di tempo non sovrapposti:

1. Il tuo Effetto si è connesso alla stanza `"general"` (finché non si è disconnesso)
1. Il tuo Effetto si è connesso alla stanza `"travel"` (finché non si è disconnesso)
1. Il tuo Effetto si è connesso alla stanza `"music"` (finché non si è disconnesso)

In precedenza, pensavi dal punto di vista del componente. Quando guardavi dal punto di vista del componente, era tentante pensare agli Effetti come "callback" o "eventi del ciclo di vita" che scattano in un momento specifico come "dopo una renderizzazione" o "prima dello smontaggio". Questo modo di pensare diventa complicato molto rapidamente, quindi è meglio evitarlo.

**Invece, concentrati sempre su un singolo ciclo di avvio/arresto alla volta. Non dovrebbe importare se un componente sta montando, aggiornandosi o smontando. Tutto ciò che devi fare è descrivere come avviare la sincronizzazione e come fermarla. Se lo fai bene, il tuo Effetto sarà resiliente all'essere avviato e fermato quante volte è necessario.**

Questo potrebbe ricordarti come non pensi se un componente sta montando o aggiornandosi quando scrivi la logica di renderizzazione che crea il JSX. Descrivi cosa dovrebbe esserci sullo schermo e React [fa il resto.](/learn/reacting-to-input-with-state)

### Come React verifica che il tuo Effetto possa re-sincronizzarsi {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Ecco un esempio interattivo con cui puoi giocare. Premi "Open chat" per montare il componente `ChatRoom`:

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

Nota che quando il componente monta per la prima volta, vedi tre log:

1. `✅ Connecting to "general" room at https://localhost:1234...` *(solo in sviluppo)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(solo in sviluppo)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

I primi due log sono solo in sviluppo. In sviluppo, React rimonta sempre ogni componente una volta.

**React verifica che il tuo Effetto possa re-sincronizzarsi forzandolo a farlo immediatamente in sviluppo.** Questo potrebbe ricordarti l'apertura di una porta e la sua chiusura un'ulteriore volta per verificare se la serratura funziona. React avvia e ferma il tuo Effetto un'ulteriore volta in sviluppo per verificare [che tu abbia implementato bene la sua cleanup.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

Il motivo principale per cui il tuo Effetto si re-sincronizzerà in pratica è se sono cambiati alcuni dati che usa. Nella sandbox sopra, cambia la chat room selezionata. Nota come, quando `roomId` cambia, il tuo Effetto si re-sincronizza.

Tuttavia, ci sono anche casi più insoliti in cui la re-sincronizzazione è necessaria. Per esempio, prova a modificare `serverUrl` nella sandbox sopra mentre la chat è aperta. Nota come l'Effetto si re-sincronizza in risposta alle tue modifiche al codice. In futuro, React potrebbe aggiungere altre funzionalità che si basano sulla re-sincronizzazione.

### Come React sa che deve re-sincronizzare l'Effetto {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Potresti chiederti come React ha saputo che il tuo Effetto doveva re-sincronizzarsi dopo il cambio di `roomId`. È perché *hai detto a React* che il suo codice dipende da `roomId` includendolo nell'[elenco delle dipendenze:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // The roomId prop may change over time
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads roomId
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // So you tell React that this Effect "depends on" roomId
  // ...
```

Ecco come funziona:

1. Sapevi che `roomId` è una prop, il che significa che può cambiare nel tempo.
2. Sapevi che il tuo Effetto legge `roomId` (quindi la sua logica dipende da un valore che potrebbe cambiare in seguito).
3. Per questo l'hai specificato come dipendenza del tuo Effetto (in modo che si re-sincronizzi quando `roomId` cambia).

Ogni volta che il tuo componente si ri-renderizza, React esaminerà l'array di dipendenze che hai passato. Se uno qualsiasi dei valori nell'array è diverso dal valore nella stessa posizione che hai passato durante la renderizzazione precedente, React re-sincronizzerà il tuo Effetto.

Per esempio, se hai passato `["general"]` durante la renderizzazione iniziale e in seguito hai passato `["travel"]` durante la renderizzazione successiva, React confronterà `"general"` e `"travel"`. Questi sono valori diversi (confrontati con [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), quindi React re-sincronizzerà il tuo Effetto. D'altra parte, se il tuo componente si ri-renderizza ma `roomId` non è cambiato, il tuo Effetto resterà connesso alla stessa stanza.

### Ogni Effetto rappresenta un processo di sincronizzazione separato {/*each-effect-represents-a-separate-synchronization-process*/}

Resisti all'impulso di aggiungere logica non correlata al tuo Effetto solo perché questa logica deve girare nello stesso momento di un Effetto che hai già scritto. Per esempio, supponiamo che tu voglia inviare un evento analytics quando l'utente visita la stanza. Hai già un Effetto che dipende da `roomId`, quindi potresti sentirti tentato di aggiungere lì la chiamata analytics:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Ma immagina di aggiungere in seguito un'altra dipendenza a questo Effetto che necessita di ristabilire la connessione. Se questo Effetto si re-sincronizza, chiamerà anche `logVisit(roomId)` per la stessa stanza, cosa che non intendevi. Registrare la visita **è un processo separato** dalla connessione. Scrivili come due Effetti separati:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Ogni Effetto nel tuo codice dovrebbe rappresentare un processo di sincronizzazione separato e indipendente.**

Nell'esempio sopra, eliminare un Effetto non romperebbe la logica dell'altro Effetto. Questa è una buona indicazione che sincronizzano cose diverse, quindi aveva senso separarli. D'altra parte, se dividi un pezzo coeso di logica in Effetti separati, il codice potrebbe sembrare "più pulito" ma sarà [più difficile da mantenere.](/learn/you-might-not-need-an-effect#chains-of-computations) Per questo dovresti pensare se i processi sono gli stessi o separati, non se il codice sembra più pulito.

## Gli Effetti "reagiscono" ai valori reattivi {/*effects-react-to-reactive-values*/}

Il tuo Effetto legge due variabili (`serverUrl` e `roomId`), ma hai specificato solo `roomId` come dipendenza:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Perché `serverUrl` non ha bisogno di essere una dipendenza?

Questo perché `serverUrl` non cambia mai a causa di una ri-renderizzazione. È sempre lo stesso indipendentemente da quante volte il componente si ri-renderizza e perché. Poiché `serverUrl` non cambia mai, non avrebbe senso specificarlo come dipendenza. Dopotutto, le dipendenze fanno qualcosa solo quando cambiano nel tempo!

D'altra parte, `roomId` potrebbe essere diverso in una ri-renderizzazione. **Props, state e altri valori dichiarati all'interno del componente sono _reattivi_ perché vengono calcolati durante la renderizzazione e partecipano al flusso di dati di React.**

Se `serverUrl` fosse una variabile di state, sarebbe reattivo. I valori reattivi devono essere inclusi nelle dipendenze:

```js {2,5,10}
function ChatRoom({ roomId }) { // Props change over time
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State may change over time

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads props and state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So you tell React that this Effect "depends on" on props and state
  // ...
}
```

Includendo `serverUrl` come dipendenza, ti assicuri che l'Effetto si re-sincronizzi dopo che cambia.

Prova a cambiare la chat room selezionata o a modificare l'URL del server in questa sandbox:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
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

Ogni volta che cambi un valore reattivo come `roomId` o `serverUrl`, l'Effetto si riconnette al server di chat.

### Cosa significa un Effetto con dipendenze vuote {/*what-an-effect-with-empty-dependencies-means*/}

Cosa succede se sposti sia `serverUrl` che `roomId` fuori dal componente?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

Ora il codice del tuo Effetto non usa *alcun* valore reattivo, quindi le sue dipendenze possono essere vuote (`[]`).

Pensando dal punto di vista del componente, l'array di dipendenze vuoto `[]` significa che questo Effetto si connette alla chat room solo quando il componente monta e si disconnette solo quando il componente smonta. (Tieni presente che React [lo re-sincronizzerebbe comunque un'ulteriore volta](#how-react-verifies-that-your-effect-can-re-synchronize) in sviluppo per mettere alla prova la tua logica.)


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

Tuttavia, se [pensi dal punto di vista dell'Effetto,](#thinking-from-the-effects-perspective) non hai bisogno di pensare affatto a montaggio e smontaggio. Ciò che è importante è che tu abbia specificato cosa fa il tuo Effetto per avviare e fermare la sincronizzazione. Oggi non ha dipendenze reattive. Ma se in futuro vorrai che l'utente cambi `roomId` o `serverUrl` nel tempo (e diventerebbero reattivi), il codice del tuo Effetto non cambierà. Dovrai solo aggiungerli alle dipendenze.

### Tutte le variabili dichiarate nel corpo del componente sono reattive {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props e state non sono gli unici valori reattivi. Anche i valori che calcoli a partire da essi sono reattivi. Se le props o lo state cambiano, il tuo componente si ri-renderizzerà e anche i valori calcolati a partire da essi cambieranno. Per questo tutte le variabili del corpo del componente usate dall'Effetto dovrebbero essere nell'elenco delle dipendenze dell'Effetto.

Supponiamo che l'utente possa scegliere un server di chat nel menu a tendina, ma possa anche configurare un server predefinito nelle impostazioni. Supponiamo che tu abbia già messo lo state delle impostazioni in un [context](/learn/scaling-up-with-reducer-and-context) così leggi `settings` da quel context. Ora calcoli `serverUrl` in base al server selezionato dalle props e al server predefinito:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId is reactive
  const settings = useContext(SettingsContext); // settings is reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads roomId and serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So it needs to re-synchronize when either of them changes!
  // ...
}
```

In questo esempio, `serverUrl` non è una prop né una variabile di state. È una variabile regolare che calcoli durante la renderizzazione. Ma viene calcolata durante la renderizzazione, quindi può cambiare a causa di una ri-renderizzazione. Per questo è reattiva.

**Tutti i valori all'interno del componente (incluse props, state e variabili nel corpo del componente) sono reattivi. Qualsiasi valore reattivo può cambiare in una ri-renderizzazione, quindi devi includere i valori reattivi come dipendenze dell'Effetto.**

In altre parole, gli Effetti "reagiscono" a tutti i valori del corpo del componente.

<DeepDive>

#### I valori globali o mutabili possono essere dipendenze? {/*can-global-or-mutable-values-be-dependencies*/}

I valori mutabili (incluse le variabili globali) non sono reattivi.

**Un valore mutabile come [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) non può essere una dipendenza.** È mutabile, quindi può cambiare in qualsiasi momento completamente al di fuori del flusso di dati di renderizzazione di React. Cambiarlo non avvierebbe una ri-renderizzazione del tuo componente. Pertanto, anche se lo specificassi nelle dipendenze, React *non saprebbe* di re-sincronizzare l'Effetto quando cambia. Questo viola anche le regole di React perché leggere dati mutabili durante la renderizzazione (quando calcoli le dipendenze) rompe la [purezza della renderizzazione.](/learn/keeping-components-pure) Invece, dovresti leggere e sottoscriverti a un valore mutabile esterno con [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Un valore mutabile come [`ref.current`](/reference/react/useRef#reference) o ciò che leggi da esso non può essere una dipendenza.** L'oggetto ref restituito da `useRef` stesso può essere una dipendenza, ma la sua proprietà `current` è intenzionalmente mutabile. Ti permette di [tenere traccia di qualcosa senza avviare una ri-renderizzazione.](/learn/referencing-values-with-refs) Ma poiché cambiarlo non avvia una ri-renderizzazione, non è un valore reattivo e React non saprà di rieseguire il tuo Effetto quando cambia.

Come imparerai più avanti in questa pagina, un linter verificherà automaticamente questi problemi.

</DeepDive>

### React verifica che tu abbia specificato ogni valore reattivo come dipendenza {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Se il tuo linter è [configurato per React,](/learn/editor-setup#linting) verificherà che ogni valore reattivo usato dal codice del tuo Effetto sia dichiarato come sua dipendenza. Per esempio, questo è un errore del linter perché sia `roomId` che `serverUrl` sono reattivi:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!

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

Questo potrebbe sembrare un errore di React, ma in realtà React sta segnalando un bug nel tuo codice. Sia `roomId` che `serverUrl` possono cambiare nel tempo, ma stai dimenticando di re-sincronizzare il tuo Effetto quando cambiano. Resti connesso al `roomId` e `serverUrl` iniziali anche dopo che l'utente ha scelto valori diversi nell'UI.

Per correggere il bug, segui il suggerimento del linter di specificare `roomId` e `serverUrl` come dipendenze del tuo Effetto:

```js {9}
function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
```

Prova questa correzione nella sandbox sopra. Verifica che l'errore del linter sia sparito e che la chat si riconnetta quando necessario.

<Note>

In alcuni casi, React *sa* che un valore non cambia mai anche se è dichiarato all'interno del componente. Per esempio, la [funzione `set`](/reference/react/useState#setstate) restituita da `useState` e l'oggetto ref restituito da [`useRef`](/reference/react/useRef) sono *stabili* — è garantito che non cambino in una ri-renderizzazione. I valori stabili non sono reattivi, quindi puoi ometterli dall'elenco. Includerli è consentito: non cambieranno, quindi non importa.

</Note>

### Cosa fare quando non vuoi re-sincronizzare {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

Nell'esempio precedente, hai corretto l'errore del linter elencando `roomId` e `serverUrl` come dipendenze.

**Tuttavia, potresti invece "dimostrare" al linter che questi valori non sono valori reattivi,** cioè che *non possono* cambiare a causa di una ri-renderizzazione. Per esempio, se `serverUrl` e `roomId` non dipendono dalla renderizzazione e hanno sempre gli stessi valori, puoi spostarli fuori dal componente. Ora non hanno bisogno di essere dipendenze:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

Puoi anche spostarli *all'interno dell'Effetto.* Non vengono calcolati durante la renderizzazione, quindi non sono reattivi:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

**Gli Effetti sono blocchi di codice reattivi.** Si re-sincronizzano quando cambiano i valori che leggi al loro interno. A differenza dei gestori di eventi, che girano solo una volta per interazione, gli Effetti girano ogni volta che la sincronizzazione è necessaria.

**Non puoi "scegliere" le tue dipendenze.** Le tue dipendenze devono includere ogni [valore reattivo](#all-variables-declared-in-the-component-body-are-reactive) che leggi nell'Effetto. Il linter lo impone. A volte questo può portare a problemi come loop infiniti e al tuo Effetto che si re-sincronizza troppo spesso. Non correggere questi problemi sopprimendo il linter! Ecco cosa provare invece:

* **Verifica che il tuo Effetto rappresenti un processo di sincronizzazione indipendente.** Se il tuo Effetto non sincronizza nulla, [potrebbe essere superfluo.](/learn/you-might-not-need-an-effect) Se sincronizza diverse cose indipendenti, [dividilo.](#each-effect-represents-a-separate-synchronization-process)

* **Se vuoi leggere l'ultimo valore di props o state senza "reagire" ad esso e re-sincronizzare l'Effetto,** puoi dividere il tuo Effetto in una parte reattiva (che manterrai nell'Effetto) e una parte non reattiva (che estrarrai in qualcosa chiamato _Effect Event_). [Leggi riguardo alla separazione degli Eventi dagli Effetti.](/learn/separating-events-from-effects)

* **Evita di fare affidamento su oggetti e funzioni come dipendenze.** Se crei oggetti e funzioni durante la renderizzazione e poi li leggi da un Effetto, saranno diversi a ogni renderizzazione. Questo farà re-sincronizzare il tuo Effetto ogni volta. [Leggi di più sulla rimozione delle dipendenze non necessarie dagli Effetti.](/learn/removing-effect-dependencies)

<Pitfall>

Il linter è tuo amico, ma i suoi poteri sono limitati. Il linter sa solo quando le dipendenze sono *sbagliate*. Non sa *il modo migliore* per risolvere ogni caso. Se il linter suggerisce una dipendenza, ma aggiungerla causa un loop, non significa che il linter debba essere ignorato. Devi cambiare il codice all'interno (o all'esterno) dell'Effetto in modo che quel valore non sia reattivo e non *abbia bisogno* di essere una dipendenza.

Se hai una codebase esistente, potresti avere alcuni Effetti che sopprimono il linter così:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

Nelle [prossime](/learn/separating-events-from-effects) [pagine](/learn/removing-effect-dependencies), imparerai come correggere questo codice senza violare le regole. Vale sempre la pena correggerlo!

</Pitfall>

<Recap>

- I componenti possono montare, aggiornarsi e smontare.
- Ogni Effetto ha un ciclo di vita separato dal componente circostante.
- Ogni Effetto descrive un processo di sincronizzazione separato che può *avviarsi* e *fermarsi*.
- Quando scrivi e leggi gli Effetti, pensa dal punto di vista di ciascun singolo Effetto (come avviare e fermare la sincronizzazione) piuttosto che dal punto di vista del componente (come monta, si aggiorna o smonta).
- I valori dichiarati nel corpo del componente sono "reattivi".
- I valori reattivi dovrebbero re-sincronizzare l'Effetto perché possono cambiare nel tempo.
- Il linter verifica che tutti i valori reattivi usati all'interno dell'Effetto siano specificati come dipendenze.
- Tutti gli errori segnalati dal linter sono legittimi. C'è sempre un modo per correggere il codice senza violare le regole.

</Recap>

<Challenges>

#### Correggere la riconnessione a ogni battitura {/*fix-reconnecting-on-every-keystroke*/}

In questo esempio, il componente `ChatRoom` si connette alla chat room quando il componente monta, si disconnette quando smonta e si riconnette quando selezioni una chat room diversa. Questo comportamento è corretto, quindi devi mantenerlo funzionante.

Tuttavia, c'è un problema. Ogni volta che digiti nell'input del messaggio in basso, `ChatRoom` si riconnette *anche* alla chat. (Puoi notarlo svuotando la console e digitando nell'input.) Correggi il problema in modo che questo non accada.

<Hint>

Potresti aver bisogno di aggiungere un array di dipendenze per questo Effetto. Quali dipendenze dovrebbero esserci?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

Questo Effetto non aveva affatto un array di dipendenze, quindi si re-sincronizzava dopo ogni ri-renderizzazione. Per prima cosa, aggiungi un array di dipendenze. Poi, assicurati che ogni valore reattivo usato dall'Effetto sia specificato nell'array. Per esempio, `roomId` è reattivo (perché è una prop), quindi dovrebbe essere incluso nell'array. Questo garantisce che quando l'utente seleziona una stanza diversa, la chat si riconnetta. D'altra parte, `serverUrl` è definito fuori dal componente. Per questo non ha bisogno di essere nell'array.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### Attivare e disattivare la sincronizzazione {/*switch-synchronization-on-and-off*/}

In questo esempio, un Effetto si sottoscrive all'evento [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) della finestra per spostare un punto rosa sullo schermo. Prova a passare il mouse sull'area di anteprima (o a toccare lo schermo se sei su un dispositivo mobile) e vedi come il punto rosa segue il tuo movimento.

C'è anche una casella di controllo. Selezionare la casella attiva/disattiva la variabile di state `canMove`, ma questa variabile di state non è usata da nessuna parte nel codice. Il tuo compito è modificare il codice in modo che quando `canMove` è `false` (la casella è deselezionata), il punto smetta di muoversi. Dopo aver riattivato la casella (e impostato `canMove` su `true`), il punto dovrebbe seguire di nuovo il movimento. In altre parole, se il punto può muoversi o no dovrebbe restare sincronizzato con la selezione della casella di controllo.

<Hint>

Non puoi dichiarare un Effetto condizionalmente. Tuttavia, il codice all'interno dell'Effetto può usare condizioni!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

Una soluzione è avvolgere la chiamata a `setPosition` in una condizione `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

In alternativa, potresti avvolgere la logica di *sottoscrizione all'evento* in una condizione `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

In entrambi questi casi, `canMove` è una variabile reattiva che leggi all'interno dell'Effetto. Per questo deve essere specificata nell'elenco delle dipendenze dell'Effetto. Questo garantisce che l'Effetto si re-sincronizzi dopo ogni cambiamento del suo valore.

</Solution>

#### Indagare un bug di valore obsoleto {/*investigate-a-stale-value-bug*/}

In questo esempio, il punto rosa dovrebbe muoversi quando la casella è attiva e smettere di muoversi quando è disattivata. La logica per questo è già stata implementata: il gestore di eventi `handleMove` verifica la variabile di state `canMove`.

Tuttavia, per qualche motivo, la variabile di state `canMove` all'interno di `handleMove` sembra essere "obsoleta": è sempre `true`, anche dopo aver deselezionato la casella. Come è possibile? Trova l'errore nel codice e correggilo.

<Hint>

Se vedi una regola del linter soppressa, rimuovi la soppressione! Di solito lì si trovano gli errori.

</Hint>

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

<Solution>

Il problema con il codice originale era la soppressione del linter delle dipendenze. Se rimuovi la soppressione, vedrai che questo Effetto dipende dalla funzione `handleMove`. Ha senso: `handleMove` è dichiarata all'interno del corpo del componente, il che la rende un valore reattivo. Ogni valore reattivo deve essere specificato come dipendenza, altrimenti può diventare obsoleto nel tempo!

L'autore del codice originale ha "mentito" a React dicendo che l'Effetto non dipende (`[]`) da alcun valore reattivo. Per questo React non ha re-sincronizzato l'Effetto dopo che `canMove` è cambiato (e `handleMove` con esso). Poiché React non ha re-sincronizzato l'Effetto, il `handleMove` collegato come listener è la funzione `handleMove` creata durante la renderizzazione iniziale. Durante la renderizzazione iniziale, `canMove` era `true`, ed è per questo che `handleMove` dalla renderizzazione iniziale vedrà per sempre quel valore.

**Se non sopprimi mai il linter, non vedrai mai problemi con valori obsoleti.** Ci sono diversi modi per risolvere questo bug, ma dovresti sempre iniziare rimuovendo la soppressione del linter. Poi modifica il codice per correggere l'errore del linter.

Puoi cambiare le dipendenze dell'Effetto in `[handleMove]`, ma poiché sarà una funzione appena definita a ogni renderizzazione, potresti anche rimuovere del tutto l'array di dipendenze. Allora l'Effetto si *re-sincronizzerà* dopo ogni ri-renderizzazione:

<Sandpack>

```js
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
  });

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

Questa soluzione funziona, ma non è ideale. Se metti `console.log('Resubscribing')` all'interno dell'Effetto, noterai che si risottoscrive dopo ogni ri-renderizzazione. La risottoscrizione è veloce, ma sarebbe comunque bello evitare di farlo così spesso.

Una correzione migliore sarebbe spostare la funzione `handleMove` *all'interno* dell'Effetto. Allora `handleMove` non sarà un valore reattivo e quindi il tuo Effetto non dipenderà da una funzione. Invece, dovrà dipendere da `canMove`, che il tuo codice ora legge dall'interno dell'Effetto. Questo corrisponde al comportamento che volevi, poiché il tuo Effetto ora resterà sincronizzato con il valore di `canMove`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Prova ad aggiungere `console.log('Resubscribing')` all'interno del corpo dell'Effetto e nota che ora si risottoscrive solo quando attivi/disattivi la casella (`canMove` cambia) o modifichi il codice. Questo lo rende migliore dell'approccio precedente che si risottoscriveva sempre.

Imparerai un approccio più generale a questo tipo di problema in [Separare gli Eventi dagli Effetti.](/learn/separating-events-from-effects)

</Solution>

#### Correggere un cambio di connessione {/*fix-a-connection-switch*/}

In questo esempio, il servizio di chat in `chat.js` espone due API diverse: `createEncryptedConnection` e `createUnencryptedConnection`. Il componente radice `App` permette all'utente di scegliere se usare la crittografia o no, e poi passa il metodo API corrispondente al componente figlio `ChatRoom` come prop `createConnection`.

Nota che inizialmente i log della console dicono che la connessione non è crittografata. Prova ad attivare la casella: non succederà nulla. Tuttavia, se cambi la stanza selezionata dopo, la chat si riconnetterà *e* abiliterà la crittografia (come vedrai dai messaggi della console). Questo è un bug. Correggi il bug in modo che attivare/disattivare la casella *causi anche* la riconnessione della chat.

<Hint>

Sopprimere il linter è sempre sospetto. Potrebbe essere un bug?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [8]}} src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Se rimuovi la soppressione del linter, vedrai un errore del linter. Il problema è che `createConnection` è una prop, quindi è un valore reattivo. Può cambiare nel tempo! (Ed effettivamente dovrebbe — quando l'utente seleziona la casella, il componente padre passa un valore diverso della prop `createConnection`.) Per questo dovrebbe essere una dipendenza. Includila nell'elenco per correggere il bug:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

È corretto che `createConnection` sia una dipendenza. Tuttavia, questo codice è un po' fragile perché qualcuno potrebbe modificare il componente `App` per passare una funzione inline come valore di questa prop. In quel caso, il suo valore sarebbe diverso ogni volta che il componente `App` si ri-renderizza, quindi l'Effetto potrebbe re-sincronizzarsi troppo spesso. Per evitare questo, puoi passare `isEncrypted` invece:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

In questa versione, il componente `App` passa una prop booleana invece di una funzione. All'interno dell'Effetto, decidi quale funzione usare. Poiché sia `createEncryptedConnection` che `createUnencryptedConnection` sono dichiarate fuori dal componente, non sono reattive e non hanno bisogno di essere dipendenze. Imparerai di più su questo in [Rimuovere le dipendenze degli Effetti.](/learn/removing-effect-dependencies)

</Solution>

#### Popolare una catena di caselle di selezione {/*populate-a-chain-of-select-boxes*/}

In questo esempio, ci sono due caselle di selezione. Una casella permette all'utente di scegliere un pianeta. Un'altra casella permette all'utente di scegliere un luogo *su quel pianeta.* La seconda casella non funziona ancora. Il tuo compito è farle mostrare i luoghi sul pianeta scelto.

Guarda come funziona la prima casella di selezione. Popola lo state `planetList` con il risultato della chiamata API `"/planets"`. L'ID del pianeta attualmente selezionato è mantenuto nella variabile di state `planetId`. Devi trovare dove aggiungere del codice aggiuntivo in modo che la variabile di state `placeList` sia popolata con il risultato della chiamata API `"/planets/" + planetId + "/places"`.

Se lo implementi correttamente, selezionare un pianeta dovrebbe popolare l'elenco dei luoghi. Cambiare pianeta dovrebbe cambiare l'elenco dei luoghi.

<Hint>

Se hai due processi di sincronizzazione indipendenti, devi scrivere due Effetti separati.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Ci sono due processi di sincronizzazione indipendenti:

- La prima casella di selezione è sincronizzata con l'elenco remoto dei pianeti.
- La seconda casella di selezione è sincronizzata con l'elenco remoto dei luoghi per l'attuale `planetId`.

Per questo ha senso descriverli come due Effetti separati. Ecco un esempio di come potresti farlo:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Questo codice è un po' ripetitivo. Tuttavia, non è un buon motivo per combinarlo in un singolo Effetto! Se lo facessi, dovresti combinare le dipendenze di entrambi gli Effetti in un unico elenco, e poi cambiare il pianeta rifarebbe il fetch dell'elenco di tutti i pianeti. Gli Effetti non sono uno strumento per il riutilizzo del codice.

Invece, per ridurre la ripetizione, puoi estrarre parte della logica in un custom Hook come `useSelectOptions` qui sotto:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Controlla la scheda `useSelectOptions.js` nella sandbox per vedere come funziona. Idealmente, la maggior parte degli Effetti nella tua applicazione dovrebbe essere sostituita da custom Hooks, scritti da te o dalla community. I custom Hooks nascondono la logica di sincronizzazione, quindi il componente chiamante non sa dell'Effetto. Man mano che continui a lavorare sulla tua app, svilupperai una palette di Hooks tra cui scegliere, e alla fine non avrai bisogno di scrivere Effetti nei tuoi componenti molto spesso.

</Solution>

</Challenges>
