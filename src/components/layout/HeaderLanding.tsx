import { Link } from "react-router-dom";
import { Terminal, Sun, Moon } from 'lucide-react';

type HeaderProps = {
  theme: string;
  toggleTheme: () => void;
};

export function Header({ theme, toggleTheme }: HeaderProps) {
  return (
    <div className="navbar bg-neutral text-neutral-content sticky top-0 z-50 shadow-lg">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm transition duration-150 ease-in-out hover:bg-neutral-focus active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52 text-sm">
              <li><a className="transition duration-150 ease-in-out hover:text-primary hover:bg-neutral-focus">Features</a></li>
              <li><a className="transition duration-150 ease-in-out hover:text-primary hover:bg-neutral-focus">Pricing</a></li>
              <li><a className="transition duration-150 ease-in-out hover:text-primary hover:bg-neutral-focus">About</a></li>
              <li><a className="transition duration-150 ease-in-out hover:text-primary hover:bg-neutral-focus">Contact</a></li>
            </ul>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Interview<span className="text-primary">AI</span></span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1 text-sm">
            <li><a className="transition duration-150 ease-in-out hover:text-primary rounded-md">Features</a></li>
            <li><a className="transition duration-150 ease-in-out hover:text-primary rounded-md">Pricing</a></li>
            <li><a className="transition duration-150 ease-in-out hover:text-primary rounded-md">About</a></li>
            <li><a className="transition duration-150 ease-in-out hover:text-primary rounded-md">Contact</a></li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
            {theme === 'lemonade' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <Link to="/login" className="btn btn-outline btn-primary btn-sm transition duration-150 ease-in-out hover:bg-primary hover:text-primary-content active:scale-95">
            Log In
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm transition duration-150 ease-in-out hover:opacity-90 active:scale-95">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
} 