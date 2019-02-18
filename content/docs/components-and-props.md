---
id: components-and-props
title: Componenti e Props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

I Componenti ti permettono di suddividere la UI (*User Interface*, o interfaccia utente) in parti indipendenti, riutilizzabili e di pensare ad ognuna di esse in modo isolato. Questa pagina offre una introduzione al concetto dei componenti. Puoi trovare invece informazioni dettagliate nella [API di riferimento dei componenti](/docs/react-component.html).

Concettualmente, i componenti sono come funzioni JavaScript: accettano in input dati arbitrari (sotto il nome di "props") e ritornano elementi React che descrivono cosa dovrebbe apparire sullo schermo.

## Funzioni e Classi Componente {#function-and-class-components}

Il modo più semplice di definire un componente è quello di scrivere una funzione JavaScript:

```js
function Ciao(props) {
  return <h1>Ciao, {props.nome}</h1>;
}
```

Questa funzione è un componente React valido in quanto accetta un oggetto parametro contenente dati sotto forma di una singola "props" (che prende il nome da "properties" in inglese, ossia "proprietà") che è un oggetto parametro avente dati al suo interno e ritorna un elemento React. Chiameremo questo tipo di componenti "componenti funzione" perchè sono letteralmente funzioni JavaScript.

Puoi anche usare una [classe ES6](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes) per definire un componente:

```js
class Ciao extends React.Component {
  render() {
    return <h1>Ciao, {this.props.nome}</h1>;
  }
}
```

I due componenti appena visti sono equivalenti dal pundo di vista di React.

Le Classi hanno funzionalità aggiuntive che verranno discusse in dettaglio nelle [prossime sezioni](/docs/state-and-lifecycle.html). Fino ad allora, ci limiteremo all'uso dei componenti funzione per via della loro concisività.

## Renderizzare un Componente {#rendering-a-component}

In precedenza, abbiamo incontrato elementi React che rappresentano tags DOM:

```js
const elemento = <div />;
```

Comunque, gli elementi possono rappresentare anche componenti definiti dall'utente:

```js
const elemento = <Ciao nome="Sara" />;
```

Quando React incontra un elemento che rappresenta un componente definito dall'utente, passa gli attributi JSX a questo componente come un singolo oggetto. Tale oggetto prende il nome di "props".

Ad esempio, il codice seguente renderizza il messaggio "Ciao, Sara" nella pagina:

```js{1,5}
function Ciao(props) {
  return <h1>Ciao, {props.nome}</h1>;
}

const elemento = <Ciao nome="Sara" />;
ReactDOM.render(
  elemento,
  document.getElementById('root')
);
```

[**Prova in CodePen**](codepen://components-and-props/rendering-a-component)

Ricapitoliamo cosa succede nell'esempio:

1. Richiamiamo `ReactDOM.render()` con l'elemento `<Ciao nome="Sara" />`.
2. React chiama a sua volta il componente `Ciao` con `{nome: 'Sara'}` passato in input come props.
3. Il nostro componente `Ciao` ritorna un elemento `<h1>Ciao, Sara</h1>` come risultato.
4. React DOM aggiorna efficientemente il DOM per far sì che contenga `<h1>Ciao, Sara</h1>`.

>**Nota Bene:** Ricordati di chiamare i tuoi componenti con la prima lettera in maiuscolo.
>
>React tratta i componenti che iniziano con una lettera minuscola come normali tags DOM. per esempio, `<div />` rappresenta un tag HTML div,  `<Ciao />` rappresenta invece un componente e richiede `Ciao` all'interno dello [scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope).
>
>Per saperne di più riguardo questa convenzione, leggi [JSX In Dettaglio](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

## Comporre Componenti {#composing-components}

I componenti possono far riferimento ad altri componenti nel loro output. Ciò permette di utilizzare la stessa astrazione ad ogni livello di dettaglio. Un bottone, un form, una finestra di dialogo, a form, a dialog, a screen: in React apps, all those are commonly expressed as components.

For example, we can create an `App` component that renders `Ciao` many times:

```js{8-10}
function Ciao(props) {
  return <h1>Ciao, {props.nome}</h1>;
}

function App() {
  return (
    <div>
      <Ciao nome="Sara" />
      <Ciao nome="Cahal" />
      <Ciao nome="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Prova in CodePen**](codepen://components-and-props/composing-components)

Typically, new React apps have a single `App` component at the very top. However, if you integrate React into an existing app, you might start bottom-up with a small component like `Button` and gradually work your way to the top of the view hierarchy.

## Extracting Components {#extracting-components}

Don't be afraid to split components into smaller components.

For example, consider this `Comment` component:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[**Prova in CodePen**](codepen://components-and-props/extracting-components)

It accepts `author` (an object), `text` (a string), and `date` (a date) as props, and describes a comment on a social media website.

This component can be tricky to change because of all the nesting, and it is also hard to reuse individual parts of it. Let's extract a few components from it.

First, we will extract `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

The `Avatar` doesn't need to know that it is being rendered inside a `Comment`. This is why we have given its prop a more generic name: `user` rather than `author`.

We recommend naming props from the component's own point of view rather than the context in which it is being used.

We can now simplify `Comment` a tiny bit:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Next, we will extract a `UserInfo` component that renders an `Avatar` next to the user's name:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

This lets us simplify `Comment` even further:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[**Prova in CodePen**](codepen://components-and-props/extracting-components-continued)

Extracting components might seem like grunt work at first, but having a palette of reusable components pays off in larger apps. A good rule of thumb is that if a part of your UI is used several times (`Button`, `Panel`, `Avatar`), or is complex enough on its own (`App`, `FeedStory`, `Comment`), it is a good candidate to be a reusable component.

## Props are Read-Only {#props-are-read-only}

Whether you declare a component [as a function or a class](#function-and-class-components), it must never modify its own props. Consider this `sum` function:

```js
function sum(a, b) {
  return a + b;
}
```

Such functions are called ["pure"](https://en.wikipedia.org/wiki/Pure_function) because they do not attempt to change their inputs, and always return the same result for the same inputs.

In contrast, this function is impure because it changes its own input:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React is pretty flexible but it has a single strict rule:

**All React components must act like pure functions with respect to their props.**

Of course, application UIs are dynamic and change over time. In the [next section](/docs/state-and-lifecycle.html), we will introduce a new concept of "state". State allows React components to change their output over time in response to user actions, network responses, and anything else, without violating this rule.
