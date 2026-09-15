---
title: Politica di versionamento
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/community/versioning-policy.md).

</Note>

<Intro>

Tutte le build stabili di React passano attraverso un alto livello di testing e seguono il semantic versioning (semver). React offre anche canali di release instabili per incoraggiare feedback anticipati sulle funzionalità sperimentali. Questa pagina descrive cosa puoi aspettarti dalle release di React.

</Intro>

Questa politica di versionamento descrive il nostro approccio ai numeri di versione per pacchetti come `react` e `react-dom`. Per un elenco delle release precedenti, vedi la pagina [Versioni](/versions).

## Release stabili {/*stable-releases*/}

Le release stabili di React (note anche come canale di release "Latest") seguono i principi del [semantic versioning (semver)](https://semver.org/).

Ciò significa che con un numero di versione **x.y.z**:

* Quando rilasciamo **correzioni di bug critici**, facciamo una **patch release** cambiando il numero **z** (es.: da 15.6.2 a 15.6.3).
* Quando rilasciamo **nuove funzionalità** o **correzioni non critiche**, facciamo una **minor release** cambiando il numero **y** (es.: da 15.6.2 a 15.7.0).
* Quando rilasciamo **breaking change**, facciamo una **major release** cambiando il numero **x** (es.: da 15.6.2 a 16.0.0).

Le major release possono anche contenere nuove funzionalità, e qualsiasi release può includere correzioni di bug.

Le minor release sono il tipo di release più comune.

Sappiamo che i nostri utenti continuano a usare vecchie versioni di React in produzione. Se veniamo a conoscenza di una vulnerabilità di sicurezza in React, rilasciamo una correzione backportata per tutte le major version interessate dalla vulnerabilità.

### Breaking changes {/*breaking-changes*/}

Le breaking change sono scomode per tutti, quindi cerchiamo di minimizzare il numero di major release — ad esempio, React 15 è uscito ad aprile 2016, React 16 a settembre 2017 e React 17 a ottobre 2020.

Invece, rilasciamo nuove funzionalità nelle minor release. Ciò significa che le minor release sono spesso più interessanti e coinvolgenti delle major, nonostante il nome modesto.

### Impegno per la stabilità {/*commitment-to-stability*/}

Man mano che cambiamo React nel tempo, cerchiamo di minimizzare lo sforzo richiesto per sfruttare le nuove funzionalità. Quando possibile, manterremo funzionante un'API più vecchia, anche se ciò significa metterla in un pacchetto separato. Ad esempio, [i mixin sono stati sconsigliati per anni](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) ma sono supportati ancora oggi [tramite create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) e molte codebase continuano a usarli in codice legacy stabile.

Oltre un milione di sviluppatori usano React, mantenendo collettivamente milioni di componenti. Il codebase di Facebook da solo ha oltre 50.000 componenti React. Ciò significa che dobbiamo rendere il più semplice possibile l'aggiornamento a nuove versioni di React; se facessimo grandi cambiamenti senza un percorso di migrazione, le persone resterebbero bloccate su vecchie versioni. Testiamo questi percorsi di aggiornamento su Facebook stesso — se il nostro team di meno di 10 persone può aggiornare da solo oltre 50.000 componenti, speriamo che l'aggiornamento sia gestibile per chiunque usi React. In molti casi, scriviamo [script automatizzati](https://github.com/reactjs/react-codemod) per aggiornare la sintassi dei componenti, che poi includiamo nella release open source per tutti.

### Aggiornamenti graduali tramite warning {/*gradual-upgrades-via-warnings*/}

Le build di sviluppo di React includono molti warning utili. Quando possibile, aggiungiamo warning in preparazione per future breaking change. In questo modo, se la tua app non ha warning sull'ultima release, sarà compatibile con la prossima major release. Questo ti permette di aggiornare le tue app un componente alla volta.

I warning di sviluppo non influenzano il comportamento runtime della tua app. In questo modo, puoi essere sicuro che la tua app si comporterà allo stesso modo tra le build di sviluppo e produzione — le uniche differenze sono che la build di produzione non logga i warning ed è più efficiente. (Se mai notassi il contrario, per favore apri un'issue.)

### Cosa conta come breaking change? {/*what-counts-as-a-breaking-change*/}

In generale, *non* incrementiamo il numero di major version per cambiamenti a:

* **Warning di sviluppo.** Poiché non influenzano il comportamento in produzione, possiamo aggiungere nuovi warning o modificare quelli esistenti tra major version. In effetti, questo è ciò che ci permette di avvisare in modo affidabile sulle prossime breaking change.
* **API che iniziano con `unstable_`.** Sono fornite come funzionalità sperimentali le cui API non sono ancora stabili. Rilasciandole con il prefisso `unstable_`, possiamo iterare più velocemente e arrivare prima a un'API stabile.
* **Versioni Alpha e Canary di React.** Forniamo versioni alpha di React come modo per testare nuove funzionalità in anticipo, ma abbiamo bisogno della flessibilità di fare cambiamenti in base a ciò che impariamo nel periodo alpha. Se usi queste versioni, nota che le API possono cambiare prima della release stabile.
* **API non documentate e strutture dati interne.** Se accedi a nomi di proprietà interne come `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` o `__reactInternalInstance$uk43rzhitjg`, non c'è garanzia. Sei solo.

Questa politica è pensata per essere pragmatica: certamente, non vogliamo causarti mal di testa. Se incrementassimo la major version per tutti questi cambiamenti, finiremmo per rilasciare più major version e causare alla fine più dolore di versionamento alla community. Significherebbe anche che non potremmo progredire nel migliorare React alla velocità che vorremmo.

Detto ciò, se ci aspettiamo che un cambiamento in questo elenco causi problemi diffusi nella community, faremo comunque del nostro meglio per fornire un percorso di migrazione graduale.

### Se una minor release non include nuove funzionalità, perché non è una patch? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

È possibile che una minor release non includa nuove funzionalità. [Questo è consentito dal semver](https://semver.org/#spec-item-7), che afferma che **"[a minor version] MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes."**

Tuttavia, solleva la domanda del perché queste release non siano versionate come patch.

La risposta è che qualsiasi cambiamento a React (o altro software) comporta un certo rischio di rompersi in modi inaspettati. Immagina uno scenario in cui una patch release che corregge un bug introduce accidentalmente un altro bug. Questo non sarebbe solo dirompente per gli sviluppatori, ma danneggerebbe anche la loro fiducia nelle future patch release. È particolarmente deplorevole se la correzione originale è per un bug raramente incontrato nella pratica.

Abbiamo un buon storico nel mantenere le release di React prive di bug, ma le patch release hanno una barra ancora più alta per l'affidabilità perché la maggior parte degli sviluppatori assume di poterle adottare senza conseguenze negative.

Per questi motivi, riserviamo le patch release solo per i bug più critici e le vulnerabilità di sicurezza.

Se una release include cambiamenti non essenziali — come rifattorizzazioni interne, cambiamenti ai dettagli di implementazione, miglioramenti delle performance o correzioni minori di bug — incrementeremo la minor version anche quando non ci sono nuove funzionalità.

## Tutti i canali di release {/*all-release-channels*/}

React si affida a una fiorente community open source per segnalare bug, aprire pull request e [inviare RFC](https://github.com/reactjs/rfcs). Per incoraggiare il feedback, a volte condividiamo build speciali di React che includono funzionalità non ancora rilasciate.

<Note>

Questa sezione sarà più rilevante per gli sviluppatori che lavorano su framework, librerie o strumenti per sviluppatori. Gli sviluppatori che usano React principalmente per costruire applicazioni user-facing non dovrebbero doversi preoccupare dei nostri canali prerelease.

</Note>

Ciascuno dei canali di release di React è pensato per un caso d'uso distinto:

- [**Latest**](#latest-channel) è per le release stabili di React con semver. È ciò che ottieni quando installi React da npm. Questo è il canale che stai già usando oggi. **Le applicazioni user-facing che consumano React direttamente usano questo canale.**
- [**Canary**](#canary-channel) segue il branch main del repository sorgente di React. Consideralo come release candidate per la prossima release semver. **[Framework o altri setup curati possono scegliere di usare questo canale con una versione di React fissata.](/blog/2023/05/03/react-canaries) Puoi anche usare le Canary per integration testing tra React e progetti di terze parti.**
- [**Experimental**](#experimental-channel) include API e funzionalità sperimentali non disponibili nelle release stabili. Seguono anche il branch main, ma con feature flag aggiuntive attivate. Usalo per provare funzionalità imminenti prima che vengano rilasciate.

Tutte le release sono pubblicate su npm, ma solo Latest usa il semantic versioning. Le prerelease (quelle nei canali Canary e Experimental) hanno versioni generate da un hash del loro contenuto e della data del commit, es. `18.3.0-canary-388686f29-20230503` per Canary e `0.0.0-experimental-388686f29-20230503` per Experimental.

**Sia i canali Latest che Canary sono ufficialmente supportati per applicazioni user-facing, ma con aspettative diverse**:

* Le release Latest seguono il modello semver tradizionale.
* Le release Canary [devono essere fissate](/blog/2023/05/03/react-canaries) e possono includere breaking change. Esistono per setup curati (come i framework) che vogliono rilasciare gradualmente nuove funzionalità e correzioni di bug di React secondo il proprio calendario di release.

Le release Experimental sono fornite solo a scopo di testing, e non garantiamo che il comportamento non cambi tra release. Non seguono il protocollo semver che usiamo per le release da Latest.

Pubblicando le prerelease sullo stesso registry che usiamo per le release stabili, possiamo sfruttare i molti strumenti che supportano il workflow npm, come [unpkg](https://unpkg.com) e [CodeSandbox](https://codesandbox.io).

### Canale Latest {/*latest-channel*/}

Latest è il canale usato per le release stabili di React. Corrisponde al tag `latest` su npm. È il canale raccomandato per tutte le app React distribuite a utenti reali.

**Se non sei sicuro di quale canale usare, è Latest.** Se usi React direttamente, è ciò che stai già usando. Puoi aspettarti che gli aggiornamenti a Latest siano estremamente stabili. Le versioni seguono lo schema di semantic versioning, come [descritto in precedenza.](#stable-releases)

### Canale Canary {/*canary-channel*/}

Il canale Canary è un canale prerelease che segue il branch main del repository React. Usiamo le prerelease nel canale Canary come release candidate per il canale Latest. Puoi pensare a Canary come un superset di Latest aggiornato più frequentemente.

Il grado di cambiamento tra la release Canary più recente e la release Latest più recente è approssimativamente lo stesso che troveresti tra due minor release semver. Tuttavia, **il canale Canary non rispetta il semantic versioning.** Dovresti aspettarti occasionali breaking change tra release successive nel canale Canary.

**Non usare le prerelease in applicazioni user-facing direttamente a meno che non segui il [workflow Canary](/blog/2023/05/03/react-canaries).**

Le release in Canary sono pubblicate con il tag `canary` su npm. Le versioni sono generate da un hash del contenuto della build e della data del commit, es. `18.3.0-canary-388686f29-20230503`.

#### Usare il canale Canary per integration testing {/*using-the-canary-channel-for-integration-testing*/}

Il canale Canary supporta anche l'integration testing tra React e altri progetti.

Tutti i cambiamenti a React passano attraverso un testing interno estensivo prima di essere rilasciati al pubblico. Tuttavia, ci sono innumerevoli ambienti e configurazioni usate in tutto l'ecosistema React, e non è possibile per noi testare contro ognuno.

Se sei l'autore di un framework React, libreria, strumento per sviluppatori o progetto simile di tipo infrastrutturale, puoi aiutarci a mantenere React stabile per i tuoi utenti e l'intera community React eseguendo periodicamente la tua test suite contro i cambiamenti più recenti. Se sei interessato, segui questi passaggi:

- Configura un cron job usando la tua piattaforma di continuous integration preferita. I cron job sono supportati sia da [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) che da [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- Nel cron job, aggiorna i tuoi pacchetti React alla release React più recente nel canale Canary, usando il tag `canary` su npm. Con la CLI npm:

  ```console
  npm update react@canary react-dom@canary
  ```

  Oppure yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Esegui la tua test suite contro i pacchetti aggiornati.
- Se tutto passa, ottimo! Puoi aspettarti che il tuo progetto funzionerà con la prossima minor release di React.
- Se qualcosa si rompe inaspettatamente, faccelo sapere [aprendo un'issue](https://github.com/react/react/issues).

Un progetto che usa questo workflow è Next.js. Puoi fare riferimento alla loro [configurazione CircleCI](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) come esempio.

### Canale Experimental {/*experimental-channel*/}

Come Canary, il canale Experimental è un canale prerelease che segue il branch main del repository React. A differenza di Canary, le release Experimental includono funzionalità e API aggiuntive non pronte per una diffusione più ampia.

Di solito, un aggiornamento a Canary è accompagnato da un corrispondente aggiornamento a Experimental. Sono basati sulla stessa revisione sorgente, ma costruiti con un set diverso di feature flag.

Le release Experimental possono essere significativamente diverse dalle release su Canary e Latest. **Non usare le release Experimental in applicazioni user-facing.** Dovresti aspettarti frequenti breaking change tra release nel canale Experimental.

Le release in Experimental sono pubblicate con il tag `experimental` su npm. Le versioni sono generate da un hash del contenuto della build e della data del commit, es. `0.0.0-experimental-68053d940-20210623`.

#### Cosa entra in una release experimental? {/*what-goes-into-an-experimental-release*/}

Le funzionalità experimental sono quelle non pronte per essere rilasciate al pubblico più ampio e possono cambiare drasticamente prima di essere finalizzate. Alcuni esperimenti potrebbero non essere mai finalizzati — il motivo per cui abbiamo esperimenti è testare la fattibilità di cambiamenti proposti.

Ad esempio, se il canale Experimental fosse esistito quando abbiamo annunciato gli Hooks, avremmo rilasciato gli Hooks nel canale Experimental settimane prima che fossero disponibili in Latest.

Potresti trovare utile eseguire integration test contro Experimental. Dipende da te. Tuttavia, tieni presente che Experimental è ancora meno stabile di Canary. **Non garantiamo alcuna stabilità tra release Experimental.**

#### Come posso saperne di più sulle funzionalità experimental? {/*how-can-i-learn-more-about-experimental-features*/}

Le funzionalità experimental possono essere documentate o meno. Di solito, gli esperimenti non sono documentati finché non sono vicini al rilascio in Canary o Latest.

Se una funzionalità non è documentata, può essere accompagnata da un [RFC](https://github.com/reactjs/rfcs).

Pubblicheremo sul [blog React](/blog) quando saremo pronti ad annunciare nuovi esperimenti, ma ciò non significa che pubblicheremo ogni esperimento.

Puoi sempre fare riferimento alla [cronologia](https://github.com/react/react/commits/main) del nostro repository GitHub pubblico per un elenco completo dei cambiamenti.
