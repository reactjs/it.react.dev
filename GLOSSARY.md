# Glossario

Glossario dei termini tecnici e specifici di React per la traduzione italiana di [it.react.dev](https://it.react.dev).

Le traduzioni in **Traduzioni confermate** derivano dalle pagine già tradotte e revisionate elencate in [#418](https://github.com/reactjs/it.react.dev/issues/418). In caso di dubbio, consulta quelle pagine prima di introdurre varianti.

## Policy sugli anglicismi

- **Non tradurre** identificatori API, nomi di codice e concetti core di React quando il loro uso in inglese è stabile nella community italiana (`props`, `state`, `hooks`, `ref`, `Effect`).
- **Traduci in prosa** quando esiste un equivalente italiano stabile e già adottato nel corpus (`renderizzare`, `gestore di eventi`, `istantanea`).
- **Mantieni in inglese** loanword tecnici senza equivalente univoco (`commit`, `dispatch`, `Suspense`, `prop drilling`).

---

## Non tradurre

Termini che restano in inglese in prosa e in codice.

### Concetti core React

| Termine | Note |
| ------- | ---- |
| props | Concetto core; articolo: *le props* |
| state | Concetto core; articolo: *lo state*. **Non** usare *stato* per il concetto React |
| hooks | Concetto core; es. *gli hooks*, *un Hook* |
| Effect | Concetto core; es. *un Effect*, *gli Effect*. **Non** usare *Effetto* |
| ref | Concetto core |
| context | Concetto core; es. *il context*, *un context* |
| reducer | Concetto core; es. *un reducer* |
| provider | Es. *un provider* |
| consumer | Es. *un consumer* |

### Codice, API e identificatori

| Termine | Note |
| ------- | ---- |
| callback | |
| console | |
| true / false | |
| tag | Attributi JSX |
| array | |
| record | Tipo TypeScript |
| form / forms | UI HTML |
| render props | Pattern React |
| strict mode | *Strict Mode* come nome proprio |
| web components | |
| build steps | |
| wrapper | |
| footer | UI |
| bug | |
| browser | |
| client / server | RSC |
| alert | API browser |
| warning | Messaggi React |
| lifecycle | Solo in nomi API; in prosa vedi *montare/smontare* |

### Nomi di componenti, hook e API

Non tradurre nomi di hook, componenti, metodi e proprietà: `useState`, `useEffect`, `createRoot`, `dispatch`, `Suspense`, ecc.

---

## Traduzioni confermate

Scelte adottate nelle pagine revisionate. La colonna **Fonte** indica la pagina di riferimento.

### Pipeline di rendering

| Inglese | Italiano | Fonte |
| ------- | -------- | ----- |
| to render | renderizzare | render-and-commit |
| rendering | renderizzazione | render-and-commit, conditional-rendering |
| re-render | ri-renderizzazione / renderizzare di nuovo | state-as-a-snapshot |
| initial render | renderizzazione iniziale | render-and-commit |
| commit (phase) | fase di commit | render-and-commit |
| trigger a render | avviare una renderizzazione | render-and-commit |
| update the DOM | aggiornare il DOM | render-and-commit |

### Eventi

| Inglese | Italiano | Fonte |
| ------- | -------- | ----- |
| event handler | gestore di eventi | responding-to-events |
| event handlers | gestori di eventi | responding-to-events |
| event listener | listener di eventi | you-might-not-need-an-effect (API DOM) |

### State e dati

| Inglese | Italiano | Fonte |
| ------- | -------- | ----- |
| state variable | variabile di state | state-a-components-memory |
| snapshot | istantanea | state-as-a-snapshot |
| lifting state up | sollevare lo state | tutorial-tic-tac-toe, passing-data-deeply-with-context |
| prop drilling | prop drilling | passing-data-deeply-with-context |
| batching | raggruppamento (degli aggiornamenti) | state-as-a-snapshot |
| memoization / to memoize | memorizzazione / memorizzare | you-might-not-need-an-effect |
| dispatch (action) | dispatch / eseguire il dispatch | extracting-state-logic-into-a-reducer |
| action (reducer) | azione | extracting-state-logic-into-a-reducer |
| controlled component | componente controllato | you-might-not-need-an-effect |
| uncontrolled component | componente non controllato | you-might-not-need-an-effect |
| one-way data flow | flusso di dati unidirezionale | thinking-in-react |

### Mount e lifecycle (prosa)

| Inglese | Italiano (prosa) | Inglese (API) |
| ------- | ---------------- | ------------- |
| mount | montare / montato | `mount` |
| unmount | smontare / smontato | `unmount` |
| remount | rimontare / rimontato | — |

### Componenti e codice

| Inglese | Italiano | Fonte |
| ------- | -------- | ----- |
| function component | componente funzione | glossary legacy |
| React component class | classe componente React | glossary legacy |
| React component type | tipo componente React | glossary legacy |
| error boundary | contenitore di errori | glossary legacy |
| refactor / refactoring | rifattorizzare / rifattorizzazione | glossary legacy |
| declarative | dichiarativo | thinking-in-react |
| imperative | imperativo | thinking-in-react |

---

## Nomi propri React

Usa la **maiuscola** quando ti riferisci al concetto React come nome proprio.

| Inglese | Italiano | Fonte |
| ------- | -------- | ----- |
| Strict Mode | Strict Mode | — |
| Suspense | Suspense | — |
| Hook | Hook | state-a-components-memory |
| Transition | Transizione | — |
| Server Component | componente Server | proposta |
| Client Component | componente Client | proposta |

Al plurale: *Hooks*, *Transizioni* quando il concetto React resta nome proprio nel contesto.

---

## Disambiguazioni

| Termine | Quando | Traduzione |
| ------- | ------ | ---------- |
| Effect | Concetto React (`useEffect`, regole degli Effect) | **Effect** (loanword, come *state*) |
| side effect | Effetto collaterale generico in programmazione | **effetto collaterale** |
| effect (generico) | Non legato a `useEffect` | **effetto** (minuscolo) |
| state | Concetto React (variabili di state, aggiornare lo state) | **state** (mai *stato*) |
| stato | Stato generico non-React (es. "stato di un oggetto" in senso ampio) | solo se il contesto **non** è React state |
| render | Verbo/nome del processo React | **renderizzare / renderizzazione** |
| commit | Fase della pipeline React | **fase di commit** (loanword) |

---

## Proposte per pagine non ancora tradotte

Termini ricorrenti nel sorgente inglese per cui manca ancora un precedente nel corpus. Da confermare in review.

| Inglese | Proposta | Note |
| ------- | -------- | ---- |
| dependency array | array di dipendenze | Effects |
| reconciliation | riconciliazione | Internals |
| hydration | hydration / idratazione | Preferire loanword *hydration* in contesto RSC |
| stale (closure/state) | obsoleto / stale | Mantenere *stale* se termine tecnico JS |
| fallback (Suspense) | fallback | UI Suspense |
| custom hook | custom hook | Pattern, non tradurre |
| dependency | dipendenza | Effects |
| subscription | sottoscrizione | Esterni |
| store (external) | store | Loanword |

---

## Decisioni storiche

Discussioni del vecchio [it.reactjs.org](https://github.com/reactjs/it.reactjs.org) che hanno informato le scelte attuali:

- [render](https://github.com/reactjs/it.reactjs.org/issues/7) → *renderizzare*
- [event handler / listener](https://github.com/reactjs/it.reactjs.org/issues/10) → *gestore di eventi*
- [mount / unmount](https://github.com/reactjs/it.reactjs.org/issues/108) → *montare / smontare* in prosa
- [refactor](https://github.com/reactjs/it.reactjs.org/issues/9) → *rifattorizzare*

---

## Pagine di riferimento per dominio

| Dominio | Pagina | PR |
| ------- | ------ | -- |
| Eventi | responding-to-events | #438 |
| Rendering | render-and-commit | #446 |
| State (base) | state-a-components-memory | #439 |
| State (snapshot) | state-as-a-snapshot | #440 |
| State (struttura) | choosing-the-state-structure | #557 |
| Context | passing-data-deeply-with-context | #470 |
| Reducer | extracting-state-logic-into-a-reducer | — |
| Effect | you-might-not-need-an-effect | — (pagina legacy: usa *Effetto*) |
| Props | passing-props-to-a-component | #428 |
| Liste | rendering-lists | #442 |
