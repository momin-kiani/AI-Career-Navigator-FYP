import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppNavigator />
      </BrowserRouter>
    </Provider>
  );
}

export default App;