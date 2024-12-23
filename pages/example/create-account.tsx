import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GithubIcon, TwitterIcon } from "icons";
import { Input, Label, Button, WindmillContext } from "@roketid/windmill-react-ui";
import { useUserStore } from "hooks/user/user-store";

function CrateAccount() {
  const { mode } = useContext(WindmillContext);
  const { createUser } = useUserStore(); // Access the createUser function from the store
  const imgSource =
    mode === "dark"
      ? "/assets/img/create-account-office-dark.jpeg"
      : "/assets/img/create-account-office.jpeg";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToPrivacyPolicy: false,
  });

  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setError("");

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate privacy policy agreement
    if (!formData.agreeToPrivacyPolicy) {
      setError("You must agree to the privacy policy");
      return;
    }

    try {
      // Call createUser from the user store
      await createUser({
        username: formData.email.split("@")[0], // Use the email's username part as a default
        email: formData.email,
        password: formData.password,
        roleIds: [2], // Default role ID, replace as needed
        status: "ACTIVE",
        createdById: 1, // Replace with the appropriate createdById
      });

      alert("Account created successfully!");
    } catch (error) {
      console.error("Failed to create account:", error);
      setError("Failed to create account. Please try again.");
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
                Create account
              </h1>
              {error && <p className="text-red-600">{error}</p>}
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@doe.com"
                />
              </Label>
              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="***************"
                />
              </Label>
              <Label className="mt-4">
                <span>Confirm password</span>
                <Input
                  className="mt-1"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="***************"
                />
              </Label>

              <Label className="mt-6" check>
                <Input
                  type="checkbox"
                  name="agreeToPrivacyPolicy"
                  checked={formData.agreeToPrivacyPolicy}
                  onChange={handleInputChange}
                />
                <span className="ml-2">
                  I agree to the <span className="underline">privacy policy</span>
                </span>
              </Label>

              <Button block className="mt-4" onClick={handleSubmit}>
                Create account
              </Button>

              <hr className="my-8" />

              <Button block layout="outline">
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button block className="mt-4" layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button>

              <p className="mt-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Already have an account? Login
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CrateAccount;

