---
title: "React v19"
author: The React Team
date: 2024/12/05
description: React 19 è ora disponibile su npm! In questo post presentiamo una panoramica delle nuove funzionalità di React 19 e di come adottarle.
translationStatus: ai-draft
---

5 dicembre 2024 del [React Team](/community/team)

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2024/12/05/react-19.md).

</Note>

<Note>

### React 19 è ora stabile! {/*react-19-is-now-stable*/}

Aggiunte da quando questo post è stato condiviso originariamente con la React 19 RC ad aprile:

- **Pre-warming per alberi sospesi**: vedi [Miglioramenti a Suspense](/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense).
- **API statiche React DOM**: vedi [Nuove API statiche React DOM](#new-react-dom-static-apis).

_La data di questo post è stata aggiornata per riflettere la data del rilascio stabile._

</Note>

<Intro>

React v19 è ora disponibile su npm!

</Intro>

Nella nostra [Guida all'upgrade a React 19](/blog/2024/04/25/react-19-upgrade-guide), abbiamo condiviso istruzioni passo passo per aggiornare la tua app a React 19. In questo post presentiamo una panoramica delle nuove funzionalità di React 19 e di come adottarle.

- [Novità in React 19](#whats-new-in-react-19)
- [Miglioramenti in React 19](#improvements-in-react-19)
- [Come effettuare l'upgrade](#how-to-upgrade)

Per l'elenco delle breaking change, consulta la [Guida all'upgrade](/blog/2024/04/25/react-19-upgrade-guide).

---

## Novità in React 19 {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

Un caso d'uso comune nelle app React è eseguire una mutazione dati e poi aggiornare lo state in risposta. Ad esempio, quando un utente invia un form per cambiare il nome, farai una richiesta API e poi gestirai la risposta. In passato, avresti dovuto gestire manualmente state pending, errori, aggiornamenti ottimistici e richieste sequenziali.

Ad esempio, potevi gestire lo state pending e di errore in `useState`:

```js
// Before Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    }
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

In React 19 aggiungiamo supporto per usare funzioni async nelle transition per gestire automaticamente state pending, errori, form e aggiornamenti ottimistici.

Ad esempio, puoi usare `useTransition` per gestire lo state pending per te:

```js
// Using pending state from Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      }
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

La transition async imposterà immediatamente lo state `isPending` a true, eseguirà le richieste async e imposterà `isPending` a false dopo le transition. Questo ti permette di mantenere l'UI corrente reattiva e interattiva mentre i dati cambiano.

<Note>

#### Per convenzione, le funzioni che usano async transition si chiamano "Actions". {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Le Actions gestiscono automaticamente l'invio dei dati per te:

- **State pending**: le Actions forniscono uno state pending che inizia all'inizio di una richiesta e si resetta automaticamente quando l'aggiornamento dello state finale viene committato.
- **Aggiornamenti ottimistici**: le Actions supportano il nuovo hook [`useOptimistic`](#new-hook-optimistic-updates) così puoi mostrare feedback istantaneo agli utenti mentre le richieste vengono inviate.
- **Gestione errori**: le Actions forniscono gestione errori così puoi visualizzare un contenitore di errori quando una richiesta fallisce e ripristinare automaticamente gli aggiornamenti ottimistici al valore originale.
- **Form**: gli elementi `<form>` ora supportano il passaggio di funzioni alle props `action` e `formAction`. Passare funzioni alle props `action` usa le Actions per impostazione predefinita e resetta il form automaticamente dopo l'invio.

</Note>

Basandosi sulle Actions, React 19 introduce [`useOptimistic`](#new-hook-optimistic-updates) per gestire aggiornamenti ottimistici e un nuovo hook [`React.useActionState`](#new-hook-useactionstate) per gestire i casi comuni delle Actions. In `react-dom` aggiungiamo [`<form>` Actions](#form-actions) per gestire i form automaticamente e [`useFormStatus`](#new-hook-useformstatus) per supportare i casi comuni delle Actions nei form.

In React 19, l'esempio sopra può essere semplificato in:

```js
// Using <form> Actions and useActionState
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

Nella sezione successiva, analizziamo ciascuna delle nuove funzionalità Action in React 19.

### Nuovo hook: `useActionState` {/*new-hook-useactionstate*/}

Per rendere più semplici i casi comuni per le Actions, abbiamo aggiunto un nuovo hook chiamato `useActionState`:

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // You can return any result of the action.
      // Here, we return only the error.
      return error;
    }

    // handle success
    return null;
  },
  null,
);
```

`useActionState` accetta una funzione (l'"Action") e restituisce un'Action wrappata da chiamare. Funziona perché le Actions compongono. Quando l'Action wrappata viene chiamata, `useActionState` restituirà l'ultimo risultato dell'Action come `data` e lo state pending dell'Action come `pending`.

<Note>

`React.useActionState` si chiamava precedentemente `ReactDOM.useFormState` nei rilasci Canary, ma l'abbiamo rinominato e deprecato `useFormState`.

Vedi [#28491](https://github.com/react/react/pull/28491) per maggiori informazioni.

</Note>

Per maggiori informazioni, consulta la documentazione di [`useActionState`](/reference/react/useActionState).

### React DOM: Actions `<form>` {/*form-actions*/}

Le Actions sono anche integrate con le nuove funzionalità `<form>` di React 19 per `react-dom`. Abbiamo aggiunto supporto per passare funzioni come props `action` e `formAction` di elementi `<form>`, `<input>` e `<button>` per inviare automaticamente form con le Actions:

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

Quando un'Action `<form>` ha successo, React resetterà automaticamente il form per componenti uncontrolled. Se devi resettare il `<form>` manualmente, puoi chiamare la nuova API React DOM `requestFormReset`.

Per maggiori informazioni, consulta la documentazione `react-dom` per [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input) e `<button>`.

### React DOM: nuovo hook `useFormStatus` {/*new-hook-useformstatus*/}

Nei design system, è comune scrivere componenti di design che necessitano accesso a informazioni sul `<form>` in cui si trovano, senza fare prop drilling fino al componente. Questo può essere fatto via Context, ma per rendere più semplice il caso comune, abbiamo aggiunto un nuovo hook `useFormStatus`:

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` legge lo status del `<form>` genitore come se il form fosse un Context provider.

Per maggiori informazioni, consulta la documentazione `react-dom` per [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### Nuovo hook: `useOptimistic` {/*new-hook-optimistic-updates*/}

Un altro pattern UI comune quando si esegue una mutazione dati è mostrare lo state finale in modo ottimistico mentre la richiesta async è in corso. In React 19 aggiungiamo un nuovo hook chiamato `useOptimistic` per renderlo più semplice:

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

L'hook `useOptimistic` renderizzerà immediatamente `optimisticName` mentre la richiesta `updateName` è in corso. Quando l'aggiornamento termina o va in errore, React tornerà automaticamente al valore `currentName`.

Per maggiori informazioni, consulta la documentazione di [`useOptimistic`](/reference/react/useOptimistic).

### Nuova API: `use` {/*new-feature-use*/}

In React 19 introduciamo una nuova API per leggere risorse in render: `use`.

Ad esempio, puoi leggere una promise con `use`, e React sospenderà finché la promise non si risolve:

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` will suspend until the promise resolves.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // When `use` suspends in Comments,
  // this Suspense boundary will be shown.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` non supporta promise create in render. {/*use-does-not-support-promises-created-in-render*/}

Se provi a passare una promise creata in render a `use`, React avviserà:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.

</ConsoleLogLine>

</ConsoleBlockMulti>

Per correggere, devi passare una promise da una libreria o framework powered by Suspense che supporta il caching per le promise. In futuro prevediamo di rilasciare funzionalità per rendere più semplice il caching delle promise in render.

</Note>

Puoi anche leggere context con `use`, permettendoti di leggere Context condizionalmente, ad esempio dopo early return:

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }

  // This would not work with useContext
  // because of the early return.
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

L'API `use` può essere chiamata solo in render, simile agli hooks. A differenza degli hooks, `use` può essere chiamato condizionalmente. In futuro prevediamo di supportare più modi per consumare risorse in render con `use`.

Per maggiori informazioni, consulta la documentazione di [`use`](/reference/react/use).

## Nuove API statiche React DOM {/*new-react-dom-static-apis*/}

Abbiamo aggiunto due nuove API a `react-dom/static` per la generazione di siti statici:
- [`prerender`](/reference/react-dom/static/prerender)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

Queste nuove API migliorano `renderToString` aspettando il caricamento dei dati per la generazione di HTML statico. Sono progettate per funzionare con ambienti streaming come Node.js Streams e Web Streams. Ad esempio, in un ambiente Web Stream, puoi pre-renderizzare un albero React in HTML statico con `prerender`:

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Le API Prerender aspetteranno che tutti i dati siano caricati prima di restituire lo stream HTML statico. Gli stream possono essere convertiti in stringhe o inviati con una risposta streaming. Non supportano lo streaming del contenuto mentre si carica, supportato dalle esistenti [API di server rendering React DOM](/reference/react-dom/server).

Per maggiori informazioni, consulta [API statiche React DOM](/reference/react-dom/static).

## React Server Components {/*react-server-components*/}

### Server Components {/*server-components*/}

I Server Components sono una nuova opzione che permette di renderizzare componenti in anticipo, prima del bundling, in un ambiente separato dall'applicazione client o dal server SSR. Questo ambiente separato è il "server" nei React Server Components. I Server Components possono girare una volta al build time sul server CI, o possono essere eseguiti per ogni richiesta usando un web server.

React 19 include tutte le funzionalità React Server Components incluse dal canale Canary. Questo significa che le librerie che distribuiscono Server Components possono ora puntare a React 19 come peer dependency con una [export condition](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) `react-server` per l'uso in framework che supportano la [Full-stack React Architecture](/learn/creating-a-react-app#which-features-make-up-the-react-teams-full-stack-architecture-vision).


<Note>

#### Come costruisco supporto per Server Components? {/*how-do-i-build-support-for-server-components*/}

Sebbene i React Server Components in React 19 siano stabili e non si romperanno tra versioni minor, le API sottostanti usate per implementare un bundler o framework React Server Components non seguono semver e possono rompersi tra minor in React 19.x.

Per supportare React Server Components come bundler o framework, consigliamo di fissare una versione specifica di React o usare il rilascio Canary. Continueremo a lavorare con bundler e framework per stabilizzare le API usate per implementare React Server Components in futuro.

</Note>


Per approfondire, consulta la documentazione dei [React Server Components](/reference/rsc/server-components).

### Server Actions {/*server-actions*/}

Le Server Actions permettono ai Client Components di chiamare funzioni async eseguite sul server.

Quando una Server Action è definita con la direttiva `"use server"`, il tuo framework creerà automaticamente un riferimento alla funzione server e passerà quel riferimento al Client Component. Quando quella funzione viene chiamata sul client, React invierà una richiesta al server per eseguire la funzione e restituirà il risultato.

<Note>

#### Non esiste una direttiva per i Server Components. {/*there-is-no-directive-for-server-components*/}

Un malinteso comune è che i Server Components siano indicati da `"use server"`, ma non esiste una direttiva per i Server Components. La direttiva `"use server"` è usata per le Server Actions.

Per maggiori informazioni, consulta la documentazione delle [Directives](/reference/rsc/directives).

</Note>

Le Server Actions possono essere create in Server Components e passate come props a Client Components, oppure possono essere importate e usate in Client Components.

Per approfondire, consulta la documentazione delle [React Server Actions](/reference/rsc/server-actions).

## Miglioramenti in React 19 {/*improvements-in-react-19*/}

### `ref` come prop {/*ref-as-a-prop*/}

A partire da React 19, puoi accedere a `ref` come prop per componenti funzione:

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

I nuovi componenti funzione non avranno più bisogno di `forwardRef`, e pubblicheremo un codemod per aggiornare automaticamente i componenti per usare la nuova prop `ref`. Nelle versioni future deprecheremo e rimuoveremo `forwardRef`.

<Note>

Le `ref` passate alle classi non vengono passate come props poiché fanno riferimento all'istanza del componente.

</Note>

### Diff per errori di hydration {/*diffs-for-hydration-errors*/}

Abbiamo anche migliorato la segnalazione errori per errori di hydration in `react-dom`. Ad esempio, invece di registrare più errori in DEV senza informazioni sul mismatch:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

Ora registriamo un singolo messaggio con un diff del mismatch:


<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### `<Context>` come provider {/*context-as-a-provider*/}

In React 19, puoi renderizzare `<Context>` come provider invece di `<Context.Provider>`:


```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );
}
```

I nuovi Context provider possono usare `<Context>` e pubblicheremo un codemod per convertire i provider esistenti. Nelle versioni future depreceremo `<Context.Provider>`.

### Cleanup function per le ref {/*cleanup-functions-for-refs*/}

Ora supportiamo il ritorno di una cleanup function dalle ref callback:

```js {7-9}
<input
  ref={(ref) => {
    // ref created

    // NEW: return a cleanup function to reset
    // the ref when element is removed from DOM.
    return () => {
      // ref cleanup
    };
  }}
/>
```

Quando il componente viene smontato, React chiamerà la cleanup function restituita dalla ref callback. Funziona per DOM ref, ref a componenti classe e `useImperativeHandle`.

<Note>

In precedenza, React chiamava le funzioni `ref` con `null` quando smontava il componente. Se la tua `ref` restituisce una cleanup function, React salterà ora questo passo.

Nelle versioni future depreceremo la chiamata delle ref con `null` quando si smontano i componenti.

</Note>

A causa dell'introduzione delle ref cleanup function, restituire qualsiasi altra cosa da una ref callback verrà ora rifiutato da TypeScript. La correzione di solito consiste nel smettere di usare return impliciti, ad esempio:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

Il codice originale restituiva l'istanza dell'`HTMLDivElement` e TypeScript non sapeva se _doveva_ essere una cleanup function o se non volevi restituire una cleanup function.

Puoi fare codemod di questo pattern con [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return).

### Valore iniziale di `useDeferredValue` {/*use-deferred-value-initial-value*/}

Abbiamo aggiunto un'opzione `initialValue` a `useDeferredValue`:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // On initial render the value is ''.
  // Then a re-render is scheduled with the deferredValue.
  const value = useDeferredValue(deferredValue, '');

  return (
    <Results query={value} />
  );
}
````

Quando <CodeStep step={2}>initialValue</CodeStep> è fornito, `useDeferredValue` lo restituirà come `value` per il render iniziale del componente e pianificherà un re-render in background con il <CodeStep step={1}>deferredValue</CodeStep> restituito.

Per approfondire, consulta [`useDeferredValue`](/reference/react/useDeferredValue).

### Supporto per Document Metadata {/*support-for-metadata-tags*/}

In HTML, i tag di metadata del documento come `<title>`, `<link>` e `<meta>` sono riservati al posizionamento nella sezione `<head>` del documento. In React, il componente che decide quale metadata è appropriato per l'app può essere molto lontano dal punto in cui renderizzi il `<head>` o React non renderizza affatto il `<head>`. In passato, questi elementi dovevano essere inseriti manualmente in un effetto o da librerie come [`react-helmet`](https://github.com/nfl/react-helmet), e richiedevano gestione attenta durante il server rendering di un'applicazione React.

In React 19 aggiungiamo supporto per renderizzare tag di metadata del documento nei componenti nativamente:

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

Quando React renderizza questo componente, vedrà i tag `<title>`, `<link>` e `<meta>` e li solleverà automaticamente nella sezione `<head>` del documento. Supportando nativamente questi tag di metadata, possiamo assicurarci che funzionino con app solo client, streaming SSR e Server Components.

<Note>

#### Potresti comunque volere una libreria Metadata {/*you-may-still-want-a-metadata-library*/}

Per casi d'uso semplici, renderizzare Document Metadata come tag può essere adatto, ma le librerie possono offrire funzionalità più potenti come sovrascrivere metadata generici con metadata specifici in base alla route corrente. Queste funzionalità rendono più semplice per framework e librerie come [`react-helmet`](https://github.com/nfl/react-helmet) supportare tag di metadata, piuttosto che sostituirli.

</Note>

Per maggiori informazioni, consulta la documentazione di [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link), and [`<meta>`](/reference/react-dom/components/meta).

### Supporto per stylesheet {/*support-for-stylesheets*/}

Gli stylesheet, sia collegati esternamente (`<link rel="stylesheet" href="...">`) sia inline (`<style>...</style>`), richiedono posizionamento attento nel DOM a causa delle regole di precedenza degli stili. Costruire una capacità stylesheet che permetta componibilità nei componenti è difficile, quindi gli utenti spesso finiscono per caricare tutti gli stili lontano dai componenti che possono dipenderne, oppure usano una libreria di stili che incapsula questa complessità.

In React 19 affrontiamo questa complessità e forniamo un'integrazione ancora più profonda nel Concurrent Rendering sul Client e nello Streaming Rendering sul Server con supporto integrato per gli stylesheet. Se dici a React la `precedence` del tuo stylesheet, gestirà l'ordine di inserimento dello stylesheet nel DOM e assicurerà che lo stylesheet (se esterno) sia caricato prima di rivelare contenuto che dipende da quelle regole di stile.

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- will be inserted between foo & bar
    </div>
  )
}
```

Durante il Server Side Rendering React includerà lo stylesheet nel `<head>`, assicurando che il browser non faccia paint finché non è caricato. Se lo stylesheet viene scoperto tardi dopo che abbiamo già iniziato lo streaming, React assicurerà che lo stylesheet venga inserito nel `<head>` sul client prima di rivelare il contenuto di un boundary Suspense che dipende da quello stylesheet.

Durante il Client Side Rendering React aspetterà che i nuovi stylesheet renderizzati siano caricati prima di committare il render. Se renderizzi questo componente da più punti nella tua applicazione, React includerà lo stylesheet nel documento una sola volta:

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // won't lead to a duplicate stylesheet link in the DOM
  </>
}
```

Per gli utenti abituati a caricare stylesheet manualmente, questa è un'opportunità per posizionare quegli stylesheet accanto ai componenti che dipendono da essi, permettendo un migliore ragionamento locale e rendendo più semplice assicurarsi di caricare solo gli stylesheet di cui hai effettivamente bisogno.

Le librerie di stili e le integrazioni di stile con i bundler possono anche adottare questa nuova capacità, quindi anche se non renderizzi direttamente i tuoi stylesheet, puoi comunque beneficiarne man mano che i tuoi strumenti vengono aggiornati per usare questa funzionalità.

Per maggiori dettagli, consulta la documentazione di [`<link>`](/reference/react-dom/components/link) and [`<style>`](/reference/react-dom/components/style).

### Supporto per script async {/*support-for-async-scripts*/}

In HTML, gli script normali (`<script src="...">`) e gli script deferred (`<script defer="" src="...">`) si caricano nell'ordine del documento, il che rende difficile renderizzare questi tipi di script in profondità nell'albero dei componenti. Gli script async (`<script async="" src="...">`) invece si caricano in ordine arbitrario.

In React 19 abbiamo incluso un supporto migliore per gli script async permettendoti di renderizzarli ovunque nell'albero dei componenti, dentro i componenti che effettivamente dipendono dallo script, senza dover gestire lo spostamento e la deduplicazione delle istanze script.

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // won't lead to duplicate script in the DOM
    </body>
  </html>
}
```

In tutti gli ambienti di rendering, gli script async verranno deduplicati così che React caricherà ed eseguirà lo script una sola volta anche se viene renderizzato da più componenti diversi.

Nel Server Side Rendering, gli script async verranno inclusi nel `<head>` e prioritizzati dietro risorse più critiche che bloccano il paint come stylesheet, font e preload di immagini.

Per maggiori dettagli, consulta la documentazione di [`<script>`](/reference/react-dom/components/script).

### Supporto per preload delle risorse {/*support-for-preloading-resources*/}

Durante il caricamento iniziale del documento e negli aggiornamenti client side, informare il Browser delle risorse che probabilmente dovrà caricare il prima possibile può avere un effetto drammatico sulle performance della pagina.

React 19 include diverse nuove API per caricare e pre-caricare risorse del Browser per rendere il più semplice possibile costruire grandi esperienze non limitate da un caricamento inefficiente delle risorse.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // loads and executes this script eagerly
  preload('https://.../path/to/font.woff', { as: 'font' }) // preloads this font
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // preloads this stylesheet
  prefetchDNS('https://...') // when you may not actually request anything from this host
  preconnect('https://...') // when you will request something but aren't sure what
}
```
```html
<!-- the above would result in the following DOM/HTML -->
<html>
  <head>
    <!-- links/scripts are prioritized by their utility to early loading, not call order -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Queste API possono essere usate per ottimizzare i caricamenti iniziali della pagina spostando la scoperta di risorse aggiuntive come i font fuori dal caricamento degli stylesheet. Possono anche rendere gli aggiornamenti client più veloci prefetchando un elenco di risorse usate da una navigazione anticipata e poi pre-caricando eager quelle risorse al click o persino all'hover.

Per maggiori dettagli consulta le [Resource Preloading APIs](/reference/react-dom#resource-preloading-apis).

### Compatibilità con script di terze parti ed estensioni {/*compatibility-with-third-party-scripts-and-extensions*/}

Abbiamo migliorato l'hydration per tenere conto di script di terze parti ed estensioni del browser.

Durante l'hydration, se un elemento renderizzato sul client non corrisponde all'elemento trovato nell'HTML dal server, React forzerà un re-render client per correggere il contenuto. In precedenza, se un elemento veniva inserito da script di terze parti o estensioni del browser, scatenava un errore di mismatch e un render client.

In React 19, i tag inaspettati in `<head>` e `<body>` verranno saltati, evitando errori di mismatch. Se React deve re-renderizzare l'intero documento a causa di un hydration mismatch non correlato, lascerà in place gli stylesheet inseriti da script di terze parti ed estensioni del browser.

### Migliore segnalazione errori {/*error-handling*/}

Abbiamo migliorato la gestione errori in React 19 per rimuovere la duplicazione e fornire opzioni per gestire errori catturati e non catturati. Ad esempio, quando c'è un errore in render catturato da un contenitore di errori, in precedenza React lanciava l'errore due volte (una per l'errore originale, poi di nuovo dopo il fallimento del recupero automatico) e poi chiamava `console.error` con info su dove è avvenuto l'errore.

Questo produceva tre errori per ogni errore catturato:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicate</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

In React 19, registriamo un singolo errore con tutte le informazioni sull'errore incluse:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

Inoltre, abbiamo aggiunto due nuove opzioni root per complementare `onRecoverableError`:

- `onCaughtError`: chiamato quando React cattura un errore in un contenitore di errori.
- `onUncaughtError`: chiamato quando un errore viene lanciato e non catturato da un contenitore di errori.
- `onRecoverableError`: chiamato quando un errore viene lanciato e recuperato automaticamente.

Per maggiori informazioni ed esempi, consulta la documentazione di [`createRoot`](/reference/react-dom/client/createRoot) e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).

### Supporto per Custom Elements {/*support-for-custom-elements*/}

React 19 aggiunge supporto completo per custom element e supera tutti i test su [Custom Elements Everywhere](https://custom-elements-everywhere.com/).

Nelle versioni passate, usare Custom Elements in React è stato difficile perché React trattava props non riconosciute come attributi piuttosto che proprietà. In React 19, abbiamo aggiunto supporto per proprietà che funziona sul client e durante SSR con la seguente strategia:

- **Server Side Rendering**: le props passate a un custom element verranno renderizzate come attributi se il loro tipo è un valore primitivo come `string`, `number`, o il valore è `true`. Props con tipi non primitivi come `object`, `symbol`, `function`, o valore `false` verranno omesse.
- **Client Side Rendering**: le props che corrispondono a una proprietà sull'istanza del Custom Element verranno assegnate come proprietà, altrimenti verranno assegnate come attributi.

Grazie a [Joey Arhar](https://github.com/josepharhar) per aver guidato il design e l'implementazione del supporto Custom Element in React.


#### Come effettuare l'upgrade {/*how-to-upgrade*/}
Consulta la [Guida all'upgrade a React 19](/blog/2024/04/25/react-19-upgrade-guide) per istruzioni passo passo e l'elenco completo di breaking change e modifiche rilevanti.

_Nota: questo post è stato pubblicato originariamente il 25/04/2024 ed è stato aggiornato al 05/12/2024 con il rilascio stabile._
