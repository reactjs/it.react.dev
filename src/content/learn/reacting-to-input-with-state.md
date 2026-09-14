---
title: Reagire all'input con lo State
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/reacting-to-input-with-state.md).

</Note>

<Intro>

React offre un modo dichiarativo di manipolare la UI. Invece di manipolare direttamente i singoli pezzi della UI, descrivi i diversi stati visuali in cui il tuo componente può trovarsi e passi da uno all'altro in risposta all'input dell'utente. È simile a come i designer pensano la UI.

</Intro>

<YouWillLearn>

* In cosa la programmazione UI dichiarativa differisce da quella imperativa
* Come elencare i diversi stati visuali in cui il tuo componente può trovarsi
* Come innescare i passaggi tra i diversi stati visuali dal codice

</YouWillLearn>

## Come la UI dichiarativa si confronta con quella imperativa {/*how-declarative-ui-compares-to-imperative*/}

Quando progetti interazioni UI, probabilmente pensi a come la UI *cambia* in risposta alle azioni dell'utente. Considera un form che permette all'utente di inviare una risposta:

* Quando digiti qualcosa nel form, il pulsante "Submit" **viene abilitato.**
* Quando premi "Submit", sia il form che il pulsante **vengono disabilitati** e compare uno spinner.
* Se la richiesta di rete ha successo, il form **viene nascosto** e compare il messaggio "Thank you".
* Se la richiesta di rete fallisce, compare un messaggio di errore e il form **viene abilitato** di nuovo.

Nella **programmazione imperativa,** quanto sopra corrisponde direttamente a come implementi l'interazione. Devi scrivere le istruzioni esatte per manipolare la UI a seconda di cosa è appena successo. Ecco un altro modo di pensarci: immagina di sederti accanto a qualcuno in macchina e dirgli turno per turno dove andare.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="In un'auto guidata da una persona dall'aria ansiosa che rappresenta JavaScript, un passeggero ordina al conducente di eseguire una sequenza complicata di navigazioni turno per turno." />

Non sanno dove vuoi andare, seguono solo i tuoi comandi. (E se sbagli le indicazioni, finisci nel posto sbagliato!) Si chiama *imperativa* perché devi "comandare" ogni elemento, dallo spinner al pulsante, dicendo al computer *come* aggiornare la UI.

In questo esempio di programmazione UI imperativa, il form è costruito *senza* React. Usa solo il [DOM](https://developer.mozilla.org/it/docs/Web/API/Document_Object_Model) del browser:

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Manipolare la UI in modo imperativo funziona abbastanza bene per esempi isolati, ma diventa esponenzialmente più difficile da gestire in sistemi più complessi. Immagina di aggiornare una pagina piena di form diversi come questo. Aggiungere un nuovo elemento UI o una nuova interazione richiederebbe di controllare attentamente tutto il codice esistente per assicurarti di non aver introdotto un bug (ad esempio, dimenticare di mostrare o nascondere qualcosa).

React è stato creato per risolvere questo problema.

In React, non manipoli direttamente la UI — cioè non abiliti, disabiliti, mostri o nascondi i componenti direttamente. Invece, **dichiari cosa vuoi mostrare** e React capisce come aggiornare la UI. Pensa di salire su un taxi e dire al conducente dove vuoi andare invece di dirgli esattamente dove girare. È compito del conducente portarti lì, e potrebbe anche conoscere scorciatoie che non avevi considerato!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="In un'auto guidata da React, un passeggero chiede di essere portato in un luogo specifico sulla mappa. React capisce come farlo." />

## Pensare alla UI in modo dichiarativo {/*thinking-about-ui-declaratively*/}

Hai visto sopra come implementare un form in modo imperativo. Per capire meglio come pensare in React, riimplementerai questa UI in React di seguito:

1. **Identifica** i diversi stati visuali del tuo componente
2. **Determina** cosa innesca quei cambiamenti di state
3. **Rappresenta** lo state in memoria usando `useState`
4. **Rimuovi** tutte le variabili di state non essenziali
5. **Collega** i gestori di eventi per impostare lo state

### Step 1: Identifica i diversi stati visuali del tuo componente {/*step-1-identify-your-components-different-visual-states*/}

In informatica, potresti sentir parlare di una ["macchina a stati"](https://it.wikipedia.org/wiki/Automa_a_stati_finiti) che si trova in uno di diversi "stati". Se lavori con un designer, potresti aver visto mockup per diversi "stati visuali". React si colloca all'incrocio tra design e informatica, quindi entrambe queste idee sono fonti di ispirazione.

Per prima cosa, devi visualizzare tutti i diversi "stati" della UI che l'utente potrebbe vedere:

* **Empty**: Il form ha un pulsante "Submit" disabilitato.
* **Typing**: Il form ha un pulsante "Submit" abilitato.
* **Submitting**: Il form è completamente disabilitato. Viene mostrato uno spinner.
* **Success**: Al posto del form viene mostrato il messaggio "Thank you".
* **Error**: Come in *Typing*, ma con un messaggio di errore aggiuntivo.

Proprio come un designer, vorrai creare "mock" o "mockup" per i diversi stati prima di aggiungere la logica. Ad esempio, ecco un mock solo per la parte visiva del form. Questo mock è controllato da una prop chiamata `status` con un valore predefinito di `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Potresti chiamare quella prop come preferisci, il nome non è importante. Prova a modificare `status = 'empty'` in `status = 'success'` per vedere comparire il messaggio di successo. Creare mock ti permette di iterare rapidamente sulla UI prima di collegare qualsiasi logica. Ecco un prototipo più completo dello stesso componente, ancora "controllato" dalla prop `status`:

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Mostrare molti stati visuali contemporaneamente {/*displaying-many-visual-states-at-once*/}

Se un componente ha molti stati visuali, può essere comodo mostrarli tutti in una sola pagina:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Pagine come questa sono spesso chiamate "living styleguide" o "storybook".

</DeepDive>

### Step 2: Determina cosa innesca quei cambiamenti di state {/*step-2-determine-what-triggers-those-state-changes*/}

Puoi innescare aggiornamenti dello state in risposta a due tipi di input:

* **Input umani,** come cliccare un pulsante, digitare in un campo, navigare un link.
* **Input del computer,** come l'arrivo di una risposta di rete, il completamento di un timeout, il caricamento di un'immagine.

<IllustrationBlock>
  <Illustration caption="Input umani" alt="Un dito." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Input del computer" alt="Uno e zero." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

In entrambi i casi, **devi impostare le [variabili di state](/learn/state-a-components-memory#anatomy-of-usestate) per aggiornare la UI.** Per il form che stai sviluppando, dovrai cambiare lo state in risposta a diversi input:

* **Cambiare l'input di testo** (umano) dovrebbe passare dallo stato *Empty* allo stato *Typing* o viceversa, a seconda che la casella di testo sia vuota o meno.
* **Cliccare il pulsante Submit** (umano) dovrebbe passare allo stato *Submitting*.
* **Risposta di rete riuscita** (computer) dovrebbe passare allo stato *Success*.
* **Risposta di rete fallita** (computer) dovrebbe passare allo stato *Error* con il messaggio di errore corrispondente.

<Note>

Nota che gli input umani spesso richiedono [gestori di eventi](/learn/responding-to-events)!

</Note>

Per aiutarti a visualizzare questo flusso, prova a disegnare ogni stato visivo su un foglio come un cerchio etichettato, e ogni cambiamento tra due stati come una freccia. Puoi abbozzare molti flussi in questo modo e individuare bug molto prima dell'implementazione.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Diagramma di flusso che si muove da sinistra a destra con 5 nodi. Il primo nodo etichettato 'empty' ha un arco etichettato 'start typing' collegato a un nodo etichettato 'typing'. Quel nodo ha un arco etichettato 'press submit' collegato a un nodo etichettato 'submitting', che ha due archi. L'arco sinistro è etichettato 'network error' e collega a un nodo etichettato 'error'. L'arco destro è etichettato 'network success' e collega a un nodo etichettato 'success'.">

Stati del form

</Diagram>

</DiagramGroup>

### Step 3: Rappresenta lo state in memoria con `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Poi dovrai rappresentare gli stati visuali del tuo componente in memoria con [`useState`.](/reference/react/useState) La semplicità è fondamentale: ogni pezzo di state è un "pezzo mobile", e **vuoi il minor numero possibile di "pezzi mobili".** Più complessità significa più bug!

Inizia con lo state che *deve assolutamente* esserci. Ad esempio, dovrai memorizzare la `answer` per l'input e l'`error` (se esiste) per memorizzare l'ultimo errore:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Poi, avrai bisogno di una variabile di state che rappresenti quale degli stati visuali vuoi mostrare. Di solito c'è più di un modo per rappresentarlo in memoria, quindi dovrai sperimentare.

Se fai fatica a pensare subito al modo migliore, inizia aggiungendo abbastanza state da essere *sicuro* che tutti i possibili stati visuali siano coperti:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

La tua prima idea probabilmente non sarà la migliore, ma va bene — rifattorizzare lo state fa parte del processo!

### Step 4: Rimuovi tutte le variabili di state non essenziali {/*step-4-remove-any-non-essential-state-variables*/}

Vuoi evitare duplicazioni nel contenuto dello state così da tracciare solo ciò che è essenziale. Dedicare un po' di tempo a rifattorizzare la struttura dello state renderà i tuoi componenti più facili da capire, ridurrà la duplicazione ed eviterà significati involontari. Il tuo obiettivo è **prevenire i casi in cui lo state in memoria non rappresenta alcuna UI valida che vorresti mostrare a un utente.** (Ad esempio, non vorresti mai mostrare un messaggio di errore e disabilitare l'input contemporaneamente, altrimenti l'utente non potrà correggere l'errore!)

Ecco alcune domande che puoi fare sulle tue variabili di state:

* **Questo state causa un paradosso?** Ad esempio, `isTyping` e `isSubmitting` non possono essere entrambi `true`. Un paradosso di solito significa che lo state non è abbastanza vincolato. Ci sono quattro possibili combinazioni di due booleani, ma solo tre corrispondono a stati validi. Per rimuovere lo state "impossibile", puoi combinarli in un `status` che deve essere uno di tre valori: `'typing'`, `'submitting'` o `'success'`.
* **Le stesse informazioni sono già disponibili in un'altra variabile di state?** Un altro paradosso: `isEmpty` e `isTyping` non possono essere entrambi `true` contemporaneamente. Rendendoli variabili di state separate, rischi che si desincronizzino e causino bug. Fortunatamente, puoi rimuovere `isEmpty` e controllare invece `answer.length === 0`.
* **Puoi ottenere le stesse informazioni dall'inverso di un'altra variabile di state?** `isError` non serve perché puoi controllare `error !== null`.

Dopo questa pulizia, ti restano 3 (da 7!) variabili di state *essenziali*:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

Sai che sono essenziali, perché non puoi rimuoverne nessuna senza rompere la funzionalità.

<DeepDive>

#### Eliminare stati "impossibili" con un reducer {/*eliminating-impossible-states-with-a-reducer*/}

Queste tre variabili sono una rappresentazione abbastanza buona dello state di questo form. Tuttavia, ci sono ancora alcuni stati intermedi che non hanno pieno senso. Ad esempio, un `error` non nullo non ha senso quando `status` è `'success'`. Per modellare lo state in modo più preciso, puoi [estrarlo in un reducer.](/learn/extracting-state-logic-into-a-reducer) I reducer ti permettono di unificare più variabili di state in un singolo oggetto e consolidare tutta la logica correlata!

</DeepDive>

### Step 5: Collega i gestori di eventi per impostare lo state {/*step-5-connect-the-event-handlers-to-set-state*/}

Infine, crea gestori di eventi che aggiornano lo state. Di seguito c'è il form finale, con tutti i gestori di eventi collegati:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Anche se questo codice è più lungo dell'esempio imperativo originale, è molto meno fragile. Esprimere tutte le interazioni come cambiamenti di state ti permette di introdurre in seguito nuovi stati visuali senza rompere quelli esistenti. Ti permette anche di cambiare cosa deve essere mostrato in ogni stato visivo senza modificare la logica dell'interazione stessa.

<Recap>

* La programmazione dichiarativa significa descrivere la UI per ogni stato visivo piuttosto che microgestire la UI (imperativo).
* Quando sviluppi un componente:
  1. Identifica tutti i suoi stati visuali.
  2. Determina gli input umani e del computer che innescano i cambiamenti di state.
  3. Modella lo state con `useState`.
  4. Rimuovi lo state non essenziale per evitare bug e paradossi.
  5. Collega i gestori di eventi per impostare lo state.

</Recap>



<Challenges>

#### Aggiungere e rimuovere una classe CSS {/*add-and-remove-a-css-class*/}

Fai in modo che cliccare sull'immagine *rimuova* la classe CSS `background--active` dal `<div>` esterno, ma *aggiunga* la classe `picture--active` all'`<img>`. Cliccare di nuovo sullo sfondo dovrebbe ripristinare le classi CSS originali.

Visivamente, dovresti aspettarti che cliccare sull'immagine rimuova lo sfondo viola e evidenzi il bordo dell'immagine. Cliccare fuori dall'immagine evidenzia lo sfondo, ma rimuove l'evidenziazione del bordo dell'immagine.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Questo componente ha due stati visuali: quando l'immagine è attiva e quando l'immagine è inattiva:

* Quando l'immagine è attiva, le classi CSS sono `background` e `picture picture--active`.
* Quando l'immagine è inattiva, le classi CSS sono `background background--active` e `picture`.

Una singola variabile di state booleana è sufficiente per ricordare se l'immagine è attiva. Il compito originale era rimuovere o aggiungere classi CSS. Tuttavia, in React devi *descrivere* ciò che vuoi vedere piuttosto che *manipolare* gli elementi UI. Quindi devi calcolare entrambe le classi CSS in base allo state corrente. Devi anche [fermare la propagazione](/learn/responding-to-events#stopping-propagation) così che cliccare sull'immagine non venga registrato come un click sullo sfondo.

Verifica che questa versione funzioni cliccando sull'immagine e poi fuori da essa:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

In alternativa, potresti restituire due blocchi JSX separati:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Tieni presente che se due blocchi JSX diversi descrivono lo stesso albero, il loro annidamento (primo `<div>` → prima `<img>`) deve corrispondere. Altrimenti, attivare/disattivare `isActive` ricreerebbe l'intero albero sottostante e [reimposterebbe il suo state.](/learn/preserving-and-resetting-state) Per questo, se un albero JSX simile viene restituito in entrambi i casi, è meglio scriverlo come un unico blocco JSX.

</Solution>

#### Editor del profilo {/*profile-editor*/}

Ecco un piccolo form implementato con JavaScript e DOM puro. Gioca con esso per capirne il comportamento:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Questo form passa tra due modalità: in modalità modifica vedi gli input, e in modalità visualizzazione vedi solo il risultato. L'etichetta del pulsante cambia tra "Edit" e "Save" a seconda della modalità in cui ti trovi. Quando modifichi gli input, il messaggio di benvenuto in basso si aggiorna in tempo reale.

Il tuo compito è reimplementarlo in React nel sandbox qui sotto. Per comodità, il markup è già stato convertito in JSX, ma dovrai far sì che mostri e nasconda gli input come fa l'originale.

Assicurati di aggiornare anche il testo in basso!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Avrai bisogno di due variabili di state per memorizzare i valori degli input: `firstName` e `lastName`. Avrai anche bisogno di una variabile di state `isEditing` che indica se mostrare gli input o meno. Non dovresti _aver bisogno_ di una variabile `fullName` perché il nome completo può sempre essere calcolato da `firstName` e `lastName`.

Infine, dovresti usare la [renderizzazione condizionale](/learn/conditional-rendering) per mostrare o nascondere gli input a seconda di `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Confronta questa soluzione con il codice imperativo originale. In cosa differiscono?

</Solution>

#### Rifattorizzare la soluzione imperativa senza React {/*refactor-the-imperative-solution-without-react*/}

Ecco il sandbox originale della sfida precedente, scritto in modo imperativo senza React:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Immagina che React non esista. Riesci a rifattorizzare questo codice così che la logica sia meno fragile e più simile alla versione React? Come sarebbe se lo state fosse esplicito, come in React?

Se fai fatica a capire da dove iniziare, lo stub qui sotto ha già la maggior parte della struttura. Se parti da lì, completa la logica mancante nella funzione `updateDOM`. (Fai riferimento al codice originale dove serve.)

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

La logica mancante includeva l'attivazione/disattivazione della visualizzazione di input e contenuto, e l'aggiornamento delle etichette:

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

La funzione `updateDOM` che hai scritto mostra cosa fa React sotto il cofano quando imposti lo state. (Tuttavia, React evita anche di toccare il DOM per le proprietà che non sono cambiate dall'ultima volta che sono state impostate.)

</Solution>

</Challenges>
