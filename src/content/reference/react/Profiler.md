---
title: <Profiler>
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/Profiler.md).

</Note>

<Intro>

`<Profiler>` ti permette di misurare programmaticamente le prestazioni di renderizzazione di un albero React.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<Profiler>` {/*profiler*/}

Avvolgi un albero di componenti in un `<Profiler>` per misurare le prestazioni di renderizzazione.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: Una stringa che identifica la parte dell'interfaccia utente che stai misurando.
* `onRender`: Una [`callback onRender`](#onrender-callback) che React chiama ogni volta che i componenti nell'albero profilato si aggiornano. Riceve informazioni su cosa è stato renderizzato e quanto tempo ha richiesto.

#### Caveats {/*caveats*/}

* Il profiling aggiunge un overhead aggiuntivo, quindi **è disabilitato di default nella build di produzione.** Per attivare il profiling in produzione, devi abilitare una [build di produzione speciale con il profiling attivato.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)

---

### `onRender` callback {/*onrender-callback*/}

React chiamerà la tua callback `onRender` con informazioni su cosa è stato renderizzato.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggrega o registra i tempi di renderizzazione...
}
```

#### Parameters {/*onrender-parameters*/}

* `id`: La stringa della prop `id` dell'albero `<Profiler>` appena sottoposto a commit. Ti permette di identificare quale parte dell'albero ha effettuato il commit se usi più profiler.
* `phase`: `"mount"`, `"update"` o `"nested-update"`. Ti indica se l'albero è stato montato per la prima volta o renderizzato di nuovo a causa di un cambiamento di props, state o Hooks.
* `actualDuration`: Il numero di millisecondi impiegati per renderizzare il `<Profiler>` e i suoi discendenti per l'aggiornamento corrente. Indica quanto bene il sottoalbero sfrutta la memorizzazione (ad esempio [`memo`](/reference/react/memo) e [`useMemo`](/reference/react/useMemo)). Idealmente questo valore dovrebbe diminuire significativamente dopo il montaggio iniziale, poiché molti discendenti dovranno renderizzare di nuovo solo se cambiano le loro props specifiche.
* `baseDuration`: Il numero di millisecondi stimati per renderizzare di nuovo l'intero sottoalbero `<Profiler>` senza ottimizzazioni. Viene calcolato sommando le durate di renderizzazione più recenti di ogni componente nell'albero. Questo valore stima il costo nel caso peggiore di renderizzazione (ad esempio il montaggio iniziale o un albero senza memorizzazione). Confronta `actualDuration` con questo valore per verificare se la memorizzazione funziona.
* `startTime`: Un timestamp numerico relativo al momento in cui React ha iniziato a renderizzare l'aggiornamento corrente.
* `commitTime`: Un timestamp numerico relativo al momento in cui React ha effettuato il commit dell'aggiornamento corrente. Questo valore è condiviso tra tutti i profiler in un commit, permettendone il raggruppamento se necessario.

---

## Usage {/*usage*/}

### Misurare programmaticamente le prestazioni di renderizzazione {/*measuring-rendering-performance-programmatically*/}

Avvolgi il componente `<Profiler>` attorno a un albero React per misurare le prestazioni di renderizzazione.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Richiede due props: un `id` (stringa) e una callback `onRender` (funzione) che React chiama ogni volta che un componente nell'albero effettua il commit di un aggiornamento.

<Pitfall>

Il profiling aggiunge un overhead aggiuntivo, quindi **è disabilitato di default nella build di produzione.** Per attivare il profiling in produzione, devi abilitare una [build di produzione speciale con il profiling attivato.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)

</Pitfall>

<Note>

`<Profiler>` ti permette di raccogliere misurazioni programmaticamente. Se cerchi un profiler interattivo, prova la scheda _Profiler_ in [React Developer Tools](/learn/react-developer-tools). Espone funzionalità simili come estensione del browser.

I componenti avvolti in `<Profiler>` saranno anche contrassegnati nella [traccia Components](/reference/dev-tools/react-performance-tracks#components) di React Performance tracks anche nelle build con profiling.
Nelle build di development, tutti i componenti sono contrassegnati nella traccia Components indipendentemente dal fatto che siano avvolti in `<Profiler>`.

</Note>

---

### Misurare diverse parti dell'applicazione {/*measuring-different-parts-of-the-application*/}

Puoi usare più componenti `<Profiler>` per misurare diverse parti della tua applicazione:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

Puoi anche annidare componenti `<Profiler>`:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

Sebbene `<Profiler>` sia un componente leggero, dovrebbe essere usato solo quando necessario. Ogni utilizzo aggiunge un overhead di CPU e memoria all'applicazione.

---
