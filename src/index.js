import ApolloClient from 'apollo-client';
import { ApolloProvider } from "react-apollo";
import { gql } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import React from 'react';
import ReactDOM from 'react-dom';

import Board from './components/Board';
import './index.css';

// "No scope" GitHub authentication token
// Provides public, read-onll access for GitHub API
localStorage.setItem('token', '04619dfbf08b43723a3430e99d0b5eb3979aace4');

const apolloHttpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const apolloAuthLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const apolloClient = new ApolloClient({
  link: apolloAuthLink.concat(apolloHttpLink),
  cache: new InMemoryCache(),
});

/*
// TODO(jacobperron): Use GitHub authenticate module
// https://github.com/checkr/react-github-login
import GitHubLogin from 'react-github-login';

const onGitHubLoginSuccess = response => {
  console.log(response);
  // localStorage.setItem('token', );
};

const onGitHubLoginFailure = response => console.log(response);
<GitHubLogin clientId="1dc49c65bd98df0c5d4e"
  onSuccess={onGitHubLoginSuccess}
onFailure={onGitHubLoginFailure}
redirectUri="http://localhost:3000" />
*/

ReactDOM.render(
  <div>
    <ApolloProvider client={apolloClient}>
      <Board apolloClient={apolloClient} />
    </ApolloProvider>
  </div>,
  document.getElementById('root')
);

