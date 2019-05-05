import React from 'react';

import Column from "./Column";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const OWNER = 'ros2';
const REPOS = [
  'rcl',
  'rcl_interfaces',
  'rclpy'
];

function repo_query(anon, i) {
  return `
    ${this.repos[i]}: repository(owner:${OWNER}, name: ${this.repos[i]}) {
      issues(last:100) {
      edges {
        node {
          closed
          id
          labels(first:100) {
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
          timelineItems(last:100, itemTypes:CROSS_REFERENCED_EVENT) {
            edges {
              node {
                ... on CrossReferencedEvent {
                  source {
                    ... on PullRequest {
                      id
                      number
                      repository {
                        nameWithOwner
                      }
                      url
                    }
                  }
                }
              }
            }
          }
          title
          url
        }
      }
      }
    }
  `;
}

const GET_ISSUES_MULTI_REPO = gql`query GetIssuesMultiRepo {
  ${Array(REPOS.length).fill().map(repo_query, {repos: REPOS}).join(' ')}
}`;


function hasLabel(issue, label) {
  for (let i = 0; i < issue.labels.edges.length; ++i) {
    let edge = issue.labels.edges[i];
    if (label === edge.node.name) {
      return true;
    }
  }
  return false;
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inbox: [],
      progress: [],
      review: [],
      done: [],
    };
  }

  updateColumns() {
    return (
       <Query query={GET_ISSUES_MULTI_REPO}>
         {({loading, error, data}) => {
           if (loading) return "Loading...";
           if (error) return `Error: ${error.message}`;

           let allIssues = [];
           for (let i = 0; i < REPOS.length; ++i) {
             allIssues = allIssues.concat(data[REPOS[i]].issues.edges);
           }

           return (
             <div className="board">
               <Column key="0" name="Inbox" issues={
                 allIssues.filter(issue => {
                   return (
                     !issue.node.closed &&
                     !hasLabel(issue.node, 'in progress') &&
                     !hasLabel(issue.node, 'in review'));
                 })
               } />
               <Column key="1" name="In progress" issues={
                 allIssues.filter(issue => {
                   return !issue.node.closed && hasLabel(issue.node, 'in progress');
                 })
               } />
               <Column key="2" name="In review" issues={
                 allIssues.filter(issue => {
                   return !issue.node.closed && hasLabel(issue.node, 'in review');
                 })
               } />
               <Column key="3" name="Done" issues={
                 allIssues.filter(issue => issue.node.closed)
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
        {this.updateColumns()}
      </div>
    );
  }
}

export default Board;
