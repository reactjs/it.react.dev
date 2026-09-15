---
title: "React 19.3"
author: The React Team
date: 2026/09/09
description: React 19.3 aggiunge nuove funzionalità come View Transitions, Fragment Refs, browser(), Trusted Types e altro.
translationStatus: ai-draft
---

September 9, 2026 by [The React Team](/community/team)

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2026/09/09/react-19-3.md).

</Note>

<Intro>

React 19.3 è ora disponibile su npm!

</Intro>


[Lo scorso anno](/blog/2025/04/23/react-labs-view-transitions-activity-and-more) abbiamo presentato View Transitions e Fragment Refs come nuove API sperimentali in arrivo in React. Siamo entusiasti di annunciare che entrambe sono ora stabili in React 19.3!

In questo post vedremo come funzionano e tratteremo anche altre novità rilevanti di questa release.

<InlineToc />

---

## Nuove funzionalità di React {/*new-react-features*/}

### View Transitions {/*view-transition*/}

Il nuovo componente `<ViewTransition>` ti permette di animare elementi quando entrano, escono, si spostano o cambiano dimensione usando la [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) del browser. L'abbiamo condivisa come API sperimentale [lo scorso anno](/blog/2025/04/23/react-labs-view-transitions-activity-and-more#view-transitions), e in 19.3 è stabile e pronta all'uso.

Per animare una parte della tua UI, avvolgila in `<ViewTransition>`:

```js
import { ViewTransition } from 'react';

{isShowing && (
  <ViewTransition>
    <Component />
  </ViewTransition>
)}
```

Ora, ogni volta che un aggiornamento contrassegnato come [Transition](/reference/react/useTransition) cambia lo stile del componente figlio, o causa il mount o l'unmount di `ViewTransition`, React animerà quell'aggiornamento.

{/*
Gli aggiornamenti fuori da una Transition non attivano animazioni, perché sono pensati per essere urgenti e riflessi immediatamente nella UI. Gli aggiornamenti di state dentro [startTransition](/reference/react/startTransition), la rivelazione di un [`<Suspense>`](/reference/react/Suspense) o un aggiornamento da [`useDeferredValue`](/reference/react/useDeferredValue) attivano tutti l'animazione di una View Transition.
*/}

React sceglie quale animazione eseguire in base a come è cambiato l'albero:

- **enter**: viene aggiunto `<ViewTransition>`.
- **exit**: viene rimosso `<ViewTransition>`.
- **update**: i figli di un `<ViewTransition>` cambiano stile o contenuto.
- **share**: un `<ViewTransition>` con nome viene rimosso in un punto e aggiunto in un altro.

Nota che gli aggiornamenti non contrassegnati come Transition non attivano animazioni, perché sono pensati per essere urgenti e riflessi immediatamente nella UI. Gli aggiornamenti di state dentro [startTransition](/reference/react/startTransition), la rivelazione di un [`<Suspense>`](/reference/react/Suspense) o un aggiornamento da [`useDeferredValue`](/reference/react/useDeferredValue) attivano tutti l'animazione di una View Transition.

Ecco un semplice esempio di animazione enter/exit:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import { ViewTransition, useState, startTransition } from 'react';
import { Video } from './Video';
import videos from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition>
          <Video video={videos[0]} />
        </ViewTransition>
      )}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Per impostazione predefinita, `<ViewTransition>` anima con un cross-fade fluido. Puoi personalizzare ogni tipo di animazione passando una [View Transition Class](/reference/react/ViewTransition#view-transition-class) e definendo l'animazione in CSS, oppure puoi usare la [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) per attivare animazioni in modo imperativo con le [event props](/reference/react/ViewTransition#view-transition-event) (`onEnter`, `onExit`, `onShare`, `onUpdate`).

{/*
Ci sono un paio di regole da tenere a mente. Un `<ViewTransition>` anima enter ed exit solo se è la prima cosa renderizzata nel suo sottoalbero, prima di qualsiasi nodo DOM, e ogni `name` condiviso deve essere univoco nell'app in ogni momento. Consulta [Troubleshooting](/reference/react/ViewTransition#troubleshooting) per i dettagli.
 */}

Attualmente, `<ViewTransition>` funziona solo nel DOM. Stiamo lavorando al supporto per React Native e altre piattaforme.

Per saperne di più, consulta la [documentazione di `<ViewTransition>`](/reference/react/ViewTransition).

---

#### `addTransitionType` {/*add-transition-type*/}

A volte vorrai personalizzare quale animazione usare per lo stesso aggiornamento di state. Ad esempio, navigare un carosello _in avanti_ fino alla terza slide dovrebbe animare le slide da destra a sinistra, mentre navigarlo _indietro_ dovrebbe animarle da sinistra a destra, anche se entrambe le azioni impostano currentSlide a 3.

Puoi personalizzare l'animazione per una data View Transition chiamando `addTransitionType` insieme all'aggiornamento di state. Questo ti permette di aggiungere più informazioni sulla _causa_ di una particolare Transition:

```js {3,10}
function nextSlide() {
  startTransition(() => {
    addTransitionType('next');
    setCurrentSlide(c => c + 1);
  });
}

function previousSlide() {
  startTransition(() => {
    addTransitionType('previous');
    setCurrentSlide(c => c - 1);
  });
}
```

Poi puoi specificare animazioni diverse in base a quel Transition Type:

```js
<ViewTransition
  enter={{
    'next': 'from-right',
    'previous': 'from-left',
  }}
  exit={{
    'next': 'to-left',
    'previous': 'to-right',
  }}
>
  <Page />
</ViewTransition>
```

Ecco un esempio:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
  Fragment
} from 'react';
import { Video } from './Video';
import videos from './data';
import './animations.css';

export default function Component() {
  const [selected, setSelected] = useState(0)
  const video = videos[selected];

  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('previous');
              setSelected(c => c > 0 ? c - 1 : videos.length - 1 )
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('next');
              setSelected(c => c + 1 < videos.length ? c + 1 : 0)
            });
          }}>
          ➡️
        </button>
      </div>

      <ViewTransition
        key={video.id}
        enter={{
          'next': 'from-right',
          'previous': 'from-left'
        }}
        exit={{
          'next': 'to-left',
          'previous': 'to-right'
        }}
      >
        <Video video={video} />
      </ViewTransition>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];
```

```css src/animations.css
::view-transition-old(*),
::view-transition-new(*) {
  animation-duration: 250ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

::view-transition-new(.from-right) {
  --offset: 100%;
  animation-name: slide-in;
}

::view-transition-new(.from-left) {
  --offset: -100%;
  animation-name: slide-in;
}

::view-transition-old(.to-right) {
  --offset: 100%;
  animation-name: slide-out;
}

::view-transition-old(.to-left) {
  --offset: -100%;
  animation-name: slide-out;
}

@keyframes slide-in {
  from {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}

@keyframes slide-out {
  to {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}
```

```css src/styles.css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
  gap: 8px;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

React aggiunge anche ogni Transition Type all'elemento come [view transition type](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) del browser, così puoi delimitare le animazioni in CSS con `:active-view-transition-type(...)`.

Per saperne di più, consulta la [documentazione di `addTransitionType`](/reference/react/addTransitionType).

---

#### Animare fallback, immagini e font con Suspense {/*animating-fallbacks-images-and-fonts-with-suspense*/}

Una delle cose più interessanti delle View Transitions in React è come si integrano con Suspense.

Puoi animare un boundary Suspense mentre rivela i suoi figli avvolgendolo in `<ViewTransition>`:

```js
<ViewTransition>
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
</ViewTransition>
```

Quando i figli finiscono di caricarsi, React attiverà un'animazione di **update** dal fallback al contenuto finale.

Ecco un esempio. Prova a premere ➕ per renderizzare un LazyVideo che sospende la prima volta che viene renderizzato:

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 750ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
}
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Anche se funziona, noterai che il video continua ad animarsi entrando e uscendo nelle rivelazioni successive, anche se è già stato caricato. (Potresti anche notare che il fallback sfuma la prima volta che viene mostrato.)

In generale, le animazioni con Suspense funzionano meglio se usate con parsimonia ed evitate per UI già in cache che altrimenti apparirebbe istantaneamente.

Ecco alcuni principi per ottenere una buona UX quando animi con Suspense:

- I fallback dovrebbero apparire immediatamente _senza animazione_
- Un fallback dovrebbe aggiornarsi al contenuto finale _con animazione_
- I figli che non sospendono dovrebbero apparire immediatamente _senza animazione_

Questo mantiene l'app reattiva quando i contenuti sono già caricati, e usa l'animazione solo per fluidificare il passaggio dal fallback al contenuto finale.

Per correggere l'esempio sopra, possiamo disabilitare tutte le animazioni tranne quelle di update:

```js {1}
<ViewTransition update="auto" default="none">
  <Suspense fallback={<Fallback />}>
    <Component />
  </Suspense>
</ViewTransition>
```

Vediamo come si comporta ora:

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition update="auto" default="none">
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 5000ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
}
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Nota come il fallback appare immediatamente quando tocchi il bottone, mantenendo la UI reattiva alle azioni dell'utente. Inoltre, una volta caricato il video, attivarlo o disattivarlo è istantaneo.

Ci sono altri pattern che puoi usare a seconda dell'effetto che vuoi ottenere. Per saperne di più, consulta la documentazione su [animare con Suspense](/reference/react/ViewTransition#animating-from-suspense-content).

---

Oltre ad animare i fallback, le View Transitions permettono di far sì che immagini o font attivino Suspense durante il caricamento.

Questo ti permette di evitare il comportamento predefinito del browser in cui immagini o font possono comparire con un flicker non appena finiscono di caricarsi, e invece costruire sequenze di caricamento coordinate che considerano tutte le risorse di un componente.

Avvolgi immagini o font dentro `<ViewTransition>` per attivare Suspense mentre si caricano:

```js
<ViewTransition>
  <Suspense fallback={<Fallback />}>
    <img src={imageSrc} />

    <style href={fontSrc} precedence="default">
      {`@font-face {
        font-family: 'Fancy';
        src: url(${fontSrc}) format('truetype');
        font-display: swap;
      }`}
    </style>
  </Suspense>
</ViewTransition>
```

Ecco un esempio di componente che sospende finché dati, immagine e font non sono tutti caricati:


<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import { ProfileCard, ProfileCardLoading } from './ProfileCard.js';
import { VanillaProfileCard } from './VanillaProfileCard.js';

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>

      {resources && (
        <ViewTransition update='auto' default='none'>
          <Suspense fallback={<ProfileCardLoading />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}

      <hr />

      <VanillaProfileCard />
    </>
  );
}
```

```js src/ProfileCard.js
import { use } from 'react';

export function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="Jack Pope" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

export function ProfileCardLoading() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}
```


```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const quote = await fetchQuote();
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        img { object-fit: cover; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
      </style>
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// Aggiungi un parametro univoco così le risorse non vengono cachate
// e ogni esecuzione mostra lo state di caricamento.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Nota: il modo in cui fai data fetching dipende
// dal framework che usi insieme a Suspense.

export async function fetchQuote() {
  // Aggiungi un ritardo artificiale per rendere l'attesa visibile.
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
img {
  object-fit: cover;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Per saperne di più sull'attesa del caricamento di immagini, font o stylesheet, consulta la [documentazione di Suspense](/reference/react/Suspense#waiting-for-a-font-to-load).

---

### Fragment Refs {/*fragment-refs*/}

Quando hai bisogno di un controllo più a basso livello sui nodi DOM di un componente — ad esempio per collegare un event listener, osservare la visibilità o spostare il focus — di solito puoi usare un ref. Ma ci sono situazioni in cui questo è difficile:

- Componenti che renderizzano un gruppo di sibling senza un singolo genitore
- Componenti che non passano la prop `ref` a un altro elemento

```js
function Component() {
  // Come possiamo lavorare con l'elenco di nodi DOM renderizzati da questo componente?
  return (
    {posts.map(post => (
      <Heading key={post.id}>
        {post.title}
      </Heading>
    ))}
  )
}
```

Aggiungere un wrapper `<div>` solo per tenere un ref a volte funziona, ma può anche interferire con lo styling o il layout del componente. Inoltre, se un componente non espone una prop `ref`, dovresti modificarlo per farlo, il che potrebbe essere impossibile se proviene da una libreria che non controlli.

I Fragment Refs risolvono questi problemi fornendo un insieme limitato di metodi DOM comunemente usati che funzionano con qualsiasi componente React, indipendentemente da cosa renderizza.

In 19.3, puoi usarli passando un ref direttamente a un [`<Fragment>`](/reference/react/Fragment). Questo ref ti dà un `FragmentInstance`, che puoi usare per lavorare con i figli DOM del Fragment:

```js {2,5-6,10}
function Component() {
  const fragmentRef = useRef(null);

  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.focus();
  }, []);

  return (
    <Fragment ref={fragmentRef}>
      {posts.map(post => (
        <Heading key={post.id}>
          {post.title}
        </Heading>
      ))}
    </Fragment>
  )
}
```

Il `FragmentInstance` opera sul DOM dei figli _come gruppo_, senza cambiarne la struttura:

- `addEventListener`, `removeEventListener` e `dispatchEvent` gestiscono gli eventi per i figli di primo livello.
- `focus`, `focusLast` e `blur` spostano il focus tra i figli annidati, in profondità prima.
- `observeUsing` e `unobserveUsing` collegano un `IntersectionObserver` o un `ResizeObserver`.
- `getClientRects`, `getRootNode`, `compareDocumentPosition` e `scrollIntoView` ti permettono di misurare e scorrere fino ai figli di primo livello del fragment.

Quindi, i Fragment Refs ti permettono di collegare comportamenti ad altri componenti senza doverne modificare l'interno, o senza cambiare la struttura DOM che già producono.

Questo esempio mostra un componente `InView` con una prop `onChange` che scatta ogni volta che i suoi figli entrano o escono dal viewport:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Card from './Card';
import InView from './InView';

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>

      <InView onChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </InView>

      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/Card.js
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```js src/InView.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

export default function InView({ onChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Nota come `InView` riesce ad aggiungere comportamento ai suoi figli, anche se non c'è un singolo elemento DOM genitore, e nonostante `Card` non esponga una prop `ref`.

Per saperne di più sull'uso dei Fragment Refs, consulta la [documentazione di `<Fragment>`](/reference/react/Fragment).

---

## Nuove funzionalità di React DOM {/*new-react-dom-features*/}

### `browser` {/*browser*/}

Se la tua app usa il server rendering, i componenti renderizzeranno in due ambienti diversi:

- Sul server, i componenti renderizzano per produrre l'HTML iniziale
- Sul client, i componenti renderizzano per arricchire quell'HTML con gestori di eventi

Nella maggior parte dei casi, i componenti dovrebbero produrre HTML che corrisponde al loro output iniziale renderizzato sul client, garantendo un'idratazione corretta e permettendo agli utenti di vedere quanto più contenuto possibile al caricamento iniziale.

Ma in rari casi, un componente potrebbe non riuscire a produrre UI significativa sul server. Ad esempio, potrebbe dipendere da un'API disponibile solo nel browser come `localStorage`, o leggere il fuso orario locale del browser. In questi casi, potresti voler escludere del tutto quel componente dal server rendering.

In precedenza, potevi farlo usando dello state che aggiornavi in un Effetto, o controllando la presenza di API del browser come `window`:

```js
function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  // ...
}

function Component() {
  const isBrowser = typeof window !== 'undefined';

  // ...
}
```

In 19.3, React include ora un'API di prima classe per questa tecnica.

Un componente può chiamare `use(browser())` per escludersi dal server-side rendering:

```js {5}
import { use } from 'react';
import { browser } from 'react-dom';

function Component() {
  use(browser());

  // ...
}
```

Questo attiverà Suspense sul server, ma _non_ sul client. Durante il server-side rendering, il fallback del boundary Suspense più vicino apparirà nell'HTML. Una volta idratato il componente sul client, `use(browser())` non sospende, permettendo al componente di continuare a renderizzare normalmente.

Ecco un esempio di componente che renderizza il fuso orario locale del tuo dispositivo. Premi **Reload** per vedere l'HTML iniziale seguito dalla prima renderizzazione di React sul client:

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone() {
  use(browser());
  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{timeZone}</p>
}

export default function App() {
  return (
    <>
      <p>Your current time zone is:</p>
      <Suspense fallback="Loading...">
        <TimeZone />
      </Suspense>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Attendi così che siano visibili sia il fallback sia il contenuto idratato.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Poiché TimeZone sospende sul server, l'HTML iniziale include il fallback Suspense. Dopo un breve ritardo artificiale, React idrata la pagina, permettendo al componente di renderizzare normalmente nel browser.

Quindi, per i componenti che non possono produrre UI significativa durante il server rendering, `browser` ti permette di usare Suspense per i loro stati di caricamento, permettendo loro di partecipare insieme ad altri componenti che sospendono finché non sono pronti a renderizzare.

---

Come altre chiamate a `use`, `use(browser())` può essere chiamato dentro un'istruzione condizionale o dopo un early return. Questo ti permette di scrivere componenti o Hook personalizzati che possono escludersi dal server rendering in base a una condizione, come il valore di una prop.

Ecco lo stesso esempio di sopra, tranne che ora il nostro componente TimeZone accetta un valore predefinito opzionale che può renderizzare come parte dell'HTML iniziale:

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone({ defaultValue }) {
  if (defaultValue) {
    return <p>{defaultValue}</p>;
  }

  use(browser());
  const localTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{localTimeZone}</p>
}

export default function App() {
  return (
    <>
      <div>
        <p>The event's time zone is:</p>
        <TimeZone defaultValue='America/New_York' />
      </div>

      <hr />

      <div>
        <p>Your current time zone is:</p>
        <Suspense fallback="Loading...">
          <TimeZone />
        </Suspense>
      </div>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Attendi così che siano visibili sia il fallback sia il contenuto idratato.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Nota come TimeZone sospende solo nel secondo caso, quando non viene fornito un valore predefinito.

Un altro esempio utile di questo pattern è escludere dal server rendering un Hook per il data fetching come `useQuery`, a meno che i dati iniziali della query non siano stati passati (ad esempio da un Server Component o dalla funzione loader del framework):

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser());
  }

  return useQuery(query, options);
}

function ProductDetails({ productId, initialData }) {
  const product = useBrowserQuery(`/api/products/${productId}`, {
    initialData,
  });

  return <h1>{product.name}</h1>;
}
```

Ora, il componente ProductDetails può essere incluso nell'HTML, a patto che riceva `initialData` durante il server rendering. Altrimenti, sospende finché non viene renderizzato nel browser, momento in cui `useQuery` può recuperare i dati o leggerli dalla cache normalmente.

Per saperne di più su `browser`, [consulta la documentazione](/reference/react-dom/browser).

---

### Supporto Trusted Types {/*trusted-types-support*/}

React 19.3 si integra con la [Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API) del browser, una funzionalità di sicurezza che aiuta a prevenire attacchi XSS basati sul DOM. Quando un sito applica Trusted Types con `Content-Security-Policy: require-trusted-types-for 'script'`, il browser richiede che i valori passati a injection sink come `innerHTML` siano oggetti tipizzati (`TrustedHTML`, `TrustedScript`, `TrustedScriptURL`) creati tramite le tue policy di sanitizzazione, piuttosto che stringhe grezze.

In precedenza, React convertiva sempre i valori in stringhe (via `'' + value`) prima di passarli alle API DOM, trasformando gli oggetti Trusted Types di nuovo in stringhe semplici che il browser rifiutava. React ora passa questi valori senza coercizione, così il browser può validarli e le tue policy Trusted Types funzionano come previsto.

---

## Nuove funzionalità di React Server Components {/*new-react-server-components-features*/}

### `<Context>` può essere renderizzato direttamente nei Server Components {/*context-can-be-rendered-directly-in-server-components*/}

Anche se i Server Components non possono _creare_ Context, possono _renderizzare_ Context importandolo da un modulo `'use client'`.

In precedenza, questo richiedeva che il modulo client esportasse un componente wrapper separato, spesso chiamato Provider:

```js {7-9}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ currentUser, children }) {
  return <UserContext value={currentUser}>{children}</UserContext>;
}
```

```js {8}
// server-component.js
import { UserProvider } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserProvider currentUser={currentUser}>
      {children}
    </UserProvider>
  )
}
```

Nota che in questo esempio, il provider non fa altro che passare la prop dal Server Component direttamente al Context.

In React 19.3, i Server Components possono importare e renderizzare Context direttamente da un modulo `'use client'`, senza un componente wrapper aggiuntivo:

```js {5}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);
```

```js {8}
// server-component.js
import { UserContext } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserContext value={currentUser}>
      {children}
    </UserContext>
  )
}
```

Questo è particolarmente utile per i Context che esistono solo per permettere ai Server Components di condividere dati con il resto dell'albero client.


---

## Changelog {/*changelog*/}

Altre novità rilevanti
- `react`: Renderizza le Transition in modo indipendente invece di intrecciarle in una singola renderizzazione, così una Transition lenta non blocca più quelle non correlate [#37290](https://github.com/react/react/pull/37290)
- `react-dom`: Invoca due volte gli Effetti in Strict Mode durante l'idratazione, allineandosi alle root renderizzate sul client [#35961](https://github.com/react/react/pull/35961)
- `react`: Aggiunge un warning quando `use` viene usato in modo errato in una condizionale [#37104](https://github.com/react/react/pull/37104)
- `react`: Rinomina "form state" in "action state" nei messaggi di errore di `useActionState` [#35790](https://github.com/react/react/pull/35790)
- `react-dom`: Aggiunge supporto per gli eventi `onFullscreenChange` e `onFullscreenError` [#34621](https://github.com/react/react/pull/34621)
- `react-dom`: Aggiunge supporto per la proprietà SVG `maskType` [#35921](https://github.com/react/react/pull/35921)
- `react-dom`: Supporta `fetchPriority` per le risorse module [#36835](https://github.com/react/react/pull/36835)
- `react-dom`: Attiva `onReset` quando React resetta automaticamente un form dopo una Server Action [#35176](https://github.com/react/react/pull/35176)
- `react-dom`: Include il `submitter` negli eventi `submit` [#35590](https://github.com/react/react/pull/35590)
- `react-dom`: Riconosce `credentialless` come attributo booleano sugli iframe [#36148](https://github.com/react/react/pull/36148)
- `react-dom`: Raggruppa gli aggiornamenti dagli eventi `resize` fino al frame successivo [#35117](https://github.com/react/react/pull/35117)
- `react-server`: Trasporta `Error.cause` [#35810](https://github.com/react/react/pull/35810) e `AggregateError.errors` [#36156](https://github.com/react/react/pull/36156) al client
- `react-server`: Aggiunge supporto per `<Activity>` in Flight [#34697](https://github.com/react/react/pull/34697)

Bug fix rilevanti

- `react`: Corregge `useDeferredValue` bloccato su un valore obsoleto [#36134](https://github.com/react/react/pull/36134)
- `react`: Corregge la propagazione del context nei fallback Suspense [#36160](https://github.com/react/react/pull/36160) e attraverso boundary Suspense sospesi [#35839](https://github.com/react/react/pull/35839)
- `react`: Corregge un blocco quando si aggiorna un boundary Suspense disidratato dentro un albero nascosto [#37135](https://github.com/react/react/pull/37135)
- `react`: Corregge `useSyncExternalStore` che perdeva mutazioni dello store avvenute mentre un albero `<Activity>` era nascosto [#36947](https://github.com/react/react/pull/36947)
- `react`: Corregge `useEffectEvent` per leggere gli ultimi valori nei componenti `forwardRef` e `memo` [#34831](https://github.com/react/react/pull/34831)
- `react`: Corregge il reset dello status del form quando lo state del componente viene aggiornato [#34075](https://github.com/react/react/pull/34075)
- `react`: Corregge diversi bug di Fast Refresh con `lazy`, `memo` e modifiche che cambiano il tipo di un componente [#36965](https://github.com/react/react/pull/36965), [#36964](https://github.com/react/react/pull/36964), [#36963](https://github.com/react/react/pull/36963), [#36950](https://github.com/react/react/pull/36950)
- `react`: Corregge un bug per cui `<title>` veniva ancora spostato in `<head>` dopo che l'`<Activity>` contenente `<title>` cambiava modalità da `visible` a `hidden` [#34983](https://github.com/react/react/pull/34983)
- `react`: Non lascia sfuggire errori da un `<Activity>` nascosto [#35074](https://github.com/react/react/pull/35074)
- `react`: Nasconde i contenuti del portal renderizzati dentro un `<Activity>` nascosto [#35091](https://github.com/react/react/pull/35091)
- `react`: Non fa riferimento al tipo interno `<Offscreen>` nei messaggi di errore [#35763](https://github.com/react/react/pull/35763)
- `react-dom`: Corregge il focus per elementi delegati e già focalizzati [#36010](https://github.com/react/react/pull/36010)
- `react-dom`: Corregge una perdita di listener di `FragmentInstance` normalizzando le opzioni capture secondo la spec DOM [#36047](https://github.com/react/react/pull/36047)
- `react-dom`: Corregge un crash di `<ViewTransition>` in Mobile Safari [#35337](https://github.com/react/react/pull/35337)
- `react-dom`: Corregge un crash di `<ViewTransition>` con `SuspenseList` [#35520](https://github.com/react/react/pull/35520)
- `react-dom`: Aggiorna `defaultValue` per input `type="number"` per allinearli ad altri tipi di input [#36980](https://github.com/react/react/pull/36980)
- `react-dom`: Evita di impostare `innerHTML` quando non è cambiato [#36949](https://github.com/react/react/pull/36949)
- `react-dom`: Corregge un falso positivo di mismatch di idratazione sugli attributi `nonce` [#37030](https://github.com/react/react/pull/37030)
- `react-dom`: Corregge il blocco di `react-dom/server` su Deno [#35235](https://github.com/react/react/pull/35235)
- `react-server`: Corregge voci `FormData` perse in `decodeReplyFromBusboy` [#36468](https://github.com/react/react/pull/36468)
- `react-server`: Corregge uno stack overflow con catene async profonde [#35612](https://github.com/react/react/pull/35612) e un `RangeError` da crescita esponenziale delle info di debug [#37481](https://github.com/react/react/pull/37481)

Per l'elenco completo delle modifiche, consulta il [Changelog](https://github.com/react/react/blob/main/CHANGELOG.md).

---

_Grazie a [Sam Selikoff](https://x.com/samselikoff) per aver scritto questo post, e a [Matt Carroll](https://mattcarrollcode.com/), [Dan Abramov](https://bsky.app/profile/danabra.mov) e [Andrew Clark](https://x.com/acdlite) per aver revisionato questo post._
