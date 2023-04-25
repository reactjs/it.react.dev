---
title: Thinking in React
---

<Intro>

React can change how you think about the designs you look at and the apps you build. When you build a user interface with React, you will first break it apart into pieces called *components*. Then, you will describe the different visual states for each of your components. Finally, you will connect your components together so that the data flows through them. In this tutorial, we’ll guide you through the thought process of building a searchable product data table with React.

</Intro>

## Start with the mockup {/*start-with-the-mockup*/}

Imagine that you already have a JSON API and a mockup from a designer.

The JSON API returns some data that looks like this:

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

The mockup looks like this:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

To implement a UI in React, you will usually follow the same five steps.

## Step 1: Break the UI into a component hierarchy {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Start by drawing boxes around every component and subcomponent in the mockup and naming them. If you work with a designer, they may have already named these components in their design tool. Ask them!

Depending on your background, you can think about splitting up a design into components in different ways:

* **Programming**--use the same techniques for deciding if you should create a new function or object. One such technique is the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), that is, a component should ideally only do one thing. If it ends up growing, it should be decomposed into smaller subcomponents. 
* **CSS**--consider what you would make class selectors for. (However, components are a bit less granular.)
* **Design**--consider how you would organize the design's layers.

If your JSON is well-structured, you'll often find that it naturally maps to the component structure of your UI. That's because UI and data models often have the same information architecture--that is, the same shape. Separate your UI into components, where each component matches one piece of your data model.

There are five components on this screen:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (grey) contains the entire app.
2. `SearchBar` (blue) receives the user input.
3. `ProductTable` (lavender) displays and filters the list according to the user input.
4. `ProductCategoryRow` (green) displays a heading for each category.
5. `ProductRow`	(yellow) displays a row for each product.

</CodeDiagram>

</FullWidth>

If you look at `ProductTable` (lavender), you'll see that the table header (containing the "Name" and "Price" labels) isn't its own component. This is a matter of preference, and you could go either way. For this example, it is a part of `ProductTable` because it appears inside the `ProductTable`'s list. However, if this header grows to be complex (e.g., if you add sorting), you can move it into its own `ProductTableHeader` component.

Now that you've identified the components in the mockup, arrange them into a hierarchy. Components that appear within another component in the mockup should appear as a child in the hierarchy:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Step 2: Build a static version in React {/*step-2-build-a-static-version-in-react*/}

Now that you have your component hierarchy, it's time to implement your app. The most straightforward approach is to build a version that renders the UI from your data model without adding any interactivity... yet! It's often easier to build the static version first and add interactivity later. Building a static version requires a lot of typing and no thinking, but adding interactivity requires a lot of thinking and not a lot of typing.

To build a static version of your app that renders your data model, you'll want to build [components](/learn/your-first-component) that reuse other components and pass data using [props.](/learn/passing-props-to-a-component) Props are a way of passing data from parent to child. (If you're familiar with the concept of [state](/learn/state-a-components-memory), don't use state at all to build this static version. State is reserved only for interactivity, that is, data that changes over time. Since this is a static version of the app, you don't need it.)

You can either build "top down" by starting with building the components higher up in the hierarchy (like `FilterableProductTable`) or "bottom up" by working from components lower down (like `ProductRow`). In simpler examples, it’s usually easier to go top-down, and on larger projects, it’s easier to go bottom-up.

<Sandpack>

```jsx App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(If this code looks intimidating, go through the [Quick Start](/learn/) first!)

After building your components, you'll have a library of reusable components that render your data model. Because this is a static app, the components will only return JSX. The component at the top of the hierarchy (`FilterableProductTable`) will take your data model as a prop. This is called _one-way data flow_ because the data flows down from the top-level component to the ones at the bottom of the tree.

<Pitfall>

At this point, you should not be using any state values. That’s for the next step!

</Pitfall>

## Step 3: Find the minimal but complete representation of UI state {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

To make the UI interactive, you need to let users change your underlying data model. You will use *state* for this.

Think of state as the minimal set of changing data that your app needs to remember. The most important principle for structuring state is to keep it [DRY (Don't Repeat Yourself).](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Figure out the absolute minimal representation of the state your application needs and compute everything else on-demand. For example, if you're building a shopping list, you can store the items as an array in state. If you want to also display the number of items in the list, don't store the number of items as another state value--instead, read the length of your array.

Now think of all of the pieces of data in this example application:

1. The original list of products
2. The search text the user has entered
3. The value of the checkbox
4. The filtered list of products

Which of these are state? Identify the ones that are not:

* Does it **remain unchanged** over time? If so, it isn't state.
* Is it **passed in from a parent** via props? If so, it isn't state.
* **Can you compute it** based on existing state or props in your component? If so, it *definitely* isn't state!

What's left is probably state.

Let's go through them one by one again:

1. The original list of products is **passed in as props, so it's not state.** 
2. The search text seems to be state since it changes over time and can't be computed from anything.
3. The value of the checkbox seems to be state since it changes over time and can't be computed from anything.
4. The filtered list of products **isn't state because it can be computed** by taking the original list of products and filtering it according to the search text and value of the checkbox.

This means only the search text and the value of the checkbox are state! Nicely done!

<DeepDive>

#### Props vs State {/*props-vs-state*/}

Esistono due tipi di "modelli" di dati in React: props e state. Sono molto diversi tra di loro

* [Le **Props** sono come argomenti che passi](/learn/passing-props-to-a-component) ad una funzione.  Permettono a un componente genitore di passare dei dati ad un componente figlio e di personalizzarne l'aspetto. Per esempio, un `Form` può passare una prop `color` ad un `Button`.
* [**Lo State** è come se fosse la memoria di un componente.](/learn/state-a-components-memory) Permette a un componente di tenere traccia di alcune informazioni e modificarle in risposta ad interazioni. Per esempio, un `Button` potrebbe tenere traccia dello state `isHovered`.

Props e state sono diversi, ma lavorano insieme. Un componente genitore terrà spesso alcune informazioni nello state (in modo che possa modificarle) e *passarle* ai componenti figlio come props. È normale se questa differenza ti sembra ancora un po' confusa alla prima lettura. Ci vuole un po' di pratica per farla rimanere impressa!

</DeepDive>

## Step 4: Identifica dove lo state dovrebbe vivere {/*step-4-identify-where-your-state-should-live*/}

Dopo aver identificato il valore minimo dello state della tua applicazione, devi identificare quale componente è responsabile per modificarlo, o *possiede* lo state. Ricorda: React usa un flusso di dati unidirezionale, passando i dati dalla gerarchia dei componenti da genitore a componente figlio. Potrebbe non essere immediatamente chiaro quale componente dovrebbe possedere quale stato. Questo concetto può essere difficile da capire se per te è nuovo, ma puoi capirlo seguendo questi passaggi!

Per ogni pezzo di state nella tua applicazione:

1. Identifica *tutti* i componenti che mostrano qualcosa basandosi su quello state.
2. Trova il loro componente genitore comune più vicino--un componente sopra di loro nella gerarchia.
3. Decidi dove lo state dovrebbe vivere:
    1. Spesso, puoi mettere lo state direttamente nel loro genitore comune.
    2. Puoi anche mettere lo state in qualche componente sopra il loro genitore comune.
    3. Se non puoi trovare un componente in cui abbia senso possedere lo state, crea un nuovo componente esclusivamente per contenere lo state e aggiungilo in qualche punto della gerarchia sopra il componente genitore comune.

Nello step precedente, hai identificato due pezzi di state in questa applicazione: il testo di input di ricerca e il valore della checkbox. In questo esempio, appaiono sempre insieme, quindi ha senso metterli nello stesso posto.

Adesso eseguiamo la nostra strategia per essi:

1. **Identifica i componenti che usano lo state:**
    * `ProductTable` ha bisogno di filtrare la lista dei prodotti in base a quei valori di state (testo di ricerca e valore della checkbox).
    * `SearchBar` ha bisogno di mostrare lo state (testo di ricerca e valore della checkbox).
1. **Trova il loro genitore comune:** Il primo componente genitore che entrambi i componenti condividono è `FilterableProductTable`.
2. **Decidi dove vive lo state**: Terremo i valori dello state del testo del filtro e della checkbox in `FilterableProductTable`.

Quindi i valori di state vivranno in `FilterableProductTable`.

Aggiungi lo state al componente con l'[`useState()` Hook.](/reference/react/useState) Gli Hooks sono funzioni speciali che ti permettono di "collegarti" a React. Aggiungi due variabili state all'inizio di `FilterableProductTable` e specifica il loro stato iniziale:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

Poi, passa `filterText` e `inStockOnly` a `ProductTable` e `SearchBar` come props:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Puoi iniziare a vedere come si comporterà la tua applicazione. Modifica il valore iniziale di `filterText` da `useState('')` a `useState('fruit')` nel codice sandbox qui sotto. Vedrai sia il testo di input di ricerca che la tabella si aggiornano:

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Mostra solo prodotti in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Nota che la modifica del form non funziona ancora. Nello sandbox sopra c'è un errore di console che spiega perché:

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

Nel sandbox sopra, `ProductTable` e `SearchBar` leggono le props `filterText` e `inStockOnly` per renderizzare la tabella, l'input e checkbox. Ad esempio, ecco come `SearchBar` popola il valore dell'input:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

Tuttavia, non hai aggiunto alcun codice per rispondere alle azioni dell'utente come la digitazione. Questo sarà il tuo ultimo passaggio.

## Step 5: Aggiungi il flusso di dati inverso {/*step-5-add-inverse-data-flow*/}

Attualmente la tua applicazione viene visualizzata correttamente con le props e lo state che fluiscono verso il basso nella gerarchia. Ma per modificare lo state in base all'input dell'utente, è necessario supportare il flusso di dati anche in senso inverso: i componenti del modulo che si trovano più in basso nell'albero devono aggiornare lo state in `FilterableProductTable`.

React rende questo flusso di dati in modo esplicito, ma richiede un po' più di scrittura rispetto al two-way data binding. Se provi a digitare o a spuntare la checkbox nell'esempio qui sopra, vedrai che React ignora la tua input. Questo è voluto. Scrivendo `<input value={filterText} />`, hai impostato la prop `value` dell'`input` per essere sempre uguale allo stato `filterText` passato da `FilterableProductTable`. Poiché lo stato `filterText` non viene mai impostato, l'input non cambia mai.

L'obiettivo è che ogni volta che l'utente modifica gli input del form lo state si aggiorni per riflettere tali modifiche. Lo state è di proprietà di `FilterableProductTable`, quindi solo esso può chiamare `setFilterText` e `setInStockOnly`. Per consentire a `SearchBar` di aggiornare lo state di `FilterableProductTable`, è necessario passare queste funzioni a `SearchBar`:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

All'interno di `SearchBar`, aggiungi l'evento `onChange` e imposta lo state del genitore da esso:


```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="Search..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

Adesso l'applicazione funziona completamente!
Now the application fully works!

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Mostra solo prodotti in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Puoi imparare tutto su come gestire gli eventi e aggiornare lo state nella sezione [Adding Interactivity](/learn/adding-interactivity).

## Come procedere {/*where-to-go-from-here*/}

Questa è stata una breve introduzione su come pensare alla costruzione di componenti e applicazioni con React. Puoi [iniziare un progetto React](/learn/installation) subito o [approfondire la sintassi](/learn/describing-the-ui) usata in questo tutorial.

