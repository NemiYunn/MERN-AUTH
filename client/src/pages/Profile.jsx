import React from 'react'
import { useSelector } from 'react-redux'
//to connect file input feild and image feild
import { useRef } from 'react';
//getStorage
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';


export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  //create ref
  const fileRef = useRef(null);

  const [image, setImage] = React.useState(undefined);
  // console.log(image)

  //to track(store) image uploading precentage
  const [imagePercent, setImagePercent] = React.useState(0);
  const [imageError, setImageError] = React.useState(false);

  //to store updated formData
  const [formData , setFormData] = React.useState({});
  // console.log(formData)
  
  //whenever image state change
  React.useEffect(() => {
    if (image) {
      handleFileUpload(image)
    }
  }, [image])

  const handleFileUpload = async (image) => {
    // console.log(image)
    //add to storage
    // 1 get storage from firebase (we have already connect firebase (firebase.js -> export app))
    const storage = getStorage(app);
    // 2 create mage name(file name), unique
    const fileName = new Date().getTime() + image.name;
    // 3 ref is from firebase storage , pass the storage we get and image
    const storageRef = ref(storage, fileName);
    //  4 upload to the fireBase
    const uploadTask = uploadBytesResumable(storageRef, image);
    // 5  track uploading (track byte changes while uploading)
    uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot . totalBytes) * 100;
      // console.log(progress)
      setImagePercent(Math.round(progress));
    },
    (error) => {
      setImageError(true)
    },
    () => {
      // save new selected image url to the formData
      getDownloadURL(uploadTask.snapshot.ref).then (
        (downloadUrl) => 
          setFormData({...formData, profilePicture : downloadUrl })

      )
    }
    )
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        {/* 1 */}
        <input type="file"
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        {/* 2 */}
        {/* The current property of a ref holds the reference to the actual DOM element. */}
        {/* calling the click method on the DOM element referenced by fileRef.current.  */}
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="Profile"
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        // create storage on firebase to our project
        // to only accept images // add rules for firebase so user cannot change file type bythemselves

        //  allow read;
        // allow write: if
        // request.resource.size < 2 * 1024 * 1024 &&
        // request.resource.contentType.matches('image/.*')
        />
        <p className='text-sm self-center'>
          {imageError? (
            <span className='text-red-700'>Error uploading image (file size must be less than 2 MB) </span>
          ): imagePercent>0 && imagePercent<100 ? (
            <span className='text-stale-700'>
              {`Uploading: ${imagePercent} %`}
            </span>
          ): imagePercent === 100 ? (
            <span className='text-green-700'>Image Uploaded Successfully.</span>
          ): ''}
        </p>
        <input defaultValue={currentUser.username} type="text" name="username" id="username"
          placeholder='Username'
          className='bg-slate-100 rounded-lg p-3' />
        <input defaultValue={currentUser.email} type="email" name="email" id="email"
          placeholder='Email'
          className='bg-slate-100 rounded-lg  p-3 ' />
        <input type="password" name="password" id="password"
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3 ' />

        <button className='bg-slate-700 text-white p-3 rounded-lg 
        uppercase hover:opacity-95 disabled:opacity-80' type='button'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>

  )
}
