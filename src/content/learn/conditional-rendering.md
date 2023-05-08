---
title: Renderizzazione Condizionale
---

<Intro>

I tuoi componenti dovranno spesso mostrare cose differenti a seconda di diverse condizioni. In React, puoi renderizzare condizionalmente JSX usando la sintassi JavaScript con istruzioni come `if`, `&&` e gli operatori `? :`.

</Intro>

<YouWillLearn>

* Come ritornare JSX differenti a seconda di una condizione
* Come includere o escludere condizionalmente una porzione di JSX
* Comuni scorciatoie di sintassi condizionale che incontrerai nele basi di codice React

</YouWillLearn>

## Ritornare JSX condizionalmente {/*conditionally-returning-jsx*/}

Immagina di avere un componente `PackingList` che renderizza diversi `Item`, i quali possono essere marcati come imballati o meno:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Nota che alcuni componenti `Item` hanno la loro prop `isPacked` settata a `true` invece che `false`. Vuoi aggiungere un segno di spunta (✔) agli elementi imballati se `isPacked={true}`.

Puoi scrivere questo come un'[istruzione `if`/`else`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) in questo modo:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Se la prop `isPacked` è `true`, questo codice **ritorna un albero JSX differente.** Con questo cambiamento, alcuni elementi ottengono un segno di spunta alla fine:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Prova a modificare cosa viene ritornato in entrambi i casi e guarda come cambia il risultato!

Nota come stai creando una logica a diramazione con le istruzioni `if` e `return` di JavaScript. In React, il flusso di controllo (come le condizioni) è gestito da JavaScript.

### Non restituire nulla condizionalmente con `null` {/*conditionally-returning-nothing-with-null*/}

In alcune situazioni, non vorrai renderizzare nulla. Per esempio, diciamo che non vuoi mostrare gli elementi imballati. Un componente deve ritornare qualcosa. In questo caso, puoi ritornare `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Se `isPacked` è true, il componente non renderizzerà nulla, ovvero `null`. Altrimenti, ritornerà il JSX da renderizzare.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Nella pratica, ritornare `null` da un componente non è comune perché potrebbe sorprendere un developer che sta cercando di renderizzarlo. Più spesso, condizionerai l'inclusione o l'esclusione del componente nel JSX del componente genitore. Ecco qui come fare!

## Includere JSX condizionalmente {/*conditionally-including-jsx*/}

Nell'esempio precedente, hai controllato quale albero JSX sarebbe stato ritornato dal componente (se presente!). Potresti aver già notato qualche duplicazione nell'output renderizzato:

```js
<li className="item">{name} ✔</li>
```

è molto simile a

```js
<li className="item">{name}</li>
```

Entrambi i rami condizionali ritornano `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Anche se questa duplicazione non è dannosa, potrebbe rendere il tuo codice più difficile da mantenere. Cosa succederebbe se volessi cambiare la `className`? Dovresti farlo in due posti nel tuo codice! In una situazione del genere, potresti includere condizionalmente un po' di JSX per rendere il tuo codice più [DRY.](https://it.wikipedia.org/wiki/Don%27t_repeat_yourself)

### Operatore (ternario) condizionale (`? :`) {/*conditional-ternary-operator--*/}

JavaScript ha una sintassi compatta per scrivere un'espressione condizionale -- l'[operatore condizionale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) o "operatore ternario".

Invece di questo:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Puoi scrivere questo:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

Puoi leggerlo come *"se `isPacked` è true, allora (`?`) renderizza `name + ' ✔'`, altrimenti (`:`) renderizza `name`"*.

<DeepDive>

#### Questi due esempi sono equivalenti? {/*are-these-two-examples-fully-equivalent*/}

Se hai un background di programmazione orientata agli oggetti, potresti supporre che i due esempi sopra siano leggermente diversi perché uno di essi potrebbe creare due "istanze" diverse di `<li>`. Ma gli elementi JSX non sono "istanze" perché non mantengono alcuno stato interno e non sono nodi del DOM reali. Sono descrizioni leggere, come i progetti. Quindi questi due esempi, infatti, *sono* completamente equivalenti. [Preservare e Resettare lo Stato](/learn/preserving-and-resetting-state) entra nel dettaglio su come funziona questo.

</DeepDive>

Ora immagina di voler racchiudere il testo dell'elemento completato in un altro tag HTML, come `<del>` per barrarlo. Puoi aggiungere ancora più righe e parentesi cosí che sia più semplice annidare più JSX in ciascuno dei casi:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Questo stile funziona bene per condizioni semplici, ma utilizzalo con moderazione. Se i tuoi componenti diventano disordinati con troppi markup condizionali nidificati, considera di estrarre i componenti figli per riordinare le cose. In React, il markup fa parte del tuo codice, quindi puoi usare strumenti come le variabili e le funzioni per ripulire le espressioni complesse.

### Operatore logico AND (`&&`) {/*logical-and-operator-*/}

Un'altra scorciatoia comune che incontrerai è l'[operatore logico AND (`&&`).](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) All'interno dei componenti React, si presenta spesso quando si desidera renderizzare un po' di JSX quando la condizione è vera, **o altrimenti non si renderizza nulla.** Con `&&`, potresti renderizzare condizionalmente il segno di spunta solo se `isPacked` è `true`:


```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

Puoi leggere questo come *"se `isPacked` è true, allora (`&&`) renderizza il segno di spunta, altrimenti, non renderizzare nulla"*.

Eccolo in azione:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Una [espressione JavaScript &&](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) restituisce il valore del suo lato destro (nel nostro caso, il segno di spunta) se il lato sinistro (la nostra condizione) è `true`. Ma se la condizione è `false`, l'intera espressione diventa `false`. React considera `false` come un "buco" nell'albero JSX, proprio come `null` o `undefined` e non renderizza nulla al suo posto.

<Pitfall>

**Non mettere i numeri sul lato sinistro di `&&`.**

Per testare le condizioni, JavaScript converte automaticamente il lato sinistro in un booleano. Tuttavia, se il lato sinistro è `0`, l'intera espressione ottiene quel valore (`0`) e React renderizzerà volentieri `0` anziché nulla.

Per esempio, un errore comune è scrivere codice come `messageCount && <p>New messages</p>`. È facile presumere che non renderizzi nulla quando `messageCount` è `0`, ma in realtà renderizza il `0` stesso!

Per risolvere il problema, rendi il lato sinistro un booleano: `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### Assegnare condizionalmente JSX ad una variabile {/*conditionally-assigning-jsx-to-a-variable*/}

Quando introduci le scorciatoie nella scrittura di codice semplice, prova ad usare un'istruzione `if` ed una variabile. Puoi riassegnare le variabili definite con [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), quindi inizia fornendo il contenuto predefinito che vuoi visualizzare, il nome:

```js
let itemContent = name;
```

Utilizza un'istruzione `if` per riassegnare un'espressione JSX ad `itemContent` se `isPacked` è `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[Le parentesi graffe aprono una "finestra nel mondo JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Inserisci la variabile con le parentesi graffe nell'albero JSX restituito, annidando l'espressione precedentemente calcolata all'interno del JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Questo stile è più verboso, ma è anche più flessibile. Ecco come funziona:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Come prima, questo funziona non solo per il testo, ma anche per il JSX arbitrario:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Se non hai familiarità con JavaScript, questa varietà di stili potrebbe sembrarti travolgente all'inizio. Tuttavia, impararli ti aiuterà a leggere e scrivere qualsiasi codice JavaScript - e non solo i componenti React! Scegli quello che preferisci per iniziare e poi consulta di nuovo questo riferimento se dimentichi come funzionano gli altri.

<Recap>

* In React, controlli la logica di ramificazione con JavaScript.
* Puoi ritornare condizionalmente un'espressione JSX con un'istruzione `if`.
* Puoi salvare condizionalmente un'espressione JSX in una variabile e quindi includerla in altri JSX utilizzando le parentesi graffe.
* Nella sintassi JSX, `{cond ? <A /> : <B />}`, significa *se `cond` è `true`, renderizza `<A />`, altrimenti `<B />`*.
* Nella sintassi JSX, `{cond && <A />}` significa *se `cond` è `true`, renderizza `<A />`, altrimenti nulla*.
* Le scorciaotie sono comuni, ma non sei costretto ad utilizzarle se preferisci un semplice `if`.

</Recap>



<Challenges>

#### Mostra un'icona per gli oggetti incompleti con `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Usa l'operatore condizionale (`cond ? a : b`) per renderizzare una ❌ se `isPacked` non è `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Mostra l'importanza dell'oggetto con `&&` {/*show-the-item-importance-with-*/}

In questo esempio, ogni `Item` riceve una prop numerica `importance`. Utilizza l'operatore `&&` per renderizzare "_(Importance: X)_" in corsivo, ma solo per gli oggetti che hanno un'importanza diversa da zero. La tua lista di oggetti dovrebbe finire per assomigliare a questa:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

Non dimenticare di aggiungere uno spazio tra le due etichette!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Questo dovrebbe servire allo scopo:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Tieni presente che dovrai scrivere `importance > 0 && ...` invece di `importance && ...` in modo che se `importance` è `0`, `0` non venga renderizzato come risultato!

In questa soluzione, vengono utilizzate due condizioni separate per inserire uno spazio tra il nome e l'etichetta di importanza. In alternativa, potresti utilizzare un frammento con uno spazio iniziale: `importance > 0 && <> <i>...</i></>` oppure aggiungere uno spazio immediatamente all'interno del tag `<i>`: `importance > 0 && <i> ...</i>`.

</Solution>

#### Rifattorizzare una serie di `? :` in `if` e variabili {/*refactor-a-series-of---to-if-and-variables*/}

Questo componente `Drink` utilizza una serie di condizioni `? :` per mostrare informazioni diverse a seconda che la prop `name` sia `"tea"` o `"coffee"`. Il problema è che le informazioni su ogni drink sono sparse su più condizioni. Rifattorizza questo codice cosí da utilizzare una singola istruzione `if` invece di tre condizioni `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Una volta rifattorizzato il codice per utilizzare `if`, hai ulteriori idee su come semplificarlo?

<Solution>

Ci sono diversi modi per risolvere questo problema, ma ecco un punto di partenza:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Qui le informazioni su ogni drink sono raggruppate invece di essere sparse su più condizioni. Questo rende più facile aggiungere ulteriori drink in futuro.

Un'altra soluzione sarebbe quella di rimuovere del tutto la condizione spostando le informazioni in oggetti:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
