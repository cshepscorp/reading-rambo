import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// COMPONENTS
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import SingleMedia from './components/SingleMedia';
import SignUp from './components/SignUp';
import Login from './components/Login';
import MyContent from './components/MyContent';

// PAGES / ROUTES
import SearchBooks from './pages/SearchBooks';
import SearchScreens from './pages/SearchScreens';
import MediaAll from './pages/MediaAll';
import Profile from './pages/Profile';
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
        <div>
          <Header />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/searchbooks' component={SearchBooks} />
            <Route exact path='/searchscreens' component={SearchScreens} />
            <Route exact path='/mediaall' component={MediaAll} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/profile/:username?' component={Profile} />
            <Route exact path='/mymedia' component={MyContent} />
            <Route exact path='/media/:id' component={SingleMedia} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
