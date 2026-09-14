---
title: Children
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/Children.md).

</Note>

<Pitfall>

L'uso di `Children` è poco comune e può portare a codice fragile. [Vedi le alternative comuni.](#alternatives)

</Pitfall>

<Intro>

`Children` ti permette di manipolare e trasformare il JSX che hai ricevuto come [`children` prop.](/learn/passing-props-to-a-component#passing-jsx-as-children)

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Chiama `Children.count(children)` per contare il numero di children nella struttura dati `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[Vedi altri esempi sotto.](#counting-children)

#### Parameters {/*children-count-parameters*/}

* `children`: Il valore della [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) ricevuto dal tuo componente.

#### Returns {/*children-count-returns*/}

Il numero di nodi all'interno di questi `children`.

#### Caveats {/*children-count-caveats*/}

- I nodi vuoti (`null`, `undefined` e valori booleani), le stringhe, i numeri e gli [elementi React](/reference/react/createElement) contano come nodi individuali. Gli array non contano come nodi individuali, ma i loro children sì. **L'attraversamento non va più a fondo degli elementi React:** non vengono renderizzati e i loro children non vengono attraversati. I [Fragment](/reference/react/Fragment) non vengono attraversati.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Chiama `Children.forEach(children, fn, thisArg?)` per eseguire del codice per ogni child nella struttura dati `children`.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[Vedi altri esempi sotto.](#running-some-code-for-each-child)

#### Parameters {/*children-foreach-parameters*/}

* `children`: Il valore della [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) ricevuto dal tuo componente.
* `fn`: La funzione che vuoi eseguire per ogni child, simile al callback del [metodo `forEach` degli array](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Verrà chiamata con il child come primo argomento e il suo indice come secondo argomento. L'indice parte da `0` e si incrementa a ogni chiamata.
* **optional** `thisArg`: Il [valore di `this`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/this) con cui la funzione `fn` dovrebbe essere chiamata. Se omesso, è `undefined`.

#### Returns {/*children-foreach-returns*/}

`Children.forEach` restituisce `undefined`.

#### Caveats {/*children-foreach-caveats*/}

- I nodi vuoti (`null`, `undefined` e valori booleani), le stringhe, i numeri e gli [elementi React](/reference/react/createElement) contano come nodi individuali. Gli array non contano come nodi individuali, ma i loro children sì. **L'attraversamento non va più a fondo degli elementi React:** non vengono renderizzati e i loro children non vengono attraversati. I [Fragment](/reference/react/Fragment) non vengono attraversati.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Chiama `Children.map(children, fn, thisArg?)` per mappare o trasformare ogni child nella struttura dati `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[Vedi altri esempi sotto.](#transforming-children)

#### Parameters {/*children-map-parameters*/}

* `children`: Il valore della [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) ricevuto dal tuo componente.
* `fn`: La funzione di mapping, simile al callback del [metodo `map` degli array](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Verrà chiamata con il child come primo argomento e il suo indice come secondo argomento. L'indice parte da `0` e si incrementa a ogni chiamata. Devi restituire un nodo React da questa funzione. Può essere un nodo vuoto (`null`, `undefined` o un valore booleano), una stringa, un numero, un elemento React o un array di altri nodi React.
* **optional** `thisArg`: Il [valore di `this`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/this) con cui la funzione `fn` dovrebbe essere chiamata. Se omesso, è `undefined`.

#### Returns {/*children-map-returns*/}

Se `children` è `null` o `undefined`, restituisce lo stesso valore.

Altrimenti, restituisce un array piatto composto dai nodi che hai restituito dalla funzione `fn`. L'array restituito conterrà tutti i nodi che hai restituito, tranne `null` e `undefined`.

#### Caveats {/*children-map-caveats*/}

- I nodi vuoti (`null`, `undefined` e valori booleani), le stringhe, i numeri e gli [elementi React](/reference/react/createElement) contano come nodi individuali. Gli array non contano come nodi individuali, ma i loro children sì. **L'attraversamento non va più a fondo degli elementi React:** non vengono renderizzati e i loro children non vengono attraversati. I [Fragment](/reference/react/Fragment) non vengono attraversati.

- Se restituisci un elemento o un array di elementi con key da `fn`, **le key degli elementi restituiti verranno combinate automaticamente con la key dell'elemento originale corrispondente da `children`.** Quando restituisci più elementi da `fn` in un array, le loro key devono essere uniche solo localmente tra loro.

---

### `Children.only(children)` {/*children-only*/}


Chiama `Children.only(children)` per verificare che `children` rappresenti un singolo elemento React.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Parameters {/*children-only-parameters*/}

* `children`: Il valore della [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) ricevuto dal tuo componente.

#### Returns {/*children-only-returns*/}

Se `children` [è un elemento valido,](/reference/react/isValidElement) restituisce quell'elemento.

Altrimenti, genera un errore.

#### Caveats {/*children-only-caveats*/}

- Questo metodo **genera sempre un errore se passi un array (come il valore restituito da `Children.map`) come `children`.** In altre parole, impone che `children` sia un singolo elemento React, non che sia un array con un singolo elemento.

---

### `Children.toArray(children)` {/*children-toarray*/}

Chiama `Children.toArray(children)` per creare un array dalla struttura dati `children`.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Parameters {/*children-toarray-parameters*/}

* `children`: Il valore della [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) ricevuto dal tuo componente.

#### Returns {/*children-toarray-returns*/}

Restituisce un array piatto di elementi in `children`.

#### Caveats {/*children-toarray-caveats*/}

- I nodi vuoti (`null`, `undefined` e valori booleani) verranno omessi nell'array restituito. **Le key degli elementi restituiti verranno calcolate dalle key degli elementi originali e dal loro livello di annidamento e posizione.** Questo garantisce che l'appiattimento dell'array non introduca cambiamenti nel comportamento.

---

## Usage {/*usage*/}

### Trasformare i children {/*transforming-children*/}

Per trasformare il JSX dei children che il tuo componente [riceve come `children` prop,](/learn/passing-props-to-a-component#passing-jsx-as-children) chiama `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

Nell'esempio sopra, `RowList` avvolge ogni child che riceve in un contenitore `<div className="Row">`. Ad esempio, supponiamo che il componente genitore passi tre tag `<p>` come `children` prop a `RowList`:

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

Poi, con l'implementazione di `RowList` sopra, il risultato finale renderizzato sarà simile a questo:

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map` è simile a [trasformare array con `map()`.](/learn/rendering-lists) La differenza è che la struttura dati `children` è considerata *opaca.* Ciò significa che, anche se a volte è un array, non dovresti assumere che lo sia o che abbia un altro tipo di dato particolare. Per questo motivo, se devi trasformarla, dovresti usare `Children.map`.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### Perché la `children` prop non è sempre un array? {/*why-is-the-children-prop-not-always-an-array*/}

In React, la `children` prop è considerata una struttura dati *opaca*. Ciò significa che non dovresti fare affidamento su come è strutturata. Per trasformare, filtrare o contare i children, dovresti usare i metodi `Children`.

In pratica, la struttura dati `children` è spesso rappresentata internamente come un array. Tuttavia, se c'è un solo child, React non creerà un array aggiuntivo perché ciò porterebbe a un overhead di memoria non necessario. Finché usi i metodi `Children` invece di ispezionare direttamente la `children` prop, il tuo codice non si romperà anche se React cambia il modo in cui la struttura dati è effettivamente implementata.

Anche quando `children` è un array, `Children.map` ha un comportamento speciale utile. Ad esempio, `Children.map` combina le [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) sugli elementi restituiti con le key sui `children` che gli hai passato. Questo garantisce che i children JSX originali non "perdano" le key anche se vengono avvolti come nell'esempio sopra.

</DeepDive>

<Pitfall>

La struttura dati `children` **non include l'output renderizzato** dei componenti che passi come JSX. Nell'esempio sotto, i `children` ricevuti da `RowList` contengono solo due elementi anziché tre:

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

Per questo motivo in questo esempio vengono generati solo due wrapper di riga:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**Non c'è modo di ottenere l'output renderizzato di un componente interno** come `<MoreRows />` quando manipoli `children`. Per questo motivo [di solito è meglio usare una delle soluzioni alternative.](#alternatives)

</Pitfall>

---

### Eseguire del codice per ogni child {/*running-some-code-for-each-child*/}

Chiama `Children.forEach` per iterare su ogni child nella struttura dati `children`. Non restituisce alcun valore ed è simile al [metodo `forEach` degli array.](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) Puoi usarlo per eseguire logica personalizzata, come costruire il tuo array.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

Come accennato in precedenza, non c'è modo di ottenere l'output renderizzato di un componente interno quando manipoli `children`. Per questo motivo [di solito è meglio usare una delle soluzioni alternative.](#alternatives)

</Pitfall>

---

### Contare i children {/*counting-children*/}

Chiama `Children.count(children)` per calcolare il numero di children.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

Come accennato in precedenza, non c'è modo di ottenere l'output renderizzato di un componente interno quando manipoli `children`. Per questo motivo [di solito è meglio usare una delle soluzioni alternative.](#alternatives)

</Pitfall>

---

### Convertire i children in un array {/*converting-children-to-an-array*/}

Chiama `Children.toArray(children)` per trasformare la struttura dati `children` in un normale array JavaScript. Questo ti permette di manipolare l'array con i metodi array integrati come [`filter`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) o [`reverse`.](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

Come accennato in precedenza, non c'è modo di ottenere l'output renderizzato di un componente interno quando manipoli `children`. Per questo motivo [di solito è meglio usare una delle soluzioni alternative.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

<Note>

Questa sezione descrive alternative all'API `Children` (con la `C` maiuscola) che si importa così:

```js
import { Children } from 'react';
```

Non confonderla con [l'uso della `children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) (con la `c` minuscola), che è buona pratica ed è incoraggiato.

</Note>

### Esporre più componenti {/*exposing-multiple-components*/}

Manipolare i children con i metodi `Children` spesso porta a codice fragile. Quando passi children a un componente in JSX, di solito non ti aspetti che il componente manipoli o trasformi i singoli children.

Quando puoi, cerca di evitare l'uso dei metodi `Children`. Ad esempio, se vuoi che ogni child di `RowList` sia avvolto in `<div className="Row">`, esporta un componente `Row` e avvolgi manualmente ogni riga così:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

A differenza dell'uso di `Children.map`, questo approccio non avvolge automaticamente ogni child. **Tuttavia, questo approccio ha un vantaggio significativo rispetto al [precedente esempio con `Children.map`](#transforming-children) perché funziona anche se continui a estrarre altri componenti.** Ad esempio, funziona ancora se estrai il tuo componente `MoreRows`:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Questo non funzionerebbe con `Children.map` perché "vedrebbe" `<MoreRows />` come un singolo child (e una singola riga).

---

### Accettare un array di oggetti come prop {/*accepting-an-array-of-objects-as-a-prop*/}

Puoi anche passare esplicitamente un array come prop. Ad esempio, questo `RowList` accetta un array `rows` come prop:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Poiché `rows` è un normale array JavaScript, il componente `RowList` può usare metodi array integrati come [`map`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/map) su di esso.

Questo pattern è particolarmente utile quando vuoi poter passare più informazioni come dati strutturati insieme ai children. Nell'esempio sotto, il componente `TabSwitcher` riceve un array di oggetti come prop `tabs`:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

A differenza del passaggio dei children come JSX, questo approccio ti permette di associare alcuni dati extra come `header` a ogni elemento. Poiché lavori direttamente con `tabs`, ed è un array, non hai bisogno dei metodi `Children`.

---

### Chiamare una render prop per personalizzare la renderizzazione {/*calling-a-render-prop-to-customize-rendering*/}

Invece di produrre JSX per ogni singolo elemento, puoi anche passare una funzione che restituisce JSX e chiamarla quando necessario. In questo esempio, il componente `App` passa una funzione `renderContent` al componente `TabSwitcher`. Il componente `TabSwitcher` chiama `renderContent` solo per la tab selezionata:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

Una prop come `renderContent` si chiama *render prop* perché è una prop che specifica come renderizzare un pezzo dell'interfaccia utente. Tuttavia, non c'è nulla di speciale: è una prop normale che per caso è una funzione.

Le render props sono funzioni, quindi puoi passare loro informazioni. Ad esempio, questo componente `RowList` passa l'`id` e l'`index` di ogni riga alla render prop `renderRow`, che usa `index` per evidenziare le righe pari:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row>
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

Questo è un altro esempio di come componenti genitore e figlio possono cooperare senza manipolare i children.

---

## Troubleshooting {/*troubleshooting*/}

### Passo un componente personalizzato, ma i metodi `Children` non mostrano il suo risultato di renderizzazione {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Supponiamo di passare due children a `RowList` così:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

Se esegui `Children.count(children)` dentro `RowList`, otterrai `2`. Anche se `MoreRows` renderizza 10 elementi diversi, o se restituisce `null`, `Children.count(children)` sarà comunque `2`. Dal punto di vista di `RowList`, "vede" solo il JSX che ha ricevuto. Non "vede" l'interno del componente `MoreRows`.

Questa limitazione rende difficile estrarre un componente. Per questo motivo le [alternative](#alternatives) sono preferite all'uso di `Children`.
