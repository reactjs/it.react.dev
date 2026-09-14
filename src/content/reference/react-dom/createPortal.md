---
title: createPortal
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/createPortal.md).

</Note>

<Intro>

`createPortal` ti permette di renderizzare alcuni figli in una parte diversa del DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Per creare un portal, chiama `createPortal` passando del JSX e il nodo DOM in cui deve essere renderizzato:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>Questo figlio è posizionato nel div genitore.</p>
  {createPortal(
    <p>Questo figlio è posizionato nel body del documento.</p>,
    document.body
  )}
</div>
```

[Vedi altri esempi sotto.](#usage)

Un portal modifica solo il posizionamento fisico del nodo DOM. Per il resto, il JSX che renderizzi in un portal si comporta come un nodo figlio del componente React che lo renderizza. Ad esempio, il figlio può accedere al context fornito dall'albero genitore e gli eventi risalgono dai figli ai genitori secondo l'albero React.

#### Parameters {/*parameters*/}

* `children`: Qualsiasi cosa che possa essere renderizzata con React, come un pezzo di JSX (ad es. `<div />` o `<SomeComponent />`), un [Fragment](/reference/react/Fragment) (`<>...</>`), una stringa o un numero, oppure un array di questi.

* `domNode`: Un nodo DOM, come quelli restituiti da `document.getElementById()`. Il nodo deve già esistere. Passare un nodo DOM diverso durante un aggiornamento farà ricreare il contenuto del portal.

* **optional** `key`: Una stringa o un numero univoco da usare come [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) del portal.

#### Returns {/*returns*/}

`createPortal` restituisce un nodo React che può essere incluso nel JSX o restituito da un componente React. Se React lo incontra nell'output di renderizzazione, posizionerà i `children` forniti all'interno del `domNode` fornito.

#### Caveats {/*caveats*/}

* Gli eventi dai portal si propagano secondo l'albero React anziché l'albero DOM. Ad esempio, se fai clic all'interno di un portal e il portal è avvolto in `<div onClick>`, verrà eseguito quel gestore di eventi `onClick`. Se questo causa problemi, interrompi la propagazione dell'evento dall'interno del portal oppure sposta il portal stesso più in alto nell'albero React.

---

## Usage {/*usage*/}

### Renderizzare in una parte diversa del DOM {/*rendering-to-a-different-part-of-the-dom*/}

I *portal* permettono ai tuoi componenti di renderizzare alcuni dei loro figli in un punto diverso del DOM. Così una parte del componente può "uscire" da qualunque contenitore in cui si trovi. Ad esempio, un componente può mostrare una finestra modale o un tooltip che appare sopra e fuori dal resto della pagina.

Per creare un portal, renderizza il risultato di `createPortal` con <CodeStep step={1}>del JSX</CodeStep> e il <CodeStep step={2}>nodo DOM in cui deve andare</CodeStep>:

```js [[1, 8, "<p>Questo figlio è posizionato nel body del documento.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Questo figlio è posizionato nel div genitore.</p>
      {createPortal(
        <p>Questo figlio è posizionato nel body del documento.</p>,
        document.body
      )}
    </div>
  );
}
```

React inserirà i nodi DOM del <CodeStep step={1}>JSX che hai passato</CodeStep> all'interno del <CodeStep step={2}>nodo DOM che hai fornito</CodeStep>.

Senza un portal, il secondo `<p>` sarebbe posizionato all'interno del `<div>` genitore, ma il portal lo ha "teletrasportato" nel [`document.body`:](https://developer.mozilla.org/it/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Questo figlio è posizionato nel div genitore.</p>
      {createPortal(
        <p>Questo figlio è posizionato nel body del documento.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Nota come il secondo paragrafo appare visivamente fuori dal `<div>` genitore con il bordo. Se ispezioni la struttura DOM con gli strumenti per sviluppatori, vedrai che il secondo `<p>` è stato posizionato direttamente nel `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>Questo figlio è posizionato nel div genitore.</p>
      </div>
    ...
  </div>
  <p>Questo figlio è posizionato nel body del documento.</p>
</body>
```

Un portal modifica solo il posizionamento fisico del nodo DOM. Per il resto, il JSX che renderizzi in un portal si comporta come un nodo figlio del componente React che lo renderizza. Ad esempio, il figlio può accedere al context fornito dall'albero genitore e gli eventi risalgono comunque dai figli ai genitori secondo l'albero React.

---

### Renderizzare una finestra modale con un portal {/*rendering-a-modal-dialog-with-a-portal*/}

Puoi usare un portal per creare una finestra modale che fluttua sopra il resto della pagina, anche se il componente che la invoca si trova dentro un contenitore con `overflow: hidden` o altri stili che interferiscono con la finestra.

In questo esempio, i due contenitori hanno stili che disturbano la finestra modale, ma quella renderizzata in un portal non ne è influenzata perché, nel DOM, la modale non è contenuta negli elementi JSX genitori.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Mostra modale senza portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Mostra modale con un portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>Sono una finestra modale</div>
      <button onClick={onClose}>Chiudi</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

È importante assicurarsi che l'app sia accessibile quando usi i portal. Ad esempio, potresti dover gestire il focus da tastiera in modo che l'utente possa spostarlo dentro e fuori dal portal in modo naturale.

Segui le [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal) quando crei modali. Se usi un pacchetto della community, assicurati che sia accessibile e segua queste linee guida.

</Pitfall>

---

### Renderizzare componenti React in markup server non React {/*rendering-react-components-into-non-react-server-markup*/}

I portal possono essere utili se la root React è solo una parte di una pagina statica o renderizzata lato server che non è costruita con React. Ad esempio, se la pagina è costruita con un framework server come Rails, puoi creare aree di interattività all'interno di aree statiche come le sidebar. Rispetto ad avere [più root React separate,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) i portal ti permettono di trattare l'app come un unico albero React con state condiviso anche se le sue parti renderizzano in punti diversi del DOM.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>La mia app</title></head>
  <body>
    <h1>Benvenuto nella mia app ibrida</h1>
    <div class="parent">
      <div class="sidebar">
        Questo è markup server non React
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>Questa parte è renderizzata da React</p>;
}

function SidebarContent() {
  return <p>Anche questa parte è renderizzata da React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Renderizzare componenti React in nodi DOM non React {/*rendering-react-components-into-non-react-dom-nodes*/}

Puoi anche usare un portal per gestire il contenuto di un nodo DOM gestito al di fuori di React. Ad esempio, supponiamo che tu stia integrando un widget mappa non React e voglia renderizzare contenuto React all'interno di un popup. Per farlo, dichiara una variabile di state `popupContainer` per memorizzare il nodo DOM in cui renderizzerai:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Quando crei il widget di terze parti, memorizza il nodo DOM restituito dal widget così puoi renderizzare al suo interno:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

Questo ti permette di usare `createPortal` per renderizzare contenuto React in `popupContainer` non appena diventa disponibile:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Ciao da React!</p>,
      popupContainer
    )}
  </div>
);
```

Ecco un esempio completo con cui puoi sperimentare:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Ciao da React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
