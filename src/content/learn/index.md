---
title: Avvio Rapido
---

<Intro>

<<<<<<< HEAD
Benvenuto nella documentazione di React! Questa pagina ti darà un'introduzione all'80% dei concetti React che userai quotidianamente.
=======
Welcome to the React documentation! This page will give you an introduction to 80% of the React concepts that you will use on a daily basis.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

</Intro>

<YouWillLearn>

- Come creare e annidare componenti
- Come aggiungere markup e stili
- Come mostrare i dati
- Come renderizzare condizioni e liste
- Come rispondere a eventi e aggiornare lo schermo
- Come condividere dati tra componenti

</YouWillLearn>

## Creare e annidare componenti {/*components*/}

Le app React sono composte da *componenti*. Un componente è una parte di UI (interfaccia utente) che ha una propria logica e aspetto. Un componente può essere piccolo come un pulsante o grande come un'intera pagina.

I componenti React sono funzioni JavaScript che restituiscono markup:

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

Ora che hai dichiarato `MyButton`, puoi annidarlo in un altro componente:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Nota che `<MyButton />` inizia con una lettera maiuscola. È così che riconosci un componente React. I nomi dei componenti React devono sempre iniziare con una lettera maiuscola, mentre i tag HTML devono essere in minuscolo.

Dai un'occhiata al risultato:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

Le parole chiave `export default` specificano il componente principale nel file. Se non sei familiare con alcune parti della sintassi JavaScript, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) e [javascript.info](https://javascript.info/import-export) hanno ottimi riferimenti.

## Scrivere markup con JSX {/*writing-markup-with-jsx*/}

La sintassi del markup che hai visto sopra è chiamata *JSX*. È opzionale, ma la maggior parte dei progetti React utilizza JSX per comodità. Tutti gli [strumenti che consigliamo per lo sviluppo locale](/learn/installation) supportano JSX di default.

JSX è più rigoroso rispetto a HTML. Devi chiudere i tag come `<br />`. Inoltre, il tuo componente non può restituire più tag JSX. Devi racchiuderli in un genitore condiviso, come un `<div>...</div>` o un wrapper vuoto `<>...</>`:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

Se hai molto codice HTML da convertire in JSX, puoi usare un [convertitore online.](https://transform.tools/html-to-jsx)

## Aggiungere stili {/*adding-styles*/}

In React, specifichi una classe CSS con `className`. Funziona allo stesso modo dell'attributo HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class):

```js
<img className="avatar" />
```

Quindi, scrivi le regole CSS per esso in un file CSS separato:

```css
/* Nel tuo CSS */
.avatar {
  border-radius: 50%;
}
```

React non stabilisce come aggiungi i file CSS. Nel caso più semplice, aggiungerai un tag [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) al tuo HTML. Se utilizzi uno strumento di compilazione o un framework, consulta la relativa documentazione per imparare come aggiungere un file CSS al tuo progetto.

## Mostrare dati {/*displaying-data*/}

JSX ti permette di inserire markup in JavaScript. Le parentesi graffe ti permettono di "tornare" a JavaScript, in modo da poter incorporare qualche variabile dal tuo codice e mostrarla all'utente. Ad esempio, questo mostrerà `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Puoi anche "tornare a JavaScript" dagli attributi JSX, ma devi usare le parentesi graffe *invece* delle virgolette. Ad esempio, `className="avatar"` passa la stringa `"avatar"` come classe CSS, ma `src={user.imageUrl}` legge il valore della variabile JavaScript `user.imageUrl` e poi passa questo come attributo `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Puoi anche inserire espressioni più complesse all'interno delle parentesi graffe JSX, come ad esempio la [concatenazione di stringhe](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

Nell'esempio precedente, `style={{}}` non è una sintassi speciale, ma un normale oggetto `{}` all'interno delle parentesi graffe JSX `style={ }`. Puoi usare l'attributo `style` quando i tuoi stili dipendono da variabili JavaScript.

## Rendering condizionale {/*conditional-rendering*/}

In React, non esiste una sintassi speciale per scrivere condizioni. Invece, utilizzerai le stesse tecniche che usi quando scrivi normale codice JavaScript. Ad esempio, puoi usare un'istruzione [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) per includere JSX in modo condizionale.

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Se preferisci un codice più compatto, puoi usare l'[operatore condizionale `?`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) A differenza di `if`, esso funziona all'interno di JSX.

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Quando non hai bisogno del ramo `else`, puoi anche usare una [sintassi logica `&&`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation) più breve:

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Tutti questi approcci funzionano anche per specificare in modo condizionale gli attributi. Se non hai familiarità con alcune di queste sintassi JavaScript, puoi iniziare ad usare sempre `if...else`.

## Renderizzare liste {/*rendering-lists*/}

Farai affidamento su funzionalità JavaScript come i [cicli `for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) e la [funzione array `map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) per renderizzare liste di componenti.

Ad esempio, supponiamo che tu abbia un array di prodotti:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

All'interno del tuo componente, usa la funzione `map()` per trasformare un array di prodotti in un array di elementi `<li>`:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Nota come `<li>` ha un attributo `key`. Per ogni elemento nella lista, dovresti passare una stringa o un numero che identifichi univocamente quell'oggetto tra i suoi "fratelli". Di solito, una chiave dovrebbe provenire dai tuoi dati, come un ID del database. React utilizza le tue chiavi per sapere cosa è successo se successivamente inserisci, elimini o riordini gli elementi.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Rispondere agli eventi {/*responding-to-events*/}

Puoi rispondere agli eventi dichiarando funzioni **event handler** all'interno dei tuoi componenti:

```js {2-4,7}
function MyButton() {
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

Nota come `onClick={handleClick}` non ha parentesi alla fine! Non _chiamare_ la funzione event handler: hai solo bisogno di *passarla*. React chiamerà il tuo event handler quando l'utente cliccherà sul pulsante.

## Aggiornare lo schermo {/*updating-the-screen*/}

Spesso vorrai che il tuo componente "ricordi" alcune informazioni e le mostri. Ad esempio, potresti voler contare il numero di volte in cui viene fatto clic su un pulsante. Per fare ciò, aggiungi **state** al tuo componente.

Per prima cosa, importa [`useState`](/reference/react/useState) da React:

```js
import { useState } from 'react';
```

Ora puoi dichiarare una *variabile state* all'interno del tuo componente:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

Otterrai due cose da `useState`: lo state attuale (`count`) e la funzione che ti consente di aggiornarlo (`setCount`). Puoi dare loro qualsiasi nome, ma la convenzione è scrivere `[something, setSomething]`.

La prima volta che il pulsante verrà mostrato, `count` sarà `0` perché hai passato `0` a `useState()`. Quando vuoi cambiare lo state, chiama `setCount()` e passagli il nuovo valore. Cliccando su questo pulsante, il contatore incrementerà:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React chiamerà di nuovo la tua funzione componente. Questa volta, `count` sarà `1`. Poi sarà `2`. E così via.

Se esegui il rendering dello stesso componente più volte, ognuno avrà il proprio state. Fai clic su ogni pulsante separatamente:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Nota come ogni pulsante "ricorda" il proprio state `count` e non influisce sugli altri pulsanti.

## Usare gli Hooks {/*using-hooks*/}

Le funzioni che iniziano con `use` sono chiamate *Hook*. `useState` è un Hook incorporato fornito da React. Puoi trovare altri Hook incorporati nel [riferimento API.](/reference/react) Puoi anche scrivere i tuoi Hook combinando quelli esistenti.

Gli Hook sono più restrittivi rispetto ad altre funzioni. Puoi chiamare gli Hook solo *in cima* ai tuoi componenti (o altri Hook). Se vuoi utilizzare `useState` in una condizione o un ciclo, estrai un nuovo componente e inseriscilo lì.

## Condividere dati tra componenti {/*sharing-data-between-components*/}

Nell'esempio precedente, ogni `MyButton` aveva il proprio e indipendente `count`, e quando si faceva clic su ciascun pulsante, cambiava solo il `count` relativo al pulsante cliccato:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

Inizialmente, lo state `count` di ogni `MyButton` è `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

Il primo `MyButton` aggiorna il suo `count` a `1`

</Diagram>

</DiagramGroup>

Tuttavia, spesso avrai bisogno di componenti per *condividere dati e aggiornarli sempre insieme*.

Per fare in modo che entrambi i componenti `MyButton` mostrino lo stesso `count` e si aggiornino insieme, è necessario spostare lo state dai singoli pulsanti "verso l'alto" al componente più vicino che li contiene tutti.

In questo esempio, è `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

Inizialmente, lo state `count` di `MyApp` è `0` e viene trasmesso ad entrambi i figli.

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

Al click, `MyApp` aggiorna il suo state `count` a `1` e lo trasmette ad entrambi i figli.

</Diagram>

</DiagramGroup>

Ora quando fai click su uno dei due pulsanti, il `count` in `MyApp` cambierà, il quale cambierà entrambi i contatori in `MyButton`. Ecco come puoi esprimerlo nel codice.

Per prima cosa, *sposta lo state in alto* da `MyButton` a `MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... stiamo spostando il codice da qui ...
}

```

Quindi, *passa lo state* da `MyApp` a ciascun `MyButton`, insieme al click handler condiviso. Puoi passare informazioni a `MyButton` usando le parentesi graffe JSX, proprio come hai fatto in precedenza con tag incorporati come `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Le informazioni che trasmetti in questo modo si chiamano _props_. Ora il componente `MyApp` contiene lo state `count` e l'event handler `handleClick`, e *passa entrambi come props* a ciascun pulsante.

Infine, modifica `MyButton` per *leggere* le props che hai passato dal suo componente genitore:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

Quando fai click sul pulsante, viene attivato l'handler `onClick`. La prop `onClick` di ciascun pulsante è stata impostata sulla funzione `handleClick` all'interno di `MyApp`, quindi il codice al suo interno viene eseguito. Quel codice chiama `setCount(count + 1)`, incrementando la variabile state `count`. Il nuovo valore di `count` viene passato come prop a ciascun pulsante, quindi tutti mostrano il nuovo valore. Questo viene chiamato "sollevamento dello state". Sollevando lo state, lo hai condiviso tra i componenti.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Prossimi Passi {/*next-steps*/}

Ormai conosci le basi su come scrivere codice React!

Dai un'occhiata al [Tutorial](/learn/tutorial-tic-tac-toe) per metterle in pratica e creare la tua prima mini-app con React.
