---
title: memo
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/memo.md).

</Note>

<Intro>

`memo` ti permette di saltare la ri-renderizzazione di un componente quando le sue props non sono cambiate.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) applica automaticamente l'equivalente di `memo` a tutti i componenti, riducendo la necessità di memorizzazione manuale. Puoi usare il compiler per gestire automaticamente la memorizzazione dei componenti.

</Note>

<InlineToc />

---

## Reference {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Avvolgi un componente in `memo` per ottenere una versione *memorizzata* di quel componente. Questa versione memorizzata del tuo componente di solito non verrà ri-renderizzata quando il componente genitore viene ri-renderizzato, finché le sue props non sono cambiate. Ma React potrebbe comunque ri-renderizzarlo: la memorizzazione è un'ottimizzazione delle prestazioni, non una garanzia.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `Component`: Il componente che vuoi memorizzare. `memo` non modifica questo componente, ma restituisce al suo posto un nuovo componente memorizzato. È accettato qualsiasi componente React valido, incluse funzioni e componenti [`forwardRef`](/reference/react/forwardRef).

* **optional** `arePropsEqual`: Una funzione che accetta due argomenti: le props precedenti del componente e le sue nuove props. Dovrebbe restituire `true` se le props vecchie e nuove sono uguali: cioè, se il componente renderizzerà lo stesso output e si comporterà allo stesso modo con le nuove props come con le vecchie. Altrimenti dovrebbe restituire `false`. Di solito non specificherai questa funzione. Per impostazione predefinita, React confronterà ogni prop con [`Object.is`.](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

#### Returns {/*returns*/}

`memo` restituisce un nuovo componente React. Si comporta come il componente passato a `memo`, tranne che React non lo ri-renderizzerà sempre quando il genitore viene ri-renderizzato, a meno che le sue props non siano cambiate.

---

## Usage {/*usage*/}

### Saltare la ri-renderizzazione quando le props non cambiano {/*skipping-re-rendering-when-props-are-unchanged*/}

Di norma React ri-renderizza un componente ogni volta che il genitore viene ri-renderizzato. Con `memo`, puoi creare un componente che React non ri-renderizzerà quando il genitore viene ri-renderizzato, purché le nuove props siano le stesse delle vecchie. Un componente del genere si dice *memorizzato*.

Per memorizzare un componente, avvolgilo in `memo` e usa il valore che restituisce al posto del componente originale:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

Un componente React dovrebbe sempre avere [logica di renderizzazione pura.](/learn/keeping-components-pure) Ciò significa che deve restituire lo stesso output se props, state e context non sono cambiati. Usando `memo`, stai dicendo a React che il tuo componente rispetta questo requisito, quindi React non ha bisogno di ri-renderizzarlo finché le sue props non sono cambiate. Anche con `memo`, il tuo componente verrà ri-renderizzato se cambia il suo state o se cambia un context che sta usando.

In questo esempio, nota che il componente `Greeting` viene ri-renderizzato ogni volta che `name` cambia (perché è una delle sue props), ma non quando cambia `address` (perché non viene passato a `Greeting` come prop):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nome{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Indirizzo{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**Dovresti usare `memo` solo come ottimizzazione delle prestazioni.** Se il tuo codice non funziona senza di esso, trova prima il problema sottostante e risolvilo. Poi potrai aggiungere `memo` per migliorare le prestazioni.

</Note>

<DeepDive>

#### Dovresti aggiungere memo ovunque? {/*should-you-add-memo-everywhere*/}

Se la tua app è come questo sito, e la maggior parte delle interazioni è grossolana (come sostituire una pagina o un'intera sezione), la memorizzazione di solito non è necessaria. D'altra parte, se la tua app è più simile a un editor di disegno, e la maggior parte delle interazioni è granulare (come spostare forme), potresti trovare la memorizzazione molto utile.

Ottimizzare con `memo` ha valore solo quando il tuo componente viene ri-renderizzato spesso con le stesse identiche props, e la sua logica di ri-renderizzazione è costosa. Se non c'è lag percettibile quando il tuo componente viene ri-renderizzato, `memo` non è necessario. Tieni presente che `memo` è completamente inutile se le props passate al tuo componente sono *sempre diverse,* ad esempio se passi un oggetto o una funzione semplice definita durante la renderizzazione. Per questo motivo spesso avrai bisogno di [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) e [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) insieme a `memo`.

Non c'è alcun beneficio nell'avvolgere un componente in `memo` in altri casi. Non c'è nemmeno un danno significativo nel farlo, quindi alcuni team scelgono di non pensare ai casi individuali e di memorizzare il più possibile. Lo svantaggio di questo approccio è che il codice diventa meno leggibile. Inoltre, non tutta la memorizzazione è efficace: un singolo valore che è "sempre nuovo" basta a rompere la memorizzazione per un intero componente.

**In pratica, puoi evitare molta memorizzazione seguendo alcuni principi:**

1. Quando un componente avvolge visivamente altri componenti, [accetta JSX come children.](/learn/passing-props-to-a-component#passing-jsx-as-children) In questo modo, quando il componente wrapper aggiorna il proprio state, React sa che i suoi figli non hanno bisogno di ri-renderizzarsi.
1. Preferisci lo state locale e non [sollevare lo state](/learn/sharing-state-between-components) più in alto del necessario. Per esempio, non tenere lo state transitorio come form e se un elemento è in hover in cima all'albero o in una libreria di state globale.
1. Mantieni la tua [logica di renderizzazione pura.](/learn/keeping-components-pure) Se ri-renderizzare un componente causa un problema o produce un artefatto visivo evidente, è un bug nel tuo componente! Correggi il bug invece di aggiungere memorizzazione.
1. Evita [Effetti non necessari che aggiornano lo state.](/learn/you-might-not-need-an-effect) La maggior parte dei problemi di prestazioni nelle app React è causata da catene di aggiornamenti originati da Effetti che fanno renderizzare di nuovo i componenti più e più volte.
1. Prova a [rimuovere dipendenze non necessarie dai tuoi Effetti.](/learn/removing-effect-dependencies) Per esempio, invece della memorizzazione, spesso è più semplice spostare un oggetto o una funzione dentro un Effetto o fuori dal componente.

Se un'interazione specifica sembra ancora lenta, [usa il profiler di React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) per vedere quali componenti trarrebbero maggior beneficio dalla memorizzazione, e aggiungi memorizzazione dove serve. Questi principi rendono i tuoi componenti più facili da debuggare e capire, quindi è comunque utile seguirli. A lungo termine, stiamo ricercando [come fare memorizzazione granulare automaticamente](https://www.youtube.com/watch?v=lGEMwh32soc) per risolvere il problema una volta per tutte.

</DeepDive>

---

### Aggiornare un componente memorizzato usando lo state {/*updating-a-memoized-component-using-state*/}

Anche quando un componente è memorizzato, verrà comunque ri-renderizzato quando cambia il suo state. La memorizzazione riguarda solo le props passate al componente dal genitore.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nome{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Indirizzo{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Saluto normale
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Saluto entusiasta
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Se imposti una variabile di state al suo valore attuale, React salterà la ri-renderizzazione del tuo componente anche senza `memo`. Potresti comunque vedere la funzione del tuo componente chiamata un'ulteriore volta, ma il risultato verrà scartato.

---

### Aggiornare un componente memorizzato usando un context {/*updating-a-memoized-component-using-a-context*/}

Anche quando un componente è memorizzato, verrà comunque ri-renderizzato quando cambia un context che sta usando. La memorizzazione riguarda solo le props passate al componente dal genitore.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext value={theme}>
      <button onClick={handleClick}>
        Cambia tema
      </button>
      <Greeting name="Taylor" />
    </ThemeContext>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

Per far ri-renderizzare il tuo componente solo quando cambia _una parte_ di un context, dividi il componente in due. Leggi ciò che ti serve dal context nel componente esterno, e passalo a un figlio memorizzato come prop.

---

### Minimizzare i cambiamenti delle props {/*minimizing-props-changes*/}

Quando usi `memo`, il tuo componente viene ri-renderizzato ogni volta che una prop non è *superficialmente uguale* a quella precedente. Ciò significa che React confronta ogni prop del tuo componente con il suo valore precedente usando il confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Nota che `Object.is(3, 3)` è `true`, ma `Object.is({}, {})` è `false`.


Per ottenere il massimo da `memo`, minimizza le volte in cui le props cambiano. Per esempio, se la prop è un oggetto, evita che il componente genitore ricrei quell'oggetto ogni volta usando [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

Un modo migliore per minimizzare i cambiamenti delle props è assicurarsi che il componente accetti nelle props solo le informazioni minime necessarie. Per esempio, potrebbe accettare valori individuali invece di un intero oggetto:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Anche i valori individuali a volte possono essere proiettati su altri che cambiano meno frequentemente. Per esempio, qui un componente accetta un booleano che indica la presenza di un valore piuttosto che il valore stesso:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Quando devi passare una funzione a un componente memorizzato, dichiara la funzione fuori dal tuo componente in modo che non cambi mai, oppure usa [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) per memorizzare la sua definizione tra le ri-renderizzazioni.

---

### Specificare una funzione di confronto personalizzata {/*specifying-a-custom-comparison-function*/}

In casi rari può essere impraticabile minimizzare i cambiamenti delle props di un componente memorizzato. In quel caso, puoi fornire una funzione di confronto personalizzata, che React userà per confrontare le props vecchie e nuove invece di usare l'uguaglianza superficiale. Questa funzione viene passata come secondo argomento a `memo`. Dovrebbe restituire `true` solo se le nuove props produrrebbero lo stesso output delle vecchie props; altrimenti dovrebbe restituire `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

Se lo fai, usa il pannello Performance negli strumenti per sviluppatori del browser per assicurarti che la tua funzione di confronto sia effettivamente più veloce della ri-renderizzazione del componente. Potresti rimanere sorpreso.

Quando fai misurazioni delle prestazioni, assicurati che React sia in esecuzione in modalità produzione.

<Pitfall>

Se fornisci un'implementazione personalizzata di `arePropsEqual`, **devi confrontare ogni prop, incluse le funzioni.** Le funzioni spesso [catturano](https://developer.mozilla.org/it/docs/Web/JavaScript/Closures) le props e lo state dei componenti genitori. Se restituisci `true` quando `oldProps.onClick !== newProps.onClick`, il tuo componente continuerà a "vedere" le props e lo state di una renderizzazione precedente dentro il suo gestore `onClick`, portando a bug molto confusi.

Evita di fare controlli di uguaglianza profonda dentro `arePropsEqual` a meno che non sia sicuro al 100% che la struttura dati su cui lavori abbia una profondità nota e limitata. **I controlli di uguaglianza profonda possono diventare incredibilmente lenti** e possono bloccare la tua app per molti secondi se qualcuno cambia la struttura dati in seguito.

</Pitfall>

---

### Ho ancora bisogno di React.memo se uso React Compiler? {/*react-compiler-memo*/}

Quando abiliti [React Compiler](/learn/react-compiler), di solito non hai più bisogno di `React.memo`. Il compiler ottimizza automaticamente la ri-renderizzazione dei componenti per te.

Ecco come funziona:

**Senza React Compiler**, hai bisogno di `React.memo` per evitare ri-renderizzazioni non necessarie:

```js
// Il genitore si ri-renderizza ogni secondo
function Parent() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1>Seconds: {seconds}</h1>
      <ExpensiveChild name="John" />
    </>
  );
}

// Senza memo, questo si ri-renderizza ogni secondo anche se le props non cambiano
const ExpensiveChild = memo(function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
});
```

**Con React Compiler abilitato**, la stessa ottimizzazione avviene automaticamente:

```js
// Nessun memo necessario: il compiler previene le ri-renderizzazioni automaticamente
function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
}
```

Ecco la parte chiave di ciò che genera React Compiler:

```js {6-12}
function Parent() {
  const $ = _c(7);
  const [seconds, setSeconds] = useState(0);
  // ... altro codice ...

  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = <ExpensiveChild name="John" />;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  // ... istruzione return ...
}
```

Nota le righe evidenziate: il compiler avvolge `<ExpensiveChild name="John" />` in un controllo della cache. Poiché la prop `name` è sempre `"John"`, questo JSX viene creato una volta e riusato a ogni ri-renderizzazione del genitore. Questo è esattamente ciò che fa `React.memo`: impedisce al figlio di ri-renderizzarsi quando le sue props non sono cambiate.

React Compiler automaticamente:
1. Traccia che la prop `name` passata a `ExpensiveChild` non è cambiata
2. Riutilizza il JSX creato in precedenza per `<ExpensiveChild name="John" />`
3. Salta completamente la ri-renderizzazione di `ExpensiveChild`

Ciò significa che **puoi rimuovere `React.memo` dai tuoi componenti in sicurezza quando usi React Compiler**. Il compiler fornisce la stessa ottimizzazione automaticamente, rendendo il tuo codice più pulito e più facile da mantenere.

<Note>

L'ottimizzazione del compiler è in realtà più completa di `React.memo`. Memorizza anche valori intermedi e computazioni costose all'interno dei tuoi componenti, in modo simile a combinare `React.memo` con `useMemo` in tutto l'albero dei componenti.

</Note>

---

## Troubleshooting {/*troubleshooting*/}
### Il mio componente si ri-renderizza quando una prop è un oggetto, un array o una funzione {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React confronta le props vecchie e nuove per uguaglianza superficiale: cioè, considera se ogni nuova prop è reference-equal alla prop vecchia. Se crei un nuovo oggetto o array ogni volta che il genitore viene ri-renderizzato, anche se i singoli elementi sono gli stessi, React lo considererà comunque cambiato. Allo stesso modo, se crei una nuova funzione quando renderizzi il componente genitore, React la considererà cambiata anche se la funzione ha la stessa definizione. Per evitare questo, [semplifica le props o memorizza le props nel componente genitore](#minimizing-props-changes).
