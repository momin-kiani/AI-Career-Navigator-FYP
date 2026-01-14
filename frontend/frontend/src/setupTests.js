// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// React 19 compatibility polyfill for unstable_act
// This is needed for libraries that expect React 18
if (typeof global !== 'undefined') {
  const React = require('react');
  if (React && !React.unstable_act) {
    React.unstable_act = React.act || (async (callback) => {
      if (typeof callback === 'function') {
        return callback();
      }
      return callback;
    });
  }
}
