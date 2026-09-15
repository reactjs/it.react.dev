---
title: Condividere lo State tra i Componenti
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/learn/sharing-state-between-components.md).

</Note>

<Intro>

A volte, vuoi che lo state di due componenti cambi sempre insieme. Per farlo, rimuovi lo state da entrambi, spostalo al loro genitore comune più vicino e poi passalo loro tramite le props. Questo è noto come *sollevare lo state* ed è una delle cose più comuni che farai scrivendo codice React.

</Intro>

<YouWillLearn>

- Come condividere lo state tra componenti sollevandolo
- Cosa sono i componenti controllati e non controllati

</YouWillLearn>

## Sollevare lo state con un esempio {/*lifting-state-up-by-example*/}

In questo esempio, un componente genitore `Accordion` renderizza due `Panel` separati:

* `Accordion`
  - `Panel`
  - `Panel`

Ogni componente `Panel` ha una variabile di state booleana `isActive` che determina se il suo contenuto è visibile.

Premi il pulsante Mostra per entrambi i pannelli:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Mostra
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Nota come premere il pulsante di un pannello non influisce sull'altro pannello: sono indipendenti.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagramma che mostra un albero di tre componenti, un genitore etichettato Accordion e due figli etichettati Panel. Entrambi i componenti Panel contengono isActive con valore false.">

Inizialmente, lo state `isActive` di ciascun `Panel` è `false`, quindi entrambi appaiono collassati

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="Lo stesso diagramma del precedente, con isActive del primo componente figlio Panel evidenziato per indicare un clic con il valore isActive impostato a true. Il secondo componente Panel contiene ancora il valore false." >

Cliccare il pulsante di uno dei `Panel` aggiornerà solo lo state `isActive` di quel `Panel`

</Diagram>

</DiagramGroup>

**Ma ora diciamo che vuoi cambiarlo in modo che solo un pannello sia espanso in qualsiasi momento.** Con questo design, espandere il secondo pannello dovrebbe collassare il primo. Come faresti?

Per coordinare questi due pannelli, devi "sollevare il loro state" a un componente genitore in tre passaggi:

1. **Rimuovi** lo state dai componenti figli.
2. **Passa** dati hardcodati dal genitore comune.
3. **Aggiungi** lo state al genitore comune e passalo ai figli insieme ai gestori di eventi.

Questo permetterà al componente `Accordion` di coordinare entrambi i `Panel` ed espanderne solo uno alla volta.

### Passaggio 1: Rimuovi lo state dai componenti figli {/*step-1-remove-state-from-the-child-components*/}

Darai il controllo di `isActive` del `Panel` al suo componente genitore. Questo significa che il componente genitore passerà `isActive` a `Panel` come prop. Inizia **rimuovendo questa riga** dal componente `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

E invece, aggiungi `isActive` all'elenco delle props di `Panel`:

```js
function Panel({ title, children, isActive }) {
```

Ora il componente genitore di `Panel` può *controllare* `isActive` [passandolo come prop.](/learn/passing-props-to-a-component) Al contrario, il componente `Panel` ora *non ha controllo* sul valore di `isActive`: spetta al componente genitore!

### Passaggio 2: Passa dati hardcodati dal genitore comune {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Per sollevare lo state, devi individuare il genitore comune più vicino di *entrambi* i componenti figli che vuoi coordinare:

* `Accordion` *(genitore comune più vicino)*
  - `Panel`
  - `Panel`

In questo esempio, è il componente `Accordion`. Poiché si trova sopra entrambi i pannelli e può controllare le loro props, diventerà la "fonte di verità" per quale pannello è attualmente attivo. Fai in modo che il componente `Accordion` passi un valore hardcodato di `isActive` (ad esempio, `true`) a entrambi i pannelli:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Mostra
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Prova a modificare i valori hardcodati di `isActive` nel componente `Accordion` e osserva il risultato sullo schermo.

### Passaggio 3: Aggiungi lo state al genitore comune {/*step-3-add-state-to-the-common-parent*/}

Sollevare lo state spesso cambia la natura di ciò che memorizzi come state.

In questo caso, solo un pannello dovrebbe essere attivo alla volta. Questo significa che il componente genitore comune `Accordion` deve tenere traccia di *quale* pannello è quello attivo. Invece di un valore `boolean`, potrebbe usare un numero come indice del `Panel` attivo per la variabile di state:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Quando `activeIndex` è `0`, il primo pannello è attivo, e quando è `1`, lo è il secondo.

Cliccare il pulsante "Mostra" in uno dei `Panel` deve cambiare l'indice attivo in `Accordion`. Un `Panel` non può impostare direttamente lo state `activeIndex` perché è definito dentro `Accordion`. Il componente `Accordion` deve *consentire esplicitamente* al componente `Panel` di cambiare il suo state [passando un gestore di eventi come prop](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

Il `<button>` dentro `Panel` userà ora la prop `onShow` come gestore di eventi click:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Mostra
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Questo completa il sollevamento dello state! Spostare lo state nel componente genitore comune ti ha permesso di coordinare i due pannelli. Usare l'indice attivo invece di due flag "è mostrato" ha garantito che solo un pannello sia attivo in un dato momento. E passare il gestore di eventi al figlio ha permesso al figlio di cambiare lo state del genitore.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagramma che mostra un albero di tre componenti, un genitore etichettato Accordion e due figli etichettati Panel. Accordion contiene un valore activeIndex pari a zero che diventa isActive con valore true passato al primo Panel, e isActive con valore false passato al secondo Panel." >

Inizialmente, lo state `activeIndex` di `Accordion` è `0`, quindi il primo `Panel` riceve `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="Lo stesso diagramma del precedente, con il valore activeIndex del componente genitore Accordion evidenziato per indicare un clic con il valore cambiato a uno. Il flusso verso entrambi i componenti figli Panel è anch'esso evidenziato, e il valore isActive passato a ciascun figlio è impostato al contrario: false per il primo Panel e true per il secondo." >

Quando lo state `activeIndex` di `Accordion` cambia a `1`, il secondo `Panel` riceve `isActive = true` invece

</Diagram>

</DiagramGroup>

<DeepDive>

#### Componenti controllati e non controllati {/*controlled-and-uncontrolled-components*/}

È comune chiamare un componente con dello state locale "non controllato". Ad esempio, il componente `Panel` originale con una variabile di state `isActive` è non controllato perché il suo genitore non può influenzare se il pannello è attivo o meno.

Al contrario, potresti dire che un componente è "controllato" quando le informazioni importanti al suo interno sono guidate dalle props piuttosto che dal suo state locale. Questo permette al componente genitore di specificare completamente il suo comportamento. Il componente `Panel` finale con la prop `isActive` è controllato dal componente `Accordion`.

I componenti non controllati sono più facili da usare all'interno dei loro genitori perché richiedono meno configurazione. Ma sono meno flessibili quando vuoi coordinarli insieme. I componenti controllati sono massimamente flessibili, ma richiedono che i componenti genitori li configurino completamente con le props.

In pratica, "controllato" e "non controllato" non sono termini tecnici rigorosi: ogni componente di solito ha un mix di state locale e props. Tuttavia, è un modo utile per parlare di come i componenti sono progettati e quali capacità offrono.

Quando scrivi un componente, considera quali informazioni al suo interno dovrebbero essere controllate (tramite props) e quali dovrebbero essere non controllate (tramite state). Ma puoi sempre cambiare idea e rifattorizzare in seguito.

</DeepDive>

## Una fonte unica di verità per ogni state {/*a-single-source-of-truth-for-each-state*/}

In un'applicazione React, molti componenti avranno il proprio state. Parte dello state può "risiedere" vicino ai componenti foglia (componenti alla base dell'albero), come gli input. Altro state può "risiedere" più in alto nell'app. Ad esempio, anche le librerie di routing lato client di solito sono implementate memorizzando la route corrente nello state di React e passandola ai figli tramite props!

**Per ogni pezzo unico di state, sceglierai il componente che lo "possiede".** Questo principio è anche noto come avere una ["fonte unica di verità".](https://en.wikipedia.org/wiki/Single_source_of_truth) Non significa che tutto lo state risieda in un unico posto, ma che per _ogni_ pezzo di state c'è un componente _specifico_ che detiene quell'informazione. Invece di duplicare lo state condiviso tra componenti, *sollevalo* al loro genitore condiviso comune e *passalo ai figli* che ne hanno bisogno.

La tua app cambierà mentre ci lavori. È comune spostare lo state verso il basso o di nuovo verso l'alto mentre stai ancora capendo dove "risiede" ogni pezzo dello state. Fa tutto parte del processo!

Per vedere come si traduce in pratica con qualche componente in più, leggi [Pensare in React.](/learn/thinking-in-react)

<Recap>

* Quando vuoi coordinare due componenti, sposta il loro state al genitore comune.
* Poi passa le informazioni ai figli tramite props dal genitore comune.
* Infine, passa i gestori di eventi ai figli in modo che possano cambiare lo state del genitore.
* È utile considerare i componenti come "controllati" (guidati dalle props) o "non controllati" (guidati dallo state).

</Recap>

<Challenges>

#### Input sincronizzati {/*synced-inputs*/}

Questi due input sono indipendenti. Falli rimanere sincronizzati: modificare un input dovrebbe aggiornare l'altro input con lo stesso testo, e viceversa.

<Hint>

Dovrai sollevare il loro state nel componente genitore.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="Primo input" />
      <Input label="Secondo input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Sposta la variabile di state `text` nel componente genitore insieme al gestore `handleChange`. Poi passali come props a entrambi i componenti `Input`. Questo li manterrà sincronizzati.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="Primo input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Secondo input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Filtrare una lista {/*filtering-a-list*/}

In questo esempio, la `SearchBar` ha il proprio state `query` che controlla l'input di testo. Il suo genitore `FilterableList` visualizza una `List` di elementi, ma non tiene conto della query di ricerca.

Usa la funzione `filterItems(foods, query)` per filtrare la lista in base alla query di ricerca. Per testare le tue modifiche, verifica che digitare "s" nell'input filtri la lista fino a "Sushi", "Shish kebab" e "Dim sum".

Nota che `filterItems` è già implementata e importata, quindi non devi scriverla tu!

<Hint>

Vorrai rimuovere lo state `query` e il gestore `handleChange` da `SearchBar`, e spostarli in `FilterableList`. Poi passali a `SearchBar` come props `query` e `onChange`.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Cerca:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

Solleva lo state `query` nel componente `FilterableList`. Chiama `filterItems(foods, query)` per ottenere la lista filtrata e passala a `List`. Ora cambiare l'input della query si riflette nella lista:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Cerca:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>
