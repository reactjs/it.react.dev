---
title: Component
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/Component.md).

</Note>

<Pitfall>

Consigliamo di definire i componenti come funzioni invece che come classi. [Vedi come migrare.](#alternatives)

</Pitfall>

<Intro>

`Component` è la classe base per i componenti React definiti come [classi JavaScript.](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes) I componenti classe sono ancora supportati da React, ma non consigliamo di usarli nel codice nuovo.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `Component` {/*component*/}

Per definire un componente React come classe, estendi la classe integrata `Component` e definisci un [`metodo render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Solo il metodo `render` è obbligatorio; gli altri metodi sono opzionali.

[Vedi altri esempi sotto.](#usage)

---

### `context` {/*context*/}

Il [context](/learn/passing-data-deeply-with-context) di un componente classe è disponibile come `this.context`. È disponibile solo se specifichi *quale* context vuoi ricevere usando [`static contextType`](#static-contexttype).

Un componente classe può leggere un solo context alla volta.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

Leggere `this.context` nei componenti classe equivale a [`useContext`](/reference/react/useContext) nei componenti funzione.

[Vedi come migrare.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

Le props passate a un componente classe sono disponibili come `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

Leggere `this.props` nei componenti classe equivale a [dichiarare le props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) nei componenti funzione.

[Vedi come migrare.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `state` {/*state*/}

Lo state di un componente classe è disponibile come `this.state`. Il campo `state` deve essere un oggetto. Non mutare lo state direttamente. Se vuoi cambiare lo state, chiama `setState` con il nuovo state.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Incrementa età
        </button>
        <p>Hai {this.state.age} anni.</p>
      </>
    );
  }
}
```

<Note>

Definire `state` nei componenti classe equivale a chiamare [`useState`](/reference/react/useState) nei componenti funzione.

[Vedi come migrare.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

Il [constructor](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes/constructor) viene eseguito prima che il tuo componente classe venga *montato* (aggiunto allo schermo). Di solito, in React un constructor serve solo a due scopi: ti permette di dichiarare lo state e di [associare](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) i metodi della classe all'istanza:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

Se usi la sintassi JavaScript moderna, i constructor sono raramente necessari. Puoi invece riscrivere il codice sopra usando la [sintassi dei campi pubblici di classe](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes/Public_class_fields), supportata sia dai browser moderni sia da strumenti come [Babel:](https://babeljs.io/)

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

Un constructor non dovrebbe contenere effetti collaterali o sottoscrizioni.

#### Parameters {/*constructor-parameters*/}

* `props`: Le props iniziali del componente.

#### Returns {/*constructor-returns*/}

`constructor` non dovrebbe restituire nulla.

#### Caveats {/*constructor-caveats*/}

* Non eseguire effetti collaterali o sottoscrizioni nel constructor. Usa invece [`componentDidMount`](#componentdidmount) per questo.

* All'interno di un constructor, devi chiamare `super(props)` prima di qualsiasi altra istruzione. Se non lo fai, `this.props` sarà `undefined` mentre il constructor è in esecuzione, il che può creare confusione e bug.

* Il constructor è l'unico punto in cui puoi assegnare [`this.state`](#state) direttamente. In tutti gli altri metodi devi usare [`this.setState()`](#setstate). Non chiamare `setState` nel constructor.

* Quando usi la [renderizzazione lato server,](/reference/react-dom/server) il constructor viene eseguito anche sul server, seguito dal metodo [`render`](#render). Tuttavia, metodi del lifecycle come `componentDidMount` o `componentWillUnmount` non vengono eseguiti sul server.

* Quando [Strict Mode](/reference/react/StrictMode) è attivo, React chiamerà `constructor` due volte in sviluppo e poi scarterà una delle istanze. Questo ti aiuta a notare gli effetti collaterali accidentali che devono essere spostati fuori dal `constructor`.

<Note>

Non esiste un equivalente esatto di `constructor` nei componenti funzione. Per dichiarare lo state in un componente funzione, chiama [`useState`.](/reference/react/useState) Per evitare di ricalcolare lo state iniziale, [passa una funzione a `useState`.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

Se definisci `componentDidCatch`, React lo chiamerà quando un componente figlio (inclusi i discendenti lontani) lancia un errore durante la renderizzazione. Questo ti permette di registrare l'errore in un servizio di segnalazione errori in produzione.

Di solito viene usato insieme a [`static getDerivedStateFromError`](#static-getderivedstatefromerror), che ti permette di aggiornare lo state in risposta a un errore e mostrare un messaggio di errore all'utente. Un componente con questi metodi si chiama *contenitore di errori*.

[Vedi un esempio.](#catching-rendering-errors-with-an-error-boundary)

#### Parameters {/*componentdidcatch-parameters*/}

* `error`: L'errore che è stato lanciato. In pratica, di solito sarà un'istanza di [`Error`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Error), ma non è garantito perché JavaScript permette di [`throw`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Statements/throw) qualsiasi valore, incluse stringhe o persino `null`.

* `info`: Un oggetto che contiene informazioni aggiuntive sull'errore. Il suo campo `componentStack` contiene uno stack trace con il componente che ha lanciato l'errore, nonché i nomi e le posizioni nel sorgente di tutti i suoi componenti genitore. In produzione, i nomi dei componenti saranno minificati. Se configuri la segnalazione errori in produzione, puoi decodificare lo stack dei componenti usando le sourcemap come faresti per gli stack trace JavaScript normali.

#### Returns {/*componentdidcatch-returns*/}

`componentDidCatch` non dovrebbe restituire nulla.

#### Caveats {/*componentdidcatch-caveats*/}

* In passato era comune chiamare `setState` dentro `componentDidCatch` per aggiornare l'UI e mostrare il messaggio di errore di fallback. Questo è deprecato a favore della definizione di [`static getDerivedStateFromError`.](#static-getderivedstatefromerror)

* Le build di produzione e sviluppo di React differiscono leggermente nel modo in cui `componentDidCatch` gestisce gli errori. In sviluppo, gli errori risaliranno fino a `window`, il che significa che qualsiasi `window.onerror` o `window.addEventListener('error', callback)` intercetterà gli errori catturati da `componentDidCatch`. In produzione, invece, gli errori non risaliranno, il che significa che qualsiasi gestore di errori antenato riceverà solo errori non catturati esplicitamente da `componentDidCatch`.

<Note>

Non esiste ancora un equivalente diretto di `componentDidCatch` nei componenti funzione. Se vuoi evitare di creare componenti classe, scrivi un singolo componente `ErrorBoundary` come sopra e usalo in tutta l'app. In alternativa, puoi usare il pacchetto [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) che lo fa per te.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

Se definisci il metodo `componentDidMount`, React lo chiamerà quando il tuo componente viene aggiunto *(montato)* allo schermo. È un punto comune per avviare il fetch dei dati, impostare sottoscrizioni o manipolare i nodi DOM.

Se implementi `componentDidMount`, di solito devi implementare anche altri metodi del lifecycle per evitare bug. Ad esempio, se `componentDidMount` legge dello state o delle props, devi anche implementare [`componentDidUpdate`](#componentdidupdate) per gestirne i cambiamenti e [`componentWillUnmount`](#componentwillunmount) per ripulire ciò che `componentDidMount` stava facendo.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Vedi altri esempi.](#adding-lifecycle-methods-to-a-class-component)

#### Parameters {/*componentdidmount-parameters*/}

`componentDidMount` non accetta parametri.

#### Returns {/*componentdidmount-returns*/}

`componentDidMount` non dovrebbe restituire nulla.

#### Caveats {/*componentdidmount-caveats*/}

- Quando [Strict Mode](/reference/react/StrictMode) è attivo, in sviluppo React chiamerà `componentDidMount`, poi chiamerà immediatamente [`componentWillUnmount`,](#componentwillunmount) e poi chiamerà di nuovo `componentDidMount`. Questo ti aiuta a notare se hai dimenticato di implementare `componentWillUnmount` o se la sua logica non "rispecchia" completamente ciò che fa `componentDidMount`.

- Anche se puoi chiamare [`setState`](#setstate) immediatamente in `componentDidMount`, è meglio evitarlo quando puoi. Avvierà una renderizzazione extra, ma avverrà prima che il browser aggiorni lo schermo. Questo garantisce che, anche se [`render`](#render) verrà chiamato due volte in questo caso, l'utente non vedrà lo state intermedio. Usa questo pattern con cautela perché spesso causa problemi di prestazioni. Nella maggior parte dei casi, dovresti poter assegnare lo state iniziale nel [`constructor`](#constructor). Tuttavia, può essere necessario per casi come modali e tooltip quando devi misurare un nodo DOM prima di renderizzare qualcosa che dipende dalle sue dimensioni o posizione.

<Note>

Per molti casi d'uso, definire `componentDidMount`, `componentDidUpdate` e `componentWillUnmount` insieme nei componenti classe equivale a chiamare [`useEffect`](/reference/react/useEffect) nei componenti funzione. Nei rari casi in cui è importante che il codice venga eseguito prima del paint del browser, [`useLayoutEffect`](/reference/react/useLayoutEffect) è più simile.

[Vedi come migrare.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

Se definisci il metodo `componentDidUpdate`, React lo chiamerà immediatamente dopo che il tuo componente è stato ri-renderizzato con props o state aggiornati. Questo metodo non viene chiamato per la renderizzazione iniziale.

Puoi usarlo per manipolare il DOM dopo un aggiornamento. È anche un punto comune per fare richieste di rete, purché confronti le props attuali con quelle precedenti (ad esempio, una richiesta di rete potrebbe non essere necessaria se le props non sono cambiate). Di solito lo usi insieme a [`componentDidMount`](#componentdidmount) e [`componentWillUnmount`:](#componentwillunmount)

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Vedi altri esempi.](#adding-lifecycle-methods-to-a-class-component)


#### Parameters {/*componentdidupdate-parameters*/}

* `prevProps`: Props prima dell'aggiornamento. Confronta `prevProps` con [`this.props`](#props) per determinare cosa è cambiato.

* `prevState`: State prima dell'aggiornamento. Confronta `prevState` con [`this.state`](#state) per determinare cosa è cambiato.

* `snapshot`: Se hai implementato [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` conterrà il valore restituito da quel metodo. Altrimenti, sarà `undefined`.

#### Returns {/*componentdidupdate-returns*/}

`componentDidUpdate` non dovrebbe restituire nulla.

#### Caveats {/*componentdidupdate-caveats*/}

- `componentDidUpdate` non verrà chiamato se [`shouldComponentUpdate`](#shouldcomponentupdate) è definito e restituisce `false`.

- La logica dentro `componentDidUpdate` dovrebbe di solito essere racchiusa in condizioni che confrontano `this.props` con `prevProps` e `this.state` con `prevState`. Altrimenti c'è il rischio di creare loop infiniti.

- Anche se puoi chiamare [`setState`](#setstate) immediatamente in `componentDidUpdate`, è meglio evitarlo quando puoi. Avvierà una renderizzazione extra, ma avverrà prima che il browser aggiorni lo schermo. Questo garantisce che, anche se [`render`](#render) verrà chiamato due volte in questo caso, l'utente non vedrà lo state intermedio. Questo pattern spesso causa problemi di prestazioni, ma può essere necessario per casi rari come modali e tooltip quando devi misurare un nodo DOM prima di renderizzare qualcosa che dipende dalle sue dimensioni o posizione.

<Note>

Per molti casi d'uso, definire `componentDidMount`, `componentDidUpdate` e `componentWillUnmount` insieme nei componenti classe equivale a chiamare [`useEffect`](/reference/react/useEffect) nei componenti funzione. Nei rari casi in cui è importante che il codice venga eseguito prima del paint del browser, [`useLayoutEffect`](/reference/react/useLayoutEffect) è più simile.

[Vedi come migrare.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

Questa API è stata rinominata da `componentWillMount` a [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) Il vecchio nome è deprecato. In una futura versione major di React, funzionerà solo il nuovo nome.

Esegui il [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) per aggiornare automaticamente i tuoi componenti.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

Questa API è stata rinominata da `componentWillReceiveProps` a [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) Il vecchio nome è deprecato. In una futura versione major di React, funzionerà solo il nuovo nome.

Esegui il [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) per aggiornare automaticamente i tuoi componenti.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

Questa API è stata rinominata da `componentWillUpdate` a [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) Il vecchio nome è deprecato. In una futura versione major di React, funzionerà solo il nuovo nome.

Esegui il [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) per aggiornare automaticamente i tuoi componenti.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

Se definisci il metodo `componentWillUnmount`, React lo chiamerà prima che il tuo componente venga rimosso *(smontato)* dallo schermo. È un punto comune per annullare il fetch dei dati o rimuovere sottoscrizioni.

La logica dentro `componentWillUnmount` dovrebbe "rispecchiare" la logica dentro [`componentDidMount`.](#componentdidmount) Ad esempio, se `componentDidMount` imposta una sottoscrizione, `componentWillUnmount` dovrebbe ripulire quella sottoscrizione. Se la logica di cleanup in `componentWillUnmount` legge delle props o dello state, di solito dovrai anche implementare [`componentDidUpdate`](#componentdidupdate) per ripulire le risorse (come le sottoscrizioni) corrispondenti alle vecchie props e allo state.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Vedi altri esempi.](#adding-lifecycle-methods-to-a-class-component)

#### Parameters {/*componentwillunmount-parameters*/}

`componentWillUnmount` non accetta parametri.

#### Returns {/*componentwillunmount-returns*/}

`componentWillUnmount` non dovrebbe restituire nulla.

#### Caveats {/*componentwillunmount-caveats*/}

- Quando [Strict Mode](/reference/react/StrictMode) è attivo, in sviluppo React chiamerà [`componentDidMount`,](#componentdidmount) poi chiamerà immediatamente `componentWillUnmount`, e poi chiamerà di nuovo `componentDidMount`. Questo ti aiuta a notare se hai dimenticato di implementare `componentWillUnmount` o se la sua logica non "rispecchia" completamente ciò che fa `componentDidMount`.

<Note>

Per molti casi d'uso, definire `componentDidMount`, `componentDidUpdate` e `componentWillUnmount` insieme nei componenti classe equivale a chiamare [`useEffect`](/reference/react/useEffect) nei componenti funzione. Nei rari casi in cui è importante che il codice venga eseguito prima del paint del browser, [`useLayoutEffect`](/reference/react/useLayoutEffect) è più simile.

[Vedi come migrare.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

Forza la ri-renderizzazione di un componente.

Di solito non è necessario. Se il metodo [`render`](#render) del tuo componente legge solo da [`this.props`](#props), [`this.state`](#state) o [`this.context`,](#context), verrà ri-renderizzato automaticamente quando chiami [`setState`](#setstate) dentro il tuo componente o uno dei suoi genitori. Tuttavia, se il metodo `render` del tuo componente legge direttamente da una sorgente dati esterna, devi dire a React di aggiornare l'interfaccia utente quando quella sorgente dati cambia. È ciò che ti permette di fare `forceUpdate`.

Cerca di evitare ogni uso di `forceUpdate` e leggi solo da `this.props` e `this.state` in `render`.

#### Parameters {/*forceupdate-parameters*/}

* **optional** `callback`: Se specificato, React chiamerà la `callback` che hai fornito dopo che l'aggiornamento è stato committato.

#### Returns {/*forceupdate-returns*/}

`forceUpdate` non restituisce nulla.

#### Caveats {/*forceupdate-caveats*/}

- Se chiami `forceUpdate`, React ri-renderizzerà senza chiamare [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

Leggere una sorgente dati esterna e forzare i componenti classe a ri-renderizzarsi in risposta ai suoi cambiamenti con `forceUpdate` è stato sostituito da [`useSyncExternalStore`](/reference/react/useSyncExternalStore) nei componenti funzione.

</Note>

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

Se implementi `getSnapshotBeforeUpdate`, React lo chiamerà immediatamente prima di aggiornare il DOM. Permette al tuo componente di catturare alcune informazioni dal DOM (ad esempio, la posizione di scroll) prima che vengano potenzialmente modificate. Qualsiasi valore restituito da questo metodo del lifecycle verrà passato come parametro a [`componentDidUpdate`.](#componentdidupdate)

Ad esempio, puoi usarlo in un'UI come un thread di chat che deve preservare la posizione di scroll durante gli aggiornamenti:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Stiamo aggiungendo nuovi elementi alla lista?
    // Cattura la posizione di scroll così possiamo regolarla in seguito.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Se abbiamo un valore snapshot, abbiamo appena aggiunto nuovi elementi.
    // Regola lo scroll così questi nuovi elementi non spingono fuori vista quelli vecchi.
    // (snapshot qui è il valore restituito da getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

Nell'esempio sopra, è importante leggere la proprietà `scrollHeight` direttamente in `getSnapshotBeforeUpdate`. Non è sicuro leggerla in [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) o [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) perché c'è un potenziale intervallo di tempo tra la chiamata di questi metodi e l'aggiornamento del DOM da parte di React.

#### Parameters {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: Props prima dell'aggiornamento. Confronta `prevProps` con [`this.props`](#props) per determinare cosa è cambiato.

* `prevState`: State prima dell'aggiornamento. Confronta `prevState` con [`this.state`](#state) per determinare cosa è cambiato.

#### Returns {/*getsnapshotbeforeupdate-returns*/}

Dovresti restituire un valore snapshot di qualsiasi tipo tu voglia, oppure `null`. Il valore restituito verrà passato come terzo argomento a [`componentDidUpdate`.](#componentdidupdate)

#### Caveats {/*getsnapshotbeforeupdate-caveats*/}

- `getSnapshotBeforeUpdate` non verrà chiamato se [`shouldComponentUpdate`](#shouldcomponentupdate) è definito e restituisce `false`.

<Note>

Al momento, non esiste un equivalente di `getSnapshotBeforeUpdate` per i componenti funzione. Questo caso d'uso è molto raro, ma se ne hai bisogno, per ora dovrai scrivere un componente classe.

</Note>

---

### `render()` {/*render*/}

Il metodo `render` è l'unico metodo obbligatorio in un componente classe.

Il metodo `render` dovrebbe specificare cosa vuoi che appaia sullo schermo, ad esempio:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React può chiamare `render` in qualsiasi momento, quindi non dovresti assumere che venga eseguito in un momento particolare. Di solito, il metodo `render` dovrebbe restituire un pezzo di [JSX](/learn/writing-markup-with-jsx), ma sono supportati anche alcuni [altri tipi di ritorno](#render-returns) (come le stringhe). Per calcolare il JSX restituito, il metodo `render` può leggere [`this.props`](#props), [`this.state`](#state) e [`this.context`](#context).

Dovresti scrivere il metodo `render` come una funzione pura, il che significa che dovrebbe restituire lo stesso risultato se props, state e context sono gli stessi. Non dovrebbe inoltre contenere effetti collaterali (come impostare sottoscrizioni) o interagire con le API del browser. Gli effetti collaterali dovrebbero avvenire nei gestori di eventi o in metodi come [`componentDidMount`.](#componentdidmount)

#### Parameters {/*render-parameters*/}

`render` non accetta parametri.

#### Returns {/*render-returns*/}

`render` può restituire qualsiasi nodo React valido. Questo include elementi React come `<div />`, stringhe, numeri, [portals](/reference/react-dom/createPortal), nodi vuoti (`null`, `undefined`, `true` e `false`) e array di nodi React.

#### Caveats {/*render-caveats*/}

- `render` dovrebbe essere scritto come una funzione pura di props, state e context. Non dovrebbe avere effetti collaterali.

- `render` non verrà chiamato se [`shouldComponentUpdate`](#shouldcomponentupdate) è definito e restituisce `false`.

- Quando [Strict Mode](/reference/react/StrictMode) è attivo, React chiamerà `render` due volte in sviluppo e poi scarterà uno dei risultati. Questo ti aiuta a notare gli effetti collaterali accidentali che devono essere spostati fuori dal metodo `render`.

- Non c'è corrispondenza uno-a-uno tra la chiamata a `render` e la successiva chiamata a `componentDidMount` o `componentDidUpdate`. Alcuni risultati delle chiamate a `render` possono essere scartati da React quando è vantaggioso.

---

### `setState(nextState, callback?)` {/*setstate*/}

Chiama `setState` per aggiornare lo state del tuo componente React.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` accoda le modifiche allo state del componente. Dice a React che questo componente e i suoi figli devono essere ri-renderizzati con il nuovo state. È il modo principale in cui aggiornerai l'interfaccia utente in risposta alle interazioni.

<Pitfall>

Chiamare `setState` **non** cambia lo state attuale nel codice già in esecuzione:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Still "Taylor"!
}
```

Influisce solo su ciò che `this.state` restituirà a partire dalla *prossima* renderizzazione.

</Pitfall>

Puoi anche passare una funzione a `setState`. Ti permette di aggiornare lo state in base allo state precedente:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

Non devi farlo, ma è utile se vuoi aggiornare lo state più volte durante lo stesso evento.

#### Parameters {/*setstate-parameters*/}

* `nextState`: Un oggetto o una funzione.
  * Se passi un oggetto come `nextState`, verrà unito superficialmente a `this.state`.
  * Se passi una funzione come `nextState`, verrà trattata come una _funzione updater_. Deve essere pura, dovrebbe accettare lo state e le props in sospeso come argomenti e dovrebbe restituire l'oggetto da unire superficialmente a `this.state`. React metterà la tua funzione updater in coda e ri-renderizzerà il tuo componente. Durante la prossima renderizzazione, React calcolerà il prossimo state applicando tutti gli updater in coda allo state precedente.

* **optional** `callback`: Se specificato, React chiamerà la `callback` che hai fornito dopo che l'aggiornamento è stato committato.

#### Returns {/*setstate-returns*/}

`setState` non restituisce nulla.

#### Caveats {/*setstate-caveats*/}

- Pensa a `setState` come a una *richiesta* piuttosto che a un comando immediato di aggiornamento del componente. Quando più componenti aggiornano il loro state in risposta a un evento, React raggrupperà i loro aggiornamenti e li ri-renderizzerà insieme in un unico passaggio alla fine dell'evento. Nel raro caso in cui devi forzare l'applicazione sincrona di un particolare aggiornamento dello state, puoi avvolgerlo in [`flushSync`,](/reference/react-dom/flushSync) ma questo potrebbe penalizzare le prestazioni.

- `setState` non aggiorna `this.state` immediatamente. Questo rende la lettura di `this.state` subito dopo aver chiamato `setState` un potenziale problema. Usa invece [`componentDidUpdate`](#componentdidupdate) o l'argomento `callback` di setState, entrambi garantiti per essere eseguiti dopo che l'aggiornamento è stato applicato. Se devi impostare lo state in base allo state precedente, puoi passare una funzione a `nextState` come descritto sopra.

<Note>

Chiamare `setState` nei componenti classe è simile a chiamare una [`funzione set`](/reference/react/useState#setstate) nei componenti funzione.

[Vedi come migrare.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

Se definisci `shouldComponentUpdate`, React lo chiamerà per determinare se una ri-renderizzazione può essere saltata.

Se sei sicuro di volerlo scrivere a mano, puoi confrontare `this.props` con `nextProps` e `this.state` con `nextState` e restituire `false` per dire a React che l'aggiornamento può essere saltato.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Nulla è cambiato, quindi una ri-renderizzazione non è necessaria
      return false;
    }
    return true;
  }

  // ...
}

```

React chiama `shouldComponentUpdate` prima della renderizzazione quando vengono ricevute nuove props o state. Il valore predefinito è `true`. Questo metodo non viene chiamato per la renderizzazione iniziale o quando viene usato [`forceUpdate`](#forceupdate).

#### Parameters {/*shouldcomponentupdate-parameters*/}

- `nextProps`: Le prossime props con cui il componente sta per essere renderizzato. Confronta `nextProps` con [`this.props`](#props) per determinare cosa è cambiato.
- `nextState`: Il prossimo state con cui il componente sta per essere renderizzato. Confronta `nextState` con [`this.state`](#props) per determinare cosa è cambiato.
- `nextContext`: Il prossimo context con cui il componente sta per essere renderizzato. Confronta `nextContext` con [`this.context`](#context) per determinare cosa è cambiato. Disponibile solo se specifichi [`static contextType`](#static-contexttype).

#### Returns {/*shouldcomponentupdate-returns*/}

Restituisci `true` se vuoi che il componente venga ri-renderizzato. Questo è il comportamento predefinito.

Restituisci `false` per dire a React che la ri-renderizzazione può essere saltata.

#### Caveats {/*shouldcomponentupdate-caveats*/}

- Questo metodo esiste *solo* come ottimizzazione delle prestazioni. Se il tuo componente si rompe senza di esso, risolvi prima quello.

- Considera l'uso di [`PureComponent`](/reference/react/PureComponent) invece di scrivere `shouldComponentUpdate` a mano. `PureComponent` confronta superficialmente props e state e riduce la probabilità di saltare un aggiornamento necessario.

- Non consigliamo di fare controlli di uguaglianza profonda o di usare `JSON.stringify` in `shouldComponentUpdate`. Rende le prestazioni imprevedibili e dipendenti dalla struttura dati di ogni prop e state. Nel caso migliore, rischi di introdurre blocchi di diversi secondi nella tua applicazione, e nel caso peggiore rischi di farla crashare.

- Restituire `false` non impedisce ai componenti figli di essere ri-renderizzati quando cambia *il loro* state.

- Restituire `false` non *garantisce* che il componente non verrà ri-renderizzato. React userà il valore di ritorno come suggerimento, ma potrebbe comunque scegliere di ri-renderizzare il tuo componente se ha senso per altri motivi.

<Note>

Ottimizzare i componenti classe con `shouldComponentUpdate` è simile a ottimizzare i componenti funzione con [`memo`.](/reference/react/memo) I componenti funzione offrono anche un'ottimizzazione più granulare con [`useMemo`.](/reference/react/useMemo)

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

Se definisci `UNSAFE_componentWillMount`, React lo chiamerà immediatamente dopo il [`constructor`.](#constructor) Esiste solo per ragioni storiche e non dovrebbe essere usato in codice nuovo. Usa invece una delle alternative:

- Per inizializzare lo state, dichiara [`state`](#state) come campo di classe o imposta `this.state` dentro il [`constructor`.](#constructor)
- Se devi eseguire un effetto collaterale o impostare una sottoscrizione, sposta quella logica in [`componentDidMount`](#componentdidmount).

[Vedi esempi di migrazione dai lifecycle non sicuri.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parameters {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` non accetta parametri.

#### Returns {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` non dovrebbe restituire nulla.

#### Caveats {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` non verrà chiamato se il componente implementa [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) o [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Nonostante il nome, `UNSAFE_componentWillMount` non garantisce che il componente *verrà* montato se la tua app usa funzionalità React moderne come [`Suspense`.](/reference/react/Suspense) Se un tentativo di renderizzazione viene sospeso (ad esempio, perché il codice di un componente figlio non è ancora stato caricato), React scarterà l'albero in corso e tenterà di costruire il componente da zero durante il prossimo tentativo. Ecco perché questo metodo è "non sicuro". Il codice che dipende dal montaggio (come aggiungere una sottoscrizione) dovrebbe andare in [`componentDidMount`.](#componentdidmount)

- `UNSAFE_componentWillMount` è l'unico metodo del lifecycle eseguito durante la [renderizzazione lato server.](/reference/react-dom/server) Per tutti gli scopi pratici, è identico al [`constructor`,](#constructor) quindi dovresti usare il `constructor` per questo tipo di logica.

<Note>

Chiamare [`setState`](#setstate) dentro `UNSAFE_componentWillMount` in un componente classe per inizializzare lo state equivale a passare quello state come state iniziale a [`useState`](/reference/react/useState) in un componente funzione.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

Se definisci `UNSAFE_componentWillReceiveProps`, React lo chiamerà quando il componente riceve nuove props. Esiste solo per ragioni storiche e non dovrebbe essere usato in codice nuovo. Usa invece una delle alternative:

- Se devi **eseguire un effetto collaterale** (ad esempio, fetch di dati, eseguire un'animazione o reinizializzare una sottoscrizione) in risposta a cambiamenti delle props, sposta quella logica in [`componentDidUpdate`](#componentdidupdate).
- Se devi **evitare di ricalcolare alcuni dati solo quando una prop cambia,** usa un [helper di memorizzazione](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
- Se devi **"resettare" dello state quando una prop cambia,** considera un componente [completamente controllato](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) o [completamente non controllato con una key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).
- Se devi **"regolare" dello state quando una prop cambia,** verifica se puoi calcolare tutte le informazioni necessarie dalle sole props durante la renderizzazione. Se non puoi, usa [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops).

[Vedi esempi di migrazione dai lifecycle non sicuri.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### Parameters {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: Le prossime props che il componente sta per ricevere dal suo componente genitore. Confronta `nextProps` con [`this.props`](#props) per determinare cosa è cambiato.
- `nextContext`: Il prossimo context che il componente sta per ricevere dal provider più vicino. Confronta `nextContext` con [`this.context`](#context) per determinare cosa è cambiato. Disponibile solo se specifichi [`static contextType`](#static-contexttype).

#### Returns {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` non dovrebbe restituire nulla.

#### Caveats {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` non verrà chiamato se il componente implementa [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) o [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Nonostante il nome, `UNSAFE_componentWillReceiveProps` non garantisce che il componente *riceverà* quelle props se la tua app usa funzionalità React moderne come [`Suspense`.](/reference/react/Suspense) Se un tentativo di renderizzazione viene sospeso (ad esempio, perché il codice di un componente figlio non è ancora stato caricato), React scarterà l'albero in corso e tenterà di costruire il componente da zero durante il prossimo tentativo. Al momento del prossimo tentativo di renderizzazione, le props potrebbero essere diverse. Ecco perché questo metodo è "non sicuro". Il codice che dovrebbe essere eseguito solo per aggiornamenti committati (come resettare una sottoscrizione) dovrebbe andare in [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillReceiveProps` non significa che il componente ha ricevuto props *diverse* rispetto all'ultima volta. Devi confrontare tu stesso `nextProps` e `this.props` per verificare se qualcosa è cambiato.

- React non chiama `UNSAFE_componentWillReceiveProps` con le props iniziali durante il montaggio. Chiama questo metodo solo se alcune props del componente stanno per essere aggiornate. Ad esempio, chiamare [`setState`](#setstate) generalmente non attiva `UNSAFE_componentWillReceiveProps` dentro lo stesso componente.

<Note>

Chiamare [`setState`](#setstate) dentro `UNSAFE_componentWillReceiveProps` in un componente classe per "regolare" lo state equivale a [chiamare la funzione `set` di `useState` durante la renderizzazione](/reference/react/useState#storing-information-from-previous-renders) in un componente funzione.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


Se definisci `UNSAFE_componentWillUpdate`, React lo chiamerà prima di renderizzare con le nuove props o state. Esiste solo per ragioni storiche e non dovrebbe essere usato in codice nuovo. Usa invece una delle alternative:

- Se devi eseguire un effetto collaterale (ad esempio, fetch di dati, eseguire un'animazione o reinizializzare una sottoscrizione) in risposta a cambiamenti di props o state, sposta quella logica in [`componentDidUpdate`](#componentdidupdate).
- Se devi leggere alcune informazioni dal DOM (ad esempio, per salvare la posizione di scroll attuale) così da poterle usare in [`componentDidUpdate`](#componentdidupdate) in seguito, leggile dentro [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

[Vedi esempi di migrazione dai lifecycle non sicuri.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parameters {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: Le prossime props con cui il componente sta per essere renderizzato. Confronta `nextProps` con [`this.props`](#props) per determinare cosa è cambiato.
- `nextState`: Il prossimo state con cui il componente sta per essere renderizzato. Confronta `nextState` con [`this.state`](#state) per determinare cosa è cambiato.

#### Returns {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` non dovrebbe restituire nulla.

#### Caveats {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` non verrà chiamato se [`shouldComponentUpdate`](#shouldcomponentupdate) è definito e restituisce `false`.

- `UNSAFE_componentWillUpdate` non verrà chiamato se il componente implementa [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) o [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Non è supportato chiamare [`setState`](#setstate) (o qualsiasi metodo che porti a chiamare `setState`, come eseguire il dispatch di un'azione Redux) durante `componentWillUpdate`.

- Nonostante il nome, `UNSAFE_componentWillUpdate` non garantisce che il componente *verrà* aggiornato se la tua app usa funzionalità React moderne come [`Suspense`.](/reference/react/Suspense) Se un tentativo di renderizzazione viene sospeso (ad esempio, perché il codice di un componente figlio non è ancora stato caricato), React scarterà l'albero in corso e tenterà di costruire il componente da zero durante il prossimo tentativo. Al momento del prossimo tentativo di renderizzazione, props e state potrebbero essere diversi. Ecco perché questo metodo è "non sicuro". Il codice che dovrebbe essere eseguito solo per aggiornamenti committati (come resettare una sottoscrizione) dovrebbe andare in [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillUpdate` non significa che il componente ha ricevuto props o state *diversi* rispetto all'ultima volta. Devi confrontare tu stesso `nextProps` con `this.props` e `nextState` con `this.state` per verificare se qualcosa è cambiato.

- React non chiama `UNSAFE_componentWillUpdate` con props e state iniziali durante il montaggio.

<Note>

Non esiste un equivalente diretto di `UNSAFE_componentWillUpdate` nei componenti funzione.

</Note>

---

### `static contextType` {/*static-contexttype*/}

Se vuoi leggere [`this.context`](#context-instance-field) dal tuo componente classe, devi specificare quale context deve leggere. Il context che specifichi come `static contextType` deve essere un valore creato in precedenza da [`createContext`.](/reference/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Leggere `this.context` nei componenti classe equivale a [`useContext`](/reference/react/useContext) nei componenti funzione.

[Vedi come migrare.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

Puoi definire `static defaultProps` per impostare le props predefinite per la classe. Verranno usate per props `undefined` e mancanti, ma non per props `null`.

Ad esempio, ecco come definire che la prop `color` dovrebbe avere come valore predefinito `'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

Se la prop `color` non viene fornita o è `undefined`, verrà impostata per impostazione predefinita a `'blue'`:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

Definire `defaultProps` nei componenti classe è simile a usare [valori predefiniti](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) nei componenti funzione.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

Se definisci `static getDerivedStateFromError`, React lo chiamerà quando un componente figlio (inclusi i discendenti lontani) lancia un errore durante la renderizzazione. Ti permette di mostrare un messaggio di errore invece di cancellare l'UI.

Di solito viene usato insieme a [`componentDidCatch`](#componentdidcatch), che ti permette di inviare il report dell'errore a un servizio di analytics. Un componente con questi metodi si chiama *contenitore di errori*.

[Vedi un esempio.](#catching-rendering-errors-with-an-error-boundary)

#### Parameters {/*static-getderivedstatefromerror-parameters*/}

* `error`: L'errore che è stato lanciato. In pratica, di solito sarà un'istanza di [`Error`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Error), ma non è garantito perché JavaScript permette di [`throw`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Statements/throw) qualsiasi valore, incluse stringhe o persino `null`.

#### Returns {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` dovrebbe restituire lo state che indica al componente di mostrare il messaggio di errore.

#### Caveats {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` dovrebbe essere una funzione pura. Se vuoi eseguire un effetto collaterale (ad esempio, chiamare un servizio di analytics), devi anche implementare [`componentDidCatch`.](#componentdidcatch)

<Note>

Non esiste ancora un equivalente diretto di `static getDerivedStateFromError` nei componenti funzione. Se vuoi evitare di creare componenti classe, scrivi un singolo componente `ErrorBoundary` come sopra e usalo in tutta l'app. In alternativa, usa il pacchetto [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) che lo fa.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

Se definisci `static getDerivedStateFromProps`, React lo chiamerà subito prima di chiamare [`render`,](#render), sia al montaggio iniziale sia agli aggiornamenti successivi. Dovrebbe restituire un oggetto per aggiornare lo state, oppure `null` per non aggiornare nulla.

Questo metodo esiste per [casi d'uso rari](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) in cui lo state dipende da cambiamenti delle props nel tempo. Ad esempio, questo componente `Form` resetta lo state `email` quando cambia la prop `userID`:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Ogni volta che l'utente corrente cambia,
    // resetta le parti dello state legate a quell'utente.
    // In questo semplice esempio, è solo l'email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Nota che questo pattern richiede di mantenere un valore precedente della prop (come `userID`) nello state (come `prevUserID`).

<Pitfall>

Derivare lo state porta a codice verboso e rende i tuoi componenti difficili da ragionare. [Assicurati di conoscere alternative più semplici:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- Se devi **eseguire un effetto collaterale** (ad esempio, fetch di dati o un'animazione) in risposta a un cambiamento delle props, usa invece il metodo [`componentDidUpdate`](#componentdidupdate).
- Se vuoi **ricalcolare alcuni dati solo quando una prop cambia,** [usa un helper di memorizzazione.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- Se vuoi **"resettare" dello state quando una prop cambia,** considera un componente [completamente controllato](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) o [completamente non controllato con una key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

</Pitfall>

#### Parameters {/*static-getderivedstatefromprops-parameters*/}

- `props`: Le prossime props con cui il componente sta per essere renderizzato.
- `state`: Il prossimo state con cui il componente sta per essere renderizzato.

#### Returns {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` restituisce un oggetto per aggiornare lo state, oppure `null` per non aggiornare nulla.

#### Caveats {/*static-getderivedstatefromprops-caveats*/}

- Questo metodo viene eseguito a *ogni* renderizzazione, indipendentemente dalla causa. Questo è diverso da [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops), che viene eseguito solo quando il genitore causa una ri-renderizzazione e non come risultato di un `setState` locale.

- Questo metodo non ha accesso all'istanza del componente. Se vuoi, puoi riutilizzare del codice tra `static getDerivedStateFromProps` e gli altri metodi della classe estraendo funzioni pure delle props e dello state del componente fuori dalla definizione della classe.

<Note>

Implementare `static getDerivedStateFromProps` in un componente classe equivale a [chiamare la funzione `set` di `useState` durante la renderizzazione](/reference/react/useState#storing-information-from-previous-renders) in un componente funzione.

</Note>

---

## Usage {/*usage*/}

### Definire un componente classe {/*defining-a-class-component*/}

Per definire un componente React come classe, estendi la classe integrata `Component` e definisci un [`metodo render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React chiamerà il tuo metodo [`render`](#render) ogni volta che deve capire cosa mostrare sullo schermo. Di solito, restituirai del [JSX](/learn/writing-markup-with-jsx) da esso. Il tuo metodo `render` dovrebbe essere una [funzione pura:](https://it.wikipedia.org/wiki/Funzione_pura) dovrebbe calcolare solo il JSX.

Analogamente ai [componenti funzione,](/learn/your-first-component#defining-a-component) un componente classe può [ricevere informazioni tramite props](/learn/your-first-component#defining-a-component) dal suo componente genitore. Tuttavia, la sintassi per leggere le props è diversa. Ad esempio, se il componente genitore renderizza `<Greeting name="Taylor" />`, puoi leggere la prop `name` da [`this.props`](#props), come `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Nota che gli Hooks (funzioni che iniziano con `use`, come [`useState`](/reference/react/useState)) non sono supportati dentro i componenti classe.

<Pitfall>

Consigliamo di definire i componenti come funzioni invece che come classi. [Vedi come migrare.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Aggiungere lo state a un componente classe {/*adding-state-to-a-class-component*/}

Per aggiungere [state](/learn/state-a-components-memory) a una classe, assegna un oggetto a una proprietà chiamata [`state`](#state). Per aggiornare lo state, chiama [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Incrementa età
        </button>
        <p>Ciao, {this.state.name}. Hai {this.state.age} anni.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Pitfall>

Consigliamo di definire i componenti come funzioni invece che come classi. [Vedi come migrare.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Aggiungere metodi del lifecycle a un componente classe {/*adding-lifecycle-methods-to-a-class-component*/}

Ci sono alcuni metodi speciali che puoi definire sulla tua classe.

Se definisci il metodo [`componentDidMount`](#componentdidmount), React lo chiamerà quando il tuo componente viene aggiunto *(montato)* allo schermo. React chiamerà [`componentDidUpdate`](#componentdidupdate) dopo che il tuo componente è stato ri-renderizzato a causa di props o state cambiati. React chiamerà [`componentWillUnmount`](#componentwillunmount) dopo che il tuo componente è stato rimosso *(smontato)* dallo schermo.

Se implementi `componentDidMount`, di solito devi implementare tutti e tre i lifecycle per evitare bug. Ad esempio, se `componentDidMount` legge dello state o delle props, devi anche implementare `componentDidUpdate` per gestirne i cambiamenti e `componentWillUnmount` per ripulire ciò che `componentDidMount` stava facendo.

Ad esempio, questo componente `ChatRoom` mantiene una connessione chat sincronizzata con props e state:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Scegli la chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chiudi chat' : 'Apri chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          URL del server:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Benvenuto nella room {this.props.roomId}!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Nota che in sviluppo, quando [Strict Mode](/reference/react/StrictMode) è attivo, React chiamerà `componentDidMount`, chiamerà immediatamente `componentWillUnmount`, e poi chiamerà di nuovo `componentDidMount`. Questo ti aiuta a notare se hai dimenticato di implementare `componentWillUnmount` o se la sua logica non "rispecchia" completamente ciò che fa `componentDidMount`.

<Pitfall>

Consigliamo di definire i componenti come funzioni invece che come classi. [Vedi come migrare.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### Catturare errori di renderizzazione con un contenitore di errori {/*catching-rendering-errors-with-an-error-boundary*/}

Per impostazione predefinita, se la tua applicazione lancia un errore durante la renderizzazione, React rimuoverà la sua UI dallo schermo. Per evitare questo, puoi avvolgere una parte della tua UI in un *contenitore di errori*. Un contenitore di errori è un componente speciale che ti permette di mostrare una UI di fallback invece della parte che è crashata — ad esempio, un messaggio di errore.

<Note>
I contenitori di errori non catturano errori per:

- Gestori di eventi [(scopri di più)](/learn/responding-to-events)
- [Renderizzazione lato server](/reference/react-dom/server)
- Errori lanciati nel contenitore di errori stesso (piuttosto che nei suoi figli)
- Codice asincrono (ad esempio, callback `setTimeout` o `requestAnimationFrame`); un'eccezione è l'uso della funzione [`startTransition`](/reference/react/useTransition#starttransition) restituita dall'Hook [`useTransition`](/reference/react/useTransition). Gli errori lanciati dentro la funzione di transizione vengono catturati dai contenitori di errori [(scopri di più)](/reference/react/useTransition#displaying-an-error-to-users-with-error-boundary)

</Note>

Per implementare un componente contenitore di errori, devi fornire [`static getDerivedStateFromError`](#static-getderivedstatefromerror), che ti permette di aggiornare lo state in risposta a un errore e mostrare un messaggio di errore all'utente. Puoi anche implementare opzionalmente [`componentDidCatch`](#componentdidcatch) per aggiungere logica extra, ad esempio per registrare l'errore in un servizio di analytics.

Con [`captureOwnerStack`](/reference/react/captureOwnerStack) puoi includere l'Owner Stack durante lo sviluppo.

```js {9-12,14-27}
import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Aggiorna lo state così la prossima renderizzazione mostrerà la UI di fallback.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // Esempio di "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Attenzione: `captureOwnerStack` non è disponibile in produzione.
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // Puoi renderizzare qualsiasi UI di fallback personalizzata
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Poi puoi avvolgere una parte del tuo albero di componenti con esso:

```js {1,3}
<ErrorBoundary fallback={<p>Qualcosa è andato storto</p>}>
  <Profile />
</ErrorBoundary>
```

Se `Profile` o un suo componente figlio lancia un errore, `ErrorBoundary` "catturerà" quell'errore, mostrerà una UI di fallback con il messaggio di errore che hai fornito e invierà un report di errore in produzione al tuo servizio di segnalazione errori.

Non devi avvolgere ogni componente in un contenitore di errori separato. Quando pensi alla [granularità dei contenitori di errori,](https://www.brandondail.com/posts/fault-tolerance-react) considera dove ha senso mostrare un messaggio di errore. Ad esempio, in un'app di messaggistica ha senso posizionare un contenitore di errori attorno all'elenco delle conversazioni. Ha senso anche posizionarne uno attorno a ogni singolo messaggio. Tuttavia, non avrebbe senso posizionare un boundary attorno a ogni avatar.

<Note>

Al momento non c'è modo di scrivere un contenitore di errori come componente funzione. Tuttavia, non devi scrivere tu stesso la classe del contenitore di errori. Ad esempio, puoi usare [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary).

</Note>

---

## Alternative {/*alternatives*/}

### Migrare un componente semplice da classe a funzione {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Di solito [definirai i componenti come funzioni](/learn/your-first-component#defining-a-component).

Ad esempio, supponiamo che tu stia convertendo questo componente classe `Greeting` in una funzione:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Definisci una funzione chiamata `Greeting`. Qui sposterai il corpo della tua funzione `render`.

```js
function Greeting() {
  // ... sposta qui il codice dal metodo render ...
}
```

Invece di `this.props.name`, definisci la prop `name` [usando la sintassi di destructuring](/learn/passing-props-to-a-component) e leggila direttamente:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

Ecco un esempio completo:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### Migrare un componente con state da classe a funzione {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Supponiamo che tu stia convertendo questo componente classe `Counter` in una funzione:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Incrementa età
        </button>
        <p>Ciao, {this.state.name}. Hai {this.state.age} anni.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

Inizia dichiarando una funzione con le necessarie [variabili di state:](/reference/react/useState#adding-state-to-a-component)

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

Poi, converti i gestori di eventi:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Infine, sostituisci tutti i riferimenti che iniziano con `this` con le variabili e le funzioni che hai definito nel tuo componente. Ad esempio, sostituisci `this.state.age` con `age` e `this.handleNameChange` con `handleNameChange`.

Ecco un componente completamente convertito:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Incrementa età
      </button>
      <p>Ciao, {name}. Hai {age} anni.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Migrare un componente con metodi del lifecycle da classe a funzione {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Supponiamo che tu stia convertendo questo componente classe `ChatRoom` con metodi del lifecycle in una funzione:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Scegli la chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chiudi chat' : 'Apri chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          URL del server:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Benvenuto nella room {this.props.roomId}!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Per prima cosa, verifica che il tuo [`componentWillUnmount`](#componentwillunmount) faccia l'opposto di [`componentDidMount`.](#componentdidmount) Nell'esempio sopra, è vero: disconnette la connessione che `componentDidMount` imposta. Se manca questa logica, aggiungila per prima.

Poi, verifica che il tuo metodo [`componentDidUpdate`](#componentdidupdate) gestisca i cambiamenti di qualsiasi props e state che usi in `componentDidMount`. Nell'esempio sopra, `componentDidMount` chiama `setupConnection` che legge `this.state.serverUrl` e `this.props.roomId`. Ecco perché `componentDidUpdate` verifica se `this.state.serverUrl` e `this.props.roomId` sono cambiati e resetta la connessione se lo hanno fatto. Se la logica di `componentDidUpdate` manca o non gestisce i cambiamenti di tutte le props e lo state rilevanti, correggila per prima.

Nell'esempio sopra, la logica dentro i metodi del lifecycle collega il componente a un sistema esterno a React (un server chat). Per collegare un componente a un sistema esterno, [descrivi questa logica come un singolo Effetto:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

Questa chiamata a [`useEffect`](/reference/react/useEffect) equivale alla logica nei metodi del lifecycle sopra. Se i tuoi metodi del lifecycle fanno più cose non correlate, [suddividili in più Effetti indipendenti.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Ecco un esempio completo con cui puoi sperimentare:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Scegli la chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chiudi chat' : 'Apri chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
        <h1>Benvenuto nella room {roomId}!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Un'implementazione reale si connetterebbe effettivamente al server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

Se il tuo componente non si sincronizza con alcun sistema esterno, [potresti non aver bisogno di un Effetto.](/learn/you-might-not-need-an-effect)

</Note>

---

### Migrare un componente con context da classe a funzione {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

In questo esempio, i componenti classe `Panel` e `Button` leggono il [context](/learn/passing-data-deeply-with-context) da [`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Quando li converti in componenti funzione, sostituisci `this.context` con chiamate a [`useContext`](/reference/react/useContext):

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
