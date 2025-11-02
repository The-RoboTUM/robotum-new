import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function Button({
  children,
  variant = 'primary',
  as = 'button',
  to,
  className,
  ...props
}) {
  const Component = as === 'link' ? Link : 'button';
  const variantClass = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    ghost: 'btn btn-ghost',
  }[variant];

  return (
    <Component
      to={as === 'link' ? to : undefined}
      className={clsx(variantClass, className)}
      {...props}
    >
      {children}
    </Component>
  );
}