import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export default function Button({
  as = 'button',
  to,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'glow'
  disabled = false,
  className,
  children,
  ...props
}) {
  const Comp = as === 'link' || to ? Link : as;

  return (
    <Comp
      to={to}
      disabled={disabled}
      className={clsx(
        'btn', // base style from globals.css
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-ghost': variant === 'ghost',
          'btn-glow': variant === 'glow',
        },
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}