import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddEdit from './pages/AddEdit';
import View from './pages/View';
import Chart from './pages/Chart';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <ToastContainer position="top-center" />
        <Switch>
          <Route exact path="/expense-management-system/" component={Home} />
          <Route path="/expense-management-system/add" component={AddEdit} />
          <Route path="/expense-management-system/update/:id" component={AddEdit} />
          <Route path="/expense-management-system/view/:id" component={View} />
          <Route path="/expense-management-system/chart" component={Chart} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;


