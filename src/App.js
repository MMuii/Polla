import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import CreatePoll from './components/CreatePoll';
import AnonymousPoll from './components/anonymousPoll/AnonymousPoll';

import history from './history';

function App() {
    return (
        <Router history={history}>
            <div className="App">
                <Switch>
                    <Route exact path="/create-poll" component={CreatePoll} />
                    <Route exact path="/poll/:pollId" component={AnonymousPoll} />
                    <Route exact path="/poll/:pollId/results" component={AnonymousPoll} />
                    <Redirect from="/" to="/create-poll" /> 

                </Switch>
            </div>
        </Router>
    );
}

export default App;
