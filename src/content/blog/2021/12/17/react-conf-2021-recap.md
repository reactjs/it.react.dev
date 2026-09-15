---
title: "React Conf 2021: il riepilogo"
author: Jesslyn Tannady and Rick Hanlon
date: 2021/12/17
description: La scorsa settimana abbiamo ospitato la nostra sesta React Conf. Negli anni precedenti, abbiamo usato il palco di React Conf per annunci rivoluzionari come React Native e React Hooks. Quest'anno, abbiamo condiviso la nostra visione multi-piattaforma per React, a partire dal rilascio di React 18 e dall'adozione graduale delle funzionalità concorrenti.
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2021/12/17/react-conf-2021-recap.md).

</Note>

17 dicembre 2021 di [Jesslyn Tannady](https://twitter.com/jtannady) e [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

La scorsa settimana abbiamo ospitato la nostra sesta React Conf. Negli anni precedenti, abbiamo usato il palco di React Conf per annunci rivoluzionari come [_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) e [_React Hooks_](https://reactjs.org/docs/hooks-intro.html). Quest'anno, abbiamo condiviso la nostra visione multi-piattaforma per React, a partire dal rilascio di React 18 e dall'adozione graduale delle funzionalità concorrenti.

</Intro>

---

È stata la prima volta che React Conf è stata ospitata online, trasmessa gratuitamente e tradotta in 8 lingue diverse. Partecipanti da tutto il mondo si sono uniti al Discord della conferenza e all'evento replay per l'accessibilità in tutti i fusi orari. Oltre 50.000 persone si sono registrate, con oltre 60.000 visualizzazioni di 19 talk e 5.000 partecipanti su Discord in entrambi gli eventi.

Tutti i talk sono [disponibili in streaming online](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa).

Ecco un riepilogo di quanto condiviso sul palco:

## React 18 e le funzionalità concorrenti {/*react-18-and-concurrent-features*/}

Nella keynote, abbiamo condiviso la nostra visione per il futuro di React a partire da React 18.

React 18 aggiunge il tanto atteso renderer concorrente e aggiornamenti a Suspense senza breaking change significativi. Le app possono passare a React 18 e iniziare ad adottare gradualmente le funzionalità concorrenti con uno sforzo paragonabile a qualsiasi altro rilascio major.

**Questo significa che non c'è una concurrent mode, ma solo funzionalità concorrenti.**

Nella keynote, abbiamo anche condiviso la nostra visione per Suspense, i Server Components, i nuovi working group React e la nostra visione a lungo termine multi-piattaforma per React Native.

Guarda la keynote completa di [Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes) e [Rick Hanlon](https://twitter.com/rickhanlonii) qui:

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## React 18 per gli sviluppatori di applicazioni {/*react-18-for-application-developers*/}

Nella keynote, abbiamo anche annunciato che la React 18 RC è disponibile per essere provata. In attesa di ulteriore feedback, questa è la versione esatta di React che pubblicheremo in stable all'inizio del prossimo anno.

Per provare la React 18 RC, aggiorna le tue dipendenze:

```bash
npm install react@rc react-dom@rc
```

e passa alla nuova API `createRoot`:

```js
// before
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// after
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

Per una demo dell'upgrade a React 18, guarda il talk di [Shruti Kapoor](https://twitter.com/shrutikapoor08) qui:

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## Server rendering in streaming con Suspense {/*streaming-server-rendering-with-suspense*/}

React 18 include anche miglioramenti alle prestazioni del server-side rendering usando Suspense.

Il server rendering in streaming ti consente di generare HTML dai componenti React sul server e inviare quell'HTML ai tuoi utenti. In React 18, puoi usare `Suspense` per suddividere la tua app in unità più piccole e indipendenti che possono essere trasmesse in streaming separatamente l'una dall'altra senza bloccare il resto dell'app. Questo significa che gli utenti vedranno i tuoi contenuti prima e potranno iniziare a interagirci molto più rapidamente.

Per un approfondimento, guarda il talk di [Shaundai Person](https://twitter.com/shaundai) qui:

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## Il primo working group React {/*the-first-react-working-group*/}

Per React 18, abbiamo creato il nostro primo Working Group per collaborare con un panel di esperti, sviluppatori, maintainer di librerie ed educatori. Insieme abbiamo lavorato per creare la nostra strategia di adozione graduale e per affinare nuove API come `useId`, `useSyncExternalStore` e `useInsertionEffect`.

Per una panoramica di questo lavoro, guarda il talk di [Aakansha' Doshi](https://twitter.com/aakansha1216):

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## Strumenti per sviluppatori React {/*react-developer-tooling*/}

Per supportare le nuove funzionalità di questo rilascio, abbiamo anche annunciato il team React DevTools appena formato e un nuovo Timeline Profiler per aiutare gli sviluppatori a fare il debug delle loro app React.

Per maggiori informazioni e una demo delle nuove funzionalità DevTools, guarda il talk di [Brian Vaughn](https://twitter.com/brian_d_vaughn):

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## React senza memo {/*react-without-memo*/}

Guardando più avanti nel futuro, [Xuan Huang (黄玄)](https://twitter.com/Huxpro) ha condiviso un aggiornamento dalla nostra ricerca React Labs su un compilatore auto-memoizzante. Guarda questo talk per maggiori informazioni e una demo del prototipo del compilatore:

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## Keynote sulla documentazione React {/*react-docs-keynote*/}

[Rachel Nabors](https://twitter.com/rachelnabors) ha aperto una sezione di talk sull'apprendimento e il design con React con una keynote sul nostro investimento nella nuova documentazione React ([ora pubblicata come react.dev](/blog/2023/03/16/introducing-react-dev)):

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## E altro ancora... {/*and-more*/}

**Abbiamo anche ascoltato talk sull'apprendimento e il design con React:**

* Debbie O'Brien: [Things I learnt from the new React docs](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger: [Learning in the Browser](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [The ROI of Designing with React](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [Interactive playgrounds with React](https://youtu.be/zL8cz2W0z34).

**Talk dai team Relay, React Native e PyTorch:**

* Robert Balicki: [Re-introducing Relay](https://youtu.be/lhVGdErZuN4).
* Eric Rozell and Steven Moyes: [React Native Desktop](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle: [On-device Machine Learning for React Native](https://youtu.be/NLj73vrc2I8)

**E talk dalla community su accessibilità, strumenti e Server Components:**

* Daishi Kato: [React 18 for External Store Libraries](https://youtu.be/oPfSC5bQPR8).
* Diego Haz: [Building Accessible Components in React 18](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [Accessible Japanese Form Components with React](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell: [UI tools for artists](https://youtu.be/b3l4WxipFsE).
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

## Grazie {/*thank-you*/}

Questo è stato il nostro primo anno a pianificare una conferenza da soli, e abbiamo molte persone da ringraziare.

Prima di tutto, grazie a tutti i nostri speaker [Aakansha Doshi](https://twitter.com/aakansha1216), [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://twitter.com/brian_d_vaughn), [Daishi Kato](https://twitter.com/dai_shi), [Debbie O'Brien](https://twitter.com/debs_obrien), [Delba de Oliveira](https://twitter.com/delba_oliveira), [Diego Haz](https://twitter.com/diegohaz), [Eric Rozell](https://twitter.com/EricRozell), [Helen Lin](https://twitter.com/wizardlyhel), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Linton Ye](https://twitter.com/lintonye), [Lyle Troxell](https://twitter.com/lyle), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Balicki](https://twitter.com/StatisticsFTW), [Roman Rädle](https://twitter.com/raedle), [Sarah Rainsberger](https://twitter.com/sarah11918), [Shaundai Person](https://twitter.com/shaundai), [Shruti Kapoor](https://twitter.com/shrutikapoor08), [Steven Moyes](https://twitter.com/moyessa), [Tafu Nakazaki](https://twitter.com/hawaiiman0) e [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Grazie a tutti coloro che hanno aiutato a fornire feedback sui talk, tra cui [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Dave McCabe](https://twitter.com/mcc_abe), [Eli White](https://twitter.com/Eli_White), [Joe Savona](https://twitter.com/en_JS), [Lauren Tan](https://twitter.com/potetotes), [Rachel Nabors](https://twitter.com/rachelnabors) e [Tim Yung](https://twitter.com/yungsters).

Grazie a [Lauren Tan](https://twitter.com/potetotes) per aver configurato il Discord della conferenza e per essere stata la nostra admin Discord.

Grazie a [Seth Webster](https://twitter.com/sethwebster) per il feedback sulla direzione generale e per aver assicurato che ci concentrassimo su diversità e inclusione.

Grazie a [Rachel Nabors](https://twitter.com/rachelnabors) per aver guidato il nostro sforzo di moderazione e a [Aisha Blake](https://twitter.com/AishaBlake) per aver creato la nostra guida alla moderazione, guidato il team di moderazione, formato traduttori e moderatori e aiutato a moderare entrambi gli eventi.

Grazie ai nostri moderatori [Jesslyn Tannady](https://twitter.com/jtannady), [Suzie Grange](https://twitter.com/missuze), [Becca Bailey](https://twitter.com/beccaliz), [Luna Wei](https://twitter.com/lunaleaps), [Joe Previte](https://twitter.com/jsjoeio), [Nicola Corti](https://twitter.com/Cortinico), [Gijs Weterings](https://twitter.com/gweterings), [Claudio Procida](https://twitter.com/claudiopro), Julia Neumann, Mengdi Chen, Jean Zhang, Ricky Li e [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Grazie a [Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0) e Vihang Patel di [React India](https://www.reactindia.io/), e [Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15) e [YanLun Li](https://twitter.com/anneincoding) di [React China](https://twitter.com/ReactChina) per aver aiutato a moderare il nostro evento replay e mantenerlo coinvolgente per la community.

Grazie a Vercel per aver pubblicato il loro [Virtual Event Starter Kit](https://vercel.com/virtual-event-starter-kit), su cui è stato costruito il sito della conferenza, e a [Lee Robinson](https://twitter.com/leeerob) e [Delba de Oliveira](https://twitter.com/delba_oliveira) per aver condiviso la loro esperienza nell'organizzazione di Next.js Conf.

Grazie a [Leah Silber](https://twitter.com/wifelette) per aver condiviso la sua esperienza nell'organizzazione di conferenze, gli insegnamenti tratti dall'organizzazione di [RustConf](https://rustconf.com/) e per il suo libro [Event Driven](https://leanpub.com/eventdriven/) e i consigli che contiene per organizzare conferenze.

Grazie a [Kevin Lewis](https://twitter.com/_phzn) e [Rachel Nabors](https://twitter.com/rachelnabors) per aver condiviso la loro esperienza nell'organizzazione di Women of React Conf.

Grazie a [Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic) e [Shaundai Person](https://twitter.com/shaundai) per i loro consigli e le loro idee durante la pianificazione.

Grazie a [Dan Lebowitz](https://twitter.com/lebo) per l'aiuto nella progettazione e nella costruzione del sito e dei biglietti della conferenza.

Grazie a Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman e altri del team Facebook Video Productions per aver registrato i video della Keynote e dei talk dei dipendenti Meta.

Grazie al nostro partner HitPlay per aver aiutato a organizzare la conferenza, montato tutti i video dello stream, tradotto tutti i talk e moderato il Discord in più lingue.

Infine, grazie a tutti i nostri partecipanti per aver reso questa una grande React Conf!
