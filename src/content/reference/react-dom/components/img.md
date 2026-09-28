---
title: "<img>"
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/components/img.md).

</Note>

<Intro>

Il [componente browser integrato `<img>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/img) ti permette di incorporare un'immagine.

```js
<img src="photo.jpg" alt="Una persona che cammina in un parco" />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<img>` {/*img*/}

Per visualizzare un'immagine, renderizza il [componente browser integrato `<img>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/img).

```js
<img src="photo.jpg" alt="Una persona che cammina in un parco" />
```

[Vedi altri esempi sotto.](#usage)

#### Props {/*props*/}

`<img>` supporta tutte le [props comuni degli elementi.](/reference/react-dom/components/common#common-props)

* `alt`: una stringa. Specifica il testo alternativo dell'immagine. Usa una stringa vuota per un'immagine puramente decorativa.
* `crossOrigin`: una stringa. Specifica la [policy CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) da usare quando viene recuperata l'immagine. I valori possibili sono `anonymous` e `use-credentials`.
* `decoding`: una stringa. Suggerisce se il browser dovrebbe attendere di decodificare l'immagine prima di presentare altro contenuto. I valori possibili sono `async`, `sync` e `auto` (il valore predefinito).
* `fetchPriority`: una stringa. Suggerisce una priorità relativa per il recupero dell'immagine. I valori possibili sono `high`, `low` e `auto` (il valore predefinito). Durante la renderizzazione lato server, `fetchPriority="low"` impedisce anche a React di [precaricare automaticamente l'immagine.](#controlling-image-preloading-during-server-rendering)
* `height`: un numero o una stringa. Specifica l'altezza con cui viene visualizzata l'immagine.
* `loading`: una stringa. Specifica se il browser dovrebbe rinviare il caricamento dell'immagine finché non è vicina al viewport. I valori possibili sono `eager` (il valore predefinito) e `lazy`. Impostare `loading="lazy"` impedisce a React di [precaricare automaticamente l'immagine.](#controlling-image-preloading-during-server-rendering)
* `onError`: una funzione [gestore di eventi](/reference/react-dom/components/common#event-handler). Scatta quando il caricamento dell'immagine fallisce.
* `onLoad`: una funzione [gestore di eventi](/reference/react-dom/components/common#event-handler). Scatta quando il caricamento dell'immagine è completato. Passare `onLoad` impedisce a React di [attendere l'immagine durante un aggiornamento View Transition renderizzato lato client.](#waiting-for-an-image-during-a-view-transition)
* `referrerPolicy`: una stringa. Specifica le [informazioni sul referrer](https://developer.mozilla.org/it/docs/Web/HTML/Element/img#referrerpolicy) da inviare quando viene recuperata l'immagine.
* `sizes`: una stringa. Specifica le dimensioni dell'immagine per i diversi layout di pagina. Usata insieme a `srcSet`.
* `src`: una stringa. Specifica l'URL dell'immagine.
* `srcSet`: una stringa. Specifica una o più sorgenti candidate tra cui il browser può scegliere.
* `useMap`: una stringa. Associa l'immagine a una [mappa immagine lato client](https://developer.mozilla.org/it/docs/Web/HTML/Element/map).
* `width`: un numero o una stringa. Specifica la larghezza con cui viene visualizzata l'immagine.

#### Caveats {/*caveats*/}

* Non passare una stringa vuota a `src`: potrebbe indurre il browser a richiedere di nuovo la pagina corrente. React mostra un avviso in sviluppo e omette l'attributo. Per non visualizzare alcuna immagine, ometti `<img>` o passa `null` a `src`.
* `<img>` non può avere children né usare `dangerouslySetInnerHTML`. React solleva un errore se passi una delle due cose.
* `fetchPriority="low"` non impedisce a React di attendere che l'immagine venga caricata e decodificata durante un aggiornamento View Transition renderizzato lato client. Usa `loading="lazy"` o un gestore `onLoad` per rinunciare a questo comportamento.

---

## Usage {/*usage*/}

### Visualizzare un'immagine {/*displaying-an-image*/}

Passa l'URL dell'immagine a `src` e una descrizione testuale a `alt`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      width={100}
      height={100}
    />
  );
}
```

```css
img {
  border-radius: 50%;
  object-fit: cover;
}
```

</Sandpack>

Specifica `width` e `height` quando conosci le dimensioni dell'immagine, così il browser può riservare lo spazio prima che l'immagine venga caricata. Per un'immagine decorativa, passa `alt=""` in modo che gli screen reader la ignorino.

---

### Controllare il precaricamento delle immagini durante la renderizzazione lato server {/*controlling-image-preloading-during-server-rendering*/}

Durante la renderizzazione lato server, per impostazione predefinita React genera automaticamente un hint di preload per un `<img>`. Questo può permettere al browser di iniziare a recuperare l'immagine prima di incontrare l'`<img>` nell'HTML renderizzato.

Aggiungi `loading="lazy"` o `fetchPriority="low"` a un'immagine che non dovrebbe ricevere questo hint:

```js
function ProductPage() {
  return (
    <>
      <img src="hero.jpg" alt="Prodotto in evidenza" />
      <img src="thumbnail.jpg" alt="Prodotto correlato" loading="lazy" />
      <img src="secondary.jpg" alt="Un altro prodotto" fetchPriority="low" />
    </>
  );
}
```

In questo esempio, React genera un hint di preload solo per `hero.jpg`. A seconda dell'API del server o del framework, React potrebbe renderizzare l'equivalente di questo elemento:

```html
<link rel="preload" as="image" href="hero.jpg" />
```

React potrebbe invece fornire lo stesso hint nell'intestazione `Link` della risposta. Le altre due immagini mantengono le loro props `loading` e `fetchPriority` nell'HTML renderizzato, ma React non genera hint di preload per queste immagini. La prop `loading="lazy"` chiede al browser di rinviare il caricamento di un'immagine finché non si avvicina al viewport. La prop `fetchPriority="low"` permette all'immagine di caricarsi immediatamente, ma dice al browser di recuperarla con una priorità più bassa.

React inoltre non precarica automaticamente un'immagine quando si trova all'interno di un elemento `<picture>` o `<noscript>`, o quando il suo `src` o `srcSet` è un data URL.

Se renderizzi un'immagine attraverso un framework o una libreria di componenti, consulta la sua documentazione per il comportamento predefinito. React decide se generare un precaricamento automatico in base alle props dell'`<img>` sottostante. Ad esempio, un componente immagine potrebbe aggiungere `loading="lazy"` per impostazione predefinita e fornire un'opzione separata per precaricare esplicitamente le immagini selezionate.

Per creare un hint di preload esplicito, chiama [`preload`](/reference/react-dom/preload).

---

### Attendere un'immagine durante una View Transition {/*waiting-for-an-image-during-a-view-transition*/}

Durante un aggiornamento [`<ViewTransition>`](/reference/react/ViewTransition) renderizzato lato client, React potrebbe attendere che un'immagine si carichi e venga decodificata prima di avviare l'animazione. Questo si applica quando viene renderizzato un nuovo `<img>` con un `src` non vuoto, o quando `src` o `srcSet` di un'immagine esistente cambia. L'immagine deve trovarsi nel sottoalbero del `<ViewTransition>` e non deve avere `loading="lazy"` né un gestore `onLoad`. React non attende le immagini durante gli aggiornamenti sincroni.

Quando un boundary Suspense rivela contenuto in streaming all'interno di un `<ViewTransition>`, React potrebbe anche attendere le immagini visibili con un `src` non vuoto che non hanno `loading="lazy"`. React smette di attendere dopo un timeout, così che un'immagine lenta non blocchi l'aggiornamento all'infinito.

In questo esempio, il boundary Suspense è avvolto in un `<ViewTransition>` e mostra un placeholder del profilo finché il ritratto non si è caricato.

Per confronto, il secondo pulsante inserisce la stessa card direttamente nel DOM. La card appare immediatamente, e il browser visualizza l'immagine dopo che si è caricata:

<Sandpack>

```js
import { ViewTransition, Suspense, useState, startTransition } from 'react';
import { freshImageUrl } from './image.js';
import VanillaProfile from './VanillaProfile.js';

function Profile({ src }) {
  return (
    <div className="card">
      <img src={src} alt="Jack Pope" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [src, setSrc] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setSrc(freshImageUrl());
          });
        }}>
        Mostra profilo
      </button>
      {src && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile src={src} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfile />
    </>
  );
}
```

```js src/VanillaProfile.js
import { useRef } from 'react';
import { freshImageUrl } from './image.js';

export default function VanillaProfile() {
  const ref = useRef(null);
  function show() {
    ref.current.innerHTML = `<div class="card">
      <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
      <p>Jack Pope</p>
    </div>`;
  }
  return (
    <>
      <button onClick={show}>Mostra profilo (aggiornamento diretto del DOM)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/image.js hidden
// Aggiungi un parametro univoco così l'immagine non finisce in cache
// e ogni esecuzione mostra lo stato di caricamento.
export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>
