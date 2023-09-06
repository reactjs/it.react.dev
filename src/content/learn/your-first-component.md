---
title: Il Tuo Primo Componente
---

<Intro>

I *componenti* sono uno dei concetti fondamentali di React. Sono le fondamenta su cui si costruiscono le interfacce utente (UI), il che li rende il punto perfetto per iniziare il tuo viaggio alla scoperta di React!

</Intro>

<YouWillLearn>

* Che cos'è un componente
* Che ruolo hanno i componenti in un'applicazione React
* Come definire il tuo primo componente React

</YouWillLearn>

## Componenti: i mattoni con cui costruire una UI {/*components-ui-building-blocks*/}

Sul Web, HTML ci permette di creare documenti di testo strutturati, grazie a una serie di tag nativi come `<h1>` e `<li>`:

```html
<article>
  <h1>Il mio primo componente</h1>
  <ol>
    <li>Componenti: i mattoni con cui costruire una UI</li>
    <li>Definire un componente</li>
    <li>Usare un componente</li>
  </ol>
</article>
```

Questo markup (la struttura logica di una pagina web) rappresenta questo articolo `<article>`, il suo titolo `<h1>` e un indice (abbreviato) come una lista ordinata `<ol>`. Un markup come questo, combinato con il codice CSS per lo stile e con JavaScript per l'interattività, è alla base di ogni barra laterale, avatar, modale, dropdown - ogni pezzo di interfaccia utente che si vede sul Web.

React consente di combinare markup, CSS e JavaScript in "componenti" personalizzati, **elementi dell'interfaccia utente riutilizzabili per la tua applicazione.** Il codice dell'indice che hai visto sopra potrebbe essere trasformato in un componente `<TableOfContents />` da renderizzare in ogni pagina. Sotto il cofano, esso utilizza ancora gli stessi tag HTML come `<article>`, `<h1>`, ecc.

Proprio come con i tag HTML, è possibile comporre, ordinare e annidare i componenti per progettare intere pagine. Ad esempio, la pagina di documentazione che stai leggendo è composta da componenti React:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Documentazione</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Man mano che il tuo progetto cresce, noterai che molte interfacce possono essere composte riutilizzando componenti già scritti, velocizzando il tuo processo di sviluppo. Il nostro indice qui sopra potrebbe essere aggiunta a qualsiasi pagina o schermata con `<TableOfContents />`! Puoi anche iniziare il tuo progetto con le migliaia di componenti condivisi dalla comunità open source di React, come [Chakra UI](https://chakra-ui.com/) e [Material UI.](https://material-ui.com/).

## Definire un componente {/*defining-a-component*/}

Solitamente, quando si creavano le pagine web, gli sviluppatori web definivano la struttura logica di una pagina web e il suo contenuto e poi aggiungevano l'interattività "spruzzando" un po' di JavaScript. Questa soluzione funzionava bene quando l'interattività era un qualcosa di _nice-to-have_ sul web. Al giorno d'oggi è un qualcosa di previsto per molti siti e per tutte le applicazioni. React mette l'interattività al primo posto, pur utilizzando la stessa tecnologia: **un componente React è una funzione JavaScript che si può _spruzzare con del markup_.** Ecco come si presenta (puoi modificare l'esempio qui sotto):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Ed ecco come costruire un componente:

### Step 1: Esportare il componente {/*step-1-export-the-component*/}

Il prefisso `export default` è una [sintassi JavaScript standard](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (non specifica a React). Consente di contrassegnare la funzione principale di un file in modo da poterla importare successivamente in altri file. (Maggiori informazioni sull'importazione in [Importazione ed esportazione di componenti](/learning/importing-and-exporting-components))!

### Step 2: Definire la funzione {/*step-2-define-the-function*/}

Con `function Profile() { }` si definisce una funzione JavaScript con il nome `Profile`.

<Pitfall>

I componenti React sono normali funzioni JavaScript, ma **il loro nome deve iniziare con una lettera maiuscola** o non funzionano!

</Pitfall>

### Step 3: Aggiungere il markup {/*step-3-add-markup*/}

Il componente ritorna un tag `<img />` con gli attributi `src` e `alt`. `<img />` è scritto come fosse HTML, ma in realtà si tratta di codice JavaScript sotto il cofano! Questa sintassi si chiama [JSX](/learn/writing-markup-with-jsx) e consente di incorporare markup all'interno di JavaScript.

Le istruzioni di ritorno possono essere scritte tutte su una riga, come in questo componente:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Ma se il tuo markup non si trova tutto sulla stessa riga della parola chiave `return`, è necessario racchiuderlo (_wrap_) in una coppia di parentesi tonde:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Senza parentesi, qualsiasi riga di codice successiva alla riga contenente `return` [sarà ignorata](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Usare un componente {/*using-a-component*/}

Ora che è stato definito il componente `Profile`, è possibile annidarlo all'interno di altri componenti. Per esempio, si può esportare un componente `Gallery` che utilizza più componenti `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Scienziati incredibili</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### Cosa vede il browser {/*what-the-browser-sees*/}

Nota la differenza tra il maiuscolo e il minuscolo:

* `<section>` è minuscolo, in modo che React sappia che ci riferiamo a un tag HTML.
* `<Profile />` inizia con la `P` maiuscola, quindi React sa che vogliamo usare il nostro componente chiamato `Profile`.

E `Profile` contiene lui stesso altri tag HTML: `<img />`. Alla fine, questo è ciò che vede il browser:

```html
<section>
  <h1>Scienziati incredibili</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Annidamento e organizzazione dei componenti {/*nesting-and-organizing-components*/}

I componenti sono normali funzioni JavaScript, quindi è possibile avere più componenti nello stesso file. Questo è comodo quando i componenti sono relativamente piccoli o strettamente correlati tra loro. Se questo file dovesse diventare troppo affollato, puoi sempre spostare `Profile` in un file separato. Imparerai come fare a breve nella [pagina sulle importazioni.](/learning/importing-and-exporting-components).

Poiché i componenti `Profile` sono renderizzati all'interno di `Gallery` - anche più volte! - possiamo dire che `Gallery` è un **componente genitore,** che renderizza ogni `Profile` come un "figlio". Questa è una parte della magia di React: si può definire un componente una sola volta e poi usarlo in tutti i posti e tutte le volte che si vuole.

<Pitfall>

I componenti possono renderizzare altri componenti, ma **non si devono mai annidare le loro definizioni:**

```js {2-5}
export default function Gallery() {
  // 🔴 Non definire mai un componente all'interno di un altro componente!
  function Profile() {
    // ...
  }
  // ...
}
```

Il codice qui sopra è [molto lento e causa dei bug.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Invece, definisci ogni componente al livello principale:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Dichiara i componenti al livello principale
function Profile() {
  // ...
}
```

Quando un componente figlio ha bisogno di alcuni dati da un genitore, [passaglieli tramite props](/learn/passing-props-to-a-component), invece di annidare le definizioni.

</Pitfall>

<DeepDive>

#### Componenti fino in fondo {/*components-all-the-way-down*/}

La tua applicazione React inizia con un componente "radice" (_root_). Di solito, viene creato automaticamente quando si comincia un nuovo progetto. Ad esempio, se utilizzi [CodeSandbox](https://codesandbox.io/) o se usi il framework [Next.js](https://nextjs.org/), il componente radice è definito in `pages/index.js`. In questi esempi, abbiamo esportato il componente radice.

La maggior parte delle applicazioni React utilizza i componenti fino in fondo. Ciò significa che non userai i componenti solo per piccole parti riutilizzabili come i pulsanti, ma anche per parti più grandi come barre laterali, elenchi e, infine, pagine complete! I componenti sono un modo pratico per organizzare il codice e il markup dell'interfaccia utente, anche se alcuni di essi dovessero essere utilizzati una sola volta.

I [framework basati su React](/learn/start-a-new-react-project) compiono un ulteriore passo avanti. Invece di usare un file HTML vuoto e lasciare che React si occupi di gestire la pagina con JavaScript, generano automaticamente l'HTML dai componenti React. Questo permette all'applicazione di mostrare alcuni contenuti prima del caricamento del codice JavaScript.

Tuttavia, molti siti web usano React solo per [aggiungere interattività a pagine HTML esistenti.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) Hanno molti componenti radice invece di uno singolo per l'intera pagina. È possibile utilizzare tanto o poco React in base alle tue esigenze.

</DeepDive>

<Recap>

Hai appena avuto il tuo primo assaggio di React! Riassumiamo alcuni punti chiave.

* React consente di creare componenti, **elementi riutilizzabili dell'interfaccia utente per la tua applicazione.**
* In un'applicazione React, ogni elemento dell'interfaccia utente è un componente.
* I componenti React sono normali funzioni JavaScript, tranne che per il fatto che:

  1. I loro nomi iniziano sempre con la lettera maiuscola.
  2. Ritornano markup JSX.

</Recap>



<Challenges>

#### Esporta il componente {/*export-the-component*/}

Questa sandbox non funziona perché il componente principale non viene esportato:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Cerca di risolvere il problema da solo/a prima di guardare alla soluzione!

<Solution>

Aggiungi `export default` prima della definizione della funzione, in questo modo:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Ci si potrebbe chiedere perché scrivere `export` da solo non sia sufficiente a risolvere questo esempio. Si può imparare la differenza tra `export` e `export default` in [Importazione ed esportazione di componenti.](/learning/importing-and-exporting-components)

</Solution>

#### Correggere l'istruzione di ritorno {/*fix-the-return-statement*/}

C'è qualcosa che non va in questa istruzione di ritorno. Si può risolvere?

<Hint>

Potresti ricevere un errore "Unexpected token" mentre cerchi di risolvere questo problema. In tal caso, verifica che il punto e virgola compaia *dopo* la parentesi di chiusura. Lasciare un punto e virgola all'interno di `return ( )` causerà un errore.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

È possibile risolvere questo componente spostando l'istruzione di ritorno su una sola riga, in questo modo:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Oppure racchiudendo il markup JSX restituito in una coppia di parentesi che si apre subito dopo `return`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Trova l'errore {/*spot-the-mistake*/}

C'è qualcosa di sbagliato nel modo in cui il componente `Profile` è definito e utilizzato. Riesci a individuare l'errore? (Cerca di ricordare come React distingue i componenti dai normali tag HTML).

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Scienziati incredibili</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

I nomi dei componenti React devono iniziare con una lettera maiuscola.

Cambia `function profile()` in `function Profile()`, e poi cambia ogni `<profile />` in `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Scienziati incredibili</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Il tuo componente {/*your-own-component*/}

Definisci un componente da zero. Puoi dargli qualsiasi nome valido e restituire qualsiasi markup. Se sei a corto di idee, si puoi definire un componente `Congratulations` che mostri `<h1>Buon lavoro!</h1>`. Non dimenticate di esportarlo!

<Sandpack>

```js
// Definisci il tuo componente qui sotto!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
