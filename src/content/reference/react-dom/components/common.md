---
title: "Componenti comuni (es. <div>)"
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/components/common.md).

</Note>

<Intro>

Tutti i componenti browser integrati, come [`<div>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/div), supportano alcune props ed eventi comuni.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### Componenti comuni (es. `<div>`) {/*common*/}

```js
<div className="wrapper">Qualche contenuto</div>
```

[Vedi altri esempi sotto.](#usage)

#### Props {/*common-props*/}

Queste props React speciali sono supportate per tutti i componenti integrati:

* `children`: Un nodo React (un elemento, una stringa, un numero, [un portal,](/reference/react-dom/createPortal) un nodo vuoto come `null`, `undefined` e booleani, oppure un array di altri nodi React). Specifica il contenuto all'interno del componente. Quando usi JSX, di solito specifichi la prop `children` implicitamente annidando tag come `<div><span /></div>`.

* `dangerouslySetInnerHTML`: Un oggetto della forma `{ __html: '<p>some html</p>' }` con una stringa HTML grezza o un valore [`TrustedHTML`](https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML) all'interno. Sostituisce la proprietà [`innerHTML`](https://developer.mozilla.org/it/docs/Web/API/Element/innerHTML) del nodo DOM e visualizza l'HTML passato al suo interno. Va usato con estrema cautela! Se l'HTML al suo interno non è attendibile (ad esempio, se si basa su dati dell'utente), rischi di introdurre una vulnerabilità [XSS](https://it.wikipedia.org/wiki/Cross-site_scripting). [Leggi di più sull'uso di `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: Un oggetto ref da [`useRef`](/reference/react/useRef) o [`createRef`](/reference/react/createRef), oppure una [funzione callback `ref`,](#ref-callback) o una stringa per i [ref legacy.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Il tuo ref verrà popolato con l'elemento DOM di questo nodo. [Leggi di più sulla manipolazione del DOM con i ref.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: Un booleano. Se `true`, sopprime l'avviso che React mostra per gli elementi che hanno sia `children` sia `contentEditable={true}` (che normalmente non funzionano insieme). Usalo se stai costruendo una libreria di input di testo che gestisce manualmente il contenuto `contentEditable`.

* `suppressHydrationWarning`: Un booleano. Se usi la [renderizzazione lato server,](/reference/react-dom/server) normalmente c'è un avviso quando server e client renderizzano contenuti diversi. In alcuni casi rari (come i timestamp), è molto difficile o impossibile garantire una corrispondenza esatta. Se imposti `suppressHydrationWarning` su `true`, React non ti avviserà delle discrepanze negli attributi e nel contenuto di quell'elemento. Funziona solo a un livello di profondità ed è pensato come via di fuga. Non abusarne. [Leggi come sopprimere gli errori di hydration.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: Un oggetto con stili CSS, ad esempio `{ fontWeight: 'bold', margin: 20 }`. Analogamente alla proprietà DOM [`style`](https://developer.mozilla.org/it/docs/Web/API/HTMLElement/style), i nomi delle proprietà CSS devono essere scritti in `camelCase`, ad esempio `fontWeight` invece di `font-weight`. Puoi passare stringhe o numeri come valori. Se passi un numero, come `width: 100`, React aggiungerà automaticamente `px` ("pixel") al valore a meno che non sia una [proprietà senza unità.](https://github.com/react/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Consigliamo di usare `style` solo per stili dinamici in cui non conosci i valori degli stili in anticipo. In altri casi, applicare classi CSS semplici con `className` è più efficiente. [Leggi di più su `className` e `style`.](#applying-css-styles)

Queste props DOM standard sono supportate anche per tutti i componenti integrati:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): Una stringa. Specifica una scorciatoia da tastiera per l'elemento. [Generalmente sconsigliato.](https://developer.mozilla.org/it/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): Gli attributi ARIA ti permettono di specificare le informazioni sull'albero di accessibilità per questo elemento. Vedi [attributi ARIA](https://developer.mozilla.org/it/docs/Web/Accessibility/ARIA/Attributes) per un riferimento completo. In React, tutti i nomi degli attributi ARIA sono esattamente gli stessi dell'HTML.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): Una stringa. Specifica se e come l'input dell'utente deve essere capitalizzato.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): Una stringa. Specifica il nome della classe CSS dell'elemento. [Leggi di più sull'applicazione degli stili CSS.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): Un booleano. Se `true`, il browser permette all'utente di modificare direttamente l'elemento renderizzato. Viene usato per implementare librerie di input di testo ricco come [Lexical.](https://lexical.dev/) React avvisa se provi a passare children React a un elemento con `contentEditable={true}` perché React non sarà in grado di aggiornare il suo contenuto dopo le modifiche dell'utente.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Gli attributi data ti permettono di allegare dati stringa all'elemento, ad esempio `data-fruit="banana"`. In React, non sono comunemente usati perché di solito leggeresti i dati dalle props o dallo state.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): `'ltr'` o `'rtl'`. Specifica la direzione del testo dell'elemento.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): Un booleano. Specifica se l'elemento è trascinabile. Parte dell'[HTML Drag and Drop API.](https://developer.mozilla.org/it/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): Una stringa. Specifica quale azione presentare per il tasto Invio sulle tastiere virtuali.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): Una stringa. Per [`<label>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/label) e [`<output>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/output), ti permette di [associare l'etichetta a un controllo.](/reference/react-dom/components/input#providing-a-label-for-an-input) Come l'[attributo HTML `for`.](https://developer.mozilla.org/it/docs/Web/HTML/Attributes/for) React usa i nomi delle proprietà DOM standard (`htmlFor`) invece dei nomi degli attributi HTML.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): Un booleano o una stringa. Specifica se l'elemento deve essere nascosto.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): Una stringa. Specifica un identificatore univoco per questo elemento, che può essere usato per trovarlo in seguito o collegarlo ad altri elementi. Generalo con [`useId`](/reference/react/useId) per evitare conflitti tra più istanze dello stesso componente.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): Una stringa. Se specificato, il componente si comporterà come un [elemento personalizzato.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): Una stringa. Specifica quale tipo di tastiera visualizzare (ad esempio, testo, numero o telefono).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): Una stringa. Specifica quale proprietà l'elemento rappresenta per i crawler di dati strutturati.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): Una stringa. Specifica la lingua dell'elemento.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): Una funzione [gestore di `AnimationEvent`](#animationevent-handler). Scatta quando un'animazione CSS termina.
* `onAnimationEndCapture`: Una versione di `onAnimationEnd` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): Una funzione [gestore di `AnimationEvent`](#animationevent-handler). Scatta quando termina un'iterazione di un'animazione CSS e ne inizia un'altra.
* `onAnimationIterationCapture`: Una versione di `onAnimationIteration` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): Una funzione [gestore di `AnimationEvent`](#animationevent-handler). Scatta quando inizia un'animazione CSS.
* `onAnimationStartCapture`: `onAnimationStart`, ma scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando viene cliccato un pulsante del pointer non primario.
* `onAuxClickCapture`: Una versione di `onAuxClick` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: Una funzione [gestore di `InputEvent`](#inputevent-handler). Scatta prima che il valore di un elemento modificabile venga modificato. React *non* usa ancora l'evento nativo [`beforeinput`](https://developer.mozilla.org/it/docs/Web/API/HTMLElement/beforeinput_event) e tenta invece di polyfillarlo usando altri eventi.
* `onBeforeInputCapture`: Una versione di `onBeforeInput` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: Una funzione [gestore di `FocusEvent`](#focusevent-handler). Scatta quando un elemento perde il focus. A differenza dell'evento [`blur`](https://developer.mozilla.org/it/docs/Web/API/Element/blur_event) integrato del browser, in React l'evento `onBlur` propaga.
* `onBlurCapture`: Una versione di `onBlur` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando il pulsante primario viene cliccato sul dispositivo di puntamento.
* `onClickCapture`: Una versione di `onClick` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): Una funzione [gestore di `CompositionEvent`](#compositionevent-handler). Scatta quando un [editor di metodo di input](https://developer.mozilla.org/it/docs/Glossary/Input_method_editor) avvia una nuova sessione di composizione.
* `onCompositionStartCapture`: Una versione di `onCompositionStart` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): Una funzione [gestore di `CompositionEvent`](#compositionevent-handler). Scatta quando un [editor di metodo di input](https://developer.mozilla.org/it/docs/Glossary/Input_method_editor) completa o annulla una sessione di composizione.
* `onCompositionEndCapture`: Una versione di `onCompositionEnd` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): Una funzione [gestore di `CompositionEvent`](#compositionevent-handler). Scatta quando un [editor di metodo di input](https://developer.mozilla.org/it/docs/Glossary/Input_method_editor) riceve un nuovo carattere.
* `onCompositionUpdateCapture`: Una versione di `onCompositionUpdate` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando l'utente prova ad aprire un menu contestuale.
* `onContextMenuCapture`: Una versione di `onContextMenu` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): Una funzione [gestore di `ClipboardEvent`](#clipboardevent-handler). Scatta quando l'utente prova a copiare qualcosa negli appunti.
* `onCopyCapture`: Una versione di `onCopy` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): Una funzione [gestore di `ClipboardEvent`](#clipboardevent-handler). Scatta quando l'utente prova a tagliare qualcosa negli appunti.
* `onCutCapture`: Una versione di `onCut` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando l'utente clicca due volte. Corrisponde all'[evento `dblclick` del browser.](https://developer.mozilla.org/it/docs/Web/API/Element/dblclick_event)
* `onDoubleClickCapture`: Una versione di `onDoubleClick` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): Una funzione [gestore di `DragEvent`](#dragevent-handler). Scatta mentre l'utente sta trascinando qualcosa.
* `onDragCapture`: Una versione di `onDrag` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): Una funzione [gestore di `DragEvent`](#dragevent-handler). Scatta quando l'utente smette di trascinare qualcosa.
* `onDragEndCapture`: Una versione di `onDragEnd` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): Una funzione [gestore di `DragEvent`](#dragevent-handler). Scatta quando il contenuto trascinato entra in un target di drop valido.
* `onDragEnterCapture`: Una versione di `onDragEnter` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): Una funzione [gestore di `DragEvent`](#dragevent-handler). Scatta su un target di drop valido mentre il contenuto trascinato viene trascinato sopra di esso. Devi chiamare `e.preventDefault()` qui per consentire il drop.
* `onDragOverCapture`: Una versione di `onDragOver` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): Una funzione [gestore di `DragEvent`](#dragevent-handler). Scatta quando l'utente inizia a trascinare un elemento.
* `onDragStartCapture`: Una versione di `onDragStart` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): Una funzione [gestore di `DragEvent`](#dragevent-handler). Scatta quando qualcosa viene rilasciato su un target di drop valido.
* `onDropCapture`: Una versione di `onDrop` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: Una funzione [gestore di `FocusEvent`](#focusevent-handler). Scatta quando un elemento riceve il focus. A differenza dell'evento [`focus`](https://developer.mozilla.org/it/docs/Web/API/Element/focus_event) integrato del browser, in React l'evento `onFocus` propaga.
* `onFocusCapture`: Una versione di `onFocus` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): Una funzione [gestore di `PointerEvent`](#pointerevent-handler). Scatta quando un elemento cattura programmaticamente un pointer.
* `onGotPointerCaptureCapture`: Una versione di `onGotPointerCapture` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): Una funzione [gestore di `KeyboardEvent`](#keyboardevent-handler). Scatta quando un tasto viene premuto.
* `onKeyDownCapture`: Una versione di `onKeyDown` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): Una funzione [gestore di `KeyboardEvent`](#keyboardevent-handler). Deprecato. Usa `onKeyDown` o `onBeforeInput` al suo posto.
* `onKeyPressCapture`: Una versione di `onKeyPress` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): Una funzione [gestore di `KeyboardEvent`](#keyboardevent-handler). Scatta quando un tasto viene rilasciato.
* `onKeyUpCapture`: Una versione di `onKeyUp` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): Una funzione [gestore di `PointerEvent`](#pointerevent-handler). Scatta quando un elemento smette di catturare un pointer.
* `onLostPointerCaptureCapture`: Una versione di `onLostPointerCapture` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando il puntatore viene premuto.
* `onMouseDownCapture`: Una versione di `onMouseDown` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando il puntatore si sposta all'interno di un elemento. Non ha una fase di capture. Invece, `onMouseLeave` e `onMouseEnter` si propagano dall'elemento che viene lasciato a quello che viene raggiunto.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando il puntatore si sposta fuori da un elemento. Non ha una fase di capture. Invece, `onMouseLeave` e `onMouseEnter` si propagano dall'elemento che viene lasciato a quello che viene raggiunto.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando il puntatore cambia coordinate.
* `onMouseMoveCapture`: Una versione di `onMouseMove` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando il puntatore si sposta fuori da un elemento, o se si sposta in un elemento figlio.
* `onMouseOutCapture`: Una versione di `onMouseOut` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): Una funzione [gestore di `MouseEvent`](#mouseevent-handler). Scatta quando il puntatore viene rilasciato.
* `onMouseUpCapture`: Una versione di `onMouseUp` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): Una funzione [gestore di `PointerEvent`](#pointerevent-handler). Scatta quando il browser annulla un'interazione del pointer.
* `onPointerCancelCapture`: Una versione di `onPointerCancel` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): Una funzione [gestore di `PointerEvent`](#pointerevent-handler). Scatta quando un pointer diventa attivo.
* `onPointerDownCapture`: Una versione di `onPointerDown` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): Una funzione [gestore di `PointerEvent`](#pointerevent-handler). Scatta quando un pointer si sposta all'interno di un elemento. Non ha una fase di capture. Invece, `onPointerLeave` e `onPointerEnter` si propagano dall'elemento che viene lasciato a quello che viene raggiunto.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): Una funzione [gestore di `PointerEvent`](#pointerevent-handler). Scatta quando un pointer si sposta fuori da un elemento. Non ha una fase di capture. Invece, `onPointerLeave` e `onPointerEnter` si propagano dall'elemento che viene lasciato a quello che viene raggiunto.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): Una funzione [gestore di `PointerEvent`](#pointerevent-handler). Scatta quando un pointer cambia coordinate.
* `onPointerMoveCapture`: Una versione di `onPointerMove` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): Una funzione [gestore di `PointerEvent`](#pointerevent-handler). Scatta quando un pointer si sposta fuori da un elemento, se l'interazione del pointer viene annullata, e [per altri motivi.](https://developer.mozilla.org/it/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: Una versione di `onPointerOut` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): Una funzione [gestore di `PointerEvent`](#pointerevent-handler). Scatta quando un pointer non è più attivo.
* `onPointerUpCapture`: Una versione di `onPointerUp` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): Una funzione [gestore di `ClipboardEvent`](#clipboardevent-handler). Scatta quando l'utente prova a incollare qualcosa dagli appunti.
* `onPasteCapture`: Una versione di `onPaste` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando un elemento è stato scrollato. Questo evento non propaga.
* `onScrollCapture`: Una versione di `onScroll` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Una funzione [gestore di `Event`](#event-handler). Scatta dopo che la selezione all'interno di un elemento modificabile come un input cambia. React estende l'evento `onSelect` per funzionare anche con elementi `contentEditable={true}`. Inoltre, React lo estende per scattare con selezione vuota e durante le modifiche (che possono influenzare la selezione).
* `onSelectCapture`: Una versione di `onSelect` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): Una funzione [gestore di `TouchEvent`](#touchevent-handler). Scatta quando il browser annulla un'interazione touch.
* `onTouchCancelCapture`: Una versione di `onTouchCancel` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): Una funzione [gestore di `TouchEvent`](#touchevent-handler). Scatta quando uno o più punti touch vengono rimossi.
* `onTouchEndCapture`: Una versione di `onTouchEnd` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): Una funzione [gestore di `TouchEvent`](#touchevent-handler). Scatta quando uno o più punti touch vengono spostati.
* `onTouchMoveCapture`: Una versione di `onTouchMove` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): Una funzione [gestore di `TouchEvent`](#touchevent-handler). Scatta quando uno o più punti touch vengono posizionati.
* `onTouchStartCapture`: Una versione di `onTouchStart` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): Una funzione [gestore di `TransitionEvent`](#transitionevent-handler). Scatta quando una transizione CSS termina.
* `onTransitionEndCapture`: Una versione di `onTransitionEnd` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): Una funzione [gestore di `WheelEvent`](#wheelevent-handler). Scatta quando l'utente ruota una rotella.
* `onWheelCapture`: Una versione di `onWheel` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Una stringa. Specifica esplicitamente il ruolo dell'elemento per le tecnologie assistive.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Una stringa. Specifica il nome dello slot quando usi lo shadow DOM. In React, un pattern equivalente si ottiene tipicamente passando JSX come props, ad esempio `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): Un booleano o null. Se impostato esplicitamente su `true` o `false`, abilita o disabilita il controllo ortografico.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): Un numero. Sostituisce il comportamento predefinito del tasto Tab. [Evita di usare valori diversi da `-1` e `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): Una stringa. Specifica il testo del tooltip per l'elemento.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): `'yes'` o `'no'`. Passare `'no'` esclude il contenuto dell'elemento dalla traduzione.

Puoi anche passare attributi personalizzati come props, ad esempio `mycustomprop="someValue"`. Può essere utile quando integri librerie di terze parti. Il nome dell'attributo personalizzato deve essere minuscolo e non deve iniziare con `on`. Il valore verrà convertito in stringa. Se passi `null` o `undefined`, l'attributo personalizzato verrà rimosso.

Questi eventi scattano solo per gli elementi [`<form>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/form):

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando un form viene resettato.
* `onResetCapture`: Una versione di `onReset` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando un form viene inviato.
* `onSubmitCapture`: Una versione di `onSubmit` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)

Questi eventi scattano solo per gli elementi [`<dialog>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/dialog). A differenza degli eventi del browser, in React propagano:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando l'utente prova a chiudere il dialog.
* `onCancelCapture`: Una versione di `onCancel` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando un dialog è stato chiuso.
* `onCloseCapture`: Una versione di `onClose` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)

Questi eventi scattano solo per gli elementi [`<details>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/details). A differenza degli eventi del browser, in React propagano:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando l'utente attiva/disattiva i details.
* `onToggleCapture`: Una versione di `onToggle` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)

Questi eventi scattano per elementi [`<img>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/link) e [SVG `<image>`](https://developer.mozilla.org/it/docs/Web/SVG/Tutorial/SVG_Image_Tag). A differenza degli eventi del browser, in React propagano:

* `onLoad`: Una funzione [gestore di `Event`](#event-handler). Scatta quando la risorsa è stata caricata.
* `onLoadCapture`: Una versione di `onLoad` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando la risorsa non ha potuto essere caricata.
* `onErrorCapture`: Una versione di `onError` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)

Questi eventi scattano per risorse come [`<audio>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/audio) e [`<video>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/video). A differenza degli eventi del browser, in React propagano:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando la risorsa non è stata completamente caricata, ma non a causa di un errore.
* `onAbortCapture`: Una versione di `onAbort` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando ci sono abbastanza dati per iniziare la riproduzione, ma non abbastanza per riprodurre fino alla fine senza buffering.
* `onCanPlayCapture`: Una versione di `onCanPlay` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando ci sono abbastanza dati per far risultare probabile l'avvio della riproduzione senza buffering fino alla fine.
* `onCanPlayThroughCapture`: Una versione di `onCanPlayThrough` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando la durata del media è stata aggiornata.
* `onDurationChangeCapture`: Una versione di `onDurationChange` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il media è diventato vuoto.
* `onEmptiedCapture`: Una versione di `onEmptied` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Una funzione [gestore di `Event`](#event-handler). Scatta quando il browser incontra media crittografati.
* `onEncryptedCapture`: Una versione di `onEncrypted` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando la riproduzione si ferma perché non c'è più nulla da riprodurre.
* `onEndedCapture`: Una versione di `onEnded` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando la risorsa non ha potuto essere caricata.
* `onErrorCapture`: Una versione di `onError` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il frame di riproduzione corrente è stato caricato.
* `onLoadedDataCapture`: Una versione di `onLoadedData` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando i metadati sono stati caricati.
* `onLoadedMetadataCapture`: Una versione di `onLoadedMetadata` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il browser ha iniziato a caricare la risorsa.
* `onLoadStartCapture`: Una versione di `onLoadStart` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il media è stato messo in pausa.
* `onPauseCapture`: Una versione di `onPause` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il media non è più in pausa.
* `onPlayCapture`: Una versione di `onPlay` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il media inizia o riprende la riproduzione.
* `onPlayingCapture`: Una versione di `onPlaying` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): Una funzione [gestore di `Event`](#event-handler). Scatta periodicamente mentre la risorsa è in caricamento.
* `onProgressCapture`: Una versione di `onProgress` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando la velocità di riproduzione cambia.
* `onRateChangeCapture`: Una versione di `onRateChange` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* `onResize`: Una funzione [gestore di `Event`](#event-handler). Scatta quando le dimensioni del video cambiano.
* `onResizeCapture`: Una versione di `onResize` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando un'operazione di seek termina.
* `onSeekedCapture`: Una versione di `onSeeked` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando inizia un'operazione di seek.
* `onSeekingCapture`: Una versione di `onSeeking` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il browser attende dati ma questi continuano a non caricarsi.
* `onStalledCapture`: Una versione di `onStalled` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il caricamento della risorsa è stato sospeso.
* `onSuspendCapture`: Una versione di `onSuspend` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il tempo di riproduzione corrente viene aggiornato.
* `onTimeUpdateCapture`: Una versione di `onTimeUpdate` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando il volume è cambiato.
* `onVolumeChangeCapture`: Una versione di `onVolumeChange` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): Una funzione [gestore di `Event`](#event-handler). Scatta quando la riproduzione si è fermata per mancanza temporanea di dati.
* `onWaitingCapture`: Una versione di `onWaiting` che scatta nella [fase di capture.](/learn/responding-to-events#capture-phase-events)

#### Caveats {/*common-caveats*/}

- Non puoi passare contemporaneamente sia `children` sia `dangerouslySetInnerHTML`.
- Alcuni eventi (come `onAbort` e `onLoad`) non propagano nel browser, ma propagano in React.

---

### Funzione callback `ref` {/*ref-callback*/}

Invece di un oggetto ref (come quello restituito da [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), puoi passare una funzione all'attributo `ref`.

```js
<div ref={(node) => {
  console.log('Attached', node);

  return () => {
    console.log('Clean up', node)
  }
}}>
```

[Vedi un esempio di utilizzo della callback `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Quando il nodo DOM `<div>` viene aggiunto allo schermo, React chiamerà la tua callback `ref` con il `node` DOM come argomento. Quando quel nodo DOM `<div>` viene rimosso, React chiamerà la funzione di cleanup restituita dalla callback.

React chiamerà anche la tua callback `ref` ogni volta che passi una callback `ref` *diversa*. Nell'esempio sopra, `(node) => { ... }` è una funzione diversa a ogni renderizzazione. Quando il tuo componente viene ri-renderizzato, la funzione *precedente* verrà chiamata con `null` come argomento, e la funzione *successiva* verrà chiamata con il nodo DOM.

#### Parameters {/*ref-callback-parameters*/}

* `node`: Un nodo DOM. React ti passerà il nodo DOM quando il ref viene collegato. A meno che tu non passi lo stesso riferimento di funzione per la callback `ref` a ogni renderizzazione, la callback verrà temporaneamente pulita e ricreata a ogni ri-renderizzazione del componente.

<Note>

#### React 19 ha aggiunto funzioni di cleanup per le callback `ref`. {/*react-19-added-cleanup-functions-for-ref-callbacks*/}

Per supportare la retrocompatibilità, se una funzione di cleanup non viene restituita dalla callback `ref`, `node` verrà chiamato con `null` quando il `ref` viene scollegato. Questo comportamento verrà rimosso in una versione futura.

</Note>

#### Returns {/*returns*/}

* **opzionale** `cleanup function`: Quando il `ref` viene scollegato, React chiamerà la funzione di cleanup. Se una funzione non viene restituita dalla callback `ref`, React chiamerà di nuovo la callback con `null` come argomento quando il `ref` viene scollegato. Questo comportamento verrà rimosso in una versione futura.

#### Caveats {/*caveats*/}

* Quando Strict Mode è attivo, React **eseguirà un ciclo aggiuntivo setup+cleanup solo in sviluppo** prima del primo setup reale. È un stress test che assicura che la tua logica di cleanup "specchi" la logica di setup e che fermi o annulli ciò che il setup sta facendo. Se questo causa un problema, implementa la funzione di cleanup.
* Quando passi una callback `ref` *diversa*, React chiamerà la funzione di cleanup della callback *precedente* se fornita. Se nessuna funzione di cleanup è definita, la callback `ref` verrà chiamata con `null` come argomento. La funzione *successiva* verrà chiamata con il nodo DOM.

---

### Oggetto evento React {/*react-event-object*/}

I tuoi gestori di eventi riceveranno un *oggetto evento React.* È anche talvolta noto come "evento sintetico".

```js
<button onClick={e => {
  console.log(e); // React event object
}} />
```

Rispetta lo stesso standard degli eventi DOM sottostanti, ma corregge alcune inconsistenze del browser.

Alcuni eventi React non corrispondono direttamente agli eventi nativi del browser. Ad esempio in `onMouseLeave`, `e.nativeEvent` punterà a un evento `mouseout`. La mappatura specifica non fa parte dell'API pubblica e potrebbe cambiare in futuro. Se hai bisogno dell'evento browser sottostante per qualche motivo, leggilo da `e.nativeEvent`.

#### Proprietà {/*react-event-object-properties*/}

Gli oggetti evento React implementano alcune delle proprietà standard [`Event`](https://developer.mozilla.org/it/docs/Web/API/Event):

* [`bubbles`](https://developer.mozilla.org/it/docs/Web/API/Event/bubbles): Un booleano. Restituisce se l'evento propaga attraverso il DOM.
* [`cancelable`](https://developer.mozilla.org/it/docs/Web/API/Event/cancelable): Un booleano. Restituisce se l'evento può essere annullato.
* [`currentTarget`](https://developer.mozilla.org/it/docs/Web/API/Event/currentTarget): Un nodo DOM. Restituisce il nodo a cui il gestore corrente è collegato nell'albero React.
* [`defaultPrevented`](https://developer.mozilla.org/it/docs/Web/API/Event/defaultPrevented): Un booleano. Restituisce se `preventDefault` è stato chiamato.
* [`eventPhase`](https://developer.mozilla.org/it/docs/Web/API/Event/eventPhase): Un numero. Restituisce in quale fase si trova attualmente l'evento.
* [`isTrusted`](https://developer.mozilla.org/it/docs/Web/API/Event/isTrusted): Un booleano. Restituisce se l'evento è stato avviato dall'utente.
* [`target`](https://developer.mozilla.org/it/docs/Web/API/Event/target): Un nodo DOM. Restituisce il nodo su cui l'evento si è verificato (che potrebbe essere un discendente distante).
* [`timeStamp`](https://developer.mozilla.org/it/docs/Web/API/Event/timeStamp): Un numero. Restituisce l'ora in cui l'evento si è verificato.

Inoltre, gli oggetti evento React forniscono queste proprietà:

* `nativeEvent`: Un [`Event`](https://developer.mozilla.org/it/docs/Web/API/Event) DOM. L'oggetto evento originale del browser.

#### Metodi {/*react-event-object-methods*/}

Gli oggetti evento React implementano alcuni dei metodi standard [`Event`](https://developer.mozilla.org/it/docs/Web/API/Event):

* [`preventDefault()`](https://developer.mozilla.org/it/docs/Web/API/Event/preventDefault): Impedisce l'azione predefinita del browser per l'evento.
* [`stopPropagation()`](https://developer.mozilla.org/it/docs/Web/API/Event/stopPropagation): Interrompe la propagazione dell'evento attraverso l'albero React.

Inoltre, gli oggetti evento React forniscono questi metodi:

* `isDefaultPrevented()`: Restituisce un boolean value indicating whether `preventDefault` was called.
* `isPropagationStopped()`: Restituisce un boolean value indicating whether `stopPropagation` was called.
* `persist()`: Non usato con React DOM. Con React Native, chiamalo per leggere le proprietà dell'evento dopo l'evento.
* `isPersistent()`: Non usato con React DOM. Con React Native, restituisce se `persist` è stato chiamato.

#### Caveats {/*react-event-object-caveats*/}

* I valori di `currentTarget`, `eventPhase`, `target` e `type` riflettono i valori che il tuo codice React si aspetta. Sotto il cofano, React collega i gestori di eventi alla radice, ma questo non si riflette negli oggetti evento React. Ad esempio, `e.currentTarget` potrebbe non essere lo stesso di `e.nativeEvent.currentTarget` sottostante. Per eventi polyfillati, `e.type` (tipo evento React) potrebbe differire da `e.nativeEvent.type` (tipo sottostante).

---

### Funzione gestore `AnimationEvent` {/*animationevent-handler*/}

Un tipo di gestore di eventi per gli [eventi di animazione CSS](https://developer.mozilla.org/it/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Parameters {/*animationevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`AnimationEvent`](https://developer.mozilla.org/it/docs/Web/API/AnimationEvent):
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### Funzione gestore `ClipboardEvent` {/*clipboadevent-handler*/}

Un tipo di gestore di eventi per gli eventi della [Clipboard API](https://developer.mozilla.org/it/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Parameters {/*clipboadevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`ClipboardEvent`](https://developer.mozilla.org/it/docs/Web/API/ClipboardEvent):

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### Funzione gestore `CompositionEvent` {/*compositionevent-handler*/}

Un tipo di gestore di eventi per gli eventi dell'[editor di metodo di input (IME)](https://developer.mozilla.org/it/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Parameters {/*compositionevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`CompositionEvent`](https://developer.mozilla.org/it/docs/Web/API/CompositionEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### Funzione gestore `DragEvent` {/*dragevent-handler*/}

Un tipo di gestore di eventi per gli eventi dell'[HTML Drag and Drop API](https://developer.mozilla.org/it/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Sorgente drag
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Target di drop
  </div>
</>
```

#### Parameters {/*dragevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`DragEvent`](https://developer.mozilla.org/it/docs/Web/API/DragEvent):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  Include anche le proprietà [`MouseEvent`](https://developer.mozilla.org/it/docs/Web/API/MouseEvent) ereditate:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Include anche le proprietà [`UIEvent`](https://developer.mozilla.org/it/docs/Web/API/UIEvent) ereditate:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Funzione gestore `FocusEvent` {/*focusevent-handler*/}

Un tipo di gestore di eventi per gli eventi di focus.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Vedi un esempio.](#handling-focus-events)

#### Parameters {/*focusevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`FocusEvent`](https://developer.mozilla.org/it/docs/Web/API/FocusEvent):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  Include anche le proprietà [`UIEvent`](https://developer.mozilla.org/it/docs/Web/API/UIEvent) ereditate:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Funzione gestore `Event` {/*event-handler*/}

Un tipo di gestore di eventi per eventi generici.

#### Parameters {/*event-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) senza proprietà aggiuntive.

---

### Funzione gestore `InputEvent` {/*inputevent-handler*/}

Un tipo di gestore di eventi per l'evento `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Parameters {/*inputevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`InputEvent`](https://developer.mozilla.org/it/docs/Web/API/InputEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### Funzione gestore `KeyboardEvent` {/*keyboardevent-handler*/}

Un tipo di gestore di eventi per gli eventi da tastiera.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Vedi un esempio.](#handling-keyboard-events)

#### Parameters {/*keyboardevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`KeyboardEvent`](https://developer.mozilla.org/it/docs/Web/API/KeyboardEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  Include anche le proprietà [`UIEvent`](https://developer.mozilla.org/it/docs/Web/API/UIEvent) ereditate:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Funzione gestore `MouseEvent` {/*mouseevent-handler*/}

Un tipo di gestore di eventi per gli eventi del mouse.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[Vedi un esempio.](#handling-mouse-events)

#### Parameters {/*mouseevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`MouseEvent`](https://developer.mozilla.org/it/docs/Web/API/MouseEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Include anche le proprietà [`UIEvent`](https://developer.mozilla.org/it/docs/Web/API/UIEvent) ereditate:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Funzione gestore `PointerEvent` {/*pointerevent-handler*/}

Un tipo di gestore di eventi per gli [eventi pointer.](https://developer.mozilla.org/it/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[Vedi un esempio.](#handling-pointer-events)

#### Parameters {/*pointerevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`PointerEvent`](https://developer.mozilla.org/it/docs/Web/API/PointerEvent):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  Include anche le proprietà [`MouseEvent`](https://developer.mozilla.org/it/docs/Web/API/MouseEvent) ereditate:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Include anche le proprietà [`UIEvent`](https://developer.mozilla.org/it/docs/Web/API/UIEvent) ereditate:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Funzione gestore `TouchEvent` {/*touchevent-handler*/}

Un tipo di gestore di eventi per gli [eventi touch.](https://developer.mozilla.org/it/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Parameters {/*touchevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`TouchEvent`](https://developer.mozilla.org/it/docs/Web/API/TouchEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)

  Include anche le proprietà [`UIEvent`](https://developer.mozilla.org/it/docs/Web/API/UIEvent) ereditate:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Funzione gestore `TransitionEvent` {/*transitionevent-handler*/}

Un tipo di gestore di eventi per gli eventi di transizione CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Parameters {/*transitionevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`TransitionEvent`](https://developer.mozilla.org/it/docs/Web/API/TransitionEvent):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### Funzione gestore `UIEvent` {/*uievent-handler*/}

Un tipo di gestore di eventi per eventi UI generici.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parameters {/*uievent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`UIEvent`](https://developer.mozilla.org/it/docs/Web/API/UIEvent):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Funzione gestore `WheelEvent` {/*wheelevent-handler*/}

Un tipo di gestore di eventi per l'evento `onWheel`.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Parameters {/*wheelevent-handler-parameters*/}

* `e`: Un [oggetto evento React](#react-event-object) con queste proprietà aggiuntive [`WheelEvent`](https://developer.mozilla.org/it/docs/Web/API/WheelEvent):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  Include anche le proprietà [`MouseEvent`](https://developer.mozilla.org/it/docs/Web/API/MouseEvent) ereditate:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Include anche le proprietà [`UIEvent`](https://developer.mozilla.org/it/docs/Web/API/UIEvent) ereditate:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Usage {/*usage*/}

### Applicare stili CSS {/*applying-css-styles*/}

In React, specifichi una classe CSS con [`className`.](https://developer.mozilla.org/it/docs/Web/API/Element/className) Funziona come l'attributo `class` in HTML:

```js
<img className="avatar" />
```

Poi scrivi le regole CSS in un file CSS separato:

```css
/* Nel tuo CSS */
.avatar {
  border-radius: 50%;
}
```

React non prescrive come aggiungere file CSS. Nel caso più semplice, aggiungerai un tag [`<link>`](https://developer.mozilla.org/it/docs/Web/HTML/Element/link) al tuo HTML. Se usi un build tool o un framework, consulta la sua documentazione per sapere come aggiungere un file CSS al tuo progetto.

A volte, i valori degli stili dipendono dai dati. Usa l'attributo `style` per passare alcuni stili dinamicamente:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


Nell'esempio sopra, `style={{}}` non è una sintassi speciale, ma un normale oggetto `{}` all'interno delle [parentesi graffe JSX](/learn/javascript-in-jsx-with-curly-braces) di `style={ }`. Consigliamo di usare l'attributo `style` solo quando i tuoi stili dipendono da variabili JavaScript.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### Come applicare più classi CSS condizionalmente? {/*how-to-apply-multiple-css-classes-conditionally*/}

Per applicare classi CSS condizionalmente, devi produrre la stringa `className` tu stesso usando JavaScript.

Ad esempio, `className={'row ' + (isSelected ? 'selected': '')}` produrrà `className="row"` o `className="row selected"` a seconda che `isSelected` sia `true`.

Per renderlo più leggibile, puoi usare una piccola libreria helper come [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

È particolarmente comodo se hai più classi condizionali:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Manipolare un nodo DOM con un ref {/*manipulating-a-dom-node-with-a-ref*/}

A volte, avrai bisogno di ottenere il nodo DOM del browser associato a un tag in JSX. Ad esempio, se vuoi mettere a fuoco un `<input>` quando viene cliccato un bottone, devi chiamare [`focus()`](https://developer.mozilla.org/it/docs/Web/API/HTMLElement/focus) sul nodo DOM `<input>` del browser.

Per ottenere il nodo DOM del browser per un tag, [dichiara un ref](/reference/react/useRef) e passalo come attributo `ref` a quel tag:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React inserirà il nodo DOM in `inputRef.current` dopo che è stato renderizzato sullo schermo.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Metti a fuoco l'input
      </button>
    </>
  );
}
```

</Sandpack>

Leggi di più sulla [manipolazione del DOM con i ref](/learn/manipulating-the-dom-with-refs) e [consulta altri esempi.](/reference/react/useRef#usage)

Per casi d'uso più avanzati, l'attributo `ref` accetta anche una [funzione callback.](#ref-callback)

---

### Impostare pericolosamente l'inner HTML {/*dangerously-setting-the-inner-html*/}

Puoi passare una stringa HTML grezza o un valore [`TrustedHTML`](https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML) a un elemento così:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Questo è pericoloso. Come con la proprietà DOM [`innerHTML`](https://developer.mozilla.org/it/docs/Web/API/Element/innerHTML) sottostante, devi usare estrema cautela! A meno che il markup non provenga da una fonte completamente attendibile, è banale introdurre una vulnerabilità [XSS](https://it.wikipedia.org/wiki/Cross-site_scripting) in questo modo.**

Se il tuo sito applica [Trusted Types](https://developer.mozilla.org/it/docs/Web/API/Trusted_Types_API), passa un valore `TrustedHTML` creato dalla tua policy di sicurezza come `__html`. React passa il valore al browser senza convertirlo in stringa, permettendo al browser di validarlo. La tua policy deve comunque assicurare che qualsiasi input usato per creare il valore sia attendibile e sanitizzato.

Ad esempio, se usi una libreria Markdown che converte Markdown in HTML, ti fidi che il suo parser non contenga bug, e l'utente vede solo il proprio input, puoi visualizzare l'HTML risultante così:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Inserisci del markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // Questo è sicuro SOLO perché l'HTML in output
  // viene mostrato allo stesso utente, e perché ti
  // fidi che questo parser Markdown non abbia bug.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

L'oggetto `{__html}` dovrebbe essere creato il più vicino possibile al punto in cui l'HTML viene generato, come fa l'esempio sopra nella funzione `renderMarkdownToHTML`. Questo assicura che tutto l'HTML grezzo usato nel tuo codice sia esplicitamente contrassegnato come tale, e che solo le variabili che ti aspetti contengano HTML vengano passate a `dangerouslySetInnerHTML`. Non è consigliato creare l'oggetto inline come `<div dangerouslySetInnerHTML={{__html: markup}} />`.

Per capire perché renderizzare HTML arbitrario è pericoloso, sostituisci il codice sopra con questo:

```js {1-4,7,8}
const post = {
  // Immagina che questo contenuto sia salvato nel database.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 BUCO DI SICUREZZA: passare input non attendibile a dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

Il codice incorporato nell'HTML verrà eseguito. Un hacker potrebbe usare questo buco di sicurezza per rubare informazioni dell'utente o eseguire azioni per conto suo. **Usa `dangerouslySetInnerHTML` solo con dati attendibili e sanitizzati.**

---

### Gestire eventi del mouse {/*handling-mouse-events*/}

Questo esempio mostra alcuni comuni [eventi del mouse](#mouseevent-handler) e quando scattano.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        Primo bottone
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Secondo bottone
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Gestire eventi pointer {/*handling-pointer-events*/}

Questo esempio mostra alcuni comuni [eventi pointer](#pointerevent-handler) e quando scattano.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        Primo figlio
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Secondo figlio
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Gestire eventi di focus {/*handling-focus-events*/}

In React, gli [eventi di focus](#focusevent-handler) propagano. Puoi usare `currentTarget` e `relatedTarget` per distinguere se gli eventi di focus o blur hanno origine al di fuori dell'elemento genitore. L'esempio mostra come rilevare il focus su un figlio, il focus sull'elemento genitore e come rilevare l'ingresso o l'uscita del focus dall'intero sottoalbero.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Non scatta quando si scambia il focus tra i figli
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Non scatta quando si scambia il focus tra i figli
          console.log('focus left parent');
        }
      }}
    >
      <label>
        Nome:
        <input name="firstName" />
      </label>
      <label>
        Cognome:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Gestire eventi da tastiera {/*handling-keyboard-events*/}

Questo esempio mostra alcuni comuni [eventi da tastiera](#keyboardevent-handler) e quando scattano.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      Nome:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
