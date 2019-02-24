---
id: composition-vs-inheritance
title: Composizione vs Ereditarietà
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React ha un potente modello di composizione, e raccomandiamo che lo si usi invece di ereditarietà per riutilizzare codice tra componenti.

In questa sezione, considereremo alcuni problemi in quali sviluppatori che sono iniziante a React frequentemente usano ereditarietà, e mostreremo come possiamo risolverli con composizione.

## Contenimento {#containment}

Alcuni componenti non sanno quali sono i loro figli in anticipo. Questo è specialmente comune per componenti come `Sidebar` oppure `Dialog` che rappresentano "scatole" generici.

Raccomandiamo che questi componenti usano la prop speciale `children`, per passare elementi figli direttamente nella sua produzione.

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```
Questo permette che altri componenti gli passino qualsiasi figli annidandoli il codice JSX:

```js{4-9}
function DialogBenvenuti() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Benvenuti
      </h1>
      <p className="Dialog-message">
        Grazie per visitare il nostro veicolo spaziale!
      </p>
    </FancyBorder>
  );
}
```

**[Provalo su CodePen](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

Tutto che è dentro la tag JSX `<FancyBorder>` è passato nel componente `FancyBorder` come un prop `children` (figlio). Come `FancyBorder` renderizza `{props.children}` dentro di un `<div>`, gli elementi passati appaiano nella produzione finale.

Anche se questo è meno comune, qualche volte potrebbe necessitare qualche "buco" dentro di un componente. In questi casi, si potrebbe sviluppare una propria convenzione invece di usare la prop `children`.

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[**Provalo su CodePen**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

Elementi di React come `<Contatti />` e `<Chat />` sono solo oggetti, allora loro possono essere passati come prop come qualsiasi altri dati. Questo approccio potrebbe sembrare "*slots*" in qualche biblioteca però non hanno nessun limitazione in relazione al che potrebbe essere passato come prop in React.

## Specializzazione {#specialization}

Spesso pensiamo in componenti com'essendo "casi speciali" di altri componenti. Per esempio, potremmo dire che `DialogBenvenuti` è un caso speciale di `Dialog`.

In React, questo anch'è realizzato con il uso di composizione, dove un componente più "specifico" renderizza un componente più "generico" e lo configura con prop:

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function DialogBenvenuti() {
  return (
    <Dialog
      title="Benvenuti"
      message="Grazie per visitare il nostro veicolo spaziale!" />
  );
}
```

[**Provalo su CodePen**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

Composizione funziona ugualmente per componenti definiti come classi:

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class DialogIscriversi extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Programma di esplorazione di Marte"
              message="Come doviamo vi referire?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Iscrivimi!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

[**Provalo su CodePen**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## E l'ereditarietà? {#so-what-about-inheritance}

Su Facebook, usiamo React in migliaia di componenti, e non abbiamo trovato nessun uso dove raccomanderemmo la creazione gerarchie di ereditarietà di componenti. 

Prop e composizioni danno tutta la flessibilità che potrebbe essere necessitata per personalizzare gli aspetto e comportamento di un componente di un modo esplicito e sicuro. Ricordatevi che componenti possono accettare prop arbitrarie, compresi valori primitivi, elementi di React, o funzioni.

Se vorrebbe usare funzionalità visuale tra componenti, vi consigliamo di estrarre queste funzionalità in un modulo Javascript separato. I componenti possono importarlo e utilizzare questa funzione, oggetto, oppure una classe, senza l'estendere.
