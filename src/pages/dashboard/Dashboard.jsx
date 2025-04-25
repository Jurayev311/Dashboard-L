import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'

const Dashboard = () => {
  const navigate = useNavigate();

  const handleDelete = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <aside className="w-[286px] bg-[#1E2939] text-white p-6 flex flex-col min-h-screen">
        <div className="flex items-center justify-center mb-8">
          <img className='w-[80px] h-[80px]' src={logo} alt="logo image" />
        </div>
        <nav className="flex-1">
          <ul className='text-center leading-5'>
            <li className="mt-1.5">
              <NavLink
                to="/dashboard/products"
                end
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${isActive ? 'bg-green-500' : 'hover:bg-gray-700'}`
                }
              >
                Products
              </NavLink>
            </li>
            <li className="mt-1.5">
              <NavLink
                to="category"
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${isActive ? 'bg-green-500' : 'hover:bg-gray-700'}`
                }
              >
                Category
              </NavLink>
            </li>
            <li className="mt-1.5">
              <NavLink
                to="discount"
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${isActive ? 'bg-green-500' : 'hover:bg-gray-700'}`
                }
              >
                Discount
              </NavLink>
            </li>
            <li className="mt-1.5">
              <NavLink
                to="sizes"
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${isActive ? 'bg-green-500' : 'hover:bg-gray-700'}`
                }
              >
                Sizes
              </NavLink>
            </li>
            <li className="mt-1.5">
              <NavLink
                to="colors"
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${isActive ? 'bg-green-500' : 'hover:bg-gray-700'}`
                }
              >
                Colors
              </NavLink>
            </li>
            <li className="mt-1.5">
              <NavLink
                to="faq"
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${isActive ? 'bg-green-500' : 'hover:bg-gray-700'}`
                }
              >
                FAQ
              </NavLink>
            </li>
            <li className="mt-1.5">
              <NavLink
                to="contact"
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${isActive ? 'bg-green-500' : 'hover:bg-gray-700'}`
                }
              >
                Contact
              </NavLink>
            </li>
            <li className="mt-1.5">
              <NavLink
                to="team"
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${isActive ? 'bg-green-500' : 'hover:bg-gray-700'}`
                }
              >
                Team
              </NavLink>
            </li>
            <li className="mt-1.5">
              <NavLink
                to="news"
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${isActive ? 'bg-green-500' : 'hover:bg-gray-700'}`
                }
              >
                News
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <button
          onClick={handleDelete}
          className="mt-auto py-1.5 px-3.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Log Out
        </button>
        </div>
        <div className="flex items-center justify-center">
          <div className='bg-white w-full min-h-[200px] shadow-md rounded-md'>
          <p className="text-lg p-2.5 font-bold text-black">
            <Outlet />
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
