---
title: "React 19.2"
author: The React Team
date: 2025/10/01
description: React 19.2 aggiunge nuove funzionalità come Activity, React Performance Tracks, useEffectEvent e altro.
translationStatus: ai-draft
---

1 ottobre 2025 del [React Team](/community/team)

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2025/10/01/react-19-2.md).

</Note>

<Intro>

React 19.2 è ora disponibile su npm!

</Intro>

Questa è la nostra terza release nell'ultimo anno, dopo React 19 a dicembre e React 19.1 a giugno. In questo post daremo una panoramica delle nuove funzionalità in React 19.2 e metteremo in evidenza alcuni cambiamenti notevoli.

<InlineToc />

---

## Nuove funzionalità di React {/*new-react-features*/}

### `<Activity />` {/*activity*/}

`<Activity>` ti consente di suddividere la tua app in "activities" che possono essere controllate e priorizzate.

Puoi usare Activity come alternativa alla renderizzazione condizionale di parti della tua app:

```js
// Before
{isVisible && <Page />}

// After
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

In React 19.2, Activity supporta due modalità: `visible` e `hidden`.

- `hidden`: nasconde i figli, smonta gli Effetti e rimanda tutti gli aggiornamenti finché React non ha più nulla su cui lavorare.
- `visible`: mostra i figli, monta gli Effetti e consente agli aggiornamenti di essere elaborati normalmente.

Ciò significa che puoi pre-renderizzare e continuare a renderizzare parti nascoste dell'app senza impattare le performance di ciò che è visibile sullo schermo.

Puoi usare Activity per renderizzare parti nascoste dell'app verso cui l'utente probabilmente navigherà in seguito, o per salvare lo state di parti da cui l'utente si allontana. Questo aiuta a rendere le navigazioni più rapide caricando dati, CSS e immagini in background, e consente alle navigazioni indietro di mantenere lo state come i campi di input.

In futuro, prevediamo di aggiungere altre modalità ad Activity per casi d'uso diversi.

Per esempi su come usare Activity, consulta la [documentazione di Activity](/reference/react/Activity).

---

### `useEffectEvent` {/*use-effect-event*/}

Un pattern comune con `useEffect` è notificare al codice dell'app qualche tipo di "evento" da un sistema esterno. Ad esempio, quando una chat room si connette, potresti voler mostrare una notifica:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]);
  // ...
```

Il problema con il codice sopra è che un cambiamento a qualsiasi valore usato dentro un simile "evento" causerà la ri-esecuzione dell'Effetto circostante. Ad esempio, cambiare `theme` causerà la riconnessione della chat room. Questo ha senso per valori legati alla logica dell'Effetto stesso, come `roomId`, ma non ha senso per `theme`.

Per risolvere, la maggior parte degli utenti disabilita semplicemente la regola lint ed esclude la dipendenza. Ma questo può portare a bug poiché il linter non può più aiutarti a mantenere le dipendenze aggiornate se devi modificare l'Effetto in seguito.

Con `useEffectEvent`, puoi separare la parte "evento" di questa logica dall'Effetto che lo emette:

```js {2,3,4,9}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared (Effect Events aren't dependencies)
  // ...
```

Simile agli eventi DOM, gli Effect Events "vedono" sempre le props e lo state più recenti.

**Gli Effect Events _non_ devono essere dichiarati nell'array di dipendenze**. Dovrai aggiornare a `eslint-plugin-react-hooks@latest` così che il linter non provi a inserirli come dipendenze. Nota che gli Effect Events possono essere dichiarati solo nello stesso componente o Hook del "loro" Effetto. Queste restrizioni sono verificate dal linter.

<Note>

#### Quando usare `useEffectEvent` {/*when-to-use-useeffectevent*/}

Dovresti usare `useEffectEvent` per funzioni che sono concettualmente "eventi" che accadono di essere emessi da un Effetto invece che da un evento utente (ecco cosa lo rende un "Effect Event"). Non devi avvolgere tutto in `useEffectEvent`, o usarlo solo per silenziare l'errore lint, poiché questo può portare a bug.

Per un approfondimento su come pensare agli Event Effects, vedi: [Separating Events from Effects](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects).

</Note>

---

### `cacheSignal` {/*cache-signal*/}

<RSC>

`cacheSignal` è solo per l'uso con [React Server Components](/reference/rsc/server-components).

</RSC>

`cacheSignal` ti consente di sapere quando la durata di [`cache()`](/reference/react/cache) è terminata:

```
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);

async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

Questo ti consente di pulire o abortire il lavoro quando il risultato non sarà più usato nella cache, ad esempio:

- React ha completato con successo la renderizzazione
- La renderizzazione è stata abortita
- La renderizzazione è fallita

Per maggiori informazioni, consulta la [documentazione di `cacheSignal`](/reference/react/cacheSignal).

---

### Performance Tracks {/*performance-tracks*/}

React 19.2 aggiunge un nuovo set di [custom tracks](https://developer.chrome.com/docs/devtools/performance/extension) ai profili di performance di Chrome DevTools per fornire più informazioni sulle performance della tua app React:

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks.png" />
      <img className="w-full light-image" src="/images/blog/react-labs-april-2025/perf_tracks.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-labs-april-2025/perf_tracks_dark.webp" />
  </picture>
</div>

La [documentazione React Performance Tracks](/reference/dev-tools/react-performance-tracks) spiega tutto ciò che è incluso nelle track, ma ecco una panoramica ad alto livello.

#### Scheduler ⚛ {/*scheduler-*/}

La track Scheduler mostra su cosa sta lavorando React per diverse priorità come "blocking" per le interazioni utente, o "transition" per gli aggiornamenti dentro startTransition. Dentro ogni track, vedrai il tipo di lavoro eseguito come l'evento che ha schedulato un aggiornamento, e quando è avvenuta la renderizzazione per quell'aggiornamento.

Mostriamo anche informazioni come quando un aggiornamento è bloccato in attesa di una priorità diversa, o quando React sta aspettando il paint prima di continuare. La track Scheduler ti aiuta a capire come React divide il tuo codice in diverse priorità e l'ordine in cui ha completato il lavoro.

Consulta la [documentazione della track Scheduler](/reference/dev-tools/react-performance-tracks#scheduler) per vedere tutto ciò che è incluso.

#### Components ⚛ {/*components-*/}

La track Components mostra l'albero dei componenti su cui React sta lavorando per renderizzare o eseguire Effetti. Al suo interno vedrai etichette come "Mount" per quando i figli montano o gli Effetti vengono montati, o "Blocked" per quando la renderizzazione è bloccata a causa del cedere il passo a lavoro fuori da React.

La track Components ti aiuta a capire quando i componenti vengono renderizzati o eseguono Effetti, e il tempo necessario per completare quel lavoro per aiutare a identificare problemi di performance.

Consulta la [documentazione della track Components](/reference/dev-tools/react-performance-tracks#components) per vedere tutto ciò che è incluso.

---

## Nuove funzionalità di React DOM {/*new-react-dom-features*/}

### Pre-renderizzazione parziale {/*partial-pre-rendering*/}

In 19.2 aggiungiamo una nuova capacità di pre-renderizzare parte dell'app in anticipo e riprendere la renderizzazione in seguito.

Questa funzionalità si chiama "Partial Pre-rendering" e ti consente di pre-renderizzare le parti statiche della tua app e servirle da un CDN, per poi riprendere la renderizzazione dello shell e riempirlo con contenuto dinamico in seguito.

Per pre-renderizzare un'app da riprendere in seguito, prima chiama `prerender` con un `AbortController`:

```
const {prelude, postponed} = await prerender(<App />, {
  signal: controller.signal,
});

// Save the postponed state for later
await savePostponedState(postponed);

// Send prelude to client or CDN.
```

Poi, puoi restituire lo shell `prelude` al client e in seguito chiamare `resume` per "riprendere" a uno stream SSR:

```
const postponed = await getPostponedState(request);
const resumeStream = await resume(<App />, postponed);

// Send stream to client.
```

Oppure puoi chiamare `resumeAndPrerender` per riprendere e ottenere HTML statico per SSG:

```
const postponedState = await getPostponedState(request);
const { prelude } = await resumeAndPrerender(<App />, postponedState);

// Send complete HTML prelude to CDN.
```

Per maggiori informazioni, consulta la documentazione per le nuove API:
- `react-dom/server`
  - [`resume`](/reference/react-dom/server/resume): per Web Streams.
  - [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) per Node Streams.
- `react-dom/static`
  - [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) per Web Streams.
  - [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) per Node Streams.

Inoltre, le API prerender ora restituiscono uno state `postpone` da passare alle API `resume`.

---

## Cambiamenti notevoli {/*notable-changes*/}

### Raggruppamento dei boundary Suspense per SSR {/*batching-suspense-boundaries-for-ssr*/}

Abbiamo corretto un bug comportamentale per cui i boundary Suspense venivano rivelati in modo diverso a seconda che fossero renderizzati sul client o durante lo streaming da server-side rendering.

A partire da 19.2, React raggrupperà per un breve periodo le rivelazioni dei boundary Suspense renderizzati sul server, per consentire di rivelare più contenuto insieme e allinearsi al comportamento renderizzato sul client.

<Diagram name="19_2_batching_before" height={162} width={1270} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a page rectangle showing a glimmer loading state with faded bars. The second panel shows the top half of the page revealed and highlighted in blue. The third panel shows the entire the page revealed and highlighted in blue.">

In precedenza, durante lo streaming server-side rendering, il contenuto suspense sostituiva immediatamente i fallback.

</Diagram>

<Diagram name="19_2_batching_after" height={162} width={1270} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a page rectangle showing a glimmer loading state with faded bars. The second panel shows the same page. The third panel shows the entire the page revealed and highlighted in blue.">

In React 19.2, i boundary suspense vengono raggruppati per un breve periodo, per consentire di rivelare più contenuto insieme.

</Diagram>

Questa correzione prepara anche le app al supporto di `<ViewTransition>` per Suspense durante SSR. Rivelando più contenuto insieme, le animazioni possono essere eseguite su batch più grandi di contenuto ed evitare di concatenare animazioni di contenuto che arriva in streaming ravvicinato.

<Note>

React usa euristiche per garantire che il throttling non impatti le core web vitals e il ranking di ricerca.

Ad esempio, se il tempo totale di caricamento della pagina si avvicina a 2,5s (che è il tempo considerato "buono" per [LCP](https://web.dev/articles/lcp)), React smetterà di raggruppare e rivelerà il contenuto immediatamente così che il throttling non sia la ragione per mancare la metrica.

</Note>

---

### SSR: supporto Web Streams per Node {/*ssr-web-streams-support-for-node*/}

React 19.2 aggiunge supporto per Web Streams per lo streaming SSR in Node.js:
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) è ora disponibile per Node.js
- [`prerender`](/reference/react-dom/static/prerender) è ora disponibile per Node.js

Così come le nuove API `resume`:
- [`resume`](/reference/react-dom/server/resume) è disponibile per Node.js.
- [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) è disponibile per Node.js.


<Pitfall>

#### Preferire Node Streams per la renderizzazione lato server in Node.js {/*prefer-node-streams-for-server-side-rendering-in-nodejs*/}

Negli ambienti Node.js, raccomandiamo ancora vivamente di usare le API Node Streams:

- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)
- [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)

Questo perché Node Streams sono molto più veloci di Web Streams in Node, e Web Streams non supportano la compressione per impostazione predefinita, portando gli utenti a perdere accidentalmente i benefici dello streaming.

</Pitfall>

---

### `eslint-plugin-react-hooks` v6 {/*eslint-plugin-react-hooks*/}

Abbiamo anche pubblicato `eslint-plugin-react-hooks@latest` con flat config per impostazione predefinita nel preset `recommended`, e opt-in per le nuove regole alimentate da React Compiler.

Per continuare a usare la config legacy, puoi passare a `recommended-legacy`:

```diff
- extends: ['plugin:react-hooks/recommended']
+ extends: ['plugin:react-hooks/recommended-legacy']
```

Per un elenco completo delle regole abilitate dal compiler, [consulta la documentazione del linter](/reference/eslint-plugin-react-hooks#recommended).

Consulta il [changelog di `eslint-plugin-react-hooks` per un elenco completo dei cambiamenti](https://github.com/react/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md#610).

---

### Aggiornamento del prefisso predefinito di `useId` {/*update-the-default-useid-prefix*/}

In 19.2, aggiorniamo il prefisso predefinito di `useId` da `:r:` (19.0.0) o `«r»` (19.1.0) a `_r_`.

L'intento originale di usare un carattere speciale non valido per i selettori CSS era che fosse improbabile collidere con ID scritti dagli utenti. Tuttavia, per supportare View Transitions, dobbiamo garantire che gli ID generati da `useId` siano validi per `view-transition-name` e nomi XML 1.0.

---

## Changelog {/*changelog*/}

Altri cambiamenti notevoli
- `react-dom`: Consente l'uso di nonce su stili hoistable [#32461](https://github.com/react/react/pull/32461)
- `react-dom`: Avvisa per l'uso di un nodo di proprietà React come Container se ha anche contenuto testuale [#32774](https://github.com/react/react/pull/32774)

Correzioni di bug notevoli
- `react`: Stringifica context come "SomeContext" invece di "SomeContext.Provider" [#33507](https://github.com/react/react/pull/33507)
- `react`: Corregge loop infinito useDeferredValue nell'evento popstate [#32821](https://github.com/react/react/pull/32821)
- `react`: Corregge un bug quando un valore iniziale veniva passato a useDeferredValue [#34376](https://github.com/react/react/pull/34376)
- `react`: Corregge un crash quando si inviano form con Client Actions [#33055](https://github.com/react/react/pull/33055)
- `react`: Nasconde/ripristina la visibilità del contenuto dei boundary suspense disidratati se risospendono [#32900](https://github.com/react/react/pull/32900)
- `react`: Evita stack overflow su alberi larghi durante Hot Reload [#34145](https://github.com/react/react/pull/34145)
- `react`: Migliora component stack in vari punti [#33629](https://github.com/react/react/pull/33629), [#33724](https://github.com/react/react/pull/33724), [#32735](https://github.com/react/react/pull/32735), [#33723](https://github.com/react/react/pull/33723)
- `react`: Corregge un bug con React.use dentro Component React.lazy-ed [#33941](https://github.com/react/react/pull/33941)
- `react-dom`: Smette di avvisare quando attributi ARIA 1.3 sono usati [#34264](https://github.com/react/react/pull/34264)
- `react-dom`: Corregge un bug con Suspense profondamente annidato dentro fallback Suspense [#33467](https://github.com/react/react/pull/33467)
- `react-dom`: Evita hang quando si sospende dopo abort durante la renderizzazione [#34192](https://github.com/react/react/pull/34192)

Per un elenco completo dei cambiamenti, consulta il [Changelog](https://github.com/react/react/blob/main/CHANGELOG.md).


---

_Grazie a [Ricky Hanlon](https://bsky.app/profile/ricky.fm) per [aver scritto questo post](https://www.youtube.com/shorts/T9X3YkgZRG0), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Matt Carroll](https://twitter.com/mattcarrollcode), [Jack Pope](https://jackpope.me) e [Joe Savona](https://x.com/en_JS) per la revisione di questo post._
