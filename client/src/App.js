import "./App.css";
import Home from "./components/Home";
import MediaSearch from "./components/MediaSearch";
import Header from "./components/Header";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyMedia from "./pages/MyMedia";
import NotFound from "./pages/NotFound";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <MediaSearch />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/mymedia" component={MyMedia} />
            {/* <Route exact path="/thought/:id" component={SingleMedia} /> */}
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
