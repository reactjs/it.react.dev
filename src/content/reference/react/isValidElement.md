---
title: isValidElement
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/isValidElement.md).

</Note>

<Intro>

`isValidElement` ti permette di verificare se un valore è un elemento React.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Chiama `isValidElement(value)` per verificare se `value` è un elemento React.

```js
import { isValidElement, createElement } from 'react';

// ✅ Elementi React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Non sono elementi React
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `value`: Il valore che vuoi verificare. Può essere di qualsiasi tipo.

#### Returns {/*returns*/}

`isValidElement` restituisce `true` se `value` è un elemento React. Altrimenti, restituisce `false`.

#### Caveats {/*caveats*/}

* **Solo i [tag JSX](/learn/writing-markup-with-jsx) e gli oggetti restituiti da [`createElement`](/reference/react/createElement) sono considerati elementi React.** Ad esempio, anche se un numero come `42` è un *nodo React* valido (e può essere restituito da un componente), non è un elemento React valido. Anche gli array e i [portali](/reference/react-dom/createPortal) creati con [`createPortal`](/reference/react-dom/createPortal) *non* sono considerati elementi React.

---

## Usage {/*usage*/}

### Verificare se qualcosa è un elemento React {/*checking-if-something-is-a-react-element*/}

Chiama `isValidElement` per verificare se un valore è un *elemento React.*

Gli elementi React sono:

- Valori prodotti scrivendo un [tag JSX](/learn/writing-markup-with-jsx)
- Valori prodotti chiamando [`createElement`](/reference/react/createElement)

Per gli elementi React, `isValidElement` restituisce `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ I tag JSX sono elementi React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ I valori restituiti da createElement sono elementi React
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Qualsiasi altro valore, come stringhe, numeri o oggetti e array arbitrari, non è un elemento React.

Per questi, `isValidElement` restituisce `false`:

```js
// ❌ Questi *non* sono elementi React
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

È molto raro aver bisogno di `isValidElement`. È soprattutto utile se stai chiamando un'altra API che accetta *solo* elementi (come fa [`cloneElement`](/reference/react/cloneElement)) e vuoi evitare un errore quando il tuo argomento non è un elemento React.

A meno che tu non abbia un motivo molto specifico per aggiungere un controllo con `isValidElement`, probabilmente non ne hai bisogno.

<DeepDive>

#### Elementi React vs nodi React {/*react-elements-vs-react-nodes*/}

Quando scrivi un componente, puoi restituire qualsiasi tipo di *nodo React*:

```js
function MyComponent() {
  // ... puoi restituire qualsiasi nodo React ...
}
```

Un nodo React può essere:

- Un elemento React creato come `<div />` o `createElement('div')`
- Un [portale](/reference/react-dom/createPortal) creato con [`createPortal`](/reference/react-dom/createPortal)
- Una stringa
- Un numero
- `true`, `false`, `null` o `undefined` (che non vengono visualizzati)
- Un array di altri nodi React

**Nota `isValidElement` verifica se l'argomento è un *elemento React,* non se è un nodo React.** Ad esempio, `42` non è un elemento React valido. Tuttavia, è un nodo React perfettamente valido:

```js
function MyComponent() {
  return 42; // Va bene restituire un numero da un componente
}
```

Per questo non dovresti usare `isValidElement` per verificare se qualcosa può essere renderizzato.

</DeepDive>
