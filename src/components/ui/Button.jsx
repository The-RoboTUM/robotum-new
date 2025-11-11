import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { scrollToSection } from "@utils/scrollToSection";

export default function Button({
  as = "button",
  to,
  variant = "primary", // 'primary' | 'secondary' | 'ghost' | 'glow'
  disabled = false,
  scrollTarget, // 👈 new prop for scroll section id
  className,
  children,
  ...props
}) {
  const Comp = as === "link" || to ? Link : as;
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    // Scroll within the same page
    if (scrollTarget && !to) {
      e.preventDefault();
      scrollToSection(scrollTarget);
      return;
    }

    // Navigate and then scroll to section (for example /partners#contact)
    if (to && scrollTarget) {
      e.preventDefault();
      navigate(to);
      setTimeout(() => scrollToSection(scrollTarget), 400);
    }

    // Normal behavior otherwise
    if (props.onClick) props.onClick(e);
  };

  return (
    <Comp
      to={to}
      disabled={disabled}
      onClick={handleClick}
      className={clsx(
        "btn cursor-pointer",
        {
          "btn-primary": variant === "primary",
          "btn-secondary": variant === "secondary",
          "btn-ghost": variant === "ghost",
          "btn-glow": variant === "glow",
        },
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
