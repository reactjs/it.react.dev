---
title: "Denial of Service ed esposizione del codice sorgente in React Server Components"
author: The React Team
date: 2025/12/11
description: I ricercatori di sicurezza hanno trovato e divulgato due vulnerabilità aggiuntive in React Server Components mentre tentavano di sfruttare le patch della vulnerabilità critica della scorsa settimana. Vulnerabilità ad alta severità Denial of Service (CVE-2025-55184) e vulnerabilità a severità media Source Code Exposure (CVE-2025-55183)
translationStatus: ai-draft
---

11 dicembre 2025 del [React Team](/community/team)

_Aggiornato il 26 gennaio 2026._

---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/blog/2025/12/11/denial-of-service-and-source-code-exposure-in-react-server-components.md).

</Note>

<Intro>

I ricercatori di sicurezza hanno trovato e divulgato due vulnerabilità aggiuntive in React Server Components mentre tentavano di sfruttare le patch della vulnerabilità critica della scorsa settimana.

**Queste nuove vulnerabilità non consentono l'esecuzione remota del codice.** La patch per React2Shell resta efficace nel mitigare l'exploit di esecuzione remota del codice.

</Intro>

---

Le nuove vulnerabilità sono divulgate come:

- **Denial of Service - High Severity**: [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184), [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779) e [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864) (CVSS 7.5)
- **Source Code Exposure - Medium Severity**: [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) (CVSS 5.3)

Raccomandiamo di aggiornare immediatamente a causa della severità delle vulnerabilità appena divulgate.

<Note>

#### Le patch pubblicate in precedenza sono vulnerabili. {/*the-patches-published-earlier-are-vulnerable*/}

Se hai già aggiornato per le vulnerabilità precedenti, dovrai aggiornare di nuovo.

Se hai aggiornato a 19.0.3, 19.1.4 e 19.2.3, [queste sono incomplete](#additional-fix-published) e dovrai aggiornare di nuovo.

Consulta [le istruzioni nel post precedente](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions) per i passaggi di aggiornamento.

-----

_Aggiornato il 26 gennaio 2026._

</Note>

Ulteriori dettagli su queste vulnerabilità saranno forniti al termine del rollout delle correzioni.

## Azione immediata richiesta {/*immediate-action-required*/}

Queste vulnerabilità sono presenti negli stessi pacchetti e versioni di [CVE-2025-55182](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components).

Ciò include 19.0.0, 19.0.1, 19.0.2, 19.0.3, 19.1.0, 19.1.1, 19.1.2, 19.1.3, 19.2.0, 19.2.1, 19.2.2 e 19.2.3 di:

* [react-server-dom-webpack](https://www.npmjs.com/package/react-server-dom-webpack)
* [react-server-dom-parcel](https://www.npmjs.com/package/react-server-dom-parcel)
* [react-server-dom-turbopack](https://www.npmjs.com/package/react-server-dom-turbopack?activeTab=readme)

Le correzioni sono state backportate nelle versioni 19.0.4, 19.1.5 e 19.2.4. Se usi uno dei pacchetti sopra, aggiorna immediatamente a una delle versioni corrette.

Come prima, se il codice React della tua app non usa un server, la tua app non è interessata da queste vulnerabilità. Se la tua app non usa un framework, un bundler o un plugin per bundler che supporta React Server Components, la tua app non è interessata da queste vulnerabilità.

<Note>

#### È comune che CVE critiche portino alla scoperta di vulnerabilità successive. {/*its-common-for-critical-cves-to-uncover-followup-vulnerabilities*/}

Quando viene divulgata una vulnerabilità critica, i ricercatori analizzano i percorsi di codice adiacenti cercando tecniche di exploit varianti per verificare se la mitigazione iniziale possa essere aggirata.

Questo schema si osserva in tutto il settore, non solo in JavaScript. Ad esempio, dopo [Log4Shell](https://nvd.nist.gov/vuln/detail/cve-2021-44228), sono stati segnalati CVE aggiuntivi ([1](https://nvd.nist.gov/vuln/detail/cve-2021-45046), [2](https://nvd.nist.gov/vuln/detail/cve-2021-45105)) mentre la community analizzava la correzione originale.

Divulgazioni aggiuntive possono essere frustranti, ma in genere sono segno di un ciclo di risposta sano.

</Note>

### Framework e bundler interessati {/*affected-frameworks-and-bundlers*/}

Alcuni framework e bundler React dipendevano, avevano peer dependency o includevano i pacchetti React vulnerabili. I seguenti framework e bundler React sono interessati: [next](https://www.npmjs.com/package/next), [react-router](https://www.npmjs.com/package/react-router), [waku](https://www.npmjs.com/package/waku), [@parcel/rsc](https://www.npmjs.com/package/@parcel/rsc), [@vite/rsc-plugin](https://www.npmjs.com/package/@vitejs/plugin-rsc) e [rwsdk](https://www.npmjs.com/package/rwsdk).

Consulta [le istruzioni nel post precedente](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions) per i passaggi di aggiornamento.

### Mitigazioni dei provider di hosting {/*hosting-provider-mitigations*/}

Come prima, abbiamo collaborato con diversi hosting provider per applicare mitigazioni temporanee.

Non dovresti fare affidamento su queste per mettere in sicurezza la tua app: aggiorna comunque immediatamente.

### React Native {/*react-native*/}

Per gli utenti React Native che non usano un monorepo o `react-dom`, la versione di `react` dovrebbe essere fissata nel `package.json` e non sono necessari passaggi aggiuntivi.

Se usi React Native in un monorepo, dovresti aggiornare _solo_ i pacchetti interessati se installati:

- `react-server-dom-webpack`
- `react-server-dom-parcel`
- `react-server-dom-turbopack`

Questo è necessario per mitigare gli avvisi di sicurezza, ma non devi aggiornare `react` e `react-dom`, quindi non causerà l'errore di version mismatch in React Native.

Consulta [questo issue](https://github.com/react/react-native/issues/54772#issuecomment-3617929832) per maggiori informazioni.

---

## Alta severità: denial of service multipli {/*high-severity-multiple-denial-of-service*/}

**CVEs:** [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864)
**Base Score:** 7.5 (High)
**Date**: 26 gennaio 2026

I ricercatori di sicurezza hanno scoperto che esistono ancora vulnerabilità DoS aggiuntive in React Server Components.

Le vulnerabilità sono attivate inviando richieste HTTP appositamente create agli endpoint Server Function e possono portare a crash del server, eccezioni out-of-memory o uso eccessivo della CPU; a seconda del percorso di codice vulnerabile esercitato, della configurazione dell'applicazione e del codice applicativo.

Le patch pubblicate il 26 gennaio mitigano queste vulnerabilità DoS.

<Note>

#### Pubblicate correzioni aggiuntive {/*additional-fix-published*/}

La correzione originale che affrontava il DoS in [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) era incompleta.

Ciò ha lasciato vulnerabili le versioni precedenti. Le versioni 19.0.4, 19.1.5 e 19.2.4 sono sicure.

-----

_Aggiornato il 26 gennaio 2026._

</Note>

---

## Alta severità: denial of service {/*high-severity-denial-of-service*/}

**CVEs:** [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) e [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779)
**Base Score:** 7.5 (High)

I ricercatori di sicurezza hanno scoperto che una richiesta HTTP malevola può essere creata e inviata a qualsiasi endpoint Server Functions che, una volta deserializzata da React, può causare un loop infinito che blocca il processo del server e consuma CPU. Anche se la tua app non implementa alcun endpoint React Server Function, può comunque essere vulnerabile se supporta React Server Components.

Questo crea un vettore di vulnerabilità in cui un attaccante potrebbe negare agli utenti l'accesso al prodotto e potenzialmente avere un impatto sulle performance dell'ambiente server.

Le patch pubblicate oggi mitigano impedendo il loop infinito.

## Severità media: esposizione del codice sorgente {/*low-severity-source-code-exposure*/}

**CVE:** [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183)
**Base Score**: 5.3 (Medium)

Un ricercatore di sicurezza ha scoperto che una richiesta HTTP malevola inviata a una Server Function vulnerabile può restituire in modo non sicuro il codice sorgente di qualsiasi Server Function. Lo sfruttamento richiede l'esistenza di una Server Function che espone esplicitamente o implicitamente un argomento stringificato:

```javascript
'use server';

export async function serverFunction(name) {
  const conn = db.createConnection('SECRET KEY');
  const user = await conn.createUser(name); // implicitly stringified, leaked in db

  return {
   id: user.id,
   message: `Hello, ${name}!` // explicitly stringified, leaked in reply
  }}
```

Un attaccante potrebbe essere in grado di far trapelare quanto segue:

```txt
0:{"a":"$@1","f":"","b":"Wy43RxUKdxmr5iuBzJ1pN"}
1:{"id":"tva1sfodwq","message":"Hello, async function(a){console.log(\"serverFunction\");let b=i.createConnection(\"SECRET KEY\");return{id:(await b.createUser(a)).id,message:`Hello, ${a}!`}}!"}
```

Le patch pubblicate oggi impediscono la stringificazione del codice sorgente della Server Function.

<Note>

#### Possono essere esposti solo segreti nel codice sorgente. {/*only-secrets-in-source-code-may-be-exposed*/}

I segreti hardcoded nel codice sorgente possono essere esposti, ma i segreti a runtime come `process.env.SECRET` non sono interessati.

L'ambito del codice esposto è limitato al codice all'interno della Server Function, che può includere altre funzioni a seconda dell'inlining fornito dal bundler.

Verifica sempre contro i bundle di produzione.

</Note>

---

## Cronologia {/*timeline*/}
* **3 dicembre**: Leak segnalato a Vercel e [Meta Bug Bounty](https://bugbounty.meta.com/) da [Andrew MacPherson](https://github.com/AndrewMohawk).
* **4 dicembre**: DoS iniziale segnalato a [Meta Bug Bounty](https://bugbounty.meta.com/) da [RyotaK](https://ryotak.net).
* **6 dicembre**: Entrambi i problemi confermati dal team React, che ha iniziato le indagini.
* **7 dicembre**: Correzioni iniziali create e il team React ha iniziato a verificare e pianificare una nuova patch.
* **8 dicembre**: Hosting provider e progetti open source interessati notificati.
* **10 dicembre**: Mitigazioni degli hosting provider attive e patch verificate.
* **11 dicembre**: DoS aggiuntivo segnalato a [Meta Bug Bounty](https://bugbounty.meta.com/) da Shinsaku Nomura.
* **11 dicembre**: Patch pubblicate e divulgate pubblicamente come [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) e [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184).
* **11 dicembre**: Caso DoS mancante trovato internamente, patchato e divulgato pubblicamente come [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779).
* **26 gennaio**: Casi DoS aggiuntivi trovati, patchati e divulgati pubblicamente come [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864).
---

## Attribuzione {/*attribution*/}

Grazie a [Andrew MacPherson (AndrewMohawk)](https://github.com/AndrewMohawk) per aver segnalato la Source Code Exposure, [RyotaK](https://ryotak.net) di GMO Flatt Security Inc e Shinsaku Nomura di Bitforest Co., Ltd. per aver segnalato le vulnerabilità Denial of Service. Grazie a [Mufeed VH](https://x.com/mufeedvh) di [Winfunc Research](https://winfunc.com), [Joachim Viide](https://jviide.iki.fi), [RyotaK](https://ryotak.net) di [GMO Flatt Security Inc](https://flatt.tech/en/) e Xiangwei Zhang di Tencent Security YUNDING LAB per aver segnalato le vulnerabilità DoS aggiuntive.
