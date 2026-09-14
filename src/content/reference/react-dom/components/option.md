---
title: "<option>"
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/components/option.md).

</Note>

<Intro>

Il [componente browser integrato `<option>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/option) ti permette di renderizzare un'opzione dentro una casella [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<option>` {/*option*/}

Il [componente browser integrato `<option>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/option) ti permette di renderizzare un'opzione dentro una casella [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[Vedi altri esempi sotto.](#usage)

#### Props {/*props*/}

`<option>` supporta tutte le [props comuni degli elementi.](/reference/react-dom/components/common#common-props)

Inoltre, `<option>` supporta queste props:

* [`disabled`](https://developer.mozilla.org/it/docs/Web/HTML/Element/option#disabled): Un booleano. Se `true`, l'opzione non sarà selezionabile e apparirà attenuata.
* [`label`](https://developer.mozilla.org/it/docs/Web/HTML/Element/option#label): Una stringa. Specifica il significato dell'opzione. Se non specificato, viene usato il testo dentro l'opzione.
* [`value`](https://developer.mozilla.org/it/docs/Web/HTML/Element/option#value): Il valore da usare [quando si invia il `<select>` padre in un form](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) se questa opzione è selezionata.

#### Caveats {/*caveats*/}

* React non supporta l'attributo `selected` su `<option>`. Passa invece il `value` di questa opzione al [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) padre per un select non controllato, oppure al [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) padre per un select controllato.

---

## Usage {/*usage*/}

### Visualizzare una casella di selezione con opzioni {/*displaying-a-select-box-with-options*/}

Renderizza un `<select>` con un elenco di componenti `<option>` al suo interno per visualizzare una casella select. Assegna a ogni `<option>` un `value` che rappresenta i dati da inviare con il form.

[Leggi di più sulla visualizzazione di un `<select>` con un elenco di componenti `<option>`.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>
