function BenvenutoUtente(props) {
  return <h1>Bentornato/a!</h1>;
}

function BenvenutoOspite(props) {
  return <h1>Autenticati, per favore</h1>;
}
  
function Benvenuto(props) {
  const utenteAutenticato = props.utenteAutenticato;
  if (utenteAutenticato) {
    return <BenvenutoUtente />;
  }
  return <BenvenutoOspite />;
}

ReactDOM.render(
  // Prova a cambiare in utenteAutenticato={true}:
  <Benvenuto utenteAutenticato={false} />,
  document.getElementById('root')
);