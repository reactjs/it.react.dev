---
title: "React v18.0"
author: The React Team
date: 2022/03/08
description: React 18 è ora disponibile su npm! Nel nostro ultimo post, abbiamo condiviso istruzioni passo passo per passare la tua app a React 18. In questo post, daremo una panoramica delle novità di React 18 e di cosa significano per il futuro.
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2022/03/29/react-v18.md).

</Note>

29 marzo 2022 di [The React Team](/community/team)

---

<Intro>

React 18 è ora disponibile su npm! Nel nostro ultimo post, abbiamo condiviso istruzioni passo passo per [passare la tua app a React 18](/blog/2022/03/08/react-18-upgrade-guide). In questo post, daremo una panoramica delle novità di React 18 e di cosa significano per il futuro.

</Intro>

---

La nostra ultima versione major include miglioramenti out-of-the-box come il raggruppamento automatico, nuove API come startTransition e server-side rendering in streaming con supporto per Suspense.

Molte delle funzionalità in React 18 sono costruite sopra il nostro nuovo renderer concorrente, un cambiamento dietro le quinte che sblocca potenti nuove capability. Concurrent React è opt-in — è abilitato solo quando usi una funzionalità concorrente — ma pensiamo che avrà un grande impatto sul modo in cui le persone costruiscono applicazioni.

Abbiamo passato anni a ricercare e sviluppare il supporto per la concorrenza in React, e abbiamo avuto cura di fornire un percorso di adozione graduale per gli utenti esistenti. Lo scorso estate, [abbiamo formato il React 18 Working Group](/blog/2021/06/08/the-plan-for-react-18) per raccogliere feedback dagli esperti della community e garantire un'esperienza di upgrade fluida per l'intero ecosistema React.

Nel caso te lo fossi perso, abbiamo condiviso gran parte di questa visione alla React Conf 2021:

* Nella [keynote](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa), spieghiamo come React 18 si inserisce nella nostra missione di rendere facile per gli sviluppatori costruire ottime esperienze utente
* [Shruti Kapoor](https://twitter.com/shrutikapoor08) [ha dimostrato come usare le nuove funzionalità in React 18](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)
* [Shaundai Person](https://twitter.com/shaundai) ci ha dato una panoramica del [server rendering in streaming con Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)

Di seguito una panoramica completa di cosa aspettarsi in questo rilascio, a partire dal Concurrent Rendering.

<Note>

Per gli utenti React Native, React 18 sarà incluso in React Native con la New React Native Architecture. Per maggiori informazioni, consulta la [keynote di React Conf qui](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

## Cos'è Concurrent React? {/*what-is-concurrent-react*/}

L'aggiunta più importante in React 18 è qualcosa che speriamo tu non debba mai pensare: la concorrenza. Pensiamo che questo sia in larga parte vero per gli sviluppatori di applicazioni, anche se la storia potrebbe essere un po' più complicata per i maintainer di librerie.

La concorrenza non è una funzionalità, di per sé. È un nuovo meccanismo dietro le quinte che consente a React di preparare più versioni della tua UI contemporaneamente. Puoi pensare alla concorrenza come a un dettaglio implementativo — è preziosa per le funzionalità che sblocca. React usa tecniche sofisticate nella sua implementazione interna, come code di priorità e buffering multiplo. Ma non vedrai quei concetti nelle nostre API pubbliche.

Quando progettiamo le API, cerchiamo di nascondere i dettagli implementativi agli sviluppatori. Come sviluppatore React, ti concentri su *cosa* vuoi che sia l'esperienza utente, e React gestisce *come* consegnarla. Quindi non ci aspettiamo che gli sviluppatori React sappiano come funziona la concorrenza sotto il cofano.

Tuttavia, Concurrent React è più importante di un tipico dettaglio implementativo — è un aggiornamento fondamentale al modello di rendering core di React. Quindi, anche se non è fondamentale sapere come funziona la concorrenza, potrebbe valere la pena saperne cos'è a livello generale.

Una proprietà chiave di Concurrent React è che la renderizzazione è interrompibile. Quando passi per la prima volta a React 18, prima di aggiungere funzionalità concorrenti, gli aggiornamenti vengono renderizzati come nelle versioni precedenti di React — in una singola transazione sincrona e ininterrotta. Con la renderizzazione sincrona, una volta che un aggiornamento inizia a renderizzare, nulla può interromperlo finché l'utente non vede il risultato sullo schermo.

In una renderizzazione concorrente, non è sempre così. React può iniziare a renderizzare un aggiornamento, metterlo in pausa a metà, poi continuare più tardi. Può persino abbandonare del tutto una renderizzazione in corso. React garantisce che l'UI apparirà consistente anche se una renderizzazione viene interrotta. Per farlo, attende di eseguire mutazioni DOM fino alla fine, una volta che l'intero albero è stato valutato. Con questa capability, React può preparare nuove schermate in background senza bloccare il main thread. Questo significa che l'UI può rispondere immediatamente all'input dell'utente anche se è nel mezzo di un grande task di renderizzazione, creando un'esperienza utente fluida.

Un altro esempio è lo state riutilizzabile. Concurrent React può rimuovere sezioni dell'UI dallo schermo, poi riaggiungerle più tardi riutilizzando lo state precedente. Ad esempio, quando un utente passa a un'altra schermata e torna indietro, React dovrebbe poter ripristinare la schermata precedente nello stesso state in cui era prima. In una prossima minor, stiamo pianificando di aggiungere un nuovo componente chiamato `<Offscreen>` che implementa questo pattern. Allo stesso modo, potrai usare Offscreen per preparare nuova UI in background così che sia pronta prima che l'utente la riveli.

Il concurrent rendering è un potente nuovo strumento in React e la maggior parte delle nostre nuove funzionalità è costruita per sfruttarlo, inclusi Suspense, le transizioni e il server rendering in streaming. Ma React 18 è solo l'inizio di ciò che intendiamo costruire su questa nuova fondazione.

## Adozione graduale delle funzionalità concorrenti {/*gradually-adopting-concurrent-features*/}

Tecnicamente, il concurrent rendering è un breaking change. Poiché il concurrent rendering è interrompibile, i componenti si comportano leggermente diversamente quando è abilitato.

Nei nostri test, abbiamo aggiornato migliaia di componenti a React 18. Abbiamo scoperto che quasi tutti i componenti esistenti "funzionano semplicemente" con il concurrent rendering, senza modifiche. Tuttavia, alcuni potrebbero richiedere uno sforzo di migrazione aggiuntivo. Anche se i cambiamenti sono di solito piccoli, avrai comunque la possibilità di farli al tuo ritmo. Il nuovo comportamento di rendering in React 18 è **abilitato solo nelle parti della tua app che usano le nuove funzionalità.**

La strategia complessiva di upgrade è far girare la tua applicazione su React 18 senza rompere il codice esistente. Poi puoi iniziare gradualmente ad aggiungere funzionalità concorrenti al tuo ritmo. Puoi usare [`<StrictMode>`](/reference/react/StrictMode) per aiutare a far emergere bug legati alla concorrenza durante lo sviluppo. Strict Mode non influisce sul comportamento in produzione, ma durante lo sviluppo registrerà warning extra e invocherà due volte funzioni che devono essere idempotenti. Non catturerà tutto, ma è efficace nel prevenire i tipi di errori più comuni.

Dopo l'upgrade a React 18, potrai iniziare a usare le funzionalità concorrenti immediatamente. Ad esempio, puoi usare startTransition per navigare tra schermate senza bloccare l'input dell'utente. Oppure useDeferredValue per limitare ri-renderizzazioni costose.

Tuttavia, a lungo termine, ci aspettiamo che il modo principale in cui aggiungerai concorrenza alla tua app sia usando una libreria o un framework abilitati alla concorrenza. Nella maggior parte dei casi, non interagirai direttamente con le API concorrenti. Ad esempio, invece che gli sviluppatori chiamino startTransition ogni volta che navigano a una nuova schermata, le librerie di routing avvolgeranno automaticamente le navigazioni in startTransition.

Potrebbe volerci del tempo perché le librerie si aggiornino per essere compatibili con la concorrenza. Abbiamo fornito nuove API per rendere più facile per le librerie sfruttare le funzionalità concorrenti. Nel frattempo, sii paziente con i maintainer mentre lavoriamo per migrare gradualmente l'ecosistema React.

Per maggiori informazioni, consulta il nostro post precedente: [Come passare a React 18](/blog/2022/03/08/react-18-upgrade-guide).

## Suspense nei framework per i dati {/*suspense-in-data-frameworks*/}

In React 18, puoi iniziare a usare [Suspense](/reference/react/Suspense) per il data fetching in framework opinionated come Relay, Next.js, Hydrogen o Remix. Il data fetching ad hoc con Suspense è tecnicamente possibile, ma non è ancora consigliato come strategia generale.

In futuro, potremmo esporre primitivi aggiuntivi che rendano più facile accedere ai tuoi dati con Suspense, forse senza l'uso di un framework opinionated. Tuttavia, Suspense funziona meglio quando è profondamente integrato nell'architettura della tua applicazione: il tuo router, il tuo data layer e il tuo ambiente di server rendering. Quindi, anche a lungo termine, ci aspettiamo che librerie e framework giochino un ruolo cruciale nell'ecosistema React.

Come nelle versioni precedenti di React, puoi anche usare Suspense per il code splitting sul client con React.lazy. Ma la nostra visione per Suspense è sempre stata molto più del semplice caricamento del codice — l'obiettivo è estendere il supporto per Suspense così che, alla fine, lo stesso fallback Suspense dichiarativo possa gestire qualsiasi operazione asincrona (caricamento codice, dati, immagini, ecc.).

## I Server Components sono ancora in sviluppo {/*server-components-is-still-in-development*/}

I [**Server Components**](/blog/2020/12/21/data-fetching-with-react-server-components) sono una funzionalità in arrivo che consente agli sviluppatori di costruire app che coprono server e client, combinando la ricca interattività delle app client-side con le prestazioni migliorate del tradizionale server rendering. I Server Components non sono intrinsecamente accoppiati a Concurrent React, ma sono progettati per funzionare al meglio con funzionalità concorrenti come Suspense e server rendering in streaming.

I Server Components sono ancora sperimentali, ma ci aspettiamo di rilasciare una versione iniziale in una minor 18.x. Nel frattempo, stiamo lavorando con framework come Next.js, Hydrogen e Remix per far avanzare la proposta e prepararla per un'adozione diffusa.

## Novità in React 18 {/*whats-new-in-react-18*/}

### Nuova funzionalità: raggruppamento automatico {/*new-feature-automatic-batching*/}

Il raggruppamento è quando React raggruppa più aggiornamenti di state in una singola ri-renderizzazione per prestazioni migliori. Senza raggruppamento automatico, raggruppavamo gli aggiornamenti solo all'interno dei gestori di eventi React. Gli aggiornamenti all'interno di promise, setTimeout, gestori di eventi nativi o qualsiasi altro evento non venivano raggruppati in React per impostazione predefinita. Con il raggruppamento automatico, questi aggiornamenti verranno raggruppati automaticamente:


```js
// Before: only React events were batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);

// After: updates inside of timeouts, promises,
// native event handlers or any other event are batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

Per maggiori informazioni, consulta questo post su [Automatic batching for fewer renders in React 18](https://github.com/reactwg/react-18/discussions/21).

### Nuova funzionalità: Transizioni {/*new-feature-transitions*/}

Una transizione è un nuovo concetto in React per distinguere tra aggiornamenti urgenti e non urgenti.

* **Aggiornamenti urgenti** riflettono interazione diretta, come digitare, cliccare, premere e così via.
* **Aggiornamenti di transizione** fanno passare l'UI da una vista a un'altra.

Gli aggiornamenti urgenti come digitare, cliccare o premere hanno bisogno di risposta immediata per corrispondere alle nostre intuizioni su come si comportano gli oggetti fisici. Altrimenti sembrano "sbagliati". Tuttavia, le transizioni sono diverse perché l'utente non si aspetta di vedere ogni valore intermedio sullo schermo.

Ad esempio, quando selezioni un filtro in un dropdown, ti aspetti che il pulsante del filtro risponda immediatamente quando clicchi. Tuttavia, i risultati effettivi possono transitare separatamente. Un piccolo ritardo sarebbe impercettibile e spesso atteso. E se cambi di nuovo il filtro prima che i risultati finiscano di renderizzare, ti interessa vedere solo gli ultimi risultati.

Tipicamente, per la migliore esperienza utente, un singolo input dell'utente dovrebbe produrre sia un aggiornamento urgente che uno non urgente. Puoi usare l'API startTransition all'interno di un evento di input per informare React quali aggiornamenti sono urgenti e quali sono "transizioni":


```js
import { startTransition } from 'react';

// Urgent: Show what was typed
setInputValue(input);

// Mark any state updates inside as transitions
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input);
});
```


Gli aggiornamenti avvolti in startTransition sono gestiti come non urgenti e verranno interrotti se arrivano aggiornamenti più urgenti come click o pressioni di tasti. Se una transizione viene interrotta dall'utente (ad esempio, digitando più caratteri di fila), React scarterà il lavoro di renderizzazione stale non completato e renderizzerà solo l'ultimo aggiornamento.


* `useTransition`: un Hook per avviare transizioni, incluso un valore per tracciare lo state pending.
* `startTransition`: un metodo per avviare transizioni quando l'Hook non può essere usato.

Le transizioni opt-in al concurrent rendering, che consente all'aggiornamento di essere interrotto. Se il contenuto si ri-sospende, le transizioni dicono anche a React di continuare a mostrare il contenuto attuale mentre renderizza il contenuto della transizione in background (consulta la [Suspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) per maggiori informazioni).

[Consulta la documentazione sulle transizioni qui](/reference/react/useTransition).

### Nuove funzionalità Suspense {/*new-suspense-features*/}

Suspense ti consente di specificare dichiarativamente lo state di caricamento per una parte dell'albero dei componenti se non è ancora pronta per essere visualizzata:

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense rende lo "state di caricamento dell'UI" un concetto dichiarativo di prima classe nel modello di programmazione React. Questo ci consente di costruire funzionalità di livello superiore sopra di esso.

Abbiamo introdotto una versione limitata di Suspense diversi anni fa. Tuttavia, l'unico caso d'uso supportato era il code splitting con React.lazy, e non era supportato affatto quando si renderizzava sul server.

In React 18, abbiamo aggiunto il supporto per Suspense sul server ed espanso le sue capability usando le funzionalità di concurrent rendering.

Suspense in React 18 funziona meglio quando combinato con l'API delle transizioni. Se sospendi durante una transizione, React impedirà al contenuto già visibile di essere sostituito da un fallback. Invece, React ritarderà la renderizzazione finché non sono stati caricati abbastanza dati per evitare uno state di caricamento scadente.

Per maggiori informazioni, consulta la RFC [Suspense in React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md).

### Nuove API di client e server rendering {/*new-client-and-server-rendering-apis*/}

In questo rilascio abbiamo colto l'occasione per ridisegnare le API che esponiamo per la renderizzazione su client e server. Questi cambiamenti consentono agli utenti di continuare a usare le vecchie API in modalità React 17 mentre passano alle nuove API in React 18.

#### React DOM Client {/*react-dom-client*/}

Queste nuove API sono ora esportate da `react-dom/client`:

* `createRoot`: nuovo metodo per creare una root per `render` o `unmount`. Usalo al posto di `ReactDOM.render`. Le nuove funzionalità in React 18 non funzionano senza di esso.
* `hydrateRoot`: nuovo metodo per idratare un'applicazione renderizzata sul server. Usalo al posto di `ReactDOM.hydrate` insieme alle nuove API React DOM Server. Le nuove funzionalità in React 18 non funzionano senza di esso.

Sia `createRoot` che `hydrateRoot` accettano una nuova opzione chiamata `onRecoverableError` nel caso tu voglia essere notificato quando React recupera da errori durante la renderizzazione o l'hydration per il logging. Per impostazione predefinita, React userà [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError), o `console.error` nei browser più vecchi.

[Consulta la documentazione di React DOM Client qui](/reference/react-dom/client).

#### React DOM Server {/*react-dom-server*/}

Queste nuove API sono ora esportate da `react-dom/server` e hanno supporto completo per lo streaming di Suspense sul server:

* `renderToPipeableStream`: per lo streaming in ambienti Node.
* `renderToReadableStream`: per ambienti edge runtime moderni, come Deno e Cloudflare workers.

Il metodo esistente `renderToString` continua a funzionare ma è sconsigliato.

[Consulta la documentazione di React DOM Server qui](/reference/react-dom/server).

### Nuovi comportamenti di Strict Mode {/*new-strict-mode-behaviors*/}

In futuro, vorremmo aggiungere una funzionalità che consente a React di aggiungere e rimuovere sezioni dell'UI preservando lo state. Ad esempio, quando un utente passa a un'altra schermata e torna indietro, React dovrebbe poter mostrare immediatamente la schermata precedente. Per farlo, React smonterebbe e rimonterebbe alberi usando lo stesso component state di prima.

Questa funzionalità darà alle app React prestazioni migliori out-of-the-box, ma richiede che i componenti siano resilienti agli Effetti montati e distrutti più volte. La maggior parte degli Effetti funzionerà senza modifiche, ma alcuni Effetti presuppongono di essere montati o distrutti una sola volta.

Per aiutare a far emergere questi problemi, React 18 introduce un nuovo controllo solo per development in Strict Mode. Questo nuovo controllo smonterà e rimonterà automaticamente ogni componente, ogni volta che un componente viene montato per la prima volta, ripristinando lo state precedente al secondo mount.

Prima di questo cambiamento, React montava il componente e creava gli Effetti:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```


Con Strict Mode in React 18, React simulerà lo smontaggio e il rimontaggio del componente in modalità development:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
* React simulates unmounting the component.
  * Layout effects are destroyed.
  * Effects are destroyed.
* React simulates mounting the component with the previous state.
  * Layout effects are created.
  * Effects are created.
```

[Consulta la documentazione per garantire state riutilizzabile qui](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### Nuovi Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId` è un nuovo Hook per generare ID univoci sia sul client che sul server, evitando mismatch di hydration. È principalmente utile per librerie di componenti che si integrano con API di accessibilità che richiedono ID univoci. Risolve un problema che esiste già in React 17 e versioni precedenti, ma è ancora più importante in React 18 per come il nuovo streaming server renderer consegna HTML fuori ordine. [Consulta la documentazione qui](/reference/react/useId).

> Nota
>
> `useId` **non** serve per generare [key in una lista](/learn/rendering-lists#where-to-get-your-key). Le key dovrebbero essere generate dai tuoi dati.

#### useTransition {/*usetransition*/}

`useTransition` e `startTransition` ti consentono di contrassegnare alcuni aggiornamenti di state come non urgenti. Altri aggiornamenti di state sono considerati urgenti per impostazione predefinita. React consentirà agli aggiornamenti di state urgenti (ad esempio, aggiornare un input di testo) di interrompere aggiornamenti di state non urgenti (ad esempio, renderizzare una lista di risultati di ricerca). [Consulta la documentazione qui](/reference/react/useTransition).

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` ti consente di rimandare la ri-renderizzazione di una parte non urgente dell'albero. È simile al debouncing, ma ha alcuni vantaggi rispetto ad esso. Non c'è un ritardo temporale fisso, quindi React tenterà la renderizzazione differita subito dopo che la prima renderizzazione è riflessa sullo schermo. La renderizzazione differita è interrompibile e non blocca l'input dell'utente. [Consulta la documentazione qui](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` è un nuovo Hook che consente agli store esterni di supportare letture concorrenti forzando gli aggiornamenti allo store a essere sincroni. Elimina la necessità di useEffect quando si implementano sottoscrizioni a sorgenti dati esterne ed è consigliato per qualsiasi libreria che si integra con state esterno a React. [Consulta la documentazione qui](/reference/react/useSyncExternalStore).

> Nota
>
> `useSyncExternalStore` è pensato per essere usato dalle librerie, non dal codice applicativo.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` è un nuovo Hook che consente alle librerie CSS-in-JS di affrontare problemi di prestazioni legati all'iniezione di stili durante la renderizzazione. A meno che tu non abbia già costruito una libreria CSS-in-JS, non ci aspettiamo che tu la usi mai. Questo Hook viene eseguito dopo la mutazione del DOM, ma prima che i layout Effect leggano il nuovo layout. Risolve un problema che esiste già in React 17 e versioni precedenti, ma è ancora più importante in React 18 perché React cede il controllo al browser durante il concurrent rendering, dandogli la possibilità di ricalcolare il layout. [Consulta la documentazione qui](/reference/react/useInsertionEffect).

> Nota
>
> `useInsertionEffect` è pensato per essere usato dalle librerie, non dal codice applicativo.

## Come effettuare l'upgrade {/*how-to-upgrade*/}

Consulta [Come passare a React 18](/blog/2022/03/08/react-18-upgrade-guide) per istruzioni passo passo e l'elenco completo dei breaking change e dei cambiamenti rilevanti.

## Changelog {/*changelog*/}

### React {/*react*/}

* Add `useTransition` and `useDeferredValue` to separate urgent updates from transitions. ([#10426](https://github.com/react/react/pull/10426), [#10715](https://github.com/react/react/pull/10715), [#15593](https://github.com/react/react/pull/15593), [#15272](https://github.com/react/react/pull/15272), [#15578](https://github.com/react/react/pull/15578), [#15769](https://github.com/react/react/pull/15769), [#17058](https://github.com/react/react/pull/17058), [#18796](https://github.com/react/react/pull/18796), [#19121](https://github.com/react/react/pull/19121), [#19703](https://github.com/react/react/pull/19703), [#19719](https://github.com/react/react/pull/19719), [#19724](https://github.com/react/react/pull/19724), [#20672](https://github.com/react/react/pull/20672), [#20976](https://github.com/react/react/pull/20976) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `useId` for generating unique IDs. ([#17322](https://github.com/react/react/pull/17322), [#18576](https://github.com/react/react/pull/18576), [#22644](https://github.com/react/react/pull/22644), [#22672](https://github.com/react/react/pull/22672), [#21260](https://github.com/react/react/pull/21260) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `useSyncExternalStore` to help external store libraries integrate with React. ([#15022](https://github.com/react/react/pull/15022), [#18000](https://github.com/react/react/pull/18000), [#18771](https://github.com/react/react/pull/18771), [#22211](https://github.com/react/react/pull/22211), [#22292](https://github.com/react/react/pull/22292), [#22239](https://github.com/react/react/pull/22239), [#22347](https://github.com/react/react/pull/22347), [#23150](https://github.com/react/react/pull/23150) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@drarmstr](https://github.com/drarmstr))
* Add `startTransition` as a version of `useTransition` without pending feedback. ([#19696](https://github.com/react/react/pull/19696)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Add `useInsertionEffect` for CSS-in-JS libraries. ([#21913](https://github.com/react/react/pull/21913)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Make Suspense remount layout effects when content reappears.  ([#19322](https://github.com/react/react/pull/19322), [#19374](https://github.com/react/react/pull/19374), [#19523](https://github.com/react/react/pull/19523), [#20625](https://github.com/react/react/pull/20625), [#21079](https://github.com/react/react/pull/21079) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@lunaruan](https://github.com/lunaruan))
* Make `<StrictMode>` re-run effects to check for restorable state. ([#19523](https://github.com/react/react/pull/19523) , [#21418](https://github.com/react/react/pull/21418)  by [@bvaughn](https://github.com/bvaughn) and [@lunaruan](https://github.com/lunaruan))
* Assume Symbols are always available. ([#23348](https://github.com/react/react/pull/23348)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Remove `object-assign` polyfill. ([#23351](https://github.com/react/react/pull/23351)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Remove unsupported `unstable_changedBits` API.  ([#20953](https://github.com/react/react/pull/20953)  by [@acdlite](https://github.com/acdlite))
* Allow components to render undefined. ([#21869](https://github.com/react/react/pull/21869)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Flush `useEffect` resulting from discrete events like clicks synchronously. ([#21150](https://github.com/react/react/pull/21150)  by [@acdlite](https://github.com/acdlite))
* Suspense `fallback={undefined}` now behaves the same as `null` and isn't ignored. ([#21854](https://github.com/react/react/pull/21854)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Consider all `lazy()` resolving to the same component equivalent. ([#20357](https://github.com/react/react/pull/20357)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Don't patch console during first render. ([#22308](https://github.com/react/react/pull/22308)  by [@lunaruan](https://github.com/lunaruan))
* Improve memory usage. ([#21039](https://github.com/react/react/pull/21039)  by [@bgirard](https://github.com/bgirard))
* Improve messages if string coercion throws (Temporal.*, Symbol, etc.) ([#22064](https://github.com/react/react/pull/22064)  by [@justingrant](https://github.com/justingrant))
* Use `setImmediate` when available over `MessageChannel`. ([#20834](https://github.com/react/react/pull/20834)  by [@gaearon](https://github.com/gaearon))
* Fix context failing to propagate inside suspended trees. ([#23095](https://github.com/react/react/pull/23095)  by [@gaearon](https://github.com/gaearon))
* Fix `useReducer` observing incorrect props by removing the eager bailout mechanism. ([#22445](https://github.com/react/react/pull/22445)  by [@josephsavona](https://github.com/josephsavona))
* Fix `setState` being ignored in Safari when appending iframes. ([#23111](https://github.com/react/react/pull/23111)  by [@gaearon](https://github.com/gaearon))
* Fix a crash when rendering `ZonedDateTime` in the tree. ([#20617](https://github.com/react/react/pull/20617)  by [@dimaqq](https://github.com/dimaqq))
* Fix a crash when document is set to `null` in tests. ([#22695](https://github.com/react/react/pull/22695)  by [@SimenB](https://github.com/SimenB))
* Fix `onLoad` not triggering when concurrent features are on. ([#23316](https://github.com/react/react/pull/23316)  by [@gnoff](https://github.com/gnoff))
* Fix a warning when a selector returns `NaN`.  ([#23333](https://github.com/react/react/pull/23333)  by [@hachibeeDI](https://github.com/hachibeeDI))
* Fix a crash when document is set to `null` in tests. ([#22695](https://github.com/react/react/pull/22695) by [@SimenB](https://github.com/SimenB))
* Fix the generated license header. ([#23004](https://github.com/react/react/pull/23004)  by [@vitaliemiron](https://github.com/vitaliemiron))
* Add `package.json` as one of the entry points. ([#22954](https://github.com/react/react/pull/22954)  by [@Jack](https://github.com/Jack-Works))
* Allow suspending outside a Suspense boundary. ([#23267](https://github.com/react/react/pull/23267)  by [@acdlite](https://github.com/acdlite))
* Log a recoverable error whenever hydration fails. ([#23319](https://github.com/react/react/pull/23319)  by [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* Add `createRoot` and `hydrateRoot`. ([#10239](https://github.com/react/react/pull/10239), [#11225](https://github.com/react/react/pull/11225), [#12117](https://github.com/react/react/pull/12117), [#13732](https://github.com/react/react/pull/13732), [#15502](https://github.com/react/react/pull/15502), [#15532](https://github.com/react/react/pull/15532), [#17035](https://github.com/react/react/pull/17035), [#17165](https://github.com/react/react/pull/17165), [#20669](https://github.com/react/react/pull/20669), [#20748](https://github.com/react/react/pull/20748), [#20888](https://github.com/react/react/pull/20888), [#21072](https://github.com/react/react/pull/21072), [#21417](https://github.com/react/react/pull/21417), [#21652](https://github.com/react/react/pull/21652), [#21687](https://github.com/react/react/pull/21687), [#23207](https://github.com/react/react/pull/23207), [#23385](https://github.com/react/react/pull/23385) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add selective hydration. ([#14717](https://github.com/react/react/pull/14717), [#14884](https://github.com/react/react/pull/14884), [#16725](https://github.com/react/react/pull/16725), [#16880](https://github.com/react/react/pull/16880), [#17004](https://github.com/react/react/pull/17004), [#22416](https://github.com/react/react/pull/22416), [#22629](https://github.com/react/react/pull/22629), [#22448](https://github.com/react/react/pull/22448), [#22856](https://github.com/react/react/pull/22856), [#23176](https://github.com/react/react/pull/23176) by [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `aria-description` to the list of known ARIA attributes. ([#22142](https://github.com/react/react/pull/22142)  by [@mahyareb](https://github.com/mahyareb))
* Add `onResize` event to video elements. ([#21973](https://github.com/react/react/pull/21973)  by [@rileyjshaw](https://github.com/rileyjshaw))
* Add `imageSizes` and `imageSrcSet` to known props. ([#22550](https://github.com/react/react/pull/22550)  by [@eps1lon](https://github.com/eps1lon))
* Allow non-string `<option>` children if `value` is provided.  ([#21431](https://github.com/react/react/pull/21431)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix `aspectRatio` style not being applied. ([#21100](https://github.com/react/react/pull/21100)  by [@gaearon](https://github.com/gaearon))
* Warn if `renderSubtreeIntoContainer` is called. ([#23355](https://github.com/react/react/pull/23355)  by [@acdlite](https://github.com/acdlite))

### React DOM Server {/*react-dom-server-1*/}

* Add the new streaming renderer. ([#14144](https://github.com/react/react/pull/14144), [#20970](https://github.com/react/react/pull/20970), [#21056](https://github.com/react/react/pull/21056), [#21255](https://github.com/react/react/pull/21255), [#21200](https://github.com/react/react/pull/21200), [#21257](https://github.com/react/react/pull/21257), [#21276](https://github.com/react/react/pull/21276), [#22443](https://github.com/react/react/pull/22443), [#22450](https://github.com/react/react/pull/22450), [#23247](https://github.com/react/react/pull/23247), [#24025](https://github.com/react/react/pull/24025), [#24030](https://github.com/react/react/pull/24030) by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix context providers in SSR when handling multiple requests. ([#23171](https://github.com/react/react/pull/23171)  by [@frandiox](https://github.com/frandiox))
* Revert to client render on text mismatch. ([#23354](https://github.com/react/react/pull/23354)  by [@acdlite](https://github.com/acdlite))
* Deprecate `renderToNodeStream`. ([#23359](https://github.com/react/react/pull/23359)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix a spurious error log in the new server renderer. ([#24043](https://github.com/react/react/pull/24043)  by [@eps1lon](https://github.com/eps1lon))
* Fix a bug in the new server renderer. ([#22617](https://github.com/react/react/pull/22617)  by [@shuding](https://github.com/shuding))
* Ignore function and symbol values inside custom elements on the server. ([#21157](https://github.com/react/react/pull/21157)  by [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM Test Utils {/*react-dom-test-utils*/}

* Throw when `act` is used in production. ([#21686](https://github.com/react/react/pull/21686)  by [@acdlite](https://github.com/acdlite))
* Support disabling spurious act warnings with `global.IS_REACT_ACT_ENVIRONMENT`. ([#22561](https://github.com/react/react/pull/22561)  by [@acdlite](https://github.com/acdlite))
* Expand act warning to cover all APIs that might schedule React work. ([#22607](https://github.com/react/react/pull/22607)  by [@acdlite](https://github.com/acdlite))
* Make `act` batch updates. ([#21797](https://github.com/react/react/pull/21797)  by [@acdlite](https://github.com/acdlite))
* Remove warning for dangling passive effects. ([#22609](https://github.com/react/react/pull/22609)  by [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Track late-mounted roots in Fast Refresh. ([#22740](https://github.com/react/react/pull/22740)  by [@anc95](https://github.com/anc95))
* Add `exports` field to `package.json`. ([#23087](https://github.com/react/react/pull/23087)  by [@otakustay](https://github.com/otakustay))

### Server Components (Experimental) {/*server-components-experimental*/}

* Add Server Context support. ([#23244](https://github.com/react/react/pull/23244)  by [@salazarm](https://github.com/salazarm))
* Add `lazy` support. ([#24068](https://github.com/react/react/pull/24068)  by [@gnoff](https://github.com/gnoff))
* Update webpack plugin for webpack 5 ([#22739](https://github.com/react/react/pull/22739)  by [@michenly](https://github.com/michenly))
* Fix a mistake in the Node loader. ([#22537](https://github.com/react/react/pull/22537)  by [@btea](https://github.com/btea))
* Use `globalThis` instead of `window` for edge environments. ([#22777](https://github.com/react/react/pull/22777)  by [@huozhi](https://github.com/huozhi))
