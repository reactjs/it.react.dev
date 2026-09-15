---
title: "React Compiler v1.0"
author: Lauren Tan, Joe Savona, and Mofei Zhang
date: 2025/10/07
description: Oggi rilasciamo la prima release stabile del compiler.
translationStatus: ai-draft
---

7 ottobre 2025 di [Lauren Tan](https://x.com/potetotes), [Joe Savona](https://x.com/en_JS) e [Mofei Zhang](https://x.com/zmofei).

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2025/10/07/react-compiler-1.md).

</Note>

<Intro>

Il team React è entusiasta di condividere nuovi aggiornamenti:

</Intro>

1. React Compiler 1.0 è disponibile oggi.
2. Le regole lint alimentate dal compiler sono incluse nei preset `recommended` e `recommended-latest` di `eslint-plugin-react-hooks`.
3. Abbiamo pubblicato una guida all'adozione incrementale e collaborato con Expo, Vite e Next.js così che le nuove app possano partire con il compiler abilitato.

---

Oggi rilasciamo la prima release stabile del compiler. React Compiler funziona sia su React che su React Native e ottimizza automaticamente componenti e hooks senza richiedere riscritture. Il compiler è stato testato in battaglia su app importanti in Meta ed è completamente pronto per la produzione.

[React Compiler](/learn/react-compiler) è uno strumento build-time che ottimizza la tua app React tramite memorizzazione automatica. Lo scorso anno abbiamo pubblicato la [prima beta](/blog/2024/10/21/react-compiler-beta-release) di React Compiler e abbiamo ricevuto ottimo feedback e contributi. Siamo entusiasti dei risultati che abbiamo visto da chi ha adottato il compiler (vedi i case study di [Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33) e [Wakelet](https://github.com/reactwg/react-compiler/discussions/52)) e siamo entusiasti di portare il compiler a più utenti nella community React.

Questa release è il culmine di un enorme e complesso sforzo ingegneristico che abbraccia quasi un decennio. La prima esplorazione del team React sui compiler è iniziata con [Prepack](https://github.com/facebookarchive/prepack) nel 2017. Sebbene questo progetto sia stato poi chiuso, ci sono state molte lezioni che hanno informato il team sulla progettazione degli Hooks, pensati fin dall'inizio con un compiler futuro in mente. Nel 2021, [Xuan Huang](https://x.com/Huxpro) ha presentato in demo la [prima iterazione](https://www.youtube.com/watch?v=lGEMwh32soc) di una nuova versione di React Compiler.

Sebbene questa prima versione del nuovo React Compiler sia stata poi riscritta, il primo prototipo ci ha dato maggiore fiducia che fosse un problema trattabile, e le lezioni su un'architettura alternativa del compiler potevano darci con precisione le caratteristiche di memorizzazione che volevamo. [Joe Savona](https://x.com/en_JS), [Sathya Gunasekaran](https://x.com/_gsathya), [Mofei Zhang](https://x.com/zmofei) e [Lauren Tan](https://x.com/potetotes) hanno lavorato alla nostra prima riscrittura, spostando l'architettura del compiler in una High-Level Intermediate Representation (HIR) basata su Control Flow Graph (CFG). Questo ha spianato la strada a un'analisi molto più precisa e persino all'inferenza dei tipi all'interno di React Compiler. Da allora, porzioni significative del compiler sono state riscritte, ogni riscrittura informata dalle lezioni del tentativo precedente. E abbiamo ricevuto aiuto e contributi significativi da molti membri del [team React](/community/team) lungo il percorso.

Questa release stabile è la prima di molte. Il compiler continuerà a evolversi e migliorare, e ci aspettiamo che diventi una nuova fondazione e un'era per il prossimo decennio e oltre di React.

Puoi passare direttamente al [quickstart](/learn/react-compiler), o continuare a leggere i momenti salienti di React Conf 2025.

<DeepDive>

#### Come funziona React Compiler? {/*how-does-react-compiler-work*/}

React Compiler è un compiler ottimizzante che ottimizza componenti e hooks tramite memorizzazione automatica. Sebbene attualmente sia implementato come plugin Babel, il compiler è in gran parte disaccoppiato da Babel e abbassa l'Abstract Syntax Tree (AST) fornito da Babel nella sua HIR originale; attraverso più pass del compiler, comprende con attenzione il data-flow e la mutabilità del tuo codice React. Questo consente al compiler di memorizzare granularmente i valori usati nel rendering, inclusa la capacità di memorizzare condizionalmente, cosa non possibile con la memorizzazione manuale.

```js {8}
import { use } from 'react';

export default function ThemeProvider(props) {
  if (!props.children) {
    return null;
  }
  // The compiler can still memoize code after a conditional return
  const theme = mergeTheme(props.theme, use(ThemeContext));
  return (
    <ThemeContext value={theme}>
      {props.children}
    </ThemeContext>
  );
}
```
_Vedi questo esempio nel [React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhASwLYAcIwC4AEwBUYCBAvgQGYwQYEDkMCAhnHowNwA6AdvwQAPHPgIATBNVZQANoWpQ+HNBD4EAKgAsEGBAAU6ANzSSYACix0sYAJRF+BAmmoFzAQisQbAOjha0WXEWPntgRycCFjxYdT45WV51Sgi4NTBCPB09AgBeAj0YAHMEbV0ES2swHyzygBoSMnMyvQBhNTxhPFtbJKdo2LcIpwAeFoR2vk6hQiNWWSgEXOBavQoAPmHI4C9ff0DghD4KLZGAenHJ6bxN5N7+ChA6kDS+ajQilHRsXEyATyw5GI+gWRTQfAA8lg8Ko+GBKDQ6AxGAAjVgohCyAC0WFB4KxLHYeCxaWwgQQMDO4jQGW4-H45nCyTOZ1JWECrBhagAshBJMgCDwQPNZEKHgQwJyae8EPCQVAwZDobC7FwnuAtBAAO4ASSmFL48zAKGksjIFCAA)_

Oltre alla memorizzazione automatica, React Compiler ha anche pass di validazione che girano sul tuo codice React. Questi pass codificano le [Rules of React](/reference/rules) e usano la comprensione del compiler di data-flow e mutabilità per fornire diagnostiche dove le Rules of React sono violate. Queste diagnostiche spesso espongono bug latenti nel codice React e vengono principalmente mostrate tramite `eslint-plugin-react-hooks`.

Per saperne di più su come il compiler ottimizza il tuo codice, visita il [Playground](https://playground.react.dev).

</DeepDive>

## Usa React Compiler oggi {/*use-react-compiler-today*/}
Per installare il compiler:

npm
<TerminalBlock>
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
</TerminalBlock>

pnpm
<TerminalBlock>
pnpm add --save-dev --save-exact babel-plugin-react-compiler@latest
</TerminalBlock>

yarn
<TerminalBlock>
yarn add --dev --exact babel-plugin-react-compiler@latest
</TerminalBlock>

Come parte della release stabile, abbiamo reso React Compiler più facile da aggiungere ai progetti e aggiunto ottimizzazioni a come il compiler genera la memorizzazione. React Compiler ora supporta optional chains e indici di array come dipendenze. Questi miglioramenti si traducono in meno ri-renderizzazioni e UI più reattive, lasciandoti scrivere codice dichiarativo idiomatico.

Puoi trovare maggiori dettagli sull'uso del Compiler nella [nostra documentazione](/learn/react-compiler).

## Cosa vediamo in produzione {/*react-compiler-at-meta*/}
[Il compiler è già stato rilasciato in app come Meta Quest Store](https://youtu.be/lyEKhv8-3n0?t=3002). Abbiamo visto carichi iniziali e navigazioni tra pagine migliorare fino al 12%, mentre alcune interazioni sono più di 2,5× più veloci. L'uso della memoria resta neutro nonostante questi guadagni. Sebbene i risultati possano variare, raccomandiamo di sperimentare con il compiler nella tua app per vedere guadagni di performance simili.

## Compatibilità retroattiva {/*backwards-compatibility*/}
Come indicato nell'annuncio Beta, React Compiler è compatibile con React 17 e versioni successive. Se non sei ancora su React 19, puoi usare React Compiler specificando un target minimo nella config del compiler e aggiungendo `react-compiler-runtime` come dipendenza. Puoi trovare la documentazione [qui](/reference/react-compiler/target#targeting-react-17-or-18).

## Applica le Regole di React con lint alimentato dal compiler {/*migrating-from-eslint-plugin-react-compiler-to-eslint-plugin-react-hooks*/}
React Compiler include una regola ESLint che aiuta a identificare codice che viola le [Rules of React](/reference/rules). Il linter non richiede che il compiler sia installato, quindi non c'è rischio nell'aggiornare eslint-plugin-react-hooks. Raccomandiamo a tutti di aggiornare oggi.

Se hai già installato `eslint-plugin-react-compiler`, ora puoi rimuoverlo e usare `eslint-plugin-react-hooks@latest`. Grazie a [@michaelfaith](https://bsky.app/profile/michael.faith) per il contributo a questo miglioramento!

Per installare:

npm
<TerminalBlock>
npm install --save-dev eslint-plugin-react-hooks@latest
</TerminalBlock>

pnpm
<TerminalBlock>
pnpm add --save-dev eslint-plugin-react-hooks@latest
</TerminalBlock>

yarn
<TerminalBlock>
yarn add --dev eslint-plugin-react-hooks@latest
</TerminalBlock>

```js {6}
// eslint.config.js (Flat Config)
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  reactHooks.configs.flat.recommended,
]);
```

```js {3}
// eslintrc.json (Legacy Config)
{
  "extends": ["plugin:react-hooks/recommended"],
  // ...
}
```

Per abilitare le regole React Compiler, raccomandiamo di usare il preset `recommended`. Puoi anche consultare il [README](https://github.com/react/react/blob/main/packages/eslint-plugin-react-hooks/README.md) per ulteriori istruzioni. Ecco alcuni esempi che abbiamo presentato a React Conf:

- Intercettare pattern `setState` che causano loop di renderizzazione con [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render).
- Segnalare lavoro costoso dentro gli Effetti tramite [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect).
- Impedire accessi ref non sicuri durante la renderizzazione con [`refs`](/reference/eslint-plugin-react-hooks/lints/refs).

## Cosa fare con useMemo, useCallback e React.memo? {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}
Per impostazione predefinita, React Compiler memorizzerà il tuo codice in base alla sua analisi ed euristiche. Nella maggior parte dei casi, questa memorizzazione sarà precisa quanto, o più di, quella che avresti scritto — e come indicato sopra, il compiler può memorizzare anche in casi in cui `useMemo`/`useCallback` non possono essere usati, come dopo un early return.

Tuttavia, in alcuni casi gli sviluppatori possono aver bisogno di maggiore controllo sulla memorizzazione. Gli hooks `useMemo` e `useCallback` possono continuare a essere usati con React Compiler come escape hatch per controllare quali valori vengono memorizzati. Un caso d'uso comune è quando un valore memorizzato è usato come dipendenza di un Effetto, per garantire che un Effetto non si attivi ripetutamente anche quando le sue dipendenze non cambiano in modo significativo.

Per codice nuovo, raccomandiamo di fare affidamento sul compiler per la memorizzazione e usare `useMemo`/`useCallback` dove serve per un controllo preciso.

Per codice esistente, raccomandiamo di lasciare la memorizzazione esistente al suo posto (rimuoverla può cambiare l'output della compilazione) o testare con attenzione prima di rimuovere la memorizzazione.

## Le nuove app dovrebbero usare React Compiler {/*new-apps-should-use-react-compiler*/}
Abbiamo collaborato con i team di Expo, Vite e Next.js per aggiungere il compiler all'esperienza delle nuove app.

[Expo SDK 54](https://docs.expo.dev/guides/react-compiler/) e versioni successive hanno il compiler abilitato per impostazione predefinita, così le nuove app potranno sfruttare automaticamente il compiler fin dall'inizio.

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Gli utenti [Vite](https://vite.dev/guide/) e [Next.js](https://nextjs.org/docs/app/api-reference/cli/create-next-app) possono scegliere i template con compiler abilitato in `create-vite` e `create-next-app`.

<TerminalBlock>
npm create vite@latest
</TerminalBlock>

<br />

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

## Adotta React Compiler in modo incrementale {/*adopt-react-compiler-incrementally*/}
Se mantieni un'applicazione esistente, puoi distribuire il compiler al tuo ritmo. Abbiamo pubblicato una [guida all'adozione incrementale](/learn/react-compiler/incremental-adoption) passo passo che copre strategie di gating, controlli di compatibilità e strumenti di rollout così puoi abilitare il compiler con fiducia.

## Supporto swc (sperimentale) {/*swc-support-experimental*/}
React Compiler può essere installato su [diversi build tool](/learn/react-compiler#installation) come Babel, Vite e Rsbuild.

Oltre a questi strumenti, abbiamo collaborato con Kang Dongyoon ([@kdy1dev](https://x.com/kdy1dev)) del team [swc](https://swc.rs/) per aggiungere ulteriore supporto a React Compiler come plugin swc. Sebbene questo lavoro non sia completo, le performance di build di Next.js dovrebbero ora essere considerevolmente più veloci quando [React Compiler è abilitato nella tua app Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler).

Raccomandiamo di usare Next.js [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) o superiore per ottenere le migliori performance di build.

Gli utenti Vite possono continuare a usare [vite-plugin-react](https://github.com/vitejs/vite-plugin-react) per abilitare il compiler, aggiungendolo come [plugin Babel](/learn/react-compiler/installation#vite). Stiamo anche lavorando con il team [oxc](https://oxc.rs/) per [aggiungere supporto al compiler](https://github.com/oxc-project/oxc/issues/10048). Una volta che [rolldown](https://github.com/rolldown/rolldown) sarà rilasciato ufficialmente e supportato in Vite e il supporto oxc per React Compiler sarà aggiunto, aggiorneremo la documentazione con informazioni su come migrare.

## Aggiornare React Compiler {/*upgrading-react-compiler*/}
React Compiler funziona al meglio quando la auto-memorizzazione applicata è strettamente per performance. Versioni future del compiler potrebbero cambiare come viene applicata la memorizzazione, ad esempio potrebbe diventare più granulare e precisa.

Tuttavia, poiché il codice di prodotto a volte può violare le [rules of React](/reference/rules) in modi non sempre staticamente rilevabili in JavaScript, cambiare la memorizzazione può occasionalmente avere risultati inattesi. Ad esempio, un valore precedentemente memorizzato potrebbe essere usato come dipendenza per un `useEffect` da qualche parte nell'albero dei componenti. Cambiare come o se questo valore viene memorizzato può causare un over o under-firing di quel `useEffect`. Sebbene incoraggiamo [useEffect solo per la sincronizzazione](/learn/synchronizing-with-effects), la tua codebase potrebbe avere `useEffect` che coprono altri casi d'uso, come Effetti che devono eseguirsi solo in risposta a cambiamenti di valori specifici.

In altre parole, cambiare la memorizzazione può in rari casi causare comportamenti inattesi. Per questo motivo, raccomandiamo di seguire le Rules of React e di impiegare test end-to-end continui della tua app così puoi aggiornare il compiler con fiducia e identificare eventuali violazioni delle rules of React che potrebbero causare problemi.

Se non hai una buona copertura di test, raccomandiamo di fissare il compiler a una versione esatta (es. `1.0.0`) piuttosto che a un range SemVer (es. `^1.0.0`). Puoi farlo passando i flag `--save-exact` (npm/pnpm) o `--exact` (yarn) quando aggiorni il compiler. Dovresti poi fare qualsiasi upgrade del compiler manualmente, verificando che la tua app funzioni ancora come previsto.

---

Grazie a [Jason Bonta](https://x.com/someextent), [Jimmy Lai](https://x.com/feedthejim), [Kang Dongyoon](https://x.com/kdy1dev) (@kdy1dev) e [Dan Abramov](https://bsky.app/profile/danabra.mov) per la revisione e l'editing di questo post.
