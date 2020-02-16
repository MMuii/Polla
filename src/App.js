import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import Error404 from './components/Error404';
import CreatePoll from './components/CreatePoll';
import AnonymousPoll from './components/anonymousPoll/AnonymousPoll';

import history from './history';

function App() {
    return (
        <Router history={history}>
            <div className="App">
                <Switch>
                    <Redirect exact from="/" to="/create-poll" /> 
                    <Route exact path="/create-poll" component={CreatePoll} />
                    <Route exact path="/poll/:pollId" component={AnonymousPoll} />
                    <Route exact path="/poll/:pollId/results" component={AnonymousPoll} />
                    <Route path="/" component={() => <Error404 message="There is no URL you're looking for."/>} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
