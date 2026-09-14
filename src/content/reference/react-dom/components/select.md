---
title: "<select>"
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/components/select.md).

</Note>

<Intro>

Il [componente browser integrato `<select>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select) ti permette di renderizzare una casella select con opzioni.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<select>` {/*select*/}

Per visualizzare una casella select, renderizza il [componente browser integrato `<select>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[Vedi altri esempi sotto.](#usage)

#### Props {/*props*/}

`<select>` supporta tutte le [props comuni degli elementi.](/reference/react-dom/components/common#common-props)

Puoi [controllare una casella select](#controlling-a-select-box-with-a-state-variable) passando una prop `value`:

* `value`: Una stringa (o un array di stringhe per [`multiple={true}`](#enabling-multiple-selection)). Controlla quale opzione è selezionata. Ogni stringa del valore deve corrispondere al `value` di un `<option>` annidato dentro il `<select>`.

Quando passi `value`, devi anche passare un gestore di eventi `onChange` che aggiorni il valore passato.

Se il tuo `<select>` è non controllato, puoi passare invece la prop `defaultValue`:

* `defaultValue`: Una stringa (o un array di stringhe per [`multiple={true}`](#enabling-multiple-selection)). Specifica [l'opzione inizialmente selezionata.](#providing-an-initially-selected-option)

Queste props di `<select>` sono rilevanti sia per caselle select non controllate che controllate:

* [`autoComplete`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select#autocomplete): Una stringa. Specifica uno dei possibili [comportamenti di autocomplete.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select#autofocus): Un booleano. Se `true`, React metterà a fuoco l'elemento al montaggio.
* `children`: `<select>` accetta come children i componenti [`<option>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/optgroup) e [`<datalist>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/datalist). Puoi anche passare i tuoi componenti, purché alla fine renderizzino uno dei componenti consentiti. Se passi i tuoi componenti che alla fine renderizzano tag `<option>`, ogni `<option>` che renderizzi deve avere un `value`.
* [`disabled`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select#disabled): Un booleano. Se `true`, la casella select non sarà interattiva e apparirà attenuata.
* [`form`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select#form): Una stringa. Specifica l'`id` del `<form>` a cui appartiene questa casella select. Se omesso, è il form padre più vicino.
* [`multiple`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select#multiple): Un booleano. Se `true`, il browser consente la [selezione multipla.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select#name): Una stringa. Specifica il nome di questa casella select che viene [inviato con il form.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Obbligatorio per [caselle select controllate.](#controlling-a-select-box-with-a-state-variable) Scatta immediatamente quando l'utente sceglie un'opzione diversa. Si comporta come l'[evento `input` del browser.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Una versione di `onChange` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Scatta immediatamente quando il valore viene modificato dall'utente. Per ragioni storiche, in React è idiomatico usare `onChange` al suo posto, che funziona in modo simile.
* `onInputCapture`: Una versione di `onInput` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Scatta se un input non supera la validazione all'invio del form. A differenza dell'evento `invalid` integrato, l'evento React `onInvalid` fa bubbling.
* `onInvalidCapture`: Una versione di `onInvalid` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select#required): Un booleano. Se `true`, il valore deve essere fornito affinché il form possa essere inviato.
* [`size`](https://developer.mozilla.org/it/docs/Web/HTML/Element/select#size): Un numero. Per select con `multiple={true}`, specifica il numero preferito di elementi inizialmente visibili.

#### Caveats {/*caveats*/}

- A differenza dell'HTML, passare un attributo `selected` a `<option>` non è supportato. Usa invece [`<select defaultValue>`](#providing-an-initially-selected-option) per caselle select non controllate e [`<select value>`](#controlling-a-select-box-with-a-state-variable) per caselle select controllate.
- Se una casella select riceve una prop `value`, verrà [trattata come controllata.](#controlling-a-select-box-with-a-state-variable)
- Una casella select non può essere contemporaneamente controllata e non controllata.
- Una casella select non può passare da controllata a non controllata (o viceversa) nel corso della sua vita.
- Ogni casella select controllata necessita di un gestore di eventi `onChange` che aggiorni in modo sincrono il valore sottostante.

---

## Usage {/*usage*/}

### Visualizzare una casella di selezione con opzioni {/*displaying-a-select-box-with-options*/}

Renderizza un `<select>` con un elenco di componenti `<option>` al suo interno per visualizzare una casella select. Assegna a ogni `<option>` un `value` che rappresenta i dati da inviare con il form.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

---

### Fornire un'etichetta per una casella di selezione {/*providing-a-label-for-a-select-box*/}

Di solito, posizionerai ogni `<select>` dentro un tag [`<label>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/label). Questo indica al browser che questa etichetta è associata a quella casella select. Quando l'utente clicca sull'etichetta, il browser metterà automaticamente a fuoco la casella select. È anche essenziale per l'accessibilità: uno screen reader annuncerà la didascalia dell'etichetta quando l'utente mette a fuoco la casella select.

Se non puoi annidare `<select>` dentro un `<label>`, associali passando lo stesso ID a `<select id>` e [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Per evitare conflitti tra più istanze dello stesso componente, genera un ID del genere con [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Fornire un'opzione inizialmente selezionata {/*providing-an-initially-selected-option*/}

Per impostazione predefinita, il browser selezionerà il primo `<option>` nell'elenco. Per selezionare un'opzione diversa di default, passa il `value` di quell'`<option>` come `defaultValue` all'elemento `<select>`.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

<Pitfall>

A differenza dell'HTML, passare un attributo `selected` a un singolo `<option>` non è supportato.

</Pitfall>

---

### Abilitare la selezione multipla {/*enabling-multiple-selection*/}

Passa `multiple={true}` al `<select>` per consentire all'utente di selezionare più opzioni. In quel caso, se specifichi anche `defaultValue` per scegliere le opzioni inizialmente selezionate, deve essere un array.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Leggere il valore della casella di selezione all'invio di un form {/*reading-the-select-box-value-when-submitting-a-form*/}

Aggiungi un [`<form>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/form) intorno alla tua casella select con un [`<button type="submit">`](https://developer.mozilla.org/it/docs/Web/HTML/Element/button) al suo interno. Invocherà il tuo gestore di eventi `<form onSubmit>`. Per impostazione predefinita, il browser invierà i dati del form all'URL corrente e ricaricherà la pagina. Puoi sovrascrivere questo comportamento chiamando `e.preventDefault()`. Leggi i dati del form con [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Impedisci al browser di ricaricare la pagina
    e.preventDefault();
    // Leggi i dati del form
    const form = e.target;
    const formData = new FormData(form);
    // Puoi passare formData come body di fetch direttamente:
    fetch('/some-api', { method: form.method, body: formData });
    // Puoi generare un URL da esso, come fa il browser di default:
    console.log(new URLSearchParams(formData).toString());
    // Puoi lavorarci come con un oggetto semplice.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Questo non include i valori di select multipli
    // Oppure puoi ottenere un array di coppie nome-valore.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

Assegna un `name` al tuo `<select>`, ad esempio `<select name="selectedFruit" />`. Il `name` che hai specificato verrà usato come chiave nei dati del form, ad esempio `{ selectedFruit: "orange" }`.

Se usi `<select multiple={true}>`, il [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) che leggerai dal form includerà ogni valore selezionato come coppia nome-valore separata. Osserva attentamente i log della console nell'esempio sopra.

</Note>

<Pitfall>

Per impostazione predefinita, *qualsiasi* `<button>` dentro un `<form>` lo invierà. Questo può sorprendere! Se hai un tuo componente React `Button` personalizzato, considera di restituire [`<button type="button">`](https://developer.mozilla.org/it/docs/Web/HTML/Element/input/button) invece di `<button>`. Poi, per essere esplicito, usa `<button type="submit">` per i pulsanti che *devono* inviare il form.

</Pitfall>

---

### Controllare una casella di selezione con una variabile di state {/*controlling-a-select-box-with-a-state-variable*/}

Una casella select come `<select />` è *non controllata.* Anche se [passi un valore inizialmente selezionato](#providing-an-initially-selected-option) come `<select defaultValue="orange" />`, il tuo JSX specifica solo il valore iniziale, non il valore attuale.

**Per renderizzare una casella select _controllata_, passa la prop `value`.** React forzerà la casella select ad avere sempre il `value` che hai passato. Di solito, controllerai una casella select dichiarando una [variabile di state:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Dichiara una variabile di state...
  // ...
  return (
    <select
      value={selectedFruit} // ...forza il valore del select a corrispondere alla variabile di state...
      onChange={e => setSelectedFruit(e.target.value)} // ... e aggiorna la variabile di state a ogni modifica!
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

Questo è utile se vuoi ri-renderizzare una parte dell'UI in risposta a ogni selezione.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Se passi `value` senza `onChange`, sarà impossibile selezionare un'opzione.** Quando controlli una casella select passandogli un `value`, la *forzi* ad avere sempre il valore che hai passato. Quindi se passi una variabile di state come `value` ma dimentichi di aggiornare quella variabile di state in modo sincrono durante il gestore di eventi `onChange`, React ripristinerà la casella select dopo ogni battitura al `value` che hai specificato.

A differenza dell'HTML, passare un attributo `selected` a un singolo `<option>` non è supportato.

</Pitfall>
