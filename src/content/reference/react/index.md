---
title: "React Hooks integrati"
---

<Intro>

Gli *Hooks* ti consentono di utilizzare diverse funzionalità di React attraverso i tuoi componenti. Puoi utilizzare gli Hooks integrati oppure puoi combinarli per crearne uno tuo. Questa pagina pagina elenca tutti gli Hooks già integrati in React.

</Intro>

---

## State Hooks {/*state-hooks*/}

Lo *State* consente a un componente di ["ricordare" informazioni come l'input di un utente.](/learn/state-a-components-memory) Ad esempio, un componente form può utilizzare lo State per memorizzare il valore di un input, mentre un componente galleria di immagini può utilizzare lo State per memorizzare l'indice dell'immagine attualmente selezionata.

Per aggiungere lo State ad un componente, utilizza uno di questi Hooks:

* [`useState`](/reference/react/useState) dichiara una variabile di stato che puoi aggiornare direttamente.
* [`useReducer`](/reference/react/useReducer) dichiara una variabile di stato con la logica di aggiornamento all'interno di una [funzione reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hooks {/*context-hooks*/}

Il *Context* consente a un componente di [ricevere informazioni da elementi genitori lontani senza che vengano passate tramite props.](/learn/passing-props-to-a-component) Ad esempio, il componente di primo livello della tua app può passare il tema dell'interfaccia utente corrente a tutti i componenti sottostanti, indipendentemente dalla profondità.

* [`useContext`](/reference/react/useContext) legge ed aderisce a un contesto.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

I *Ref* consentono a un componente di [conservare alcune informazioni che non vengono usate per il rendering,](/learn/referencing-values-with-refs) come un nodo DOM o un timeout ID. A differenza dello State, l'aggiornamento di un Ref non esegue nuovamente il rendering del componente. I Ref sono una "via di fuga" dal paradigma React. Sono utili quando devi lavorare con sistemi non React, come le API del browser integrate.

* [`useRef`](/reference/react/useRef) dichiara un Ref. Puoi assegnare qualsiasi valore, ma molto spesso viene utilizzato per contenere un nodo DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) ti consente di personalizzare il Ref esposto dal tuo componente. Questo viene usato raramente.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

Gli *Effects* consentono a un componente di [connettersi e sincronizzarsi con sistemi esterni.](/learn/synchronizing-with-effects) Ciò include la gestione della rete, il DOM del browser, animazioni, widgets scritti utilizzando diverse librerie di UI e per altro codice non-React.

* [`useEffect`](/reference/react/useEffect) collega un componente a un sistema esterno.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Gli Effects sono una "via di fuga" dal paradigma React. Non utilizzare gli Effects per orchestrare il flusso di dati della tua applicazione. Se non stai interagendo con un sistema esterno, [potresti non aver bisogno di un Effect.](/learn/you-might-not-need-an-effect)

Ci sono due varianti di `useEffect`, usate raramente e con differenze di temporizzazione:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) si attiva prima che il browser ridisegni lo schermo. Qui Puoi misurare il layout.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) attiva prima che React apporti modifiche al DOM. Le librerie possono inserire CSS dinamici qui.

---

## Performance Hooks {/*performance-hooks*/}

Un metodo comune per ottimizzare le prestazioni del nuovo rendering consiste nell'evitare il lavoro non necessario. Ad esempio, puoi dire a React di riutilizzare un calcolo memorizzato nella cache o di saltare un nuovo rendering se i dati non sono cambiati dal rendering precedente.

Per saltare i calcoli e il re-rendering non necessario, usa uno di questi Hooks:

- [`useMemo`](/reference/react/useMemo) permette di salvare nella cache il risultato di un calcolo dispendioso.
- [`useCallback`](/reference/react/useCallback) permette di conservare nella cache la definizione di una funzione prima di passarla a un componente ottimizzato.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

A volte, non puoi saltare il nuovo rendering perché lo schermo deve effettivamente essere aggiornato. In questo caso, puoi migliorare le prestazioni separando gli aggiornamenti bloccanti che devono essere sincroni (come la digitazione in un input) dagli aggiornamenti non bloccanti che non devono bloccare l'interfaccia utente (come l'aggiornamento di un grafico).

Per dare la priorità al rendering, utilizza uno di questi Hooks:

- [`useTransition`](/reference/react/useTransition) consente di contrassegnare una transizione di stato come non bloccante e di permettere ad altri aggiornamenti di interromperla.
- [`useDeferredValue`](/reference/react/useDeferredValue) consente di posticipare l'aggiornamento di una parte non critica dell'interfaccia utente e di permettere l'aggiornamento delle altre parti per prime.

---

## Altri Hooks {/*other-hooks*/}

Questi Hooks sono per lo più utili agli autori di librerie e non sono comunemente usati nel codice dell'applicazione.

- [`useDebugValue`](/reference/react/useDebugValue) consente di personalizzare l'etichetta visualizzata da React DevTools per il tuo Hook personalizzato.
- [`useId`](/reference/react/useId) consente a un componente di associare un ID univoco a se stesso. Generalmente utilizzato con le API di accessibilità.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) consente a un componente di iscriversi a un archivio esterno.

---

## I tuoi Hooks {/*your-own-hooks*/}

Puoi anche [definire i tuoi Hooks personalizzati](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) come funzioni JavaScript.
