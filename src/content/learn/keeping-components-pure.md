---
title: Mantenere i Componenti Puri
---

<Intro>

Alcune funzioni JavaScript sono *pure.* Le funzioni pure eseguono solo un calcolo e nient'altro. Scrivendo rigorosamente i tuoi componenti solo come funzioni pure, puoi evitare un'intera classe di bug confusi e comportamenti imprevedibili man mano che la tua base di codice cresce. Per ottenere questi vantaggi, tuttavia, ci sono alcune regole che devi seguire.

</Intro>

<YouWillLearn>

* Che cosa è la purezza e come ti aiuta ad evitare i bug
* Come mantenere i componenti puri, mantenendo i cambiamenti fuori dalla fase di renderizzazione
* Come utilizzare la Strict Mode per trovare errori nei tuoi componenti

</YouWillLearn>

## Purezza: Componenti Come Formule {/*purity-components-as-formulas*/}

In informatica (ed in particolare nel mondo della programmazione funzionale),  [una funzione pura](https://wikipedia.org/wiki/Pure_function) è una funzione con le seguenti caratteristiche:

* **Si cura solo dei suoi affari.** Non modifica oggetti o variabili che esistevano già prima che fosse chiamata.
* **Same inputs, same output.** Dati gli stessi input, una funzione pura dovrebbe sempre restituire lo stesso risultato.

Potresti avere già familiarità con un esempio di funzioni pure: le formule in matematica.

Considera questa formula matematica:  <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Se <Math><MathI>x</MathI> = 2</Math> allora <Math><MathI>y</MathI> = 4</Math>. Sempre. 

Se <Math><MathI>x</MathI> = 3</Math> allora <Math><MathI>y</MathI> = 6</Math>. Sempre. 

Se <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> non sarà a volte <Math>9</Math> o <Math>–1</Math> o <Math>2.5</Math> a seconda dell'ora del giorno o dello stato del mercato azionario.

Se <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> e <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> sarà sempre <Math>6</Math>. 

Se trasformassimo questa formula in una funzione JavaScript, apparirebbe così:

```js
function double(number) {
  return 2 * number;
}
```

Nell'esempio sopra, `double` è una **funzione pura.** Se gli passi `3`, restituirà  `6`. Sempre.

React è progettato attorno a questo concetto. **React presume che ogni componente che scrivi sia una funzione pura.** Ciò significa che i componenti React che scrivi devono sempre restituire lo stesso JSX dati gli stessi input:

<Sandpack>

```js App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Fai bollire {drinkers} tazze di acqua.</li>
      <li>Aggiungi {drinkers} cucchiaini di tè e {0.5 * drinkers} cucchiaini di spezie.</li>
      <li>Aggiungi {0.5 * drinkers} tazze di latte da far bollire e zucchero a piacere.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Ricetta Chai Speziato</h1>
      <h2>Per due persone</h2>
      <Recipe drinkers={2} />
      <h2>Per un gruppo</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

Quando passi `drinkers={2}` a `Ricetta`, questo restituirà JSX contenente `2 tazze di acqua`. Sempre. 

Se si passa `drinkers={4}`, questo restituirà JSX contenente `4 tazze di acqua`. Sempre.

Proprio come una formula matematica.

Si potrebbe pensare ai propri componenti come ricette: se le si segue e non si introducono nuovi ingredienti durante il processo di cottura, si otterrà lo stesso piatto ogni volta. Quel "piatto" è il JSX che il componente fornisce a React per il [render.](/learn/render-and-commit)

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## Side Effects: Conseguenze (In)aspettate {/*side-effects-unintended-consequences*/}

Il processo di rendering di React deve sempre essere puro. I componenti dovrebbero solo *restituire* il loro JSX e non *modificare* oggetti o variabili che esistevano prima del rendering, in quanto questo li renderebbe impuri!

Ecco un componente che viola questa regola:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Non corretto: sta modificando una variabile esistente!
  guest = guest + 1;
  return <h2>Tazza di tè per ospite #{guest}</h2>;
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

Questo componente legge e scrive una variabile `guest` dichiarata esternamente. Ciò significa che **chiamare questo componente più volte produrrà JSX diversi!** E inoltre, se altri componenti leggono `guest`, produrranno anche loro JSX diversi, a seconda del momento in cui sono stati eseguiti! Ciò non è prevedibile.

Tornando alla nostra formula <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, anche se <Math><MathI>x</MathI> = 2</Math>, non possiamo essere certi che <Math><MathI>y</MathI> = 4</Math>. I nostri test potrebbero fallire, gli utenti sarebbero confusi, gli aerei cadrebbero dal cielo - si può vedere come ciò porterebbe a bug confusi!

È possibile risolvere questo componente [passando "guest" come una prop:](/learn/passing-props-to-a-component):

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

Ora il tuo componente è puro, poiché il JSX che restituisce dipende solo dalla prop `guest`.

In generale, non devi aspettarti che i tuoi componenti vengano renderizzati in un particolare ordine. Non importa se chiami <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> prima o dopo <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: entrambe le formule si risolveranno indipendentemente l'una dall'altra. Allo stesso modo, ogni componente dovrebbe solo "pensare per se stesso", e non tentare di coordinarsi o dipendere dagli altri durante il rendering. Il rendering è simile a un esame scolastico: ogni componente dovrebbe calcolare JSX da solo!

<DeepDive>

#### Rilevazione dei Calcoli Impuri con StrictMode {/*detecting-impure-calculations-with-strict-mode*/}

Anche se potresti non averne ancora utilizzati tutti, in React ci sono tre tipi di input che puoi leggere durante il rendering: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), e [context.](/learn/passing-data-deeply-with-context) Dovresti sempre trattare questi input come readonly.

Quando vuoi *cambiare* qualcosa in risposta all'input dell'utente, dovresti [impostare lo stato](/learn/state-a-components-memory) anziché scrivere su una variabile. Non dovresti mai cambiare variabili o oggetti preesistenti durante il rendering del tuo componente.

React offre una "Strict Mode" in cui chiama la funzione di ogni componente due volte durante lo sviluppo. **Chiamando la funzione del componente due volte, Strict Mode aiuta a trovare i componenti che infrangono queste regole.**

Nota come l'esempio originale abbia visualizzato "Guest #2", "Guest #4" e "Guest #6" invece di "Guest #1", "Guest #2" e "Guest #3". La funzione originale era impura, quindi chiamarla due volte l'ha rotta. Ma la versione pura funziona correttamente anche se la funzione viene chiamata due volte ogni volta. **Le funzioni pure calcolano solo, quindi chiamarle due volte non cambierà nulla**--proprio come chiamare `double(2)` due volte non cambia ciò che viene restituito e risolvere  <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> due volte non cambia il valore di <MathI>y</MathI>. Gli stessi input, gli stessi output. Sempre.

Strict Mode non ha alcun effetto in produzione, quindi non rallenterà l'app per i tuoi utenti. Per abilitare Strict Mode, puoi avvolgere il tuo componente principale all'interno di `<React.StrictMode>`. Alcuni framework lo fanno di default.

</DeepDive>

### Mutazione Locale: il Piccolo Segreto del tuo Componente {/*local-mutation-your-components-little-secret*/}

Nell'esempio precedente, il problema era che il componente ha cambiato una variabile *preesistente* durante il rendering. Questo è spesso chiamato una **"mutazione"** per renderlo un po' più spaventoso. Le funzioni pure non mutano variabili al di fuori della portata della funzione o oggetti creati prima della chiamata - questo le rende incontaminate!

Tuttavia, **è completamente permesso cambiare variabili e oggetti che hai creato *appena* durante il rendering.** In questo esempio, hai creato un'array `[]`, assegnato a una variabile `cups`, e `inserito` una dozzina di tazze:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tazza di tè per ospite #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

Se la variabile `cups` o l'array `[]` fossero stati creati fuori dalla funzione `TeaGathering`, questo sarebbe stato un grande problema! Staresti cambiando un oggetto *pre-esistente* inserendo elementi in quell'array.

Tuttavia, è permesso perché li hai creati *durante lo stesso render*, all'interno di `TeaGathering`. Nessun codice al di fuori di `TeaGathering` saprà mai che questo è accaduto. Questo si chiama **"mutazione locale"**—è come il piccolo segreto del tuo componente.

## Dove _Puoi_ Causare Side Effects {/*where-you-_can_-cause-side-effects*/}

Mentre la programmazione funzionale si basa pesantemente sulla purezza, ad un certo punto, in qualche posto, _qualcosa_ deve cambiare. Questo è il punto della programmazione! Questi cambiamenti, come l'aggiornamento dello schermo, l'avvio di un'animazione, la modifica dei dati, sono chiamati **side effects.** Sono cose che accadono _"al margine"_, non durante il rendering.

In React, **side effect appartengono solitamente agli [event handlers.](/learn/responding-to-events)** Gli event handler sono funzioni che React esegue quando si esegue un'azione, ad esempio quando si fa clic su un pulsante. Anche se gli event handler sono definiti *all'interno* del componente, non vengono eseguiti *durante* il rendering! **Quindi gli event handler non devono essere puri**

Se hai esaurito tutte le altre opzioni e non riesci a trovare l'event handler giusto per il tuo side effect, puoi comunque allegarlo al tuo JSX restituito con una chiamata [`useEffect`](/reference/react/useEffect) nel tuo componente. Ciò indica a React di eseguirlo in seguito, dopo il rendering, quando sono consentiti side effect. **Tuttavia, questo approccio dovrebbe essere l'ultima risorsa.**

Quando possibile, cerca di esprimere la tua logica solo con il rendering. Rimarrai sorpreso di quanto lontano questo possa portarti!

<DeepDive>

#### Perché a React Importa la Purezza? {/*why-does-react-care-about-purity*/}

Scrivere funzioni pure richiede un po' di abitudine e disciplina. Ma sblocca anche meravigliose opportunità:

* I tuoi componenti potrebbero funzionare in un ambiente diverso, ad esempio sul server! Poiché restituiscono lo stesso risultato per gli stessi input, un componente può soddisfare molte richieste degli utenti.
* Puoi migliorare le prestazioni [saltando il rendering](/reference/react/memo) dei componenti il cui input non è cambiato. Ciò è sicuro perché le funzioni pure restituiscono sempre gli stessi risultati, quindi sono sicure da cache.
* Se alcuni dati cambiano in mezzo al rendering di un albero di componenti profondo, React può riavviare il rendering senza perdere tempo per completare il rendering superato. La purezza rende sicuro interrompere il calcolo in qualsiasi momento.

Ogni nuova funzione React che stiamo costruendo sfrutta la purezza. Dal recupero dei dati alle animazioni alle prestazioni, mantenere i componenti puri sblocca il potere del paradigma React.

</DeepDive>

<Recap>

* Un componente deve essere puro, cioè: 
  * **Si cura solo dei suoi affari.** Non deve cambiare alcun oggetto o variabile esistente prima del rendering.
  * **Same inputs, same output.** Dati gli stessi input, una funzione pura dovrebbe sempre restituire lo stesso JSX. 
* Il rendering può accadere in qualsiasi momento, quindi i componenti non dovrebbero dipendere dalla sequenza di rendering l'uno dell'altro.
* Non devi mutare alcuna delle input che i tuoi componenti usano per il rendering. Ciò include props, stato e contesto. Per aggiornare lo schermo,  ["set" state](/learn/state-a-components-memory)  invece di modificare oggetti preesistenti.
* Cerca di esprimere la logica del tuo componente all'interno del JSX che restituisci. Quando hai bisogno di "cambiare le cose", di solito vorrai farlo in un gestore di eventi. Come ultima risorsa, puoi utilizzare `useEffect`.
* Scrivere funzioni pure richiede un po' di pratica, ma sblocca il potere del paradigma di React.

</Recap>


  
<Challenges>

#### Riparare un Orologio Rotto {/*fix-a-broken-clock*/}

Questo componente tenta di impostare la classe CSS dell'`<h1>` a `"night"` durante l'intervallo di tempo dalla mezzanotte alle sei del mattino, e a `"day"` in tutti gli altri momenti. Tuttavia, non funziona. Puoi correggerlo?

Puoi verificare se la tua soluzione funziona cambiando temporaneamente il fuso orario del computer. Quando l'ora corrente è compresa tra la mezzanotte e le sei del mattino, l'orologio dovrebbe avere i colori invertiti.

<Hint>

Il Rendering è un *calcolo*, non dovrebbe cercare di "fare" cose. Puoi esprimere la stessa idea in modo diverso?

</Hint>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Puoi risolvere questo componente calcolando `className` e includendolo nell'output di render:

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

In questo esempio, l'effetto collaterale (modifica del DOM) non era necessario affatto. Dovevi solo restituire JSX.

</Solution>

#### Correggi un Profilo Rotto {/*fix-a-broken-profile*/}

Due componenti  `Profile` vengono renderizzati affiancati con dati diversi. Premi "Collapse" sul primo profilo, quindi "Expand" su di esso. Noterai che entrambi i profili mostrano ora la stessa persona. Questo è un bug.

Trova la causa del bug e correggilo.

<Hint>

Il codice problematico si trova in `Profile.js`. Assicurati di leggerlo tutto dall'inizio alla fine!

</Hint>

<Sandpack>

```js Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

Il problema è che il componente `Profile` scrive in una variabile preesistente chiamata `currentPerson` mentre i componenti `Header` e `Avatar` leggono da essa. Ciò rende *tutti e tre* impuri e difficili da prevedere.

Per risolvere il bug, rimuovi la variabile `currentPerson`. Invece, passa tutte le informazioni da `Profile` a `Header` e `Avatar` tramite props. Dovrai aggiungere una prop `person` ad entrambi i componenti e passarla fino in fondo.

<Sandpack>

```js Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Ricorda che React non garantisce che le funzioni dei componenti si eseguano in un ordine particolare, quindi non puoi comunicare tra di loro impostando variabili. Tutta la comunicazione deve avvenire tramite props.

</Solution>

#### Sistema una Story Tray Rotta {/*fix-a-broken-story-tray*/}

Il CEO della tua azienda ti sta chiedendo di aggiungere "storie" alla tua app orologio online, e non puoi dire di no. Hai scritto un componente `StoryTray`  che accetta una lista di `stories`, seguita da un segnaposto "Crea storia".

Hai implementato il segnaposto "Create Story" inserendo un'altra storia falsa alla fine dell'array `stories` che ricevi come prop. Ma per qualche motivo, "Create Story" appare più di una volta. Risolvi il problema.

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Nota come ogni volta che l'orologio viene aggiornato, "Crea Storia" viene aggiunto *due volte*. Ciò serve come suggerimento che abbiamo una mutazione durante il rendering--Strict Mode chiama i componenti due volte per rendere questi problemi più evidenti.

La funzione `StoryTray` non è pura. Chiamando `push` sull'array  `stories` ricevuto (una prop!), sta mutando un oggetto che è stato creato *prima* che `StoryTray` iniziasse a renderizzare. Questo lo rende buggato e molto difficile da prevedere.

La soluzione più semplice è di non toccare affatto l'array e renderizzare "Create Story" separatamente:

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

icona di pizzaGPT, una fetta di pizza

In alternativa, potresti creare un _nuovo_ array (copiando quello esistente) prima di inserirvi un elemento:

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  // Copia l'array!
  let storiesToDisplay = stories.slice();

  // Non influenza l'array originale:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevenire che la memoria aumenti all'infinito durante la lettura dei documenti.
  // Stiamo infrangendo le nostre stesse regole qui.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Questo mantiene la mutazione locale e la funzione di rendering rimane pura. Tuttavia, è necessario fare attenzione: ad esempio, se si provasse a modificare uno degli elementi esistenti dell'array, bisognerebbe clonare anche quelli.

È utile ricordare quali operazioni sui array li mutano e quali no. Ad esempio, `push`, `pop`, `reverse` e `sort` mutano l'array originale, mentre `slice`, `filter` e `map` ne creano uno nuovo.

</Solution>

</Challenges>
