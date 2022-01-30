import "./App.css";
import Home from "./components/Home";
import MediaSearch from "./components/MediaSearch";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const client = new ApolloClient({
  link: httpLink,
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
              {/* <Route exact path="/profile/:username?" component={Profile} /> */}
              {/* <Route exact path="/thought/:id" component={SingleMedia} /> */}
              <Route component={NotFound} />
            </Switch>
        </div>
       </Router>
    </ApolloProvider>
  );
}

export default App;
