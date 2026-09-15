---
title: "React Labs: su cosa stiamo lavorando – febbraio 2024"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll, and Dan Abramov
date: 2024/02/15
description: Nei post React Labs scriviamo dei progetti in ricerca e sviluppo attivi. Abbiamo fatto progressi significativi dall'ultimo aggiornamento e vogliamo condividerli.
translationStatus: ai-draft
---

15 febbraio 2024 di [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode) e [Dan Abramov](https://bsky.app/profile/danabra.mov).

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024.md).

</Note>

<Intro>

Nei post React Labs scriviamo dei progetti in ricerca e sviluppo attivi. Abbiamo fatto progressi significativi dall'[ultimo aggiornamento](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023) e vogliamo condividerli.

</Intro>

---

## React Compiler {/*react-compiler*/}

React Compiler non è più un progetto di ricerca: il compiler ora alimenta instagram.com in produzione e stiamo lavorando per distribuirlo su altre superfici in Meta e per preparare il primo rilascio open source.

Come discusso nel nostro [post precedente](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), React può *a volte* renderizzare troppo quando lo state cambia. Fin dai primi giorni di React la nostra soluzione per questi casi è stata la memorizzazione manuale. Nelle API attuali, questo significa applicare [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback) e [`memo`](/reference/react/memo) per regolare manualmente quanto React renderizza al cambiamento dello state. Ma la memorizzazione manuale è un compromesso. Appesantisce il codice, è facile sbagliare e richiede lavoro extra per restare aggiornata.

La memorizzazione manuale è un compromesso ragionevole, ma non ci accontentavamo. La nostra visione è che React *automaticamente* renderizzi solo le parti giuste dell'UI quando lo state cambia, *senza compromettere il modello mentale di React*. Crediamo che l'approccio di React — UI come semplice funzione dello state, con valori e idiomi JavaScript standard — sia una parte fondamentale del perché React sia stato accessibile a così tanti sviluppatori. Per questo abbiamo investito nella costruzione di un compiler ottimizzante per React.

JavaScript è un linguaggio notoriamente difficile da ottimizzare, grazie alle sue regole permissive e alla natura dinamica. React Compiler riesce a compilare codice in sicurezza modellando sia le regole di JavaScript *sia* le "regole di React". Ad esempio, i componenti React devono essere idempotenti — restituire lo stesso valore a parità di input — e non possono mutare props o valori dello state. Queste regole limitano ciò che gli sviluppatori possono fare e aiutano a definire uno spazio sicuro in cui il compiler può ottimizzare.

Naturalmente, capiamo che gli sviluppatori a volte piegano un po' le regole, e il nostro obiettivo è far funzionare React Compiler out of the box su quanto più codice possibile. Il compiler tenta di rilevare quando il codice non segue rigorosamente le regole di React e compilerà il codice dove è sicuro o salterà la compilazione se non lo è. Stiamo testando contro il codebase ampio e vario di Meta per aiutare a validare questo approccio.

Per gli sviluppatori curiosi di assicurarsi che il loro codice segua le regole di React, consigliamo di [abilitare Strict Mode](/reference/react/StrictMode) e [configurare il plugin ESLint di React](/learn/editor-setup#linting). Questi strumenti possono aiutare a individuare bug sottili nel codice React, migliorando la qualità delle applicazioni oggi e preparandole per funzionalità future come React Compiler. Stiamo anche lavorando a documentazione consolidata delle regole di React e ad aggiornamenti del nostro plugin ESLint per aiutare i team a capire e applicare queste regole per creare app più robuste.

Per vedere il compiler in azione, puoi guardare il nostro [talk dell'autunno scorso](https://www.youtube.com/watch?v=qOQClO3g8-Y). Al momento del talk, avevamo dati sperimentali precoci dal provare React Compiler su una pagina di instagram.com. Da allora, abbiamo distribuito il compiler in produzione su tutto instagram.com. Abbiamo anche ampliato il team per accelerare il rollout su altre superfici in Meta e verso l'open source. Siamo entusiasti del percorso davanti a noi e avremo altro da condividere nei prossimi mesi.

## Actions {/*actions*/}


Abbiamo [condiviso in precedenza](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) che stavamo esplorando soluzioni per inviare dati dal client al server con Server Actions, così da eseguire mutazioni del database e implementare form. Durante lo sviluppo delle Server Actions, abbiamo esteso queste API per supportare la gestione dei dati anche nelle applicazioni solo client.

Ci riferiamo a questa collezione più ampia di funzionalità semplicemente come "Actions". Le Actions ti permettono di passare una funzione a elementi DOM come [`<form/>`](/reference/react-dom/components/form):

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

La funzione `action` può operare in modo sincrono o asincrono. Puoi definirle lato client usando JavaScript standard o lato server con la direttiva [`'use server'`](/reference/rsc/use-server). Quando usi un'action, React gestisce il ciclo di vita dell'invio dei dati per te, fornendo hooks come [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) e [`useActionState`](/reference/react/useActionState) per accedere allo state corrente e alla risposta dell'action del form.

Per impostazione predefinita, le Actions vengono inviate all'interno di una [transition](/reference/react/useTransition), mantenendo la pagina corrente interattiva mentre l'action è in elaborazione. Poiché le Actions supportano funzioni async, abbiamo anche aggiunto la possibilità di usare `async/await` nelle transition. Questo ti permette di mostrare UI in pending con lo state `isPending` di una transition quando parte una richiesta async come `fetch`, e di mostrare l'UI in pending fino all'applicazione dell'aggiornamento.

Accanto alle Actions, stiamo introducendo una funzionalità chiamata [`useOptimistic`](/reference/react/useOptimistic) per gestire aggiornamenti ottimistici dello state. Con questo hook, puoi applicare aggiornamenti temporanei che vengono automaticamente ripristinati quando lo state finale viene committato. Per le Actions, questo ti permette di impostare ottimisticamente lo state finale dei dati sul client, assumendo che l'invio abbia successo, e di ripristinare il valore dei dati ricevuti dal server. Funziona con `async`/`await` regolari, quindi funziona allo stesso modo sia che tu usi `fetch` sul client sia una Server Action dal server.

Gli autori di librerie possono implementare props personalizzate `action={fn}` nei propri componenti con `useTransition`. La nostra intenzione è che le librerie adottino il pattern Actions quando progettano le API dei componenti, per offrire un'esperienza coerente agli sviluppatori React. Ad esempio, se la tua libreria fornisce un componente `<Calendar onSelect={eventHandler}>`, considera anche di esporre un'API `<Calendar selectAction={action}`.

Sebbene inizialmente ci siamo concentrati sulle Server Actions per il trasferimento dati client-server, la nostra filosofia per React è fornire lo stesso modello di programmazione su tutte le piattaforme e ambienti. Quando possibile, se introduciamo una funzionalità sul client, puntiamo a farla funzionare anche sul server, e viceversa. Questa filosofia ci permette di creare un unico insieme di API che funzionano ovunque giri la tua app, rendendo più semplice passare a ambienti diversi in seguito.

Le Actions sono ora disponibili nel canale Canary e verranno rilasciate nella prossima versione di React.

## Nuove funzionalità in React Canary {/*new-features-in-react-canary*/}

Abbiamo introdotto le [React Canaries](/blog/2023/05/03/react-canaries) come opzione per adottare singole nuove funzionalità stabili non appena il loro design è quasi definitivo, prima che vengano rilasciate in una versione semver stabile.

Le Canaries cambiano il modo in cui sviluppiamo React. In precedenza, le funzionalità venivano ricercate e costruite in privato dentro Meta, quindi gli utenti vedevano solo il prodotto finale rifinito al rilascio in Stable. Con le Canaries, costruiamo in pubblico con l'aiuto della community per finalizzare le funzionalità che condividiamo nella serie di blog React Labs. Questo significa che senti parlare delle nuove funzionalità prima, mentre vengono finalizzate invece che dopo il completamento.

React Server Components, Asset Loading, Document Metadata e Actions sono tutte arrivate in React Canary, e abbiamo aggiunto documentazione per queste funzionalità su react.dev:

- **Directives**: [`"use client"`](/reference/rsc/use-client) e [`"use server"`](/reference/rsc/use-server) sono funzionalità del bundler progettate per framework React full-stack. Segnano i "punti di split" tra i due ambienti: `"use client"` istruisce il bundler a generare un tag `<script>` (come [Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)), mentre `"use server"` dice al bundler di generare un endpoint POST (come [tRPC Mutations](https://trpc.io/docs/concepts)). Insieme, ti permettono di scrivere componenti riutilizzabili che compongono interattività client-side con la logica server-side correlata.

- **Document Metadata**: abbiamo aggiunto supporto integrato per renderizzare tag [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta) e [`<link>`](/reference/react-dom/components/link) di metadata ovunque nell'albero dei componenti. Funzionano allo stesso modo in tutti gli ambienti, incluso codice completamente client-side, SSR e RSC. Questo fornisce supporto integrato per funzionalità pionieristiche di librerie come [React Helmet](https://github.com/nfl/react-helmet).

- **Asset Loading**: abbiamo integrato Suspense con il ciclo di vita di caricamento di risorse come stylesheet, font e script, così che React le tenga in conto per determinare se il contenuto in elementi come [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link) e [`<script>`](/reference/react-dom/components/script) è pronto per essere visualizzato. Abbiamo anche aggiunto nuove [Resource Loading APIs](/reference/react-dom#resource-preloading-apis) come `preload` e `preinit` per un controllo maggiore su quando una risorsa deve caricarsi e inizializzarsi.

- **Actions**: Come condiviso sopra, abbiamo aggiunto le Actions per gestire l'invio di dati dal client al server. Puoi aggiungere `action` a elementi come [`<form/>`](/reference/react-dom/components/form), accedere allo status con [`useFormStatus`](/reference/react-dom/hooks/useFormStatus), gestire il risultato con [`useActionState`](/reference/react/useActionState) e aggiornare ottimisticamente l'UI con [`useOptimistic`](/reference/react/useOptimistic).

Poiché tutte queste funzionalità lavorano insieme, è difficile rilasciarle nel canale Stable singolarmente. Rilasciare le Actions senza gli hook complementari per accedere agli state dei form limiterebbe l'usabilità pratica delle Actions. Introdurre React Server Components senza integrare le Server Actions complicherebbe la modifica dei dati sul server.

Prima di poter rilasciare un insieme di funzionalità nel canale Stable, dobbiamo assicurarci che funzionino in modo coeso e che gli sviluppatori abbiano tutto ciò che serve per usarle in produzione. Le React Canaries ci permettono di sviluppare queste funzionalità singolarmente e rilasciare le API stabili incrementalmente fino al completamento dell'intero set di funzionalità.

L'attuale set di funzionalità in React Canary è completo e pronto per il rilascio.

## La prossima versione major di React {/*the-next-major-version-of-react*/}

Dopo un paio d'anni di iterazione, `react@canary` è ora pronta per essere distribuita come `react@latest`. Le nuove funzionalità menzionate sopra sono compatibili con qualsiasi ambiente in cui gira la tua app, fornendo tutto il necessario per l'uso in produzione. Poiché Asset Loading e Document Metadata possono essere una breaking change per alcune app, la prossima versione di React sarà una versione major: **React 19**.

C'è ancora lavoro da fare per preparare il rilascio. In React 19, stiamo anche aggiungendo miglioramenti richiesti da tempo che richiedono breaking change, come il supporto per Web Components. Il nostro focus ora è far atterrare queste modifiche, preparare il rilascio, finalizzare la documentazione per le nuove funzionalità e pubblicare gli annunci su cosa è incluso.

Condivideremo maggiori informazioni su tutto ciò che include React 19, su come adottare le nuove funzionalità client e su come costruire supporto per React Server Components nei prossimi mesi.

## Offscreen (rinominato in Activity). {/*offscreen-renamed-to-activity*/}

Dall'ultimo aggiornamento, abbiamo rinominato una capacità che stiamo ricercando da "Offscreen" a "Activity". Il nome "Offscreen" suggeriva che si applicasse solo a parti dell'app non visibili, ma mentre ricercavamo la funzionalità abbiamo capito che è possibile che parti dell'app siano visibili e inattive, come contenuto dietro un modal. Il nuovo nome riflette più da vicino il comportamento di marcare certe parti dell'app come "attive" o "inattive".

Activity è ancora in fase di ricerca e il lavoro rimanente è finalizzare le primitive esposte agli sviluppatori di librerie. Abbiamo deprioritizzato quest'area mentre ci concentriamo sul rilascio di funzionalità più complete.

* * *

Oltre a questo aggiornamento, il nostro team ha presentato a conferenze e partecipato a podcast per parlare del nostro lavoro e rispondere a domande.

- [Sathya Gunasekaran](https://github.com/gsathya) ha parlato di React Compiler alla conferenza [React India](https://www.youtube.com/watch?v=kjOacmVsLSE)

- [Dan Abramov](/community/team#dan-abramov) ha tenuto un talk a [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) intitolato "React from Another Dimension" che esplora una storia alternativa di come React Server Components e Actions avrebbero potuto essere creati

- [Dan Abramov](/community/team#dan-abramov) è stato intervistato sul [podcast JS Party di The Changelog](https://changelog.com/jsparty/311) su React Server Components

- [Matt Carroll](/community/team#matt-carroll) è stato intervistato sul [podcast Front-End Fire](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll) dove ha discusso [The Two Reacts](https://overreacted.io/the-two-reacts/)

Grazie a [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White) e [Sathya Gunasekaran](https://twitter.com/_gsathya) per la revisione di questo post.

Grazie per la lettura, e [ci vediamo a React Conf](https://conf.react.dev/)!
