import { ApplicationConfig, inject } from '@angular/core';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export function apolloOptionsFactory() {
  const httpLink = inject(HttpLink);

  const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('token');
    if (token) {
      operation.setContext({
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      });
    }
    return forward(operation);
  });

  return {
    link: ApolloLink.from([authLink, httpLink.create({ uri: environment.graphqlUri })]),
    cache: new InMemoryCache()
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory
  }
];
