---
title: useReducer
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useReducer.md).

</Note>

<Intro>

`useReducer` è un Hook React che ti permette di aggiungere un [reducer](/learn/extracting-state-logic-into-a-reducer) al tuo componente.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

Chiama `useReducer` al top level del tuo componente per gestire il suo state con un [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `reducer`: La funzione reducer che specifica come lo state viene aggiornato. Deve essere pura, deve accettare lo state e l'azione come argomenti e deve restituire il prossimo state. State e azione possono essere di qualsiasi tipo.
* `initialArg`: Il valore da cui viene calcolato lo state iniziale. Può essere un valore di qualsiasi tipo. Come lo state iniziale viene calcolato da esso dipende dal successivo argomento `init`.
* **optional** `init`: La funzione di inizializzazione che deve restituire lo state iniziale. Se non è specificata, lo state iniziale è impostato su `initialArg`. Altrimenti, lo state iniziale è impostato sul risultato della chiamata a `init(initialArg)`.

#### Returns {/*returns*/}

`useReducer` restituisce un array con esattamente due valori:

1. Lo state corrente. Durante la renderizzazione iniziale, è impostato su `init(initialArg)` o `initialArg` (se non c'è `init`).
2. La [funzione `dispatch`](#dispatch) che ti permette di aggiornare lo state a un valore diverso e avviare una ri-renderizzazione.

#### Caveats {/*caveats*/}

* `useReducer` è un Hook, quindi puoi chiamarlo **solo al top level del tuo componente** o dei tuoi Hook. Non puoi chiamarlo all'interno di loop o condizioni. Se ne hai bisogno, estrai un nuovo componente e sposta lo state al suo interno.
* La funzione `dispatch` ha un'identità stabile, quindi spesso la vedrai omessa dalle dipendenze degli Effetti, ma includerla non farà scattare l'Effetto. Se il linter ti permette di omettere una dipendenza senza errori, è sicuro farlo. [Scopri di più sulla rimozione delle dipendenze degli Effetti.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* In Strict Mode, React **chiamerà il tuo reducer e la funzione di inizializzazione due volte** per [aiutarti a trovare impurità accidentali.](#my-reducer-or-initializer-function-runs-twice) Questo è un comportamento solo in development e non influisce sulla production. Se il tuo reducer e la funzione di inizializzazione sono puri (come dovrebbero essere), non dovrebbe influire sulla tua logica. Il risultato di una delle chiamate viene ignorato.

---

### Funzione `dispatch` {/*dispatch*/}

La funzione `dispatch` restituita da `useReducer` ti permette di aggiornare lo state a un valore diverso e avviare una ri-renderizzazione. Devi passare l'azione come unico argomento alla funzione `dispatch`:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React imposterà il prossimo state sul risultato della chiamata alla funzione `reducer` che hai fornito con lo `state` corrente e l'azione che hai passato a `dispatch`.

#### Parameters {/*dispatch-parameters*/}

* `action`: L'azione eseguita dall'utente. Può essere un valore di qualsiasi tipo. Per convenzione, un'azione è solitamente un oggetto con una proprietà `type` che la identifica e, opzionalmente, altre proprietà con informazioni aggiuntive.

#### Returns {/*dispatch-returns*/}

Le funzioni `dispatch` non hanno un valore di ritorno.

#### Caveats {/*setstate-caveats*/}

* La funzione `dispatch` **aggiorna la variabile di state solo per la *prossima* renderizzazione**. Se leggi la variabile di state dopo aver chiamato la funzione `dispatch`, [otterrai comunque il vecchio valore](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) che era sullo schermo prima della tua chiamata.

* Se il nuovo valore che fornisci è identico allo `state` corrente, come determinato da un confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **salterà la ri-renderizzazione del componente e dei suoi figli.** Si tratta di un'ottimizzazione. React potrebbe comunque dover chiamare il tuo componente prima di ignorare il risultato, ma non dovrebbe influire sul tuo codice.

* React [raggruppa gli aggiornamenti di state.](/learn/queueing-a-series-of-state-updates) Aggiorna lo schermo **dopo che tutti i gestori di eventi sono stati eseguiti** e hanno chiamato le loro funzioni `set`. Questo previene più ri-renderizzazioni durante un singolo evento. Nel raro caso in cui devi forzare React ad aggiornare lo schermo prima, per esempio per accedere al DOM, puoi usare [`flushSync`.](/reference/react-dom/flushSync)

---

## Usage {/*usage*/}

### Aggiungere un reducer a un componente {/*adding-a-reducer-to-a-component*/}

Chiama `useReducer` al top level del tuo componente per gestire lo state con un [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` restituisce un array con esattamente due elementi:

1. Lo <CodeStep step={1}>state corrente</CodeStep> di questa variabile di state, inizialmente impostato sullo <CodeStep step={3}>state iniziale</CodeStep> che hai fornito.
2. La <CodeStep step={2}>funzione `dispatch`</CodeStep> che ti permette di cambiarlo in risposta all'interazione.

Per aggiornare ciò che appare sullo schermo, chiama <CodeStep step={2}>`dispatch`</CodeStep> con un oggetto che rappresenta ciò che l'utente ha fatto, chiamato *azione*:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React passerà lo state corrente e l'azione alla tua <CodeStep step={4}>funzione reducer</CodeStep>. Il tuo reducer calcolerà e restituirà il prossimo state. React memorizzerà quel prossimo state, renderizzerà di nuovo il tuo componente con esso e aggiornerà l'UI.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` è molto simile a [`useState`](/reference/react/useState), ma ti permette di spostare la logica di aggiornamento dello state dai gestori di eventi in una singola funzione fuori dal tuo componente. Leggi di più su [scegliere tra `useState` e `useReducer`.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### Scrivere la funzione reducer {/*writing-the-reducer-function*/}

Una funzione reducer è dichiarata così:

```js
function reducer(state, action) {
  // ...
}
```

Poi devi compilare il codice che calcolerà e restituirà il prossimo state. Per convenzione, è comune scriverlo come uno [`switch` statement.](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Statements/switch) Per ogni `case` nello `switch`, calcola e restituisci un prossimo state.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Le azioni possono avere qualsiasi forma. Per convenzione, è comune passare oggetti con una proprietà `type` che identifica l'azione. Dovrebbe includere le informazioni minime necessarie affinché il reducer possa calcolare il prossimo state.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

I nomi dei tipi di azione sono locali al tuo componente. [Ogni azione descrive una singola interazione, anche se ciò porta a più cambiamenti nei dati.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) La forma dello state è arbitraria, ma di solito sarà un oggetto o un array.

Leggi [Estrarre la logica dello state in un reducer](/learn/extracting-state-logic-into-a-reducer) per saperne di più.

<Pitfall>

Lo state è di sola lettura. Non modificare oggetti o array nello state:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Non mutare un oggetto nello state così:
      state.age = state.age + 1;
      return state;
    }
```

Invece, restituisci sempre nuovi oggetti dal tuo reducer:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Invece, restituisci un nuovo oggetto
      return {
        ...state,
        age: state.age + 1
      };
    }
```

Leggi [aggiornare oggetti nello state](/learn/updating-objects-in-state) e [aggiornare array nello state](/learn/updating-arrays-in-state) per saperne di più.

</Pitfall>

<Recipes titleText="Esempi base di useReducer" titleId="examples-basic">

#### Form (oggetto) {/*form-object*/}

In questo esempio, il reducer gestisce un oggetto di state con due campi: `name` e `age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Lista todo (array) {/*todo-list-array*/}

In questo esempio, il reducer gestisce un array di task. L'array deve essere aggiornato [senza mutazione.](/learn/updating-arrays-in-state)

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Scrivere logica di aggiornamento concisa con Immer {/*writing-concise-update-logic-with-immer*/}

Se aggiornare array e oggetti senza mutazione ti sembra tedioso, puoi usare una libreria come [Immer](https://github.com/immerjs/use-immer#useimmerreducer) per ridurre il codice ripetitivo. Immer ti permette di scrivere codice conciso come se stessi mutando oggetti, ma sotto il cofano esegue aggiornamenti immutabili:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Evitare di ricreare lo state iniziale {/*avoiding-recreating-the-initial-state*/}

React salva lo state iniziale una volta e lo ignora nelle renderizzazioni successive.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

Sebbene il risultato di `createInitialState(username)` venga usato solo per la renderizzazione iniziale, stai comunque chiamando questa funzione a ogni renderizzazione. Questo può essere inefficiente se crea array grandi o esegue calcoli costosi.

Per risolvere, puoi **passarla come funzione di _inizializzazione_** a `useReducer` come terzo argomento:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Nota che stai passando `createInitialState`, cioè la *funzione stessa*, e non `createInitialState()`, che è il risultato della sua chiamata. In questo modo, lo state iniziale non viene ricreato dopo l'inizializzazione.

Nell'esempio sopra, `createInitialState` accetta un argomento `username`. Se la tua funzione di inizializzazione non ha bisogno di informazioni per calcolare lo state iniziale, puoi passare `null` come secondo argomento a `useReducer`.

<Recipes titleText="La differenza tra passare una funzione di inizializzazione e passare lo state iniziale direttamente" titleId="examples-initializer">

#### Passare la funzione di inizializzazione {/*passing-the-initializer-function*/}

Questo esempio passa la funzione di inizializzazione, quindi la funzione `createInitialState` viene eseguita solo durante l'inizializzazione. Non viene eseguita quando il componente si ri-renderizza, ad esempio quando digiti nell'input.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Passare lo state iniziale direttamente {/*passing-the-initial-state-directly*/}

Questo esempio **non** passa la funzione di inizializzazione, quindi la funzione `createInitialState` viene eseguita a ogni renderizzazione, ad esempio quando digiti nell'input. Non c'è differenza osservabile nel comportamento, ma questo codice è meno efficiente.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## Troubleshooting {/*troubleshooting*/}

### Ho eseguito il dispatch di un'azione, ma il log mi mostra il vecchio valore di state {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Chiamare la funzione `dispatch` **non cambia lo state nel codice in esecuzione**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Richiede una ri-renderizzazione con 43
  console.log(state.age);  // Ancora 42!

  setTimeout(() => {
    console.log(state.age); // Anche 42!
  }, 5000);
}
```

Questo perché [lo state si comporta come un'istantanea.](/learn/state-as-a-snapshot) Aggiornare lo state richiede un'altra renderizzazione con il nuovo valore di state, ma non influisce sulla variabile JavaScript `state` nel gestore di eventi già in esecuzione.

Se devi indovinare il prossimo valore di state, puoi calcolarlo manualmente chiamando tu stesso il reducer:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### Ho eseguito il dispatch di un'azione, ma lo schermo non si aggiorna {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React **ignorerà il tuo aggiornamento se il prossimo state è uguale al precedente,** come determinato da un confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Di solito succede quando modifichi direttamente un oggetto o un array nello state:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Sbagliato: mutare l'oggetto esistente
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Sbagliato: mutare l'oggetto esistente
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

Hai mutato un oggetto `state` esistente e l'hai restituito, quindi React ha ignorato l'aggiornamento. Per correggere, devi assicurarti di [aggiornare oggetti nello state](/learn/updating-objects-in-state) e [aggiornare array nello state](/learn/updating-arrays-in-state) invece di mutarli:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Corretto: creare un nuovo oggetto
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Corretto: creare un nuovo oggetto
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Una parte dello state del mio reducer diventa undefined dopo il dispatch {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Assicurati che ogni ramo `case` **copi tutti i campi esistenti** quando restituisce il nuovo state:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Non dimenticarlo!
        age: state.age + 1
      };
    }
    // ...
```

Senza `...state` sopra, il prossimo state restituito conterrebbe solo il campo `age` e nient'altro.

---

### Tutto lo state del mio reducer diventa undefined dopo il dispatch {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

Se il tuo state diventa inaspettatamente `undefined`, probabilmente stai dimenticando di `return` state in uno dei casi, oppure il tuo tipo di azione non corrisponde a nessuno dei `case`. Per scoprire perché, lancia un errore fuori dallo `switch`:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Puoi anche usare un type checker statico come TypeScript per individuare questi errori.

---

### Ricevo un errore: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Potresti ricevere un errore che dice: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Di solito, significa che stai eseguendo incondizionatamente un dispatch di un'azione *durante la renderizzazione*, quindi il tuo componente entra in un loop: renderizzazione, dispatch (che causa una renderizzazione), renderizzazione, dispatch (che causa una renderizzazione), e così via. Molto spesso, questo è causato da un errore nella specifica di un gestore di eventi:

```js {1-2}
// 🚩 Sbagliato: chiama il gestore durante la renderizzazione
return <button onClick={handleClick()}>Click me</button>

// ✅ Corretto: passa il gestore di eventi
return <button onClick={handleClick}>Click me</button>

// ✅ Corretto: passa una funzione inline
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Se non riesci a trovare la causa di questo errore, clicca sulla freccia accanto all'errore nella console e scorri lo stack JavaScript per trovare la specifica chiamata alla funzione `dispatch` responsabile dell'errore.

---

### La mia funzione reducer o di inizializzazione viene eseguita due volte {/*my-reducer-or-initializer-function-runs-twice*/}

In [Strict Mode](/reference/react/StrictMode), React chiamerà il tuo reducer e le funzioni di inizializzazione due volte. Non dovrebbe rompere il tuo codice.

Questo comportamento **solo in development** ti aiuta a [mantenere i componenti puri.](/learn/keeping-components-pure) React usa il risultato di una delle chiamate e ignora il risultato dell'altra. Finché il tuo componente, la funzione di inizializzazione e il reducer sono puri, non dovrebbe influire sulla tua logica. Tuttavia, se sono accidentalmente impuri, questo ti aiuta a notare gli errori.

Per esempio, questa funzione reducer impura muta un array nello state:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Errore: mutare lo state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Poiché React chiama la tua funzione reducer due volte, vedrai che il todo è stato aggiunto due volte, quindi saprai che c'è un errore. In questo esempio, puoi correggere l'errore [sostituendo l'array invece di mutarlo](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Corretto: sostituire con un nuovo state
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Ora che questa funzione reducer è pura, chiamarla una volta in più non fa differenza nel comportamento. Ecco perché React chiamarla due volte ti aiuta a trovare gli errori. **Solo le funzioni del componente, di inizializzazione e reducer devono essere pure.** I gestori di eventi non devono essere puri, quindi React non chiamerà mai i tuoi gestori di eventi due volte.

Leggi [mantenere i componenti puri](/learn/keeping-components-pure) per saperne di più.
