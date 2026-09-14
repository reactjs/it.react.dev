---
title: "<input>"
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/components/input.md).

</Note>

<Intro>

Il [componente browser integrato `<input>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/input) ti permette di renderizzare diversi tipi di input per i form.

```js
<input />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<input>` {/*input*/}

Per visualizzare un input, renderizza il [componente browser integrato `<input>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/input).

```js
<input name="myInput" />
```

[Vedi altri esempi sotto.](#usage)

#### Props {/*props*/}

`<input>` supporta tutte le [props comuni degli elementi.](/reference/react-dom/components/common#common-props)

- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Una stringa o una funzione. Sostituisce l'`<form action>` padre per `type="submit"` e `type="image"`. Quando a `action` viene passato un URL, il form si comporterà come un form HTML standard. Quando a `formAction` viene passata una funzione, la funzione gestirà l'invio del form. Vedi [`<form action>`](/reference/react-dom/components/form#props).

Puoi [controllare un input](#controlling-an-input-with-a-state-variable) passando una di queste props:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Un booleano. Per un input checkbox o un radio button, controlla se è selezionato.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): Una stringa. Per un input di testo, controlla il suo testo. (Per un radio button, specifica i suoi dati del form.)

Quando passi una delle due, devi anche passare un gestore di eventi `onChange` che aggiorni il valore passato.

Queste props di `<input>` sono rilevanti solo per input non controllati:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Un booleano. Specifica [il valore iniziale](#providing-an-initial-value-for-an-input) per input `type="checkbox"` e `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): Una stringa. Specifica [il valore iniziale](#providing-an-initial-value-for-an-input) per un input di testo.

Queste props di `<input>` sono rilevanti sia per input non controllati che controllati:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): Una stringa. Specifica quali tipi di file sono accettati da un input `type="file"`.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): Una stringa. Specifica il testo alternativo dell'immagine per un input `type="image"`.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): Una stringa. Specifica il media (microfono, video o fotocamera) catturato da un input `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): Una stringa. Specifica uno dei possibili [comportamenti di autocomplete.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Un booleano. Se `true`, React metterà a fuoco l'elemento al montaggio.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): Una stringa. Specifica il nome del campo del form per la direzionalità dell'elemento.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Un booleano. Se `true`, l'input non sarà interattivo e apparirà attenuato.
* `children`: `<input>` non accetta children.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): Una stringa. Specifica l'`id` del `<form>` a cui appartiene questo input. Se omesso, è il form padre più vicino.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Una stringa. Sostituisce l'`<form action>` padre per `type="submit"` e `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): Una stringa. Sostituisce l'`<form enctype>` padre per `type="submit"` e `type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): Una stringa. Sostituisce il `<form method>` padre per `type="submit"` e `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): Una stringa. Sostituisce il `<form noValidate>` padre per `type="submit"` e `type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): Una stringa. Sostituisce il `<form target>` padre per `type="submit"` e `type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): Una stringa. Specifica l'altezza dell'immagine per `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): Una stringa. Specifica l'`id` del `<datalist>` con le opzioni di autocomplete.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Un numero. Specifica il valore massimo degli input numerici e datetime.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Un numero. Specifica la lunghezza massima di testo e altri input.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Un numero. Specifica il valore minimo degli input numerici e datetime.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Un numero. Specifica la lunghezza minima di testo e altri input.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Un booleano. Specifica se sono consentiti valori multipli per `<type="file"` e `type="email"`.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Una stringa. Specifica il nome di questo input che viene [inviato con il form.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Obbligatorio per [input controllati.](#controlling-an-input-with-a-state-variable) Scatta immediatamente quando il valore dell'input viene modificato dall'utente (ad esempio, scatta a ogni battitura). Si comporta come l'[evento `input` del browser.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Una versione di `onChange` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Scatta immediatamente quando il valore viene modificato dall'utente. Per ragioni storiche, in React è idiomatico usare `onChange` al suo posto, che funziona in modo simile.
* `onInputCapture`: Una versione di `onInput` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Scatta se un input non supera la validazione all'invio del form. A differenza dell'evento `invalid` integrato, l'evento React `onInvalid` fa bubbling.
* `onInvalidCapture`: Una versione di `onInvalid` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Scatta dopo che la selezione all'interno dell'`<input>` cambia. React estende l'evento `onSelect` per scattare anche con selezione vuota e durante le modifiche (che possono influenzare la selezione).
* `onSelectCapture`: Una versione di `onSelect` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): Una stringa. Specifica il pattern che il `value` deve rispettare.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): Una stringa. Visualizzata con un colore attenuato quando il valore dell'input è vuoto.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Un booleano. Se `true`, l'input non è modificabile dall'utente.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Un booleano. Se `true`, il valore deve essere fornito affinché il form possa essere inviato.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Un numero. Simile all'impostazione della larghezza, ma l'unità dipende dal controllo.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): Una stringa. Specifica la sorgente dell'immagine per un input `type="image"`.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Un numero positivo o una stringa `'any'`. Specifica la distanza tra valori validi.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): Una stringa. Uno dei [tipi di input.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  Una stringa. Specifica la larghezza dell'immagine per un input `type="image"`.

#### Caveats {/*caveats*/}

- Le checkbox necessitano di `checked` (o `defaultChecked`), non di `value` (o `defaultValue`).
- Se un input di testo riceve una prop `value` di tipo stringa, verrà [trattato come controllato.](#controlling-an-input-with-a-state-variable)
- Se una checkbox o un radio button riceve una prop `checked` booleana, verrà [trattato come controllato.](#controlling-an-input-with-a-state-variable)
- Un input non può essere contemporaneamente controllato e non controllato.
- Un input non può passare da controllato a non controllato (o viceversa) nel corso della sua vita.
- Ogni input controllato necessita di un gestore di eventi `onChange` che aggiorni in modo sincrono il valore sottostante.

---

## Usage {/*usage*/}

### Visualizzare input di tipi diversi {/*displaying-inputs-of-different-types*/}

Per visualizzare un input, renderizza un componente `<input>`. Per impostazione predefinita, sarà un input di testo. Puoi passare `type="checkbox"` per una checkbox, `type="radio"` per un radio button, [o uno degli altri tipi di input.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Fornire un'etichetta per un input {/*providing-a-label-for-an-input*/}

Di solito, posizionerai ogni `<input>` all'interno di un tag [`<label>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/label). Questo indica al browser che questa etichetta è associata a quell'input. Quando l'utente clicca sull'etichetta, il browser metterà automaticamente a fuoco l'input. È anche essenziale per l'accessibilità: uno screen reader annuncerà la didascalia dell'etichetta quando l'utente mette a fuoco l'input associato.

Se non puoi annidare `<input>` in un `<label>`, associali passando lo stesso ID a `<input id>` e [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Per evitare conflitti tra più istanze dello stesso componente, genera un ID del genere con [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Fornire un valore iniziale per un input {/*providing-an-initial-value-for-an-input*/}

Puoi specificare facoltativamente il valore iniziale per qualsiasi input. Passalo come stringa `defaultValue` per gli input di testo. Checkbox e radio button dovrebbero specificare il valore iniziale con il booleano `defaultChecked`.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true}
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Leggere i valori degli input all'invio di un form {/*reading-the-input-values-when-submitting-a-form*/}

Aggiungi un [`<form>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/form) attorno ai tuoi input con un [`<button type="submit">`](https://developer.mozilla.org/it/docs/Web/HTML/Element/button) all'interno. Chiamerà il tuo gestore di eventi `<form onSubmit>`. Per impostazione predefinita, il browser invierà i dati del form all'URL corrente e aggiornerà la pagina. Puoi sovrascrivere questo comportamento chiamando `e.preventDefault()`. Leggi i dati del form con [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Impedisci al browser di ricaricare la pagina
    e.preventDefault();

    // Leggi i dati del form
    const form = e.target;
    const formData = new FormData(form);

    // Puoi passare formData direttamente come body di fetch:
    fetch('/some-api', { method: form.method, body: formData });

    // Oppure puoi lavorarci come oggetto semplice:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Assegna un `name` a ogni `<input>`, ad esempio `<input name="firstName" defaultValue="Taylor" />`. Il `name` che hai specificato verrà usato come chiave nei dati del form, ad esempio `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Per impostazione predefinita, un `<button>` all'interno di un `<form>` senza attributo `type` lo invierà. Può essere sorprendente! Se hai un tuo componente React `Button` personalizzato, considera l'uso di [`<button type="button">`](https://developer.mozilla.org/it/docs/Web/HTML/Element/button) invece di `<button>` (senza type). Poi, per essere esplicito, usa `<button type="submit">` per i pulsanti che *devono* inviare il form.

</Pitfall>

---

### Controllare un input con una variabile di state {/*controlling-an-input-with-a-state-variable*/}

Un input come `<input />` è *non controllato.* Anche se [passi un valore iniziale](#providing-an-initial-value-for-an-input) come `<input defaultValue="Initial text" />`, il tuo JSX specifica solo il valore iniziale. Non controlla quale dovrebbe essere il valore in questo momento.

**Per renderizzare un input _controllato_, passagli la prop `value` (o `checked` per checkbox e radio).** React forzerà l'input ad avere sempre il `value` che hai passato. Di solito, lo faresti dichiarando una [variabile di state:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Dichiara una variabile di state...
  // ...
  return (
    <input
      value={firstName} // ...forza il valore dell'input a corrispondere alla variabile di state...
      onChange={e => setFirstName(e.target.value)} // ... e aggiorna la variabile di state a ogni modifica!
    />
  );
}
```

Un input controllato ha senso se avevi già bisogno dello state — ad esempio, per ri-renderizzare la UI a ogni modifica:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

È utile anche se vuoi offrire più modi per regolare lo state dell'input (ad esempio, cliccando un pulsante):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

Il `value` che passi ai componenti controllati non deve essere `undefined` o `null`. Se hai bisogno che il valore iniziale sia vuoto (come nel campo `firstName` sotto), inizializza la variabile di state a una stringa vuota (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Se passi `value` senza `onChange`, sarà impossibile digitare nell'input.** Quando controlli un input passandogli un `value`, lo *forzi* ad avere sempre il valore che hai passato. Quindi se passi una variabile di state come `value` ma dimentichi di aggiornare quella variabile di state in modo sincrono durante il gestore di eventi `onChange`, React ripristinerà l'input dopo ogni battitura al `value` che hai specificato.

</Pitfall>

---

### Ottimizzare la ri-renderizzazione a ogni battitura {/*optimizing-re-rendering-on-every-keystroke*/}

Quando usi un input controllato, imposti lo state a ogni battitura. Se il componente che contiene il tuo state ri-renderizza un albero grande, questo può diventare lento. Ci sono alcuni modi per ottimizzare le prestazioni di ri-renderizzazione.

Ad esempio, supponiamo di iniziare con un form che ri-renderizza tutto il contenuto della pagina a ogni battitura:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Poiché `<PageContent />` non dipende dallo state dell'input, puoi spostare lo state dell'input nel suo componente:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Questo migliora significativamente le prestazioni perché ora solo `SignupForm` viene ri-renderizzato a ogni battitura.

Se non c'è modo di evitare la ri-renderizzazione (ad esempio, se `PageContent` dipende dal valore dell'input di ricerca), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) ti permette di mantenere l'input controllato reattivo anche nel mezzo di una ri-renderizzazione di grandi dimensioni.

---

## Troubleshooting {/*troubleshooting*/}

### Il mio input di testo non si aggiorna quando digito {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Se renderizzi un input con `value` ma senza `onChange`, vedrai un errore nella console:

```js
// 🔴 Bug: input di testo controllato senza gestore onChange
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Come suggerisce il messaggio di errore, se volevi solo [specificare il valore *iniziale*,](#providing-an-initial-value-for-an-input) passa `defaultValue`:

```js
// ✅ Buono: input non controllato con valore iniziale
<input defaultValue={something} />
```

Se vuoi [controllare questo input con una variabile di state,](#controlling-an-input-with-a-state-variable) specifica un gestore di eventi `onChange`:

```js
// ✅ Buono: input controllato con onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Se il valore è intenzionalmente in sola lettura, aggiungi una prop `readOnly` per sopprimere l'errore:

```js
// ✅ Buono: input controllato in sola lettura senza onChange
<input value={something} readOnly={true} />
```

---

### La mia checkbox non si aggiorna quando la clicco {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Se renderizzi una checkbox con `checked` ma senza `onChange`, vedrai un errore nella console:

```js
// 🔴 Bug: checkbox controllata senza gestore onChange
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Come suggerisce il messaggio di errore, se volevi solo [specificare il valore *iniziale*,](#providing-an-initial-value-for-an-input) passa `defaultChecked`:

```js
// ✅ Buono: checkbox non controllata con valore iniziale
<input type="checkbox" defaultChecked={something} />
```

Se vuoi [controllare questa checkbox con una variabile di state,](#controlling-an-input-with-a-state-variable) specifica un gestore di eventi `onChange`:

```js
// ✅ Buono: checkbox controllata con onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Devi leggere `e.target.checked` anziché `e.target.value` per le checkbox.

</Pitfall>

Se la checkbox è intenzionalmente in sola lettura, aggiungi una prop `readOnly` per sopprimere l'errore:

```js
// ✅ Buono: input controllato in sola lettura senza onChange
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Il caret dell'input salta all'inizio a ogni battitura {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Se [controlli un input,](#controlling-an-input-with-a-state-variable) devi aggiornare la sua variabile di state al valore dell'input dal DOM durante `onChange`.

Non puoi aggiornarla a qualcosa di diverso da `e.target.value` (o `e.target.checked` per le checkbox):

```js
function handleChange(e) {
  // 🔴 Bug: aggiornare un input a qualcosa di diverso da e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Non puoi aggiornarla in modo asincrono:

```js
function handleChange(e) {
  // 🔴 Bug: aggiornare un input in modo asincrono
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Per correggere il codice, aggiornalo in modo sincrono a `e.target.value`:

```js
function handleChange(e) {
  // ✅ Aggiornare un input controllato a e.target.value in modo sincrono
  setFirstName(e.target.value);
}
```

Se questo non risolve il problema, è possibile che l'input venga rimosso e ri-aggiunto al DOM a ogni battitura. Questo può accadere se stai accidentalmente [reimpostando lo state](/learn/preserving-and-resetting-state) a ogni ri-renderizzazione, ad esempio se l'input o uno dei suoi genitori riceve sempre un attributo `key` diverso, o se annidi definizioni di componenti (cosa non supportata e fa sì che il componente "interno" venga sempre considerato un albero diverso).

---

### Ricevo un errore: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Se fornisci un `value` al componente, deve rimanere una stringa per tutta la sua vita.

Non puoi passare prima `value={undefined}` e poi passare `value="some string"` perché React non saprà se vuoi che il componente sia non controllato o controllato. Un componente controllato dovrebbe sempre ricevere un `value` di tipo stringa, non `null` o `undefined`.

Se il tuo `value` proviene da un'API o da una variabile di state, potrebbe essere inizializzato a `null` o `undefined`. In quel caso, impostalo inizialmente a una stringa vuota (`''`), oppure passa `value={someValue ?? ''}` per assicurarti che `value` sia una stringa.

Allo stesso modo, se passi `checked` a una checkbox, assicurati che sia sempre un booleano.
