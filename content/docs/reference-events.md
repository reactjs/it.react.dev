---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Questa guida di riferimento documenta il contenitore `SyntheticEvent` che forma parte della sistema di React. Consulti la guida [Gestendo Eventi](/docs/handling-events.html) per imparare più.

## Panoramica {#overview}

Tuoi event handlers saranno passato istanze di `SyntheticEvent`, un cross-browser contenitore intorno all'evento nativo di browser. Lo ha stesso interfaccia come l'evento nativo di browser, compresi `stopPropagation()` e `preventDefault()`, eccetto gli eventi lavorano in modo identico in tutti browser.

Se constatati avere bisogno del evento di browser sottostante per qualche motivo, semplice usi il `nativeEvent` attributo lo portarti. Ogni `SyntheticEvent` oggetto ha gli seguente attributi:

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```

> Nota:
>
> A partire da v0.14, restituendo `false` da un event handler non più fermerà l'evento propagazione. Invece, `e.stopPropagation()` o `e.preventDefault()` dovrebbe essere scatenato manualmente, come appropriato.

### Raggruppamento Eventi {#event-pooling}

Il `SyntheticEvent` è raggruppato. Questo significa che il `SyntheticEvent` oggetto sarà riusato e tutte proprietà sarà assegnando nullo dopo il callback dell'evento è stato invocato.
Questo è per motivi di prestazione.
Come tale, non puoi avere accesso all'evento in un modo asincrono.

```javascript
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Won't work. this.state.clickEvent will only contain null values.
  this.setState({clickEvent: event});

  // You can still export event properties.
  this.setState({eventType: event.type});
}
```

> Nota:
>
> Se vuoi avere accesso le proprietà in un modo asincrono, dovresti invocare `event.persist()` sull'evento, quale rimuoverà l'evento sintetico dal pool e permettono riferimenti all'evento essere conservato da codice utente.

## Eventi Supportati {#supported-events}

React normalizza eventi così che hanno proprietà coerente in tutti browser.

L'event handlers sotto sono scatenato da un event in la fase di gorgogliante. Per registrare un event handler per la fase di salvataggio, affiggi `Capture` al nome dell'evento; per esempio, invece di usando `onClick`, useresti `onClickCapture` per gestire l'evento della clicca nella fase salvataggia.

- [Eventi degli Appunti](#clipboard-events)
- [Eventi della Composizione](#composition-events)
- [Eventi della Tastiera](#keyboard-events)
- [Eventi di Focus](#focus-events)
- [Eventi di Form](#form-events)
- [Eventi del Mouse](#mouse-events)
- [Eventi del Cursore](#pointer-events)
- [Eventi della Selezione](#selection-events)
- [Eventi Tattile](#touch-events)
- [Eventi della Interfaccia Utente](#ui-events)
- [Eventi della Ruota](#wheel-events)
- [Eventi degli Media](#media-events)
- [Eventi della Immagine](#image-events)
- [Eventi delle Animazioni](#animation-events)
- [Eventi della Transizione](#transition-events)
- [Altri Eventi](#other-events)

* * *

## Riferimento {#reference}

### Eventi degli Appunti {#clipboard-events}

Nomi dell'eventi:

```
onCopy onCut onPaste
```

Proprietà:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Eventi della Composizione {#composition-events}

Nomi dell'eventi:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Proprietà:

```javascript
string data

```

* * *

### Eventi della Tastiera {#keyboard-events}

Nomi dell'eventi:

```
onKeyDown onKeyPress onKeyUp
```

Proprietà:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

La `key` proprietà può accettare uno qualsiasi dei valori documentati nel [DOM Livello 3 Eventi specificazione](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### Eventi di Focus {#focus-events}

Nomi dell'eventi:

```
onFocus onBlur
```

Questi eventi di focus lavorano su tutti elementi nel React Dom, non solo elementi di form.

Proprietà:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Eventi di Form {#form-events}

Nomi dell'eventi:

```
onChange onInput onInvalid onSubmit
```

Per più informazioni For more information sul evento onChange, vedi [Forms](/docs/forms.html).

* * *

### Eventi del Mouse {#mouse-events}

Nomi dell'eventi:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

Il `onMouseEnter` e `onMouseLeave` eventi si propagano dal elemento essendo lasciato al uno essendo entrato invece il gorgogliante ordinario e non hanno una fase salvataggia.

Proprietà:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Eventi del Cursore {#pointer-events}

Nomi dell'eventi:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

Il `onPointerEnter` e `onPointerLeave` eventi si propagano dal elemento essendo lasciato al uno essendo entrato invece il gorgogliante ordinario e non hanno una fase salvataggia.

Proprietà:

Come definato nel [W3 specificazione](https://www.w3.org/TR/pointerevents/), eventi del cursore estendono [Eventi del Mouse](#mouse-events) con le seguente proprietà:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

Una nota di cross-browser supporto:

Eventi del cursore non sono ancora supportato in tutti browser (al tempo di scrittando questo articolo), browsers supportati includono: Chrome, Firefox, Edge, e Internet Explorer). React deliberatamente non polyfill supporto per altri browser perché un conforme-normale polyfill aumenterebbe il dimensione di carico di `react-dom` molto.

Se tua applicazione desideri eventi del cursore, raccomandiamo aggiungiendo un cursore evento polyfill di terzo.

* * *

### Eventi della Selezione {#selection-events}

Nomi dell'eventi:

```
onSelect
```

* * *

### Eventi Tattile {#touch-events}

Nomi dell'eventi:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Proprietà:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### Eventi della Interfaccia Utente {#ui-events}

Nomi dell'eventi:

```
onScroll
```

Proprietà:

```javascript
number detail
DOMAbstractView view
```

* * *

### Eventi della Ruota {#wheel-events}

Nomi dell'eventi:

```
onWheel
```

Proprietà:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Eventi degli Media {#media-events}

Nomi dell'eventi:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Eventi della Immagine {#image-events}

Nomi dell'eventi:

```
onLoad onError
```

* * *

### Eventi delle Animazioni {#animation-events}

Nomi dell'eventi:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Proprietà:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Eventi della Transizione {#transition-events}

Nomi dell'eventi:

```
onTransitionEnd
```

Proprietà:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Altri Eventi {#other-events}

Nomi dell'eventi:

```
onToggle
```
