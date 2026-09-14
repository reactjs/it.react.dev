---
title: Warning sulle props speciali
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/warnings/special-props.md).

</Note>

La maggior parte delle props su un elemento JSX viene passata al componente; tuttavia, ci sono due props speciali (`ref` e `key`) che React usa internamente e che quindi non vengono inoltrate al componente.

Per esempio, non puoi leggere `props.key` da un componente. Se ti serve accedere allo stesso valore all'interno del componente figlio, dovresti passarlo come prop diversa (es.: `<ListItemWrapper key={result.id} id={result.id} />` e leggere `props.id`). Anche se può sembrare ridondante, è importante separare la logica dell'app dagli indizi che React usa internamente.
