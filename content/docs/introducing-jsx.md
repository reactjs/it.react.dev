---
id: introducing-jsx
title: Introduzione a JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

<<<<<<< HEAD
Considera questa dichiarazione di variabile:
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Writing Markup with JSX](https://beta.reactjs.org/learn/writing-markup-with-jsx)
> - [JavaScript in JSX with Curly Braces](https://beta.reactjs.org/learn/javascript-in-jsx-with-curly-braces)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Consider this variable declaration:
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c

```js
const element = <h1>Hello, world!</h1>;
```

Questa strana sintassi con i tag non è né una stringa né HTML.

È chiamata JSX, ed è un'estensione della sintassi JavaScript. Ti raccomandiamo di utilizzarla con React per descrivere l'aspetto che dovrebbe avere la UI (*User Interface*, o interfaccia utente). JSX ti potrebbe ricordare un linguaggio di template, ma usufruisce di tutta la potenza del JavaScript.

JSX produce "elementi React". Studieremo il modo in cui gli elementi vengono renderizzati nel DOM nella [prossima sezione](/docs/rendering-elements.html). Qui sotto troverai le nozioni fondamentali di JSX, sufficienti per iniziare ad utilizzarlo.

### Perché JSX? {#why-jsx}

React riconosce il fatto che la logica di renderizzazione è per sua stessa natura accoppiata con le altre logiche che governano la UI: la gestione degli eventi, il cambiamento dello stato nel tempo, la preparazione dei dati per la visualizzazione.

Invece di separare artificialmente le *tecnologie* inserendo il codice di markup e la logica in file separati, React [separa le *responsabilità*](https://it.wikipedia.org/wiki/Principio_di_singola_responsabilit%C3%A0) utilizzando unità debolmente accoppiate chiamate "componenti" che contengono entrambi. Torneremo a parlare dei componenti in una [sezione successiva](/docs/components-and-props.html). Se non ti senti ancora a tuo agio ad inserire codice di markup nel JavaScript, [questa presentazione](https://www.youtube.com/watch?v=x7cQ3mrcKaY) dovrebbe riuscire a convincerti.

React [non obbliga](/docs/react-without-jsx.html) ad utilizzare JSX, ma la maggior parte delle persone lo trovano utile come aiuto visuale quando lavorano con la UI all'interno del codice JavaScript. Inoltre, JSX consente a React di mostrare messaggi di errore e di avvertimento più efficaci.

Detto questo, incominciamo!

### Incorporare espressioni in JSX {#embedding-expressions-in-jsx}

Nell'esempio in basso, dichiariamo una variabile chiamata `name` e poi la utilizziamo all'interno di JSX racchiudendola in parentesi graffe:

```js{1,2}
const name = 'Giuseppe Verdi';
const element = <h1>Hello, {name}</h1>;
```

Puoi inserire qualsiasi [espressione JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) all'interno delle parentesi graffe in JSX. Ad esempio, `2 + 2`, `user.firstName` o `formatName(user)` sono tutte espressioni JavaScript valide.

Nell'esempio in basso, includiamo il risultato della chiamata ad una funzione JavaScript, `formatName(user)`, in un elemento `<h1>`.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Giuseppe',
  lastName: 'Verdi'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);
```

**[Provalo su CodePen](https://codepen.io/gaearon/pen/PGEjdG?editors=1010)**

Abbiamo suddiviso il codice JSX su più linee per renderlo più leggibile. Sebbene non sia obbligatorio, se segui questa pratica ti consigliamo di racchiudere il codice in parentesi per evitare i problemi che possono derivare dall'[inserimento automatico dei punto e virgola](https://stackoverflow.com/q/2846283).

### JSX è un'Espressione {#jsx-is-an-expression-too}

Dopo la compilazione, le espressioni JSX diventano normali chiamate a funzioni JavaScript che producono oggetti JavaScript.

Questo significa che puoi utilizzare JSX all'interno di istruzioni `if` e cicli `for`, assegnarlo a variabili, utilizzarlo come argomento di una funzione e restituirlo come risultato di una funzione:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### Specificare gli Attributi con JSX {#specifying-attributes-with-jsx}

Puoi utilizzare le virgolette per valorizzare gli attributi con una stringa:

```js
const element = <a href="https://www.reactjs.org"> link </a>;
```

Puoi anche utilizzare le parentesi graffe per includere un'espressione JavaScript in un attributo:

```js
const element = <img src={user.avatarUrl}></img>;
```

Non aggiungere le virgolette attorno alle parentesi graffe quando includi un'espressione JavaScript in un attributo. Dovresti utilizzare o le virgolette (per le stringhe) o le parentesi graffe (per le espressioni), ma mai entrambe nello stesso attributo.

>**Attenzione:**
>
>Dal momento che JSX è più vicino al JavaScript che all'HTML, React DOM utilizza la convenzione [`camelCase`](https://it.wikipedia.org/wiki/Notazione_a_cammello) nell'assegnare il nome agli attributi, invece che quella utilizzata normalmente nell'HTML, e modifica il nome di alcuni attributi.
>
>Ad esempio, `class` diventa [`className`](https://developer.mozilla.org/it/docs/Web/API/Element/className) in JSX e `tabindex` diventa [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### Specificare Figli in JSX {#specifying-children-with-jsx}

Se un tag è vuoto, puoi chiuderlo immediatamente con `/>`, come in XML:

```js
const element = <img src={user.avatarUrl} />;
```

I tag JSX possono contenere figli:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX Previene gli Attacchi di Iniezione del Codice {#jsx-prevents-injection-attacks}

Utilizzare l'input degli utenti in JSX è sicuro:

```js
const title = response.contenutoPotenzialmentePericoloso;
// Questo è sicuro:
const element = <h1>{title}</h1>;
```

React DOM effettua automaticamente l'[escape](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) di qualsiasi valore inserito in JSX prima di renderizzarlo. In questo modo, garantisce che non sia possibile iniettare nulla che non sia esplicitamente scritto nella tua applicazione. Ogni cosa è convertita in stringa prima di essere renderizzata. Questo aiuta a prevenire gli attacchi [XSS (cross-site-scripting)](https://it.wikipedia.org/wiki/Cross-site_scripting).

### JSX Rappresenta Oggetti {#jsx-represents-objects}

Babel compila JSX in chiamate a `React.createElement()`.

Questi due esempi sono identici:

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` effettua alcuni controlli per aiutarti a scrivere codice senza bug, ma fondamentalmente crea un oggetto come questo:

```js
// Nota: questa struttura è semplificata
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

Questi oggetti sono chiamati "elementi React". Puoi pensare a loro come a descrizioni di ciò che vuoi vedere sullo schermo. React legge questi oggetti e li utilizza per costruire il DOM e tenerlo aggiornato.

Esploreremo la renderizzazione degli elementi React nel DOM nella [prossima sezione](/docs/rendering-elements.html).

>**Consiglio:**
>
>Ti raccomandiamo di [indicare "Babel" come linguaggio](https://babeljs.io/docs/en/next/editors) nel tuo editor preferito, in modo che il codice ES6 ed il codice JSX siano entrambi evidenziati correttamente.
