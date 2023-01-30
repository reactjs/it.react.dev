---
id: reconciliation
title: Riconciliazione
permalink: docs/reconciliation.html
---

<<<<<<< HEAD
React espone una API dichiarativa così che tu non debba sapere con esattezza che cosa cambia per ogni update. Questo semplifica molto la scrittura delle applicazioni, ma potrebbe non essere ovvio come sia stata implementata. Questo articolo descrive le scelte che abbiamo fatto sugli algoritmi di confronto usati da React al fine di rendere gli update dei componenti prevedibili ed allo stesso tempo abbastanza veloci da offrire applicazioni a prestazioni elevate.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Preserving and Resetting State](https://beta.reactjs.org/learn/preserving-and-resetting-state)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

React provides a declarative API so that you don't have to worry about exactly what changes on every update. This makes writing applications a lot easier, but it might not be obvious how this is implemented within React. This article explains the choices we made in React's "diffing" algorithm so that component updates are predictable while being fast enough for high-performance apps.
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

## Motivazione {#motivation}

Quando usi React, in un istante definito di tempo puoi pensare alla funzione `render()` come qualcosa che crea e ritorna un albero di elementi React. A seguito di un cambiamento di state o props, la stessa funzione `render()` ritornerà un albero di elementi React diverso dal precedente. React quindi avrà bisogno di capire come eseguire l'update della UI in maniera efficiente per farla combaciare con l'ultimo albero di elementi generato.

Ci sono alcune soluzioni generiche per questo problema algoritmico al fine di generare il numero minimo di operazioni per la trasformazione di un albero in un altro. Tuttavia, lo [stato dell'arte di questi algoritmi](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) ha complessità nell'ordine di O(n<sup>3</sup>) dove n è il numero di elementi all'interno dell'albero.

Se questi algoritmi venissero usati da React, la rappresentazione di 1000 elementi richiederebbe un numero di confronti nell'ordine di un miliardo. Sarebbe troppo dispendioso. React, invece, implementa un algoritmo euristico O(n) basato su due assunzioni:

1. Due elementi di tipo diverso produrranno alberi diversi.
2. Lo sviluppatore può suggerire all'algoritmo quali elementi potrebbero mantenersi stabili tra le diverse renderizzazioni attraverso l'uso di una prop `key`.

In pratica, queste assunzioni sono valide quasi per tutti i casi d'uso.

## L'Algoritmo di confronto {#the-diffing-algorithm}

Nel paragonare due alberi, React confronta prima i due elementi alla radice. Il comportamento cambia a seconda del loro tipo.

### Elementi con tipi diversi {#elements-of-different-types}

Se gli elementi radice hanno tipo diverso, React abbattera il vecchio albero e costruirà da zero quello nuovo. Nel passaggio da `<a>` a `<img>`, da `<Article>` a `<Comment>`, da `<Button>` a `<div>` - ognuno di questi porterà ad una ricostruzione dell'albero completa.

Nell'abbattere un albero, vengono distrutti i vecchi nodi del DOM e le istanze dei Componenti ricevono il `componentWillUnmount()`. Nella costruzione del nuovo albero, nuovi nodi vengono inseriti nel DOM. Le istanze dei Componenti ricevono prima l'`UNSAFE_componentWillMount()` e dopo il `componentDidMount()`. Ogni state associato con il vecchio albero va perso.

Ogni componente che sta sotto la radice verrà smontato e il suo state verrà distrutto. Per esempio, nel confronto tra:

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

Verrà distrutto il vecchio `Counter` e ne verrà montato uno nuovo.

### Elementi DOM dello stesso tipo {#dom-elements-of-the-same-type}

>Nota:
>
>Questo metodo è considerato legacy quindi dovresti [evitarlo](/blog/2018/03/27/update-on-async-rendering.html) nel nuovo codice:
>
>- `UNSAFE_componentWillMount()`

Nel confrontare due elementi DOM di React che hanno lo stesso tipo, React guarderà gli attributi di entrambi, manterrà lo stesso nodo sottostante ed aggiornerà solo gli attributi cambiati. Per esempio:

```xml
<div className="prima" title="cose" />

<div className="dopo" title="cose" />
```

Nel confronto tra questi due elementi, React sa di dover modificare solo il `className` sul nodo DOM sottostante.

Quando viene aggiornato `style`, React sa come aggiornare soltanto le proprietà che sono cambiate. Ad esempio:

```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

Nella conversione tra questi due elementi, React sa di dover modificare solo la proprietà `color`, ma non `fontWeight`.

Dopo aver gestito il nodo DOM, React esegue le stesse operazioni in ricorsione sui nodi figlio.

### Elementi Componente dello stesso tipo {#component-elements-of-the-same-type}

Quando un componente si aggiorna, l'istanza rimane la stessa, così che lo state persista tra le renderizzazioni. React aggiorna le props dell'istanza sottostante del componente facendola combaciare con il nuovo elemento, e chiama `componentWillReceiveProps()` e `UNSAFE_componentWillUpdate()` e `componentDidUpdate()` sull'istanza sottostante.

In seguito, viene chiamato il metodo `render()` e l'algoritmo di confronto va in ricorsione sui risultati precedenti e su quelli nuovi.


### Ricorsione sui figli {#recursing-on-children}
>Nota:
>
>Questi metodi sono considerati legacy quindi dovresti [evitarli](/blog/2018/03/27/update-on-async-rendering.html) nel nuovo codice:
>
>- `UNSAFE_componentWillUpdate()`
>- `UNSAFE_componentWillReceiveProps()`

Di base, quando React va in ricorsione sui figli di un nodo DOM, itera su entrambe le liste di figli allo stesso tempo e genera una mutazione ogni volta che trova differenze.

Per esempio, nell'aggiungere un elemento alla fine di un figlio, la conversione dei due alberi funziona bene:

```xml
<ul>
  <li>primo</li>
  <li>secondo</li>
</ul>

<ul>
  <li>primo</li>
  <li>secondo</li>
  <li>terzo</li>
</ul>
```

React confronterà gli alberi `<li>primo</li>`, gli alberi `<li>secondo</li>`, e inserirà l'albero `<li>terzo</li>`.

Se lo implementassi ingenuamente, inserendo un elemento all'inizio avresti prestazioni peggiori. Per esempio, la conversione tra questi due alberi funziona male:

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React muterà tutti i figli invece di realizzare il fatto che può mantenere i sottoalberi `<li>Duke</li>` e `<li>Villanova</li>` intatti. Questa inefficienza può essere un problema.

### Chiavi {#keys}

Per risolvere questo problema, React supporta un attributo `key`. Quando i figli hanno le key, React le utilizza per confrontare i figli nell'albero originale con quelli nell'albero successivo. Per esempio, aggiungere una `key` nell'esempio inefficiente fatto in precedenza può rendere efficiente la conversione tra questi alberi:

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

Adesso React sa che l'elemento con key `'2014'` è nuovo, e gli elementi con key `'2015'` e `'2016'` sono stati semplicemente spostati.

In pratica, trovare una key non è difficile. L'elemento che stai per mostrare potrebbe già avere un suo ID univoco, quindi la key potrebbe derivare direttamente dal dato che hai a disposizione:

```js
<li key={item.id}>{item.name}</li>
```

Se questo non è il tuo caso, puoi aggiungere una nuova proprietà ID al tuo modello o unire alcune parti del contenuto per generare una key. La key deve essere univoca solo tra gli elementi vicini, non globalmente.

Come ultima spiaggia, puoi passare l'indice dell'array come key. Questo può andare bene se gli elementi non vengono mai riordinati, altrimenti l'operazione di riordinamento è più lenta.

Quando gli indici vengono usati come key, il riordinamento degli elementi può causare problemi anche con lo state del componente. Le istanze dei componenti vengono aggiornate e riutilizzate in base alla loro key. Se la key è l'indice, varia quando l'elemento viene spostato. Quindi lo state per componenti come input non controllati può mischiarsi e aggiornarsi in maniera inaspettata.

Qui c'è [un esempio del problema causato dall'utilizzo degli indici come chiave](codepen://reconciliation/index-used-as-key) su CodePen, e qui c'è [una versione aggiornata dello stesso esempio che dimostra come non usare gli indici come chiave risolve questi problemi di riodinamento](codepen://reconciliation/no-index-used-as-key).

## Compromessi {#tradeoffs}

E' importante tenere a mente che l'algoritmo di riconciliazione è un dettaglio implementativo. React potrebbe rirenderizzare l'intera app ad ogni azione; il risultato finale sarebbe lo stesso. Per essere chiari, rirenderizzare in questo contesto significa chiamare `render` per ogni componente, non significa che React li smonterà e rimonterà. Applicherà soltanto le differenze seguendo le regole definite nelle sezioni precedenti.

Stiamo regolarmente ridefinendo le euristiche in modo da rendere più veloci i casi d'uso comuni. Nell'implementazione corrente, puoi esprimere il fatto che un sottoalbero venga mosso tra i suoi fratelli, ma non puoi stabilire se sono stati mossi altrove. L'algoritmo ri-renderizzerà l'intero sottoalbero.

Dato che React si basa su euristiche, se le assunzioni iniziali non vengono rispettate, le prestazioni saranno peggiori.

1. L'algoritmo non cercherà di confrontare sottoalberi di tipi di componente diverso. Se il tuo caso è quello di alternare tra due componenti con diverso tipo ma con output molto simile, potresti renderli dello stesso tipo. in pratica, non abbiamo trovato problemi nel farlo.

2. Le chiavi dovrebbero essere stabili, predicibili ed univoche. Chiavi non stabili (come quell prodotte da `Math.random()`) causeranno l'inutile ricreazione di diverse istanze dei componenti e nodi DOM, ciò può causare degradazione delle prestazioni e perdita di state nei componenti figlio.
