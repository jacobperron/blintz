import React from 'react';

import BoardConfig from "./BoardConfig";
import Column from "./Column";

import gql from "graphql-tag";
import { Query } from "react-apollo";

function repo_query(anon, i) {
  return `
    ${this.repos[i].name}: repository(owner:${this.repos[i].owner}, name:${this.repos[i].name}) {
      issues(last:20) {
        edges {
          node {
            ...IssueWithoutRef
            timelineItems(last:20, itemTypes:CROSS_REFERENCED_EVENT) {
              edges {
                node {
                  ... on CrossReferencedEvent {
                    source {
                      ... on PullRequest {
                        ...PullRequestWithoutRef
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      pullRequests(last:20, states:OPEN) {
        edges {
          node {
            ...PullRequestWithoutRef
          }
        }
      }
    }
  `;
}

function multi_repo_query(repos) {
  return gql`
    query GetIssuesMultiRepo {
      ${Array(repos.length).fill().map(repo_query, {repos: repos}).join(' ')}
    }
    fragment IssueWithoutRef on Issue {
      assignees(last:1) {
        edges {
          node {
            avatarUrl
          }
        }
      }
      createdAt
      closed
      id
      labels(first:10) {
        edges {
          node {
            color
            id
            name
          }
        }
      }
      number
      repository {
        nameWithOwner
      }
      title
      url
    }
    fragment PullRequestWithoutRef on PullRequest {
      closed
      createdAt
      id
      labels(first:10) {
        edges {
          node {
            color
            id
            name
          }
        }
      }
      number
      repository {
        nameWithOwner
      }
      title
      url
    }
  `;
}

function hasLabel(issue, label) {
  for (let i = 0; i < issue.labels.edges.length; ++i) {
    let labelName = issue.labels.edges[i].node.name;
    if (label === labelName) {
      return true;
    }
  }
  return false;
}

function cardFilter(card) {
  if (this.column.state === "open" && card.closed) {
    return false;
  }

  // If there is no label assigned to this column, include all cards that are not matched
  // to another column
  if (this.column.label === null) {
    for (let label in this.column.label) {
      if (hasLabel(card, label)) {
        return false;
      }
    }
    return true;
  }

  return hasLabel(card, this.column.label);
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      columns: [],
      query: null,
    };

    this.updateConfig = this.updateConfig.bind(this);
  }

  updateConfig(repos, columns) {
    let newRepos = this.state.repos;
    let newColumns = this.state.columns;
    let newQuery = this.state.query;
    if (repos !== null) {
      newRepos = repos;
      newQuery = multi_repo_query(repos);
    }
    if (columns !== null) {
      newColumns = columns;
    }
    this.setState({repos: newRepos, columns: newColumns, query: newQuery});
  }

  updateColumns() {
    if (this.state.query === null) {
      return null;
    }
    return (
      <Query query={this.state.query}>
        {({loading, error, data}) => {
          if (loading) return "Loading...";
          if (error) return `Error: ${error.message}`;

          let repos = this.state.repos;
          let columns = this.state.columns
          let allIssues = {};
          let allPullRequests = {};
          for (let i = 0; i < repos.length; ++i) {
            for (let j = 0; j < data[repos[i].name].issues.edges.length; ++j) {
              let issue = data[repos[i].name].issues.edges[j].node;
              allIssues[issue.id] = issue;
            }
            for (let j = 0; j < data[repos[i].name].pullRequests.edges.length; ++j) {
              let pullRequest = data[repos[i].name].pullRequests.edges[j].node;
              allPullRequests[pullRequest.id] = pullRequest;
            }
          }

          // Filter out PRs that are "connected" to at least one issue
          for (let issueID in allIssues) {
            let issue = allIssues[issueID];
            for (let i = 0; i < issue.timelineItems.edges.length; ++i) {
              let pullRequestId = issue.timelineItems.edges[i].node.source.id;
              if (pullRequestId in allPullRequests) {
                delete allPullRequests[pullRequestId];
              }
            }
          }

          // Collect all labels for columns
          let labels = {};
          for (let i = 0; i < columns.length; ++i) {
            let column = columns[i];
            if (column.label === null) {
              continue;
            }
            if (column.label in labels) {
              console.warn(`The label ${column.label} is used more than once`);
            }
            labels[column.label] = true;
          }

          let columnComponents = this.state.columns.map((column, index) => {
            return (
              <Column key={index.toString()} name={column.name}
                issues={
                  Object.values(allIssues).filter(cardFilter, {labels: labels, column: column})
                }
                pullRequests={
                  Object.values(allPullRequests).filter(cardFilter, {labels: labels, column: column})
                }
              />
            );
          });

          return (
            <div className="board">
              {columnComponents}
            </div>
          );
        }}
      </Query>
    );
  }

  render() {
    return (
      <div>
        <BoardConfig onConfig={this.updateConfig} />
        {this.updateColumns()}
      </div>
    );
  }
}

export default Board;
