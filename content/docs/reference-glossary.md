---
id: glossary
title: Glossary of React Terms
layout: docs
category: Reference
permalink: docs/glossary.html

---

## Applicazione Single-page {#single-page-application}

Un'applicazione single-page è un'applicazione che carica una singola pagina HTML e tutte le risorse necessarie (quali Javascript e CSS) per consentirne l'esecuzione. Qualunque interazione con la pagina o con le pagine successive non richiede un'interrogazione al server il che significa che la pagina non viene ricaricata.

Sebbene tu possa creare applicazioni single-page in React, questo non rappresenta un requisito. React può anche essere usato per migliorare piccole parti di un sito già esistente aggiungendo ulteriore interattività. Il codice scritto in React può coesistere tranquillamente con un markup renderizzato dal server tramite qualcosa di simile a PHP, o con altre librerie lato client. Infatti, questo è esattamente il modo in cui React viene utilizzato in Facebook.

## ES6, ES2015, ES2016, ecc {#es6-es2015-es2016-etc}

Tutti questi acronimi si riferiscono alle versioni più recenti dello standard ECMAScript Language Specification, di cui il linguaggio JavaScript è un'implementazione. La versione ES6 (nota anche come ES2015) include molte aggiunte rispetto alle versioni precedenti, ad esempio: arrow functions, classi, stringhe template, istruzioni `let` e `const`. Puoi scoprire di più riguardo le versioni specifiche [qui](https://en.wikipedia.org/wiki/ECMAScript#Versions).

## Compilatori {#compilers}

Un compilatore JavaScript prende il codice JavaScript, lo trasforma e ritorna codice JavaScript in un formato differente. Il caso d'uso più comune è quello di prendere un codice con sintassi ES6 e trasformarlo in uno con sintassi che può essere interpretata da browser più vecchi. [Babel](https://babeljs.io/) è il compilatore più comunemente usato con React. 

## Bundlers {#bundlers}

I bundlers prendono codice JavaScript e CSS scritto in moduli separati (spesso sono centinaia) e li raggruppa in alcuni file meglio ottimizzati per i browser. Tra i bundler più comunemente usati nelle applicazioni React troviamo [Webpack](https://webpack.js.org/) e [Browserify](http://browserify.org/).

## Gestori dei pacchetti {#package-managers}

I gestori dei pacchetti sono strumenti che ti consentono di gestire le dipendenze nel tuo progetto. [npm](https://www.npmjs.com/) e [Yarn](https://yarnpkg.com/) sono i due gestori dei pacchetti solitamente usati nelle applicazioni React. Entrambi sono client verso lo stesso registro dei pacchetti di npm.

## CDN {#cdn}

CDN sta per Content Delivery Network. Le CDN consegnano contenuto statico e in cache da una rete di server sparsi nel globo.

## JSX {#jsx}

JSX è un'estensione sintattica di JavaScript. E' simile ad un linguaggio template, ma possiede tutta la potenza di JavaScript. JSX viene compilato in chiamate a `React.createElement()` che ritornano oggetti JavaScript chiamati "elementi React". Per un'introduzione base a JSX [puoi leggere qui la documentazione](/docs/introducing-jsx.html) e trovare un tutorial più dettagliato su JSX [qui](/docs/jsx-in-depth.html).

Il DOM di React usa la convenzione camelCase sui nomi delle proprietà invece dei nomi degli attributi HTML. Per esempio, `tabindex` diventa `tabIndex` in JSX. Anche l'attributo `class` viene scritto come `className` dal momento che `class` è una parola riservata in JavaScript:

```jsx
<h1 className="hello">My name is Clementine!</h1>
```

## [Elementi](/docs/rendering-elements.html) {#elements}

Gli elementi React sono gli elementi costituenti delle applicazioni React. Si potrebbe confondere il concetto di elementi con quello maggiormente conosciuto di "componenti". Un elemento descrive quello che vuoi vedere sullo schermo. Gli elementi React sono immutabili.

```js
const element = <h1>Hello, world</h1>;
```

Tipicamente, gli elementi non sono usati direttamente, ma ritornati dai componenti.

## [Componenti](/docs/components-and-props.html) {#components}

I componenti React sono pezzi di codice piccoli e riusabili che ritornano un elemento React da renderizzare in pagina. La versione più semplice di un componente React è una funzione JavaScript che ritorna un elemento React:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

I componenti possono essere anche classi ES6:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

I componenti possono essere suddivisi in pezzi distinti di funzionalità e usati all'interno di altri componenti. I componenti possono ritornare altri componenti, array, stringhe e numeri. Una buona norma da seguire è che se una parte della tua UI viene usata diverse volte (Button, Panel, Avatar), o è di per sé sufficientemente complessa (App, FeedStory, Comment), allora risulterà un buon candidato per diventare un componente riusabile. I nomi dei componenti inoltre dovrebbero sempre partire con una lettera maiuscola (`<Wrapper />` **e non** `<wrapper />`). Vedi [questa documentazione](/docs/components-and-props.html#rendering-a-component) per maggiori informazioni sulla renderizzazione dei componenti.

### [`props`](/docs/components-and-props.html) {#props}

Le `props` sono gli input di un componente React. Vengono passati da un componente padre a un componente figlio.

Ricorda che le `props` sono di sola lettura. Non dovrebbero essere modificate in alcun modo:

```js
// Sbagliato!
props.number = 42;
```

Se hai bisogno di modificare alcuni valori in risposta a input dell'utente o una risposta di rete, usa `state`.

### `props.children` {#propschildren}

`props.children` è disponibile in ogni componente. Essa comprende il contenuto tra i tag di apertura e chiusura di un componente. Ad esempio:

```js
<Welcome>Hello world!</Welcome>
```

La stringa `Hello world!` è disponibile in `props.children` nel componente `Welcome`:

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

Per i componenti definiti come classi, usa `this.props.children`:

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

Un componente ha bisogno dello `state` quando alcuni dati associati con esso cambiano nel tempo. Per esempio, un componente `Checkbox` potrebbe aver bisogno di `isChecked` nel suo state, e un componente `NewsFeed` potrebbe voler tener traccia dei `fetchedPosts` nel suo state.

La differenza più importante tra `state` e `props` è che le `props` sono passate da un componente padre, ma lo `state` viene gestito dal componente stesso. Un componente non può cambiare le sue `props`, ma può cambiare il suo `state`.

Per ogni pezzo di dato che cambia, ci dovrebbe essere solo un componente che "possiede" tale dato nel suo state. Non provare a sincronizzare lo state di due componenti diversi. Invece, [sollevalo](/docs/lifting-state-up.html) verso l'antenato comune più vicino, e passalo come props ad entrambi.

## [Lifecycle Methods](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

I metodi del lifecycle sono funzionalità personalizzate che vengono eseguite durante le diverse fasi di un componente. Ci sono metodi disponibili quando il componente viene creato e inserito nel DOM ([montaggio](/docs/react-component.html#mounting)), quando il componente si aggiorna, e quando il componente viene smontato o rimosso dal DOM.

 ## [Componenti controllati](/docs/forms.html#controlled-components) vs. [Componenti non controllati](/docs/uncontrolled-components.html)

React ha due diversi approcci nel trattare gli input di un form.

Un elemento input di un form il cui valore è controllato da React viene chiamato *componente controllato*. Quando un utente inserisce dati all'interno di un componente controllato viene lanciato un gestore dell'evento change e il tuo codice deciderà se l'input è valido (ri-renderizzando con il valore aggiornato). Se non ri-renderizzi allora l'elemento del form rimarrà immutato.

Un *componente non controllato* funziona allo stesso modo degli elementi del form al di fuori di React. Quando un utente inserisce dati in un campo del form (una casella di input, una lista a cascata, ecc.) le informazioni aggiornate trovano riscontro senza che React abbia bisogno di fare nulla. Tuttavia, questo significa anche che non puoi forzare un campo ad avere un certo valore.

Nella maggior parte dei casi dovresti usare componenti controllati.

## [Chiavi](/docs/lists-and-keys.html) {#keys}

Una "chiave" è un attributo stringa speciale che hai bisogno di includere quando crei array di elementi. Le chiavi aiutano React ad identificare quali elementi sono cambiati, quali sono stati aggiunti, o quali sono stati rimossi. Le chiavi dovrebbero essere assegnate agli elementi all'interno di un array per dargli un'identità stabile.

Le chiavi necessitano solo di essere univoche tra gli elementi dello stesso array. Non c'è bisogno che siano univoche nell'intera applicazione o in un singolo componente.

Non passare cose come `Math.random()` alle chiavi. E' importante che le chiavi abbiano "un'identità stabile" tra le ri-renderizzazioni cosicché React possa determinare quali elementi sono stati aggiunti, rimossi, o riordinati. Idealmente, le chiavi dovrebbero corrispondere a identificatori stabili e univoci provenienti dai tuoi dati, come `post.id`.

## [Refs](/docs/refs-and-the-dom.html) {#refs}

React supporta un attributo speciale che puoi attaccare ad ogni componente. L'attributo `ref` può essere un oggetto creato dalla [funzione `React.createRef()`](/docs/react-api.html#reactcreateref) o una funzione di callback, o una stringa (nelle API legacy). Quando l'attributo `ref` è una funzione di callback, la funzione riceve l'elemento DOM sottostante o l'istanza di classe come argomento (a seconda del tipo di elemento). Questo ti consente di avere accesso diretto all'elemento del DOM o all'istanza del componente. 

Usa i refs con parsimonia. Se ti ritrovi a usare spesso i refs per "far funzionare le cose" nella tua app, comincia a prendere familiarità con il [flusso di dati top-down](/docs/lifting-state-up.html).

## [Eventi](/docs/handling-events.html) {#events}

La gestione degli eventi con gli elementi React ha alcune differenze sintattiche:

* I gestori degli eventi React sono dichiarati in camelCase, piuttosto che in minuscolo.
* Con JSX puoi passare una funzione come gestore degli eventi, piuttosto che una stringa.

## [Riconciliazione](/docs/reconciliation.html) {#reconciliation}

Quando una prop o lo stato di un componente cambia, React decide se è necessario effettuare un aggiornamento del DOM confrontando il nuovo elemento ritornato con quello precedentemente renderizzato. Quando non sono uguali, React aggiornerà il DOM. Questo processo viene chiamato "riconciliazione".
