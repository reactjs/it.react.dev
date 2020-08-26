---
id: dom-elements
title: Elementi DOM
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React implementa un sistema DOM indipendente dal browser per massimizzare le prestazioni e la compatibilità con i vari browsers. Abbiamo colto l'occasione per smussare gli angoli di alcune implementazioni nel DOM del browser.

In React, tutte le proprietà DOM e gli attributi (inclusi i gestori degli eventi) dovrebbero essere [_camelCased_](https://it.wikipedia.org/wiki/Notazione_a_cammello). Ad esempio, l'attributo HTML `tabindex` corrisponde all'attributo `tabIndex` in React. Fanno eccezione gli attributi `aria-*` e `data-*`, i quali dovrebbero essere in minuscolo. Puoi mantenere `aria-label` come `aria-label` per esempio.

## Differenze Negli Attributi {#differences-in-attributes}

Ci sono alcuni attributi che funzionano in modo diverso tra React ed HTML:

### checked {#checked}

L'attributo `checked` è supportato dai componenti `<input>` di tipo `checkbox` o `radio`. Puoi usarlo per impostare il fatto che il componente sia appunto _checked_ ovvero selezionato/attivato. Ci torna utile nella costruzione di componenti controllati. `defaultChecked` è l'equivalente non controllato, il quale imposta l'attributo `checked` del componente la prima volta che esso viene montato.

### className {#classname}

Per specificate una classe CSS, utilizza l'attributo `className`. Si applica a tutti i normali elementi DOM ed SVG come `<div>`, `<a>` ed altri.

Se stai utilizzando React con i [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) (fatto poco comune), usa invece l'attributo `class`.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` è la controparte React all'uso di `innerHTML` nel browser DOM. In generale, impostare HTML dal codice è rischioso in quanto può esporre facilmente i tuoi utenti ad attacchi [cross-site scripting (XSS)](https://it.wikipedia.org/wiki/Cross-site_scripting). Puoi impostare HTML direttamente da React, ma devi farlo utilizzando `dangerouslySetInnerHTML` e passando un oggetto avente chiave `__html` per ricordarti del fatto che è pericoloso: Ad esempio:

```js
function creaCodiceHtml() {
  return {__html: 'Primo &middot; Secondo'};
}

function MioComponente() {
  return <div dangerouslySetInnerHTML={creaCodiceHtml()} />;
}
```

### htmlFor {#htmlfor}

Dato che `for` è una parola riservata in JavaScript, gli elementi React utilizzano `htmlFor`.

### onChange {#onchange}

L'evento `onChange` si comporta così come di consueto: quando un campo in un form cambia, l'evento viene lanciato. Non utilizziamo intenzionalmente il comportamento esistente nel browser perché il nome `onChange` non descrive molto bene il suo comportamento e React si basa su questo evento per gestire gli input dell'utente in tempo reale.

### selected {#selected}

Se selezionare (marcando l'attributo `selected`) un `<option>`, utilizza il valore di quella option nel `value` della sua `<select>`.
Dai uno sguardo ad ["il Tag select"](/docs/forms.html#the-select-tag) per maggiori informazioni.

### style {#style}

>Nota
>
>Alcuni esempi nella documentazione fanno uso di `style` per comodità, tuttavia **l'utilizzo dell'attributo `style` come metodo principale per la personalizzazione degli stili degli elementi non è generalmente raccomandato.** Nella maggioranza dei casi, [`className`](#classname) dovrebbe essere usato per far riferimento a classi definite in fogli di stile CSS esterni. `style` viene usato maggiormente nelle applicazioni React per aggiungere stili calcolati dinamicamente durante la renderizzazione. Vedi anche [FAQ: Stili e CSS](/docs/faq-styling.html).

L'attributo `style` accetta un oggetto JavaScript con proprietà [_camelCased_](https://it.wikipedia.org/wiki/Notazione_a_cammello) invece di una stringa CSS. Proprio come la proprietà `style` del DOM JavaScript, è più efficiente e previene vulnerabilità XSS. Ad esempio:

```js
const divStile = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function ComponenteCiaoMondo() {
  return <div style={divStile}>Ciao Mondo!</div>;
}
```

Nota come gli stili non vengono prefissati automaticamente. Per supportare browser più vecchi, dovrai aggiungere le rispettive proprietà:

```js
const divStile = {
  WebkitTransition: 'all', // nota la lettera maiuscola 'W'
  msTransition: 'all' // 'ms' è l'unico prefisso vendor (terza parte) in minuscolo
};

function ComponenteConTransizione() {
  return <div style={divStile}>Questo dovrebbe funzionare in tutti i browser</div>;
}
```

Le chiavi di stile sono in notazione camel case in modo da essere consistenti con l'accesso alle proprietà dei nodi DOM da JavaScript (ad esempio `node.style.backgroundImage`). I prefissi vendor (terze parti) [diversi da `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) dovrebbero iniziare con la lettera maiuscola. Ecco perché `WebkitTransition` inizia con "W".

React aggiunge automaticamente un suffisso "px" ad alcune proprietà di stile in formato numerico. Se vorrai utilizzare unità diverse al posto di "px", dovrai specificare il valore come stringa insieme all'unità desiderata. Per esempio:

```js
// Risultato: '10px'
<div style={{ height: 10 }}>
  Ciao Mondo!
</div>

// Risultato: '10%'
<div style={{ height: '10%' }}>
  Ciao Mondo!
</div>
```

Non tutte le proprietà di stile vengono convertite in stringhe. Alcune di esse restano senza unità (ad esempio `zoom`, `order`, `flex`). Una lista completa delle proprietà senza unità è disponibile [qui](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Normalmente, si riceve un messaggio di avviso quando un elemento con figli viene anche marcato come `contentEditable` in quanto non funziona. Questo attributo sopprime tale messaggio di avviso. Non utilizzarlo a meno che tu stia costruendo una libreria come [Draft.js](https://facebook.github.io/draft-js/) che gestisce i `contentEditable` manualmente.

### suppressHydrationWarning {#suppresshydrationwarning}

Se utilizzi la renderizzazione lato server di React, normalmente si ha un avviso quando il server ed il client renderizzano contenuti differenti. Comunque, in alcuni rari casi, è molto difficile se non impossibile garantire una totale corrispondenza tra i contenuti. Ad esempio, i [timestamps](https://it.wikipedia.org/wiki/Marca_temporale) saranno certamente differenti tra server e client.

Se imposti `suppressHydrationWarning` a `true`, React non avviserà più in caso di differenze negli attributi e nel contenuto dell'elemento. Questa tecnica funziona solamente per il primo livello di profondità ed è un modo per aggirare il problema. Non abusarne. Puoi trovare maggiori dettagli riguardo l'_hydration_ nella [documentazione di `ReactDOM.hydrate()`](/docs/react-dom.html#hydrate).

### value {#value}

L'attributo `value` è supportato dai componenti `<input>`, `<select>` e `<textarea>`. Puoi utilizzarlo per impostare il valore dei componenti. Torna utile nella costruzione di componenti controllati. `defaultValue` è la controparte non controllata, la quale imposta il valore del componente quando viene montato per la prima volta.

## Tutti gli Attributi HTML Supportati {#all-supported-html-attributes}

Fino a React 16, tutti gli attributi DOM standard [o custom](/blog/2017/09/08/dom-attributes-in-react-16.html) sono pienamente supportati.

React ha sempre offerto delle API JavaScript-centriche per il DOM. Dato che i componenti React utilizzano spesso sia props custom che props relative al DOM, React usa la notazione camel case  ("notazione a cammello") come convenzione così come avviene con le API del DOM:

```js
<div tabIndex="-1" />      // Come avviene nelle API del DOM node.tabIndex
<div className="Button" /> // Come avviene nelle API del DOM node.className
<input readOnly={true} />  // Come avviene nelle API del DOM node.readOnly
```

Queste props funzionano in modo simile ai corrispondenti attributi HTML, fatta eccezione dei casi speciali documentati sopra.

Di seguito una lista di alcuni degli attributi DOM supportati da React:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

Allo stesso modo, tutti questi attributi SVG sono pienamente supportati:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

Puoi anche utilizzare attributi custom a condizione che siano completamente in minuscolo.
