import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Sidebar() {

  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path ? 'bg-[#00954C]' : 'bg-stone-700 hover:bg-stone-900';
  };
  return (
    <div className='w-full md:w-1/6  md:bg-stone-800 text-white h-auto md:h-full flex flex-row md:flex-col md:absolute gap-2 p-2'>
         <Link to="/" className='w-full'><p className={`py-4 text-center rounded-xl w-full ${isActive("/")}`}>Dashboard</p></Link>
        <Link to="/payments" className='w-full'><p className={`py-4 text-center rounded-xl w-full ${isActive("/payments")}`}>Payments</p></Link>
        <Link to="/services" className='w-full'><p className={`py-4 text-center rounded-xl w-full ${isActive("/services")}`}>Services</p></Link>
        <hr className='hidden md:block border-t border-stone-500 mx-2' />
    </div>
  )
}

export default Sidebar