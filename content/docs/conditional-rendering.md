---
id: conditional-rendering
title: Renderizzazione Condizionale
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

In React, puoi creare componenti distinti che incapsulano il funzionamento di cui hai bisogno. Quindi, puoi renderizzarne solo alcuni, a seconda dello stato della tua applicazione.

La renderizzazione condizionale in React funziona nello stesso modo in cui funzionano le condizioni in JavaScript. Puoi perciò usare operatori come [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) o l'[operatore condizionale](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/Operator_Condizionale) per creare elementi che rappresentano lo stato corrente cosicché React possa aggiornare la UI di conseguenza.

Considera i due componenti:

```js
function BenvenutoUtente(props) {
  return <h1>Bentornato/a!</h1>;
}

function BenvenutoOspite(props) {
  return <h1>Autenticati, per favore</h1>;
}
```

Creiamo un componente `Benvenuto` che visualizza l'uno o l'altro dei componenti appena visti a seconda del fatto che l'utente sia autenticato o meno:

```javascript{3-7,11,12}
function Benvenuto(props) {
  const utenteAutenticato = props.utenteAutenticato;
  if (utenteAutenticato) {
    return <BenvenutoUtente />;
  }
  return <BenvenutoOspite />;
}

<<<<<<< HEAD
ReactDOM.render(
  // Prova a cambiare in utenteAutenticato={true}:
  <Benvenuto utenteAutenticato={false} />,
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root')); 
// Try changing to isLoggedIn={true}:
root.render(<Greeting isLoggedIn={false} />);
>>>>>>> ee7705675d2304c53c174b9fb316e2fbde1e9fb3
```

[](codepen://conditional-rendering/1)

Questo esempio renderizza un messaggio di benvenuto diverso a seconda del valore della prop `utenteAutenticato`.

### Variabili Elemento {#element-variables}

Le variabili possono contenere elementi. Ciò ti permette di renderizzare condizionatamente parti del componente mentre il resto dell'output non cambia.

Considera questi due nuovi componenti che rappresentano bottoni di Logout e Login:

```js
function BottoneLogin(props) {
  return <button onClick={props.onClick}>Login</button>;
}

function BottoneLogout(props) {
  return <button onClick={props.onClick}>Logout</button>;
}
```

Nell'esempio di seguito, creeremo un [componente stateful](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) chiamato `ControlloLogin`.

Esso renderizzerà `<BottoneLogin />` o `<BottoneLogout />` a seconda del suo stato corrente. Renderizzerà inoltre il componente `<Benvenuto />` dell'esempio precedente:

```javascript{21-29,33,34}
class ControlloLogin extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {utenteAutenticato: false};
  }

  handleLoginClick() {
    this.setState({utenteAutenticato: true});
  }

  handleLogoutClick() {
    this.setState({utenteAutenticato: false});
  }

  render() {
    const utenteAutenticato = this.state.utenteAutenticato;
    let bottone;

    if (utenteAutenticato) {
      bottone = (
        <BottoneLogout onClick={this.handleLogoutClick} />
      );
    } else {
      bottone = (
        <BottoneLogin onClick={this.handleLoginClick} />
      );
    }

    return (
      <div>
        <Benvenuto utenteAutenticato={utenteAutenticato} />
        {bottone}
      </div>
    );
  }
}

<<<<<<< HEAD
ReactDOM.render(
  <ControlloLogin />,
  document.getElementById('root')
);

=======
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<LoginControl />);
>>>>>>> ee7705675d2304c53c174b9fb316e2fbde1e9fb3
```

[](codepen://conditional-rendering/2)

Anche se dichiarare una variabile ed usare una condizione con `if` è un buon modo per renderizzare condizionatamente un componente, a volte è preferibile usare una sintassi più corta. Esistono diversi modi per definire condizioni *inline* (ossia nella stessa riga), diamo uno sguardo.

### Condizione If Inline con Operatore Logico && {#inline-if-with-logical--operator}

Puoi [incorporare espressioni in JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) racchiudendole in parentesi graffe. Lo stesso vale per l'operatore logico JavaScript `&&` che può tornare utile quando vogliamo includere un elemento condizionatamente:

```js{6-10}
function CasellaDiPosta(props) {
  const messaggiNonLetti = props.messaggiNonLetti;
  return (
    <div>
      <h1>Ciao!</h1>
      {messaggiNonLetti.length > 0 && (
        <h2>
          Hai {messaggiNonLetti.length} messaggi non letti.
        </h2>
      )}
    </div>
  );
}

<<<<<<< HEAD
const messaggi = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <CasellaDiPosta messaggiNonLetti={messaggi} />,
  document.getElementById('root')
);

=======
const messages = ['React', 'Re: React', 'Re:Re: React'];

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<Mailbox unreadMessages={messages} />);
>>>>>>> ee7705675d2304c53c174b9fb316e2fbde1e9fb3
```
[](codepen://conditional-rendering/3)

Funziona perché in JavaScript, `true && espressione` si risolve sempre in `espressione`, mentre `false && espressione` si risolve sempre in `false`.

Per questo, se la condizione è `true`, l'elemento dopo `&&` verrà renderizzato. Se invece è `false`, React lo ignorerà.

Tieni presente che ritornare una espressione `falsy` farà in modo che l'elemento che segue `&&` venga scartato ma ritornerà l'espressione falsy. Nell'esempio di sotto, `<div>0</div>` verrà ritornato dal metodo render.

```javascript{2,5}
render() {
  const count = 0;
  return (
    <div>
<<<<<<< HEAD
      { count && <h1>Messaggi: {count}</h1>}
=======
      {count && <h1>Messages: {count}</h1>}
>>>>>>> ee7705675d2304c53c174b9fb316e2fbde1e9fb3
    </div>
  );
}
```

### Condizioni If-Else Inline con Operatore Condizionale {#inline-if-else-with-conditional-operator}

Un altro metodo per renderizzare condizionatamente elementi inline è quello di usare l'operatore condizionale JavaScript [`condizione ? true : false`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/Operator_Condizionale).

Nell'esempio di seguito, lo useremo per renderizzare condizionatamente un breve blocco di testo.

```javascript{5}
render() {
  const utenteAutenticato = this.state.utenteAutenticato;
  return (
    <div>
      L'utente è <b>{utenteAutenticato ? 'attualmente' : 'non'}</b> autenticato.
    </div>
  );
}
```

Può essere usato anche per espressioni più lunghe anche se diventa meno ovvio capire cosa sta succedendo:

```js{5,7,9}
render() {
  const utenteAutenticato = this.state.utenteAutenticato;
  return (
    <div>
      {utenteAutenticato ? (
        <BottoneLogout onClick={this.handleLogoutClick} />
      ) : (
        <BottoneLogin onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Proprio come in JavaScript, sta a te scegliere lo stile più appropriato a seconda di cosa tu ed il tuo team ritenete più leggibile. Inoltre, ricorda che se le condizioni diventano troppo complesse, potrebbe essere un segnale del fatto che probabilmente è bene [estrarre un componente](/docs/components-and-props.html#extracting-components).

### Prevenire la Renderizzazione di un Componente {#preventing-component-from-rendering}

In alcuni rari casi potresti volere che un componente sia nascosto anche se viene renderizzato da un altro componente. Per ottenere questo risultato devi ritornare `null` al posto del suo output di renderizzazione.

Nell'esempio di seguito, il componente `<MessaggioAvviso />` viene renderizzato a seconda del valore della prop chiamata `attenzione`. Se il valore della prop è `false`, il componente non viene renderizzato:

```javascript{2-4,28}
function MessaggioAvviso(props) {
  if (!props.attenzione) {
    return null;
  }

  return <div className="warning">Attenzione!</div>;
}

class Pagina extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mostraAvviso: true};
    this.handleToggleClick = this.handleToggleClick.bind(
      this
    );
  }

  handleToggleClick() {
    this.setState(state => ({
      mostraAvviso: !state.mostraAvviso,
    }));
  }

  render() {
    return (
      <div>
        <MessaggioAvviso
          attenzione={this.state.mostraAvviso}
        />
        <button onClick={this.handleToggleClick}>
          {this.state.mostraAvviso ? 'Nascondi' : 'Mostra'}
        </button>
      </div>
    );
  }
}

<<<<<<< HEAD
ReactDOM.render(
  <Pagina />,
  document.getElementById('root')
);

=======
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<Page />);
>>>>>>> ee7705675d2304c53c174b9fb316e2fbde1e9fb3
```
[](codepen://conditional-rendering/4)

Ritornando `null` dal metodo `render` di un componente, non modifica il comportamento dei metodi di lifecycle del componente. Ad esempio `componentDidUpdate` viene ancora chiamato.
