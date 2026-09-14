---
title: startTransition
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/startTransition.md).

</Note>

<Intro>

`startTransition` ti permette di renderizzare una parte dell'UI in background.

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

La funzione `startTransition` ti permette di contrassegnare un aggiornamento di state come una Transizione.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `action`: Una funzione che aggiorna dello state chiamando una o più [`set` functions](/reference/react/useState#setstate). React chiama `action` immediatamente senza parametri e contrassegna come Transizioni tutti gli aggiornamenti di state pianificati in modo sincrono durante la chiamata alla funzione `action`. Qualsiasi chiamata async attesa con `await` in `action` sarà inclusa nella Transizione, ma attualmente richiede di avvolgere qualsiasi `set` function dopo `await` in un ulteriore `startTransition` (vedi [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Gli aggiornamenti di state contrassegnati come Transizioni saranno [non bloccanti](#marking-a-state-update-as-a-non-blocking-transition) e [non mostreranno indicatori di caricamento indesiderati.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### Returns {/*returns*/}

`startTransition` non restituisce nulla.

#### Caveats {/*caveats*/}

* `startTransition` non fornisce un modo per tracciare se una Transizione è in corso. Per mostrare un indicatore di pending mentre la Transizione è in corso, hai bisogno di [`useTransition`](/reference/react/useTransition) al suo posto.

* Puoi avvolgere un aggiornamento in una Transizione solo se hai accesso alla `set` function di quello state. Se vuoi avviare una Transizione in risposta a una prop o a un valore di un custom Hook, prova [`useDeferredValue`](/reference/react/useDeferredValue).

* La funzione che passi a `startTransition` viene chiamata immediatamente, contrassegnando come Transizioni tutti gli aggiornamenti di state che avvengono mentre viene eseguita. Se provi a eseguire aggiornamenti di state in un `setTimeout`, per esempio, non saranno contrassegnati come Transizioni.

* Devi avvolgere qualsiasi aggiornamento di state dopo richieste async in un altro `startTransition` per contrassegnarli come Transizioni. Questa è una limitazione nota che correggeremo in futuro (vedi [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Un aggiornamento di state contrassegnato come Transizione verrà interrotto da altri aggiornamenti di state. Per esempio, se aggiorni un componente grafico all'interno di una Transizione, ma poi inizi a digitare in un input mentre il grafico è nel mezzo di una ri-renderizzazione, React riavvierà il lavoro di renderizzazione sul componente grafico dopo aver gestito l'aggiornamento dell'input.

* Gli aggiornamenti Transizione non possono essere usati per controllare input di testo.

* Se ci sono più Transizioni in corso, React attualmente le raggruppa insieme. Questa è una limitazione che potrebbe essere rimossa in una release futura.

---

## Usage {/*usage*/}

### Contrassegnare un aggiornamento di state come Transizione non bloccante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Puoi contrassegnare un aggiornamento di state come una *Transizione* avvolgendolo in una chiamata a `startTransition`:

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Le Transizioni ti permettono di mantenere reattivi gli aggiornamenti dell'interfaccia utente anche su dispositivi lenti.

Con una Transizione, la tua UI resta reattiva nel mezzo di una ri-renderizzazione. Per esempio, se l'utente clicca una tab ma poi cambia idea e clicca un'altra tab, può farlo senza attendere che la prima ri-renderizzazione sia completata.

<Note>

`startTransition` è molto simile a [`useTransition`](/reference/react/useTransition), tranne per il fatto che non fornisce il flag `isPending` per tracciare se una Transizione è in corso. La funzione standalone non è inoltre associata a un componente, quindi se la funzione passata lancia un errore o restituisce una Promise rifiutata, React segnala l'errore con [`reportError`](https://developer.mozilla.org/it/docs/Web/API/Window/reportError). Puoi chiamare `startTransition` quando `useTransition` non è disponibile. Per esempio, `startTransition` funziona fuori dai componenti, ad esempio da una libreria dati.

[Scopri di più sulle Transizioni e vedi esempi nella pagina `useTransition`.](/reference/react/useTransition)

</Note>
