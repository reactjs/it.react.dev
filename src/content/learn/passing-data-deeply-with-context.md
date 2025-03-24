---
title: Passare i Dati in Profondità con il Context
---

<Intro>

Solitamente, passerai le informazioni da un componente genitore a un componente figlio tramite le props. Tuttavia, passare le props può diventare verboso e scomodo se fatto attraverso molti componenti intermedi, o se molti componenti nella tua app necessitano della stessa informazione. Il *context* permette al componente genitore di rendere disponibile un'informazione a qualsiasi componente nell'albero sottostante, a prescindere dalla sua profondità, senza passarla esplicitamente tramite props.

</Intro>

<YouWillLearn>

- Cos'è il "prop drilling"
- Come sostituire il passaggio di props ripetitive con il context
- Casi d'uso comuni del context
- Alternative comuni al context

</YouWillLearn>

## Il problema di passare le props {/*the-problem-with-passing-props*/}

[Passare le props](/learn/passing-props-to-a-component) è un ottimo modo per convogliare esplicitamente i dati attraverso l'albero della UI verso i componenti che ne fanno uso.

Tuttavia, passare le props può diventare verboso e scomodo quando devi farlo in profondità nell'albero, o se molti componenti necessitano della stessa prop. Il parente comune più vicino potrebbe essere molto distante dai componenti che necessitano dei dati, e [sollevare lo state in alto](/learn/sharing-state-between-components) fino a quel punto può portare a una situazione chiamata "prop drilling".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagramma con un albero di tre componenti. Il genitore contiene una bolla rappresentante un valore evidenziata in viola. Il valore scorre giù verso entrambi i figli, evidenziati di viola." >

Sollevare lo state

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagramma con un albero di dieci nodi, ciascun nodo con al massimo due figli. Il nodo radice contiene una bolla che rappresenta un valore evidenziato in viola. Il valore scorre verso il basso attraverso i due figli, ognuno dei quali passa il valore ma non lo contiene. Il figlio sinistro passa il valore ai due figli che sono entrambi evidenziati in viola. Il figlio destro della radice passa il valore attraverso uno dei suoi due figli, quello destro, che è evidenziato in viola. Quel figlio passa il valore attraverso il suo unico figlio, che lo passa a entrambi i suoi due figli, che sono evidenziati in viola.">

Prop drilling

</Diagram>

</DiagramGroup>

Non sarebbe fantastico se ci fosse un modo per "teletrasportare" i dati ai componenti che ne hanno bisogno senza passare le props? Con la funzionalità context di React, questo è possibile!

## Context: un'alternativa al passaggio delle props {/*context-an-alternative-to-passing-props*/}

Il context consente a un componente genitore di fornire dati a tutto l'albero sottostante. Ci sono molteplici utilizzi per il context. Ecco un esempio: considera questo componente `Heading` che accetta un `level` per la sua dimensione:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
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
      throw Error('Unknown level: ' + level);
  }
}
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

Ipotizziamo che tu voglia la stessa dimensione per i titoli di una medesima `Section`.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
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
      throw Error('Unknown level: ' + level);
  }
}
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

Attualmente, passi la prop `level` separatamente a ogni `<Heading>`.

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

Sarebbe bello se potessi passare la prop `level` al componente `<Section>` e rimuoverla da `<Heading>`. In questo modo, potresti garantire che tutti i titoli nella stessa sezione abbiano la stessa dimensione:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

Ma come può il componente `<Heading>` conoscere il livello della sua `<Section>` più vicina? **Ciò richiederebbe un modo per consentire a un figlio di "chiedere" dati da un posto più in alto nell'albero.**

Non puoi farlo solamente con le props, ed è qui che entra in gioco il context. Procederai in tre passaggi:

1. **Crea** un context. (Puoi chiamarlo `LevelContext`, dal momento che è per il livello d'intestazione.)
2. **Usa** quel context dal componente che ha bisogno del dato. (`Heading` userà `LevelContext`.)
3. **Fornisci** quel context dal componente che specifica il dato. (`Section` fornirà `LevelContext`.)

Context permette a un genitore, anche se distante, di fornire dei dati a tutto l'albero al suo interno.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Diagramma con un albero di tre componenti. Il genitore contiene una bolla che rappresenta un valore evidenziato in arancione, che si proietta verso il basso verso i due figli, ognuno dei quali è evidenziato in arancione." >

Usare il context in figli vicini

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Diagramma con un albero di dieci nodi, ciascun nodo con al massimo due figli. Il nodo genitore radice contiene una bolla che rappresenta un valore evidenziato in arancione. Il valore si proietta direttamente verso quattro foglie e un componente intermedio nell'albero, che sono tutti evidenziati in arancione. Nessuno degli altri componenti intermedi è evidenziato.">

Usare il context in figli lontani

</Diagram>

</DiagramGroup>

### Step 1: Creare il context {/*step-1-create-the-context*/}

Prima di tutto, devi creare il context. Dovrai *esportarlo da un file* in modo che i tuoi componenti possano utilizzarlo:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
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
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
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

L'unico argomento di `createContext` è il valore _predefinito_. Qui, `1` si riferisce al livello d'intestazione più alto, ma potresti passare qualsiasi tipo di valore (anche un oggetto). Vedrai il significato del valore predefinito nel prossimo passo.

### Step 2: Usa il context {/*step-2-use-the-context*/}

Importa l'Hook `useContext` da React e il tuo context:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Attualmente, il componente `Heading` legge `level` dalle props:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Piuttosto, rimuovi la prop `level` e leggi il valore dal context che hai appena importato, `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` è un Hook. Proprio come `useState` e `useReducer`, puoi chiamare un Hook solo immediatamente all'interno di un componente React (non all'interno di cicli o condizioni). **`useContext` indica a React che il componente `Heading` desidera leggere il `LevelContext`.**

Ora che il componente `Heading` non ha una prop `level`, non hai più bisogno di passarla a `Heading` nel tuo JSX:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

Modifica il JSX in modo che sia invece `Section` a riceverlo:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

Come promemoria, questo è il markup che stavi cercando di far funzionare:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
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
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
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

Come puoi notare questo esempio non funziona ancora! Tutti i titoli hanno la stessa dimensione perché, **anche se stai *usando* il context, non lo hai ancora *fornito*.** React non sa da dove prenderlo!

Se non fornisci il context, React utilizzerà il valore predefinito specificato nel passaggio precedente. In questo esempio, hai specificato `1` come argomento di `createContext`, quindi `useContext(LevelContext)` restituisce `1`, impostando tutti i titoli su `<h1>`. Risolviamo questo problema facendo sì che ciascuna `Section` fornisca il proprio context.

### Step 3: Fornisci il context {/*step-3-provide-the-context*/}

Il componente `Section` attualmente renderizza i propri figli:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Avvolgili con un context provider** per fornire loro il `LevelContext`:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

<<<<<<< HEAD
Questo dice a React: "se un qualsiasi componente all'interno di questa `<Section>` richiede `LevelContext`, fornisci loro questo `level`." Il componente utilizzerà il valore del `<LevelContext.Provider>` più vicino nell'albero della UI sopra di esso.
=======
This tells React: "if any component inside this `<Section>` asks for `LevelContext`, give them this `level`." The component will use the value of the nearest `<LevelContext>` in the UI tree above it.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
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
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
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

È lo stesso risultato del codice originale, ma non hai dovuto passare la prop `level` a ciascun componente `Heading`! Invece, questo "capisce" il suo livello d'intestazione interrogando il `Section` più vicino sopra di esso:

<<<<<<< HEAD
1. Passi la prop `level` a `<Section>`.
2. `Section` avvolge i suoi figli in `<LevelContext.Provider value={level}>`.
3. `Heading` richiede il valore più vicino di `LevelContext` sopra di sé con `useContext(LevelContext)`.
=======
1. You pass a `level` prop to the `<Section>`.
2. `Section` wraps its children into `<LevelContext value={level}>`.
3. `Heading` asks the closest value of `LevelContext` above with `useContext(LevelContext)`.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

## Usare e fornire un context dallo stesso componente {/*using-and-providing-context-from-the-same-component*/}

Attualmente, devi ancora specificare il `level` di ogni sezione manualmente:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Poiché il context ti consente di leggere informazioni da un componente superiore, ogni `Section` potrebbe leggere il `level` dal `Section` superiore e passare `level + 1` automaticamente verso il basso. Ecco come potresti farlo:

```js src/Section.js {5,8}
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

Con questa modifica, non devi più passare la prop `level` *né* a `<Section>` *né* a `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
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
      throw Error('Heading must be inside a Section!');
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
      throw Error('Unknown level: ' + level);
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

Ora sia `Heading` che `Section` leggono il `LevelContext` per capire quanto sono "profondi". E la `Section` avvolge i suoi figli in `LevelContext` per specificare che tutto ciò che è all'interno di essa si trova a un livello "più profondo".

<Note>

Questo esempio utilizza i livelli dei titoli perché mostrano visivamente come i componenti nidificati possono sovrascrivere il context. Ma il context è utile per molte altre situazioni. Puoi passare verso il basso qualsiasi informazione necessaria all'intero sottoalbero: il tema dei colori corrente, l'utente attualmente loggato e così via.

</Note>

## Passaggi di Context attraverso componenti intermediari {/*context-passes-through-intermediate-components*/}

Puoi inserire quanti componenti desideri tra il componente che fornisce il context e quello che lo utilizza. Questo include sia componenti integrati come `<div>` che componenti costruiti da te.

In questo esempio, lo stesso componente `Post` (con un bordo tratteggiato) viene renderizzato a due diversi livelli di nidificazione. Nota che il `<Heading>` al suo interno ottiene automaticamente il suo livello dalla `<Section>` più vicina:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
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
      throw Error('Heading must be inside a Section!');
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
      throw Error('Unknown level: ' + level);
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

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

Non hai dovuto fare nulla di speciale affinché ciò funzionasse. Una `Section` specifica il context per l'albero al suo interno, quindi puoi inserire un `<Heading>` ovunque e avrà la dimensione corretta. Fai una prova nella sandbox qui sopra!

**Il context ti permette di scrivere componenti che "si adattano all'ambiente circostante" e si mostrano in maniera diversa a seconda di _dove_ (o, in altre parole, _in quale context_) vengono renderizzati.

Il funzionamento del context potrebbe ricordarti [l'ereditarietà delle proprietà CSS.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) In CSS, puoi specificare `color: blue` per un `<div>`, e qualsiasi nodo DOM all'interno di esso, a qualsiasi profondità, erediterà quel colore a meno che qualche altro nodo DOM nel mezzo non lo sovrascriva con `color: green`. In maniera simile, in React, l'unico modo per sovrascrivere un context proveniente dall'alto è avvolgere i figli in un context provider con un valore diverso.

In CSS, diverse proprietà come `color` e `background-color` non si sovrascrivono a vicenda. Puoi impostare il `color` di tutti i `<div>` su rosso senza impattare sul `background-color`. In maniera simile, **diversi context React non si sovrascrivono a vicenda.** Ogni context che crei con `createContext()` è completamente separato dagli altri e lega i componenti che utilizzano e forniscono *quello specifico* context. Un componente può utilizzare o fornire molti context diversi senza problemi.

## Prima che usi il context {/*before-you-use-context*/}

Il context è molto allettante da usare! Tuttavia, ciò significa anche che è troppo facile abusarne. **Il fatto che tu debba passare alcune props a vari livelli di profondità non significa necessariamente che dovresti mettere quelle informazioni in un context.**

Ecco alcune alternative che dovresti considerare prima di utilizzare il context:

1. **Inizia [passando le props.](/learn/passing-props-to-a-component)** Se i tuoi componenti non sono banali, non è insolito passare una dozzina di props attraverso una dozzina di componenti. Potrebbe sembrare un lavoro noioso, ma rende molto chiaro quali componenti utilizzano quali dati! La persona che manterrà il tuo codice sarà grata che tu abbia reso esplicito il flusso dei dati tramite le props.
2. **Estrai i componenti e [passa JSX come `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) a essi.** Se passi alcuni dati attraverso molti strati di componenti intermedi che non utilizzano quei dati (e li passano solo più in basso), spesso significa che hai dimenticato di estrarre alcuni componenti lungo la strada. Ad esempio, forse passi props di dati come `posts` a componenti visivi che non li utilizzano direttamente, come `<Layout posts={posts} />`. Invece, fai in modo che `Layout` accetti `children` come prop e renderizza `<Layout><Posts posts={posts} /></Layout>`. Questo riduce il numero di strati tra il componente che specifica i dati e quello che ne ha bisogno.

Se nessuno di questi approcci fa al caso tuo, considera il context.

## Casi d'uso del context {/*use-cases-for-context*/}

* **Temi:** Se la tua app consente all'utente di cambiare l'aspetto (ad esempio la modalità scura), puoi inserire un context provider alla radice della tua app e utilizzare quel context nei componenti che devono adattare il loro aspetto visivo.
* **Account corrente:** Molti componenti potrebbero avere bisogno di conoscere l'utente attualmente loggato. Metterlo nel context lo rende comodo da leggere ovunque nell'albero. Alcune app consentono anche di operare con più account contemporaneamente (ad esempio, per lasciare un commento come un utente diverso). In questi casi, può essere comodo avvolgere una parte dell'interfaccia utente in un provider nidificato con un valore di account diverso.
* **Routing:** La maggior parte delle soluzioni di routing utilizza internamente il context per memorizzare la rotta corrente. È così che ogni collegamento "sa" se è attivo o no. Se crei il tuo router, potresti voler fare lo stesso.
* **Gestione dello state:** Man mano che la tua app cresce, potresti finire con molto state vicino alla radice dell'app. Molti componenti distanti al di sotto potrebbero volerlo modificare. È comune [usare un reducer insieme al context](/learn/scaling-up-with-reducer-and-context) per gestire uno state complesso e passarlo in basso a componenti distanti senza troppi sforzi.

Il context non è limitato a valori statici. Se passi un valore diverso nella renderizzazione successiva, React aggiornerà tutti i componenti sottostanti che lo leggono! Ecco perché il context spesso è utilizzato in combinazione con lo state.

In generale, se alcune informazioni sono necessarie da componenti distanti in diverse parti dell'albero, quello è un buon indicatore che il context ti aiuterà.

<Recap>

<<<<<<< HEAD
* Il context consente a un componente di fornire alcune informazioni a tutto l'albero sottostante:
* Per passare il context:
  1. Crealo ed esportalo con `export const MyContext = createContext(defaultValue)`.
  2. Passalo all'Hook `useContext(MyContext)` per leggerlo in qualsiasi componente figlio, indipendentemente da quando in profondità sia.
  3. Avvolgi i figli in `<MyContext.Provider value={...}>` per fornirlo da un genitore.
* Il context attraversa qualsiasi componente intermedio.
* Il context ti consente di scrivere componenti che "si adattano all'ambiente circostante".
* Prima di utilizzare il context, prova a passare le props o passare il JSX come `children`.
=======
* Context lets a component provide some information to the entire tree below it.
* To pass context:
  1. Create and export it with `export const MyContext = createContext(defaultValue)`.
  2. Pass it to the `useContext(MyContext)` Hook to read it in any child component, no matter how deep.
  3. Wrap children into `<MyContext value={...}>` to provide it from a parent.
* Context passes through any components in the middle.
* Context lets you write components that "adapt to their surroundings".
* Before you use context, try passing props or passing JSX as `children`.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

</Recap>

<Challenges>

#### Sostituisci il prop drilling con il context {/*replace-prop-drilling-with-context*/}

In questo esempio, selezionare la checkbox modifica la prop `imageSize` passata a ciascun `<PlaceImage>`. Lo state della checkbox è contenuto nel componente di livello superiore `App`, ma ogni `<PlaceImage>` deve essere consapevole di esso.

Attualmente, `App` passa `imageSize` a `List`, che lo passa a ciascun `Place`, che lo passa a `PlaceImage`. Rimuovi la prop `imageSize` e, invece, passala direttamente dal componente `App` a `PlaceImage`.

Puoi dichiarare il context in `Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

Rimuovi la prop `imageSize` da tutti i componenti.

<<<<<<< HEAD
Crea ed esporta `ImageSizeContext` da `Context.js`. Quindi avvolgi `List` in `<ImageSizeContext.Provider value={imageSize}>` per passare il valore in basso, e utilizza `useContext(ImageSizeContext)` per leggerlo in `PlaceImage`:
=======
Create and export `ImageSizeContext` from `Context.js`. Then wrap the List into `<ImageSizeContext value={imageSize}>` to pass the value down, and `useContext(ImageSizeContext)` to read it in the `PlaceImage`:
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

Nota come i componenti intermedi non hanno più bisogno di passare `imageSize`.

</Solution>

</Challenges>
