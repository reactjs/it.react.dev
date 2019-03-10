---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

Questa pagina contiene un riferimento dettagliato delle API della definizione della classe componente React. Viene dato per scontato che ti siano familiari i concetti fondamentali di React, come [Componenti e Props](/docs/components-and-props.html), così come [State and Lifecycle](/docs/state-and-lifecycle.html). Se non è così, studiali prima di proseguire.

## Overview {#overview}

React ti consente di definire componenti come classi o come funzioni. I componenti definiti come classi attualmente sono dotati di più funzionalità, che sono descritte dettagliatamente in questa pagina. Per definire una classe componente React, devi estendere `React.Component`:

```js
class Benvenuto extends React.Component {
  render() {
    return <h1>Ciao, {this.props.nome}</h1>;
  }
}
```

L'unico metodo che è *obbligatorio* definire in una sottoclasse `React.Component` è chiamato [`render()`](#render). Tutti gli altri metodi descritti in questa pagina sono opzionali.

**Ti sconsigliamo vivamente di creare altre classi base per i tuoi componenti.** In React, [il riutilizzo del codice è ottenuto soprattutto utilizzando la composizione e non l'ereditarietà](/docs/composition-vs-inheritance.html).

>Nota:
>
>React non ti obbliga ad utilizzare la sintassi delle classi ES6. Se preferisci evitarla, puoi utilizzare il modulo `create-react-class` o un'astrazione simile. Dai un'occhiata a [React senza ES6](/docs/react-without-es6.html) per saperne di più.

### Il Lifecycle del Componente {#the-component-lifecycle}

Ogni componente ha numerosi "metodi del lifecycle" (ciclo di vita) che puoi sovrascrivere per eseguire del codice in momenti particolari nel processo. **Puoi utilizzare [questo diagramma del lifecycle](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) come riferimento.** Nella lista più in basso, i metodi del lifecycle più frequentemente utilizzati sono evidenziati in **grassetto**. Gli altri metodi non evidenziati esistono per casi d'uso relativamente rari.

#### Mounting (Montaggio) {#mounting}

Quando un'istanza di un componente viene creata e inserita nel DOM, questi metodi vengono chiamati nel seguente ordine:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Nota:
>
>Questi metodi sono considerati obsoleti e dovresti [evitare di utilizzarli](/blog/2018/03/27/update-on-async-rendering.html) quando scrivi del nuovo codice:
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Updating (Aggiornamento) {#updating}

Un aggiornamento può essere causato da cambiamenti alle props o allo state. Quando un componente viene ri-renderizzato, questi metodi sono chiamati nel seguente ordine:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>Nota:
>
>Questi metodi sono considerati obsoleti e dovresti [evitare di utilizzarli](/blog/2018/03/27/update-on-async-rendering.html) quando scrivi del nuovo codice:
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Unmounting (Smontaggio) {#unmounting}

Quando un componente viene rimosso dal DOM, viene chiamato questo metodo:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Gestione degli Errori {#error-handling}

Quando si verifica un errore durante la renderizzazione, in un metodo del lifecycle o nel costruttore di un componente figlio, vengono chiamati questi metodi:

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### Altre API {#other-apis}

Ciascun componente fornisce anche altre API:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Proprietà della Classe {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Proprietà dell'Istanza {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Riferimenti {#reference}

### Metodi del Lifecycle Utilizzati Frequentemente {#commonly-used-lifecycle-methods}

I metodi in questa sezione copro la maggior parte dei casi d'uso che incontrerai durante la creazione di componenti React. **Come riferimento grafico, puoi utilizzare [questo diagramma del lifecycle](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

Il metodo `render()` è l'unico metodo obbligatorio in un componente classe.

Il suo compito è esaminare `this.props` e `this.state` e restituire in output uno dei seguenti tipi:

- **Elementi React.** Creati solitamente utilizzando [JSX](/docs/introducing-jsx.html). Ad esempio, `<div />` e `<MyComponent />` sono elementi React che indicano a React di renderizzare rispettivamente un nodo del DOM e un altro componente definito dall'utente.
- **Array e "fragments" (frammenti).** Ti consentono di restituire in output più di un elemento. Leggi la documentazione sui [fragments](/docs/fragments.html) per maggiori informazioni.
- **Portali**. Ti consentono di renderizzare i figli del componente in un sottoalbero del DOM diverso da quello in cui si trova il componente. Leggi la documentazione sui [portali](/docs/portals.html) per maggiori informazioni.
- **Stringhe e numeri.** Sono renderizzati come nodi di testo nel DOM.
- **Booleani o `null`**. Non renderizzano niente. (Esistono soprattutto per supportare il pattern `return test && <Figlio />`, in cui `test` è booleano.)

La funzione `render()` deve essere pura, ovvero non modificare lo stato del componente, restituire sempre lo stesso risultato ogni volta che viene invocata e non interagire direttamente con il browser.

Se hai bisogno di interagire con il browser, fallo all'interno del metodo `componentDidMount()` o negli altri metodi del lifecycle. Mantenere pura la funzione `render()` rende più semplice la gestione dei componenti.

> Nota
>
> `render()` non viene chiamato se [`shouldComponentUpdate()`](#shouldcomponentupdate) ritorna un valore falso.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**Se non hai bisogno di inizializzare lo stato del componente e di non effettuare il bind di metodi, non c'è bisogno di implementare un costruttore per il tuo componente React.**

Il costruttore di un componente React è chiamato prima che il componente venga montato. Quando imoplementi il costruttore in una sottoclasse di `React.Component`, dovresti chiamare `super(props)` prima di ogni altra istruzione. In caso contrario, `this.props` rimarrebbe undefined nel costruttore, il che può causare bug.

Di solito in React i costruttori sono utilizzati solamente per due scopi:

* Inizializzare lo [stato locale](/docs/state-and-lifecycle.html) assegnando un oggetto a `this.state`.
* Effettuare il bind dei [gestori di eventi (event handlers)](/docs/handling-events.html) ad una istanza.

**Non dovresti chiamare `setState()`** nel `constructor()`. Al contrario, se il tuo componente ha bisogno di impostare lo stato locale, **assegna lo stato iniziale a `this.state`** direttamente nel costruttore:

```js
constructor(props) {
  super(props);
  // Non chiamre this.setState() qui!
  this.state = { contatore: 0 };
  this.gestoreClick = this.gestoreClick.bind(this);
}
```

Il costruttore è l'unico punto in cui puoi assegnare direttamente un valore a `this.state`. In tutti gli altri metodi, devi invece utilizzare `this.setState()`.

Evita di introdurre i cosiddetti "side-effects" (effetti collaterali) o di effettuare sottoscrizioni nel costruttore. Per questi casi d'uso, utilizza invece `componentDidMount()`.

>Nota
>
>**Evita di copiare le props nello stato! Questo è un errore comune:**
>
>```js
>constructor(props) {
>  super(props);
>  // Non fare così!
>  this.state = { colore: props.colore };
>}
>```
>
>Il problema è che questa soluzione non solo è superflua (puoi utilizzare direttamente `this.props.color`) ma è anche causa di bug (gli aggiornamenti alla prop `color` non verranno propagati allo stato, contrariamente a quanto si potrebbe erroneamente pensare).
>
>**Utilizza questo pattern solamente se vuoi intenzionalmente ignorare gli aggiornamenti delle props.** In quel caso, però, per rendere più comprensibile il codice ha senso rinominare la prop e chiamarla `coloreIniziale` o `coloreDefault`. A quel punto puoi costringere un componente a "resettare" il suo stato interno [cambiandone la `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) quando necessario.
>
>Leggi il [post del blog a proposito di come evitare lo stato derivato](/blog/2018/06/07/you-probably-dont-need-derived-state.html) per sapere cosa fare quando pensi di aver bisogno di far dipendere parti dello stato di un componente dalle sue props.


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` è invocato dopo che il componente è montato (cioè inserito nell'albero del DOM). Le logiche di inizializzazione che dipendono dai nodi del DOM dovrebbero essere dichiarate in questo metodo. Inoltre, se hai bisogno di caricare dei dati chiamando un endpoint remoto, questo è un buon punto per instanziare la chiamata.

Questo metodo è anche un buon punto in cui creare le sottoscrizioni. Se lo fai, non scordarti di cancellare in `componentWillUnmount()` tutte le sottoscrizioni create.

Puoi **chiamare `setState()` immediatamente** in `componentDidMount()`. Farlo scatenerà una richiesta di rendering in più, che però verrà gestita prima che il browser aggiorni lo schermo. QUesto garantisce che l'utente non visualizzi lo stato intermedio anche se il metodo `render()` viene chiamato due volte. Utilizza questo pattern con cautela in quanto spesso causa problemi di performance. Nella maggior parte dei casi, dovresti poter assegnare lo stato iniziale del componente nel `constructor()`. Tuttavia, potrebbe essere necessario utilizzare questo pattern in casi come i popup o i tooltip, in cui hai bisogno di misurare un nodo del DOM prima di renderizzare qualcosa che dipende dalla sua posizione o dalle sue dimensioni.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(propsPrecedenti, statePrecedente, snapshot)
```

`componentDidUpdate()` è invocato immediatamente dopo che avviene un aggiornamento del componente. Non viene chiamato per la renderizzazione iniziale.

Utilizza questo metodo come un'opportunità di effettuare operazioni sul DOM dopo che il componente si è aggiornato, oppure per effettuare richieste di rete dopo aver comparato i valori attuali delle props con quelli passati (e.g. una richiesta di rete potrebbe non essere necessaria se le props non sono cambiate).

```js
componentDidUpdate(propsPrecedenti) {
  // Utilizzo tipico (non dimenticarti di comparare le props):
  if (this.props.idUtente !== propsPrecedenti.idUtente) {
    this.fetchData(this.props.idUtente);
  }
}
```

**Puoi chiamare `setState()` immediatamente** in `componentDidUpdate()` ma nota che la chiamata **deve sempre essere subordinata a un'espressione condizionale** come nell'esempio in alto, altrimenti causerai un loop infinito e una renderizzazione extra che, anche se non visibile dall'utente, può peggiorare la performance del componente. Se la tua intenzione è quella di "rispecchiare" nello stato una prop che viene dall'alto, valuta invece di utilizzare direttamente quella prop. Per saperne di più, leggi [operché copiare le props nello stato è fonte di bug](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

Se il tuo componente implementa il metodo del lifecycle `getSnapshotBeforeUpdate()` (il che avviene raramente), il valore restituito da quest'ultimo verrà passato come terzo argomento ("snapshot" nell'esempio in alto) al metodo `componentDidUpdate()`. In caso contrario, "snapshot" sarà undefined.

> Nota
>
> `componentDidUpdate()` non viene chiamato se [`shouldComponentUpdate()`](#shouldcomponentupdate) restituisce un valore falso.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` è invocato subito prima che un componente sia smontato e distrutto. Effettua tutte le necessarie operazioni di pulizia in questo metodo, come la cancellazione di timer, richieste di rete o sottoscrizioni che avevi creato in `componentDidMount()`.

**Non dovresti chiamare `setState()`** in `componentWillUnmount()` perché il componente non verrà ri-renderizzato. Una volta che un'istanza di un componente è smontata, non verrà mai più montata.

* * *

### Metodi del Lifecycle Utilizzati Raramente {#rarely-used-lifecycle-methods}

I metodi in questa sezione corrispondono a casi d'uso non comuni. Possono tornare utili qualche volta, ma la maggior parte dei tuoi componenti non dovrebbe averne bisogno. **Puoi visualizzare la maggior parte dei metodi descritti in questa sezione in questo [diagramma del lifecycle](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) se spunti il checkbox "Show less common lifecycles" ("Mostra i metodi del lifecycle meno comuni") in alto.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(propsSuccessive, stateSucessivo)
```

Utilizza `shouldComponentUpdate()` per informare React del fatto che l'output di un componente non è influenzato dall'attuale modifica dello state o delle props. Il comportamento predefinito di React è quello di ri-renderizzare un componente ogni volta che lo stato cambia e nella stragrande maggioranza dei casi dovresti affidarti a questo comportamento.

`shouldComponentUpdate()` è invocato prima della renderizzazione, quando il componente sta ricevendo nuove proprietà o un nuovo stato. Il risultato di default restituito dal metodo è `true`. Questo metodo non è chiamato durante la renderizzazione del componente oppure quando viene utilizzato il metodo `forceUpdate()`.

Questo metodo esiste al solo scopo di **[ottimizzare la performance](/docs/optimizing-performance.html).** Non devi utilizzarlo per "prevenire" una renderizzazione, in quanto questo può essere causa di bug. **Valuta se utilizzare la classe predefinita [`PureComponent`](/docs/react-api.html#reactpurecomponent)** invece di scrivere `shouldComponentUpdate()` a mano. `PureComponent` effettua una comparazione "shallow" delle props e dello state e riduce il rischio di saltare erroneamente un aggiornamento necessario.

Se sei sicuro di voler scrivere a mano il metodo, puoi comparare `this.props` con `propsSuccessive` e `this.state` con `stateSucessivo` e restituire `false` per comunicare a React che l'aggiornamento può essere saltato. Nota che restituire `false` non impedisce ai componenti figli di essere ri-renderizzati quando il *loro* stato cambia.

Non raccomandiamo di effettuare comparazioni "deep" o di utilizzare `JSON.stringify()` in `shouldComponentUpdate()`. Farlo è molto inefficiente e peggiorerà sicuramente la performance del componente.

Attualmente, quando `shouldComponentUpdate()` restituisce `false`, i metodi [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), e [`componentDidUpdate()`](#componentdidupdate) non vengono invocati. In futuro, React potrebbe però considerare il risultato di `shouldComponentUpdate()` semplicemente come un suggerimento, e non un ordine tassativo, nel cui caso restituire `false` potrebbe comunque risultare in una nuova renderizzazione del componente.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` è invocato subito prima di chiamare `render`, sia durante il montaggio iniziale del componente che negli aggiornamenti successivi. Dovrebbe restituire un ogetto per aggiornare lo stato, oppure null per non effettuare aggiornamenti.

Questo metodo esiste per [rari casi d'uso](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) in cui lo stato dipende da cambiamenti delle proprietà nel corso del tempo. Ad esempio, potrebbe tornare utile per implementare un componente `<Transizione>` che compara i suoi figli precedenti e successivi per decidere quali di essi far comparire o sparire con un'animazione.

Derivare lo stato è spesso causa di codice verboso e rende difficile la gestione dei tuoi componenti.  
[Assicurati di familiarizzare con alternative più semplici:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* Se hai bisogno di **causare un effetto collaterale** (ad esempio una richiesta di dati o un'animazione) in risposta a un cambiamento nelle props, utilizza invece il metodo del lifecycle [`componentDidUpdate`](#componentdidupdate).

* Se vuoi **ricalcolare alcuni dati solo quando una prop cambia**, [utilizza un "memoization helper" (helper di memorizzazione)](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* Se vui **"resettare" lo stato quando una prop cambia**, valuta invece se rendere il componente [completamente controllato](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) oppure [completamente non controllato con una `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

Questo metodo non ha accesso all'istanza del componente. Se vuoi, puoi riutilizzare parti del codice di `getDerivedStateFromProps()` e di altri metodi di classe dichiarando, all'esterno della definizione della classe del componente, funzioni pure che accettano come argomenti le props e lo state.

Nota che questo metodo viene chiamato *ogni volta* che viene effettuato un render, a prescindere dalla causa. Al contrario, `UNSAFE_componentWillReceiveProps` viene invocato solo quando il parent causa la ri-renderizzazione e non quando quest'ultima è il risultato di una chiamata a `setState` all'interno del componente stesso.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(propsPrecedenti, statePrecedente)
```

`getSnapshotBeforeUpdate()` è invocato subito prima che il più recente output della renderizzazione sia consolidato ad esempio nel DOM. Rende possibile al tuo componente catturare informazioni del DOM (e.g. la posizione dello scroll) prima che avvenga un potenziale cambiamento. Qualsiasi valore restituito da questo metodo del lifecycle verrà passato come parametro a `componentDidUpdate()`.

Questo caso d'uso non è comune, ma potrebbe verificarsi in UI come i canali delle chat, che hanno bisogno di gestire la posizione dello scroll in modo speciale.

Il metodo dovrebbe restituire un valore di "snapshot" (o `null`).

Ad esempio:

`embed:react-component-reference/get-snapshot-before-update.js`

Nell'esempio qui sopra, è importante leggere la proprietà `scrollHeight` in `getSnapshotBeforeUpdate` perché potrebbero verificarsi ritardi fra i metodi del lifecycle che appartengono alla fase della renderizzazione (come `render`) e i metodi che appartengono alla fase del "consolidamento" (come `getSnapshotBeforeUpdate` e `componentDidUpdate`).

* * *

### Contenitori di Errori {#error-boundaries}

I [Contenitori di Errori](/docs/error-boundaries.html) sono componenti React che si occupano di catturare gli errori JavaScript in qualunque punto nell'albero dei loro componenti figli, loggarli e visualizzare una UI di ripiego invece dell'albero di componenti che si è rotto. I COntenitori di Errori catturano gli errori durante la renderizzazione, nei metodi del lifecycle e nei costruttori dell'intero albero sotto di loro.

Un componente classe diventa un contenitore di errori se definisce uno entrambi i metodi del lifecycle `static getDerivedStateFromError()` o `componentDidCatch()`. Aggiornare lo stato all'interno di questi metodi del lifecycle ti consente di catturare un errore JavaScript non gestito nell'albero più in basso e mostrare una UI di ripiego.

Utilizza i contenitori di errori solamente per recuperare errori inaspettati; **non utilizzarli per il controllo di flusso dell'applicazione.**

Per maggiori informazioni, vedi [*Error Handling in React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> Nota
> 
> I contenitori di errori catturano solamente gli errori sollevati dai componenti **sotto di loro** nell'albero. Un contenitore di errori non è in grado di catturare un errore sollevato da lui stesso.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

Questo metodo del lifecycle è invocato dopo che un errore è stato sollevato da un componente discendente.
Riceve l'errore che è stato sollevato come parametro e dovrebbe restituire un valore da usare per aggiornare lo state.

```js{7-10,13-16}
class ContenitoreErrori extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inErrore: false };
  }

  static getDerivedStateFromError(error) {
    // Aggiorno lo stato in modo che il prossimo render visualizzi la UI di ripiego.
    return { inErrore: true };
  }

  render() {
    if (this.state.inErrore) {
      // Puoi renderizzare una qualsiasi interfaccia di ripiego
      return <h1>Oh no! Si è verificato un errore!</h1>;
    }

    return this.props.children; 
  }
}
```

> Nota
>
> `getDerivedStateFromError()` è chiamato durante la fase di renderizzazione, quindi i side-effects (effetti collaterali) non sono permessi.
Per questi casi d'uso, utilizza invece `componentDidCatch()`.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

Questo metodo del lifecycle è invocato dopo che un errore è stato sollevato da un componente discentente.
Riceve due parametri:

1. `error` - L'errore che è stato sollevato.
2. `info` - Un ogetto con una chiave `componentStack` che contiene [informazioni a proposito di quale componente ha sollevato l'errore](/docs/error-boundaries.html#component-stack-traces).


`componentDidCatch()` è chiamato durante la fase di consolidamento, quindi i side-effects sono ammessi.
Dovrebbe essere utilizzato per cose come il log degli errori:

```js {12-19}
class ContenitoreErrori extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inErrore: false };
  }

  static getDerivedStateFromError(error) {
    // Aggiorno lo stato in modo che il prossimo render visualizzi la UI di ripiego.
    return { inErrore: true };
  }

  componentDidCatch(error, info) {
    // "componentStack" di esempio:
    //   in ComponenteMalfunzionante (created by App)
    //   in ContenitoreErrori (created by App)
    //   in div (created by App)
    //   in App
    loggaStackNelMioServizio(info.componentStack);
  }

  render() {
    if (this.state.inErrore) {
      // Puoi renderizzare una qualsiasi interfaccia di ripiego
      return <h1>Oh no! Si è verificato un errore!</h1>;
    }

    return this.props.children; 
  }
}
```

> Nota
> 
> Quando si verifica un errore, puoi anche renderizzare una UI di ripiego con `componentDidCatch()` chiamando `setState`, ma questo comportamento verrà deprecato in una futura release di React.
> Utilizza invece `static getDerivedStateFromError()` per gestire la renderizzazione in questi casi.

* * *

### Metodi del Lifecycle Obsoleti {#legacy-lifecycle-methods}

I metodi del lifecycle seguenti sono marcati come "obsoleti". Funzionano ancora, ma non raccomandiamo di utilizzarli nel nuovo codice. Puoi saperne di più a proposito di come effettuare la migrazione dai metodi del lifecycle obsoleti in [questo post del blog](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Nota
>
> Questo metodo del lifecycle era originariamente chiamato `componentWillMount`. Quel nome continuerà a funzionare fino alla versione 17. Utilizza il ["codemod" `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) per aggiornare automaticamente i tuoi componenti.

`UNSAFE_componentWillMount()` viene invocato prima del montaggio del componente e prima di `render()`, quindi chiamare `setState()` in modo sincrono in questo metodo non scatenerà una renderizzazione aggiuntiva. In generale, ti raccomandiamo di utilizzare `constructor()` invece di questo metodo per inizializzare lo stato.

Evita di introdurre side-effects o sottoscrizioni in questo metodo. Per quei casi d'uso, utilizza invece `componentDidMount()`.

Questo è l'unico metodo del lifecycle invocato quando si utilizza il server rendering.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(propsSuccessive)
```

> Nota
>
> Questo metodo del lifecycle era originariamente chiamato `componentWillReceiveProps`. Quel nome continuerà a funzionare fino alla versione 17. Utilizza il ["codemod" `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) per aggiornare automaticamente i tuoi componenti.

> Nota:
>
> Utilizzare questo metodo del lifecycle spesso conduce a bug e inconsistenze.
>
> * Se hai bisogno di **causare un side effect** (ad esempio, recupero di dati o animazioni) in risposta a un cambiamento nelle proprietà, utilizza invece il metodo del lifecycle [`componentDidUpdate`](#componentdidupdate).
> * Se hai utilizzato `componentWillReceiveProps` per **ricalcolare alcuni dati solamente quando una proprietà cambia**, [utilizza invece un helper di memorizzazione](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * Se hai utilizzato `componentWillReceiveProps` per **"resettare" lo stato quando una proprietà cambia**, valuta piuttosto se creare un componente [completamente controllato](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) o [completamente non controllato con una `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).
>
> Per gli altri casi d'uso, [segui le raccomandazioni in questo post del blog a proposito dello stato derivato](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` viene invocato prima che un componente montato riceva nuove proprietà. Se hai bisogno di aggiornare lo stato in risposta a cambiamenti nelle proprietà (ad esempio per resettarlo), puoi comparare `this.props` e `propsSuccessive` ed effettuare l'aggiornamento dello stato utilizzando `this.setState()` in questo metodo.

Nota che se un componente padre causa la ri-renderizzazione del tuo componente, questo metodo verrà chiamato anche se le proprietà non sono cambiate. Assicurati di comparare i valori attuali e quelli successivi delle proprietà se vuoi solo reagire ai cambiamenti delle proprietà.

React non chiama `UNSAFE_componentWillReceiveProps()` con le proprietà iniziali durante il [montaggio](#mounting). Questo metodo viene chiamato solamente se alcune delle proprietà del componente si potrebbero aggiornarsi. In generale, le chiamate a `this.setState()` non attivano `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(propsSuccessive, stateSuccessivo)
```

> Note
>
> Questo metodo del lifecycle era originariamente chiamato `componentWillUpdate`. Quel nome continuerà a funzionare fino alla versione 17. Utilizza il ["codemod" `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) per aggiornare automaticamente i tuoi componenti.

`UNSAFE_componentWillUpdate()` viene invocato subito prima della renderizzazione quando le nuove props o il nuovo stato vengono ricevuti. Utilizza questo metodo come un'opportunità di prepararti prima che avvenga un aggiornamento. Questo metodo non è chiamato nella renderizzazione iniziale.

Nota che non puoi chiamare `this.setState()`in questo metodo, né dovresti fare qualsiasi altra cosa (e.g. ad esempio il dispatch di una action di Redux) che potrebbe causare un aggiornamento di un componente React prima che l'esecuzione di `UNSAFE_componentWillUpdate()` arrivi al termine.

Tipicamente, questo metodo può essere sostituito da `componentDidUpdate()`. Se utilizzavi questo metodo per accedere al DOM (e.g. per salvare la posizione dello scroll), puoi spostare quella logica in `getSnapshotBeforeUpdate()`.

> Nota
>
> `UNSAFE_componentWillUpdate()` non viene invocato se [`shouldComponentUpdate()`](#shouldcomponentupdate) restituisce un valore falso.

* * *

## Other APIs {#other-apis-1}

Unlike the lifecycle methods above (which React calls for you), the methods below are the methods *you* can call from your components.

There are just two of them: `setState()` and `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

`setState()` does not always immediately update the component. It may batch or defer the update until later. This makes reading `this.state` right after calling `setState()` a potential pitfall. Instead, use `componentDidUpdate` or a `setState` callback (`setState(updater, callback)`), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the `updater` argument below.

`setState()` will always lead to a re-render unless `shouldComponentUpdate()` returns `false`. If mutable objects are being used and conditional rendering logic cannot be implemented in `shouldComponentUpdate()`, calling `setState()` only when the new state differs from the previous state will avoid unnecessary re-renders.

The first argument is an `updater` function with the signature:

```javascript
(state, props) => stateChange
```

`state` is a reference to the component state at the time the change is being applied. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from `state` and `props`. For instance, suppose we wanted to increment a value in state by `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Both `state` and `props` received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with `state`.

The second parameter to `setState()` is an optional callback function that will be executed once `setState` is completed and the component is re-rendered. Generally we recommend using `componentDidUpdate()` for such logic instead.

You may optionally pass an object as the first argument to `setState()` instead of a function:

```javascript
setState(stateChange[, callback])
```

This performs a shallow merge of `stateChange` into the new state, e.g., to adjust a shopping cart item quantity:

```javascript
this.setState({quantity: 2})
```

This form of `setState()` is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the current state, we recommend using the updater function form, instead:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

For more detail, see:

* [State e Lifecycle](/docs/state-and-lifecycle.html)
* [In depth: When and why are `setState()` calls batched?](https://stackoverflow.com/a/48610973/458193)
* [In depth: Why isn't `this.state` updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

By default, when your component's state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell React that the component needs re-rendering by calling `forceUpdate()`.

Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`. This will trigger the normal lifecycle methods for child components, including the `shouldComponentUpdate()` method of each child. React will still only update the DOM if the markup changes.

Normally you should try to avoid all uses of `forceUpdate()` and only read from `this.props` and `this.state` in `render()`.

* * *

## Class Properties {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` can be defined as a property on the component class itself, to set the default props for the class. This is used for undefined props, but not for null props. For example:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

If `props.color` is not provided, it will be set by default to `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

If `props.color` is set to null, it will remain null:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName` {#displayname}

The `displayName` string is used in debugging messages. Usually, you don't need to set it explicitly because it's inferred from the name of the function or class that defines the component. You might want to set it explicitly if you want to display a different name for debugging purposes or when you create a higher-order component, see [Wrap the Display Name for Easy Debugging](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) for details.

* * *

## Instance Properties {#instance-properties-1}

### `props` {#props}

`this.props` contains the props that were defined by the caller of this component. See [Componenti e Props](/docs/components-and-props.html) for an introduction to props.

In particular, `this.props.children` is a special prop, typically defined by the child tags in the JSX expression rather than in the tag itself.

### `state` {#state}

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

If some value isn't used for rendering or data flow (for example, a timer ID), you don't have to put it in the state. Such values can be defined as fields on the component instance.

See [State e Lifecycle](/docs/state-and-lifecycle.html) for more information about the state.

Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.
