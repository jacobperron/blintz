import React from 'react';

function validateRepositories(repositories) {
  let result = {
    ok: false,
    error: 'Unexpected error'
  };
  if (typeof repositories === 'undefined') {
    result.error = 'No repositories defined';
    return result;
  }

  if (!Array.isArray(repositories)) {
    result.error = "'repositories' must be an array";
    return result;
  }

  for (let i = 0; i < repositories.length; ++i)
  {
    let owner = repositories[i].owner;
    let name = repositories[i].name;
    if (typeof owner !== 'string') {
      result.error = `'owner' is not a string for repository at index ${i}`;
      return result;
    }
    if (owner.length === 0) {
      result.error = `'owner' is the empty string for repository at index ${i}`;
      return result;
    }
    if (typeof name !== 'string') {
      result.error = `'name' is not a string for repository at index ${i}`;
      return result;
    }
    if (name.length === 0) {
      result.error = `'name' is the empty string for repository at index ${i}`;
      return result;
    }
  }

  result.ok = true;
  result.error = '';
  return result;
}

function validateColumns(columns) {
  let result = {
    ok: false,
    error: 'Unexpected error'
  };
  if (!Array.isArray(columns)) {
    result.error = "'columns' must be an array";
    return result;
  }

  if (typeof columns === 'undefined') {
    result.error = 'No columns defined';
    return result;
  }

  for (let i = 0; i < columns.length; ++i)
  {
    let name = columns[i].name;
    let state = columns[i].state;
    let label = columns[i].label;
    if (typeof name !== 'string') {
      result.error = `'name' is not a string for column at index ${i}`;
      return result;
    }
    if (name.length === 0) {
      result.error = `'name' is the empty string for column at index ${i}`;
      return result;
    }
    if (typeof state !== 'string') {
      result.error = `'state' is not a string for column at index ${i}`;
      return result;
    }
    if (state !== 'open' && state !== 'closed') {
      result.error = `'state' must have the value 'open' or 'closed' for column at index ${i}`;
      return result;
    }
    if (typeof label !== 'string' && label !== null) {
      result.error = `'label' must be a string or null for column at index ${i}`;
      return result;
    }
    if (typeof label === 'string' && label.length === 0) {
      result.error = `'label' is the empty string for column at index ${i}`;
      return result;
    }
  }

  result.ok = true;
  result.error = '';
  return result;
}


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
        // Input validation
        let result = validateRepositories(repositories);
        if (!result.ok) {
          alert(`${result.error}`);
          return;
        }
        result = validateColumns(columns);
        if (!result.ok) {
          alert(`${result.error}`);
          return;
        }

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
