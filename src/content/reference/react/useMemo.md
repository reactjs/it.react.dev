---
title: useMemo
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useMemo.md).

</Note>

<Intro>

`useMemo` è un Hook React che ti permette di memorizzare nella cache il risultato di un calcolo tra le ri-renderizzazioni.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) memorizza automaticamente valori e funzioni, riducendo la necessità di chiamate manuali a `useMemo`. Puoi usare il compiler per gestire la memorizzazione automaticamente.

</Note>

<InlineToc />

---

## Reference {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Chiama `useMemo` al top level del tuo componente per memorizzare nella cache un calcolo tra le ri-renderizzazioni:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `calculateValue`: La funzione che calcola il valore che vuoi memorizzare nella cache. Deve essere pura, non deve accettare argomenti e deve restituire un valore di qualsiasi tipo. React chiamerà la tua funzione durante la renderizzazione iniziale. Nelle renderizzazioni successive, React restituirà di nuovo lo stesso valore se le `dependencies` non sono cambiate dall'ultima renderizzazione. Altrimenti, chiamerà `calculateValue`, restituirà il suo risultato e lo memorizzerà così può essere riutilizzato in seguito.

* `dependencies`: L'elenco di tutti i valori reattivi referenziati all'interno del codice di `calculateValue`. I valori reattivi includono props, state e tutte le variabili e funzioni dichiarate direttamente nel corpo del componente. Se il tuo linter è [configurato per React](/learn/editor-setup#linting), verificherà che ogni valore reattivo sia specificato correttamente come dipendenza. L'elenco delle dipendenze deve avere un numero costante di elementi ed essere scritto inline come `[dep1, dep2, dep3]`. React confronterà ogni dipendenza con il suo valore precedente usando il confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Returns {/*returns*/}

Nella renderizzazione iniziale, `useMemo` restituisce il risultato della chiamata a `calculateValue` senza argomenti.

Nelle renderizzazioni successive, restituirà un valore già memorizzato dall'ultima renderizzazione (se le dipendenze non sono cambiate), oppure chiamerà di nuovo `calculateValue` e restituirà il risultato che `calculateValue` ha restituito.

#### Caveats {/*caveats*/}

* `useMemo` è un Hook, quindi puoi chiamarlo **solo al top level del tuo componente** o dei tuoi Hook. Non puoi chiamarlo all'interno di loop o condizioni. Se ne hai bisogno, estrai un nuovo componente e sposta lo state al suo interno.
* Quando Strict Mode è attivo, React **chiamerà la tua funzione di calcolo due volte** per [aiutarti a trovare impurità accidentali.](#my-calculation-runs-twice-on-every-re-render) Questo è un comportamento solo in development e non influisce sulla production. Se la tua funzione di calcolo è pura (come dovrebbe essere), non dovrebbe influire sulla tua logica. Il risultato di una delle chiamate verrà ignorato.
* React **non scarterà il valore memorizzato nella cache a meno che non ci sia una ragione specifica per farlo.** Per esempio, in development, React scarta la cache quando modifichi il file del componente. Sia in development che in production, React scarterà la cache se il componente sospende durante il mount iniziale. In futuro, React potrebbe aggiungere altre funzionalità che sfruttano lo scarto della cache — per esempio, se React aggiungesse supporto integrato per liste virtualizzate in futuro, avrebbe senso scartare la cache per gli elementi che escono dal viewport di una tabella virtualizzata. Questo dovrebbe andare bene se ti affidi a `useMemo` solo come ottimizzazione delle prestazioni. Altrimenti, una [variabile di state](/reference/react/useState#avoiding-recreating-the-initial-state) o un [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) potrebbero essere più appropriati.

<Note>

Memorizzare nella cache valori di ritorno come questo è anche noto come [*memoization*](https://it.wikipedia.org/wiki/Memoizzazione), ed è per questo che questo Hook si chiama `useMemo`.

</Note>

---

## Usage {/*usage*/}

### Saltare calcoli costosi {/*skipping-expensive-recalculations*/}

Per memorizzare nella cache un calcolo tra le ri-renderizzazioni, avvolgilo in una chiamata a `useMemo` al top level del tuo componente:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Devi passare due cose a `useMemo`:

1. Una <CodeStep step={1}>funzione di calcolo</CodeStep> che non accetta argomenti, come `() =>`, e restituisce ciò che volevi calcolare.
2. Un <CodeStep step={2}>elenco di dipendenze</CodeStep> che include ogni valore all'interno del componente usato nel calcolo.

Nella renderizzazione iniziale, il <CodeStep step={3}>valore</CodeStep> che otterrai da `useMemo` sarà il risultato della chiamata alla tua <CodeStep step={1}>funzione di calcolo</CodeStep>.

In ogni renderizzazione successiva, React confronterà le <CodeStep step={2}>dipendenze</CodeStep> con le dipendenze che hai passato durante la renderizzazione precedente. Se nessuna delle dipendenze è cambiata (rispetto a [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` restituirà il valore che hai già calcolato in precedenza. Altrimenti, React rieseguirà il calcolo e restituirà il nuovo valore.

In altre parole, `useMemo` memorizza nella cache il risultato di un calcolo tra le ri-renderizzazioni finché le sue dipendenze non cambiano.

**Vediamo un esempio per capire quando questo è utile.**

Per impostazione predefinita, React riesegue l'intero corpo del componente ogni volta che viene ri-renderizzato. Per esempio, se questo `TodoList` aggiorna il proprio state o riceve nuove props dal genitore, la funzione `filterTodos` verrà rieseguita:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Di solito, non è un problema perché la maggior parte dei calcoli è molto veloce. Tuttavia, se stai filtrando o trasformando un array grande, o eseguendo un calcolo costoso, potresti voler evitare di rifarlo se i dati non sono cambiati. Se sia `todos` che `tab` sono gli stessi dell'ultima renderizzazione, avvolgere il calcolo in `useMemo` come prima ti permette di riutilizzare `visibleTodos` che hai già calcolato in precedenza.

Questo tipo di memorizzazione nella cache è chiamato *[memoization.](https://it.wikipedia.org/wiki/Memoizzazione)*

<Note>

**Dovresti affidarti a `useMemo` solo come ottimizzazione delle prestazioni.** Se il tuo codice non funziona senza di esso, trova il problema sottostante e risolvilo prima. Poi potrai aggiungere `useMemo` per migliorare le prestazioni.

</Note>

<DeepDive>

#### Come capire se un calcolo è costoso? {/*how-to-tell-if-a-calculation-is-expensive*/}

In generale, a meno che tu non stia creando o iterando su migliaia di oggetti, probabilmente non è costoso. Se vuoi maggiore sicurezza, puoi aggiungere un log in console per misurare il tempo impiegato in un pezzo di codice:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Esegui l'interazione che stai misurando (per esempio, digitare nell'input). Vedrai poi log come `filter array: 0.15ms` nella console. Se il tempo totale registrato somma a una quantità significativa (diciamo, `1ms` o più), potrebbe avere senso memorizzare quel calcolo. Come esperimento, puoi poi avvolgere il calcolo in `useMemo` per verificare se il tempo totale registrato è diminuito per quell'interazione o no:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Saltato se todos e tab non sono cambiati
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` non farà più veloce la *prima* renderizzazione. Aiuta solo a saltare lavoro non necessario durante gli aggiornamenti.

Tieni presente che la tua macchina è probabilmente più veloce di quella dei tuoi utenti, quindi è una buona idea testare le prestazioni con un rallentamento artificiale. Per esempio, Chrome offre un'opzione [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) per questo.

Nota anche che misurare le prestazioni in development non ti darà i risultati più accurati. (Per esempio, quando [Strict Mode](/reference/react/StrictMode) è attivo, vedrai ogni componente renderizzarsi due volte invece che una.) Per ottenere tempi più accurati, esegui il build dell'app per production e testala su un dispositivo simile a quelli dei tuoi utenti.

</DeepDive>

<DeepDive>

#### Dovresti aggiungere useMemo ovunque? {/*should-you-add-usememo-everywhere*/}

Se la tua app è come questo sito, e la maggior parte delle interazioni è grossolana (come sostituire una pagina o un'intera sezione), la memorizzazione di solito non è necessaria. D'altra parte, se la tua app è più simile a un editor di disegni, e la maggior parte delle interazioni è granulare (come spostare forme), potresti trovare la memorizzazione molto utile.

Ottimizzare con `useMemo` è utile solo in pochi casi:

- Il calcolo che metti in `useMemo` è visibilmente lento, e le sue dipendenze cambiano raramente.
- Lo passi come prop a un componente avvolto in [`memo`.](/reference/react/memo) Vuoi saltare la ri-renderizzazione se il valore non è cambiato. La memorizzazione permette al componente di ri-renderizzarsi solo quando le dipendenze non sono le stesse.
- Il valore che passi viene poi usato come dipendenza di qualche Hook. Per esempio, forse un altro valore di calcolo `useMemo` dipende da esso. Oppure dipendi da questo valore da [`useEffect.`](/reference/react/useEffect)

Non c'è alcun beneficio nell'avvolgere un calcolo in `useMemo` in altri casi. Non c'è nemmeno un danno significativo nel farlo, quindi alcuni team scelgono di non pensare ai singoli casi e memorizzare il più possibile. Lo svantaggio è che il codice diventa meno leggibile. Inoltre, non tutta la memorizzazione è efficace: un singolo valore che è "sempre nuovo" basta a rompere la memorizzazione per un intero componente.

**In pratica, puoi evitare molta memorizzazione seguendo alcuni principi:**

1. Quando un componente avvolge visivamente altri componenti, lascia che [accetti JSX come children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Poi, se il componente wrapper aggiorna il proprio state, React sa che i suoi figli non hanno bisogno di ri-renderizzarsi.
1. Preferisci lo state locale e non [sollevare lo state](/learn/sharing-state-between-components) più in alto del necessario. Non tenere state transitorio come form e se un elemento è in hover in cima all'albero o in una libreria di state globale.
1. Mantieni la tua [logica di rendering pura.](/learn/keeping-components-pure) Se ri-renderizzare un componente causa un problema o produce qualche artefatto visivo evidente, è un bug nel componente! Correggi il bug invece di aggiungere memorizzazione.
1. Evita [Effetti non necessari che aggiornano lo state.](/learn/you-might-not-need-an-effect) La maggior parte dei problemi di prestazioni nelle app React è causata da catene di aggiornamenti originati da Effetti che fanno renderizzare i componenti più e più volte.
1. Prova a [rimuovere dipendenze non necessarie dai tuoi Effetti.](/learn/removing-effect-dependencies) Per esempio, invece della memorizzazione, spesso è più semplice spostare un oggetto o una funzione all'interno di un Effetto o fuori dal componente.

Se un'interazione specifica sembra ancora lenta, [usa il profiler di React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) per vedere quali componenti beneficiano di più dalla memorizzazione, e aggiungi memorizzazione dove serve. Questi principi facilitano il debug e la comprensione dei componenti, quindi conviene seguirli comunque. A lungo termine, stiamo ricercando [come fare memorizzazione granulare automaticamente](https://www.youtube.com/watch?v=lGEMwh32soc) per risolvere il problema una volta per tutte.

</DeepDive>

<Recipes titleText="La differenza tra useMemo e calcolare un valore direttamente" titleId="examples-recalculation">

#### Saltare il ricalcolo con `useMemo` {/*skipping-recalculation-with-usememo*/}

In questo esempio, l'implementazione di `filterTodos` è **artificialmente rallentata** così puoi vedere cosa succede quando una funzione JavaScript che chiami durante il rendering è genuinamente lenta. Prova a cambiare tab e a attivare/disattivare il tema.

Cambiare tab sembra lento perché forza `filterTodos` rallentato a rieseguirsi. È previsto, perché `tab` è cambiato e quindi l'intero calcolo *deve* rieseguirsi. (Se ti chiedi perché viene eseguito due volte, è spiegato [qui.](#my-calculation-runs-twice-on-every-re-render))

Attiva/disattiva il tema. **Grazie a `useMemo`, è veloce nonostante il rallentamento artificiale!** La chiamata lenta a `filterTodos` è stata saltata perché sia `todos` che `tab` (che passi come dipendenze a `useMemo`) non sono cambiati dall'ultima renderizzazione.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modalità scura
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Nota: <code>filterTodos</code> è artificialmente rallentato!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Non fare nulla per 500 ms per emulare codice estremamente lento
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Ricalcolare sempre un valore {/*always-recalculating-a-value*/}

In questo esempio, l'implementazione di `filterTodos` è anche **artificialmente rallentata** così puoi vedere cosa succede quando una funzione JavaScript che chiami durante il rendering è genuinamente lenta. Prova a cambiare tab e a attivare/disattivare il tema.

A differenza dell'esempio precedente, attivare/disattivare il tema è lento anche ora! Questo perché **non c'è una chiamata a `useMemo` in questa versione,** quindi `filterTodos` artificialmente rallentato viene chiamato a ogni ri-renderizzazione. Viene chiamato anche se solo `theme` è cambiato.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modalità scura
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Nota: <code>filterTodos</code> è artificialmente rallentato!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Non fare nulla per 500 ms per emulare codice estremamente lento
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Ecco però lo stesso codice **con il rallentamento artificiale rimosso.** La mancanza di `useMemo` si nota o no?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modalità scura
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Spesso, il codice senza memorizzazione funziona bene. Se le tue interazioni sono abbastanza veloci, potresti non aver bisogno di memorizzazione.

Puoi provare ad aumentare il numero di todo in `utils.js` e vedere come cambia il comportamento. Questo calcolo in particolare non era molto costoso all'inizio, ma se il numero di todo cresce significativamente, la maggior parte dell'overhead sarà nella ri-renderizzazione piuttosto che nel filtraggio. Continua a leggere sotto per vedere come ottimizzare la ri-renderizzazione con `useMemo`.

<Solution />

</Recipes>

---

### Saltare la ri-renderizzazione dei componenti {/*skipping-re-rendering-of-components*/}

In alcuni casi, `useMemo` può anche aiutarti a ottimizzare le prestazioni della ri-renderizzazione dei componenti figli. Per illustrarlo, supponiamo che questo componente `TodoList` passi `visibleTodos` come prop al componente figlio `List`:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

Hai notato che attivare/disattivare la prop `theme` blocca l'app per un momento, ma se rimuovi `<List />` dal JSX, sembra veloce. Questo ti dice che vale la pena provare a ottimizzare il componente `List`.

**Per impostazione predefinita, quando un componente viene ri-renderizzato, React ri-renderizza ricorsivamente tutti i suoi figli.** Ecco perché, quando `TodoList` viene ri-renderizzato con un `theme` diverso, anche il componente `List` viene ri-renderizzato. Va bene per componenti che non richiedono molto calcolo per la ri-renderizzazione. Ma se hai verificato che una ri-renderizzazione è lenta, puoi dire a `List` di saltare la ri-renderizzazione quando le sue props sono le stesse dell'ultima renderizzazione avvolgendolo in [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Con questa modifica, `List` salterà la ri-renderizzazione se tutte le sue props sono le *stesse* dell'ultima renderizzazione.** È qui che memorizzare nella cache il calcolo diventa importante! Immagina di aver calcolato `visibleTodos` senza `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Ogni volta che theme cambia, questo sarà un array diverso...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... quindi le props di List non saranno mai le stesse, e si ri-renderizzerà ogni volta */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**Nell'esempio sopra, la funzione `filterTodos` crea sempre un array *diverso*,** simile a come il letterale oggetto `{}` crea sempre un nuovo oggetto. Normalmente, non sarebbe un problema, ma significa che le props di `List` non saranno mai le stesse, e la tua ottimizzazione con [`memo`](/reference/react/memo) non funzionerà. È qui che `useMemo` torna utile:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Dì a React di memorizzare nella cache il calcolo tra le ri-renderizzazioni...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...finché queste dipendenze non cambiano...
  );
  return (
    <div className={theme}>
      {/* ...List riceverà le stesse props e potrà saltare la ri-renderizzazione */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**Avvolgendo il calcolo di `visibleTodos` in `useMemo`, ti assicuri che abbia lo *stesso* valore tra le ri-renderizzazioni** (finché le dipendenze non cambiano). Non *devi* avvolgere un calcolo in `useMemo` a meno che non lo faccia per una ragione specifica. In questo esempio, la ragione è che lo passi a un componente avvolto in [`memo`,](/reference/react/memo) e questo gli permette di saltare la ri-renderizzazione. Ci sono altre ragioni per aggiungere `useMemo`, descritte più avanti in questa pagina.

<DeepDive>

#### Memorizzare singoli nodi JSX {/*memoizing-individual-jsx-nodes*/}

Invece di avvolgere `List` in [`memo`](/reference/react/memo), potresti avvolgere il nodo JSX `<List />` stesso in `useMemo`:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

Il comportamento sarebbe lo stesso. Se `visibleTodos` non sono cambiati, `List` non verrà ri-renderizzato.

Un nodo JSX come `<List items={visibleTodos} />` è un oggetto come `{ type: List, props: { items: visibleTodos } }`. Creare questo oggetto è molto economico, ma React non sa se il suo contenuto è lo stesso dell'ultima volta o no. Ecco perché, per impostazione predefinita, React ri-renderizzerà il componente `List`.

Tuttavia, se React vede lo stesso identico JSX della renderizzazione precedente, non proverà a ri-renderizzare il componente. Questo perché i nodi JSX sono [immutabili.](https://it.wikipedia.org/wiki/Oggetto_immutabile) Un oggetto nodo JSX non può essere cambiato nel tempo, quindi React sa che è sicuro saltare una ri-renderizzazione. Tuttavia, perché funzioni, il nodo deve *essere effettivamente lo stesso oggetto*, non solo sembrare uguale nel codice. Questo è ciò che fa `useMemo` in questo esempio.

Avvolgere manualmente nodi JSX in `useMemo` non è comodo. Per esempio, non puoi farlo condizionalmente. Di solito è per questo che avvolgi i componenti con [`memo`](/reference/react/memo) invece di avvolgere nodi JSX.

</DeepDive>

<Recipes titleText="La differenza tra saltare le ri-renderizzazioni e ri-renderizzare sempre" titleId="examples-rerendering">

#### Saltare la ri-renderizzazione con `useMemo` e `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

In questo esempio, il componente `List` è **artificialmente rallentato** così puoi vedere cosa succede quando un componente React che stai renderizzando è genuinamente lento. Prova a cambiare tab e a attivare/disattivare il tema.

Cambiare tab sembra lento perché forza `List` rallentato a ri-renderizzarsi. È previsto, perché `tab` è cambiato e devi riflettere la nuova scelta dell'utente sullo schermo.

Poi, prova ad attivare/disattivare il tema. **Grazie a `useMemo` insieme a [`memo`](/reference/react/memo), è veloce nonostante il rallentamento artificiale!** `List` ha saltato la ri-renderizzazione perché l'array `visibleTodos` non è cambiato dall'ultima renderizzazione. L'array `visibleTodos` non è cambiato perché sia `todos` che `tab` (che passi come dipendenze a `useMemo`) non sono cambiati dall'ultima renderizzazione.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modalità scura
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Nota: <code>List</code> è artificialmente rallentato!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Non fare nulla per 500 ms per emulare codice estremamente lento
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Ri-renderizzare sempre un componente {/*always-re-rendering-a-component*/}

In questo esempio, l'implementazione di `List` è anche **artificialmente rallentata** così puoi vedere cosa succede quando un componente React che stai renderizzando è genuinamente lento. Prova a cambiare tab e a attivare/disattivare il tema.

A differenza dell'esempio precedente, attivare/disattivare il tema è lento anche ora! Questo perché **non c'è una chiamata a `useMemo` in questa versione,** quindi `visibleTodos` è sempre un array diverso, e il componente `List` rallentato non può saltare la ri-renderizzazione.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modalità scura
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Nota: <code>List</code> è artificialmente rallentato!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Non fare nulla per 500 ms per emulare codice estremamente lento
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Ecco però lo stesso codice **con il rallentamento artificiale rimosso.** La mancanza di `useMemo` si nota o no?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modalità scura
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Spesso, il codice senza memorizzazione funziona bene. Se le tue interazioni sono abbastanza veloci, non hai bisogno di memorizzazione.

Tieni presente che devi eseguire React in modalità production, disabilitare [React Developer Tools](/learn/react-developer-tools) e usare dispositivi simili a quelli dei tuoi utenti per avere un'idea realistica di cosa rallenta effettivamente la tua app.

<Solution />

</Recipes>

---

### Impedire a un Effetto di attivarsi troppo spesso {/*preventing-an-effect-from-firing-too-often*/}

A volte, potresti voler usare un valore all'interno di un [Effetto:](/learn/synchronizing-with-effects)

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Questo crea un problema. [Ogni valore reattivo deve essere dichiarato come dipendenza del tuo Effetto.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Tuttavia, se dichiari `options` come dipendenza, causerà al tuo Effetto di riconnettersi costantemente alla chat room:


```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Problema: questa dipendenza cambia a ogni renderizzazione
  // ...
```

Per risolvere, puoi avvolgere l'oggetto che devi usare da un Effetto in `useMemo`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Cambia solo quando roomId cambia

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Cambia solo quando options cambia
  // ...
```

Questo garantisce che l'oggetto `options` sia lo stesso tra le ri-renderizzazioni se `useMemo` restituisce l'oggetto memorizzato nella cache.

Tuttavia, poiché `useMemo` è un'ottimizzazione delle prestazioni, non una garanzia semantica, React potrebbe scartare il valore memorizzato nella cache se [c'è una ragione specifica per farlo](#caveats). Questo causerà anche la riattivazione dell'Effetto, **quindi è ancora meglio eliminare la necessità di una dipendenza oggetto** spostando l'oggetto *all'interno* dell'Effetto:

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ Nessun bisogno di useMemo o dipendenze oggetto!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Cambia solo quando roomId cambia
  // ...
```

Ora il tuo codice è più semplice e non ha bisogno di `useMemo`. [Scopri di più sulla rimozione delle dipendenze degli Effetti.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)


### Memorizzare una dipendenza di un altro Hook {/*memoizing-a-dependency-of-another-hook*/}

Supponiamo di avere un calcolo che dipende da un oggetto creato direttamente nel corpo del componente:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Attenzione: dipendenza da un oggetto creato nel corpo del componente
  // ...
```

Dipendere da un oggetto come questo vanifica lo scopo della memorizzazione. Quando un componente viene ri-renderizzato, tutto il codice direttamente nel corpo del componente viene rieseguito. **Le righe di codice che creano l'oggetto `searchOptions` verranno rieseguite a ogni ri-renderizzazione.** Poiché `searchOptions` è una dipendenza della tua chiamata a `useMemo`, ed è diverso ogni volta, React sa che le dipendenze sono diverse e ricalcola `searchItems` ogni volta.

Per correggere, potresti memorizzare l'oggetto `searchOptions` *stesso* prima di passarlo come dipendenza:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Cambia solo quando text cambia

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Cambia solo quando allItems o searchOptions cambiano
  // ...
```

Nell'esempio sopra, se `text` non è cambiato, anche l'oggetto `searchOptions` non cambierà. Tuttavia, una correzione ancora migliore è spostare la dichiarazione dell'oggetto `searchOptions` *all'interno* della funzione di calcolo di `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Cambia solo quando allItems o text cambiano
  // ...
```

Ora il tuo calcolo dipende da `text` direttamente (che è una stringa e non può "accidentalmente" diventare diversa).

---

### Memorizzare una funzione {/*memoizing-a-function*/}

Supponiamo che il componente `Form` sia avvolto in [`memo`.](/reference/react/memo) Vuoi passargli una funzione come prop:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

Proprio come `{}` crea un oggetto diverso, dichiarazioni di funzione come `function() {}` ed espressioni come `() => {}` producono una funzione *diversa* a ogni ri-renderizzazione. Di per sé, creare una nuova funzione non è un problema. Non è qualcosa da evitare! Tuttavia, se il componente `Form` è memorizzato, presumibilmente vuoi saltare la sua ri-renderizzazione quando nessuna prop è cambiata. Una prop che è *sempre* diversa vanificherebbe lo scopo della memorizzazione.

Per memorizzare una funzione con `useMemo`, la tua funzione di calcolo dovrebbe restituire un'altra funzione:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Sembra goffo! **Memorizzare funzioni è abbastanza comune da avere un Hook integrato appositamente. Avvolgi le tue funzioni in [`useCallback`](/reference/react/useCallback) invece di `useMemo`** per evitare di scrivere una funzione annidata extra:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

I due esempi sopra sono completamente equivalenti. L'unico vantaggio di `useCallback` è che ti permette di evitare di scrivere una funzione annidata extra. Non fa nient'altro. [Leggi di più su `useCallback`.](/reference/react/useCallback)

---

## Troubleshooting {/*troubleshooting*/}

### Il mio calcolo viene eseguito due volte a ogni ri-renderizzazione {/*my-calculation-runs-twice-on-every-re-render*/}

In [Strict Mode](/reference/react/StrictMode), React chiamerà alcune delle tue funzioni due volte invece che una:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Questa funzione componente verrà eseguita due volte per ogni renderizzazione.

  const visibleTodos = useMemo(() => {
    // Questo calcolo verrà eseguito due volte se una delle dipendenze cambia.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

È previsto e non dovrebbe rompere il tuo codice.

Questo comportamento **solo in development** ti aiuta a [mantenere i componenti puri.](/learn/keeping-components-pure) React usa il risultato di una delle chiamate e ignora il risultato dell'altra chiamata. Finché il componente e le funzioni di calcolo sono puri, non dovrebbe influire sulla tua logica. Tuttavia, se sono accidentalmente impuri, questo ti aiuta a notare e correggere l'errore.

Per esempio, questa funzione di calcolo impura muta un array che hai ricevuto come prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Errore: mutare una prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React chiama la tua funzione due volte, quindi noteresti che il todo viene aggiunto due volte. Il calcolo non dovrebbe modificare oggetti esistenti, ma va bene modificare oggetti *nuovi* creati durante il calcolo. Per esempio, se la funzione `filterTodos` restituisce sempre un array *diverso*, puoi mutare *quell'*array:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Corretto: mutare un oggetto creato durante il calcolo
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Leggi [mantenere i componenti puri](/learn/keeping-components-pure) per saperne di più sulla purezza.

Inoltre, consulta le guide su [aggiornare oggetti](/learn/updating-objects-in-state) e [aggiornare array](/learn/updating-arrays-in-state) senza mutazione.

---

### La mia chiamata a `useMemo` dovrebbe restituire un oggetto, ma restituisce undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Questo codice non funziona:

```js {1-2,5}
  // 🔴 Non puoi restituire un oggetto da una arrow function con () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

In JavaScript, `() => {` avvia il corpo della arrow function, quindi la parentesi graffa `{` non fa parte del tuo oggetto. Ecco perché non restituisce un oggetto e porta a errori. Potresti correggerlo aggiungendo parentesi come `({` e `})`:

```js {1-2,5}
  // Funziona, ma è facile che qualcuno lo rompa di nuovo
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

Tuttavia, è ancora confuso e troppo facile che qualcuno lo rompa rimuovendo le parentesi.

Per evitare questo errore, scrivi esplicitamente un'istruzione `return`:

```js {1-3,6-7}
  // ✅ Funziona ed è esplicito
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Ogni volta che il mio componente si renderizza, il calcolo in `useMemo` viene rieseguito {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Assicurati di aver specificato l'array di dipendenze come secondo argomento!

Se dimentichi l'array di dipendenze, `useMemo` rieseguirà il calcolo ogni volta:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Ricalcola ogni volta: nessun array di dipendenze
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Questa è la versione corretta che passa l'array di dipendenze come secondo argomento:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Non ricalcola inutilmente
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Se questo non aiuta, il problema è che almeno una delle tue dipendenze è diversa dalla renderizzazione precedente. Puoi debuggare il problema registrando manualmente le dipendenze in console:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Puoi poi fare clic destro sugli array da ri-renderizzazioni diverse nella console e selezionare "Store as a global variable" per entrambi. Supponendo che il primo sia stato salvato come `temp1` e il secondo come `temp2`, puoi usare la console del browser per verificare se ogni dipendenza in entrambi gli array è la stessa:

```js
Object.is(temp1[0], temp2[0]); // La prima dipendenza è la stessa tra gli array?
Object.is(temp1[1], temp2[1]); // La seconda dipendenza è la stessa tra gli array?
Object.is(temp1[2], temp2[2]); // ... e così via per ogni dipendenza ...
```

Quando trovi quale dipendenza rompe la memorizzazione, trova un modo per rimuoverla, oppure [memorizzala anche.](#memoizing-a-dependency-of-another-hook)

---

### Devo chiamare `useMemo` per ogni elemento di una lista in un loop, ma non è permesso {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Supponiamo che il componente `Chart` sia avvolto in [`memo`](/reference/react/memo). Vuoi saltare la ri-renderizzazione di ogni `Chart` nella lista quando il componente `ReportList` viene ri-renderizzato. Tuttavia, non puoi chiamare `useMemo` in un loop:

```js {expectedErrors: {'react-compiler': [6]}} {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Non puoi chiamare useMemo in un loop così:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

Invece, estrai un componente per ogni elemento e memorizza i dati per i singoli elementi:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Chiama useMemo al top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

In alternativa, potresti rimuovere `useMemo` e avvolgere `Report` stesso in [`memo`.](/reference/react/memo) Se la prop `item` non cambia, `Report` salterà la ri-renderizzazione, quindi anche `Chart` salterà la ri-renderizzazione:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
