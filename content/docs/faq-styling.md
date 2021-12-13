---
id: faq-styling
title: Stili e CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Come posso aggiungere una classe CSS al mio componente? {#how-do-i-add-css-classes-to-components}

Puoi utilizzare l'apposita prop `className`, e passare al suo interno una stringa con il nome della classe che vuoi utilizzare.

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

Una pratica comune è quella di applicare o rimuovere classi CSS in base allo state o alle props del componente:

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>Suggerimento
>
>Se ti ritrovi spesso a scrivere codice in questo modo, il package [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) potrebbe esserti utile.

### Posso utilizzare inline styling? {#can-i-use-inline-styles}

Si, consulta la documentazione a riguardo [qui](/docs/dom-elements.html#style).

### Utilizzare inline styling è una cattiva idea? {#are-inline-styles-bad}

In linea di massima, l'utilizzo di classi comporta una performance migliore rispetto all'inline styling.

### Che cos'è CSS-in-JS? {#what-is-css-in-js}

Con "CSS-in-JS" si intende la pratica di definire styling CSS direttamente all'interno di un file JavaScript, anziché utilizzare dei file esterni.

_Tieni presente che questa funzionalità non è parte di React, ma è fornita da librerie esterne._ React non fornisce particolari indicazioni su come e dove definire lo styling. Nel dubbio, un buon punto di partenza é quello di definire il tuo styling in un file `*.css` separato, ed utilizzare cio che é definito al suo interno tramite [`className`](/docs/dom-elements.html#classname).

### Posso utilizzare animazioni in React? {#can-i-do-animations-in-react}

<<<<<<< HEAD
React può essere utilizzato per qualsiasi tipo di animazione. Prova a dare un'occhiata a [React Transition Group](https://reactcommunity.org/react-transition-group/), [React Motion](https://github.com/chenglou/react-motion) o [React Spring](https://github.com/react-spring/react-spring).
=======
React can be used to power animations. See [React Transition Group](https://reactcommunity.org/react-transition-group/), [React Motion](https://github.com/chenglou/react-motion), [React Spring](https://github.com/react-spring/react-spring), or [Framer Motion](https://framer.com/motion), for example.
>>>>>>> 014f4890dc30a3946c63f83b06883241ddc9bc75
