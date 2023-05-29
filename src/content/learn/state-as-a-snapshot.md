---
title: Lo State come un'Istantanea
---

<Intro>

Le variabili di state possono sembrare delle normali variabili JavaScript su cui è possibile leggere e scrivere. Tuttavia lo state si comporta più come un'istantanea. Quando lo si assegna, non si modifica la variabile di state che si ha già, ma si innesca una nuova renderizzazione.

</Intro>

<YouWillLearn>

* Come l'assegnazione dello state innesca re-renderizzazioni
* Come e quando viene aggiornato lo state
* Perché lo state non viene aggiornato immediatamente dopo averlo assegnato
* Come i gestori di eventi accedono ad un'"istantanea" dello state

</YouWillLearn>

## Come l'assegnazione dello state innesca renderizzazioni {/*setting-state-triggers-renders*/}

Si potrebbe pensare che l'interfaccia dell'utente cambi direttamente in risposta ad un evento dell'utente stesso, come un click. In React funziona in modo leggermente diverso da questo modello mentale. Nella pagina precedente si è visto che quando [si assegna lo state si richiede una nuova ri-renderizzazione](/learn/render-and-commit#step-1-trigger-a-render) da React. Questo significa che per far reagire l'interfaccia al evento, è necessario *aggiornare lo state*.

In questo esempio, quando premi "Send", `setIsSent(true)` dice a React di re-renderizzare la UI.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Ecco cosa succede quando fai click sul pulsante:

1. Viene eseguito il gestore di eventi `onSubmit`.
2. `setIsSent(true)` assegnat `isSent` a `true` e mette in coda un nuovo render.
3. React re-renderizza il componente in base al nuovo valore di `isSent`.

Esaminiamo più da vicino la relazione tra lo state e il renderizzato.

## La renderizzazione scatta un'istantanea nel tempo {/*la-renderizzazione-scatta-unistantanea-nel-tempo*/}

["Renderizzare"](/learn/render-and-commit#step-2-react-renders-your-components) significa che React chiama il componente, che è una funzione. Il JSX che restituisce tale funzione è come un'istantanea della UI nel tempo. Le props, i gestori di eventi e le variabili locali sono stati calcolati **utilizzando il suo state al momento della renderizzazione.**

A differenza di una fotografia o di un fotogramma di un film, l'"istantanea" della UI che viene restituita è interattiva. Include la logica, come i gestori di eventi che specificano cosa succede in risposta agli input. React aggiorna lo schermo in base a questa istantanea e collega i gestori di eventi. Di conseguenza, la pressione di un pulsante attiverà il gestore di click dal JSX.

Quando React re-renderizza un componente:

1. React chiama di nuovo la tua funzione.
2. La tua funzione restituisce una nuova istantanea JSX.
3. React aggiorna quindi la schermata in modo che corrisponda all'istantanea restituita.

<IllustrationBlock sequential>
    <Illustration caption="React esegue la funzione" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Calcola la istantanea" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Aggiorna l'albero del DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Come memoria di un componente, lo state non è come una normale variabile che scompare dopo che la tua funzione restituisce un valore. Lo state "vive" nello stesso React--come se si trattasse di uno scaffale!--fuori dalla tua funzione. Quando React chiama il tuo componente, fornisce un'istantanea della UI per quel particolare renderizzato. Il tuo componente restituisce un'istantanea della UI con un nuovo set di props e gestori di eventi nel suo JSX, tutti calcolati **usando i valori dello stato di quel renderizzato.**

<IllustrationBlock sequential>
  <Illustration caption="Tu dici a React di aggiornare lo state" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React aggiorna il valore dello state" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React passa un'istantanea del valore dello state al componente" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Ecco qui un piccolo esperimento per mostrarti come questo funziona. In questo esempio, potresti aspettarti che, cliccando il bottone "+3", il contatore venga incrementato tre volte, perché viene richiamato `setNumber(number + 1)` tre volte.

Guarda cosa succede quando fai click sul bottone "+3":

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

Osserva che `number` viene incrementato solo una volta per click!

**L'assegnazione dello stato cambia solo per il *prossimo* renderizzato.** Durante il primo renderizzato, `number` era `0`. È per questo che, nel gestore `onClick` di *quel renderizzato*, il valore di `number` è ancora `0`  anche dopo che stato richiamato `setNumber(number + 1)`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Questo è ciò che il gestore del click per questo pulsante dice a React di fare:

1. `setNumber(number + 1)`: `number` è `0` quindi `setNumber(0 + 1)`.
    - React si prepara per cambiare `number` a `1` nella prossima renderizzazione.
2. `setNumber(number + 1)`: `number` è `0` quindi `setNumber(0 + 1)`.
    - React si prepara per cambiare `number` a `1` nella prossima renderizzazione.
3. `setNumber(number + 1)`: `number` è `0` quindi `setNumber(0 + 1)`.
    - React si prepara per cambiare `number` a `1` nella prossima renderizzazione.

Anche se hai chiamato `setNumber(number + 1)` tre volte, nel gestore di eventi di *questa renderizzazione* `number` è sempre `0`, quindi stai assegnando lo state a `1` per tre volte. Questo è il motivo per cui, dopo che il tuo gestore di eventi ha finito, React ri-renderizza il componente con `number` uguale a `1` piuttosto che `3`.

Puoi anche visualizzarlo sostituendo mentalmente le variabili di state con i loro valori nel tuo codice. Poiché il valore della variabile di state `number` è `0` per *questa renderizzazione*, il suo gestore di eventi si presenta in questo modo:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Per il prossimo renderizzato, `number` sarà `1`, quindi il gestore del click di *quel prossimo renderizzato* avrà l'aspetto seguente:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Per questo, cliccando di nuovo il bottone, il contatore viene impostato a `2`, successivamente nel prossimo click a `3` e cosi via.

## Lo state nel tempo {/*state-over-time*/}

Bene, questo è stato divertente. Prova a indovinare che cosa mostrerà l'alert al click di questo bottone.

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Se utilizzi  il metodo si sostituzione di prima, puoi intuire che l'alert mostra "0":

```js
setNumber(0 + 5);
alert(0);
```

Ma cosa succede se imposti un timer per l'alert, in modo che si attivi _dopo_ che il componente ha re-renderizzato? Mostrerà "0" o "5"? Indovina!

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Sorpreso? Se hai utilizzato il metodo di sostituzione, puoi vedere l'"istantanea" del valore dello state passato all'alert.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

Il valore dello state memorizzato in React potrebbe essere cambiato al momento in cui si esegue l'alert, ma questo è stato pianificato utilizzando un'istantanea dello state nel momento in cui l'utente ha interagito con esso!

**Il valore di una variabile di state non cambia mai all'interno di una renderizzazione,** anche se il codice del suo gestore di eventi è asincrono. Dentro l'`onClick` di *quella renderizzazione*, il valore di `number` continua a essere `0` anche dopo che `setNumber(number + 5)` è stato eseguito. Il suo valore è stato "fissato" quando React ha "scattato l'istantanea" della UI chiamando il tuo componente. 

Ecco un esempio di come questo rende i gestori di eventi meno inclini a errori di sincronizzazione. Di seguito è riportato un formulario che invia un messaggio con un ritardo di cinque secondi. Immagina questo scenario:

1. Premi il pulsante "Send", inviando "Hello" ad Alice.
2. Prima dello scadere dei cinque secondi, cambia il valore del campo "To" in "Bob".

Cosa ti aspetti che mostri l'alert? Mostrerà "You said Hello to Alice"? Oppure "You said Hello to Bob"? Fai una previsione basandoti su che ciò che hai imparato e dopo provalo:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React mantiene i valori di state "fissi" all'interno dei gestori di eventi di una renderizzazione.** Non c'è bisogno di preoccuparsi se lo state è cambiato durante l'esecuzione del codice.

Ma cosa succede se vuoi leggere lo state più recente prima di una nuova renderizzazione? In questo caso, si dovrebbe utilizzare una [funzione di aggiornamento dello state](/learn/queueing-a-series-of-state-updates), descritta pagina successiva!

<Recap>

* L'assegnazione dello state richiede una nuova renderizzazione.
* React memorizza lo state al di fuori del tuo componente, come se fosse su uno scaffale.
* Quando chiami `useState`, React ti fornisce un'istantanea dello state per quella renderizzazione.
* Le variabili e i gestori di eventi non "sopravvivono" ai re-renderizzamenti. Ongi renderizzamento ha i propri gestori di eventi.
* Ogni renderizzazione (e le funzioni al suo interno) "vedrà" sempre l'istantanea dello state che React ha dato in *quella* renderizzazione.
* Puoi sostituire mentalmente lo state nei gestori di eventi, in modo simile a a come pensi nel JSX renderizzato. 
* I gestori di eventi creati in passato hanno il valore di state della renderizzazione in cui sono stati creati

</Recap>



<Challenges>

#### Implementa un semaforo {/*implement-a-traffic-light*/}

Ecco un componente luminoso per le strisce pedonali che cambia quando viene premuto il bottone:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Aggiungi un `alert` al gestore di click. Quando la luce è verde e dice "Walk", cliccando il bottone dovrebbe dire "Stop is next". Quando la luce è rossa e dice "Stop", cliccando il bottone dovrebbe dire "Walk is next".

C'è qualche differenza se l'`alert` viene impostato prima o dopo la chiamata a `setWalk`? 

<Solution>

Il tuo `alert` dovrebbe avere l'aspetto seguente:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Non fa differenza se lo imposti prima o dopo della chiamata `setWalk`. Il valore della renderizzazione di `walk` rimane fisso. La chiamata a `setWalk` lo modificherà solo per la prossima renderizzazione, ma non influenzerà il gestore di eventi di eventi della renderizzazione precendente.

Questa riga potrebbe sembrare controintuitiva all'inizio:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

Però ha senso se la leggi come: "Se il semaforo mostra 'Walk now', il messaggio dovrebbe dire 'Stop is next.'" La variabile `walk` dentro il tuo gestore di eventi corrisponde al valore  di walk della renderizzazione e non cambia.

Puoi verificare che ciò sia corretto applicando il metodo della sostituzione. Quando `walk` è `true`, otterrai: 

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

Quindi, cliccando su "Change to Stop", si mette in coda un rendering con `walk` impostato su `false` e viene visualizzato "Stop is next". 

</Solution>

</Challenges>