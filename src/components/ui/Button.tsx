"use client";

import clsx from "clsx";
import React from "react";

interface ButtonProsp {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProsp> = ({
  type,
  fullWidth,
  children,
  secondary,
  danger,
  disabled,
}) => {
  return <div></div>;
};

export default Button;
