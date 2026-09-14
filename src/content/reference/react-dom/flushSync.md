---
title: flushSync
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/flushSync.md).

</Note>

<Pitfall>

Usare `flushSync` è poco comune e può compromettere le prestazioni della tua app.

</Pitfall>

<Intro>

`flushSync` ti permette di forzare React a svuotare in modo sincrono tutti gli aggiornamenti all'interno della callback fornita. In questo modo il DOM viene aggiornato immediatamente.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Chiama `flushSync` per forzare React a svuotare qualsiasi lavoro in sospeso e ad aggiornare il DOM in modo sincrono.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

Nella maggior parte dei casi, `flushSync` può essere evitato. Usa `flushSync` come ultima risorsa.

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}


* `callback`: Una funzione. React chiamerà immediatamente questa callback e svuoterà in modo sincrono tutti gli aggiornamenti che contiene. Può anche svuotare aggiornamenti in sospeso, o Effetti, o aggiornamenti all'interno di Effetti. Se un aggiornamento va in sospensione a causa di questa chiamata a `flushSync`, i fallback potrebbero essere mostrati di nuovo.

#### Returns {/*returns*/}

`flushSync` restituisce `undefined`.

#### Caveats {/*caveats*/}

* `flushSync` può compromettere significativamente le prestazioni. Usalo con parsimonia.
* `flushSync` può forzare i confini Suspense in sospeso a mostrare il `fallback`.
* `flushSync` può eseguire Effetti in sospeso e applicare in modo sincrono tutti gli aggiornamenti che contengono prima di restituire il controllo.
* `flushSync` può svuotare aggiornamenti al di fuori della callback quando necessario per svuotare gli aggiornamenti all'interno della callback. Ad esempio, se ci sono aggiornamenti in sospeso da un click, React potrebbe svuotarli prima di svuotare gli aggiornamenti all'interno della callback.

---

## Usage {/*usage*/}

### Svuotare gli aggiornamenti per integrazioni con terze parti {/*flushing-updates-for-third-party-integrations*/}

Quando integri codice di terze parti come API del browser o librerie UI, potrebbe essere necessario forzare React a svuotare gli aggiornamenti. Usa `flushSync` per forzare React a svuotare in modo sincrono tutti gli <CodeStep step={1}>aggiornamenti di state</CodeStep> all'interno della callback:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// A questo punto, il DOM è aggiornato.
```

In questo modo, quando viene eseguita la riga di codice successiva, React ha già aggiornato il DOM.

**Usare `flushSync` è poco comune, e usarlo spesso può compromettere significativamente le prestazioni della tua app.** Se la tua app usa solo API React e non si integra con librerie di terze parti, `flushSync` dovrebbe essere superfluo.

Tuttavia, può essere utile per integrarsi con codice di terze parti come le API del browser.

Alcune API del browser si aspettano che i risultati all'interno delle callback vengano scritti nel DOM in modo sincrono, entro la fine della callback, così che il browser possa fare qualcosa con il DOM renderizzato. Nella maggior parte dei casi, React gestisce questo automaticamente. Ma in alcuni casi potrebbe essere necessario forzare un aggiornamento sincrono.

Ad esempio, l'API `onbeforeprint` del browser ti permette di modificare la pagina immediatamente prima che si apra la finestra di dialogo di stampa. È utile per applicare stili di stampa personalizzati che permettono al documento di essere visualizzato meglio in stampa. Nell'esempio qui sotto, usi `flushSync` all'interno della callback `onbeforeprint` per "svuotare" immediatamente lo state React nel DOM. Così, quando si apre la finestra di dialogo di stampa, `isPrinting` mostra "yes":

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Stampa
      </button>
    </>
  );
}
```

</Sandpack>

Senza `flushSync`, la finestra di dialogo di stampa mostrerà `isPrinting` come "no". Questo perché React raggruppa gli aggiornamenti in modo asincrono e la finestra di dialogo di stampa viene visualizzata prima che lo state venga aggiornato.

<Pitfall>

`flushSync` può compromettere significativamente le prestazioni e può forzare in modo imprevisto i confini Suspense in sospeso a mostrare il `fallback`.

Nella maggior parte dei casi, `flushSync` può essere evitato, quindi usalo come ultima risorsa.

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### Ricevo un errore: "flushSync was called from inside a lifecycle method" {/*im-getting-an-error-flushsync-was-called-from-inside-a-lifecycle-method*/}


React non può eseguire `flushSync` nel mezzo di una renderizzazione. Se lo fai, non avrà effetto e mostrerà un avviso:

<ConsoleBlock level="error">

Warning: flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.

</ConsoleBlock>

Questo include la chiamata a `flushSync` all'interno di:

- la renderizzazione di un componente.
- gli hooks `useLayoutEffect` o `useEffect`.
- i metodi lifecycle dei componenti classe.

Ad esempio, chiamare `flushSync` in un Effetto non avrà effetto e mostrerà un avviso:

```js
import { useEffect } from 'react';
import { flushSync } from 'react-dom';

function MyComponent() {
  useEffect(() => {
    // 🚩 Sbagliato: chiamare flushSync all'interno di un Effetto
    flushSync(() => {
      setSomething(newValue);
    });
  }, []);

  return <div>{/* ... */}</div>;
}
```

Per risolvere, di solito vuoi spostare la chiamata a `flushSync` in un evento:

```js
function handleClick() {
  // ✅ Corretto: flushSync nei gestori di eventi è sicuro
  flushSync(() => {
    setSomething(newValue);
  });
}
```


Se è difficile spostarlo in un evento, puoi rimandare `flushSync` in una microtask:

```js {3,7}
useEffect(() => {
  // ✅ Corretto: rimandare flushSync a una microtask
  queueMicrotask(() => {
    flushSync(() => {
      setSomething(newValue);
    });
  });
}, []);
```

Questo permetterà alla renderizzazione corrente di completarsi e programmerà un'altra renderizzazione sincrona per svuotare gli aggiornamenti.

<Pitfall>

`flushSync` può compromettere significativamente le prestazioni, ma questo particolare pattern è ancora peggio per le prestazioni. Esaurisci tutte le altre opzioni prima di chiamare `flushSync` in una microtask come escape hatch.

</Pitfall>
