import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { DropdownIcon, IIcon } from 'icons';
import * as Icons from 'icons';
import { IRoute, routeIsActive } from 'routes/sidebar';
import SidebarContext from 'context/SidebarContext';
import Link from 'next/link';

function Icon({ icon, ...props }: IIcon) {
  // Dynamically render the icon based on the provided name
  const _Icon = Icons[icon];
  return <_Icon {...props} />;
}

interface ISidebarSubmenu {
  route: IRoute;
  linkClicked: () => void;
}

function SidebarSubmenu({ route, linkClicked }: ISidebarSubmenu) {
  const { pathname } = useRouter();
  const { saveScroll } = useContext(SidebarContext);

  // Manage dropdown menu state
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(
    route.routes
      ? route.routes.some((r) => routeIsActive(pathname, r))
      : false
  );

  // Toggle the dropdown menu
  function handleDropdownMenuClick() {
    setIsDropdownMenuOpen(!isDropdownMenuOpen);
  }

  return (
    <li className="relative px-6 py-3" key={route.name}>
      {/* Highlight active parent menu */}
      {isDropdownMenuOpen && (
        <span
          className="absolute h-12 inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
          aria-hidden="true"
        ></span>
      )}
      {/* Parent menu button */}
      <button
        className={`inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
          isDropdownMenuOpen ? 'dark:text-gray-100 text-gray-800' : ''
        }`}
        onClick={handleDropdownMenuClick}
        aria-haspopup="true"
      >
        <span className="inline-flex items-center">
          <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon || ''} />
          <span className="ml-4">{route.name}</span>
        </span>
        <DropdownIcon
          className={`w-4 h-4 transform transition-transform duration-150 ${
            isDropdownMenuOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown menu */}
      <ul
        className={`p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900 transition-all ${
          isDropdownMenuOpen ? 'max-h-xl opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-label="submenu"
      >
        {route.routes &&
          route.routes.map((r) => (
            <li
              className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
              key={r.name}
            >
              <Link href={r.path || ''} scroll={false}>
                <span
                  className={`w-full inline-block ${
                    routeIsActive(pathname, r)
                      ? 'dark:text-gray-100 text-gray-800'
                      : ''
                  }`}
                  onClick={linkClicked}
                >
                  {r.name}
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </li>
  );
}

export default SidebarSubmenu;
