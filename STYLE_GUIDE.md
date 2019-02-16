# Guida di Stile Universale

> This Style Guide is based on the [Universal Style Guide](https://github.com/reactjs/reactjs.org-translation/blob/master/style-guide.md)
>
> Questa Guida di Stile è basata sulla [Universal Style Guide](https://github.com/reactjs/reactjs.org-translation/blob/master/style-guide.md)

Questa Guida di Stile descrive le regole che dovrebbero essere applicate a **tutte** le lingue.

NOTA PER I MANUTENTORI: Potreste voler tradurre questa guida in modo che sia più accessibile ai traduttori.

## Glossario

Vedi [qui](https://github.com/reactjs/it.reactjs.org/blob/master/GLOSSARY.md)

## ID delle intestazioni

Tutte le intestazioni hanno degli ID espliciti, ad esempio:

```md
## Try React {#try-react}
```

**Non** tradurre questi ID! Sono utilizzati per la navigazione e non funzioneranno più se il documento è referenziato dall'esterno.

Ad esempio, dato questo link:

```md
See the [beginning section](/getting-started#try-react) for more information.
```

✅ COSÌ VA BENE:

```md
## Prova React {#try-react}
```

❌ COSÌ NO:

```md
## Prova React {#prova-react}
```

Nel secondo modo il link in alto non funzionerà più.

## Testo nei blocchi di codice

Non tradurre il testo nei blocchi di codice, a parte i commenti. Potresti voler tradurre anche il testo delle stringhe, ma fai attenzione a non tradurre le stringhe che costituiscono riferimenti al codice!

Ad esempio:
```js
// Example
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ COSÌ VA BENE:

```js
// Esempio
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ ANCHE COSÌ:

```js
// Esempio
const element = <h1>Ciao mondo</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

❌ COSÌ NO:

```js
// Esempio
const element = <h1>Ciao mondo</h1>;
// "root" fa riferimento all'ID di un elemento.
// NON TRADURLO
ReactDOM.render(element, document.getElementById('radice'));
```

❌ COSÌ DECISAMENTE NO:

```js
// Esempio
const elemento = <h1>Ciao mondo</h1>;
ReactDOM.renderizza(elemento, documento.ottieniElementoDallId('radice'));
```

## Link esterni

Se un link esterno punta ad un articolo di un riferimento come [MDN] o [Wikipedia], ed esiste una versione di quell'articolo nella tua lingua che sia di qualità soddisfacente, puoi valutare di linkare la versione tradotta dell'articolo invece di quella originale.

[MDN]: https://developer.mozilla.org/en-US/
[Wikipedia]: https://en.wikipedia.org/wiki/Main_Page

Esempio:

```md
React elements are [immutable](https://en.wikipedia.org/wiki/Immutable_object).
```

✅ COSÌ VA BENE:

```md
Gli elementi di React sono [immutabili](https://it.wikipedia.org/wiki/Struttura_dati_persistente).
```

Per i link dei quali non esiste una versione tradotta (Stack Overflow, video di YouTube, ecc.), utilizza semplicemente il link in Inglese.
