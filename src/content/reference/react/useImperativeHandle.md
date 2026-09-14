---
title: useImperativeHandle
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useImperativeHandle.md).

</Note>

<Intro>

`useImperativeHandle` è un Hook React che ti permette di personalizzare l'handle esposto come [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Chiama `useImperativeHandle` al top level del tuo componente per personalizzare l'handle del ref che espone:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `ref`: La `ref` che hai ricevuto come prop del componente `MyInput`.

* `createHandle`: Una funzione che non accetta argomenti e restituisce l'handle del ref che vuoi esporre. L'handle del ref può essere di qualsiasi tipo. Di solito, restituirai un oggetto con i metodi che vuoi esporre.

* **optional** `dependencies`: L'elenco di tutti i valori reattivi referenziati all'interno del codice di `createHandle`. I valori reattivi includono props, state e tutte le variabili e funzioni dichiarate direttamente nel corpo del componente. Se il tuo linter è [configurato per React](/learn/editor-setup#linting), verificherà che ogni valore reattivo sia specificato correttamente come dipendenza. L'elenco delle dipendenze deve avere un numero costante di elementi ed essere scritto inline come `[dep1, dep2, dep3]`. React confronterà ogni dipendenza con il suo valore precedente usando il confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se una ri-renderizzazione ha comportato un cambiamento in qualche dipendenza, o se hai omesso questo argomento, la tua funzione `createHandle` verrà rieseguita e l'handle appena creato verrà assegnato alla ref.

<Note>

A partire da React 19, [`ref` è disponibile come prop.](/blog/2024/12/05/react-19#ref-as-a-prop) In React 18 e versioni precedenti, era necessario ottenere la `ref` da [`forwardRef`.](/reference/react/forwardRef)

</Note>

#### Returns {/*returns*/}

`useImperativeHandle` restituisce `undefined`.

---

## Usage {/*usage*/}

### Exposing a custom ref handle to the parent component {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Per esporre un nodo DOM all'elemento genitore, passa la prop `ref` al nodo.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

Con il codice sopra, [una ref a `MyInput` riceverà il nodo DOM `<input>`.](/learn/manipulating-the-dom-with-refs) Tuttavia, puoi esporre un valore personalizzato al suo posto. Per personalizzare l'handle esposto, chiama `useImperativeHandle` al top level del tuo componente:

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);

  return <input />;
};
```

Nota che nel codice sopra, la `ref` non viene più passata all'`<input>`.

Ad esempio, supponiamo che tu non voglia esporre l'intero nodo DOM `<input>`, ma che tu voglia esporre due dei suoi metodi: `focus` e `scrollIntoView`. Per farlo, mantieni il DOM del browser reale in una ref separata. Poi usa `useImperativeHandle` per esporre un handle con solo i metodi che vuoi che il componente genitore chiami:

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
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

  return <input ref={inputRef} />;
};
```

Ora, se il componente genitore ottiene una ref a `MyInput`, sarà in grado di chiamare i metodi `focus` e `scrollIntoView` su di esso. Tuttavia, non avrà pieno accesso al nodo DOM `<input>` sottostante.

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
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
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
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Exposing your own imperative methods {/*exposing-your-own-imperative-methods*/}

I metodi che esponi tramite un handle imperativo non devono corrispondere esattamente ai metodi del DOM. Ad esempio, questo componente `Post` espone un metodo `scrollAndFocusAddComment` tramite un handle imperativo. Questo permette al componente genitore `Page` di scorrere l'elenco dei commenti *e* mettere il focus sul campo di input quando clicchi il pulsante:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Non abusare delle ref.** Dovresti usare le ref solo per comportamenti *imperativi* che non puoi esprimere come props: ad esempio, scorrere fino a un nodo, mettere il focus su un nodo, attivare un'animazione, selezionare del testo, e così via.

**Se puoi esprimere qualcosa come prop, non dovresti usare una ref.** Ad esempio, invece di esporre un handle imperativo come `{ open, close }` da un componente `Modal`, è meglio accettare `isOpen` come prop, come `<Modal isOpen={isOpen} />`. Gli [Effetti](/learn/synchronizing-with-effects) possono aiutarti a esporre comportamenti imperativi tramite props.

</Pitfall>
