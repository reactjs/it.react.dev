---
title: "React Labs: su cosa stiamo lavorando – giugno 2022"
author:  Andrew Clark, Dan Abramov, Jan Kassens, Joseph Savona, Josh Story, Lauren Tan, Luna Ruan, Mengdi Chen, Rick Hanlon, Robert Zhang, Sathya Gunasekaran, Sebastian Markbage, and Xuan Huang
date: 2022/06/15
description: React 18 è stato anni in preparazione e ha portato con sé lezioni preziose per il team React. Il suo rilascio è stato il risultato di molti anni di ricerca ed esplorazione di molte strade. Alcune di quelle strade hanno avuto successo; molte altre si sono rivelate vicoli ciechi che hanno portato a nuove intuizioni. Una lezione che abbiamo imparato è che è frustrante per la community aspettare nuove funzionalità senza avere visibilità su queste strade che stiamo esplorando.
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022.md).

</Note>

15 giugno 2022 di [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage) e [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[React 18](/blog/2022/03/29/react-v18) è stato anni in preparazione e ha portato con sé lezioni preziose per il team React. Il suo rilascio è stato il risultato di molti anni di ricerca ed esplorazione di molte strade. Alcune di quelle strade hanno avuto successo; molte altre si sono rivelate vicoli ciechi che hanno portato a nuove intuizioni. Una lezione che abbiamo imparato è che è frustrante per la community aspettare nuove funzionalità senza avere visibilità su queste strade che stiamo esplorando.

</Intro>

---

Di solito abbiamo diversi progetti in corso in qualsiasi momento, che vanno da quelli più sperimentali a quelli chiaramente definiti. Guardando avanti, vorremmo iniziare a condividere regolarmente con la community di più su ciò su cui stiamo lavorando in questi progetti.

Per chiarire le aspettative, questa non è una roadmap con timeline precise. Molti di questi progetti sono in ricerca attiva ed è difficile fissare date di rilascio concrete. Potrebbero anche non essere mai rilasciati nella loro iterazione attuale, a seconda di ciò che impariamo. Invece, vogliamo condividere con te gli spazi problematici su cui stiamo attivamente riflettendo e ciò che abbiamo imparato finora.

## Server Components {/*server-components*/}

Abbiamo annunciato una [demo sperimentale dei React Server Components](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) (RSC) nel dicembre 2020. Da allora abbiamo completato le sue dipendenze in React 18 e lavorato a modifiche ispirate dal feedback sperimentale.

In particolare, stiamo abbandonando l'idea di avere librerie I/O forkate (es. react-fetch) e adottiamo invece un modello async/await per una migliore compatibilità. Questo non blocca tecnicamente il rilascio di RSC perché puoi anche usare i router per il data fetching. Un'altra modifica è che stiamo anche abbandonando l'approccio basato sull'estensione del file a favore delle [annotazioni dei boundary](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278).

Stiamo lavorando insieme a Vercel e Shopify per unificare il supporto dei bundler con semantiche condivise sia in webpack che in Vite. Prima del lancio, vogliamo assicurarci che le semantiche degli RSC siano le stesse in tutto l'ecosistema React. Questo è il principale ostacolo per raggiungere la stabilità.

## Asset Loading {/*asset-loading*/}

Attualmente, asset come script, fogli di stile esterni, font e immagini vengono tipicamente precaricati e caricati usando sistemi esterni. Questo può rendere complicato il coordinamento tra nuovi ambienti come lo streaming, i Server Components e altro.
Stiamo valutando l'aggiunta di API per precaricare e caricare asset esterni deduplicati tramite API React che funzionano in tutti gli ambienti React.

Stiamo anche valutando di farli supportare Suspense così puoi avere immagini, CSS e font che bloccano la visualizzazione finché non sono caricati ma non bloccano lo streaming e il concurrent rendering. Questo può aiutare a evitare il [“popcorning“](https://twitter.com/sebmarkbage/status/1516852731251724293) quando gli elementi visivi compaiono a scatti e il layout si sposta.

## Ottimizzazioni del server rendering statico {/*static-server-rendering-optimizations*/}

Static Site Generation (SSG) e Incremental Static Regeneration (ISR) sono ottimi modi per ottenere prestazioni per pagine cacheable, ma pensiamo di poter aggiungere funzionalità per migliorare le prestazioni del Server Side Rendering (SSR) dinamico – soprattutto quando la maggior parte ma non tutti i contenuti sono cacheable. Stiamo esplorando modi per ottimizzare il server rendering utilizzando compilazione e passaggi statici.

## React Optimizing Compiler {/*react-compiler*/}

Abbiamo dato un'[anteprima anticipata](https://www.youtube.com/watch?v=lGEMwh32soc) di React Forget alla React Conf 2021. È un compilatore che genera automaticamente l'equivalente di chiamate `useMemo` e `useCallback` per minimizzare il costo della ri-renderizzazione, mantenendo il modello di programmazione di React.

Di recente, abbiamo completato una riscrittura del compilatore per renderlo più affidabile e capace. Questa nuova architettura ci consente di analizzare e memoizzare pattern più complessi come l'uso di [mutazioni locali](/learn/keeping-components-pure#local-mutation-your-components-little-secret), e apre molte nuove opportunità di ottimizzazione a compile-time oltre a essere alla pari con gli Hook di memoizzazione.

Stiamo anche lavorando a un playground per esplorare molti aspetti del compilatore. Sebbene l'obiettivo del playground sia facilitare lo sviluppo del compilatore, pensiamo che renderà più facile provarlo e sviluppare intuizione su ciò che fa il compilatore. Rivela vari insight su come funziona sotto il cofano e renderizza in tempo reale gli output del compilatore mentre digiti. Sarà rilasciato insieme al compilatore quando uscirà.

## Offscreen {/*offscreen*/}

Oggi, se vuoi nascondere e mostrare un componente, hai due opzioni. Una è aggiungerlo o rimuoverlo dall'albero completamente. Il problema con questo approccio è che lo state dell'UI viene perso ogni volta che smonti, incluso lo state memorizzato nel DOM, come la posizione di scroll.

L'altra opzione è mantenere il componente montato e alternare l'aspetto visivamente usando CSS. Questo preserva lo state dell'UI, ma ha un costo in termini di prestazioni, perché React deve continuare a renderizzare il componente nascosto e tutti i suoi figli ogni volta che riceve nuovi aggiornamenti.

Offscreen introduce una terza opzione: nascondere l'UI visivamente, ma deprioritizzare il suo contenuto. L'idea è simile nello spirito alla proprietà CSS `content-visibility`: quando il contenuto è nascosto, non ha bisogno di restare sincronizzato con il resto dell'UI. React può rimandare il lavoro di renderizzazione finché il resto dell'app è inattivo, o finché il contenuto non diventa di nuovo visibile.

Offscreen è una capability di basso livello che sblocca funzionalità di alto livello. Simile ad altre funzionalità concorrenti di React come `startTransition`, nella maggior parte dei casi non interagirai direttamente con l'API Offscreen, ma tramite un framework opinionated per implementare pattern come:

* **Transizioni istantanee.** Alcuni framework di routing precaricano già i dati per velocizzare le navigazioni successive, ad esempio quando passi il mouse su un link. Con Offscreen, potranno anche prerenderizzare la schermata successiva in background.
* **State riutilizzabile.** Allo stesso modo, quando navighi tra route o tab, puoi usare Offscreen per preservare lo state della schermata precedente così puoi tornare indietro e riprendere da dove avevi lasciato.
* **Renderizzazione di liste virtualizzate.** Quando visualizzi liste molto grandi di elementi, i framework di liste virtualizzate prerenderizzeranno più righe di quelle attualmente visibili. Puoi usare Offscreen per prerenderizzare le righe nascoste con priorità più bassa rispetto agli elementi visibili nella lista.
* **Contenuto in background.** Stiamo anche esplorando una funzionalità correlata per deprioritizzare contenuti in background senza nasconderli, ad esempio quando visualizzi un overlay modale.

## Transition Tracing {/*transition-tracing*/}

Attualmente, React ha due strumenti di profiling. Il [Profiler originale](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) mostra una panoramica di tutti i commit in una sessione di profiling. Per ogni commit, mostra anche tutti i componenti che hanno renderizzato e il tempo impiegato per renderizzarli. Abbiamo anche una versione beta di un [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76) introdotto in React 18 che mostra quando i componenti schedulano aggiornamenti e quando React lavora su questi aggiornamenti. Entrambi questi profiler aiutano gli sviluppatori a identificare problemi di prestazioni nel loro codice.

Abbiamo capito che gli sviluppatori non trovano molto utile conoscere singoli commit o componenti lenti fuori contesto. È più utile sapere cosa causa effettivamente i commit lenti. E gli sviluppatori vogliono poter tracciare interazioni specifiche (es. un click su un pulsante, un caricamento iniziale o una navigazione di pagina) per monitorare regressioni di prestazioni e capire perché un'interazione era lenta e come risolverla.

In precedenza abbiamo provato a risolvere questo problema creando un'[Interaction Tracing API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16), ma aveva alcuni difetti di design fondamentali che riducevano l'accuratezza nel tracciare perché un'interazione era lenta e a volte faceva sì che le interazioni non terminassero mai. Abbiamo finito per [rimuovere questa API](https://github.com/react/react/pull/20037) a causa di questi problemi.

Stiamo lavorando a una nuova versione dell'Interaction Tracing API (provvisoriamente chiamata Transition Tracing perché viene avviata tramite `startTransition`) che risolve questi problemi.

## Nuova documentazione React {/*new-react-docs*/}

Lo scorso anno, abbiamo annunciato la versione beta del nuovo sito di documentazione React ([poi pubblicato come react.dev](/blog/2023/03/16/introducing-react-dev)). I nuovi materiali di apprendimento insegnano prima gli Hooks e includono nuovi diagrammi, illustrazioni, oltre a molti esempi interattivi e sfide. Abbiamo fatto una pausa da quel lavoro per concentrarci sul rilascio di React 18, ma ora che React 18 è uscito, stiamo lavorando attivamente per completare e pubblicare la nuova documentazione.

Stiamo attualmente scrivendo una sezione dettagliata sugli Effetti, poiché abbiamo sentito che è uno degli argomenti più difficili sia per utenti nuovi che esperti di React. [Sincronizzare con gli Effetti](/learn/synchronizing-with-effects) è la prima pagina pubblicata della serie, e ce ne saranno altre nelle prossime settimane. Quando abbiamo iniziato a scrivere una sezione dettagliata sugli Effetti, abbiamo capito che molti pattern comuni degli Effetti possono essere semplificati aggiungendo una nuova primitiva a React. Abbiamo condiviso alcune idee iniziali su questo nell'[RFC useEvent](https://github.com/reactjs/rfcs/pull/220). È attualmente in ricerca iniziale e stiamo ancora iterando sull'idea. Apprezziamo i commenti della community sull'RFC finora, così come il [feedback](https://github.com/reactjs/react.dev/issues/3308) e i contributi alla riscrittura della documentazione in corso. Vorremmo ringraziare in particolare [Harish Kumar](https://github.com/harish-sethuraman) per aver inviato e revisionato molti miglioramenti all'implementazione del nuovo sito.

*Grazie a [Sophie Alpert](https://twitter.com/sophiebits) per aver revisionato questo blog post!*
