---
id: lifting-state-up
title: Spostare lo stato
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Spesso, l'aggiornamento di diversi componenti dipende dagli stessi dati. Raccomandiamo di spostare lo stato condiviso in alto nella gerarchia fino al loro antenato più vicino. Vediamo come questo avviene in pratica.

In questa sezione creeremo un calcolatore della temperatura che calcola se l'acqua bolle ad una data temperatura.

Iniziamo con un componente chiamato `VerdettoEbollizione`. Questo, accetta la temperatura tramite la prop `celsius` e ritorna che sia sufficiente a far bollire l'acqua o no:

```js{3,5}
function VerdettoEbollizione(props) {
  if (props.celsius >= 100) {
    return <p>L'acqua bollirebbe.</p>;
  }
  return <p>L'acqua non bollirebbe.</p>;
}
```

Successivamente, creiamo un componente chiamato `Calcolatore`. Esso renderizza un `<input>` che permette di inserire la temperatura e mantiene il suo valore in `this.state.temperatura`.

Inoltre, restituisce `VerdettoEbollizione` per il valore di input corrente.

```js{5,9,13,17-21}
class Calcolatore extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperatura: ''};
  }

  handleChange(e) {
    this.setState({temperatura: e.target.value});
  }

  render() {
    const temperatura = this.state.temperatura;
    return (
      <fieldset>
        <legend>Inserisci la temperatura in gradi Celsius:</legend>
        <input
          value={temperatura}
          onChange={this.handleChange} />
        <VerdettoEbollizione
          celsius={parseFloat(temperatura)} />
      </fieldset>
    );
  }
}
```

**[Prova su CodeSandbox](codesandbox://lifting-state-up/1.js)**

## Aggiunta di un secondo input {#adding-a-second-input}

Il nostro nuovo requisito è che, oltre a un input in gradi Celsius, forniamo un input in gradi Fahrenheit e l'aggiornamento dei due deve essere sincronizzato.

Possiamo iniziare estraendo un componente `InputTemperatura` da `Calcolatore`. Aggiungiamo una nuova prop `scala` ad esso che può essere `"c"` o `"f"`:

```js{1-4,19,22}
const scale = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class InputTemperatura extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperatura: ''};
  }

  handleChange(e) {
    this.setState({temperatura: e.target.value});
  }

  render() {
    const temperatura = this.state.temperatura;
    const scala = this.props.scala;
    return (
      <fieldset>
        <legend>Inserisci la temperatura in gradi {scale[scala]}:</legend>
        <input value={temperatura}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Ora possiamo cambiare il `Calcolatore` per renderizzare due input di temperatura separati:

```js{5,6}
class Calcolatore extends React.Component {
  render() {
    return (
      <div>
        <InputTemperatura scala="c" />
        <InputTemperatura scala="f" />
      </div>
    );
  }
}
```

**[Prova su CodeSandbox](codesandbox://lifting-state-up/2.js)**

Ora abbiamo due input, ma quando si inserisce la temperatura in uno di essi, l'altro non si aggiorna. Questo non soddisfa il nostro requisito: vogliamo mantenerli sincronizzati.

Inoltre, non possiamo mostrare `VerdettoEbollizione` da `Calcolatore`. Il `Calcolatore` non conosce la temperatura corrente perché è nascosta all'interno di `InputTemperatura`.

## Scrittura Delle Funzioni Di Conversione {#writing-conversion-functions}

Innanzitutto, scriviamo due funzioni per convertire da Celsius a Fahrenheit e viceversa:

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Queste due funzioni convertono i numeri. Scriviamo un'altra funzione che accetta come argomenti una stringa `temperatura` e una funzione `converti`, e restituisce una stringa. La useremo per calcolare il valore di un input basato su un altro.

La funzione restituisce una stringa vuota per una `temperatura` non valida e arrotonda l'output alla terza cifra decimale:

```js
function conversione(temperatura, converti) {
  const input = parseFloat(temperatura);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = converti(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

Ad esempio, `conversione('abc', toCelsius)` restituisce una stringa vuota, e `conversione('10 .22', toFahrenheit)` restituisce `'50.396'`.

## Spostare lo stato "in alto" {#lifting-state-up}

Attualmente, entrambi i componenti `InputTemperatura` mantengono in modo indipendente i loro valori nello stato locale:

```js{5,9,13}
class InputTemperatura extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperatura: ''};
  }

  handleChange(e) {
    this.setState({temperatura: e.target.value});
  }

  render() {
    const temperatura = this.state.temperatura;
    // ...  
```

Tuttavia, vogliamo che i valori di questi due input siano sincronizzati tra loro. Quando aggiorniamo l'input Celsius, l'input Fahrenheit dovrebbe aggiornare la temperatura convertita e viceversa.

In React, la condivisione dello stato si ottiene spostandolo verso il più vicino antenato comune dei componenti che ne hanno bisogno. Questo processo viene detto "spostare lo stato verso l'alto" (_lifting state up_). Rimuoviamo lo stato locale da `InputTemperatura` e invece lo spostiamo nel `Calcolatore`.

Se il `Calcolatore` possiede lo stato condiviso, diventa la "unica fonte di verità" per la temperatura corrente in entrambi gli input. Può istruire entrambi ad avere valori coerenti l'uno con l'altro. Poiché le props di entrambi i componenti `InputTemperatura` provengono dallo stesso componente `Calcolatore` padre, i due input saranno sempre sincronizzati.

Vediamo come funziona passo dopo passo.

Per prima cosa sostituiremo `this.state.temperatura` con `this.props.temperatura` nel componente `InputTemperatura`. Per ora, facciamo finta che `this.props.temperatura` esista già, anche se dovremo successivamente passarla dal `Calcolatore`:

```js{3}
  render() {
    // Prima: const temperatura = this.state.temperatura;
    const temperatura = this.props.temperatura;
    // ...
```

Sappiamo già che [le props sono in sola lettura](/docs/components-and-props.html#props-are-read-only). Quando `temperatura` era nello stato locale, `InputTemperatura` poteva semplicemente chiamare `this.setState()` per cambiarla. Tuttavia, ora che la `temperatura` viene come prop dal componente genitore, `InputTemperatura` non ha alcun controllo su di esso.

In React, questo è solitamente risolto rendendo un componente "controllato". Proprio come nel DOM, `<input>` accetta sia una prop `value` che una prop `onChange`, quindi il componente personalizzato `InputTemperatura` accetta sia la prop `temperatura` che `onChangeTemperatura` dal suo `Calcolatore` padre.

Ora, quando `InputTemperatura` vuole aggiornare la sua temperatura, chiama `this.props.onChangeTemperatura`:

```js{3}
  handleChange(e) {
    // Prima: this.setState({temperatura: e.target.value});
    this.props.onChangeTemperatura(e.target.value);
    // ...
```

> Nota:
>
> Non vi è alcun significato speciale nei nomi delle props `temperatura` o `onChangeTemperatura` nei componenti personalizzati. Avremmo potuto chiamarle in qualsiasi altro modo, come chiamarle `value` e `onChange`, come da convenzione comune.

La prop `onChangeTemperatura` viene fornita insieme alla prop `temperatura` dal componente padre `Calcolatore`. Gestirà i cambiamenti nel proprio stato locale, ri-renderizzando poi gli input con i nuovi valori. A breve, vedremo la nuova implementazione di `Calcolatore`.

Prima di immergerti nei cambiamenti del `Calcolatore`, ricapitoliamo le modifiche al componente `InputTemperatura`. Abbiamo rimosso lo stato locale e invece di leggere `this.state.temperatura`, ora leggiamo `this.props.temperatura`. Invece di chiamare `this.setState()` quando vogliamo apportare una modifica, ora chiamiamo `this.props.onChangeTemperatura()`, che sarà fornita dal `Calcolatore`:

```js{8,12}
class InputTemperatura extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChangeTemperatura(e.target.value);
  }

  render() {
    const temperatura = this.props.temperatura;
    const scala = this.props.scala;
    return (
      <fieldset>
        <legend>Inserisci la temperatura in {scale[scala]}:</legend>
        <input value={temperatura}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Ora passiamo al componente `Calcolatore`.

Memorizzeremo `temperatura` e `scale` dall'input corrente nel suo stato locale. Questo è lo stato che abbiamo "spostato su" dagli input, e servirà da "unica fonte di verità" per entrambi. È la rappresentazione minima di tutti i dati di cui dobbiamo essere a conoscenza per renderizzare entrambi gli input.

Ad esempio, se inseriamo 37 nell'input Celsius, lo stato del componente `Calcolatore` è:

```js
{
  temperatura: '37',
  scala: 'c'
}
```

Se in seguito modifichiamo il campo in Fahrenheit come 212, lo stato del `Calcolatore` è:

```js
{
  temperatura: '212',
  scala: 'f'
}
```

Avremmo potuto memorizzare il valore di entrambi gli input, ma non è necessario. È sufficiente memorizzare il valore dell'input modificato più recentemente e la scala che rappresenta. Possiamo quindi dedurre il valore dell'altro input basato sulle sole `temperatura` e `scala` correnti.

Gli input rimangono sincronizzati perché i loro valori sono calcolati dallo stesso stato:

```js{6,10,14,18-21,27-28,31-32,34}
class Calcolatore extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeCelsius = this.handleChangeCelsius.bind(this);
    this.handleChangeFahrenheit = this.handleChangeFahrenheit.bind(this);
    this.state = {temperatura: '', scala: 'c'};
  }

  handleChangeCelsius(temperatura) {
    this.setState({scala: 'c', temperatura});
  }

  handleChangeFahrenheit(temperatura) {
    this.setState({scala: 'f', temperatura});
  }

  render() {
    const scala = this.state.scala;
    const temperatura = this.state.temperatura;
    const celsius = scala === 'f' ? conversione(temperatura, toCelsius) : temperatura;
    const fahrenheit = scala === 'c' ? conversione(temperatura, toFahrenheit) : temperatura;

    return (
      <div>
        <InputTemperatura
          scala="c"
          temperatura={celsius}
          onChangeTemperatura={this.handleChangeCelsius} />
        <InputTemperatura
          scala="f"
          temperatura={fahrenheit}
          onChangeTemperatura={this.handleChangeFahrenheit} />
        <VerdettoEbollizione
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

**[Prova su CodeSandbox](codesandbox://lifting-state-up/3.js)**

Ora `this.state.temperatura` e `this.state.scala` in `Calcolatore` si aggiornano indipendentemente dall'input che si modifica. Uno degli input ottiene il valore così com'è, quindi qualsiasi input dell'utente viene mantenuto e l'altro valore di input viene sempre ricalcolato in base ad esso.

Ricapitoliamo cosa succede quando modifichi un input:

* React chiama la funzione specificata come `onChange` sul DOM `<input> `. Nel nostro caso, questo è il metodo `handleChange` nel componente `InputTemperatura`.
* Il metodo `handleChange` nel componente `InputTemperatura` chiama `this.props.onChangeTemperatura()` con il nuovo valore desiderato. Le sue props, tra cui `onChangeTemperatura`, sono fornite dal suo componente principale, il `Calcolatore`.
* Quando il `Calcolatore` renderizza, esso determina che `onChangeTemperatura` del `InputTemperatura` in Celsius sia il metodo `handleChangeCelsius` di `Calcolatore`, e `onChangeTemperatura` del `InputTemperatura` in Fahrenheit sia il metodo `handleChangeFahrenheit` di `Calcolatore`. Quindi uno di questi due metodi `Calcolatore` viene chiamato a seconda di quale input viene modificato.
* All'interno di questi metodi, il componente `Calcolatore` chiede a React di eseguire nuovamente la renderizzazione chiamando` this.setState()` con il nuovo valore inserito e la scala attuale dell'input appena modificato.
* React chiama il metodo `render` del componente `Calcolatore` per sapere come l'interfaccia utente dovrebbe apparire. I valori di entrambi gli input vengono ricalcolati in base alla temperatura corrente e alla scala attiva. La conversione della temperatura viene eseguita qui.
* React chiama i metodi `render` dei singoli componenti `InputTemperatura` con le nuove props passate dal `Calcolatore`. Vengono a conoscenza di come dovrebbe essere la loro UI.
* React chiama il metodo `render` del componente `VerdettoEbollizione`, passando la temperatura in Celsius come sue props.
* React DOM aggiorna il DOM con il verdetto di ebollizione e abbina i valori di input desiderati. L'input appena modificato riceve il suo valore corrente e l'altro input viene aggiornato con la temperatura dopo la conversione.

Ogni aggiornamento passa attraverso gli stessi passaggi in modo che gli input rimangano sincronizzati.

## Lezioni Apprese {#lessons-learned}

Tutti i dati che cambiano in un'applicazione React dovrebbero avere una "unica fonte di verità". Di solito, lo stato viene prima aggiunto al componente che ne ha bisogno per il rendering. Quindi, se anche altri componenti ne hanno bisogno, puoi spostarlo fino al loro antenato più vicino. Invece di provare a sincronizzare lo stato tra diversi componenti, dovresti affidarti sul [flusso di dati top-down](/docs/state-and-lifecycle.html#the-data-flows-down).

Spostare lo stato in alto nella gerarchia implica la scrittura di un codice più "standard" rispetto all'approccio _two-way binding_ (a doppio senso), ma come vantaggio, trovare e isolare i bug risulta meno laborioso. Poiché ogni stato "vive" in alcuni componenti e solo quel componente può cambiarlo, la fonte di bugs viene notevolmente ridotta. Inoltre, è possibile implementare qualsiasi logica personalizzata per validare o trasformare l'input dell'utente.

Se qualcosa può essere derivato da props o stato, probabilmente non dovrebbe essere nello stato. Ad esempio, invece di memorizzare sia `valoreCelsius` che `valoreFahrenheit`, memorizziamo solo l'ultima `temperatura` modificata e la sua `scala`. Il valore dell'altro input può sempre essere calcolato da loro nel metodo `render()`. Questo ci consente di cancellare o applicare l'arrotondamento all'altro campo senza perdere precisione nell'input dell'utente.

<<<<<<< HEAD
Quando vedi qualcosa di sbagliato nell'interfaccia utente, puoi utilizzare [React Developer Tools](https://github.com/facebook/react/tree/master/packages/react-devtools) per ispezionare le props e spostarti nell'albero finché non si trova il componente responsabile dell'aggiornamento dello stato. Questo ti permette di tracciare i bug alla loro fonte:
=======
When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">
