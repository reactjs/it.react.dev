---
title: Invalid ARIA Prop Warning
---

Il warning invalid-aria-prop appare quando provi a renderizzare un elemento del DOM con una aria-* prop che non esiste nella [specifica](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. Se pensi che la prop che stai usando sia valida, controlla attentamente eventuali errori di battitura. `aria-labelledby` e `aria-activedescendant` sono spesso scritte in modo scorretto.

2. Se hai scritto `aria-role`, probabilmente intendevi `role`.

<<<<<<< HEAD
3. Altrimenti, se stai utilizzando l'ultima versione di React DOM e verificato che stai usando un nome di proprietà valido presente nella lista della specifica ARIA, cortesemente [riporta un bug](https://github.com/facebook/react/issues/new/choose).
=======
3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/react/react/issues/new/choose).
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab
