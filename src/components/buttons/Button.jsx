import { forwardRef } from 'react'

const variantStyles = {
  primary:
    'bg-nis-primary text-white hover:bg-nis-primary-light focus-visible:ring-nis-primary',
  secondary:
    'bg-nis-secondary text-white hover:bg-nis-secondary-light focus-visible:ring-nis-secondary',
  tertiary:
    'bg-nis-tertiary text-nis-primary hover:bg-nis-tertiary-dark focus-visible:ring-nis-tertiary',
  outline:
    'border-2 border-nis-primary text-nis-primary bg-transparent hover:bg-nis-primary hover:text-white focus-visible:ring-nis-primary',
  ghost:
    'text-nis-primary bg-transparent hover:bg-nis-primary/10 focus-visible:ring-nis-primary',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-7 py-3.5 text-lg gap-2.5',
}

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className = '',
      children,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'cursor-pointer select-none',
          variantStyles[variant] || variantStyles.primary,
          sizeStyles[size] || sizeStyles.md,
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : leftIcon ? (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!loading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
