import React from 'react';
import PropTypes from 'prop-types';

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


class Card extends React.Component {

  render() {
    let {number, repository, avatarUrl, title, labels, url, connectedPRs} = this.props;
    return (
      <div className="card">
        <div className="cardHeader">
          <div className="cardNumber">
            {number}
          </div>
          <div className="cardRepository">
            {repository}
          </div>
          <div className="cardAssignee">
            <Avatar url={avatarUrl} />
          </div>
        </div>
        <div className="cardBody">
          <div className="cardTitle">
            {title}
          </div>
        </div>
        <div className="cardFooter">
          <div className="cardLabels">
            {renderLabels(labels)}
          </div>
          <div className="cardURL">
            <a href={url}>github</a>
          </div>
        </div>
        <div className="cardConnectedPRs">
          {renderConnectedPRs(connectedPRs)}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  number: PropTypes.number.isRequired,
  repository: PropTypes.string.isRequired,
  avatartUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  labels: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  connectedPRs: PropTypes.array
}

export default Card;
