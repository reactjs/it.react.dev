---
id: shallow-renderer
title: Renderizzatore Shallow
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

> **Nota sulla traduzione:**
>
> La definizione inglese `Shallow Renderer` si traduce letteralmente in `Renderizzatore Superficiale`, dato che il modulo è chiamato `shallow`, abbiamo deciso di non tradurlo di seguito.

**Importazione**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 con npm
```

## Panoramica {#overview}

Quando scriviamo unit test per React, la renderizzazione shallow può tornare molto utile. Essa permette di renderizzare un componente "ad un livello di profondità" e di asserire fatti riguardo cosa viene ritornato dal suo metodo `render`. Il vantaggio risiede nel fatto che non dobbiamo preoccuparci del comportamento dei componenti figli, i quali non vengono istanziati o renderizzati. Non è richiesto nemmeno un DOM.

Ad esempio, dato il seguente componente:

```javascript
function MioComponente() {
  return (
    <div>
      <span className="testata">Titolo</span>
      <SottoComponente foo="bar" />
    </div>
  );
}
```

Possiamo asserire:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// nel tuo test:
const renderer = new ShallowRenderer();
renderer.render(<MioComponente />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="testata">Titolo</span>,
  <SottoComponente foo="bar" />
]);
```

Il testing shallow, attualmente, ha alcune limitazioni quali il mancato supporto ai `refs`.

> Nota:
>
> Ti raccomandiamo inoltre di dare uno sguardo alle [API Shallow Rendering](https://airbnb.io/enzyme/docs/api/shallow.html) di Enzyme. Ti offrono una migliore API di più alto livello attorno alla stessa funzionalità.

## Riferimento {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

Puoi pensare allo _shallowRenderer_ come ad un "posto" nel quale renderizzare i componenti che stai testando, dal quale puoi estrarre l'output del componente.

<<<<<<< HEAD
`shallowRenderer.render()` è simile a [`ReactDOM.render()`](/docs/react-dom.html#render) ma non richiede un DOM e renderizza ad un solo livello di profondità. Ciò significa che potrai testare i componenti in isolamento rispetto a come sono implementati i componenti figli.
=======
`shallowRenderer.render()` is similar to [`root.render()`](/docs/react-dom-client.html#createroot) but it doesn't require DOM and only renders a single level deep. This means you can test components isolated from how their children are implemented.
>>>>>>> c1c3d1db304adfa5446accb0312e60d515188414

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

Quando `shallowRenderer.render()` è stato chiamato, puoi usare `shallowRenderer.getRenderOutput()` per ottenere l'output renderizzato in modo "superficiale".

Potrai allora asserire fatti riguardo ad esso nei tuoi test.
