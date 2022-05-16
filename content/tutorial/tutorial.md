---
id: tutorial
title: "Tutorial: Introduzione a React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

Questo tutorial non presuppone alcuna pre-esistente conoscenza di React.

## Prima di Cominciare il Tutorial {#before-we-start-the-tutorial}

Costruiremo un piccolo gioco durante questo tutorial. **Potresti essere tentato di risparmiartelo perché non sviluppi giochi solitamente -- ma dagli una possibilità, non te ne pentirai.** Le tecniche che imparerai nel tutorial sono fondamentali allo sviluppo di ogni tipo di applicazione, acquisirle ti darà una profonda conoscenza di React.

>Suggerimento
>
>Questo tutorial è stato creato per persone che preferiscono **imparare mettendo in pratica**. Se preferisci imparare i concetti a partire dalle basi, dai uno sguardo alla nostra [guida passo passo](/docs/hello-world.html). Potresti trovare questo tutorial e la guida complementari l'uno con l'altra.

Il tutorial è diviso nelle seguenti sezioni:

* [Setup per il Tutorial](#setup-for-the-tutorial) ti darà **un punto di partenza** per seguire il tutorial.
* [Panoramica](#overview) ti spiegherà **i fondamentali** di React: componenti, props e state.
* [Finire il Gioco](#completing-the-game) ti spiegherà **le tecniche più comuni** nello sviluppo con React.
* [Aggiungere "Viaggio Nel Tempo"](#adding-time-travel) ti darà **una profonda conoscenza** delle uniche potenzialità di React.

Non devi completare tutte le sezioni in una volta per guadagnare qualcosa da questo tutorial. Prova a seguirlo fin quando puoi -- anche se è solo per una o due sezioni.

### Cosa Stiamo Costruendo? {#what-are-we-building}

In questo tutorial, ti mostreremo come costruire in React una versione interattiva del gioco tic-tac-toe (conosciuto anche come "tris").

Qui puoi vedere cosa costruiremo: **[Risultato Finale](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Se non capisci il codice, o se non riconosci la sintassi, non ti preoccupare! L'obiettivo di questo tutorial è appunto di aiutarti a capire React e la sua sintassi.

Ti consigliamo di guardare il gioco prima di continuare. Una delle funzionalità che noterai è che c'è una lista numerata a destra del piano di gioco. Questa lista contiene l'elenco delle mosse che sono avvenute durante una partita, la quale si aggiorna man mano che il gioco prosegue.

Puoi chiudere il gioco non appena ci hai familiarizzato. Cominceremo con un template più semplice in questo tutorial. Nel passo successivo ti aiuteremo ad impostare i prerequisiti, cosicché potrai costruire il gioco tu stesso/a.

### Prerequisiti {#prerequisites}

Presupponiamo che tua abbia familiarità con HTML e JavaScript, ma dovresti comunque essere in grado di seguire anche se provieni da un diverso linguaggio di programmazione. Inoltre, daremo per scontato che tu abbia familiarità con concetti di programmazione come funzioni, oggetti, arrays e classi, anche se queste ultime hanno minore importanza in questo contesto.

Se vuoi rinfrescare o dare un primo sguardo alle basi in JavaScript, ti raccomandiamo la lettura di [questa guida](https://developer.mozilla.org/it/docs/Web/JavaScript/Una_reintroduzione_al_JavaScript). Tieni presente che usiamo anche alcune funzionalità di ES6 -- una recente versione di JavaScript. In questo tutorial, useremo [arrow functions / funzioni a freccia](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Functions_and_function_scope/Arrow_functions), [classi](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Statements/let), e [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const). Puoi usare [Babel REPL](babel://es5-syntax-example) per vedere il codice compilato a partire da ES6.

## Setup per il Tutorial {#setup-for-the-tutorial}

Ci sono due modi per completare questo tutorial: puoi scrivere codice nel tuo browser, o puoi configurare un ambiente di sviluppo locale sul tuo computer.

### Opzione 1: Scrivi Codice nel Browser {#setup-option-1-write-code-in-the-browser}

Questo è il metodo più veloce!

Prima di tutto, apri questo **[Codice Iniziale](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** in un nuovo tab. Il nuovo tab dovrebbe mostrare una nuova partita di tic-tac-toe ed il relativo codice React. In questo tutorial modificheremo quel codice.

Se hai scelto questa opzione, puoi saltare la seconda opzione ed il relativo setup ed andare direttamente alla sezione [Panoramica](#overview) per una panoramica su React.

### Opzione 2: Setup Ambiente di Sviluppo Locale {#setup-option-2-local-development-environment}

Il contenuto di questa sezione è completamente opzionale e non necessario al completamento di questo tutorial!

<br>

<details>

<summary><b>Opzionale: Istruzioni per proseguire nel tuo ambiente locale usando il tuo editor di testo preferito</b></summary>

Questo setup richiede qualche piccolo sforzo aggiuntivo ma ti permette di completare il tutorial usando un editor a tua scelta. Ecco i passi da seguire:

1. Accertati di avere una versione recente di [Node.js](https://nodejs.org/en/) installata.
2. Segui le [istruzioni di installazione di Create React App](/docs/create-a-new-react-app.html#create-react-app) per creare un nuovo progetto.

```bash
npx create-react-app my-app
```

3. Elimina tutti i files nella cartella `src/` del nuovo progetto

> Nota Bene:
>
>**Non eliminare l'intera cartella `src`, rimuovi solo i files al suo interno.** Nel passo successivo sostituiremo i sorgenti predefiniti con gli esempi relativi a questo progetto.

```bash
cd my-app
cd src

# Se stai usando Mac o Linux:
rm -f *

# Oppure, se sei su Windows:
del *

# Infine, torna indietro alla cartella del progetto
cd ..
```

1. Aggiungi un file chiamato `index.css` nella cartella `src/` con questo [codice CSS](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

2. Aggiungi un file chiamato `index.js` nella cartella `src/` con questo [codice JS](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

3. Aggiungi queste tre linee all'inizio del file `index.js` nella cartella `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
```

Adesso se esegui `npm start` nella cartella del progetto ed apri `http://localhost:3000` nel tuo browser, dovresti vedere una nuova partita di tic-tac-toe.

Ti raccomandiamo di seguire [queste istruzioni](https://babeljs.io/docs/editors/) per configurare l'evidenziazione della sintassi nel tuo editor.

</details>

### Aiuto, Non Funziona! {#help-im-stuck}

Se sei bloccato/a, dai uno sguardo alle [risorse di supporto della comunità](/community/support.html). In particolare, [Reactiflux Chat](https://discord.gg/reactiflux) è un ottimo modo per ricevere aiuto velocemente. Se non ricevi una risposta, o se non riesci a proseguire, cortesemente apri una issue e ti aiuteremo da lì.

## Panoramica {#overview}

Adesso che è tutto pronto, proseguiamo con una panoramica di React!

### Cosa è React? {#what-is-react}

React è una libreria JavaScript per costruire interfacce utente caratterizzata dal fatto che è dichiarativa, efficiente e flessibile. Ti permette di comporre UI complesse a partire da piccoli ed isolati stralci di codice chiamati "componenti".

React ha diversi tipi di componenti, cominciamo con le sottoclassi di `React.Component`:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Lista della spesa per {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Esempio d'utilizzo: <ShoppingList name="Mark" />
```

Arriveremo a quei simpatici tags simili ad XML in un attimo. Usiamo i componenti per dire a React cosa vogliamo vedere sullo schermo. Quando i dati cambiano, React aggiorna e ridisegna i nostri componenti in modo efficiente.

In questo caso, ShoppingList (lista della spesa) è una **classe componente React**, o **tipo componente React**. I componenti ricevono parametri, chiamati `props` (da "properties" ovvero proprietà), e ritornano una gerarchia di viste da visualizzare attraverso il metodo `render`.

Il metodo `render` ritorna una *descrizione* di cosa vogliamo vedere sullo schermo. React prende questa descrizione e ne visualizza il risultato. In particolare, `render` ritorna un **elemento React**, che è una descrizione leggera di cosa bisogna visualizzare. La maggioranza degli sviluppatori React usa una speciale sintassi chamata "JSX" che rende queste strutture più facili da scrivere. La sintassi `<div />` viene trasformata a build time in `React.createElement('div')`. L'esempio di prima è equivalente a:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[Guarda la versione estesa.](babel://tutorial-expanded-version)

Se vuoi curiosare, `createElement()` viene descritto con maggior dettaglio nella [API di riferimento](/docs/react-api.html#createelement), ma non lo useremo in questo tutorial. Invece, continueremo ad usare JSX.

JSX ha in se tutte le funzionalità di JavaScript. Puoi inserire *qualunque* espressione JavaScript all'interno di parentesi in JSX. Ogni elemento React è un oggetto JavaScript che puoi salvare in una variabile e/o passare di qua e di là nel tuo programma.

Il componente `ShoppingList` di prima visualizza solo componenti DOM predefiniti, come `<div />` e `<li />`. Ma puoi comporre e visualizzare anche componenti React personalizzati al suo interno. Per esempio, adesso possiamo riferirci all'intera lista della spesa scrivendo `<ShoppingList />`. Ogni componente React è incapsulato e può operare indipendentemente; ciò ci permette di costruire UI complesse a partire da semplici componenti.

### Uno Sguardo al Codice Iniziale {#inspecting-the-starter-code}

Se hai scelto di lavorare sul tutorial **nel tuo browser,** apri questo codice in un nuovo tab: **[Codice Iniziale](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Se invece vuoi lavorare **localmente,** apri `src/index.js` nella cartella del progetto (hai già aperto questo file durante il [setup](#setup-option-2-local-development-environment)).

Il Codice Iniziale è la base di quello che vogliamo costruire. Abbiamo già fornito gli stili CSS cosicché ti potrai concentrare solo sull'imparare React e programmare il gioco tic-tac-toe.

Ispezionando il codice, noterai che ci sono tre componenti React:

* Square
* Board
* Game

Il componente Square (quadrato) visualizza un singolo `<button>` mentre Board (tavola) 9 quadrati. Il componente Game (partita) visualizza una tavola con valori segnaposto che modificheremo più tardi. Attualmente, non abbiamo componenti interattivi.

### Passare Dati Mediante Props {#passing-data-through-props}

Giusto per rompere il ghiaccio, proviamo a passare qualche dato dal componente Board al nostro componente Square.

Va bene lo stesso se preferisci copiare ed incollare il codice lungo il tutorial, tuttavia, ti raccomandiamo di scriverlo a mano. Ti aiuterà a sviluppare memoria muscolare ed a capire meglio i concetti espressi.

Nel metodo `renderSquare` in Board, modifica il codice per passare una prop chiamata `value` allo Square:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
}
```

Modifica il metodo `render` di Square sostituendo `{/* TODO */}` con `{this.props.value}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

Prima:

![React Devtools](../images/tutorial/tictac-empty.png)

Dopo: Dovresti vedere un numero all'interno di ogni quadrato nell'output.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Congratulazioni! Hai appena "passato una prop" da un componente genitore Board al suo componente figlio Square. Nelle applicazioni React, è così che le informazioni circolano, dai genitori ai figli.

### Creare un Componente Interattivo {#making-an-interactive-component}

Andiamo a riempire il componente Square con una "X" quando lo clicchiamo.
Prima di tutto, modifichiamo il tag `button` che è ritornato dalla funzione `render()` del componente Square:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { console.log('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Adesso, se clicchiamo su uno Square, riceviamo un 'click' nella console degli strumenti di sviluppo.

>Nota Bene
>
>Al fine di risparmiarci qualche carattere e per evitare i problemi legati allo [strano comportamento di `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), useremo la sintassi [arrow function / funzione a freccia](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Functions_and_function_scope/Arrow_functions) per event handlers (funzioni richiamate quando il relativo evento accade) qui e poi di seguito:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => console.log('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>Nota come con `onClick={() => console.log('click')}`, stiamo passando *una funzione* come prop `onClick`. Essa viene eseguita a seguito di un click. Dimenticare `() =>` e scrivere `onClick={console.log('click')}` è un errore comune, e risulterebbe nell'esecuzione della funzione ogni volta che il componente viene ridisegnato (chiamata a `render()`).

Come passo successivo, vogliamo far sì che il componente Square si "ricordi" di essere stato cliccato, e che visualizzi il segno "X" al suo interno. Per "ricordare" cose, i componenti usano **state** (inteso come ["stato"](https://en.wikipedia.org/wiki/State_(computer_science))).

I componenti React possono avere uno stato impostando `this.state` nei loro costruttori. `this.state` dovrebbe essere considerato privato (in termini di accesso) al componente React nel quale è definito. Andiamo a salvare il valore attuale di Square in `this.state`, e cambiamolo quando Square viene cliccato.

Per cominciare, aggiungiamo il costruttore alla classe per inizializzarne lo stato:

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => console.log('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Nota Bene
>
>Nelle [classi JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), devi sempre chiamare `super` quando definisci il costruttore di una sottoclasse (classe derivata). Tutte le classi componente React che hanno un `constructor` devono sempre richiamare `super(props)` come prima istruzione nel costruttore.

Procediamo alla modifica del metodo `render` di Square per visualizzare il valore corrente dello stato quando lo clicchiamo:

* Sostituisci `this.props.value` con `this.state.value` all'interno del tag `<button>`.
* Sostituisci l'event handler `onClick={...}` con `onClick={() => this.setState({value: 'X'})}`.
* Aggiungi le props `className` e `onClick` come linee separate per miglior leggibilità.

Al seguito delle nostre modifiche, il tag `<button>` ritornato dal metodo `render` di Square sarà:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

Richiamando `this.setState` dall'handler `onClick` nel metodo `render` di Square, fondamentalmente stiamo dicendo a React di ridisegnare quello Square ogni qual volta il suo `<button>` viene cliccato. Dopo questo aggiornamento, `this.state.value` di Square sarà `'X'`, di conseguenza vedremo la `X` nella tavola di gioco (Board). Cliccando su qualunque Square, dovrebbe apparire una `X`.

Quando chiamiamo `setState` in un componente, React aggiorna automaticamente anche i componenti figli al suo interno.

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

###Developer Tools (Strumenti per lo Sviluppatore) {#developer-tools}

L'estensione React Devtools per [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) e [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) ti permette di ispezionare l'albero dei componenti React nei developer tools del tuo browser.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools ti permette di vedere le props e lo state dei tuoi componenti React.

Dopo aver installato React DevTools, clicca col tasto destro del mouse su qualunque elemento di una pagina, poi su "Ispeziona elemento" per aprire i developer tools, ed i tabs React ("⚛️ Components" e "⚛️ Profiler") appariranno come ultimi tabs sulla destra. Usa "⚛️ Components" per ispezionare l'albero dei componenti.

**Comunque, nota che ci sono alcuni passi aggiuntivi per farli funzionare con CodePen:**

1. Autenticati o registrati e conferma la tua email (necessario per prevenire spam).
2. Clicca sul pulsante "Fork".
3. Clicca su "Change View" e seleziona "Debug mode".
4. Nel nuovo tab appena aperto, il tab React dovrebbe essere presente nei Developer Tools.

## Completare il Gioco {#completing-the-game}

Adesso che abbiamo i pezzi principali del nostro gioco. Per completarlo, dobbiamo alternare il piazzamento delle "X" e delle "O" sulla tavola, inoltre, abbiamo bisogno di un modo per determinare un vincitore.

### Elevare lo Stato {#lifting-state-up}

Correntemente, ogni componente Square mantiene lo stato del gioco. Per poter determinare un vincitore, dobbiamo mantenere il valore di ogni quadrato nello stesso posto.

Possiamo pensare che Board debba solo richiedere ad ogni Square il relativo stato. Anche se questo approccio è possibile in React, lo scoraggiamo in quanto il codice diventa difficile da capire, suscettibile ai bugs e difficile da [rifattorizzare](https://it.wikipedia.org/wiki/Refactoring). Piuttosto, l'approccio migliore è quello di mantenere lo stato del gioco nel componente padre Board invece che in ogni Square. Il componente Board può riportare ad ogni Square cosa visualizzare semplicemente passando una prop, [così come abbiamo fatto quando abbiamo passato un numero ad ogni Square](#passing-data-through-props).

**Per recuperare dati dai componenti figli a partire dal componente padre, o per far comunicare tra di loro due componenti figli, bisogna definire uno stato condiviso nel componente padre. Quest'ultimo può passare di nuovo lo stato in basso, ai figli, usando props; ciò mantiene i componenti figli in sincronia tra di loro ed ovviamente con il componente padre.**

Elevare lo stato nel componente padre è un processo comune quando i componenti React vengono rifattorizzati -- proviamo già che ci siamo.

Cominciamo aggiungendo un costruttore a Board ed impostandone lo stato iniziale così da contenere un array di 9 nulls. Questi 9 nulls corrispondono ai 9 quadrati:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }
```

Quando riempiremo la tavola più tardi, l'array `this.state.squares` risulterà più o meno così:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

Il metodo `renderSquare` di Board attualmente è:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

All'inizio, abbiamo [passato la prop `value` verso il basso](#passing-data-through-props) da Board per visualizzare i numeri da 0 a 8 in ogni Square. In un altro passo, abbiamo sostituito i numeri con il segno "X" [determinato dallo stato interno di Square](#making-an-interactive-component). Ecco perché al momento Square ignora la prop `value` che riceve da Board.

Andiamo ad usare di nuovo questo meccanismo di passaggio di props. Modifichiamo Board per far sì che ogni Square riceva il proprio valore corrente (`'X'`, `'O'`, o `null`). Abbiamo già definito l'array `squares` nel costruttore di Board, adesso dobbiamo cambiare anche il metodo `renderSquare` di Board facendo sì che possa leggere dall'array:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Ogni Square adesso riceverà una prop `value` che sarà valorizzata con `'X'`, `'O'`, o `null` nel caso dei quadrati vuoti.

Successivamente, dobbiamo cambiare cosa succede quando uno Square viene cliccato. Il componente Board adesso sa quali quadrati sono riempiti. Dobbiamo fare in modo che gli Square possano modificare lo stato all'interno di Board. Dato che lo stato è considerato privato ed accessibile per definizione solo al componente nel quale è definito, non possiamo modificarlo direttamente da Square.

Possiamo però passare una funzione da Board a Square. Questa funzione verrà richiamata ogni qual volta uno Square viene cliccato. Ecco come dobbiamo modificare il metodo `renderSquare` di Board:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Nota Bene
>
>Abbiamo diviso l'istruzione return su più linee per maggiore leggibilità ed aggiunto parentesi per fare in modo che JavaScript non inserisca un punto e virgola dopo `return`. In tal caso, il nostro codice non funzionerebbe più.

Adesso stiamo passando due props da Board a Square: `value` e `onClick`. La prop `onClick` è una funzione che Square può richiamare quando viene cliccato. Apportiamo qualche altra modifica a Square:

* Sostituiamo `this.state.value` con `this.props.value` nel metodo `render` di Square
* Sostituiamo `this.setState()` con `this.props.onClick()` nel metodo `render` di Square
* Rimuoviamo il `constructor` da Square in quanto Square non tiene più traccia della stato della partita internamente

Al seguito di queste modifiche, il componente Square dovrebbe essere così:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

Quando uno Square viene cliccato, viene richiamata la funzione `onClick` provvista da Board. Ecco in dettaglio come ciò avviene:

1. La prop `onClick` nel componente `<button>` presente nel DOM (di fabbrica) dice a React di impostare un event handler per il click.
2. Quando il bottone viene cliccato, React richiama l'event handler `onClick` che è definito nel metodo `render()` di Square.
3. Questo event handler chiama a sua volta `this.props.onClick()`. La prop `onClick` di Square è stata però specificata da Board.
4. Dato che Board ha passato `onClick={() => this.handleClick(i)}` a Square, di conseguenza Square richiama `handleClick(i)` di Board quando viene cliccato.
5. Non abbiamo ancora definito alcun metodo `handleClick()`, per questo il nostro codice non funziona al momento. Infatti, se clicchi su uno Square adesso, dovresti ricevere un messaggio di errore che dice qualcosa del tipo: "this.handleClick is not a function".

>Nota Bene
>
>L'attributo `onClick` dell'elemento DOM `<button>` ha un significato speciale in quanto è un componente di fabbrica. Per componenti customizzati come Square, la nomenclatura sta a te. Potremmo dare un nome diverso alla prop `onClick` di Square o al metodo `handleClick` di Board ed il codice continuerebbe a funzionare. In React, comunque, esiste la convenzione di utilizzare i nomi `on[Evento]` per le props che rappresentano eventi ed `handle[Evento]` per i metodi che gestiscono gli eventi.

Quando proviamo a cliccare su uno Square, dovremmo ricevere un errore visto che non abbiamo ancora definito `handleClick`. Andiamo ora ad aggiungere `handleClick` alla classe Board:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

A seguito di queste modifiche, siamo ancora in grado di cliccare sui componenti Square, facendo sì che si valorizzino come in precedenza. Tuttavia, adesso lo stato viene mantenuto nel componente Board invece che individualmente nei vari componenti Square. Quando lo stato di Board cambia, i componenti Square vengono renderizzati di nuovo automaticamente. Mantenere lo stato di tutti i quadrati nel componente Board ci permetterà di determinare il vincitore in futuro.

Dato che i componenti Square non mantengono più il proprio stato, essi ricevono valori dal componente Board ed a loro volta lo informano di quando vengono cliccati. In termini di React, i componenti Square sono ora **componenti controllati**. Board ha infatti il controllo completo su di essi.

Nota come in `handleClick`, chiamiamo `.slice()` per creare una copia dell'array `squares` invece di modificare l'array esistente. Nella prossima sezione spiegheremo il perché.

### Perché l'Immutabilità è Importante {#why-immutability-is-important}

Nel precedente esempio di codice, abbiamo suggerito di creare una copia dell'array `squares` usando il metodo `.slice()` invece di modificare direttamente l'array. Cerchiamo di capire cosa è l'immutabilità e perché si tratta di un concetto importante da imparare.

In generale, ci sono due approcci per modificare i dati. Il primo appoccio è quello di *mutarli* direttamente, cambiandone i valori. Il secondo approccio è quello di sostituire i dati con una nuova copia che ha i cambiamenti desiderati.

#### Modificare Dati mediante Mutazione {#data-change-with-mutation}
```javascript
var giocatore = {punti: 1, nome: 'Mario'};
giocatore.punti = 2;
// Il punteggio del giocatore è {punti: 2, nome: 'Mario'}
```

#### Modificare Dati senza Mutazione {#data-change-without-mutation}
```javascript
var giocatore = {punti: 1, nome: 'Mario'};

var nuovoGiocatore = Object.assign({}, giocatore, {punti: 2});
// Adesso giocatore resta invariato ma nuovoGiocatore è {punti: 2, nome: 'Mario'}

// In alternativa potremmo usare la sintassi "spread" (vedi nota di seguito), con la quale scriveremmo:
// var nuovoGiocatore = {...giocatore, punti: 2};
//
```
>Per maggiori informazioni sulla sintassi [spread](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

Il risultato finale è lo stesso ma non modificando (o cambiando i dati sottostanti) direttamente, otteniamo diversi benefici che descriveremo a breve.

#### Funzionalità Complesse Diventano Semplici{#complex-features-become-simple}

L'immutabilità rende funzionalità complesse molto più semplici da implementare. Nel proseguio del tutorial, implementeremo una funzione "viaggio nel tempo" che ci permetterà di vedere la storia della partita a tic-tac-toe e di "saltare indietro" a mosse precedenti. Questa funzionalità non è specifica dei giochi -- avere la possibilità di annullare e ripetere azioni è un requisito comune nelle applicazioni. Eliminare la mutazione diretta dei dati ci permette di mantenere versioni precedenti della storia della partita intatte cosicché siano riutilizzabili in seguito.

#### Rilevare Cambiamenti {#detecting-changes}

Rilevare cambiamenti in oggetti mutabili è difficile perché essi vengono modificati direttamente. Questo tipo di rilevazione richiede il confronto dell'oggetto mutato con le versioni precedenti dello stesso e quindi, l'intero albero dell'oggetto deve essere attraversato.

Rilevare cambiamenti negli oggetti immutabili è considerevolmente più semplice. Se il riferimento dell'oggetto immutabile è diverso dal precedente, allora l'oggetto è cambiato.

#### Determinare Quando Renderizzare di Nuovo in React {#determining-when-to-re-render-in-react}

Il più grande beneficio dell'immutabilità è il fatto che ci aiuta a creare _componenti puri_ in React. Avere dati immutabili permette di identificare cambiamenti in modo semplice e di conseguenza anche di capire quando un componente richiede una nuova renderizzazione.

Puoi impare di più riguardo `shouldComponentUpdate()` e su come puoi costruire *componenti puri* leggendo [Ottimizzare le Prestazioni](/docs/optimizing-performance.html#examples).

### Componenti Funzione {#function-components}

Procediamo nel convertire Square in un **componente funzione**.

In React, **i componenti funzione** sono un modo più semplice di scrivere componenti che hanno il solo metodo `render` e non mantengono il proprio stato interno. Invece di definire una classe che estende `React.Component`, possiamo scrivere una funzione che prende `props` come input e ritorna cosa bisogna renderizzare. I componenti funzione sono meno laboriosi da scrivere rispetto alle classi, molti componenti possono essere espressi in questo modo.

Sostituiamo la classe Square con questa funzione:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Abbiamo cambiato `this.props` in `props` in entrambi i casi.

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Nota Bene
>
>Quando abbiamo convertito Square in un componente funzione, abbiamo anche cambiato `onClick={() => this.props.onClick()}` nella versione più corta `onClick={props.onClick}` (nota l'assenza delle parentesi da *entrambi* i lati).

### Turni {#taking-turns}

Procediamo a sistemare un grosso difetto del nostro gioco: le "O" non possono essere piazzate sulla tavola.

Impostiamo il fatto che la "X" sia il segno predefinito per il primo turno. Per far ciò, modifichiamo lo stato iniziale di Board nel rispettivo costruttore:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Ogni volta che un giocatore muove, `xIsNext` (booleano) viene invertito per determinare quale giocatore sarà il prossimo a muovere e lo stato viene poi salvato. Modifichiamo quindi la funzione `handleClick` di Board per invertire il valore di `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Con questo cambiamento, "X" e "O" adesso vengono usati alternativamente di turno in turno. Prova!

Dobbiamo anche cambiare il testo "status" nel `render` di Board cosicché verremo informati a video del giocatore che deve muovere nel turno successivo:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // il resto non cambia
```

Al seguito di queste modifiche, ecco il nostro componente Board:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Dichiarare un Vincitore {#declaring-a-winner}

Adesso che possiamo visualizzare quale giocatore deve muovere nel prossimo turno, possiamo anche visualizzare quando una partita è finita ed il relativo vincitore. Copia questa funzione aiutante (funzioni che contribuiscono alla risoluzione dell'algoritmo, normalmente chiamate "helper functions") ed incollala alla fine del file:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

Dato un array di 9 quadrati, questa funzione determinerà il vincitore e ritornerà `'X'`, `'O'` o `null` di conseguenza.

Richiameremo `calculateWinner(squares)` nella funzione `render` di Board per verificare se un giocatore ha vinto. In caso positivo, visualizzeremo il testo "Winner: X" oppure "Winner: O". Sostituiremo la dichiarazione di `status` nella funzione `render` di Board in questo modo:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // il resto non cambia
```

Dobbiamo modificare anche la funzione `handleClick` di Board per far sì che ritorni immediatamente, ignorando i click, nel caso in cui qualcuno ha già vinto la partita o nel caso in cui Square sia già riempito:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Congratulazioni! Hai una versione funzionante di tic-tac-toe! Inoltre, hai anche già imparato le basi di React. A pensarci bene, probabilmente a vincere davvero alla fine *sei tu!*.

## Aggiungere "Viaggio Nel Tempo" {#adding-time-travel}

Come esercizio finale, facciamo in modo che sia possibile "andare indietro nel tempo" a mosse precedenti nel gioco.

### Salvare lo Storico delle Mosse {#storing-a-history-of-moves}

Se avessimo mutato l'array `squares`, implementare il viaggio nel tempo sarebbe molto difficile.

Fortunatamente, abbiamo usato `slice()` per creare una nuova copia dell'array `squares` dopo ogni mossa, [trattandolo come struttura dati immutabile](#why-immutability-is-important). Ciò ci permette di salvare ogni precedente versione dell'array `squares` e di scorrere tra i turni avvenuti.

Salveremo gli array `squares` precedenti in un altro array chiamato `history` (da "storia" per rappresentare appunto lo storico delle mosse). L'array `history` rappresenta tutti gli stati della tavola, dalla prima all'ultima mossa, ed ha questa forma:

```javascript
history = [
  // Prima di ogni mossa
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // Dopo la prima mossa
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // Dopo la seconda mossa
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Adesso dobbiamo decidere quale componente dovrebbe possedere lo stato in `history`.

### Elevare lo Stato, Di Nuovo {#lifting-state-up-again}

Anche in questo caso, vogliamo che sia il componente di più alto livello Game a visualizzare la lista delle mosse precedenti. Per questo, e dato che bisogna avere accesso ad `history` per fare ciò, salveremo lo stato `history` nel componente Game.

Posizionare lo stato `history` nel componente Game ci permette di rimuovere lo stato `squares` dal suo componente figlio Board. Così come abbiamo fatto quando abbiamo ["elevato lo stato"](#lifting-state-up) dal componente Square nel componente Board, adesso dobbiamo elevarlo dal componente Board al componente di più alto livello Game. Ciò darà al componente Game pieno controllo sui dati di Board, permettendoci di istruire Board a visualizzare i turni precedenti partendo da `history`.

Prima di tutto, dobbiamo impostare lo stato iniziale del componente Game nel suo costruttore:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Poi, dobbiamo far sì che il componente Board riceva le props `squares` ed `onClick` dal componente Game. Dato che adesso abbiamo un solo handler per il click in Board per i vari Squares, dobbiamo passare la posizione di ogni Square nell'handler `onClick` per indicare quale Square è stato cliccato. Questi sono i passi necessari per trasformare il componente Board:

* Rimuovere il `constructor` in Board.
* Sostituire `this.state.squares[i]` con `this.props.squares[i]` nel metodo `renderSquare` di Board.
* Sostituire `this.handleClick(i)` con `this.props.onClick(i)` nel metodo `renderSquare` di Board.

Il componente Board adesso risulterà:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

Modifichiamo la funzione `render` del componente Game per far sì che utilizzi l'elemento più recente nello storico per visualizzare lo stato della partita:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Dato che adesso è il componente Game a renderizzare lo stato della partita, possiamo rimuovere il relativo codice ridondante dal metodo `render` di Board. Dopo aver rifattorizzato, ecco la funzione `render` di Board:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Infine, dobbiamo spostare il metodo `handleClick` dal componente Board al componente Game. Dobbiamo inoltre modificarlo dato che lo stato del componente Game è strutturato diversamente. All'interno del metodo `handleClick`, dobbiamo concatenare i nuovi elementi all'interno di `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Nota Bene
>
>Contrariamente al metodo `push()`, al quale potresti essere più abituato, il metodo `concat()` non muta l'array originale, per questo lo preferiamo.

A questo punto, il componente Board richiede solo i metodi `renderSquare` e `render`. Lo stato della partita ed il metodo `handleClick` dovrebbero essere nel componente Game.

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Visualizzare le Mosse Precedenti {#showing-the-past-moves}

Visto che stiamo memorizzando lo storico delle mosse di una partita di tic-tac-toe, possiamo ora mostrarne una lista all'utente.

Abbiamo imparato in precedenza che gli elementi React sono oggetti JavaScript di prima classe; possiamo passarli ed assegnarli all'interno delle nostre applicazioni. Per renderizzare elementi multipli in React, possiamo usare un array di elementi React.

In JavaScript, gli array hanno un [metodo `map()`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/map) che viene comunemente usato per mappare dati in modo diverso, per esempio:

```js
const numeri = [1, 2, 3];
const raddoppiati = numeri.map(x => x * 2); // [2, 4, 6]
```

Usando il metodo `map`, possiamo mappare il nostro storico delle mosse in elementi React che rappresentano i bottoni sullo schermo, e visualizzare una lista di bottoni per "saltare" alle mosse precedenti.

Usiamo `map` su `history` nel metodo `render` di Game:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

Man mano che iteriamo l'array `history`, la variabile `step` si riferisce al valore corrente dell'elemento `history`, mentre `move` si riferisce all'indice dell'elemento `history`. Qui siamo interessati solo a `move`, per questo `step` non viene assegnato a nulla.

Per ogni mossa nello storico delle mosse, creeremo una lista di elementi `<li>` che contengono un bottone `<button>`. Il bottone avrà un handler `onClick` che richiama un metodo chiamato `this.jumpTo()`. Non abbiamo ancora implementato `jumpTo()`. Per adesso, dovremmo essere in grado di vedere una lista delle mosse avvenute oltre ad un messaggio di errore nella console dei [developer tools](#developer-tools) che dice:

> Attenzione:
> Ogni elemento di un array o iteratore dovrebbe avere una prop "key" (chiave). Verifica il metodo render di "Game"

Spiegheremo in maggior dettaglio il significato di questo errore.

### Scegliere una Chiave {#picking-a-key}

Quando renderizziamo una lista, React salva alcune informazioni riguardo ogni elemento renderizzato. Quando aggiorniamo una lista, React deve essere in grado di determinare cosa è cambiato. Potremmo aver aggiunto, rimosso, riordinato o aggiornato gli elementi della lista.

Immagina una transizione da

```html
<li>Alessandro: 7 attività rimaste</li>
<li>Luca: 5 attività rimaste</li>
```

a

```html
<li>Luca: 9 attività rimaste</li>
<li>Fabio: 8 attività rimaste</li>
<li>Alessandro: 5 attività rimaste</li>
```

Oltre all'aggiornamento dei contatori, un umano potrebbe facilmente anche dire che abbiamo invertito l'ordine di Alessandro e Luca ed inserito Fabio tra Alessandro e Luca. Ad ogni modo, React è un programma e non sa cosa intendevamo fare modificando la lista. Dato che React non conosce le nostre intenzioni, dobbiamo specificare una proprietà *key* (letteralmente: "chiave") per ogni elemento della lista in modo da differenziarli tra loro. Una opzione potrebbe essere quella di utilizzare le stringhe `alessandro`, `luca`, `fabio`. Se stiamo visualizzando dati provenienti da un database, potremmo usare come chiavi gli ID salvati in esso per i rispettivi record di Alessandro, Luca e Fabio.

```html
<li key={utente.id}>{utente.nome}: {utente.attivitaRimaste} attività rimaste</li>
```

Quando una lista viene renderizzata di nuovo, React prende le chiavi di ogni elemento e ricerca nella lista precedente per la stessa chiave. Se la lista corrente ha una chiave che non esisteva, React crea un elemento. Se la lista corrente non ha una chiave che prima esisteva, React elimina il componente precedente. Se una chiave esisteva ed esiste tuttora, l'elemento corrispondente viene spostato. Le chiavi informano React dell'identità di ogni componente il che gli permette di mantenere lo stato tra le varie susseguenti renderizzazioni. Se la chiave di un componente cambia, il componente viene distrutto e ricreato con un nuovo stato.

`key` è una proprietà speciale e riservata in React (insieme a `ref`, una funzione più avanzata). Quando un elemento viene creato, React estrae la proprietà `key` e la salva direttamente nell'elemento ritornato. Anche se `key` può sembrare appartenente alle `props`, `key` non può essere referenziato usando `this.props.key`. React usa automaticamente `key` per decidere quali componenti richiedono un aggiornamento. Un componente non può conoscere il valore della propria `key`.

**Raccomandiamo fortemente di assegnare chiavi univoche quando si ha a che fare con liste dinamiche.** Se pensi di non avere chiavi appropriate, potresti considerare di ristrutturare i tuoi dati per risolvere il problema.

Se non viene specificata una chiave, React visualizzerà un avviso ed utilizzerà l'indice dell'array in modo predefinito. Utilizzare l'indice dell'array come chiave è problematico nel caso in cui si debbano riordinare gli elementi di una lista o aggiungere/rimuovere elementi. Passare esplicitamente `key={i}` silenzierà l'avviso ma il problema descritto persisterà e quindi l'uso dell'indice degli array come chiave non è raccomandato nella maggioranza dei casi.

Le chiavi non devono essere globalmente uniche; devono essere uniche solo tra i vari componenti ed i loro pari (elementi appartenenti allo stesso array).


### Implementare il "Viaggio Nel Tempo" {#implementing-time-travel}

Nello storico della partita di tic-tac-toe, ogni mossa precedente ha un ID unico ad essa associata: si tratta del numero sequenziale della mossa. Le mosse non vengono mai riordinate, rimosse o inserite nel mezzo, per questo motivo in questo caso possiamo usare l'indice della mossa come chiave.

Nel metodo `render` del componente Game, possiamo aggiungere la chiave come `<li key={move}>` dopodiché il messaggio di avviso di React riguardo le chiavi dovrebbe sparire:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Cliccare su uno qualunque dei bottoni della lista causerà un errore dato che il metodo `jumpTo` non è stato ancora definito. Prima di implementarlo, aggiungeremo `stepNumber` allo stato del componente Game per indicare quale mossa stiamo visualizzando.

Prima di tutto, aggiungiamo `stepNumber: 0` allo stato iniziale nel `constructor` di Game:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Poi, definitiamo il metodo `jumpTo` in Game per aggiornare quello `stepNumber`. Imposteremo anche `xIsNext` a true (vero) nel caso in cui il numero in cui stiamo impostando in `stepNumber` sia pari:

```javascript{5-10}
  handleClick(i) {
    // questo metodo non è cambiato
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // questo metodo non è cambiato
  }
```

Notice in `jumpTo` method, we haven't updated `history` property of the state. That is because state updates are merged or in more simple words React will update only the properties mentioned in `setState` method leaving the remaining state as is. For more info **[see the documentation](/docs/state-and-lifecycle.html#state-updates-are-merged)**.

È ora di apportare qualche cambiamento al metodo `handleClick` di Game che verrà richiamato quando si clicca su un quadrato.

Lo stato `stepNumber` che abbiamo appena aggiunto adesso riflette la mossa visualizzata. Dopo ogni nuova mossa, dobbiamo aggiornare `stepNumber` aggiungendo `stepNumber: history.length` come parte del parametro alla chiamata `this.setState`. Ciò farà in modo di non restare bloccati nella stessa mossa ogni qual volta ne viene effettuata una nuova.

<<<<<<< HEAD
Sostituiremo anche `this.state.history` con `this.state.history.slice(0, this.state.stepNumber + 1)`. Ciò farà in modo che nel caso in cui volessimo "andare indietro nel tempo" e poi fare una nuova mossa da quel punto, possiamo buttare via tutta la storia "futura" che diverrebbe incorretta visto che in un certo senso la stiamo riscrivendo.
=======
We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now be incorrect.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Infine, modificheremo il metodo `render` del componente Game per far sì che smetta di visualizzare sempre l'ultima mossa ma visualizzi invece la mossa `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // il resto non cambia
```

Se clicchiamo su uno qualunque degli elementi dello storico, la tavola di gioco dovrebbe automaticamente aggiornarsi per visualizzare il relativo stato.

**[Visualizza tutto il codice scritto finora](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Riepilogo {#wrapping-up}

Congratulazioni! Abbiamo creato un gioco tic-tac-toe che:

* Ti permette di giocare,
* Sa determinare quando un giocatore vince la partita,
* Tiene traccia dello storico delle mosse man mano che la partita prosegue,
* Permette al giocatore di rivedere lo storico e con esso le precedenti versioni della tavola di gioco.

Ottimo lavoro! Ci auguriamo che tu ti senta di aver avuto una decente introduzione al funzionamento di React.

Quì puoi vedere il risultato finale: **[Risultato Finale](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

Se hai ancora del tempo a disposizione per mettere in pratica le tue nuove capacità in React, ecco alcune idee per miglioramenti che potresti apportare al gioco, elencati in ordine di difficoltà:

1. Visualizza la posizione per ogni mossa nel formato (colonna, riga) nello storico delle mosse.
2. Evidenzia l'elemento correntemente selezionato nella lista delle mosse.
3. Riscrivi Board in modo da usare due cicli per creare i quadrati invece di averli "scolpiti nel codice" (o [hardcoded](https://it.wikipedia.org/wiki/Codifica_fissa) in Inglese).
4. Aggiungi un bottone a due stati che ti permette di riordinare le mosse in ordine ascendente e discendente.
5. Quando qualcuno vince, evidenzia i tre quadrati che hanno causato la vittoria.
6. Quando la partita finisce in pareggio, visualizza il relativo messaggio.

Attraverso questo tutorial, abbiamo toccato vari concetti chiave di React quali: elementi, componenti, props e state. Per una spiegazione più dettagliata di questi argomenti, dai uno sguardo al [resto della documentazione](/docs/hello-world.html). Per imparare come definire componenti, puoi leggere l'[API di riferimento di `React.Component`](/docs/react-component.html).
