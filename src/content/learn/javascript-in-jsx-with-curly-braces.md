---
title: JavaScript in JSX con le parentesi graffe
---

<Intro>

JSX ti permette di scrivere codice HTML all'interno di un file JavaScript, mantenendo la logica di rendering e il contenuto nello stesso posto. A volte vorrai aggiungere un po' di logica JavaScript o fare riferimento a una proprietà dinamica all'interno di quel markup. In questa situazione, puoi usare le parentesi graffe nel tuo JSX per aprire una finestra su JavaScript.

</Intro>

<YouWillLearn>

* Come passare stringhe con virgolette
* Come riferirti a una variabile JavaScript all'interno di JSX con le parentesi graffe
* Come chiamare una funzione JavaScript all'interno di JSX con le parentesi graffe
* Come passare oggetti JavaScript all'interno di JSX con le parentesi graffe

</YouWillLearn>

## Passare stringhe con le virgolette {/*passing-strings-with-quotes*/}

Quando vuoi passare un attributo stringa a JSX, mettilo tra virgolette singole o doppie:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Qui, `"https://i.imgur.com/7vQD0fPs.jpg"` e `"Gregorio Y. Zara"` sono passati come stringhe.
E se vuoi specificare dinamicamente il `src` o il testo `alt`? Puoi **usare un valore da JavaScript sostituendo `"` e `"` con `{` e `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Nota la differenza tra `className="avatar"`, che specifica un nome di classe CSS `"avatar"` che rende l'immagine rotonda, e `src={avatar}` che legge il valore della variabile JavaScript chiamata `avatar`. Questo perché le parentesi graffe ti permettono di lavorare con JavaScript proprio lì nel tuo markup! 

## Usare le parentesi graffe: una finestra nel mondo JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX è un modo speciale di scrivere JavaScript. Ciò significa che è possibile utilizzare JavaScript al suo interno, con le parentesi graffe `{ }`. L'esempio seguente dichiara prima un nome per lo scienziato, `name`, quindi lo incorpora con le parentesi graffe all'interno di `<h1>`:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

Prova a cambiare il valore di `name` da `'Gregorio Y. Zara'` a `'Hedy Lamarr'`. Vedi come cambia il titolo della lista?

Qualsiasi espressione JavaScript funzionerà tra le parentesi graffe, inclusa la chiamata di funzioni come `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Dove utilizzare le parentesi graffe {/*where-to-use-curly-braces*/}

Puoi usare le parentesi graffe solo in due modi all'interno di JSX:

1. **Come testo** direttamente all'interno di un tag JSX: `<h1>{name}'s To Do List</h1>` funziona, ma `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` non funzionerà.
2. **Come attributi** immediatamente dopo il simbolo `=`: `src={avatar}` leggerà la variabile `avatar`, ma `src="{avatar}"` passerà la stringa `"{avatar}"`.

## Usare le "doppie graffe": CSS and altri oggetti in JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

In aggiunta alle stringhe, numeri e altre espressioni JavaScript, puoi anche passare oggetti in JSX. Gli oggetti sono anche indicati con le parentesi graffe, come `{ name: "Hedy Lamarr", inventions: 5 }`. Pertanto, per passare un oggetto JS in JSX, devi avvolgere l'oggetto in un'altra coppia di parentesi graffe: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Potresti notarlo quando usi gli stili CSS in linea in JSX. React non richiede di utilizzare gli stili in linea (le classi CSS funzionano alla grande per la maggior parte dei casi). Ma quando hai bisogno di uno stile in linea, passi un oggetto all'attributo `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Prova a cambiare i valori di `backgroundColor` e `color`.

Puoi vedere effettivamente l'oggetto JavaScript all'interno delle parentesi graffe quando lo scrivi in questo modo:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

La prossima volta che vedrai `{{` e `}}` in JSX, saprai che non è altro che un oggetto all'interno delle parentesi graffe JSX!

<Pitfall>

Inline `style` properties are written in camelCase. For example, HTML `<ul style="background-color: black">` would be written as `<ul style={{ backgroundColor: 'black' }}>`  in your component.

</Pitfall>

## Più divertimento con gli oggetti e le parentesi graffe {/*more-fun-with-javascript-objects-and-curly-braces*/}

Puoi spostare più espressioni in un unico oggetto e fare riferimento ad esse nel tuo JSX all'interno delle parentesi graffe:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

In questo esempio, l'oggetto JavaScript `person` contiene una stringa `name` e un oggetto `theme`:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Il componente può usare questi valori da `person` in questo modo:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX è molto minimalista come linguaggio di templating perché ti permette di organizzare dati e logica usando JavaScript.

<Recap>

Adesso che sai quasi tutto su JSX, ricapitoliamo:

* attributi JSX all'interno di virgolette vengono passati come stringhe.
* Le parentesi graffe ti permettono di portare la logica e le variabili JavaScript nel tuo markup.
* Esse funzionano all'intero del contenuto di un tag JSX o subito dopo `=` negli attributi.
* `{{` e `}}` non fanno parte di una sintassi speciale: è un oggetto JavaScript riposto all'interno delle parentesi graffe JSX.

</Recap>

<Challenges>

#### Correggi lo sbaglio {/*fix-the-mistake*/}

Questo codice crasha con un errore che dice `Objects are not valid as a React child`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Riesci a trovare il problema?

<Hint>Guarda cosa c'è all'interno delle parentesi graffe. Stiamo mettendo la cosa giusta?</Hint>

<Solution>

Questo accade perchè questo esempio renderizza *un oggetto stesso* nel markup invece di una stringa: `<h1>{person}'s Todos</h1>` sta cercando di renderizzare l'intero oggetto `person`! Includere oggetti grezzi come contenuto testuale genera un errore perchè React non sa come vuoi visualizzarli.

Per correggerlo, sostituisci `<h1>{person}'s Todos</h1>` con `<h1>{person.name}'s Todos</h1>`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Estrai le informazioni in un oggetto {/*extract-information-into-an-object*/}

Estrai l'URL dell'immagine nell'oggetto `person`.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Sposta l'URL dell'immagine in una proprietà chiamata `person.imageUrl` e leggila dal tag `<img>` usando le parentesi graffe:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Scrivi un'espressione all'interno delle parentesi graffe JSX {/*write-an-expression-inside-jsx-curly-braces*/}

Nell'oggetto sottosante, l'URL dell'immagine è diviso in quattro parti: base URL, `imageId`, `imageSize`, e l'estensione del file.

Vogliamo che l'URL dell'immagine combini questi attributi insieme: base URL (sempre `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), e l'estensione del file (sempre `'.jpg'`). Tuttavia, c'è qualcosa che non va con il modo in cui il tag `<img>` specifica il suo `src`.

Riesci a correggerlo?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Per controllare che la tua correzione funziona, prova a cambiare il valore di `imageSize` in `'b'`. L'immagine dovrebbe ridimensionarsi dopo la tua modifica.

<Solution>

Puoi scriverlo come `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` apre l' espressione JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` produce la stringa URL corretta
3. `}` chiude l'espressione JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Puoi anche spostare questa espressione in una funzione separata come `getImageUrl` qui sotto:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Variabili e funzioni possono aiutarti a mantenere il markup semplice!

</Solution>

</Challenges>
