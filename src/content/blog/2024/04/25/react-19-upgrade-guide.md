---
title: "Guida all'upgrade a React 19"
author: Ricky Hanlon
date: 2024/04/25
description: I miglioramenti aggiunti in React 19 richiedono alcune breaking change, ma abbiamo lavorato per rendere l'upgrade il più fluido possibile e non ci aspettiamo che le modifiche impattino la maggior parte delle app. In questo post ti guidiamo nei passaggi per aggiornare app e librerie a React 19.
translationStatus: ai-draft
---

25 aprile 2024 di [Ricky Hanlon](https://twitter.com/rickhanlonii)

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md).

</Note>



<Intro>

I miglioramenti aggiunti in React 19 richiedono alcune breaking change, ma abbiamo lavorato per rendere l'upgrade il più fluido possibile e non ci aspettiamo che le modifiche impattino la maggior parte delle app.

</Intro>

<Note>

#### Anche React 18.3 è stato pubblicato {/*react-18-3*/}

Per facilitare l'upgrade a React 19, abbiamo pubblicato un rilascio `react@18.3` identico a 18.2 ma con warning per API deprecate e altre modifiche necessarie per React 19.

Consigliamo di aggiornare prima a React 18.3 per individuare eventuali problemi prima di passare a React 19.

Per l'elenco delle modifiche in 18.3 consulta le [Release Notes](https://github.com/react/react/blob/main/CHANGELOG.md#1830-april-25-2024).

</Note>

In questo post ti guidiamo nei passaggi per l'upgrade a React 19:

- [Installazione](#installing)
- [Codemod](#codemods)
- [Breaking change](#breaking-changes)
- [Nuove deprecazioni](#new-deprecations)
- [Modifiche rilevanti](#notable-changes)
- [Modifiche TypeScript](#typescript-changes)
- [Changelog](#changelog)

Se vuoi aiutarci a testare React 19, segui i passaggi in questa guida all'upgrade e [segnala eventuali problemi](https://github.com/react/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D) che incontri. Per l'elenco delle nuove funzionalità aggiunte in React 19, consulta il [post di rilascio di React 19](/blog/2024/12/05/react-19).

---
## Installazione {/*installing*/}

<Note>

#### La nuova JSX Transform è ora obbligatoria {/*new-jsx-transform-is-now-required*/}

Abbiamo introdotto una [nuova JSX transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) nel 2020 per migliorare la dimensione del bundle e usare JSX senza importare React. In React 19 aggiungiamo ulteriori miglioramenti come l'uso di ref come prop e miglioramenti di velocità JSX che richiedono la nuova transform.

Se la nuova transform non è abilitata, vedrai questo warning:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>


Ci aspettiamo che la maggior parte delle app non sia interessata poiché la transform è già abilitata nella maggior parte degli ambienti. Per istruzioni manuali su come aggiornare, consulta il [post di annuncio](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

</Note>


Per installare l'ultima versione di React e React DOM:

```bash
npm install --save-exact react@^19.0.0 react-dom@^19.0.0
```

Oppure, se usi Yarn:

```bash
yarn add --exact react@^19.0.0 react-dom@^19.0.0
```

Se usi TypeScript, devi anche aggiornare i tipi.
```bash
npm install --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

Oppure, se usi Yarn:
```bash
yarn add --exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

Includiamo anche un codemod per le sostituzioni più comuni. Vedi [Modifiche TypeScript](#typescript-changes) sotto.

## Codemod {/*codemods*/}

Per aiutare con l'upgrade, abbiamo collaborato con il team di [codemod.com](https://codemod.com) per pubblicare codemod che aggiorneranno automaticamente il tuo codice a molte delle nuove API e pattern in React 19.

Tutti i codemod sono disponibili nel [`react-codemod` repo](https://github.com/reactjs/react-codemod) e il team Codemod ha contribuito a mantenere i codemod. Per eseguire questi codemod, consigliamo di usare il comando `codemod` invece di `react-codemod` perché è più veloce, gestisce migrazioni di codice più complesse e offre un supporto TypeScript migliore.


<Note>

#### Esegui tutti i codemod React 19 {/*run-all-react-19-codemods*/}

Esegui tutti i codemod elencati in questa guida con la recipe `codemod` React 19:

```bash
npx codemod@latest react/19/migration-recipe
```

Questo eseguirà i seguenti codemod da `react-codemod`:
- [`replace-reactdom-render`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-reactdom-render)
- [`replace-string-ref`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-string-ref)
- [`replace-act-import`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-act-import)
- [`replace-use-form-state`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-use-form-state)
- [`prop-types-typescript`](https://github.com/reactjs/react-codemod#react-proptypes-to-prop-types)

Questo non include le modifiche TypeScript. Vedi [Modifiche TypeScript](#typescript-changes) sotto.

</Note>

Le modifiche che includono un codemod includono il comando sotto.

Per l'elenco di tutti i codemod disponibili, consulta il [`react-codemod` repo](https://github.com/reactjs/react-codemod).

## Breaking change {/*breaking-changes*/}

### Gli errori in render non vengono rilanciati {/*errors-in-render-are-not-re-thrown*/}

Nelle versioni precedenti di React, gli errori lanciati durante il render venivano catturati e rilanciati. In DEV, registravamo anche in `console.error`, con log di errore duplicati.

In React 19, abbiamo [migliorato la gestione degli errori](/blog/2024/12/05/react-19#error-handling) per ridurre la duplicazione senza rilanciare:

- **Errori non catturati**: gli errori non catturati da un Error Boundary vengono segnalati a `window.reportError`.
- **Errori catturati**: gli errori catturati da un Error Boundary vengono segnalati a `console.error`.

Questa modifica non dovrebbe impattare la maggior parte delle app, ma se la segnalazione errori in produzione si basa sul rilancio degli errori, potresti dover aggiornare la gestione errori. Per supportarlo, abbiamo aggiunto nuovi metodi a `createRoot` e `hydrateRoot` per la gestione errori personalizzata:

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... log error report
  },
  onCaughtError: (error, errorInfo) => {
    // ... log error report
  }
});
```

Per maggiori informazioni, consulta la documentazione di [`createRoot`](/reference/react-dom/client/createRoot) e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).


### Rimosse API React deprecate {/*removed-deprecated-react-apis*/}

#### Rimosso: `propTypes` e `defaultProps` per le funzioni {/*removed-proptypes-and-defaultprops*/}
`PropTypes` sono stati deprecati in [April 2017 (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings).

In React 19 rimuoviamo i controlli `propType` dal pacchetto React e usarli verrà ignorato silenziosamente. Se usi `propTypes`, consigliamo di migrare a TypeScript o un'altra soluzione di type checking.

Rimuoviamo anche `defaultProps` dai componenti funzione in favore dei parametri default ES6. I componenti classe continueranno a supportare `defaultProps` poiché non esiste alternativa ES6.

```js
// Before
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};
```
```ts
// After
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
```

<Note>

Codemod `propTypes` verso TypeScript con:

```bash
npx codemod@latest react/prop-types-typescript
```

</Note>

#### Rimosso: Legacy Context con `contextTypes` e `getChildContext` {/*removed-removing-legacy-context*/}

Legacy Context è stato deprecato in [October 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html).

Legacy Context era disponibile solo nei componenti classe usando le API `contextTypes` e `getChildContext`, ed è stato sostituito con `contextType` per bug sottili facili da non notare. In React 19 rimuoviamo Legacy Context per rendere React leggermente più piccolo e veloce.

Se usi ancora Legacy Context nei componenti classe, dovrai migrare alla nuova API `contextType`:

```js {5-11,19-21}
// Before
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js {2,7,9,15}
// After
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

#### Rimosso: string refs {/*removed-string-refs*/}
Le string refs sono state deprecate in [March, 2018 (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html).

I componenti classe supportavano string refs prima di essere sostituite da ref callback per [vari svantaggi](https://github.com/react/react/issues/1373). In React 19 rimuoviamo le string refs per rendere React più semplice e comprensibile.

Se usi ancora string refs nei componenti classe, dovrai migrare alle ref callback:

```js {4,8}
// Before
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js {4,8}
// After
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

Codemod delle string refs con ref callback:

```bash
npx codemod@latest react/19/replace-string-ref
```

</Note>

#### Rimosso: module pattern factories {/*removed-module-pattern-factories*/}
Le module pattern factories sono state deprecate in [August 2019 (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories).

Questo pattern era raramente usato e supportarlo rende React leggermente più grande e lento del necessario. In React 19 rimuoviamo il supporto per module pattern factories e dovrai migrare a funzioni regolari:

```js
// Before
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// After
function FactoryComponent() {
  return <div />;
}
```

#### Rimosso: `React.createFactory` {/*removed-createfactory*/}
`createFactory` è stato deprecato in [February 2020 (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory).

Usare `createFactory` era comune prima del supporto diffuso di JSX, ma oggi è raramente usato e può essere sostituito con JSX. In React 19 rimuoviamo `createFactory` e dovrai migrare a JSX:

```js
// Before
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// After
const button = <button />;
```

#### Rimosso: `react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

In React 18 abbiamo aggiornato `react-test-renderer/shallow` per re-esportare [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer). In React 19 rimuoviamo `react-test-render/shallow` preferendo installare il pacchetto direttamente:

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### Riconsidera lo shallow rendering {/*please-reconsider-shallow-rendering*/}

Lo shallow rendering dipende dagli internals di React e può bloccare futuri upgrade. Consigliamo di migrare i test a [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) o [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro).

</Note>

### Rimosse API React DOM deprecate {/*removed-deprecated-react-dom-apis*/}

#### Rimosso: `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

Abbiamo spostato `act` da `react-dom/test-utils` al pacchetto `react`:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.

</ConsoleLogLine>

</ConsoleBlockMulti>

Per correggere questo warning, puoi importare `act` da `react`:

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

Tutte le altre funzioni `test-utils` sono state rimosse. Queste utility erano poco comuni e rendevano troppo facile dipendere da dettagli di implementazione a basso livello dei componenti e di React. In React 19, queste funzioni daranno errore quando chiamate e le loro export verranno rimosse in una versione futura.

Consulta la [pagina dei warning](https://react.dev/warnings/react-dom-test-utils) per le alternative.

<Note>

Codemod `ReactDOMTestUtils.act` verso `React.act`:

```bash
npx codemod@latest react/19/replace-act-import
```

</Note>

#### Rimosso: `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render` è stato deprecato in [March 2022 (v18.0.0)](/blog/2022/03/08/react-18-upgrade-guide). In React 19 rimuoviamo `ReactDOM.render` e dovrai migrare a [`ReactDOM.createRoot`](/reference/react-dom/client/createRoot):

```js
// Before
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// After
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

<Note>

Codemod `ReactDOM.render` verso `ReactDOMClient.createRoot`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Rimosso: `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate` è stato deprecato in [March 2022 (v18.0.0)](/blog/2022/03/08/react-18-upgrade-guide). In React 19 rimuoviamo `ReactDOM.hydrate` e dovrai migrare a [`ReactDOM.hydrateRoot`](/reference/react-dom/client/hydrateRoot),

```js
// Before
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// After
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

<Note>

Codemod `ReactDOM.hydrate` verso `ReactDOMClient.hydrateRoot`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Rimosso: `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode` è stato deprecato in [March 2022 (v18.0.0)](/blog/2022/03/08/react-18-upgrade-guide). In React 19 dovrai migrare a `root.unmount()`.


```js
// Before
unmountComponentAtNode(document.getElementById('root'));

// After
root.unmount();
```

Per maggiori informazioni su `root.unmount()` consulta [`createRoot`](/reference/react-dom/client/createRoot#root-unmount) e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#root-unmount).

<Note>

Codemod `unmountComponentAtNode` verso `root.unmount`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Rimosso: `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}

`ReactDOM.findDOMNode` è stato [deprecato nell'ottobre 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode).

Rimuoviamo `findDOMNode` perché era un legacy escape hatch lento da eseguire, fragile al refactoring, restituiva solo il primo figlio e rompeva i livelli di astrazione (maggiori info [qui](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)). Puoi sostituire `ReactDOM.findDOMNode` con [DOM ref](/learn/manipulating-the-dom-with-refs):

```js
// Before
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Hello" />;
}
```

```js
// After
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="Hello" />
}
```

## Nuove deprecazioni {/*new-deprecations*/}

### Deprecato: `element.ref` {/*deprecated-element-ref*/}

React 19 supporta [`ref` as a prop](/blog/2024/12/05/react-19#ref-as-a-prop), quindi depreciamo `element.ref` in favore di `element.props.ref`.

Accedere a `element.ref` genererà un warning:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Accessing element.ref is no longer supported. ref is now a regular prop. It will be removed from the JSX Element type in a future release.

</ConsoleLogLine>

</ConsoleBlockMulti>

### Deprecato: `react-test-renderer` {/*deprecated-react-test-renderer*/}

Deprechiamo `react-test-renderer` perché implementa un proprio ambiente renderer che non corrisponde a quello usato dagli utenti, promuove il test dei dettagli di implementazione e si basa sull'introspezione degli internals di React.

Il test renderer è stato creato prima che fossero disponibili strategie di test più valide come [React Testing Library](https://testing-library.com), e ora consigliamo di usare una libreria di test moderna.

In React 19, `react-test-renderer` registra un warning di deprecazione ed è passato al concurrent rendering. Consigliamo di migrare i test a [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) o [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro) per un'esperienza di test moderna e ben supportata.

## Modifiche rilevanti {/*notable-changes*/}

### Modifiche a StrictMode {/*strict-mode-improvements*/}

React 19 include diversi fix e miglioramenti a Strict Mode.

Quando si fa double rendering in Strict Mode in development, `useMemo` e `useCallback` riutilizzeranno i risultati memoizzati del primo render durante il secondo render. I componenti già compatibili con Strict Mode non dovrebbero notare differenze nel comportamento.

Come per tutti i comportamenti di Strict Mode, queste funzionalità sono progettate per far emergere proattivamente bug nei componenti durante lo development, così puoi correggerli prima del deploy in produzione. Ad esempio, durante lo development, Strict Mode invocherà due volte le ref callback al mount iniziale, per simulare cosa succede quando un componente montato viene sostituito da un fallback Suspense.

### Miglioramenti a Suspense {/*improvements-to-suspense*/}

In React 19, quando un componente sospende, React committa immediatamente il fallback del boundary Suspense più vicino senza aspettare che l'intero albero sibling venga renderizzato. Dopo il commit del fallback, React pianifica un altro render per i sibling sospesi per "pre-riscaldare" le richieste lazy nel resto dell'albero:

<Diagram name="prerender" height={162} width={1270} alt="Diagramma che mostra un albero di tre componenti, un genitore etichettato Accordion e due figli etichettati Panel. Entrambi i componenti Panel contengono isActive con valore false.">

In precedenza, quando un componente sospendeva, i sibling sospesi venivano renderizzati e poi il fallback veniva committato.

</Diagram>

<Diagram name="prewarm" height={162} width={1270} alt="Lo stesso diagramma del precedente, con isActive del primo componente figlio Panel evidenziato indicando un click con isActive impostato a true. Il secondo componente Panel contiene ancora valore false." >

In React 19, quando un componente sospende, il fallback viene committato e poi i sibling sospesi vengono renderizzati.

</Diagram>

Questa modifica significa che i fallback Suspense vengono visualizzati più velocemente, continuando a pre-riscaldare le richieste lazy nell'albero sospeso.

### Rimosse build UMD {/*umd-builds-removed*/}

UMD era ampiamente usato in passato come modo conveniente per caricare React senza un passo di build. Ora esistono alternative moderne per caricare moduli come script nei documenti HTML. A partire da React 19, React non produrrà più build UMD per ridurre la complessità del processo di test e rilascio.

Per caricare React 19 con un tag script, consigliamo di usare una CDN basata su ESM come [esm.sh](https://esm.sh/).

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### Le librerie che dipendono dagli internals di React possono bloccare gli upgrade {/*libraries-depending-on-react-internals-may-block-upgrades*/}

Questo rilascio include modifiche agli internals di React che possono impattare librerie che ignorano le nostre richieste di non usare internals come `SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`. Queste modifiche sono necessarie per far atterrare i miglioramenti in React 19 e non romperanno librerie che seguono le nostre linee guida.

In base alla nostra [Versioning Policy](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change), questi aggiornamenti non sono elencati come breaking change e non includiamo documentazione su come aggiornarli. La raccomandazione è rimuovere qualsiasi codice che dipende dagli internals.

Per riflettere l'impatto dell'uso degli internals, abbiamo rinominato il suffisso `SECRET_INTERNALS` in:

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

In futuro bloccheremo più aggressivamente l'accesso agli internals da React per scoraggiarne l'uso e assicurare che gli utenti non siano bloccati dall'upgrade.

## Modifiche TypeScript {/*typescript-changes*/}

### Rimossi tipi TypeScript deprecati {/*removed-deprecated-typescript-types*/}

Abbiamo ripulito i tipi TypeScript in base alle API rimosse in React 19. Alcuni tipi rimossi sono stati spostati in pacchetti più pertinenti e altri non servono più per descrivere il comportamento di React.

<Note>
Abbiamo pubblicato [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) per migrare la maggior parte delle breaking change relative ai tipi:

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

Se hai molti accessi unsound a `element.props`, puoi eseguire questo codemod aggiuntivo:

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

Consulta [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) per l'elenco delle sostituzioni supportate. Se ritieni che manchi un codemod, può essere tracciato nell'[elenco dei codemod React 19 mancanti](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement).


### Richieste ref cleanup {/*ref-cleanup-required*/}

_Questa modifica è inclusa nel preset codemod `react-19` come [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)._

A causa dell'introduzione delle ref cleanup function, restituire qualsiasi altra cosa da una ref callback verrà ora rifiutato da TypeScript. La correzione di solito consiste nel smettere di usare return impliciti:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

Il codice originale restituiva l'istanza dell'`HTMLDivElement` e TypeScript non sapeva se doveva essere una cleanup function o no.

### `useRef` richiede un argomento {/*useref-requires-argument*/}

_Questa modifica è inclusa nel preset codemod `react-19` come [`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults)._

Una lamentela di lunga data su come TypeScript e React lavorano insieme riguardava `useRef`. Abbiamo cambiato i tipi così che `useRef` ora richiede un argomento. Questo semplifica significativamente la sua firma di tipo. Ora si comporterà più come `createContext`.

```ts
// @ts-expect-error: Expected 1 argument but saw none
useRef();
// Passes
useRef(undefined);
// @ts-expect-error: Expected 1 argument but saw none
createContext();
// Passes
createContext(undefined);
```

Questo significa anche che tutte le ref sono mutabili. Non avrai più il problema per cui non puoi mutare una ref perché l'hai inizializzata con `null`:

```ts
const ref = useRef<number>(null);

// Cannot assign to 'current' because it is a read-only property
ref.current = 1;
```

`MutableRef` è ora deprecato in favore di un unico tipo `RefObject` che `useRef` restituirà sempre:

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef` ha ancora un overload di convenienza per `useRef<T>(null)` che restituisce automaticamente `RefObject<T | null>`. Per facilitare la migrazione dovuta all'argomento obbligatorio per `useRef`, è stato aggiunto un overload di convenienza per `useRef(undefined)` che restituisce automaticamente `RefObject<T | undefined>`.

Consulta [[RFC] Make all refs mutable](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772) per discussioni precedenti su questa modifica.

### Modifiche al tipo TypeScript `ReactElement` {/*changes-to-the-reactelement-typescript-type*/}

_Questa modifica è inclusa nel codemod [`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props)._

Le `props` degli elementi React ora hanno default `unknown` invece di `any` se l'elemento è tipizzato come `ReactElement`. Questo non ti riguarda se passi un type argument a `ReactElement`:

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

Ma se ti basavi sul default, ora devi gestire `unknown`:

```ts
type Example = ReactElement["props"];
//   ^? Before, was 'any', now 'unknown'
```

Dovresti averne bisogno solo se hai molto codice legacy che si basa su accessi unsound alle props degli elementi. L'introspezione degli elementi esiste solo come escape hatch, e dovresti rendere esplicito che l'accesso alle props è unsound tramite un `any` esplicito.

### Il namespace JSX in TypeScript {/*the-jsx-namespace-in-typescript*/}
Questa modifica è inclusa nel preset codemod `react-19` come [`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx)

Una richiesta di lunga data è rimuovere il namespace globale `JSX` dai nostri tipi in favore di `React.JSX`. Questo aiuta a prevenire l'inquinamento dei tipi globali che previene conflitti tra diverse librerie UI che usano JSX.

Ora dovrai avvolgere l'augmentation del modulo del namespace JSX in `declare module "....":

```diff
// global.d.ts
+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

Lo specifier esatto del modulo dipende dalla JSX runtime specificata nelle `compilerOptions` del tuo `tsconfig.json`:

- Per `"jsx": "react-jsx"` sarebbe `react/jsx-runtime`.
- Per `"jsx": "react-jsxdev"` sarebbe `react/jsx-dev-runtime`.
- Per `"jsx": "react"` e `"jsx": "preserve"` sarebbe `react`.

### Tipizzazioni migliori per `useReducer` {/*better-usereducer-typings*/}

`useReducer` ora ha un type inference migliorato grazie a [@mfp22](https://github.com/mfp22).

Tuttavia, questo ha richiesto una breaking change in cui `useReducer` non accetta il tipo reducer completo come type parameter ma invece non ne richiede nessuno (e si affida al contextual typing) o richiede sia lo state che il tipo action.

La nuova best practice è _non_ passare type arguments a `useReducer`.
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```
Questo potrebbe non funzionare in edge case dove puoi tipizzare esplicitamente lo state e l'action, passando l'`Action` in una tupla:
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```
Se definisci il reducer inline, incoraggiamo ad annotare i parametri della funzione invece:
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```
Questo è anche ciò che dovresti fare se sposti il reducer fuori dalla chiamata `useReducer`:

```ts
const reducer = (state: State, action: Action) => state;
```

## Changelog {/*changelog*/}

### Altre breaking change {/*other-breaking-changes*/}

- **react-dom**: Error for javascript URLs in `src` and `href` [#26507](https://github.com/react/react/pull/26507)
- **react-dom**: Remove `errorInfo.digest` from `onRecoverableError` [#28222](https://github.com/react/react/pull/28222)
- **react-dom**: Remove `unstable_flushControlled` [#26397](https://github.com/react/react/pull/26397)
- **react-dom**: Remove `unstable_createEventHandle` [#28271](https://github.com/react/react/pull/28271)
- **react-dom**: Remove `unstable_renderSubtreeIntoContainer` [#28271](https://github.com/react/react/pull/28271)
- **react-dom**: Remove `unstable_runWithPriority` [#28271](https://github.com/react/react/pull/28271)
- **react-is**: Remove deprecated methods from `react-is` [28224](https://github.com/react/react/pull/28224)

### Altre modifiche rilevanti {/*other-notable-changes*/}

- **react**: Batch sync, default and continuous lanes [#25700](https://github.com/react/react/pull/25700)
- **react**: Don't prerender siblings of suspended component [#26380](https://github.com/react/react/pull/26380)
- **react**: Detect infinite update loops caused by render phase updates [#26625](https://github.com/react/react/pull/26625)
- **react-dom**: Transitions in popstate are now synchronous [#26025](https://github.com/react/react/pull/26025)
- **react-dom**: Remove layout effect warning during SSR [#26395](https://github.com/react/react/pull/26395)
- **react-dom**: Warn and don’t set empty string for src/href (except anchor tags) [#28124](https://github.com/react/react/pull/28124)

Per l'elenco completo delle modifiche, consulta il [Changelog](https://github.com/react/react/blob/main/CHANGELOG.md#1900-december-5-2024).

---

Grazie a [Andrew Clark](https://twitter.com/acdlite), [Eli White](https://twitter.com/Eli_White), [Jack Pope](https://github.com/jackpope), [Jan Kassens](https://github.com/kassens), [Josh Story](https://twitter.com/joshcstory), [Matt Carroll](https://twitter.com/mattcarrollcode), [Noah Lemen](https://twitter.com/noahlemen), [Sophie Alpert](https://twitter.com/sophiebits), and [Sebastian Silbermann](https://twitter.com/sebsilbermann) per la revisione e l'editing di questo post.
