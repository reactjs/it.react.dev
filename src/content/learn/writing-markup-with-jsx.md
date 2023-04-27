---
title: Scrivere Markup con JSX
---

<Intro>

*JSX* è un'estensione della sintassi JavaScript che consente di scrivere markup simile all'HTML all'interno di un file JavaScript. Sebbene esistano altri modi per scrivere i componenti, la maggior parte degli sviluppatori React preferisce la concisione di JSX, e la maggior parte dei codebase lo utilizza.


</Intro>

<YouWillLearn>

* Perché React mescola markup e logica di rendering
* Come JSX differisce dall'HTML
* Come visualizzare le informazioni con JSX

</YouWillLearn>

## JSX: Inserire il markup in JavaScript {/*jsx-putting-markup-into-javascript*/}

Il Web è stato costruito su HTML, CSS e JavaScript. Per molti anni, gli sviluppatori Web hanno tenuto il contenuto in HTML, il design in CSS e la logica in JavaScript, spesso in file separati! Il contenuto veniva marcato all'interno dell'HTML mentre la logica della pagina viveva separata in JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML markup with purple background and a div with two child tags: p and form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Three JavaScript handlers with yellow background: onSubmit, onLogin, and onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Ma mentre il Web diventava sempre più interattivo, la logica determinava sempre più il contenuto. JavaScript era responsabile dell'HTML! Ecco perché **in React, la logica di rendering e il markup vivono insieme nello stesso posto, ovvero nei componenti.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Sidebar which calls the function isLoggedIn, highlighted in yellow. Nested inside the function highlighted in purple is the p tag from before, and a Form tag referencing the component shown in the next diagram.">

Componente React `Sidebar.js`

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Form containing two handlers onClick and onSubmit highlighted in yellow. Following the handlers is HTML highlighted in purple. The HTML contains a form element with a nested input element, each with an onClick prop.">

Componente React `Form.js`

</Diagram>

</DiagramGroup>

Mantenere la logica di rendering e il markup di un pulsante insieme garantisce che rimangano sincronizzati ogni volta che vengono modificati. Al contrario, i dettagli non correlati, come il markup di un pulsante e il markup di una barra laterale, sono isolati l'uno dall'altro, rendendo più sicuro modificare ognuno di essi da solo.

Ogni componente React è una funzione JavaScript che può contenere del markup che React renderizza nel browser. I componenti React utilizzano un'estensione di sintassi chiamata JSX per rappresentare quel markup. JSX assomiglia molto all'HTML, ma è un po' più rigoroso e può visualizzare informazioni dinamiche. La migliore maniera per comprenderlo è quella di convertire un po' di markup HTML in markup JSX.

<Note>

JSX e React sono due cose separate. Sono spesso utilizzati insieme, ma *puoi* [utilizzarli indipendentemente](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) l'uno dall'altro. JSX è un'estensione di sintassi, mentre React è una libreria JavaScript.

</Note>

## Convertire HTML in JSX  {/*converting-html-to-jsx*/}

Supponiamo di avere qualche HTML(perfettamente valido):

```html
<h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

E vogliamo inserirlo nel nostro componente:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Se lo copiamo e incolliamo così com'è, non funzionerà:


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

Ciò è dovuto al fatto che JSX è più rigoroso e ha alcune regole in più rispetto a HTML! Se leggi i messaggi di errore sopra, ti guideranno nella correzione del markup o puoi seguire la guida di seguito.

<Note>

La maggior parte delle volte, i messaggi di errore di React ti aiuteranno a trovare il problema. Leggili se ti blocchi!

</Note>

## Le regole di JSX {/*the-rules-of-jsx*/}

### 1. Restituisci un singolo elemento root {/*1-return-a-single-root-element*/}

Per restituire più elementi da un componente, **utilizza un tag padre per wrapparli**

Per esempio, puoi usare un `<div>`:

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Se non vuoi aggiungere un ulteriore `<div>` al tuo markup, puoi scrivere invece `<>` e `</>`:

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Questo tag vuoto è chiamato *[Fragment.](/reference/react/Fragment)* I fragments ti consentono di raggruppare elementi senza lasciare traccia nell'albero HTML del browser.

<DeepDive>

#### Perché i tag JSX multipli devono essere wrappati?  {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX sembra HTML, ma sotto il cofano viene trasformato in semplici oggetti JavaScript. Non è possibile restituire due oggetti da una funzione senza wrapparli in un array. Questo spiega perché non è possibile restituire due tag JSX senza wrapparli in un altro tag o in un Fragment.

</DeepDive>

### 2. Chiudi tutti i tag {/*2-close-all-the-tags*/}

JSX richiede che i tag vengano chiusi esplicitamente: i tag auto-chiusi come  `<img>` devono diventare `<img />`, e i tag di wrapping come `<li>oranges` devono essere scritti come `<li>oranges</li>`.

Ecco come appaiono chiusi l'immagine di Hedy Lamarr e gli elementi della lista:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. Scrivi in camelCase <s>tutte</s> quasi tutte le cose! {/*3-camelcase-salls-most-of-the-things*/}

JSX diventa JavaScript e gli attributi scritti in JSX diventano chiavi degli oggetti JavaScript. Nelle proprie componenti, spesso si vorrà leggere questi attributi in variabili. Ma JavaScript ha limitazioni sui nomi delle variabili. Ad esempio, i loro nomi non possono contenere trattini o essere parole riservate come `class`.

Ecco perché in React molti attributi HTML e SVG sono scritti in camelCase. Ad esempio, invece di `stroke-width` si usa `strokeWidth`. Poiché `class` è una parola riservata, in React si scrive `className` invece, nominata in base alla [corrispondente proprietà DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

Puoi [trovare tutti questi attributi nell'elenco delle props del componente DOM.](/reference/react-dom/components/common) Se ne sbagli uno, non preoccuparti: React stamperà un messaggio con una possibile correzione nella [browser console.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

Per ragioni storiche, gli attributi [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) e [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) sono scritti come in HTML con i trattini.

</Pitfall>

### Pro-tip: Usa un convertitore JSX {/*pro-tip-use-a-jsx-converter*/}

Convertire tutti questi attributi nel markup esistente può essere noioso! Raccomandiamo di utilizzare un [converter](https://transform.tools/html-to-jsx) per tradurre il vostro HTML e SVG esistenti in JSX. I convertitori sono molto utili nella pratica, ma è comunque utile capire cosa succede in modo da poter scrivere JSX autonomamente.

Ecco il tuo risultato finale:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

Ora sai perché JSX esiste e come usarlo nei componenti:

* I componenti React raggruppano la logica di rendering insieme al markup poiché sono correlati.
* JSX è simile all'HTML, con alcune differenze. Puoi usare un [converter](https://transform.tools/html-to-jsx) se ne hai bisogno.
* I messaggi di errore spesso ti indirizzeranno nella giusta direzione per correggere il tuo markup.

</Recap>



<Challenges>

#### Converti un po' di HTML in JSX {/*convert-some-html-to-jsx*/}

Questo HTML è stato copiato in un componente, ma non è un JSX valido. Correggilo:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Che tu lo faccia a mano o usando il convertitore, dipende da te!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
