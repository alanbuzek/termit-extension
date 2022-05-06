import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";
import Spinner from "./Spinner";

const sizeClassnames = {
  big: "py-2.5 px-4 text-base rounded-md",
  standard: "py-2 px-3 text-sm rounded-md",
  small: "px-2 py-1 text-xs rounded-md",
  icon: "p-0.5 text-xs rounded-md",
};

const colorClassnames = {
  primary: "bg-green-500 text-white font-semibold shadow-md hover:bg-green-400",
  neutral: "text-button hover:bg-gray-200 text-gray-600",
  flat: "text-gray-300 hover:text-gray-800",
  alert: "bg-red-600 text-white font-semibold shadow-md hover:bg-red-400",
  alertLight:
    "text-red-500 text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white",
  light: "hover:text-gray-300 text-white",
  secondary:
    "text-green-500 border border-green-500 hover:bg-green-500 hover:text-white",
};

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeClassnames;
  color?: keyof typeof colorClassnames;
  loading?: boolean;
  icon?: ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  children,
  size = "standard",
  color = "primary",
  disabled,
  loading,
  icon,
  className = "",
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={`${sizeClassnames[size]} ${
      disabled && color !== "secondary"
        ? "bg-gray-300 text-white font-semibold shadow-none cursor-default"
        : colorClassnames[color]
    } font-bold flex items-center justify-center transition duration-500 ease-in-out ${className} ${
      disabled ? "shadow-none" : ""
    }`}
    data-testid="button"
    role="button"
    {...props}
  >
    <span className={loading ? "opacity-0" : `flex items-center`}>
      {icon ? <span className="mr-2 items-center">{icon}</span> : null}
      {children}
    </span>
    {loading ? (
      <span className="absolute">
        <Spinner size={size === "small" ? "2" : "4"} />
      </span>
    ) : null}
  </button>
);

export default Button;
