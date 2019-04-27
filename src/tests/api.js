const axios = require('axios');

const API_URL = 'http://localhost:8000/graphql';

const signIn = async variables =>
  await axios.post(API_URL, {
    query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
    variables,
  });

const me = async token =>
  await axios.post(
    API_URL,
    {
      query: `
        {
          me {
            id
            email
            username
          }
        }
      `,
    },
    token
      ? {
        headers: {
          'x-token': token,
        },
      }
      : null,
  );

const user = async variables =>
  axios.post(API_URL, {
    query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
    variables,
  });

const users = async () =>
  axios.post(API_URL, {
    query: `
      {
        users {
          id
          username
          email
          role
        }
      }
    `,
  });

const signUp = async variables =>
  axios.post(API_URL, {
    query: `
      mutation(
        $username: String!,
        $email: String!,
        $password: String!
      ) {
        signUp(
          username: $username,
          email: $email,
          password: $password
        ) {
          token
        }
      }
    `,
    variables,
  });

const updateUser = async (variables, token) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($username: String!) {
          updateUser(username: $username) {
            username
          }
        }
      `,
      variables,
    },
    token
      ? {
        headers: {
          'x-token': token,
        },
      }
      : null,
  );

const deleteUser = async (variables, token) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
      variables,
    },
    token
      ? {
        headers: {
          'x-token': token,
        },
      }
      : null,
  );

module.exports = {
  signIn,
  me,
  user,
  users,
  signUp,
  updateUser,
  deleteUser,
}
