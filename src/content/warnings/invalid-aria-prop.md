---
title: Invalid ARIA Prop Warning
---

<<<<<<< HEAD:content/warnings/invalid-aria-prop.md
Il warning invalid-aria-prop appare quando provi a renderizzare un elemento del DOM con una aria-* prop che non esiste nella [specifica](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).
=======
This warning will fire if you attempt to render a DOM element with an `aria-*` prop that does not exist in the Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [specification](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638:src/content/warnings/invalid-aria-prop.md

1. Se pensi che la prop che stai usando sia valida, controlla attentamente eventuali errori di battitura. `aria-labelledby` e `aria-activedescendant` sono spesso scritte in modo scorretto.

2. Se hai scritto `aria-role`, probabilmente intendevi `role`.

3. Altrimenti, se stai utilizzando l'ultima versione di React DOM e verificato che stai usando un nome di proprietà valido presente nella lista della specifica ARIA, cortesemente [riporta un bug](https://github.com/facebook/react/issues/new/choose).
