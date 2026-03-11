import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
  <h1 className="text-xl font-bold text-indigo-600">MyApp</h1>
  <div className="flex gap-6 text-sm font-medium text-gray-700">
    <Link to="/" className="hover:text-indigo-500 transition">Home</Link>
    <Link to="/about" className="hover:text-indigo-500 transition">About</Link>
  </div>
</nav>

  );
}

export default Navbar;
