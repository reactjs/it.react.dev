# Guida di Stile

> Basata sulla [Universal Style Guide](https://github.com/reactjs/reactjs.org-translation/blob/master/style-guide.md) del progetto di traduzione React.

Regole per tradurre la documentazione di [it.react.dev](https://it.react.dev). Per la terminologia, consulta sempre il [Glossario](./GLOSSARY.md).

---

## Glossario

Vedi [GLOSSARY.md](./GLOSSARY.md) in questo repository.

Prima di tradurre o revisionare una pagina, leggi le voci pertinenti. **Non introdurre varianti** se il glossario ha già una voce confermata. Le [pagine legacy](./GLOSSARY.md#pagine-legacy-con-deviazioni-note) non annullano le regole per le nuove traduzioni.

---

## Registro e tono

### Registro

Usa il **tu** informale, coerente con le pagine già tradotte:

✅ *Quando aggiorni lo state, React renderizza di nuovo il componente.*

❌ *Quando l'utente aggiorna lo state...* (evita la terza persona distante salvo casi eccezionali)

### Tono per tipo di pagina

| Tipo | Tono | Esempio |
| ---- | ---- | ------- |
| Learn | Conversazionale, pedagogico | *Ecco cosa succede...*, *Potresti chiederti...* |
| Reference | Tecnico, esaustivo | *Chiama `useState` al top level...* |
| Blog | Fattuale, preciso | Evita linguaggio promozionale |

---

## Terminologia e coerenza

### Policy anglicismi

Segui la policy del [Glossario](./GLOSSARY.md#policy-sugli-anglicismi):

1. API, identificatori e concetti core React → **inglese** (`props`, `state`, `hooks`)
2. Concetti spiegati in prosa con equivalente stabile → **italiano** (*renderizzare*, *gestore di eventi*, *Effetto*)
3. Loanword tecnici senza equivalente univoco → **inglese** (*commit*, *dispatch*, *Suspense*)

### Maiuscole

| Contesto | Regola | Esempio |
| -------- | ------ | ------- |
| Concetti core React in prosa | minuscolo | *le props*, *lo state*, *gli hooks* |
| Titoli (`title` nel frontmatter e sidebar) | **State** maiuscolo quando è il concetto React | `Aggiornare gli Oggetti nello State`, `Lo State come un'Istantanea` |
| Nomi propri React | maiuscola | *Effetto*, *Strict Mode*, *Suspense*, *Hook* |
| API e codice | come in inglese | `useState`, `createRoot` |

Nei **titoli di pagina e voci sidebar**, tratta *State* come nome proprio del concetto React e scrivilo con la maiuscola, anche in espressioni come *dello State* / *nello State*. Nel corpo del testo resta minuscolo: *lo state*, *dello state*.

### Coerenza obbligatoria

- **Non alternare** *state* e *stato* per lo stesso concetto React → sempre *state*
- **Non alternare** *gestore di eventi* e *event handler* → preferire *gestore di eventi*
- **Non alternare** *renderizzare* e *rendere* → preferire *renderizzare*
- Usa *Effetto* (maiuscola) per il concetto React; *effetto collaterale* per side effect generici; *effetto* minuscolo solo fuori dal contesto React

---

## ID delle intestazioni

Tutte le intestazioni hanno ID espliciti:

```md
## Try React {#try-react}
```

**Non tradurre gli ID.** Servono per la navigazione e i link interni.

✅ Corretto:

```md
## Prova React {#try-react}
```

❌ Errato:

```md
## Prova React {#prova-react}
```

I commenti `{/*english-slug*/}` dopo le intestazioni restano in inglese.

---

## Testo nei blocchi di codice

Non tradurre il codice, **eccetto i commenti**. Attenzione alle stringhe: traduci solo se non sono riferimenti al codice (ID DOM, nomi di variabili, API).

✅ Corretto:

```js
// Esempio
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ Anche accettabile (stringhe UI):

```js
const element = <h1>Ciao mondo</h1>;
```

❌ Errato:

```js
ReactDOM.render(element, document.getElementById('radice'));
```

❌ Decisamente errato:

```js
const elemento = <h1>Ciao mondo</h1>;
ReactDOM.renderizza(elemento, documento.ottieniElementoDallId('radice'));
```

---

## Componenti MDX

**Non tradurre** i nomi dei componenti MDX: `Intro`, `YouWillLearn`, `Sandpack`, `Pitfall`, `Note`, `DeepDive`, `Challenges`, ecc.

Traduci solo il **contenuto** al loro interno.

---

## Link

### Link interni

- **Path:** invariati (`/learn/state-a-components-memory`)
- **Testo del link:** tradotto

✅ `[Passare le props](/learn/passing-props-to-a-component)`

### Link esterni

Se esiste una versione italiana di qualità su [MDN](https://developer.mozilla.org/it/) o [Wikipedia](https://it.wikipedia.org/), preferiscila.

[MDN]: https://developer.mozilla.org/it/
[Wikipedia]: https://it.wikipedia.org/wiki/Pagina_principale

✅ `[immutabili](https://it.wikipedia.org/wiki/Struttura_dati_persistente)`

Per link senza versione tradotta (Stack Overflow, YouTube, blog), usa l'URL originale.

---

## Frontmatter

Traduci almeno il campo `title`:

```yaml
---
title: Renderizzare e Aggiornare
---
```

Se il titolo menziona il concetto React state, usa la maiuscola come in sidebar: `Lo State come un'Istantanea`, non `... dello state`.

Altri campi (`description`, ecc.) vanno tradotti se presenti.

### Titoli sidebar

Aggiorna `sidebarLearn.json` o `sidebarReference.json` insieme alla pagina. Il titolo sidebar deve coincidere con il `title` del frontmatter (stessa capitalizzazione). Segui le voci già tradotte nella stessa sezione: *State* maiuscolo nei titoli, minuscolo nel corpo.

---

## Traduzioni assistite (AI)

Pagine tradotte automaticamente in attesa di revisione umana devono includere:

```yaml
translationStatus: ai-draft
```

E subito dopo il frontmatter:

```mdx
<Note>

Questa pagina è stata tradotta automaticamente e potrebbe beneficiare di una revisione umana. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/...).

</Note>
```

Rimuovi `translationStatus` e il blocco `<Note>` quando la pagina viene revisionata e approvata.

---

## Checklist pre-merge

Prima di aprire o approvare una PR di traduzione:

- [ ] Terminologia conforme al [Glossario](./GLOSSARY.md)
- [ ] ID intestazioni `{#...}` invariati
- [ ] Codice invariato (salvo commenti)
- [ ] Nomi componenti MDX invariati
- [ ] Titolo sidebar aggiornato in `sidebarLearn.json` o `sidebarReference.json`
- [ ] Nessun paragrafo rimasto in inglese
- [ ] Link interni con path corretti
- [ ] `yarn check-all` passa
- [ ] Anteprima locale: pagina coerente con layout, sidebar, Note AI e Sandpack del resto del sito (vedi sotto)

### Verifica rapida termini

Cerca varianti deprecate nel file tradotto:

```bash
# Varianti da evitare nelle nuove traduzioni (vedi glossario)
rg -i 'event handler|\\blo stato\\b|\\brendere\\b' src/content/learn/TUO-FILE.md
```

### Anteprima nel browser

Dopo `yarn dev`, controlla la pagina tradotta e confrontala con una pagina italiana già revisionata nella stessa sezione (es. `state-as-a-snapshot`, `responding-to-events`):

1. **Sidebar** — titolo aggiornato, sezione corretta, capitalizzazione *State* coerente con le voci vicine
2. **Layout** — Intro, YouWillLearn, Recap, Challenges, Pitfall/Note/DeepDive renderizzati come le altre pagine Learn
3. **Nota AI** — blocco `<Note>` visibile in cima, link "Migliora questa traduzione" funzionante
4. **Sandpack** — esempi interattivi caricano ed eseguono; titoli UI possono restare in inglese
5. **Link interni** — navigazione verso pagine correlate (capitolo precedente/successivo) senza 404

Segnala incoerenze visive o di tono rispetto al corpus umano prima di marcare la PR ready.

---

## Riferimenti

- [Issue #418 — avanzamento traduzione](https://github.com/reactjs/it.react.dev/issues/418)
- [Glossario](./GLOSSARY.md)
- [Contributing (react.dev)](https://github.com/reactjs/react.dev/blob/main/CONTRIBUTING.md)
