import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
    const {getTotalCartAmount,token,food_list,cartItems,url}=useContext(StoreContext);
    const [data,setData]=useState({
        firstName:"",
        lastName:"",
        email:"",
        phone:"",
        branch:"",
        rollno:""
    })
    const onchangeHandler=(event)=>{
        const name=event.target.name;
        const value=event.target.value
        setData(data=>({...data,[name]:value}))
    }
    const placeOrder=async(event)=>{
        event.preventDefault()
        let orderItems=[];
        food_list.map((item)=>{
            if (cartItems[item._id]>0) {
                let itemInfo=item;
                itemInfo['quantity']=cartItems[item._id]
                orderItems.push(itemInfo)
            }

        })
        let orderData={
            address:data,
            items:orderItems,
            amount:getTotalCartAmount()+2
        }
        let response= await axios.post(url+'/api/orders/place',orderData,{headers:{token}})
        if(response.data.success){
            const {session_url}=response.data;
            window.location.replace(session_url)
        }
        else{
            alert("Error")
        }
    }
    const navigate=useNavigate()
    useEffect(()=>{
        if(!token){
            navigate("/cart")
            alert("Login to place order")
        }
        else if(getTotalCartAmount()===0){
            navigate("/cart")
            alert("Add items to place order")
        }
    },[token])
  return (
    <form onSubmit={placeOrder} className='place-order'>
         <div className="place-order-left">
            <p className="title">Student Information</p>
            <div className="multi-fields">
                 <input required name='firstName' onChange={onchangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                 <input required name='lastName' onChange={onchangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
            </div>
            <input required name='email' onChange={onchangeHandler} value={data.email} type="text" placeholder='Email address' />
            <input required name='phone' onChange={onchangeHandler} value={data.phone} type="text" placeholder='Phone no' />
            <div className="multi-fields">
                 <input required name='branch' onChange={onchangeHandler} value={data.branch} type="text" placeholder='Branch' />
                 <input required name='rollno' onChange={onchangeHandler} value={data.rollno} type="text" placeholder='Roll No' />
            </div>
         </div>
         <div className="place-order-right">
         <div className="cart-total">
                <h2>Cart Total</h2>
                <div>
                    <div className="cart-total-details">
                        <p>SubTotal</p>
                        <p>{getTotalCartAmount()}</p>
                    </div>
                    <hr/>
                    <div className="cart-total-details">
                        <p>Conviniance Fee</p>
                        <p>{5}</p>
                    </div> 
                    <hr/>
                    <div className="cart-total-details">
                        <b>Total</b>
                        <b>{getTotalCartAmount()+5}</b>
                    </div>
                </div>
                <button type='submit'>Procced To Payment</button>
            </div>
            <div className="cart-promocode">
            </div>
         </div>
    </form>
  )
}

export default PlaceOrder