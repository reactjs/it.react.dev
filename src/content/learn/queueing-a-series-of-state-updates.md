---
title: Accodare più aggiornamenti dello state
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e potrebbe beneficiare di una revisione umana. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/queueing-a-series-of-state-updates.md).

</Note>

<Intro>

Impostare una variabile di state metterà in coda un'altra renderizzazione. Ma a volte potresti voler eseguire più operazioni sul valore prima di mettere in coda la prossima renderizzazione. Per fare questo, aiuta capire come React raggruppa gli aggiornamenti dello state.

</Intro>

<YouWillLearn>

* Cosa sia il *raggruppamento* e come React lo usa per elaborare più aggiornamenti dello state
* Come applicare diversi aggiornamenti alla stessa variabile di state di seguito

</YouWillLearn>

## React raggruppa gli aggiornamenti dello state {/*react-batches-state-updates*/}

Potresti aspettarti che cliccando il pulsante "+3" il contatore venga incrementato tre volte perché chiama `setNumber(number + 1)` tre volte:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Tuttavia, come potresti ricordare dalla sezione precedente, [i valori dello state di ogni renderizzazione sono fissi](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), quindi il valore di `number` all'interno del gestore di eventi della prima renderizzazione è sempre `0`, indipendentemente da quante volte chiami `setNumber(1)`:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Ma c'è un altro fattore in gioco. **React attende che *tutto* il codice nei gestori di eventi sia stato eseguito prima di elaborare gli aggiornamenti dello state.** Ecco perché la ri-renderizzazione avviene solo *dopo* tutte queste chiamate a `setNumber()`.

Questo potrebbe ricordarti un cameriere che prende un ordine al ristorante. Un cameriere non corre in cucina alla menzione del tuo primo piatto! Invece, ti lascia finire l'ordine, ti permette di modificarlo e persino di prendere ordini da altre persone al tavolo.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="Un'elegante cliente in un ristorante effettua più ordini con React, che fa da cameriere. Dopo aver chiamato setState() più volte, il cameriere annota l'ultimo ordine richiesto come ordine finale." />

Questo ti permette di aggiornare più variabili di state — persino da più componenti — senza innescare troppe [ri-renderizzazioni.](/learn/render-and-commit#re-renders-when-state-updates) Ma significa anche che l'UI non verrà aggiornata finché il tuo gestore di eventi, e qualsiasi codice al suo interno, non sarà completato. Questo comportamento, noto anche come **raggruppamento,** fa sì che la tua app React sia molto più veloce. Evita anche di dover gestire renderizzazioni "a metà" confuse, in cui solo alcune variabili sono state aggiornate.

**React non raggruppa tra *più* eventi intenzionali come i click** — ogni click viene gestito separatamente. Stai tranquillo: React raggruppa solo quando è generalmente sicuro farlo. Questo garantisce che, ad esempio, se il primo click disabilita un form, il secondo click non lo invii di nuovo.

## Aggiornare lo stesso state più volte prima della prossima renderizzazione {/*updating-the-same-state-multiple-times-before-the-next-render*/}

È un caso d'uso poco comune, ma se vuoi aggiornare la stessa variabile di state più volte prima della prossima renderizzazione, invece di passare il *prossimo valore dello state* come `setNumber(number + 1)`, puoi passare una *funzione* che calcola il prossimo state in base al precedente nella coda, come `setNumber(n => n + 1)`. È un modo per dire a React di "fare qualcosa con il valore dello state" invece di sostituirlo semplicemente.

Prova ad incrementare il contatore adesso:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Qui, `n => n + 1` è chiamata una **funzione di aggiornamento.** Quando la passi a un setter dello state:

1. React mette in coda questa funzione per essere elaborata dopo che tutto il resto del codice nel gestore di eventi è stato eseguito.
2. Durante la prossima renderizzazione, React attraversa la coda e ti restituisce lo state aggiornato finale.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Ecco come React elabora queste righe di codice mentre esegue il gestore di eventi:

1. `setNumber(n => n + 1)`: `n => n + 1` è una funzione. React la aggiunge a una coda.
1. `setNumber(n => n + 1)`: `n => n + 1` è una funzione. React la aggiunge a una coda.
1. `setNumber(n => n + 1)`: `n => n + 1` è una funzione. React la aggiunge a una coda.

Quando chiami `useState` durante la prossima renderizzazione, React attraversa la coda. Il valore precedente di `number` era `0`, quindi è quello che React passa alla prima funzione di aggiornamento come argomento `n`. Poi React prende il valore restituito dalla funzione di aggiornamento precedente e lo passa alla successiva come `n`, e così via:

|  aggiornamento in coda | `n` | restituisce |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React memorizza `3` come risultato finale e lo restituisce da `useState`.

Ecco perché cliccare "+3" nell'esempio sopra incrementa correttamente il valore di 3.
### Cosa succede se aggiorni lo state dopo averlo sostituito {/*what-happens-if-you-update-state-after-replacing-it*/}

Che dire di questo gestore di eventi? Quale pensi che sarà il valore di `number` nella prossima renderizzazione?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Ecco cosa questo gestore di eventi dice a React di fare:

1. `setNumber(number + 5)`: `number` è `0`, quindi `setNumber(0 + 5)`. React aggiunge *"sostituisci con `5`"* alla sua coda.
2. `setNumber(n => n + 1)`: `n => n + 1` è una funzione di aggiornamento. React aggiunge *quella funzione* alla sua coda.

Durante la prossima renderizzazione, React attraversa la coda dello state:

|   aggiornamento in coda       | `n` | restituisce |
|--------------|---------|-----|
| "sostituisci con `5`" | `0` (non usato) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React memorizza `6` come risultato finale e lo restituisce da `useState`.

<Note>

Potresti aver notato che `setState(5)` funziona in realtà come `setState(n => 5)`, ma `n` non viene usato!

</Note>

### Cosa succede se sostituisci lo state dopo averlo aggiornato {/*what-happens-if-you-replace-state-after-updating-it*/}

Proviamo un altro esempio. Quale pensi che sarà il valore di `number` nella prossima renderizzazione?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Ecco come React elabora queste righe di codice mentre esegue questo gestore di eventi:

1. `setNumber(number + 5)`: `number` è `0`, quindi `setNumber(0 + 5)`. React aggiunge *"sostituisci con `5`"* alla sua coda.
2. `setNumber(n => n + 1)`: `n => n + 1` è una funzione di aggiornamento. React aggiunge *quella funzione* alla sua coda.
3. `setNumber(42)`: React aggiunge *"sostituisci con `42`"* alla sua coda.

Durante la prossima renderizzazione, React attraversa la coda dello state:

|   aggiornamento in coda       | `n` | restituisce |
|--------------|---------|-----|
| "sostituisci con `5`" | `0` (non usato) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "sostituisci con `42`" | `6` (non usato) | `42` |

Poi React memorizza `42` come risultato finale e lo restituisce da `useState`.

Per riassumere, ecco come puoi pensare a ciò che passi al setter dello state `setNumber`:

* **Una funzione di aggiornamento** (es. `n => n + 1`) viene aggiunta alla coda.
* **Qualsiasi altro valore** (es. il numero `5`) aggiunge "sostituisci con `5`" alla coda, ignorando ciò che è già in coda.

Dopo che il gestore di eventi termina, React innesca una ri-renderizzazione. Durante la ri-renderizzazione, React elabora la coda. Le funzioni di aggiornamento vengono eseguite durante la renderizzazione, quindi **le funzioni di aggiornamento devono essere [pure](/learn/keeping-components-pure)** e solo *restituire* il risultato. Non provare a impostare lo state al loro interno o eseguire altri effetti collaterali. In Strict Mode, React eseguirà ogni funzione di aggiornamento due volte (ma scarterà il secondo risultato) per aiutarti a trovare errori.

### Convenzioni di denominazione {/*naming-conventions*/}

È comune denominare l'argomento della funzione di aggiornamento con le prime lettere della variabile di state corrispondente:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Se preferisci codice più verboso, un'altra convenzione comune è ripetere il nome completo della variabile di state, come `setEnabled(enabled => !enabled)`, oppure usare un prefisso come `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Impostare lo state non cambia la variabile nella renderizzazione esistente, ma richiede una nuova renderizzazione.
* React elabora gli aggiornamenti dello state dopo che i gestori di eventi hanno finito di essere eseguiti. Questo si chiama raggruppamento.
* Per aggiornare uno state più volte in un evento, puoi usare la funzione di aggiornamento `setNumber(n => n + 1)`.

</Recap>



<Challenges>

#### Correggi un contatore di richieste {/*fix-a-request-counter*/}

Stai lavorando a un'app marketplace d'arte che permette all'utente di inviare più ordini per un'opera d'arte contemporaneamente. Ogni volta che l'utente preme il pulsante "Buy", il contatore "Pending" dovrebbe aumentare di uno. Dopo tre secondi, il contatore "Pending" dovrebbe diminuire e il contatore "Completed" dovrebbe aumentare.

Tuttavia, il contatore "Pending" non si comporta come previsto. Quando premi "Buy", scende a `-1` (cosa che non dovrebbe essere possibile!). E se clicchi velocemente due volte, entrambi i contatori sembrano comportarsi in modo imprevedibile.

Perché succede? Correggi entrambi i contatori.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

All'interno del gestore di eventi `handleClick`, i valori di `pending` e `completed` corrispondono a quelli che erano al momento dell'evento click. Per la prima renderizzazione, `pending` era `0`, quindi `setPending(pending - 1)` diventa `setPending(-1)`, che è sbagliato. Poiché vuoi *incrementare* o *decrementare* i contatori, piuttosto che impostarli a un valore concreto determinato durante il click, puoi invece passare le funzioni di aggiornamento:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Questo garantisce che quando incrementi o decrementi un contatore, lo fai in relazione al suo state *più recente* piuttosto che a quello che era al momento del click.

</Solution>

#### Implementa tu stesso la coda dello state {/*implement-the-state-queue-yourself*/}

In questa sfida, reimplementerai una piccola parte di React da zero! Non è così difficile come sembra.

Scorri l'anteprima della sandbox. Nota che mostra **quattro casi di test.** Corrispondono agli esempi che hai visto prima in questa pagina. Il tuo compito è implementare la funzione `getFinalState` in modo che restituisca il risultato corretto per ciascuno di quei casi. Se la implementi correttamente, tutti e quattro i test dovrebbero passare.

Riceverai due argomenti: `baseState` è lo state iniziale (come `0`), e la `queue` è un array che contiene un mix di numeri (come `5`) e funzioni di aggiornamento (come `n => n + 1`) nell'ordine in cui sono stati aggiunti.

Il tuo compito è restituire lo state finale, proprio come mostrano le tabelle in questa pagina!

<Hint>

Se ti senti bloccato, inizia con questa struttura di codice:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: applica la funzione di aggiornamento
    } else {
      // TODO: sostituisci lo state
    }
  }

  return finalState;
}
```

Completa le righe mancanti!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Questo è l'esatto algoritmo descritto in questa pagina che React usa per calcolare lo state finale:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Ora sai come funziona questa parte di React!

</Solution>

</Challenges>
