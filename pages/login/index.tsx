// import React, { useState, useContext } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// import { Label, Input, Button, WindmillContext } from '@roketid/windmill-react-ui';
// import { GithubIcon, TwitterIcon } from 'icons';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from 'next/navigation';
// import { useAuth } from 'hooks/auth/auth-store';
// import { useUser } from 'context/UserContext';

// function LoginPage() {
//   const { mode } = useContext(WindmillContext);
//   const { login } = useAuth();
//   const router = useRouter();
//   const { handleLogin } = useUser();

//   const imgSource =
//     mode === "dark"
//       ? "/assets/img/create-account-office-dark.jpeg"
//       : "/assets/img/create-account-office.jpeg";

//   // Local state for form fields
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent the default form submission behavior
//     setLoading(true);
//     try {
//       await handleLogin(username, password); // Call the context-provided login handler
//     } catch (error) {
//       toast.error('Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleLogin = async () => {
//   //   setLoading(true);
//   //   console.log("data: ", username, password);

//   //   try {
//   //     const user = await login(username, password); // Assuming `login` returns the user object with roles
//   //     toast.success('Login successful!');

//   //     console.log("user_roles", user)

//   //     // Redirect based on the user's role
//   //     if (user.roles.includes('ROLE_USER')) {
//   //       router.push('/example');
//   //     } else {
//   //       router.push('/example');
//   //     }
//   //   } catch (error) {
//   //     toast.error('Invalid credentials. Please try again.');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   return (
//     <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
//       <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
//         <div className="flex flex-col overflow-y-auto md:flex-row">
//           <div className="relative h-32 md:h-auto md:w-1/2">
//             <Image
//               aria-hidden="true"
//               className="object-cover w-full h-full"
//               src={imgSource}
//               alt="Office"
//               layout="fill"
//             />
//           </div>
//           <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
//             <div className="w-full">
//               <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
//                 Login to TODO Apps (G6)
//               </h1>
//               <Label>
//                 <span>Username</span>
//                 <Input
//                   className="mt-1"
//                   type="text"
//                   placeholder="john_doe"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />
//               </Label>

//               <Label className="mt-4">
//                 <span>Password</span>
//                 <Input
//                   className="mt-1"
//                   type="password"
//                   placeholder="***************"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </Label>

//               <Button
//                 className="mt-4"
//                 block
//                 type="submit"
//                 onClick={handleLogin}
//                 disabled={loading}
//               >
//                 {loading ? 'Logging in...' : 'Log in'}
//               </Button>

//               <hr className="my-8" />

//               <Button block layout="outline">
//                 <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
//                 Github
//               </Button>
//               <Button className="mt-4" block layout="outline">
//                 <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
//                 Twitter
//               </Button>

//               {/* <p className="mt-4">
//                 <Link href="/example/forgot-password" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
//                   Forgot your password?
//                 </Link>
//               </p> */}
//               <p className="mt-1 mx-auto flex justify-center">
//                 <Link href="/signup" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
//                   If you dont have account, just create it!
//                 </Link>
//               </p>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

"use client"

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Label, Input, Button, WindmillContext } from '@roketid/windmill-react-ui';
import { GithubIcon, TwitterIcon } from 'icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from 'context/UserContext';

function LoginPage() {
  const { mode } = useContext(WindmillContext);
  const { handleLogin } = useUser();

  const imgSource =
    mode === "dark"
      ? "/assets/img/create-account-office-dark.jpeg"
      : "/assets/img/create-account-office.jpeg";

  // Local state for form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log('Form submitted with:', { username, password }); // Debugging log
    setLoading(true);
    try {
      await handleLogin(username, password); // Call the context-provided login handler
      console.log('Login successful'); // Debugging log
    } catch (error) {
      console.error('Login error:', error); // Debugging log
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/2">
            <Image
              aria-hidden="true"
              className="object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout="fill"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login to TODO Apps (G6)
              </h1>
              <form onSubmit={onSubmit}>
                <Label>
                  <span>Username</span>
                  <Input
                    className="mt-1"
                    type="text"
                    placeholder="john_doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Label>

                <Label className="mt-4">
                  <span>Password</span>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="***************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Label>

                <Button
                  className="mt-4"
                  block
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </Button>
              </form>

              <hr className="my-8" />

              <Button block layout="outline">
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button className="mt-4" block layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button>

              <p className="mt-1 mx-auto flex justify-center">
                <Link href="/signup" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                  If you don't have an account, just create it!
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

