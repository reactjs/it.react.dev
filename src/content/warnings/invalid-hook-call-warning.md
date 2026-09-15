---
title: Regole degli Hook
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/warnings/invalid-hook-call-warning.md).

</Note>

Probabilmente sei qui perché hai ricevuto il seguente messaggio di errore:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>

Ci sono tre motivi comuni per cui potresti vederlo:

1. Potresti **violare le Regole degli Hook**.
2. Potresti avere **versioni non corrispondenti** di React e React DOM.
3. Potresti avere **più di una copia di React** nella stessa app.

Vediamo ciascuno di questi casi.

## Violare le Regole degli Hook {/*breaking-rules-of-hooks*/}

Le funzioni il cui nome inizia con `use` sono chiamate [*Hook*](/reference/react) in React.

**Non chiamare gli Hook dentro loop, condizioni o funzioni annidate.** Usa invece sempre gli Hook al livello superiore della tua funzione React, prima di qualsiasi return anticipato. Puoi chiamare gli Hook solo mentre React sta renderizzando un componente funzione:

* ✅ Chiamali al livello superiore nel corpo di un [componente funzione](/learn/your-first-component).
* ✅ Chiamali al livello superiore nel corpo di un [custom hook](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Corretto: livello superiore in un componente funzione
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Corretto: livello superiore in un custom hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

**Non** è supportato chiamare gli Hook (funzioni che iniziano con `use`) in nessun altro caso, ad esempio:

* 🔴 Non chiamare gli Hook dentro condizioni o loop.
* 🔴 Non chiamare gli Hook dopo un'istruzione `return` condizionale.
* 🔴 Non chiamare gli Hook nei gestori di eventi.
* 🔴 Non chiamare gli Hook nei componenti classe.
* 🔴 Non chiamare gli Hook dentro funzioni passate a `useMemo`, `useReducer` o `useEffect`.

Se violi queste regole, potresti vedere questo errore.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Sbagliato: dentro una condizione (per correggere, spostalo fuori!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Sbagliato: dentro un loop (per correggere, spostalo fuori!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Sbagliato: dopo un return condizionale (per correggere, spostalo prima del return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Sbagliato: dentro un gestore di eventi (per correggere, spostalo fuori!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Sbagliato: dentro useMemo (per correggere, spostalo fuori!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Sbagliato: dentro componenti classe (per correggere, scrivi un componente funzione al posto di una classe!)
    useEffect(() => {})
    // ...
  }
}
```

Puoi usare il plugin [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) per individuare questi errori.

<Note>

I [custom hook](/learn/reusing-logic-with-custom-hooks) *possono* chiamare altri Hook (è proprio il loro scopo). Funziona perché anche i custom hook dovrebbero essere chiamati solo mentre un componente funzione viene renderizzato.

</Note>

## Versioni non corrispondenti di React e React DOM {/*mismatching-versions-of-react-and-react-dom*/}

Potresti usare una versione di `react-dom` (< 16.8.0) o `react-native` (< 0.59) che non supporta ancora gli Hook. Puoi eseguire `npm ls react-dom` o `npm ls react-native` nella cartella della tua applicazione per verificare quale versione stai usando. Se ne trovi più di una, questo potrebbe creare problemi (ne parliamo di più sotto).

## React duplicato {/*duplicate-react*/}

Affinché gli Hook funzionino, l'import di `react` dal codice della tua applicazione deve risolvere lo stesso modulo dell'import di `react` dall'interno del pacchetto `react-dom`.

Se questi import di `react` risolvono due oggetti export diversi, vedrai questo warning. Questo può succedere se **finisci accidentalmente con due copie** del pacchetto `react`.

Se usi Node per la gestione dei pacchetti, puoi eseguire questo controllo nella cartella del tuo progetto:

<TerminalBlock>

npm ls react

</TerminalBlock>

Se vedi più di un React, dovrai capire perché succede e correggere l'albero delle dipendenze. Ad esempio, forse una libreria che usi specifica `react` in modo errato come dipendenza (invece che come peer dependency). Finché quella libreria non viene corretta, le [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) sono una possibile soluzione temporanea.

Puoi anche provare a debuggare questo problema aggiungendo alcuni log e riavviando il server di sviluppo:

```js
// Aggiungi questo in node_modules/react-dom/index.js
window.React1 = require('react');

// Aggiungi questo nel file del tuo componente
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Se stampa `false`, potresti avere due React e devi capire perché è successo. [Questa issue](https://github.com/react/react/issues/13991) include alcuni motivi comuni riscontrati dalla community.

Questo problema può presentarsi anche quando usi `npm link` o un equivalente. In quel caso, il tuo bundler potrebbe "vedere" due React — uno nella cartella dell'applicazione e uno nella cartella della tua libreria. Supponendo che `myapp` e `mylib` siano cartelle sorelle, una possibile correzione è eseguire `npm link ../myapp/node_modules/react` da `mylib`. In questo modo la libreria userà la copia di React dell'applicazione.

<Note>

In generale, React supporta l'uso di più copie indipendenti nella stessa pagina (ad esempio, se un'app e un widget di terze parti lo usano entrambi). Si rompe solo se `require('react')` risolve in modo diverso tra il componente e la copia di `react-dom` con cui è stato renderizzato.

</Note>

## Altre cause {/*other-causes*/}

Se niente di tutto ciò ha funzionato, commenta in [questa issue](https://github.com/react/react/issues/13991) e cercheremo di aiutarti. Prova a creare un piccolo esempio riproducibile — potresti scoprire il problema mentre lo fai.
