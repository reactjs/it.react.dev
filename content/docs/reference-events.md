---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Questa guida di riferimento documenta il contenitore `SyntheticEvent` che fa parte del sistema di eventi di React. Consulta la guida [Gestione degli Eventi](/docs/handling-events.html) per saperne di più.

## Panoramica {#overview}

I tuoi event handlers riceveranno istanze di `SyntheticEvent`, un contenitore cross-browser intorno all'evento nativo del browser.  Hanno entrambi la stessa interfaccia, compresi `stopPropagation()` e `preventDefault()`, l'eccezione sta nel fatto che gli eventi funzionano in modo identico in tutti i browser.

Se constati di avere bisogno dell'evento del browser sottostante per qualche motivo, puoi ottenerlo semplicemente usando l'attributo `nativeEvent`. Ogni `SyntheticEvent` oggetto ha i seguenti attributi:

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
void persist()
DOMEventTarget target
number timeStamp
string type
```

> Nota:
>
> A partire da v0.14, ritornare `false` da un event handler non fermerà la propagazione dell'evento come avveniva in precedenza. Invece, `e.stopPropagation()` o `e.preventDefault()` dovrebbero essere invocati manualmente, ove opportuno.

### Pooling degli Eventi {#event-pooling}

`SyntheticEvent` è _pooled_, ovvero "accomunato". Questo significa che un oggetto `SyntheticEvent` sarà riutilizzato e che tutte proprietà verranno resettate a `null` non appena la callback dell'evento è stata invocata.
Ciò avviene per migliorare le prestazioni.
Per questo, non puoi avere accesso all'evento in modo asincrono.

```javascript
function onClick(event) {
  console.log(event); // => oggetto nullifficato.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Non funzionerebbe. this.state.clickEvent conterrà solo valori nulli
  this.setState({clickEvent: event});

  // YPuoi comunque esportare le proprietà dell'evento.
  this.setState({eventType: event.type});
}
```

> Nota:
>
<<<<<<< HEAD
> Se vuoi avere accesso alle proprietà in modo asincrono, dovresti invocare `event.persist()` sull'evento, il quale rimuoverà l'evento sintetico dal pool permettendo ai riferimenti all'evento di rimanere mantenuti dal codice utente.

## Eventi Supportati {#supported-events}

React normalizza gli eventi per far sì che abbiano proprietà coerenti in tutti browser.

Gli event handlers di seguito vengono scatenati da un evento nella fase di [bubbling](https://developer.mozilla.org/it/docs/Learn/JavaScript/Building_blocks/Eventi#Event_bubbling_and_capture). Per registrare un event handler per la fase di [capture](https://developer.mozilla.org/it/docs/Learn/JavaScript/Building_blocks/Eventi#Event_bubbling_and_capture), aggiungi `Capture` al nome dell'evento; per esempio, invece di usare `onClick`, useresti `onClickCapture` per gestire l'evento click nella fase di `capture`.

- [Eventi degli Appunti](#clipboard-events)
- [Eventi della Composizione](#composition-events)
- [Eventi della Tastiera](#keyboard-events)
- [Eventi di Focus](#focus-events)
- [Eventi di Form](#form-events)
- [Eventi del Mouse](#mouse-events)
- [Eventi del Puntatore](#pointer-events)
- [Eventi della Selezione](#selection-events)
- [Eventi Tattili](#touch-events)
- [Eventi dell'Interfaccia Utente](#ui-events)
- [Eventi della Rotella del Mouse](#wheel-events)
- [Eventi dei Media](#media-events)
- [Eventi dell'Immagine](#image-events)
- [Eventi delle Animazioni](#animation-events)
- [Eventi della Transizione](#transition-events)
- [Altri Eventi](#other-events)
=======
> If you want to access the event properties in an asynchronous way, you should call `event.persist()` on the event, which will remove the synthetic event from the pool and allow references to the event to be retained by user code.

## Supported Events {#supported-events}

React normalizes events so that they have consistent properties across different browsers.

The event handlers below are triggered by an event in the bubbling phase. To register an event handler for the capture phase, append `Capture` to the event name; for example, instead of using `onClick`, you would use `onClickCapture` to handle the click event in the capture phase.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Generic Events](#generic-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c

* * *

## Riferimento {#reference}

### Eventi degli Appunti {#clipboard-events}

Nomi degli eventi:

```
onCopy onCut onPaste
```

Proprietà:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Eventi della Composizione {#composition-events}

Nomi degli eventi:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Proprietà:

```javascript
string data

```

* * *

### Eventi della Tastiera {#keyboard-events}

Nomi degli eventi:

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

La proprietà `key` può accettare uno qualsiasi dei valori documentati nelle [specifiche degli Eventi del DOM Livello 3](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### Eventi di Focus {#focus-events}

Nomi degli eventi:

```
onFocus onBlur
```

Questi eventi di focus funzionano con tutti elementi nel React DOM, non solo elementi form.

Proprietà:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Eventi di Form {#form-events}

Nomi degli eventi:

```
onChange onInput onInvalid onReset onSubmit 
```

Per maggiori informazioni sull'evento onChange, vedi [Forms](/docs/forms.html).

* * *

<<<<<<< HEAD
### Eventi del Mouse {#mouse-events}
=======
### Generic Events {#generic-events}

Event names:

```
onError onLoad
```

* * *

### Mouse Events {#mouse-events}
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c

Nomi degli eventi:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

Gli eventi `onMouseEnter` e `onMouseLeave` vengono propagati dall'elemento che viene lasciato a quello che viene acceduto invece di seguire il normale _bubbling_ e non hanno una fase di _capture_. (Clicca [qui](https://developer.mozilla.org/it/docs/Learn/JavaScript/Building_blocks/Eventi#Event_bubbling_and_capture) per maggiori informazioni su _bubbling_ e _capture_.

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

### Eventi del Puntatore {#pointer-events}

Nomi degli eventi:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

Gli eventi `onPointerEnter` e `onPointerLeave` vengono propagati dall'elemento che viene lasciato a quello che viene acceduto invece di seguire il normale _bubbling_ e non hanno una fase di _capture_. (Clicca [qui](https://developer.mozilla.org/it/docs/Learn/JavaScript/Building_blocks/Eventi#Event_bubbling_and_capture) per maggiori informazioni su _bubbling_ e _capture_.

Proprietà:

Come definito nelle [specifiche W3](https://www.w3.org/TR/pointerevents/), gli eventi del cursore estendono gli [Eventi del Mouse](#mouse-events) con le seguente proprietà:

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

Una nota sul supporto cross-browser:

Gli eventi del puntatore non sono ancora supportati in tutti i browser (al momento della scrittura di questo articolo), tra quelli supportati abbiamo: Chrome, Firefox, Edge, e Internet Explorer). React deliberatamente non offre supporto agli altri browsers mediante polyfill in quanto ciò aumenterebbe in modo considerevole la dimensione del pacchetto `react-dom`.

Se la tua applicazione richiede l'utilizzo degli eventi del puntatore, raccomandiamo l'uso di una polyfill specifica di terze parti.

* * *

### Eventi della Selezione {#selection-events}

Nomi degli eventi:

```
onSelect
```

* * *

### Eventi Tattili {#touch-events}

Nomi degli eventi:

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

### Eventi dell'Interfaccia Utente {#ui-events}

Nomi degli eventi:

```
onScroll
```

Proprietà:

```javascript
number detail
DOMAbstractView view
```

* * *

### Eventi della Rotella del Mouse {#wheel-events}

Nomi degli eventi:

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

### Eventi dei Media {#media-events}

Nomi degli eventi:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Eventi della Immagine {#image-events}

Nomi degli eventi:

```
onLoad onError
```

* * *

### Eventi delle Animazioni {#animation-events}

Nomi degli eventi:

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

Nomi degli eventi:

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

Nomi degli eventi:

```
onToggle
```
