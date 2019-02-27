---
id: forms
title: Forms
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

Gli elementi HTML `form` funzionano in un modo un po' differente rispetto agli altri elementi DOM in React, la motivazione sta nel fatto che gli elementi form mantengono naturalmente uno stato interno. Ad esempio, questo form in puro HTML accetta un singolo nome:

```html
<form>
  <label>
    Nome:
    <input type="text" name="nome" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

La sottomissione di questo form porta l'utente in una nuova pagina, questo è il comportamento di _default_ (di fabbrica). In React, se vuoi avere lo stesso comportamento, funziona. Ad ogni modo, potrebbe essere più conveniente avere una funzione JavaScript che gestisce la sottomissione del form e che ha accesso ai dati inseriti dall'utente. La tecnica standard con cui si può ottenere ciò prende il nome di "componenti controllati".

## Componenti Controllati {#controlled-components}

In HTML, gli eleenti di un form come `<input>`, `<textarea>` e `<select>` mantengono tipicamente il proprio stato e lo aggiornano in base all'input dell'utente. In React, lo stato mutabile viene tipicamente mantenuto nella proprietà `state` dei componenti eviene poi aggiornato solo mediante [`setState()`](/docs/react-component.html#setstate).

Possiamo combinare le due cose rendendo lo _state_ in React la "singola fonte attendibile" ([SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth)). Possiamo poi fare in modo che il componente React che renderizza il form controlli anche cosa succede all'interno del form in risposta agli input dell'utente. Un elemento di input in un form, il quale valore è controllato da React viene così chiamato "componente controllato".

Ad esempio, se vogliiamo far si che l'esempio precedente registri il nome inserito, possiamo riscrivere il form sotto forma di componente controllato:

```javascript{4,10-12,24}
class FormNome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('E\' stato inserito un nome: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Nome:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

**[Prova su CodeSandbox](codesandbox://forms/1.js)**

Dato che l'attributo `value` viene impostato nel nostro elemento form, il valore visualizzato sarà sempre `this.state.value`, rendendo lo stato in React l'unica fonte dati attendibile. Dato che la funzione `handleChange` viene eseguita ad ogni battitura per aggiornare lo stato di React, il valore visualizzato verrà aggiornato man mano che l'utente preme i tasti.

Con un componente controllato, ogni mutazione dello stato deve aver associata una funzione _handler_. Tutto ciò rende il processo di modifica e la validazione dell'input dell'utente semplice e lineare. Ad esempio, se volessimo definire una regola che vuole che i nomi vengano sempre scritti tutti in maiuscolo, possiamo definire `handleChange` così:

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## Il Tag Textarea {#the-textarea-tag}

In HTML, l'elemento `<textarea>` definisce il testo in esso contenuto con i suoi elementi figli:

```html
<textarea>
  Nel mezzo del cammin di nostra vita
  mi ritrovai per una selva oscura
  ché la diritta via era smarrita.
</textarea>
```

In React, invece, `<textarea>` utilizza l'attributo `value`. Per questo, un form che utilizza una `<textarea>` può essere scritto in modo molto simile a come verrebbe scritto se utilizzasse un semplice input di una sola riga:

```javascript{4-6,12-14,26}
class FormTema extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Per favore scrivi un tema riguardo il tuo elemento DOM preferito.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Un tema è stato sottomesso: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Tema:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

Nota come `this.state.value` viene inizializzato nel costruttore, cosìcche la casella di testo è inizializzata con del testo al suo interno.

## Il Tag Select {#the-select-tag}

In HTML, `<select>` crea una lista a discesa. Per esempio, questo HTML crea una lista a discesa di gusti:

```html
<select>
  <option value="pompelmo">Pompelmo</option>
  <option value="limone">Limone</option>
  <option selected value="cocco">Cocco</option>
  <option value="mango">Mango</option>
</select>
```

Nota come l'opzione Cocco venga preselezionata grazie all'attributo `selected`. React, piuttosto che usare l'attributo `selected`, usa l'attributo `value` dell'elemento radice `select`. Ciò facilita le cose in un componente controllato in quanto bisogna aggiornare lo stato in un posto solo. Ad esempio:

```javascript{4,10-12,24}
class FormGusti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Il tuo gusto preferito è: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Seleziona il tuo gusto preferito:
          <select
            value={this.state.value}
            onChange={this.handleChange}>
            <option value="pompelmo">Pompelmo</option>
            <option value="limone">Limone</option>
            <option value="cocco">Cocco</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

**[Prova su CodeSandbox](codesandbox://forms/2.js)**

Ricapitolando, ciò fa si che `<input type="text">`, `<textarea>` e `<select>` funzionino in modo molto simile - tutti accettano un attributo `value` che puoi utilizzare per implementare un componente controllato.

> **Nota bene**
>
> Puoi passare un array nell'attributo `value`, permettendoti di selezionare opzioni multiple in un tag `select`:
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## Il Tag Input File {#the-file-input-tag}

In HTML, un `<input type="file">` permette all'utente di selezionare uno o più file da disco e di inviarli al server o manipolarli in JavaScript mediante le [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Dato che il suo valore è sola-lettura, è un componente **non controllato** in React. Riprenderemo il discorso riguardo questo ed altri componenti non controllati [in seguito](/docs/uncontrolled-components.html#the-file-input-tag).

## Gestione di Input Multipli {#handling-multiple-inputs}

Quando devi gestire diversi elementi `input`, puoi aggiungere un attributo `name` ad ognuno di essi e far si che la funzione handler controlli cosa fare in base al valore di `event.target.name`.

Ad esempio:

```javascript{20,23,33,43}
class Prenotazione extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      presente: true,
      numeroOspiti: 2,
    };

    this.handleInputChange = this.handleInputChange.bind(
      this
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value =
      target.type === 'checkbox'
        ? target.checked
        : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <form>
        <label>
          Sarà presente:
          <input
            name="presente"
            type="checkbox"
            checked={this.state.presente}
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <label>
          Numero di ospiti:
          <input
            name="numeroOspiti"
            type="number"
            value={this.state.numeroOspiti}
            onChange={this.handleInputChange}
          />
        </label>
      </form>
    );
  }
}
```

**[Prova su CodeSandbox](codesandbox://forms/3.js)**

Nota come abbiamo utilizzato la sintassi ES6 [_computed property name_ ("nome proprietà calcolato")](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) per aggiornare la rispettiva chiave nello stato a seconda dell'attributo `name` dell'input:

```js{2}
this.setState({
  [name]: value
});
```

Che in ES5 corrisponde al codice:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Inoltre, dato che `setState()` [unisce uno stato parziale nello stato corrente](/docs/state-and-lifecycle.html#state-updates-are-merged) automaticamente, dobbiamo chiamarla con le sole parti modificate.

## Controlled Input Null Value {#controlled-input-null-value}

Specifying the value prop on a [controlled component](/docs/forms.html#controlled-components) prevents the user from changing the input unless you desire so. If you've specified a `value` but the input is still editable, you may have accidentally set `value` to `undefined` or `null`.

The following code demonstrates this. (The input is locked at first but becomes editable after a short delay.)

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Alternatives to Controlled Components {#alternatives-to-controlled-components}

It can sometimes be tedious to use controlled components, because you need to write an event handler for every way your data can change and pipe all of the input state through a React component. This can become particularly annoying when you are converting a preexisting codebase to React, or integrating a React application with a non-React library. In these situations, you might want to check out [uncontrolled components](/docs/uncontrolled-components.html), an alternative technique for implementing input forms.

## Fully-Fledged Solutions {#fully-fledged-solutions}

If you're looking for a complete solution including validation, keeping track of the visited fields, and handling form submission, [Formik](https://jaredpalmer.com/formik) is one of the popular choices. However, it is built on the same principles of controlled components and managing state — so don't neglect to learn them.
