---
title: "React Compiler: rilascio Beta"
author: Lauren Tan
date: 2024/10/21
description: A React Conf 2024 abbiamo annunciato il rilascio sperimentale di React Compiler, uno strumento build-time che ottimizza la tua app React tramite memorizzazione automatica. In questo post condividiamo i prossimi passi per l'open source e i progressi sul compiler.
translationStatus: ai-draft
---

21 ottobre 2024 di [Lauren Tan](https://twitter.com/potetotes).

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2024/10/21/react-compiler-beta-release.md).

</Note>

<Note>

### React Compiler è ora stabile! {/*react-compiler-is-now-in-rc*/}

Consulta il [post di rilascio stabile](/blog/2025/10/07/react-compiler-1) per i dettagli.

</Note>

<Intro>

Il team React è entusiasta di condividere nuovi aggiornamenti:

</Intro>

1. Pubblichiamo oggi React Compiler Beta, così early adopter e maintainer di librerie possono provarlo e fornire feedback.
2. Supportiamo ufficialmente React Compiler per app su React 17+, tramite il pacchetto opzionale `react-compiler-runtime`.
3. Apriamo l'iscrizione pubblica al [React Compiler Working Group](https://github.com/reactwg/react-compiler) per preparare la community all'adozione graduale del compiler.

---

A [React Conf 2024](/blog/2024/05/22/react-conf-2024-recap), abbiamo annunciato il rilascio sperimentale di React Compiler, uno strumento build-time che ottimizza la tua app React tramite memorizzazione automatica. [Puoi trovare un'introduzione a React Compiler qui](/learn/react-compiler).

Dal primo rilascio, abbiamo corretto numerosi bug segnalati dalla community React, ricevuto diversi fix e contributi di alta qualità[^1] al compiler, reso il compiler più resiliente alla vasta diversità di pattern JavaScript e continuato a distribuirlo più ampiamente in Meta.

In questo post vogliamo condividere i prossimi passi per React Compiler.

## Prova React Compiler Beta oggi {/*try-react-compiler-beta-today*/}

A [React India 2024](https://www.youtube.com/watch?v=qd5yk2gxbtg), abbiamo condiviso un aggiornamento su React Compiler. Oggi siamo entusiasti di annunciare un nuovo rilascio Beta di React Compiler e del plugin ESLint. Le nuove beta vengono pubblicate su npm con il tag `@beta`.

Per installare React Compiler Beta:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Oppure, se usi Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Puoi guardare il talk di [Sathya Gunasekaran](https://twitter.com/_gsathya) a React India qui:

<YouTubeIframe src="https://www.youtube.com/embed/qd5yk2gxbtg" />

## Consigliamo a tutti di usare il linter di React Compiler oggi {/*we-recommend-everyone-use-the-react-compiler-linter-today*/}

Il plugin ESLint di React Compiler aiuta gli sviluppatori a identificare e correggere proattivamente le violazioni delle [Rules of React](/reference/rules). **Consigliamo fortemente a tutti di usare il linter oggi**. Il linter non richiede che tu abbia il compiler installato, quindi puoi usarlo in modo indipendente, anche se non sei pronto a provare il compiler.

Per installare solo il linter:

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Oppure, se usi Yarn:

<TerminalBlock>
yarn add -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Dopo l'installazione puoi abilitare il linter [aggiungendolo alla configurazione ESLint](/learn/react-compiler/installation#eslint-integration). Usare il linter aiuta a identificare le violazioni delle Rules of React, rendendo più semplice adottare il compiler quando sarà completamente rilasciato.

## Compatibilità con versioni precedenti {/*backwards-compatibility*/}

React Compiler produce codice che dipende da API runtime aggiunte in React 19, ma da allora abbiamo aggiunto supporto per far funzionare il compiler anche con React 17 e 18. Se non sei ancora su React 19, nel rilascio Beta puoi ora provare React Compiler specificando un `target` minimo nella configurazione del compiler e aggiungendo `react-compiler-runtime` come dipendenza. [Puoi trovare la documentazione qui](/reference/react-compiler/configuration#react-17-18).

## Usare React Compiler nelle librerie {/*using-react-compiler-in-libraries*/}

Il nostro rilascio iniziale era focalizzato sull'identificare problemi principali nell'uso del compiler nelle applicazioni. Abbiamo ricevuto ottimo feedback e abbiamo migliorato sostanzialmente il compiler da allora. Siamo ora pronti per un feedback ampio dalla community e per gli autori di librerie che provino il compiler per migliorare performance e developer experience nella manutenzione della libreria.

React Compiler può anche essere usato per compilare librerie. Poiché React Compiler deve girare sul codice sorgente originale prima di qualsiasi trasformazione, non è possibile che la pipeline di build di un'applicazione compili le librerie che usa. Quindi, la nostra raccomandazione è che i maintainer di librerie compilino e testino indipendentemente le proprie librerie con il compiler e distribuiscano codice compilato su npm.

Poiché il tuo codice è pre-compilato, gli utenti della tua libreria non dovranno avere il compiler abilitato per beneficiare della memorizzazione automatica applicata alla libreria. Se la tua libreria punta ad app non ancora su React 19, specifica un `target` minimo e aggiungi `react-compiler-runtime` come dipendenza diretta. Il pacchetto runtime userà l'implementazione corretta delle API a seconda della versione dell'applicazione e polyfill le API mancanti se necessario.

[Puoi trovare maggiori documenti qui.](/reference/react-compiler/compiling-libraries)

## Apertura del React Compiler Working Group a tutti {/*opening-up-react-compiler-working-group-to-everyone*/}

Abbiamo annunciato in precedenza il [React Compiler Working Group](https://github.com/reactwg/react-compiler) su invito a React Conf per fornire feedback, porre domande e collaborare sul rilascio sperimentale del compiler.

Da oggi, insieme al rilascio Beta di React Compiler, apriamo l'iscrizione al Working Group a tutti. L'obiettivo del React Compiler Working Group è preparare l'ecosistema per un'adozione graduale e fluida di React Compiler da parte di applicazioni e librerie esistenti. Continua a segnalare bug nel [repo React](https://github.com/react/react), ma lascia feedback, fai domande o condividi idee nel [forum di discussione del Working Group](https://github.com/reactwg/react-compiler/discussions).

Il core team userà anche il repo delle discussioni per condividere i risultati della ricerca. Man mano che il rilascio Stable si avvicina, qualsiasi informazione importante verrà pubblicata anche su questo forum.

## React Compiler in Meta {/*react-compiler-at-meta*/}

A [React Conf](/blog/2024/05/22/react-conf-2024-recap), abbiamo condiviso che il rollout del compiler su Quest Store e Instagram è andato a buon fine. Da allora, abbiamo distribuito React Compiler su diversi altri grandi web app in Meta, inclusi [Facebook](https://www.facebook.com) e [Threads](https://www.threads.net). Questo significa che se hai usato una di queste app di recente, la tua esperienza potrebbe essere stata alimentata dal compiler. Siamo riusciti a integrare queste app nel compiler con poche modifiche al codice, in un monorepo con più di 100.000 componenti React.

Abbiamo visto miglioramenti significativi delle performance su tutte queste app. Man mano che distribuiamo, continuiamo a vedere risultati dell'ordine di [i guadagni che abbiamo condiviso in precedenza a ReactConf](https://youtu.be/lyEKhv8-3n0?t=3223). Queste app erano già state pesantemente ottimizzate a mano da ingegneri Meta ed esperti React nel corso degli anni, quindi anche miglioramenti dell'ordine di qualche percento sono una grande vittoria per noi.

Ci aspettavamo anche guadagni di produttività degli sviluppatori da React Compiler. Per misurarlo, abbiamo collaborato con i nostri partner data science in Meta[^2] per condurre un'analisi statistica approfondita dell'impatto della memorizzazione manuale sulla produttività. Prima del rollout del compiler in Meta, abbiamo scoperto che solo circa l'8% delle pull request React usava memorizzazione manuale e che queste pull request richiedevano il 31-46% in più di tempo per essere scritte[^3]. Questo ha confermato la nostra intuizione che la memorizzazione manuale introduce overhead cognitivo, e prevediamo che React Compiler porterà a scrittura e revisione del codice più efficienti. In particolare, React Compiler assicura anche che *tutto* il codice sia memorizzato per impostazione predefinita, non solo l'8% (nel nostro caso) in cui gli sviluppatori applicano esplicitamente la memorizzazione.

## Roadmap verso Stable {/*roadmap-to-stable*/}

*Questa non è una roadmap definitiva ed è soggetta a modifiche.*

Intendiamo distribuire un Release Candidate del compiler nel prossimo futuro dopo il rilascio Beta, quando la maggior parte di app e librerie che seguono le Rules of React avrà dimostrato di funzionare bene con il compiler. Dopo un periodo di feedback finale dalla community, prevediamo un rilascio Stable per il compiler. Il rilascio Stable segnerà l'inizio di una nuova base per React, e tutte le app e librerie saranno fortemente consigliate a usare il compiler e il plugin ESLint.

* ✅ Experimental: rilasciato a React Conf 2024, principalmente per feedback da early adopter.
* ✅ Public Beta: disponibile oggi, per feedback dalla community più ampia.
* 🚧 Release Candidate (RC): React Compiler funziona per la maggior parte di app e librerie che seguono le regole senza problemi.
* 🚧 General Availability: dopo il periodo di feedback finale dalla community.

Questi rilasci includono anche il plugin ESLint del compiler, che espone diagnostiche analizzate staticamente dal compiler. Prevediamo di combinare l'esistente plugin eslint-plugin-react-hooks con il plugin ESLint del compiler, così serve installare un solo plugin.

Dopo Stable, prevediamo di aggiungere altre ottimizzazioni e miglioramenti al compiler. Questo include sia miglioramenti continui alla memorizzazione automatica sia nuove ottimizzazioni, con modifiche minime o nulle al codice di prodotto. L'upgrade a ogni nuovo rilascio del compiler è pensato per essere semplice, e ogni upgrade continuerà a migliorare le performance e ad aggiungere una gestione migliore di pattern JavaScript e React diversi.

Durante questo processo, prevediamo anche di prototipare un'estensione IDE per React. È ancora molto presto nella ricerca, quindi prevediamo di poter condividere più risultati in un futuro post React Labs.

---

Grazie a [Sathya Gunasekaran](https://twitter.com/_gsathya), [Joe Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Alex Taylor](https://github.com/alexmckenley), [Jason Bonta](https://twitter.com/someextent) e [Eli White](https://twitter.com/Eli_White) per la revisione e l'editing di questo post.

---

[^1]: Grazie a [@nikeee](https://github.com/react/react/pulls?q=is%3Apr+author%3Anikeee), [@henryqdineen](https://github.com/react/react/pulls?q=is%3Apr+author%3Ahenryqdineen), [@TrickyPi](https://github.com/react/react/pulls?q=is%3Apr+author%3ATrickyPi) e altri per i loro contributi al compiler.

[^2]: Grazie a [Vaishali Garg](https://www.linkedin.com/in/vaishaligarg09) per aver guidato questo studio su React Compiler in Meta e per la revisione di questo post.

[^3]: Dopo aver controllato per anzianità dell'autore, lunghezza/complessità del diff e altri potenziali fattori confondenti.
