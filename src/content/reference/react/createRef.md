---
title: createRef
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/createRef.md).

</Note>

<Pitfall>

`createRef` è usato soprattutto per i [componenti classe](/reference/react/Component). I componenti funzione di solito usano [`useRef`](/reference/react/useRef).

</Pitfall>

<Intro>

`createRef` crea un oggetto [ref](/learn/referencing-values-with-refs) che può contenere un valore arbitrario.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createRef()` {/*createref*/}

Chiama `createRef` per dichiarare una [ref](/learn/referencing-values-with-refs) all'interno di un [componente classe](/reference/react/Component).

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

`createRef` non accetta parametri.

#### Returns {/*returns*/}

`createRef` restituisce un oggetto con una singola proprietà:

* `current`: inizialmente è impostato su `null`. Puoi cambiarlo in seguito con un altro valore. Se passi l'oggetto ref a React come attributo `ref` su un nodo JSX, React imposterà la sua proprietà `current`.

#### Caveats {/*caveats*/}

* `createRef` restituisce sempre un oggetto *diverso*. Equivale a scrivere `{ current: null }` manualmente.
* In un componente funzione, probabilmente preferirai [`useRef`](/reference/react/useRef), che restituisce sempre lo stesso oggetto.
* `const ref = useRef()` equivale a `const [ref, _] = useState(() => createRef(null))`.

---

## Usage {/*usage*/}

### Dichiarare una ref in un componente classe {/*declaring-a-ref-in-a-class-component*/}

Per dichiarare una ref all'interno di un [componente classe](/reference/react/Component), chiama `createRef` e assegna il risultato a un campo di classe:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Se passi `ref={this.inputRef}` a un `<input>` nel tuo JSX, React popolerà `this.inputRef.current` con il nodo DOM dell'input. Ad esempio, ecco come creare un pulsante che mette a fuoco l'input:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Metti a fuoco l'input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` è usato soprattutto per i [componenti classe](/reference/react/Component). I componenti funzione di solito usano [`useRef`](/reference/react/useRef).

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrare da una classe con `createRef` a una funzione con `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Nel codice nuovo consigliamo di usare componenti funzione al posto dei [componenti classe](/reference/react/Component). Se hai componenti classe esistenti che usano `createRef`, ecco come convertirli. Questo è il codice originale:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Metti a fuoco l'input
        </button>
      </>
    );
  }
}
```

</Sandpack>

Quando [converti questo componente da classe a funzione](/reference/react/Component#alternatives), sostituisci le chiamate a `createRef` con chiamate a [`useRef`](/reference/react/useRef):

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Metti a fuoco l'input
      </button>
    </>
  );
}
```

</Sandpack>
