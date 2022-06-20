---
id: lists-and-keys
title: Liste e Chiavi
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Prima di iniziare, rivediamo come trasformare le liste in JavaScript.

Nel codice qui sotto, usiamo la funzione [`map()`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/map) per prendere un array di `numeri` e raddoppiarne i valori. Assegniamo il nuovo array restituito da `map()` alla variabile `lista` e lo stampiamo a console:

```javascript{2}
const numeri = [1, 2, 3, 4, 5];
const lista = numeri.map((numero) => numero * 2);
console.log(lista);
```

Questo codice mostra `[2, 4, 6, 8, 10]` nella console.

Trasformare array in liste di [elementi](/docs/rendering-elements.html) con React è quasi identico.

### Renderizzare Liste di Componenti {#rendering-multiple-components}

Puoi creare liste di elementi e [usarle in JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) usando le parentesi graffe `{}`.

Di seguito, eseguiamo un ciclo sull'array `numeri` usando la funzione JavaScript [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Ritorniamo un elemento `<li>` per ogni elemento dell'array. Infine, assegniamo l'array risultante a `lista`:

```javascript{2-4}
const numeri = [1, 2, 3, 4, 5];
const lista = numeri.map((numero) =>
  <li>{numero}</li>
);
```

<<<<<<< HEAD
Includiamo l'intero array `lista` all'interno di un elemento `<ul>` e [lo renderizziamo nel DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{lista}</ul>,
  document.getElementById('root')
);
=======
Then, we can include the entire `listItems` array inside a `<ul>` element:

```javascript{2}
<ul>{listItems}</ul>
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
```

**[Prova su CodeSandbox](codesandbox://lists-and-keys/1.js)**

Questo codice visualizza un elenco puntato di numeri da 1 a 5.

### Semplice Componente Lista {#basic-list-component}

È comune voler renderizzare liste all'interno di un [componente](/docs/components-and-props.html).

Possiamo rifattorizzare l'esempio precedente in un componente che accetta un array di `numeri` e produce un elenco di elementi.

```javascript{3-5,7,13}
function ListaNumeri(props) {
  const numeri = props.numeri;
  const lista = numeri.map((numero) =>
    <li>{numero}</li>
  );
  return (
    <ul>{lista}</ul>
  );
}

<<<<<<< HEAD
const numeri = [1, 2, 3, 4, 5];
ReactDOM.render(
  <ListaNumeri numeri={numeri} />,
  document.getElementById('root')
);
=======
const numbers = [1, 2, 3, 4, 5];
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NumberList numbers={numbers} />);
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
```

Quando esegui questo codice, appare un _warning_ che una chiave (`key`) deve essere fornita per gli elementi della lista. Una "chiave" è una prop speciale di tipo stringa che devi includere quando crei liste di elementi. Discuteremo perché è importante nella prossima sezione.

Assegniamo una `key` ai nostri elementi della lista all'interno di `numeri.map()` e risolviamo il problema della chiave mancante.

```javascript{4}
function ListaNumeri(props) {
  const numeri = props.numeri;
  const lista = numeri.map((numero) =>
    <li key={numero.toString()}>
      {numero}
    </li>
  );
  return (
    <ul>{lista}</ul>
  );
}
<<<<<<< HEAD

const numeri = [1, 2, 3, 4, 5];
ReactDOM.render(
  <ListaNumeri numeri={numeri} />,
  document.getElementById('root')
);
=======
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
```

**[Prova su CodeSandbox](codesandbox://lists-and-keys/2.js)**

## Chiavi {#keys}

Le chiavi aiutano React a identificare quali elementi sono stati aggiornati, aggiunti o rimossi. Le chiavi dovrebbero essere fornite agli elementi all'interno dell'array per dare agli elementi un'identità stabile:

```js{3}
const numeri = [1, 2, 3, 4, 5];
const lista = numeri.map((numero) =>
  <li key={numero.toString()}>
    {numero}
  </li>
);
```

Il modo migliore per scegliere una chiave è utilizzare una stringa che identifichi univocamente un elemento della lista tra i suoi elementi adiacenti (_siblings_). L'esempio più comune è usare gli identificativi dei tuoi dati come chiavi:

```js{2}
const listaArticoli = articoli.map((articolo) =>
  <li key={articolo.id}>
    {articolo.testo}
  </li>
);
```

Quando non disponi di identificativi stabili per gli elementi da renderizzare, puoi assegnare l'indice dell'elemento corrente alla chiave come ultima scelta:

```js{2,3}
const listaArticoli = articoli.map((articolo, indice) =>
  // Fallo solo se gli elementi non hanno identificativi stabili
  <li key={indice}>
    {articolo.testo}
  </li>
);
```

Non consigliamo di utilizzare gli indici per le chiavi se l'ordine degli elementi potrebbe cambiare. Potrebbe avere un impatto negativo sulle prestazioni e causare problemi con lo stato dei componenti. Leggi l'articolo di Robin Pokorny per una [spiegazione approfondita sugli impatti negativi dell'uso di un indice come chiave](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). React utilizza gli indici come chiavi se non assegni esplicitamente una chiave per renderizzare gli elementi.

Qui trovi una [spiegazione approfondita sul perché le chiavi sono necessarie](/docs/reconciliation.html#recursing-on-children) se vuoi saperne di più.

### Estrarre Componenti con Chiavi {#extracting-components-with-keys}

Le chiavi hanno senso solo nel contesto dell'array circostante.

Per esempio, se [estrai](/docs/components-and-props.html#extracting-components) un componente `Numero`, dovresti mantenere la chiave sugli elementi `<Numero />` nell'array piuttosto che su l'elemento `<li>` nel `Numero` stesso.

**Esempio: Errato Utilizzo della Chiave**

```javascript{4,5,14,15}
function Numero(props) {
  const valore = props.valore;
  return (
    // Sbagliato! Non è necessario specificare la chiave qui:
    <li key={valore.toString()}>
      {valore}
    </li>
  );
}

function ListaNumeri(props) {
  const numeri = props.numeri;
  const lista = numeri.map((numero) =>
    // Sbagliato! La chiave deve essere stata specificata qui:
    <Numero valore={numero} />
  );
  return (
    <ul>
      {lista}
    </ul>
  );
}
<<<<<<< HEAD

const numeri = [1, 2, 3, 4, 5];
ReactDOM.render(
  <ListaNumeri numeri={numeri} />,
  document.getElementById('root')
);
=======
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
```

**Esempio: Corretto Utilizzo della Chiave**

```javascript{2,3,9,10}
function Numero(props) {
  // Corretto! Non è necessario specificare la chiave qui:
  return <li>{props.valore}</li>;
}

function ListaNumeri(props) {
  const numeri = props.numeri;
  const lista = numeri.map((numero) =>
    // Corretto! La chiave deve essere specificata all'interno dell'array.
    <Numero key={numero.toString()} valore={numero} />
  );
  return (
    <ul>
      {lista}
    </ul>
  );
}
<<<<<<< HEAD

const numeri = [1, 2, 3, 4, 5];
ReactDOM.render(
  <ListaNumeri numeri={numeri} />,
  document.getElementById('root')
);
=======
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
```

**[Prova su CodeSandbox](codesandbox://lists-and-keys/3.js)**

È buona regola ricordarsi che gli elementi all'interno della chiamata `map()` hanno bisogno di chiavi.

### Le Chiavi Devono Essere Uniche Tra Gli Elementi Adiacenti {#keys-must-only-be-unique-among-siblings}

Chiavi usate all'interno degli array dovrebbero essere uniche tra gli elementi adiacenti. Tuttavia, non hanno bisogno di essere uniche a livello globale. Possiamo usare le stesse chiavi quando creiamo due array diversi:

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.articoli.map((articolo) =>
        <li key={articolo.id}>
          {articolo.titolo}
        </li>
      )}
    </ul>
  );
  const contenuto = props.articoli.map((articolo) =>
    <div key={articolo.id}>
      <h3>{articolo.titolo}</h3>
      <p>{articolo.testo}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {contenuto}
    </div>
  );
}

const articoli = [
  {id: 1, titolo: 'Ciao Mondo', testo: 'Benvenuto in imparando React!'},
  {id: 2, titolo: 'Installazione', testo: 'Puoi installare React usando npm.'}
];
<<<<<<< HEAD
ReactDOM.render(
  <Blog articoli={articoli} />,
  document.getElementById('root')
);
=======

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Blog posts={posts} />);
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
```

**[Prova su CodeSandbox](codesandbox://lists-and-keys/4.js)**

Le chiavi servono a React come suggerimento, ma non vengono passate ai componenti. Se hai bisogno di quel valore nel tuo componente, passalo come prop esplicitamente con un nome diverso:

```js{3,4}
const contenuto = articoli.map((articolo) =>
  <Articolo
    key={articolo.id}
    id={articolo.id}
    titolo={articolo.titolo} />
);
```

In questo esempio, il componente `Articolo` può leggere` props.id`, ma non `props.key`.

### Incorporare map() in JSX {#embedding-map-in-jsx}

Nell'esempio di prima abbiamo dichiarato una variabile separata `lista` e l'abbiamo usata nel codice JSX:

```js{3-6}
function ListaNumeri(props) {
  const numeri = props.numeri;
  const lista = numeri.map((numero) =>
    <Numero key={numero.toString()}
            valore={numero} />
  );
  return (
    <ul>
      {lista}
    </ul>
  );
}
```

JSX consente di [incorporare qualsiasi espressione](/docs/introducing-jsx.html#embedding-expressions-in-jsx) in parentesi graffe in modo da poter scrivere direttamente il risultato di `map()`:

```js{5-8}
function ListaNumeri(props) {
  const numeri = props.numeri;
  return (
    <ul>
      {numeri.map((numero) =>
        <Numero key={numero.toString()}
                valore={numero} />
      )}
    </ul>
  );
}
```

**[Prova su CodeSandbox](codesandbox://lists-and-keys/5.js)**

A volte questo codice risulta più chiaro, ma questa alternativa può anche essere abusata. Come in JavaScript, spetta a te decidere se vale la pena estrarre una variabile per ragioni di leggibilità del codice. Tieni presente che se vi sono troppi elementi _nested_ (ovvero: annidati) nel corpo `map()`, potrebbe essere arrivato il momento di [estrarre un componente](/docs/components-and-props.html#extracting-components).
