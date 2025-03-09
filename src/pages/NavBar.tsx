import { Link } from 'react-router-dom';
import { Hospital } from 'lucide-react';

export default function NavBar() {
    return <>
        <div className="absolute inset-0 bg-black/20"></div>
        <nav className="relative z-10 container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hospital className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">QueueCare</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-white hover:text-blue-200 transition">Home</Link>
              <Link to="/about" className="text-white hover:text-blue-200 transition">About Us</Link>
              <Link to="/contact" className="text-white hover:text-blue-200 transition">Contact</Link>
            </div>
            <Link to="/login" className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition">
              Login
            </Link>
          </div>
        </nav>
    </>
}