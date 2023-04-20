---
id: hooks-custom
title: Hooks Personalizzati
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

</div>

Gli *Hooks* sono stati aggiunti in React 16.8. Ti permettono di utilizzare `state` ed altre funzioni di React senza dover scrivere una classe.

Costruire i tuoi Hooks personalizzati ti permette di estrarre la logica dei componenti all'interno di funzioni riutilizzabili.

Quando stavamo imparando a [usare l'Hook Effect](/docs/hooks-effect.html#example-using-hooks-1), abbiamo visto questo componente di un'applicazione chat che mostra un messaggio per indicare se un amico è online oppure offline:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Supponiamo ora che la nostra applicazione chat abbia anche una lista contatti, e che vogliamo renderizzare i nomi degli utenti online con un colore verde. Potremmo copiare e incollare una logica simile dentro al nostro componente `FriendListItem` ma non sarebbe l'ideale:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Invece, vorremmo condividere questa logica tra `FriendStatus` e `FriendListItem`.

Tradizionalmente in React, esistono due modi diffusi per condividere la logica con stato tra i componenti: le [render props](/docs/render-props.html) e gli [higher-order components](/docs/higher-order-components.html). Ora vedremo come gli Hooks risolvono molti degli stessi problemi senza costringerti ad aggiungere altri componenti alla struttura ad albero.

## Estrarre un Hook personalizzato {#extracting-a-custom-hook}

Quando vogliamo condividere della logica tra due funzioni JavaScript, la estraiamo all'interno di una terza funzione. Sia i componenti che gli Hooks sono funzioni, quindi questo vale anche per loro!

**Un Hook personalizzato è una funzione JavaScript il cui nome inizia con "`use`" e che può invocare altri Hooks.** Per esempio, `useFriendStatus` qui sotto è il nostro primo Hook personalizzato:

```js{3}
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Non c'è niente di nuovo al suo interno -- la logica è copiata dai componenti sopra. Esattamente come in un componente, assicurati di invocare gli altri Hooks incondizionatamente al livello più alto del tuo Hook personalizzato.

A differenza di un componente React, un Hook personalizzato non ha bisogno di avere una firma specifica. Possiamo decidere quali parametri ricevere e cosa, nel caso, deve ritornare. In altre parole, è proprio come una normale funzione. Il suo nome dovrebbe sempre iniziare con `use` così che si possa riconoscere a prima vista che per lui si applicano le [regole degli Hooks](/docs/hooks-rules.html).

Lo scopo del nostro Hook `useFriendStatus` è di sottoscriverci allo status di un amico. Ecco perché riceve `friendID` come parametro, e ritorna se questo amico è online:

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Ora vediamo come possiamo utilizzare il nostro Hook personalizzato.

## Utilizzare un Hook personalizzato {#using-a-custom-hook}

All'inizio, il nostro obiettivo dichiarato era di rimuovere la logica duplicata dai componenti `FriendStatus` e `FriendListItem`. Entrambi vogliono sapere se un amico è online.

Ora che abbiamo estratto questa logica all'interno dell'Hook `useFriendStatus`, non ci resta *che utilizzarla:*

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
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

**Questo codice è equivalente a quello degli esempi originali?** Sì, funziona esattamente allo stesso modo. Se guardi con attenzione, noterai che non abbiamo apportato alcuna modifica al comportamento. Tutto ciò che abbiamo fatto è stato estrarre codice in comune tra le due funzioni in una funzione separata. **Gli Hooks personalizzati sono una convenzione che deriva in modo naturale dal modo in cui gli Hooks sono progettati, piuttosto che da una funzionalità di React.**

**Devo nominare i miei Hooks personalizzati cominciando con "`use`"?** Sì, per favore. Questa convenzione è molto importante. Senza di essa, non potremmo verificare automaticamente eventuali violazioni delle [regole degli Hooks](/docs/hooks-rules.html) perché non sapremmo distinguere se una certa funzione contiene chiamate agli Hooks al suo interno.

**Due componenti che utilizzano lo stesso Hook condividono lo state?** No. Gli Hooks personalizzati sono un meccanismo per riutilizzare *logica con stato* (come creare una sottoscrizione e ricordare il valore corrente), ma ogni volta che utilizzi un Hook personalizzato, tutto lo state e gli effect al suo interno sono totalmente isolati.

**Come fa un Hook personalizzato ad avere uno state isolato?** Ciascuna *chiamata* ad un Hook riceve uno state isolato. Siccome chiamiamo direttamente `useFriendStatus`, dal punto di vista di React il nostro componente invoca solo `useState` e `useEffect`. E come abbiamo [imparato](/docs/hooks-state.html#tip-using-multiple-state-variables) [prima](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), possiamo chiamare `useState` e `useEffect` tante volte in un componente, e saranno completamente indipendenti.

### Suggerimento: Passare informazioni tra gli Hooks {#tip-pass-information-between-hooks}

Dal momento che gli Hooks sono funzioni, possiamo passare informazioni tra di essi.

Per spiegarlo, useremo un altro componente dal nostro ipotetico esempio della chat. Si tratta di una select dei destinatari dei messaggi di chat che mostra se l'amico attualmente selezionato è online:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

Salviamo l'ID dell'amico attualmente selezionato nella variabile di stato `recipientID`, e la aggiorniamo se l'utente seleziona un amico diverso nella `<select>`.

Siccome la chiamata all'Hook `useState` ci restituisce il valore più recente della variabile di stato `recipientID`, possiamo passarla come parametro al nostro Hook personalizzato `useFriendStatus`:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Questo ci permette di sapere se l'amico *attualmente selezionato* è online. Se scegliamo un amico diverso e aggiorniamo la variabile di stato `recipientID`, il nostro Hook `useFriendStatus` si cancellerà dall'amico precedentemente selezionato, e si sottoscriverà allo stato di quello appena selezionato.

## `usaLaTuaImmaginazione()` {#useyourimagination}

Gli Hooks personalizzati offrono la flessibilità di condividere la logica che prima non era possibile nei componenti React. Puoi scrivere Hooks personalizzati che coprono una vasta gamma di casi d'uso come gestione di form, animazioni, sottoscrizioni dichiarative, timer, e probabilmente molti altri casi che non abbiamo considerato. Inoltre, puoi costruire Hooks che sono facili da usare proprio come le funzionalità già incorporate in React.

Prova a non aggiungere astrazioni troppo presto. Ora che i componenti funzione possono fare di più, è probabile che un tipico componente nel tuo codice diventi più grande. Questo è normale -- non sentirti *obbligato* a suddividerlo immediatamente in Hooks. Ma ti incoraggiamo anche a iniziare ad individuare i casi in cui un Hook personalizzato potrebbe nascondere una logica complessa dietro ad un'interfaccia semplice, o aiutarti a districare un componente disordinato.

Per esempio, potresti avere un componente complesso che contiene una gran quantità di stato locale gestito ad-hoc. `useState` non rende affatto più semplice centralizzare la logica di update quindi potresti preferire scriverlo sotto forma di un reducer [Redux](https://redux.js.org/).

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}
```

I Reducers sono molto comodi da testare isolati, e da scalare per esprimere logiche di update complesse. Se necessario, puoi ulteriormente spezzarli in reducers più piccoli. Tuttavia, potresti anche apprezzare i vantaggi di utilizzare lo state locale di React, oppure non voler installare un'altra libreria.

E se potessimo scrivere un Hook `useReducer` che ci permette di gestire lo state *locale* del nostro componente con un reducer? Una versione semplificata potrebbe essere così:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Ora possiamo utilizzarlo nel nostro componente, e lasciare che sia il reducer a occuparsi della gestione del suo stato:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

La necessità di gestire lo state locale con un reducer in un componente complesso è diffusa al punto che abbiamo inserito l'Hook `useReducer` all'interno di React. Lo puoi trovare insieme agli altri Hooks integrati nelle [API di riferimento degli Hooks](/docs/hooks-reference.html).
