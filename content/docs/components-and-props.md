---
id: components-and-props
title: Componenti e Props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

I Componenti ti permettono di suddividere la UI (*User Interface*, o interfaccia utente) in parti indipendenti, riutilizzabili e di pensare ad ognuna di esse in modo isolato. Questa pagina offre una introduzione al concetto dei componenti. Puoi trovare invece informazioni dettagliate nella [API di riferimento dei componenti](/docs/react-component.html).

Concettualmente, i componenti sono come funzioni JavaScript: accettano in input dati arbitrari (sotto il nome di "props") e ritornano elementi React che descrivono cosa dovrebbe apparire sullo schermo.

## Funzioni e Classi Componente {#function-and-class-components}

Il modo più semplice di definire un componente è quello di scrivere una funzione JavaScript:

```js
function Ciao(props) {
  return <h1>Ciao, {props.nome}</h1>;
}
```

Questa funzione è un componente React valido in quanto accetta un oggetto parametro contenente dati sotto forma di una singola "props" (che prende il nome da "properties" in inglese, ossia "proprietà") che è un oggetto parametro avente dati al suo interno e ritorna un elemento React. Chiameremo questo tipo di componenti "componenti funzione" perché sono letteralmente funzioni JavaScript.

Puoi anche usare una [classe ES6](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Classes) per definire un componente:

```js
class Ciao extends React.Component {
  render() {
    return <h1>Ciao, {this.props.nome}</h1>;
  }
}
```

I due componenti appena visti sono equivalenti dal punto di vista di React.

Le Classi e i Componenti Funzione hanno funzionalità aggiuntive che verranno discusse in dettaglio nelle [prossime sezioni](/docs/state-and-lifecycle.html).

## Renderizzare un Componente {#rendering-a-component}

In precedenza, abbiamo incontrato elementi React che rappresentano tags DOM:

```js
const elemento = <div />;
```

Comunque, gli elementi possono rappresentare anche componenti definiti dall'utente:

```js
const elemento = <Ciao nome="Sara" />;
```

Quando React incontra un elemento che rappresenta un componente definito dall'utente, passa gli attributi JSX ed i figli a questo componente come un singolo oggetto. Tale oggetto prende il nome di "props".

Ad esempio, il codice seguente renderizza il messaggio "Ciao, Sara" nella pagina:

<<<<<<< HEAD
```js{1,5}
function Ciao(props) {
  return <h1>Ciao, {props.nome}</h1>;
}

const elemento = <Ciao nome="Sara" />;
ReactDOM.render(
  elemento,
  document.getElementById('root')
);
=======
```js{1,6}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <Welcome name="Sara" />;
root.render(element);
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
```

**[Try it on CodePen](https://codepen.io/gaearon/pen/YGYmEG?editors=1010)**

Ricapitoliamo cosa succede nell'esempio:

<<<<<<< HEAD
1. Richiamiamo `ReactDOM.render()` con l'elemento `<Ciao nome="Sara" />`.
2. React chiama a sua volta il componente `Ciao` con `{nome: 'Sara'}` passato in input come props.
3. Il nostro componente `Ciao` ritorna un elemento `<h1>Ciao, Sara</h1>` come risultato.
4. React DOM aggiorna efficientemente il DOM per far sì che contenga `<h1>Ciao, Sara</h1>`.
=======
1. We call `root.render()` with the `<Welcome name="Sara" />` element.
2. React calls the `Welcome` component with `{name: 'Sara'}` as the props.
3. Our `Welcome` component returns a `<h1>Hello, Sara</h1>` element as the result.
4. React DOM efficiently updates the DOM to match `<h1>Hello, Sara</h1>`.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

>**Nota Bene:** Ricordati di chiamare i tuoi componenti con la prima lettera in maiuscolo.
>
>React tratta i componenti che iniziano con una lettera minuscola come normali tags DOM. per esempio, `<div />` rappresenta un tag HTML div,  `<Ciao />` rappresenta invece un componente e richiede `Ciao` all'interno dello [scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope).
>
>Per saperne di più riguardo questa convenzione, leggi [JSX In Dettaglio](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

## Comporre Componenti {#composing-components}

I componenti possono far riferimento ad altri componenti nel loro output. Ciò permette di utilizzare la stessa astrazione ad ogni livello di dettaglio. Un bottone, un form, una finestra di dialogo, una schermata: nelle applicazioni React, tutte queste cose di solito sono espresse come componenti.

Per esempio, possiamo creare un componente `App` che renderizza `Ciao` tante volte:

```js{8-10}
function Ciao(props) {
  return <h1>Ciao, {props.nome}</h1>;
}

function App() {
  return (
    <div>
      <Ciao nome="Sara" />
      <Ciao nome="Cahal" />
      <Ciao nome="Edite" />
    </div>
  );
}
```

**[Try it on CodePen](https://codepen.io/gaearon/pen/KgQKPr?editors=1010)**

Normalmente, le nuove applicazioni React hanno un singolo componente chiamato `App` al livello più alto che racchiude tutti gli altri componenti. Ad ogni modo, quando si va ad integrare React in una applicazione già esistente, è bene partire dal livello più basso e da piccoli componenti come ad esempio `Bottone` procedendo da lì fino alla cima della gerarchia della vista.

## Estrarre Componenti {#extracting-components}

Non aver paura di suddividere i componenti in componenti più piccoli.

Ad esempio, considera questo componente `Commento`:

```js
function Commento(props) {
  return (
    <div className="Commento">
      <div className="InfoUtente">
        <img className="Avatar"
          src={props.autore.avatarUrl}
          alt={props.autore.nome}
        />
        <div className="InfoUtente-nome">
          {props.autore.nome}
        </div>
      </div>
      <div className="Commento-testo">
        {props.testo}
      </div>
      <div className="Commento-data">
        {formatDate(props.data)}
      </div>
    </div>
  );
}
```

**[Try it on CodePen](https://codepen.io/gaearon/pen/VKQwEo?editors=1010)**

Esso accetta come props: `autore` (un oggetto), `testo` (una stringa) e `data` (sotto forma di oggetto [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)) al fine di renderizzare un commento in un sito di social media, come Facebook.

Un componente scritto in quel modo, con codice molto annidato, è difficile da modificare. Per lo stesso motivo, non si possono riutilizzare con facilità parti dello stesso. Procediamo quindi ad estrarre qualche componente.

Per cominciare, estraiamo `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.utente.avatarUrl}
      alt={props.utente.nome}
    />
  );
}
```

`Avatar` non ha bisogno di sapere che viene renderizzato all'interno di un `Commento`. Ecco perché abbiamo dato alla sua prop un nome più generico: `utente` al posto di `autore`.

Consigliamo di dare il nome alle props dal punto di vista del componente piuttosto che dal contesto in cui viene usato.

Adesso possiamo semplificare un po' il componente `Commento`:

```js{5}
function Commento(props) {
  return (
    <div className="Commento">
      <div className="InfoUtente">
        <Avatar utente={props.autore} />
        <div className="InfoUtente-nome">
          {props.autore.nome}
        </div>
      </div>
      <div className="Commento-testo">
        {props.testo}
      </div>
      <div className="Commento-data">
        {formatDate(props.data)}
      </div>
    </div>
  );
}
```

Andiamo ora ad estrarre il componente `InfoUtente` che renderizza un `Avatar` vicino al nome dell'utente:

```js{3-8}
function InfoUtente(props) {
  return (
    <div className="InfoUtente">
      <Avatar utente={props.utente} />
      <div className="InfoUtente-nome">
        {props.utente.nome}
      </div>
    </div>
  );
}
```

Ciò ci permette di semplificare `Commento` ancora di più:

```js{4}
function Commento(props) {
  return (
    <div className="Commento">
      <InfoUtente utente={props.autore} />
      <div className="Commento-testo">
        {props.testo}
      </div>
      <div className="Commento-data">
        {formatDate(props.data)}
      </div>
    </div>
  );
}
```

**[Try it on CodePen](https://codepen.io/gaearon/pen/rrJNJY?editors=1010)**

Estrarre componenti può sembrare un'attività pesante ma avere una tavolozza di componenti riutilizzabili ripaga molto bene nelle applicazioni più complesse. Una buona regola da tenere a mente è che se una parte della tua UI viene usata diverse volte (`Bottone`, `Pannello`, `Avatar`) o se è abbastanza complessa di per sé (`App`, `StoriaFeed`, `Commento`), allora questi componenti sono buoni candidati per essere estratti come componenti separati.

## Le Props Sono in Sola Lettura {#props-are-read-only}

Ogni volta che dichiari un componente [come funzione o classe](#function-and-class-components), non deve mai modificare le proprie props. Considera la funzione `somma`:

```js
function somma(a, b) {
  return a + b;
}
```

Funzioni di questo tipo vengono chiamate ["pure"](https://en.wikipedia.org/wiki/Pure_function) perché non provano a cambiare i propri dati in input, ritornano sempre lo stesso risultato a partire dagli stessi dati in ingresso.

Al contrario, la funzione seguente è impura in quanto altera gli input:

```js
function preleva(conto, ammontare) {
  conto.totale -= ammontare;
}
```

React è abbastanza flessibile ma ha una sola regola molto importante:

**Tutti i componenti React devono comportarsi come funzioni pure rispetto alle proprie props.**

Ovviamente, le UI delle applicazioni sono dinamiche e cambiano nel tempo. Nella [prossima sezione](/docs/state-and-lifecycle.html), introdurremo il nuovo concetto di "stato". Lo stato permette ai componenti React di modificare il loro output nel tempo in seguito ad azioni dell'utente, risposte dalla rete (API) e qualsiasi altra cosa possa far renderizzare un output diverso di volta in volta, ciò avviene senza violare questa regola molto importante.
