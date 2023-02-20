---
id: state-and-lifecycle
title: State e Lifecycle
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

<<<<<<< HEAD
Questa pagina introduce il concetto di *state* (stato) e *lifecycle* (ciclo di vita) in un componente React. Puoi trovare un [riferimento dettagliato alle API dei componenti qui](/docs/react-component.html).
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [State: A Component's Memory](https://beta.reactjs.org/learn/state-a-components-memory)
> - [Synchronizing with Effects](https://beta.reactjs.org/learn/synchronizing-with-effects)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

This page introduces the concept of state and lifecycle in a React component. You can find a [detailed component API reference here](/docs/react-component.html).
>>>>>>> 63c77695a95902595b6c2cc084a5c3650b15210a

Considera l'esempio dell'orologio di [una delle sezioni precedenti](/docs/rendering-elements.html#updating-the-rendered-element). In [Renderizzare Elementi](/docs/rendering-elements.html#rendering-an-element-into-the-dom), abbiamo appreso solamente un modo per aggiornare la UI. Chiamiamo `root.render()` per cambiare l'output renderizzato:

```js{10}
const root = ReactDOM.createRoot(document.getElementById('root'));

function tick() {
  const element = (
    <div>
      <h1>Ciao, mondo!</h1>
      <h2>Sono le {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  root.render(element);
}

setInterval(tick, 1000);
```

[**Prova su CodePen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

In questa sezione, apprenderemo come rendere il componente `Clock` davvero riutilizzabile ed incapsulato. Esso si occuperà di impostare il proprio timer e di aggiornarsi ogni secondo.

Possiamo iniziare incapsulando l'aspetto dell'orologio:

```js{5-8,13}
const root = ReactDOM.createRoot(document.getElementById('root'));

function Clock(props) {
  return (
    <div>
      <h1>Ciao, mondo!</h1>
      <h2>Sono le {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  root.render(<Clock date={new Date()} />);
}

setInterval(tick, 1000);
```

[**Prova su CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Tuttavia, manca un requisito fondamentale: il fatto che `Clock` imposti un timer ed aggiorni la propria UI ogni secondo dovrebbe essere un dettaglio implementativo di `Clock`.

Idealmente, vorremmo scrivere il seguente codice una volta sola, ed ottenere che `Clock` si aggiorni da solo:

```js{2}
root.render(<Clock />);
```

Per implementare ciò, abbiamo bisogno di aggiungere uno "stato" al componente `Clock`.

Lo state (o stato) è simile alle props, ma è privato e completamente controllato dal componente.

## Convertire una Funzione in una Classe {#converting-a-function-to-a-class}

Puoi convertire un componente funzione come `Clock` in una classe in cinque passaggi:

1. Crea una [classe ES6](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes), con lo stesso nome, che estende `React.Component`.

2. Aggiungi un singolo metodo vuoto chiamato `render()`.

3. Sposta il corpo della funzione all'interno del metodo `render()`.

4. Sostituisci `props` con `this.props` nel corpo del metodo `render()`.

5. Rimuovi la dichiarazione della funzione rimasta vuota.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Ciao, mondo!</h1>
        <h2>Sono le {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Prova su CodePen**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` è ora definito da una classe, invece che da una funzione.

Il metodo `render` viene invocato ogni volta che si verifica un aggiornamento, ma finché renderizziamo `<Clock />` nello stesso nodo del DOM, verrà utilizzata un'unica istanza della classe `Clock`. Questo ci consente di utilizzare funzionalità aggiuntive come il local state e i metodi del lifecycle del componente.

## Aggiungere il Local State ad una Classe {#adding-local-state-to-a-class}

Sposteremo `date` dalle props allo state in tre passaggi:

1) Sostituisci `this.props.date` con `this.state.date` nel metodo `render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Ciao, mondo!</h1>
        <h2>Sono le {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Aggiungi un [costruttore di classe](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes#Costruttore) che assegna il valore iniziale di `this.state`:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Ciao, mondo!</h1>
        <h2>Sono le {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Nota come passiamo `props` al costruttore di base:

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

I componenti classe dovrebbero sempre chiamare il costruttore base passando `props` come argomento.

3) Rimuovi la prop `date` dall'elemento `<Clock />`:

```js{2}
root.render(<Clock />);
```

In seguito ci occuperemo di aggiungere la parte di codice relativa al timer all'interno del componente stesso.

Il risultato dovrebbe avere questo aspetto:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Ciao, mondo!</h1>
        <h2>Sono le {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Clock />);
```

[**Prova su CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Adesso, faremo in modo che `Clock` imposti il proprio timer e si aggiorni ogni secondo.

## Aggiungere Metodi di Lifecycle ad una Classe {#adding-lifecycle-methods-to-a-class}

Nelle applicazioni con molti componenti, è molto importante rilasciare le risorse occupate dai componenti quando questi vengono distrutti.

Nel nostro caso, vogliamo [impostare un timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) ogni volta che `Clock` è renderizzato nel DOM per la prima volta. Questo è definito "mounting" ("montaggio") in React.

Vogliamo anche [cancellare il timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) ogni volta che il DOM prodotto da `Clock` viene rimosso. Questo è definito "unmounting" ("smontaggio") in React.

Possiamo dichiarare alcuni metodi speciali nel componente classe per eseguire del codice quando il componente viene montato e smontato:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Ciao, mondo!</h1>
        <h2>Sono le {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Questi metodi sono chiamati "metodi del lifecycle" (metodi del ciclo di vita).

Il metodo `componentDidMount()` viene eseguito dopo che l'output del componente è stato renderizzato nel DOM. È un buon punto in cui impostare un timer:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Nota come salviamo l'ID del timer direttamente in `this` (`this.timerID`).

Mentre `this.props` viene impostato da React stesso e `this.state` ha un significato speciale, sei libero di aggiungere altri campi alla classe se hai bisogno di salvare qualcosa che non partecipa al flusso dei dati (come l'ID di un timer).

Ci occuperemo di cancellare il timer nel metodo del lifecycle `componentWillUnmount()`:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Infine, implementeremo un metodo chiamato `tick()` che verrà invocato dal componente `Clock` ogni secondo.

Il nuovo metodo utilizzerà `this.setState()` per pianificare gli aggiornamenti al local state del componente:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Ciao, mondo!</h1>
        <h2>Sono le {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Clock />);
```

[**Prova su CodePen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

In questo modo l'orologio scatta ogni secondo.

Ricapitoliamo velocemente quello che sta succedendo e l'ordine con cui i metodi sono invocati:

1) Quando `<Clock />` viene passato a `root.render()`, React invoca il costruttore del componente `Clock`. Dal momento che `Clock` ha bisogno di mostrare l'ora corrente, inizializza `this.state` con un oggetto che include l'ora corrente. In seguito, aggiorneremo questo state.

2) In seguito, React invoca il metodo `render()` del componente `Clock`. Questo è il modo in cui React apprende cosa dovrebbe essere visualizzato sullo schermo. React si occupa di aggiornare il DOM in modo da farlo corrispondere all'output della renderizzazione di `Clock`.

3) Quando l'output della renderizzazione di `Clock` viene inserito nel DOM, React invoca il metodo del lifecycle `componentDidMount()`. Al suo interno, il componente `Clock` chiede al browser di impostare un timer con cui invocare il metodo `tick()` del componente una volta al secondo.

4) Ogni secondo, il browser invoca il metodo `tick()`. Al suo interno, il componente `Clock` pianifica un aggiornamento della UI invocando `setState()` con un oggetto che contiene la nuova ora corrente. Grazie alla chiamata a `setState()`, React viene informato del fatto che lo state è cambiato e invoca di nuovo il metodo `render()` per sapere che cosa deve essere mostrato sullo schermo. Questa volta, `this.state.date` nel metodo `render()` avrà un valore differente, di conseguenza l'output della renderizzazione includerà l'orario aggiornato. React aggiorna il DOM di conseguenza.

5) Se il componente `Clock` dovesse mai essere rimosso dal DOM, React invocherebbe il metodo del lifecycle `componentWillUnmount()` ed il timer verrebbe cancellato.

## Utilizzare Correttamente lo Stato {#using-state-correctly}

Ci sono tre cose che devi sapere a proposito di `setState()`.

### Non Modificare lo Stato Direttamente {#do-not-modify-state-directly}

Per esempio, questo codice non farebbe ri-renderizzare un componente:

```js
// Sbagliato
this.state.comment = 'Hello';
```

Devi invece utilizzare `setState()`:

```js
// Giusto
this.setState({comment: 'Hello'});
```

L'unico punto in cui puoi assegnare direttamente un valore a `this.state` è nel costruttore.

### Gli Aggiornamenti di Stato Potrebbero Essere Asincroni {#state-updates-may-be-asynchronous}

React potrebbe accorpare più chiamate a `setState()` in un unico aggiornamento per migliorare la performance.

Poiché `this.props` e `this.state` potrebbero essere aggiornate in modo asincrono, non dovresti basarti sul loro valore per calcolare lo stato successivo.

Ad esempio, questo codice potrebbe non riuscire ad aggiornare correttamente il contatore:

```js
// Sbagliato
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Per effettuare correttamente questa operazione, bisogna utilizzare una seconda forma di `setState()` che accetta in input una funzione invece che un oggetto. Quella funzione riceverà come primo argomento lo stato precedente e come secondo argomento le proprietà, aggiornate al momento in cui l'aggiornamento di stato è applicato:

```js
// Giusto
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

Qui abbiamo utilizzato una [arrow function](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Functions_and_function_scope/Arrow_functions), ma puoi utilizzare anche una funzione tradizionale:

```js
// Giusto
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### Gli Aggiornamenti di Stato Vengono Applicati Tramite Merge {#state-updates-are-merged}

Quando chiami `setState()`, React effettua il merge dell'oggetto che fornisci nello state corrente.

Ad esempio, il tuo state potrebbe contenere molte variabili indipendenti:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

A questo punto puoi aggiornarle indipendentemente con invocazioni separate del metodo `setState()`:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

Quello che viene effettuato è uno ["shallow merge"](https://stackoverflow.com/questions/42731453/deep-and-shallow-merge-in-javascript), quindi `this.setState({comments})` lascia intatto `this.state.posts`, ma sostituisce completamente `this.state.comments`.

## I Dati Fluiscono Verso il Basso {#the-data-flows-down}

Né i componenti genitori né i componenti figli possono sapere se un certo componente è "stateful" o "stateless" (cioè se è dotato o meno di stato) e non dovrebbero preoccuparsi del fatto di essere definiti come funzione o come classe.

Questa è la ragione per cui lo stato è spesso definito locale o incapsulato. Esso non è accessibile a nessun componente a parte quello a cui appartiene.

Un componente potrebbe decidere di passare il suo stato ai componenti figli sotto forma di props:

```js
<FormattedDate date={this.state.date} />
```

Il componente `FormattedDate` riceve `date` nelle sue props e non può sapere se viene dallo state di `Clock`, dalle proprietà di `Clock` o se è stato inserito a mano:

```js
function FormattedDate(props) {
  return <h2>Sono le {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Prova su CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

Questo è spesso definito flusso di dati "top-down" (dall'alto verso il basso) o "unidirezionale". In questo paradigma, lo stato è sempre posseduto da uno specifico componente, e tutti i dati o la UI derivati da quello stato possono influenzare solamente i componenti "più in basso" nell'albero.

Se immagini un albero di componenti come una cascata di props, puoi pensare allo stato di ciascun componente come a una sorgente d'acqua aggiuntiva che si unisce alla cascata in un punto qualsiasi e flusice verso il basso insieme al resto dell'acqua.

Per mostrare che tutti i componenti sono davvero isolati, possiamo creare un componente `App` che renderizza tre `<Clock>`:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}
```

[**Prova su CodePen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Ciascun `Clock` imposta il proprio timer e si aggiorna indipendentemente dagli altri.

Nelle applicazioni React, il fatto che un componente sia stateful o stateless è considerato un dettaglio implementativo di quel componente, che potrebbe cambiare nel tempo. Puoi utilizzare componenti stateless all'interno di componenti stateful, e viceversa.
