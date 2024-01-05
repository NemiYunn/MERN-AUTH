import React from 'react'
import {Link} from 'react-router-dom'

export default function SignUp() {

  const [formData , setFormData] = React.useState({});
  const [error , setError] = React.useState(false)
  const [loading , setLoading] = React.useState(false)

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value})
  }

  //not mentioning whole path because we set up proxy on vite.config
    //catching response from backend after form submitting 
    //get response from the endpoint
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      setLoading(true)
      setError(false)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log(data);
      setLoading(false);
      if(!res.ok){
        setError(true);
        setLoading(false);
        return;
      }
    } catch(error){
      setLoading(false);
      setError(true);
    }
    
  }
  // console.log(formData);


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" name="" id="username" placeholder='Username'
        className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type="email" name="" id="email" placeholder='Email'
        className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" name="" id="password" placeholder='Password'
        className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading? "Loading.." : "Sign Up"}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
        <span className='text-blue-500'>Sign in</span>
        </Link> 
      </div>
      <p className='text-red-500 mt-5'>{error && "Something went wrong!!!"}</p>
    </div>
  )
  }
