---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

Il warning invalid-aria-prop appare quando provi a renderizzare un elemento del DOM con una aria-* prop che non esiste nella [specifica](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. Se pensi che la prop che stai usando sia valida, controlla attentamente eventuali errori di battitura. `aria-labelledby` e `aria-activedescendant` sono spesso scritte in modo scorretto.

2. React non riconosce ancora gli attributi che hai specificato. Una fix verrà rilasciata probabilmente in una futura versione di React.
