---
title: "Il piano per React 18"
author: Andrew Clark, Brian Vaughn, Christine Abernathy, Dan Abramov, Rachel Nabors, Rick Hanlon, Sebastian Markbage, and Seth Webster
date: 2021/06/08
description: Il team React è entusiasta di condividere alcuni aggiornamenti. Abbiamo iniziato a lavorare al rilascio di React 18, che sarà la nostra prossima versione major. Abbiamo creato un Working Group per preparare la community all'adozione graduale delle nuove funzionalità in React 18. Abbiamo pubblicato una React 18 Alpha affinché gli autori di librerie possano provarla e fornire feedback...
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2021/06/08/the-plan-for-react-18.md).

</Note>

8 giugno 2021 di [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage) e [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

Il team React è entusiasta di condividere alcuni aggiornamenti:

1. Abbiamo iniziato a lavorare al rilascio di React 18, che sarà la nostra prossima versione major.
2. Abbiamo creato un Working Group per preparare la community all'adozione graduale delle nuove funzionalità in React 18.
3. Abbiamo pubblicato una React 18 Alpha affinché gli autori di librerie possano provarla e fornire feedback.

Questi aggiornamenti sono rivolti principalmente ai maintainer di librerie di terze parti. Se stai imparando, insegnando o usando React per costruire applicazioni rivolte agli utenti, puoi ignorare tranquillamente questo post. Ma sei il benvenuto a seguire le discussioni nel React 18 Working Group, se sei curioso!

---

</Intro>

## Cosa arriverà in React 18 {/*whats-coming-in-react-18*/}

Quando sarà rilasciato, React 18 includerà miglioramenti pronti all'uso (come il [raggruppamento automatico](https://github.com/reactwg/react-18/discussions/21)), nuove API (come [`startTransition`](https://github.com/reactwg/react-18/discussions/41)) e un [nuovo renderer server in streaming](https://github.com/reactwg/react-18/discussions/37) con supporto integrato per `React.lazy`.

Queste funzionalità sono possibili grazie a un nuovo meccanismo opt-in che aggiungiamo in React 18. Si chiama "concurrent rendering" e consente a React di preparare più versioni dell'UI contemporaneamente. Questa modifica avviene per lo più dietro le quinte, ma sblocca nuove possibilità per migliorare sia le prestazioni reali che quelle percepite della tua app.

Se hai seguito la nostra ricerca sul futuro di React (non ci aspettiamo che lo faccia!), potresti aver sentito parlare di qualcosa chiamato "concurrent mode" o che potrebbe rompere la tua app. In risposta a questo feedback della community, abbiamo ridisegnato la strategia di upgrade per un'adozione graduale. Invece di una "modalità" tutto-o-niente, il concurrent rendering sarà abilitato solo per gli aggiornamenti attivati da una delle nuove funzionalità. In pratica, questo significa che **potrai adottare React 18 senza riscritture e provare le nuove funzionalità al tuo ritmo.**

## Una strategia di adozione graduale {/*a-gradual-adoption-strategy*/}

Poiché la concorrenza in React 18 è opt-in, non ci sono cambiamenti breaking significativi out-of-the-box nel comportamento dei componenti. **Puoi passare a React 18 con modifiche minime o nulle al codice della tua applicazione, con uno sforzo paragonabile a un tipico rilascio major di React**. In base alla nostra esperienza nella conversione di diverse app a React 18, ci aspettiamo che molti utenti possano effettuare l'upgrade in un solo pomeriggio.

Abbiamo distribuato con successo funzionalità concorrenti su decine di migliaia di componenti su Facebook e, nella nostra esperienza, abbiamo scoperto che la maggior parte dei componenti React "funziona semplicemente" senza modifiche aggiuntive. Ci impegniamo a rendere questo un upgrade fluido per l'intera community, quindi oggi annunciamo il React 18 Working Group.

## Collaborare con la community {/*working-with-the-community*/}

Per questo rilascio stiamo provando qualcosa di nuovo: abbiamo invitato un panel di esperti, sviluppatori, autori di librerie ed educatori da tutta la community React a partecipare al nostro [React 18 Working Group](https://github.com/reactwg/react-18) per fornire feedback, porre domande e collaborare al rilascio. Non potevamo invitare tutti quelli che volevamo in questo gruppo iniziale e ristretto, ma se questo esperimento funziona, speriamo ce ne saranno altri in futuro!

**L'obiettivo del React 18 Working Group è preparare l'ecosistema a un'adozione fluida e graduale di React 18 da parte di applicazioni e librerie esistenti.** Il Working Group è ospitato su [GitHub Discussions](https://github.com/reactwg/react-18/discussions) ed è disponibile al pubblico in lettura. I membri del working group possono lasciare feedback, porre domande e condividere idee. Il core team userà anche la repo delle discussioni per condividere i risultati delle nostre ricerche. Man mano che il rilascio stabile si avvicina, qualsiasi informazione importante sarà pubblicata anche su questo blog.

Per maggiori informazioni sull'upgrade a React 18 o risorse aggiuntive sul rilascio, consulta il [post di annuncio di React 18](https://github.com/reactwg/react-18/discussions/4).

## Accedere al React 18 Working Group {/*accessing-the-react-18-working-group*/}

Tutti possono leggere le discussioni nella [repo del React 18 Working Group](https://github.com/reactwg/react-18).

Poiché ci aspettiamo un'ondata iniziale di interesse nel Working Group, solo i membri invitati potranno creare o commentare i thread. Tuttavia, i thread sono completamente visibili al pubblico, quindi tutti hanno accesso alle stesse informazioni. Crediamo che sia un buon compromesso tra creare un ambiente produttivo per i membri del working group e mantenere la trasparenza con la community più ampia.

Come sempre, puoi inviare segnalazioni di bug, domande e feedback generici al nostro [issue tracker](https://github.com/react/react/issues).

## Come provare React 18 Alpha oggi {/*how-to-try-react-18-alpha-today*/}

Nuove alpha vengono [pubblicate regolarmente su npm con il tag `@alpha`](https://github.com/reactwg/react-18/discussions/9). Questi rilasci sono costruiti usando l'ultimo commit della nostra repo principale. Quando una funzionalità o una correzione di bug viene unita, apparirà in un'alpha il giorno lavorativo successivo.

Potrebbero esserci cambiamenti significativi nel comportamento o nell'API tra le release alpha. Ricorda che **le release alpha non sono consigliate per applicazioni in produzione rivolte agli utenti**.

## Timeline prevista per il rilascio di React 18 {/*projected-react-18-release-timeline*/}

Non abbiamo una data di rilascio specifica programmata, ma ci aspettiamo che serviranno diversi mesi di feedback e iterazione prima che React 18 sia pronto per la maggior parte delle applicazioni in produzione.

* Library Alpha: disponibile oggi
* Public Beta: almeno diversi mesi
* Release Candidate (RC): almeno diverse settimane dopo la Beta
* General Availability: almeno diverse settimane dopo la RC

Maggiori dettagli sulla nostra timeline prevista sono [disponibili nel Working Group](https://github.com/reactwg/react-18/discussions/9). Pubblicheremo aggiornamenti su questo blog quando saremo più vicini a un rilascio pubblico.
