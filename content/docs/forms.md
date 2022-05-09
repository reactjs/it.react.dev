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

Gli elementi HTML `form` funzionano in un modo differente rispetto agli altri elementi DOM in React, la motivazione sta nel fatto che gli elementi form mantengono naturalmente uno stato interno. Ad esempio, questo form in puro HTML accetta un singolo nome:

```html
<form>
  <label>
    Nome:
    <input type="text" name="nome" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

Questo form si comporta come di consueto, facendo navigare l'utente in una nuova pagina quando viene inviato. In React, se vuoi avere lo stesso comportamento, non c'è bisogno di fare alcuna modifica. Ad ogni modo, potrebbe essere più conveniente avere una funzione JavaScript che gestisce l'invio del form e che ha accesso ai dati inseriti dall'utente. La tecnica standard con cui si può ottenere ciò prende il nome di "componenti controllati".

## Componenti Controllati {#controlled-components}

In HTML, gli elementi di un form come `<input>`, `<textarea>` e `<select>` mantengono tipicamente il proprio stato e lo aggiornano in base all'input dell'utente. In React, lo stato mutabile viene tipicamente mantenuto nella proprietà `state` dei componenti e viene poi aggiornato solo mediante [`setState()`](/docs/react-component.html#setstate).

Possiamo combinare le due cose rendendo lo _state_ in React la "singola fonte attendibile" ([SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth)). Possiamo poi fare in modo che il componente React che renderizza il form controlli anche cosa succede all'interno del form in risposta agli input dell'utente. In un form, un elemento di input il cui valore è controllato da React in questo modo viene chiamato "componente controllato".

Ad esempio, se vogliamo far sì che l'esempio precedente registri il nome inserito, possiamo riscrivere il form sotto forma di componente controllato:

```javascript{4,10-12,21,24}
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

Dato che l'attributo `value` viene impostato nel nostro elemento form, il valore visualizzato sarà sempre `this.state.value`, rendendo lo stato in React l'unica fonte di dati attendibile. Dato che la funzione `handleChange` viene eseguita ad ogni battitura per aggiornare lo stato di React, il valore visualizzato verrà aggiornato man mano che l'utente preme i tasti.

Con un componente controllato, il valore dell'input viene sempre controllato dallo stato di React. Anche se ciò comporta la battitura di più codice, permette il passaggio del valore anche ad altri elementi della UI, o di resettarlo da altri _event handlers_.

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
    alert('Un tema è stato inviato: ' + this.state.value);
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
    this.state = {value: 'cocco'};

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

Ricapitolando, ciò fa sì che `<input type="text">`, `<textarea>` e `<select>` funzionino in modo molto simile - tutti accettano un attributo `value` che puoi utilizzare per implementare un componente controllato.

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

Dato che il suo valore è in sola-lettura, è un componente **non controllato** in React. Riprenderemo il discorso riguardo questo ed altri componenti non controllati [in seguito](/docs/uncontrolled-components.html#the-file-input-tag).

## Gestione di Input Multipli {#handling-multiple-inputs}

Quando devi gestire diversi elementi `input`, puoi aggiungere un attributo `name` ad ognuno di essi e far sì che la funzione handler controlli cosa fare in base al valore di `event.target.name`.

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
    const value = target.type === 'checkbox' ? target.checked : target.value;
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

Il che in ES5 corrisponde al codice:

```js{2}
var statoParziale = {};
statoParziale[name] = value;
this.setState(statoParziale);
```

Inoltre, dato che `setState()` [unisce uno stato parziale nello stato corrente](/docs/state-and-lifecycle.html#state-updates-are-merged) automaticamente, dobbiamo chiamarla con le sole parti modificate.

## Valore Null in Input Controllati {#controlled-input-null-value}

Specificare la prop `value` in un [componente controllato](/docs/forms.html#controlled-components) fa sì che l'utente possa cambiare l'input solo quando lo desideri. Se hai specificato un `value` ma l'input è ancora editabile, potresti aver accidentalmente impostato `value` come `undefined` o `null`.

Il codice seguente lo dimostra. (L'input è inizialmente bloccato ma diventa editabile dopo un secondo)

```javascript
<<<<<<< HEAD
ReactDOM.render(<input value="ciao" />, mountNode);
=======
ReactDOM.createRoot(mountNode).render(<input value="hi" />);
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

setTimeout(function() {
  ReactDOM.createRoot(mountNode).render(<input value={null} />);
}, 1000);

```

## Alternative ai Componenti Controllati {#alternatives-to-controlled-components}

Utilizzare componenti controllati può sembrare laborioso a volte, soprattutto perché è necessario scrivere un _event handler_ per ogni modo in cui i tuoi dati possono cambiare e perché si deve collegare lo stato di tutti gli input a quello di un componente React. Il tutto diventa particolarmente noioso quando bisogna convertire progetti preesistenti in React, o integrare un'applicazione React con una libreria non-React. In queste situazioni, si potrebbe ricorrere ai [componenti non controllati](/docs/uncontrolled-components.html), una tecnica alternativa per implementare forms ed i relativi campi di input.

## Soluzioni Chiavi In Mano {#fully-fledged-solutions}

Se stai cercando una soluzione che include la validazione dei dati, il tener traccia dei campi visitati e la sottomissione del form, [Formik](https://jaredpalmer.com/formik) è una delle scelte popolari. Comunque, si basa sugli stessi principi dei componenti controllati e della gestione dello stato — ecco perché è bene essere familiari con questi concetti.
