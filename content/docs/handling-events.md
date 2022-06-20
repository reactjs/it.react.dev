---
id: handling-events
title: Gestione degli Eventi
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

La gestione degli eventi negli elementi React è molto simile alla gestione degli eventi negli elementi DOM. Vi sono alcune differenze sintattiche:

* Gli eventi React vengono dichiarati utilizzando camelCase, anziché in minuscolo.
* In JSX, il gestore di eventi (_event handler_) viene passato come funzione, piuttosto che stringa.

Per esempio, l'HTML:

```html
<button onclick="attivaLasers()">
  Attiva Lasers
</button>
```

è leggermente diverso in React:

```js{1}
<button onClick={attivaLasers}>
  Attiva Lasers
</button>
```

Un'altra differenza è che, in React, non è possibile ritornare `false` per impedire il comportamento predefinito. Devi chiamare `preventDefault` esplicitamente. Ad esempio, in un semplice codice HTML per impedire il comportamento predefinito del form nel submit, potresti scrivere:

```html
<form onsubmit="console.log('Hai cliccato Invia.'); return false">
  <button type="submit">Invia</button>
</form>
```

In React, invece sarebbe:

```js{3}
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('Hai cliccato Invia.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Invia</button>
    </form>
  );
}
```

In questo esempio, il parametro `e` è un evento sintetico (_synthetic event_). React definisce questi eventi sintetici in base alle [specifiche W3C](https://www.w3.org/TR/DOM-Level-3-Events/), quindi non hai bisogno di preoccuparti della compatibilità tra browser. Gli eventi React non funzionano esattamente allo stesso modo degli eventi nativi. Consulta la guida di riferimento [`SyntheticEvent`](/docs/events.html) per saperne di più.

Usando React, in generale, non dovresti aver bisogno di chiamare `addEventListener` per aggiungere listeners ad un elemento DOM dopo la sua creazione. Invece, basta fornire un listener quando l'elemento è inizialmente renderizzato.

Quando definisci un componente usando una [classe ES6](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes), un pattern comune è usare un metodo della classe come gestore di eventi. Ad esempio, questo componente `Interruttore` renderizza un pulsante che consente all'utente di alternare gli stati "Acceso" e "Spento":

```js{6,7,10-14,18}
class Interruttore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {acceso: true};

    // Necessario per accedere al corretto valore di `this` all'interno della callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      acceso: !prevState.acceso
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.acceso ? 'Acceso' : 'Spento'}
      </button>
    );
  }
}
<<<<<<< HEAD

ReactDOM.render(
  <Interruttore />,
  document.getElementById('root')
);
=======
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
```

**[Prova su CodeSandbox](codesandbox://handling-events/1.js)**

Fai attenzione al valore di `this` nelle callback JSX. In JavaScript, i metodi delle classi non sono [associati](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_objects/Function/bind) (_bound_) di default. Se dimentichi di applicare `bind` a `this.handleClick` e di passarlo a `onClick`, `this` sarà `undefined` quando la funzione verrà effettivamente chiamata.

Questo non è un comportamento specifico in React: è parte di [come funzionano le funzioni in JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). In generale, se ti riferisci ad un metodo senza `()` dopo di esso, per esempio `onClick = {this.handleClick}`, potresti aver bisogno di applicare `bind` a quel metodo.

Se usare la chiamata al metodo `bind` ti sembra troppo, ci sono due alternative a disposizione. Puoi usare la sintassi sperimentale [proprietà pubbliche delle classi](https://babeljs.io/docs/plugins/transform-class-properties/), utilizzando le proprietà delle classi per associare correttamente le callback:

```js{2-6}
class LoggingButton extends React.Component {
  // Garantisce che `this` si riferisca all'oggetto originale all'interno di handleClick.
  // Attenzione: questa è sintassi *sperimentale*.
  handleClick = () => {
    console.log('Il valore di `this` è: ', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Clicca qui
      </button>
    );
  }
}
```

Questa sintassi è abilitata nelle impostazioni predefinite di [Create React App](https://github.com/facebookincubator/create-react-app).

Se non stai usando la sintassi delle proprietà delle classi, è possibile utilizzare una [funzione a freccia](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Functions/Arrow_functions) all'interno della callback:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('Il valore di `this` è: ', this);
  }

  render() {
    // Questa sintassi garantisce che `this` sia associato correttamente all'interno di handleClick
    return (
      <button onClick={() => this.handleClick()}>
        Clicca qui
      </button>
    );
  }
}
```

Il problema con questa sintassi è che viene creata una callback diversa ogni volta che `LoggingButton` viene renderizzato. Nella maggior parte dei casi, non vi sono problemi. Tuttavia, se questa callback viene passata come prop a componenti inferiori, tali componenti potrebbero eseguire un ulteriore re-renderizzamento. In generale, vi consigliamo di utilizzare `bind` nel costruttore o la sintassi delle proprietà pubbliche nelle classi, per evitare questo tipo di problema di prestazioni.

## Passare Argomenti ai Gestori di Eventi {#passing-arguments-to-event-handlers}

All'interno di un ciclo, è comune avere l'esigenza di passare un parametro aggiuntivo ad un gestore di eventi. Ad esempio, avendo `id` come l'identificativo della riga, le seguenti dichiarazioni sarebbero entrambe valide:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Elimina riga</button>
<button onClick={this.deleteRow.bind(this, id)}>Elimina riga</button>
```

Le due linee di codice precedenti sono equivalenti e utilizzano le [funzioni a freccia](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Functions_and_function_scope/Arrow_functions) e [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) rispettivamente.

In entrambi i casi, l'argomento `e`, che rappresenta l'evento React, verrà passato come secondo argomento dopo l'ID. Con la funzione a freccia, devi passarlo esplicitamente, mentre con `bind` qualsiasi altro argomento viene passato automaticamente.
