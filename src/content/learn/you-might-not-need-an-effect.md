---
title: 'Potresti non avere bisogno di un Effetto'
---

<Intro>

Gli effetti sono un modo per sfuggire dal paradigma di React. Ti permettono di "uscire fuori" da React sincronizzando i componenti con sistemi esterni come widget non-React, la rete, o il DOM del browser. Se non ci sono sistemi esterni coinvolti (per esempio, se vuoi aggiornare lo state di un componente a seguito di un cambiamento nelle props o nello state), non dovresti avere bisogno di un Effetto. Rimuovere effetti inutili ti permette di scrivere codice più semplice da capire, più veloce ad eseguire, e meno soggetto ad errori. 

</Intro>

<YouWillLearn>

* Come rimuovere effetti inutili dai tuoi componenti e perché
* Come memorizzare computazioni costose nella cache senza usare effetti
* Come ripristinare e modificare lo state dei componenti senza usare effetti
* Come condividere logica tra event handlers
* Quale logica dovrebbe essere spostata negli event handlers
* Come notificare i componenti padre di un avvenuto cambiamento.

</YouWillLearn>

## Come rimuovere Effetti inutili {/*how-to-remove-unnecessary-effects*/}

Ci sono due casi comuni in cui non hai bisogno di usare un Effetto:

* **Non hai bisogno di un Effetto per trasformare dati da renderizzare.** Per esempio, diciamo che vuoi filtrare una lista prima di mostrarla. Potresti essere tentato di scrivere un Effetto che aggiorna una variabile di state quando la lista cambia. Questo tuttavia è inefficiente. Quando aggiorni lo stato, React chiama prima la funzione del tuo componente per calcolare cosa mostrare su schermo. Poi React esegue il ["commit"](/learn/render-and-commit) dei cambiamenti sul DOM, aggiornando lo schermo. Poi React eseguirà gli effetti. Se *anche* il tuo Effetto aggiorna immediatamente lo stato, l'intero processo ricomincia da zero! Per evitare i passaggi di rendering inutili, trasforma tutti i tuoi dati all'inizio del tuo componente. Il codice che aggiungi li automaticamente esegue ogni volta che props o state cambiano.
* **Non hai bisogno di un Effetto per gestire eventi provienienti dall'utente.** Per esempio, diciamo che vuoi inviare una richiesta POST sull'endpoint `/api/buy` e mostrare una notifica quando l'utente compra un prodotto. Nell'event handler 'on click' del pulsante di acquisto, sai con precisione cosa è successo. Quando viene eseguito un Effetto invece, non sai *cosa* ha fatto l'utente (per esempio, quale pulsante ha cliccato). Ecco perché generalmente vuoi gestire gli eventi provenienti dall'utente nei rispettivi event handlers.

*Hai bisogno* di un Effetto per [sincronizzarti](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) con sistemi esterni. Per esempio, Puoi scrivere un Effetto che mantiene un widget scritto in jQuery sincronizzato con lo state di React. Puoi anche recuperare dati con un Effetto: per esempio, puoi sincronizzare i risultati di una ricerca con la query di ricerca corrente. Tieni a mente che i [framework](/learn/start-a-new-react-project#full-stack-frameworks) moderni offrono meccanismi di recupero di dati più efficienti rispetto a scrivere effetti direttamente nei tuoi componenti.

Per aiutarti ad ottenere la giusta intuizione, vediamo alcuni esempi concreti più comuni!

### Aggiornamento di state basato su props e state {/*updating-state-based-on-props-or-state*/}

Supponiamo tu abbia un componente con due variabili di state: `firstName` e `lastName`. Vuoi calcolare `fullName` concatenandoli. Più che altro, vorresti che `fullName` si aggiornasse ogni volta che `firstName` o `lastName` cambiano. Il tuo primo istinto potrebbe essere quello di aggiungere `fullName` come variabile di state e modificarla in un Effetto:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Da evitare: lo state è ridondante e l'Effetto non è necessario
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

È più complicato del necessario. È anche inefficiente: fa un intero passaggio di rendering con un valore di `fullName` non aggiornato, poi immediatamente ri-renderizza con il valore corrente. Rimuovi la variabile di state e l'Effetto:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Buono: calcolato durante il rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Quando qualcosa può essere calcolato a partire da props e state, [non inserirla nello state.](/learn/choosing-the-state-structure#avoid-redundant-state) Invece, calcolala durante il rendering.** Questo rende il tuo codice più veloce (eviti l'extra update "a cascata"), più semplice (rimuovi codice), e meno soggetto ad errore (eviti bug dovuti a variabili di state diverse che si desincronizzano tra loro). Se questo approccio ti sembra nuovo, [Pensare in React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) spiega che cosa dovrebbe andare nello state.

### Memorizzare calcoli dispendiosi {/*caching-expensive-calculations*/}

Questo componente computa `visibleTodos` prendendo i `todos` ricevuto dalle props e filtrandoli a seconda del valore della prop `filter`. Potresti essere tentato di salvare il risultato nello state ed aggiornarlo con un Effetto:

```js {expectedErrors: {'react-compiler': [7]}} {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Da evitare: lo state è ridondante e l'Effetto non è necessario
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Come nell'esempio precedente, questo è sia inutile che inefficiente. Prima, rimuovi lo state e l'Effetto:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Questo va bene se getFilteredTodos() non è lenta.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Generalmente, questo codice va bene! Ma forse `getFilteredTodos()` è lenta o hai tanti `todos`. In questo caso non vuoi calcolare di nuovo `getFilteredTodos()` quando cambiano variabili di state non legate a questo aggiornamento come `newTodo`.

Puoi inserire in cache (o ["memoizzare"](https://en.wikipedia.org/wiki/Memoization)) un calcolo dispendioso con un Hook [`useMemo`](/reference/react/useMemo):

<Note>

[React Compiler](/learn/react-compiler) può memorizzare i calcoli dispendiosi automaticamente, rendendo `useMemo` non più necessario nella maggior parte dei casi.

</Note>

<Note>

[React Compiler](/learn/react-compiler) can automatically memoize expensive calculations for you, eliminating the need for manual `useMemo` in many cases.

</Note>

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Non viene eseguita finché todos o filter non cambiano
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

O, scritto in una linea sola:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Non viene eseguita finché todos o filter non cambiano
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Questo dice a React che non vuoi ri-eseguire la funzione interna finché `todos` o `filter` non sono cambiati.** React ricorderà il valore ritornato da `getFilteredTodos()` durante il primo render. Nei prossimi render, controllerà se `todos` o `filter` sono diversi. Se sono gli stessi del render precedente, `useMemo` ritornerà l'ultimo risultato memorizzato. Ma se sono diversi, React chiamerà la funzione interna di nuovo (e salverà il risultato).

La funzione che inserisci in [`useMemo`](/reference/react/useMemo) esegue durante il rendering, quindi può funzionare solo per [calcoli puri.](/learn/keeping-components-pure)

<DeepDive>

#### Come puoi sapere se un calcolo è dispendioso? {/*how-to-tell-if-a-calculation-is-expensive*/}

In generale, a meno che tu non stia creando o iterando migliaia di oggetti, probabilmente non è dispendioso. Se vuoi esserne più sicuro, puoi aggiungere un log in console per misurare il tempo trascorso ad eseguire un pezzo di codice:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Esegui l'interazione per cui stai misurando il tempo (per esempio, scrivere in un input). Vedrai log come `filter array: 0.15ms` in console. Se il tempo totale raggiunge una quantità significante (per esempio, `1ms` o più), potrebbe avere senso memoizzare quel calcolo. Come esperimento, puoi usare `useMemo` per verificare se il tempo totale misurato si è ridotto per quell'interazione o no:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Non esegue se todos e filter non sono cambiati
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` non renderà il *primo* render più veloce. Ti aiuta soltanto a evitare lavoro e aggiornamenti inutili.

Tieni a mente che la tua macchina probabilmente è più veloce di quella dei tuoi utenti, quindi è una buona idea testare le prestazioni con un rallentamento artificiale. Per esempio, Chrome offre una opzione di [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) per farlo.

Nota bene che misurare le prestazioni in sviluppo non ti darà i risultati più accurati. (Per esempio, quando [Strict Mode](/reference/react/StrictMode) è attiva, vedrai ogni componente renderizzare due volte invece che una.) Per avere le migliori misure in termini di tempo, esegui il build della tua app in produzione e testala su un dispositivo simile a quello che hanno i tuoi utenti.

</DeepDive>

### Ripristinare lo state quando una prop cambia {/*resetting-all-state-when-a-prop-changes*/}

Questo componente `ProfilePage` riceve una prop chiamata `userId`. La pagina contiene un input per i commenti, e usi una variabile di state `comment` per memorizzare il suo valore. Un giorno, ti accorgi di un problema: nella navigazione tra un profilo e l'altro, lo state `comment` non viene ripristinato. Il risultato, è che è facile commentare accidentalmente sul profilo sbagliato. Per risolvere il problema, vuoi ripulire la variabile di state `comment` ogni volta che `userId` cambia:

```js {expectedErrors: {'react-compiler': [6]}} {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Da evitare: Ripristino dello state quando una prop cambia in un Effetto
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Questo è inefficiente perché `ProfilePage` e i suoi figli inizialmente renderizzeranno con lo stato vecchio, per poi renderizzare di nuovo. È anche complicato perché dovrai farlo in *ogni* componente che ha dello state all'interno di `ProfilePage`. Per esempio, se la UI per i commenti è innestata, hai bisogno di resettare anche lo state innestato dei commenti.

Invece, puoi dire a React che ogni profilo utente è concettualmente un profilo _diverso_ assegnandogli una chiave specifica. Dividi il tuo componente in due e passa un attributo `key` dal componente esterno:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ Questo e qualsiasi altro state più in fondo si ripristineranno automaticamente quando la key cambia  const [comment, setComment] = useState('');
  // ...
}
```

Normalmente, React preserva lo state quando lo stesso componente è renderizzato nella stessa posizione. **Passando `userId` come `key` al componente `Profile`, stai chiedendo a React di trattare i due componenti `Profile` con diverso `userId` come se fossero due componenti diversi che non devono condividere alcuno state.** Ogni volta che key (ora valorizzata come `userId`) cambia, React creerà di nuovo il DOM e [ripristinerà lo state](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) del componente `Profile` e di tutti i suoi figli. Adesso il campo `comment` verrà pulito automaticamente navigando tra profili differenti.

Nota che in questo esempio, solo il componente più esterno `ProfilePage` è esportato e visibile da altri files nello stesso progetto. I componenti che renderizzano `ProfilePage` non devono passargli a loro volta una key: loro passano `userId` come una normale prop. Il fatto che `ProfilePage` lo passa come `key` al componente interno `Profile` è un dettaglio implementativo.

### Modificare uno state quando una prop cambia {/*adjusting-some-state-when-a-prop-changes*/}

A volte, potresti volere ripristinare o regolare una parte dello state al cambio di una prop, ma non tutto quanto.

Questo componente `List` riceve una lista `items` come prop, e mantiene l'elemento selezionato nella variabile di state `selection`. Potresti volere ripristinare `selection` a `null` ogni volta che la prop `items` riceve un array differente:

```js {expectedErrors: {'react-compiler': [7]}} {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Evita: Regolare lo state quando una prop cambia in un Effetto
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Anche questo non è ideale. Ogni volta che `items` cambia, l'elemento `List` e i suoi componenti figli, all'inizio renderizzeranno con il vecchio valore `selection`. Dopodiché React aggiornerà il DOM ed eseguirà gli Effetti. Infine, la funzione `setSelection(null)` causerà un altro render di `List` e dei suoi componenti figli, facendo partire di nuovo l'intero processo.

Inizia eliminando l'Effetto. Al suo posto, regola lo state direttamente durante il rendering:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Meglio: Regola lo state durante il rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Memorizzare informazioni dal render precedente](/reference/react/useState#storing-information-from-previous-renders) in quest modo può essere difficile da capire, ma è meglio rispetto ad aggiornare lo stesso state in un Effetto. Nell'esempio precedente, `setSelection` è chiamato direttamente durante il render. React renderizzerà di nuovo `List` *immediatamente* dopo esce con una dichiarazione di `return`. React non ha ancora né renderizzato i figli di `List` né aggiornato il DOM, questo fa si che i figli di `List` evitino di renderizzarsi mentre il valore di `selection` non è aggiornato.

Quando aggiorni un componente durante il rendering, React butta il JSX ritornato e tenta immediatamente un nuovo render. Per evitare lenti tentativi a cascata, React ti permette di aggiornare soltanto lo state dello *stesso* componente durante il render. Se aggiorni lo state di un altro componente durante il rendering, vedrai un errore. Una condizione come `items !== prevItems` è necessario per evitare cicli. Potresti regolare questo genere di state, ma qualsiasi altro side effect (come cambiare il DOM o impostare un timeout) dovrebbe stare negli event handlers o Effetti per [mantenere puri i componenti](/learn/keeping-components-pure)

**Anche se questo pattern è più efficiente rispetto all'Effetto, la maggior parte dei componenti non lo necessitano nemmeno.** Non importa in che modo lo fai, regolare lo state basandosi sulle props o altro state rende il flusso i dati più difficile da capire e debuggare. Invece di fare questo, controlla sempre se puoi [ripristinare tutto lo stato usando la key](#resetting-all-state-when-a-prop-changes) o [calcolare tutto durante il rendering](#updating-state-based-on-props-or-state). For example, instead of storing (and resetting) the selected *item*, you can store the selected *item ID:*

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Meglio: Calcola tutto durante il rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Così facendo non c'è affatto bisogno di "regolare" lo stato. Se l'elemento con l'ID selezionato è in lista, rimane selezionato. Altrimenti, la `selection` calcolata durante il rendering sarà `null` perché non è stato trovato un elemento corrispondente. Questo comportamento è differente, ma probabilmente migliore perché la maggior parte dei cambiamenti su `items` preservano la selezione.

### Condividere logica tra event handlers {/*sharing-logic-between-event-handlers*/}

Diciamo di avere una pagina di prodotti con due pulsanti (Compra e Carrello) ed entrambi ti permettono di acquistare un prodotto. Vuoi mostrare una notifica ogni volta che l'utente inserisce un prodotto nel carrello. Chiamare `showNotification()` in entrambi i click handlers dei pulsanti sembra ripetitivo quindi potresti essere tentato di inserire la logica in un Effetto:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Evita: logica specifica di un Evento all'interno di un Effetto 
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`${product.name} è stato aggiunto al carrello!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

Questo Effetto è inutile e causerà bugs. Per esempio, diciamo che la tua app abbia la funzionalità di "ricordare" lo stato del carrello dopo aver ricaricato la pagina. Se aggiungi un prodotto nel carrello dopo avera ricaricato la pagina, la notifica apparirà nuovamente. Continuerà ad apparire ogni volta che ricarichi la pagina dei prodotti. Questo perché `product.isInCart` è `true` quando la pagina termina il caricamento, quindi l'Effetto chiamerà `showNotification()` subito dopo il render.

**Quando non sei sicuro se il codice dovrebbe stare in un Effetto o in un event handler, chiediti *perché* il tuo codice dovrebbe eseguire. Usa un Effetto solo per il codice che deve eseguire *perché* il componente è stato mostrato all'utente** In questo esempio, la notifica dovrebbe apparire a causa del fatto che l'utente ha *premuto il bottone*, non perché la pagina è stata mostrata! Elimina l'Effetto e inserisci la logica condivisa all'interno di una funzione chiamata da entrambi gli event handlers:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Buono: La logica specifica per un evento è chiamata all'interno del suo event handler
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Questo rimuove l'Effetto inutile e contemporaneamente risolve il bug.

### Inviare una richiesta POST {/*sending-a-post-request*/}

Questo componente `Form` invia due tipi di richieste POST. Invia un evento di analytics dopo il mounting. Quando riempi il form e clicchi sul pulsante di Submit, invia una richiesta POST sull'endpoint `/api/register`:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Buono: Questa logica funzionerà perché il componente è stato già mostrato  
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Evita: logica specifica di un evento in un Effetto.
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Applichiamo lo stesso criterio dell'esempio precedente.

la richiesta POST di analytics dovrebbe rimanere in un Effetto. Questo perché il _motivo_ per inviare un evento di analytics è che il form viene mostrato. (Dovrebbe eseguire due volte in modalità di sviluppo, [leggi qui](/learn/synchronizing-with-effects#sending-analytics) per capire come gestirlo.)

Comunque, la richiesta POST `/api/register` non è causata dal fatto che il Form viene _mostrato_. Vuoi soltanto inviare la richiesta in un momento specifico nel tempo: quando l'utente preme il pulsante. Dovrebbe succedere _solo in quella interazione specifica_. Elimina il secondo Effetto e sposta la richiesta POST nell'event handler:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Buono: Questa logica funziona perché l'evento è stato mostrato
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Buona: La logica specifica dell'evento è nel suo event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Quando devi scegliere se inserire della logica in un event handler o in un Effetto, la domanda principale a cui devi rispondere è _che tipo di logica_ è dal punto di vista dell'utente. Se è logica causata da una interazione particolare, mantienila nel suo event handler. Se è causata dal fatto che l'utente sta _vedendo_ il componente sullo schermo, mantienila nell'Effetto.

### Catena di computazione {/*chains-of-computations*/}

A volte puoi essere tentato di concatenare Effetti che modificano un pezzo di state basandosi su altro state:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Evita: Catene di Effetti che modificano lo stato soltanto per scatenare altri Effetti  
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

Ci sono due problemi con questo codice:

Un problema è che è molto inefficiente: il componente (e i suoi figli) devono re-renderizzare tra ogni chiamata `set` nella catena. Nell'esempio su, nel caso peggiore (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) ci sono tre re-renders non necessari dell'albero sottostante.

Anche se non è lento, con l'evolversi del codice, andrai incontro a casi in cui la "catena" che hai scritto non soddisfa i requisiti. Immagina che stai aggiungendo un modo per muoverti attraverso lo storico dei movimenti di un gioco. Lo faresti aggiornando ogni variabile di state dal passato. Tuttavia, impostare lo state `card` da un valore passato azionerebbe la catena dell'Effetto nuovamente e cambierebbe i dati che stai mostrando. Il codice così è rigido e fragile.

In questo caso, è meglio calcolare ciò che puoi durante il rendering, e regolare lo state nell'event handler:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calcola ciò che puoi durante il rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calcola il prossimo state nell'event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount < 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

Questo è molto più efficiente. Inoltre, se implementi un modo per vedere lo storico della partita, ora sei capace di muovere ogni variabile di state nel passato senza azionare la catena dovuta all'Effetto che regola ogni altro valore. Se necessiti di riutilizzare logica tra diversi event handlers, puoi [estrarre una funzione](#sharing-logic-between-event-handlers) e chiamarla al loro interno.

Ricorda che negli event handlers, [lo state si comporta come un'istantanea.](/learn/state-as-a-snapshot) Per esempio, anche dopo aver chiamato `setRound(round + 1)`, la variabile di state `round` corrisponderà al valore che aveva quando l' utente ha cliccato sul pulsante. Se hai bisogno del prossimo valore per effettuare calcoli, definiscilo manualmente in modo simile a questo: `const nextRound = round + 1`.

In alcuni casi, *non puoi* calcolare il prossimo stato direttamente nell'event handler. Per esempio, immagina un form con dropdowns multiple in cui la option della prossima dropdown dipende dal valore selezionato in quella precedente. In questo caso, una catena di Effetti è appropriata perché stai sincronizzando lo state con la rete.

### Inizializzando l'applicazione {/*initializing-the-application*/}

Alcune logiche dovrebbero partire solo una volta dopo che l'app viene caricata.

Potresti essere tentato di inserirla in un Effetto al componente di primo livello:

```js {2-6}
function App() {
  // 🔴 Evita: Effetti con logica che dovrebbe eseguire una volta sola
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

Tuttavia, scoprirai presto che [gira due volte in modalità di sviluppo.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) Questo può causare problemi--per esempio, potrebbe invalidare il token di autenticazione perché la funzione non era stata progettata per essere chiamata due volte. In generale, i tuoi componenti dovrebbero essere resilienti quando vengono rimontati. Includendo il componente di primo livello `App`.

Anche se in produzione potrebbe non essere smontato mai, seguire gli stessi vincoli in tutti i componenti rende più facile muovere e riutilizzare codice. Se della logica deve eseguire *una volta per caricamento dell'app* invece che *una volta ogni volta che il componente viene montato*, aggiungi una variabile al primo livello per tracciarne l'esecuzione:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Esegue una volta quando l'app carica 
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

Puoi anche eseguirlo durante l'inizializzazione del modulo e prima della renderizzazione dell'app:

```js {1,5}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
   // ✅ Esegue una volta quando l'app carica
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Il codice al primo livello esegue una sola volta quando il componente viene importato--anche quando non viene mai renderizzato. Per evitare rallentamenti o comportamenti insoliti quando importi componenti, non usare troppo questo pattern. Mantieni la logica di inizializzazione dell'app nel modulo dei componenti radice come `App.js` o nel punto di ingresso della tua applicazione.

### Notificare i componenti padre dei cambiamenti di state {/*notifying-parent-components-about-state-changes*/}

Diciamo che stai scrivendo un componente `Toggle` con uno state interno `isOn` che può essere `true` o `false`. Ci sono diversi modi per cambiarlo (cliccando o trascinando). Vuoi notificare il componente padre ogni volta che lo state interno del componente `Toggle` cambia, quindi esponi l'evento `onChange` e lo chiami da un Effetto:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Evita: l'handler di onChange esegue troppo tardi
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Come prima, questo non è ideale. Il componente `Toggle` aggiorna il suo state per primo, poi React aggiorna lo schermo. poi React esegue l'Effetto, che chiama la funzione `onChange` passata dal componente padre. Adesso il componente padre aggiorna il suo state, dando inizio ad un nuovo passaggio di render. Sarebbe meglio fare tutto questo in un unico passaggio.

Elimina l'Effetto e aggiorna lo state di *entrambi* i componenti nello stesso event handler:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Buono: Aggiorna tutto durante l'evento che ha causato gli aggiornamenti
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

Con questo approccio, entrambi i componenti `Toggle` e il suo componente padre aggiornano il proprio state durante l'evento. React [raggruppa gli aggiornamenti](/learn/queueing-a-series-of-state-updates) di componenti diversi insieme, così che ci sarà solo un passaggio di render.

Potresti anche voler rimuovere tutto lo stato insieme, e invece ricevere dal `isOn` componente padre:

```js {1,2}
// ✅ Va anche bene così: il componente è completamente controllato dal padre
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["Spostare lo state su"](/learn/sharing-state-between-components) permette al componente padre di controllare completamente il componente `Toggle` cambiando il suo stesso state. Significa che il componente padre dovrà contenere più logica, ma ci sarà meno state da gestire. Ogni volta che provi a mantenere sincronizzati due state diversi, prova invece a spostare lo state su!

### Passare dati al padre {/*passing-data-to-the-parent*/}

Questo componente `Child` prende dei dati e li passa al componente `Parent` in un Effetto:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Evita: Passaggio di dati al padre in un Effetto
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

In React, i dati vengono trasferiti dal componente padre al figlio. Quando vedi qualcosa di sbagliato su schemo, puoi tracciare da dove proviene l'informazione percorrendo la catena dei componenti fino a trovare quale componente passa la prop sbagliata o ha lo state sbagliato. Quando i componenti figlio aggiornano lo state del proprio componente padre in un Effetto, il trasferimento di dati diventa molto difficile da tracciare. Siccome sia il componente figlio che il padre necessitano di avere lo stesso dato, lascia che il componente padre prenda quel dato e lo *passi giù* al componente figlio.

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Buono: Passare i dati giù nel componente figlio
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Questo è più semplice e rende prevedibile il trasferimento dei dati: i dati vengono trasferiti giù dal componente padre al figlio.

### Iscriversi ad uno store esterno {/*subscribing-to-an-external-store*/}

A volte, i tuoi componenti necessitano di iscriversi a dati che esistono al di fuori dello state di React. Questi dati potrebbero provenire da una libreria di terze parti o da una API propria del browser. Siccome questi dati possono cambiare senza che React se ne accorga, hai bisogno di iscrivere manualmente i tuoi componenti. Questa cosa viene fatta all'interno di un Effetto, per esempio:

```js {2-17}
function useOnlineStatus() {
  // Non ideale: Iscrizione manuale in un Effetto
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Qui, il componente si iscrive a uno store di dati esterno (in questo caso, l'API del browser `navigator.onLine`). Siccome questa API non esiste sul server (quindi non può essere usata dall'HTML iniziale), lo state viene inizializzato a `true`. Quando il valore dei cambiamenti dello store cambiano nel browser, il componente aggiorna il proprio state.

Nonostante sia comune usare Effetti per casi simili, è preferibile l'hook built-in di React per iscriversi a store esterni. rimuovi l'Effetto e sostituiscilo con una chiamata a [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Buono: Iscriviti ad uno store esterno con un Hook built-in
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Questo approccio è meno soggetto ad errori rispetto a sincronizzare manualmente dati mutabili allo state React con un Effetto. In genere, scriveresti un hook personalizzato `useOnlineStatus()` così da non dover riscrivere lo stesso codice per altri componenti. [Leggi di più su come iscriversi a store esterni da componenti React.](/reference/react/useSyncExternalStore)

### Recuperare i dati {/*fetching-data*/}

Molte applicazioni usano Effetti per recuperare dati. È abbastanza comune scrivere il recupero dei dati tramite Effetticosì:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Evita: Recupero senza logica di cleanup
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

*Non* hai bisogno di muovere questo recupero dati in un event handler.

Questa potrebbe sembrare una contraddizione con gli esempi precedenti dove avevi necessità di inserire la logica all'interno dell'event handler! Però, considera che non è *l'evento di scrittura* la ragione principale che deve scatenare il recupero dei dati. Gli input di ricerca sono in genere popolati dall'URL, e l'utente potrebbe navigare avanti e indietro senza toccare l'input.

Non importa da dove provengono i valori di `page` e `query`. Finché questo componente è visibile, vuoi mantenere `results` [sincronizzato](/learn/synchronizing-with-effects) a dati provenienti dalla rete per i valori correnti di `page` e `query`. Ecco perché è un Effetto.

Però, il codice qui sopra ha un bug. Immagina di scrivere `"hello"` velocemente. Quindi `query` cambia da `"h"`, a `"he"`, `"hel"`, `"hell"`, e `"hello"`. Questo causerà una serie di richieste separate, ma non c'è alcuna garanzia sull'ordine in cui arriveranno le risposte. Per esempio, la risposta di `"hell"` potrebbe arrivare *dopo* quella di `"hello"`. Siccome chiamerà `setResults()` per ultima, mostrerai i risultati sbagliati. Questa viene chiamata ["race condition"](https://en.wikipedia.org/wiki/Race_condition): due richieste diverse hanno "gareggiato" l'una contro l'altra e sono arrivate in un ordine diverso da quello previsto.

**Per aggiustare questa race condition, hai bisogno di [aggiungere una funzione di cleanup](/learn/synchronizing-with-effects#fetching-data) per ignorare le risposte appese:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Questo assicura che quando il tuo Effetto recupera i dati, vengono ignorate tutte le richieste tranne l'ultima.

Gestire race conditions non è l'unica difficoltà quando si implementa il recupero dei dati. Potresti anche voler pensare di implementare il caching per le risposte (così che l'utente possa cliccare Indietro e vedere lo schermo precedente istantaneamente), come recuperare i dati nel server (così che il primo HTML renderizzato dal server contenga il contenuto già recuperato invece che uno spinner), e come evitare il waterfall della rete (così che un componente figlio possa recuperare i dati senza dover aspettare ogni componente padre).

**Questi problemi si riscontrano in tutte le librerie UI, non solo React. Risolverli non è semplice, per questo i [frameworks](/learn/start-a-new-react-project#full-stack-frameworks) moderni offrono metodi più efficienti per recuperare i dati invece di usare gli Effetti.**

Se non usi un framework (e non ne vuoi creare uno) ma vorresti rendere il recupero di dati dagli Effetti più ergonomico, considera di estrarre la logica di recupero all'interno di un Hook personalizzato come in questo esempio:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Probabilmente aggiungerai altra logica per la gestione degli errori e tracciare ogni volta che il contenuto sta caricando. Puoi creare hook da te o usare una delle soluzioni già disponibili nell'ecosistema React. **Anche se non sarà efficiente come usare un meccanismo di recupero dati di un framework, muovere i dati in un hook personalizzato renderà più semplice adottare strategie di recupero più efficienti in seguito.**

In generale, quando devi scrivere Effetti, fai caso a tutti i pezzi di funzionalità che puoi estrarre in un hook personalizzato con un API più dichiarativa come questo `useData`. Meno chiamate "crude" a `useEffect` vengono fatte nei componenti, più semplce sarà manutenere l'applicazione.

<Recap>

- Se puoi calcolare qualcosa durante il render, non ti serve un Effetto.
- Per memorizzare calcoli dispendiosi, aggiungi `useMemo` invece di `useEffect`.
- Per resettare lo state dell'intero albero di componenti, passa una prop `key` differente.
- Per resettare un particolare pezzo di state come conseguenza di un cambiamento di prop, fallo durante il rendering.
- Il codice che esegue perchè un componente è stato *mostrato* dovrebbe stare in un Effetto, il resto dovrebbe stare negli eventi.
- Se hai bisogno di aggiornare lo state di diversi componenti, è meglio farlo in un evento singolo.
- Quando provi a sincronizzare variabili di state in componenti diversi, considera di passare lo state su.
- Puoi recuperare dati tramite gli Effetti, ma devi implementare funzioni di cleanup per evitare race conditions.

</Recap>

<Challenges>

#### Trasforma i dati senza Effetti {/*transform-data-without-effects*/}

Il componente `TodoList` mostra una lista di cose da fare. Quando la casella di controllo "Show only active todos" è spuntata, i todos completati non vengono mostrati nella lista. A prescindere da quali cose da fare sono visibili, il piè di pagina mostrerà il conteggio delle cose da fare ancora non completate.

Semplifica questo componente rimuovendo tutti gli state e gli Effetti non necessari.

<Sandpack>

```js {expectedErrors: {'react-compiler': [12, 16, 20]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

Se puoi calcolare qualcosa durante il rendering, non hai bisogno né di state né di Effetti che lo aggiornano.

</Hint>

<Solution>

Ci sono due state essenziali in questo esempio: la lista di `todos` e la variabile di stato `showActive` che rappresenta quando una casella di controllo è spuntata. Tutte le altre variabili di state sono [ridondanti](/learn/choosing-the-state-structure#avoid-redundant-state) e possono essere calcolati durante il rendering. Questo include il piè di pagina che puoi muovere direttamente nel JSX circostante.

Il tuo risultato dovrebbe essere questo:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Memorizza un calcolo senza Effetti {/*cache-a-calculation-without-effects*/}

In questo esempio, il filtraggio delle cose da fare è stato estratto in una funzione separata chiamata `getVisibleTodos()`. Questa funzione contiene un `console.log()` all interno che ti aiuta a capire quando viene chiamata. Attiva/Disattiva "Show only active todos" e nota che `getVisibleTodos()` viene eseguita di nuovo. Questo era prevedibile perché le cose da fare visibili cambiano quando ne attivi/disattivi uno.

Il tuo compito è di rimuovere l'Effetto che ricalcola la lista `visibleTodos` nel componente `TodoList`. In ogni caso, hai bisogno di assicurarti che `getVisibleTodos()` non venga rieseguita (e quindi non stampa a schermo nessun log) quando scrivi all'interno dell'input.

<Hint>

Una soluzione è aggiungere una chiamata `useMemo` per memorizzare le cose da fare visibili a schermo. C'è anche un altra soluzione meno ovvia.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

Rimuovi la variabile di state e l'Effetto, al loro posto aggiungi una chiamata a `useMemo` per memorizzare il risultato di `getVisibleTodos()`:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Con questo cambiamento, `getVisibleTodos()` verrà chiamata solo se `todos` o `showActive` cambiano. Scrivere all'interno dell'input cambia solo la variabile di state `text`, quindi non scatena una chiamata a `getVisibleTodos()`.

C'è anche un'altra soluzione che non necessita l'uso di `useMemo`. Siccome la variabile di stato `text` non può influenzare la lista di cose da fare, puoi estrarre il form `NewTodo` in un componente separato, e muovere la variabile di state `text` al suo interno:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Anche questo approccio soddsfa i requisiti. Quando scrivi all'interno dell'input, solo la variabile di state `text` si aggiorna. Siccome la variabile di state `text` è nel compoente figlio `NewTodo`, il componente padre `TodoList` non viene re-renderizzato. Ecco perché `getVisibleTodos()` non viene chiamata quando scrivi. (Viene chiamata di nuova se `TodoList` re-renderizza per un'altra ragione.)

</Solution>

#### Reset dello state senza Effetti {/*reset-state-without-effects*/}

Il componente `EditContact` riceve un oggetto di contatti di questo tipo `{ id, name, email }` e una prop `savedContact`. Prova a modificare il nome e la email. quando premi Save, il pulsante di contatto sul form si aggiorna con il nome modificato. quando premi Reset, ogni cambiamento pendente viene annullato.  Gioca con questa UI per comprenderla meglio.

Quando selezioni un contatto con i pulsanti in alto, il form si resetta per riflettere i dettagli del contatto. Questo viene fatto con un Effetto dentro `EditContact.js`. Rimuovi questo Effetto. Trova un altro modo per resettare il form quando `savedContact.id` cambia.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js {expectedErrors: {'react-compiler': [8, 9]}} src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

Sarebbe bello se ci fosse un modo per dire a React che quando `savedContact.id` cambia, il form  `EditContact` è concettualmente un _form di contatto diverso_ e non dovrebbe conservare lo state. Ricordi un modo per farlo?

</Hint>

<Solution>

Dividi il componente `EditContact` in due. Muovi tutto lo stato del form all'interno del componente `EditForm`. Esporta il componente `EditContact`, e fai in modo che passi `savedContact.id` come `key` per il componente `EditForm` interno. Come risultato, il componente `EditForm` interno resetta tutto lo stato del suo form e ricrea il DOM ogni volta che selezioni un contatto diverso.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Fai un Submit del From senza usare Effetti {/*submit-a-form-without-effects*/}

Questo componente `Form` ti permette di mandare un messaggio ad un amico. Quando esegui la submit del form, la variabile di stato `showForm` viene settata a `false`. Questo fa partire l'Effetto che chiama `sendMessage(message)`, che manda il messaggio (lo puoi vedere in console). Dopo che il messaggio viene inviato, vedi un dialog "Thank you" con un pulsante "Open chat" che ti permette di ritornare al form.

Gli utenti della tua app stanno inviando troppi messaggi. per far si che chattare diventi un po più difficoltoso, hai deciso di mostrare il dialog "Thank you" *prima* del form. Cambia la variabile `showForm` per inizializzarla a `false` invece che `true`. Appena fai questo cambiamento, la console mostrerà che è stato inviato un messaggio vuoto. Qualcosa in questa logica è sbagliato! 

Qual è la causa di questo problema? E come puoi risolverlo?

<Hint>

Il messaggio dovrebbe essere inviato _perché_ l'utente ha visto il dialog "Thank you"? O è il contrario?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

La variabile di state `showForm` determina quando mostrare il form o il dialog "Thank you". Però, non stai inviando il messaggio perché la dialog "Thank you" è stata _mostrata_. Vuoi inviare il messaggio perché l'utente ha _eseguito l'invio del form_. Elimina l'Effetto e muovi la chiamata `sendMessage` all'interno dell'event handler `handleSubmit`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Nota come in questa versione, solo _l'invio del form_ (che è un evento) causa l'invio del messaggio. Funziona ugualmente bene a prescindere se `showForm` è settato a `true` o `false`. (Impostala a `false` e nota che non ci sono messaggi extra sulla console.)

</Solution>

</Challenges>
