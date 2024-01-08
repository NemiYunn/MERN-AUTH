import React from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
export default function SignIn() {

  const [formData , setFormData] = React.useState({});
 const {loading, error} = useSelector((state) => state.user);
  //initialize usenavigate
  const navigate = useNavigate();
  //initialize dispatch
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value})
  }

  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      dispatch(signInStart());
      //not mentioning whole path because we set up proxy on vite.config
      //catching response from backend after form submitting 
      //get response from the endpoint
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log(data);
      if(!res.ok){
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      //use navigate if everything is okay redirect to home page
      navigate('/');
    } catch(error){
     dispatch(signInFailure(error));
    }
    
  }
  // console.log(formData);


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" name="" id="email" placeholder='Email'
        className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" name="" id="password" placeholder='Password'
        className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading? "Loading.." : "Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to='/sign-up'>
        <span className='text-blue-500'>Sign up</span>
        </Link> 
      </div>
      <p className='text-red-500 mt-5'>
        {error? error.message || "Something went wrong!!!" : ''}
      </p>
    </div>
  )
  }
