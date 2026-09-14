---
title: <StrictMode>
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/StrictMode.md).

</Note>

<Intro>

`<StrictMode>` ti permette di trovare bug comuni nei tuoi componenti in anticipo durante lo sviluppo.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

Usa `StrictMode` per abilitare comportamenti e warning aggiuntivi di sviluppo per l'albero di componenti al suo interno:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[Vedi altri esempi sotto.](#usage)

Strict Mode abilita i seguenti comportamenti solo di sviluppo:

- I tuoi componenti [renderizzeranno di nuovo un'ulteriore volta](#fixing-bugs-found-by-double-rendering-in-development) per trovare bug causati da renderizzazione impura.
- I tuoi componenti [rieseguiranno gli Effetti un'ulteriore volta](#fixing-bugs-found-by-re-running-effects-in-development) per trovare bug causati da cleanup degli Effetti mancante.
- I tuoi componenti [rieseguiranno i callback ref un'ulteriore volta](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) per trovare bug causati da cleanup dei ref mancante.
- I tuoi componenti [verranno controllati per l'uso di API deprecate.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode` non accetta props.

#### Caveats {/*caveats*/}

* Non c'è modo di disattivare Strict Mode all'interno di un albero avvolto in `<StrictMode>`. Questo ti dà la certezza che tutti i componenti dentro `<StrictMode>` vengono controllati. Se due team che lavorano su un prodotto non concordano sul valore dei controlli, devono trovare un consenso o spostare `<StrictMode>` più in basso nell'albero.

---

## Usage {/*usage*/}

### Abilitare Strict Mode per l'intera app {/*enabling-strict-mode-for-entire-app*/}

Strict Mode abilita controlli aggiuntivi solo di sviluppo per l'intero albero di componenti dentro il componente `<StrictMode>`. Questi controlli ti aiutano a trovare bug comuni nei tuoi componenti all'inizio del processo di sviluppo.


Per abilitare Strict Mode per l'intera app, avvolgi il componente root con `<StrictMode>` quando lo renderizzi:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Ti consigliamo di avvolgere l'intera app in Strict Mode, soprattutto per le app appena create. Se usi un framework che chiama [`createRoot`](/reference/react-dom/client/createRoot) per te, controlla la sua documentazione per sapere come abilitare Strict Mode.

Sebbene i controlli di Strict Mode **vengano eseguiti solo in sviluppo,** ti aiutano a trovare bug già presenti nel tuo codice ma difficili da riprodurre in modo affidabile in produzione. Strict Mode ti permette di correggere i bug prima che i tuoi utenti li segnalino.

<Note>

Strict Mode abilita i seguenti controlli in sviluppo:

- I tuoi componenti [renderizzeranno di nuovo un'ulteriore volta](#fixing-bugs-found-by-double-rendering-in-development) per trovare bug causati da renderizzazione impura.
- I tuoi componenti [rieseguiranno gli Effetti un'ulteriore volta](#fixing-bugs-found-by-re-running-effects-in-development) per trovare bug causati da cleanup degli Effetti mancante.
- I tuoi componenti [rieseguiranno i callback ref un'ulteriore volta](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) per trovare bug causati da cleanup dei ref mancante.
- I tuoi componenti [verranno controllati per l'uso di API deprecate.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Tutti questi controlli sono solo di sviluppo e non influenzano il build di produzione.**

</Note>

---

### Abilitare Strict Mode per una parte dell'app {/*enabling-strict-mode-for-a-part-of-the-app*/}

Puoi anche abilitare Strict Mode per qualsiasi parte della tua applicazione:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

In questo esempio, i controlli di Strict Mode non verranno eseguiti sui componenti `Header` e `Footer`. Tuttavia, verranno eseguiti su `Sidebar` e `Content`, così come su tutti i componenti al loro interno, indipendentemente dalla profondità.

<Note>

Quando `StrictMode` è abilitato per una parte dell'app, React abiliterà solo comportamenti possibili in produzione. Per esempio, se `<StrictMode>` non è abilitato alla root dell'app, non [rieseguirà gli Effetti un'ulteriore volta](#fixing-bugs-found-by-re-running-effects-in-development) al mount iniziale, poiché ciò causerebbe il doppio avvio degli effetti figli senza gli effetti genitore, cosa che non può accadere in produzione.

</Note>

---

### Correggere bug trovati dalla doppia renderizzazione in sviluppo {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React assume che ogni componente che scrivi sia una funzione pura.](/learn/keeping-components-pure) Questo significa che i componenti React che scrivi devono sempre restituire lo stesso JSX dati gli stessi input (props, state e context).

I componenti che violano questa regola si comportano in modo imprevedibile e causano bug. Per aiutarti a trovare codice accidentalmente impuro, Strict Mode chiama alcune delle tue funzioni (solo quelle che dovrebbero essere pure) **due volte in sviluppo.** Questo include:

- Il corpo della funzione del componente (solo la logica di top level, quindi non include codice dentro i gestori di eventi)
- Funzioni che passi a [`useState`](/reference/react/useState), [funzioni `set`](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo) o [`useReducer`](/reference/react/useReducer)
- Alcuni metodi di componenti classe come [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([vedi l'elenco completo](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Se una funzione è pura, eseguirla due volte non cambia il suo comportamento perché una funzione pura produce lo stesso risultato ogni volta. Tuttavia, se una funzione è impura (per esempio, muta i dati che riceve), eseguirla due volte tende a essere evidente (ed è questo che la rende impura!) Questo ti aiuta a individuare e correggere il bug in anticipo.

**Ecco un esempio per illustrare come la doppia renderizzazione in Strict Mode ti aiuta a trovare bug in anticipo.**

Questo componente `StoryTray` accetta un array di `stories` e aggiunge un ultimo elemento "Create Story" alla fine:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

C'è un errore nel codice sopra. Tuttavia, è facile non accorgersene perché l'output iniziale appare corretto.

Questo errore diventerà più evidente se il componente `StoryTray` viene renderizzato di nuovo più volte. Per esempio, facciamo in modo che `StoryTray` venga renderizzato di nuovo con un colore di sfondo diverso ogni volta che ci passi sopra con il mouse:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Nota come ogni volta che passi sopra il componente `StoryTray` con il mouse, "Create Story" viene aggiunto di nuovo alla lista. L'intenzione del codice era aggiungerlo una sola volta alla fine. Ma `StoryTray` modifica direttamente l'array `stories` dalle props. Ogni volta che `StoryTray` renderizza, aggiunge di nuovo "Create Story" alla fine dello stesso array. In altre parole, `StoryTray` non è una funzione pura — eseguirla più volte produce risultati diversi.

Per correggere questo problema, puoi fare una copia dell'array e modificare quella copia invece dell'originale:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clona l'array
  // ✅ Bene: push in un nuovo array
  items.push({ id: 'create', label: 'Create Story' });
```

Questo [renderebbe la funzione `StoryTray` pura.](/learn/keeping-components-pure) Ogni volta che viene chiamata, modificherebbe solo una nuova copia dell'array e non influenzerebbe oggetti o variabili esterni. Questo risolve il bug, ma dovevi far renderizzare di nuovo il componente più spesso prima che diventasse evidente che c'era qualcosa di sbagliato nel suo comportamento.

**Nell'esempio originale, il bug non era evidente. Ora avvolgiamo il codice originale (buggato) in `<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode chiama *sempre* la tua funzione di renderizzazione due volte, così puoi vedere l'errore subito** ("Create Story" appare due volte). Questo ti permette di notare tali errori all'inizio del processo. Quando correggi il componente per renderizzare in Strict Mode, *correggi anche* molti possibili bug futuri in produzione come la funzionalità hover di prima:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clona l'array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Senza Strict Mode, era facile non accorgersi del bug finché non aggiungevi più ri-renderizzazioni. Strict Mode ha fatto apparire lo stesso bug subito. Strict Mode ti aiuta a trovare bug prima di pusharli al tuo team e ai tuoi utenti.

[Leggi di più su come mantenere i componenti puri.](/learn/keeping-components-pure)

<Note>

Se hai installato [React DevTools](/learn/react-developer-tools), le chiamate `console.log` durante la seconda renderizzazione appariranno leggermente attenuate. React DevTools offre anche un'impostazione (disattivata di default) per sopprimerle completamente.

</Note>

---

### Correggere bug trovati dalla riesecuzione degli Effetti in sviluppo {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode può anche aiutare a trovare bug negli [Effetti.](/learn/synchronizing-with-effects)

Ogni Effetto ha del codice di setup e può avere del codice di cleanup. Normalmente, React chiama il setup quando il componente viene *montato* (viene aggiunto allo schermo) e chiama il cleanup quando il componente viene *smontato* (viene rimosso dallo schermo). React chiama poi di nuovo cleanup e setup se le dipendenze sono cambiate dall'ultima renderizzazione.

Quando Strict Mode è attivo, React eseguirà anche **un ciclo setup+cleanup aggiuntivo in sviluppo per ogni Effetto.** Questo può sembrare sorprendente, ma aiuta a rivelare bug sottili difficili da individuare manualmente.

**Ecco un esempio per illustrare come la riesecuzione degli Effetti in Strict Mode ti aiuta a trovare bug in anticipo.**

Considera questo esempio che collega un componente a una chat:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Benvenuto nella stanza {roomId}!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

C'è un problema con questo codice, ma potrebbe non essere immediatamente evidente.

Per rendere il problema più ovvio, implementiamo una funzionalità. Nell'esempio sotto, `roomId` non è hardcoded. Invece, l'utente può selezionare il `roomId` a cui connettersi da un menu a tendina. Clicca "Apri chat" e poi seleziona diverse stanze di chat una alla volta. Tieni traccia del numero di connessioni attive nella console:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Benvenuto nella stanza {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Scegli la stanza di chat:{' '}
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
        {show ? 'Chiudi chat' : 'Apri chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Noterai che il numero di connessioni aperte continua a crescere. In un'app reale, questo causerebbe problemi di prestazioni e di rete. Il problema è che [al tuo Effetto manca una funzione di cleanup:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Ora che il tuo Effetto fa "cleanup" dopo sé stesso e distrugge le connessioni obsolete, la perdita è risolta. Tuttavia, nota che il problema non è diventato visibile finché non hai aggiunto altre funzionalità (il menu a tendina).

**Nell'esempio originale, il bug non era evidente. Ora avvolgiamo il codice originale (buggato) in `<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Benvenuto nella stanza {roomId}!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Con Strict Mode, vedi subito che c'è un problema** (il numero di connessioni attive salta a 2). Strict Mode esegue un ciclo setup+cleanup aggiuntivo per ogni Effetto. Questo Effetto non ha logica di cleanup, quindi crea una connessione aggiuntiva ma non la distrugge. Questo è un indizio che ti manca una funzione di cleanup.

Strict Mode ti permette di notare tali errori all'inizio del processo. Quando correggi il tuo Effetto aggiungendo una funzione di cleanup in Strict Mode, *correggi anche* molti possibili bug futuri in produzione come il menu a tendina di prima:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

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

  return <h1>Benvenuto nella stanza {roomId}!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Scegli la stanza di chat:{' '}
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
        {show ? 'Chiudi chat' : 'Apri chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Nota come il conteggio delle connessioni attive nella console non continua più a crescere.

Senza Strict Mode, era facile non accorgersi che il tuo Effetto necessitava di cleanup. Eseguendo *setup → cleanup → setup* invece di *setup* per il tuo Effetto in sviluppo, Strict Mode ha reso più evidente la logica di cleanup mancante.

[Leggi di più sull'implementazione del cleanup degli Effetti.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---
### Correggere bug trovati dalla riesecuzione dei callback ref in sviluppo {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

Strict Mode può anche aiutare a trovare bug nei [callback ref.](/learn/manipulating-the-dom-with-refs)

Ogni callback `ref` ha del codice di setup e può avere del codice di cleanup. Normalmente, React chiama il setup quando l'elemento viene *creato* (viene aggiunto al DOM) e chiama il cleanup quando l'elemento viene *rimosso* (viene rimosso dal DOM).

Quando Strict Mode è attivo, React eseguirà anche **un ciclo setup+cleanup aggiuntivo in sviluppo per ogni callback `ref`.** Questo può sembrare sorprendente, ma aiuta a rivelare bug sottili difficili da individuare manualmente.

Considera questo esempio, che ti permette di selezionare un gatto e poi scorrere fino a uno di essi. Nota che quando passi da Neo a Millie, i log della console mostrano che il numero di gatti nella lista continua a crescere e i pulsanti "Scorri a" smettono di funzionare:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ StrictMode non attivo.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scorri a:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 Nessun cleanup, questo è un bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
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


**Questo è un bug di produzione!** Poiché il callback ref non rimuove i gatti dalla lista nel cleanup, la lista di gatti continua a crescere. Questa è una perdita di memoria che può causare problemi di prestazioni in un'app reale e rompe il comportamento dell'app.

Il problema è che il callback ref non fa cleanup dopo sé stesso:

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 Nessun cleanup, questo è un bug!
    }
  }}
</li>
```

Ora avvolgiamo il codice originale (buggato) in `<StrictMode>`:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ StrictMode attivo.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scorri a:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 Nessun cleanup, questo è un bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
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

**Con Strict Mode, vedi subito che c'è un problema**. Strict Mode esegue un ciclo setup+cleanup aggiuntivo per ogni callback ref. Questo callback ref non ha logica di cleanup, quindi aggiunge ref ma non li rimuove. Questo è un indizio che ti manca una funzione di cleanup.

Strict Mode ti permette di trovare in anticipo errori nei callback ref. Quando correggi il callback aggiungendo una funzione di cleanup in Strict Mode, *correggi anche* molti possibili bug futuri in produzione come il bug "Scorri a" di prima:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ StrictMode attivo.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scorri a:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  list.splice(list.indexOf(item), 1);
                  console.log(`❌ Removing cat from the map. Total cats: ${itemsRef.current.length}`);
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
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

Al mount iniziale in StrictMode, i callback ref vengono tutti configurati, puliti e configurati di nuovo:

```
...
✅ Adding cat to the map. Total cats: 10
...
❌ Removing cat from the map. Total cats: 0
...
✅ Adding cat to the map. Total cats: 10
```

**Questo è previsto.** Strict Mode conferma che i callback ref vengono puliti correttamente, quindi la dimensione non cresce mai oltre l'importo previsto. Dopo la correzione, non ci sono perdite di memoria e tutte le funzionalità funzionano come previsto.

Senza Strict Mode, era facile non accorgersi del bug finché non cliccavi nell'app per notare funzionalità rotte. Strict Mode ha fatto apparire i bug subito, prima di pusharli in produzione.

---
### Correggere warning di deprecazione abilitati da Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React avvisa se qualche componente ovunque dentro un albero `<StrictMode>` usa una di queste API deprecate:

* Metodi del lifecycle di classe `UNSAFE_` come [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Vedi alternative.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)

Queste API sono usate principalmente nei [componenti classe](/reference/react/Component) più vecchi, quindi raramente compaiono nelle app moderne.
