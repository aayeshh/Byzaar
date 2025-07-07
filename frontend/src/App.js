import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import styled from 'styled-components';
import Login from './components/login';
import SignUp from './components/signup';
import Home from './components/Home';
import Checkout from './components/checkout';
import Address from './components/Address';
import Payment from './components/payment'
import AddProduct from './components/Addproduct';
import ProductDetails from './components/Productdetails';
import Orders from './components/Order';
import Buyer from './components/buyer';
import Seller from './components/seller';
import CategoryPage from './components/Category';
import OrderTrackRecord from './components/buyer_trackorder';
import SellerOrders from './components/sellerOrders';
import {ProtectedRoute} from './ProtectedRoute';
function App(){
  return (
    <Router>
      <Container>
        <Routes>
          <Route path='/' element={<Home/>}
          />
          <Route>
            <Route path='/login' element={<Login/>}
            />
          </Route>
          <Route path='/signup' element={<SignUp/>}
          />
          <Route path="/product/:productId" element={<ProductDetails />} />
          
          <Route path="/categories/:Category_Id" element={<CategoryPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/checkout' element={<Checkout/>}
            />
            <Route path='/address_page' element={<Address/>}
            />
            <Route path='/payment' element={<Payment/>}
            />
            <Route path='/product_add' element={<AddProduct/>}
            />
            
            <Route path="/order" element={<Orders />} />
            <Route path="/buyer" element={<Buyer />} />
            <Route path="/seller" element={<Seller />} />
            <Route path="/buyer_order_track" element={<OrderTrackRecord />} />
            <Route path="/seller_order_track" element={<SellerOrders />} />
          </Route>
        </Routes>
          
      </Container>
    </Router>
  );
}

const Container = styled.div`
`;
export default App;