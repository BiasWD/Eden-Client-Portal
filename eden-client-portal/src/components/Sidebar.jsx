import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='w-full md:w-1/6  bg-stone-800 text-white h-auto md:h-full flex flex-row md:flex-col md:absolute gap-2 p-2'>
         <Link to="/" className='w-full'><p className='py-4 text-center hover:bg-stone-900 bg-stone-700 rounded-xl w-full'>Dashboard</p></Link>
        <Link to="/payments" className='w-full'><p className='py-4 text-center hover:bg-stone-900 bg-stone-700 rounded-xl w-full'>Payments</p></Link>
        <Link to="/services" className='w-full'><p className='py-4 text-center hover:bg-stone-900 bg-stone-700 rounded-xl w-full'>Services</p></Link>
        <hr className='hidden md:block border-t border-stone-500 mx-2' />
    </div>
  )
}

export default Sidebar