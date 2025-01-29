import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import {toast} from 'react-toastify'

const List = ({url}) => {
  const [list,setList]=useState([]);
  const fetchList=async()=>{
    const response= await axios.get(`${url}/api/food/list`)
    console.log(response.data.data)
    if (response.data.sucess) {
      setList(response.data.data)
    }
    else{
      toast.error("unable to fetch data")
    }
  }
  const removeFood=async(id)=>{
    console.log(id)
    const response=await axios.post(`${url}/api/food/remove`,{id:id})
    await fetchList();
    if (response.data.sucess) {
      toast.success("Item Deleted")
    }
    else{
      toast.error("Unable to delete item")
    }
  }
  useEffect(()=>{
    fetchList();
  },[])
  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className=" ">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b> 
          <b>Price</b>
          <b>Action</b>
          </div>
          {
            list.map((item,index)=>{
              return(
              <div key={index} className="list-table-format">
                <img src={`${url}/images/`+item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{item.price}</p>
                <p onClick={()=>{removeFood(item._id)}} className='cursor'>x</p>
              </div>
              )
            })
          }
      </div>
    </div>
  )
}

export default List