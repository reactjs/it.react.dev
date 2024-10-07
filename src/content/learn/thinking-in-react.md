---
title: Pensare in React
---

<Intro>

React può cambiare il modo in cui pensi ai design che vedi e alle applicazioni che costruisci. Quando costruisci un'interfaccia utente con React, prima dividerai il tutto in parti chiamate *componenti*. Poi, descriverai gli stati visivi diversi per ogni componente. Infine, collegherai i tuoi componenti in modo che i dati fluiscono attraverso di essi. In questo tutorial, ti guideremo attraverso il processo di pensiero per costruire una tabella di dati prodotto ricercabile con React.

</Intro>

## Inizia con il mockup {/*start-with-the-mockup*/}

Immagina che tu abbia già una API JSON e un mockup di un designer.

L'API JSON ritorna alcuni dati come i seguenti:

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

Il mockup appare così:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Per implementare una UI in React, di solito segui i seguenti cinque step.

## Step 1: Dividi la UI in una gerarchia di componenti {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Inizia disegnando rettangoli intorno a ogni componente e sottocomponente nel mockup e assegna loro un nome. Se lavori con un designer, potrebbe avere già nominato questi componenti nel suo tool di design. Chiediglieli!

A seconda del tuo background, puoi pensare di dividere un design in componenti in diversi modi:

* **Programming**--usa lo stesso metodo per decidere se creare una nuova funzione o un nuovo oggetto. Uno di questi metodi è il [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), ovvero un componente dovrebbe fare solo una cosa. Se cresce, dovrebbe essere decomposto in sottocomponenti più piccoli.
* **CSS**--considera cosa farebbe un selettore di classe. (Tuttavia, i componenti sono un po' meno granulari.)
* **Design**--considera come organizzare i livelli del design.

Se il tuo JSON è strutturato bene, noterai che spesso mappa naturalmente la struttura dei componenti della tua UI. Questo perché la UI e i modelli di dati spesso hanno la stessa architettura dell'informazione--ovvero la stessa forma. Separa la tua UI in componenti, in cui ogni componente corrisponde a una parte del tuo modello di dati.

In questa schermata ci sono cinque componenti:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (grigio) contiene l'intera app.
2. `SearchBar` (blu) riceve l'input dell'utente.
3. `ProductTable` (lavanda) mostra e filtra la lista in relazione all'input dell'utente.
4. `ProductCategoryRow` (verde) mostra un titolo per ogni categoria.
5. `ProductRow`	(giallo) mostra una riga per ogni prodotto.

</CodeDiagram>

</FullWidth>

Se guardi il `ProductTable` (lavanda), noterai che l'intestazione della tabella (che contiene le label "Name" e "Price") non ha un proprio componente. Questa è una questione di preferenza e puoi scegliere entrambe le opzioni. Per questo esempio, fa parte di `ProductTable` perché appare all'interno della lista di `ProductTable`. Tuttavia, se questa intestazione diventa complessa (ad esempio, se aggiungi la possibilità di ordinare), puoi spostarla in un proprio componente `ProductTableHeader`.

Adesso che hai identificato i componenti nel mockup, organizzali in una gerarchia. I componenti che appaiono all'interno di un altro componente nel mockup dovrebbero apparire come figli:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Step 2: Costruisci una versione statica in React {/*step-2-build-a-static-version-in-react*/}

Adesso che hai la tua gerarchia di componenti, è tempo di implementare la tua app. La soluzione più semplice è costruire una versione statica che renderizza la UI dal tuo modello di dati senza aggiungere alcuna interattività... almeno per ora! È spesso più facile costruire la versione statica prima e aggiungere interattività dopo. Costruire una versione statica richiede molta scrittura e nessuna riflessione, mentre aggiungere interattività richiede molta riflessione e poca scrittura.

Per costruire una versione statica della tua app che renderizza il tuo modello di dati, vorrai costruire [componenti](/learn/your-first-component) che riutilizzano altri componenti e passano dati usando [props.](/learn/passing-props-to-a-component) Le Props sono un modo per passare dati da genitore a figlio. (Se hai familiarità con il concetto di [state](/learn/state-a-components-memory), non usare lo state per costruire questa versione statica. Lo state è riservato solo all'interattività, ovvero i dati che cambiano nel tempo. Poiché questa è una versione statica dell'app, non ne hai bisogno.)

Puoi costruirli "dall' alto verso il basso" iniziando a costruire i componenti più in alto nella gerarchia (come `FilterableProductTable`) o "dal basso verso l'alto" iniziando dai componenti più bassi (come `ProductRow`). In esempi più semplici, è solitamente più facile iniziare dall'alto verso il basso, e nei progetti più grandi è più facile iniziare dal basso verso l'alto.

<Sandpack>

```jsx src/App.js
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

(Se questo codice ti spaventa, leggi prima l'[Avvio Rapido](/learn/)!)

Dopo aver costruito i tuoi componenti, avrai una libreria di componenti riutilizzabili che renderizzano il tuo modello di dati. Dato che questa è un'app statica, i componenti restituiranno solo JSX. Il componente alla cima della gerarchia (`FilterableProductTable`) prenderà il tuo modello di dati come prop. Questo viene chiamato _one-way data flow_ (flusso di dati unidirezionale) perché i dati fluiscono dal componente di livello superiore a quelli al fondo dell'albero.

<Pitfall>

A questo punto, non dovresti usare alcun valore di state. Lo farai nel prossimo step!

</Pitfall>

## Step 3: Trova la minima ma completa rappresentazione dello state della UI {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Per rendere la UI interattiva, hai bisogno di permettere agli utenti di modificare il tuo modello di dati sottostante. Per questo userai lo *state*.

Immagina lo state come il set minimo di dati modificabili che la tua app deve ricordare per funzionare. Il principio più importante per la struttura dello state è quello di mantenerlo [DRY (Don't Repeat Yourself).](https://it.wikipedia.org/wiki/Don%27t_repeat_yourself) Trova la rappresentazione minima assoluta dello state che la tua applicazione ha bisogno e calcola tutto il resto on-demand. Per esempio, se stai costruendo una lista della spesa, puoi memorizzare gli elementi come un array nello state. Se vuoi anche visualizzare il numero di elementi nella lista, non memorizzare il numero di elementi come un altro valore di state--invece, leggi la lunghezza del tuo array.

Adesso immaginati tutti i pezzi di dati in questa applicazione d'esempio:

1. La lista originale di prodotti
2. Il testo di ricerca che l'utente ha inserito
3. Il valore della checkbox
4. La lista filtrata di prodotti

Quale di questi può essere state? Identifica quelli che non lo sono:

* **Rimane invariato** nel tempo? Allora non è state.
* Viene **passato da un componente genitore** tramite props? Allora non è state.
* **Puoi calcolarlo** basandoti su uno state diverso o da props nel tuo componente? Allora **sicuramente** non è state!

Quello che è rimasto probabilmente può considerarsi state.

Analizziamo di nuovo questi dati uno alla volta:

1. La lista originale di prodotti è **passata tramite props, quindi non è state.**
2. Il testo di ricerca sembra essere state visto che cambia nel tempo e non può essere ricavato dal nulla.
3. Il valore della checkbox sembra essere state visto che cambia nel tempo e non può essere ricavato dal nulla.
4. La lista filtrata dei prodotti **non è state perchè può essere calcolata** prendendo la lista originale dei prodotti e filtrandola in base al testo di ricerca e al valore della checkbox.

Questo significa che solo il testo di ricerca e il valore della checkbox sono state! Ben fatto!

<DeepDive>

#### Props vs State {/*props-vs-state*/}

Esistono due tipi di "modelli" di dati in React: props e state. Sono molto diversi tra di loro:

* [Le **Props** sono come argomenti che passi](/learn/passing-props-to-a-component) ad una funzione. Permettono ad un componente genitore di passare dei dati ad un componente figlio e di personalizzarne l'aspetto. Per esempio, un `Form` può passare una prop `color` ad un `Button`.
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
2. **Trova il loro genitore comune:** Il primo componente genitore che entrambi i componenti condividono è `FilterableProductTable`.
3. **Decidi dove vive lo state**: Terremo i valori dello state del testo del filtro e della checkbox in `FilterableProductTable`.

Quindi i valori di state vivranno in `FilterableProductTable`.

Aggiungi lo state al componente con l'[Hook `useState()`.](/reference/react/useState) Gli Hooks sono funzioni speciali che ti permettono di "collegarti" a React. Aggiungi due variabili state all'inizio di `FilterableProductTable` e specifica il loro stato iniziale:

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

Puoi iniziare a vedere come si comporterà la tua applicazione. Modifica il valore iniziale di `filterText` da `useState('')` a `useState('fruit')` nel codice sandbox qui sotto. Vedrai che sia il testo di input di ricerca che la tabella si aggiornano:

<Sandpack>

```jsx src/App.js
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
        Only show products in stock
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

Nota che la modifica del form non funziona ancora. Nel sandbox sopra c'è un errore di console che spiega perché:

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

Nel sandbox sopra, `ProductTable` e `SearchBar` leggono le props `filterText` e `inStockOnly` per renderizzare la tabella, l'input e la checkbox. Ad esempio, ecco come `SearchBar` popola il valore dell'input:

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

Attualmente la tua applicazione viene visualizzata correttamente con le props e lo state che fluiscono verso il basso nella gerarchia. Ma per modificare lo state in base all'input dell'utente, è necessario supportare il flusso di dati anche in senso inverso: i componenti del form che si trovano più in basso nell'albero devono aggiornare lo state in `FilterableProductTable`.

React rende questo flusso di dati in modo esplicito, ma richiede un po' più di scrittura rispetto al two-way data binding. Se provi a digitare o a spuntare la checkbox nell'esempio qui sopra, vedrai che React ignora il tuo input. Questo è voluto. Scrivendo `<input value={filterText} />`, hai impostato la prop `value` dell'`input` per essere sempre uguale allo stato `filterText` passato da `FilterableProductTable`. Poiché lo stato `filterText` non viene mai impostato, l'input non cambia mai.

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

```js {4,5,13,19}
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
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

Adesso l'applicazione funziona completamente!

<Sandpack>

```jsx src/App.js
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
        Only show products in stock
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

