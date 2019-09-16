---
id: test-renderer
title: Test Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Importazione**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 with npm
```

## Panoramica {#overview}

Questo package fornisce un renderizzatore React che può essere usato per renderizzare componenti React come oggetti Javascript puri, senza dipendere dal DOM o da un ambiente mobile nativo.

Fondamentalmente, questo package permette di catturare facilmente uno snapshot della vista gerarchica della piattaforma (simile ad un albero DOM) renderizzata dal DOM di React o da un componente di React Native senza utilizzare un browser o [jsdom](https://github.com/tmpvar/jsdom).

Esempio:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

Puoi utilizzare la feature di snapshot testing di Jest per salvare automaticamente una copia dell'albero JSON in un file e verificare nei tuoi test che non sia cambiato: [Per saperne di più](https://jestjs.io/docs/en/snapshot-testing).

Puoi anche navigare l'output per trovare nodi specifici e fare asserzioni su di essi.

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)
* [`TestRenderer.act()`](#testrendereract)

### Istanza di TestRenderer {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## Riferimento {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

Crea un'istanza di `TestRenderer` tramite l'elemento React passato in input. Non utilizza il DOM reale, ma renderizza comunque in maniera completa l'alberatura del componente in memoria così da poter fare asserzioni su di essa. Ritorna una [istanza di TestRenderer](#testrenderer-instance).

### `TestRenderer.act()` {#testrendereract}

```javascript
TestRenderer.act(callback);
```

In modo simile all'[helper `act()` di `react-dom/test-utils`](/docs/test-utils.html#act), `TestRenderer.act` prepara un componente per le asserzioni. Usa questa versione di `act()` per il wrapping di chiamate a `TestRenderer.create` e `testRenderer.update`.

```javascript
import {create, act} from 'react-test-renderer';
import App from './app.js'; // Il componente in test

// renderizzazione del componente
let root; 
act(() => {
  root = create(<App value={1}/>)
});

// asserzioni sulla root 
expect(root.toJSON()).toMatchSnapshot();

// aggiornamenti qualche props
act(() => {
  root = root.update(<App value={2}/>);
})

// asserzioni sulla root
expect(root.toJSON()).toMatchSnapshot();
```

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Ritorna un oggetto che raffigura l'albero renderizzato. Questo albero contiene solo nodi specifici della piattaforma come `<div>` o `<View>` e le loro props, ma non contiene nessun componente scritto dall'utente. Questo risulta utile per lo [snapshot testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Ritorna un oggetto che raffigura l'albero renderizzato. La rappresentazione è più dettagliata di quella fornita da `toJSON()`, e include componenti scritti dall'utente. Probabilmente non hai bisogno di questo metodo a meno che non stia scrivendo una tua libreria di asserzioni sul test renderer.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

Ri-renderizza l'albero in memoria con un nuovo elemento root. Questo simula un aggiornamento di React a partire dalla root. Se il nuovo elemento ha lo stesso tipo e chiave del precedente elemento, l'albero sarà aggiornato; altrimenti, verrà ri-montato un nuovo albero.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Smonta l'albero in memoria, scatenando gli eventi di lifecycle appropriati.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

Ritorna l'istanza corrispondente all'elemento root, se disponibile. Questo non funzionerà se l'elemento root è un componente funzione perché non avrà istanza.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

Ritorna l'oggetto root "istanza di test" che è utile per fare asserzioni su specifici nodi nell'albero. Puoi usarlo per trovare altre "istanze di test" maggiormente in profondità.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Trova una singola istanza di test discendente per la quale `test(testInstance)` ritorna `true`. Se `test(testInstance)` non ritorna `true` per quella specifica istanza di test, lancerà un errore.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Trova una singola istanza di test discendente usando il `type` fornito in input. Se non c'è esattamente un'istanza di test con il `type` fornito, lancerà un errore.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Trova una singola istanza di test discendente usando le `props` fornite in input. Se non c'è esattamente un'istanza di test con le `props` fornite, lancerà un errore.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Trova tutte le istanze di test discendenti per le quali `test(testInstance)` ritorna `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Trova tutte le istanze di test discendenti con il `type` fornito.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Trova tutte le istanze di test discendenti con le `props` fornite.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

L'istanza del componente corrispondente a questa istanza di test. E' disponibile solo per componenti classe, in quanto i componenti funzione non hanno istanze. Corrisponde al valore `this` dentro il dato componente.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

Il tipo del componente corrispondente a questa istanza di test. Per esempio, un componente `<Button />` ha come tipo `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

Le props corrispondenti a questa istanza di test. Per esempio, un componente `<Button size="small" />` ha come props `{size: 'small'}`.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

L'istanza padre di questa istanza di test.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

Le istanze figlio di questa istanza di test.

## Idee {#ideas}

Puoi passare una funzione `createNodeMock` a `TestRenderer.create` come opzione, che consente riferimenti a mock personalizzati.
`createNodeMock` accetta l'elemento corrente e dovrebbe ritornare un oggetto riferimento mock.
Questo metodo è utile quando testi un componente che si affida ai riferimenti.

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // mock a focus function
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
