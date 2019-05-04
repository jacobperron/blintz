import React from 'react';

function renderLabels(labels) {
  return (
    <div className="issueLabels">
      {
      labels.edges.map(edge => {
        let label = edge.node;
        let labelStyle = {
          padding: '2px',
          marginLeft: '5px',
          backgroundColor: '#' + label.color,
          borderRadius: '5px',
          height: '20px',
        };
        return (
          <div key={label.id} style={labelStyle}>
            {label.name}
          </div>
        );
      })
      }
    </div>
  );
}

function Issue(props) {
  return (
    <div className="issue">
      <div className="issueHeader">
        <div className="issueNumber">
          {props.number}
        </div>
        <div className="issueRepository">
          {props.repository}
        </div>
      </div>
      <div className="issueBody">
        <div className="issueTitle">
          {props.title}
        </div>
      </div>
      <div className="issueFooter">
        {renderLabels(props.labels)}
        <div className="issueURL">
          <a href={props.url}>github</a>
        </div>
      </div>
    </div>
  );
}

export default Issue;
