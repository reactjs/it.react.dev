---
title: cloneElement
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/cloneElement.md).

</Note>

<Pitfall>

L'uso di `cloneElement` è poco comune e può portare a codice fragile. [Vedi le alternative comuni.](#alternatives)

</Pitfall>

<Intro>

`cloneElement` ti permette di creare un nuovo elemento React usando un altro elemento come punto di partenza.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

Chiama `cloneElement` per creare un elemento React basato su `element`, ma con `props` e `children` diversi:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `element`: L'argomento `element` deve essere un elemento React valido. Ad esempio, può essere un nodo JSX come `<Something />`, il risultato di una chiamata a [`createElement`](/reference/react/createElement) o il risultato di un'altra chiamata a `cloneElement`.

* `props`: L'argomento `props` deve essere un oggetto oppure `null`. Se passi `null`, l'elemento clonato conserverà tutte le `element.props` originali. Altrimenti, per ogni prop nell'oggetto `props`, l'elemento restituito "preferirà" il valore da `props` rispetto al valore da `element.props`. Le altre props verranno prese dalle `element.props` originali. Se passi `props.key` o `props.ref`, sostituiranno quelli originali.

* **optional** `...children`: Zero o più nodi figli. Possono essere qualsiasi nodo React, inclusi elementi React, stringhe, numeri, [portali](/reference/react-dom/createPortal), nodi vuoti (`null`, `undefined`, `true` e `false`) e array di nodi React. Se non passi argomenti `...children`, verranno preservati gli `element.props.children` originali.

#### Returns {/*returns*/}

`cloneElement` restituisce un oggetto elemento React con alcune proprietà:

* `type`: Uguale a `element.type`.
* `props`: Il risultato della fusione superficiale di `element.props` con le `props` di override che hai passato.
* `ref`: La `element.ref` originale, a meno che non sia stata sovrascritta da `props.ref`.
* `key`: La `element.key` originale, a meno che non sia stata sovrascritta da `props.key`.

Di solito restituirai l'elemento dal tuo componente o lo renderai come figlio di un altro elemento. Anche se puoi leggere le proprietà dell'elemento, è meglio trattare ogni elemento come opaco dopo la creazione e limitarti a renderizzarlo.

#### Caveats {/*caveats*/}

* Clonare un elemento **non modifica l'elemento originale.**

* Dovresti **passare i children come argomenti multipli a `cloneElement` solo se sono tutti staticamente noti,** come `cloneElement(element, null, child1, child2, child3)`. Se i tuoi children sono dinamici, passa l'intero array come terzo argomento: `cloneElement(element, null, listItems)`. In questo modo React ti [avviserà delle `key` mancanti](/learn/rendering-lists#keeping-list-items-in-order-with-key) per qualsiasi lista dinamica. Per le liste statiche non è necessario, perché non vengono mai riordinate.

* `cloneElement` rende più difficile tracciare il flusso dei dati, quindi **prova le [alternative](#alternatives).**

---

## Usage {/*usage*/}

### Sovrascrivere le props di un elemento {/*overriding-props-of-an-element*/}

Per sovrascrivere le props di un <CodeStep step={1}>elemento React</CodeStep>, passalo a `cloneElement` con le <CodeStep step={2}>props che vuoi sovrascrivere</CodeStep>:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

Qui, l'<CodeStep step={3}>elemento clonato</CodeStep> risultante sarà `<Row title="Cabbage" isHighlighted={true} />`.

**Vediamo un esempio per capire quando è utile.**

Immagina un componente `List` che renderizza i suoi [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) come lista di righe selezionabili con un pulsante "Next" che cambia quale riga è selezionata. Il componente `List` deve renderizzare in modo diverso la `Row` selezionata, quindi clona ogni child `<Row>` che ha ricevuto e aggiunge una prop extra `isHighlighted: true` o `isHighlighted: false`:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex
        })
      )}
```

Supponiamo che il JSX originale ricevuto da `List` sia questo:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

Clonando i suoi children, `List` può passare informazioni extra a ogni `Row` al suo interno. Il risultato è simile a questo:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true}
  />
  <Row
    title="Garlic"
    isHighlighted={false}
  />
  <Row
    title="Apple"
    isHighlighted={false}
  />
</List>
```

Nota come premere "Next" aggiorna lo state di `List` ed evidenzia una riga diversa:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

In sintesi, `List` ha clonato gli elementi `<Row />` che ha ricevuto e ha aggiunto loro una prop extra.

<Pitfall>

Clonare i children rende difficile capire come i dati scorrono nella tua app. Prova una delle [alternative.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Passare dati con una render prop {/*passing-data-with-a-render-prop*/}

Invece di usare `cloneElement`, valuta di accettare una *render prop* come `renderItem`. Qui, `List` riceve `renderItem` come prop. `List` chiama `renderItem` per ogni elemento e passa `isHighlighted` come argomento:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

La prop `renderItem` si chiama "render prop" perché è una prop che specifica come renderizzare qualcosa. Ad esempio, puoi passare un'implementazione di `renderItem` che renderizza una `<Row>` con il valore `isHighlighted` dato:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

Il risultato finale è lo stesso di `cloneElement`:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true}
  />
  <Row
    title="Garlic"
    isHighlighted={false}
  />
  <Row
    title="Apple"
    isHighlighted={false}
  />
</List>
```

Tuttavia, puoi tracciare chiaramente da dove proviene il valore `isHighlighted`.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Questo pattern è preferibile a `cloneElement` perché è più esplicito.

---

### Passare dati tramite context {/*passing-data-through-context*/}

Un'altra alternativa a `cloneElement` è [passare dati tramite context.](/learn/passing-data-deeply-with-context)


Ad esempio, puoi chiamare [`createContext`](/reference/react/createContext) per definire un `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

Il tuo componente `List` può avvolgere ogni elemento che renderizza in un provider `HighlightContext`:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext>
        );
      })}
```

Con questo approccio, `Row` non deve ricevere affatto una prop `isHighlighted`. Legge invece il context:

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

In questo modo il componente chiamante non deve conoscere o preoccuparsi di passare `isHighlighted` a `<Row>`:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

Invece, `List` e `Row` coordinano la logica di evidenziazione tramite context.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Scopri di più sul passaggio di dati tramite context.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### Estrarre la logica in un custom hook {/*extracting-logic-into-a-custom-hook*/}

Un altro approccio che puoi provare è estrarre la logica "non visuale" in un tuo Hook e usare le informazioni restituite dall'Hook per decidere cosa renderizzare. Ad esempio, puoi scrivere un custom hook `useList` come questo:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Poi puoi usarlo così:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

Il flusso dei dati è esplicito, ma lo state è dentro il custom hook `useList` che puoi usare da qualsiasi componente:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Questo approccio è particolarmente utile se vuoi riutilizzare questa logica tra componenti diversi.
