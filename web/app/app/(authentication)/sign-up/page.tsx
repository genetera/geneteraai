"use client";

import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

import { RssIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "@/components/ui/buttons/button";
import Input from "@/components/ui/input";

import { toastify } from "@/helpers/toast";
import AuthenticationService from "@/services/authentication";
import { ISignUpCredentials } from "@/types/authentication";

const SignUp = () => {
  const defaultValues: ISignUpCredentials = {
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ISignUpCredentials>({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const signupHandler: SubmitHandler<ISignUpCredentials> = async (data) => {
    try {
      await AuthenticationService.signUp(data);
      toastify({
        icon: "success",
        title:
          "Registered successfully. Check your email to activate your account.",
      });
      reset(defaultValues);
    } catch (error: any) {
      toastify({
        icon: "error",
        title: error?.error,
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
                Sign up
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(signupHandler)}
              >
                <Input
                  label="First name"
                  type="text"
                  name="first_name"
                  id="first_name"
                  register={register}
                  validations={{
                    required: "First name is required",
                  }}
                  error={errors.first_name}
                />
                <Input
                  label="Last name"
                  type="text"
                  name="last_name"
                  id="last_name"
                  register={register}
                  validations={{
                    required: "Last name is required",
                  }}
                  error={errors.last_name}
                />
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
                <Input
                  label="Confirm password"
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  register={register}
                  validations={{
                    required: "Confirm Password is required",
                  }}
                  error={errors.confirm_password}
                />

                <ButtonPrimary className="w-full">
                  {isSubmitting ? "Signing up...." : "Sign up"}
                </ButtonPrimary>

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
