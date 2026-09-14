# Glossario

Glossario dei termini tecnici e specifici di React per la traduzione italiana di [it.react.dev](https://it.react.dev).

Le traduzioni in **Traduzioni confermate** derivano dalle pagine già tradotte e revisionate elencate in [#418](https://github.com/reactjs/it.react.dev/issues/418). In caso di dubbio, consulta quelle pagine di riferimento — non introdurre varianti se esiste già una voce confermata.

Le scelte riflettono il corpus umano così com'è: non riformuliamo decisioni già presenti nelle pagine revisionate. Se un termine diventa problematico in futuro, si aggiorna il glossario allora.

## Policy sugli anglicismi

- **Non tradurre** identificatori API, nomi di codice e concetti core di React quando il loro uso in inglese è stabile nella community italiana (`props`, `state`, `hooks`, `ref`).
- **Traduci in prosa** quando esiste un equivalente italiano stabile e già adottato nel corpus (`renderizzare`, `gestore di eventi`, `Effetto`, `istantanea`).
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
| Effect | Effetto | you-might-not-need-an-effect |
| Strict Mode | Strict Mode | — |
| Suspense | Suspense | — |
| Hook | Hook | state-a-components-memory |
| Transition | Transizione | proposta |
| Server Component | componente Server | proposta |
| Client Component | componente Client | proposta |

Al plurale: *Effetti*, *Hooks*, *Transizioni* quando il concetto React resta nome proprio nel contesto. La pagina canonica `you-might-not-need-an-effect` usa anche *effetti* minuscolo in prosa introduttiva — vedi [Pagine legacy](#pagine-legacy-con-deviazioni-note).

---

## Disambiguazioni

| Termine | Quando | Traduzione |
| ------- | ------ | ---------- |
| Effect | Concetto React (`useEffect`, regole degli Effetti) | **Effetto** (nome proprio) |
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
| event listener | listener di eventi | In prosa; in codice resta `addEventListener` |
| controlled component | componente controllato | |
| uncontrolled component | componente non controllato | |
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

## Pagine legacy con deviazioni note

Pagine revisionate da umani che **non seguono** tutte le regole attuali del glossario. Per **nuove traduzioni e revisioni**, segui il glossario — non replicare le deviazioni legacy.

| Pagina | Deviazioni note |
| ------ | --------------- |
| you-might-not-need-an-effect | *stato* al posto di *state* (~22 occorrenze); *event handler* in inglese in alcuni passaggi; *effetti* minuscolo oltre a *Effetto*/*Effetti* |
| extracting-state-logic-into-a-reducer | *stato* al posto di *state* (~13 occorrenze) |
| scaling-up-with-reducer-and-context | *stato* al posto di *state* (~18 occorrenze) |

La normalizzazione di queste pagine è opzionale e a cura della community, se mai.

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
| Effetti | you-might-not-need-an-effect | — |
| Props | passing-props-to-a-component | #428 |
| Liste | rendering-lists | #442 |
