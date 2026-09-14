---
title: useCallback
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useCallback.md).

</Note>

<Intro>

`useCallback` è un Hook React che ti permette di memorizzare nella cache una definizione di funzione tra le ri-renderizzazioni.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) memorizza automaticamente valori e funzioni, riducendo la necessità di chiamate manuali a `useCallback`. Puoi usare il compiler per gestire la memorizzazione automaticamente.

</Note>

<InlineToc />

---

## Reference {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Chiama `useCallback` al top level del tuo componente per memorizzare nella cache una definizione di funzione tra le ri-renderizzazioni:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `fn`: Il valore funzione che vuoi memorizzare nella cache. Può accettare qualsiasi argomento e restituire qualsiasi valore. React restituirà (non chiamerà!) la tua funzione durante la renderizzazione iniziale. Nelle renderizzazioni successive, React ti restituirà la stessa funzione se le `dependencies` non sono cambiate dall'ultima renderizzazione. Altrimenti, ti restituirà la funzione che hai passato durante la renderizzazione corrente e la memorizzerà nel caso possa essere riutilizzata in seguito. React non chiamerà la tua funzione. La funzione ti viene restituita così puoi decidere quando e se chiamarla.

* `dependencies`: L'elenco di tutti i valori reattivi referenziati all'interno del codice di `fn`. I valori reattivi includono props, state e tutte le variabili e funzioni dichiarate direttamente nel corpo del componente. Se il tuo linter è [configurato per React](/learn/editor-setup#linting), verificherà che ogni valore reattivo sia specificato correttamente come dipendenza. L'elenco delle dipendenze deve avere un numero costante di elementi ed essere scritto inline come `[dep1, dep2, dep3]`. React confronterà ogni dipendenza con il suo valore precedente usando l'algoritmo di confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Returns {/*returns*/}

Nella renderizzazione iniziale, `useCallback` restituisce la funzione `fn` che hai passato.

Nelle renderizzazioni successive, restituirà una funzione `fn` già memorizzata dall'ultima renderizzazione (se le dipendenze non sono cambiate), oppure restituirà la funzione `fn` che hai passato durante questa renderizzazione.

#### Caveats {/*caveats*/}

* `useCallback` è un Hook, quindi puoi chiamarlo **solo al top level del tuo componente** o dei tuoi Hook. Non puoi chiamarlo all'interno di loop o condizioni. Se ne hai bisogno, estrai un nuovo componente e sposta lo state al suo interno.
* React **non scarterà la funzione memorizzata nella cache a meno che non ci sia una ragione specifica per farlo.** Per esempio, in development, React scarta la cache quando modifichi il file del componente. Sia in development che in production, React scarterà la cache se il componente sospende durante il mount iniziale. In futuro, React potrebbe aggiungere altre funzionalità che sfruttano lo scarto della cache — per esempio, se React aggiungesse supporto integrato per liste virtualizzate in futuro, avrebbe senso scartare la cache per gli elementi che escono dal viewport di una tabella virtualizzata. Questo dovrebbe corrispondere alle tue aspettative se ti affidi a `useCallback` come ottimizzazione delle prestazioni. Altrimenti, una [variabile di state](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) o un [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) potrebbero essere più appropriati.

---

## Usage {/*usage*/}

### Saltare la ri-renderizzazione dei componenti {/*skipping-re-rendering-of-components*/}

Quando ottimizzi le prestazioni di rendering, a volte dovrai memorizzare nella cache le funzioni che passi ai componenti figli. Vediamo prima la sintassi per farlo, e poi in quali casi è utile.

Per memorizzare nella cache una funzione tra le ri-renderizzazioni del componente, avvolgi la sua definizione nell'Hook `useCallback`:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Devi passare due cose a `useCallback`:

1. Una definizione di funzione che vuoi memorizzare nella cache tra le ri-renderizzazioni.
2. Un <CodeStep step={2}>elenco di dipendenze</CodeStep> che include ogni valore all'interno del componente usato all'interno della funzione.

Nella renderizzazione iniziale, la <CodeStep step={3}>funzione restituita</CodeStep> che otterrai da `useCallback` sarà la funzione che hai passato.

Nelle renderizzazioni successive, React confronterà le <CodeStep step={2}>dipendenze</CodeStep> con le dipendenze che hai passato durante la renderizzazione precedente. Se nessuna delle dipendenze è cambiata (rispetto a [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` restituirà la stessa funzione di prima. Altrimenti, `useCallback` restituirà la funzione che hai passato in *questa* renderizzazione.

In altre parole, `useCallback` memorizza nella cache una funzione tra le ri-renderizzazioni finché le sue dipendenze non cambiano.

**Vediamo un esempio per capire quando questo è utile.**

Supponiamo che tu stia passando una funzione `handleSubmit` da `ProductPage` al componente `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

Hai notato che cambiare la prop `theme` blocca l'app per un momento, ma se rimuovi `<ShippingForm />` dal JSX, sembra veloce. Questo ti dice che vale la pena provare a ottimizzare il componente `ShippingForm`.

**Per impostazione predefinita, quando un componente viene ri-renderizzato, React ri-renderizza ricorsivamente tutti i suoi figli.** Ecco perché, quando `ProductPage` viene ri-renderizzato con un `theme` diverso, anche il componente `ShippingForm` viene ri-renderizzato. Va bene per componenti che non richiedono molto calcolo per la ri-renderizzazione. Ma se hai verificato che una ri-renderizzazione è lenta, puoi dire a `ShippingForm` di saltare la ri-renderizzazione quando le sue props sono le stesse dell'ultima renderizzazione avvolgendolo in [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Con questa modifica, `ShippingForm` salterà la ri-renderizzazione se tutte le sue props sono le *stesse* dell'ultima renderizzazione.** È qui che memorizzare nella cache una funzione diventa importante! Supponiamo che tu abbia definito `handleSubmit` senza `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Ogni volta che theme cambia, questa sarà una funzione diversa...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... quindi le props di ShippingForm non saranno mai le stesse, e si ri-renderizzerà ogni volta */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**In JavaScript, una `function () {}` o `() => {}` crea sempre una funzione _diversa_,** simile a come il letterale oggetto `{}` crea sempre un nuovo oggetto. Normalmente, questo non sarebbe un problema, ma significa che le props di `ShippingForm` non saranno mai le stesse, e la tua ottimizzazione con [`memo`](/reference/react/memo) non funzionerà. È qui che `useCallback` torna utile:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Dì a React di memorizzare nella cache la tua funzione tra le ri-renderizzazioni...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...finché queste dipendenze non cambiano...

  return (
    <div className={theme}>
      {/* ...ShippingForm riceverà le stesse props e potrà saltare la ri-renderizzazione */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Avvolgendo `handleSubmit` in `useCallback`, ti assicuri che sia la *stessa* funzione tra le ri-renderizzazioni** (finché le dipendenze non cambiano). Non *devi* avvolgere una funzione in `useCallback` a meno che non lo faccia per una ragione specifica. In questo esempio, la ragione è che la passi a un componente avvolto in [`memo`,](/reference/react/memo) e questo gli permette di saltare la ri-renderizzazione. Ci sono altre ragioni per cui potresti aver bisogno di `useCallback`, descritte più avanti in questa pagina.

<Note>

**Dovresti affidarti a `useCallback` solo come ottimizzazione delle prestazioni.** Se il tuo codice non funziona senza di esso, trova il problema sottostante e risolvilo prima. Poi potrai aggiungere di nuovo `useCallback`.

</Note>

<DeepDive>

#### Come si relaziona useCallback a useMemo? {/*how-is-usecallback-related-to-usememo*/}

Vedrai spesso [`useMemo`](/reference/react/useMemo) insieme a `useCallback`. Entrambi sono utili quando cerchi di ottimizzare un componente figlio. Ti permettono di [memorizzare](https://it.wikipedia.org/wiki/Memoizzazione) (o, in altre parole, mettere in cache) qualcosa che stai passando in giù:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Chiama la tua funzione e memorizza il risultato
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Memorizza la funzione stessa
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

La differenza sta in *cosa* ti permettono di memorizzare nella cache:

* **[`useMemo`](/reference/react/useMemo) memorizza nella cache il *risultato* della chiamata alla tua funzione.** In questo esempio, memorizza nella cache il risultato della chiamata a `computeRequirements(product)` così che non cambi a meno che `product` non sia cambiato. Questo ti permette di passare l'oggetto `requirements` in giù senza ri-renderizzare inutilmente `ShippingForm`. Quando necessario, React chiamerà la funzione che hai passato durante il rendering per calcolare il risultato.
* **`useCallback` memorizza nella cache *la funzione stessa*.** A differenza di `useMemo`, non chiama la funzione che fornisci. Invece, memorizza nella cache la funzione che hai fornito così che `handleSubmit` *in sé* non cambi a meno che `productId` o `referrer` non siano cambiati. Questo ti permette di passare la funzione `handleSubmit` in giù senza ri-renderizzare inutilmente `ShippingForm`. Il tuo codice non verrà eseguito finché l'utente non invia il form.

Se conosci già [`useMemo`,](/reference/react/useMemo) potresti trovare utile pensare a `useCallback` così:

```js {expectedErrors: {'react-compiler': [3]}}
// Implementazione semplificata (all'interno di React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Leggi di più sulla differenza tra `useMemo` e `useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### Dovresti aggiungere useCallback ovunque? {/*should-you-add-usecallback-everywhere*/}

Se la tua app è come questo sito, e la maggior parte delle interazioni è grossolana (come sostituire una pagina o un'intera sezione), la memorizzazione di solito non è necessaria. D'altra parte, se la tua app è più simile a un editor di disegni, e la maggior parte delle interazioni è granulare (come spostare forme), potresti trovare la memorizzazione molto utile.

Memorizzare nella cache una funzione con `useCallback` è utile solo in pochi casi:

- La passi come prop a un componente avvolto in [`memo`.](/reference/react/memo) Vuoi saltare la ri-renderizzazione se il valore non è cambiato. La memorizzazione permette al componente di ri-renderizzarsi solo se le dipendenze sono cambiate.
- La funzione che passi viene poi usata come dipendenza di qualche Hook. Per esempio, un'altra funzione avvolta in `useCallback` dipende da essa, oppure dipendi da questa funzione da [`useEffect.`](/reference/react/useEffect)

Non c'è alcun beneficio nell'avvolgere una funzione in `useCallback` in altri casi. Non c'è nemmeno un danno significativo nel farlo, quindi alcuni team scelgono di non pensare ai singoli casi e memorizzare il più possibile. Lo svantaggio è che il codice diventa meno leggibile. Inoltre, non tutta la memorizzazione è efficace: un singolo valore che è "sempre nuovo" basta a rompere la memorizzazione per un intero componente.

Nota che `useCallback` non impedisce di *creare* la funzione. Stai sempre creando una funzione (ed è ok!), ma React la ignora e ti restituisce una funzione memorizzata nella cache se nulla è cambiato.

**In pratica, puoi evitare molta memorizzazione seguendo alcuni principi:**

1. Quando un componente avvolge visivamente altri componenti, lascia che [accetti JSX come children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Poi, se il componente wrapper aggiorna il proprio state, React sa che i suoi figli non hanno bisogno di ri-renderizzarsi.
2. Preferisci lo state locale e non [sollevare lo state](/learn/sharing-state-between-components) più in alto del necessario. Non tenere state transitorio come form e se un elemento è in hover in cima all'albero o in una libreria di state globale.
3. Mantieni la tua [logica di rendering pura.](/learn/keeping-components-pure) Se ri-renderizzare un componente causa un problema o produce qualche artefatto visivo evidente, è un bug nel componente! Correggi il bug invece di aggiungere memorizzazione.
4. Evita [Effetti non necessari che aggiornano lo state.](/learn/you-might-not-need-an-effect) La maggior parte dei problemi di prestazioni nelle app React è causata da catene di aggiornamenti originati da Effetti che fanno renderizzare i componenti più e più volte.
5. Prova a [rimuovere dipendenze non necessarie dai tuoi Effetti.](/learn/removing-effect-dependencies) Per esempio, invece della memorizzazione, spesso è più semplice spostare un oggetto o una funzione all'interno di un Effetto o fuori dal componente.

Se un'interazione specifica sembra ancora lenta, [usa il profiler di React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) per vedere quali componenti beneficiano di più dalla memorizzazione, e aggiungi memorizzazione dove serve. Questi principi rendono i componenti più facili da debuggare e capire, quindi conviene seguirli comunque. A lungo termine, stiamo ricercando [come fare memorizzazione automaticamente](https://www.youtube.com/watch?v=lGEMwh32soc) per risolvere il problema una volta per tutte.

</DeepDive>

<Recipes titleText="La differenza tra useCallback e dichiarare una funzione direttamente" titleId="examples-rerendering">

#### Saltare la ri-renderizzazione con `useCallback` e `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

In questo esempio, il componente `ShippingForm` è **artificialmente rallentato** così puoi vedere cosa succede quando un componente React che stai renderizzando è genuinamente lento. Prova ad incrementare il contatore e a cambiare il tema.

Incrementare il contatore sembra lento perché forza il `ShippingForm` rallentato a ri-renderizzarsi. È previsto, perché il contatore è cambiato e devi riflettere la nuova scelta dell'utente sullo schermo.

Poi, prova a cambiare il tema. **Grazie a `useCallback` insieme a [`memo`](/reference/react/memo), è veloce nonostante il rallentamento artificiale!** `ShippingForm` ha saltato la ri-renderizzazione perché la funzione `handleSubmit` non è cambiata. La funzione `handleSubmit` non è cambiata perché sia `productId` che `referrer` (le tue dipendenze di `useCallback`) non sono cambiati dall'ultima renderizzazione.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modalità scura
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Immagina che invii una richiesta...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALMENTE LENTO] Rendering di <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Non fa nulla per 500 ms per emulare codice estremamente lento
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Nota: <code>ShippingForm</code> è artificialmente rallentato!</b></p>
      <label>
        Numero di articoli:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Via:
        <input name="street" />
      </label>
      <label>
        Città:
        <input name="city" />
      </label>
      <label>
        CAP:
        <input name="zipCode" />
      </label>
      <button type="submit">Invia</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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

In questo esempio, l'implementazione di `ShippingForm` è anche **artificialmente rallentata** così puoi vedere cosa succede quando un componente React che stai renderizzando è genuinamente lento. Prova ad incrementare il contatore e a cambiare il tema.

A differenza dell'esempio precedente, cambiare il tema è lento anche ora! Questo perché **non c'è una chiamata a `useCallback` in questa versione,** quindi `handleSubmit` è sempre una nuova funzione, e il componente `ShippingForm` rallentato non può saltare la ri-renderizzazione.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modalità scura
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Immagina che invii una richiesta...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALMENTE LENTO] Rendering di <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Non fa nulla per 500 ms per emulare codice estremamente lento
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Nota: <code>ShippingForm</code> è artificialmente rallentato!</b></p>
      <label>
        Numero di articoli:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Via:
        <input name="street" />
      </label>
      <label>
        Città:
        <input name="city" />
      </label>
      <label>
        CAP:
        <input name="zipCode" />
      </label>
      <button type="submit">Invia</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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


Tuttavia, ecco lo stesso codice **con il rallentamento artificiale rimosso.** La mancanza di `useCallback` si nota o no?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modalità scura
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Immagina che invii una richiesta...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering di <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Numero di articoli:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Via:
        <input name="street" />
      </label>
      <label>
        Città:
        <input name="city" />
      </label>
      <label>
        CAP:
        <input name="zipCode" />
      </label>
      <button type="submit">Invia</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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


Molto spesso, il codice senza memorizzazione funziona bene. Se le tue interazioni sono abbastanza veloci, non hai bisogno di memorizzazione.

Tieni presente che devi eseguire React in modalità production, disabilitare [React Developer Tools](/learn/react-developer-tools), e usare dispositivi simili a quelli che usano gli utenti della tua app per avere un'idea realistica di cosa sta effettivamente rallentando la tua app.

<Solution />

</Recipes>

---

### Aggiornare lo state da un callback memorizzato {/*updating-state-from-a-memoized-callback*/}

A volte, potresti aver bisogno di aggiornare lo state in base allo state precedente da un callback memorizzato.

Questa funzione `handleAddTodo` specifica `todos` come dipendenza perché calcola i prossimi todos da esso:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Di solito vorrai che le funzioni memorizzate abbiano il minor numero possibile di dipendenze. Quando leggi dello state solo per calcolare il prossimo state, puoi rimuovere quella dipendenza passando una [funzione updater](/reference/react/useState#updating-state-based-on-the-previous-state) invece:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ Non serve la dipendenza todos
  // ...
```

Qui, invece di usare `todos` come dipendenza e leggerlo all'interno, passi a React un'istruzione su *come* aggiornare lo state (`todos => [...todos, newTodo]`). [Leggi di più sulle funzioni updater.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Impedire a un Effetto di attivarsi troppo spesso {/*preventing-an-effect-from-firing-too-often*/}

A volte, potresti voler chiamare una funzione dall'interno di un [Effetto:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Questo crea un problema. [Ogni valore reattivo deve essere dichiarato come dipendenza del tuo Effetto.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Tuttavia, se dichiari `createOptions` come dipendenza, causerà la riconnessione costante del tuo Effetto alla chat room:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problema: questa dipendenza cambia ad ogni renderizzazione
  // ...
```

Per risolvere, puoi avvolgere la funzione che devi chiamare da un Effetto in `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Cambia solo quando roomId cambia

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Cambia solo quando createOptions cambia
  // ...
```

Questo garantisce che la funzione `createOptions` sia la stessa tra le ri-renderizzazioni se `roomId` è lo stesso. **Tuttavia, è ancora meglio eliminare la necessità di una dipendenza funzione.** Sposta la funzione *all'interno* dell'Effetto:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ Non serve useCallback o dipendenze funzione!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Cambia solo quando roomId cambia
  // ...
```

Ora il codice è più semplice e non ha bisogno di `useCallback`. [Scopri di più sulla rimozione delle dipendenze degli Effetti.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Ottimizzare un custom Hook {/*optimizing-a-custom-hook*/}

Se stai scrivendo un [custom Hook,](/learn/reusing-logic-with-custom-hooks) è consigliato avvolgere in `useCallback` tutte le funzioni che restituisce:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Questo garantisce che i consumatori del tuo Hook possano ottimizzare il proprio codice quando necessario.

---

## Troubleshooting {/*troubleshooting*/}

### Ogni volta che il mio componente viene renderizzato, `useCallback` restituisce una funzione diversa {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Assicurati di aver specificato l'array di dipendenze come secondo argomento!

Se dimentichi l'array di dipendenze, `useCallback` restituirà una nuova funzione ogni volta:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Restituisce una nuova funzione ogni volta: nessun array di dipendenze
  // ...
```

Questa è la versione corretta che passa l'array di dipendenze come secondo argomento:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Non restituisce una nuova funzione inutilmente
  // ...
```

Se questo non aiuta, il problema è che almeno una delle tue dipendenze è diversa dalla renderizzazione precedente. Puoi debuggare questo problema registrando manualmente le dipendenze nella console:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Puoi poi fare clic destro sugli array di renderizzazioni diverse nella console e selezionare "Store as a global variable" per entrambi. Supponendo che il primo sia stato salvato come `temp1` e il secondo come `temp2`, puoi usare la console del browser per verificare se ogni dipendenza in entrambi gli array è la stessa:

```js
Object.is(temp1[0], temp2[0]); // La prima dipendenza è la stessa tra gli array?
Object.is(temp1[1], temp2[1]); // La seconda dipendenza è la stessa tra gli array?
Object.is(temp1[2], temp2[2]); // ... e così via per ogni dipendenza ...
```

Quando trovi quale dipendenza rompe la memorizzazione, trova un modo per rimuoverla, oppure [memorizzala anche.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Devo chiamare `useCallback` per ogni elemento di una lista in un loop, ma non è permesso {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Supponiamo che il componente `Chart` sia avvolto in [`memo`](/reference/react/memo). Vuoi saltare la ri-renderizzazione di ogni `Chart` nella lista quando il componente `ReportList` viene ri-renderizzato. Tuttavia, non puoi chiamare `useCallback` in un loop:

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Non puoi chiamare useCallback in un loop così:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Invece, estrai un componente per un singolo elemento, e metti `useCallback` lì:

```js {5,12-21}
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
  // ✅ Chiama useCallback al top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

In alternativa, potresti rimuovere `useCallback` nell'ultimo snippet e invece avvolgere `Report` stesso in [`memo`.](/reference/react/memo) Se la prop `item` non cambia, `Report` salterà la ri-renderizzazione, quindi anche `Chart` salterà la ri-renderizzazione:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
