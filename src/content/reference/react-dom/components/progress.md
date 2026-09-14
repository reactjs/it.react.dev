---
title: "<progress>"
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/components/progress.md).

</Note>

<Intro>

Il [componente browser integrato `<progress>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/progress) ti permette di renderizzare un indicatore di progresso.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<progress>` {/*progress*/}

Per visualizzare un indicatore di progresso, renderizza il [componente browser integrato `<progress>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/progress).

```js
<progress value={0.5} />
```

[Vedi altri esempi sotto.](#usage)

#### Props {/*props*/}

`<progress>` supporta tutte le [props comuni degli elementi.](/reference/react-dom/components/common#common-props)

Inoltre, `<progress>` supporta queste props:

* [`max`](https://developer.mozilla.org/it/docs/Web/HTML/Element/progress#max): Un numero. Specifica il `value` massimo. Predefinito: `1`.
* [`value`](https://developer.mozilla.org/it/docs/Web/HTML/Element/progress#value): Un numero compreso tra `0` e `max`, oppure `null` per un progresso indeterminato. Specifica quanto è stato completato.

---

## Usage {/*usage*/}

### Controllare un indicatore di progresso {/*controlling-a-progress-indicator*/}

Per visualizzare un indicatore di progresso, renderizza un componente `<progress>`. Puoi passare un numero `value` compreso tra `0` e il valore di `max` che specifichi. Se non passi un valore `max`, viene assunto `1` per impostazione predefinita.

Se l'operazione non è in corso, passa `value={null}` per mettere l'indicatore di progresso in uno stato indeterminato.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
