import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';

function Restaurant() {
    let params = useParams()
    const [rest, setRest] = useState({})
    const [menu, setMenu] = useState([])

    
  useEffect( () => {

    const restaurant = async () => {
        try {
        const response = await axios.get(`${URL}/restaurant/${params.id}`); // ver si me trae el resto que estoy tocando
        setRest(response.data.message)
        }
        catch (error) {
        console.log(error);
        }
    };

  const menu = async () => {
    try {
      const response = await axios.post(`${URL}/menu/restaurant`,{email: rest.email}) // ver si me traes los menus del resto wue le estoy pidiendo
      console.log(response);
      setMenu(response.data.message)
 
    }
    catch (error) {
      console.log(error);
    }
  };


 // si me dan las ods infos anteriores hacer el generico de lo que me devuelve

  menu()
  restaurant()
},[]);
    
  return (
    <div>Restaurant
        <h2>{params.id}</h2>
        </div>
    
  )
}

export default Restaurant