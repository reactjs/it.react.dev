---
title: Descrivere la UI
---

<Intro>

React è una libreria JavaScript per il rendering delle interfacce utente(UI). La UI è costruita da piccole unità come pulsanti, testo e immagini. React ti consente di combinare queste unità in *componenti* riutilizzabili e annidabili. Dalle pagine web alle app per telefoni, tutto sullo schermo può essere scomposto in componenti. In questo capitolo imparerai a creare, personalizzare e visualizzare condizionalmente i componenti React.

</Intro>

<YouWillLearn isChapter={true}>

* [Come scrivere il tuo primo componente React](/learn/your-first-component)
* [Quando e come creare file multi-componente](/learn/importing-and-exporting-components)
* [Come aggiungere markup a JavaScript con JSX](/learn/writing-markup-with-jsx)
* [Come utilizzare le parentesi graffe con JSX per accedere alla funzionalità JavaScript dai tuoi componenti](/learn/javascript-in-jsx-with-curly-braces)
* [Come configurare i componenti con props](/learn/passing-props-to-a-component)
* [Come rappresentare condizionalmente i componenti](/learn/conditional-rendering)
* [Come renderizzare più componenti contemporaneamente](/learn/rendering-lists)
* [Come evitare bug confusionari mantenendo i componenti puri](/learn/keeping-components-pure)
* [Perché è utile capire che la UI è un albero](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## Il tuo Primo Componente {/*your-first-component*/}

Le applicazioni React sono costruite da pezzi isolati di UI chiamati *componenti*. Un componente React è una funzione JavaScript che puoi arricchire con marcatura. I componenti possono essere piccoli come un pulsante o grandi come un'intera pagina. Ecco un componente `Gallery` che renderizza tre componenti `Profile`:

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
      <h1>Amazing scientists</h1>
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

<LearnMore path="/learn/your-first-component">

Leggi **[Il Tuo Primo Componente](/learn/your-first-component)** per imparare a dichiarare e utilizzare i componenti React.

</LearnMore>

## Importazione ed Esportazione di Componenti {/*importing-and-exporting-components*/}

Puoi dichiarare molti componenti in un unico file, ma i file grandi possono diventare difficili da gestire. Per risolvere questo problema, puoi *esportare* un componente in un file separato e poi importare quel componente da un altro file:

<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Leggi **[Importazione ed Esportazione di Componenti](/learn/importing-and-exporting-components)** per imparare come suddividere i componenti in file separati.

</LearnMore>

## Scrivere Markup con JSX {/*writing-markup-with-jsx*/}

Ogni componente React è una funzione JavaScript che può contenere del markup che React renderizza nel browser. I componenti React utilizzano una estensione di sintassi chiamata JSX per rappresentare questo markup. JSX assomiglia molto all'HTML, ma è un po' più rigoroso e può mostrare informazioni dinamiche.

Se copiamo del markup HTML esistente in un componente React, non funzionerà sempre:

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
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Se hai HTML esistente come questo, puoi risolverlo usando un [convertitore](https://transform.tools/html-to-jsx):

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
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Leggi **[Scrivere Markup con JSX](/learn/writing-markup-with-jsx)** per imparare come scrivere JSX valido.

</LearnMore>

## JavaScript in JSX con Parentesi Graffe {/*javascript-in-jsx-with-curly-braces*/}

JSX ti consente di scrivere markup simile all'HTML all'interno di un file JavaScript, mantenendo la logica di rendering e il contenuto nello stesso luogo. A volte vorrai aggiungere un po' di logica JavaScript o fare riferimento a una proprietà dinamica all'interno di quel markup. In questa situazione, puoi usare le parentesi graffe nel tuo JSX per "aprire una finestra" su JavaScript:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Leggi **[JavaScript in JSX con Parentesi Graffe](/learn/javascript-in-jsx-with-curly-braces)** per imparare come accedere ai dati JavaScript da JSX.

</LearnMore>

## Passare Prop a un Componente {/*passing-props-to-a-component*/}

I componenti React usano *prop* per comunicare tra loro. Ogni componente padre può passare informazioni ai suoi componenti figlio dandogli delle props. Le props potrebbero farti pensare agli attributi HTML, ma puoi passare qualsiasi valore JavaScript attraverso di esse, inclusi oggetti, array, funzioni e persino JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Leggi **[Passaggio di Props a un Componente](/learn/passing-props-to-a-component)** per imparare come passare e leggere props.

</LearnMore>

## Rendering Condizionale {/*conditional-rendering*/}

I tuoi componenti spesso dovranno mostrare cose diverse a seconda di diverse condizioni. In React, puoi renderizzare JSX in modo condizionale utilizzando la sintassi JavaScript come gli operatori `if`, `&&` e `? :`.

In questo esempio, l'operatore `&&` di JavaScript viene utilizzato per renderizzare in modo condizionale un segno di spunta:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
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

<LearnMore path="/learn/conditional-rendering">

Leggi **[Rendering Condizionale](/learn/conditional-rendering)** per imparare i diversi modi per renderizzare contenuti condizionalmente.

</LearnMore>

## Rendering di Liste {/*rendering-lists*/}

Spesso si desidera visualizzare più componenti simili da una raccolta di dati. È possibile utilizzare i metodi  `filter()` e `map()` di JavaScript con React per filtrare e trasformare l'array di dati in un array di componenti.

Per ogni elemento dell'array, è necessario specificare una `key`. Di solito, si vuole utilizzare un ID dal database come `key`. Le chiavi consentono a React di tenere traccia del posizionamento di ciascun elemento nella lista anche se la lista cambia.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Leggi **[Renderizzare Liste](/learn/rendering-lists)** per imparare come renderizzare una lista di componenti e come scegliere una chiave.

</LearnMore>

## Mantenere i Componenti Puri {/*keeping-components-pure*/}

Alcune funzioni JavaScript sono *pure.* Una funzione pura:

* **Si cura solo dei suoi affari.** Non modifica oggetti o variabili che sono esistiti prima che fosse chiamata.
* **Gli stessi input, lo stesso output.** Dati gli stessi input, una funzione pura dovrebbe sempre restituire lo stesso risultato.

Scrivendo strettamente i tuoi componenti solo come funzioni pure, puoi evitare un'intera classe di errori strani e comportamenti imprevedibili man mano che la tua base di codice cresce. Ecco un esempio di componente non puro:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Puoi rendere questo componente puro passando una prop invece di modificare una variabile esistente:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Leggi **[Mantenere i Componenti Puri](/learn/keeping-components-pure)** per imparare a scrivere componenti come funzioni pure e prevedibili.

</LearnMore>

## La tua UI é un albero {/*your-ui-as-a-tree*/}

React usa gli alberi per modellare le relazioni tra componenti e moduli.

Un albero di renderizzazione di React è una rappresentazione delle relazioni padre e figlio tra i componenti.

<Diagram name="generic_render_tree" height={250} width={500} alt="Un grafico albero con cinque nodi, con ogni nodo rappresentante un componente. Il nodo radice è posizionato in alto ed è chiamato 'Componente Radice'. Ha due frecce che si estendono in basso a due nodi chiamati 'Componente A' e 'Componente C'. Ognuna di queste frecce è etichettata con 'renderizza'. 'Componente A' ha una singola freccia 'renderizza' verso il nodo 'Componente B'. 'Componente C' ha una singola freccia 'renderizza' verso il nodo chiamato 'Componente D'.">

Un esempio di albero di rendering React.

</Diagram>

I componenti vicino alla parte alta dell'albero, vicini al nodo radice, sono considerati componenti di alto livello. I componenti senza componenti figli sono componenti foglia. Questa categorizzazione dei componenti è utile per capire il flusso dati e le prestazioni di rendering.

Modellare le rezazioni tra moduli JavaScript è un altro modo utile per capire la tua app. Ci riferiamo ad essa come un albero di dipendenze tra moduli.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="Un grafico albero con cinque nodi. Ogni nodo rappresenta un modulo JavaScript. Il nodo più in alto è chiamato 'RootModule.js'. Ha tre frecce che si estendono ai nodi: 'ModuleA.js', 'ModuleB.js', e 'ModuleC.js'. Ogni freccia è etichettata con 'importa'. Il nodo 'ModuleC.js' ha una singola freccia 'importa' che punta al nodo chiamato 'ModuleD.js'.">

Un esempio di albero di dipendenze tra moduli.

</Diagram>

Un albero di dipendenze è spesso usato da tools di compilazione per raggruppare tutto il codice JavaScript necessario al client da scaricare e renderizzare sotto forma di 'bundle'. Un 'bundle' di dimensioni elevate peggiora l'esperienza utente delle apps React. Capire l'albero di dipensenze tra moduli è utile per diagnosticare queste problematiche.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Leggi **[La tua UI è un albero](/learn/understanding-your-ui-as-a-tree)** per imparare a creare albero di renderizzazione e di dipendenza tra moduli nelle applicazioni React e come sono utili modelli mentali per migliorare l'esperienza utente e le prestazioni.

</LearnMore>


## Qual è il Prossimo Passo? {/*whats-next*/}

Vai a [Il Tuo Primo Componente](/learn/your-first-component) per iniziare a leggere questa pagina del capitolo pagina per pagina!

Oppure, se sei già familiare con questi argomenti, perché non leggere su [Aggiungere Interattività](/learn/adding-interactivity)?
