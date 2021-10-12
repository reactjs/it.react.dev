---
id: add-react-to-a-website
title: Aggiungere React Ad Un Sito
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

Utilizza React quel poco o quel tanto che ti basta.

React è stato progettato fin dall'inizio per essere adottato gradualmente e **puoi utilizzarlo quel poco o quel tanto che ti basta**. Forse devi solamente aggiungere un "pizzico di interattività" a una pagina esistente. I componenti React sono un ottimo modo per farlo.

La maggior parte dei siti non sono applicazioni single-page e non hanno bisogno di esserlo. Prova ad utilizzare React in una piccola parte del tuo sito, con **poche righe di codice e nessuno strumento di build**. In seguito, puoi espandere gradualmente la sua presenza, oppure puoi mantenerlo confinato ad alcuni widget dinamici.

---

- [Aggiungi React in Un Minuto](#add-react-in-one-minute)
- [Opzionale: Prova React con JSX](#optional-try-react-with-jsx) (non è necessario alcun bundler!)

## Aggiungi React in Un Minuto {#add-react-in-one-minute}

In questa sezione, ti mostreremo come aggiungere un componente React ad una pagina HTML esistente. Per allenarti, puoi utilizzare il tuo sito oppure creare una pagina HTML vuota di prova.

Non ci saranno requisiti di installazione da soddisfare o strumenti complicati da utilizzare -- **per completare questa sezione, ti servono solamente una connessione a internet e un minuto del tuo tempo.**

Opzionale: [Scarica l'esempio completo (2KB zippato)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### Passo 1: Aggiungi un Contenitore DOM all'HTML {#step-1-add-a-dom-container-to-the-html}

Per prima cosa, apri la pagina HTML che vuoi modificare. Aggiungi un tag `<div>` vuoto per contrassegnare il punto in cui vuoi visualizzare qualcosa con React. Ad esempio:

```html{3}
<!-- ... HTML esistente ... -->

<div id="contenitore_bottone_like"></div>

<!-- ... HTML esistente ... -->
```

Abbiamo assegnato a questo `<div>` un attributo HTML `id` univoco. Questo ci consentirà più tardi di trovarlo con il codice JavaScript e di visualizzare un componente React al suo interno.

>Consiglio
>
>Puoi posizionare un `<div>` "contenitore" come questo **ovunque** all'interno del tag `<body>`. Puoi inserire tutti i contenitori DOM indipendenti di cui hai bisogno in una pagina. Solitamente vengono lasciati vuoti -- React sostituirebbe comunque qualsiasi cosa si trovasse all'interno dei contenitori DOM.

### Passo 2: Aggiungi i Tag Script {#step-2-add-the-script-tags}

Successivamente, aggiungi questi tre tag `<script>` alla pagina HTML, subito prima del tag di chiusura `</body>`:

```html{5,6,9}
  <!-- ... altro HTML ... -->

  <!-- Carica React. -->
  <!-- Nota: quando rilasci il codice in produzione, sostituisci "development.js" con "production.min.js". -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>

  <!-- Carica il nostro componente React. -->
  <script src="bottone_like.js"></script>

</body>
```

I primi due tag caricano React. Il terzo carica il codice del tuo componente.

### Passo 3: Crea un Componente React {#step-3-create-a-react-component}

Crea un file chiamato `bottone_like.js` accanto alla tua pagina HTML.

Apri questo **[codice iniziale](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** e incollalo nel file appena creato.

>Consiglio
>
>Questo codice definisce un componente React chiamato `LikeButton` (bottone "Mi Piace"). Non preoccuparti se non lo capisci subito -- illustreremo i concetti fondamentali di React nel [tutorial "mani in pasta"](/tutorial/tutorial.html) e nella [guida ai concetti fondamentali](/docs/hello-world.html). Per ora, limitiamoci a fare in modo che il componente venga mostrato sullo schermo!

Dopo il **[codice iniziale](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, aggiungi due linee in fondo a `bottone_like.js`:

```js{3,4}
// ... il codice iniziale che hai incollato ...

const contenitoreDom = document.querySelector('#contenitore_bottone_like');
ReactDOM.render(e(LikeButton), contenitoreDom);
```

Queste due linee di codice servono a trovare il `<div>` che abbiamo aggiunto al nostro HTML nel passo 1 e a visualizzare il nostro componente React del bottone "Mi Piace" al suo interno.

### Tutto qua! {#thats-it}

Non c'è nessun passo 4. **Hai appena aggiunto il primo componente React al tuo sito internet!**

Leggi le sezioni successive per avere più consigli su come integrare React.

**[Guarda il codice completo dell'esempio](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Scarica l'esempio completo (2KB zippato)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### Consiglio: Riutilizza i Componenti {#tip-reuse-a-component}

Di solito, vorrai visualizzare i componenti React in più punti nella pagina HTML. Ecco un esempio che visualizza il bottone "Mi Piace" tre volte e gli passa alcuni dati:

[Guarda il codice completo dell'esempio](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[Scarica l'esempio completo (2KB zippato)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>Nota
>
>Questa strategia è utile soprattutto quando le parti della pagina realizzate con React sono isolate l'una dall'altra. All'interno del codice React, è più semplice invece utilizzare la [composizione di componenti](/docs/components-and-props.html#composing-components).

### Consiglio: Minimizza il JavaScript per la Produzione {#tip-minify-javascript-for-production}

Prima di rilasciare il tuo sito in produzione, ricordati che il codice JavaScript non minimizzato può rallentare significativamente la pagina per i tuoi utenti.

Se minimizzi già gli script dell'applicazione, **il tuo sito sarà pronto per la produzione** se ti assicuri che l'HTML rilasciato carichi le versioni degli script di React che finiscono con `production.min.js`:

```js
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

Se invece non hai già un passaggio di minimizzazione dei tuoi script, [ecco un modo per introdurlo](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## Opzionale: Prova React con JSX {#optional-try-react-with-jsx}

Negli esempi precedenti, abbiamo utilizzato solamente caratteristiche supportate nativamente dai browser. Ecco perché abbiamo utilizzato una funzione JavaScript per dire a React cosa visualizzare:

```js
const e = React.createElement;

// Mostra un <button> "Mi Piace"
return e(
  'button',
  { onClick: () => this.setState({ piaciuto: true }) },
  'Mi Piace'
);
```

Tuttavia, React offre anche la possibilità di utilizzare [JSX](/docs/introducing-jsx.html):

```js
// Mostra un <button> "Mi Piace"
return (
  <button onClick={() => this.setState({ piaciuto: true })}>
    Mi Piace
  </button>
);
```

Questi due frammenti di codice sono equivalenti. Anche se **JSX è [completamente opzionale](/docs/react-without-jsx.html)**, molte persone trovano che sia utile per scrivere il codice della UI -- non solo con React ma anche con altre librerie!

Puoi fare esperimenti con JSX utilizzando [questo convertitore online](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.15.7).

### Prova JSX Velocemente {#quickly-try-jsx}

Il modo più veloce di sperimentare JSX nel tuo progetto è aggiungere questo tag `<script>` alla tua pagina:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

Ora puoi utilizzare JSX in qualsiasi tag `<script>` aggiungendovi l'attributo `type="text/babel"`. Questo è [un file HTML di esempio con JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) che puoi scaricare ed utilizzare per i tuoi esperimenti.

Questo approccio va bene per imparare e creare demo semplici. Tuttavia, rende lento il tuo sito e **non è adatto per la produzione**. Quando sei pronto ad andare oltre, rimuovi questo nuovo tag `<script>` e gli attributi `type="text/babel"` che avevi aggiunto. Al loro posto, nella prossima sezione configurerai un preprocessore che convertirà tutti i tuoi tag `<script>` automaticamente.

### Aggiungere JSX a un Progetto {#add-jsx-to-a-project}

Aggiungere JSX a un progetto non richiede strumenti complicati come un bundler ("impacchettatore") o un server di sviluppo. Essenzialmente, aggiungere JSX **è molto simile ad aggiungere un preprocessore CSS.** L'unico requisito è installare [Node.js](https://nodejs.org/) nel tuo computer.

Naviga nella cartella del tuo progetto con il terminale e incolla questi due comandi:

1. **Passo 1:** Esegui `npm init -y` (se fallisce, [questa è una correzione](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **Passo 2:** Esegui `npm install babel-cli@6 babel-preset-react-app@3`

>Consiglio
>
>Stiamo **utilizzando npm solamente per installare un preprocessore JSX;** non ne avrai bisogno per tutto il resto. React e il codice applicativo possono essere lasciati nella forma attuale di tag `<script>`, senza modifiche.

Congratulazioni! Hai appena aggiunto un **setup JSX pronto per la produzione** al tuo progetto.

### Eseguire il Preprocessore JSX {#run-jsx-preprocessor}

Crea una cartella chiamata `src` ed esegui questo comando dal terminale:

```
npx babel --watch src --out-dir . --presets react-app/prod
```

>Nota
>
>`npx` non è un errore di battitura -- è un [esecutore di pacchetti incluso in npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>Se vedi un messaggio di errore che recita qualcosa di simile a "You have mistakenly installed the `babel` package" ("Hai installato accidentalmente il pacchetto `babel`"), potresti aver saltato [il passo precedente](#add-jsx-to-a-project). Eseguilo adesso nella stessa cartella e poi ritenta.

Non aspettare che il comando termini -- questo comando avvia un watcher ("osservatore") automatico per JSX.

Se ora crei un file chiamato `src/bottone_like.js` con questo **[codice JSX iniziale](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**, il watcher creerà un file `bottone_like.js` preprocessato contenente il codice JavaScript adatto al browser. Quando modifichi il file sorgente con JSX, la trasformazione verrà ri-eseguita automaticamente.

Come bonus, questo ti consente anche di utilizzare le caratteristiche della sintassi moderna JavaScript come le classi senza preoccuparti di rompere i vecchi browser. Lo strumento che abbiamo appena utilizzato si chiama Babel, puoi saperne di più dalla [sua documentazione](https://babeljs.io/docs/en/babel-cli/) (in inglese).

Se ti accorgi di trovarti bene con gli strumenti di build e vuoi che facciano più cose per te, [la prossima sezione](/docs/create-a-new-react-app.html) descrive alcune delle più popolari e semplici "toolchains" (combinazioni di strumenti). In caso contrario -- nessun problema, quei tag `<script>` andranno benissimo!
