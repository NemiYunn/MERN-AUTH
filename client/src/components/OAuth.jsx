//install firebase to the client
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import {app} from '../firebase'; // the app (firebase.js) we created inside src
import { useDispatch  } from 'react-redux';
import { signInSuccess} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


export default function OAuth() {
  const navigate = useNavigate();

  //initialize dispatch
  const dispatch = useDispatch();

  const handleGoogleClick = async()=> {
    try{
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      // console.log(result);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json(); //convert res to json 
      //add data to the redux tool kit
      //import distpatch
      console.log(data);
      dispatch(signInSuccess(data));
      navigate('/');
    }catch(error){
      console.log("Could not login with google" , error);
    }
  }

  return (
    <button type='button' onClick={handleGoogleClick}
    className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>
      Continue with Google
    </button>
  )
}
