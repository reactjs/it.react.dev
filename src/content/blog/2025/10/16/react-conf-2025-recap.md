---
title: "Resoconto di React Conf 2025"
author: Matt Carroll and Ricky Hanlon
date: 2025/10/16
description: La scorsa settimana abbiamo ospitato React Conf 2025; in questo post riassumiamo i talk e gli annunci dell'evento...
translationStatus: ai-draft
---

Oct 16, 2025 by [Matt Carroll](https://x.com/mattcarrollcode) and [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2025/10/16/react-conf-2025-recap.md).

</Note>

<Intro>

La scorsa settimana abbiamo ospitato React Conf 2025, dove abbiamo annunciato la [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) e presentato le nuove funzionalità in arrivo per React e React Native.

</Intro>

---

React Conf 2025 si è tenuta il 7-8 ottobre 2025 a Henderson, Nevada.

Gli stream completi del [giorno 1](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s) e del [giorno 2](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s) sono disponibili online, e puoi vedere le foto dell'evento [qui](https://conf.react.dev/photos).

In questo post riassumiamo i talk e gli annunci dell'evento.


## Day 1 Keynote {/*day-1-keynote*/}

_Guarda lo stream completo del giorno 1 [qui.](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)_

Nel keynote del giorno 1, Joe Savona ha condiviso gli aggiornamenti del team e della community dall'ultima React Conf e i momenti salienti di React 19.0 e 19.1.

Mofei Zhang ha evidenziato le nuove funzionalità in React 19.2, tra cui:
* [`<Activity />`](https://react.dev/reference/react/Activity) — un nuovo componente per gestire la visibilità.
* [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) per emettere eventi dagli Effetti.
* [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks) — un nuovo strumento di profiling in DevTools.
* [Partial Pre-rendering](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) per pre-renderizzare parte di un'app in anticipo e riprendere la renderizzazione in seguito.

Jack Pope ha annunciato nuove funzionalità in Canary, tra cui:

* [`<ViewTransition />`](https://react.dev/reference/react/ViewTransition) — un nuovo componente per animare le transizioni di pagina.
* [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance) — un nuovo modo per interagire con i nodi DOM avvolti da un Fragment.

Lauren Tan ha annunciato [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1) e ha raccomandato a tutte le app di usare React Compiler per benefici come:
* [Memorizzazione automatica](/learn/react-compiler/introduction#what-does-react-compiler-do) che comprende il codice React.
* [Nuove regole lint](/learn/react-compiler/installation#eslint-integration) alimentate da React Compiler per insegnare le best practice.
* [Supporto predefinito](/learn/react-compiler/installation#basic-setup) per le nuove app in Vite, Next.js ed Expo.
* [Guide di migrazione](/learn/react-compiler/incremental-adoption) per le app esistenti che adottano React Compiler.

Infine, Seth Webster ha annunciato la [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) per guidare lo sviluppo open source e la community di React.

Guarda il giorno 1 qui:

<YouTubeIframe src="https://www.youtube.com/embed/zyVRg2QR6LA?si=z-8t_xCc12HwGJH_&t=1067s" />

## Day 2 Keynote {/*day-2-keynote*/}

_Guarda lo stream completo del giorno 2 [qui.](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)_

Jorge Cohen e Nicola Corti hanno aperto il giorno 2 evidenziando l'incredibile crescita di React Native con 4M di download settimanali (100% di crescita YoY), alcune migrazioni notevoli di app da Shopify, Zalando e HelloFresh, app premiate come RISE, RUNNA e Partyful, e app AI da Mistral, Replit e v0.

Riccardo Cipolleschi ha condiviso due annunci importanti per React Native:
- [React Native 0.82 sarà solo New Architecture](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only)
- [Supporto sperimentale di Hermes V1](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1)

Ruben Norte e Alex Hunt hanno concluso il keynote annunciando:
- [Nuove API DOM allineate al web](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis) per una migliore compatibilità con React sul web.
- [Nuove Performance API](https://reactnative.dev/blog/2025/10/08/react-native-0.82#web-performance-apis-canary) con un nuovo pannello di rete e un'app desktop.

Guarda il giorno 2 qui:

<YouTubeIframe src="https://www.youtube.com/embed/p9OcztRyDl0?si=qPTHftsUE07cjZpS&t=2299s" />


## React team talks {/*react-team-talks*/}

Durante la conferenza ci sono stati talk del team React, tra cui:
* [Async React Part I](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=10907s) e [Part II](https://www.youtube.com/watch?v=p9OcztRyDl0&t=29073s) [(Ricky Hanlon)](https://x.com/rickhanlonii) ha mostrato cosa è possibile con gli ultimi 10 anni di innovazione.
* [Exploring React Performance](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=20274s) [(Joe Savona)](https://x.com/en_js) ha mostrato i risultati della nostra ricerca sulle performance di React.
* [Reimagining Lists in React Native](https://www.youtube.com/watch?v=p9OcztRyDl0&t=10382s) [(Luna Wei)](https://x.com/lunaleaps) ha presentato Virtual View, una nuova primitiva per le liste che gestisce la visibilità con renderizzazione basata su modalità (hidden/pre-render/visible).
* [Profiling with React Performance tracks](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=8276s) [(Ruslan Lesiutin)](https://x.com/ruslanlesiutin) ha mostrato come usare le nuove React Performance Tracks per debuggare problemi di performance e costruire ottime app.
* [React Strict DOM](https://www.youtube.com/watch?v=p9OcztRyDl0&t=9026s) [(Nicolas Gallagher)](https://nicolasgallagher.com/) ha parlato dell'approccio di Meta all'uso di codice web su native.
* [View Transitions and Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s) [(Chance Strickland)](https://x.com/chancethedev) — Chance ha lavorato con il team React per mostrare come usare `<Activity />` e `<ViewTransition />` per costruire animazioni veloci dal feeling nativo.
* [In case you missed the memo](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=9525s) [(Cody Olsen)](https://bsky.app/profile/codey.bsky.social) — Cody ha lavorato con il team React per adottare il Compiler in Sanity Studio e ha condiviso com'è andata.
## React framework talks {/*react-framework-talks*/}

La seconda metà del giorno 2 ha avuto una serie di talk dai team dei framework React, tra cui:

* [React Native, Amplified](https://www.youtube.com/watch?v=p9OcztRyDl0&t=5737s) di [Giovanni Laquidara](https://x.com/giolaq) e [Eric Fahsl](https://x.com/efahsl).
* [React Everywhere: Bringing React Into Native Apps](https://www.youtube.com/watch?v=p9OcztRyDl0&t=18213s) di [Mike Grabowski](https://x.com/grabbou).
* [How Parcel Bundles React Server Components](https://www.youtube.com/watch?v=p9OcztRyDl0&t=19538s) di [Devon Govett](https://x.com/devonovett).
* [Designing Page Transitions](https://www.youtube.com/watch?v=p9OcztRyDl0&t=20640s) di [Delba de Oliveira](https://x.com/delba_oliveira).
* [Build Fast, Deploy Faster — Expo in 2025](https://www.youtube.com/watch?v=p9OcztRyDl0&t=21350s) di [Evan Bacon](https://x.com/baconbrix).
* [The React Router's take on RSC](https://www.youtube.com/watch?v=p9OcztRyDl0&t=22367s) di [Kent C. Dodds](https://x.com/kentcdodds).
* [RedwoodSDK: Web Standards Meet Full-Stack React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=24992s) di [Peter Pistorius](https://x.com/appfactory) e [Aurora Scharff](https://x.com/aurorascharff).
* [TanStack Start](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26065s) di [Tanner Linsley](https://x.com/tannerlinsley).

## Q&A {/*q-and-a*/}
Durante la conferenza ci sono stati tre panel Q&A:

* [React Team at Meta Q&A](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=26304s) condotto da [Shruti Kapoor](https://x.com/shrutikapoor08)
* [React Frameworks Q&A](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26812s) condotto da [Jack Herrington](https://x.com/jherr)
* [React and AI Panel](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=18741s) condotto da [Lee Robinson](https://x.com/leerob)

## And more... {/*and-more*/}

Abbiamo anche ascoltato talk dalla community, tra cui:
* [Building an MCP Server](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24204s) di [James Swinton](https://x.com/JamesSwintonDev) ([AG Grid](https://www.ag-grid.com/?utm_source=react-conf&utm_medium=react-conf-homepage&utm_campaign=react-conf-sponsorship-2025))
* [Modern Emails using React](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=25521s) di [Zeno Rocha](https://x.com/zenorocha) ([Resend](https://resend.com/))
* [Why React Native Apps Make All the Money](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24917s) di [Perttu Lähteenlahti](https://x.com/plahteenlahti) ([RevenueCat](https://www.revenuecat.com/))
* [The invisible craft of great UX](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=23400s) di [Michał Dudak](https://x.com/michaldudak) ([MUI](https://mui.com/))

## Thanks {/*thanks*/}

Grazie a tutto lo staff, ai relatori e ai partecipanti che hanno reso possibile React Conf 2025. Sono troppi per elencarli tutti, ma vogliamo ringraziare in particolare alcuni.

Grazie a [Matt Carroll](https://x.com/mattcarrollcode) per aver pianificato l'intero evento e costruito il sito della conferenza.

Grazie a [Michael Chan](https://x.com/chantastic) per aver condotto React Conf con dedizione ed energia incredibili, presentando introduzioni attente ai relatori, battute divertenti e genuino entusiasmo per tutta la durata dell'evento. Grazie a [Jorge Cohen](https://x.com/JorgeWritesCode) per aver ospitato lo streaming live, intervistato ogni relatore e portato online l'esperienza di React Conf in presenza.

Grazie a [Mateusz Kornacki](https://x.com/mat_kornacki), [Mike Grabowski](https://x.com/grabbou), [Kris Lis](https://www.linkedin.com/in/krzysztoflisakakris/) e al team di [Callstack](https://www.callstack.com/) per aver co-organizzato React Conf e fornito supporto in design, ingegneria e marketing. Grazie al [team ZeroSlope](https://zeroslopeevents.com/contact-us/): Sunny Leggett, Tracey Harrison, Tara Larish, Whitney Pogue e Brianne Smythia per l'aiuto nell'organizzazione dell'evento.

Grazie a [Jorge Cabiedes Acosta](https://github.com/jorge-cab), [Gijs Weterings](https://x.com/gweterings), [Tim Yung](https://x.com/yungsters) e [Jason Bonta](https://x.com/someextent) per aver portato le domande da Discord allo streaming live. Grazie a [Lynn Yu](https://github.com/lynnshaoyu) per aver guidato la moderazione di Discord. Grazie a [Seth Webster](https://x.com/sethwebster) per averci dato il benvenuto ogni giorno; e a [Christopher Chedeau](https://x.com/vjeux), [Kevin Gozali](https://x.com/fkgozali) e [Pieter De Baets](https://x.com/Javache) per essersi uniti a noi con un messaggio speciale durante l'after-party.

Grazie a [Kadi Kraman](https://x.com/kadikraman), [Beto](https://x.com/betomoedano) e [Nicolas Solerieu](https://www.linkedin.com/in/nicolas-solerieu/) per aver costruito l'app mobile della conferenza. Grazie a [Wojtek Szafraniec](https://x.com/wojteg1337) per l'aiuto con il sito della conferenza. Grazie a [Mustache](https://www.mustachepower.com/) e [Cornerstone](https://cornerstoneav.com/) per visual, palco e audio; e al Westin Hotel per averci ospitato.

Grazie a tutti gli sponsor che hanno reso possibile l'evento: [Amazon](https://www.developer.amazon.com), [MUI](https://mui.com/), [Vercel](https://vercel.com/), [Expo](https://expo.dev/), [RedwoodSDK](https://rwsdk.com), [Ag Grid](https://www.ag-grid.com), [RevenueCat](https://www.revenuecat.com/), [Resend](https://resend.com), [Mux](https://www.mux.com/), [Old Mission](https://www.oldmissioncapital.com/), [Arcjet](https://arcjet.com), [Infinite Red](https://infinite.red/) e [RenderATL](https://renderatl.com).

Grazie a tutti i relatori che hanno condiviso le loro conoscenze e la loro esperienza con la community.

Infine, grazie a tutti coloro che hanno partecipato di persona e online per mostrare cosa rende React, React. React è più di una libreria: è una community, ed è stato stimolante vedere tutti riuniti per condividere e imparare insieme.

Ci vediamo la prossima volta!
