---
id: hooks-intro
title: Introduzione agli Hooks
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

Gli *Hooks* sono stati aggiunti in React 16.8. Ti permettono di utilizzare `state` ed altre funzioni di React senza dover scrivere una classe.

```js{4,5}
import React, { useState } from 'react';

function Esempio() {
  // Dichiara una nuova variable di stato, che chiameremo "contatore"
  const [contatore, setContatore] = useState(0);

  return (
    <div>
      <p>Hai cliccato {contatore} volte</p>
      <button onClick={() => setContatore(contatore + 1)}>
        Cliccami
      </button>
    </div>
  );
}
```

Questa nuova funzione `useState` è il primo "Hook" che impareremo, l'esempio appena visto è solo un assaggio. Non preoccuparti se ti pare non abbia molto senso per il momento!

**Puoi incominciare a saperne di più riguardo agli Hooks [nella pagina successiva](/docs/hooks-overview.html).** In questa pagina, continueremo a spiegare perché abbiamo introdotto gli Hooks in React e come possono aiutarti a sviluppare ottime applicazioni.

>Nota
>
<<<<<<< HEAD
>React 16.8.0 è la prima versione che supporta gli Hooks. Durante l'upgrade, non dimenticare di aggiornare tutti i pacchetti, incluso React DOM. 
>React Native supporta gli Hooks a partire dalla [release 0.59 di React Native](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059).
=======
>React 16.8.0 is the first release to support Hooks. When upgrading, don't forget to update all packages, including React DOM.
>React Native has supported Hooks since [the 0.59 release of React Native](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059).
>>>>>>> c1c3d1db304adfa5446accb0312e60d515188414

## Introduzione Video {#video-introduction}

Durante React Conf 2018, Sophie Alpert e Dan Abramov hanno introdotto gli Hooks, seguiti da Ryan Florence che ha dimostrato come rifattorizzare una applicazione utilizzandoli. Eccoti il video:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Retrocompatibili {#no-breaking-changes}

Prima di continuare, ricorda che gli Hooks sono:

* **Completamente facoltativi.** Puoi provare ad usare gli Hooks in pochi componenti senza dover riscrivere alcun codice esistente. Non devi per forza imparare o utilizzare gli Hooks adesso se non ti va.
* **100% retrocompatibili.** Gli Hooks non contengono alcun cambiamento che possa rompere funzionalità esistenti.
* **Disponibili ora.** Gli Hooks sono disponibili a partire dalla release v16.8.0.

**Non esiste alcun piano per la rimozione delle classi da React.** Puoi leggere di più riguardo alla strategia di adozione graduale degli Hooks nella [sezione in basso](#gradual-adoption-strategy) in questa pagina.

**Gli Hooks non cambiano la tua conoscenza dei concetti di React.** Invece, gli Hooks offrono un accesso più diretto alle API dei concetti React che conosci già: props, state, context, refs, e lifecycle. Come mostreremo di seguito, gli Hooks offrono anche un nuovo potente modo per combinarli.

**Se ti interessa soltanto imparare gli Hooks, puoi [passare direttamente all pagina successiva!](/docs/hooks-overview.html)** Continua a leggere se invece vuoi saperne di più riguardo alle motivazioni dietro l'introduzione degli Hooks, oltre a capire come possiamo cominciare ad utilizzarli senza dover riscrivere le nostre applicazioni.

## Motivazioni {#motivation}

Gli Hooks risolvono un'ampia varietà di problemi che sembrano disconnessi tra loro in React. Problemi che abbiamo incontrato in oltre cinque anni di scrittura e manutenzione di decine di migliaia di componenti. Se stai imparando React, se lo usi quotidianamente o anche se preferisci una libreria diversa che ha un modello simile basato sui componenti, riconoscerai alcuni di questi problemi.

### È difficile riutilizzare logica dipendente dallo stato in componenti diversi {#its-hard-to-reuse-stateful-logic-between-components}

React non offre un modo per "collegare" comportamenti riutilizzabili ad un componente (per esempio, connetterlo ad uno store). Se hai acquisito un po' di esperienza in React, sarai a conoscenza di concetti come [render props](/docs/render-props.html) e [componenti di ordine superiore](/docs/higher-order-components.html) che provano a risolvere questo problema. Tuttavia, questi patterns ti richiedono di ristrutturare i tuoi componenti quando vuoi utilizzarli, il che può essere difficile oltre a rendere il codice più difficile da seguire. Se osservi una tipica applicazione React usando React DevTools, noterai molto probabilmente un "wrapper hell" di componenti circondato da livelli di providers, consumers, componenti di ordine superiore, render props, ed altre astrazioni. Anche se possiamo [filtrarli in DevTools](https://github.com/facebook/react-devtools/pull/503), il problema principale resta: React ha bisogno di una migliore primitiva per condividere logica basata sullo stato (stateful).

Con gli Hooks, puoi estrarre logica stateful da un componente così da renderla testabile in modo indipendente e riutilizzabile. **Gli Hooks ti permettono di riutilizzare logica stateful senza dover cambiare la tua gerarchia dei componenti.** Ciò rende facile la condivisione degli Hooks tra vari componenti o con la comunità.

Ne discuteremo più in dettaglio nella sezione [Hooks Personalizzati](/docs/hooks-custom.html).

### Componenti complessi diventano difficili da capire {#complex-components-become-hard-to-understand}

Ci siamo ritrovati più volte a dover mantenere componenti che sono passati dall'essere semplici fino a crescere in un groviglio di logica stateful ed effetti collaterali. Ogni metodo di lifecycle spesso contiene un mix di logica non correlata. Per esempio, i componenti potrebbero richiamare dati da qualche API in `componentDidMount` e `componentDidUpdate`. Comunque, lo stesso metodo `componentDidMount` può contenere anche logica per l'impostazione di event listeners, con le relative operazioni di pulizia eseguite in `componentWillUnmount`. Parti di codice correlate e che generalmente cambiano allo stesso tempo finiscono per essere divise perché abbiamo codice completamente non correlato all'interno dello stesso metodo. Ciò rende troppo semplice l'introduzione di bugs ed inconsistenze.

In molti casi non è possibile suddividere questi componenti in altri più piccoli in quanto la logica stateful è dappertutto. È difficile anche testare questi componenti. Ecco perché molti preferiscono utilizzare una libreria di gestione dello stato separata. Comunque, ciò spesso introduce troppa astrazione, richiede di saltare da un file all'altro frequentemente e rende la riutilizzazione dei componenti più difficile.

Per risolvere questo problema, **gli Hooks ti permettono di dividere un componente in funzioni più piccole basate sui pezzi che sono correlati (quali una sottoscrizione ad un particolare evento o la richiesta di dati)**, piuttosto che forzare una suddivisione basata sui metodi di lifecycle. Puoi anche decidere di gestire lo stato del tuo componente con un reducer per renderlo più prevedibile.

Ne parleremo più in dettaglio nella sezione [Usare l'Hook Effect](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Le classi confondono sia le persone che le macchine {#classes-confuse-both-people-and-machines}

<<<<<<< HEAD
Oltre a rendere il riutilizzo del codice e la sua organizzazione più difficile, abbiamo notato che le classi costituiscono una grande barriera per l'apprendimento di React. Devi sapere come `this` funziona in JavaScript, il che è molto diverso da come funziona nella maggioranza dei linguaggi. Senza l'utilizzo di [proposte di sintassi](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/) ancora instabili, il codice è molto verboso. Le persone possono capire perfettamente le props, lo state ed il flusso dati top-down, ma ritrovarsi ad avere difficoltà con le classi. La distinzione tra funzioni e componenti classe in React e quando usare l'una o l'altra alternativa causa spesso disaccordi anche tra gli sviluppatori React più esperti.
=======
In addition to making code reuse and code organization more difficult, we've found that classes can be a large barrier to learning React. You have to understand how `this` works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers. Without [ES2022 public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_instance_fields), the code is very verbose. People can understand props, state, and top-down data flow perfectly well but still struggle with classes. The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.
>>>>>>> c1c3d1db304adfa5446accb0312e60d515188414

Inoltre, React è in uso da circa cinque anni e vogliamo fare in modo che resti rilevante anche per i prossimi cinque anni. Così come [Svelte](https://svelte.dev/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), ed altri dimostrano, [la compilazione ahead-of-time](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) dei componenti ha molto potenziale. Specialmente se non è limitata ai templates. Recentemente, abbiamo sperimentato con il [component folding](https://github.com/facebook/react/issues/7323) utilizzando [Prepack](https://prepack.io/) ed abbiamo ottenuto dei risultati preliminari molto promettenti. Comunque, abbiamo trovato che i componenti classe possono incoraggiare l'uso di patterns non intenzionali che possono invalidare queste ottimizzazioni facendole ricadere su percorsi più lenti. Le classi presentano problemi anche con gli strumenti ad oggi disponibili. Per esempio, non vengono minificate molto bene e rendono l'hot reloading ("caricamento a caldo") inaffidabile. Vogliamo presentare una API che può mantenere il codice sul percorso ottimizzabile.

Per risolvere questi problemi, **gli Hooks ti permettono di utilizzare più funzioni di React senza dover ricorrere alle classi.** Concettualmente, i componenti React sono sempre stati più vicini alle funzioni. Gli Hooks abbracciano le funzioni, senza però sacrificare lo spirito pratico di React. Gli Hooks offrono accesso a vie di uscita imperative e non ti richiedono d'imparare complesse tecniche di programmazione funzionale o reattive.

>Esempi
>
>[Panoramica sugli Hooks](/docs/hooks-overview.html) è un buon punto di partenza per imparare gli Hooks.

## Strategie di Adozione Graduale {#gradual-adoption-strategy}

>**TLDR: Non abbiamo piani per rimuovere le classi da React.**

Sappiamo che gli sviluppatori React sono focalizzati allo sviluppo di prodotti e non hanno tempo per osservare ogni nuova API appena rilasciata. Gli Hooks sono molto nuovi e potrebbe essere meglio aspettare più esempi e tutorials prima di considerarne l'apprendimento o l'adozione.

<<<<<<< HEAD
Sappiamo anche che la barra per aggiungere una nuova primitiva in React è estremamente alta. Per i lettori più curiosi, abbiamo preparato una [RFC dettagliata](https://github.com/reactjs/rfcs/pull/68) che spiega in dettaglio le motivazioni ed offre una prospettiva aggiuntiva riguardo le decisioni di design oltre riferimenti ad opere precedenti correlate.
=======
We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a [detailed RFC](https://github.com/reactjs/rfcs/pull/68) that dives into the motivation with more details, and provides extra perspective on the specific design decisions and related prior art.
>>>>>>> c1c3d1db304adfa5446accb0312e60d515188414

**È importante notare che gli Hooks funzionano a fianco al codice esistente, puoi quindi adottarli in modo graduale.** Non c'è fretta nella migrazione agli Hooks. Raccomandiamo di evitare "grandi riscritture", specialmente per componenti classe complessi già esistenti. "Pensare in Hooks" richiede un po' di cambiamenti mentali. Nella nostra esperienza, è meglio far pratica partendo da componenti nuovi e non critici, assicurandosi che tutti i membri del tuo team siano a proprio agio. Dopo che hai avuto l'opportunità di provare gli Hooks, [inviaci pure un feedback](https://github.com/facebook/react/issues/new), positivo o negativo.

Vogliamo far sì che gli Hooks coprano tutti i casi d'uso delle classi, tuttavia **continueremo a supportare i componenti classe per il futuro prevedibile.** In Facebook, abbiamo decine di migliaia di componenti scritti come classi, non abbiamo assolutamente alcun piano per riscriverli. Piuttosto, stiamo cominciando ad utilizzare gli Hooks nel nuovo codice a fianco al codice scritto usando le classi.

## Domande Frequenti {#frequently-asked-questions}

Abbiamo preparato una pagina [FAQ sugli Hooks](/docs/hooks-faq.html) che risponde alle domande più frequenti riguardo agli Hooks.

## Passi Successivi {#next-steps}

Alla fine di questa pagina, dovresti avere un'idea dei problemi che gli Hooks cercano di risolvere, anche se molti dettagli ti sembrano probabilmente non molto chiari. Non preoccuparti! **Andiamo alla [pagina successiva](/docs/hooks-overview.html) dove incominceremo ad imparare gli Hooks con esempi.**
