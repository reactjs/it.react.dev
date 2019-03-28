// highlight-range{1-2}
const BottoneFigo = React.forwardRef((props, ref) => (
  <button ref={ref} className="BottoneFigo">
    {props.children}
  </button>
));

// Puoi ottenere una ref diretta al bottone del DOM:
const ref = React.createRef();
<BottoneFigo ref={ref}>Cliccami!</BottoneFigo>;
