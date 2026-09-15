---
title: Preservare e Reimpostare lo State
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/preserving-and-resetting-state.md).

</Note>

<Intro>

Lo state è isolato tra i componenti. React tiene traccia di quale state appartiene a quale componente in base alla sua posizione nell'albero dell'UI. Puoi controllare quando preservare lo state e quando reimpostarlo tra le ri-renderizzazioni.

</Intro>

<YouWillLearn>

* Quando React sceglie di preservare o reimpostare lo state
* Come forzare React a reimpostare lo state di un componente
* Come le key e i tipi influenzano se lo state viene preservato

</YouWillLearn>

## Lo state è legato a una posizione nell'albero di renderizzazione {/*state-is-tied-to-a-position-in-the-tree*/}

React costruisce [alberi di renderizzazione](/learn/understanding-your-ui-as-a-tree#the-render-tree) per la struttura dei componenti nella tua UI.

Quando dai state a un componente, potresti pensare che lo state "viva" dentro il componente. Ma lo state è in realtà conservato dentro React. React associa ogni pezzo di state che conserva al componente corretto in base a dove quel componente si trova nell'albero di renderizzazione.

Qui c'è un solo tag JSX `<Counter />`, ma viene renderizzato in due posizioni diverse:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Ecco come appaiono come albero:

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagramma di un albero di componenti React. Il nodo radice è etichettato 'div' e ha due figli. Ciascuno dei figli è etichettato 'Counter' e entrambi contengono una bolla di state etichettata 'count' con valore 0.">

Albero React

</Diagram>

</DiagramGroup>

**Questi sono due contatori separati perché ciascuno è renderizzato nella propria posizione nell'albero.** Di solito non devi pensare a queste posizioni per usare React, ma può essere utile capire come funziona.

In React, ogni componente sullo schermo ha uno state completamente isolato. Ad esempio, se renderizzi due componenti `Counter` affiancati, ciascuno avrà i propri state `score` e `hover` indipendenti.

Prova a cliccare entrambi i contatori e nota che non si influenzano a vicenda:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Come puoi vedere, quando un contatore viene aggiornato, viene aggiornato solo lo state di quel componente:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagramma di un albero di componenti React. Il nodo radice è etichettato 'div' e ha due figli. Il figlio sinistro è etichettato 'Counter' e contiene una bolla di state etichettata 'count' con valore 0. Il figlio destro è etichettato 'Counter' e contiene una bolla di state etichettata 'count' con valore 1. La bolla di state del figlio destro è evidenziata in giallo per indicare che il suo valore è stato aggiornato.">

Aggiornamento dello state

</Diagram>

</DiagramGroup>


React manterrà lo state finché renderizzi lo stesso componente nella stessa posizione nell'albero. Per vederlo, incrementa entrambi i contatori, poi rimuovi il secondo componente deselezionando la checkbox "Renderizza il secondo contatore", e aggiungilo di nuovo selezionandola:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Renderizza il secondo contatore
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Nota come nel momento in cui smetti di renderizzare il secondo contatore, il suo state scompare completamente. Questo perché quando React rimuove un componente, ne distrugge lo state.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagramma di un albero di componenti React. Il nodo radice è etichettato 'div' e ha due figli. Il figlio sinistro è etichettato 'Counter' e contiene una bolla di state etichettata 'count' con valore 0. Il figlio destro manca, e al suo posto c'è un'immagine gialla 'poof', che evidenzia il componente eliminato dall'albero.">

Eliminazione di un componente

</Diagram>

</DiagramGroup>

Quando selezioni "Renderizza il secondo contatore", un secondo `Counter` e il suo state vengono inizializzati da zero (`score = 0`) e aggiunti al DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagramma di un albero di componenti React. Il nodo radice è etichettato 'div' e ha due figli. Il figlio sinistro è etichettato 'Counter' e contiene una bolla di state etichettata 'count' con valore 0. Il figlio destro è etichettato 'Counter' e contiene una bolla di state etichettata 'count' con valore 0. L'intero nodo figlio destro è evidenziato in giallo, indicando che è stato appena aggiunto all'albero.">

Aggiunta di un componente

</Diagram>

</DiagramGroup>

**React preserva lo state di un componente finché viene renderizzato nella sua posizione nell'albero dell'UI.** Se viene rimosso, o se un componente diverso viene renderizzato nella stessa posizione, React scarta il suo state.

## Lo stesso componente nella stessa posizione preserva lo state {/*same-component-at-the-same-position-preserves-state*/}

In questo esempio, ci sono due tag `<Counter />` diversi:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} />
      ) : (
        <Counter isFancy={false} />
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Usa stile elegante
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Quando selezioni o deselezioni la checkbox, lo state del contatore non viene reimpostato. Che `isFancy` sia `true` o `false`, hai sempre un `<Counter />` come primo figlio del `div` restituito dal componente root `App`:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagramma con due sezioni separate da una freccia di transizione. Ogni sezione contiene un layout di componenti con un genitore etichettato 'App' che contiene una bolla di state etichettata isFancy. Questo componente ha un figlio etichettato 'div', che porta a una bolla di props contenente isFancy (evidenziata in viola) passata all'unico figlio. L'ultimo figlio è etichettato 'Counter' e contiene una bolla di state con etichetta 'count' e valore 3 in entrambi i diagrammi. Nella sezione sinistra del diagramma, nulla è evidenziato e il valore dello state genitore isFancy è false. Nella sezione destra, il valore dello state genitore isFancy è cambiato in true ed è evidenziato in giallo, così come la bolla di props sotto, che ha anche cambiato il suo valore isFancy in true.">

Aggiornare lo state di `App` non reimposta `Counter` perché `Counter` resta nella stessa posizione

</Diagram>

</DiagramGroup>


È lo stesso componente nella stessa posizione, quindi dal punto di vista di React, è lo stesso contatore.

<Pitfall>

Ricorda che **è la posizione nell'albero dell'UI — non nel markup JSX — che conta per React!** Questo componente ha due clausole `return` con tag JSX `<Counter />` diversi dentro e fuori l'`if`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Usa stile elegante
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Usa stile elegante
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Potresti aspettarti che lo state venga reimpostato quando selezioni la checkbox, ma non succede! Questo perché **entrambi questi tag `<Counter />` sono renderizzati nella stessa posizione.** React non sa dove posizioni le condizioni nella tua funzione. Tutto ciò che "vede" è l'albero che restituisci.

In entrambi i casi, il componente `App` restituisce un `<div>` con `<Counter />` come primo figlio. Per React, questi due contatori hanno lo stesso "indirizzo": il primo figlio del primo figlio della root. È così che React li abbina tra la renderizzazione precedente e quella successiva, indipendentemente da come strutturi la tua logica.

</Pitfall>

## Componenti diversi nella stessa posizione reimpostano lo state {/*different-components-at-the-same-position-reset-state*/}

In questo esempio, selezionare la checkbox sostituirà `<Counter>` con un `<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>A presto!</p>
      ) : (
        <Counter />
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Fai una pausa
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Qui, passi tra tipi di componente _diversi_ nella stessa posizione. Inizialmente, il primo figlio del `<div>` conteneva un `Counter`. Ma quando lo hai sostituito con un `p`, React ha rimosso il `Counter` dall'albero dell'UI e ha distrutto il suo state.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagramma con tre sezioni, con una freccia di transizione tra ciascuna sezione. La prima sezione contiene un componente React etichettato 'div' con un singolo figlio etichettato 'Counter' che contiene una bolla di state etichettata 'count' con valore 3. La sezione centrale ha lo stesso genitore 'div', ma il componente figlio è stato eliminato, indicato da un'immagine gialla 'poof'. La terza sezione ha di nuovo lo stesso genitore 'div', ora con un nuovo figlio etichettato 'p', evidenziato in giallo.">

Quando `Counter` diventa `p`, il `Counter` viene eliminato e il `p` viene aggiunto

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagramma con tre sezioni, con una freccia di transizione tra ciascuna sezione. La prima sezione contiene un componente React etichettato 'p'. La sezione centrale ha lo stesso genitore 'div', ma il componente figlio è stato eliminato, indicato da un'immagine gialla 'poof'. La terza sezione ha di nuovo lo stesso genitore 'div', ora con un nuovo figlio etichettato 'Counter' che contiene una bolla di state etichettata 'count' con valore 0, evidenziato in giallo.">

Quando si torna indietro, il `p` viene eliminato e il `Counter` viene aggiunto

</Diagram>

</DiagramGroup>

Inoltre, **quando renderizzi un componente diverso nella stessa posizione, reimposta lo state dell'intero sottoalbero.** Per vedere come funziona, incrementa il contatore e poi seleziona la checkbox:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} />
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Usa stile elegante
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Lo state del contatore viene reimpostato quando clicchi la checkbox. Anche se renderizzi un `Counter`, il primo figlio del `div` cambia da un `section` a un `div`. Quando il figlio `section` è stato rimosso dal DOM, l'intero albero sotto di esso (inclusi il `Counter` e il suo state) è stato distrutto.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagramma con tre sezioni, con una freccia di transizione tra ciascuna sezione. La prima sezione contiene un componente React etichettato 'div' con un singolo figlio etichettato 'section', che ha un singolo figlio etichettato 'Counter' che contiene una bolla di state etichettata 'count' con valore 3. La sezione centrale ha lo stesso genitore 'div', ma i componenti figli sono stati eliminati, indicato da un'immagine gialla 'poof'. La terza sezione ha di nuovo lo stesso genitore 'div', ora con un nuovo figlio etichettato 'div', evidenziato in giallo, anche con un nuovo figlio etichettato 'Counter' che contiene una bolla di state etichettata 'count' con valore 0, tutto evidenziato in giallo.">

Quando `section` diventa `div`, il `section` viene eliminato e il nuovo `div` viene aggiunto

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagramma con tre sezioni, con una freccia di transizione tra ciascuna sezione. La prima sezione contiene un componente React etichettato 'div' con un singolo figlio etichettato 'div', che ha un singolo figlio etichettato 'Counter' che contiene una bolla di state etichettata 'count' con valore 0. La sezione centrale ha lo stesso genitore 'div', ma i componenti figli sono stati eliminati, indicato da un'immagine gialla 'poof'. La terza sezione ha di nuovo lo stesso genitore 'div', ora con un nuovo figlio etichettato 'section', evidenziato in giallo, anche con un nuovo figlio etichettato 'Counter' che contiene una bolla di state etichettata 'count' con valore 0, tutto evidenziato in giallo.">

Quando si torna indietro, il `div` viene eliminato e il nuovo `section` viene aggiunto

</Diagram>

</DiagramGroup>

Come regola generale, **se vuoi preservare lo state tra le ri-renderizzazioni, la struttura del tuo albero deve "corrispondere"** da una renderizzazione all'altra. Se la struttura è diversa, lo state viene distrutto perché React distrugge lo state quando rimuove un componente dall'albero.

<Pitfall>

Ecco perché non dovresti annidare definizioni di funzioni componente.

Qui, la funzione componente `MyTextField` è definita *dentro* `MyComponent`:

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}}
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Cliccato {counter} volte</button>
    </>
  );
}
```

</Sandpack>


Ogni volta che clicchi il pulsante, lo state dell'input scompare! Questo perché una funzione `MyTextField` *diversa* viene creata a ogni renderizzazione di `MyComponent`. Stai renderizzando un componente *diverso* nella stessa posizione, quindi React reimposta tutto lo state sotto. Questo porta a bug e problemi di performance. Per evitare questo problema, **dichiara sempre le funzioni componente al top level e non annidare le loro definizioni.**

</Pitfall>

## Reimpostare lo state nella stessa posizione {/*resetting-state-at-the-same-position*/}

Per impostazione predefinita, React preserva lo state di un componente finché resta nella stessa posizione. Di solito, è esattamente ciò che vuoi, quindi ha senso come comportamento predefinito. Ma a volte, potresti voler reimpostare lo state di un componente. Considera questa app che permette a due giocatori di tenere traccia dei propri punteggi durante ogni turno:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Giocatore successivo!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Attualmente, quando cambi giocatore, il punteggio viene preservato. I due `Counter` appaiono nella stessa posizione, quindi React li vede come *lo stesso* `Counter` la cui prop `person` è cambiata.

Ma concettualmente, in questa app dovrebbero essere due contatori separati. Potrebbero apparire nello stesso posto nell'UI, ma uno è un contatore per Taylor e l'altro è un contatore per Sarah.

Ci sono due modi per reimpostare lo state quando passi da uno all'altro:

1. Renderizzare i componenti in posizioni diverse
2. Dare a ciascun componente un'identità esplicita con `key`


### Opzione 1: Renderizzare un componente in posizioni diverse {/*option-1-rendering-a-component-in-different-positions*/}

Se vuoi che questi due `Counter` siano indipendenti, puoi renderizzarli in due posizioni diverse:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Giocatore successivo!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Inizialmente, `isPlayerA` è `true`. Quindi la prima posizione contiene lo state di `Counter`, e la seconda è vuota.
* Quando clicchi il pulsante "Giocatore successivo", la prima posizione si svuota ma la seconda ora contiene un `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagramma con un albero di componenti React. Il genitore è etichettato 'Scoreboard' con una bolla di state etichettata isPlayerA con valore 'true'. L'unico figlio, disposto a sinistra, è etichettato Counter con una bolla di state etichettata 'count' e valore 0. Tutto il figlio sinistro è evidenziato in giallo, indicando che è stato aggiunto.">

State iniziale

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagramma con un albero di componenti React. Il genitore è etichettato 'Scoreboard' con una bolla di state etichettata isPlayerA con valore 'false'. La bolla di state è evidenziata in giallo, indicando che è cambiata. Il figlio sinistro è sostituito con un'immagine gialla 'poof' che indica che è stato eliminato e c'è un nuovo figlio a destra, evidenziato in giallo che indica che è stato aggiunto. Il nuovo figlio è etichettato 'Counter' e contiene una bolla di state etichettata 'count' con valore 0.">

Clic su "successivo"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagramma con un albero di componenti React. Il genitore è etichettato 'Scoreboard' con una bolla di state etichettata isPlayerA con valore 'true'. La bolla di state è evidenziata in giallo, indicando che è cambiata. C'è un nuovo figlio a sinistra, evidenziato in giallo che indica che è stato aggiunto. Il nuovo figlio è etichettato 'Counter' e contiene una bolla di state etichettata 'count' con valore 0. Il figlio destro è sostituito con un'immagine gialla 'poof' che indica che è stato eliminato.">

Clic su "successivo" di nuovo

</Diagram>

</DiagramGroup>

Lo state di ciascun `Counter` viene distrutto ogni volta che viene rimosso dal DOM. Ecco perché si reimpostano ogni volta che clicchi il pulsante.

Questa soluzione è comoda quando hai solo pochi componenti indipendenti renderizzati nello stesso posto. In questo esempio, ne hai solo due, quindi non è un problema renderizzarli separatamente nel JSX.

### Opzione 2: Reimpostare lo state con una key {/*option-2-resetting-state-with-a-key*/}

C'è anche un altro modo, più generico, per reimpostare lo state di un componente.

Potresti aver visto le `key` quando [renderizzi liste.](/learn/rendering-lists#keeping-list-items-in-order-with-key) Le key non servono solo per le liste! Puoi usare le key per far distinguere a React qualsiasi componente. Per impostazione predefinita, React usa l'ordine all'interno del genitore ("primo contatore", "secondo contatore") per distinguere i componenti. Ma le key ti permettono di dire a React che questo non è solo un *primo* contatore, o un *secondo* contatore, ma un contatore specifico — ad esempio, il contatore di *Taylor*. In questo modo, React conoscerà il contatore di *Taylor* ovunque appaia nell'albero!

In questo esempio, i due `<Counter />` non condividono lo state anche se appaiono nello stesso posto nel JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Giocatore successivo!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Aggiungi uno
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Passare tra Taylor e Sarah non preserva lo state. Questo perché **hai dato loro `key` diverse:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Specificare una `key` dice a React di usare la `key` stessa come parte della posizione, invece del loro ordine all'interno del genitore. Ecco perché, anche se li renderizzi nello stesso posto nel JSX, React li vede come due contatori diversi, e quindi non condivideranno mai lo state. Ogni volta che un contatore appare sullo schermo, il suo state viene creato. Ogni volta che viene rimosso, il suo state viene distrutto. Alternare tra loro reimposta il loro state ogni volta.

<Note>

Ricorda che le key non sono univoche a livello globale. Specificano solo la posizione *all'interno del genitore*.

</Note>

### Reimpostare un form con una key {/*resetting-a-form-with-a-key*/}

Reimpostare lo state con una key è particolarmente utile quando si tratta di form.

In questa app di chat, il componente `<Chat>` contiene lo state dell'input di testo:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat con ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Invia a {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Prova a inserire qualcosa nell'input, e poi premi "Alice" o "Bob" per scegliere un destinatario diverso. Noterai che lo state dell'input viene preservato perché `<Chat>` è renderizzato nella stessa posizione nell'albero.

**In molte app, questo potrebbe essere il comportamento desiderato, ma non in un'app di chat!** Non vuoi permettere all'utente di inviare a una persona sbagliata un messaggio che ha già digitato a causa di un clic accidentale. Per risolverlo, aggiungi una `key`:

```js
<Chat key={to.id} contact={to} />
```

Questo garantisce che quando selezioni un destinatario diverso, il componente `Chat` verrà ricreato da zero, incluso qualsiasi state nell'albero sotto di esso. React ricreerà anche gli elementi DOM invece di riutilizzarli.

Ora cambiare destinatario svuota sempre il campo di testo:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat con ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Invia a {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### Preservare lo state per componenti rimossi {/*preserving-state-for-removed-components*/}

In una vera app di chat, probabilmente vorresti recuperare lo state dell'input quando l'utente seleziona di nuovo il destinatario precedente. Ci sono alcuni modi per mantenere lo state "vivo" per un componente che non è più visibile:

- Potresti renderizzare _tutte_ le chat invece di solo quella corrente, ma nascondere tutte le altre con CSS. Le chat non verrebbero rimosse dall'albero, quindi il loro state locale verrebbe preservato. Questa soluzione funziona benissimo per UI semplici. Ma può diventare molto lenta se gli alberi nascosti sono grandi e contengono molti nodi DOM.
- Potresti [alzare lo state](/learn/sharing-state-between-components) e conservare il messaggio in sospeso per ciascun destinatario nel componente genitore. In questo modo, quando i componenti figli vengono rimossi, non importa, perché è il genitore che conserva le informazioni importanti. Questa è la soluzione più comune.
- Potresti anche usare una fonte diversa oltre allo state di React. Ad esempio, probabilmente vuoi che una bozza di messaggio persista anche se l'utente chiude accidentalmente la pagina. Per implementarlo, potresti far inizializzare al componente `Chat` il suo state leggendo da [`localStorage`](https://developer.mozilla.org/it/docs/Web/API/Window/localStorage), e salvare le bozze lì.

Indipendentemente dalla strategia che scegli, una chat _con Alice_ è concettualmente distinta da una chat _con Bob_, quindi ha senso dare una `key` all'albero `<Chat>` in base al destinatario corrente.

</DeepDive>

<Recap>

- React mantiene lo state finché lo stesso componente è renderizzato nella stessa posizione.
- Lo state non è conservato nei tag JSX. È associato alla posizione nell'albero in cui metti quel JSX.
- Puoi forzare un sottoalbero a reimpostare il suo state dandogli una key diversa.
- Non annidare definizioni di componenti, altrimenti reimposterai lo state per sbaglio.

</Recap>



<Challenges>

#### Correggere il testo dell'input che scompare {/*fix-disappearing-input-text*/}

Questo esempio mostra un messaggio quando premi il pulsante. Tuttavia, premere il pulsante reimposta anche accidentalmente l'input. Perché succede? Correggilo in modo che premere il pulsante non reimposti il testo dell'input.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Suggerimento: La tua città preferita?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Nascondi suggerimento</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Mostra suggerimento</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Il problema è che `Form` è renderizzato in posizioni diverse. Nel ramo `if`, è il secondo figlio del `<div>`, ma nel ramo `else`, è il primo figlio. Quindi, il tipo di componente in ciascuna posizione cambia. La prima posizione alterna tra contenere un `p` e un `Form`, mentre la seconda posizione alterna tra contenere un `Form` e un `button`. React reimposta lo state ogni volta che il tipo di componente cambia.

La soluzione più semplice è unificare i rami in modo che `Form` venga sempre renderizzato nella stessa posizione:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Suggerimento: La tua città preferita?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Nascondi suggerimento</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Mostra suggerimento</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Tecnicamente, potresti anche aggiungere `null` prima di `<Form />` nel ramo `else` per corrispondere alla struttura del ramo `if`:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Suggerimento: La tua città preferita?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Nascondi suggerimento</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Mostra suggerimento</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

In questo modo, `Form` è sempre il secondo figlio, quindi resta nella stessa posizione e mantiene il suo state. Ma questo approccio è molto meno ovvio e introduce il rischio che qualcun altro rimuova quel `null`.

</Solution>

#### Scambiare due campi del form {/*swap-two-form-fields*/}

Questo form ti permette di inserire nome e cognome. Ha anche una checkbox che controlla quale campo va per primo. Quando selezioni la checkbox, il campo "Cognome" apparirà prima del campo "Nome".

Funziona quasi, ma c'è un bug. Se compili l'input "Nome" e selezioni la checkbox, il testo resterà nel primo input (che ora è "Cognome"). Correggilo in modo che il testo dell'input *si sposti* anche quando inverti l'ordine.

<Hint>

Sembra che per questi campi, la loro posizione all'interno del genitore non basti. C'è un modo per dire a React come abbinare lo state tra le ri-renderizzazioni?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Ordine inverso
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Cognome" />
        <Field label="Nome" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="Nome" />
        <Field label="Cognome" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Dai una `key` a entrambi i componenti `<Field>` in entrambi i rami `if` e `else`. Questo dice a React come "abbinare" lo state corretto per ciascun `<Field>` anche se il loro ordine all'interno del genitore cambia:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Ordine inverso
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Cognome" />
        <Field key="firstName" label="Nome" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="Nome" />
        <Field key="lastName" label="Cognome" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Reimpostare un form di dettaglio {/*reset-a-detail-form*/}

Questa è una lista di contatti modificabile. Puoi modificare i dettagli del contatto selezionato e poi premere "Salva" per aggiornarlo, o "Reimposta" per annullare le modifiche.

Quando selezioni un contatto diverso (ad esempio, Alice), lo state viene aggiornato ma il form continua a mostrare i dettagli del contatto precedente. Correggilo in modo che il form venga reimpostato quando cambia il contatto selezionato.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Nome:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Salva
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reimposta
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Dai `key={selectedId}` al componente `EditContact`. In questo modo, passare tra contatti diversi reimposterà il form:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Nome:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Salva
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reimposta
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Svuotare un'immagine mentre si carica {/*clear-an-image-while-its-loading*/}

Quando premi "Successivo", il browser inizia a caricare l'immagine successiva. Tuttavia, poiché viene visualizzata nello stesso tag `<img>`, per impostazione predefinita vedresti ancora l'immagine precedente finché la successiva non si carica. Questo può essere indesiderabile se è importante che il testo corrisponda sempre all'immagine. Modificalo in modo che nel momento in cui premi "Successivo", l'immagine precedente si svuoti immediatamente.

<Hint>

C'è un modo per dire a React di ricreare il DOM invece di riutilizzarlo?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Successivo
      </button>
      <h3>
        Immagine {index + 1} di {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

Puoi fornire una `key` al tag `<img>`. Quando quella `key` cambia, React ricreerà il nodo DOM `<img>` da zero. Questo causa un breve flash quando ogni immagine si carica, quindi non è qualcosa che vorresti fare per ogni immagine nella tua app. Ma ha senso se vuoi assicurarti che l'immagine corrisponda sempre al testo.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Successivo
      </button>
      <h3>
        Immagine {index + 1} di {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Correggere lo state fuori posto nella lista {/*fix-misplaced-state-in-the-list*/}

In questa lista, ogni `Contact` ha uno state che determina se "Mostra email" è stato premuto per esso. Premi "Mostra email" per Alice, e poi seleziona la checkbox "Mostra in ordine inverso". Noterai che è l'email di _Taylor_ ad essere espansa ora, ma quella di Alice — che si è spostata in fondo — appare collassata.

Correggilo in modo che lo state espanso sia associato a ciascun contatto, indipendentemente dall'ordinamento scelto.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Mostra in ordine inverso
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Nascondi' : 'Mostra'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Il problema è che questo esempio usava l'indice come `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

Tuttavia, vuoi che lo state sia associato a _ciascun contatto specifico_.

Usare l'ID del contatto come `key` risolve il problema:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Mostra in ordine inverso
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Nascondi' : 'Mostra'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

Lo state è associato alla posizione nell'albero. Una `key` ti permette di specificare una posizione nominata invece di basarti sull'ordine.

</Solution>

</Challenges>
