---
title: "Presentiamo react.dev"
author: Dan Abramov and Rachel Nabors
date: 2023/03/16
description: Oggi siamo entusiasti di lanciare react.dev, la nuova casa di React e della sua documentazione. In questo post ti facciamo fare un tour del nuovo sito.
translationStatus: ai-draft
---

16 marzo 2023 di [Dan Abramov](https://bsky.app/profile/danabra.mov) e [Rachel Nabors](https://twitter.com/rachelnabors)

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2023/03/16/introducing-react-dev.md).

</Note>

<Intro>

Oggi siamo entusiasti di lanciare [react.dev](https://react.dev), la nuova casa di React e della sua documentazione. In questo post ti facciamo fare un tour del nuovo sito.

</Intro>

---

## tl;dr {/*tldr*/}

* Il nuovo sito React ([react.dev](https://react.dev)) insegna React moderno con componenti funzione e Hooks.
* Abbiamo incluso diagrammi, illustrazioni, sfide e oltre 600 nuovi esempi interattivi.
* Il precedente sito di documentazione React è ora su [legacy.reactjs.org](https://legacy.reactjs.org).

## Nuovo sito, nuovo dominio, nuova homepage {/*new-site-new-domain-new-homepage*/}

Prima, un po' di organizzazione.

Per celebrare il lancio della nuova documentazione e, soprattutto, per separare chiaramente i contenuti vecchi e nuovi, ci siamo spostati sul dominio più corto [react.dev](https://react.dev). Il vecchio dominio [reactjs.org](https://reactjs.org) ora reindirizza qui.

La vecchia documentazione React è archiviata su [legacy.reactjs.org](https://legacy.reactjs.org). Tutti i link esistenti ai contenuti vecchi reindirizzeranno automaticamente lì per evitare di "rompere il web", ma il sito legacy non riceverà molti altri aggiornamenti.

Che tu ci creda o no, React compirà presto dieci anni. In anni JavaScript, è come un secolo intero! Abbiamo [rinnovato la homepage React](https://react.dev) per riflettere perché pensiamo che React sia un ottimo modo per creare interfacce utente oggi, e abbiamo aggiornato le guide per iniziare menzionando più in evidenza i framework moderni basati su React.

Se non hai ancora visto la nuova homepage, dagli un'occhiata!

## Tutto su React moderno con gli Hooks {/*going-all-in-on-modern-react-with-hooks*/}

Quando abbiamo rilasciato React Hooks nel 2018, la documentazione sugli Hooks presupponeva che il lettore conoscesse i componenti class. Questo ha aiutato la community ad adottare gli Hooks molto rapidamente, ma col tempo la vecchia documentazione non serviva più i nuovi lettori. I nuovi lettori dovevano imparare React due volte: prima con i componenti class e poi di nuovo con gli Hooks.

**La nuova documentazione insegna React con gli Hooks fin dall'inizio.** La documentazione è divisa in due sezioni principali:

* **[Impara React](/learn)** è un corso autogestito che insegna React da zero.
* **[API Reference](/reference)** fornisce i dettagli e gli esempi d'uso per ogni API React.

Vediamo più da vicino cosa trovi in ciascuna sezione.

<Note>

Ci sono ancora alcuni rari casi d'uso con componenti class che non hanno ancora un equivalente basato su Hook. I componenti class restano supportati e sono documentati nella sezione [Legacy API](/reference/react/legacy) del nuovo sito.

</Note>

## Avvio Rapido {/*quick-start*/}

La sezione Impara React inizia con la pagina [Avvio Rapido](/learn). È un breve tour introduttivo di React. Introduce la sintassi per concetti come componenti, props e state, ma non entra in molto dettaglio su come usarli.

Se ti piace imparare facendo, ti consigliamo di provare subito dopo il [Tutorial: Tic-Tac-Toe](/learn/tutorial-tic-tac-toe). Ti guida nella costruzione di un piccolo gioco con React, insegnandoti le competenze che userai ogni giorno. Ecco cosa costruirai:

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

Vorremmo anche evidenziare [Pensare in React](/learn/thinking-in-react) — è il tutorial che ha fatto "cliccare" React per molti di noi. **Abbiamo aggiornato entrambi questi tutorial classici per usare componenti funzione e Hooks,** quindi sono come nuovi.

<Note>

L'esempio sopra è una *sandbox*. Abbiamo aggiunto molte sandbox — oltre 600! — ovunque nel sito. Puoi modificare qualsiasi sandbox, o premere "Fork" nell'angolo in alto a destra per aprirla in una scheda separata. Le sandbox ti permettono di sperimentare rapidamente con le API React, esplorare le tue idee e verificare la comprensione.

</Note>

## Impara React passo dopo passo {/*learn-react-step-by-step*/}

Vorremmo che tutti nel mondo avessero la stessa opportunità di imparare React gratuitamente, in autonomia.

Ecco perché la sezione Impara React è organizzata come un corso autogestito diviso in capitoli. I primi due capitoli descrivono i fondamentali di React. Se sei nuovo a React, o vuoi rinfrescarlo in memoria, inizia da qui:

- **[Descrivere la UI](/learn/describing-the-ui)** insegna come mostrare informazioni con i componenti.
- **[Aggiungere le Interazioni](/learn/adding-interactivity)** insegna come aggiornare lo schermo in risposta all'input dell'utente.

I prossimi due capitoli sono più avanzati e ti daranno una comprensione più profonda delle parti più complesse:

- **[Gestione dello state](/learn/managing-state)** insegna come organizzare la logica man mano che la tua app cresce in complessità.
- **[Soluzioni alternative](/learn/escape-hatches)** insegna come puoi "uscire" da React e quando ha più senso farlo.

Ogni capitolo consiste di diverse pagine correlate. La maggior parte di queste pagine insegna una competenza o una tecnica specifica — ad esempio [Scrivere Markup con JSX](/learn/writing-markup-with-jsx), [Aggiornare gli Oggetti nello State](/learn/updating-objects-in-state), o [Condividere lo State tra Componenti](/learn/sharing-state-between-components). Alcune pagine si concentrano sull'esplicazione di un'idea — come [Renderizzare e Aggiornare](/learn/render-and-commit), o [Lo State come un'Istantanea](/learn/state-as-a-snapshot). E ce ne sono alcune, come [Potresti non avere bisogno di un Effetto](/learn/you-might-not-need-an-effect), che condividono i nostri suggerimenti basati su ciò che abbiamo imparato in questi anni.

Non devi leggere questi capitoli in sequenza. Chi ha tempo per questo?! Ma potresti. Le pagine nella sezione Impara React si basano solo su concetti introdotti dalle pagine precedenti. Se vuoi leggerlo come un libro, fallo pure!

### Verifica la comprensione con le sfide {/*check-your-understanding-with-challenges*/}

La maggior parte delle pagine nella sezione Impara React termina con alcune sfide per verificare la comprensione. Ad esempio, ecco alcune sfide dalla pagina sulla [Renderizzazione Condizionale](/learn/conditional-rendering#challenges).

Non devi risolverle adesso! A meno che *non* voglia *davvero*.

<Challenges noTitle={true}>

#### Mostra un'icona per gli elementi incompleti con `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Usa l'operatore condizionale (`cond ? a : b`) per renderizzare un ❌ se `isPacked` non è `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Mostra l'importanza dell'elemento con `&&` {/*show-the-item-importance-with-*/}

In questo esempio, ogni `Item` riceve una prop numerica `importance`. Usa l'operatore `&&` per renderizzare "_(Importance: X)_" in corsivo, ma solo per gli elementi con importanza diversa da zero. La tua lista dovrebbe finire così:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

Non dimenticare di aggiungere uno spazio tra le due etichette!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="Space suit"
        />
        <Item
          importance={0}
          name="Helmet with a golden leaf"
        />
        <Item
          importance={6}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Questo dovrebbe funzionare:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="Space suit"
        />
        <Item
          importance={0}
          name="Helmet with a golden leaf"
        />
        <Item
          importance={6}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Nota che devi scrivere `importance > 0 && ...` piuttosto che `importance && ...` così se `importance` è `0`, non viene renderizzato `0` come risultato!

In questa soluzione, due condizioni separate vengono usate per inserire uno spazio tra il nome e l'etichetta di importanza. In alternativa, potresti usare un Fragment con uno spazio iniziale: `importance > 0 && <> <i>...</i></>` o aggiungere uno spazio subito dentro `<i>`: `importance > 0 && <i> ...</i>`.

</Solution>

</Challenges>

Nota il pulsante "Mostra soluzione" nell'angolo in basso a sinistra. È comodo se vuoi verificare da solo!

### Costruisci un'intuizione con diagrammi e illustrazioni {/*build-an-intuition-with-diagrams-and-illustrations*/}

Quando non riuscivamo a spiegare qualcosa solo con codice e parole, abbiamo aggiunto diagrammi che aiutano a fornire intuizione. Ad esempio, ecco uno dei diagrammi da [Preservare e Resettare lo Stato](/learn/preserving-and-resetting-state):

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagramma con tre sezioni, con una freccia che collega ogni sezione. La prima sezione contiene un componente React etichettato 'div' con un unico figlio etichettato 'section', che ha un unico figlio etichettato 'Counter' contenente una bolla di state etichettata 'count' con valore 3. La sezione centrale ha lo stesso genitore 'div', ma i componenti figli sono stati eliminati, indicato da un'immagine gialla 'proof'. La terza sezione ha di nuovo lo stesso genitore 'div', ora con un nuovo figlio etichettato 'div', evidenziato in giallo, anche con un nuovo figlio etichettato 'Counter' contenente una bolla di state etichettata 'count' con valore 0, tutto evidenziato in giallo.">

Quando `section` diventa `div`, la `section` viene eliminata e viene aggiunto il nuovo `div`

</Diagram>

Vedrai anche alcune illustrazioni in tutta la documentazione — ecco una del [browser che dipinge lo schermo](/learn/render-and-commit#epilogue-browser-paint):

<Illustration alt="Un browser che dipinge 'natura morta con elemento card'." src="/images/docs/illustrations/i_browser-paint.png" />

Abbiamo confermato con i vendor dei browser che questa rappresentazione è scientificamente accurata al 100%.

## Una nuova API Reference dettagliata {/*a-new-detailed-api-reference*/}

Nell'[API Reference](/reference/react), ogni API React ha ora una pagina dedicata. Questo include tutti i tipi di API:

- Hooks integrati come [`useState`](/reference/react/useState).
- Componenti integrati come [`<Suspense>`](/reference/react/Suspense).
- Componenti browser integrati come [`<input>`](/reference/react-dom/components/input).
- API orientate ai framework come [`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream).
- Altre API React come [`memo`](/reference/react/memo).

Noterai che ogni pagina API è divisa in almeno due segmenti: *Reference* e *Usage*.

[Reference](/reference/react/useState#reference) descrive la firma formale dell'API elencando argomenti e valori di ritorno. È concisa, ma può sembrare un po' astratta se non conosci quell'API. Descrive cosa fa un'API, ma non come usarla.

[Usage](/reference/react/useState#usage) mostra perché e come useresti questa API in pratica, come potrebbe spiegare un collega o un amico. Mostra gli **scenari canonici di come ogni API era pensata per essere usata dal team React.** Abbiamo aggiunto snippet con codifica colori, esempi di uso di API diverse insieme e ricette che puoi copiare e incollare:

<Recipes titleText="Esempi base di useState" titleId="examples-basic">

#### Contatore (numero) {/*counter-number*/}

In questo esempio, la variabile di state `count` contiene un numero. Cliccando il pulsante lo incrementi.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Campo di testo (stringa) {/*text-field-string*/}

In questo esempio, la variabile di state `text` contiene una stringa. Quando digiti, `handleChange` legge l'ultimo valore di input dall'elemento DOM input del browser e chiama `setText` per aggiornare lo state. Questo ti permette di mostrare il `text` corrente sotto.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (booleano) {/*checkbox-boolean*/}

In questo esempio, la variabile di state `liked` contiene un booleano. Quando clicchi l'input, `setLiked` aggiorna la variabile di state `liked` in base a se la checkbox del browser è selezionata. La variabile `liked` viene usata per renderizzare il testo sotto la checkbox.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Form (due variabili) {/*form-two-variables*/}

Puoi dichiarare più di una variabile di state nello stesso componente. Ogni variabile di state è completamente indipendente.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

Alcune pagine API includono anche [Troubleshooting](/reference/react/useEffect#troubleshooting) (per problemi comuni) e [Alternatives](/reference/react-dom/findDOMNode#alternatives) (per API deprecate).

Speriamo che questo approccio renda l'API reference utile non solo per cercare un argomento, ma per vedere tutte le cose diverse che puoi fare con una data API — e come si collega alle altre.

## Cosa c'è dopo? {/*whats-next*/}

Questo conclude il nostro piccolo tour! Dai un'occhiata al nuovo sito, vedi cosa ti piace o non ti piace e continua a inviarci feedback nel nostro [issue tracker](https://github.com/reactjs/react.dev/issues).

Riconosciamo che questo progetto ha impiegato molto tempo per essere rilasciato. Volevamo mantenere un alto standard di qualità che la community React merita. Mentre scrivevamo questa documentazione e creavamo tutti gli esempi, abbiamo trovato errori in alcune nostre spiegazioni, bug in React e persino lacune nel design di React che stiamo ora lavorando per affrontare. Speriamo che la nuova documentazione ci aiuti a tenere React stesso a uno standard più alto in futuro.

Abbiamo sentito molte delle vostre richieste di espandere contenuti e funzionalità del sito, ad esempio:

- Fornire una versione TypeScript per tutti gli esempi;
- Creare le guide aggiornate su performance, testing e accessibilità;
- Documentare React Server Components indipendentemente dai framework che li supportano;
- Lavorare con la nostra community internazionale per tradurre la nuova documentazione;
- Aggiungere funzionalità mancanti al nuovo sito (ad esempio, RSS per questo blog).

Ora che [react.dev](https://react.dev/) è uscito, potremo spostare il focus dal "recuperare" le risorse educative React di terze parti all'aggiungere nuove informazioni e migliorare ulteriormente il nostro nuovo sito.

Pensiamo che non ci sia mai stato un momento migliore per imparare React.

## Chi ha lavorato a questo? {/*who-worked-on-this*/}

Nel team React, [Rachel Nabors](https://twitter.com/rachelnabors/) ha guidato il progetto (e fornito le illustrazioni), e [Dan Abramov](https://bsky.app/profile/danabra.mov) ha progettato il curriculum. Hanno anche co-autorato la maggior parte dei contenuti insieme.

Naturalmente, nessun progetto così grande avviene in isolamento. Abbiamo molte persone da ringraziare!

[Sylwia Vargas](https://twitter.com/SylwiaVargas) ha rinnovato i nostri esempi andando oltre "foo/bar/baz" e gattini, includendo scienziati, artisti e città da tutto il mondo. [Maggie Appleton](https://twitter.com/Mappletons) ha trasformato i nostri scarabocchi in un chiaro sistema di diagrammi.

Grazie a [David McCabe](https://twitter.com/mcc_abe), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), e [Matt Carroll](https://twitter.com/mattcarrollcode) per i contributi di scrittura aggiuntivi. Vorremmo anche ringraziare [Natalia Tepluhina](https://twitter.com/n_tepluhina) e [Sebastian Markbåge](https://twitter.com/sebmarkbage) per le loro idee e feedback.

Grazie a [Dan Lebowitz](https://twitter.com/lebo) per il design del sito e [Razvan Gradinar](https://dribbble.com/GradinarRazvan) per il design delle sandbox.

Sul fronte dello sviluppo, grazie a [Jared Palmer](https://twitter.com/jaredpalmer) per lo sviluppo del prototipo. Grazie a [Dane Grant](https://twitter.com/danecando) e [Dustin Goodman](https://twitter.com/dustinsgoodman) di [ThisDotLabs](https://www.thisdot.co/) per il supporto allo sviluppo UI. Grazie a [Ives van Hoorne](https://twitter.com/CompuIves), [Alex Moldovan](https://twitter.com/alexnmoldovan), [Jasper De Moor](https://twitter.com/JasperDeMoor), e [Danilo Woznica](https://twitter.com/danilowoz) di [CodeSandbox](https://codesandbox.io/) per il lavoro sull'integrazione delle sandbox. Grazie a [Rick Hanlon](https://twitter.com/rickhanlonii) per sviluppo spot e lavoro di design, perfezionando colori e dettagli. Grazie a [Harish Kumar](https://www.strek.in/) e [Luna Ruan](https://twitter.com/lunaruan) per aver aggiunto nuove funzionalità al sito e aiutato a mantenerlo.

Enormi grazie alle persone che hanno donato il loro tempo per partecipare al programma di alpha e beta testing. Il vostro entusiasmo e feedback inestimabile ci hanno aiutato a plasmare questa documentazione. Un ringraziamento speciale alla nostra beta tester, [Debbie O'Brien](https://twitter.com/debs_obrien), che ha tenuto un talk sulla sua esperienza usando la documentazione React a React Conf 2021.

Infine, grazie alla community React per essere l'ispirazione dietro questo sforzo. Siete la ragione per cui lo facciamo, e speriamo che la nuova documentazione vi aiuti a usare React per costruire qualsiasi interfaccia utente desideriate.
