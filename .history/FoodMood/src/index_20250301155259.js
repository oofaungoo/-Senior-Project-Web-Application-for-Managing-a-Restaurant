import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import AppLayout from './AppLayout';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import OrderCreate from './pages/OrderCreate/OrderCreate';
import OrderCheck from './pages/OrderCheck/OrderCheck';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import IngredientManagement from './pages/IngredientManager/In2';
import MenuManager from './pages/MenuManager/MenuManager';
import UserManager from './pages/UserManager/UserManager';
import Noti from './pages/Noti/Noti';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/master/register" element={<Register />} />
        <Route element={<AppLayout />}>
          <Route path="OrderCreate" element={<OrderCreate />} />
          <Route path="OrderCheck" element={<OrderCheck />} />
          <Route path="OrderHistory" element={<OrderHistory />} />
          <Route path="IngredientManagement" element={<IngredientManagement />} />
          <Route path="MenuManager" element={<MenuManager />} />
          <Route path="UserManager" element={<UserManager />} />
          <Route path="Noti" element={<Noti />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
