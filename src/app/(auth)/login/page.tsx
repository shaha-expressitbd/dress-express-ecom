"use client";
import { Button } from "@/components/ui/atoms/button";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import { setUser } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setUser(result));
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800'>
      <h1 className='text-2xl font-bold text-center mb-6'>Login</h1>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4' role='alert'>
          <span className='block sm:inline'>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Email
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>
        <div>
          <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Password
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>
        <Button title='Login' type='submit' disabled={isLoading} className='w-full flex justify-center'>
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
      <p className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
        {"Don't have an account?"}
        <Link href='/register' className='text-indigo-600 hover:text-indigo-500'>
          {"Register here"}
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
