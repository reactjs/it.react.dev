---
title: useDebugValue
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useDebugValue.md).

</Note>

<Intro>

`useDebugValue` è un Hook React che ti permette di aggiungere un'etichetta a un custom Hook in [React DevTools.](/learn/react-developer-tools)

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Chiama `useDebugValue` al top level del tuo [custom Hook](/learn/reusing-logic-with-custom-hooks) per visualizzare un valore di debug leggibile:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `value`: Il valore che vuoi visualizzare in React DevTools. Può essere di qualsiasi tipo.
* **optional** `format`: Una funzione di formattazione. Quando il componente viene ispezionato, React DevTools chiamerà la funzione di formattazione con `value` come argomento, e poi visualizzerà il valore formattato restituito (che può essere di qualsiasi tipo). Se non specifichi la funzione di formattazione, verrà visualizzato il `value` originale.

#### Returns {/*returns*/}

`useDebugValue` non restituisce nulla.

## Usage {/*usage*/}

### Aggiungere un'etichetta a un custom Hook {/*adding-a-label-to-a-custom-hook*/}

Chiama `useDebugValue` al top level del tuo [custom Hook](/learn/reusing-logic-with-custom-hooks) per visualizzare un <CodeStep step={1}>valore di debug</CodeStep> leggibile per [React DevTools.](/learn/react-developer-tools)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

Questo fornisce ai componenti che chiamano `useOnlineStatus` un'etichetta come `OnlineStatus: "Online"` quando li ispezioni:

![Uno screenshot di React DevTools che mostra il valore di debug](/images/docs/react-devtools-usedebugvalue.png)

Senza la chiamata a `useDebugValue`, verrebbero visualizzati solo i dati sottostanti (in questo esempio, `true`).

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
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

<Note>

Non aggiungere valori di debug a ogni custom Hook. È più utile per i custom Hook che fanno parte di librerie condivise e che hanno una struttura dati interna complessa difficile da ispezionare.

</Note>

---

### Posticipare la formattazione di un valore di debug {/*deferring-formatting-of-a-debug-value*/}

Puoi anche passare una funzione di formattazione come secondo argomento a `useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

La tua funzione di formattazione riceverà il <CodeStep step={1}>valore di debug</CodeStep> come parametro e dovrebbe restituire un <CodeStep step={2}>valore di visualizzazione formattato</CodeStep>. Quando il tuo componente viene ispezionato, React DevTools chiamerà questa funzione e visualizzerà il suo risultato.

Questo ti permette di evitare di eseguire una logica di formattazione potenzialmente costosa a meno che il componente non venga effettivamente ispezionato. Ad esempio, se `date` è un valore Date, questo evita di chiamare `toDateString()` su di esso per ogni renderizzazione.
