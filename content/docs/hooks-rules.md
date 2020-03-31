---
id: hooks-rules
title: Regole degli Hooks
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

Gli *Hooks* sono stati aggiunti in React 16.8. Ti permettono di utilizzare `state` ed altre funzioni di React senza dover scrivere una classe.

Gli Hooks sono funzioni JavaScript, ma devi seguire due regole quando li utilizzi. Forniamo un [plugin linter](https://www.npmjs.com/package/eslint-plugin-react-hooks) per imporre queste regole automaticamente.

### Chiama gli Hooks solo al livello più alto {#only-call-hooks-at-the-top-level}

**Non chiamare gli Hooks all'interno di cicli, condizioni, o funzioni annidate.** Invece, utilizza sempre gli Hooks al livello più alto della tua funzione React. Seguendo questa regola, ti assicuri che gli Hooks siano chiamati nello stesso ordine ogni volta che un componente viene renderizzato. Questo è ciò che permette a React di mantenere correttamente lo stato degli Hooks tra più chiamate `useState` e `useEffect`. (Se sei curioso, lo spiegheremo in profondità [qui](#explanation).)

### Chiama gli Hooks solo da Funzioni React {#only-call-hooks-from-react-functions}

**Non chiamare gli Hooks da funzioni JavaScript normali.** Invece, puoi:

* ✅ Chiamare gli Hooks da componenti funzione React.
* ✅ Chiamare gli Hooks dagli Hooks personalizzati (che vedremo [nella pagina successiva](/docs/hooks-custom.html)).

Seguendo questa regola, ti assicuri che tutta la logica con stato in un componente sia chiaramente visibile dal suo codice sorgente.

## Plugin ESLint {#eslint-plugin}

Abbiamo rilasciato un plugin ESLint chiamato [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) che impone queste due regole. Puoi aggiungere questo plugin al tuo progetto, qualora volessi provarlo:

Questo plugin è incluso di default in [Create React App](/docs/create-a-new-react-app.html#create-react-app).

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```js
// La tua configurazione ESLint
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // Controlla le regole degli Hooks
    "react-hooks/exhaustive-deps": "warn" // Controlla le dipendenze dell'effect
  }
}
```

**Puoi passare alla pagina successiva che spiega come scrivere [i tuoi Hooks](/docs/hooks-custom.html) adesso.** In questa pagina, continueremo spiegando il ragionamento alla base di queste regole.

## Spiegazione {#explanation}

Come abbiamo [appreso prima](/docs/hooks-state.html#tip-using-multiple-state-variables), possiamo utilizzare più Hook State o Hook Effect all'interno di un singolo componente:

```js
function Form() {
  // 1. Usa la variabile di stato nome
  const [nome, setNome] = useState('Mary');

  // 2. Usa un effect per la persistenza del form
  useEffect(function persistForm() {
    localStorage.setItem('formData', nome);
  });

  // 3. Usa la variabile di stato cognome
  const [cognome, setCognome] = useState('Poppins');

  // 4. Usa un effect per aggiornare il title
  useEffect(function updateTitle() {
    document.title = nome + ' ' + cognome;
  });

  // ...
}
```

Quindi come fa React a sapere quale stato corrisponde a ogni chiamata a `useState`? La risposta è che **React si basa sull'ordine in cui vengono chiamati gli Hooks**. Il nostro esempio funziona perché l'ordine delle chiamate agli Hooks è lo stesso in ogni render:

```js
// ------------
// Primo render
// ------------
useState('Mary')           // 1. Inizializza la variabile di stato nome con 'Mary'
useEffect(persistForm)     // 2. Aggiungi un effetto per persistere il form
useState('Poppins')        // 3. Inizializza la variabile di stato cognome con 'Poppins'
useEffect(updateTitle)     // 4. Aggiunge un effetto per aggiornare il title

// -------------
// Secondo render
// -------------
useState('Mary')           // 1. Leggi la variabile di stato nome (l'argomento è ignorato)
useEffect(persistForm)     // 2. Sostituisce l'effect per persistere il form
useState('Poppins')        // 3. Leggi la variabile di stato cognome (l'argomento è ignorato)
useEffect(updateTitle)     // 4. Sostituisce l'effect per aggiornare il title

// ...
```

Finché l'ordine delle chiamate agli Hooks è lo stesso tra un render e l'altro, React è in grado di associare uno stato locale a ciascuno di essi. Ma cosa succede se inseriamo una chiamata ad un Hook (ad esempio, all'effect `persistForm`) dentro una condizione?

```js
  // 🔴 Stiamo infrangendo la prima regola utilizzando un Hook in una condizione
  if (nome !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', nome);
    });
  }
```

La condizione `nome !== ''` è `true` nel primo render, quindi eseguiamo questo Hook. Tuttavia, al render successivo l'utente potrebbe cancellare il form, rendendo la condizione `false`. Ora che saltiamo questo Hook durante il render, l'ordine delle chiamate agli Hook risulta diverso:

```js
useState('Mary')           // 1. Leggi la variabile di stato nome (l'argomento è ignorato)
// useEffect(persistForm)  // 🔴 Questo Hook è stato saltato!
useState('Poppins')        // 🔴 2 (ma era 3). Impossibile leggere la variabile di stato cognome
useEffect(updateTitle)     // 🔴 3 (ma era 4). Impossibile sostituire l'effect per aggiornare il title
```

React non saprebbe cosa restituire per la seconda chiamata all'Hook `useState`. React si aspettava che la seconda chiamata all'Hook in questo componente corrispondesse all'effect `persistForm`, esattamente come nel render precedente, ma non è più così. Da quel punto in poi, anche ogni successiva chiamata ad un Hook dopo quella che è stata saltata risulterebbe traslata di uno, introducendo dei bug.

**Ecco perché gli Hooks devono essere chiamati dal livello più alto dei nostri componenti.** Se vogliamo eseguire un effect in maniera condizionata, possiamo mettere la condizione *dentro* il nostro Hook:

```js
  useEffect(function persistForm() {
    // 👍 Non stiamo più infrangendo la prima regola
    if (nome !== '') {
      localStorage.setItem('formData', nome);
    }
  });
```

**Nota che non devi preoccuparti di questo problema se utilizzi la [regola del linter](https://www.npmjs.com/package/eslint-plugin-react-hooks) descritta in predecenza.** Ma ora sai anche *perché* gli Hooks funzionano così, e quali problemi questa regola previene.

## Prossimi passi {#next-steps}

Finalmente, siamo pronti per imparare a [scrivere i tuoi Hooks](/docs/hooks-custom.html)! Gli Hooks personalizzati ti permettono di utilizzare gli Hooks forniti da React all'interno delle tue astrazioni, e riutilizzare la logica di stato comune tra componenti diversi.
