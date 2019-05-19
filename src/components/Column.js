import React from "react";
import PropTypes from 'prop-types';

import Card from './Card';

class Column extends React.Component {

  render() {
    let {name, issues, pullRequests} = this.props;

    // Combine issues and PRs into one array
    let cards = issues.concat(pullRequests);

    // Filter empty values
    cards = cards.filter(e => e != null);

    // Sort by date (newest to oldest)
    cards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
      <div className="column">
        <h2>{name}</h2>
        <div className="columnCards">
        {
          cards.map(card => {
            let assigneeAvatarUrl = null;
            if (typeof card.assignees !== "undefined" && card.assignees.edges.length > 0) {
              assigneeAvatarUrl = card.assignees.edges[0].node.avatarUrl;
            }
            let connectedPRs = null;
            if (typeof card.timelineItems !== "undefined") {
              connectedPRs = card.timelineItems.edges.map(timeline_edge => {
                let pr = timeline_edge.node.source;
                // TODO(jacobperron): Filter by "connected" PRs
                return pr;
              });
            }

            return (
              <Card key={card.id}
                avatarUrl={assigneeAvatarUrl}
                connectedPRs={connectedPRs}
                number={card.number}
                labels={card.labels}
                repository={card.repository.nameWithOwner}
                title={card.title}
                url={card.url} />
            );
          })
        }
        </div>
      </div>
    );
  }
}

Column.propTypes = {
  name: PropTypes.string.isRequired ,
  issues: PropTypes.array.isRequired,
  pullRequests: PropTypes.array.isRequired
}

export default Column;
