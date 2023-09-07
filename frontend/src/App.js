import './App.css';
import Header from './component/layout/Header/Header.js'
import {BrowserRouter as Router,Navigate,Route, Routes} from 'react-router-dom'
import webfont from 'webfontloader';
import React, { useEffect, useState } from 'react';
import Footer  from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js'
import ProductDetails from './component/Product/ProductDetails.js'
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'
import LoginSignUp from './component/User/LoginSignUp';
import store from './store'
import {loadUser} from './actions/userAction';
import UserOptions from './component/layout/Header/UserOptions.js'
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js"
import UpdateProfile from './component/User/UpdateProfile.js'
import UpdatePassword from './component/User/UpdatePassword.js'
import ForgotPassword from './component/User/ForgotPassword.js'
import ResetPassword from './component/User/ResetPassword.js'
import Cart from './component/Cart/Cart.js'
import Shipping from './component/Cart/Shipping.js'
import ConfirmOrder from './component/Cart/ConfirmOrder.js'
import Payment from './component/Cart/Payment.js'
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './component/Cart/OrderSuccess.js'
import MyOrders from './component/Order/MyOrders.js'
import OrderDetails from './component/Order/OrderDetails.js'
import Dashboard from './component/Admin/Dashboard.js'
import ProductList from './component/Admin/ProductList.js'
import NewProduct from './component/Admin/NewProduct.js';
import UpdateProduct from './component/Admin/UpdateProduct.js';
import OrderList from './component/Admin/OrderList.js'
import ProcessOrder from './component/Admin/ProcessOrder.js'
import UsersList from './component/Admin/UsersList.js'
import UpdateUser from './component/Admin/UpdateUser.js'
import ProductReviews from './component/Admin/ProductReviews.js'
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from './component/layout/NotFound/NotFound';

function App() {

  const {isAuthenticated,user} = useSelector(state=>state.user);
  const [stripeApiKey,setStripeApiKey] = useState("");
    async function getStripeApiKey(){
      const {data} = await axios.get("/api/v1/stripeapikey")
      setStripeApiKey(data.stripeApiKey);
    }
  
  useEffect(()=>{
    webfont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"]
      }
    });
    getStripeApiKey();
    store.dispatch(loadUser());
  },[])

  window.addEventListener('contextmenu',(e)=>e.preventDefault()); // right click disabled!

  return (
      <Router>
        <Header/>
        {isAuthenticated && <UserOptions user={user}/>}
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/product/:id" element={<ProductDetails/>}/>
          <Route exact path="/products" element={<Products/>} />
          <Route exact path="/products/:keyword" element={<Products/>} />
          <Route exact path="/Search" element={<Search/>} />
          <Route exact path="/contact" element={<Contact/>} />
          <Route exact path='/login' element={<LoginSignUp/>}/>
          <Route exact path="/about" element={<About/>}/>
          <Route exact path="/account" element={isAuthenticated===true?<Profile/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/me/update" element={isAuthenticated===true?<UpdateProfile/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/password/update" element={isAuthenticated===true?<UpdatePassword/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/password/forgot" element={<ForgotPassword/>}/>
          <Route exact path="/password/reset/:token" element={<ResetPassword/>}/>
          <Route exact path="/cart" element={<Cart/>}/>
          <Route exact path="/login/shipping" element={isAuthenticated===true?<Shipping/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/order/confirm" element={isAuthenticated===true?<ConfirmOrder/>:<Navigate replace to="/login"/>}/>
          <Route exact path='/process/payment' element={isAuthenticated===true?<Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements>:<Navigate replace to="/login"/>}/>
          <Route exact path="/success" element={isAuthenticated===true?<OrderSuccess/>:<Navigate replace to="/login"/>} />
          <Route exact path="/orders" element={isAuthenticated===true?<MyOrders/>:<Navigate replace to="/login"/>} />
          <Route exact path="/order/:id" element={isAuthenticated===true?<OrderDetails/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/admin/dashboard" element={isAuthenticated===true?<Dashboard/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/admin/products" element={isAuthenticated===true?<ProductList/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/admin/product" element={isAuthenticated===true?<NewProduct/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/admin/product/:id" element={isAuthenticated===true?<UpdateProduct/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/admin/orders" element={isAuthenticated===true?<OrderList/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/admin/orders/:id" element={isAuthenticated===true?<ProcessOrder/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/admin/users" element={isAuthenticated===true?<UsersList/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/admin/user/:id" element={isAuthenticated===true?<UpdateUser/>:<Navigate replace to="/login"/>}/>
          <Route exact path="/admin/reviews" element={isAuthenticated===true?<ProductReviews/>:<Navigate replace to="/login"/>}/>
          <Route path="*" element={window.location.pathname === "/process/payment" ? null : <NotFound/>}/>
        </Routes>
        <Footer/>
      </Router>
  );
}

export default App;
