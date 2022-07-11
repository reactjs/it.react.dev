---
id: error-boundaries
title: Contenitori di Errori
permalink: docs/error-boundaries.html
---

In passato, gli errori JavaScript all'interno dei componenti causavano la corruzione dello stato interno di React e l'[emissione](https://github.com/facebook/react/issues/4026) di [errori](https://github.com/facebook/react/issues/8579) [criptici](https://github.com/facebook/react/issues/6895) nei rendering successivi. Questi errori erano sempre causati da un errore precedente nel codice dell'applicazione, ma React non forniva nessun modo per poterli gestire correttamente nei componenti e non poteva ripristinarli.


## Introduzione ai contenitori di errori {#introducing-error-boundaries}

Un errore JavaScript in una qualche parte della UI non dovrebbe rompere l'intera applicazione. Per risolvere questo problema, a partire dalla versione 16 di React, viene introdotto il concetto di "contenitore di errori (error boundary)".

I contenitori di errori sono componenti React che **catturano gli errori JavaScript in uno qualsiasi dei componenti figli nell'albero dei componenti, loggano gli errori e mostrano, all'utente, una UI di fallback** anziché mostrare il componente che ha causato l'errore. I contenitori di errore catturano gli errori durante il rendering, nei metodi del ciclo di vita di un componente e nei costruttori dell'intero albero di componenti sottostante.

> Nota
>
> I contenitori di errore non catturano gli errori di:
>
> * Gestore di eventi ([approfondisci](#how-about-event-handlers))
> * Codice asincrono (come ad esempio le callback `setTimeout` o `requestAnimationFrame`)
> * Rendering lato server
> * Errori sollevati all'interno del contenitore stesso (piuttosto che nei suoi figli)

Un componente basato su classe diventa un contenitore di errori se definisce uno, o entrambi, i metodi del ciclo di vita [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) e [`componentDidCatch()`](/docs/react-component.html#componentdidcatch). Utilizza `static getDerivedStateFromError()` per renderizzare una UI di fallback dopo che l'errore è stato sollevato. Utilizza `componentDidCatch()` per loggare informazioni sull'errore.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

Dopodiché lo si può utilizzare come un normalissimo componente:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

I contenitori di errore lavorano all'incirca come il `catch {}` di JavaScript, ma sottoforma di componente. Solamente i componenti di tipo classe possono essere contenitori di errori. In pratica, nella maggioranza dei casi, si vuole scrivere un contenitore di errori una sola volta, per poi riutilizzarlo ovunque nell'applicazione.

Da notare che **i contenitori di errori catturano gli errori solo nei componenti sottostanti nell'albero dei componenti**. Un contenitore di errori non può catturare errori all'interno di se stesso. Se un contenitore di errore fallisce mentre prova a renderizzare il messaggio di errore, l'errore viene propagato sopra di lui al più vicino contenitore di errori sopra di lui. Anche questo aspetto è molto simile a come funzione il blocco `catch {}` di JavaScript.

## Demo {#live-demo}

<<<<<<< HEAD
Guarda [questo esempio di dichiarazione e utilizzo di un contenitore di errori](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) fatto con [React 16](/blog/2017/09/26/react-v16.0.html).
=======
Check out [this example of declaring and using an error boundary](https://codepen.io/gaearon/pen/wqvxGa?editors=0010).
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e


## Dove si dichiarano i contenitori di errori? {#where-to-place-error-boundaries}

La granularità dei contenitori di errori è a discrezione dello sviluppatore. Potresti voler wrappare i componenti di rotte di primo livello facendo vedere un messaggio tipo "Qualcosa è andato storto" all'utente proprio come i framework lato server, spesso, gestiscono i crash. Potresti anche voler wrappare singoli widget all'interno di un contenitore di errori per proteggerli da crash che possono avvenire all'interno dell'applicazione.


## Nuovi comportamenti per errori non rilevati {#new-behavior-for-uncaught-errors}

Questi cambiamenti hanno un'importante implicazione. **A partire dalla versione 16 di React, gli errori che non vengono catturati da nessun contenitore di errori, porteranno allo smontaggio dell'intero albero dei componenti di React**.

Abbiamo discusso molto prima di prendere questa decisione ma, secondo la nostra esperienza è peggio lasciare una UI rotta piuttosto che rimuoverla completamente. Ad esempio, in prodotti come Messenger, lasciare visibile una UI rotta può portare qualcuno a mandare un messaggio alla persona sbagliata. In modo simile, in un'applicazione di pagamenti è peggiore mostrare un importo sbagliato piuttosto che non far vedere nulla.

Questi cambiamenti significano che se migrate verso React 16 probabilmente scoprirete, all'interno della vostra applicazione, dei crash che prima venivano ignorati. Aggiungere contenitori di errori vi aiuta a fornire una migliore user experience quando qualcosa va storto.

Ad esempio Facebook Messenger wrappa il contenuto della barra laterale, del pannello informativo, delle conversazioni e dei messaggi di input in contenitori di errori separati. Se qualche componente in una delle precedenti aree si rompe, il resto dell'applicazione rimane comunque interattiva.

Vi incoraggiamo inoltre ad utilizzare dei servizi JavaScript di reportistica (o costruitene una personalizzata) cosicché da capire che tipo di eccezioni vengono sollevate in produzione, e che non vengono catturate, e fixarle.


## Stack trace dei componenti {#component-stack-traces}

La versione 16 di React stampa tutti gli errori, che vengono sollevati durante il rendering, nella console degli sviluppatori, anche se l'applicazione accidentamente li nasconde. Oltre al messaggio di errore, e allo stack JavaScript, React 16 fornisce anche lo stack trace dei componenti. Si può vedere esattamente dove, nell'albero dei componenti, sta l'errore:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Error caught by Error Boundary component">

E' anche possibile vedere i nomi dei file e i numeri di linea nello stack trace del componente. Questo è il comportamento di default nei progetti creati con [Create React App](https://github.com/facebookincubator/create-react-app):

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error caught by Error Boundary component with line numbers">

Se avete creato l'applicazione senza usare Create React App, potete usare [questo plugin](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx-source) da aggiungere, manualmente, alla configurazione Babel. Tieni presente che tutto ciò vale solo per l'ambiente di sviluppo e **deve essere disabilitato in produzione**.

> Nota
>
> I nomi dei componenti visualizzati nello stack trace dipendono dalla proprietà [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name). Se fornite supporto a browser vecchi che non forniscono questa cosa nativamente (come ad esempio IE 11), potete prendere in considerazione di includere il polyfill `Function.name` all'interno del bundle dell'applicazione, come ad esempio [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). Alternativamente possiamo, esplicitamente, settare la proprietà [`displayName`](/docs/react-component.html#displayname) su tutti i componenti.


## Che dire di try/catch? {#how-about-trycatch}

`try` / `catch` è ottimo ma funziona solo per codice imperativo:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

Tuttavia i componenti di React sono molto dichiarativi e specificano cosa deve essere renderizzato:

```js
<Button />
```

I contenitori di errore preservano la natura dichiarativa di React e si comportano esattamente come ci si aspetta. Ad esempio, anche se l'errore capita nel metodo `componentDidUpdate`, causato da `setState` sollevato da qualche parte in profondità nell'albero, continuerà a propagare correttamente l'errore al più vicino contenitore di errori.

## Che dire del gestore degli eventi? {#how-about-event-handlers}

I contenitori di errori **non catturano** gli errori all'interno dei gestori degli eventi.

React non ha necessità di contenitori di errori per i gestori degli eventi. A differenza dei metodi di render e dei metodi del ciclo di vita, i gestori degli eventi non si hanno durante il rendering. Quindi se questi lanciano un errore, React continua comunque a sapere cosa visualizzare sullo schermo.

Se hai bisogno di catturare un errore all'interno di un gestore degli eventi, utilizza il `try` / `catch` di JavaScript:

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

Notate che l'esempio di codice precedente mostra il regolare comportamento di JavaScript e non usa contenitori di errori.

## Cambiamenti di nome a partire da React 15 {#naming-changes-from-react-15}

La versione 15 di React include un limitato supporto per i contenitori di errori sotto diversi nomi: `unstable_handleError`. Questo metodo non funziona più e dovresti sostituirlo con `componentDidCatch` a partire dalla versione 16 beta.

Per questi cambiamenti, viene fornito [codemod](https://github.com/reactjs/react-codemod#error-boundaries) che automaticamente migra il tuo codice.
