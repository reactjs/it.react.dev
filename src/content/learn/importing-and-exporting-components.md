---
title: Importazione ed Esportazione di Componenti
---

<Intro>

La magia dei componenti sta nella loro riutilizzabilità: si possono creare componenti che sono composti da altri componenti. Ma quando si annidano sempre più componenti, spesso ha senso iniziare a dividerli in file diversi. Ciò consente di mantenere i file facili da leggere e di riutilizzare i componenti in più punti.

</Intro>

<YouWillLearn>

* Cos'è un file del componente radice
* Come importare ed esportare un componente
* Quando utilizzare importazioni ed esportazioni predefinite e nominali
* Come importare ed esportare più componenti da un unico file
* Come dividere i componenti in più file

</YouWillLearn>

## Il file del componente radice {/*the-root-component-file*/}

In [Il Tuo Primo Componente](/learn/your-first-component), hai creato un componente `Profile` e un componente `Gallery` che lo renderizza:

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

Attualmente questi componenti si trovano nel **file del componente radice,** chiamato `App.js` in questo esempio. In [Create React App](https://create-react-app.dev/), l'applicazione si trova in `src/App.js`. Tuttavia, a seconda della configurazione, il componente radice potrebbe trovarsi in un altro file. Se si usa un framework con routing basato su file, come Next.js, il componente radice sarà diverso per ogni pagina.

## Esportazione e importazione di un componente {/*exporting-and-importing-a-component*/}

E se in futuro si volesse cambiare la schermata di landing e inserire un elenco di libri scientifici? O mettere tutti i profili da qualche altra parte? Avrebbe senso spostare `Gallery` e `Profile` dal file radice del componente. Far questo renderà tali componenti più modulari e riutilizzabili in altri file. È possibile spostare un componente in tre fasi:

1. **Crea** un nuovo file JS in cui inserire i componenti.
2. **Esporta** la funzione del componente da quel file (utilizzando [l'esportazione predefinita](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) o [nominale](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)).
3. **Importa** il componente nel file in cui lo si utilizzerà (utilizzando la tecnica corrispondente per l'importazione [predefinita](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) o [nominale](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)).

Qui sia `Profile` che `Gallery` sono stati spostati da `App.js` in un nuovo file chiamato `Gallery.js`. Ora si può modificare `App.js` per importare `Gallery` da `Gallery.js`:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Si noti come questo esempio sia ora suddiviso in due file componenti:

1. `Gallery.js`:
     - Definisce il componente `Profile` che viene utilizzato solo all'interno dello stesso file e non viene esportato.
     - Esporta il componente `Gallery` come **esportazione predefinita**.
2. `App.js`:
     - Importa `Gallery` come **importazione predefinita** da `Gallery.js`.
     - Esporta il componente `App` principale come **esportazione predefinita**.


<Note>

Si possono incontrare file che omettono l'estensione `.js` come in questo caso:

```js 
import Gallery from './Gallery';
```

Sia `'./Gallery.js'` che `'./Gallery'` funzioneranno con React, anche se il primo è più simile a come funzionano i [Moduli ES nativi](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules).

</Note>

<DeepDive>

#### Esportazioni predefinite o nominali {/*default-vs-named-exports*/}

Esistono due modi principali per esportare valori in JavaScript: le esportazioni predefinite e le esportazioni nominali. Finora, i nostri esempi hanno utilizzato solo le esportazioni predefinite. Ma è possibile utilizzare una o entrambe nello stesso file. **Un file non può avere più di un'esportazione _default_, ma può avere tutte le esportazioni _nominali_ che si vogliono**.

![Esportazioni predefinite e nominali](/images/docs/illustrations/i_import-export.svg)

Il modo in cui si esporta il componente determina il modo in cui lo si deve importare. Si otterrà un errore se si cerca di importare un'esportazione predefinita nello stesso modo in cui si importerebbe un'esportazione nominale! Questo grafico può aiutarti a non confonderti:

| Sintassi           | Dichiarazione di esportazione                           | Dichiarazione di importazione                          |
| -----------        | -----------                                             | -----------                               |
| Predefinita        | `export default function Button() {}` | `import Button from './Button.js';`     |
| Nominale           | `export function Button() {}`         | `import { Button } from './Button.js';` |

Quando si utilizza un'importazione _default_, si può utilizzare qualsiasi nome si voglia dopo `import`. Per esempio, si potrebbe scrivere `import Banana from './Button.js'` e si otterrebbe comunque la stessa esportazione predefinita. Al contrario, con le importazioni nominali, il nome deve corrispondere da entrambe le parti. Ecco perché si chiamano importazioni _nominali_!

**Spesso si utilizzano esportazioni predefinite se il file esporta un solo componente e esportazioni nominali se esporta più componenti e/o valori.** Indipendentemente dallo stile che si preferisce, bisogna sempre dare nomi significativi alle funzioni dei componenti e ai file che li contengono. I componenti senza nome, come `export default () => {}`, sono sconsigliati perché rendono più difficile il debugging.

</DeepDive>

## Esportazione e importazione di più componenti dallo stesso file {/*exporting-and-importing-multiple-components-from-the-same-file*/}

E se si volesse mostrare un solo `Profile` invece di una galleria? Si può esportare anche il componente `Profile`. Ma `Gallery.js` ha già un'esportazione *default* e non si possono avere due esportazioni predefinite. Si può creare un nuovo file con un'esportazione predefinita o aggiungere un'esportazione *nominale* per `Profile`. **Un file può avere una sola esportazione predefinita, ma può avere numerose esportazioni nominali!**

<Note>

Per ridurre la potenziale confusione tra esportazioni predefinite e nominali, alcuni team scelgono di attenersi a un solo stile (predefinito o nominale) o di evitare di mescolarli in un unico file. Fai quello che funziona meglio per te!

</Note>

Per prima cosa, **esporta** `Profile` da `Gallery.js` usando un'esportazione nominale (senza parola chiave `default`):

```js
export function Profile() {
  // ...
}
```

Quindi, **importa** `Profile` da `Gallery.js` in `App.js` usando un'importazione nominale (con le parentesi graffe):

```js
import { Profile } from './Gallery.js';
```

Infine, **renderizza** `<Profile />` nel componente `App`:

```js
export default function App() {
  return <Profile />;
}
```

Ora `Gallery.js` contiene due esportazioni: una predefinita `Gallery` e una denominata `Profile`. `App.js` le importa entrambe. Provate a modificare `<Profile />` in `<Gallery />` e viceversa in questo esempio:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Ora stai utilizzando un mix di esportazioni predefinite e nominate:

* `Gallery.js`:
  - Esporta il componente `Profile` come un'esportazione **nominale chiamata `Profile`.**
  - Esporta il componente `Gallery` come **esportazione predefinita**.
* `App.js`:
  - Importa `Profile` come un'importazione **nominale chiamata `Profile`** da `Gallery.js`.
  - Importa `Gallery` come **importazione predefinita** da `Gallery.js`.
  - Esporta il componente `App` principale come **esportazione predefinita**.

<Recap>

In questa pagina hai imparato:

* Cos'è un file del componente radice
* Come importare ed esportare un componente
* Quando e come utilizzare importazioni ed esportazioni predefinite e nominali
* Come esportare più componenti dallo stesso file

</Recap>



<Challenges>

#### Suddividere ulteriormente i componenti {/*split-the-components-further*/}

Attualmente, `Gallery.js` esporta sia `Profile` che `Gallery`, il che crea un po' di confusione.

Sposta il componente `Profile` nel proprio `Profile.js`, quindi modifica il componente `App` per renderizzare sia `<Profile />` che `<Galleriy />` uno dopo l'altro.

Puoi usare un'esportazione predefinita o nominale per `Profile`, ma assicurati di usare la sintassi di importazione corrispondente sia in `App.js` che in `Gallery.js`! Puoi fare riferimento alla tabella di approfondimento di cui sopra:

| Sintassi           | Dichiarazione di esportazione                           | Dichiarazione di importazione                          |
| -----------      | -----------                                | -----------                               |
| Predefinita  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Nominale    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

Non dimenticare di importare i componenti dove vengono chiamati. Anche `Gallery` usa `Profile`?

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Move me to Profile.js!
export function Profile() {
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

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Dopo aver fatto funzionare il tutto con un tipo di esportazioni, fallo funzionare con l'altro tipo.

<Solution>

Questa è la soluzione con le esportazioni nominali:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

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

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Questa è la soluzione con le esportazioni predefinite:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

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

```js Profile.js
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
