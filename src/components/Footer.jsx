import { Link } from "react-router-dom";

import { socialLinks } from "../constants";

const Footer = () => {
  return (
    <footer className='footer font-space text-[#C0C0C0]'>
      <hr className='border-[#333333] my-2' />

      <div className='footer-container'>
        <p className='text-sm text-[#C0C0C0] font-inter'>
          © {new Date().getFullYear()} <strong className='text-white font-semibold font-space'>Sameed Irfan</strong>. Engineered with precision.
        </p>

        <div className='flex gap-4 justify-center items-center'>
          {socialLinks.map((link) => (
            <Link key={link.name} to={link.link} target='_blank' className='p-2.5 rounded-xl bg-[#242424] border border-[#383838] hover:border-[#E10600] hover:shadow-[0_0_15px_rgba(225,6,0,0.35)] transition-all duration-300'>
              <img
                src={link.iconUrl}
                alt={link.name}
                className='w-5 h-5 object-contain filter invert opacity-80 hover:opacity-100 transition-opacity'
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
