import React from "react";
import type { UseFormRegister } from "react-hook-form";
interface IProps {
  label?: string;
  type: string;
  name: string;
  id: string;
  onChange?: any;
  validations?: any;
  register?: UseFormRegister<any>;
  error?: any;
  className?: string;
  placeholder?: string;
}

const Input = (props: IProps) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {props.label}
      </label>
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        placeholder={props.placeholder}
        {...(props.register && props.register(props.name, props.validations))}
        onChange={(e) => {
          props.register && props.register(props.name).onChange(e);
          props.onChange && props.onChange(e);
        }}
        className={`"bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
        ${props.error ? "border-red-500" : ""}
        `}
      />
      {props.error?.message && (
        <div className="text-sm text-red-500">{props.error.message}</div>
      )}
    </div>
  );
};

export default Input;
