import React from "react";
import { Button, Color } from "@tremor/react";

interface IProps {
  children?: any;
  color?: Color;
  icon?: any;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}
const ButtonSecondary = (props: IProps) => {
  return (
    <Button
      className={props.className}
      color={props.color ? props.color : "gray"}
      variant="secondary"
      icon={props.icon}
      size={props.size ? props.size : "sm"}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default ButtonSecondary;
