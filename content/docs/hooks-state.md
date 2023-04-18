---
id: hooks-state
title: Usare l'Hook State
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
> - [`useState`](https://react.dev/reference/react/useState)

</div>

Gli *Hooks* sono stati aggiunti in React 16.8. Ti permettono di utilizzare `state` ed altre funzioni di React senza dover scrivere una classe.

La [pagina di introduzione](/docs/hooks-intro.html) usa questo esempio per familiarizzare con gli Hooks:

```js{4-5}
import React, { useState } from 'react';

function Esempio() {
  // Dichiara una nuova variable di stato, che chiameremo "contatore"
  const [contatore, setContatore] = useState(0);

  return (
    <div>
      <p>Hai cliccato {contatore} volte</p>
      <button onClick={() => setContatore(contatore + 1)}>
        Cliccami
      </button>
    </div>
  );
}
```

Inizieremo a conoscere gli Hooks confrontando questo codice con un esempio con una classe equivalente.

## Esempio Classe Equivalente {#equivalent-class-example}

Se hai già utilizzato le classi in React, il seguente codice dovrebbe risultarti familiare:

```js
class Esempio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contatore: 0
    };
  }

  render() {
    return (
      <div>
        <p>Hai cliccato {this.state.contatore} volte</p>
        <button onClick={() => this.setState({ contatore: this.state.contatore + 1 })}>
          Cliccami
        </button>
      </div>
    );
  }
}
```

Lo stato inizia con `{ contatore: 0 }`, e `state.contatore` viene incrementato quando l'utente clicca il bottone chiamando `this.setState()`. In questa pagina utilizzeremo degli snippets partendo da questa classe.

>Nota
>
>Ti starai chiedendo perché stiamo utilizzando un contatore invece che un esempio più realistico. La ragione è aiutare a concentrarci sulle API durante i nostri primi passi con gli Hooks.

## Hooks e Componenti Funzione {#hooks-and-function-components}

Come promemoria, i componenti funzione in React sono così:

```js
const Esempio = (props) => {
  // Qui puoi utilizzare gli Hooks!
  return <div />;
}
```

o così:

```js
function Esempio(props) {
  // Qui puoi utilizzare gli Hooks!
  return <div />;
}
```

Potresti aver precedentemente conosciuto questi come "componenti senza stato". Ora stiamo introducendo la possibilità di utilizzare lo state React, quindi preferiamo il nome di "componenti funzione".

Gli Hooks **non** funzionano nelle classi. Ma puoi utilizzarli invece di scrivere classi.

## Cos'è un Hook? {#whats-a-hook}

Il nostro nuovo esempio inizia importando l'Hook `useState` da React:

```js{1}
import React, { useState } from 'react';

function Esempio() {
  // ...
}
```

**Cos'è un Hook?** Un Hook è una speciale funzione che ti permette di "agganciare" funzionalità di React. Per esempio, `useState` è un Hook che ti permette di aggiungere lo state React nei componenti funzione. Impareremo altri Hooks più tardi.

**Quando dovrei utilizzare un Hook?** Se scrivi un componente funzione e capisci di aver bisogno dello state, prima avresti dovuto convertirlo in classe. Adesso puoi utilizzare un Hook dentro il componente funzione esistente. Entriamo subito nel dettaglio!

>Nota:
>
>Ci sono alcune regole speciali su quando puoi e non puoi utilizzare gli Hooks dentro un componente. Le impareremo in [Regole degli Hooks](/docs/hooks-rules.html).

## Dichiarare una Variabile di Stato {#declaring-a-state-variable}

In una classe, inizializziamo lo state `contatore` a `0` impostando `this.state` a `{ contatore: 0 }` nel costruttore:

```js{4-6}
class Esempio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contatore: 0
    };
  }
```

In un componente funzione, non abbiamo alcun `this`, quindi non possiamo assegnare o leggere `this.state`. Invece, chiamiamo l'Hook `useState` direttamente dentro il nostro componente:

```js{4,5}
import React, { useState } from 'react';

function Esempio() {
  // Dichiara una nuova variabile di stato, che chiameremo "contatore"
  const [contatore, setContatore] = useState(0);
```

**Cosa succede chiamando `useState`?** Quest'ultimo dichiara una "variabile di stato". La nostra variabile è chiamata `contatore` ma potremmo chiamarla in qualsiasi altro modo, anche `banana`. È un modo per "conservare" qualche valore durante le chiamate di funzione — `useState` è un modo nuovo di usare la stessa esatta funzionalità che `this.state` fornisce ad una classe. Normalmente, le variabili "scompaiono" quando la funzione esce mentre le variabili di stato vengono preservate da React.

**Cosa passiamo a `useState` come argomento?** L'unico argomento per l'Hook `useState()` è lo stato iniziale. A differenza delle classi, lo state non deve essere un oggetto. Possiamo tenere un numero o una stringa se è quello di cui abbiamo bisogno. Nel nostro esempio, vogliamo solo un numero che conti quante volte l'utente ha cliccato, quindi passiamo `0` come stato iniziale alla nostra variabile. (Se volessimo memorizzare due valori distinti nello stato, dovremmo chiamare `useState()` due volte.)

**Cosa ritorna `useState`?** Ritorna una coppia di valori: lo stato corrente ed una funzione che lo aggiorna. Questo è il motivo per cui scriviamo `const [contatore, setContatore] = useState()`. E' simile a `this.state.contatore` e `this.setState` in una classe, eccetto per il fatto che li ottieni in coppia. Se non sei familiare con la sintassi che abbiamo utilizzato, ci torneremo [in fondo a questa pagina](/docs/hooks-state.html#tip-what-do-square-brackets-mean).

Adesso che sappiamo cosa fa l'Hook `useState`, il nostro esempio dovrebbe avere più senso:

```js{4,5}
import React, { useState } from 'react';

function Esempio() {
  // Dichiara una nuova variabile di stato, che chiameremo "contatore"
  const [contatore, setContatore] = useState(0);
```

Dichiariamo una variabile di stato chiamata `contatore`, e la settiamo a `0`. React ricorderà il suo valore corrente durante i re-render, e fornirà il valore più recente alla nostra funzione. Se vogliamo aggiornare l'attuale `contatore`, possiamo chiamare `setContatore`.

>Nota
>
>Potresti chiederti: perché `useState` non è stato chiamato `createState`?
>
>"Create" non sarebbe perfettamente accurato perché lo stato è solo creato la prima volta che il nostro componente viene renderizzato. Durante i successivi render, `useState` ci fornisce lo stato corrente. Altrimenti non sarebbe "stato"! C'è anche una ragione per cui i nomi degli Hook iniziano *sempre* con `use`. Lo scopriremo più tardi in [Regole degli Hooks](/docs/hooks-rules.html).

## Leggere lo Stato {#reading-state}

Quando vogliamo visualizzare l'attuale contatore in una classe, leggiamo `this.state.contatore`:

```js
  <p>Hai cliccato {this.state.contatore} volte</p>
```

In una funzione, possiamo usare direttamente `contatore`:


```js
  <p>Hai cliccato {contatore} volte</p>
```

## Aggiornare lo Stato {#updating-state}

In una classe, dobbiamo chiamare `this.setState()` per aggiornare lo stato `contatore`:

```js{1}
  <button onClick={() => this.setState({ contatore: this.state.contatore + 1 })}>
    Cliccami
  </button>
```

In una funzione, abbiamo `setContatore` e `contatore` come variabili quindi non abbiamo bisogno di `this`:

```js{1}
  <button onClick={() => setContatore(contatore + 1)}>
    Cliccami
  </button>
```

## Riepilogo {#recap}

Facciamo un **riepilogo di cosa abbiamo imparato riga per riga** e controlliamo cosa abbiamo capito.

<!--
  Non vado fiero di questa riga. Per favore qualcuno la sistemi.
  Ma se GitHub l'ha fatto per anni possiamo farlo anche noi.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Esempio() {
 4:    const [contatore, setContatore] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>Hai cliccato {contatore} volte</p>
 9:        <button onClick={() => setContatore(contatore + 1)}>
10:         Cliccami
11:        </button>
12:      </div>
13:    );
14:  }
```

* **Riga 1:** Importiamo l'Hook `useState` da React. Ci permette di tenere lo stato locale in un componente funzione.
* **Riga 4:** Dentro il componente `Esempio`, dichiariamo una nuova variabile di stato chiamando l'Hook `useState`. Questo ritorna una coppia di valori, ai quali diamo dei nomi. Chiameremo la nostra variabile `contatore` perché conterà il numero di click del bottone. Lo inizializziamo a zero passando `0` come unico argomento a `useState`. Il secondo elemento ritornato è una funzione. Questa ci permette di aggiornare `contatore` quindi la chiameremo `setContatore`.
* **Riga 9:** Quando l'utente clicca, chiamiamo `setContatore` con un nuovo valore. React renderizzerà nuovamente il componente `Esempio`, passandogli il nuovo valore `contatore`.

Questo potrebbe sembrare troppo da gestire inizialmente. Ma non correre! Se ti sei perso durante la spiegazione, guarda di nuovo il codice sopra e prova a leggerlo dall'inizio alla fine. Ti promettiamo che se provi a "dimenticare" come funziona lo stato all'interno delle classi, e a leggere nuovamente questo codice, tutto avrà senso.

### Consiglio: Cosa significano le Parentesi Quadre? {#tip-what-do-square-brackets-mean}

Potresti aver notato le parentesi quadre quando dichiariamo una variabile di stato:

```js
  const [contatore, setContatore] = useState(0);
```

I nomi a sinistra non sono parte delle API di React. Puoi chiamare la tua variabile di stato:

```js
  const [frutta, setFrutta] = useState('banana');
```

Questa sintassi JavaScript è chiamata ["destrutturazione di array"](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Destrutturazione_di_array). Significa che stiamo dichiarando due nuove variabili `frutta` e `setFrutta`, dove `frutta` è il primo valore ritornato da `useState`, e `setFrutta` è il secondo. È equivalente a questo codice:

```js
  var variebileDiStatoFrutta = useState('banana'); // Ritorna una coppia
  var frutta = variebileDiStatoFrutta[0]; // Il primo elemento della coppia
  var setFrutta = variebileDiStatoFrutta[1]; // Il secondo elemento della coppia
```

Quando dichiariamo una variabile di stato con `useState`, questo ritorna una coppia - un array con due elementi. Il primo elemento è il valore attuale, e il secondo è la funzione che ci permette di aggiornarlo. Usando `[0]` e `[1]` per accedervi è un po' fuorviante perché hanno un significato specifico. Questo è il motivo per cui utilizziamo la destrutturazione di array.

>Nota
>
>Potresti essere curioso di sapere come fa React a riconoscere a quale componente corrisponda `useState` dal momento che non passiamo a React il `this`. Risponderemo [a questa domanda](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) e a molte altre nella sezione FAQ.

### Consiglio: Utilizzare Più Variabili di Stato {#tip-using-multiple-state-variables}

Dichiarare variabili di stato come coppia di `[qualcosa, setQualcosa]` è anche comodo perché ci permette di assegnare nomi *diversi* a diverse variabili di stato se vogliamo utilizzarne più di una:

```js
function EsempioConDiversiStati() {
  // Dichiara più variabili di stato!
  const [età, setEtà] = useState(42);
  const [frutta, setFrutta] = useState('banana');
  const [daFare, setDaFare] = useState([{ test: 'Impara gli Hooks' }]);
```

Nel componente qui sopra, abbiamo `età`, `frutta`, e `daFare` come variabili locali, e possiamo aggiornarle individualmente:

```js
  function gestisciClickArancia() {
    // Simile a this.setState({ frutta: 'arancia' })
    setFruit('arancia');
  }
```

**Non devi** usare più variabili di stato. Le variabili di stato possono contenere oggetti ed array, quindi puoi comunque raggruppare dati correlati. Comunque, a differenza di `this.setState` in una classe, aggiornando una variabile di stato il nuovo valore *rimpiazza* quello vecchio invece che essere unito ad esso.

Forniamo più raccomandazioni su come dividere variabili di stato indipendenti [nelle FAQ](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).

## Prossimi passi {#next-steps}

In questa pagina abbiamo imparato uno degli Hooks messi a disposizione da React, chiamato `useState`. Qualche volta ci riferiremo a questo come "Hook di Stato". Ci permette di aggiungere stato locale ai componenti funzione React -- cosa che abbiamo fatto per la prima volta in assoluto!

Abbiamo anche imparato un po' di più su cosa sono gli Hooks. Gli Hooks sono funzioni che ti permettono di "agganciare" funzionalità React nei componenti funzione. I loro nomi iniziano sempre con `use`, e ci sono altri Hooks che non abbiamo ancora visto.

**Continuiamo [imparando il prossimo Hook: `useEffect`.](/docs/hooks-effect.html)** Permette di eseguire side effects nei componenti, ed è simile ai metodi del ciclo di vita nelle classi.
