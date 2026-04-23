import { gql } from 'apollo-angular';

export const LOGIN_USER = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      success
      message
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      success
      message
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: AddEmployeeInput!) {
    addEmployee(input: $input) {
      success
      message
      employee {
        _id
        first_name
        last_name
      }
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($eid: ID!, $input: UpdateEmployeeInput!) {
    updateEmployeeByEid(eid: $eid, input: $input) {
      success
      message
      employee {
        _id
        first_name
        last_name
      }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($eid: ID!) {
    deleteEmployeeByEid(eid: $eid) {
      success
      message
    }
  }
`;
