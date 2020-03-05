---
id: hooks-overview
title: Panoramica sugli Hooks
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

Gli *Hooks* sono una novità introdotta in React 16.8. Permettono di utilizzare lo state ed altre funzionalità di React senza dover scrivere una classe.

Gli Hooks sono [retrocompatibili](/docs/hooks-intro.html#no-breaking-changes). Questa pagina offre una panoramica sugli Hooks per gli utilizzatori esperti di React. Si tratta di una panoramica abbastanza veloce. Se le cose diventano non chiare, cerca un rettangolo giallo come questo:

>Spiegazione Dettagliata
>
>Leggi la [Motivazione](/docs/hooks-intro.html#motivation) per capire perché abbiamo introdotto gli Hooks in React.

**↑↑↑ Ogni sezione termina con un rettangolo giallo come questo.** Essi forniscono collegamenti a spiegazioni dettagliate.

## 📌 State Hook {#state-hook}

Questo esempio renderizza un contatore. Quando clicchiamo il bottone, il valore aumenta:

```js{1,4,5}
import React, { useState } from 'react';

function Esempio() {
  // Dichiara una nuova variabile di stato, che chiameremo "contatore"
  const [contatore, setContatore] = useState(0);

  return (
    <div>
      <p>Hai cliccato {contatore} volte</p>
      <button onClick={() => setContatore(contatore + 1)}>
        Cliccami
      </button>
    </div>
  );
}
```

In questo caso, `useState` è un *Hook* (spiegheremo cosa significa fra poco). Lo richiamiamo all'interno di un componente funzione per aggiungervi uno stato interno. React preserverà questo stato tra le ri-renderizzazioni. `useState` ritorna una coppia: il valore dello stato *corrente* ed una funzione che ci permette di aggiornarlo. Puoi chiamare questa funzione da un event handler o altrove. È simile a `this.setState`in una classe, tranne per il fatto che non unisce il vecchio e nuovo stato. (Mostriamo un esempio nel quale confrontiamo `useState` e `this.state` in [Usare lo State Hook](/docs/hooks-state.html).)

L'unico parametro di `useState` è il suo stato iniziale. Nell'esempio di sopra, è appunto `0` perché il contatore comincia da zero. Nota come contrariamente a `this.state`, lo stato non deve essere un oggetto -- anche se può esserlo se lo vuoi. Il parametro che determina lo stato iniziale viene usato solo durante la prima renderizzazione.

#### Dichiarazione di variabili di stato multiple{#declaring-multiple-state-variables}

Puoi usare lo State Hook più di una volta in un singolo componente:

```js
function EsempioConMoltiState() {
  // Dichiara le variabili di stato!
  const [eta, setEta] = useState(42);
  const [frutto, setFrutto] = useState('banana');
  const [todos, setTodos] = useState([{ testo: 'Impara gli Hooks' }]);
  // ...
}
```

L'[assegnamento di destrutturazione](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) ci permette di dare nomi diversi alle variabili di stato che abbiamo dichiarato richiamando `useState`. Questi nomi non fanno parte della API di `useState`. Invece, React assume che se chiami `useState` più volte, lo farai nello stesso ordine durante ogni renderizzazione. Ritorneremo più tardi sul perché ciò funziona ed è utile.

#### Ma cosa è un Hook? {#but-what-is-a-hook}

Gli Hooks sono funzioni che ti permettono di "ancorarti” all'interno delle funzioni di React state e lifecycle da componenti funzione. Gli Hooks non funzionano all'interno delle classi -- ti permettono di usare React senza classi. ([Non raccomandiamo](/docs/hooks-intro.html#gradual-adoption-strategy) la riscrittura dei tuoi componenti già esistenti tutto d'un fiato, raccomandiamo invece di scrivere quelli nuovi usando gli Hooks se ti va.)

React offre Hooks predefiniti come `useState`. Puoi anche creare i tuoi Hooks per riutilizzare comportamenti stateful (facenti uso di stato) tra i vari componenti. Per cominciare, diamo uno sguardo agli Hooks predefiniti.

>Spiegazione Dettagliata
>
>Se vuoi puoi trovare maggiori dettagli riguardo lo State Hook nella pagina dedicata: [Usare lo State Hook](/docs/hooks-state.html).

## ⚡️ Effect Hook {#effect-hook}

È molto probabile che tu abbia dovuto richiedere dati esterni, gestire sottoscrizioni, o dovuto cambiare il DOM da componenti React prima d'ora. Chiamiamo queste operazioni "effetti collaterali" (o "effetti" in breve) dato che essi possono alterare altri componenti e non possono essere eseguiti durante la renderizzazione.

L'Effect Hook, `useEffect`, aggiunge la possibilità di eseguire effetti collaterali da componenti funzione. Svolge gli stessi compiti di `componentDidMount`, `componentDidUpdate`, e `componentWillUnmount` nelle classi React, unificate sotto una singola API. (Mostreremo degli esempi che mettono a confronto `useEffect` con questi metodi nella pagina [Usare l'Effect Hook](/docs/hooks-effect.html).)

Ad esempio, questo componente imposta il titolo del documento dopo che React ha aggiornato il DOM:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Esempio() {
  const [contatore, setContatore] = useState(0);

  // Simile a componentDidMount e componentDidUpdate:
  useEffect(() => {
    // Aggiorna il titolo del documento usando le API del browser
    document.title = `Hai cliccato ${contatore} volte`;
  });

  return (
    <div>
      <p>Hai cliccato {contatore} volte</p>
      <button onClick={() => setCount(contatore + 1)}>
        Cliccami
      </button>
    </div>
  );
}
```

Quando invochi `useEffect`, stai sostanzialmente dicendo a React di eseguire la tua funzione "effetto" dopo aver applicato i cambiamenti al DOM. Gli effetti vengono dichiarati all'interno dei componenti in modo che abbiano accesso alle sue props e state. Di default, React esegue gli effetti ad ogni renderizzazione -- *inclusa* la prima. (Discuteremo più in dettagli su come ciò si possa confrontare ai lifecycles delle classi nella pagina dedicata [Usare l'Effect Hook](/docs/hooks-effect.html).)

Gli effetti possono anche opzionalmente specificare come "fare pulizia" dopo la loro esecuzione. Ad esempio, questo componente utilizza un effetto per sottoscrivere lo stato online di un amico, per poi rimuovere la sottoscrizione nella fase di pulizia:

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Caricamento...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

In questo esempio, React rimuoverebbe la sottoscrizione alla nostra `ChatAPI` quando il componente viene smontato, ed anche prima che l'effetto venga eseguito nuovamente nel caso di una renderizzazione successiva. (Se vuoi, esiste un modo per [dire a React di evitare che avvengano sottoscrizioni multiple](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) nel caso in cui `props.friend.id` che viene passato a `ChatAPI` non sia cambiato.)

Come avviene con `useState`, puoi usare più di un singolo effetto in un componente:

```js{3,8}
function FriendStatusConContatore(props) {
  const [contatore, setContatore] = useState(0);
  useEffect(() => {
    document.title = `Hai cliccato ${contatore} volte`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

Gli Hooks ti permettono di organizzare gli effetti collaterali in un componente a seconda di come le parti sono collegate tra loro (come aggiungere o rimuovere una sottoscrizione), piuttosto che forzarti a doverle suddividere in base a metodi di lifecycle.

>Spiegazione Dettagliata
>
>Puoi saperne di più riguardo `useEffect` leggendo la pagina dedicata: [Usare l'Effect Hook](/docs/hooks-effect.html).

## ✌️ Regole degli Hooks {#rules-of-hooks}

Gli Hooks sono funzioni JavaScript, ma hanno due regole aggiuntive:

* Puoi richiamare gli Hooks solo **al livello più alto**. Non richiamare gli Hooks all'interno di cicli, condizioni o funzioni nidificate.
* Puoi richiamare gli Hooks solo **da componenti funzione di React**. Non richiamare gli Hooks da normali funzioni JavaScript. (Esiste solo un altro valido posto dal quale puoi richiamare gli Hooks -- i tuoi Hooks customizzati. Ne parleremo fra poco.)

Offriamo un [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) per imporre tali regole automaticamente. Siamo consapevoli del fatto che tali regole possano sembrare limitanti o complicate all'inizio, sono però essenziali nel far sì che gli Hooks funzionino bene.

>Spiegazione Dettagliata
>
>Puoi saperne di più riguardo queste regole nella pagina dedicata: [Regole degli Hooks](/docs/hooks-rules.html).

## 💡 Costruire i Tuoi Hooks Custom {#building-your-own-hooks}

A volte, ci ritroviamo a voler riutilizzare logica con stato tra vari componeti. Tradizionalmente, esistono due popolari soluzioni al problema: [componenti di ordine superiore](/docs/higher-order-components.html) e [render props](/docs/render-props.html). Gli Hooks Custom ti permettono di risolvere il problema, senza dover aggiungere altri componenti al tuo albero.

Precedentemente in questa pagina, abbiamo introdotto un componente `FriendStatus` che richiama gli Hooks `useState` e `useEffect` per sottoscriversi allo stato online di un amico. Immaginiamo di voler riutilizzare questa logica di sottoscrizione in un altro componente.

Innanzitutto, estraiamo questa logica in un Hook custom chiamato `useFriendStatus`:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Esso prende `friendID` come argomento, per poi ritornare il fatto che il nostro amico sia online o meno.

Adesso lo possiamo usare da entrambi i componenti:


```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Caricamento...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Lo stato di questi componenti è completamente indipendente. Gli Hooks sono un modo per riutilizzare *logica stateful*, non lo stato direttamente. Infatti, ogni *chiamata* ad un Hook ha uno stato completamente isolato -- per questo puoi anche utilizzare lo stesso Hook custom più volte in un componente.

Gli Hooks custom sono più una convenzione che una funzionalità. Se il nome di una funzione inizia con "`use`" e richiama altri Hooks, diremo che si tratta di un Hook custom. La convenzione `useQualcosa` è il modo in cui il nostro linter plugin è in grado di individuare bugs nel codice che utilizza gli Hooks.

Puoi scrivere Hooks custom che coprono un ampio ventaglio di casi d'uso quali la gestione dei forms, animazioni, sottoscrizioni dichiarative, timers e probabilmente molti altri che non abbiamo considerato. Non vediamo l'ora di vedere quali Hooks Custom verranno sfornati dalla comunità.

>Spiegazione Dettagliata
>
>Puoi saperne di più riguardo gli Hooks custom nella pagina dedicata: [Hooks Personalizzati](/docs/hooks-custom.html).

## 🔌 Altri Hooks {#other-hooks}

Esistono pochi altri Hooks di fabbrica usati meno frequentemente che potresti ritenere utili. Per esempio, [`useContext`](/docs/hooks-reference.html#usecontext) ti permette di sottoscriverti al React context senza dover introdurre nidificazione:

```js{2,3}
function Esempio() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

E [`useReducer`](/docs/hooks-reference.html#usereducer) che ti permette di gestire lo stato locale di componenti complessi mediante un reducer:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>Spiegazione Dettagliata
>
>Puoi saperne di più riguardo agli Hooks di fabbrica nella pagina dedicata: [API di Riferimento degli Hooks](/docs/hooks-reference.html).

## Passi Successivi {#next-steps}

Phew, che velocità! Se qualcosa non ti è chiaro e vuoi impare le cose più in dettaglio, puoi continuare a leggere le pagine successive, cominciando dalla documentazione su come [Usare l'Hook State](/docs/hooks-state.html).

Puoi anche dare uno sguardo alla [API di Riferimento degli Hooks](/docs/hooks-reference.html) ed alle [FAQ sugli Hooks](/docs/hooks-faq.html).

Concludendo, non ti perdere la [pagina intrroduttiva](/docs/hooks-intro.html) in quanto spiega *perché* abbiamo aggiunto gli Hooks e come cominceremo ad utilizzarli parallelamente alle classi -- senza dover riscrivere le nostre applicazioni.
