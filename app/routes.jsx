import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Shell from './modules/layout/containers/Shell';
import Home from './modules/pages/containers/Home';
import Preferences from './modules/preferences/containers/Preferences';

/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default (store) => {
  function verifyLoggedIn(nextState, replace, callback) {
    const { user: { loggedIn } } = store.getState();

    if (!loggedIn) {
      replace({
        pathname: '/',
        state: {nextPathname: nextState.location.pathname}
      })
    }

    callback();
  }

  return (
    <Route path="/" component={Shell}>
      <IndexRoute component={Home}/>

      <Route onEnter={verifyLoggedIn}>
        <Route path="/preferences" component={Preferences} />
      </Route>
    </Route>
  );
};