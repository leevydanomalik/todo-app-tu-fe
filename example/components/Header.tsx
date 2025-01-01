"use client"


import { useContext, useState, useEffect, useRef } from 'react';
import SidebarContext from 'context/SidebarContext';
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from 'icons';
import { Avatar, Badge, Input, WindmillContext } from '@roketid/windmill-react-ui';
import { useRouter } from 'next/navigation';
import { useAuth } from 'hooks/auth/auth-store';
import { useUser } from 'context/UserContext';

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const { logout } = useAuth();
  const { user } = useUser();

  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Refs for dropdown menus
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  // Function to handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        notificationsMenuRef.current &&
        !notificationsMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      < div className="container flex items-center justify-end h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Search input */}
        {/* <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search for projects"
              aria-label="Search"
            />
          </div>
        </div> */}

        {/* Right Menu */}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          <li>
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === 'dark' ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>

          {/* Notifications Menu */}
          {/* <li className="relative" ref={notificationsMenuRef}>
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={() => setIsNotificationsMenuOpen(!isNotificationsMenuOpen)}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <BellIcon className="w-5 h-5" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
              ></span>
            </button>
            {isNotificationsMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-48 dark:bg-gray-800">
                <button className="block px-4 py-2 text-sm">Messages</button>
                <button className="block px-4 py-2 text-sm">Sales</button>
                <button className="block px-4 py-2 text-sm">Alerts</button>
              </div>
            )}
          </li> */}

          {/* Profile Menu */}
          <li className="relative" ref={profileMenuRef}>
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar
                className="align-middle"
                src={`https://randomuser.me/api/portraits/men/${user?.userId}.jpg`}
                alt=""
                aria-hidden="true"
              />
              <span className='ml-2 font-bold'><span className='font-light'>Hi</span>, {user?.username || "NA"}</span>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-48 dark:bg-gray-800">
                <button className="flex items-center px-4 py-2 text-sm">
                  <OutlinePersonIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  Profile
                </button>
                <button className="flex items-center px-4 py-2 text-sm">
                  <OutlineCogIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  Settings
                </button>
                <button
                  className="flex items-center px-4 py-2 text-sm text-red-500"
                  onClick={handleLogout}
                >
                  <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  Log out
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
