import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user)
    //this Navigate is component and iffer from useNavigate
    //oulet compo shows children which is inside(wrap inside) PrivateRoute compo in app.jsx
    return currentUser ? <Outlet /> : <Navigate to='/sign-in' />
}
