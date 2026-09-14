---
title: useState
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useState.md).

</Note>

<Intro>

`useState` è un Hook React che ti permette di aggiungere una [variabile di state](/learn/state-a-components-memory) al tuo componente.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Chiama `useState` al top level del tuo componente per dichiarare una [variabile di state.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

La convenzione è di nominare le variabili di state come `[something, setSomething]` usando la [destructuring di array.](https://javascript.info/destructuring-assignment)

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `initialState`: Il valore con cui vuoi che lo state sia inizialmente. Può essere un valore di qualsiasi tipo, ma c'è un comportamento speciale per le funzioni. Questo argomento viene ignorato dopo la renderizzazione iniziale.
  * Se passi una funzione come `initialState`, verrà trattata come una _funzione di inizializzazione_. Deve essere pura, non deve accettare argomenti e deve restituire un valore di qualsiasi tipo. React chiamerà la tua funzione di inizializzazione quando inizializza il componente e memorizzerà il suo valore di ritorno come state iniziale. [Vedi un esempio sotto.](#avoiding-recreating-the-initial-state)

#### Returns {/*returns*/}

`useState` restituisce un array con esattamente due valori:

1. Lo state corrente. Durante la prima renderizzazione, corrisponderà all'`initialState` che hai passato.
2. La [funzione `set`](#setstate) che ti permette di aggiornare lo state a un valore diverso e avviare una ri-renderizzazione.

#### Caveats {/*caveats*/}

* `useState` è un Hook, quindi puoi chiamarlo solo **al top level del tuo componente** o dei tuoi Hooks. Non puoi chiamarlo all'interno di loop o condizioni. Se ne hai bisogno, estrai un nuovo componente e sposta lo state al suo interno.
* In Strict Mode, React **chiamerà la tua funzione di inizializzazione due volte** per [aiutarti a trovare impurità accidentali.](#my-initializer-or-updater-function-runs-twice) Questo è un comportamento solo in development e non influisce sulla production. Se la tua funzione di inizializzazione è pura (come dovrebbe essere), non dovrebbe influire sul comportamento. Il risultato di una delle chiamate viene ignorato.

---

### Funzioni `set`, come `setSomething(nextState)` {/*setstate*/}

La funzione `set` restituita da `useState` ti permette di aggiornare lo state a un valore diverso e avviare una ri-renderizzazione. Puoi passare il prossimo state direttamente, oppure una funzione che lo calcola dallo state precedente:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parameters {/*setstate-parameters*/}

* `nextState`: Il valore con cui vuoi che lo state sia. Può essere un valore di qualsiasi tipo, ma c'è un comportamento speciale per le funzioni.
  * Se passi una funzione come `nextState`, verrà trattata come una _funzione di aggiornamento dello state_. Deve essere pura, deve accettare lo state in attesa come unico argomento e deve restituire il prossimo state. React metterà la tua funzione di aggiornamento dello state in una coda e ri-renderizzerà il tuo componente. Durante la prossima renderizzazione, React calcolerà il prossimo state applicando tutte le funzioni di aggiornamento in coda allo state precedente. [Vedi un esempio sotto.](#updating-state-based-on-the-previous-state)

#### Returns {/*setstate-returns*/}

Le funzioni `set` non hanno un valore di ritorno.

#### Caveats {/*setstate-caveats*/}

* La funzione `set` **aggiorna la variabile di state solo per la *prossima* renderizzazione**. Se leggi la variabile di state dopo aver chiamato la funzione `set`, [otterrai comunque il vecchio valore](#ive-updated-the-state-but-logging-gives-me-the-old-value) che era sullo schermo prima della tua chiamata.

* Se il nuovo valore che fornisci è identico allo `state` corrente, come determinato da un confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **salterà la ri-renderizzazione del componente e dei suoi figli.** Si tratta di un'ottimizzazione. Anche se in alcuni casi React potrebbe comunque dover chiamare il tuo componente prima di ignorare i figli, non dovrebbe influire sul tuo codice.

* React [raggruppa gli aggiornamenti di state.](/learn/queueing-a-series-of-state-updates) Aggiorna lo schermo **dopo che tutti i gestori di eventi sono stati eseguiti** e hanno chiamato le loro funzioni `set`. Questo previene più ri-renderizzazioni durante un singolo evento. Nel raro caso in cui devi forzare React ad aggiornare lo schermo prima, per esempio per accedere al DOM, puoi usare [`flushSync`.](/reference/react-dom/flushSync)

* La funzione `set` ha un'identità stabile, quindi spesso la vedrai omessa dalle dipendenze degli Effetti, ma includerla non farà scattare l'Effetto. Se il linter ti permette di omettere una dipendenza senza errori, è sicuro farlo. [Scopri di più sulla rimozione delle dipendenze degli Effetti.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Chiamare la funzione `set` *durante la renderizzazione* è consentito solo dall'interno del componente attualmente in renderizzazione. React scarterà il suo output e tenterà immediatamente di renderizzarlo di nuovo con il nuovo state. Questo pattern è raramente necessario, ma puoi usarlo per **memorizzare informazioni dalle renderizzazioni precedenti**. [Vedi un esempio sotto.](#storing-information-from-previous-renders)

* In Strict Mode, React **chiamerà la tua funzione di aggiornamento dello state due volte** per [aiutarti a trovare impurità accidentali.](#my-initializer-or-updater-function-runs-twice) Questo è un comportamento solo in development e non influisce sulla production. Se la tua funzione di aggiornamento dello state è pura (come dovrebbe essere), non dovrebbe influire sul comportamento. Il risultato di una delle chiamate viene ignorato.

---

## Usage {/*usage*/}

### Aggiungere state a un componente {/*adding-state-to-a-component*/}

Chiama `useState` al top level del tuo componente per dichiarare una o più [variabili di state.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

La convenzione è di nominare le variabili di state come `[something, setSomething]` usando la [destructuring di array.](https://javascript.info/destructuring-assignment)

`useState` restituisce un array con esattamente due elementi:

1. Lo <CodeStep step={1}>state corrente</CodeStep> di questa variabile di state, inizialmente impostato allo <CodeStep step={3}>state iniziale</CodeStep> che hai fornito.
2. La <CodeStep step={2}>funzione `set`</CodeStep> che ti permette di cambiarlo in qualsiasi altro valore in risposta all'interazione.

Per aggiornare ciò che c'è sullo schermo, chiama la funzione `set` con un prossimo state:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React memorizzerà il prossimo state, renderizzerà di nuovo il tuo componente con i nuovi valori e aggiornerà l'UI.

<Pitfall>

Chiamare la funzione `set` [**non** cambia lo state corrente nel codice già in esecuzione](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Ancora "Taylor"!
}
```

Influisce solo su ciò che `useState` restituirà a partire dalla *prossima* renderizzazione.

</Pitfall>

<Recipes titleText="Esempi base di useState" titleId="examples-basic">

#### Contatore (numero) {/*counter-number*/}

In questo esempio, la variabile di state `count` contiene un numero. Cliccare il pulsante la incrementa.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Campo di testo (stringa) {/*text-field-string*/}

In questo esempio, la variabile di state `text` contiene una stringa. Quando digiti, `handleChange` legge l'ultimo valore dell'input dall'elemento DOM input del browser e chiama `setText` per aggiornare lo state. Questo ti permette di visualizzare il `text` corrente sotto.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (booleano) {/*checkbox-boolean*/}

In questo esempio, la variabile di state `liked` contiene un booleano. Quando clicchi l'input, `setLiked` aggiorna la variabile di state `liked` con il valore checked dell'input checkbox del browser. La variabile `liked` viene usata per renderizzare il testo sotto la checkbox.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Form (due variabili) {/*form-two-variables*/}

Puoi dichiarare più di una variabile di state nello stesso componente. Ogni variabile di state è completamente indipendente.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Aggiornare lo state in base allo state precedente {/*updating-state-based-on-the-previous-state*/}

Supponiamo che `age` sia `42`. Questo gestore chiama `setAge(age + 1)` tre volte:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

Tuttavia, dopo un click, `age` sarà solo `43` anziché `45`! Questo perché chiamare la funzione `set` [non aggiorna](/learn/state-as-a-snapshot) la variabile di state `age` nel codice già in esecuzione. Quindi ogni chiamata a `setAge(age + 1)` diventa `setAge(43)`.

Per risolvere questo problema, **puoi passare una *funzione di aggiornamento dello state*** a `setAge` invece del prossimo state:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Qui, `a => a + 1` è la tua funzione di aggiornamento dello state. Prende lo <CodeStep step={1}>state in attesa</CodeStep> e calcola il <CodeStep step={2}>prossimo state</CodeStep> da esso.

React mette le tue funzioni di aggiornamento dello state in una [coda.](/learn/queueing-a-series-of-state-updates) Poi, durante la prossima renderizzazione, le chiamerà nello stesso ordine:

1. `a => a + 1` riceverà `42` come state in attesa e restituirà `43` come prossimo state.
1. `a => a + 1` riceverà `43` come state in attesa e restituirà `44` come prossimo state.
1. `a => a + 1` riceverà `44` come state in attesa e restituirà `45` come prossimo state.

Non ci sono altri aggiornamenti in coda, quindi React memorizzerà `45` come state corrente alla fine.

Per convenzione, è comune nominare l'argomento dello state in attesa con la prima lettera del nome della variabile di state, come `a` per `age`. Tuttavia, puoi anche chiamarlo `prevAge` o qualcos'altro che trovi più chiaro.

React potrebbe [chiamare le tue funzioni di aggiornamento due volte](#my-initializer-or-updater-function-runs-twice) in development per verificare che siano [pure.](/learn/keeping-components-pure)

<DeepDive>

#### Usare sempre una funzione di aggiornamento è preferibile? {/*is-using-an-updater-always-preferred*/}

Potresti sentire il consiglio di scrivere sempre codice come `setAge(a => a + 1)` se lo state che stai impostando viene calcolato dallo state precedente. Non c'è nulla di male, ma non è sempre necessario.

Nella maggior parte dei casi, non c'è differenza tra questi due approcci. React si assicura sempre che, per azioni intenzionali dell'utente come i click, la variabile di state `age` venga aggiornata prima del click successivo. Questo significa che non c'è rischio che un gestore di eventi veda un valore `age` "obsoleto" all'inizio del gestore di eventi.

Tuttavia, se esegui più aggiornamenti nello stesso evento, le funzioni di aggiornamento dello state possono essere utili. Sono utili anche se accedere alla variabile di state stessa è scomodo (potresti imbatterti in questo quando ottimizzi le ri-renderizzazioni).

Se preferisci la coerenza a una sintassi leggermente più verbosa, è ragionevole scrivere sempre una funzione di aggiornamento dello state se lo state che stai impostando viene calcolato dallo state precedente. Se viene calcolato dallo state precedente di qualche *altra* variabile di state, potresti volerle combinare in un oggetto e [usare un reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="La differenza tra passare una funzione di aggiornamento e passare il prossimo state direttamente" titleId="examples-updater">

#### Passare la funzione di aggiornamento dello state {/*passing-the-updater-function*/}

Questo esempio passa la funzione di aggiornamento dello state, quindi il pulsante "+3" funziona.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Passare il prossimo state direttamente {/*passing-the-next-state-directly*/}

Questo esempio **non** passa la funzione di aggiornamento dello state, quindi il pulsante "+3" **non funziona come previsto**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Aggiornare oggetti e array nello state {/*updating-objects-and-arrays-in-state*/}

Puoi mettere oggetti e array nello state. In React, lo state è considerato di sola lettura, quindi **dovresti *sostituirlo* anziché *mutare* i tuoi oggetti esistenti**. Per esempio, se hai un oggetto `form` nello state, non mutarlo:

```js
// 🚩 Non mutare un oggetto nello state così:
form.firstName = 'Taylor';
```

Invece, sostituisci l'intero oggetto creandone uno nuovo:

```js
// ✅ Sostituisci lo state con un nuovo oggetto
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Leggi [aggiornare oggetti nello state](/learn/updating-objects-in-state) e [aggiornare array nello state](/learn/updating-arrays-in-state) per saperne di più.

<Recipes titleText="Esempi di oggetti e array nello state" titleId="examples-objects">

#### Form (oggetto) {/*form-object*/}

In questo esempio, la variabile di state `form` contiene un oggetto. Ogni input ha un gestore di modifica che chiama `setForm` con il prossimo state dell'intero form. La sintassi spread `{ ...form }` assicura che l'oggetto state venga sostituito anziché mutato.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Form (oggetto annidato) {/*form-nested-object*/}

In questo esempio, lo state è più annidato. Quando aggiorni uno state annidato, devi creare una copia dell'oggetto che stai aggiornando, così come di tutti gli oggetti che lo "contengono" risalendo verso l'alto. Leggi [aggiornare un oggetto annidato](/learn/updating-objects-in-state#updating-a-nested-object) per saperne di più.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### Lista (array) {/*list-array*/}

In questo esempio, la variabile di state `todos` contiene un array. Ogni gestore di pulsante chiama `setTodos` con la prossima versione di quell'array. La sintassi spread `[...todos]`, `todos.map()` e `todos.filter()` assicurano che l'array state venga sostituito anziché mutato.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

Se aggiornare array e oggetti senza mutazione ti sembra tedioso, puoi usare una libreria come [Immer](https://github.com/immerjs/use-immer) per ridurre il codice ripetitivo. Immer ti permette di scrivere codice conciso come se stessi mutando oggetti, ma sotto il cofano esegue aggiornamenti immutabili:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
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
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Sebbene il risultato di `createInitialTodos()` venga usato solo per la renderizzazione iniziale, stai comunque chiamando questa funzione a ogni renderizzazione. Può essere inefficiente se crea array grandi o esegue calcoli costosi.

Per risolvere, puoi **passarla come _funzione di inizializzazione_** a `useState`:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Nota che stai passando `createInitialTodos`, cioè la *funzione stessa*, e non `createInitialTodos()`, che è il risultato della sua chiamata. Se passi una funzione a `useState`, React la chiamerà solo durante l'inizializzazione.

React potrebbe [chiamare le tue funzioni di inizializzazione due volte](#my-initializer-or-updater-function-runs-twice) in development per verificare che siano [pure.](/learn/keeping-components-pure)

<Recipes titleText="La differenza tra passare una funzione di inizializzazione e passare lo state iniziale direttamente" titleId="examples-initializer">

#### Passare la funzione di inizializzazione {/*passing-the-initializer-function*/}

Questo esempio passa la funzione di inizializzazione, quindi la funzione `createInitialTodos` viene eseguita solo durante l'inizializzazione. Non viene eseguita quando il componente si ri-renderizza, ad esempio quando digiti nell'input.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
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

Questo esempio **non** passa la funzione di inizializzazione, quindi la funzione `createInitialTodos` viene eseguita a ogni renderizzazione, ad esempio quando digiti nell'input. Non c'è differenza osservabile nel comportamento, ma questo codice è meno efficiente.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
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

### Reimpostare lo state con una key {/*resetting-state-with-a-key*/}

Incontrerai spesso l'attributo `key` quando [renderizzi liste.](/learn/rendering-lists) Tuttavia, serve anche a un altro scopo.

Puoi **reimpostare lo state di un componente passando una `key` diversa a un componente.** In questo esempio, il pulsante Reset cambia la variabile di state `version`, che passiamo come `key` al `Form`. Quando la `key` cambia, React ricrea il componente `Form` (e tutti i suoi figli) da zero, quindi il suo state viene reimpostato.

Leggi [Preserving and Resetting State](/learn/preserving-and-resetting-state) per saperne di più.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Memorizzare informazioni dalle renderizzazioni precedenti {/*storing-information-from-previous-renders*/}

Di solito, aggiornerai lo state nei gestori di eventi. Tuttavia, in rari casi potresti voler regolare lo state in risposta alla renderizzazione — per esempio, potresti voler cambiare una variabile di state quando una prop cambia.

Nella maggior parte dei casi, non ne hai bisogno:

* **Se il valore di cui hai bisogno può essere calcolato interamente dalle props correnti o da altro state, [rimuovi del tutto quello state ridondante.](/learn/choosing-the-state-structure#avoid-redundant-state)** Se temi di ricalcolare troppo spesso, l'[Hook `useMemo`](/reference/react/useMemo) può aiutare.
* Se vuoi reimpostare lo state dell'intero albero di componenti, [passa una `key` diversa al tuo componente.](#resetting-state-with-a-key)
* Se puoi, aggiorna tutto lo state rilevante nei gestori di eventi.

Nel raro caso in cui nessuna di queste opzioni si applichi, c'è un pattern che puoi usare per aggiornare lo state in base ai valori renderizzati finora, chiamando una funzione `set` mentre il tuo componente è in renderizzazione.

Ecco un esempio. Questo componente `CountLabel` visualizza la prop `count` che gli viene passata:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Supponiamo che tu voglia mostrare se il contatore è *aumentato o diminuito* dall'ultimo cambiamento. La prop `count` non te lo dice — devi tenere traccia del suo valore precedente. Aggiungi la variabile di state `prevCount` per tracciarlo. Aggiungi un'altra variabile di state chiamata `trend` per contenere se il contatore è aumentato o diminuito. Confronta `prevCount` con `count` e, se non sono uguali, aggiorna sia `prevCount` che `trend`. Ora puoi mostrare sia la prop `count` corrente sia *come è cambiata dall'ultima renderizzazione*.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Nota che se chiami una funzione `set` durante la renderizzazione, deve essere all'interno di una condizione come `prevCount !== count`, e deve esserci una chiamata come `setPrevCount(count)` all'interno della condizione. Altrimenti, il tuo componente si ri-renderizzerebbe in un loop finché non crasha. Inoltre, puoi aggiornare lo state solo del componente *attualmente in renderizzazione* in questo modo. Chiamare la funzione `set` di *un altro* componente durante la renderizzazione è un errore. Infine, la tua chiamata a `set` dovrebbe comunque [aggiornare lo state senza mutazione](#updating-objects-and-arrays-in-state) — questo non significa che puoi infrangere le altre regole delle [funzioni pure.](/learn/keeping-components-pure)

Questo pattern può essere difficile da capire ed è di solito meglio evitarlo. Tuttavia, è meglio che aggiornare lo state in un Effetto. Quando chiami la funzione `set` durante la renderizzazione, React ri-renderizzerà quel componente immediatamente dopo che il tuo componente esce con un'istruzione `return`, e prima di renderizzare i figli. In questo modo, i figli non devono renderizzarsi due volte. Il resto della funzione del tuo componente verrà comunque eseguito (e il risultato verrà scartato). Se la tua condizione è sotto tutte le chiamate agli Hook, puoi aggiungere un `return;` anticipato per riavviare la renderizzazione prima.

---

## Troubleshooting {/*troubleshooting*/}

### Ho aggiornato lo state, ma il log mi dà il vecchio valore {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Chiamare la funzione `set` **non cambia lo state nel codice in esecuzione**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Richiede una ri-renderizzazione con 1
  console.log(count);  // Ancora 0!

  setTimeout(() => {
    console.log(count); // Anche 0!
  }, 5000);
}
```

Questo perché [lo state si comporta come un'istantanea.](/learn/state-as-a-snapshot) Aggiornare lo state richiede un'altra renderizzazione con il nuovo valore di state, ma non influisce sulla variabile JavaScript `count` nel gestore di eventi già in esecuzione.

Se devi usare il prossimo state, puoi salvarlo in una variabile prima di passarlo alla funzione `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### Ho aggiornato lo state, ma lo schermo non si aggiorna {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React **ignorerà il tuo aggiornamento se il prossimo state è uguale allo state precedente,** come determinato da un confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Di solito succede quando modifichi direttamente un oggetto o un array nello state:

```js
obj.x = 10;  // 🚩 Sbagliato: mutare un oggetto esistente
setObj(obj); // 🚩 Non fa nulla
```

Hai mutato un oggetto `obj` esistente e l'hai passato di nuovo a `setObj`, quindi React ha ignorato l'aggiornamento. Per correggere, devi assicurarti di [_sostituire_ sempre oggetti e array nello state anziché _mutarli_](#updating-objects-and-arrays-in-state):

```js
// ✅ Corretto: creare un nuovo oggetto
setObj({
  ...obj,
  x: 10
});
```

---

### Ricevo un errore: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Potresti ricevere un errore che dice: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Di solito, significa che stai impostando incondizionatamente lo state *durante la renderizzazione*, quindi il tuo componente entra in un loop: renderizzazione, impostazione dello state (che causa una renderizzazione), renderizzazione, impostazione dello state (che causa una renderizzazione), e così via. Molto spesso, questo è causato da un errore nella specifica di un gestore di eventi:

```js {1-2}
// 🚩 Sbagliato: chiama il gestore durante la renderizzazione
return <button onClick={handleClick()}>Click me</button>

// ✅ Corretto: passa il gestore di eventi
return <button onClick={handleClick}>Click me</button>

// ✅ Corretto: passa una funzione inline
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Se non riesci a trovare la causa di questo errore, clicca sulla freccia accanto all'errore nella console e scorri lo stack JavaScript per trovare la specifica chiamata alla funzione `set` responsabile dell'errore.

---

### La mia funzione di inizializzazione o di aggiornamento dello state viene eseguita due volte {/*my-initializer-or-updater-function-runs-twice*/}

In [Strict Mode](/reference/react/StrictMode), React chiamerà alcune delle tue funzioni due volte anziché una:

```js {2,5-6,11-12}
function TodoList() {
  // Questa funzione del componente verrà eseguita due volte per ogni renderizzazione.

  const [todos, setTodos] = useState(() => {
    // Questa funzione di inizializzazione verrà eseguita due volte durante l'inizializzazione.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // Questa funzione di aggiornamento dello state verrà eseguita due volte per ogni click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

Questo è previsto e non dovrebbe rompere il tuo codice.

Questo comportamento **solo in development** ti aiuta a [mantenere i componenti puri.](/learn/keeping-components-pure) React usa il risultato di una delle chiamate e ignora il risultato dell'altra chiamata. Finché il tuo componente, le funzioni di inizializzazione e di aggiornamento dello state sono pure, non dovrebbe influire sulla tua logica. Tuttavia, se sono accidentalmente impure, questo ti aiuta a notare gli errori.

Per esempio, questa funzione di aggiornamento dello state impura muta un array nello state:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Errore: mutare lo state
  prevTodos.push(createTodo());
});
```

Poiché React chiama la tua funzione di aggiornamento dello state due volte, vedrai che il todo è stato aggiunto due volte, quindi saprai che c'è un errore. In questo esempio, puoi correggere l'errore [sostituendo l'array anziché mutarlo](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Corretto: sostituire con un nuovo state
  return [...prevTodos, createTodo()];
});
```

Ora che questa funzione di aggiornamento dello state è pura, chiamarla una volta in più non fa differenza nel comportamento. Ecco perché React chiamarla due volte ti aiuta a trovare gli errori. **Solo le funzioni del componente, di inizializzazione e di aggiornamento dello state devono essere pure.** I gestori di eventi non devono essere puri, quindi React non chiamerà mai i tuoi gestori di eventi due volte.

Leggi [mantenere i componenti puri](/learn/keeping-components-pure) per saperne di più.

---

### Sto cercando di impostare lo state su una funzione, ma viene chiamata {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Non puoi mettere una funzione nello state così:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Poiché stai passando una funzione, React assume che `someFunction` sia una [funzione di inizializzazione](#avoiding-recreating-the-initial-state) e che `someOtherFunction` sia una [funzione di aggiornamento dello state](#updating-state-based-on-the-previous-state), quindi prova a chiamarle e memorizzare il risultato. Per *memorizzare* effettivamente una funzione, devi mettere `() =>` prima di entrambe. Allora React memorizzerà le funzioni che passi.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
