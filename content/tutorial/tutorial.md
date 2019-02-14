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

Costruiremo un piccolo gioco durante questo tutorial. **Potresti essere tentato di risparmiartelo perché non sviluppi giochi solitamente -- ma dagli una possibilità, non te ne pentirai.** Le tecniche che imparirai nel tutorial sono fondamentali allo sviluppo di ogni tipo di applicazione, acquisirle ti darà una profonda conoscenza di React.

>Suggerimento
>
>Questo tutorial é stato creato per persone che preferiscono **imparare mettendo in pratica**. Se preferisci imparare i concetti a partire dalle basi, dai uno sguardo alla nostra [guida passo passo](/docs/hello-world.html). Potresti trovare questo tutorial e la guida complementari l'uno con l'altra.

Il tutorial è diviso nelle seguenti sezioni:

* [Setup per il Tutorial](#setup-for-the-tutorial) ti darà **un punto di partenza** per seguire il tutorial.
* [Panoramica](#overview) ti spiegerà **i fondamentali** di React: componenti, props e state.
* [Finire il Gioco](#completing-the-game) ti spiegerà **le tecniche più comuni** nello sviluppo con React.
* [Aggiungere Time Travel](#adding-time-travel) ti darà **una profonda conoscenza** delle uniche potenzialità di React.

Non devi completare tutte le sezioni in una volta per guadagnare qualcosa da questo tutorial. Prova a seguirlo fin quando puoi -- anche se è solo per una o due sezioni.

Va bene lo stesso se preferisci copiare ed incollare il codice lungo il tutorial, tuttavia, ti raccomandiamo di scriverlo a mano. Ti aiuterà a sviluppare memoria muscolare ed a capire meglio i concetti espressi.

### Cosa Stiamo Costruendo? {#what-are-we-building}

In questo tutorial, ti mostreremo come costruire una versione interattiva del gioco tic-tac-toe (conosciuto anche come "tris") in React.

Qui puoi vedere cosa costruiremo: **[Risultato Finale](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Se non capisci il codice, o se non riconosci la sintassi, non ti preoccupare! L'obiettivo di questo tutorial è appunto di aiutarti a capire React e la sua sintassi.

Ti consigliamo di guardare il gioco prima di continuare. Una delle funzionalità che noterai è che c'è una lista numerata sulla destra del piano di gioco. Questa lista contiene l'elenco delle mosse che sono avvenute durante una partita, si aggiorna man mano che il gioco prosegue.

Puoi chiudere il gioco non appena ci hai familiarizzato. Cominceremo con un template più semplice in questo tutorial. Nel passo successivo ti aiuteremo ad impostare i prerequisiti, cosicchè potrai costruire il gioco tu stesso.

### Prerequisiti {#prerequisites}

Presupponiamo che tua abbia familiarità con HTML e JavaScript, ma dovresti comunque essere in grado di seguire anche se provieni da un diverso linguaggio di programmazione. Inoltre, presupponiamo che tu abbia familiarità con concetti di programmazione come funzioni, oggetti, arrays e classi, anche se queste ultime hanno minore importanza in questo contesto.

Se vuoi rinfrescare o dare un primo sguardo alle basi in JavaScript, ti raccomandiamo la lettura di [questa guida](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Tieni presente che usiamo anche alcune funzionalità di ES6 -- una recente versione di JavaScript. In questo tutorial, useremo [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [classi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), e [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const). Puoi usare [Babel REPL](babel://es5-syntax-example) per vedere il codice compilato a partire da ES6.

## Setup per il Tutorial {#setup-for-the-tutorial}

Ci sono due modi per completare questo tutorial: puoi scrivere codice nel tuo browser, o puoi configurare un ambiente di sviluppo locale sul tuo computer.

### Opzione 1: Scrivi Codice nel Browser {#setup-option-1-write-code-in-the-browser}

Questo è il metodo più veloce!

Prima di tutto, apri questo **[Codice Iniziale](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** in un nuovo tab. Il nuovo tab dovrebbe mostrare una nuova partita di tic-tac-toe (tris) e il codice React. In questo tutorial modificheremo quel codice.

Se hai scelto questa opzione, puoi saltare la seconda opzione ed il relativo setup ed andare direttamente alla sezione [Panoramica](#overview) per una panoramica di React.

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
>**Non eliminare l'intera cartella `src`, rimuovi solo i files al suo interno.** We'll replace the default source files with examples for this project in the next step.

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

3. Aggiungi queste tree linee all'inizio del file `index.js` nella cartella `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Adesso se esegui `npm start` nella cartella del progetto ed apri `http://localhost:3000` nel tuo browser, dovresti vedere una nuova partita di tic-tac-toe (tris).

Ti raccomandiamo di seguire [queste istruzioni](https://babeljs.io/docs/editors/) per configurare l'evidenziazione della sintassi nel tuo editor.

</details>

### Aiuto, Non Funziona! {#help-im-stuck}

Se sei bloccato/a, dai uno sguardo alle [risorse di supporto della comunità](/community/support.html). In particolare, [Reactiflux Chat](https://discord.gg/0ZcbPKXt5bZjGY5n) è un ottimo modo per ricevere aiuto velocemente. Se non ricevi una risposta, o se non riesci a proseguire, cortesemente apri una issue e ti aiuteremo da li.

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

JSX ha in se tutte le funzionalità di JavaScript. Puoi inserire *qualunque* espressione JavaScript all'interno di parentesi in JSX. Ogni elemento React è un oggetto JavaScript che puoi salvare in una variabile e/o passare di quà e di là nel tuo programma.

Il componente `ShoppingList` di prima visualizza solo componenti DOM predefiniti, come `<div />` e `<li />`. Ma puoi comporre e visualizzare anche componenti React personalizzati al suo interno. Per esempio, adesso possiamo riferifci all'intera lista della spesa scrivendo `<ShoppingList />`. Ogni componente React è incapsulato e può operare indipendentemente; ciò ci permette di costruire UI complesse a partire da semplici componenti.

## Uno Sguardo al Codice Iniziale {#inspecting-the-starter-code}

Se hai scelto di lavorare sul tutorial **nel tuo browser,** apri questo codice in un nuovo tab: **[Codice Iniziale](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Se invece vuoi lavorare **localmente,** apri `src/index.js` nella cartella del progetto (hai già aperto questo file durante il [setup](#setup-option-2-local-development-environment)).

Il Codice Iniziale è la base di quello che vogliamo costruire. Abbiamo già fornito gli stili CSS cosicchè ti potrai concentrare solo sull'imparare React e programmare il gioco tic-tac-toe (tris).

Ispezionando il codice, noterai che ci sono tre componenti React:

* Square
* Board
* Game

Il componente Square (quadrato) visualizza un singolo `<button>` mentre Board (tavola) 9 quadrati. Il componente Game (partita) visualizza una tavola con valori segnaposto che modificheremo più tardi. Attualmente, non abbiamo componenti interattivi.

### Passare Dati Mediante Props {#passing-data-through-props}

Giusto per bagnarci i piedi, proviamo a passare qualche dato dal componente Board al nostro componente Square.

Nel metodo `renderSquare` in Board, modifica il codice per passare una prop chiamata `value` allo Square:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
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

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Congratulazioni! Hai appena "passato una prop" da un componente genitore Board al suo componente figlio Square. Nelle applicazioni React, è così che le informazioni circolano, dai genitori ai figli.

### Creare un Componente Interattivo {#making-an-interactive-component}

Andiamo a riempire il componente Square con una "X" quando lo clicchiamo. 
Prima di tutto, modifichiamo il tag `button` che è ritornato dalla funzione `render()` del componente Square:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Adesso, se clicchiamo su uno Square, riceviamo un alert nel browser.

>Nota Bene
>
>Al fine di risparmiarci qualche carattere e per evitare i problemi legati allo [strano comportamento di `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), useremo la sintassi [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) per event handlers (funzioni richiamate quando il relativo evento accade) qui e poi di seguito:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>Nota come con `onClick={() => alert('click')}`, stiamo passando *una funzione* come prop `onClick`. Essa viene eseguita a seguito di un click. Dimenticare `() =>` e scrivere `onClick={alert('click')}` è un errore comune, e risulterebbe nel lanciare l'alert ogni qual volta il componente viene ridisegnato (chiamata a `render()`).

Come passo successivo, vogliamo far si che il componente Square si "ricordi" di essere stato cliccato, e che visualizzi il segno "X" al suo interno. Per "ricordare" cose, i componenti usano **state**.

I componenti React possono avere stato impostando `this.state` nei loro costruttori. `this.state` dovrebbe essere considerato privato (in termini di accesso) al componente React nel quale è definito. Andiamo a salvare il valore attuale di Square in `this.state`, e cambiamolo quando Square viene cliccato.

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
      <button className="square" onClick={() => alert('click')}>
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
* Sostituisci l'event handler `() => alert()` con `() => this.setState({value: 'X'})`.
* Aggiungi le props `className` e `onClick` come linee separate per miglior leggibilità.

Successivamente alle nostre modifiche, il tag `<button>` ritornato dal metodo `render` di Square sarà:

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

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

###Developer Tools (Strumenti per lo Sviluppatore) {#developer-tools}

L'estensione React Devtools per [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) e [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) ti permette di ispezionare l'albero dei componenti React nei developer tools del tuo browser.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools ti permette di vedere le props e lo state dei tuoi componenti React.

Dopo aver installato React DevTools, clicca col tasto destro del mouse su qualunque elemento di una pagina, poi su "Ispeziona elemento" per aprire i developer tools, ed il tab React apparirà come ultimo tab sulla destra.

**Comunque, nota che ci sono alcuni passi aggiuntivi per farli funzionare con CodePen:**

1. Autenticati o registrati e conferma la tua email (necessario per prevenire spam).
2. Clicca sul pulsante "Fork".
3. Clicca su "Change View" e seleziona "Debug mode".
4. Nel nuovo tab appena aperto, il tab React dovrebbe essere presente nei Developer Tools.

## Completare il Gioco {#completing-the-game}

Adesso che abbiamo i pezzi principali del nostro gioco. Per completarlo, dobbiamo alternare il piazzamento delle "X" e delle "O" sulla tavola, inoltre, abbiamo bisogno di un modo per determinare un vincitore.

### Elevare lo Stato {#lifting-state-up}

Correntemente, ogni componente Square mantiene lo stato del gioco. Per poter determinare un vincitore, dobbiamo mantenere il valore di ogni quadrato nello stesso posto.

Possiamo pensare che Board debba solo richiedere ad ogni Square il relativo stato. Anche se questo approccio è possibile in React, lo scoraggiamo in quanto il codice diventa difficile da capire, suscettibile ai bugs e difficile da applicarvi tecniche di [refactoring](https://it.wikipedia.org/wiki/Refactoring). Invece, l'approccio migliore è quello di mantenere lo stato del gioco nel componente padre Board invece che in ogni Square. Il componente Board può riportare ad ogni Square cosa visualizzare semplicemente passando una prop, [così come abbiamo fatto quando abbiamo passato un numero ad ogni Square](#passing-data-through-props).

**Per recuperare dati dai componenti figli a partire dal componente padre, o per far comunicare tra di loro due componenti figli, bisogna definire uno stato condiviso nel componente padre. Quest'ultimo può passare di nuovo lo stato in basso, ai figli, usando props; ciò mantiene i componenti figli in sincronia tra di loro ed ovviamente con il componente padre.**

Elevare lo stato nel componente padre è un processo comune quando i componenti React subiscono refactoring -- proviamo già che ci siamo. Cominciamo aggiungendo un costruttore a Board ed impostandone lo stato iniziale così da contenere un array di 9 nulls. Questi 9 nulls corrispondono ai 9 quadrati:

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

Quando riempiremo la tavola più tardi, risulterà più o meno così:

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

All'inizio, abiamo [passato la prop `value` verso il basso](#passing-data-through-props) da Board per visualizzare i numeri da 0 a 8 in ogni Square. In un altro passo, abbiamo sostituito i numeri con il segno "X" [determinato dallo stato interno di Square](#making-an-interactive-component). Ecco perchè al momento Square ignora la prop `value` che riceve da Board.

Andiamo ad usare di nuovo questo meccanismo di passaggio di props. Modifichiamo Board per far si che ogni Square riceva il proprio valore corrente (`'X'`, `'O'`, o `null`). Abbiamo già definito l'array `squares` nel costruttore di Board, adesso dobbiamo cambiare anche il metodo `renderSquare` di Board facendo si che possa leggere dall'array:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Each Square will now receive a `value` prop that will either be `'X'`, `'O'`, or `null` for empty squares.

Next, we need to change what happens when a Square is clicked. The Board component now maintains which squares are filled. We need to create a way for the Square to update the Board's state. Since state is considered to be private to a component that defines it, we cannot update the Board's state directly from Square.

To maintain the Board's state's privacy, we'll pass down a function from the Board to the Square. This function will get called when a Square is clicked. We'll change the `renderSquare` method in Board to:

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
>We split the returned element into multiple lines for readability, and added parentheses so that JavaScript doesn't insert a semicolon after `return` and break our code.

Now we're passing down two props from Board to Square: `value` and `onClick`. The `onClick` prop is a function that Square can call when clicked. We'll make the following changes to Square:

* Replace `this.state.value` with `this.props.value` in Square's `render` method
* Replace `this.setState()` with `this.props.onClick()` in Square's `render` method
* Delete the `constructor` from Square because Square no longer keeps track of the game's state

After these changes, the Square component looks like this:

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

When a Square is clicked, the `onClick` function provided by the Board is called. Here's a review of how this is achieved:

1. The `onClick` prop on the built-in DOM `<button>` component tells React to set up a click event listener.
2. When the button is clicked, React will call the `onClick` event handler that is defined in Square's `render()` method.
3. This event handler calls `this.props.onClick()`. The Square's `onClick` prop was specified by the Board.
4. Since the Board passed `onClick={() => this.handleClick(i)}` to Square, the Square calls `this.handleClick(i)` when clicked.
5. We have not defined the `handleClick()` method yet, so our code crashes.

>Nota Bene
>
>The DOM `<button>` element's `onClick` attribute has a special meaning to React because it is a built-in component. For custom components like Square, the naming is up to you. We could name the Square's `onClick` prop or Board's `handleClick` method differently. In React, however, it is a convention to use `on[Event]` names for props which represent events and `handle[Event]` for the methods which handle the events.

When we try to click a Square, we should get an error because we haven't defined `handleClick` yet. We'll now add `handleClick` to the Board class:

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

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

After these changes, we're again able to click on the Squares to fill them. However, now the state is stored in the Board component instead of the individual Square components. When the Board's state changes, the Square components re-render automatically. Keeping the state of all squares in the Board component will allow it to determine the winner in the future.

Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they're clicked. In React terms, the Square components are now **controlled components**. The Board has full control over them.

Note how in `handleClick`, we call `.slice()` to create a copy of the `squares` array to modify instead of modifying the existing array. We will explain why we create a copy of the `squares` array in the next section.

### Why Immutability Is Important {#why-immutability-is-important}

In the previous code example, we suggested that you use the `.slice()` operator to create a copy of the `squares` array to modify instead of modifying the existing array. We'll now discuss immutability and why immutability is important to learn.

There are generally two approaches to changing data. The first approach is to *mutate* the data by directly changing the data's values. The second approach is to replace the data with a new copy which has the desired changes.

#### Data Change with Mutation {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Data Change without Mutation {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
// var newPlayer = {...player, score: 2};
```

The end result is the same but by not mutating (or changing the underlying data) directly, we gain several benefits described below.

#### Complex Features Become Simple {#complex-features-become-simple}

Immutability makes complex features much easier to implement. Later in this tutorial, we will implement a "time travel" feature that allows us to review the tic-tac-toe game's history and "jump back" to previous moves. This functionality isn't specific to games -- an ability to undo and redo certain actions is a common requirement in applications. Avoiding direct data mutation lets us keep previous versions of the game's history intact, and reuse them later.

#### Detecting Changes {#detecting-changes}

Detecting changes in mutable objects is difficult because they are modified directly. This detection requires the mutable object to be compared to previous copies of itself and the entire object tree to be traversed.

Detecting changes in immutable objects is considerably easier. If the immutable object that is being referenced is different than the previous one, then the object has changed.

#### Determining When to Re-render in React {#determining-when-to-re-render-in-react}

The main benefit of immutability is that it helps you build _pure components_ in React. Immutable data can easily determine if changes have been made which helps to determine when a component requires re-rendering.

You can learn more about `shouldComponentUpdate()` and how you can build *pure components* by reading [Optimizing Performance](/docs/optimizing-performance.html#examples).

### Function Components {#function-components}

We'll now change the Square to be a **function component**.

In React, **function components** are a simpler way to write components that only contain a `render` method and don't have their own state. Instead of defining a class which extends `React.Component`, we can write a function that takes `props` as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

Replace the Square class with this function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

We have changed `this.props` to `props` both times it appears.

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Nota Bene
>
>When we modified the Square to be a function component, we also changed `onClick={() => this.props.onClick()}` to a shorter `onClick={props.onClick}` (note the lack of parentheses on *both* sides). In a class, we used an arrow function to access the correct `this` value, but in a function component we don't need to worry about `this`.

### Taking Turns {#taking-turns}

We now need to fix an obvious defect in our tic-tac-toe game: the "O"s cannot be marked on the board.

We'll set the first move to be "X" by default. We can set this default by modifying the initial state in our Board constructor:

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

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. We'll update the Board's `handleClick` function to flip the value of `xIsNext`:

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

With this change, "X"s and "O"s can take turns. Let's also change the "status" text in Board's `render` so that it displays which player has the next turn:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After applying these changes, you should have this Board component:

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

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declaring a Winner {#declaring-a-winner}

Now that we show which player's turn is next, we should also show when the game is won and there are no more turns to make. We can determine a winner by adding this helper function to the end of the file:

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

We will call `calculateWinner(squares)` in the Board's `render` function to check if a player has won. If a player has won, we can display text such as "Winner: X" or "Winner: O". We'll replace the `status` declaration in Board's `render` function with this code:

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
      // the rest has not changed
```

We can now change the Board's `handleClick` function to return early by ignoring a click if someone has won the game or if a Square is already filled:

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

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So *you're* probably the real winner here.

## Adding Time Travel {#adding-time-travel}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a History of Moves {#storing-a-history-of-moves}

If we mutated the `squares` array, implementing time travel would be very difficult.

However, we used `slice()` to create a new copy of the `squares` array after every move, and [treated it as immutable](#why-immutability-is-important). This will allow us to store every past version of the `squares` array, and navigate between the turns that have already happened.

We'll store the past `squares` arrays in another array called `history`. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
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

Now we need to decide which component should own the `history` state.

### Lifting State Up, Again {#lifting-state-up-again}

We'll want the top-level Game component to display a list of past moves. It will need access to the `history` to do that, so we will place the `history` state in the top-level Game component.

Placing the `history` state into the Game component lets us remove the `squares` state from its child Board component. Just like we ["lifted state up"](#lifting-state-up) from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the `history`.

First, we'll set up the initial state for the Game component within its constructor:

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

Next, we'll have the Board component receive `squares` and `onClick` props from the Game component. Since we now have a single click handler in Board for many Squares, we'll need to pass the location of each Square into the `onClick` handler to indicate which Square was clicked. Here are the required steps to transform the Board component:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

The Board component now looks like this:

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

We'll update the Game component's `render` function to use the most recent history entry to determine and display the game's status:

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

Since the Game component is now rendering the game's status, we can remove the corresponding code from the Board's `render` method. After refactoring, the Board's `render` function looks like this:

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

Finally, we need to move the `handleClick` method from the Board component to the Game component. We also need to modify `handleClick` because the Game component's state is structured differently. Within the Game's `handleClick` method, we concatenate new history entries onto `history`.

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
>Unlike the array `push()` method you might be more familiar with, the `concat()` method doesn't mutate the original array, so we prefer it.

At this point, the Board component only needs the `renderSquare` and `render` methods. The game's state and the `handleClick` method should be in the Game component.

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Showing the Past Moves {#showing-the-past-moves}

Since we are recording the tic-tac-toe game's history, we can now display it to the player as a list of past moves.

We learned earlier that React elements are first-class JavaScript objects; we can pass them around in our applications. To render multiple items in React, we can use an array of React elements.

In JavaScript, arrays have a [`map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that is commonly used for mapping data to other data, for example:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
``` 

Using the `map` method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves.

Let's `map` over the `history` in the Game's `render` method:

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

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

For each move in the tic-tac-toes's game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a method called `this.jumpTo()`. We haven't implemented the `jumpTo()` method yet. For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's discuss what the above warning means.

### Picking a Key {#picking-a-key}

When we render a list, React stores some information about each rendered list item. When we update a list, React needs to determine what has changed. We could have added, removed, re-arranged, or updated the list's items.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

In addition to the updated counts, a human reading this would probably say that we swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what we intended. Because React cannot know our intentions, we need to specify a *key* property for each list item to differentiate each list item from its siblings. One option would be to use the strings `alexa`, `ben`, `claudia`. If we were displaying data from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved. Keys tell React about the identity of each component which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React (along with `ref`, a more advanced feature). When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it belongs in `props`, `key` cannot be referenced using `this.props.key`. React automatically uses `key` to decide which components to update. A component cannot inquire about its `key`.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the warning but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.


### Implementing Time Travel {#implementing-time-travel}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the Game component's `render` method, we can add the key as `<li key={move}>` and React's warning about keys should disappear:

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

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Clicking any of the list item's buttons throws an error because the `jumpTo` method is undefined. Before we implement `jumpTo`, we'll add `stepNumber` to the Game component's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

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

Next, we'll define the `jumpTo` method in Game to update that `stepNumber`. We also set `xIsNext` to true if the number that we're changing `stepNumber` to is even:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

We will now make a few changes to the Game's `handleClick` method which fires when you click on a square.

The `stepNumber` state we've added reflects the move displayed to the user now. After we make a new move, we need to update `stepNumber` by adding `stepNumber: history.length` as part of the `this.setState` argument. This ensures we don't get stuck showing the same move after a new one has been made.

We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect.

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

Finally, we will modify the Game component's `render` method from always rendering the last move to rendering the currently selected move according to `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

If we click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

**[Visualizza tutto il codice a questo punto](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Wrapping Up {#wrapping-up}

Congratulations! You've created a tic-tac-toe game that:

* Lets you play tic-tac-toe,
* Indicates when a player has won the game,
* Stores a game's history as a game progresses,
* Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: **[Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
