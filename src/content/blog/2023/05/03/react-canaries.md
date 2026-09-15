---
title: "React Canaries: rollout incrementale delle funzionalità fuori da Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbåge, and Andrew Clark
date: 2023/05/03
description: Vorremmo offrire alla community React l'opzione di adottare singole nuove funzionalità non appena il loro design è quasi definitivo, prima che vengano rilasciate in una versione stabile — in modo simile a come Meta usa da tempo internamente versioni bleeding-edge di React. Stiamo introducendo un nuovo [canale di release Canary](/community/versioning-policy#canary-channel) ufficialmente supportato. Permette a setup curati come i framework di disaccoppiare l'adozione delle singole funzionalità React dal calendario di release di React.
translationStatus: ai-draft
---

3 maggio 2023 by [Dan Abramov](https://bsky.app/profile/danabra.mov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Andrew Clark](https://twitter.com/acdlite)

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2023/05/03/react-canaries.md).

</Note>

<Intro>

Vorremmo offrire alla community React l'opzione di adottare singole nuove funzionalità non appena il loro design è quasi definitivo, prima che vengano rilasciate in una versione stabile — in modo simile a come Meta usa da tempo internamente versioni bleeding-edge di React. Stiamo introducendo un nuovo [canale di release Canary](/community/versioning-policy#canary-channel) ufficialmente supportato. Permette a setup curati come i framework di disaccoppiare l'adozione delle singole funzionalità React dal calendario di release di React.

</Intro>

---

## tl;dr {/*tldr*/}

* Stiamo introducendo un [canale di release Canary](/community/versioning-policy#canary-channel) ufficialmente supportato per React. Poiché è ufficialmente supportato, se finiscono regressioni le tratteremo con urgenza simile ai bug nelle release stabili.
* Le Canary ti permettono di iniziare a usare singole nuove funzionalità React prima che arrivino nelle release semver-stabili.
* A differenza del canale [Experimental](/community/versioning-policy#experimental-channel), le React Canaries includono solo funzionalità che riteniamo ragionevolmente pronte per l'adozione. Incoraggiamo i framework a considerare di includere release Canary di React fissate a un commit.
* Annunceremo breaking change e nuove funzionalità sul nostro blog man mano che arrivano nelle release Canary.
* **Come sempre, React continua a seguire semver per ogni release Stable.**

## Come di solito vengono sviluppate le funzionalità React {/*how-react-features-are-usually-developed*/}

Tipicamente, ogni funzionalità React ha attraversato le stesse fasi:

1. Sviluppiamo una versione iniziale e la prefissiamo con `experimental_` o `unstable_`. La funzionalità è disponibile solo nel canale di release `experimental`. A questo punto ci aspettiamo che cambi in modo significativo.
2. Troviamo un team in Meta disposto ad aiutarci a testare la funzionalità e a darci feedback. Questo porta a un giro di modifiche. Man mano che la funzionalità diventa più stabile, lavoriamo con più team in Meta per provarla.
3. Alla fine ci sentiamo sicuri del design. Rimuoviamo il prefisso dal nome dell'API e rendiamo la funzionalità disponibile di default sul branch `main`, che usano la maggior parte dei prodotti Meta. A questo punto qualsiasi team in Meta può usare la funzionalità.
4. Man mano che acquisiamo fiducia nella direzione, pubblichiamo anche un RFC per la nuova funzionalità. A questo punto sappiamo che il design funziona per un'ampia gamma di casi, ma potremmo fare aggiustamenti dell'ultimo minuto.
5. Quando siamo vicini a tagliare una release open source, scriviamo la documentazione per la funzionalità e infine la rilasciamo in una release stabile di React.

Questo playbook funziona bene per la maggior parte delle funzionalità rilasciate finora. Tuttavia, può esserci un divario significativo tra quando la funzionalità è generalmente pronta all'uso (fase 3) e quando viene rilasciata in open source (fase 5).

**Vorremmo offrire alla community React l'opzione di seguire lo stesso approccio di Meta e adottare singole nuove funzionalità prima (non appena diventano disponibili) senza dover aspettare il prossimo ciclo di release di React.**

Come sempre, tutte le funzionalità React finiranno comunque in una release Stable.

## Non possiamo semplicemente fare più minor release? {/*can-we-just-do-more-minor-releases*/}

In generale, *sì*, usiamo le minor release per introdurre nuove funzionalità.

Tuttavia, non è sempre possibile. A volte le nuove funzionalità sono interconnesse con *altre* nuove funzionalità non ancora completamente finite e su cui stiamo ancora iterando attivamente. Non possiamo rilasciarle separatamente perché le loro implementazioni sono collegate. Non possiamo versionarle separatamente perché influenzano gli stessi pacchetti (ad esempio `react` e `react-dom`). E dobbiamo mantenere la possibilità di iterare sui pezzi non pronti senza una raffica di major release, che semver ci obbligherebbe a fare.

In Meta abbiamo risolto questo problema compilando React dal branch `main` e aggiornandolo manualmente a un commit specifico fissato ogni settimana. È anche l'approccio che le release di React Native seguono da diversi anni. Ogni release *stabile* di React Native è fissata a un commit specifico del branch `main` del repository React. Questo permette a React Native di includere bugfix importanti e adottare incrementalmente nuove funzionalità React a livello di framework senza accoppiarsi al calendario globale di release di React.

Vorremmo rendere disponibile questo workflow ad altri framework e setup curati. Ad esempio, permette a un framework *sopra* React di includere una breaking change legata a React *prima* che quella breaking change finisca in una release stabile di React. È particolarmente utile perché alcune breaking change riguardano solo le integrazioni con i framework. Permette a un framework di rilasciare una modifica del genere nella propria minor version senza violare semver.

Le rolling release con il canale Canaries ci permetteranno di avere un feedback loop più stretto e di assicurarci che le nuove funzionalità ricevano test completi nella community. Questo workflow è più vicino a come TC39, il comitato degli standard JavaScript, [gestisce le modifiche in fasi numerate](https://tc39.es/process-document/). Nuove funzionalità React possono essere disponibili nei framework costruiti su React prima che siano in una release stabile di React, proprio come nuove funzionalità JavaScript arrivano nei browser prima di essere ufficialmente ratificate come parte della specifica.

## Perché non usare le release experimental? {/*why-not-use-experimental-releases-instead*/}

Anche se *tecnicamente* puoi usare le [release Experimental](/community/versioning-policy#canary-channel), sconsigliamo di usarle in produzione perché le API experimental possono subire breaking change significative sulla strada verso la stabilizzazione (o possono anche essere rimosse del tutto). Sebbene anche le Canary possano contenere errori (come qualsiasi release), d'ora in poi prevediamo di annunciare sul nostro blog eventuali breaking change significative nelle Canary. Le Canary sono le più vicine al codice che Meta esegue internamente, quindi in generale puoi aspettarti che siano relativamente stabili. Tuttavia, *devi* mantenere la versione fissata e scansionare manualmente il log dei commit su GitHub quando aggiorni tra commit fissati.

**Ci aspettiamo che la maggior parte delle persone che usano React fuori da un setup curato (come un framework) continui a usare le release Stable.** Tuttavia, se stai costruendo un framework, potresti considerare di includere una versione Canary di React fissata a un commit particolare e aggiornarla al tuo ritmo. Il vantaggio è che ti permette di rilasciare singole funzionalità e bugfix React completate prima per i tuoi utenti e secondo il tuo calendario di release, in modo simile a come fa React Native da diversi anni. Lo svantaggio è che ti assumi la responsabilità aggiuntiva di revisionare quali commit React vengono inclusi e di comunicare ai tuoi utenti quali modifiche React sono incluse nelle tue release.

Se sei autore di un framework e vuoi provare questo approccio, contattaci.

## Annunciare in anticipo breaking change e nuove funzionalità {/*announcing-breaking-changes-and-new-features-early*/}

Le release Canary rappresentano la nostra migliore ipotesi su cosa finirà nella prossima release stabile di React in un dato momento.

Tradizionalmente abbiamo annunciato le breaking change solo alla *fine* del ciclo di release (quando facciamo una major release). Ora che le release Canary sono un modo ufficialmente supportato per consumare React, prevediamo di spostarci verso l'annuncio di breaking change e nuove funzionalità significative *non appena arrivano* nelle Canary. Ad esempio, se mergiamo una breaking change che uscirà in una Canary, scriveremo un post sul blog React, inclusi codemod e istruzioni di migrazione se necessario. Poi, se sei autore di un framework che taglia una major release aggiornando la canary React fissata per includere quella modifica, puoi linkare al nostro post del blog dalle tue release note. Infine, quando una major version stabile di React è pronta, linkeremo a quei post già pubblicati, sperando che questo aiuti il nostro team a procedere più velocemente.

Prevediamo di documentare le API man mano che arrivano nelle Canary — anche se queste API non sono ancora disponibili al di fuori di esse. Le API disponibili solo nelle Canary saranno contrassegnate con una nota speciale sulle pagine corrispondenti. Questo includerà API come [`use`](https://github.com/reactjs/rfcs/pull/229) e altre (come `cache` e `createServerContext`) per cui invieremo RFC.

## Le Canary devono essere fissate {/*canaries-must-be-pinned*/}

Se decidi di adottare il workflow Canary per la tua app o framework, assicurati di fissare sempre la versione *esatta* della Canary che stai usando. Poiché le Canary sono pre-release, possono ancora includere breaking change.

## Esempio: React Server Components {/*example-react-server-components*/}

Come [abbiamo annunciato a marzo](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), le convenzioni di React Server Components sono state finalizzate e non ci aspettiamo breaking change significative legate al loro contratto API user-facing. Tuttavia, non possiamo ancora rilasciare il supporto per React Server Components in una versione stabile di React perché stiamo ancora lavorando su diverse funzionalità solo-framework interconnesse (come il [caricamento delle risorse](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) e ci aspettiamo altre breaking change lì.

Questo significa che React Server Components sono pronti per essere adottati dai framework. Tuttavia, fino alla prossima major release di React, l'unico modo per un framework di adottarli è rilasciare una versione Canary di React fissata. (Per evitare di includere due copie di React, i framework che vogliono farlo dovrebbero imporre la risoluzione di `react` e `react-dom` alla Canary fissata che rilasciano con il framework, e spiegarlo ai loro utenti. Come esempio, è quello che fa Next.js App Router.)

## Testare le librerie contro versioni Stable e Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Non ci aspettiamo che gli autori di librerie testino ogni singola release Canary perché sarebbe prohibitivamente difficile. Tuttavia, proprio come quando [abbiamo introdotto per la prima volta i diversi canali pre-release di React tre anni fa](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), incoraggiamo le librerie a eseguire test sia contro l'ultima versione Stable sia contro l'ultima Canary. Se vedi un cambiamento di comportamento non annunciato, segnala un bug nel repository React così possiamo aiutarti a diagnosticarlo. Ci aspettiamo che man mano che questa pratica diventa ampiamente adottata, riduca lo sforzo necessario per aggiornare le librerie a nuove major version di React, perché regressioni accidentali verrebbero trovate non appena arrivano.

<Note>

Strettamente parlando, Canary non è un canale di release *nuovo* — si chiamava Next. Tuttavia, abbiamo deciso di rinominarlo per evitare confusione con Next.js. Lo annunciamo come canale di release *nuovo* per comunicare le nuove aspettative, come il fatto che le Canary sono un modo ufficialmente supportato per usare React.

</Note>

## Le release stabili funzionano come prima {/*stable-releases-work-like-before*/}

Non stiamo introducendo alcuna modifica alle release stabili di React.


