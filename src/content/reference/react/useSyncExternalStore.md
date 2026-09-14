---
title: useSyncExternalStore
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useSyncExternalStore.md).

</Note>

<Intro>

`useSyncExternalStore` è un Hook React che ti permette di sottoscriverti a uno store esterno.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Chiama `useSyncExternalStore` al top level del tuo componente per leggere un valore da uno store di dati esterno.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Restituisce l'istantanea dei dati nello store. Devi passare due funzioni come argomenti:

1. La funzione `subscribe` deve sottoscriversi allo store e restituire una funzione che annulla la sottoscrizione.
2. La funzione `getSnapshot` deve leggere un'istantanea dei dati dallo store.

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `subscribe`: Una funzione che accetta un singolo argomento `callback` e lo sottoscrive allo store. Quando lo store cambia, deve invocare il `callback` fornito, che farà sì che React richiami `getSnapshot` e (se necessario) ri-renderizzi il componente. La funzione `subscribe` deve restituire una funzione che ripulisce la sottoscrizione.

* `getSnapshot`: Una funzione che restituisce un'istantanea dei dati nello store necessari al componente. Finché lo store non cambia, chiamate ripetute a `getSnapshot` devono restituire lo stesso valore. Se lo store cambia e il valore restituito è diverso (confrontato con [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React ri-renderizza il componente.

* **optional** `getServerSnapshot`: Una funzione che restituisce l'istantanea iniziale dei dati nello store. Verrà usata solo durante la renderizzazione lato server e durante l'hydration del contenuto renderizzato lato server sul client. L'istantanea lato server deve essere identica tra client e server, ed è solitamente serializzata e passata dal server al client. Se ometti questo argomento, la renderizzazione del componente sul server genererà un errore.

#### Returns {/*returns*/}

L'istantanea corrente dello store, che puoi usare nella tua logica di renderizzazione.

#### Caveats {/*caveats*/}

* L'istantanea dello store restituita da `getSnapshot` deve essere immutabile. Se lo store sottostante ha dati mutabili, restituisci una nuova istantanea immutabile se i dati sono cambiati. Altrimenti, restituisci l'ultima istantanea memorizzata nella cache.

* Se viene passata una funzione `subscribe` diversa durante una ri-renderizzazione, React si ri-sottoscriverà allo store usando la funzione `subscribe` appena passata. Puoi evitarlo dichiarando `subscribe` fuori dal componente.

* Se lo store viene mutato durante un [aggiornamento Transizione non bloccante](/reference/react/useTransition), React ricadrà sull'esecuzione di quell'aggiornamento come bloccante. Nello specifico, per ogni aggiornamento Transizione, React chiamerà `getSnapshot` una seconda volta subito prima di applicare le modifiche al DOM. Se restituisce un valore diverso rispetto a quando è stata chiamata originariamente, React riavvierà l'aggiornamento da zero, questa volta applicandolo come aggiornamento bloccante, per garantire che ogni componente sullo schermo rifletta la stessa versione dello store.

* Non è consigliato _sospendere_ una renderizzazione in base a un valore dello store restituito da `useSyncExternalStore`. Il motivo è che le mutazioni dello store esterno non possono essere contrassegnate come [aggiornamenti Transizione non bloccanti](/reference/react/useTransition), quindi attiveranno il [`fallback` di `Suspense`](/reference/react/Suspense) più vicino, sostituendo il contenuto già renderizzato sullo schermo con uno spinner di caricamento, il che in genere produce una UX scadente.

  Per esempio, quanto segue è sconsigliato:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Chiamare `use` con una Promise che dipende da `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Renderizzare condizionalmente un componente lazy in base a `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## Usage {/*usage*/}

### Sottoscriversi a uno store esterno {/*subscribing-to-an-external-store*/}

La maggior parte dei tuoi componenti React leggerà dati solo dalle loro [props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) e [context.](/reference/react/useContext) Tuttavia, a volte un componente deve leggere dati da uno store al di fuori di React che cambia nel tempo. Questo include:

* Librerie di gestione dello state di terze parti che mantengono lo state al di fuori di React.
* API del browser che espongono un valore mutabile ed eventi a cui sottoscriversi per i suoi cambiamenti.

Chiama `useSyncExternalStore` al top level del tuo componente per leggere un valore da uno store di dati esterno.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Restituisce l'<CodeStep step={3}>istantanea</CodeStep> dei dati nello store. Devi passare due funzioni come argomenti:

1. La <CodeStep step={1}>funzione `subscribe`</CodeStep> deve sottoscriversi allo store e restituire una funzione che annulla la sottoscrizione.
2. La <CodeStep step={2}>funzione `getSnapshot`</CodeStep> deve leggere un'istantanea dei dati dallo store.

React userà queste funzioni per mantenere il tuo componente sottoscritto allo store e ri-renderizzarlo al cambiamento.

Per esempio, nella sandbox qui sotto, `todosStore` è implementato come store esterno che memorizza dati al di fuori di React. Il componente `TodosApp` si connette a quello store esterno con l'Hook `useSyncExternalStore`.

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// Questo è un esempio di store di terze parti
// che potresti dover integrare con React.

// Se la tua app è costruita interamente con React,
// ti consigliamo di usare lo state React.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

Quando possibile, ti consigliamo di usare lo state React integrato con [`useState`](/reference/react/useState) e [`useReducer`](/reference/react/useReducer). L'API `useSyncExternalStore` è soprattutto utile se devi integrarti con codice non-React esistente.

</Note>

---

### Sottoscriversi a un'API del browser {/*subscribing-to-a-browser-api*/}

Un altro motivo per usare `useSyncExternalStore` è quando vuoi sottoscriverti a un valore esposto dal browser che cambia nel tempo. Per esempio, supponi di voler mostrare nel componente se la connessione di rete è attiva. Il browser espone questa informazione tramite una proprietà chiamata [`navigator.onLine`.](https://developer.mozilla.org/it/docs/Web/API/Navigator/onLine)

Questo valore può cambiare senza che React lo sappia, quindi dovresti leggerlo con `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Per implementare la funzione `getSnapshot`, leggi il valore corrente dall'API del browser:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Poi devi implementare la funzione `subscribe`. Per esempio, quando `navigator.onLine` cambia, il browser emette gli eventi [`online`](https://developer.mozilla.org/it/docs/Web/API/Window/online_event) e [`offline`](https://developer.mozilla.org/it/docs/Web/API/Window/offline_event) sull'oggetto `window`. Devi sottoscrivere l'argomento `callback` agli eventi corrispondenti, e poi restituire una funzione che ripulisce le sottoscrizioni:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Ora React sa come leggere il valore dall'API esterna `navigator.onLine` e come sottoscriversi ai suoi cambiamenti. Disconnetti il dispositivo dalla rete e nota che il componente si ri-renderizza in risposta:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Estrarre la logica in un custom hook {/*extracting-the-logic-to-a-custom-hook*/}

Di solito non scriverai `useSyncExternalStore` direttamente nei tuoi componenti. Invece, lo chiamerai tipicamente dal tuo custom hook. Questo ti permette di usare lo stesso store esterno da componenti diversi.

Per esempio, questo custom hook `useOnlineStatus` tiene traccia se la rete è online:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Ora componenti diversi possono chiamare `useOnlineStatus` senza ripetere l'implementazione sottostante:

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
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Aggiungere supporto per la renderizzazione lato server {/*adding-support-for-server-rendering*/}

Se la tua app React usa la [renderizzazione lato server,](/reference/react-dom/server) i tuoi componenti React verranno eseguiti anche al di fuori dell'ambiente browser per generare l'HTML iniziale. Questo crea alcune sfide quando ci si connette a uno store esterno:

- Se ti connetti a un'API disponibile solo nel browser, non funzionerà perché non esiste sul server.
- Se ti connetti a uno store di dati di terze parti, avrai bisogno che i suoi dati corrispondano tra server e client.

Per risolvere questi problemi, passa una funzione `getServerSnapshot` come terzo argomento a `useSyncExternalStore`:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Mostra sempre "Online" per l'HTML generato lato server
}

function subscribe(callback) {
  // ...
}
```

La funzione `getServerSnapshot` è simile a `getSnapshot`, ma viene eseguita solo in due situazioni:

- Sul server, quando genera l'HTML.
- Sul client durante l'[hydration](/reference/react-dom/client/hydrateRoot), cioè quando React prende l'HTML del server e lo rende interattivo.

Questo ti permette di fornire il valore dell'istantanea iniziale che verrà usato prima che l'app diventi interattiva. Se non c'è un valore iniziale significativo per la renderizzazione lato server, ometti questo argomento per [forzare la renderizzazione sul client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

<Note>

Assicurati che `getServerSnapshot` restituisca esattamente gli stessi dati alla renderizzazione iniziale sul client rispetto a quelli restituiti sul server. Per esempio, se `getServerSnapshot` ha restituito del contenuto pre-popolato dello store sul server, devi trasferire questo contenuto al client. Un modo per farlo è emettere un tag `<script>` durante la renderizzazione lato server che imposta un globale come `window.MY_STORE_DATA`, e leggerlo dal client in `getServerSnapshot`. Il tuo store esterno dovrebbe fornire istruzioni su come farlo.

</Note>

---

## Troubleshooting {/*troubleshooting*/}

### Ricevo un errore: "The result of `getSnapshot` should be cached" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

Questo errore significa che la tua funzione `getSnapshot` restituisce un nuovo oggetto ogni volta che viene chiamata, per esempio:

```js {2-5}
function getSnapshot() {
  // 🔴 Non restituire oggetti sempre diversi da getSnapshot
  return {
    todos: myStore.todos
  };
}
```

React ri-renderizzerà il componente se il valore restituito da `getSnapshot` è diverso dall'ultima volta. Per questo motivo, se restituisci sempre un valore diverso, entrerai in un loop infinito e riceverai questo errore.

La tua funzione `getSnapshot` dovrebbe restituire un oggetto diverso solo se qualcosa è effettivamente cambiato. Se il tuo store contiene dati immutabili, puoi restituire quei dati direttamente:

```js {2-3}
function getSnapshot() {
  // ✅ Puoi restituire dati immutabili
  return myStore.todos;
}
```

Se i dati del tuo store sono mutabili, la tua funzione `getSnapshot` dovrebbe restituire un'istantanea immutabile di essi. Questo significa che *deve* creare nuovi oggetti, ma non dovrebbe farlo ad ogni singola chiamata. Invece, dovrebbe memorizzare l'ultima istantanea calcolata e restituire la stessa istantanea dell'ultima volta se i dati nello store non sono cambiati. Come determinare se i dati mutabili sono cambiati dipende dal tuo store mutabile.

---

### La mia funzione `subscribe` viene chiamata dopo ogni ri-renderizzazione {/*my-subscribe-function-gets-called-after-every-re-render*/}

Questa funzione `subscribe` è definita *all'interno* di un componente, quindi è diversa a ogni ri-renderizzazione:

```js {2-5}
function ChatIndicator() {
  // 🚩 Sempre una funzione diversa, quindi React si ri-sottoscriverà a ogni ri-renderizzazione
  function subscribe() {
    // ...
  }

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```

React si ri-sottoscriverà al tuo store se passi una funzione `subscribe` diversa tra le ri-renderizzazioni. Se questo causa problemi di prestazioni e vuoi evitare di ri-sottoscriverti, sposta la funzione `subscribe` all'esterno:

```js {1-4}
// ✅ Sempre la stessa funzione, quindi React non dovrà ri-sottoscriversi
function subscribe() {
  // ...
}

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

In alternativa, avvolgi `subscribe` in [`useCallback`](/reference/react/useCallback) per ri-sottoscriverti solo quando cambia qualche argomento:

```js {2-5}
function ChatIndicator({ userId }) {
  // ✅ Stessa funzione finché userId non cambia
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```
