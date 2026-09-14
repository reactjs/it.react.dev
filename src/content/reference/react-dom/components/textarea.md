---
title: "<textarea>"
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/components/textarea.md).

</Note>

<Intro>

Il [componente browser integrato `<textarea>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea) ti permette di renderizzare un input di testo multilinea.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<textarea>` {/*textarea*/}

Per visualizzare un'area di testo, renderizza il [componente browser integrato `<textarea>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[Vedi altri esempi sotto.](#usage)

#### Props {/*props*/}

`<textarea>` supporta tutte le [props comuni degli elementi.](/reference/react-dom/components/common#common-props)

Puoi [controllare un'area di testo](#controlling-a-text-area-with-a-state-variable) passando una prop `value`:

* `value`: Una stringa. Controlla il testo all'interno dell'area di testo.

Quando passi `value`, devi anche passare un gestore di eventi `onChange` che aggiorni il valore passato.

Se il tuo `<textarea>` è non controllato, puoi passare invece la prop `defaultValue`:

* `defaultValue`: Una stringa. Specifica [il valore iniziale](#providing-an-initial-value-for-a-text-area) per un'area di testo.

Queste props di `<textarea>` sono rilevanti sia per aree di testo non controllate che controllate:

* [`autoComplete`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#autocomplete): `'on'` o `'off'`. Specifica il comportamento di autocomplete.
* [`autoFocus`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#autofocus): Un booleano. Se `true`, React metterà a fuoco l'elemento al montaggio.
* `children`: `<textarea>` non accetta children. Per impostare il valore iniziale, usa `defaultValue`.
* [`cols`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#cols): Un numero. Specifica la larghezza predefinita in larghezze di carattere medie. Il valore predefinito è `20`.
* [`disabled`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#disabled): Un booleano. Se `true`, l'input non sarà interattivo e apparirà attenuato.
* [`form`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#form): Una stringa. Specifica l'`id` del `<form>` a cui appartiene questo input. Se omesso, è il form padre più vicino.
* [`maxLength`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#maxlength): Un numero. Specifica la lunghezza massima del testo.
* [`minLength`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#minlength): Un numero. Specifica la lunghezza minima del testo.
* [`name`](https://developer.mozilla.org/it/docs/Web/HTML/Element/input#name): Una stringa. Specifica il nome di questo input che viene [inviato con il form.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Obbligatorio per [aree di testo controllate.](#controlling-a-text-area-with-a-state-variable) Scatta immediatamente quando il valore dell'input viene modificato dall'utente (ad esempio, scatta a ogni battitura). Si comporta come l'[evento `input` del browser.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Una versione di `onChange` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Scatta immediatamente quando il valore viene modificato dall'utente. Per ragioni storiche, in React è idiomatico usare `onChange` al suo posto, che funziona in modo simile.
* `onInputCapture`: Una versione di `onInput` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Scatta se un input non supera la validazione all'invio del form. A differenza dell'evento `invalid` integrato, l'evento React `onInvalid` fa bubbling.
* `onInvalidCapture`: Una versione di `onInvalid` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): Una funzione [gestore di `Event`](/reference/react-dom/components/common#event-handler). Scatta dopo che la selezione all'interno del `<textarea>` cambia. React estende l'evento `onSelect` per scattare anche con selezione vuota e durante le modifiche (che possono influenzare la selezione).
* `onSelectCapture`: Una versione di `onSelect` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#placeholder): Una stringa. Visualizzata con un colore attenuato quando il valore dell'area di testo è vuoto.
* [`readOnly`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#readonly): Un booleano. Se `true`, l'area di testo non è modificabile dall'utente.
* [`required`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#required): Un booleano. Se `true`, il valore deve essere fornito affinché il form possa essere inviato.
* [`rows`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#rows): Un numero. Specifica l'altezza predefinita in altezze di carattere medie. Il valore predefinito è `2`.
* [`wrap`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#wrap): `'hard'`, `'soft'` o `'off'`. Specifica come il testo deve essere mandato a capo all'invio del form.

#### Caveats {/*caveats*/}

- Passare children come `<textarea>qualcosa</textarea>` non è consentito. [Usa `defaultValue` per il contenuto iniziale.](#providing-an-initial-value-for-a-text-area)
- Se un'area di testo riceve una prop `value` di tipo stringa, verrà [trattata come controllata.](#controlling-a-text-area-with-a-state-variable)
- Un'area di testo non può essere contemporaneamente controllata e non controllata.
- Un'area di testo non può passare da controllata a non controllata (o viceversa) nel corso della sua vita.
- Ogni area di testo controllata necessita di un gestore di eventi `onChange` che aggiorni in modo sincrono il valore sottostante.

---

## Usage {/*usage*/}

### Visualizzare un'area di testo {/*displaying-a-text-area*/}

Renderizza `<textarea>` per visualizzare un'area di testo. Puoi specificare la dimensione predefinita con gli attributi [`rows`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#rows) e [`cols`](https://developer.mozilla.org/it/docs/Web/HTML/Element/textarea#cols), ma per impostazione predefinita l'utente potrà ridimensionarla. Per disabilitare il ridimensionamento, puoi specificare `resize: none` nel CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Fornire un'etichetta per un'area di testo {/*providing-a-label-for-a-text-area*/}

Di solito, posizionerai ogni `<textarea>` dentro un tag [`<label>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/label). Questo indica al browser che questa etichetta è associata a quell'area di testo. Quando l'utente clicca sull'etichetta, il browser metterà a fuoco l'area di testo. È anche essenziale per l'accessibilità: uno screen reader annuncerà la didascalia dell'etichetta quando l'utente mette a fuoco l'area di testo.

Se non puoi annidare `<textarea>` dentro un `<label>`, associali passando lo stesso ID a `<textarea id>` e [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Per evitare conflitti tra più istanze dello stesso componente, genera un ID del genere con [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Fornire un valore iniziale per un'area di testo {/*providing-an-initial-value-for-a-text-area*/}

Puoi specificare facoltativamente il valore iniziale per l'area di testo. Passalo come stringa `defaultValue`.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

A differenza dell'HTML, passare testo iniziale come `<textarea>Some content</textarea>` non è supportato.

</Pitfall>

---

### Leggere il valore dell'area di testo all'invio di un form {/*reading-the-textarea-value-when-submitting-a-form*/}

Aggiungi un [`<form>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/form) intorno al tuo textarea con un [`<button type="submit">`](https://developer.mozilla.org/it/docs/Web/HTML/Element/button) al suo interno. Invocherà il tuo gestore di eventi `<form onSubmit>`. Per impostazione predefinita, il browser invierà i dati del form all'URL corrente e ricaricherà la pagina. Puoi sovrascrivere questo comportamento chiamando `e.preventDefault()`. Leggi i dati del form con [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
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

    // Oppure puoi lavorarci come con un oggetto semplice:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
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

Assegna un `name` al tuo `<textarea>`, ad esempio `<textarea name="postContent" />`. Il `name` che hai specificato verrà usato come chiave nei dati del form, ad esempio `{ postContent: "Your post" }`.

</Note>

<Pitfall>

Per impostazione predefinita, *qualsiasi* `<button>` dentro un `<form>` lo invierà. Questo può sorprendere! Se hai un tuo componente React `Button` personalizzato, considera di restituire [`<button type="button">`](https://developer.mozilla.org/it/docs/Web/HTML/Element/input/button) invece di `<button>`. Poi, per essere esplicito, usa `<button type="submit">` per i pulsanti che *devono* inviare il form.

</Pitfall>

---

### Controllare un'area di testo con una variabile di state {/*controlling-a-text-area-with-a-state-variable*/}

Un'area di testo come `<textarea />` è *non controllata.* Anche se [passi un valore iniziale](#providing-an-initial-value-for-a-text-area) come `<textarea defaultValue="Initial text" />`, il tuo JSX specifica solo il valore iniziale, non il valore attuale.

**Per renderizzare un'area di testo _controllata_, passa la prop `value`.** React forzerà l'area di testo ad avere sempre il `value` che hai passato. Di solito, controllerai un'area di testo dichiarando una [variabile di state:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Dichiara una variabile di state...
  // ...
  return (
    <textarea
      value={postContent} // ...forza il valore dell'input a corrispondere alla variabile di state...
      onChange={e => setPostContent(e.target.value)} // ... e aggiorna la variabile di state a ogni modifica!
    />
  );
}
```

Questo è utile se vuoi ri-renderizzare una parte dell'UI in risposta a ogni battitura.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**Se passi `value` senza `onChange`, sarà impossibile digitare nell'area di testo.** Quando controlli un'area di testo passandogli un `value`, la *forzi* ad avere sempre il valore che hai passato. Quindi se passi una variabile di state come `value` ma dimentichi di aggiornare quella variabile di state in modo sincrono durante il gestore di eventi `onChange`, React ripristinerà l'area di testo dopo ogni battitura al `value` che hai specificato.

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### La mia area di testo non si aggiorna quando digito {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Se renderizzi un'area di testo con `value` ma senza `onChange`, vedrai un errore nella console:

```js
// 🔴 Bug: area di testo controllata senza gestore onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Come suggerisce il messaggio di errore, se volevi solo [specificare il valore *iniziale*,](#providing-an-initial-value-for-a-text-area) passa `defaultValue`:

```js
// ✅ Buono: area di testo non controllata con valore iniziale
<textarea defaultValue={something} />
```

Se vuoi [controllare quest'area di testo con una variabile di state,](#controlling-a-text-area-with-a-state-variable) specifica un gestore di eventi `onChange`:

```js
// ✅ Buono: area di testo controllata con onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Se il valore è intenzionalmente in sola lettura, aggiungi una prop `readOnly` per sopprimere l'errore:

```js
// ✅ Buono: area di testo controllata in sola lettura senza onChange
<textarea value={something} readOnly={true} />
```

---

### Il caret dell'area di testo salta all'inizio a ogni battitura {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

Se [controlli un'area di testo,](#controlling-a-text-area-with-a-state-variable) devi aggiornare la sua variabile di state al valore dell'area di testo dal DOM durante `onChange`.

Non puoi aggiornarla a qualcosa di diverso da `e.target.value`:

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

Se questo non risolve il problema, è possibile che l'area di testo venga rimossa e ri-aggiunta al DOM a ogni battitura. Questo può accadere se stai accidentalmente [reimpostando lo state](/learn/preserving-and-resetting-state) a ogni ri-renderizzazione. Ad esempio, può accadere se l'area di testo o uno dei suoi genitori riceve sempre un attributo `key` diverso, o se annidi definizioni di componenti (cosa non consentita in React e fa sì che il componente "interno" venga rimontato a ogni renderizzazione).

---

### Ricevo un errore: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Se fornisci un `value` al componente, deve rimanere una stringa per tutta la sua vita.

Non puoi passare prima `value={undefined}` e poi passare `value="some string"` perché React non saprà se vuoi che il componente sia non controllato o controllato. Un componente controllato dovrebbe sempre ricevere un `value` di tipo stringa, non `null` o `undefined`.

Se il tuo `value` proviene da un'API o da una variabile di state, potrebbe essere inizializzato a `null` o `undefined`. In quel caso, impostalo inizialmente a una stringa vuota (`''`), oppure passa `value={someValue ?? ''}` per assicurarti che `value` sia una stringa.
