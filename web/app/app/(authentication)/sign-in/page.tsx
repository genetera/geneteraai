"use client";

import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

import { RssIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "@/components/ui/buttons/button";
import Input from "@/components/ui/input";
import { Toast } from "@/helpers/toast";
import AuthenticationService from "@/services/authentication";

import { ISignInCredentials } from "@/types/authentication";
import { GoogleLoginButton } from "@/components/authentication/google-sign-in";

const SignIn = () => {
  const defaultValues: ISignInCredentials = {
    email: "",
    password: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ISignInCredentials>({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const loginHandler: SubmitHandler<ISignInCredentials> = async (data) => {
    console.log(data);
    try {
      await AuthenticationService.signIn(data);
      Toast.fire({
        icon: "success",
        title: "Signed in successfully",
      });

      reset(defaultValues);
      window.location.href = "/app/dashboard/";
    } catch (error: any) {
      Toast.fire({
        icon: "error",
        title: error?.error,
      });
    }
  };

  const handleGoogleSignIn = async ({ clientId, credential }: any) => {
    try {
      if (clientId && credential) {
        await AuthenticationService.googleSignIn({
          credential,
          clientId,
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });
        window.location.href = "/app/dashboard/";
      } else {
        throw Error("Cant find credentials");
      }
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Error signing in!",
      });
    }
  };
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
                Sign in
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(loginHandler)}
              >
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  id="email"
                  register={register}
                  validations={{
                    required: "Email ID is required",
                    validate: (value: any) =>
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        value
                      ) || "Email ID is not valid",
                  }}
                  error={errors.email}
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  id="password"
                  register={register}
                  validations={{
                    required: "Password is required",
                  }}
                  error={errors.password}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="text-gray-500 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <Link
                    href="/app/password-reset/"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <ButtonPrimary className="w-full">Sign in</ButtonPrimary>
                <GoogleLoginButton handleSignIn={handleGoogleSignIn} />

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    href="/app/sign-up/"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
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

export default SignIn;
