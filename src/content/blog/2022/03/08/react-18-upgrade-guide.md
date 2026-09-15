---
title: "Come passare a React 18"
author: Rick Hanlon
date: 2022/03/08
description: Come abbiamo condiviso nel post di rilascio, React 18 introduce funzionalità alimentate dal nostro nuovo renderer concorrente, con una strategia di adozione graduale per le applicazioni esistenti. In questo post, ti guideremo attraverso i passaggi per passare a React 18.
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2022/03/08/react-18-upgrade-guide.md).

</Note>

8 marzo 2022 di [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

Come abbiamo condiviso nel [post di rilascio](/blog/2022/03/29/react-v18), React 18 introduce funzionalità alimentate dal nostro nuovo renderer concorrente, con una strategia di adozione graduale per le applicazioni esistenti. In questo post, ti guideremo attraverso i passaggi per passare a React 18.

[Segnala eventuali problemi](https://github.com/react/react/issues/new/choose) che incontri durante l'upgrade a React 18.

</Intro>

<Note>

Per gli utenti React Native, React 18 sarà incluso in una versione futura di React Native. Questo perché React 18 si basa sulla New React Native Architecture per beneficiare delle nuove capability presentate in questo blog post. Per maggiori informazioni, consulta la [keynote di React Conf qui](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

---

## Installazione {/*installing*/}

Per installare l'ultima versione di React:

```bash
npm install react react-dom
```

Oppure, se usi yarn:

```bash
yarn add react react-dom
```

## Aggiornamenti alle API di client rendering {/*updates-to-client-rendering-apis*/}

Quando installi React 18 per la prima volta, vedrai un warning nella console:

<ConsoleBlock level="error">

ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

React 18 introduce una nuova root API che offre una migliore ergonomia per la gestione delle root. La nuova root API abilita anche il nuovo renderer concorrente, che ti consente di opt-in alle funzionalità concorrenti.

```js
// Before
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// After
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
```

Abbiamo anche sostituito `unmountComponentAtNode` con `root.unmount`:

```js
// Before
unmountComponentAtNode(container);

// After
root.unmount();
```

Abbiamo anche rimosso la callback da render, poiché di solito non produce il risultato atteso quando si usa Suspense:

```js
// Before
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// After
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

Non esiste una sostituzione uno-a-uno per la vecchia render callback API — dipende dal tuo caso d'uso. Consulta il post del working group [Replacing render with createRoot](https://github.com/reactwg/react-18/discussions/5) per maggiori informazioni.

</Note>

Infine, se la tua app usa server-side rendering con hydration, passa da `hydrate` a `hydrateRoot`:

```js
// Before
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// After
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// Unlike with createRoot, you don't need a separate root.render() call here.
```

Per maggiori informazioni, consulta la [discussione del working group qui](https://github.com/reactwg/react-18/discussions/5).

<Note>

**Se la tua app non funziona dopo l'upgrade, verifica se è avvolta in `<StrictMode>`.** [Strict Mode è diventato più rigoroso in React 18](#updates-to-strict-mode) e non tutti i tuoi componenti potrebbero essere resilienti ai nuovi controlli che aggiunge in modalità development. Se rimuovere Strict Mode risolve il problema, puoi rimuoverlo durante l'upgrade e poi reinserirlo (in cima all'albero o su una parte dell'albero) dopo aver corretto i problemi che segnala.

</Note>

## Aggiornamenti alle API di server rendering {/*updates-to-server-rendering-apis*/}

In questo rilascio, stiamo rinnovando le nostre API `react-dom/server` per supportare completamente Suspense sul server e lo Streaming SSR. Come parte di questi cambiamenti, stiamo deprecando la vecchia API di streaming Node, che non supporta lo streaming incrementale di Suspense sul server.

L'uso di questa API ora genera un warning:

* `renderToNodeStream`: **Deprecata ⛔️️**

Invece, per lo streaming in ambienti Node, usa:
* `renderToPipeableStream`: **Nuova ✨**

Stiamo anche introducendo una nuova API per supportare lo streaming SSR con Suspense per ambienti edge runtime moderni, come Deno e Cloudflare workers:
* `renderToReadableStream`: **Nuova ✨**

Le seguenti API continueranno a funzionare, ma con supporto limitato per Suspense:
* `renderToString`: **Limitato** ⚠️
* `renderToStaticMarkup`: **Limitato** ⚠️

Infine, questa API continuerà a funzionare per il rendering delle e-mail:
* `renderToStaticNodeStream`

Per maggiori informazioni sui cambiamenti alle API di server rendering, consulta il post del working group [Upgrading to React 18 on the server](https://github.com/reactwg/react-18/discussions/22), un [approfondimento sulla nuova Suspense SSR Architecture](https://github.com/reactwg/react-18/discussions/37) e il talk di [Shaundai Person](https://twitter.com/shaundai) su [Streaming Server Rendering with Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) alla React Conf 2021.

## Aggiornamenti alle definizioni TypeScript {/*updates-to-typescript-definitions*/}

Se il tuo progetto usa TypeScript, dovrai aggiornare le dipendenze `@types/react` e `@types/react-dom` alle ultime versioni. I nuovi tipi sono più sicuri e rilevano problemi che prima venivano ignorati dal type checker. Il cambiamento più rilevante è che la prop `children` ora deve essere elencata esplicitamente quando definisci le props, ad esempio:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

Consulta la [pull request React 18 typings](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) per l'elenco completo dei cambiamenti solo di tipo. Collega a esempi di correzioni nei tipi delle librerie così puoi vedere come adattare il tuo codice. Puoi usare lo [script di migrazione automatizzato](https://github.com/eps1lon/types-react-codemod) per portare più rapidamente il codice della tua applicazione ai nuovi tipi più sicuri.

Se trovi un bug nei tipi, [apri un issue](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package) nella repo DefinitelyTyped.

## Raggruppamento automatico {/*automatic-batching*/}

React 18 aggiunge miglioramenti delle prestazioni out-of-the-box facendo più raggruppamento per impostazione predefinita. Il raggruppamento è quando React raggruppa più aggiornamenti di state in una singola ri-renderizzazione per prestazioni migliori. Prima di React 18, raggruppavamo gli aggiornamenti solo all'interno dei gestori di eventi React. Gli aggiornamenti all'interno di promise, setTimeout, gestori di eventi nativi o qualsiasi altro evento non venivano raggruppati in React per impostazione predefinita:

```js
// Before React 18 only React events were batched

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);
```


A partire da React 18 con `createRoot`, tutti gli aggiornamenti saranno raggruppati automaticamente, indipendentemente da dove provengono. Questo significa che gli aggiornamenti all'interno di timeout, promise, gestori di eventi nativi o qualsiasi altro evento verranno raggruppati allo stesso modo degli aggiornamenti all'interno degli eventi React:

```js
// After React 18 updates inside of timeouts, promises,
// native event handlers or any other event are batched.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

Questo è un breaking change, ma ci aspettiamo che comporti meno lavoro di renderizzazione e quindi prestazioni migliori nelle tue applicazioni. Per disattivare il raggruppamento automatico, puoi usare `flushSync`:

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}
```

Per maggiori informazioni, consulta l'[approfondimento sul raggruppamento automatico](https://github.com/reactwg/react-18/discussions/21).

## Nuove API per le librerie {/*new-apis-for-libraries*/}

Nel React 18 Working Group abbiamo lavorato con i maintainer di librerie per creare nuove API necessarie a supportare il concurrent rendering per casi d'uso specifici in aree come gli stili e gli store esterni. Per supportare React 18, alcune librerie potrebbero dover passare a una delle seguenti API:

* `useSyncExternalStore` è un nuovo Hook che consente agli store esterni di supportare letture concorrenti forzando gli aggiornamenti allo store a essere sincroni. Questa nuova API è consigliata per qualsiasi libreria che si integra con state esterno a React. Per maggiori informazioni, consulta il [post di panoramica useSyncExternalStore](https://github.com/reactwg/react-18/discussions/70) e i [dettagli dell'API useSyncExternalStore](https://github.com/reactwg/react-18/discussions/86).
* `useInsertionEffect` è un nuovo Hook che consente alle librerie CSS-in-JS di affrontare problemi di prestazioni legati all'iniezione di stili durante la renderizzazione. A meno che tu non abbia già costruito una libreria CSS-in-JS, non ci aspettiamo che tu la usi mai. Questo Hook viene eseguito dopo la mutazione del DOM, ma prima che i layout Effect leggano il nuovo layout. Risolve un problema che esiste già in React 17 e versioni precedenti, ma è ancora più importante in React 18 perché React cede il controllo al browser durante il concurrent rendering, dandogli la possibilità di ricalcolare il layout. Per maggiori informazioni, consulta la [Library Upgrade Guide for `<style>`](https://github.com/reactwg/react-18/discussions/110).

React 18 introduce anche nuove API per il concurrent rendering come `startTransition`, `useDeferredValue` e `useId`, di cui parliamo di più nel [post di rilascio](/blog/2022/03/29/react-v18).

## Aggiornamenti a Strict Mode {/*updates-to-strict-mode*/}

In futuro, vorremmo aggiungere una funzionalità che consente a React di aggiungere e rimuovere sezioni dell'UI preservando lo state. Ad esempio, quando un utente passa a un'altra schermata e torna indietro, React dovrebbe poter mostrare immediatamente la schermata precedente. Per farlo, React smonterebbe e rimonterebbe alberi usando lo stesso component state di prima.

Questa funzionalità darà a React prestazioni migliori out-of-the-box, ma richiede che i componenti siano resilienti agli Effetti montati e distrutti più volte. La maggior parte degli Effetti funzionerà senza modifiche, ma alcuni Effetti presuppongono di essere montati o distrutti una sola volta.

Per aiutare a far emergere questi problemi, React 18 introduce un nuovo controllo solo per development in Strict Mode. Questo nuovo controllo smonterà e rimonterà automaticamente ogni componente, ogni volta che un componente viene montato per la prima volta, ripristinando lo state precedente al secondo mount.

Prima di questo cambiamento, React montava il componente e creava gli Effetti:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
```

Con Strict Mode in React 18, React simulerà lo smontaggio e il rimontaggio del componente in modalità development:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates unmounting the component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates mounting the component with the previous state.
    * Layout effect setup code runs
    * Effect setup code runs
```

Per maggiori informazioni, consulta i post del Working Group [Adding Reusable State to StrictMode](https://github.com/reactwg/react-18/discussions/19) e [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18).

## Configurazione dell'ambiente di test {/*configuring-your-testing-environment*/}

Quando aggiorni per la prima volta i tuoi test per usare `createRoot`, potresti vedere questo warning nella console dei test:

<ConsoleBlock level="error">

The current testing environment is not configured to support act(...)

</ConsoleBlock>

Per risolvere, imposta `globalThis.IS_REACT_ACT_ENVIRONMENT` su `true` prima di eseguire il test:

```js
// In your test setup file
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

Lo scopo del flag è dire a React che sta girando in un ambiente simile a un unit test. React registrerà warning utili se dimentichi di avvolgere un aggiornamento con `act`.

Puoi anche impostare il flag su `false` per dire a React che `act` non è necessario. Questo può essere utile per test end-to-end che simulano un ambiente browser completo.

Alla fine, ci aspettiamo che le testing library lo configurino automaticamente per te. Ad esempio, la [prossima versione di React Testing Library ha supporto integrato per React 18](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) senza configurazione aggiuntiva.

[Maggiori informazioni sull'API di test `act` e i cambiamenti correlati](https://github.com/reactwg/react-18/discussions/102) sono disponibili nel working group.

## Interruzione del supporto per Internet Explorer {/*dropping-support-for-internet-explorer*/}

In questo rilascio, React interrompe il supporto per Internet Explorer, che [uscirà dal supporto il 15 giugno 2022](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). Stiamo facendo questo cambiamento ora perché le nuove funzionalità introdotte in React 18 sono costruite usando funzionalità moderne del browser come i microtask che non possono essere adeguatamente polyfillati in IE.

Se hai bisogno di supportare Internet Explorer, ti consigliamo di restare su React 17.

## Deprecazioni {/*deprecations*/}

* `react-dom`: `ReactDOM.render` è stata deprecata. Usarla genererà un warning e farà girare la tua app in modalità React 17.
* `react-dom`: `ReactDOM.hydrate` è stata deprecata. Usarla genererà un warning e farà girare la tua app in modalità React 17.
* `react-dom`: `ReactDOM.unmountComponentAtNode` è stata deprecata.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` è stata deprecata.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` è stata deprecata.

## Altri breaking change {/*other-breaking-changes*/}

* **Timing consistente di useEffect**: React ora esegue sempre il flush sincrono delle funzioni degli Effetti se l'aggiornamento è stato attivato durante un evento di input utente discreto come un click o un keydown. In precedenza, il comportamento non era sempre prevedibile o consistente.
* **Errori di hydration più rigorosi**: I mismatch di hydration dovuti a contenuto testuale mancante o extra sono ora trattati come errori invece che warning. React non tenterà più di "rattoppare" singoli nodi inserendo o eliminando un nodo sul client per far corrispondere il markup del server, e tornerà al client rendering fino al boundary `<Suspense>` più vicino nell'albero. Questo garantisce che l'albero idratato sia consistente ed evita potenziali problemi di privacy e sicurezza causati da mismatch di hydration.
* **Gli alberi Suspense sono sempre consistenti:** Se un componente sospende prima di essere completamente aggiunto all'albero, React non lo aggiungerà all'albero in uno state incompleto né attiverà i suoi Effetti. Invece, React scarterà completamente il nuovo albero, attenderà il completamento dell'operazione asincrona e poi riproverà a renderizzare da zero. React renderizzerà il tentativo di retry in modo concorrente e senza bloccare il browser.
* **Layout Effect con Suspense**: Quando un albero si ri-sospende e torna a un fallback, React ora pulirà i layout Effect e poi li ricreerà quando il contenuto all'interno del boundary viene mostrato di nuovo. Questo risolve un problema che impediva alle librerie di componenti di misurare correttamente il layout quando usate con Suspense.
* **Nuovi requisiti dell'ambiente JS**: React ora dipende da funzionalità moderne del browser tra cui `Promise`, `Symbol` e `Object.assign`. Se supporti browser e dispositivi più vecchi come Internet Explorer che non forniscono nativamente funzionalità moderne del browser o hanno implementazioni non conformi, considera di includere un polyfill globale nella tua applicazione bundled.

## Altri cambiamenti rilevanti {/*other-notable-changes*/}

### React {/*react*/}

* **I componenti possono ora renderizzare `undefined`:** React non avvisa più se restituisci `undefined` da un componente. Questo rende i valori di ritorno consentiti per i componenti consistenti con i valori consentiti nel mezzo di un albero di componenti. Ti consigliamo di usare un linter per prevenire errori come dimenticare un'istruzione `return` prima del JSX.
* **Nei test, i warning `act` sono ora opt-in:** Se esegui test end-to-end, i warning `act` non sono necessari. Abbiamo introdotto un meccanismo [opt-in](https://github.com/reactwg/react-18/discussions/102) così puoi abilitarli solo per i unit test dove sono utili e vantaggiosi.
* **Nessun warning su `setState` su componenti smontati:** In precedenza, React avvisava di memory leak quando chiamavi `setState` su un componente smontato. Questo warning era stato aggiunto per le sottoscrizioni, ma le persone lo incontravano principalmente in scenari in cui impostare lo state andava bene e le soluzioni alternative peggioravano il codice. Abbiamo [rimosso](https://github.com/react/react/pull/22114) questo warning.
* **Nessuna soppressione dei log della console:** Quando usi Strict Mode, React renderizza ogni componente due volte per aiutarti a trovare effetti collaterali inattesi. In React 17, abbiamo soppresso i log della console per una delle due renderizzazioni per rendere i log più leggibili. In risposta al [feedback della community](https://github.com/react/react/issues/21783) che lo trovava confuso, abbiamo rimosso la soppressione. Invece, se hai React DevTools installato, le renderizzazioni del secondo log saranno visualizzate in grigio e ci sarà un'opzione (disattivata per impostazione predefinita) per sopprimerle completamente.
* **Utilizzo della memoria migliorato:** React ora pulisce più campi interni allo smontaggio, riducendo l'impatto di memory leak non corretti che potrebbero esistere nel codice della tua applicazione.

### React DOM Server {/*react-dom-server*/}

* **`renderToString`:** Non genererà più errori quando sospende sul server. Invece, emetterà l'HTML fallback per il boundary `<Suspense>` più vicino e poi riproverà a renderizzare lo stesso contenuto sul client. È comunque consigliato passare a un'API di streaming come `renderToPipeableStream` o `renderToReadableStream`.
* **`renderToStaticMarkup`:** Non genererà più errori quando sospende sul server. Invece, emetterà l'HTML fallback per il boundary `<Suspense>` più vicino.

## Changelog {/*changelog*/}

Puoi consultare il [changelog completo qui](https://github.com/react/react/blob/main/CHANGELOG.md).
