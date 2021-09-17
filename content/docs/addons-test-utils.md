---
id: test-utils
title: Test Utilities
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Importazione**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 con npm
```

## Panoramica {#overview}

`ReactTestUtils` rende semplice testare i componenti React all'interno del framework di test che preferisci. In Facebook usiamo [Jest](https://facebook.github.io/jest/) per scrivere test in JavaScript. Impara come utilizzare Jest tramite il sito ufficiale [React Tutorial](https://jestjs.io/docs/tutorial-react).

> Nota:
>
> Suggeriamo l'utilizzo di [React Testing Library](https://testing-library.com/react), che è una libreria concepita per abilitare e favorire la scrittura di test che simulano il reale utilizzo dei componenti.
> 
> Per le versioni di React <= 16, la libreria [Enzyme](https://airbnb.io/enzyme/) semplifica le operazioni di verifica, manipolazione ed analisi dell'output dei tuoi componenti.



 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## Riferimento {#reference}

### `act()` {#act}

Per preparare un componente per le verifiche, racchiudi il codice che lo renderizza e lo aggiorna all'interno di una chiamata `act()`. Questo permette di simulare un comportamento che si avvicina a quello reale di React.

>Nota
>
>Se utilizzi `react-test-renderer`, hai a disposizione un modulo `act` che funziona allo stesso modo.

Ad esempio, prendiamo in considerazione il seguente componente `Counter`:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `Hai cliccato ${this.state.count} volte`;
  }
  componentDidUpdate() {
    document.title = `Hai cliccato ${this.state.count} volte`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>Hai cliccato {this.state.count} volte</p>
        <button onClick={this.handleClick}>
          Cliccami
        </button>
      </div>
    );
  }
}
```

Possiamo testarlo in questo modo:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Testa il primo render e componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Hai cliccato 0 volte');
  expect(document.title).toBe('Hai cliccato 0 volte');

  // Testa il secondo render e componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Hai cliccato 1 volte');
  expect(document.title).toBe('Hai cliccato 1 volte');
});
```

- Non dimenticare che generare degli eventi DOM ha effetto solamente quando il contenitore dello stesso è aggiunto al `document`. Puoi usare una libreria come [React Testing Library](https://testing-library.com/react) per aumentare la pulizia del codice.
- La documentazione sulle [`ricette`](/docs/testing-recipes.html) contiene maggiori dettagli su come funziona `act()`, insieme ad esempi d'uso.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Passare il mock di un componente a questo metodo consente di migliorarlo, mettendo a disposizione delle funzionalità che permettono di utilizzare quest'ultimo come un componente React base. Il componente diventerà quindi un semplice `<div>` (o un altro tag se è presente `mockTagNme`), che conterrà degli eventuali componenti figli.

> Nota:
>
<<<<<<< HEAD
> `mockComponent()` è un'API legacy. Raccomandiamo l'utilizzo di [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).
=======
> `mockComponent()` is a legacy API. We recommend using [`jest.mock()`](https://jestjs.io/docs/tutorial-react-native#mock-native-modules-using-jestmock) instead.
>>>>>>> a88b1e1331126287ccf03f2f4ec25ec38513b911

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Ritorna `true` se `element` è un qualsiasi componente React.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Ritorna `true` se `element` è un componente React di tipo `componentClass`.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Ritorna `true` se `instance` è un componente DOM (come un `<div>` o uno `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Ritorna `true` se `instance` è un componente definito dall'utente, come una classe o una funzione.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Ritorna `true` se `instance` è un componente di tipo `componentClass`.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Scorre tutti i componenti nel `tree` e li accumula dove `test(component)` è `true`. Questo di per sè non è molto utile, ma è utilizzato come base in altre librerie di test.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Trova tutti gli elementi DOM dei componenti renderizzati, il cui nome della classe corrisponde a `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Come [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) ma si aspetta un solo risultato, ritornandolo oppure generando un'eccezione in caso di più risultati.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Trova tutti gli elementi DOM dei componenti renderizzati che corrispondo al nome specifico del tag `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Come [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) ma si aspetta un solo risultato, ritornandolo oppure generando un'eccezione in caso di più risultati.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Trova tutte le istanze dei componenti il cui tipo è `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Come [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) ma si aspetta un solo risultato, ritornandolo oppure generando un'eccezione in caso di più risultati.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Renderizza un elemento React in un nodo DOM separato, all'interno del documento. **Questa funzione richiede un DOM.** Equivale a:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Nota:
>
> Dovrai avere `window`, `window.document` e `window.document.createElement` disponibili globalmente **prima** di importare `React`. Altrimenti React penserà di non poter accedere al DOM, e metodi come `setState` non funzioneranno.

* * *

## Altre Utilities {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Simula la generazione di un evento su un nodo DOM, con un `eventData` opzionale.

`Simulate` ha un metodo per [ogni evento che React supporta](/docs/events.html#supported-events).

**Cliccare un elemento**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Cambiare il valore di un campo input e quindi premere ENTER**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Nota
>
> Dovrai fornire qualsiasi proprietà agli eventi che usi nel tuo componente (ad esempio, keyCode, which, etc...), visto che React non ne definisce automaticamente nessuna.

* * *
