import React from "react";

import Issue from './Issue';

// TODO(jacobperron): Combine issues and PRs for sorting (e.g. by date)
function Column(props) {
  return (
    <div className="column">
      <h2>{props.name}</h2>
      <div className="columnIssues">
      {
        props.issues.map(issue_edge => {
          let issue = issue_edge.node;
          let connectedPRs = issue.timelineItems.edges.map(timeline_edge => {
            let pr = timeline_edge.node.source;
            // TODO(jacobperron): Filter by "connected" PRs
            return pr;
          });
          return (
            <Issue key={issue.id}
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
        props.pullRequests.map(pr_edge => {
          let pr = pr_edge.node;
          return (
            <Issue key={pr.id}
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
