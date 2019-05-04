import React from "react";

import Issue from './Issue';

function Column(props) {
  return (
    <div className="column">
      <h2>{props.name}</h2>
      <div className="columnIssues">
      {
        props.issues.map(edge => {
          let node = edge.node;
          return (
            <Issue key={node.id}
              number={node.number}
              labels={node.labels}
              repository={node.repository.nameWithOwner}
              title={node.title}
              url={node.url} />
          );
        })
      }
      </div>
    </div>
  );
}

export default Column;
