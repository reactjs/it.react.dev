class HelloMessage extends React.Component {
  render() {
<<<<<<< HEAD
    return (
      <div>
        Ciao {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Claudia" />,
  document.getElementById('hello-example')
);
=======
    return <div>Hello {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b
