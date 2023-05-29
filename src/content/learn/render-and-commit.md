---
title: Renderizzare e Aggiornare
---

<Intro>

Prima che i tuoi componenti siano visualizzati sullo schermo, devono essere renderizzati da React. Comprendere i passaggi di questo processo ti aiuterà a pensare a come il tuo codice viene eseguito e a spiegare il suo comportamento.

</Intro>

<YouWillLearn>

* Cosa significa renderizzare in React
* Quando e perché React renderizza un componente
* I passaggi coinvolti necessari per visualizzare un componente sullo schermo
* Perché il renderizzare non sempre produce un aggiornamento del DOM

</YouWillLearn>

Immagina che i tuoi componenti siano chef in cucina, che assemblano piatti gustosi dagli ingredienti. In questo scenario, React è il cameriere che prende le richieste dai clienti e porta loro gli ordini. Questo processo di richiesta e servizio dell'interfaccia utente (UI) ha tre fasi:

1. **Avviare** una renderizzazione (consegnare l'ordine del cliente alla cucina)
2. **Renderizzare** il componente (preparare l'ordine in cucina)
3. **Aggiornare** il DOM (mettere l'ordine sul tavolo)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Passo 1: Avviare la renderizzazione {/*step-1-trigger-a-render*/}

Ci sono due motivi per cui un componente deve eseguire la renderizzazione:

1. E' la **renderizzazione iniziale** del componente.
2. Lo **state** del componente(o uno dei suoi antenati) **è stato aggiornato.**

### Renderizzazione iniziale {/*initial-render*/}

Quando l'applicazione viene avviata, è necessario avviare la renderizzazione iniziale. Le librerie e gli ambienti di sviluppo a volte nascondono questo codice, ma viene eseguita chiamando  [`createRoot`](/reference/react-dom/client/createRoot) con il nodo DOM di destinazione, e quindi chiamando il suo metodo `render` con il componente:

<Sandpack>

```js index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' di Eduardo Catalano: una gigantesca scultura floreale metallica con petali riflettenti."
    />
  );
}
```

</Sandpack>

Prova a commentare la chiamata `root.render()` e vedrai il componente scomparire!

### Renderizzare nuovamente quando lo state viene aggiornato{/*re-renders-when-state-updates*/}

Una volta che il componente è inizialmente renderizzato, è possibile avviare ulteriori renderizzazioni aggiornando il suo state con la funzione [`set` function.](/reference/react/useState#setstate) Aggiornare lo state del componente mette automaticamente in coda una renderizzazione (puoi immaginarlo come un ospite del ristorante che ordina tè, dessert e ogni sorta di cosa dopo aver effettuato il primo ordine, a seconda della sua sete o fame)

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. They patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Passo 2: React rappresenta i tuoi componenti {/*step-2-react-renders-your-components*/}

Dopo aver avviato la renderizzazione, React richiama i tuoi componenti per capire cosa mostrare a schermo. **"Renderizzare"  è il termine che indica React che richiama i tuoi componenti.**

* **Durante il rendering iniziale,** React richiama il componente radice.
* **Per le renderizzazioni successive,** React richiama il componente funzione il cui aggiornamento di state ha scatenato il rendering.

Questo processo è ricorsivo: se il componente aggiornato restituisce un altro componente, React renderizzerà _quel_ componente successivamente, e se quel componente restituisce a sua volta qualcosa, renderizzerà _quel_ componente successivamente, e cosi via. Il processo continua finché non ci sono più componenti annidati e React sa esattamente cosa mostrare a schermo.

Nell'esempio seguente, React chiamerà `Gallery()` e  `Image()`diverse volte:

<Sandpack>

```js Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica di Eduardo Catalano: una gigantesca scultura di fiori metallici con petali riflettenti"
    />
  );
}
```

```js index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **Durante la renderizzazione iniziale,** React [creerà i nodi del DOM](https://developer.mozilla.org/docs/Web/API/Document/createElement) per `<section>`, `<h1>`, e tre `<img>` tags. 
* **Durante una renderizzazione successiva,** React calcolerà quali delle sue proprietà, se presenti, sono cambiate rispetto la renderizzazione precedente. Tuttavia, non farà nulla con queste informazioni fino alla prossima fase, la fase di commit.

<Pitfall>

Rendering must always be a [pure calculation](/learn/keeping-components-pure):

* **Stessi input, stessi output.** Dati gli stessi input, un componente dovrebbe sempre restituire lo stesso JSX. (Quando qualcuno ordina un'insalata con i pomodori, non dovrebbe ricevere un'insalata con le cipolle!)
* **Si cura solo dei suoi affari** Non dovrebbe modificare oggetti o variabili che esistevano prima della renderizzazione. (Un ordine non dovrebbe cambiare l'ordine di nessun altro.)

Altrimenti, è possibile incontrare bug confusi e comportamenti imprevedibili man mano che il tuo codice diventa più complesso.  Quando si sviluppa in Strict Mode, React chiama due volte la funzione di ogni componente, il che può aiutare a individuare errori causati da funzioni impure.

</Pitfall>

<DeepDive>

#### Ottimizzazione delle prestazioni{/*optimizing-performance*/}

Il comportamento predefinito di renderizzare tutti i componenti annidati all'interno del componente aggiornato non è ottimale in termini di prestazioni se il componente aggiornato è molto in alto nell'albero. Se si riscontra un problema di prestazioni, esistono diverse soluzioni favorite descritte nella sezione [Prestazioni](https://reactjs.org/docs/optimizing-performance.html). **Non ottimizzare prematuramente!**

</DeepDive>

## Step 3: React aggiorna il DOM  {/*step-3-react-commits-changes-to-the-dom*/}

Dopo aver renderizzato (chiamato) i componenti, React aggiornerà il DOM.

* **Per la renderizzazione iniziale,** React utilizzerà l'API DOM [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) per inserire tutti i nodi DOM creati sullo schermo.
* **Per ri-renderizzare,** React applicherà solo le operazioni minime necessarie (calcolate durante il rendering!) per rendere il DOM uguale all'ultimo output di rendering.

**React cambia solo i nodi DOM se c'è una differenza tra le renderizzazioni.** Ad esempio, ecco un componente che si ri-renderizza con diverse props passate dal suo genitore ogni secondo. Notare come è possibile aggiungere del testo nell' `<input>`, updating its `value`, , ma il testo non scompare quando il componente si ri-renderizza:

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
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
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

Questo funziona perché durante l'ultimo passaggio, React aggiorna solo il contenuto di `<h1>` con il nuovo `time`. Vede che l' `<input>` appare nel JSX nello stesso punto come l'ultima volta, quindi React non tocca `<input>`— o il suo `value`!
## Epilogo: Dipingere il browser {/*epilogue-browser-paint*/}

Dopo che la renderizzazione viene eseguita e React ha aggiornato il DOM, il browser dipinge la schermata. Sebbene questo processo sia noto come "renderizzazione del browser", lo chiameremo "dipingere" per evitare confusione in tutta la documentazione.

<Illustration alt="Un browser che dipinge l'immagine 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Ogni aggiornamento dello schermo in un'app React avviene in tre fasi:
  1. Trigger
  2. Renderizzazione
  3. Commit
* Puoi usare la Modalità Strict per trovare gli errori nei tuoi componenti
* React non aggiorna il DOM se il risultato della renderizzazione è lo stesso della volta precedente

</Recap>


