---
title: Sincronizzare con gli Effetti
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e potrebbe beneficiare di una revisione umana. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/synchronizing-with-effects.md).

</Note>

<Intro>

Alcuni componenti devono sincronizzarsi con sistemi esterni. Per esempio, potresti voler controllare un componente non-React in base allo state di React, impostare una connessione al server o inviare un log di analytics quando un componente appare sullo schermo. Gli *Effetti* ti permettono di eseguire del codice dopo la renderizzazione, così da sincronizzare il tuo componente con un sistema esterno a React.

</Intro>

<YouWillLearn>

- Cosa sono gli Effetti
- In che modo gli Effetti sono diversi dagli eventi
- Come dichiarare un Effetto nel tuo componente
- Come evitare di rieseguire un Effetto inutilmente
- Perché gli Effetti girano due volte in modalità di sviluppo e come risolvere il problema

</YouWillLearn>

## Cosa sono gli Effetti e in che modo sono diversi dagli eventi? {/*what-are-effects-and-how-are-they-different-from-events*/}

Prima di arrivare agli Effetti, devi conoscere due tipi di logica all'interno dei componenti React:

- **Il codice di renderizzazione** (introdotto in [Descrivere l'UI](/learn/describing-the-ui)) vive al top level del tuo componente. Qui prendi le props e lo state, li trasformi e restituisci il JSX che vuoi vedere sullo schermo. [Il codice di renderizzazione deve essere puro.](/learn/keeping-components-pure) Come una formula matematica, dovrebbe solo _calcolare_ il risultato, senza fare altro.

- I **gestori di eventi** (introdotti in [Aggiungere interattività](/learn/adding-interactivity)) sono funzioni annidate all'interno dei tuoi componenti che _fanno_ cose invece di limitarsi a calcolarle. Un gestore di eventi potrebbe aggiornare un campo di input, inviare una richiesta HTTP POST per acquistare un prodotto o navigare l'utente verso un'altra schermata. I gestori di eventi contengono ["effetti collaterali"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (cambiano lo state del programma) causati da un'azione specifica dell'utente (per esempio, un click su un pulsante o la digitazione).

A volte questo non basta. Considera un componente `ChatRoom` che deve connettersi al server di chat ogni volta che è visibile sullo schermo. Connettersi a un server non è un calcolo puro (è un effetto collaterale), quindi non può avvenire durante la renderizzazione. Tuttavia, non c'è un singolo evento particolare come un click che fa apparire `ChatRoom`.

**Gli *Effetti* ti permettono di specificare effetti collaterali causati dalla renderizzazione stessa, piuttosto che da un evento particolare.** Inviare un messaggio in chat è un _evento_ perché è causato direttamente dall'utente che clicca un pulsante specifico. Tuttavia, impostare una connessione al server è un _Effetto_ perché dovrebbe avvenire indipendentemente da quale interazione ha fatto apparire il componente. Gli Effetti girano alla fine della [fase di commit](/learn/render-and-commit) dopo l'aggiornamento dello schermo. È un buon momento per sincronizzare i componenti React con un sistema esterno (come la rete o una libreria di terze parti).

<Note>

Qui e più avanti in questo testo, "Effetto" con la maiuscola si riferisce alla definizione specifica di React sopra, cioè un effetto collaterale causato dalla renderizzazione. Per riferirci al concetto più ampio della programmazione, diremo "effetto collaterale".

</Note>


## Potresti non avere bisogno di un Effetto {/*you-might-not-need-an-effect*/}

**Non affrettarti ad aggiungere Effetti ai tuoi componenti.** Tieni presente che gli Effetti vengono tipicamente usati per "uscire" dal tuo codice React e sincronizzarsi con un sistema _esterno_. Questo include le API del browser, widget di terze parti, la rete e così via. Se il tuo Effetto regola solo dello state in base ad altro state, [potresti non avere bisogno di un Effetto.](/learn/you-might-not-need-an-effect)

## Come scrivere un Effetto {/*how-to-write-an-effect*/}

Per scrivere un Effetto, segui questi tre passaggi:

1. **Dichiarare un Effetto.** Per impostazione predefinita, il tuo Effetto girerà dopo ogni [fase di commit](/learn/render-and-commit).
2. **Specificare le dipendenze dell'Effetto.** La maggior parte degli Effetti dovrebbe rieseguirsi solo _quando necessario_ invece che dopo ogni renderizzazione. Per esempio, un'animazione fade-in dovrebbe attivarsi solo quando un componente appare. Connettersi e disconnettersi da una chat room dovrebbe avvenire solo quando il componente appare e scompare, o quando cambia la chat room. Imparerai a controllare questo specificando le _dipendenze._
3. **Aggiungere la cleanup se necessario.** Alcuni Effetti devono specificare come fermare, annullare o ripulire ciò che stavano facendo. Per esempio, "connect" ha bisogno di "disconnect", "subscribe" ha bisogno di "unsubscribe" e "fetch" ha bisogno di "cancel" o "ignore". Imparerai a farlo restituendo una _funzione di cleanup_.

Vediamo ciascuno di questi passaggi in dettaglio.

### Passo 1: Dichiarare un Effetto {/*step-1-declare-an-effect*/}

Per dichiarare un Effetto nel tuo componente, importa l'Hook [`useEffect`](/reference/react/useEffect) da React:

```js
import { useEffect } from 'react';
```

Poi, chiamalo al top level del tuo componente e inserisci del codice all'interno del tuo Effetto:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

Ogni volta che il tuo componente viene renderizzato, React aggiornerà lo schermo _e poi_ eseguirà il codice all'interno di `useEffect`. In altre parole, **`useEffect` "ritarda" l'esecuzione di un pezzo di codice finché quella renderizzazione non si riflette sullo schermo.**

Vediamo come puoi usare un Effetto per sincronizzarti con un sistema esterno. Considera un componente React `<VideoPlayer>`. Sarebbe bello controllare se è in riproduzione o in pausa passandogli una prop `isPlaying`:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Il tuo componente personalizzato `VideoPlayer` renderizza il tag [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) integrato del browser:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

Tuttavia, il tag `<video>` del browser non ha una prop `isPlaying`. L'unico modo per controllarlo è chiamare manualmente i metodi [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) sul nodo DOM. **Devi sincronizzare il valore della prop `isPlaying`, che indica se il video _dovrebbe_ essere attualmente in riproduzione, con chiamate come `play()` e `pause()`.**

Prima avremo bisogno di [ottenere un ref](/learn/manipulating-the-dom-with-refs) al nodo DOM `<video>`.

Potresti essere tentato di chiamare `play()` o `pause()` durante la renderizzazione, ma non è corretto:

<Sandpack>

```js {expectedErrors: {'react-compiler': [7, 9]}}
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Calling these while rendering isn't allowed.
  } else {
    ref.current.pause(); // Also, this crashes.
  }

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

Il motivo per cui questo codice non è corretto è che cerca di fare qualcosa con il nodo DOM durante la renderizzazione. In React, [la renderizzazione dovrebbe essere un calcolo puro](/learn/keeping-components-pure) del JSX e non dovrebbe contenere effetti collaterali come la modifica del DOM.

Inoltre, quando `VideoPlayer` viene chiamato per la prima volta, il suo DOM non esiste ancora! Non c'è ancora un nodo DOM su cui chiamare `play()` o `pause()`, perché React non sa quale DOM creare finché non restituisci il JSX.

La soluzione qui è **avvolgere l'effetto collaterale con `useEffect` per spostarlo fuori dal calcolo di renderizzazione:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

Avvolgendo l'aggiornamento del DOM in un Effetto, lasci che React aggiorni prima lo schermo. Poi il tuo Effetto viene eseguito.

Quando il tuo componente `VideoPlayer` viene renderizzato (la prima volta o se viene ri-renderizzato), accadono alcune cose. Per prima cosa, React aggiornerà lo schermo, assicurandosi che il tag `<video>` sia nel DOM con le props corrette. Poi React eseguirà il tuo Effetto. Infine, il tuo Effetto chiamerà `play()` o `pause()` a seconda del valore di `isPlaying`.

Premi Play/Pause più volte e osserva come il video player resta sincronizzato con il valore di `isPlaying`:

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
  });

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

In questo esempio, il "sistema esterno" con cui ti sei sincronizzato allo state di React era l'API media del browser. Puoi usare un approccio simile per avvolgere codice legacy non-React (come plugin jQuery) in componenti React dichiarativi.

Nota che controllare un video player è molto più complesso in pratica. Chiamare `play()` può fallire, l'utente potrebbe riprodurre o mettere in pausa usando i controlli integrati del browser e così via. Questo esempio è molto semplificato e incompleto.

<Pitfall>

Per impostazione predefinita, gli Effetti girano dopo _ogni_ renderizzazione. Ecco perché codice come questo **produce un loop infinito:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Gli Effetti girano _come risultato_ della renderizzazione. Impostare lo state _avvia_ la renderizzazione. Impostare lo state immediatamente in un Effetto è come collegare una presa elettrica a se stessa. L'Effetto gira, imposta lo state, il che causa una ri-renderizzazione, il che fa girare l'Effetto, imposta di nuovo lo state, il che causa un'altra ri-renderizzazione, e così via.

Gli Effetti di solito dovrebbero sincronizzare i tuoi componenti con un sistema _esterno_. Se non c'è un sistema esterno e vuoi solo regolare dello state in base ad altro state, [potresti non avere bisogno di un Effetto.](/learn/you-might-not-need-an-effect)

</Pitfall>

### Passo 2: Specificare le dipendenze dell'Effetto {/*step-2-specify-the-effect-dependencies*/}

Per impostazione predefinita, gli Effetti girano dopo _ogni_ renderizzazione. Spesso, questo **non è quello che vuoi:**

- A volte è lento. Sincronizzarsi con un sistema esterno non è sempre istantaneo, quindi potresti voler saltare l'operazione a meno che non sia necessaria. Per esempio, non vuoi riconnetterti al server di chat a ogni tasto premuto.
- A volte è sbagliato. Per esempio, non vuoi attivare un'animazione fade-in del componente a ogni tasto premuto. L'animazione dovrebbe riprodursi solo una volta quando il componente appare per la prima volta.

Per dimostrare il problema, ecco l'esempio precedente con alcune chiamate `console.log` e un input di testo che aggiorna lo state del componente padre. Nota come digitare fa rieseguire l'Effetto:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Puoi dire a React di **saltare la riesecuzione non necessaria dell'Effetto** specificando un array di _dipendenze_ come secondo argomento della chiamata a `useEffect`. Inizia aggiungendo un array vuoto `[]` all'esempio sopra alla riga 14:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

Vedrai un errore che dice `React Hook useEffect has a missing dependency: 'isPlaying'`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Il problema è che il codice all'interno del tuo Effetto _dipende_ dalla prop `isPlaying` per decidere cosa fare, ma questa dipendenza non era stata dichiarata esplicitamente. Per risolvere il problema, aggiungi `isPlaying` all'array di dipendenze:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

Ora tutte le dipendenze sono dichiarate, quindi non c'è errore. Specificare `[isPlaying]` come array di dipendenze dice a React di saltare la riesecuzione del tuo Effetto se `isPlaying` è lo stesso della renderizzazione precedente. Con questa modifica, digitare nell'input non fa rieseguire l'Effetto, ma premere Play/Pause sì:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

L'array di dipendenze può contenere più dipendenze. React salterà la riesecuzione dell'Effetto solo se _tutte_ le dipendenze che specifichi hanno esattamente gli stessi valori della renderizzazione precedente. React confronta i valori delle dipendenze usando il confronto [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Vedi la [reference di `useEffect`](/reference/react/useEffect#reference) per i dettagli.

**Nota che non puoi "scegliere" le tue dipendenze.** Otterrai un errore del linter se le dipendenze che hai specificato non corrispondono a quelle che React si aspetta in base al codice all'interno del tuo Effetto. Questo aiuta a individuare molti bug nel tuo codice. Se non vuoi che del codice venga rieseguito, [*modifica il codice dell'Effetto stesso* per non "aver bisogno" di quella dipendenza.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

I comportamenti senza array di dipendenze e con un array di dipendenze _vuoto_ `[]` sono diversi:

```js {3,7,11}
useEffect(() => {
  // This runs after every render
});

useEffect(() => {
  // This runs only on mount (when the component appears)
}, []);

useEffect(() => {
  // This runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);
```

Esamineremo da vicino cosa significa "montare" nel passo successivo.

</Pitfall>

<DeepDive>

#### Perché il ref è stato omesso dall'array di dipendenze? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Questo Effetto usa _sia_ `ref` che `isPlaying`, ma solo `isPlaying` è dichiarato come dipendenza:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

Questo perché l'oggetto `ref` ha un' *identità stabile:* React garantisce [che otterrai sempre lo stesso oggetto](/reference/react/useRef#returns) dalla stessa chiamata a `useRef` a ogni renderizzazione. Non cambia mai, quindi da solo non farà mai rieseguire l'Effetto. Pertanto, non importa se lo includi o meno. Includerlo va bene lo stesso:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

Anche le [funzioni `set`](/reference/react/useState#setstate) restituite da `useState` hanno identità stabile, quindi spesso le vedrai omesse dalle dipendenze. Se il linter ti permette di omettere una dipendenza senza errori, è sicuro farlo.

Omettere dipendenze sempre stabili funziona solo quando il linter può "vedere" che l'oggetto è stabile. Per esempio, se `ref` fosse passato da un componente padre, dovresti specificarlo nell'array di dipendenze. Tuttavia, questo è positivo perché non puoi sapere se il componente padre passa sempre lo stesso ref o ne passa uno di più condizionalmente. Quindi il tuo Effetto _dipenderebbe_ da quale ref viene passato.

</DeepDive>

### Passo 3: Aggiungere la cleanup se necessario {/*step-3-add-cleanup-if-needed*/}

Considera un esempio diverso. Stai scrivendo un componente `ChatRoom` che deve connettersi al server di chat quando appare. Ti viene fornita un'API `createConnection()` che restituisce un oggetto con i metodi `connect()` e `disconnect()`. Come mantieni il componente connesso mentre è visualizzato all'utente?

Inizia scrivendo la logica dell'Effetto:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Sarebbe lento connettersi alla chat dopo ogni ri-renderizzazione, quindi aggiungi l'array di dipendenze:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Il codice all'interno dell'Effetto non usa props o state, quindi il tuo array di dipendenze è `[]` (vuoto). Questo dice a React di eseguire questo codice solo quando il componente "monta", cioè appare sullo schermo per la prima volta.**

Proviamo a eseguire questo codice:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
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

Questo Effetto gira solo al mount, quindi potresti aspettarti che `"✅ Connecting..."` venga stampato una volta nella console. **Tuttavia, se controlli la console, `"✅ Connecting..."` viene stampato due volte. Perché succede?**

Immagina che il componente `ChatRoom` faccia parte di un'app più grande con molte schermate diverse. L'utente inizia il suo percorso sulla pagina `ChatRoom`. Il componente monta e chiama `connection.connect()`. Poi immagina che l'utente navighi verso un'altra schermata — per esempio, la pagina Impostazioni. Il componente `ChatRoom` smonta. Infine, l'utente clicca Indietro e `ChatRoom` monta di nuovo. Questo imposterebbe una seconda connessione — ma la prima connessione non è mai stata distrutta! Mentre l'utente naviga nell'app, le connessioni continuerebbero ad accumularsi.

Bug come questo sono facili da perdere senza test manuali estensivi. Per aiutarti a individuarli rapidamente, in modalità di sviluppo React rimonta ogni componente una volta subito dopo il mount iniziale.

Vedere il log `"✅ Connecting..."` due volte ti aiuta a notare il vero problema: il tuo codice non chiude la connessione quando il componente smonta.

Per risolvere il problema, restituisci una _funzione di cleanup_ dal tuo Effetto:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React chiamerà la tua funzione di cleanup ogni volta prima che l'Effetto venga rieseguito, e una volta finale quando il componente smonta (viene rimosso). Vediamo cosa succede quando la funzione di cleanup è implementata:

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

Ora ottieni tre log in console in modalità di sviluppo:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**Questo è il comportamento corretto in modalità di sviluppo.** Rimontando il tuo componente, React verifica che navigare via e tornare non rompa il tuo codice. Disconnettersi e poi riconnettersi è esattamente ciò che dovrebbe accadere! Quando implementi bene la cleanup, non dovrebbe esserci alcuna differenza visibile per l'utente tra eseguire l'Effetto una volta rispetto a eseguirlo, ripulirlo ed eseguirlo di nuovo. C'è una coppia extra di connect/disconnect perché React sta testando il tuo codice alla ricerca di bug in modalità di sviluppo. È normale — non cercare di farlo sparire!

**In produzione, vedresti `"✅ Connecting..."` stampato solo una volta.** Rimontare i componenti avviene solo in modalità di sviluppo per aiutarti a trovare Effetti che necessitano di cleanup. Puoi disattivare [Strict Mode](/reference/react/StrictMode) per uscire dal comportamento di sviluppo, ma ti consigliamo di tenerlo attivo. Ti permette di trovare molti bug come quello sopra.

## Come gestire l'esecuzione doppia dell'Effetto in modalità di sviluppo? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React rimonta intenzionalmente i tuoi componenti in modalità di sviluppo per trovare bug come nell'ultimo esempio. **La domanda giusta non è "come eseguire un Effetto una volta sola", ma "come correggere il mio Effetto affinché funzioni dopo il rimontaggio".**

Di solito, la risposta è implementare la funzione di cleanup. La funzione di cleanup dovrebbe fermare o annullare ciò che l'Effetto stava facendo. La regola generale è che l'utente non dovrebbe essere in grado di distinguere tra l'Effetto che gira una volta (come in produzione) e una sequenza _setup → cleanup → setup_ (come vedresti in modalità di sviluppo).

La maggior parte degli Effetti che scriverai rientrerà in uno dei pattern comuni sotto.

<Pitfall>

#### Non usare i ref per impedire l'esecuzione degli Effetti {/*dont-use-refs-to-prevent-effects-from-firing*/}

Un errore comune per impedire agli Effetti di girare due volte in modalità di sviluppo è usare un `ref` per evitare che l'Effetto giri più di una volta. Per esempio, potresti "correggere" il bug sopra con un `useRef`:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 This wont fix the bug!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

Questo fa sì che vedi `"✅ Connecting..."` una sola volta in modalità di sviluppo, ma non corregge il bug.

Quando l'utente naviga via, la connessione non viene ancora chiusa e quando torna indietro, viene creata una nuova connessione. Mentre l'utente naviga nell'app, le connessioni continuerebbero ad accumularsi, come accadeva prima della "correzione".

Per correggere il bug, non basta far girare l'Effetto una sola volta. L'Effetto deve funzionare dopo il rimontaggio, il che significa che la connessione deve essere ripulita come nella soluzione sopra.

Vedi gli esempi sotto per come gestire i pattern comuni.

</Pitfall>

### Controllare widget non-React {/*controlling-non-react-widgets*/}

A volte devi aggiungere widget UI non scritti in React. Per esempio, supponiamo che tu stia aggiungendo un componente mappa alla tua pagina. Ha un metodo `setZoomLevel()` e vorresti mantenere il livello di zoom sincronizzato con una variabile di state `zoomLevel` nel tuo codice React. Il tuo Effetto assomiglierebbe a questo:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Nota che in questo caso non serve cleanup. In modalità di sviluppo, React chiamerà l'Effetto due volte, ma non è un problema perché chiamare `setZoomLevel` due volte con lo stesso valore non fa nulla. Potrebbe essere leggermente più lento, ma non importa perché in produzione non rimonterà inutilmente.

Alcune API potrebbero non permetterti di chiamarle due volte di seguito. Per esempio, il metodo [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) dell'elemento [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) integrato lancia un'eccezione se lo chiami due volte. Implementa la funzione di cleanup e falla chiudere il dialog:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

In modalità di sviluppo, il tuo Effetto chiamerà `showModal()`, poi immediatamente `close()`, e poi di nuovo `showModal()`. Questo ha lo stesso comportamento visibile per l'utente di chiamare `showModal()` una volta, come vedresti in produzione.

### Sottoscriversi a eventi {/*subscribing-to-events*/}

Se il tuo Effetto si sottoscrive a qualcosa, la funzione di cleanup dovrebbe annullare la sottoscrizione:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

In modalità di sviluppo, il tuo Effetto chiamerà `addEventListener()`, poi immediatamente `removeEventListener()`, e poi di nuovo `addEventListener()` con lo stesso handler. Quindi ci sarebbe solo una sottoscrizione attiva alla volta. Questo ha lo stesso comportamento visibile per l'utente di chiamare `addEventListener()` una volta, come in produzione.

### Attivare animazioni {/*triggering-animations*/}

Se il tuo Effetto anima qualcosa in entrata, la funzione di cleanup dovrebbe reimpostare l'animazione ai valori iniziali:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

In modalità di sviluppo, l'opacità sarà impostata a `1`, poi a `0`, e poi di nuovo a `1`. Questo dovrebbe avere lo stesso comportamento visibile per l'utente di impostarla direttamente a `1`, che è ciò che accadrebbe in produzione. Se usi una libreria di animazione di terze parti con supporto per il tweening, la tua funzione di cleanup dovrebbe reimpostare la timeline al suo state iniziale.

### Recuperare dati {/*fetching-data*/}

Se il tuo Effetto recupera qualcosa, la funzione di cleanup dovrebbe [abortire il fetch](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) o ignorarne il risultato:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

Non puoi "annullare" una richiesta di rete già avvenuta, ma la tua funzione di cleanup dovrebbe assicurarsi che il fetch che _non è più rilevante_ non continui ad influenzare la tua applicazione. Se `userId` cambia da `'Alice'` a `'Bob'`, la cleanup assicura che la risposta di `'Alice'` venga ignorata anche se arriva dopo `'Bob'`.

**In modalità di sviluppo, vedrai due fetch nella scheda Network.** Non c'è nulla di sbagliato. Con l'approccio sopra, il primo Effetto viene immediatamente ripulito quindi la sua copia della variabile `ignore` viene impostata a `true`. Quindi, anche se c'è una richiesta extra, non influenzerà lo state grazie al controllo `if (!ignore)`.

**In produzione, ci sarà solo una richiesta.** Se la seconda richiesta in modalità di sviluppo ti dà fastidio, l'approccio migliore è usare una soluzione che deduplica le richieste e mette in cache le risposte tra i componenti:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

Questo non solo migliorerà l'esperienza di sviluppo, ma renderà anche la tua applicazione più veloce. Per esempio, l'utente che preme il pulsante Indietro non dovrà aspettare che i dati vengano caricati di nuovo perché saranno in cache. Puoi costruire tu stesso una cache del genere o usare una delle molte alternative al fetch manuale negli Effetti.

<DeepDive>

#### Quali sono buone alternative al recupero dati negli Effetti? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Scrivere chiamate `fetch` all'interno degli Effetti è un [modo popolare per recuperare dati](https://www.robinwieruch.de/react-hooks-fetch-data/), specialmente nelle app completamente client-side. Tuttavia, è un approccio molto manuale e ha svantaggi significativi:

- **Gli Effetti non girano sul server.** Questo significa che l'HTML renderizzato inizialmente dal server conterrà solo uno state di caricamento senza dati. Il computer client dovrà scaricare tutto il JavaScript e renderizzare la tua app solo per scoprire che ora deve caricare i dati. Non è molto efficiente.
- **Recuperare direttamente negli Effetti rende facile creare "network waterfall".** Renderizzi il componente padre, recupera dei dati, renderizza i componenti figli, e poi iniziano a recuperare i loro dati. Se la rete non è molto veloce, questo è significativamente più lento rispetto a recuperare tutti i dati in parallelo.
- **Recuperare direttamente negli Effetti di solito significa che non precarichi o metti in cache i dati.** Per esempio, se il componente smonta e poi monta di nuovo, dovrebbe recuperare i dati di nuovo.
- **Non è molto ergonomico.** C'è parecchio codice boilerplate quando scrivi chiamate `fetch` in modo che non soffra di bug come le [race condition.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Questo elenco di svantaggi non è specifico di React. Si applica al recupero dati al mount con qualsiasi libreria. Come per il routing, il recupero dati non è banale da fare bene, quindi consigliamo i seguenti approcci:

- **Se usi un [framework](/learn/creating-a-react-app#full-stack-frameworks), usa il suo meccanismo di recupero dati integrato.** I framework React moderni hanno meccanismi di recupero dati integrati che sono efficienti e non soffrono dei problemi sopra.
- **Altrimenti, considera di usare o costruire una cache client-side.** Soluzioni open source popolari includono [TanStack Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/) e [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Puoi costruire anche la tua soluzione, nel qual caso useresti gli Effetti sotto il cofano, ma aggiungeresti logica per deduplicare le richieste, mettere in cache le risposte ed evitare network waterfall (precaricando i dati o spostando i requisiti di dati alle route).

Puoi continuare a recuperare dati direttamente negli Effetti se nessuno di questi approcci ti soddisfa.

</DeepDive>

### Inviare analytics {/*sending-analytics*/}

Considera questo codice che invia un evento analytics alla visita della pagina:

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

In modalità di sviluppo, `logVisit` verrà chiamato due volte per ogni URL, quindi potresti essere tentato di provare a correggerlo. **Ti consigliamo di lasciare questo codice com'è.** Come negli esempi precedenti, non c'è alcuna differenza di comportamento _visibile per l'utente_ tra eseguirlo una volta ed eseguirlo due volte. Da un punto di vista pratico, `logVisit` non dovrebbe fare nulla in modalità di sviluppo perché non vuoi che i log dalle macchine di sviluppo alterino le metriche di produzione. Il tuo componente rimonta ogni volta che salvi il suo file, quindi registra comunque visite extra in modalità di sviluppo.

**In produzione, non ci saranno log di visita duplicati.**

Per fare debug degli eventi analytics che invii, puoi distribuire la tua app in un ambiente di staging (che gira in modalità produzione) o disattivare temporaneamente [Strict Mode](/reference/react/StrictMode) e i suoi controlli di rimontaggio solo per lo sviluppo. Puoi anche inviare analytics dai gestori di eventi di cambio route invece che dagli Effetti. Per analytics più precise, gli [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) possono aiutare a tracciare quali componenti sono nel viewport e per quanto tempo restano visibili.

### Non è un Effetto: Inizializzare l'applicazione {/*not-an-effect-initializing-the-application*/}

Alcune logiche dovrebbero girare solo una volta all'avvio dell'applicazione. Puoi metterle fuori dai tuoi componenti:

```js {2-3}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Questo garantisce che tali logiche girino solo una volta dopo che il browser carica la pagina.

### Non è un Effetto: Acquistare un prodotto {/*not-an-effect-buying-a-product*/}

A volte, anche se scrivi una funzione di cleanup, non c'è modo di prevenire le conseguenze visibili per l'utente dell'esecuzione dell'Effetto due volte. Per esempio, forse il tuo Effetto invia una richiesta POST come l'acquisto di un prodotto:

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Non vorresti acquistare il prodotto due volte. Tuttavia, è anche il motivo per cui non dovresti mettere questa logica in un Effetto. Cosa succede se l'utente va su un'altra pagina e poi preme Indietro? Il tuo Effetto girerebbe di nuovo. Non vuoi acquistare il prodotto quando l'utente _visita_ una pagina; vuoi acquistarlo quando l'utente _clicca_ il pulsante Acquista.

L'acquisto non è causato dalla renderizzazione; è causato da un'interazione specifica. Dovrebbe girare solo quando l'utente preme il pulsante. **Elimina l'Effetto e sposta la tua richiesta `/api/buy` nel gestore di eventi del pulsante Acquista:**

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Questo illustra che se il rimontaggio rompe la logica della tua applicazione, di solito mette in luce bug esistenti.** Dal punto di vista dell'utente, visitare una pagina non dovrebbe essere diverso dal visitarla, cliccare un link e poi premere Indietro per visualizzarla di nuovo. React verifica che i tuoi componenti rispettino questo principio rimontandoli una volta in modalità di sviluppo.

## Mettere tutto insieme {/*putting-it-all-together*/}

Questo playground può aiutarti a "farti un'idea" di come funzionano gli Effetti in pratica.

Questo esempio usa [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) per pianificare un log in console con il testo dell'input che appare tre secondi dopo l'esecuzione dell'Effetto. La funzione di cleanup annulla il timeout in sospeso. Inizia premendo "Mount the component":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

Vedrai tre log all'inizio: `Schedule "a" log`, `Cancel "a" log` e di nuovo `Schedule "a" log`. Tre secondi dopo ci sarà anche un log che dice `a`. Come hai imparato prima, la coppia extra di schedule/cancel è perché React rimonta il componente una volta in modalità di sviluppo per verificare che tu abbia implementato bene la cleanup.

Ora modifica l'input per dire `abc`. Se lo fai abbastanza velocemente, vedrai `Schedule "ab" log` seguito immediatamente da `Cancel "ab" log` e `Schedule "abc" log`. **React ripulisce sempre l'Effetto della renderizzazione precedente prima dell'Effetto della renderizzazione successiva.** Ecco perché, anche se digiti velocemente nell'input, c'è al massimo un timeout pianificato alla volta. Modifica l'input più volte e osserva la console per farti un'idea di come vengono ripuliti gli Effetti.

Digita qualcosa nell'input e poi premi immediatamente "Unmount the component". Nota come lo smontaggio ripulisce l'Effetto dell'ultima renderizzazione. Qui, cancella l'ultimo timeout prima che abbia la possibilità di scattare.

Infine, modifica il componente sopra e commenta la funzione di cleanup così che i timeout non vengano cancellati. Prova a digitare `abcde` velocemente. Cosa ti aspetti che succeda tra tre secondi? `console.log(text)` all'interno del timeout stamperà l'ultimo `text` e produrrà cinque log `abcde`? Provalo per verificare la tua intuizione!

Tre secondi dopo, dovresti vedere una sequenza di log (`a`, `ab`, `abc`, `abcd` e `abcde`) invece di cinque log `abcde`. **Ogni Effetto "cattura" il valore di `text` dalla sua renderizzazione corrispondente.** Non importa che lo state `text` sia cambiato: un Effetto dalla renderizzazione con `text = 'ab'` vedrà sempre `'ab'`. In altre parole, gli Effetti di ogni renderizzazione sono isolati l'uno dall'altro. Se ti chiedi come funziona, puoi leggere delle [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

<DeepDive>

#### Ogni renderizzazione ha i suoi Effetti {/*each-render-has-its-own-effects*/}

Puoi pensare a `useEffect` come "attaccare" un pezzo di comportamento all'output della renderizzazione. Considera questo Effetto:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

Vediamo cosa succede esattamente mentre l'utente naviga nell'app.

#### Renderizzazione iniziale {/*initial-render*/}

L'utente visita `<ChatRoom roomId="general" />`. [Sostituiamo mentalmente](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` con `'general'`:

```js
  // JSX for the first render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**L'Effetto è _anche_ parte dell'output della renderizzazione.** L'Effetto della prima renderizzazione diventa:

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React esegue questo Effetto, che si connette alla chat room `'general'`.

#### Ri-renderizzazione con le stesse dipendenze {/*re-render-with-same-dependencies*/}

Supponiamo che `<ChatRoom roomId="general" />` venga ri-renderizzato. L'output JSX è lo stesso:

```js
  // JSX for the second render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React vede che l'output della renderizzazione non è cambiato, quindi non aggiorna il DOM.

L'Effetto della seconda renderizzazione assomiglia a questo:

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React confronta `['general']` della seconda renderizzazione con `['general']` della prima renderizzazione. **Poiché tutte le dipendenze sono le stesse, React _ignora_ l'Effetto della seconda renderizzazione.** Non viene mai chiamato.

#### Ri-renderizzazione con dipendenze diverse {/*re-render-with-different-dependencies*/}

Poi, l'utente visita `<ChatRoom roomId="travel" />`. Questa volta, il componente restituisce JSX diverso:

```js
  // JSX for the third render (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React aggiorna il DOM cambiando `"Welcome to general"` in `"Welcome to travel"`.

L'Effetto della terza renderizzazione assomiglia a questo:

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React confronta `['travel']` della terza renderizzazione con `['general']` della seconda renderizzazione. Una dipendenza è diversa: `Object.is('travel', 'general')` è `false`. L'Effetto non può essere saltato.

**Prima che React possa applicare l'Effetto della terza renderizzazione, deve ripulire l'ultimo Effetto che _è_ stato eseguito.** L'Effetto della seconda renderizzazione è stato saltato, quindi React deve ripulire l'Effetto della prima renderizzazione. Se scorri verso l'alto alla prima renderizzazione, vedrai che la sua cleanup chiama `disconnect()` sulla connessione creata con `createConnection('general')`. Questo disconnette l'app dalla chat room `'general'`.

Dopo di ciò, React esegue l'Effetto della terza renderizzazione. Si connette alla chat room `'travel'`.

#### Smontaggio {/*unmount*/}

Infine, supponiamo che l'utente navighi via e il componente `ChatRoom` smonti. React esegue la funzione di cleanup dell'ultimo Effetto. L'ultimo Effetto era della terza renderizzazione. La cleanup della terza renderizzazione distrugge la connessione `createConnection('travel')`. Quindi l'app si disconnette dalla room `'travel'`.

#### Comportamenti solo di sviluppo {/*development-only-behaviors*/}

Quando [Strict Mode](/reference/react/StrictMode) è attivo, React rimonta ogni componente una volta dopo il mount (state e DOM vengono preservati). Questo [ti aiuta a trovare Effetti che necessitano di cleanup](#step-3-add-cleanup-if-needed) ed espone precocemente bug come le race condition. Inoltre, React rimonterà gli Effetti ogni volta che salvi un file in modalità di sviluppo. Entrambi questi comportamenti sono solo di sviluppo.

</DeepDive>

<Recap>

- A differenza degli eventi, gli Effetti sono causati dalla renderizzazione stessa piuttosto che da un'interazione particolare.
- Gli Effetti ti permettono di sincronizzare un componente con un sistema esterno (API di terze parti, rete, ecc.).
- Per impostazione predefinita, gli Effetti girano dopo ogni renderizzazione (inclusa quella iniziale).
- React salterà l'Effetto se tutte le sue dipendenze hanno gli stessi valori della renderizzazione precedente.
- Non puoi "scegliere" le tue dipendenze. Sono determinate dal codice all'interno dell'Effetto.
- Un array di dipendenze vuoto (`[]`) corrisponde al "mount" del componente, cioè all'aggiunta sullo schermo.
- In Strict Mode, React monta i componenti due volte (solo in modalità di sviluppo!) per testare i tuoi Effetti.
- Se il tuo Effetto si rompe a causa del rimontaggio, devi implementare una funzione di cleanup.
- React chiamerà la tua funzione di cleanup prima che l'Effetto venga rieseguito la volta successiva, e durante lo smontaggio.

</Recap>

<Challenges>

#### Mettere a fuoco un campo al mount {/*focus-a-field-on-mount*/}

In questo esempio, il form renderizza un componente `<MyInput />`.

Usa il metodo [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) dell'input per far sì che `MyInput` metta automaticamente a fuoco il campo quando appare sullo schermo. C'è già un'implementazione commentata, ma non funziona del tutto. Scopri perché non funziona e correggila. (Se conosci l'attributo `autoFocus`, fingi che non esista: stiamo reimplementando la stessa funzionalità da zero.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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


Per verificare che la tua soluzione funzioni, premi "Show form" e verifica che l'input riceva il focus (viene evidenziato e il cursore viene posizionato all'interno). Premi "Hide form" e di nuovo "Show form". Verifica che l'input venga evidenziato di nuovo.

`MyInput` dovrebbe mettere a fuoco _solo al mount_ invece che dopo ogni renderizzazione. Per verificare che il comportamento sia corretto, premi "Show form" e poi premi ripetutamente la checkbox "Make it uppercase". Cliccare la checkbox _non_ dovrebbe mettere a fuoco l'input sopra.

<Solution>

Chiamare `ref.current.focus()` durante la renderizzazione è sbagliato perché è un _effetto collaterale_. Gli effetti collaterali dovrebbero essere inseriti in un gestore di eventi o dichiarati con `useEffect`. In questo caso, l'effetto collaterale è _causato_ dall'apparizione del componente piuttosto che da un'interazione specifica, quindi ha senso metterlo in un Effetto.

Per correggere l'errore, avvolgi la chiamata `ref.current.focus()` in una dichiarazione di Effetto. Poi, per assicurarti che questo Effetto giri solo al mount invece che dopo ogni renderizzazione, aggiungi le dipendenze vuote `[]`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Mettere a fuoco un campo condizionalmente {/*focus-a-field-conditionally*/}

Questo form renderizza due componenti `<MyInput />`.

Premi "Show form" e nota che il secondo campo viene automaticamente messo a fuoco. Questo perché entrambi i componenti `<MyInput />` cercano di mettere a fuoco il campo interno. Quando chiami `focus()` per due campi input di seguito, l'ultimo "vince" sempre.

Supponiamo che tu voglia mettere a fuoco il primo campo. Il primo componente `MyInput` ora riceve una prop booleana `shouldFocus` impostata a `true`. Cambia la logica in modo che `focus()` venga chiamato solo se la prop `shouldFocus` ricevuta da `MyInput` è `true`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

Per verificare la tua soluzione, premi "Show form" e "Hide form" ripetutamente. Quando il form appare, solo il _primo_ input dovrebbe ricevere il focus. Questo perché il componente padre renderizza il primo input con `shouldFocus={true}` e il secondo con `shouldFocus={false}`. Verifica anche che entrambi gli input funzionino ancora e che tu possa digitare in entrambi.

<Hint>

Non puoi dichiarare un Effetto condizionalmente, ma il tuo Effetto può includere logica condizionale.

</Hint>

<Solution>

Inserisci la logica condizionale all'interno dell'Effetto. Dovrai specificare `shouldFocus` come dipendenza perché lo usi all'interno dell'Effetto. (Questo significa che se `shouldFocus` di un input cambia da `false` a `true`, metterà a fuoco dopo il mount.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Correggere un intervallo che scatta due volte {/*fix-an-interval-that-fires-twice*/}

Questo componente `Counter` mostra un contatore che dovrebbe incrementarsi ogni secondo. Al mount, chiama [`setInterval`.](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) Questo fa girare `onTick` ogni secondo. La funzione `onTick` incrementa il contatore.

Tuttavia, invece di incrementarsi una volta al secondo, incrementa due volte. Perché? Trova la causa del bug e correggilo.

<Hint>

Tieni presente che `setInterval` restituisce un ID di intervallo, che puoi passare a [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) per fermare l'intervallo.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

<Solution>

Quando [Strict Mode](/reference/react/StrictMode) è attivo (come nelle sandbox di questo sito), React rimonta ogni componente una volta in modalità di sviluppo. Questo fa sì che l'intervallo venga impostato due volte, ed è per questo che ogni secondo il contatore incrementa due volte.

Tuttavia, il comportamento di React non è la _causa_ del bug: il bug esiste già nel codice. Il comportamento di React rende il bug più evidente. La vera causa è che questo Effetto avvia un processo ma non fornisce un modo per ripulirlo.

Per correggere questo codice, salva l'ID dell'intervallo restituito da `setInterval` e implementa una funzione di cleanup con [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

In modalità di sviluppo, React rimonterà comunque il tuo componente una volta per verificare che tu abbia implementato bene la cleanup. Quindi ci sarà una chiamata a `setInterval`, seguita immediatamente da `clearInterval`, e di nuovo `setInterval`. In produzione, ci sarà solo una chiamata a `setInterval`. Il comportamento visibile per l'utente in entrambi i casi è lo stesso: il contatore incrementa una volta al secondo.

</Solution>

#### Correggere il fetch all'interno di un Effetto {/*fix-fetching-inside-an-effect*/}

Questo componente mostra la biografia della persona selezionata. Carica la biografia chiamando una funzione asincrona `fetchBio(person)` al mount e ogni volta che `person` cambia. Quella funzione asincrona restituisce una [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) che alla fine si risolve in una stringa. Quando il fetch è completato, chiama `setBio` per mostrare quella stringa sotto la select box.

<Sandpack>

{/* not the most efficient, but this validation is enabled in the linter only, so it's fine to ignore it here since we know what we're doing */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
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


C'è un bug in questo codice. Inizia selezionando "Alice". Poi seleziona "Bob" e subito dopo seleziona "Taylor". Se lo fai abbastanza velocemente, noterai il bug: Taylor è selezionato, ma il paragrafo sotto dice "This is Bob's bio."

Perché succede? Correggi il bug all'interno di questo Effetto.

<Hint>

Se un Effetto recupera qualcosa in modo asincrono, di solito ha bisogno di cleanup.

</Hint>

<Solution>

Per attivare il bug, le cose devono accadere in questo ordine:

- Selezionare `'Bob'` attiva `fetchBio('Bob')`
- Selezionare `'Taylor'` attiva `fetchBio('Taylor')`
- **Il fetch di `'Taylor'` si completa _prima_ del fetch di `'Bob'`**
- L'Effetto della renderizzazione `'Taylor'` chiama `setBio('This is Taylor's bio')`
- Il fetch di `'Bob'` si completa
- L'Effetto della renderizzazione `'Bob'` chiama `setBio('This is Bob's bio')`

Ecco perché vedi la bio di Bob anche se Taylor è selezionato. Bug come questo si chiamano [race condition](https://en.wikipedia.org/wiki/Race_condition) perché due operazioni asincrone "gareggiano" tra loro e potrebbero arrivare in un ordine inaspettato.

Per correggere questa race condition, aggiungi una funzione di cleanup:

<Sandpack>

{/* not the most efficient, but this validation is enabled in the linter only, so it's fine to ignore it here since we know what we're doing */}
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

Ogni Effetto di renderizzazione ha la sua variabile `ignore`. Inizialmente, la variabile `ignore` è impostata a `false`. Tuttavia, se un Effetto viene ripulito (come quando selezioni una persona diversa), la sua variabile `ignore` diventa `true`. Quindi non importa in quale ordine le richieste si completano. Solo l'Effetto dell'ultima persona avrà `ignore` impostato a `false`, quindi chiamerà `setBio(result)`. Gli Effetti passati sono stati ripuliti, quindi il controllo `if (!ignore)` impedirà loro di chiamare `setBio`:

- Selezionare `'Bob'` attiva `fetchBio('Bob')`
- Selezionare `'Taylor'` attiva `fetchBio('Taylor')` **e ripulisce l'Effetto precedente (di Bob)**
- Il fetch di `'Taylor'` si completa _prima_ del fetch di `'Bob'`
- L'Effetto della renderizzazione `'Taylor'` chiama `setBio('This is Taylor's bio')`
- Il fetch di `'Bob'` si completa
- L'Effetto della renderizzazione `'Bob'` **non fa nulla perché il suo flag `ignore` è stato impostato a `true`**

Oltre a ignorare il risultato di una chiamata API obsoleta, puoi anche usare [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) per cancellare le richieste che non servono più. Tuttavia, da solo non basta a proteggere dalle race condition. Altri passaggi asincroni potrebbero essere concatenati dopo il fetch, quindi usare un flag esplicito come `ignore` è il modo più affidabile per correggere questo tipo di problema.

</Solution>

</Challenges>
