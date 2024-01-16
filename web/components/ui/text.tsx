import React from "react";

interface IProps {
  children: string | undefined;
  className: string;
}
const Text = (props: IProps) => {
  return (
    <span className={`dark:text-white ${props.className}`}>
      {props.children}
    </span>
  );
};

export default Text;
