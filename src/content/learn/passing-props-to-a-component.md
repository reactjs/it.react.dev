---
title: Passare Props ad un Componente
---

<Intro>

I componenti React utilizzano le *props* per comunicare tra loro. Ogni componente genitore può passare alcune informazioni ai suoi componenti figli passandogli le props. Le props potrebbero ricordarti gli attributi HTML, ma attraverso di esse puoi passare qualsiasi valore JavaScript, inclusi oggetti, array e funzioni.

</Intro>

<YouWillLearn>

* Come passare props ad un componente
* Come leggere props da un componente
* Come specificare valori di default per le props
* Come passare del JSX ad un componente
* Come cambiano le props nel tempo

</YouWillLearn>

## Props familiari {/*familiar-props*/}
Le props sono le informazioni che passi ad un tag JSX. Ad esempio, `className`, `src`, `alt`, `width` e `height` sono alcune delle props che puoi passare ad un `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Le props che puoi passare ad un tag `<img>` sono predefinite (ReactDOM si conforma allo [standard HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Ma puoi passare qualsiasi props ai *tuoi* componenti, come `<Avatar>`, per personalizzarli. Ecco come!

## Passare props ad un componente {/*passing-props-to-a-component*/}

In questo codice, il componente `Profile` non sta passando alcuna props al suo componente figlio, `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Puoi dare ad `Avatar` delle props in due passaggi.

### Step 1: Passa le props al componente figlio {/*step-1-pass-props-to-the-child-component*/}

Prima di tutto, passa alcune props ad `Avatar`. Ad esempio, passiamo due props: `person` (un oggetto) e `size` (un numero):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Se le doppie graffe dopo `person=` ti confondono, ricorda che [sono semplicemente un oggetto](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) all'interno delle graffe JSX.

</Note>

Adesso puoi leggere queste props all'interno del componente `Avatar`.

### Step 2: Leggi le props all'interno del tuo componente figlio {/*step-2-read-props-inside-the-child-component*/}

Puoi leggere queste props elencando i loro nomi `person, size` separati da virgole all'interno di `({` e `})` direttamente dopo `function Avatar`. Questo ti permette di usarle all'interno del codice di `Avatar`, come faresti con una variabile.

```js
function Avatar({ person, size }) {
  // person and size sono disponibili qui
}
```

Aggiungi della logica ad `Avatar` che usa le props `person` e `size` per il rendering, ed è fatta.

Adesso puoi configurare `Avatar` per farlo renderizzare in molti modi diversi con props diverse. Prova a modificare i valori!

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js utils.js
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Le props ti fanno pensare ai componenti genitori e figli in maniera indipendente. Ad esempio, puoi cambiare le props `person` o `size` all'interno di `Profile` senza dover pensare a come `Avatar` le utilizza. In maniera simile, puoi cambiare come `Avatar` usa queste props, senza guardare `Profile`.

Puoi pensare alle props come a delle "rotelle" che puoi regolare. Servono allo stesso scopo degli argomenti per le funzioni-infatti, le props _sono_ l'unico argomento per il tuo componente! Le funzioni dei componenti React accettano un singolo argomento, un oggetto `props`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Solitamente non hai bisogno dell'intero oggetto `props` in sé, quindi lo destrutturi in props individuali.

<Pitfall>

**Non dimenticare la coppia di `{` e `}` graffe** all'interno di `(` e `)` quando dichiari le props:

```js
function Avatar({ person, size }) {
  // ...
}
```

Questa sintassi è chiamata ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) ed è equivalente a leggere le proprietà da un parametro di una funzione:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Specificare un valore di default per una prop {/*specifying-a-default-value-for-a-prop*/}

Se vuoi dare a una prop un valore di default da utilizzare quando non viene specificato alcun valore, puoi farlo tramite il destructuring mettendo `=` ed il valore di default subito dopo il parametro:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Adesso, se `<Avatar person={...} />` viene renderizzato senza la prop `size`, il `size` verrà impostato a `100`.

Il valore di default è utilizzato solo se la prop è mancante o se passi `size={undefined}`. Ma se passi `size={null}` o `size={0}`, il valore di default **non** verrà utilizzato.

## Inoltrare props con la sintassi di spread JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

Qualche volta, passare le props diventa molto ripetitivo:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Non c'è nulla di sbagliato nel codice ripetitivo-può essere più leggibile. Ma a volte puoi preferire la concisione. Alcuni componenti inoltrano tutte le loro props ai loro figli, come fa questo `Profile` con `Avatar`. Poiché non utilizzano direttamente nessuna delle loro props, può avere senso utilizzare una sintassi più concisa, chiamata "spread":

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Questo inoltra tutte le props di `Profile` all'`Avatar` senza elencare i loro nomi.

**Utilizza la sintassi di spread con moderazione.** Se la utilizzi in ogni componente, probabilmente c'è qualcosa che non va. Spesso, questo indica che dovresti suddividere i tuoi componenti e passare i figli come JSX. Ne parleremo dopo!

## Passare JSX come figlio {/*passing-jsx-as-children*/}

È comune annidare tag del browser incorporati:

```js
<div>
  <img />
</div>
```

Qualche volta vorrai annidare i tuoi componenti allo stesso modo:

```js
<Card>
  <Avatar />
</Card>
```

Quando annidi del contenuto all'interno di un tag JSX, il componente genitore riceverà quel contenuto in una prop chiamata `children`. Ad esempio, il componente `Card` qui sotto riceverà una prop `children` impostata ad `<Avatar />` e la renderizzerà in un div contenitore:

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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
```

```js utils.js
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

Prova a sostituire l'`<Avatar>` all'interno di `<Card>` con del testo per vedere come il componente `Card` può avvolgere qualsiasi contenuto annidato. Non ha bisogno di "sapere" cosa viene renderizzato al suo interno. Vedrai questo modello flessibile in molti punti.

Puoi pensare a un componente con una prop `children` come ad avere un "buco" che può essere "riempito" dai suoi componenti genitori con JSX arbitrario. Spesso utilizzerai la prop `children` per i contenitori visivi: pannelli, griglie, ecc.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='Una tessera Card a forma di puzzle con uno slot per i pezzi "children" come testo e Avatar' />

## Come cambiano le props nel tempo {/*how-props-change-over-time*/}

Il componente `Clock` qui sotto riceve due props dal suo componente genitore: `color` e `time`. (Il codice del componente genitore viene omesso perché utilizza [state](/learn/state-a-components-memory), che al momento non approfondiremo ancora.)

Prova a cambiare il colore nella casella di selezione qui sotto:

<Sandpack>

```js Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Questo esempio illustra che **un componente può ricevere props diverse nel tempo.** Le props non sono sempre statiche! Qui, la prop `time` cambia ogni secondo e la prop `color` cambia quando selezioni un altro colore. Le props riflettono i dati di un componente in un determinato momento, invece che solo all'inizio.

Tuttavia, le props sono [immutabili](https://en.wikipedia.org/wiki/Immutable_object)—un termine della scienza informatica che significa "non modificabile". Quando un componente ha bisogno di cambiare le sue props (ad esempio, in risposta a un'interazione dell'utente o a nuovi dati), dovrà "chiedere" al suo componente genitore di passargli _props diverse_—un nuovo oggetto! Le sue vecchie props verranno quindi scartate ed alla fine il motore JavaScript reclamerà la memoria occupata da esse.

**Non provare a "cambiare le props".** Quando hai bisogno di rispondere all'input dell'utente (come cambiare il colore selezionato), dovrai "impostare lo stato", che puoi imparare in [State: La memoria di un Componente.](/learn/state-a-components-memory)

<Recap>

* Per passare le props, aggiungile al JSX, proprio come faresti con gli attributi HTML.
* Per leggere le props, usa la sintassi di destrutturazione `function Avatar({ person, size })`.
* Puoi specificare un valore predefinito come `size = 100`, che viene utilizzato per le props mancanti ed `undefined`.
* Puoi inoltra tutte le props con la sintassi di spread JSX `<Avatar {...props} />`, ma non abusarne!
* Il JSX annidato come `<Card><Avatar /></Card>` apparirà come `children` della prop del componente `Card`.
* Le props sono istantanee di sola lettura nel tempo: ogni render riceve una nuova versione delle props.
* Non puoi cambiare le props. Quando hai bisogno di interattività, dovrai impostare lo stato.

</Recap>

<Challenges>

#### Estrarre un componente {/*extract-a-component*/}

Questo componente `Gallery` contiene alcuni markup molto simili per due profili. Estrai un componente `Profile` da esso per ridurre la duplicazione. Dovrai scegliere quali props passargli.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Inizia estraendo il markup per uno dei due scienziati. Trova quindi i pezzi che non corrispondono al secondo esempio e rendili configurabili tramite props.

</Hint>

<Solution>

In questa soluzione, il componente `Profile` accetta props multiple: `imageId` (una stringa), `name` (una stringa), `profession` (una stringa), `awards` (un array di stringhe), `discovery` (una stringa) ed `imageSize` (un numero).

Nota che la prop `imageSize` ha un valore predefinito, motivo per cui non lo passiamo al componente.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Nota come non abbiamo bisogno di una prop `awardCount` separata se `awards` è un array. In questo caso puoi utilizzare `awards.length` per contare il numero di premi. Ricorda che le props possono assumere qualsiasi valore, e questo include anche gli array!

Un'altra soluzione, più simile agli esempi precedenti in questa pagina, è quella di raggruppare tutte le informazioni su una persona in un singolo oggetto, e passare quell'oggetto come una prop:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
    </div>
  );
}
```

```js utils.js
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Nonostante la sintassi sia leggermente diversa perché stai descrivendo le proprietà di un oggetto JavaScript piuttosto che una collezione di attributi JSX, questi esempi sono per lo più equivalenti, e puoi scegliere uno qualsiasi dei due approcci.

</Solution>

#### Regolare le dimensioni di una immagine sulla base di una prop {/*adjust-the-image-size-based-on-a-prop*/}

In questo esempio, `Avatar` riceve una prop numerica `size` che determina la larghezza e l'altezza di `<img>`. La prop `size` è impostata a `40` in questo esempio. Tuttavia, se apri l'immagine in una nuova scheda, noterai che l'immagine è più grande (`160` pixel). La dimensione reale dell'immagine è determinata dalla dimensione dell'immagine in miniatura che stai richiedendo.

Cambia il componente `Avatar` in modo che richieda la dimensione dell'immagine più vicina in base alla prop `size`. In particolare, se la `size` è inferiore a `90`, passa `'s'` ("small") anziché `'b'` ("big") alla funzione `getImageUrl`. Verifica che le tue modifiche funzionino renderizzando le immagini con diversi valori della prop `size` ed aprendo le immagini in una nuova scheda.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Ecco come potresti procedere:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Potresti anche mostrare un'immagine più nitida per gli schermi ad alta risoluzione tenendo conto di [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Le props ti permettono di incapsulare logiche come questa all'interno del componente `Avatar` (e di cambiarla in seguito se necessario) in modo che tutti possano utilizzare il componente `<Avatar>` senza dover pensare a come vengono richieste e ridimensionate le immagini.

</Solution>

#### Passare JSX in una prop `children` {/*passing-jsx-in-a-children-prop*/}

Estrai un componente `Card` dal markup sottostante ed utilizza la prop `children` per passargli del JSX diverso:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Qualsiasi JSX inserisci all'interno del tag di un componente verrà passato come prop `children` a quel componente.

</Hint>

<Solution>

Ecco come puoi utilizzare il componente `Card` in entrambi i casi:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

Puoi anche rendere `title` una prop separata se vuoi che ogni `Card` abbia sempre un titolo:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
