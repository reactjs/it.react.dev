---
title: useInsertionEffect
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/useInsertionEffect.md).

</Note>

<Pitfall>

`useInsertionEffect` è pensato per gli autori di librerie CSS-in-JS. A meno che tu non stia lavorando a una libreria CSS-in-JS e ti serva un punto dove iniettare gli stili, probabilmente vuoi [`useEffect`](/reference/react/useEffect) o [`useLayoutEffect`](/reference/react/useLayoutEffect).

</Pitfall>

<Intro>

`useInsertionEffect` permette di inserire elementi nel DOM prima che vengano eseguiti gli Effetti di layout.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Chiama `useInsertionEffect` per inserire gli stili prima che vengano eseguiti gli Effetti che potrebbero dover leggere il layout:

```js
import { useInsertionEffect } from 'react';

// Nella tua libreria CSS-in-JS
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... inietta i tag <style> qui ...
  });
  return rule;
}
```

[Vedi altri esempi sotto.](#usage)

#### Parameters {/*parameters*/}

* `setup`: La funzione con la logica del tuo Effetto. La funzione di setup può anche restituire opzionalmente una funzione di *cleanup*. Quando il tuo componente viene aggiunto al DOM, ma prima che vengano eseguiti gli Effetti di layout, React eseguirà la tua funzione di setup. Dopo ogni ri-renderizzazione con dipendenze cambiate, React eseguirà prima la funzione di cleanup (se l'hai fornita) con i valori precedenti, e poi eseguirà la funzione di setup con i nuovi valori. Quando il tuo componente viene rimosso dal DOM, React eseguirà la funzione di cleanup.

* **optional** `dependencies`: L'elenco di tutti i valori reattivi referenziati all'interno del codice di `setup`. I valori reattivi includono props, state e tutte le variabili e funzioni dichiarate direttamente nel corpo del componente. Se il tuo linter è [configurato per React](/learn/editor-setup#linting), verificherà che ogni valore reattivo sia specificato correttamente come dipendenza. L'elenco delle dipendenze deve avere un numero costante di elementi ed essere scritto inline come `[dep1, dep2, dep3]`. React confronterà ogni dipendenza con il suo valore precedente usando il confronto [`Object.is`](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Se non specifichi affatto le dipendenze, il tuo Effetto verrà rieseguito dopo ogni ri-renderizzazione del componente.

#### Returns {/*returns*/}

`useInsertionEffect` restituisce `undefined`.

#### Caveats {/*caveats*/}

* Gli Effetti vengono eseguiti solo sul client. Non vengono eseguiti durante la renderizzazione lato server.
* Non puoi aggiornare lo state dall'interno di `useInsertionEffect`.
* Quando `useInsertionEffect` viene eseguito, i ref non sono ancora collegati.
* `useInsertionEffect` può essere eseguito prima o dopo che il DOM sia stato aggiornato. Non dovresti fare affidamento sul fatto che il DOM sia aggiornato in un momento preciso.
* A differenza di altri tipi di Effetti, che eseguono il cleanup per ogni Effetto e poi il setup per ogni Effetto, `useInsertionEffect` eseguirà sia cleanup che setup un componente alla volta. Questo produce un intrecciamento tra le funzioni di cleanup e setup.
---

## Usage {/*usage*/}

### Iniettare stili dinamici da librerie CSS-in-JS {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

Tradizionalmente, stilieresti i componenti React usando CSS semplice.

```js
// Nel tuo file JS:
<button className="success" />

// Nel tuo file CSS:
.success { color: green; }
```

Alcuni team preferiscono scrivere gli stili direttamente nel codice JavaScript invece di scrivere file CSS. Di solito ciò richiede l'uso di una libreria o strumento CSS-in-JS. Esistono tre approcci comuni al CSS-in-JS:

1. Estrazione statica in file CSS con un compilatore
2. Stili inline, ad es. `<div style={{ opacity: 1 }}>`
3. Iniezione a runtime di tag `<style>`

Se usi CSS-in-JS, consigliamo una combinazione dei primi due approcci (file CSS per stili statici, stili inline per stili dinamici). **Non consigliamo l'iniezione a runtime di tag `<style>` per due motivi:**

1. L'iniezione a runtime costringe il browser a ricalcolare gli stili molto più spesso.
2. L'iniezione a runtime può essere molto lenta se avviene nel momento sbagliato del lifecycle di React.

Il primo problema non è risolvibile, ma `useInsertionEffect` ti aiuta a risolvere il secondo.

Chiama `useInsertionEffect` per inserire gli stili prima che vengano eseguiti gli Effetti di layout:

```js {4-11}
// Nella tua libreria CSS-in-JS
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // Come spiegato prima, non consigliamo l'iniezione a runtime di tag <style>.
    // Ma se devi farlo, è importante farlo in useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

In modo simile a `useEffect`, `useInsertionEffect` non viene eseguito sul server. Se devi raccogliere quali regole CSS sono state usate sul server, puoi farlo durante la renderizzazione:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Leggi di più sull'aggiornamento delle librerie CSS-in-JS con iniezione a runtime a `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### Perché è meglio rispetto a iniettare stili durante la renderizzazione o useLayoutEffect? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

Se inserisci stili durante la renderizzazione e React sta elaborando un [aggiornamento non bloccante,](/reference/react/useTransition#perform-non-blocking-updates-with-actions) il browser ricalcolerà gli stili ad ogni frame mentre renderizza un albero di componenti, il che può essere **estremamente lento.**

`useInsertionEffect` è migliore rispetto all'inserimento di stili durante [`useLayoutEffect`](/reference/react/useLayoutEffect) o [`useEffect`](/reference/react/useEffect) perché garantisce che quando gli altri Effetti vengono eseguiti nei tuoi componenti, i tag `<style>` siano già stati inseriti. Altrimenti, i calcoli di layout negli Effetti normali sarebbero errati a causa di stili obsoleti.

</DeepDive>
