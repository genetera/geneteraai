import React from "react";
import { Button } from "@tremor/react";

interface IProps {
  type?: any;
  children?: any;
  icon?: any;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "emerald" | "rose";
  className?: string;
  loading?: boolean;
  onClick?: () => void;
}
const ButtonPrimary = (props: IProps) => {
  return (
    <Button
      type={props.type}
      className={props.className}
      color={props.color ? props.color : "emerald"}
      icon={props.icon}
      onClick={props.onClick}
      size={props.size ? props.size : "sm"}
      loading={props.loading}
    >
      {props.children}
    </Button>
  );
};

export default ButtonPrimary;
