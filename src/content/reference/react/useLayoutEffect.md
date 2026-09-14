---
title: useLayoutEffect
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useLayoutEffect.md).

</Note>

<Pitfall>

`useLayoutEffect` può penalizzare le prestazioni. Preferisci [`useEffect`](/reference/react/useEffect) quando possibile.

</Pitfall>

<Intro>

`useLayoutEffect` è una versione di [`useEffect`](/reference/react/useEffect) che viene eseguita prima che il browser ridipinge lo schermo.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Chiama `useLayoutEffect` per eseguire le misurazioni di layout prima che il browser ridipinge lo schermo:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `setup`: La funzione con la logica del tuo Effetto. La funzione di setup può anche restituire opzionalmente una funzione di *cleanup*. Dopo che il tuo [componente esegue la fase di commit](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom) nel DOM e prima che il browser ridipinge lo schermo, React eseguirà la tua funzione di setup. Dopo ogni fase di commit con dipendenze cambiate, React eseguirà prima la funzione di cleanup (se l'hai fornita) con i valori precedenti, e poi eseguirà la funzione di setup con i nuovi valori. Prima che il tuo componente venga rimosso dal DOM, React eseguirà la funzione di cleanup.

* **optional** `dependencies`: L'elenco di tutti i valori reattivi referenziati all'interno del codice di `setup`. I valori reattivi includono props, state e tutte le variabili e funzioni dichiarate direttamente nel corpo del componente. Se il tuo linter è [configurato per React](/learn/editor-setup#linting), verificherà che ogni valore reattivo sia specificato correttamente come dipendenza. L'elenco delle dipendenze deve avere un numero costante di elementi ed essere scritto inline come `[dep1, dep2, dep3]`. React confronterà ogni dipendenza con il suo valore precedente usando il confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se ometti questo argomento, il tuo Effetto verrà rieseguito dopo ogni fase di commit del componente.

#### Returns {/*returns*/}

`useLayoutEffect` restituisce `undefined`.

#### Caveats {/*caveats*/}

* `useLayoutEffect` è un Hook, quindi puoi chiamarlo **solo al top level del tuo componente** o dei tuoi Hook. Non puoi chiamarlo all'interno di loop o condizioni. Se ne hai bisogno, estrai un componente e sposta l'Effetto lì.

* Quando Strict Mode è attivo, React **eseguirà un ciclo setup+cleanup extra solo in development** prima del primo setup reale. È un test di stress che verifica che la logica di cleanup "specchi" la logica di setup e che fermi o annulli ciò che fa il setup. Se questo causa un problema, [implementa la funzione di cleanup.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Se alcune delle tue dipendenze sono oggetti o funzioni definite all'interno del componente, c'è il rischio che **facciano rieseguire l'Effetto più spesso del necessario.** Per risolvere, rimuovi le dipendenze [oggetto](/reference/react/useEffect#removing-unnecessary-object-dependencies) e [funzione](/reference/react/useEffect#removing-unnecessary-function-dependencies) non necessarie. Puoi anche [estrarre gli aggiornamenti di state](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) e la [logica non reattiva](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) fuori dall'Effetto.

* Gli Effetti **vengono eseguiti solo sul client.** Non vengono eseguiti durante la renderizzazione lato server.

* Il codice all'interno di `useLayoutEffect` e tutti gli aggiornamenti di state programmati da esso **impediscono al browser di ridipingere lo schermo.** Se usato eccessivamente, rende l'app lenta. Quando possibile, preferisci [`useEffect`.](/reference/react/useEffect)

* Se attivi un aggiornamento di state all'interno di `useLayoutEffect`, React eseguirà immediatamente tutti gli Effetti rimanenti, incluso `useEffect`.

---

## Usage {/*usage*/}

### Misurare il layout prima che il browser ridipinge lo schermo {/*measuring-layout-before-the-browser-repaints-the-screen*/}

La maggior parte dei componenti non ha bisogno di conoscere la propria posizione e dimensione sullo schermo per decidere cosa renderizzare. Restituiscono solo del JSX. Poi il browser calcola il loro *layout* (posizione e dimensione) e ridipinge lo schermo.

A volte non basta. Immagina un tooltip che appare accanto a un elemento al passaggio del mouse. Se c'è abbastanza spazio, il tooltip dovrebbe apparire sopra l'elemento, ma se non entra, dovrebbe apparire sotto. Per renderizzare il tooltip nella posizione finale corretta, devi conoscere la sua altezza (cioè se entra in alto).

Per farlo, devi renderizzare in due passaggi:

1. Renderizza il tooltip ovunque (anche con una posizione sbagliata).
2. Misura la sua altezza e decidi dove posizionare il tooltip.
3. Renderizza il tooltip *di nuovo* nel posto giusto.

**Tutto questo deve avvenire prima che il browser ridipinge lo schermo.** Non vuoi che l'utente veda il tooltip spostarsi. Chiama `useLayoutEffect` per eseguire le misurazioni di layout prima che il browser ridipinge lo schermo:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Non conosci ancora l'altezza reale

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Ri-renderizza ora che conosci l'altezza reale
  }, []);

  // ...usa tooltipHeight nella logica di renderizzazione qui sotto...
}
```

Ecco come funziona passo per passo:

1. `Tooltip` renderizza con `tooltipHeight = 0` iniziale (quindi il tooltip potrebbe essere posizionato in modo errato).
2. React lo posiziona nel DOM ed esegue il codice in `useLayoutEffect`.
3. Il tuo `useLayoutEffect` [misura l'altezza](https://developer.mozilla.org/it/docs/Web/API/Element/getBoundingClientRect) del contenuto del tooltip e attiva una ri-renderizzazione immediata.
4. `Tooltip` renderizza di nuovo con la `tooltipHeight` reale (quindi il tooltip è posizionato correttamente).
5. React lo aggiorna nel DOM e il browser infine visualizza il tooltip.

Passa il mouse sui pulsanti qui sotto e osserva come il tooltip regola la sua posizione a seconda che entri o meno:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Questo tooltip non entra sopra il pulsante.
            <br />
            Ecco perché viene visualizzato sotto!
          </div>
        }
      >
        Passa il mouse su di me (tooltip sopra)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Questo tooltip entra sopra il pulsante</div>
        }
      >
        Passa il mouse su di me (tooltip sotto)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Questo tooltip entra sopra il pulsante</div>
        }
      >
        Passa il mouse su di me (tooltip sotto)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Altezza tooltip misurata: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Non entra sopra, quindi posizionalo sotto.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Nota che anche se il componente `Tooltip` deve renderizzare in due passaggi (prima con `tooltipHeight` inizializzato a `0` e poi con l'altezza misurata reale), vedi solo il risultato finale. Ecco perché in questo esempio ti serve `useLayoutEffect` invece di [`useEffect`](/reference/react/useEffect). Vediamo la differenza nel dettaglio qui sotto.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` impedisce al browser di ridipingere {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React garantisce che il codice all'interno di `useLayoutEffect` e tutti gli aggiornamenti di state programmati al suo interno verranno elaborati **prima che il browser ridipinge lo schermo.** Questo ti permette di renderizzare il tooltip, misurarlo e renderizzarlo di nuovo senza che l'utente noti la prima renderizzazione extra. In altre parole, `useLayoutEffect` impedisce al browser di dipingere.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Questo tooltip non entra sopra il pulsante.
            <br />
            Ecco perché viene visualizzato sotto!
          </div>
        }
      >
        Passa il mouse su di me (tooltip sopra)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Questo tooltip entra sopra il pulsante</div>
        }
      >
        Passa il mouse su di me (tooltip sotto)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Questo tooltip entra sopra il pulsante</div>
        }
      >
        Passa il mouse su di me (tooltip sotto)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Non entra sopra, quindi posizionalo sotto.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` non impedisce al browser di ridipingere {/*useeffect-does-not-block-the-browser*/}

Ecco lo stesso esempio, ma con [`useEffect`](/reference/react/useEffect) invece di `useLayoutEffect`. Se usi un dispositivo lento, potresti notare che a volte il tooltip "sfarfalla" e vedi brevemente la sua posizione iniziale prima di quella corretta.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Questo tooltip non entra sopra il pulsante.
            <br />
            Ecco perché viene visualizzato sotto!
          </div>
        }
      >
        Passa il mouse su di me (tooltip sopra)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Questo tooltip entra sopra il pulsante</div>
        }
      >
        Passa il mouse su di me (tooltip sotto)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Questo tooltip entra sopra il pulsante</div>
        }
      >
        Passa il mouse su di me (tooltip sotto)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Non entra sopra, quindi posizionalo sotto.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Per facilitare la riproduzione del bug, questa versione aggiunge un ritardo artificiale durante la renderizzazione. React permetterà al browser di dipingere lo schermo prima di elaborare l'aggiornamento di state all'interno di `useEffect`. Di conseguenza, il tooltip sfarfalla:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Questo tooltip non entra sopra il pulsante.
            <br />
            Ecco perché viene visualizzato sotto!
          </div>
        }
      >
        Passa il mouse su di me (tooltip sopra)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Questo tooltip entra sopra il pulsante</div>
        }
      >
        Passa il mouse su di me (tooltip sotto)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Questo tooltip entra sopra il pulsante</div>
        }
      >
        Passa il mouse su di me (tooltip sotto)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [10, 11]}} src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Questo rallenta artificialmente la renderizzazione
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Non fare nulla per un po'...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Non entra sopra, quindi posizionalo sotto.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Modifica questo esempio per usare `useLayoutEffect` e osserva che impedisce al browser di dipingere anche se la renderizzazione è rallentata.

<Solution />

</Recipes>

<Note>

Renderizzare in due passaggi e impedire al browser di ridipingere penalizza le prestazioni. Cerca di evitarlo quando puoi.

</Note>

---

## Troubleshooting {/*troubleshooting*/}

### Sto ricevendo un errore: "`useLayoutEffect` does nothing on the server" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

Lo scopo di `useLayoutEffect` è permettere al tuo componente di [usare le informazioni di layout per la renderizzazione:](#measuring-layout-before-the-browser-repaints-the-screen)

1. Renderizza il contenuto iniziale.
2. Misura il layout *prima che il browser ridipinge lo schermo.*
3. Renderizza il contenuto finale usando le informazioni di layout lette.

Quando tu o il tuo framework usate la [renderizzazione lato server](/reference/react-dom/server), la tua app React renderizza in HTML sul server per la renderizzazione iniziale. Questo ti permette di mostrare l'HTML iniziale prima che il codice JavaScript venga caricato.

Il problema è che sul server non ci sono informazioni di layout.

Nell'[esempio precedente](#measuring-layout-before-the-browser-repaints-the-screen), la chiamata a `useLayoutEffect` nel componente `Tooltip` gli permette di posizionarsi correttamente (sopra o sotto il contenuto) a seconda dell'altezza del contenuto. Se provassi a renderizzare `Tooltip` come parte dell'HTML iniziale del server, sarebbe impossibile determinarlo. Sul server non c'è ancora layout! Quindi, anche se lo renderizzassi sul server, la sua posizione "saltarebbe" sul client dopo che il JavaScript viene caricato ed eseguito.

Di solito, i componenti che dipendono dalle informazioni di layout non hanno bisogno di renderizzare sul server comunque. Ad esempio, probabilmente non ha senso mostrare un `Tooltip` durante la renderizzazione iniziale. Viene attivato da un'interazione sul client.

Tuttavia, se ti trovi di fronte a questo problema, hai diverse opzioni:

- Sostituisci `useLayoutEffect` con [`useEffect`.](/reference/react/useEffect) Questo dice a React che va bene visualizzare il risultato della renderizzazione iniziale senza impedire al browser di dipingere (perché l'HTML originale diventerà visibile prima che il tuo Effetto venga eseguito).

- In alternativa, chiama [`use(browser())`](/reference/react/use#use-browser) per contrassegnare il componente come solo-browser. React sostituirà il suo contenuto fino al [`<Suspense>`](/reference/react/Suspense) più vicino con un fallback di caricamento (ad esempio, uno spinner o un glimmer) durante la renderizzazione lato server.

- In alternativa, [contrassegna il tuo componente come solo-client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) Questo dice a React di sostituire il suo contenuto fino al `<Suspense>` più vicino con un fallback di caricamento durante la renderizzazione lato server.

- In alternativa, puoi renderizzare un componente con `useLayoutEffect` solo dopo l'hydration. Mantieni uno state booleano `isMounted` inizializzato a `false`, e impostalo a `true` all'interno di una chiamata a `useEffect`. La tua logica di renderizzazione può quindi essere del tipo `return isMounted ? <RealContent /> : <FallbackContent />`. Sul server e durante l'hydration, l'utente vedrà `FallbackContent` che non dovrebbe chiamare `useLayoutEffect`. Poi React lo sostituirà con `RealContent` che viene eseguito solo sul client e può includere chiamate a `useLayoutEffect`.

- Se sincronizzi il tuo componente con uno store di dati esterno e ti affidi a `useLayoutEffect` per motivi diversi dalla misurazione del layout, considera [`useSyncExternalStore`](/reference/react/useSyncExternalStore) che [supporta la renderizzazione lato server.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)
