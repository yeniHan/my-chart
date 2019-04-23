import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ChartPage from './Components/ChartPage';
import MainPage from './Components/MainPage';
import sendEmailPage from './Components/SendEmailPage';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={MainPage}></Route>
        <Route exact path='/chart' component={ChartPage}></Route>
        <Route exact path='/sendEmail' component={sendEmailPage}></Route>
      </div>
    );
  }
}

export default App;
