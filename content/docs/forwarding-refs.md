---
id: forwarding-refs
title: Inoltrare Refs
permalink: docs/forwarding-refs.html
---

<<<<<<< HEAD
L'inoltro delle ref è una tecnica per passare automaticamente una [ref](/docs/refs-and-the-dom.html) attraverso un componente ad uno dei suoi figli. Tipicamente questo non è necessario per la maggior parte dei componenti dell'applicazione. Può comunque essere molto utile per alcuni tipi di componenti, specialmente per i componenti riusabili appartenenti alle librerie. Lo scenario più comune è descritto di seguito.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Manipulating the DOM with Refs](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs)
> - [`forwardRef`](https://beta.reactjs.org/reference/react/forwardRef)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Ref forwarding is a technique for automatically passing a [ref](/docs/refs-and-the-dom.html) through a component to one of its children. This is typically not necessary for most components in the application. However, it can be useful for some kinds of components, especially in reusable component libraries. The most common scenarios are described below.
>>>>>>> ba290ad4e432f47a2a2f88d067dacaaa161b5200

## Inoltro delle refs ai componenti del DOM {#forwarding-refs-to-dom-components}

Considera di avere un componente `FancyButton` che renderizza l'elemento nativo del DOM `button`
:`embed:forwarding-refs/fancy-button-simple.js`

I componenti React nascondono i dettagli della loro implementazione, incluso il loro output renderizzato. Altri componenti che usano `FancyButton` **solitamente non hanno bisogno di** [ottenere una ref](/docs/refs-and-the-dom.html) dell'elemento interno del DOM `button`. Ciò è ottimo perché previene ai componenti di affidarsi troppo alla struttura DOM l'uno dell'altro.

Sebbene questa incapsulazione sia desiderabile per componenti a livello applicativo come `FeedStory` o `Comment`, può essere conveniente per componenti "foglia" altamente riutilizzabili come `FancyButton` o `MyTextInput`. Questi componenti tendono ad essere utilizzati attraverso l'applicazione in modo simile agli elementi del DOM `button` e `input` e l'accesso ai loro nodi DOM può essere inevitabile per la gestione di messa a fuoco, selezione, o animazioni. 

**L'inoltro delle refs è una feature opt-in che permette ad alcuni componenti di prendere le `ref` che ricevono e passarle in basso (in altre parole avanti) ai suoi figli.**

Nell'esempio seguente, `FancyButton` utilizza `React.forwardRef` per ottenere la `ref` passata, dopodiché la passa all'elemento del DOM `button` che la renderizza:

`embed:forwarding-refs/fancy-button-simple-ref.js`

In questo modo i componenti che usano `FancyButton` possono ottenere una ref al nodo del DOM `button` e accedervi, se necessario, proprio come se utilizzassero l'elemento del DOM `button` direttamente.

Qui puoi trovare una spiegazione passo passo di quello che succede nel precedente esempio:

1. Creiamo una [ref React](/docs/refs-and-the-dom.html) chiamando `React.createRef` e assegnandola ad una variabile `ref`.
2. Passiamo la nostra `ref` a `<FancyButton ref={ref}>` specificandola come un attributo JSX.
3. React passa la `ref` alla funzione `(props, ref) => ...` all'interno di `forwardRef` come secondo argomento.
4. Passiamo questo argomento `ref` a `<button ref={ref}>` specificandolo come attributo JSX.
5. Quando la ref è attaccata, `ref.current` punterà all'elemento del DOM `button`.

>Nota
>
> Il secondo argomento `ref` esiste solamente quando viene definito un componente con la chiamata `React.forwardRef`. I componenti di tipo classe e di tipo funzione non ricevono l'argomento `ref` e la `ref` non è disponibile nemmeno nelle props.
>
> L'inoltro delle Ref non è limitato ai componenti del DOM. Possiamo passare le refs anche ad istanze di componenti classe.

## Nota per i mantenitori di librerie di componenti {#note-for-component-library-maintainers}

**Quando inizi ad usare `forwardRef` nelle librerie di componenti, dovresti trattarlo come una breaking change e rilasciare una nuova versione della libreria.** Questo perché la tua libreria probabilmente ha un comportamento diverso (ad esempio nel modo in cui le ref sono assegnate e i tipi che sono esportati), e questo può rompere applicazioni e altre librerie che dipendono da questo vecchio comportamento.

Applicare in modo condizionale le `React.forwardRef` quando esistono non è raccomandato per alcune ragioni: cambiano il comportamento della tua libreria e possono rompere le applicazioni degli utenti quando questi aggiornano React.

## Inoltro delle refs in componenti di tipo higher-order {#forwarding-refs-in-higher-order-components}

Questa tecnica può anche essere particolarmente utile con [componenti di tipo higher-order](/docs/higher-order-components.html) (conosciuti anche come HOC). Iniziamo con un esempio che logga le props di un componente in console:
`embed:forwarding-refs/log-props-before.js`

L'HOC "logProps" passa tutte le `props` attraverso il componente che lo contiene, in questo modo l'output renderizzato sarà il solito. Ad esempio possiamo usare l'HOC per stampare tutte le props passate al componente `FancyButton`:
`embed:forwarding-refs/fancy-button.js`

C'è un avvertimento all'esempio precedente: le refs non saranno passate attraverso di esso. Questo perché una `ref` non è una prop. Come la `key`, è maneggiata in modo diverso da React. Se vuoi aggiungere una ref ad un HOC, la ref dovrà riferirsi ad un componente container più esterno, non al componente che lo contiene.

Questo significa che le refs per il nostro componente `FancyButton` saranno attaccate al componente `LogProps`:
`embed:forwarding-refs/fancy-button-ref.js`

Fortunatamente possiamo passare le refs esplicitamente al componente interno `FancyButton` utilizzando le API `React.forwardRef`. `React.forwardRef` accetta una funzione di renderizzazione che riceve le `props` e le `ref` come parametri e le ritorna ad un nodo React. Ad esempio:
`embed:forwarding-refs/log-props-after.js`

## Mostrare un nome custom negli strumenti dello sviluppatore {#displaying-a-custom-name-in-devtools}

`React.forwardRef` accetta una funzione di renderizzazione. Gli strumenti per gli sviluppatori di React utilizzano questa funzione per determinare cosa mostrare per l'inoltro al componente.

Ad esempio, il seguente componente apparirà come "*ForwardRef*" negli strumenti per sviluppatori:

`embed:forwarding-refs/wrapped-component.js`

Se assegni un nome alla funzione di renderizzazione, gli strumenti per sviluppatori includeranno anche il suo nome (ad esempio "*ForwardRef(myFunction)*")

`embed:forwarding-refs/wrapped-component-with-function-name.js`

Puoi anche settare la proprietà `displayName` della funzione per includere il componente che stai avvolgendo:

`embed:forwarding-refs/customized-display-name.js`
