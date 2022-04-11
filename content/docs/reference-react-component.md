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

Questa pagina contiene un riferimento dettagliato delle API della definizione della classe componente React. Viene dato per scontato che ti siano familiari i concetti fondamentali di React, come [Componenti e Props](/docs/components-and-props.html), così come [State e Lifecycle](/docs/state-and-lifecycle.html). Se non è così, studiali prima di proseguire.

## Panoramica {#overview}

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

Ogni componente ha numerosi "metodi del lifecycle" (metodi del ciclo di vita) che puoi sovrascrivere per eseguire del codice in momenti particolari nel processo. **Puoi utilizzare [questo diagramma del lifecycle](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) come riferimento.** Nella lista più in basso, i metodi del lifecycle più frequentemente utilizzati sono evidenziati in **grassetto**. Gli altri metodi non evidenziati esistono per casi d'uso relativamente rari.

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

#### Aggiornamento {#updating}

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

I metodi in questa sezione coprono la maggior parte dei casi d'uso che incontrerai durante la creazione di componenti React. **Come riferimento grafico, puoi utilizzare [questo diagramma del lifecycle](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

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

Il costruttore di un componente React è chiamato prima che il componente venga montato. Quando implementi il costruttore in una sottoclasse di `React.Component`, dovresti chiamare `super(props)` prima di ogni altra istruzione. In caso contrario, `this.props` rimarrebbe _undefined_ nel costruttore, il che può causare bug.

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
>Il problema è che questa soluzione non solo è superflua (puoi utilizzare direttamente `this.props.colore`) ma è anche causa di bug (gli aggiornamenti alla prop `colore` non verranno propagati allo stato, contrariamente a quanto si potrebbe erroneamente pensare).
>
>**Utilizza questo pattern solamente se vuoi intenzionalmente ignorare gli aggiornamenti delle props.** In quel caso, però, per rendere più comprensibile il codice ha senso rinominare la prop e chiamarla `coloreIniziale` o `coloreDefault`. A quel punto puoi costringere un componente a "resettare" il suo stato interno [cambiandone la `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) quando necessario.
>
>Leggi il [post del blog a proposito di come evitare lo stato derivato](/blog/2018/06/07/you-probably-dont-need-derived-state.html) per sapere cosa fare quando pensi di aver bisogno di far dipendere parti dello stato di un componente dalle sue props.


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` è invocato dopo che il componente è montato (cioè inserito nell'albero del DOM). Le logiche di inizializzazione che dipendono dai nodi del DOM dovrebbero essere dichiarate in questo metodo. Inoltre, se hai bisogno di caricare dei dati chiamando un endpoint remoto, questo è un buon punto per istanziare la chiamata.

Questo metodo è anche un buon punto in cui creare le sottoscrizioni. Se lo fai, non scordarti di cancellare in `componentWillUnmount()` tutte le sottoscrizioni create.

Puoi **chiamare `setState()` immediatamente** in `componentDidMount()`. Farlo scatenerà una richiesta di rendering aggiuntiva, che però verrà gestita prima che il browser aggiorni lo schermo. Questo garantisce che l'utente non visualizzi lo stato intermedio anche se il metodo `render()` viene chiamato due volte. Utilizza questo pattern con cautela in quanto spesso causa problemi di performance. Nella maggior parte dei casi, dovresti poter assegnare lo stato iniziale del componente nel `constructor()`. Tuttavia, potrebbe essere necessario utilizzare questo pattern in casi come i popup o i tooltip, in cui hai bisogno di misurare un nodo del DOM prima di renderizzare qualcosa che dipende dalla sua posizione o dalle sue dimensioni.

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

**Puoi chiamare `setState()` immediatamente** in `componentDidUpdate()` ma nota che la chiamata **deve sempre essere subordinata a un'espressione condizionale** come nell'esempio in alto, altrimenti causerai un loop infinito e una renderizzazione extra che, anche se non visibile dall'utente, può peggiorare la performance del componente. Se la tua intenzione è quella di "rispecchiare" nello stato una prop che viene dall'alto, valuta invece di utilizzare direttamente quella prop. Per saperne di più, leggi [perché copiare le props nello stato è fonte di bug](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

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

I metodi in questa sezione corrispondono a casi d'uso non comuni. Possono tornare utili qualche volta, ma la maggior parte dei tuoi componenti non dovrebbe averne bisogno. **Puoi visualizzare la maggior parte dei metodi descritti in questa sezione in questo [diagramma del lifecycle](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) se spunti il checkbox "Show less common lifecycles" ("Mostra i metodi del lifecycle meno comuni") in alto.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(propsSuccessive, stateSuccessivo)
```

Utilizza `shouldComponentUpdate()` per informare React del fatto che l'output di un componente non è influenzato dall'attuale modifica dello state o delle props. Il comportamento predefinito di React è quello di ri-renderizzare un componente ogni volta che lo stato cambia e nella stragrande maggioranza dei casi dovresti affidarti a questo comportamento.

`shouldComponentUpdate()` è invocato prima della renderizzazione, quando il componente sta ricevendo nuove proprietà o un nuovo stato. Il risultato di default restituito dal metodo è `true`. Questo metodo non è chiamato durante la renderizzazione del componente oppure quando viene utilizzato il metodo `forceUpdate()`.

Questo metodo esiste al solo scopo di **[ottimizzare la performance](/docs/optimizing-performance.html).** Non devi utilizzarlo per "prevenire" una renderizzazione, in quanto questo può essere causa di bug. **Valuta se utilizzare la classe predefinita [`PureComponent`](/docs/react-api.html#reactpurecomponent)** invece di scrivere `shouldComponentUpdate()` a mano. `PureComponent` effettua una comparazione "shallow" delle props e dello state e riduce il rischio di saltare erroneamente un aggiornamento necessario.

Se sei sicuro di voler scrivere a mano il metodo, puoi comparare `this.props` con `propsSuccessive` e `this.state` con `stateSuccessivo` e restituire `false` per comunicare a React che l'aggiornamento può essere saltato. Nota che restituire `false` non impedisce ai componenti figli di essere ri-renderizzati quando il *loro* stato cambia.

Non raccomandiamo di effettuare comparazioni "deep" o di utilizzare `JSON.stringify()` in `shouldComponentUpdate()`. Farlo è molto inefficiente e peggiorerà sicuramente la performance del componente.

Attualmente, quando `shouldComponentUpdate()` restituisce `false`, i metodi [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), e [`componentDidUpdate()`](#componentdidupdate) non vengono invocati. In futuro, React potrebbe però considerare il risultato di `shouldComponentUpdate()` semplicemente come un suggerimento, e non un ordine tassativo, nel cui caso restituire `false` potrebbe comunque risultare in una nuova renderizzazione del componente.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` è invocato subito prima di chiamare `render`, sia durante il montaggio iniziale del componente che negli aggiornamenti successivi. Dovrebbe restituire un oggetto per aggiornare lo stato, oppure `null` per non effettuare aggiornamenti.

Questo metodo esiste per [rari casi d'uso](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) in cui lo stato dipende da cambiamenti delle proprietà nel corso del tempo. Ad esempio, potrebbe tornare utile per implementare un componente `<Transizione>` che compara i suoi figli precedenti e successivi per decidere quali di essi far comparire o sparire con un'animazione.

Derivare lo stato è spesso causa di codice verboso e rende difficile la gestione dei tuoi componenti.
[Assicurati di familiarizzare con alternative più semplici:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* Se hai bisogno di **causare un effetto collaterale** (ad esempio una richiesta di dati o un'animazione) in risposta a un cambiamento nelle props, utilizza invece il metodo del lifecycle [`componentDidUpdate`](#componentdidupdate).

* Se vuoi **ricalcolare alcuni dati solo quando una prop cambia**, [utilizza un "memoization helper" (helper di memoizzazione)](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* Se vui **"resettare" lo stato quando una prop cambia**, valuta invece se rendere il componente [completamente controllato](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) oppure [completamente non controllato con una `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

Questo metodo non ha accesso all'istanza del componente. Se vuoi, puoi riutilizzare parti del codice di `getDerivedStateFromProps()` e di altri metodi di classe dichiarando, all'esterno della definizione della classe del componente, funzioni pure che accettano come argomenti le props e lo state.

Nota che questo metodo viene chiamato *ogni volta* che viene effettuato un render, a prescindere dalla causa. Al contrario, `UNSAFE_componentWillReceiveProps` viene invocato solo quando il parent causa la ri-renderizzazione e non quando quest'ultima è il risultato di una chiamata a `setState` all'interno del componente stesso.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(propsPrecedenti, statePrecedente)
```

`getSnapshotBeforeUpdate()` è invocato subito prima che il più recente output della renderizzazione sia consolidato ad esempio nel DOM. Permette al tuo componente di catturare informazioni riguardo al DOM (e.g. la posizione dello scroll) prima che avvenga un potenziale cambiamento. Qualsiasi valore restituito da questo metodo del lifecycle verrà passato come parametro a `componentDidUpdate()`.

Questo caso d'uso non è comune, ma potrebbe verificarsi in UI come i canali delle chat, che hanno bisogno di gestire la posizione dello scroll in modo speciale.

Il metodo dovrebbe restituire un valore di "snapshot" (o `null`).

Ad esempio:

`embed:react-component-reference/get-snapshot-before-update.js`

Nell'esempio qui sopra, è importante leggere la proprietà `scrollHeight` in `getSnapshotBeforeUpdate` perché potrebbero verificarsi ritardi fra i metodi del lifecycle che appartengono alla fase della renderizzazione (come `render`) e i metodi che appartengono alla fase del "consolidamento" (come `getSnapshotBeforeUpdate` e `componentDidUpdate`).

* * *

### Contenitori di Errori {#error-boundaries}

I [Contenitori di Errori](/docs/error-boundaries.html) sono componenti React che si occupano di catturare gli errori JavaScript in qualunque punto nell'albero dei loro componenti figli, loggarli e visualizzare una UI di ripiego invece dell'albero di componenti che si è rotto. I Contenitori di Errori catturano gli errori durante la renderizzazione, nei metodi del lifecycle e nei costruttori dell'intero albero sotto di loro.

Un componente classe diventa un contenitore di errori se definisce uno (o entrambi) dei metodi del lifecycle `static getDerivedStateFromError()` o `componentDidCatch()`. Aggiornare lo stato all'interno di questi metodi del lifecycle ti consente di catturare un errore JavaScript non gestito nell'albero più in basso e mostrare una UI di ripiego.

Utilizza i contenitori di errori solamente per recuperare errori inaspettati; **non utilizzarli per il controllo di flusso dell'applicazione.**

Per maggiori informazioni, vedi [*Gestione degli Errori in React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

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

Questo metodo del lifecycle è invocato dopo che un errore è stato sollevato da un componente discendente.
Riceve due parametri:

1. `error` - L'errore che è stato sollevato.
2. `info` - Un oggetto con una chiave `componentStack` che contiene [informazioni a proposito di quale componente ha sollevato l'errore](/docs/error-boundaries.html#component-stack-traces).


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

Le build di sviluppo e di produzione di React gestiscono in modo leggermente diverso come `componentDidCatch()` gestisce gli errori.

In sviluppo, gli errori effettuano il bubble up a `window`, ciò significa che ogni `window.onerror` o `window.addEventListener('error', callback)` intercetterà gli errori che sono colti da `componentDidCatch()`.

In produzione, invece, gli errori non effetuano il bubble up, il che signidica che ogni error handler antenato riceverà solamente gli errori esplicitamente non colti da `componentDidCatch()`.

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
> * Se hai utilizzato `componentWillReceiveProps` per **ricalcolare alcuni dati solamente quando una proprietà cambia**, [utilizza invece un helper di memoizzazione](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
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

## Altre API {#other-apis-1}

A differenza dei metodi del lifecycle descritti in alto (che React invoca automaticamente per te), quelli seguenti sono metodi che *tu* puoi chiamare nei tuoi componenti.

Sono solamente due: `setState()` e `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater, [callback])
```

`setState()` accoda modifiche allo stato del componente e comunica a React che il componente e i suoi figli devono essere ri-renderizzati con lo stato aggiornato. Questo è il metodo principale che puoi utilizzare per aggiornare l'interfaccia utente in risposta agli event handler e alle risposte del server.

<<<<<<< HEAD
Puoi pensare a `setState()` come a una *richiesta* e non a un ordine immediato di aggiornare il componente. Per migliorare la performance percepita, React potrebbe ritardare l'aggiornamento, per poi aggiornare molti componenti in un sol colpo. React non garantisce che i cambiamenti allo stato vengano applicati immediatamente.
=======
Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. In the rare case that you need to force the DOM update to be applied synchronously, you may wrap it in [`flushSync`](/docs/react-dom.html#flushsync), but this may hurt performance.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

`setState()` non aggiorna sempre immediatamente il componente. Potrebbe accorpare o ritardare l'aggiornamento. Di conseguenza, leggere il valore di `this.state` subito dopo aver chiamato `setState()` è potenzialmente un errore. Invece di farlo, utilizza `componentDidUpdate` oppure una callback di `setState` (`setState(updater, callback)`). React garantisce che entrambe queste funzioni vengano chiamate dopo che l'aggiornamento è stato applicato. Se hai bisogno di impostare lo stato basandoti sullo stato precedente, leggi la parte riguardante l'argomento `updater` più in basso.

`setState()` causerà sempre una ri-renderizzazione a meno che `shouldComponentUpdate()` restituisca `false`. Se stai utilizzando oggetti mutabili e non puoi implementare una logica di renderizzazione condizionale in `shouldComponentUpdate()`, chiamare `setState()` solo quando il nuovo stato è effettivamente diverso dal precedente eviterà renderizzazioni non necessarie

Il primo argomento è una funzione `updater` ("aggiornatrice") con la seguente firma:

```javascript
(state, props) => cambiamentoState
```

`state` è un riferimento allo stato del componente nel momento in cui il cambiamento sta venendo applicato. Non dovrebbe mai essere mutato direttamente. Piuttosto, gli aggiornamenti dovrebbero essere rappresentati costruendo un nuovo oggetto basato sull'input di `state` e `props`. Ad esempio, supponiamo di voler incrementare un valore nello stato a seconda del valore di `props.intervallo`:

```javascript
this.setState((state, props) => {
  return {counter: state.contatore + props.intervallo};
});
```

I valori di `state` e `props` ricevuti dalla funzione updater sono sicuramente aggiornati. Il risultato restituito dall'updater viene applicato a `state` con uno shallow merge.

Il secondo parametro di `setState()` è una callback opzionale che verrà chiamata automaticamente una volta che `setState` è stato completato e il componente è stato ri-renderizzato. In generale, ti raccomandiamo di utilizzare `componentDidUpdate()` a questo scopo.

Puoi anche passare un oggetto come primo argomento di `setState()`, invece che una funzione:

```javascript
setState(cambiamentoState[, callback])
```

In questo caso viene eseguito direttamente uno shallow merge di `cambiamentoState` nel nuovo stato, ad esempio per modificare la quantità di un prodotto in un carrello della spesa:

```javascript
this.setState({quantita: 2})
```

Anche questa variante di `setState()` è asincrona, e chiamate successive durante lo stesso ciclo potrebbero essere accorpate. Ad esempio, se provi ad aumentare la quantità di un prodotto in un carrello più di una volta nello stesso ciclo, otterrai lo stesso effetto di:

```javaScript
Object.assign(
  previousState,
  {quantita: state.quantita + 1},
  {quantita: state.quantita + 1},
  ...
)
```

Le chiamate successive sovrascriveranno i valori delle chiamate precedenti nello stesso ciclo, quindi la quantità verrà incrementata una volta sola. Se lo stato successivo dipende dallo stato corrente, ti raccomandiamo la variante che utilizza la funzione updater:

```js
this.setState((state) => {
  return {quantita: state.quantita + 1};
});
```

Per maggiori dettagli, leggi:

* [State e Lifecycle](/docs/state-and-lifecycle.html)
* [Approfondimento: Quando e come le chiamate a `setState()` vengono accorpate?](https://stackoverflow.com/a/48610973/458193)
* [Approfondimento: Perché `this.state` non viene aggiornato immediatamente?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

Per definizione, quando lo state o le props del tuo componente cambiano, il componente verrà ri-renderizzato. Se il tuo metodo `render()` dipende da qualche altro dato, puoi informare React del fatto che il componente ha bisogno di essere ri-renderizzato chiamando il metodo `forceUpdate()`.

Chiamare `forceUpdate()` farà sì che il metodo `render()` del componente venga subito chiamato, saltando `shouldComponentUpdate()`. Questo attiverà normalmente tutti i metodi del lifecycle dei componenti figli, incluso il metodo `shouldComponentUpdate()` di ciascun figlio. React continuerà ad aggiornare il DOM come al solito solamente se il markup cambia.

Normalmente dovresti cercare di evitare tutti i casi d'uso in cui ti trovi nella necessità di utilizzare `forceUpdate()` ed utilizzare solamente i valori di `this.props` e `this.state` nel metodo `render()`.

* * *

## Proprietà della Classe {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` può essere definita come una proprietà della classe componente stessa, allo scopo di impostare i valori predefiniti delle props della classe. Questo è possibile per le props `undefined`, ma non per le props `null`. Ad esempio:

```js
class BottonePersonalizzato extends React.Component {
  // ...
}

BottonePersonalizzato.defaultProps = {
  colore: 'blu'
};
```

Se `props.colore` non è fornito dall'esterno, verrà automaticamente valorizzato con il valore `'blu'`:

```js
  render() {
    return <BottonePersonalizzato /> ; // props.colore verrà impostato a blu
  }
```

Se `props.colore` viene impostato a `null`, il suo valore sarà effettivamente `null`:

```js
  render() {
    return <BottonePersonalizzato colore={null} /> ; // props.colore resterà nullo
  }
```

* * *

### `displayName` {#displayname}

La stringa `displayName` è utilizzata nei messaggi di debug. Di solito, non hai bisogno di impostarla in quanto viene derivata automaticamente dal nome della funzione o della classe che definisce il componente. Potresti avere bisogno di impostarla esplicitamente se vuoi mostrare un nome diverso per ragioni di debug oppure se crei un componente di ordine superiore, come descritto dettagliatamente in [Wrap the Display Name for Easy Debugging](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging).

* * *

## Proprietà dell'Istanza {#instance-properties-1}

### `props` {#props}

`this.props` contiene le props che erano state definite da chi ha chiamato il componente. Leggi [Componenti e Props](/docs/components-and-props.html) per un'introduzione alle props.

In particolare, `this.props.children` è una proprietà speciale, tipicamente definita dai tag figli nelle espressioni JSX piuttosto che nel tag stesso.

### `state` {#state}

Lo state contiene i dati specifici del componente che potrebbero cambiare nel tempo. Lo stato è definito dall'utente e dovrebbe essere un semplice oggetto JavaScript.

Se un valore non è utilizzato per la renderizzazione o per il flusso dei dati (ad esempio, l'ID di un timer), non c'è bisogno di includerlo nello state. Questi valori possono semplicemente essere definiti come campi nell'istanza del componente.

Leggi [State e Lifecycle](/docs/state-and-lifecycle.html) per maggiori informazioni a proposito dello stato.

Non mutare mai direttamente `this.state`, in quanto chiamate successive a `setState()` potrebbero sovrascrivere la mutazione che hai effettuato. Tratta `this.state` come se fosse immutabile.
