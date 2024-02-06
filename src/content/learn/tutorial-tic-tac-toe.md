---
title: 'Tutorial: Tic-Tac-Toe'
---

<Intro>

Costruirai un piccolo gioco di tic-tac-toe (tris) durante questo tutorial. Questo tutorial non presuppone alcuna conoscenza esistente di React. Le tecniche che imparerai nel tutorial sono fondamentali per la creazione di qualsiasi app React e comprenderle ti darà una profonda comprensione di React.

</Intro>

<Note>

Questo tutorial è progettato per le persone che preferiscono **imparare facendo** e vogliono provare rapidamente a creare qualcosa di tangibile. Se preferisci apprendere ogni concetto passo dopo passo, inizia con [Descrivere la UI.](/learn/describing-the-ui)

</Note>

Il tutorial è diviso in diverse sezioni:

- [Configurazione per il tutorial](#setup-for-the-tutorial) ti darà **un punto di partenza** per seguire il tutorial.
- [Panoramica](#overview) ti insegnerà **le fondamenta** di React: componenti, props e state.
- [Completare il gioco](#completing-the-game) ti insegnerà le **tecniche più comuni** nello sviluppo React.
- [Aggiunga del viaggio nel tempo](#adding-time-travel) ti darà una **visione più approfondita** dei punti di forza unici di React.

### Che cosa costruirai? {/*what-are-you-building*/}

In questo tutorial, costruirai un gioco interattivo di tic-tac-toe con React.

Puoi vedere come sarà quando avrai finito qui:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Se il codice non ha ancora senso per te, o se non hai familiarità con la sintassi del codice, non preoccuparti! L'obiettivo di questo tutorial è di aiutarti a comprendere React e la sua sintassi.

Ti consigliamo di dare un'occhiata al gioco di tic-tac-toe sopra prima di continuare con il tutorial. Una delle caratteristiche che noterai è che c'è un elenco numerato a destra del tabellone del gioco. Questo elenco ti fornisce una cronologia di tutte le mosse che si sono verificate nel gioco e viene aggiornato man mano che il gioco procede.

Una volta che hai giocato con il gioco di tic-tac-toe finito, continua a scorrere. In questo tutorial inizierai con un modello più semplice. Il nostro prossimo passo è prepararti in modo che tu possa iniziare a costruire il gioco.

## Configurazione per il tutorial {/*setup-for-the-tutorial*/}

Nel live editor di codice di seguito, fai click su **Fork** nell'angolo in alto a destra per aprire l'editor in una nuova scheda utilizzando il sito CodeSandbox. CodeSandbox ti consente di scrivere codice nel tuo browser e visualizzare in anteprima come i tuoi utenti vedranno l'app che hai creato. La nuova scheda dovrebbe visualizzare un quadrato vuoto e il codice iniziale per questo tutorial.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Puoi anche seguire questo tutorial usando il tuo ambiente di sviluppo locale. Per fare ciò, è necessario:

<<<<<<< HEAD
1. Installa [Node.js](https://nodejs.org/it)
1. Nella scheda CodeSandbox che hai aperto prima, premi il pulsante nell'angolo in alto a sinistra per aprire il menu, quindi scegli **File > Export to Zip** in quel menu per scaricare un archivio dei file in locale
1. Decomprimi l'archivio, quindi apri un terminale e `cd` nella cartella che hai decompresso.
1. Installa le dipendenze con `npm install`
1. Esegui `npm start` per avviare un server locale e segui le istruzioni per visualizzare il codice in esecuzione in un browser
=======
1. Install [Node.js](https://nodejs.org/en/)
1. In the CodeSandbox tab you opened earlier, press the top-left corner button to open the menu, and then choose **Download Sandbox** in that menu to download an archive of the files locally
1. Unzip the archive, then open a terminal and `cd` to the directory you unzipped
1. Install the dependencies with `npm install`
1. Run `npm start` to start a local server and follow the prompts to view the code running in a browser
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

Se rimani bloccato, non lasciare che questo ti fermi! Segui invece online e riprova a configurare in locale più tardi.

</Note>

## Panoramica {/*overview*/}

Ora che sei pronto, vediamo una panoramica di React!

### Ispezione del codice iniziale {/*inspecting-the-starter-code*/}

In CodeSandbox vedrai tre sezioni principali:

![CodeSandbox con codice iniziale](../images/tutorial/react-starter-code-codesandbox.png)

1. La sezione _Files_ con una lista di file come `App.js`, `index.js`, `styles.css` e una cartella chiamata `public`
1. L'_editor del codice_ dove vedrai il codice sorgente del tuo file selezionato
1. La sezione _browser_ dove vedrai come il codice che hai scritto sarà visualizzato

Il file `App.js` dovrebbe essere selezionato nella sezione _Files_. Il contenuto di quel file nell'_editor del codice_ dovrebbe essere:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

La sezione _browser_ dovrebbe visualizzare un quadrato con una X all'interno come questo:

![quadrato riempito con x](../images/tutorial/x-filled-square.png)

Adesso diamo un'occhiata ai file nel codice iniziale.

#### `App.js` {/*appjs*/}

Il codice in `App.js` crea un _componente_. In React, un componente è una pezzo di codice riutilizzabile che rappresenta una parte di un'interfaccia utente. I componenti sono usati per renderizzare, gestire e aggiornare gli elementi di UI nella tua applicazione. Diamo un'occhiata al componente riga per riga per vedere cosa sta succedendo:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

La prima riga definisce una funzione chiamata `Square`. La keyword di JavaScript `export` rende questa funzione accessibile dall'esterno di questo file. La keyword `default` dice agli altri file che stanno usando il tuo codice che è la funzione principale nel tuo file.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

La seconda riga restituisce un pulsante. La keyword di JavaScript `return` significa che tutto ciò che viene dopo viene restituito come valore al chiamante della funzione. `<button>` è un *elemento JSX*. Un elemento JSX è una combinazione di codice JavaScript e tag HTML che descrive ciò che desideri visualizzare. `className="square"` è una proprietà del pulsante o *prop* che dice a CSS come dare uno stile al pulsante. `X` è il testo visualizzato all'interno del pulsante e `</button>` chiude l'elemento JSX per indicare che qualsiasi contenuto successivo non deve essere inserito all'interno del pulsante.

#### `styles.css` {/*stylescss*/}

Fai click sul file denominato `styles.css` nella sezione _Files_ di CodeSandbox. Questo file definisce gli stili per la tua app React. I primi due _selettori CSS_ (`*` e `body`) definiscono lo stile di grandi parti della tua app mentre il selettore `.square` definisce lo stile di qualsiasi componente in cui la proprietà `className` è impostata su `square`. Nel tuo codice, ciò corrisponderebbe al pulsante del tuo componente Square nel file `App.js`.

#### `index.js` {/*indexjs*/}

Fai click sul file denominato `index.js` nella sezione _Files_ di CodeSandbox. Non modificherai questo file durante il tutorial, ma è il ponte tra il componente che hai creato nel file `App.js` e il browser web.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

<<<<<<< HEAD
Le righe 1-5 mettono insieme tutti i pezzi necessari:
=======
Lines 1-5 bring all the necessary pieces together: 
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

* React
* La libreria di React per parlare con il browser web (React DOM)
* gli stili per i tuoi componenti
* il componente che hai creato in `App.js`.

Il resto del file mette insieme tutti i pezzi e inserisce il prodotto finale all'interno di `index.html`nella cartella `public`.

### Costruire il tabellone {/*building-the-board*/}

Torniamo a `App.js`. Qui è dove trascorrerai il resto del tutorial.

Attualmente il tabellone è solo un quadrato, ma te ne servono nove! Se provi a copiare e incollare il tuo quadrato per creare due quadrati in questo modo:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Otterrai questo errore:

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX Fragment `<>...</>`?

</ConsoleBlock>

I componenti React devono restituire un singolo elemento JSX e non multipli elementi JSX adiacenti come due pulsanti. Per risolvere questo problema puoi usare i *Fragments* (`<>` e `</>`) per avvolgere più elementi JSX adiacenti in questo modo:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Adesso dovresti vedere:

![due quadrati riempiti con x](../images/tutorial/two-x-filled-squares.png)

Grande! Ora devi solo copiare e incollare un po' di volte per aggiungere nove quadrati e...

![nove quadrati in una riga riempiti con x](../images/tutorial/nine-x-filled-squares.png)

Oh no! I quadrati sono tutti in una singola riga, non in una griglia come necessario per il nostro tabellone. Per risolvere questo problema dovrai raggruppare i quadrati in righe con `div` e aggiungere alcune classi CSS. Già che ci sei, assegnerai ad ogni quadrato un numero per assicurarti di sapere dove viene visualizzato ogni quadrato.

Nel file `App.js`, modifica il componente `Square` in modo che assomigli a questo:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

Il CSS definito in `styles.css` stilizza i div con il `className` di `board-row`. Adesso che hai raggruppato i tuoi componenti in righe con i `div` stilizzati, hai il tuo tabellone di tic-tac-toe:

![tabellone di tic-tac-toe riempito con numeri da 1 a 9](../images/tutorial/number-filled-board.png)

Ma ora hai un problema. Il tuo componente chiamato `Square`, in realtà non è più un quadrato. Risolviamo il problema cambiando il nome in `Board`:

```js {1}
export default function Board() {
  //...
}
```

A questo punto il tuo codice dovrebbe essere simile a questo:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Psssst... C'è molto da scrivere! Puoi copiare e incollare il codice da questa pagina. Tuttavia, se sei pronto per una piccola sfida, ti consigliamo di copiare solo il codice che hai scritto manualmente almeno una volta tu stesso.

</Note>

### Passare dati tramite props {/*passing-data-through-props*/}

Successivamente, vorrai cambiare il valore di un quadrato da vuoto a "X" quando l'utente clicca su di esso. Con il modo in cui hai costruito il tabellone finora, dovresti copiare e incollare il codice che aggiorna il quadrato nove volte (una volta per ogni quadrato che hai)! Invece di copiare e incollare, l'architettura dei componenti di React ti consente di creare un componente riutilizzabile per evitare codice duplicato e disordinato.

Per prima cosa, copierai la linea che definisce il tuo primo quadrato (`<button className="square">1</button>`) dal tuo componente `Board` in un nuovo componente `Square`:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Quindi aggiornerai il componente Board per eseguire il rendering del componente `Square` utilizzando la sintassi JSX:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Nota come, a differenza dei `div` del browser, i tuoi componenti `Board` e `Square` devono iniziare con una lettera maiuscola.

Diamo un'occhiata:

![tabellone riempito di uno](../images/tutorial/board-filled-with-ones.png)

Oh no! Hai perso le caselle numerate che avevi prima. Ora ogni quadrato dice "1". Per risolvere questo problema, userai le *props* per passare il valore che ogni quadrato dovrebbe avere dal componente genitore (`Board`) al suo figlio (`Square`).

Aggiorna il componente `Square` per leggere la prop `value` che passerai da `Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` indica che al componente Square può essere passata una prop chiamata `value`.

Ora vuoi visualizzare quel `value` invece di `1` all'interno di ogni quadrato. Prova a farlo in questo modo:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Oops, questo non è ciò che volevi:

![tabellone riempito di valori](../images/tutorial/board-filled-with-value.png)

Volevi renderizzare la variabile JavaScript chiamata `value` dal tuo componente, non la parola "value". Per "scappare in JavaScript" da JSX, hai bisogno delle parentesi graffe. Aggiungi le parentesi graffe attorno a `value` in JSX in questo modo:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Per ora, dovresti vedere un tabellone vuoto:

![tabellone vuoto](../images/tutorial/empty-board.png)

Questo perché il componente `Board` non ha ancora passato la prop `value` a ciascun componente `Square` che renderizza. Per risolvere aggiungerai la prop `value` a ciascun componente `Square` renderizzato dal componente `Board`:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Ora dovresti vedere di nuovo una griglia di numeri:

![tabellone di tic-tac-toe riempito di numeri da 1 a 9](../images/tutorial/number-filled-board.png)

Il tuo codice aggiornato dovrebbe assomigliare a questo:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Creazione di un componente interattivo {/*making-an-interactive-component*/}

Riempiamo il componente `Square` con una `X` quando fai click su di esso. Dichiara una funzione chiamata `handleClick` all'interno di `Square`. Quindi, aggiungi `onClick` alle props dell'elemento JSX del pulsante restituito da `Square`:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Se fai click su un quadrato ora, dovresti vedere un log che dice `"clicked!"` nella scheda _Console_ nella parte inferiore della sezione _Browser_ in CodeSandbox. Facendo click sul quadratino più di una volta verrà loggato nuovamente `"clicked!"`. I log ripetuti della console con lo stesso messaggio non creeranno più righe nella console. Vedrai invece un contatore incrementale accanto al tuo primo log `"clicked!"`.

<Note>

Se stai seguendo questo tutorial utilizzando il tuo ambiente di sviluppo locale, devi aprire la Console del tuo browser. Ad esempio, se utilizzi il browser Chrome, puoi visualizzare la Console con la scorciatoia da tastiera **Shift + Ctrl + J** (su Windows/Linux) o **Option + ⌘ + J** (su macOS).

</Note>

Come passaggio successivo, vuoi che il componente Square "ricordi" che è stato cliccato e lo riempia con un segno "X". Per "ricordare" le cose, i componenti usano lo *state*.

React fornisce una funzione speciale chiamata `useState` che puoi chiamare dal tuo componente per fargli "ricordare" le cose. Memorizziamo il valore corrente di `Square` nello state e cambiamolo quando si fa click su `Square`.

Importa `useState` nella parte superiore del file. Rimuovi la prop `value` dal componente `Square`. Invece, aggiungi una nuova riga all'inizio di `Square` che chiama `useState`. Chiedigli di restituire una variabile state chiamata `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` memorizza il valore e `setValue` è una funzione che può essere utilizzata per modificare il valore. Il `null` passato a `useState` viene utilizzato come valore iniziale per questa variabile di state, quindi `value` qui inizia uguale a `null`.

Poiché il componente `Square` non accetta più props, rimuoverai la prop `value` da tutti e nove i componenti Square creati dal componente Board:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Ora cambierai `Square` per visualizzare una "X" quando si fa click su di esso. Sostituisci l'event handler `console.log("clicked!");` con `setValue('X');`. Ora il tuo componente `Square` ha questo aspetto:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Chiamando questa funzione `set` da un handler `onClick`, stai dicendo a React di ri-renderizzare quello `Square` ogni volta che viene fatto click sul suo `<button>`. Dopo l'aggiornamento, il `value` di `Square` sarà `'X'`, quindi vedrai la "X" sul tabellone di gioco. Fai click su qualsiasi Square e dovrebbe apparire una "X":

![aggiungere le x al tabellone](../images/tutorial/tictac-adding-x-s.gif)

Ogni Square ha il suo state: il `value` memorizzato in ogni Square è completamente indipendente dagli altri. Quando chiami una funzione `set` in un componente, React aggiorna automaticamente anche i componenti figlio all'interno.

Dopo aver apportato le modifiche di cui sopra, il tuo codice sarà simile al seguente:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### React Developer Tools {/*react-developer-tools*/}

React DevTools ti consente di controllare le props e lo state dei tuoi componenti React. Puoi trovare la scheda React DevTools nella parte inferiore della sezione _browser_ in CodeSandbox:

![React DevTools in CodeSandbox](../images/tutorial/codesandbox-devtools.png)

Per ispezionare un componente in particolare sullo schermo, usa il pulsante nell'angolo in alto a sinistra di React DevTools:

![Selezionare componenti sulla pagina con React DevTools](../images/tutorial/devtools-select.gif)

<Note>

Per lo sviluppo locale, React DevTools è disponibile come estensione del browser [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons .mozilla.org/en-US/firefox/addon/react-devtools/) ed [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil). Installalo e la scheda *Components* apparirà negli Strumenti per Sviluppatori del tuo browser per i siti che utilizzano React.

</Note>

## Completare il gioco {/*completing-the-game*/}

A questo punto, hai tutti gli elementi di base per il tuo gioco tic-tac-toe. Per avere un gioco completo, ora devi alternare il posizionamento di "X" e "O" sul tabellone e hai bisogno di un modo per determinare un vincitore.

### Sollevare lo state {/*lifting-state-up*/}

Attualmente, ogni componente `Square` mantiene una parte dello state del gioco. Per verificare la presenza di un vincitore nel gioco tic-tac-toe, la `Board` dovrebbe in qualche modo conoscere lo state di ciascuno dei 9 componenti `Square`.

Come ti approcceresti a questo? All'inizio, potresti immaginare che la `Board` debba "chiedere" a ogni `Square` il suo state. Sebbene questo approccio sia tecnicamente possibile in React, lo scoraggiamo perché il codice diventa difficile da comprendere, suscettibile di bug e difficile da effettuarne il refactor. Invece, l'approccio migliore è memorizzare lo state del gioco nel componente genitore `Board` invece che in ogni `Square`. Il componente `Board` può dire a ogni `Square` cosa visualizzare passando una prop, come hai fatto quando hai passato un numero a ogni Square.

**Per raccogliere dati da più figli o per far comunicare tra loro due componenti figli, dichiara invece lo state condiviso nel loro componente genitore. Il componente genitore può ritrasmettere quello state ai figli tramite props. Ciò mantiene i componenti figli sincronizzati tra loro e con il genitore.**

Il sollevamento dello state in un componente genitore è comune quando i componenti React vengono sottoposti a refactoring.

Cogliamo l'occasione per provarlo. Modifica il componente `Board` in modo che dichiari una variabile state denominata `squares` che di default è un array di 9 null corrispondenti ai 9 quadrati:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` crea un array con nove elementi e imposta ciascuno di essi su `null`. La chiamata `useState()` dichiara una variabile di state `squares` inizialmente impostata su quell'array. Ogni voce nell'array corrisponde al valore di un quadrato. Quando riempirai il tabellone più tardi, l'array `squares` avrà questo aspetto:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Ora il tuo componente `Board` deve passare la prop `value` a ogni `Square` di cui esegue il rendering:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

Successivamente, modificherai il componente `Square` per ricevere la prop `value` dal componente Board. Ciò richiederà la rimozione del tracciamento nello state del componente Square di `value` e della prop `onClick` del pulsante:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

A questo punto dovresti vedere un tabellone di tic-tac-toe vuoto:

![tabellone vuoto](../images/tutorial/empty-board.png)

E il tuo codice dovrebbe somigliare a questo:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Ogni Square ora riceverà una prop `value` che sarà `'X'`, `'O'` o `null` per i quadrati vuoti.

Successivamente, è necessario modificare ciò che accade quando si fa click su uno `Square`. Il componente `Board` ora mantiene quali caselle sono riempite. Dovrai creare un modo per `Square` di aggiornare lo state di `Board`. Poiché lo state è privato di un componente che lo definisce, non è possibile aggiornare lo state di `Board` direttamente da `Square`.

Invece, passerai una funzione dal componente `Board` al componente `Square` e farai in modo che `Square` chiami quella funzione quando si fa click su un quadrato. Inizierai con la funzione che il componente `Square` chiamerà quando viene cliccato. Chiamerai quella funzione `onSquareClick`:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Successivamente, aggiungerai la funzione `onSquareClick` alle props del componente `Square`:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Ora collegherai la prop `onSquareClick` a una funzione nel componente `Board` che chiamerai `handleClick`. Per collegare `onSquareClick` a `handleClick` passerai una funzione alla prop `onSquareClick` del primo componente `Square`:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

Infine, definirai la funzione `handleClick` all'interno del componente Board per aggiornare l'array `squares` che contiene lo state del tuo tabellone:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

La funzione `handleClick` crea una copia dell'array `squares` (`nextSquares`) con il metodo dell'Array JavaScript `slice()`. Quindi, `handleClick` aggiorna l'array `nextSquares` per aggiungere `X` al primo quadrato (indice `[0]`).

Chiamare la funzione `setSquares` consente a React di sapere che lo stato del componente è cambiato. Questo attiverà un nuovo rendering dei componenti che usano lo state `squares` (`Board`) così come i suoi componenti figli (i componenti `Square` che compongono il tabellone).

<Note>

JavaScript supporta le [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures), il che significa che una funzione interna (ad es. `handleClick`) ha accesso a variabili e funzioni definite in una funzione esterna (ad es. `Board`). La funzione `handleClick` può leggere lo state `squares` e chiamare il metodo `setSquares` perché sono entrambi definiti all'interno della funzione `Board`.

</Note>

Ora puoi aggiungere X al tabellone... ma solo al quadrato in alto a sinistra. La tua funzione `handleClick` è hardcoded per aggiornare l'indice del quadrato in alto a sinistra (`0`). Aggiorniamo `handleClick` per poter aggiornare qualsiasi quadrato. Aggiungi un argomento `i` alla funzione `handleClick` che accetta l'indice del quadrato da aggiornare:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Successivamente, dovrai passare quella `i` a `handleClick`. Potresti provare a impostare la prop `onSquareClick` di square in modo che sia `handleClick(0)` direttamente nel JSX in questo modo, ma non funzionerà:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Ecco perché questo non funziona. La chiamata `handleClick(0)` farà parte della renderizzazione del componente board. Poiché `handleClick(0)` altera lo state del componente board chiamando `setSquares`, l'intero componente board verrà nuovamente renderizzato. Ma questo esegue di nuovo `handleClick(0)`, portando a un ciclo infinito:

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

Perché questo problema non si è verificato prima?

Quando stavi passando `onSquareClick={handleClick}`, stavi passando la funzione `handleClick` come prop. Non lo stavi chiamando! Ma ora stai *chiamando* quella funzione subito--nota le parentesi in `handleClick(0)`--ed è per questo che viene eseguita troppo presto. Non *vuoi* chiamare `handleClick` finché l'utente non fa click!

Potresti risolvere creando una funzione come `handleFirstSquareClick` che chiama `handleClick(0)`, una funzione come `handleSecondSquareClick` che chiama `handleClick(1)` e così via. Dovresti passare (piuttosto che chiamare) queste funzioni come prop come `onSquareClick={handleFirstSquareClick}`. Questo risolverebbe il ciclo infinito.

Tuttavia, definire nove diverse funzioni e assegnare a ciascuna di esse un nome è troppo prolisso. Invece, facciamo così:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

Nota la nuova sintassi `() =>`. Qui, `() => handleClick(0)` è un'*arrow function*, che è un modo più breve per definire le funzioni. Quando si fa click sul quadrato, il codice dopo la `=>` "freccia" verrà eseguito, chiamando `handleClick(0)`.

Ora devi aggiornare gli altri otto quadrati per chiamare `handleClick` dalle arrow function che passi. Assicurati che l'argomento per ogni chiamata di `handleClick` corrisponda all'indice del quadrato corretto:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

Ora puoi nuovamente aggiungere X a qualsiasi quadrato sul tabellone facendo clic su di essi:

![riempire il tabellone con X](../images/tutorial/tictac-adding-x-s.gif)

Ma questa volta tutta la gestione dello state è a carico del componente `Board`!

Ecco come dovrebbe apparire il tuo codice:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Ora che la tua gestione dello state è nel componente `Board`, il componente genitore `Board` passa le props ai componenti figli `Square` in modo che possano essere visualizzati correttamente. Quando si fa click su uno `Square`, il componente figlio `Square` ora chiede al componente padre `Board` di aggiornare lo state del tabellone. Quando lo state di `Board` cambia, sia il componente `Board` che ogni `Square` figlio vengono ri-renderizzati automaticamente. Mantenere lo state di tutti i quadrati nel componente `Board` consentirà in futuro di determinare il vincitore.

Riepiloghiamo cosa succede quando un utente fa click sul quadrato in alto a sinistra del tabellone per aggiungere una `X`:

1. Facendo click sul quadrato in alto a sinistra viene eseguita la funzione che il `button` ha ricevuto come prop `onClick` da `Square`. Il componente `Square` ha ricevuto quella funzione come prop `onSquareClick` da `Board`. Il componente `Board` ha definito quella funzione direttamente nel JSX. Chiama `handleClick` con un argomento `0`.
1. `handleClick` utilizza l'argomento (`0`) per aggiornare il primo elemento dell'array `squares` da `null` a `X`.
1. Lo state `squares` del componente `Board` è stato aggiornato, quindi `Board` e tutti i suoi figli vengono nuovamente renderizzati. Questo fa sì che la prop `value` del componente `Square` con indice `0` cambi da `null` a `X`.

Alla fine l'utente vede che il quadrato in alto a sinistra è cambiato da vuoto ad avere una `X` dopo aver fatto click su di esso.

<Note>

L'attributo `onClick` dell'elemento DOM `<button>` ha un significato speciale per React perché è un componente integrato. Per i componenti personalizzati come Square, la denominazione dipende da te. Potresti dare qualsiasi nome alla prop `onSquareClick` di `Square` o alla funzione `handleClick` di `Board` e il codice funzionerebbe allo stesso modo. In React, è convenzione usare i nomi `onSomething` per props che rappresentano eventi e `handleSomething` per le definizioni della funzione che gestiscono quegli eventi.

</Note>

### Perché l'immutabilità è importante {/*why-immutability-is-important*/}

Nota come in `handleClick`, chiami `.slice()` per creare una copia dell'array `squares` invece di modificare l'array esistente. Per spiegare perché, dobbiamo discutere l'immutabilità e perché l'immutabilità è importante da imparare.

Esistono generalmente due approcci per modificare i dati. Il primo approccio consiste nel _mutare_ i dati modificandone direttamente i valori. Il secondo approccio consiste nel sostituire i dati con una nuova copia che presenta le modifiche desiderate. Ecco come sarebbe se mutassi l'array `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Ora `squares` è ["X", null, null, null, null, null, null, null, null];
```

Ed ecco come sarebbe se cambiassi i dati senza mutare l'array `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Ora `squares` è invariato, ma il primo elemento di `nextSquares` è 'X' anziché `null`
```

Il risultato è lo stesso ma non mutando (modificando i dati sottostanti) direttamente, ottieni diversi vantaggi.

L'immutabilità rende le funzionalità complesse molto più facili da implementare. Più avanti in questo tutorial, implementerai una funzione di "viaggio nel tempo" che ti consente di rivedere la cronologia del gioco e "tornare indietro" alle mosse precedenti. Questa funzionalità non è specifica per i giochi: la possibilità di annullare e ripetere determinate azioni è un requisito comune per le app. Evitare la mutazione diretta dei dati consente di mantenere intatte le versioni precedenti dei dati e di riutilizzarle in seguito.

C'è anche un altro vantaggio dell'immutabilità. Di default, tutti i componenti figlio eseguono automaticamente il re-rendering quando cambia lo state di un componente padre. Ciò include anche i componenti figlio che non sono stati interessati dalla modifica. Sebbene il re-rendering non sia di per sé evidente per l'utente (non dovresti cercare attivamente di evitarlo!), potresti voler saltare il re-rendering di una parte dell'albero che chiaramente non ne è stata influenzata per motivi di prestazioni. L'immutabilità rende molto economico per i componenti confrontare se i loro dati sono cambiati o meno. Puoi saperne di più su come React sceglie quando eseguire nuovamente il rendering di un componente nel [riferimento dell'API `memo`](/reference/react/memo).

### Cambiare verso {/*taking-turns*/}

È giunto il momento di correggere un grave difetto in questo gioco di tic-tac-toe: le "O" non possono essere segnate sul tabellone.

Imposterai la prima mossa come "X" di default. Teniamo traccia di questo aggiungendo un altro pezzo di state al componente Board:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Ogni volta che un giocatore si muove, `xIsNext` (un valore booleano) verrà capovolto per determinare quale giocatore andrà dopo e lo state del gioco verrà salvato. Aggiornerai la funzione `handleClick` di `Board` per capovolgere il valore di `xIsNext`:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

Ora, mentre fai click su quadrati diversi, si alterneranno tra `X` e `O`, come dovrebbero!

Ma aspetta, c'è un problema. Prova a fare click sullo stesso quadrato più volte:

![O che sovrascrive una X](../images/tutorial/o-replaces-x.gif)

La `X` è sovrascritta da una `O`! Anche se questo aggiungerebbe una svolta molto interessante al gioco, per ora ci atteniamo alle regole originali.

Quando contrassegni un quadrato con una `X` o una `O` non stai prima controllando se il quadrato ha già un valore `X` o `O`. Puoi risolvere questo problema *effettuerai il return in anticipo*. Verificherai se il quadrato ha già una `X` o una `O`. Se il quadrato è già pieno, effettuerai il `return` in anticipo nella funzione `handleClick`--prima che tenti di aggiornare lo state del tabellone.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Ora puoi solo aggiungere `X` o `O` ai quadrati vuoti! Ecco come dovrebbe apparire il tuo codice a questo punto:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Dichiarare un vincitore {/*declaring-a-winner*/}

Ora che i giocatori possono fare a turno, vorrai mostrare quando la partita è vinta e non ci sono più turni da eseguire. Per fare ciò aggiungerai una funzione di supporto chiamata `calculateWinner` che prende un array di 9 quadrati, verifica la presenza di un vincitore e restituisce `'X'`, `'O'` o `null` a seconda dei casi. Non preoccuparti troppo della funzione `calculateWinner`; non è specifica di React:

```js src/App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
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

<Note>

Non importa se definisci `calculateWinner` prima o dopo `Board`. Mettiamolo alla fine in modo che tu non debba scorrere oltre ogni volta che modifichi i tuoi componenti.

</Note>

Chiamerai `calculateWinner(squares)` nella funzione `handleClick` del componente `Board` per controllare se un giocatore ha vinto. Puoi eseguire questo controllo nello stesso momento in cui controlli se un utente ha fatto click su un quadrato che ha già una `X` o una `O`. Vorremmo effettuare il return in anticipo in entrambi i casi:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Per far sapere ai giocatori quando il gioco è finito, puoi visualizzare un testo come "Winner: X" o "Winner: O". Per farlo aggiungerai una sezione `status` al componente `Board`. Lo state mostrerà il vincitore se il gioco è finito e se il gioco è in corso visualizzerai di quale giocatore è il prossimo turno:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Congratulazioni! Ora hai un gioco di tic-tac-toe funzionante. E hai appena imparato anche le basi di React. Quindi _tu_ sei il vero vincitore qui. Ecco come dovrebbe apparire il codice:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

## Aggiungere il viaggio nel tempo {/*adding-time-travel*/}

Come esercizio finale, rendiamo possibile "tornare indietro nel tempo" alle mosse precedenti del gioco.

### Memorizzare una cronologia delle mosse {/*storing-a-history-of-moves*/}

Se hai mutato l'array `squares`, l'implementazione del viaggio nel tempo sarebbe molto difficile.

Tuttavia, hai usato `slice()` per creare una nuova copia dell'array `squares` dopo ogni mossa e l'hai trattato come immutabile. Ciò ti consentirà di memorizzare ogni versione passata dell'array `squares` e navigare tra i turni che sono già avvenuti.

Memorizzerai gli array `squares` passati in un altro array chiamato `history`, che memorizzerai come una nuova variabile state. L'array `history` rappresenta tutti gli state del tabellone, dalla prima all'ultima mossa, e ha una forma come questa:

```jsx
[
  // Prima della prima mossa
  [null, null, null, null, null, null, null, null, null],
  // Dopo la prima mossa
  [null, null, null, null, 'X', null, null, null, null],
  // Dopo la seconda mossa
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Sollevare lo state, di nuovo {/*lifting-state-up-again*/}

Ora scriverai un nuovo componente di livello superiore chiamato `Game` per visualizzare un elenco di mosse passate. Qui è dove collocherai lo state `history` che contiene l'intera cronologia del gioco.

Inserendo lo state `history` nel componente `Game` potrai rimuovere lo state `squares` dal suo componente figlio `Board`. Proprio come hai "sollevato lo state" dal componente `Square` al componente `Board`, ora lo solleverai da `Board` al componente di primo livello `Game`. Questo dà al componente `Game` il pieno controllo sui dati di `Board` e gli permette di istruire `Board` a renderizzare i turni precedenti da `history`.

Innanzitutto, aggiungi un componente `Game` con `export default`. Fai renderizzare il componente `Board` e qualche markup:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

Nota che stai rimuovendo le keyword `export default` prima della dichiarazione `function Board() {` e aggiungendole prima della dichiarazione `function Game() {`. Questo dice al tuo file `index.js` di usare il componente `Game` come componente di primo livello invece del tuo componente `Board`. I `div` aggiuntivi restituiti dal componente `Game` stanno facendo spazio per le informazioni sul gioco che aggiungerai successivamente al tabellone.

Aggiungi qualche state al componente `Game` per tenere traccia di quale giocatore è il prossimo e la cronologia delle mosse:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Nota come `[Array(9).fill(null)]` è un array con un singolo elemento, che a sua volta è un array di 9 `null`.

Per eseguire la renderizzazione dei quadrati per la mossa corrente, vorrai leggere l'ultimo array di quadrati da `history`. Non hai bisogno di `useState` per questo-- hai già abbastanza informazioni per calcolarlo durante la renderizzazione:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Successivamente, crea una funzione `handlePlay` all'interno del componente `Game` che verrà chiamata dal componente `Board` per aggiornare il gioco. Passa `xIsNext`, `currentSquares` e `handlePlay` come props componente `Board`:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Facciamo in modo che il componente `Board` sia completamente controllato dalle props che riceve. Cambia il componente `Board` per prendere tre props: `xIsNext`, `squares` e una nuova funzione `onPlay` che `Board` può chiamare con l'array squares aggiornato quando un giocatore fa una mossa. Successivamente, rimuovi le prime due righe della funzione `Board` che chiama `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Ora sostituisci le chiamate `setSquares` e `setXIsNext` in `handleClick` nel componente `Board` con una singola chiamata alla tua nuova funzione `onPlay` in modo che il componente `Game` possa aggiornare `Board` quando l'utente fa click su un quadrato :

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

Il componente `Board` è completamente controllato dalle props che gli vengono passate dal componente `Game`. Devi implementare la funzione `handlePlay` nel componente `Game` per far funzionare di nuovo il gioco.

Cosa dovrebbe fare `handlePlay` quando viene chiamato? Ricorda che Board chiamava `setSquares` con un array aggiornato; ora passa l'array `squares` aggiornato a `onPlay`.

La funzione `handlePlay` deve aggiornare lo stato di `Game` per attivare una nuova renderizzazione, ma non hai più una funzione `setSquares` che puoi chiamare: ora stai usando la variabile state `history` per memorizzare queste informazioni. Ti consigliamo di aggiornare `history` aggiungendo l'array `squares` aggiornato come una nuova voce della cronologia. Vuoi anche attivare `xIsNext`, proprio come faceva Board:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

Qui, `[...history, nextSquares]` crea un nuovo array che contiene tutti gli elementi in `history`, seguito da `nextSquares`. (Puoi leggere la [*sintassi di spread*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) `...history` come "enumerare tutti gli elementi in `history`".)

Ad esempio, se `history` è `[[null,null,null], ["X",null,null]]` e `nextSquares` è `["X",null,"O"]`, allora il nuovo array `[...history, nextSquares]` sarà `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

A questo punto, hai spostato lo state in modo che risieda nel componente `Game` e la UI dovrebbe funzionare completamente, proprio come prima del refactoring. Ecco come dovrebbe apparire il codice a questo punto:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Mostrare le mosse passate {/*showing-the-past-moves*/}

Dato che stai registrando la cronologia del gioco di tic-tac-toe, ora puoi mostrare al giocatore un elenco delle mosse passate.

Gli elementi React come `<button>` sono normali oggetti JavaScript; puoi passarli in giro nella tua applicazione. Per eseguire il rendering di più elementi in React, puoi utilizzare un array di elementi React.

Hai già un array di mosse `history` nello state, quindi ora devi trasformarlo in un array di elementi React. In JavaScript, per trasformare un array in un altro, puoi usare il [metodo `map` dell'array:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map )

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Utilizzerai `map` per trasformare la tua `history` di mosse in elementi React che rappresentano i pulsanti sullo schermo e visualizzerai un elenco di pulsanti per "saltare" alle mosse passate. Facciamo una `map` sulla `history` nel componente Game:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

Puoi vedere come dovrebbe apparire il tuo codice qui sotto. Nota che dovresti vedere un errore nella console degli strumenti di sviluppo che dice:

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>

Risolverai questo errore nella prossima sezione.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Mentre scorri l'array `history` all'interno della funzione che hai passato a `map`, l'argomento `squares` passa attraverso ogni elemento di `history` e l'argomento `move` passa attraverso ogni indice dell'array: `0`, `1`, `2`, …. (Nella maggior parte dei casi, avresti bisogno degli elementi effettivi dell'array, ma per visualizzare un elenco di mosse avrai bisogno solo degli indici.)

Per ogni mossa nella cronologia del gioco ti tic-tac-toe, crei un elemento di elenco `<li>` che contiene un pulsante `<button>`. Il pulsante ha un handler `onClick` che chiama una funzione chiamata `jumpTo` (che non hai ancora implementato).

Per ora, dovresti vedere un elenco delle mosse che si sono verificate nel gioco e un errore nella console degli strumenti per sviluppatori. Discutiamo di cosa significa l'errore "key".

### Scegliere una key {/*picking-a-key*/}

Quando esegui il rendering di un elenco, React memorizza alcune informazioni su ciascun elemento dell'elenco visualizzato. Quando aggiorni un elenco, React deve determinare cosa è cambiato. Potresti aver aggiunto, rimosso, riorganizzato o aggiornato gli elementi dell'elenco.

Immagina di passare da

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

Oltre ai conteggi aggiornati, una lettura umana direbbe probabilmente che hai scambiato l'ordinamento di Alexa e Ben e hai inserito Claudia tra Alexa e Ben. Tuttavia, React è un programma per computer e non può sapere cosa intendevi, quindi devi specificare una proprietà _key_ per ogni elemento dell'elenco per differenziare ogni elemento dell'elenco dai suoi fratelli. Se i tuoi dati provenivano da un database, gli ID del database di Alexa, Ben e Claudia potrebbero essere usati come keys.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

Quando un elenco viene nuovamente renderizzato, React prende la key di ogni elemento dell'elenco e cerca negli elementi dell'elenco precedente una key corrispondente. Se l'elenco corrente ha una key che prima non esisteva, React crea un componente. Se nell'elenco corrente manca una key che esisteva nell'elenco precedente, React distrugge il componente precedente. Se due keys corrispondono, il componente corrispondente viene spostato.

Le keys comunicano a React l'identità di ciascun componente, il che consente a React di mantenere lo state tra le ri-renderizzazioni. Se la key di un componente cambia, il componente verrà distrutto e ricreato con un nuovo state.

`key` è una proprietà speciale e riservata in React. Quando viene creato un elemento, React estrae la proprietà `key` e memorizza la key direttamente sull'elemento restituito. Anche se `key` può sembrare passato come prop, React utilizza automaticamente `key` per decidere quali componenti aggiornare. Non c'è modo per un componente di chiedere quale `key` sia stata specificata dal suo genitore.

**Si consiglia vivamente di assegnare le keys appropriate ogni volta che si creano elenchi dinamici.** Se non si dispone di una key appropriata, è consigliabile valutare la possibilità di ristrutturare i dati in modo da averla.

Se non viene specificata alcuna key, React riporterà un errore e utilizzerà di default l'indice dell'array come key. L'utilizzo dell'indice dell'array come key è problematico quando si tenta di riordinare gli elementi di un elenco o di inserire/rimuovere elementi di elenco. Il passaggio esplicito di `key={i}` silenzia l'errore ma presenta gli stessi problemi degli indici dell'array e non è consigliato nella maggior parte dei casi.

Le keys non devono essere univoche a livello globale; devono solo essere unici tra i componenti e i loro fratelli.

### Implementare il viaggio nel tempo {/*implementing-time-travel*/}

Nella cronologia del gioco di tic-tac-toe, a ogni mossa passata è associato un ID univoco: è il numero sequenziale della mossa. Le mosse non verranno mai riordinate, cancellate o inserite nel mezzo, quindi è sicuro utilizzare l'indice delle mosse come key.

Nella funzione `Game`, puoi aggiungere la key come `<li key={move}>`, e se aggiorni il gioco renderizzato, l'errore "key" di React dovrebbe scomparire:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Prima di poter implementare `jumpTo`, è necessario il componente `Game` per tenere traccia di quale passaggio l'utente sta attualmente visualizzando. Per fare ciò, definisci una nuova variabile state chiamata `currentMove`, il cui valore predefinito è `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Successivamente, aggiorna la funzione `jumpTo` all'interno di `Game` per aggiornare quel `currentMove`. Imposterai anche `xIsNext` a `true` se il numero in cui stai modificando `currentMove` è pari.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

Ora apporterai due modifiche alla funzione `handlePlay` di `Game` che viene chiamata quando fai click su un quadrato.

- Se "torni indietro nel tempo" e poi fai una nuova mossa da quel punto, vuoi solo conservare la cronologia fino a quel punto. Invece di aggiungere `nextSquares` dopo tutti gli elementi (sintassi di spread `...`) in `history`, lo aggiungerai dopo tutti gli elementi in `history.slice(0, currentMove + 1)` in modo da star solo mantenendo quella parte della vecchia cronologia.
- Ogni volta che viene effettuata una mossa, è necessario aggiornare `currentMove` in modo che punti all'ultima voce della cronologia.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Infine, modificherai il componente `Gioco` per eseguire la renderizzazione della mossa attualmente selezionata, invece di eseguire sempre la renderizzazione della mossa finale:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Se fai click su un passaggio qualsiasi nella cronologia del gioco, il tabellone di tic-tac-toe dovrebbe aggiornarsi immediatamente per mostrare l'aspetto del tabellone dopo che si è verificato quel passaggio.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Pulizia finale {/*final-cleanup*/}

Se osservi il codice da molto vicino, potresti notare che `xIsNext === true` quando `currentMove` è pari e `xIsNext === false` quando `currentMove` è dispari. In altre parole, se conosci il valore di `currentMove`, puoi sempre capire cosa dovrebbe essere `xIsNext`.

Non c'è motivo per te di archiviarli entrambi nello state. In effetti, cerca sempre di evitare lo state ridondante. Semplificare ciò che memorizzi nello state riduce i bug e rende il tuo codice più facile da capire. Cambia `Game` in modo che non memorizzi `xIsNext` come una variabile state separata e invece lo capisca in base a `currentMove`:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

Non hai più bisogno della dichiarazione di state `xIsNext` o delle chiamate a `setXIsNext`. Ora, non c'è alcuna possibilità che `xIsNext` perda la sincronizzazione con `currentMove`, anche se commetti un errore durante la codifica dei componenti.

### Concludendo {/*wrapping-up*/}

Congratulazioni! Hai creato un gioco di tic-tac-toe che:

- Ti permette di giocare a tic-tac-toe,
- Indica quando un giocatore ha vinto la partita,
- Memorizza la cronologia di un gioco man mano che il gioco procede,
- Consente ai giocatori di rivedere la cronologia di un gioco e vedere le versioni precedenti del tabellone di un gioco.

Ottimo lavoro! Ci auguriamo che ora tu abbia la sensazione di avere una buona conoscenza di come funziona React.

Guarda qui il risultato finale:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Se hai tempo extra o vuoi mettere in pratica le tue nuove abilità di React, ecco alcune idee per miglioramenti che potresti apportare al gioco di tic-tac-toe, elencate in ordine di difficoltà crescente:

1. Solo per la mossa corrente, mostra "You are at move #..." invece di un pulsante.
1. Riscrivi `Board` per utilizzare due loop per creare i quadrati invece di hardcodarli.
1. Aggiungi un pulsante interruttore che ti consente di ordinare le mosse in ordine crescente o decrescente.
1. Quando qualcuno vince, evidenzia i tre quadrati che hanno causato la vittoria (e quando nessuno vince, mostra un messaggio che indica che il risultato è un pareggio).
1. Visualizza la posizione di ciascuna mossa nel formato (riga, colonna) nell'elenco della cronologia delle mosse.

Durante questo tutorial, hai toccato i concetti di React inclusi elementi, componenti, props e state. Ora che hai visto come funzionano questi concetti durante la creazione di un gioco, dai un'occhiata a [Pensare in React](/learn/thinking-in-react) per vedere come funzionano gli stessi concetti di React durante la creazione della UI di un'app.
