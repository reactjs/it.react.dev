---
title: Warning sulle props ARIA non valide
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/warnings/invalid-aria-prop.md).

</Note>

Il warning invalid-aria-prop appare quando provi a renderizzare un elemento del DOM con una prop `aria-*` che non esiste nella [specifica](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. Se pensi che la prop che stai usando sia valida, controlla attentamente eventuali errori di battitura. `aria-labelledby` e `aria-activedescendant` sono spesso scritte in modo scorretto.

2. Se hai scritto `aria-role`, probabilmente intendevi `role`.

3. Altrimenti, se stai utilizzando l'ultima versione di React DOM e hai verificato che stai usando un nome di proprietà valido presente nella lista della specifica ARIA, cortesemente [riporta un bug](https://github.com/react/react/issues/new/choose).
