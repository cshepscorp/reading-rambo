import './App.css';
import Home from './components/Home';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from '@apollo/client';

const httpLink = createHttpLink({
  uri: '/graphql'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className='flex-column justify-flex-start min-100-vh'>
        <div className='container'>
          <Home />
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;