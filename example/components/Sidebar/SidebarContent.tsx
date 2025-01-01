// import Link from 'next/link';
// import routes, { routeIsActive } from 'routes/sidebar';
// import user_routes, { userRouteIsActive } from 'routes/sidebar-user';

// import * as Icons from 'icons';
// import { IIcon } from 'icons';
// import SidebarSubmenu from './SidebarSubmenu';
// import { Button } from '@roketid/windmill-react-ui';
// import { useRouter } from 'next/router';
// import { useState } from 'react';
// import { useUser } from 'context/UserContext';

// function Icon({ icon, ...props }: IIcon) {
//   // @ts-ignore
//   const Icon = Icons[icon];
//   return <Icon {...props} />;
// }

// interface ISidebarContent {
//   linkClicked: () => void;
// }

// function SidebarContent({ linkClicked }: ISidebarContent) {
//   const { pathname } = useRouter();
//   const appName = process.env.NEXT_PUBLIC_APP_NAME;
//   const {user} = useUser();

//   console.log("user.sidebar", user)

//   return (
//     <div className="text-gray-500 dark:text-gray-400">
//       <Link href="/#" scroll={false}>
//         <div className="ml-6 py-6 text-2xl font-bold">{appName}</div>
//       </Link>
//       <ul>
//         {routes.map((route) =>
//           route.routes ? (
//             <SidebarSubmenu
//               route={route}
//               key={route.name}
//               linkClicked={linkClicked}
//             />
//           ) : (
//             <li className="relative px-6 py-3" key={route.name}>
//               <Link
//                 href={route.path || '#'}
//                 scroll={false}
//                 className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${routeIsActive(pathname, route)
//                   ? 'dark:text-gray-100 text-gray-800'
//                   : ''
//                   }`}
//                 onClick={linkClicked}
//               >
//                 {routeIsActive(pathname, route) && (
//                   <span
//                     className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
//                     aria-hidden="true"
//                   ></span>
//                 )}
//                 <Icon
//                   className="w-5 h-5"
//                   aria-hidden="true"
//                   icon={route.icon || ''}
//                 />
//                 <span className="ml-4">{route.name}</span>
//               </Link>
//             </li>
//           )
//         )}
//       </ul>
//     </div>
//   );
// }

// export default SidebarContent;

import Link from 'next/link';
import routes, { routeIsActive } from 'routes/sidebar';
import user_routes, { userRouteIsActive } from 'routes/sidebar-user';

import * as Icons from 'icons';
import { IIcon } from 'icons';
import SidebarSubmenu from './SidebarSubmenu';
import { useRouter } from 'next/router';
import { useUser } from 'context/UserContext';

function Icon({ icon, ...props }: IIcon) {
  // @ts-ignore
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

interface ISidebarContent {
  linkClicked: () => void;
}

function SidebarContent({ linkClicked }: ISidebarContent) {
  const { pathname } = useRouter();
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const { user } = useUser();

  // Determine which routes to use based on the user's role
  const activeRoutes =
    user?.roles?.includes('ROLE_USER') ? user_routes : routes;

  const isActive =
    user?.roles?.includes('ROLE_USER') ? userRouteIsActive : routeIsActive;

  return (
    <div className="text-gray-500 dark:text-gray-400">
      <Link href="/#" scroll={false}>
        <div className="ml-6 py-6 text-2xl font-bold">{appName}</div>
      </Link>
      <ul>
        {activeRoutes.map((route) =>
          route.routes ? (
            <SidebarSubmenu
              route={route}
              key={route.name}
              linkClicked={linkClicked}
            />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <Link
                href={route.path || '#'}
                scroll={false}
                className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                  isActive(pathname, route) ? 'dark:text-gray-100 text-gray-800' : ''
                }`}
                onClick={linkClicked}
              >
                {isActive(pathname, route) && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                )}
                <Icon
                  className="w-5 h-5"
                  aria-hidden="true"
                  icon={route.icon || ''}
                />
                <span className="ml-4">{route.name}</span>
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default SidebarContent;

