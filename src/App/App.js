import React from 'react';
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import './App.scss';

import firebase from 'firebase/app';
import 'firebase/auth';

import firebaseConnnection from '../helpers/data/connection';

import Auth from '../components/pages/Auth/Auth';
import AllPosts from '../components/pages/AllPosts/AllPosts';

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = (props) => (authed === false ? <Component {...props} {...rest}/> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />);
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};
const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = (props) => (authed === true ? <Component {...props} {...rest}/> : <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />);
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};

firebaseConnnection();

class App extends React.Component {
  state={
    authed: false,
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { authed } = this.state;
    return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute path="/" exact component={AllPosts} authed={authed}/>
          <PublicRoute path="/auth" exact component={Auth} authed={authed}/>
        </Switch>
      </Router>
    </div>
    );
  }
}

export default App;
