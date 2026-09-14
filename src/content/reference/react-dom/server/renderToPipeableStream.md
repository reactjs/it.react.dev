---
title: renderToPipeableStream
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/server/renderToPipeableStream.md).

</Note>

<Intro>

`renderToPipeableStream` renderizza un albero React in uno [Stream Node.js pipeable.](https://nodejs.org/api/stream.html)

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Questa API è specifica per Node.js. Negli ambienti con [Web Streams,](https://developer.mozilla.org/it/docs/Web/API/Streams_API) come Deno e i moderni edge runtime, usa invece [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream).

</Note>

---

## Reference {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

Chiama `renderToPipeableStream` per renderizzare il tuo albero React come HTML in uno [Stream Node.js.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Sul client, chiama [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) per idratare l'HTML generato sul server e attivarne l'interattività.

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: Un nodo React che vuoi renderizzare in HTML. Ad esempio, un elemento JSX come `<App />`. Si presume che rappresenti l'intero documento, quindi il componente `App` dovrebbe renderizzare il tag `<html>`.

* **optional** `options`: Un oggetto con opzioni di streaming.
  * **optional** `bootstrapScriptContent`: Se specificato, questa stringa verrà inserita in un tag `<script>` inline.
  * **optional** `bootstrapScripts`: Un array di URL stringa per i tag `<script>` da emettere nella pagina. Usalo per includere lo `<script>` che chiama [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Omettilo se non vuoi eseguire React sul client.
  * **optional** `bootstrapModules`: Come `bootstrapScripts`, ma emette [`<script type="module">`](https://developer.mozilla.org/it/docs/Web/JavaScript/Guide/Modules) al posto degli script normali.
  * **optional** `formState`: Lo state del form da un invio di form gestito da una [Server Function](/reference/rsc/server-functions). Se la pagina viene renderizzata in risposta all'invio di un form che usa [`useActionState`](/reference/react/useActionState) con un `permalink`, passa lo state del form risultante così che React lo incorpori nell'HTML per l'hydration. Lo stesso valore deve essere passato a [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) sul client. Di solito viene passato dal tuo framework.
  * **optional** `identifierPrefix`: Un prefisso stringa che React usa per gli ID generati da [`useId`.](/reference/react/useId) Utile per evitare conflitti quando usi più root sulla stessa pagina. Deve essere lo stesso prefisso passato a [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **optional** `importMap`: Un oggetto [import map](https://developer.mozilla.org/it/docs/Web/HTML/Element/script/type/importmap) con le proprietà `imports` e `scopes`. React lo emette come tag `<script type="importmap">` inline prima di qualsiasi script di modulo, così i tag `<script type="module">` (ad esempio, da `bootstrapModules`) possono usare specificatori di modulo bare. <CanaryBadge /> Quando `nonce` è impostato, viene applicato anche allo script import map.
  * **optional** `maxHeadersLength`: La lunghezza totale massima del contenuto dell'header passato a `onHeaders`, misurata in unità di codice UTF-16. Il valore predefinito è 2000. Una volta raggiunto il limite, React smette di aggiungere resource hint agli header.
  * **optional** `namespaceURI`: Una stringa con l'[namespace URI](https://developer.mozilla.org/it/docs/Web/API/Document/createElementNS#important_namespace_uris) root per lo stream. Il valore predefinito è HTML normale. Passa `'http://www.w3.org/2000/svg'` per SVG o `'http://www.w3.org/1998/Math/MathML'` per MathML.
  * **optional** `nonce`: Una stringa [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) per consentire gli script per [`script-src` Content-Security-Policy](https://developer.mozilla.org/it/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). Per usare nonce diversi per script e stili, passa un oggetto con le proprietà `script` e `style`.
  * **optional** `onAllReady`: Una callback che viene chiamata quando tutta la renderizzazione è completa, inclusi sia la [shell](#specifying-what-goes-into-the-shell) sia tutto il [contenuto aggiuntivo.](#streaming-more-content-as-it-loads) Puoi usarla al posto di `onShellReady` [per crawler e generazione statica.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Se inizi lo streaming qui, non otterrai alcun caricamento progressivo. Lo stream conterrà l'HTML finale.
  * **optional** `onBrowserBailout`: Una callback che React chiama quando recupera da [`browser()`](/reference/react-dom/browser) lasciando un fallback Suspense che il browser sostituirà. Riceve un `Error` che descrive la renderizzazione solo browser e un oggetto `errorInfo` contenente il `componentStack`. Se a `browser` è stata passata una reason, è disponibile come `error.cause`. Per impostazione predefinita, React non fa nulla. [Vedi come segnalare la renderizzazione solo browser.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **optional** `onError`: Una callback che viene chiamata ogni volta che c'è un errore sul server, sia [recuperabile](#recovering-from-errors-outside-the-shell) sia [no.](#recovering-from-errors-inside-the-shell) Per impostazione predefinita, chiama solo `console.error`. Se la sovrascrivi per [registrare i crash report,](#logging-crashes-on-the-server) assicurati di chiamare comunque `console.error`. Puoi anche usarla per [regolare il codice di stato](#setting-the-status-code) prima che venga emessa la shell.
  * **optional** `onHeaders`: Una callback che viene chiamata quando React ha determinato i resource hint per il documento, come preconnect, stylesheet, font o preload di immagini ad alta priorità. Riceve un oggetto con una proprietà `Link` contenente il valore corrispondente dell'[header `Link`](https://developer.mozilla.org/it/docs/Web/HTTP/Headers/link), così puoi inviarlo come header di risposta HTTP o come risposta [103 Early Hints](https://developer.mozilla.org/it/docs/Web/HTTP/Status/103). React la chiama anche quando non ci sono resource hint da inviare. Il contenuto dell'header è limitato da `maxHeadersLength`.
  * **optional** `onShellReady`: Una callback che viene chiamata subito dopo che la [shell iniziale](#specifying-what-goes-into-the-shell) è stata renderizzata. Puoi [impostare il codice di stato](#setting-the-status-code) e chiamare `pipe` qui per avviare lo streaming. React [farà streaming del contenuto aggiuntivo](#streaming-more-content-as-it-loads) dopo la shell insieme ai tag `<script>` inline che sostituiscono i fallback di caricamento HTML con il contenuto.
  * **optional** `onShellError`: Una callback che viene chiamata se c'è stato un errore durante la renderizzazione della shell iniziale. Riceve l'errore come argomento. Non sono ancora stati emessi byte dallo stream, e né `onShellReady` né `onAllReady` verranno chiamati, quindi puoi [emettere una shell HTML di fallback.](#recovering-from-errors-inside-the-shell)
  * **optional** `progressiveChunkSize`: Il numero di byte in un chunk. [Leggi di più sull'euristica predefinita.](https://github.com/react/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### Returns {/*returns*/}

`renderToPipeableStream` restituisce un oggetto con due metodi:

* `pipe` scrive l'HTML nello [Stream Node.js Writable](https://nodejs.org/api/stream.html#writable-streams) fornito. Chiama `pipe` in `onShellReady` se vuoi abilitare lo streaming, o in `onAllReady` per crawler e generazione statica.
* `abort` ti permette di [interrompere la renderizzazione server](#aborting-server-rendering) e renderizzare il resto sul client.

---

## Usage {/*usage*/}

### Renderizzare un albero React come HTML in uno Stream Node.js {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

Chiama `renderToPipeableStream` per renderizzare il tuo albero React come HTML in uno [Stream Node.js:](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// La sintassi del route handler dipende dal tuo framework backend
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Insieme al <CodeStep step={1}>componente root</CodeStep>, devi fornire un elenco di <CodeStep step={2}>percorsi `<script>` bootstrap</CodeStep>. Il tuo componente root dovrebbe restituire **l'intero documento incluso il tag root `<html>`.**

Ad esempio, potrebbe essere così:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React inietterà il [doctype](https://developer.mozilla.org/it/docs/Glossary/Doctype) e i tuoi <CodeStep step={2}>tag `<script>` bootstrap</CodeStep> nello stream HTML risultante:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML dai tuoi componenti ... -->
</html>
<script src="/main.js" async=""></script>
```

Sul client, il tuo script bootstrap dovrebbe [idratare l'intero `document` con una chiamata a `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Questo attaccherà i listener di eventi all'HTML generato sul server e lo renderà interattivo.

<DeepDive>

#### Leggere i percorsi delle risorse CSS e JS dall'output della build {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Gli URL finali delle risorse (come file JavaScript e CSS) spesso vengono hashati dopo la build. Ad esempio, invece di `styles.css` potresti finire con `styles.123456.css`. L'hashing dei nomi file delle risorse statiche garantisce che ogni build distinta della stessa risorsa avrà un nome file diverso. Questo è utile perché ti permette di abilitare in sicurezza la cache a lungo termine per le risorse statiche: un file con un certo nome non cambierà mai contenuto.

Tuttavia, se non conosci gli URL delle risorse fino a dopo la build, non c'è modo di inserirli nel codice sorgente. Ad esempio, hardcodare `"/styles.css"` nel JSX come prima non funzionerebbe. Per tenerli fuori dal codice sorgente, il tuo componente root può leggere i nomi file reali da una mappa passata come prop:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

Sul server, renderizza `<App assetMap={assetMap} />` e passa la tua `assetMap` con gli URL delle risorse:

```js {1-5,8,9}
// Dovresti ottenere questo JSON dal tuo build tooling, ad es. leggerlo dall'output della build.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Poiché il tuo server ora renderizza `<App assetMap={assetMap} />`, devi renderizzarlo con `assetMap` anche sul client per evitare errori di hydration. Puoi serializzare e passare `assetMap` al client così:

```js {9-10}
// Dovresti ottenere questo JSON dal tuo build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Attenzione: è sicuro fare stringify() di questo perché questi dati non sono generati dall'utente.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Nell'esempio sopra, l'opzione `bootstrapScriptContent` aggiunge un tag `<script>` inline extra che imposta la variabile globale `window.assetMap` sul client. Questo permette al codice client di leggere la stessa `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Sia client che server renderizzano `App` con la stessa prop `assetMap`, quindi non ci sono errori di hydration.

</DeepDive>

---

### Fare streaming di più contenuto man mano che si carica {/*streaming-more-content-as-it-loads*/}

Lo streaming permette all'utente di iniziare a vedere il contenuto anche prima che tutti i dati siano stati caricati sul server. Ad esempio, considera una pagina profilo che mostra una cover, una sidebar con amici e foto, e un elenco di post:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

Immagina che caricare i dati per `<Posts />` richieda del tempo. Idealmente, vorresti mostrare il resto del contenuto della pagina profilo all'utente senza aspettare i post. Per farlo, [avvolgi `Posts` in un boundary `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Questo dice a React di iniziare a fare streaming dell'HTML prima che `Posts` carichi i suoi dati. React invierà prima l'HTML per il fallback di caricamento (`PostsGlimmer`), e poi, quando `Posts` finisce di caricare i suoi dati, React invierà l'HTML rimanente insieme a un tag `<script>` inline che sostituisce il fallback di caricamento con quell'HTML. Dal punto di vista dell'utente, la pagina apparirà prima con `PostsGlimmer`, poi sostituito da `Posts`.

Puoi [annidare ulteriormente i boundary `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) per creare una sequenza di caricamento più granulare:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

In questo esempio, React può iniziare a fare streaming della pagina ancora prima. Solo `ProfileLayout` e `ProfileCover` devono finire di renderizzare per primi perché non sono avvolti in alcun boundary `<Suspense>`. Tuttavia, se `Sidebar`, `Friends` o `Photos` devono caricare dei dati, React invierà l'HTML per il fallback `BigSpinner`. Poi, man mano che più dati diventano disponibili, più contenuto continuerà a essere rivelato finché tutto non diventa visibile.

Lo streaming non deve aspettare che React stesso si carichi nel browser, o che la tua app diventi interattiva. Il contenuto HTML dal server verrà rivelato progressivamente prima che uno qualsiasi dei tag `<script>` si carichi.

[Leggi di più su come funziona lo streaming HTML.](https://github.com/reactwg/react-18/discussions/37)

<Note>

Solo i dati letti da una fonte che [attiva un boundary Suspense](/reference/react/Suspense#what-activates-a-suspense-boundary), come una Promise letta con [`use`](/reference/react/use), andranno in sospensione durante la renderizzazione. Suspense non rileva i dati recuperati all'interno di un Effetto o di un gestore di eventi.

</Note>

---

### Specificare cosa va nella shell {/*specifying-what-goes-into-the-shell*/}

La parte della tua app al di fuori di qualsiasi boundary `<Suspense>` è chiamata *shell:*

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Determina la fase di caricamento più precoce che l'utente può vedere:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Se avvolgi l'intera app in un boundary `<Suspense>` alla root, la shell conterrà solo quello spinner. Tuttavia, non è un'esperienza utente piacevole perché vedere un grande spinner sullo schermo può sembrare più lento e fastidioso che aspettare un po' di più e vedere il layout reale. Ecco perché di solito vorrai posizionare i boundary `<Suspense>` in modo che la shell risulti *minima ma completa* — come uno skeleton dell'intero layout della pagina.

La callback `onShellReady` viene chiamata quando l'intera shell è stata renderizzata. Di solito, inizierai lo streaming allora:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Quando `onShellReady` viene chiamata, i componenti nei boundary `<Suspense>` annidati potrebbero ancora essere in fase di caricamento dati.

---

### Registrare i crash sul server {/*logging-crashes-on-the-server*/}

Per impostazione predefinita, tutti gli errori sul server vengono registrati nella console. Puoi sovrascrivere questo comportamento per registrare i crash report:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Se fornisci un'implementazione personalizzata di `onError`, non dimenticare di registrare anche gli errori nella console come sopra.

---

### Recuperare dagli errori all'interno della shell {/*recovering-from-errors-inside-the-shell*/}

In questo esempio, la shell contiene `ProfileLayout`, `ProfileCover` e `PostsGlimmer`:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Se si verifica un errore durante la renderizzazione di quei componenti, React non avrà HTML significativo da inviare al client. Sovrascrivi `onShellError` per inviare un HTML di fallback che non dipenda dalla renderizzazione server come ultima risorsa:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Se c'è un errore durante la generazione della shell, verranno chiamati sia `onError` sia `onShellError`. Usa `onError` per la segnalazione degli errori e `onShellError` per inviare il documento HTML di fallback. Il tuo HTML di fallback non deve essere una pagina di errore. Puoi invece includere una shell alternativa che renderizza la tua app solo sul client.

---

### Recuperare dagli errori al di fuori della shell {/*recovering-from-errors-outside-the-shell*/}

In questo esempio, il componente `<Posts />` è avvolto in `<Suspense>` quindi *non* fa parte della shell:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Se si verifica un errore nel componente `Posts` o da qualche parte al suo interno, React [proverà a recuperare:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. Emetterà il fallback di caricamento per il boundary `<Suspense>` più vicino (`PostsGlimmer`) nell'HTML.
2. "Rinuncerà" a provare a renderizzare il contenuto di `Posts` sul server.
3. Quando il codice JavaScript si carica sul client, React *riproverà* a renderizzare `Posts` sul client.

Se anche riprovare a renderizzare `Posts` sul client *fallisce*, React lancerà l'errore sul client. Come con tutti gli errori lanciati durante la renderizzazione, il [contenitore di errori padre più vicino](/reference/react/Component#static-getderivedstatefromerror) determina come presentare l'errore all'utente. In pratica, questo significa che l'utente vedrà un indicatore di caricamento finché non è certo che l'errore non sia recuperabile.

Se riprovare a renderizzare `Posts` sul client ha successo, il fallback di caricamento dal server verrà sostituito con l'output della renderizzazione client. L'utente non saprà che c'è stato un errore sul server. Tuttavia, la callback server `onError` e le callback client [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) verranno chiamate così che tu possa essere notificato dell'errore.

---

### Impostare il codice di stato {/*setting-the-status-code*/}

Lo streaming introduce un compromesso. Vuoi iniziare a fare streaming della pagina il prima possibile così che l'utente possa vedere il contenuto prima. Tuttavia, una volta iniziato lo streaming, non puoi più impostare il codice di stato della risposta.

[Dividendo la tua app](#specifying-what-goes-into-the-shell) nella shell (sopra tutti i boundary `<Suspense>`) e nel resto del contenuto, hai già risolto parte di questo problema. Se la shell va in errore, otterrai la callback `onShellError` che ti permette di impostare il codice di stato di errore. Altrimenti, sai che l'app può recuperare sul client, quindi puoi inviare "OK".

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Se un componente *al di fuori* della shell (cioè all'interno di un boundary `<Suspense>`) lancia un errore, React non smetterà di renderizzare. Questo significa che la callback `onError` verrà chiamata, ma otterrai comunque `onShellReady` invece di `onShellError`. Questo perché React proverà a recuperare da quell'errore sul client, [come descritto sopra.](#recovering-from-errors-outside-the-shell)

Tuttavia, se vuoi, puoi usare il fatto che qualcosa è andato in errore per impostare il codice di stato:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Questo catturerà solo gli errori al di fuori della shell che si sono verificati durante la generazione del contenuto iniziale della shell, quindi non è esaustivo. Se sapere se si è verificato un errore per un certo contenuto è critico, puoi spostarlo nella shell.

---

### Gestire errori diversi in modi diversi {/*handling-different-errors-in-different-ways*/}

Puoi [creare le tue sottoclassi di `Error`](https://javascript.info/custom-errors) e usare l'operatore [`instanceof`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/instanceof) per verificare quale errore viene lanciato. Ad esempio, puoi definire un `NotFoundError` personalizzato e lanciarlo dal tuo componente. Poi le tue callback `onError`, `onShellReady` e `onShellError` possono fare qualcosa di diverso a seconda del tipo di errore:

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Tieni presente che una volta emessa la shell e iniziato lo streaming, non puoi cambiare il codice di stato.

---

### Aspettare che tutto il contenuto si carichi per crawler e generazione statica {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Lo streaming offre una migliore esperienza utente perché l'utente può vedere il contenuto man mano che diventa disponibile.

Tuttavia, quando un crawler visita la tua pagina, o se stai generando le pagine al momento della build, potresti voler lasciare che tutto il contenuto si carichi prima e poi produrre l'output HTML finale invece di rivelarlo progressivamente.

Puoi aspettare che tutto il contenuto si carichi usando la callback `onAllReady`:


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... dipende dalla tua strategia di rilevamento bot ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Un visitatore normale riceverà uno stream di contenuto caricato progressivamente. Un crawler riceverà l'output HTML finale dopo che tutti i dati si sono caricati. Tuttavia, questo significa anche che il crawler dovrà aspettare *tutti* i dati, alcuni dei quali potrebbero essere lenti da caricare o andare in errore. A seconda della tua app, potresti scegliere di inviare la shell anche ai crawler.

---

### Interrompere la renderizzazione server {/*aborting-server-rendering*/}

Puoi forzare la renderizzazione server a "rinunciare" dopo un timeout:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React svuoterà i fallback di caricamento rimanenti come HTML e proverà a renderizzare il resto sul client.
