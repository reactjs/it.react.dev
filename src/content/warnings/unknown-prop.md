---
title: Warning sulle props sconosciute
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/warnings/unknown-prop.md).

</Note>

Il warning unknown-prop viene mostrato se provi a renderizzare un elemento del DOM con una prop che React non riconosce come attributo/proprietà DOM valida. Dovresti assicurarti che i tuoi elementi DOM non abbiano props spurie in giro.

Ci sono un paio di motivi probabili per cui questo warning potrebbe comparire:

1. Stai usando `{...props}` o `cloneElement(element, props)`? Quando copi le props in un componente figlio, dovresti assicurarti di non inoltrare per sbaglio props destinate solo al componente genitore. Vedi le soluzioni comuni a questo problema qui sotto.

2. Stai usando un attributo DOM non standard su un nodo DOM nativo, forse per rappresentare dati personalizzati. Se stai cercando di allegare dati personalizzati a un elemento DOM standard, considera l'uso di un attributo data personalizzato come descritto [su MDN](https://developer.mozilla.org/it/docs/Web/HTML/How_to/Use_data_attributes).

3. React non riconosce ancora l'attributo che hai specificato. Probabilmente verrà corretto in una versione futura di React. React ti permetterà di passarlo senza warning se scrivi il nome dell'attributo in minuscolo.

4. Stai usando un componente React senza la maiuscola iniziale, ad esempio `<myButton />`. React lo interpreta come un tag DOM perché la trasformazione JSX di React usa la convenzione maiuscola/minuscola per distinguere tra componenti definiti dall'utente e tag DOM. Per i tuoi componenti React, usa PascalCase. Ad esempio, scrivi `<MyButton />` invece di `<myButton />`.

---

Se ottieni questo warning perché passi props come `{...props}`, il componente genitore deve "consumare" qualsiasi prop destinata al componente genitore e non destinata al componente figlio. Esempio:

**Sbagliato:** La prop `layout` inattesa viene inoltrata al tag `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // SBAGLIATO! Perché sai per certo che "layout" non è una prop che <div> capisce.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // SBAGLIATO! Perché sai per certo che "layout" non è una prop che <div> capisce.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Corretto:** La sintassi spread può essere usata per estrarre variabili dalle props e mettere le props rimanenti in una variabile.

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**Corretto:** Puoi anche assegnare le props a un nuovo oggetto ed eliminare le chiavi che stai usando dal nuovo oggetto. Assicurati di non eliminare le props dall'oggetto `this.props` originale, poiché quell'oggetto dovrebbe essere considerato immutabile.

```js
function MyDiv(props) {
  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
