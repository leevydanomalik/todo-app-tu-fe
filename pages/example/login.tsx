import React, { useState, useContext } from 'react';
import Image from 'next/image';
import { Label, Input, Button, WindmillContext } from '@roketid/windmill-react-ui';
import { GithubIcon, TwitterIcon } from 'icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTaskStore } from 'hooks/task/task-store';
import { useRouter } from 'next/router';

function LoginPage() {
  const { mode } = useContext(WindmillContext);
  const { login } = useTaskStore();
  const router = useRouter();

  const imgSource = mode === 'dark' ? '/assets/img/login-office-dark.jpeg' : '/assets/img/login-office.jpeg';

  // Local state for form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    console.log("data: ", username, password);
    try {
      await login(username, password);
      toast.success('Login successful!');
      router.push('/example'); // Redirect after login
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/2">
            <Image
              aria-hidden="true"
              className="hidden object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout="fill"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              <Label>
                <span>Username</span>
                <Input
                  className="mt-1"
                  type="text"
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                />
              </Label>

              <Button
                className="mt-4"
                block
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </Button>

              <hr className="my-8" />

              <Button block layout="outline">
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button className="mt-4" block layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button>

              <p className="mt-4">
                <a
                  href="#"
                  onClick={() => navigateTo('/example/forgot-password')}
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Forgot your password?
                </a>
              </p>
              <p className="mt-1">
                <a
                  href="#"
                  onClick={() => navigateTo('/example/create-account')}
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Create account
                </a>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
