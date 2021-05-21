import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { IRouteInterface } from './interfaces'

import './App.css';

const Weather = React.lazy(() => import('./components/weather'));

function App(props: any) {
  return (
    <BrowserRouter>
      <React.Suspense fallback={'Loading...'}>
        <Switch>
          <Route<IRouteInterface>
            exact
            path="/"
            name='Todo App'
            render={(props: any) => <Weather {...props} />}
          />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
