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

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      query: null,
    };

    this.updateConfig = this.updateConfig.bind(this);
  }

  updateConfig(repos, columns) {
    if (repos !== null) {
      this.setState({repos: repos, query: multi_repo_query(repos)});
    }
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

          // let data = this.state.queryResult;
          let repos = this.state.repos;
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

          return (
            <div className="board">
              <Column key="0" name="Inbox"
                issues={
                  Object.values(allIssues).filter(issue => {
                    return (
                      !issue.closed &&
                      !hasLabel(issue, 'in progress') &&
                      !hasLabel(issue, 'in review'));
                  })
                }
                pullRequests={
                  Object.values(allPullRequests).filter(pr => {
                    return (
                      !pr.closed &&
                      !hasLabel(pr, 'in progress') &&
                      !hasLabel(pr, 'in review'));
                  })
                }
              />
              <Column key="1" name="In progress"
                issues={
                  Object.values(allIssues).filter(issue => {
                    return !issue.closed && hasLabel(issue, 'in progress');
                  })
                }
                pullRequests={
                  Object.values(allPullRequests).filter(pr => {
                    return !pr.closed && hasLabel(pr, 'in progress');
                  })
                }
              />
              <Column key="2" name="In review"
                issues={
                  Object.values(allIssues).filter(issue => {
                    return !issue.closed && hasLabel(issue, 'in review');
                  })
                }
                pullRequests={
                  Object.values(allPullRequests).filter(pr => {
                    return !pr.closed && hasLabel(pr, 'in review');
                  })
                }
              />
              <Column key="3" name="Done" issues={
                Object.values(allIssues).filter(issue => issue.closed)
              } />
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
