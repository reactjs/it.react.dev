---
title: createContext
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/createContext.md).

</Note>

<Intro>

`createContext` ti permette di creare un [context](/learn/passing-data-deeply-with-context) che i componenti possono fornire o leggere.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Chiama `createContext` al di fuori di qualsiasi componente per creare un context.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `defaultValue`: Il valore che vuoi che il context abbia quando non c'è un context provider corrispondente nell'albero sopra il componente che legge il context. Se non hai un valore predefinito significativo, specifica `null`. Il valore predefinito è pensato come fallback "d'ultima risorsa". È statico e non cambia mai nel tempo.

#### Returns {/*returns*/}

`createContext` restituisce un oggetto context.

**L'oggetto context in sé non contiene alcuna informazione.** Rappresenta _quale_ context altri componenti leggono o forniscono. In genere, userai [`SomeContext`](#provider) nei componenti sopra per specificare il valore del context, e chiamerai [`useContext(SomeContext)`](/reference/react/useContext) nei componenti sotto per leggerlo. L'oggetto context ha alcune proprietà:

* `SomeContext` ti permette di fornire il valore del context ai componenti.
* `SomeContext.Consumer` è un modo alternativo e raramente usato per leggere il valore del context.
* `SomeContext.Provider` è un modo legacy per fornire il valore del context prima di React 19.

---

### Provider di `SomeContext` {/*provider*/}

Avvolgi i tuoi componenti in un context provider per specificare il valore di questo context per tutti i componenti al suo interno:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}
```

<Note>

A partire da React 19, puoi renderizzare `<SomeContext>` come provider.

Nelle versioni precedenti di React, usa `<SomeContext.Provider>`.

</Note>

#### Props {/*provider-props*/}

* `value`: Il valore che vuoi passare a tutti i componenti che leggono questo context all'interno di questo provider, indipendentemente dalla profondità. Il valore del context può essere di qualsiasi tipo. Un componente che chiama [`useContext(SomeContext)`](/reference/react/useContext) all'interno del provider riceve il `value` del context provider corrispondente più interno sopra di esso.

---

### `SomeContext.Consumer` {/*consumer*/}

Prima che esistesse `useContext`, c'era un modo più vecchio per leggere il context:

```js
function Button() {
  // 🟡 Modo legacy (sconsigliato)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Anche se questo modo più vecchio funziona ancora, **il codice scritto di recente dovrebbe leggere il context con [`useContext()`](/reference/react/useContext) invece:**

```js
function Button() {
  // ✅ Modo consigliato
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: Una funzione. React chiamerà la funzione che passi con il valore attuale del context determinato dallo stesso algoritmo usato da [`useContext()`](/reference/react/useContext), e renderizzerà il risultato che restituisci da questa funzione. React rieseguirà anche questa funzione e aggiornerà l'UI ogni volta che il context dei componenti genitori cambia.

---

## Usage {/*usage*/}

### Creare un context {/*creating-context*/}

Il context consente ai componenti di [passare informazioni in profondità](/learn/passing-data-deeply-with-context) senza passare esplicitamente le props.

Chiama `createContext` al di fuori di qualsiasi componente per creare uno o più context.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` restituisce un <CodeStep step={1}>oggetto context</CodeStep>. I componenti possono leggere il context passandolo a [`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

Per impostazione predefinita, i valori che ricevono saranno i <CodeStep step={3}>valori predefiniti</CodeStep> che hai specificato quando hai creato i context. Tuttavia, da solo questo non è utile perché i valori predefiniti non cambiano mai.

Il context è utile perché puoi **fornire altri valori dinamici dai tuoi componenti:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

Ora il componente `Page` e qualsiasi componente al suo interno, indipendentemente dalla profondità, "vedrà" i valori del context passati. Se i valori del context passati cambiano, React ri-renderizzerà anche i componenti che leggono il context.

[Leggi di più sulla lettura e la fornitura del context e vedi esempi.](/reference/react/useContext)

---

### Importare ed esportare un context da un file {/*importing-and-exporting-context-from-a-file*/}

Spesso, componenti in file diversi avranno bisogno di accedere allo stesso context. Per questo è comune dichiarare i context in un file separato. Poi puoi usare l'[istruzione `export`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Statements/export) per mettere il context a disposizione di altri file:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

I componenti dichiarati in altri file possono poi usare l'[istruzione `import`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Statements/import) per leggere o fornire questo context:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

Funziona in modo simile a [importare ed esportare componenti.](/learn/importing-and-exporting-components)

---

## Troubleshooting {/*troubleshooting*/}

### Non trovo un modo per cambiare il valore del context {/*i-cant-find-a-way-to-change-the-context-value*/}


Codice come questo specifica il valore *predefinito* del context:

```js
const ThemeContext = createContext('light');
```

Questo valore non cambia mai. React usa questo valore solo come fallback se non trova un provider corrispondente sopra.

Per far cambiare il context nel tempo, [aggiungi lo state e avvolgi i componenti in un context provider.](/reference/react/useContext#updating-data-passed-via-context)
