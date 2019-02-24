function CasellaDiPosta(props) {
  const messaggiNonLetti = props.messaggiNonLetti;
  return (
    <div>
      <h1>Ciao!</h1>
      {messaggiNonLetti.length > 0 &&
        <h2>
          Hai {messaggiNonLetti.length} messaggi non letti.
        </h2>
      }
    </div>
  );
}

const messaggi = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <CasellaDiPosta messaggiNonLetti={messaggi} />,
  document.getElementById('root')
);