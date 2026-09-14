---
title: <Fragment> (<>...</>)
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/Fragment.md).

</Note>

<Intro>

`<Fragment>`, spesso usato tramite la sintassi `<>...</>`, ti permette di raggruppare elementi senza un nodo wrapper.

I Fragment possono anche accettare ref, che consentono di interagire con i nodi DOM sottostanti senza aggiungere elementi wrapper.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<Fragment>` {/*fragment*/}

Avvolgi elementi in `<Fragment>` per raggrupparli insieme in situazioni in cui ti serve un singolo elemento. Raggruppare elementi in un `Fragment` non ha effetto sul DOM risultante; è come se gli elementi non fossero raggruppati. Il tag JSX vuoto `<></>` è una scorciatoia per `<Fragment></Fragment>` nella maggior parte dei casi.

#### Props {/*props*/}

- **optional** `key`: I Fragment dichiarati con la sintassi esplicita `<Fragment>` possono avere delle [key.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- **optional** `ref`: Un oggetto ref (ad esempio da [`useRef`](/reference/react/useRef)) o una [funzione callback](/reference/react-dom/components/common#ref-callback). React fornisce un `FragmentInstance` come valore del ref che implementa metodi per interagire con i nodi DOM avvolti dal Fragment.

#### Caveats {/*caveats*/}

* Se vuoi passare `key` a un Fragment, non puoi usare la sintassi `<>...</>`. Devi importare esplicitamente `Fragment` da `'react'` e renderizzare `<Fragment key={yourKey}>...</Fragment>`.

* React non [reimposta lo state](/learn/preserving-and-resetting-state) quando passi dal renderizzare `<><Child /></>` a `[<Child />]` o viceversa, o quando passi dal renderizzare `<><Child /></>` a `<Child />` e viceversa. Questo funziona solo a un singolo livello di profondità: ad esempio, passare da `<><><Child /></></>` a `<Child />` reimposta lo state. Vedi la semantica precisa [qui.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

* Se vuoi passare `ref` a un Fragment, non puoi usare la sintassi `<>...</>`. Devi importare esplicitamente `Fragment` da `'react'` e renderizzare `<Fragment ref={yourRef}>...</Fragment>`.

---

### `FragmentInstance` {/*fragmentinstance*/}

Quando passi un `ref` a un Fragment, React fornisce un oggetto `FragmentInstance`. Implementa metodi per interagire con i figli DOM di primo livello avvolti dal Fragment.

* [`addEventListener`](#addeventlistener) e [`removeEventListener`](#removeeventlistener) gestiscono i listener di eventi su tutti i figli DOM di primo livello.
* [`dispatchEvent`](#dispatchevent) esegue il dispatch di un evento sul Fragment, che può propagarsi al genitore DOM.
* [`focus`](#focus), [`focusLast`](#focuslast) e [`blur`](#blur) gestiscono il focus su tutti i figli annidati in profondità (depth-first).
* [`observeUsing`](#observeusing) e [`unobserveUsing`](#unobserveusing) collegano e scollegano istanze di `IntersectionObserver` o `ResizeObserver`.
* [`getClientRects`](#getclientrects) restituisce i rettangoli di delimitazione di tutti i figli DOM di primo livello.
* [`getRootNode`](#getrootnode) restituisce il nodo root del genitore del Fragment.
* [`compareDocumentPosition`](#comparedocumentposition) confronta la posizione del Fragment con un altro nodo.
* [`scrollIntoView`](#scrollintoview) scorre i figli del Fragment nella vista.

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

Aggiunge un listener di eventi a tutti i figli DOM di primo livello del Fragment.

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### Parameters {/*addeventlistener-parameters*/}

* `type`: Una stringa che rappresenta il tipo di evento da ascoltare (ad esempio `'click'`, `'focus'`).
* `listener`: La funzione gestore di eventi.
* **optional** `options`: Un oggetto options o un booleano per capture, corrispondente all'[API DOM `addEventListener`.](https://developer.mozilla.org/it/docs/Web/API/EventTarget/addEventListener)

##### Returns {/*addeventlistener-returns*/}

`addEventListener` non restituisce nulla (`undefined`).

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

Rimuove un listener di eventi da tutti i figli DOM di primo livello del Fragment.

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### Parameters {/*removeeventlistener-parameters*/}

* `type`: La stringa del tipo di evento.
* `listener`: La funzione gestore di eventi da rimuovere.
* **optional** `options`: Un oggetto options o un booleano, corrispondente all'[API DOM `removeEventListener`.](https://developer.mozilla.org/it/docs/Web/API/EventTarget/removeEventListener)

##### Returns {/*removeeventlistener-returns*/}

`removeEventListener` non restituisce nulla (`undefined`).

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

Esegue il dispatch di un evento sul Fragment. I listener di eventi aggiunti vengono chiamati e l'evento può propagarsi al genitore DOM del Fragment.

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### Parameters {/*dispatchevent-parameters*/}

* `event`: Un oggetto [`Event`](https://developer.mozilla.org/it/docs/Web/API/Event) da inviare. Se `bubbles` è `true`, l'evento si propaga al nodo DOM genitore del Fragment.

##### Returns {/*dispatchevent-returns*/}

`true` se l'evento non è stato annullato, `false` se è stato chiamato `preventDefault()`.

---

#### `focus(options?)` {/*focus*/}

Imposta il focus sul primo nodo DOM che può ricevere il focus nel Fragment. A differenza di chiamare `element.focus()` su un elemento DOM, questo metodo cerca *tutti* i figli annidati in profondità (depth-first) finché non trova un elemento che può ricevere il focus — non solo l'elemento stesso o i suoi figli diretti.

```js
fragmentRef.current.focus();
```

##### Parameters {/*focus-parameters*/}

* **optional** `options`: Un oggetto [`FocusOptions`](https://developer.mozilla.org/it/docs/Web/API/HTMLElement/focus#options) (ad esempio `{ preventScroll: true }`).

##### Returns {/*focus-returns*/}

`focus` non restituisce nulla (`undefined`).

---

#### `focusLast(options?)` {/*focuslast*/}

Imposta il focus sull'ultimo nodo DOM che può ricevere il focus nel Fragment. Cerca i figli annidati in profondità (depth-first), poi itera in ordine inverso.

```js
fragmentRef.current.focusLast();
```

##### Parameters {/*focuslast-parameters*/}

* **optional** `options`: Un oggetto [`FocusOptions`](https://developer.mozilla.org/it/docs/Web/API/HTMLElement/focus#options).

##### Returns {/*focuslast-returns*/}

`focusLast` non restituisce nulla (`undefined`).

---

#### `blur()` {/*blur*/}

Rimuove il focus dall'elemento attivo se si trova all'interno del Fragment. Se `document.activeElement` non è all'interno del Fragment, `blur` non fa nulla.

```js
fragmentRef.current.blur();
```

##### Returns {/*blur-returns*/}

`blur` non restituisce nulla (`undefined`).

---

#### `observeUsing(observer)` {/*observeusing*/}

Inizia a osservare tutti i figli DOM di primo livello del Fragment con l'observer fornito.

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### Parameters {/*observeusing-parameters*/}

* `observer`: Un'istanza di [`IntersectionObserver`](https://developer.mozilla.org/it/docs/Web/API/IntersectionObserver) o [`ResizeObserver`](https://developer.mozilla.org/it/docs/Web/API/ResizeObserver).

##### Returns {/*observeusing-returns*/}

`observeUsing` non restituisce nulla (`undefined`).

---

#### `unobserveUsing(observer)` {/*unobserveusing*/}

Interrompe l'osservazione dei figli DOM del Fragment con l'observer specificato.

```js
fragmentRef.current.unobserveUsing(observer);
```

##### Parameters {/*unobserveusing-parameters*/}

* `observer`: La stessa istanza di `IntersectionObserver` o `ResizeObserver` precedentemente passata a [`observeUsing`](#observeusing).

##### Returns {/*unobserveusing-returns*/}

`unobserveUsing` non restituisce nulla (`undefined`).

---

#### `getClientRects()` {/*getclientrects*/}

Restituisce un array piatto di oggetti [`DOMRect`](https://developer.mozilla.org/it/docs/Web/API/DOMRect) che rappresentano i rettangoli di delimitazione di tutti i figli DOM di primo livello.

```js
const rects = fragmentRef.current.getClientRects();
```

##### Returns {/*getclientrects-returns*/}

Un `Array<DOMRect>` contenente i rettangoli di delimitazione di tutti i figli.

---

#### `getRootNode(options?)` {/*getrootnode*/}

Restituisce il nodo root che contiene il nodo DOM genitore del Fragment, corrispondendo al comportamento di [`Node.getRootNode()`](https://developer.mozilla.org/it/docs/Web/API/Node/getRootNode).

```js
const root = fragmentRef.current.getRootNode();
```

##### Parameters {/*getrootnode-parameters*/}

* **optional** `options`: Un oggetto con una proprietà booleana `composed`, corrispondente all'[API DOM `getRootNode`.](https://developer.mozilla.org/it/docs/Web/API/Node/getRootNode#options)

##### Returns {/*getrootnode-returns*/}

Un `Document`, `ShadowRoot`, o il `FragmentInstance` stesso se non c'è un nodo DOM genitore.

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

Confronta la posizione nel documento del Fragment con un altro nodo, restituendo una bitmask corrispondente al comportamento di [`Node.compareDocumentPosition()`](https://developer.mozilla.org/it/docs/Web/API/Node/compareDocumentPosition).

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### Parameters {/*comparedocumentposition-parameters*/}

* `otherNode`: Il nodo DOM con cui confrontare.

##### Returns {/*comparedocumentposition-returns*/}

Una bitmask di [flag di posizione](https://developer.mozilla.org/it/docs/Web/API/Node/compareDocumentPosition#return_value). I Fragment vuoti e i Fragment con figli renderizzati tramite un [portal](/reference/react-dom/createPortal) includono `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` nel risultato.

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

Scorre i figli del Fragment nella vista. Quando `alignToTop` è `true` o omesso, scorre per allineare il primo figlio in alto rispetto all'antenato scrollabile. Quando `alignToTop` è `false`, scorre per allineare l'ultimo figlio in basso.

```js
fragmentRef.current.scrollIntoView();
```

##### Parameters {/*scrollintoview-parameters*/}

* **optional** `alignToTop`: Un booleano. Se `true` *(il valore predefinito)*, scorre il primo figlio in alto nell'area scrollabile. Se `false`, scorre l'ultimo figlio in basso. A differenza di [`Element.scrollIntoView()`](https://developer.mozilla.org/it/docs/Web/API/Element/scrollIntoView), questo metodo non accetta un oggetto `ScrollIntoViewOptions`.

##### Returns {/*scrollintoview-returns*/}

`scrollIntoView` non restituisce nulla (`undefined`).

##### Caveats {/*scrollintoview-caveats*/}

* `scrollIntoView` non accetta un oggetto options. Passarne uno genera un errore. Usa il booleano `alignToTop` al suo posto.
* Quando il Fragment non ha figli, `scrollIntoView` scorre il fratello o genitore più vicino nella vista come fallback.

---

#### `FragmentInstance` Caveats {/*fragmentinstance-caveats*/}

* I metodi che operano sui figli (come `addEventListener`, `observeUsing` e `getClientRects`) operano sui *figli host (DOM) di primo livello* del Fragment. Non agiscono direttamente sui figli annidati all'interno di un altro elemento DOM.
* `focus` e `focusLast` cercano i figli annidati in profondità (depth-first) per trovare elementi che possono ricevere il focus, a differenza dei metodi per eventi e observer che operano solo sui figli host di primo livello.
* `observeUsing` non funziona sui nodi di testo. React registra un warning in sviluppo se il Fragment contiene solo figli di testo.
* React non applica i listener di eventi aggiunti tramite `addEventListener` agli alberi [`<Activity>`](/reference/react/Activity) nascosti. Quando un boundary `Activity` passa da nascosto a visibile, i listener vengono applicati automaticamente.
* Ogni figlio DOM di primo livello di un Fragment con un `ref` ottiene una proprietà `reactFragments` — un `Set<FragmentInstance>` contenente tutte le istanze Fragment che possiedono l'elemento. Questo consente di [memorizzare nella cache un observer condiviso](#caching-global-intersection-observer) tra più Fragment.

---

## Usage {/*usage*/}

### Restituire più elementi {/*returning-multiple-elements*/}

Usa `Fragment`, o l'equivalente sintassi `<>...</>`, per raggruppare più elementi insieme. Puoi usarlo per mettere più elementi in qualsiasi punto in cui può andare un singolo elemento. Ad esempio, un componente può restituire solo un elemento, ma usando un Fragment puoi raggruppare più elementi e restituirli come gruppo:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

I Fragment sono utili perché raggruppare elementi con un Fragment non ha effetto su layout o stili, a differenza di quando avvolgi gli elementi in un altro contenitore come un elemento DOM. Se ispezioni questo esempio con gli strumenti del browser, vedrai che tutti i nodi DOM `<h1>` e `<article>` appaiono come fratelli senza wrapper attorno a loro:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Come scrivere un Fragment senza la sintassi speciale? {/*how-to-write-a-fragment-without-the-special-syntax*/}

L'esempio sopra è equivalente a importare `Fragment` da React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Di solito non ne avrai bisogno a meno che tu non debba [passare una `key` al tuo `Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Assegnare più elementi a una variabile {/*assigning-multiple-elements-to-a-variable*/}

Come qualsiasi altro elemento, puoi assegnare elementi Fragment a variabili, passarli come props e così via:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### Raggruppare elementi con del testo {/*grouping-elements-with-text*/}

Puoi usare `Fragment` per raggruppare testo insieme a componenti:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Renderizzare un elenco di Fragment {/*rendering-a-list-of-fragments*/}

Ecco una situazione in cui devi scrivere `Fragment` esplicitamente invece di usare la sintassi `<></>`. Quando [renderizzi più elementi in un loop](/learn/rendering-lists), devi assegnare una `key` a ogni elemento. Se gli elementi all'interno del loop sono Fragment, devi usare la normale sintassi degli elementi JSX per fornire l'attributo `key`:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Puoi ispezionare il DOM per verificare che non ci siano elementi wrapper attorno ai figli del Fragment:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

### Aggiungere listener di eventi senza un elemento wrapper {/*adding-event-listeners-without-wrapper*/}

I ref dei Fragment ti permettono di aggiungere listener di eventi a un gruppo di elementi senza aggiungere un nodo DOM wrapper. Usa una [ref callback](/reference/react-dom/components/common#ref-callback) per collegare e ripulire i listener:

<Sandpack>

```js
import { Fragment, useState, useRef, useEffect } from 'react';

function ClickableFragment({ children, onClick }) {
  const fragmentRef = useRef(null);
  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    if (fragmentInstance === null) {
      return;
    }
    fragmentInstance.addEventListener('click', onClick);
    return () => {
      fragmentInstance.removeEventListener(
        'click',
        onClick
      );
    };
  }, [onClick])
  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <p>Total clicks: {clicks}</p>
      <ClickableFragment onClick={() => {
        setClicks(c => c + 1);
      }}>
        <button>Button A</button>
        <button>Button B</button>
        <button>Button C</button>
      </ClickableFragment>
    </>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

La chiamata `addEventListener` applica il listener a ogni figlio DOM di primo livello del Fragment. Quando i figli vengono aggiunti o rimossi dinamicamente, il `FragmentInstance` aggiunge o rimuove automaticamente il listener.

<DeepDive>

#### Su quali figli agisce un ref di Fragment? {/*which-children-does-a-fragment-ref-target*/}

Un `FragmentInstance` opera sui **figli host (DOM) di primo livello** del Fragment. Considera questo albero:

```js
<Fragment ref={ref}>
  <div id="A" />
  <Wrapper>
    <div id="B">
      <div id="C" />
    </div>
  </Wrapper>
  <div id="D" />
</Fragment>
```

`Wrapper` è un componente React, quindi il `FragmentInstance` lo attraversa per trovare i nodi DOM. I figli interessati sono `A`, `B` e `D`. `C` non è interessato perché è annidato all'interno dell'elemento DOM `B`.

Metodi come `addEventListener`, `observeUsing` e `getClientRects` operano su questi figli DOM di primo livello. `focus` e `focusLast` sono diversi — cercano *tutti* i figli annidati in profondità (depth-first) per trovare elementi focusabili.

</DeepDive>

---

### Gestire il focus su un gruppo di elementi {/*managing-focus-across-elements*/}

I ref dei Fragment forniscono i metodi `focus`, `focusLast` e `blur` che operano su tutti i nodi DOM all'interno del Fragment:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function FormFields({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.focus();
        }}>
          Focus first
        </button>
        <button onClick={() => {
          fragmentRef.current.focusLast();
        }}>
          Focus last
        </button>
        <button onClick={() => {
          fragmentRef.current.blur();
        }}>
          Blur
        </button>
      </div>
      <Fragment ref={fragmentRef}>
        {children}
      </Fragment>
    </>
  );
}

// Anche se gli input sono profondamente annidati,
// focus() li cerca in profondità (depth-first) per trovarli.
export default function App() {
  return (
    <FormFields>
      <fieldset>
        <legend>Shipping</legend>
        <label>
          Street: <input name="street" />
        </label>
        <label>
          City: <input name="city" />
        </label>
      </fieldset>
    </FormFields>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

label {
  display: inline-block;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Chiamare `focus()` imposta il focus sull'input `street` — anche se è annidato all'interno di un `<fieldset>` e un `<label>`. `focus()` cerca in profondità (depth-first) attraverso tutti i figli annidati, non solo i figli diretti del Fragment. `focusLast()` fa lo stesso in ordine inverso, e `blur()` rimuove il focus se l'elemento attualmente focalizzato si trova all'interno del Fragment.

---

### Scorrere un gruppo di elementi nella vista {/*scrolling-group-into-view*/}

Usa `scrollIntoView` per scorrere i figli di un Fragment nella vista senza un elemento wrapper. Passa `true` (o ometti l'argomento) per scorrere il primo figlio in alto. Passa `false` per scorrere l'ultimo figlio in basso:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function ScrollableSection({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.scrollIntoView();
        }}>
          Scroll to top
        </button>
        <button onClick={() => {
          fragmentRef.current.scrollIntoView(false);
        }}>
          Scroll to bottom
        </button>
      </div>
      <div className="container">
        <Fragment ref={fragmentRef}>
          {children}
        </Fragment>
      </div>
    </>
  );
}

const items = [];
for (let i = 1; i <= 25; i++) {
  items.push('Item ' + i);
}

export default function App() {
  return (
    <ScrollableSection>
      <h3>Section Start</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <h3>Section End</h3>
    </ScrollableSection>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.container {
  height: 200px;
  overflow-y: auto;
  border: 2px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px;
}

h3 {
  margin: 4px 0;
  /* Padding per gestire l'offset della nav sticky globale durante lo scroll, ad esempio */
  padding-top: 4em;
  color: #1a73e8;
}

p {
  margin: 4px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Osservare la visibilità senza un elemento wrapper {/*observing-visibility-without-wrapper*/}

Usa `observeUsing` per collegare un `IntersectionObserver` a tutti i figli DOM di primo livello di un Fragment. Questo ti permette di tracciare la visibilità senza richiedere ai componenti figli di esporre ref o aggiungere un elemento wrapper:

<Sandpack>

```js
import {
  Fragment,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Card from './Card';

function VisibleGroup({ onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onVisibilityChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>
      <VisibleGroup onVisibilityChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </VisibleGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```

```js src/Card.js hidden
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Memorizzare nella cache un IntersectionObserver globale {/*caching-global-intersection-observer*/}

Un'ottimizzazione delle performance comune per siti con molti observer è condividere un singolo `IntersectionObserver` per configurazione e instradare le sue entry ai callback corretti in base a quale elemento ha intersecato. I ref dei Fragment supportano lo stesso pattern tramite la proprietà `reactFragments`.

Ogni figlio DOM di primo livello di un Fragment con un `ref` ha una proprietà `reactFragments`: un `Set` di oggetti `FragmentInstance` che contengono quell'elemento. Quando l'observer condiviso scatta, puoi usare questa proprietà per cercare quale `FragmentInstance` possiede l'elemento che interseca ed eseguire i callback corretti.

<Sandpack>

```js src/App.js active
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';

export default function App() {
  const [bgColor, setBgColor] = useState(null);

  const onGreen = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#d4edda');
    }
  }, []);

  const onBlue = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#cce5ff');
    }
  }, []);

  return (
    <div className="page" style={{
      background: bgColor || 'white',
    }}>
      <div className="filler">Scroll down</div>
      <ObservedGroup onIntersection={onGreen}>
        <Card title="Green section" className="green" />
      </ObservedGroup>
      <div className="filler" />
      <ObservedGroup onIntersection={onBlue}>
        <Card title="Blue section" className="blue" />
      </ObservedGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/ObservedGroup.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

const callbackMap = new WeakMap();
const observerCache = new Map();

function getOptionsKey(options) {
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const threshold = options?.threshold ?? 0;
  return `${rootMargin}|${threshold}`;
}

function getSharedObserver(
  fragmentInstance,
  onIntersection,
  options,
) {
  // Registra questo callback per
  // l'istanza fragment.
  const existing =
    callbackMap.get(fragmentInstance);
  callbackMap.set(
    fragmentInstance,
    existing
      ? [...existing, onIntersection]
      : [onIntersection],
  );

  const key = getOptionsKey(options);
  if (observerCache.has(key)) {
    return observerCache.get(key);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Cerca quali FragmentInstance possiedono
        // questo elemento.
        const fragmentInstances =
          entry.target.reactFragments;
        if (fragmentInstances) {
          for (const inst of fragmentInstances) {
            const callbacks =
              callbackMap.get(inst) || [];
            callbacks.forEach(cb => cb(entry));
          }
        }
      }
    },
    options,
  );

  observerCache.set(key, observer);
  return observer;
}

export default function ObservedGroup({
  onIntersection,
  options,
  children,
}) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const fragmentInstance = fragmentRef.current;
    const observer = getSharedObserver(
      fragmentInstance,
      onIntersection,
      options,
    );
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
      callbackMap.delete(fragmentInstance);
    };
  }, [onIntersection, options]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}

.card.green {
  border-left: 3px solid #28a745;
}

.card.blue {
  border-left: 3px solid #007bff;
}
```

```js src/Card.js hidden
export default function Card({ title, className }) {
  return <div className={'card' + (className ? ' ' + className : '')}>{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Più componenti `ObservedGroup` con le stesse options riutilizzano un singolo `IntersectionObserver`. Quando una delle sezioni scorre nella vista, l'observer condiviso scatta e usa `reactFragments` per instradare l'entry al callback corretto.
