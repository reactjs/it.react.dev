---
title: "React Labs: su cosa stiamo lavorando – marzo 2023"
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage, and Andrew Clark
date: 2023/03/22
description: Nei post React Labs scriviamo di progetti in ricerca e sviluppo attivi. Abbiamo fatto progressi significativi da [l'ultimo aggiornamento](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) e vorremmo condividere cosa abbiamo imparato.
translationStatus: ai-draft
---

22 marzo 2023 di [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage) e [Andrew Clark](https://twitter.com/acdlite)

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023.md).

</Note>

<Intro>

Nei post React Labs scriviamo di progetti in ricerca e sviluppo attivi. Abbiamo fatto progressi significativi da [l'ultimo aggiornamento](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) e vorremmo condividere cosa abbiamo imparato.

</Intro>

---

## React Server Components {/*react-server-components*/}

React Server Components (o RSC) è una nuova architettura applicativa progettata dal team React.

Abbiamo condiviso per la prima volta la nostra ricerca su RSC in un [talk introduttivo](/blog/2020/12/21/data-fetching-with-react-server-components) e in un [RFC](https://github.com/reactjs/rfcs/pull/188). Per riassumerli, stiamo introducendo un nuovo tipo di componente — i componenti Server — che vengono eseguiti in anticipo ed esclusi dal tuo bundle JavaScript. I componenti Server possono essere eseguiti durante la build, permettendoti di leggere dal filesystem o recuperare contenuti statici. Possono anche essere eseguiti sul server, permettendoti di accedere al tuo data layer senza dover costruire un'API. Puoi passare dati tramite props dai componenti Server ai componenti Client interattivi nel browser.

RSC combina il semplice modello mentale request/response delle Multi-Page App server-centric con l'interattività fluida delle Single-Page App client-centric, dandoti il meglio di entrambi i mondi.

Dall'ultimo aggiornamento, abbiamo mergiato l'[RFC di React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) per ratificare la proposta. Abbiamo risolto i problemi aperti con la proposta [React Server Module Conventions](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) e raggiunto consenso con i nostri partner per adottare la convenzione `"use client"`. Questi documenti fungono anche da specifica per ciò che un'implementazione compatibile con RSC dovrebbe supportare.

Il cambiamento più grande è che abbiamo introdotto [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) come modo principale per fare data fetching dai componenti Server. Prevediamo anche di supportare il caricamento dati dal client introducendo un nuovo Hook chiamato `use` che estrae i valori dalle Promise. Anche se non possiamo supportare `async / await` in componenti arbitrari in app solo-client, prevediamo di aggiungere supporto quando strutturi la tua app solo-client in modo simile a come sono strutturate le app RSC.

Ora che abbiamo il data fetching abbastanza a posto, stiamo esplorando l'altra direzione: inviare dati dal client al server, così puoi eseguire mutazioni del database e implementare form. Lo facciamo permettendoti di passare funzioni Server Action attraverso il confine server/client, che il client può poi chiamare, fornendo RPC fluido. Le Server Action ti danno anche form progressivamente migliorati prima che JavaScript carichi.

React Server Components è stato rilasciato in [Next.js App Router](/learn/creating-a-react-app#nextjs-app-router). Questo mostra un'integrazione profonda di un router che abbraccia RSC come primitiva, ma non è l'unico modo per costruire un router e framework compatibile con RSC. C'è una chiara separazione tra funzionalità fornite dalla specifica RSC e dall'implementazione. React Server Components è pensato come specifica per componenti che funzionano tra framework React compatibili.

In generale consigliamo di usare un framework esistente, ma se devi costruire il tuo framework custom, è possibile. Costruire un framework compatibile con RSC non è facile come vorremmo, principalmente per l'integrazione profonda con il bundler necessaria. La generazione attuale di bundler è ottima per l'uso sul client, ma non è stata progettata con supporto di prima classe per dividere un singolo module graph tra server e client. Ecco perché ora collaboriamo direttamente con gli sviluppatori di bundler per integrare le primitive per RSC.

## Caricamento delle risorse {/*asset-loading*/}

[Suspense](/reference/react/Suspense) ti permette di specificare cosa mostrare sullo schermo mentre i dati o il codice per i tuoi componenti sono ancora in caricamento. Questo permette ai tuoi utenti di vedere progressivamente più contenuto mentre la pagina carica e durante le navigazioni del router che caricano più dati e codice. Tuttavia, dal punto di vista dell'utente, data loading e renderizzazione non raccontano tutta la storia quando si considera se il nuovo contenuto è pronto. Di default, i browser caricano stylesheet, font e immagini in modo indipendente, il che può portare a salti dell'UI e layout shift consecutivi.

Stiamo lavorando per integrare completamente Suspense con il lifecycle di caricamento di stylesheet, font e immagini, così React li tiene in considerazione per determinare se il contenuto è pronto per essere mostrato. Senza alcuna modifica al modo in cui scrivi i tuoi componenti React, gli aggiornamenti si comporteranno in modo più coerente e gradevole. Come ottimizzazione, forniremo anche un modo manuale per precaricare risorse come i font direttamente dai componenti.

Stiamo attualmente implementando queste funzionalità e avremo presto altro da condividere.

## Metadati del documento {/*document-metadata*/}

Pagine e schermate diverse nella tua app possono avere metadati diversi come il tag `<title>`, la description e altri tag `<meta>` specifici per quella schermata. Dal punto di vista della manutenzione, è più scalabile tenere queste informazioni vicine al componente React per quella pagina o schermata. Tuttavia, i tag HTML per questi metadati devono essere nel `<head>` del documento, che tipicamente viene renderizzato in un componente alla radice dell'app.

Oggi le persone risolvono questo problema con una di due tecniche.

Una tecnica è renderizzare un componente di terze parti speciale che sposta `<title>`, `<meta>` e altri tag al suo interno nel `<head>` del documento. Funziona per i browser principali, ma ci sono molti client che non eseguono JavaScript lato client, come i parser Open Graph, quindi questa tecnica non è universalmente adatta.

Un'altra tecnica è server-renderizzare la pagina in due parti. Prima viene renderizzato il contenuto principale e vengono raccolti tutti questi tag. Poi il `<head>` viene renderizzato con questi tag. Infine `<head>` e contenuto principale vengono inviati al browser. Questo approccio funziona, ma ti impedisce di sfruttare lo [Streaming Server Renderer di React 18](/reference/react-dom/server/renderToReadableStream) perché dovresti aspettare che tutto il contenuto sia renderizzato prima di inviare il `<head>`.

Ecco perché stiamo aggiungendo supporto integrato per renderizzare tag `<title>`, `<meta>` e `<link>` di metadati ovunque nell'albero dei componenti out of the box. Funzionerebbe allo stesso modo in tutti gli ambienti, incluso codice completamente lato client, SSR e in futuro RSC. Condivideremo presto più dettagli.

## React Optimizing Compiler {/*react-optimizing-compiler*/}

Dall'aggiornamento precedente abbiamo iterato attivamente sul design di [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), un optimizing compiler per React. In precedenza ne abbiamo parlato come di un "compilatore auto-memoizing", e in un certo senso è vero. Ma costruire il compilatore ci ha aiutato a capire ancora più a fondo il modello di programmazione di React. Un modo migliore di capire React Forget è come un compilatore automatico di *reattività*.

L'idea centrale di React è che gli sviluppatori definiscono la loro UI come funzione dello state corrente. Lavori con valori JavaScript semplici — numeri, stringhe, array, oggetti — e usi idiomi JavaScript standard — if/else, for, ecc. — per descrivere la logica del componente. Il modello mentale è che React ri-renderizza ogni volta che lo state dell'applicazione cambia. Crediamo che questo semplice modello mentale e restare vicini alla semantica JavaScript sia un principio importante nel modello di programmazione di React.

Il problema è che React a volte può essere *troppo* reattivo: può ri-renderizzare troppo. Ad esempio, in JavaScript non abbiamo modi economici per confrontare se due oggetti o array sono equivalenti (stesse chiavi e valori), quindi creare un nuovo oggetto o array a ogni render può far fare a React più lavoro del necessario. Questo significa che gli sviluppatori devono memorizzare esplicitamente i componenti per non reagire eccessivamente ai cambiamenti.

Il nostro obiettivo con React Forget è assicurare che le app React abbiano di default la giusta quantità di reattività: che le app ri-renderizzino solo quando i valori di state cambiano in modo *significativo*. Dal punto di vista dell'implementazione significa memorizzare automaticamente, ma crediamo che l'inquadratura della reattività sia un modo migliore di capire React e Forget. Un modo di pensarci è che React attualmente ri-renderizza quando cambia l'identità dell'oggetto. Con Forget, React ri-renderizza quando cambia il valore semantico — senza il costo runtime di confronti profondi.

In termini di progressi concreti, dall'ultimo aggiornamento abbiamo iterato sostanzialmente sul design del compilatore per allinearlo a questo approccio di reattività automatica e incorporare feedback dall'uso interno del compilatore. Dopo rifattorizzazioni significative al compilatore a fine scorso anno, abbiamo iniziato a usarlo in produzione in aree limitate in Meta. Prevediamo di rilasciarlo in open source una volta provato in produzione.

Infine, molte persone hanno espresso interesse su come funziona il compilatore. Non vediamo l'ora di condividere molti più dettagli quando avremo provato il compilatore e lo rilasceremo in open source. Ma ci sono alcuni punti che possiamo condividere ora:

Il core del compilatore è quasi completamente disaccoppiato da Babel, e l'API core del compilatore è (approssimativamente) old AST in, new AST out (mantenendo i dati di posizione nel sorgente). Sotto il cofano usiamo una rappresentazione del codice custom e una pipeline di trasformazione per fare analisi semantica a basso livello. Tuttavia, l'interfaccia pubblica principale al compilatore sarà tramite Babel e altri plugin del build system. Per facilitare i test abbiamo attualmente un plugin Babel che è un wrapper molto sottile che chiama il compilatore per generare una nuova versione di ogni funzione e sostituirla.

Mentre rifattorizzavamo il compilatore negli ultimi mesi, volevamo concentrarci sul perfezionare il modello di compilazione core per assicurarci di gestire complessità come condizionali, loop, riassegnazioni e mutazioni. Tuttavia JavaScript ha molti modi di esprimere ciascuna di queste funzionalità: if/else, ternari, for, for-in, for-of, ecc. Cercare di supportare l'intero linguaggio fin dall'inizio avrebbe ritardato il punto in cui avremmo potuto validare il modello core. Invece abbiamo iniziato con un sottoinsieme piccolo ma rappresentativo del linguaggio: let/const, if/else, for loop, oggetti, array, primitivi, chiamate di funzione e altre poche funzionalità. Man mano che acquisivamo fiducia nel modello core e perfezionavamo le nostre astrazioni interne, abbiamo espanso il sottoinsieme supportato. Siamo anche espliciti sulla sintassi non ancora supportata, loggando diagnostiche e saltando la compilazione per input non supportato. Abbiamo utility per provare il compilatore sui codebase Meta e vedere quali funzionalità non supportate sono più comuni così da prioritizzarle. Continueremo ad espandere incrementalmente verso il supporto dell'intero linguaggio.

Rendere reattivo il JavaScript semplice nei componenti React richiede un compilatore con profonda comprensione della semantica così da capire esattamente cosa fa il codice. Con questo approccio stiamo creando un sistema di reattività in JavaScript che ti permette di scrivere codice di prodotto di qualsiasi complessità con la piena espressività del linguaggio, invece di essere limitati a un linguaggio specifico del dominio.

## Offscreen Rendering {/*offscreen-rendering*/}

L'offscreen rendering è una funzionalità in arrivo in React per renderizzare schermate in background senza overhead aggiuntivo di performance. Puoi pensarla come una versione della [proprietà CSS `content-visibility`](https://developer.mozilla.org/it/docs/Web/CSS/content-visibility) che funziona non solo per elementi DOM ma anche per componenti React. Durante la ricerca abbiamo scoperto vari casi d'uso:

* Un router può prerenderizzare schermate in background così quando un utente ci naviga, sono immediatamente disponibili.
* Un componente per il cambio tab può preservare lo state delle tab nascoste, così l'utente può passare tra di esse senza perdere i progressi.
* Un componente lista virtualizzata può prerenderizzare righe aggiuntive sopra e sotto la finestra visibile.
* Quando apri un modal o popup, il resto dell'app può essere messo in modalità "background" così eventi e aggiornamenti sono disabilitati per tutto tranne il modal.

La maggior parte degli sviluppatori React non interagirà direttamente con le API offscreen di React. Invece, l'offscreen rendering sarà integrato in cose come router e librerie UI, e gli sviluppatori che usano quelle librerie ne beneficeranno automaticamente senza lavoro aggiuntivo.

L'idea è che dovresti poter renderizzare qualsiasi albero React offscreen senza cambiare il modo in cui scrivi i tuoi componenti. Quando un componente è renderizzato offscreen, non *monta* effettivamente finché il componente non diventa visibile — i suoi Effetti non vengono attivati. Ad esempio, se un componente usa `useEffect` per loggare analytics quando appare per la prima volta, il prerendering non compromette l'accuratezza di quelle analytics. Allo stesso modo, quando un componente va offscreen, anche i suoi Effetti vengono smontati. Una caratteristica chiave dell'offscreen rendering è che puoi cambiare la visibilità di un componente senza perdere il suo state.

Dall'ultimo aggiornamento abbiamo testato internamente in Meta una versione sperimentale del prerendering nelle nostre app React Native su Android e iOS, con risultati positivi sulle performance. Abbiamo anche migliorato come l'offscreen rendering funziona con Suspense — sospendere dentro un albero offscreen non attiva i fallback di Suspense. Il lavoro rimanente consiste nel finalizzare le primitive esposte agli sviluppatori di librerie. Ci aspettiamo di pubblicare un RFC più avanti quest'anno, insieme a un'API sperimentale per test e feedback.

## Transition Tracing {/*transition-tracing*/}

L'API Transition Tracing ti permette di rilevare quando le [Transizioni React](/reference/react/useTransition) diventano più lente e investigare perché possono essere lente. Dopo l'ultimo aggiornamento abbiamo completato il design iniziale dell'API e pubblicato un [RFC](https://github.com/reactjs/rfcs/pull/238). Le funzionalità di base sono state anche implementate. Il progetto è attualmente in pausa. Accogliamo feedback sull'RFC e non vediamo l'ora di riprenderne lo sviluppo per fornire uno strumento migliore di misurazione delle performance per React. Sarà particolarmente utile con router costruiti sopra le Transizioni React, come [Next.js App Router](/learn/creating-a-react-app#nextjs-app-router).

* * *
Oltre a questo aggiornamento, il nostro team è stato recentemente ospite di podcast e livestream della community per parlare più del nostro lavoro e rispondere a domande.

* [Dan Abramov](https://bsky.app/profile/danabra.mov) e [Joe Savona](https://twitter.com/en_JS) sono stati intervistati da [Kent C. Dodds sul suo canale YouTube](https://www.youtube.com/watch?v=h7tur48JSaw), dove hanno discusso le preoccupazioni su React Server Components.
* [Dan Abramov](https://bsky.app/profile/danabra.mov) e [Joe Savona](https://twitter.com/en_JS) sono stati ospiti del [podcast JSParty](https://jsparty.fm/267) e hanno condiviso i loro pensieri sul futuro di React.

Grazie a [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster), e [Sophie Alpert](https://twitter.com/sophiebits) per aver revisionato questo post.

Grazie per la lettura, ci vediamo nel prossimo aggiornamento!
