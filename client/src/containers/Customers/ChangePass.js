import React from 'react'
import { useState, useEffect } from 'react';
import Modal from 'react-modal'
import axios from 'axios';
import {URL} from '../../config' 

function ChangePass({user}) {
    const [passwords,setPasswords]= useState({newPassword:'', newPassword2:''})
    const [message,setMessage]= useState('')
    const [openClose, setOpenClose]= useState('')

    console.log(user);

  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () =>{
    setIsOpen(true);
    setOpenClose('open')
  }

  const closeModal=() => {
    setIsOpen(false);
    setOpenClose('close')
  }

const handleChange = (e) => {setPasswords({...passwords,[e.target.name]:e.target.value})}

const handleSubmit = async (e) => {
        e.preventDefault()
         try{
             const response = await axios.post(`${URL}/customer/updatePassword`, {
                email:user.userEmail,
                newPassword:passwords.newPassword,
                newPassword2:passwords.newPassword2})
             setMessage(response.data.message)}
         catch(error){
             console.log(error);
         }}

         useEffect(()=>{
          setMessage('');
          },[openClose, passwords])

  return (
    <div>
      <button onClick={openModal}>Change your Password</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal">

        <button onClick={closeModal}>Close</button>

        <form onSubmit={handleSubmit} onChange={handleChange}>
        <label>New Password:</label><input name='newPassword'/>
        <label>Repeat New Password:</label><input name='newPassword2'/>
       <button>Change</button>
       </form>
       <h3>{message}</h3>
      </Modal>
    </div>
  );
}

export default ChangePass