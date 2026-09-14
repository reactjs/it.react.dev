---
title: forwardRef
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/forwardRef.md).

</Note>

<Deprecated>

In React 19, `forwardRef` non è più necessario. Passa `ref` come prop.

`forwardRef` sarà deprecato in una futura release. Scopri di più [qui](/blog/2024/04/25/react-19#ref-as-a-prop).

</Deprecated>

<Intro>

`forwardRef` ti permette di esporre un nodo DOM al componente genitore con un [ref.](/learn/manipulating-the-dom-with-refs)

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Chiama `forwardRef()` per far sì che il tuo componente riceva un ref e lo inoltri a un componente figlio:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `render`: La funzione render del tuo componente. React chiama questa funzione con le props e il `ref` che il tuo componente ha ricevuto dal genitore. Il JSX che restituisci sarà l'output del tuo componente.

#### Returns {/*returns*/}

`forwardRef` restituisce un componente React che puoi renderizzare in JSX. A differenza dei componenti React definiti come funzioni semplici, un componente restituito da `forwardRef` può anche ricevere una prop `ref`.

#### Caveats {/*caveats*/}

* In Strict Mode, React **chiamerà la tua funzione render due volte** per [aiutarti a trovare impurità accidentali.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Questo comportamento vale solo in sviluppo e non influisce sulla produzione. Se la tua funzione render è pura (come dovrebbe essere), non dovrebbe influire sulla logica del tuo componente. Il risultato di una delle chiamate verrà ignorato.


---

### Funzione `render` {/*render-function*/}

`forwardRef` accetta una funzione render come argomento. React chiama questa funzione con `props` e `ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Parameters {/*render-parameters*/}

* `props`: Le props passate dal componente genitore.

* `ref`: L'attributo `ref` passato dal componente genitore. Il `ref` può essere un oggetto o una funzione. Se il componente genitore non ha passato un ref, sarà `null`. Dovresti inoltrare il `ref` che ricevi a un altro componente oppure passarlo a [`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### Returns {/*render-returns*/}

`forwardRef` restituisce un componente React che puoi renderizzare in JSX. A differenza dei componenti React definiti come funzioni semplici, il componente restituito da `forwardRef` può ricevere una prop `ref`.

---

## Usage {/*usage*/}

### Esporre un nodo DOM al componente genitore {/*exposing-a-dom-node-to-the-parent-component*/}

Per impostazione predefinita, i nodi DOM di ogni componente sono privati. A volte però è utile esporre un nodo DOM al genitore — ad esempio, per metterlo a fuoco. Per attivare questa opzione, avvolgi la definizione del componente in `forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Riceverai un <CodeStep step={1}>ref</CodeStep> come secondo argomento dopo le props. Passalo al nodo DOM che vuoi esporre:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Questo permette al componente genitore `Form` di accedere al <CodeStep step={2}>nodo DOM `<input>`</CodeStep> esposto da `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Questo componente `Form` [passa un ref](/reference/react/useRef#manipulating-the-dom-with-a-ref) a `MyInput`. Il componente `MyInput` *inoltra* quel ref al tag browser `<input>`. Di conseguenza, il componente `Form` può accedere a quel nodo DOM `<input>` e chiamare [`focus()`](https://developer.mozilla.org/it/docs/Web/API/HTMLElement/focus) su di esso.

Tieni presente che esporre un ref al nodo DOM interno al tuo componente complica il cambiamento dei dettagli interni in seguito. In genere esporrai nodi DOM da componenti riutilizzabili di basso livello come pulsanti o campi di testo, ma non lo farai per componenti a livello applicativo come un avatar o un commento.

<Recipes titleText="Esempi di inoltro di un ref">

#### Mettere a fuoco un campo di testo {/*focusing-a-text-input*/}

Cliccando il pulsante metterai a fuoco l'input. Il componente `Form` definisce un ref e lo passa al componente `MyInput`. Il componente `MyInput` inoltra quel ref al `<input>` del browser. Questo permette al componente `Form` di mettere a fuoco l'`<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Riprodurre e mettere in pausa un video {/*playing-and-pausing-a-video*/}

Cliccando il pulsante chiamerai [`play()`](https://developer.mozilla.org/it/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/it/docs/Web/API/HTMLMediaElement/pause) su un nodo DOM `<video>`. Il componente `App` definisce un ref e lo passa al componente `MyVideoPlayer`. Il componente `MyVideoPlayer` inoltra quel ref al nodo browser `<video>`. Questo permette al componente `App` di riprodurre e mettere in pausa il `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Inoltrare un ref attraverso più componenti {/*forwarding-a-ref-through-multiple-components*/}

Invece di inoltrare un `ref` a un nodo DOM, puoi inoltrarlo al tuo componente, come `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Se quel componente `MyInput` inoltra un ref al suo `<input>`, un ref a `FormField` ti darà accesso a quell'`<input>`:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Il componente `Form` definisce un ref e lo passa a `FormField`. Il componente `FormField` inoltra quel ref a `MyInput`, che lo inoltra a un nodo DOM `<input>` del browser. È così che `Form` accede a quel nodo DOM.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Esporre un handle imperativo invece di un nodo DOM {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Invece di esporre un intero nodo DOM, puoi esporre un oggetto personalizzato, chiamato *handle imperativo,* con un insieme più ristretto di metodi. Per farlo, devi definire un ref separato per contenere il nodo DOM:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Passa il `ref` che hai ricevuto a [`useImperativeHandle`](/reference/react/useImperativeHandle) e specifica il valore che vuoi esporre al `ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Se un componente ottiene un ref a `MyInput`, riceverà solo il tuo oggetto `{ focus, scrollIntoView }` invece del nodo DOM. Questo ti permette di limitare al minimo le informazioni che esponi sul tuo nodo DOM.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Non funzionerà perché il nodo DOM non è esposto:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Leggi di più sull'uso degli handle imperativi.](/reference/react/useImperativeHandle)

<Pitfall>

**Non abusare dei ref.** Dovresti usare i ref solo per comportamenti *imperativi* che non puoi esprimere come props: ad esempio, scorrere fino a un nodo, mettere a fuoco un nodo, avviare un'animazione, selezionare del testo e così via.

**Se puoi esprimere qualcosa come prop, non dovresti usare un ref.** Ad esempio, invece di esporre un handle imperativo come `{ open, close }` da un componente `Modal`, è meglio accettare `isOpen` come prop, come `<Modal isOpen={isOpen} />`. Gli [Effetti](/learn/synchronizing-with-effects) possono aiutarti a esporre comportamenti imperativi tramite props.

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### Il mio componente è avvolto in `forwardRef`, ma il `ref` verso di esso è sempre `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Di solito significa che hai dimenticato di usare effettivamente il `ref` che hai ricevuto.

Ad esempio, questo componente non fa nulla con il suo `ref`:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Per risolvere, passa il `ref` a un nodo DOM o a un altro componente che può accettare un ref:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

Il `ref` a `MyInput` potrebbe anche essere `null` se parte della logica è condizionale:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Se `showInput` è `false`, il ref non verrà inoltrato a nessun nodo e un ref a `MyInput` resterà vuoto. È particolarmente facile non accorgersene se la condizione è nascosta dentro un altro componente, come `Panel` in questo esempio:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
