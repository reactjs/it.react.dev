---
title: createElement
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/createElement.md).

</Note>

<Intro>

`createElement` ti permette di creare un elemento React. Funziona come alternativa alla scrittura del [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Chiama `createElement` per creare un elemento React con il `type`, le `props` e i `children` indicati.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `type`: L'argomento `type` deve essere un tipo componente React valido. Ad esempio, può essere una stringa con il nome di un tag (come `'div'` o `'span'`), oppure un componente React (una funzione, una classe o un componente speciale come [`Fragment`](/reference/react/Fragment)).

* `props`: L'argomento `props` deve essere un oggetto oppure `null`. Se passi `null`, verrà trattato come un oggetto vuoto. React creerà un elemento con props che corrispondono alle `props` che hai passato. Nota che `ref` e `key` dall'oggetto `props` sono speciali e *non* saranno disponibili come `element.props.ref` e `element.props.key` sull'`element` restituito. Saranno disponibili come `element.ref` e `element.key`.

* **optional** `...children`: Zero o più nodi figli. Possono essere qualsiasi nodo React, inclusi elementi React, stringhe, numeri, [portals](/reference/react-dom/createPortal), nodi vuoti (`null`, `undefined`, `true` e `false`) e array di nodi React.

#### Returns {/*returns*/}

`createElement` restituisce un oggetto elemento React con alcune proprietà:

* `type`: Il `type` che hai passato.
* `props`: Le `props` che hai passato, tranne `ref` e `key`.
* `ref`: La `ref` che hai passato. Se manca, `null`.
* `key`: La `key` che hai passato, convertita in stringa. Se manca, `null`.

Di solito, restituirai l'elemento dal tuo componente o lo renderai figlio di un altro elemento. Anche se puoi leggere le proprietà dell'elemento, è meglio trattare ogni elemento come opaco dopo la creazione e limitarti a renderizzarlo.

#### Caveats {/*caveats*/}

* Devi **trattare gli elementi React e le loro props come [immutabili](https://it.wikipedia.org/wiki/Struttura_dati_persistente)** e non modificarne mai il contenuto dopo la creazione. In sviluppo, React [congelerà](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) l'elemento restituito e la sua proprietà `props` in modo superficiale per imporre questa regola.

* Quando usi JSX, **devi iniziare un tag con una lettera maiuscola per renderizzare il tuo componente personalizzato.** In altre parole, `<Something />` equivale a `createElement(Something)`, ma `<something />` (minuscolo) equivale a `createElement('something')` (nota che è una stringa, quindi verrà trattato come un tag HTML integrato).

* Dovresti **passare i children come argomenti multipli a `createElement` solo se sono tutti staticamente noti,** come `createElement('h1', {}, child1, child2, child3)`. Se i tuoi children sono dinamici, passa l'intero array come terzo argomento: `createElement('ul', {}, listItems)`. In questo modo React ti [avviserà delle `key` mancanti](/learn/rendering-lists#keeping-list-items-in-order-with-key) per le liste dinamiche. Per le liste statiche non è necessario, perché non vengono mai riordinate.

---

## Usage {/*usage*/}

### Creare un elemento senza JSX {/*creating-an-element-without-jsx*/}

Se non ti piace il [JSX](/learn/writing-markup-with-jsx) o non puoi usarlo nel tuo progetto, puoi usare `createElement` come alternativa.

Per creare un elemento senza JSX, chiama `createElement` con un <CodeStep step={1}>type</CodeStep>, delle <CodeStep step={2}>props</CodeStep> e dei <CodeStep step={3}>children</CodeStep>:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

I <CodeStep step={3}>children</CodeStep> sono opzionali e puoi passarne quanti ne servono (l'esempio sopra ne ha tre). Questo codice mostrerà un'intestazione `<h1>` con un saluto. A titolo di confronto, ecco lo stesso esempio riscritto con JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

Per renderizzare il tuo componente React, passa una funzione come `Greeting` come <CodeStep step={1}>type</CodeStep> invece di una stringa come `'h1'`:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

Con JSX, apparirebbe così:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

Ecco un esempio completo scritto con `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Ed ecco lo stesso esempio scritto con JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Entrambi gli stili di codice vanno bene, quindi puoi usare quello che preferisci per il tuo progetto. Il vantaggio principale di usare JSX rispetto a `createElement` è che è facile vedere quale tag di chiusura corrisponde a quale tag di apertura.

<DeepDive>

#### Cos'è esattamente un elemento React? {/*what-is-a-react-element-exactly*/}

Un elemento è una descrizione leggera di una porzione dell'interfaccia utente. Ad esempio, sia `<Greeting name="Taylor" />` sia `createElement(Greeting, { name: 'Taylor' })` producono un oggetto come questo:

```js
// Leggermente semplificato
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**Nota che creare questo oggetto non renderizza il componente `Greeting` né crea elementi DOM.**

Un elemento React è più simile a una descrizione — un'istruzione per React di renderizzare in seguito il componente `Greeting`. Restituendo questo oggetto dal tuo componente `App`, indichi a React cosa fare dopo.

Creare elementi ha un costo estremamente basso, quindi non devi cercare di ottimizzarlo o evitarlo.

</DeepDive>
