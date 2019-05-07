import React from 'react';
import Avatar from './Avatar.js';

function renderLabels(labels) {
  return (
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
  );
}

function renderConnectedPRs(connectedPRs) {
  if (connectedPRs === null) {
    return null;
  }
  return (
    connectedPRs.map(pr => {
      if (typeof pr.repository === "undefined") {
        return null;
      }
      return (
        <div key={pr.id} className="connectedPR">
          <div className="connectedPRNumber">
            {pr.number}
          </div>
          <div className="connectedPRName">
            {pr.repository.nameWithOwner}
          </div>
          <div className="connectedPRURL">
            <a href={pr.url}>github</a>
          </div>
        </div>
      );
    })
  );
}


function Card(props) {
  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardNumber">
          {props.number}
        </div>
        <div className="cardRepository">
          {props.repository}
        </div>
        <div className="cardAssignee">
          <Avatar url={props.avatarUrl} />
        </div>
      </div>
      <div className="cardBody">
        <div className="cardTitle">
          {props.title}
        </div>
      </div>
      <div className="cardFooter">
        <div className="cardLabels">
          {renderLabels(props.labels)}
        </div>
        <div className="cardURL">
          <a href={props.url}>github</a>
        </div>
      </div>
      <div className="cardConnectedPRs">
        {renderConnectedPRs(props.connectedPRs)}
      </div>
    </div>
  );
}

export default Card;
