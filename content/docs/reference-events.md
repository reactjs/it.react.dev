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

Se constati di avere bisogno dell'evento del browser sottostante per qualche motivo, puoi ottenerlo semplicemente usando l'attributo `nativeEvent`. Gli eventi sintetici hanno una forma differente rispetto agli eventi nativi del browser. Per esempio: in `onMouseLeave` `event.nativeEvent` punta all'evento `mouseout`. La mappatura specifica non fa parte delle API pubbliche e per questo é soggetta a cambiamenti inaspettati. Ogni `SyntheticEvent` oggetto ha i seguenti attributi:

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
> A partire da v17, `e.persist()` non fa più nulla in quanto `SyntheticEvent` non è più [pooled](/docs/legacy-event-pooling.html).

> Nota:
>
> A partire da v0.14, ritornare `false` da un event handler non fermerà più la propagazione dell'evento. In modo più appropriato, è invece necessario invocare `e.stopPropagation()` o `e.preventDefault()`.

## Eventi Supportati {#supported-events}

React normalizza gli eventi per far sì che abbiano proprietà coerenti in tutti browser.

Gli event handlers di seguito vengono scatenati da un evento nella fase di [bubbling](https://developer.mozilla.org/it/docs/Learn/JavaScript/Building_blocks/Eventi#Event_bubbling_and_capture). Per registrare un event handler per la fase di [capture](https://developer.mozilla.org/it/docs/Learn/JavaScript/Building_blocks/Eventi#Event_bubbling_and_capture), aggiungi `Capture` al nome dell'evento; per esempio, invece di usare `onClick`, useresti `onClickCapture` per gestire l'evento click nella fase di `capture`.

- [Eventi degli Appunti](#clipboard-events)
- [Eventi della Composizione](#composition-events)
- [Eventi della Tastiera](#keyboard-events)
- [Eventi di Focus](#focus-events)
- [Eventi di Form](#form-events)
- [Eventi Generici](#generic-events)
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

```js
DOMEventTarget relatedTarget
```

#### onFocus

The `onFocus` event is called when the element (or some element inside of it) receives focus. For example, it's called when the user clicks on a text input.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```


* * *

### Eventi di Form {#form-events}

Nomi degli eventi:

```
onChange onInput onInvalid onReset onSubmit 
```

Per maggiori informazioni sull'evento onChange, vedi [Forms](/docs/forms.html).

* * *

### Generic Events {#generic-events}

Event names:

```
onError onLoad
```

* * *

### Eventi del Mouse {#mouse-events}

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

>Nota
>
>A partire da React 17, l'evento `onScroll` **non fa bubble** in React. Si comporta quindi come il browser e previene la confusione che si ha quando un elemendo scrollabile nidificato lancia eventi su genitori distanti nel DOM.

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
