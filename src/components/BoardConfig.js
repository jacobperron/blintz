import React from 'react';

class BoardConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configUrl: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({configUrl: event.target.value});
  }

  handleSubmit(event) {
    fetch(this.state.configUrl)
      .then(response => {
        if(!response.ok) {
          throw Error(`Request rejected with status ${response.status}`);
        }
        return response.json()
      })
      .then(responseObj => {
        let repositories = responseObj.repositories;
        let columns = responseObj.columns;
        if (typeof repositories === "undefined") {
          alert('No repositories defined');
          return;
        }
        if (typeof columns === "undefined") {
          alert('No columns defined');
          return;
        }
        // TODO(jacobperron): More type checking
        this.props.onConfig(repositories, columns);
      })
      .catch(error => alert(error));
  }

  render() {
    return (
      <div>
        <label>
          Configuration:
          <input type="text" value={this.configUrl} onChange={this.handleChange} />
        </label>
        <input type="button" value="Configure" onClick={this.handleSubmit} />
      </div>
    );
  }
}

export default BoardConfig;
