---
title: useTransition
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useTransition.md).

</Note>

<Intro>

`useTransition` è un Hook React che ti permette di renderizzare una parte dell'UI in background.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useTransition()` {/*usetransition*/}

Chiama `useTransition` al top level del tuo componente per contrassegnare alcuni aggiornamenti di state come Transizioni.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

`useTransition` non accetta parametri.

#### Returns {/*returns*/}

`useTransition` restituisce un array con esattamente due elementi:

1. Il flag `isPending` che ti indica se c'è una Transizione in sospeso.
2. La [funzione `startTransition`](#starttransition) che ti permette di contrassegnare gli aggiornamenti come Transizione.

---

### `startTransition(action)` {/*starttransition*/}

La funzione `startTransition` restituita da `useTransition` ti permette di contrassegnare un aggiornamento come Transizione.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

<Note>
#### Le funzioni chiamate in `startTransition` si chiamano "Action". {/*functions-called-in-starttransition-are-called-actions*/}

La funzione passata a `startTransition` si chiama "Action". Per convenzione, qualsiasi callback chiamata all'interno di `startTransition` (come una callback prop) dovrebbe chiamarsi `action` o includere il suffisso "Action":

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>



#### Parameters {/*starttransition-parameters*/}

* `action`: Una funzione che aggiorna dello state chiamando una o più [`set` functions](/reference/react/useState#setstate). React chiama `action` immediatamente senza parametri e contrassegna come Transizioni tutti gli aggiornamenti di state pianificati in modo sincrono durante la chiamata alla funzione `action`. Qualsiasi chiamata async attesa con `await` in `action` sarà inclusa nella Transizione, ma attualmente richiede di avvolgere qualsiasi `set` function dopo `await` in un ulteriore `startTransition` (vedi [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Gli aggiornamenti di state contrassegnati come Transizioni saranno [non bloccanti](#perform-non-blocking-updates-with-actions) e [non mostreranno indicatori di caricamento indesiderati](#preventing-unwanted-loading-indicators).

#### Returns {/*starttransition-returns*/}

`startTransition` non restituisce nulla.

#### Caveats {/*starttransition-caveats*/}

* `useTransition` è un Hook, quindi può essere chiamato solo all'interno di componenti o custom Hook. Se devi avviare una Transizione altrove (per esempio, da una libreria di dati), chiama invece la funzione standalone [`startTransition`](/reference/react/startTransition).

* Puoi avvolgere un aggiornamento in una Transizione solo se hai accesso alla `set` function di quello state. Se vuoi avviare una Transizione in risposta a una prop o a un valore di un custom Hook, prova [`useDeferredValue`](/reference/react/useDeferredValue).

* La funzione che passi a `startTransition` viene chiamata immediatamente, contrassegnando come Transizioni tutti gli aggiornamenti di state che avvengono mentre viene eseguita. Se provi a eseguire aggiornamenti di state in un `setTimeout`, per esempio, non saranno contrassegnati come Transizioni.

* Devi avvolgere qualsiasi aggiornamento di state dopo richieste async in un altro `startTransition` per contrassegnarli come Transizioni. Questa è una limitazione nota che correggeremo in futuro (vedi [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* La funzione `startTransition` ha un'identità stabile, quindi spesso la vedrai omessa dalle dipendenze degli Effetti, ma includerla non farà scattare l'Effetto. Se il linter ti permette di omettere una dipendenza senza errori, puoi farlo in sicurezza. [Scopri di più sulla rimozione delle dipendenze degli Effetti.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Un aggiornamento di state contrassegnato come Transizione verrà interrotto da altri aggiornamenti di state. Per esempio, se aggiorni un componente grafico all'interno di una Transizione, ma poi inizi a digitare in un input mentre il grafico è nel mezzo di una ri-renderizzazione, React riavvierà il lavoro di renderizzazione sul componente grafico dopo aver gestito l'aggiornamento dell'input.

* Gli aggiornamenti Transizione non possono essere usati per controllare input di testo.

* Se ci sono più Transizioni in corso, React attualmente le raggruppa insieme. Questa è una limitazione che potrebbe essere rimossa in una release futura.

## Usage {/*usage*/}

### Eseguire aggiornamenti non bloccanti con le Action {/*perform-non-blocking-updates-with-actions*/}

Chiama `useTransition` in cima al tuo componente per creare Action e accedere allo state pending:

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` restituisce un array con esattamente due elementi:

1. Il <CodeStep step={1}>flag `isPending`</CodeStep> che ti indica se c'è una Transizione in sospeso.
2. La <CodeStep step={2}>funzione `startTransition`</CodeStep> che ti permette di creare un'Action.

Per avviare una Transizione, passa una funzione a `startTransition` così:

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

La funzione passata a `startTransition` si chiama "Action". Puoi aggiornare lo state e (opzionalmente) eseguire effetti collaterali all'interno di un'Action, e il lavoro verrà svolto in background senza bloccare le interazioni dell'utente sulla pagina. Una Transizione può includere più Action, e mentre una Transizione è in corso, la tua UI resta reattiva. Per esempio, se l'utente clicca una tab ma poi cambia idea e ne clicca un'altra, il secondo click verrà gestito immediatamente senza attendere il completamento del primo aggiornamento.

Per dare all'utente un feedback sulle Transizioni in corso, lo state `isPending` passa a `true` alla prima chiamata a `startTransition` e resta `true` finché tutte le Action non sono completate e lo state finale viene mostrato all'utente. Le Transizioni assicurano che gli effetti collaterali nelle Action si completino in ordine per [prevenire indicatori di caricamento indesiderati](#preventing-unwanted-loading-indicators), e puoi fornire un feedback immediato mentre la Transizione è in corso con `useOptimistic`.

<Recipes titleText="La differenza tra Action e gestione ordinaria degli eventi">

#### Aggiornare la quantità in un'Action {/*updating-the-quantity-in-an-action*/}

In questo esempio, la funzione `updateQuantity` simula una richiesta al server per aggiornare la quantità dell'articolo nel carrello. Questa funzione è *artificialmente rallentata* in modo che impieghi almeno un secondo per completare la richiesta.

Aggiorna la quantità più volte in rapida successione. Nota che lo state pending "Total" viene mostrato mentre le richieste sono in corso, e "Total" si aggiorna solo dopo che l'ultima richiesta è completata. Poiché l'aggiornamento è in un'Action, la "quantity" può continuare ad essere aggiornata mentre la richiesta è in corso.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // Per accedere allo state pending di una transizione,
    // chiama di nuovo startTransition.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // Per esporre una prop action, fai await alla callback in startTransition.
    startTransition(async () => {
      await action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simula una richiesta di rete lenta.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Questo è un esempio base per dimostrare come funzionano le Action, ma non gestisce richieste che si completano fuori ordine. Quando aggiorni la quantità più volte, è possibile che le richieste precedenti finiscano dopo quelle successive, causando un aggiornamento della quantità fuori ordine. Questa è una limitazione nota che correggeremo in futuro (vedi [Troubleshooting](#my-state-updates-in-transitions-are-out-of-order) sotto).

Per casi d'uso comuni, React fornisce astrazioni integrate come:
- [`useActionState`](/reference/react/useActionState)
- [action di `<form>`](/reference/react-dom/components/form)
- [Server Functions](/reference/rsc/server-functions)

Queste soluzioni gestiscono l'ordinamento delle richieste per te. Quando usi le Transizioni per costruire i tuoi custom hook o librerie che gestiscono transizioni di state async, hai un controllo maggiore sull'ordinamento delle richieste, ma devi gestirlo tu stesso.

<Solution />

#### Aggiornare la quantità senza un'Action {/*updating-the-users-name-without-an-action*/}

In questo esempio, la funzione `updateQuantity` simula anch'essa una richiesta al server per aggiornare la quantità dell'articolo nel carrello. Questa funzione è *artificialmente rallentata* in modo che impieghi almeno un secondo per completare la richiesta.

Aggiorna la quantità più volte in rapida successione. Nota che lo state pending "Total" viene mostrato mentre le richieste sono in corso, ma "Total" si aggiorna più volte per ogni volta che la "quantity" è stata modificata:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Imposta manualmente lo state isPending.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simula una richiesta di rete lenta.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Una soluzione comune a questo problema è impedire all'utente di apportare modifiche mentre la quantità si sta aggiornando:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Imposta manualmente lo state isPending.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simula una richiesta di rete lenta.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Questa soluzione fa sembrare l'app lenta, perché l'utente deve attendere ogni volta che aggiorna la quantità. È possibile aggiungere manualmente una gestione più complessa per permettere all'utente di interagire con l'UI mentre la quantità si aggiorna, ma le Action gestiscono questo caso con un'API integrata semplice.

<Solution />

</Recipes>

---

### Esporre la prop `action` dai componenti {/*exposing-action-props-from-components*/}

Puoi esporre una prop `action` da un componente per permettere a un genitore di chiamare un'Action.

Per esempio, questo componente `TabButton` avvolge la sua logica `onClick` in una prop `action`:

```js {8-12}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await all'action passata.
        // Questo permette che sia sincrona o asincrona.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

Poiché il componente genitore aggiorna il suo state all'interno di `action`, quell'aggiornamento di state viene contrassegnato come Transizione. Questo significa che puoi cliccare su "Posts" e poi cliccare immediatamente su "Contact" senza bloccare le interazioni dell'utente:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await all'action passata.
        // Questo permette che sia sincrona o asincrona.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log una volta. Il rallentamento effettivo è dentro SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Non fare nulla per 1 ms per elemento per emulare codice estremamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Puoi trovarmi online qui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
.items {
  max-height: 300px;
  overflow: auto;
}
```

</Sandpack>

<Note>

Quando esponi una prop `action` da un componente, dovresti fare `await` al suo interno nella transizione.

Questo permette alla callback `action` di essere sincrona o asincrona senza richiedere un ulteriore `startTransition` per avvolgere `await` nell'action.

</Note>

---

### Mostrare uno state visivo pending {/*displaying-a-pending-visual-state*/}

Puoi usare il valore booleano `isPending` restituito da `useTransition` per indicare all'utente che una Transizione è in corso. Per esempio, il pulsante tab può avere uno state visivo speciale "pending":

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Nota come cliccare su "Posts" ora sembri più reattivo perché il pulsante tab stesso si aggiorna subito:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log una volta. Il rallentamento effettivo è dentro SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Non fare nulla per 1 ms per elemento per emulare codice estremamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Puoi trovarmi online qui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
.items {
  max-height: 300px;
  overflow: auto;
}
```

</Sandpack>

---

### Prevenire indicatori di caricamento indesiderati {/*preventing-unwanted-loading-indicators*/}

In questo esempio, il componente `PostsTab` recupera dei dati usando [use](/reference/react/use). Quando clicchi la tab "Posts", il componente `PostsTab` *sospende*, causando la comparsa del fallback di caricamento più vicino:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        Puoi trovarmi online qui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Nota: il modo in cui faresti il data fetching dipende
// dal framework che usi insieme a Suspense.
// Normalmente, la logica di caching sarebbe dentro un framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Aggiungi un ritardo fittizio per far notare l'attesa.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Nascondere l'intero contenitore delle tab per mostrare un indicatore di caricamento produce un'esperienza utente brusca. Se aggiungi `useTransition` a `TabButton`, puoi invece mostrare lo state pending nel pulsante tab.

Nota che cliccare su "Posts" non sostituisce più l'intero contenitore delle tab con uno spinner:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        Puoi trovarmi online qui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Nota: il modo in cui faresti il data fetching dipende
// dal framework che usi insieme a Suspense.
// Normalmente, la logica di caching sarebbe dentro un framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Aggiungi un ritardo fittizio per far notare l'attesa.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Leggi di più sull'uso delle Transizioni con Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Le Transizioni "attendono" solo abbastanza a lungo per evitare di nascondere contenuto *già rivelato* (come il contenitore delle tab). Se la tab Posts avesse un [boundary `<Suspense>` annidato,](/reference/react/Suspense#revealing-nested-content-as-it-loads) la Transizione non "attenderebbe" per esso.

</Note>

---

### Costruire un router abilitato a Suspense {/*building-a-suspense-enabled-router*/}

Se stai costruendo un framework React o un router, ti consigliamo di contrassegnare le navigazioni di pagina come Transizioni.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Questo è consigliato per tre motivi:

- [Le Transizioni sono interrompibili,](#perform-non-blocking-updates-with-actions) il che permette all'utente di cliccare altrove senza attendere il completamento della ri-renderizzazione.
- [Le Transizioni prevengono indicatori di caricamento indesiderati,](#preventing-unwanted-loading-indicators) il che permette all'utente di evitare salti bruschi durante la navigazione.
- [Le Transizioni attendono che tutte le action pending si completino](#perform-non-blocking-updates-with-actions), il che permette all'utente di attendere il completamento degli effetti collaterali prima che la nuova pagina venga mostrata.

Ecco un esempio semplificato di router che usa le Transizioni per le navigazioni.

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Nota: il modo in cui faresti il data fetching dipende
// dal framework che usi insieme a Suspense.
// Normalmente, la logica di caching sarebbe dentro un framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Aggiungi un ritardo fittizio per far notare l'attesa.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Aggiungi un ritardo fittizio per far notare l'attesa.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

I router [abilitati a Suspense](/reference/react/Suspense) dovrebbero avvolgere gli aggiornamenti di navigazione in Transizioni per impostazione predefinita.

</Note>

---

### Mostrare un errore agli utenti con un error boundary {/*displaying-an-error-to-users-with-error-boundary*/}

Se una funzione passata a `startTransition` lancia un errore o restituisce una Promise rifiutata, puoi mostrare un errore al tuo utente con un [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Per usare un error boundary, avvolgi il componente in cui chiami `useTransition` in un error boundary. Una volta che la funzione passata a `startTransition` genera un errore, verrà mostrato il fallback dell'error boundary.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // A scopo dimostrativo per mostrare l'Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intenzionalmente non passa un commento
          // così viene lanciato un errore
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### Aggiornare un input in una Transizione non funziona {/*updating-an-input-in-a-transition-doesnt-work*/}

Non puoi usare una Transizione per una variabile di state che controlla un input:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Non puoi usare Transizioni per lo state di un input controllato
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Questo perché le Transizioni sono non bloccanti, ma aggiornare un input in risposta all'evento change dovrebbe avvenire in modo sincrono. Se vuoi eseguire una Transizione in risposta alla digitazione, hai due opzioni:

1. Puoi dichiarare due variabili di state separate: una per lo state dell'input (che si aggiorna sempre in modo sincrono) e una che aggiornerai in una Transizione. Questo ti permette di controllare l'input usando lo state sincrono e passare la variabile di state Transizione (che resterà "indietro" rispetto all'input) al resto della tua logica di renderizzazione.
2. In alternativa, puoi avere una variabile di state e aggiungere [`useDeferredValue`](/reference/react/useDeferredValue) che resterà "indietro" rispetto al valore reale. Attiverà ri-renderizzazioni non bloccanti per "recuperare" automaticamente il nuovo valore.

---

### React non tratta il mio aggiornamento di state come Transizione {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Quando avvolgi un aggiornamento di state in una Transizione, assicurati che avvenga *durante* la chiamata a `startTransition`:

```js
startTransition(() => {
  // ✅ Impostare lo state *durante* la chiamata a startTransition
  setPage('/about');
});
```

La funzione che passi a `startTransition` deve essere sincrona. Non puoi contrassegnare un aggiornamento come Transizione così:

```js
startTransition(() => {
  // ❌ Impostare lo state *dopo* la chiamata a startTransition
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Invece, potresti fare così:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Impostare lo state *durante* la chiamata a startTransition
    setPage('/about');
  });
}, 1000);
```

---

### React non tratta il mio aggiornamento di state dopo `await` come Transizione {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

Quando usi `await` all'interno di una funzione `startTransition`, gli aggiornamenti di state che avvengono dopo `await` non sono contrassegnati come Transizioni. Devi avvolgere gli aggiornamenti di state dopo ogni `await` in una chiamata a `startTransition`:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Non usare startTransition dopo await
  setPage('/about');
});
```

Tuttavia, funziona così:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Usare startTransition *dopo* await
  startTransition(() => {
    setPage('/about');
  });
});
```

Questa è una limitazione di JavaScript dovuta al fatto che React perde lo scope del contesto async. In futuro, quando [AsyncContext](https://github.com/tc39/proposal-async-context) sarà disponibile, questa limitazione verrà rimossa.

---

### Voglio chiamare `useTransition` dall'esterno di un componente {/*i-want-to-call-usetransition-from-outside-a-component*/}

Non puoi chiamare `useTransition` fuori da un componente perché è un Hook. In questo caso, la funzione standalone [`startTransition`](/reference/react/startTransition) può contrassegnare gli aggiornamenti di state come Transizioni. Non fornisce il flag `isPending`. Poiché la funzione standalone non è associata a un componente, un Error Boundary non può gestire errori dalla sua Transizione.

---

### La funzione che passo a `startTransition` viene eseguita immediatamente {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Se esegui questo codice, stamperà 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**È previsto che stampi 1, 2, 3.** La funzione che passi a `startTransition` non viene ritardata. A differenza del `setTimeout` del browser, non esegue la callback in seguito. React esegue la tua funzione immediatamente, ma qualsiasi aggiornamento di state pianificato *mentre è in esecuzione* viene contrassegnato come Transizione. Puoi immaginare che funzioni così:

```js
// Una versione semplificata di come funziona React

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... pianifica un aggiornamento di state Transizione ...
  } else {
    // ... pianifica un aggiornamento di state urgente ...
  }
}
```

### I miei aggiornamenti di state nelle Transizioni sono fuori ordine {/*my-state-updates-in-transitions-are-out-of-order*/}

Se fai `await` all'interno di `startTransition`, potresti vedere gli aggiornamenti avvenire fuori ordine.

In questo esempio, la funzione `updateQuantity` simula una richiesta al server per aggiornare la quantità dell'articolo nel carrello. Questa funzione *artificialmente restituisce ogni altra richiesta dopo la precedente* per simulare race condition nelle richieste di rete.

Prova ad aggiornare la quantità una volta, poi aggiornarla rapidamente più volte. Potresti vedere il totale errato:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Memorizza la quantità effettiva in uno state separato per mostrare la discrepanza.
  const [clientQuantity, setClientQuantity] = useState(1);

  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Accedi allo state pending della transizione
    // avvolgendo di nuovo in startTransition.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Aggiorna la quantità in un'Action.
    startTransition(async () => {
      await action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simula ogni altra richiesta più lenta
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>


Quando clicchi più volte, è possibile che le richieste precedenti finiscano dopo quelle successive. Quando succede, React attualmente non ha modo di conoscere l'ordine previsto. Questo perché gli aggiornamenti sono pianificati in modo asincrono e React perde il contesto dell'ordine attraverso il confine async.

Questo è previsto, perché le Action all'interno di una Transizione non garantiscono l'ordine di esecuzione. Per casi d'uso comuni, React fornisce astrazioni di livello superiore come [`useActionState`](/reference/react/useActionState) e [action di `<form>`](/reference/react-dom/components/form) che gestiscono l'ordinamento per te. Per casi d'uso avanzati, dovrai implementare la tua logica di accodamento e abort per gestirlo.


Esempio di `useActionState` che gestisce l'ordine di esecuzione:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Memorizza la quantità effettiva in uno state separato per mostrare la discrepanza.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // Restituisce la nuova quantità per aggiornare lo state
    },
    1 // Initial quantity
  );

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Aggiorna la quantità in un'Action.
    startTransition(() => {
      action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simula ogni altra richiesta più lenta
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>
