import React from "react";

import Card from './Card';

// TODO(jacobperron): Combine issues and PRs for sorting (e.g. by date)
function Column(props) {
  return (
    <div className="column">
      <h2>{props.name}</h2>
      <div className="columnCards">
      {
        props.issues.map(issue => {
          let assigneeAvatarUrl = (issue.assignees.edges.length > 0 ?
            issue.assignees.edges[0].node.avatarUrl : undefined);
          let connectedPRs = issue.timelineItems.edges.map(timeline_edge => {
            let pr = timeline_edge.node.source;
            // TODO(jacobperron): Filter by "connected" PRs
            return pr;
          });
          return (
            <Card key={issue.id}
              avatarUrl={assigneeAvatarUrl}
              connectedPRs={connectedPRs}
              number={issue.number}
              labels={issue.labels}
              repository={issue.repository.nameWithOwner}
              title={issue.title}
              url={issue.url} />
          );
        })
      }
      {
        typeof props.pullRequests !== "undefined" &&
        props.pullRequests.map(pr => {
          return (
            <Card key={pr.id}
              connectedPRs={[]}
              number={pr.number}
              labels={pr.labels}
              repository={pr.repository.nameWithOwner}
              title={pr.title}
              url={pr.url} />
          );
        })
      }
      </div>
    </div>
  );
}

export default Column;
