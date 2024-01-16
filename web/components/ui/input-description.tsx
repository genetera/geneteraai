import React from "react";
import parse from "html-react-parser";

interface IProps {
  label: string;
  description: string;
}

const InputDescription = (props: IProps) => {
  return (
    <>
      <label htmlFor={props.label} className="font-bold text-sm text-dark-900">
        {props.label}
      </label>{" "}
      <br />
      <span className="text-xs font-semibold text-gray-500">
        {parse(props.description)}
      </span>
    </>
  );
};

export default InputDescription;
