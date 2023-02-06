---
id: accessibility
title: Accessibilità
permalink: docs/accessibility.html
---

## Perché usare l'accessibilità? {#why-accessibility}

L'accessibilità su web (spesso indicata anche con [**a11y**](https://en.wiktionary.org/wiki/a11y)) è il processo attraverso il quale si creano applicazioni che siano fruibili da chiunque. L'accessibilità è necessaria per permettere a tutte quelle tecnologie di assistenza di interpretare le pagine web.

React fornisce il pieno supporto per la creazione di siti web accessibili, spesso semplicemente utilizzando HTML nel modo standard.

## Standards e linee guida {#standards-and-guidelines}

### WCAG {#wcag}

L'acronimo WCAG sta per [Web Content Accessibility Guidelines](https://www.w3.org/WAI/intro/wcag) e fornisce linee guida per la creazione di pagine web accessibili.

La seguente lista fornisce un'anteprima:

- [WCAG checklist dal sito Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [WCAG checklist dal sito WebAIM](https://webaim.org/standards/wcag/checklist)
- [Checklist from The A11Y Project](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

Il documento [sull'iniziativa del web accessibile - Accessible Rich Internet Applications](https://www.w3.org/WAI/intro/aria) contiene tecniche per costruire widget JavaScript accessibili.

Tutti gli attributi HTML `aria-*` sono pienamente supportati in JSX. Mentre la maggior parte delle proprietà e attributi in React sono camelCase, gli attributi `aria-*` sono separati da trattino (-, notazione anche nota come kebab-case, lisp-case ecc.) dal momento che sono elementi HTML.

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## HTML semantico {#semantic-html}
L'HTML semantico costituisce la base per l'accessibilità in un'applicazione web. Usare diversi elementi HTML per rafforzare il significato dell'informazione nel vostro sito, spesso può portare ad avere accessibilità gratis.

- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

Alcune volte spezziamo la semantica di HTML quando inseriamo elementi come `<div>` all'interno di JSX solo per fare in modo che il nostro codice funzioni, specialmente quando lavoriamo con le liste  (`<ol>`, `<ul>` e `<dl>`) e tabelle `<table>`.
In questi casi possiamo usare i [Fragments di React](/docs/fragments.html) per raggruppare più elementi insieme.

Ad esempio, diamo uno sguardo al seguente codice

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

è possibile mappare la collezione di elementi semplicemente all'interno di fragments, vedi il codice seguente, come faresti con qualsiasi altro tipo di elemento

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Fragments should also have a `key` prop when mapping collections
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Quando non si ha bisogno delle props all'interno del tag Fragment è anche possibile utilizzare la sua [notazione abbreviata](/docs/fragments.html#short-syntax), naturalmente se è supportata:

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

Per maggiori informazioni fai riferimento alla documentazione sui [Fragments di React](/docs/fragments.html).

## Form accessibili {#accessible-forms}

### Labeling {#labeling}
Ogni elemento di un form, come ad esempio `<input>` e `<textarea>`, necessita di essere etichettato come accessibile. É necessario mettere label descrittive, dato che queste vengono processate dai lettori di schermi.

Le seguenti risorse mostrano come raggiungere tale scopo:

- [W3C mostra come etichettare elementi](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM mostra come etichettare elementi](https://webaim.org/techniques/forms/controls)
- [La Paciello Group spiega come mettere nomi accessibili](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Sebbene tutte queste pratiche standard possano essere utilizzate in React, tieni presente che l'attributo `for` in JSX viene scritto come `htmlFor`:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### Notifica degli errori all'utente {#notifying-the-user-of-errors}

Gli errori devono essere compresi da tutti gli utenti. Le seguenti risorse mostrano come esporre testi di errore ai lettori di schermo:

- [La W3C mostra le notifiche utente](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [La WebAIM guarda alla validazione dei form](https://webaim.org/techniques/formvalidation/)

## Focus Control {#focus-control}

Assicurati che la tua applicazione web sia totalmente utilizzabile tramite tastiera:

- [La WebAIM parla di accessibilità tramite tastiera](https://webaim.org/techniques/keyboard/)

### Keyboard focus and focus outline {#keyboard-focus-and-focus-outline}

Il focus della tastiera fa riferimento all'elemento del DOM selezionato per accettare un input. É semplicemente riconoscibile come un contorno sul campo di input come quello che si vede nell'immagine seguente:

<img src="../images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

É consigliabile usare il CSS per rimuovere questo contorno, ad esempio con `outline: 0`, se e solo se verrà rimpiazzato con un contorno in uno stile diverso.

### Meccanismi per spostarsi sui diversi contenuti {#mechanisms-to-skip-to-desired-content}

Fornisci all'utente un meccanismo per saltare da una sezione all'altra dell'applicazione in quanto questo aiuta a velocizzare le operazioni di navigazione tramite tastiera.

Skiplinks o i Skip Navigation Links sono link di navigazione nascosti che diventano visibili solo quando l'utente interagisce con la pagina web. Sono molto facili da implementare utilizzando ancore interne alla pagina e un po' di stile:


- [WebAIM - Skip Navigation Links](https://webaim.org/techniques/skipnav/)

Utilizza elementi di riferimento e ruoli, come ad esempio `<main>` e `<aside>`, per creare delle regioni, all'interno della pagina, per permettere all'utente di navigare da una sezione all'altra.

Per avere maggiori informazioni sull'uso di questi elementi per aumentare l'accessibilità si consiglia questa lettura:

- [Punti di riferimento accessibili](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Gestione del focus in modo programmatico {#programmatically-managing-focus}

Un'applicazione React modifica continuamente il DOM durante la sua esecuzione, quindi qualche volte è possibile che il focus della tastiera venga perso oppure si trovi su un elemento diverso da quello che ci si aspettava. Per correggere questo comportamento errato è necessario intervenire programmaticamente, ad esempio resettando il focus della tastiera sul bottone che ha aperto una finestra modale dopo che è stata chiusa.

MDN Web Docs descrive come creare dei [widget JavaScript navigabili da tastiera](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

Per fare il focus in React è possibile utilizzare le [Refs degli elementi del DOM](/docs/refs-and-the-dom.html).

Per prima cosa è necessario creare un ref ad un elemento attraverso il JSX di un componente:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Create a ref to store the textInput DOM element
    this.textInput = React.createRef();
  }
  render() {
  // Use the `ref` callback to store a reference to the text input DOM
  // element in an instance field (for example, this.textInput).
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

Una volta creato il ref all'elemento è possibile fare il focus ovunque sul proprio componente quando necessario:

 ```javascript
 focus() {
   // Explicitly focus the text input using the raw DOM API
   // Note: we're accessing "current" to get the DOM node
   this.textInput.current.focus();
 }
 ```

Qualche volta un componente padre necessita di fare focus su un elemento di un componente figlio. E' possibile raggiungere questo scopo [esponendo il refs del DOM al componente padre](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components) attraverso delle speciali prop, nel componente figlio, che inoltra il ref ai nodi figli.

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// Now you can set focus when required.
this.inputElement.current.focus();
```

Quando usiamo degli [HOC](/docs/higher-order-components.html) per estendere il comportamento dei componenti, è raccomandabile di [inoltrare i ref](/docs/forwarding-refs.html) al componente "wrappato" usando la funzione di React `forwardRef`. Se un componente, di tipo HOC, di terze parti non implementata l'inoltro del ref, il pattern spiegato precedentemente può essere usato come seconda alternativa.

Un buon esempio di gestione del focus è [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). Questo è un esempio di piena accessibilità di una finestra modale. Non solo mette il focus iniziale sul bottone cancel
(prevenendo un'attivazione accidentale dell'azione di successo) ma "imprigiona" il focus all'interno della finestra modale e lo rimette sull'elemento che inizialmente ha causato l'apertura della modale.

>Nota:
>
>Sebbene questa sia una caratteristica di accessibilità molto importante, è anche una tecnica che dovrebbe essere usata con giudizio. Usala per aggiustare il focus della tastiera quando è rotto piuttosto che cercare di anticipare le mosse dell'utente

## Eventi del mouse e di altri dispositivi di puntamento {#mouse-and-pointer-events}

Assicurati che tutte le funzionalità accessibili da mouse siano anche accessibili utilizzando solamente la tastiera. Dipendere solamente da elementi di puntamento porta gli utenti che utilizzano solo la tastiera a non utilizzare la tua applicazione.

Per mostrare questo comportamento diamo uno sguardo a questo esempio di accessibilità rotta causata da un evento di click. Questo pattern viene chiamato "click esterno" e si riferisce all'utente che può chiudere un popover semplicemente facendo click al di fuori dell'elemento.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

Tipicamente viene implementato mettendo un evento di `click` sull'oggetto `window` che chiude il popover:

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Questo può funzionare bene per gli utenti che usano strumenti di puntamento, come ad esempio un mouse, ma utilizzando solamente la tastiera porta ad una rottura della funzionalità quando ci spostiamo sul successivo elemento col pulsante di Tab, in quanto l'oggetto `window` non riceverà mai l'evento di `click`. Questo errato comportamento può portare a nascondere una certa funzionalità dell'applicazione e di conseguenza ad un allontamento degli utenti.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

La stessa funzionalità può essere ottenuta semplicemente utilizzando in modo appropriato eventi come `onBlur` e `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // We close the popover on the next tick by using setTimeout.
  // This is necessary because we need to first check if
  // another child of the element has received focus as
  // the blur event fires prior to the new focus event.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // If a child receives focus, do not close the popover.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React assists us by bubbling the blur and
    // focus events to the parent.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Il codice appena visto mostra come esporre la funzionalità sia per utenti che usano strumenti di puntamento sia per utenti che usano la tastiera. Nota anche che è stata aggiunta la props `aria-*` per fornire supporto agli utenti che utilizzano i lettori di schermo. Per semplicità l'evento della tastiera per abilitare l'interazione con il popover tramite `tasti freccia` non è stato implementato.

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

Questo è solo un esempio di molti casi dove dipendere solamente da dispositivi di puntamento e eventi del mouse portano ad una rottura delle funzionalità per gli utenti che utilizzano la tastiera. Testare sempre con la tastiera evidenzia immediatamente eventuali problemi che dovranno essere corretti utilizzando eventi della tastiera.

## Widget più complessi {#more-complex-widgets}

Una più complessa esperienza utente non significa avere meno accessibilità. L'accessibilità si ottiene più facilmente scrivendo HTML, ma anche i widget più complessi possono essere resi accessibili.

E' richiesta una conoscenza di [ARIA Roles](https://www.w3.org/TR/wai-aria/#roles) così come [ARIA States and Properties](https://www.w3.org/TR/wai-aria/#states_and_properties).
Questi sono strumenti con attributi HTML che sono pienamente supportati in JSX e che ti permettono di costruire componenti React completamente accessibili.

Ogni tipo di widget ha uno specifico pattern e gli utenti si aspettano che funzioni in un determinato modo;

- [ARIA Authoring Practices Guide (APG) - Design Patterns and Examples](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Heydon Pickering - ARIA Examples](https://heydonworks.com/article/practical-aria-examples/)
- [Inclusive Components](https://inclusive-components.design/)

## Altri punti da tenere in considerazione {#other-points-for-consideration}

### Impostazioni della lingua {#setting-the-language}

Scrivete in un linguaggio naturale i testi delle pagine in modo tale che i lettori di schermo possono effettuare le corrette impostazioni della voce:

- [WebAIM - Document Language](https://webaim.org/techniques/screenreader/#language)

### Impostazioni del titolo del documento {#setting-the-document-title}

Imposta il `<title>` del documento in modo che descriva in modo corretto il contenuto della pagina in quanto questo garantisce che l'utente rimanga sempre consapevole del contenuto della pagina in cui si trova:

- [WCAG - Capire come utilizzare il `title`](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

Per farlo in React basta semplicemente usare il [componente Document Title](https://github.com/gaearon/react-document-title).

### Contrasto di colore {#color-contrast}

Assicuratevi che tutti i testi leggibili sul vostro sito abbiamo colori adatti in modo tale da rimanere sempre visibili anche ad utenti con carenze visive:

- [WCAG - Capire il contrasto](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Tutto sul contrasto dei colori e perché dovresti ripensarlo](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - Cosa è il contrasto di colore](https://a11yproject.com/posts/what-is-color-contrast/)

Può risultare molto noioso calcolare tutte le combinazioni di colori per tutti i casi, per questo motivo è possibile [calcolare l'intera palette di colori accessibili con Colorable](https://colorable.jxnblk.com/).

Entrambi gli strumenti menzionati prima (aXe e WAVE) includono test sul contrasto dei colori.

Se vuoi estendere per conto tuo il test sul contrasto dei colori puoi utilizzare i seguenti strumenti:

- [WebAIM - Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

## Strumenti di sviluppo e test {#development-and-testing-tools}

Ci sono numerosi strumenti che possono essere utilizzati e che ti "assistono" nella creazione di applicazioni web accessibili.

### La tastiera {#the-keyboard}

Il test più facile da fare, e anche quello più importante, è di navigare tutta l'applicazione utilizzando esclusivamente la tastiera. Fai questi passi:

1. Scollega il mouse.
1. Usa i tasti di `Tab` e `Shift+Tab` per la navigazione.
1. Utilizza il tasto di `Enter` per interagire con gli elementi.
1. Quando richiesto utilizza i tasti freccia per interagire con elementi come ad esempio i menù a tendina.

### Assistenza durante lo sviluppo {#development-assistance}

E' possibile accedere a delle funzionalità di accessibilità direttamente tramite il codice JSX. Spesso i controlli intellisense sono già forniti negli IDE che supportano JSX per i ruoli, gli stati e le proprietà ARIA. Abbiamo anche accesso al seguente strumento:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

Il plugin [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) ESLint fornisce feedback riguardo a problemi di accessibilità all'interno del codice JSX. Molti IDE permettono di integrare queste funzionalità direttamente all'interno del tool di analisi del codice e analisi del codice sorgente.

[Create React App](https://github.com/facebookincubator/create-react-app) ha il suo plugin per l'accessibilità con un set di regole già attivate. Se volete abilitare maggiori regole, potete creare un file `.eslintrc`, nella cartella principale del progetto, con il seguente contenuto:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Testare l'accessibilità all'interno del browser {#testing-accessibility-in-the-browser}

Esistono numerosi tool che eseguono verifiche di accessibilità sulla pagine web nel tuo browser. Utilizza uno di questo in combinazione con altri strumenti qua menzionati, in quanto questi testano solamente l'accessibilità "tecnica" del tuo codice HTML.

#### aXe, aXe-core e react-axe {#axe-axe-core-and-react-axe}

Deque Systems offre [aXe-core](https://github.com/dequelabs/axe-core) per test di accessibilità end-to-end automatizzati. Questo modulo include alcune integrazioni per Selenium.

[L'Accessibility Engine](https://www.deque.com/products/axe/) (abbreviato con aXe), è un'estensione per il proprio browser costruita con `aXe-core`.

Puoi anche usare il modulo [@axe-core/react](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react) per vedere errori e problemi vari di accessibilità direttamente nella console in fase di sviluppo e debug.

#### WebAIM WAVE {#webaim-wave}

Il [Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) è un'altra estensione per il browser riguardante l'accessibilità.

#### Ispezionare l'accessibilità e l'albero di accessibilità{#accessibility-inspectors-and-the-accessibility-tree}

[L'albero dell'accessibilità](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) è un sottoinsieme dell'albero del DOM che contiene tutti gli oggetti accessibili da ogni elemento del DOM che deve essere esposto a tecnologie di assistenza come ad esempio i lettori di schermo.

In alcuni browser è possibile accedere ad informazioni di accessibilità per ogni elemento nell'albero dell'accessibilità:

- [Utilizzo del controllo di accessibilità in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Utilizzo del controllo di accessibilità in Chrome](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [Utilizzo del controllo di accessibilità in Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Lettori di schermo {#screen-readers}

I test utilizzando i lettori di schermo devono essere parte integrante dei test di accessibilità.

Tieni presente che la combinazione browser/ lettore di schermo è molto importante. E' raccomandabile testare la propria applicazione nel browser che meglio si accoppia con il lettore di schermo scelto.

### Lettori di schermo utilizzati più di frequente {#commonly-used-screen-readers}

#### NVDA in Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) (abbreviato con NVDA) è un lettore di schermo open source per Windows molto utilizzato.

Segui le seguenti guide per ottenere il massimo da questo strumento:

- [WebAIM - Using NVDA to Evaluate Web Accessibility](https://webaim.org/articles/nvda/)
- [Deque - NVDA Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver in Safari {#voiceover-in-safari}

VoiceOver è un lettore di schermo integrato in tutti i sistemi Apple.

Fai riferimento a queste guide per sapere come attivarlo e come usarlo al meglio:

- [WebAIM - Utilizzo di VoiceOver per la valutazione dell'accessibilità web](https://webaim.org/articles/voiceover/)
- [Deque - Shortcuts di VoiceOver per OS X](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - Shortcuts di VoiceOver per iOS](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS in Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) (abbreviato con JAWS), è uno screen reader molto utilizzato su Windows.

Fai riferimento a queste guide per sapere come ottenere il meglio da JAWS:

- [WebAIM - Using JAWS to Evaluate Web Accessibility](https://webaim.org/articles/jaws/)
- [Deque - JAWS Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Altri lettori di schermo {#other-screen-readers}

#### ChromeVox di Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/) è un lettore di schermo integrato in Chromebooks e disponibile anche come [estensione](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) di Google Chrome.

Fai riferimento a queste guide per sapere come ottenere il meglio da ChromeVox:

- [Google Chromebook Help - Utilizzo del lettore di schermo integrato](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox - Guida alle Shortcuts](https://www.chromevox.com/keyboard_shortcuts.html)
