import { NavLink } from "react-router-dom";

import { logo } from "../assets/images";

const Navbar = () => {
  return (
    <header className='header'>
      <NavLink to='/' className="w-10 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md">
        {/* <img src={logo} alt='logo' className='w-18 h-18 object-contain' /> */}
        <p className="blue-gradient_text">SI</p>
      </NavLink>
      <nav className='flex text-lg gap-7 font-medium'>
        <div className="blue-gradient_text">
        <NavLink to='/about' className={({ isActive }) => isActive ? "text-blue-600" : "text-black w-20 h-8 rounded-lg bg-white items-center justify-center flex font-bold shadow-md" }>
          About
        </NavLink>
        </div>
        <NavLink to='/projects' className={({ isActive }) => isActive ? "text-blue-600" : "text-black w-24 h-8 rounded-lg bg-white items-center justify-center flex font-bold shadow-md"}>
          Projects
        </NavLink>
        
      </nav>
    </header>
  );
};

export default Navbar;
