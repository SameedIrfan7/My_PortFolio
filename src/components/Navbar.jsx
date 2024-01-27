import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

import { logo } from "../assets/images";
import { gitLink } from "../constants";

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
        <NavLink key={Link.name} to={Link.link} target='_blank'>
        <div className="w-10 h-10 rounded-lg  bg-white items-center justify-center flex font-bold shadow-md">
          {gitLink.map((link) => (
            <Link key={link.name} to={link.link} target='_blank'>
            <img
              src={link.iconUrl}
              alt={link.name}
              className='w-6 h-6 object-contain'
            />
          </Link>
          ))}
        </div>
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
