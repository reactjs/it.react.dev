---
id: jsx-in-depth
title: JSX In Dettaglio
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

Fondamentalmente JSX fornisce zucchero sintattico per la scrittura di funzioni della forma `React.createElement(component, props, ...children)`.
Il codice seguente

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

una volta compilato viene tradotto in:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

É anche possibile utilizzare la versione self-closing del tag se, e solo se, non ci sono elementi figli. Quindi

```js
<div className="sidebar" />
```

una volta compilato viene tradotto in:

```js
React.createElement(
  'div',
  {className: 'sidebar'}
)
```

Per vedere come il codice JSX viene convertito in JavaScript puoi provare il [compilatore babel online](babel://jsx-simple-example).

## Specificare il tipo di elemento React {#specifying-the-react-element-type}

La prima parte di un tag JSX indica il tipo di elemento React.

I tipi con la prima lettera maiuscola indicano che il tag JSX si riferisce ad un componente React. Una volta eseguita la compilazione questi tag avranno un riferimento diretto con la variabile, il che significa che per usare il tag `<Foo />` la rispettiva variabile `Foo` deve essere nello stesso scope.

### React deve essere in scope {#react-must-be-in-scope}

Dal momento che JSX compila in chiamate del tipo `React.createElement`, la libreria `React` deve essere sempre nello stesso scope del codice JSX.

Ad esempio in questo pezzo di codice entrambi gli imports sono necessari anche se `React` e `CustomButton` non sono direttamente referenziati all'interno di JavaScript:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Se React fosse importato tramite il tag `<script>`, allora sarebbe già nello scope globale dell'applicazione.

### Usare la notazione puntata per i tipi JSX {#using-dot-notation-for-jsx-type}

É possibile fare riferimento ad un componente React usando la notazione puntata direttamente da JSX. Questo è molto conveniente se avessimo un singolo modulo che esporta diversi componenti React. Ad esempio se `MyComponents.DatePicker` è un componente, allora è possibile utilizzarlo in JSX semplicemente scrivendo: 

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### I componenti definiti dall'utente devono avere la prima lettera maiuscola {#user-defined-components-must-be-capitalized}

Quando un elemento inizia con una lettera minuscola, allora si riferisce a componenti nativi come ad esempio `<div>` o `<span>` ed essi risultano come se fossero una stringa, `'div'` o `'span'`, passata a `React.createElement`. I tipi che iniziano con una lettera maiuscola, come `<Foo />` compilano in `React.createElement(Foo)` e corrispondono a componenti definiti o importati all'interno del file JavaScript.

É raccomandabile chiamare i componenti con una lettera maiuscola. Se avessimo un componente che inizia con una lettera minuscola, allora quello che possiamo fare è un'assegnazione ad una variabile, con la prima lettera maiuscola, prima di poterlo utilizzare all'interno di JSX.

Ad esempio questo codice non verrà eseguito come ci si aspetta:

```js{3,4,10,11}
import React from 'react';

// Wrong! This is a component and should have been capitalized:
function hello(props) {
  // Correct! This use of <div> is legitimate because div is a valid HTML tag:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Wrong! React thinks <hello /> is an HTML tag because it's not capitalized:
  return <hello toWhat="World" />;
}
```

Per correggere, basta rinominare `hello` in `Hello` e usare `<Hello />` quando ci riferiamo ad esso:

```js{3,4,10,11}
import React from 'react';

// Correct! This is a component and should be capitalized:
function Hello(props) {
  // Correct! This use of <div> is legitimate because div is a valid HTML tag:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Correct! React knows <Hello /> is a component because it's capitalized.
  return <Hello toWhat="World" />;
}
```

### Scelta del tipo di componente in fase di esecuzione {#choosing-the-type-at-runtime}

Non è possibile usare un'espressione come tipo di elemento React. Se si vuole utilizzare un'espressione per indicare un tipo di elemento, effettuate semplicemente un'assegnazione ad una variabile con la prima lettera maiuscola. Questo è particolarmente utile quando si vuole renderizzare un componente piuttosto che un altro in base ad una prop:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Wrong! JSX type can't be an expression.
  return <components[props.storyType] story={props.story} />;
}
```

Per correggere, dichiariamo una variabile con la prima lettera maiuscola e gli assegnamo il tipo:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Correct! JSX type can be a capitalized variable.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## Props in JSX {#props-in-jsx}

Ci sono diversi modi per dichiarare le props in JSX.

### Espressioni JavaScript come Props {#javascript-expressions-as-props}

É possibile passare una qualsiasi espressione JavaScript come prop semplicemente circondandola da `{}`. Ad esempio, in questo pezzo di codice JSX

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

nel componente `MyComponent`, il valore di `props.foo` sarà `10` che è esattamente il valore restituito dall'espressione `1 + 2 + 3 + 4`.

Le espressioni `if` e `for` non sono considerate espressioni in JavaScript, quindi non possono essere usate direttamente in JSX, ma è possibile utilizzarle nel codice. Ad esempio:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

Puoi approfondire la [renderizzazione condizionale](/docs/conditional-rendering.html) e i [cicli](/docs/lists-and-keys.html) nelle relative sezioni.

### String Literals {#string-literals}

É anche possibile passare stringhe come props. Queste due espressioni JSX sono equivalenti:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

Quando si passano stringhe, HTML non effettua l'escape del loro valore, quindi anche queste due espressioni JSX sono equivalenti:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

Solitamente questo comportamento non ha una grossa rilevanza, è stato menzionato solo per completezza d'informazione.

### Il valore di default di una Props è "True" {#props-default-to-true}

Se non passiamo nessun valore per una prop, questa verrà valutata a `true` di default. Queste due espressioni JSX sono equivalenti:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

In linea generale non è raccomandabile non passare alcun valore ad una prop in quanto può essere confusa con il [metodo per dichiarare oggetti in ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` che sarebbe la scrittura breve di `{foo: foo}` piuttosto che `{foo: true}`. Questo comportamento è presente solo per corrispondere al comportamente di HTML.

### Operatore Spread come attributo {#spread-attributes}

<<<<<<< HEAD
Se abbiamo già una `props` come oggetto e la si vuole passare in JSX, è possibile utilizzare l'operatore di spread `...` per passare l'intero oggetto props. Questi due componenti sono equivalenti: 
=======
If you already have `props` as an object, and you want to pass it in JSX, you can use `...` as a "spread" syntax to pass the whole props object. These two components are equivalent:
>>>>>>> 69bd27a3d558d6633e4f0adc61ecb8bb3d5f2edf

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

<<<<<<< HEAD
É anche possibile passare una singola proprietà dell'oggetto props e passare tutte le altre utilizzando l'operatore spread.
=======
You can also pick specific props that your component will consume while passing all other props using the spread syntax.
>>>>>>> 69bd27a3d558d6633e4f0adc61ecb8bb3d5f2edf

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

Nell'esempio precedente la prop `kind` è consumata e non viene passata all'elemento `<button>` nel DOM.
Tutte le altre props sono passate con l'oggetto `...other` rendendo il componente veramente flessibile. É possibile vedere che vengono passate le props `onClick` e `children`.

Gli attributi spread possono essere molto utili ma rendono anche semplice il passaggio di props non necessarie al componente o il passaggio di attributi HTML non validi. La raccomandazione è quella di utilizzare questa sintassi con parsimonia.

## Elementi figli in JSX {#children-in-jsx}

Nelle espressioni JSX che contengono sia un tag di apertura che un tag di chiusura il loro contenuto viene passato come una prop speciale: `props.children`. Ci sono diversi modi per passare gli elementi figli:

### String Literals {#string-literals-1}

É possibile inserire una stringa fra il tag di apertura e chiusura e `props.children` sarà proprio quella stringa. Questo è molto utile per molti degli elementi HTML. Ad esempio:

```js
<MyComponent>Hello world!</MyComponent>
```

è codice JSX valido e `props.children` nel componente `MyComponent` è rappresentato dalla stringa `"Hello world!"`. Di HTML non viene fatto l'escape, dunque è possibile scrivere JSX allo stesso modo di come si scriverebbe HTML:

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX rimuove gli spazi bianchi all'inizio e alla fine della linea. Rimuove anche linee vuote. I caratteri di nuova linea accanto ai tag vengono rimosse mentre le linee bianche che compaiono nel mezzo di una stringa vengono condensate in un singolo spazio bianco. Tutti gli esempi di seguito vengono renderizzati allo stesso modo:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX Children {#jsx-children}

É possibile inserire più elementi JSX come elementi figli di un tag. Molto utile per visualizzare componenti annidati:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

É possibile mettere come figli diversi tipi di elementi, puoi utilizzare stringhe e codice JSX insieme ad esempio. Questa è un'altra somiglianza di JSX ad HTML in modo tale che sia codice valido sia HTML che JSX:

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

Un componente React può anche tornare un array di elementi:

```js
render() {
  // No need to wrap list items in an extra element!
  return [
    // Don't forget the keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript Expressions as Children {#javascript-expressions-as-children}

É possibile passare una qualsiasi espressione JavaScript, come elemento figlio, semplicemente circondandola con `{}`. Ad esempio queste espressioni sono tutte equivalenti:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

Spesso questo è utile per renderizzare liste di espressioni JSX di qualsiasi lunghezza. Ad esempio il codice seguente renderizza una lista HTML:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

Le espressioni JavaScript possono essere mixate con altri tipi di elementi figli e questo è particolarmente utile nei templates:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Le funzioni come elementi figli {#functions-as-children}

Solitamente le espressioni JavaScript inserite all'interno del codice JSX sono valutate come stringhe, un elemento React o come una lista dei precedenti due casi. Ad ogni modo `props.children` lavora esattamente come ogni altra prop in cui è possibile passare qualsiasi tipo di dati, non solamente quelli conosciuti da React che conosce come renderizzare. Ad esempio se abbiamo un componente custom, questo potrebbe essere richiamato come `props.children`: 

```js{4,13}
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

I figli passati ad un componente custom possono essere qualsiasi cosa, visto che poi il componente li trasforma in qualcosa che React conosce prima di essere renderizzati. Questo uso non è comune, ma funziona se vuoi estendere tutte le capacità di JSX.

### I valori Booleani, Null, e Undefined vengono ignorati {#booleans-null-and-undefined-are-ignored}

`true`, `false`, `null`, e `undefined` sono elementi figli validi, ma semplicemente non vengono renderizzati. Queste espressioni JSX vengono renderizzate tutte allo stesso modo:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Il vantaggio che se ne trae è che possiamo renderizzare elementi piuttosto che altri in base a certe condizioni. Nell'esempio seguente il componente `<Header />` viene renderizzato se, e solo se, `showHeader` risulta true:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Un avvertimento sui ["falsy" values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), come ad esempio il numero `0`: questi valori vengono sempre renderizzati da React. Ad esempio il codice seguente non si comporta come ci si aspetterebbe in quanto `0` viene stampato quando `props.messages` risulta essere un array vuoto:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

La fix è semplice: l'espressione prima di `&&` deve essere sempre un'espressione booleana:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

Al contrario, se vogliamo che valori come `true`, `false`, `null`, oppure `undefined` appaiano in output è necessario prima effettuare una [conversione a stringa](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion)

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
