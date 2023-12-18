---
title: Rispondere agli Eventi
---

<Intro>

React ti permette di aggiungere dei *gestori di eventi* al tuo JSX. I gestori di eventi sono funzioni scritte da te che verranno attivate in risposta ad interazioni come il click, il passaggio del mouse, il focus sugli input dei form, e così via.

</Intro>

<YouWillLearn>

* Modi differenti per scrivere un gestore di eventi
* Come passare la logica di gestione degli eventi da un componente genitore
* Come si propagano gli eventi e come fermarli

</YouWillLearn>

## Aggiungere gestori di eventi {/*adding-event-handlers*/}

Per aggiungere un gestore di eventi, dovrai prima definire una funzione e poi [passarla come prop](/learn/passing-props-to-a-component) al tag JSX appropriato. Ad esempio, ecco un bottone che per il momento non fa nulla:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

Puoi fargli mostrare un messaggio quando un utente clicca seguendo questi tre passaggi:

1. Dichiara una funzione chiamata `handleClick` *all'interno* del tuo componente `Button`.
2. Implementa la logica all'interno di quella funzione (usa `alert` per mostrare il messaggio).
3. Aggiungi `onClick={handleClick}` al tuo JSX `<button>`.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Hai definito la funzione `handleClick` e poi l'hai [passata come prop](/learn/passing-props-to-a-component) al tag `<button>`. `handleClick` è un **gestore di eventi**. Le funzioni gestore di eventi:

* Sono solitamente definite *all'interno* dei tuoi componenti.
* Hanno nomi che iniziano con `handle`, seguiti dal nome dell'evento.

Per convenzione, è comune chiamare i gestori di eventi come `handle` seguito dal nome dell'evento. Vedrai spesso `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, e così via.

In alternativa, puoi definire un gestore di eventi inline nel JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Oppure, più sinteticamente, usando una arrow function:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

Tutti questi stili sono equivalenti. I gestori di eventi inline sono comodi per le funzioni brevi.

<Pitfall>

Le funzioni passate ai gestori di eventi devono essere passate appunto, non chiamate. Ad esempio:

| passando una funzione (corretto)     | chiamando una funzione (incorretto)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

La differenza è minima. Nel primo esempio, la funzione `handleClick` viene passata come gestore di eventi `onClick`. Questo dice a React di ricordarla e di chiamarla solo quando l'utente clicca sul bottone.

Nel secondo esempio, le `()` alla fine di `handleClick()` fanno eseguire la funzione *immediatamente* durante il [rendering](/learn/render-and-commit), senza alcun click. Questo perché il codice JavaScript all'interno delle parentesi graffe [`{` e `}` del JSX](/learn/javascript-in-jsx-with-curly-braces) viene eseguito immediatamente.

Quando scrivi codice inline, la stessa insidia si presenta in modo diverso:

| passando una funzione (corretto)     | chiamando una funzione (incorretto)     |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Passando il codice inline in questo modo non scatena l'evento al click — viene scatenato ogni volta che il componente viene renderizzato:

```jsx
// Questo alert viene scatenato quando il componente viene renderizzato, non quando viene cliccato!
<button onClick={alert('You clicked me!')}>
```

Se vuoi definire il tuo gestore di eventi inline, incapsulalo in una funzione anonima come segue:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Invece di eseguire il codice all'interno con ogni render, questo crea una funzione da chiamare in seguito.

In entrambi i casi, quello che vuoi passare è una funzione:

* `<button onClick={handleClick}>` passa la funzione `handleClick`.
* `<button onClick={() => alert('...')}>` passa la funzione `() => alert('...')`.

[Leggi di più in merito alle arrow functions.](https://it.javascript.info/arrow-functions-basics)

</Pitfall>

### Leggere le props nei gestori di eventi {/*reading-props-in-event-handlers*/}

Poichè i gestori di eventi sono dichiarati all'interno di un componente, questi hanno accesso alle props del componente. Ecco un bottone che, quando cliccato, mostra un alert con la prop `message`:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Questo permette a questi due bottoni di mostrare messaggi differenti. Prova a cambiare i messaggi che gli vengono passati.

### Passare i gestori di eventi come props {/*passing-event-handlers-as-props*/}

Spesso vorrai che il componente genitore specifichi il gestore di eventi di un componente figlio. Considera i bottoni: a seconda di dove stai usando un componente `Button`, potresti voler eseguire una funzione diversa — forse una riproduce un film ed un'altra carica un'immagine.

Per fare questo, passa una prop che il componente riceve dal suo componente genitore come gestore di eventi in questo modo:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Qui, il componente `Toolbar` renderizza un `PlayButton` ed un `UploadButton`:

- `PlayButton` passa `handlePlayClick` come prop `onClick` al `Button` interno.
- `UploadButton` passa `() => alert('Uploading!')` come prop `onClick` al `Button` interno.

Infine, il componente `Button` accetta una prop chiamata `onClick`. Passa questa prop direttamente al `<button>` del browser con `onClick={onClick}`. Questo dice a React di chiamare al click la funzione passata.

Se utilizzi un [design system](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), è comune che i componenti come i bottoni contengano lo stile ma non specificano il comportamento. Invece, i componenti come `PlayButton` e `UploadButton` passeranno i gestori di eventi in basso.

### Denominare le props dei gestori di eventi {/*naming-event-handler-props*/}

I componenti integrati come `<button>` e `<div>` supportano solo [i nomi degli eventi del browser](/reference/react-dom/components/common#common-props) come `onClick`. Tuttavia, quando stai costruendo i tuoi componenti, puoi chiamare le props dei loro gestori di eventi in qualsiasi modo ti piaccia.

Per convenzione, le props dei gestori di eventi dovrebbero iniziare con `on`, seguito da una lettera maiuscola.

Ad esempio, la prop `onClick` del componente `Button` avrebbe potuto essere chiamata `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

In questo esempio, `<button onClick={onSmash}>` mostra che il `<button>` del browser (in minuscolo) necessita di una prop chiamata `onClick`, ma il nome della prop ricevuta dal tuo componente `Button` custom puoi deciderlo tu!

Quando il tuo componente supporta molteplici interazioni, potresti chiamare le props dei gestori di eventi con concetti specifici all'applicazione. Ad esempio, questo componente `Toolbar` riceve i gestori di eventi `onPlayMovie` e `onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Nota come il componente `App` non ha bisogno di sapere *cosa* farà `Toolbar` con `onPlayMovie` o `onUploadImage`. Questo è un dettaglio di implementazione di `Toolbar`. Qui, `Toolbar` li passa come gestori di eventi `onClick` ai suoi `Button`, ma potrebbe anche attivarli con una scorciatoia da tastiera. Dare alle props nomi specifici relativi all'applicazione come `onPlayMovie` ti dà la flessibilità di cambiare come vengono utilizzate in seguito.

<Note>

Assicurati di utilizzare i tag HTML appropriati per i tuoi gestori di eventi. Ad esempio, per gestire i click, usa [`<button onClick={handleClick}>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/button) invece di `<div onClick={handleClick}>`. L'uso di un vero pulsante del browser `<button>` consente comportamenti del browser integrati come la navigazione da tastiera. Se non ti piace lo stile predefinito del browser di un pulsante e vuoi farlo sembrare più un link o un diverso elemento dell'interfaccia utente, puoi ottenerlo con CSS. [Scopri di più sulla scrittura di markup accessibile.](https://developer.mozilla.org/it/docs/Learn/Accessibility/HTML)

</Note>

## Propagazione degli eventi {/*event-propagation*/}

I gestori di eventi cattureranno gli eventi da ogni elemento figlio che il tuo componente può possedere. Diciamo che un evento "bolle" o "si propaga" verso l'alto nell'albero: inizia con dove è avvenuto l'evento, e poi sale nell'albero.

Questo `<div>` contiene due bottoni. Sia il `<div>` *ed* ogni bottone hanno i propri gestori `onClick`. Quali gestori pensi che scatteranno quando cliccherai un bottone?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Se clicchi su entrambi i bottoni, i loro `onClick` scatteranno per primi, seguiti dall'`onClick` del `<div>` genitore. Appariranno quindi due messaggi. Se clicchi sulla toolbar, scatterà soltanto l'`onClick` del `<div>` genitore.

<Pitfall>

In React, tutti gli eventi si propagano eccetto `onScroll`, che funziona soltanto sul tag JSX al quale lo attacchi.

</Pitfall>

### Stoppare la propagazione {/*stopping-propagation*/}

Tutti i gestori di eventi ricevono un **oggetto evento** come loro unico argomento. Per convenzione, viene solitamente chiamato `e`, che sta per "evento". Puoi usare questo oggetto per leggere informazioni sull'evento.

Questo oggetto evento ti permette anche di stoppare la propagazione. Se vuoi prevenire che un evento raggiunga i componenti genitori, devi chiamare `e.stopPropagation()` come fa questo componente `Button`:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Quando clicchi su un bottone:

1. React chiama il gestore `onClick` passato al `<button>`.
2. Quel gestore, definito in `Button`, fa quanto segue:
   * Chiama `e.stopPropagation()`, prevenendo l'ulteriore propagazione dell'evento.
   * Chiama la funzione `onClick`, che è una prop passata dal componente `Toolbar`.
3. Quella funzione, definita nel componente `Toolbar`, mostra l'alert del bottone stesso.
4. Visto che la propagazione è stata fermata, il gestore `onClick` del genitore `<div>` **non** viene eseguito.

Come risultato di `e.stopPropagation()`, cliccando sui bottoni adesso mostra soltanto un singolo alert (dal `<button>`) piuttosto che due (dal `<button>` e dal `<div>` genitore della toolbar). Cliccare un bottone non è la stessa cosa che cliccare la toolbar circostante, quindi fermare la propagazione ha senso per questa UI.

<DeepDive>

#### Catturare eventi di fase {/*capture-phase-events*/}

In rari casi, potresti aver bisogno di catturare tutti gli eventi sugli elementi figli, *anche se la propagazione è stata fermata*. Per esempio, potresti voler loggare ogni click per gli analytics, indipendentemente dalla logica di propagazione. Puoi farlo aggiungendo `Capture` al termine del nome dell'evento:

```js
<div onClickCapture={() => { /* questo scatta per primo */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Ogni evento si propaga in tre fasi:

1. Viaggia verso il basso, chiamando tutti i gestori `onClickCapture`.
2. Esegue il gestore `onClick` dell'elemento cliccato.
3. Viaggia verso l'alto, chiamando tutti i gestori `onClick`.

Catturare gli eventi è utile per codice come router o analytics, ma probabilmente non li userai nel codice dell'app.

</DeepDive>

### Passare gestori come alternativa alla propagazione {/*passing-handlers-as-alternative-to-propagation*/}

Nota come questo gestore di click esegue una riga di codice _e poi_ chiama la prop `onClick` passata dal genitore:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Potresti aggiungere più codice a questo gestore prima di chiamare il gestore di eventi `onClick` del genitore. Questo pattern fornisce un'**alternativa** alla propagazione. Permette al componente figlio di gestire l'evento, mentre permette anche al componente genitore di specificare qualche comportamento aggiuntivo. A differenza della propagazione, non è automatico. Ma il vantaggio di questo pattern è che puoi seguire chiaramente tutta la catena di codice che si esegue come risultato di qualche evento.

Se ti affidi alla propagazione e ti risulta difficile tracciare quali gestori vengono eseguiti e perché, prova questo approccio.

### Prevenire comportamenti di default {/*preventing-default-behavior*/}

Alcuni eventi del browser hanno un comportamento di default associato ad essi. Per esempio, un evento di submit di un `<form>`, che si verifica quando viene cliccato un bottone al suo interno, ricaricherà la pagina di default:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Puoi chiamare `e.preventDefault()` sull'oggetto dell'evento per fermare questo comportamento:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Non confondere `e.stopPropagation()` e `e.preventDefault()`. Sono entrambi utili, ma non sono correlati:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) interrompe l'attivazione dei gestori di eventi associati ai tag soprastanti.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) impedisce il comportamento di default del browser per i pochi eventi che lo hanno.

## I gestori di eventi possono avere effetti collaterali? {/*can-event-handlers-have-side-effects*/}

Assolutamente! I gestori di eventi sono il posto migliore per gli effetti collaterali.

A differenza delle funzioni di rendering, i gestori di eventi non devono essere [puri](/learn/keeping-components-pure), quindi è un ottimo posto per *cambiare* qualcosa, per esempio cambiare il valore di un input in risposta alla digitazione o cambiare una lista in risposta alla pressione di un bottone. Tuttavia, per cambiare qualche informazione, devi prima avere un modo per memorizzarla. In React, questo viene fatto utilizzando lo [state, la memoria di un componente.](/learn/state-a-components-memory) Imparerai tutto su di esso nella prossima pagina.

<Recap>

* Puoi gestire gli eventi passando una funzione come prop ad un elemento come `<button>`.
* I gestori di eventi devono essere passati, **non chiamati!**. `onClick={handleClick}`, non `onClick={handleClick()}`.
* Puoi definire una funzione di gestione degli eventi separatamente oppure inline.
* I gestori di eventi sono definiti all'interno di un componente, quindi possono accedere alle props.
* Puoi dichiarare un gestore di eventi in un genitore e passarlo come prop ad un figlio.
* Puoi definire le tue props di gestione degli eventi con nomi specifici dell'applicazione.
* Gli eventi si propagano verso l'alto. Chiama `e.stopPropagation()` sul primo argomento per impedirlo.
* Gli eventi possono avere alcuni comportamenti indesiderati di default del browser. Chiama `e.preventDefault()` per impedirlo.
* Chiamare esplicitamente una prop di gestione degli eventi da un gestore figlio è un'ottima alternativa alla propagazione.

</Recap>



<Challenges>

#### Aggiustare un gestore di eventi {/*fix-an-event-handler*/}

Cliccando questo bottone si suppone che lo sfondo della pagina passi da bianco a nero. Tuttavia, non succede nulla quando lo clicchi. Risolvi il problema. (Non preoccuparti della logica all'interno di `handleClick` - quella parte va bene)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

Il problema è che `<button onClick={handleClick()}>` _chiama_ la funzione `handleClick` durante il rendering invece di _passarla_. Rimuovendo la chiamata `()` in modo che sia `<button onClick={handleClick}>` il problema viene risolto:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

In alternativa, potresti incapsulare la chiamata in un'altra funzione, come `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Collegare gli eventi {/*wire-up-the-events*/}

Questo componente `ColorSwitch` renderizza un bottone. Dovrebbe cambiare il colore della pagina. Collegalo al gestore di eventi `onChangeColor` che riceve dal genitore in modo che cliccando il bottone il colore cambi.

Dopo aver fatto questo, noterai che cliccando il bottone verrà incrementato anche il contatore di click della pagina. Il tuo collega che ha scritto il componente genitore insiste sul fatto che `onChangeColor` non incrementa nessun contatore. Cosa potrebbe essere successo? Risolvi il problema in maniera tale che cliccando il bottone cambi *solo* il colore e _non_ incrementi il contatore.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Per prima cosa, hai bisogno di aggiungere il gestore di eventi, come `<button onClick={onChangeColor}>`.

Tuttavia, questo introduce il problema di incrementare il contatore. Se `onChangeColor` non é responsabile di questo, come insiste nel dire il tuo collega, allora il problema è che questo evento si propaga verso l'alto e qualche gestore più in alto lo incrementa. Per risolvere questo problema, devi fermare la propagazione. Ma non dimenticare che dovresti comunque chiamare `onChangeColor`.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
