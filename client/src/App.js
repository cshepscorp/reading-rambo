import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// COMPONENTS
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import Login from './components/Login';

// PAGES
import SearchBooks from './pages/SearchBooks';
import SearchScreens from './pages/SearchScreens';
import Signup from './pages/Signup';
// import Login from './pages/Login';
import MyMedia from './pages/MyMedia';
import NotFound from './pages/NotFound';

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/searchbooks' component={SearchBooks} />
            <Route exact path='/searchscreens' component={SearchScreens} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/mymedia' component={MyMedia} />
            {/* <Route exact path="/thought/:id" component={SingleMedia} /> */}
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
