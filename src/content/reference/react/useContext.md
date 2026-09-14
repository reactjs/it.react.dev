---
title: useContext
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useContext.md).

</Note>

<Intro>

`useContext` è un Hook React che ti permette di leggere e sottoscriverti al [context](/learn/passing-data-deeply-with-context) dal tuo componente.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Chiama `useContext` al top level del tuo componente per leggere e sottoscriverti al [context.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `SomeContext`: Il context che hai creato in precedenza con [`createContext`](/reference/react/createContext). Il context in sé non contiene informazioni: rappresenta solo il tipo di informazione che puoi fornire o leggere dai componenti.

#### Returns {/*returns*/}

`useContext` restituisce il valore del context per il componente chiamante. È determinato dal `value` passato al `SomeContext` più vicino sopra il componente chiamante nell'albero. Se non c'è un provider, il valore restituito sarà il `defaultValue` che hai passato a [`createContext`](/reference/react/createContext) per quel context. Il valore restituito è sempre aggiornato. React ri-renderizza automaticamente i componenti che leggono un context se questo cambia.

#### Caveats {/*caveats*/}

* Una chiamata a `useContext()` in un componente non è influenzata dai provider restituiti dallo *stesso* componente. Il corrispondente `<Context>` **deve trovarsi *sopra*** il componente che esegue la chiamata a `useContext()`.
* React **ri-renderizza automaticamente** tutti i figli che usano un particolare context a partire dal provider che riceve un `value` diverso. I valori precedente e successivo vengono confrontati con il confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Saltare le ri-renderizzazioni con [`memo`](/reference/react/memo) non impedisce ai figli di ricevere valori di context aggiornati.
* Se il tuo sistema di build produce moduli duplicati nell'output (cosa che può accadere con i symlink), questo può rompere il context. Passare qualcosa tramite context funziona solo se il `SomeContext` che usi per fornire il context e il `SomeContext` che usi per leggerlo sono ***esattamente* lo stesso oggetto**, come determinato da un confronto `===`.

---

## Usage {/*usage*/}


### Passare dati in profondità nell'albero {/*passing-data-deeply-into-the-tree*/}

Chiama `useContext` al top level del tuo componente per leggere e sottoscriverti al [context.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

`useContext` restituisce il <CodeStep step={2}>valore del context</CodeStep> per il <CodeStep step={1}>context</CodeStep> che hai passato. Per determinare il valore del context, React cerca nell'albero dei componenti e trova **il provider di context più vicino sopra** per quel particolare context.

Per passare il context a un `Button`, avvolgilo o avvolgi uno dei suoi componenti genitore nel corrispondente provider di context:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

Non importa quanti livelli di componenti ci siano tra il provider e il `Button`. Quando un `Button` *ovunque* all'interno di `Form` chiama `useContext(ThemeContext)`, riceverà `"dark"` come valore.

<Pitfall>

`useContext()` cerca sempre il provider più vicino *sopra* il componente che lo chiama. Cerca verso l'alto e **non** considera i provider nel componente da cui stai chiamando `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Benvenuto">
      <Button>Registrati</Button>
      <Button>Accedi</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Aggiornare i dati passati tramite context {/*updating-data-passed-via-context*/}

Spesso vorrai che il context cambi nel tempo. Per aggiornare il context, combinalo con lo [state.](/reference/react/useState) Dichiara una variabile di state nel componente genitore e passa lo state corrente come <CodeStep step={2}>valore del context</CodeStep> al provider.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Passa al tema chiaro
      </Button>
    </ThemeContext>
  );
}
```

Ora qualsiasi `Button` all'interno del provider riceverà il valore corrente di `theme`. Se chiami `setTheme` per aggiornare il valore di `theme` che passi al provider, tutti i componenti `Button` verranno ri-renderizzati con il nuovo valore `'light'`.

<Recipes titleText="Esempi di aggiornamento del context" titleId="examples-basic">

#### Aggiornare un valore tramite context {/*updating-a-value-via-context*/}

In questo esempio, il componente `MyApp` contiene una variabile di state che viene poi passata al provider `ThemeContext`. Selezionare la checkbox "Modalità scura" aggiorna lo state. Cambiare il valore fornito ri-renderizza tutti i componenti che usano quel context.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Usa la modalità scura
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="Benvenuto">
      <Button>Registrati</Button>
      <Button>Accedi</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Nota che `value="dark"` passa la stringa `"dark"`, mentre `value={theme}` passa il valore della variabile JavaScript `theme` con le [parentesi graffe JSX.](/learn/javascript-in-jsx-with-curly-braces) Le parentesi graffe ti permettono anche di passare valori di context che non sono stringhe.

<Solution />

#### Aggiornare un oggetto tramite context {/*updating-an-object-via-context*/}

In questo esempio, c'è una variabile di state `currentUser` che contiene un oggetto. Combini `{ currentUser, setCurrentUser }` in un singolo oggetto e lo passi tramite il context all'interno di `value={}`. Questo permette a qualsiasi componente sottostante, come `LoginButton`, di leggere sia `currentUser` che `setCurrentUser`, e poi chiamare `setCurrentUser` quando necessario.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="Benvenuto">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>Hai effettuato l'accesso come {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Accedi come Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Context multipli {/*multiple-contexts*/}

In questo esempio, ci sono due context indipendenti. `ThemeContext` fornisce il tema corrente, che è una stringa, mentre `CurrentUserContext` contiene l'oggetto che rappresenta l'utente corrente.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Usa la modalità scura
        </label>
      </CurrentUserContext>
    </ThemeContext>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Benvenuto">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Hai effettuato l'accesso come {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        Nome{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Cognome{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Accedi
      </Button>
      {!canLogin && <i>Compila entrambi i campi.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Estrarre i provider in un componente {/*extracting-providers-to-a-component*/}

Man mano che la tua app cresce, è normale avere una "piramide" di context più vicina alla radice dell'app. Non c'è nulla di sbagliato in questo. Tuttavia, se non ti piace esteticamente l'annidamento, puoi estrarre i provider in un singolo componente. In questo esempio, `MyProviders` nasconde il "plumbing" e renderizza i figli passati al suo interno nei provider necessari. Nota che lo state `theme` e `setTheme` è necessario in `MyApp` stesso, quindi `MyApp` possiede ancora quella porzione di state.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Usa la modalità scura
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext>
    </ThemeContext>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Benvenuto">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Hai effettuato l'accesso come {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        Nome{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Cognome{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Accedi
      </Button>
      {!canLogin && <i>Compila entrambi i campi.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Scalare con context e un reducer {/*scaling-up-with-context-and-a-reducer*/}

Nelle app più grandi, è comune combinare il context con un [reducer](/reference/react/useReducer) per estrarre la logica relativa a uno state dai componenti. In questo esempio, tutto il "wiring" è nascosto in `TasksContext.js`, che contiene un reducer e due context separati.

Leggi una [guida completa](/learn/scaling-up-with-reducer-and-context) di questo esempio.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Giorno libero a Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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
      throw Error('Azione sconosciuta: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Sentiero dei filosofi', done: true },
  { id: 1, text: 'Visita il tempio', done: false },
  { id: 2, text: 'Bevi matcha', done: false }
];
```

```js src/AddTask.js
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Aggiungi attività"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Aggiungi</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Salva
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Modifica
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Elimina
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

</Recipes>

---

### Specificare un valore predefinito di fallback {/*specifying-a-fallback-default-value*/}

Se React non riesce a trovare provider di quel particolare <CodeStep step={1}>context</CodeStep> nell'albero genitore, il valore del context restituito da `useContext()` sarà uguale al <CodeStep step={3}>valore predefinito</CodeStep> che hai specificato quando hai [creato quel context](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Il valore predefinito **non cambia mai**. Se vuoi aggiornare il context, usalo con lo state come [descritto sopra.](#updating-data-passed-via-context)

Spesso, invece di `null`, c'è un valore più significativo che puoi usare come predefinito, per esempio:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

In questo modo, se renderizzi accidentalmente un componente senza un provider corrispondente, non si romperà. Questo aiuta anche i tuoi componenti a funzionare bene in un ambiente di test senza configurare molti provider nei test.

Nell'esempio sotto, il pulsante "Cambia tema" è sempre chiaro perché si trova **al di fuori di qualsiasi provider di context del tema** e il valore predefinito del context del tema è `'light'`. Prova a modificare il tema predefinito in `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Cambia tema
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Benvenuto">
      <Button>Registrati</Button>
      <Button>Accedi</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Sovrascrivere il context per una parte dell'albero {/*overriding-context-for-a-part-of-the-tree*/}

Puoi sovrascrivere il context per una parte dell'albero avvolgendo quella parte in un provider con un valore diverso.

```js {3,5}
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

Puoi annidare e sovrascrivere i provider quante volte ti serve.

<Recipes titleText="Esempi di sovrascrittura del context">

#### Sovrascrivere un tema {/*overriding-a-theme*/}

Qui, il pulsante *all'interno* del `Footer` riceve un valore di context diverso (`"light"`) rispetto ai pulsanti esterni (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Benvenuto">
      <Button>Registrati</Button>
      <Button>Accedi</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Impostazioni</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Intestazioni annidate automaticamente {/*automatically-nested-headings*/}

Puoi "accumulare" informazioni quando annidi provider di context. In questo esempio, il componente `Section` tiene traccia del `LevelContext` che specifica la profondità dell'annidamento delle sezioni. Legge il `LevelContext` dalla sezione genitore e fornisce ai suoi figli il numero del `LevelContext` incrementato di uno. Di conseguenza, il componente `Heading` può decidere automaticamente quale tag tra `<h1>`, `<h2>`, `<h3>`, ... usare in base a quanti componenti `Section` lo contengono.

Leggi una [guida dettagliata](/learn/passing-data-deeply-with-context) di questo esempio.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Titolo</Heading>
      <Section>
        <Heading>Intestazione</Heading>
        <Heading>Intestazione</Heading>
        <Heading>Intestazione</Heading>
        <Section>
          <Heading>Sotto-intestazione</Heading>
          <Heading>Sotto-intestazione</Heading>
          <Heading>Sotto-intestazione</Heading>
          <Section>
            <Heading>Sotto-sotto-intestazione</Heading>
            <Heading>Sotto-sotto-intestazione</Heading>
            <Heading>Sotto-sotto-intestazione</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading deve essere all\'interno di una Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Livello sconosciuto: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Ottimizzare le ri-renderizzazioni quando si passano oggetti e funzioni {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Puoi passare qualsiasi valore tramite context, inclusi oggetti e funzioni.

```js [[2, 10, "{ currentUser, login }"]]
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

Qui, il <CodeStep step={2}>valore del context</CodeStep> è un oggetto JavaScript con due proprietà, una delle quali è una funzione. Ogni volta che `MyApp` viene ri-renderizzato (per esempio, su un aggiornamento della route), questo sarà un oggetto *diverso* che punta a una funzione *diversa*, quindi React dovrà anche ri-renderizzare tutti i componenti in profondità nell'albero che chiamano `useContext(AuthContext)`.

Nelle app più piccole, questo non è un problema. Tuttavia, non c'è bisogno di ri-renderizzarli se i dati sottostanti, come `currentUser`, non sono cambiati. Per aiutare React a sfruttare questo fatto, puoi avvolgere la funzione `login` con [`useCallback`](/reference/react/useCallback) e avvolgere la creazione dell'oggetto in [`useMemo`](/reference/react/useMemo). Questa è un'ottimizzazione delle prestazioni:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

Come risultato di questa modifica, anche se `MyApp` deve essere ri-renderizzato, i componenti che chiamano `useContext(AuthContext)` non dovranno essere ri-renderizzati a meno che `currentUser` non sia cambiato.

Leggi di più su [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) e [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Troubleshooting {/*troubleshooting*/}

### Il mio componente non vede il valore del mio provider {/*my-component-doesnt-see-the-value-from-my-provider*/}

Ci sono alcuni modi comuni in cui questo può accadere:

1. Stai renderizzando `<SomeContext>` nello stesso componente (o sotto) rispetto a dove stai chiamando `useContext()`. Sposta `<SomeContext>` *sopra e fuori* dal componente che chiama `useContext()`.
2. Potresti aver dimenticato di avvolgere il tuo componente con `<SomeContext>`, oppure potresti averlo messo in una parte dell'albero diversa da quella che pensavi. Verifica che la gerarchia sia corretta usando [React DevTools.](/learn/react-developer-tools)
3. Potresti imbatterti in un problema di build con il tuo tooling che fa sì che `SomeContext` visto dal componente che fornisce e `SomeContext` visto dal componente che legge siano due oggetti diversi. Questo può accadere se usi i symlink, per esempio. Puoi verificarlo assegnandoli a globali come `window.SomeContext1` e `window.SomeContext2` e poi controllando se `window.SomeContext1 === window.SomeContext2` nella console. Se non sono lo stesso oggetto, risolvi il problema a livello del build tool.

### Ricevo sempre `undefined` dal mio context anche se il valore predefinito è diverso {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Potresti avere un provider senza `value` nell'albero:

```js {1,2}
// 🚩 Non funziona: nessuna prop value
<ThemeContext>
   <Button />
</ThemeContext>
```

Se dimentichi di specificare `value`, è come passare `value={undefined}`.

Potresti anche aver usato per errore un nome di prop diverso:

```js {1,2}
// 🚩 Non funziona: la prop dovrebbe chiamarsi "value"
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

In entrambi i casi dovresti vedere un warning da React nella console. Per risolverli, chiama la prop `value`:

```js {1,2}
// ✅ Passare la prop value
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

Nota che il [valore predefinito dalla tua chiamata `createContext(defaultValue)`](#specifying-a-fallback-default-value) viene usato **solo se non c'è alcun provider corrispondente sopra.** Se c'è un componente `<SomeContext value={undefined}>` da qualche parte nell'albero genitore, il componente che chiama `useContext(SomeContext)` *riceverà* `undefined` come valore del context.
