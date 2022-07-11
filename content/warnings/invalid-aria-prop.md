---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

Il warning invalid-aria-prop appare quando provi a renderizzare un elemento del DOM con una aria-* prop che non esiste nella [specifica](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. Se pensi che la prop che stai usando sia valida, controlla attentamente eventuali errori di battitura. `aria-labelledby` e `aria-activedescendant` sono spesso scritte in modo scorretto.

<<<<<<< HEAD
2. React ancora non riconosce l'attributo che hai specificato. Questo sarà probabilmente corretto in una versione futura di React. Comunque, attualmente React scarta tutti gli attributi sconosciuti, quindi specificandone uno nella tua applicazione React, questo non sarà renderizzato.
=======
2. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React.
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e
