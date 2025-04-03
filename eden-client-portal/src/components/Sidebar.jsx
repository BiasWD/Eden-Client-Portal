import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='w-1/6 bg-stone-800 text-white h-full flex flex-col absolute'>
         <Link to="/"><p className='py-4 text-center hover:bg-stone-900 w-full'>Dashboard</p></Link>
        <Link to="/payments"><p className='py-4 text-center hover:bg-stone-900 w-full'>Payments</p></Link>
        <Link to="/services"><p className='py-4 text-center hover:bg-stone-900 w-full'>Services</p></Link>
        <hr className='border-t border-stone-500 mx-2' />
    </div>
  )
}

export default Sidebar