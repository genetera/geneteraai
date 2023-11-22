"use client";

import React from "react";
import Link from "next/link";
import { RssIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "@/components/ui/buttons/button";
import Input from "@/components/ui/input";

const SignUp = () => {
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link href="/" className="flex mb-6">
            <RssIcon className="h-8 mr-2 font-bold" />
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
              Genetera
            </span>
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign up
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <Input
                  label="First name"
                  type="text"
                  name="firstname"
                  id="firstname"
                />
                <Input
                  label="Last name"
                  type="text"
                  name="lastname"
                  id="lastname"
                />
                <Input label="Email" type="email" name="email" id="email" />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  id="password"
                />
                <Input
                  label="Confirm password"
                  type="password"
                  name="password"
                  id="password"
                />

                <ButtonPrimary className="w-full">Sign up</ButtonPrimary>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/app/sign-in"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
