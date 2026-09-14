---
title: useId
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useId.md).

</Note>

<Intro>

`useId` è un Hook React per generare ID univoci che possono essere passati agli attributi di accessibilità.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useId()` {/*useid*/}

Chiama `useId` al top level del tuo componente per generare un ID univoco:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

`useId` non accetta parametri.

#### Returns {/*returns*/}

`useId` restituisce una stringa ID univoca associata a questa particolare chiamata a `useId` in questo particolare componente.

#### Caveats {/*caveats*/}

* `useId` è un Hook, quindi puoi chiamarlo **solo al top level del tuo componente** o dei tuoi Hook personalizzati. Non puoi chiamarlo all'interno di loop o condizioni. Se ne hai bisogno, estrai un nuovo componente e sposta lo state al suo interno.

* `useId` **non dovrebbe essere usato per generare chiavi di cache** per [use()](/reference/react/use). L'ID è stabile quando un componente è montato, ma potrebbe cambiare durante la renderizzazione. Le chiavi di cache dovrebbero essere generate dai tuoi dati.

* `useId` **non dovrebbe essere usato per generare le key** in una lista. [Le key dovrebbero essere generate dai tuoi dati.](/learn/rendering-lists#where-to-get-your-key)

* `useId` al momento non può essere usato negli [async Server Components](/reference/rsc/server-components#async-components-with-server-components).

---

## Usage {/*usage*/}

<Pitfall>

**Non chiamare `useId` per generare le key in una lista.** [Le key dovrebbero essere generate dai tuoi dati.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Generare ID univoci per attributi di accessibilità {/*generating-unique-ids-for-accessibility-attributes*/}

Chiama `useId` al top level del tuo componente per generare un ID univoco:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Puoi poi passare l'<CodeStep step={1}>ID generato</CodeStep> a diversi attributi:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Vediamo un esempio per capire quando è utile.**

Gli [attributi di accessibilità HTML](https://developer.mozilla.org/it/docs/Web/Accessibility/ARIA) come [`aria-describedby`](https://developer.mozilla.org/it/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) ti permettono di specificare che due tag sono collegati tra loro. Per esempio, puoi indicare che un elemento (come un input) è descritto da un altro elemento (come un paragrafo).

In HTML classico, lo scriveresti così:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  La password deve contenere almeno 18 caratteri
</p>
```

Tuttavia, hardcodare ID in questo modo non è una buona pratica in React. Un componente può essere renderizzato più volte nella pagina — ma gli ID devono essere univoci! Invece di hardcodare un ID, genera un ID univoco con `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        La password deve contenere almeno 18 caratteri
      </p>
    </>
  );
}
```

Ora, anche se `PasswordField` compare più volte sullo schermo, gli ID generati non entreranno in conflitto.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        La password deve contenere almeno 18 caratteri
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Scegli password</h2>
      <PasswordField />
      <h2>Conferma password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Guarda questo video](https://www.youtube.com/watch?v=0dNzNcuEuOo) per vedere la differenza nell'esperienza utente con le tecnologie assistive.

<Pitfall>

Con la [renderizzazione lato server](/reference/react-dom/server) **`useId` richiede un albero di componenti identico sul server e sul client**. Se gli alberi che renderizzi sul server e sul client non corrispondono esattamente, gli ID generati non corrisponderanno.

</Pitfall>

<DeepDive>

#### Perché useId è migliore di un contatore incrementale? {/*why-is-useid-better-than-an-incrementing-counter*/}

Potresti chiederti perché `useId` è migliore di incrementare una variabile globale come `nextId++`.

Il vantaggio principale di `useId` è che React garantisce che funzioni con la [renderizzazione lato server](/reference/react-dom/server). Durante la renderizzazione lato server, i tuoi componenti generano output HTML. In seguito, sul client, l'[hydration](/reference/react-dom/client/hydrateRoot) collega i tuoi gestori di eventi all'HTML generato. Affinché l'hydration funzioni, l'output del client deve corrispondere all'HTML del server.

È molto difficile garantirlo con un contatore incrementale, perché l'ordine in cui i Client Component vengono idratati potrebbe non corrispondere all'ordine in cui l'HTML del server è stato emesso. Chiamando `useId`, ti assicuri che l'hydration funzioni e che l'output corrisponda tra server e client.

All'interno di React, `useId` è generato dal "parent path" del componente chiamante. Ecco perché, se l'albero del client e quello del server sono uguali, il "parent path" corrisponderà indipendentemente dall'ordine di renderizzazione.

</DeepDive>

---

### Generare ID per più elementi correlati {/*generating-ids-for-several-related-elements*/}

Se devi assegnare ID a più elementi correlati, puoi chiamare `useId` per generare un prefisso condiviso per loro:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>Nome:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Cognome:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Questo ti permette di evitare di chiamare `useId` per ogni singolo elemento che ha bisogno di un ID univoco.

---

### Specificare un prefisso condiviso per tutti gli ID generati {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Se renderizzi più applicazioni React indipendenti su una singola pagina, passa `identifierPrefix` come opzione alle tue chiamate a [`createRoot`](/reference/react-dom/client/createRoot#parameters) o [`hydrateRoot`](/reference/react-dom/client/hydrateRoot). Questo garantisce che gli ID generati dalle due app diverse non entrino mai in conflitto, perché ogni identificatore generato con `useId` inizierà con il prefisso distinto che hai specificato.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>La mia app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Identificatore generato:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        La password deve contenere almeno 18 caratteri
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Scegli password</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### Usare lo stesso prefisso ID sul client e sul server {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

Se [renderizzi più applicazioni React indipendenti sulla stessa pagina](#specifying-a-shared-prefix-for-all-generated-ids) e alcune di queste app sono renderizzate lato server, assicurati che l'`identifierPrefix` che passi alla chiamata a [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) sul client sia lo stesso `identifierPrefix` che passi alle [API del server](/reference/react-dom/server) come [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

Non devi passare `identifierPrefix` se hai solo un'app React sulla pagina.
