---
id: composition-vs-inheritance
title: Composizione vs Ereditarità
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React ha un potente modello di composizione, raccomandiamo che lo si usi in alternativa all'ereditarietà per riutilizzare codice tra componenti.

In questa sezione, considereremo alcuni problemi nei quali gli sviluppatori che sono ancora agli inizi in React utilizzano l'ereditarietà, mostreremo come si possa invece risolverli con la composizione.

## Contenimento {#containment}

Esistono componenti che si comportano da contenitori per altri componenti, non possono quindi sapere a priori quali componenti avranno come figli. Si pensi ad esempio a `Sidebar` (barra laterale) oppure `Dialog` (finestra di dialogo) che rappresentano "scatole" generiche.

Raccomandiamo che questi componenti facciano uso della prop speciale `children` per passare elementi figli direttamente nell'output:

```js{4}
function BordoFigo(props) {
  return (
    <div className={'BordoFigo BordoFigo-' + props.colore}>
      {props.children}
    </div>
  );
}
```

Ciò permette di passare componenti figli arbitrariamente annidandoli nel codice JSX:

```js{4-8}
function FinestraBenvenuto() {
  return (
    <BordoFigo colore="blue">
      <h1 className="Finestra-titolo">Benvenuto/a!</h1>
      <p className="Finestra-messaggio">
        Ti ringraziamo per questa tua visita nella nostra
        nave spaziale!
      </p>
    </BordoFigo>
  );
}
```

**[Prova su CodeSandbox](codesandbox://composition-vs-inheritance/1.js,composition-vs-inheritance/1.css)**

Il contenuto del tag JSX `<BordoFigo>` viene passato nel componente `BordoFigo` come prop `children`. Dato che `BordoFigo` renderizza `{props.children}` all'interno di un `<div>`, gli elementi passati appaiono nell'output finale.

Anche se si tratta di un approccio meno comune, a volte potresti ritrovarti ad aver bisogno di più di un "buco" all'interno di un componente. In questi casi potresti creare una tua convenzione invece di ricorrere all'uso di `children`:

```js{5,7,14}
function Pannello(props) {
  return (
    <div className="Pannello">
      <div className="Pannello-sinistra">
        {props.sinistra}
      </div>
      <div className="Pannello-destra">{props.destra}</div>
    </div>
  );
}

function App() {
  return (
    <Pannello sinistra={<Contatti />} destra={<Chat />} />
  );
}
```

**[Prova su CodeSandbox](codesandbox://composition-vs-inheritance/2.js,composition-vs-inheritance/2.css)**


Gli elementi React `<Contatti />` e `<Chat />` sono dei semplici oggetti, quindi puoi passarli come props esattamente come faresti con altri dati. Questo approccio potrebbe ricordarti il concetto di "slots" in altre librerie, ma non ci sono limitazioni su cosa puoi passare come props in React.

## Specializzazioni {#specialization}

A volte pensiamo ai componenti come se fossero "casi speciali" di altri componenti. Ad esempio, potremmo dire che `FinestraBenvenuto` è una specializzazione di `Finestra`.

In React, ciò si ottiene mediante composizione, dove componenti più "specifici" renderizzano la versione più "generica" configurandola mediante props:

```js{4,6,15,16}
function Finestra(props) {
  return (
    <BordoFigo colore="blue">
      <h1 className="Finestra-title">{props.titolo}</h1>
      <p className="Finestra-messaggio">
        {props.messaggio}
      </p>
    </BordoFigo>
  );
}

function FinestraBenvenuto() {
  return (
    <Finestra
      titolo="Benvenuto/a!"
      messaggio="Ti ringraziamo per questa tua visita nella nostra
      nave spaziale!"
    />
  );
}
```

**[Prova su CodeSandbox](codesandbox://composition-vs-inheritance/3.js,composition-vs-inheritance/3.css)**


La composizione funziona ugualmente bene per i componenti definiti come classi:

```js{8,26-32}
function Finestra(props) {
  return (
    <BordoFigo colore="blue">
      <h1 className="Finestra-titolo">{props.titolo}</h1>
      <p className="Finestra-messaggio">
        {props.messaggio}
      </p>
      {props.children}
    </BordoFigo>
  );
}

class FinestraRegistrazione extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Finestra
        titolo="Programma di Esplorazione di Marte"
        messaggio="Qual'è il tuo nome?">
        <input
          value={this.state.login}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSignUp}>
          Registrami!
        </button>
      </Finestra>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Benvenuto/a a bordo, ${this.state.login}!`);
  }
}
```

**[Prova su CodeSandbox](codesandbox://composition-vs-inheritance/4.js,composition-vs-inheritance/4.css)**


## E per quanto riguarda l'ereditarietà? {#so-what-about-inheritance}

In Facebook, usiamo React in migliaia di componenti ma non abbiamo mai avuto alcun caso in cui sarebbe raccomandabile utilizzare gerarchie di ereditarietà per i componenti.

<<<<<<< HEAD
Le props e la composizione ti offrono tutta la flessibilità di cui hai bisogno per personalizzare l'aspetto ed il comportamento di un componente in modo esplicito e sicuro. Ricorda che i componenti possono accettare props arbitrarie, inclusi valori primitivi, elementi React o funzioni.

Se vuoi riutilizzare le funzionalità non strettamente legate alla UI tra componenti, suggeriamo di estrarre tali logiche all'interno di un modulo JavaScript separato. I componenti potranno quindi importarlo ed utilizzare quella funzione, oggetto o classe di cui hanno bisogno, senza dover estendere tale modulo.
=======
If you want to reuse non-UI functionality between components, we suggest extracting it into a separate JavaScript module. The components may import it and use that function, object, or class, without extending it.
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6
