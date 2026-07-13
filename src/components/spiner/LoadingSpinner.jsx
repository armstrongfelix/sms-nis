const sizeStyles = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  className = '',
}) {
  const spinner = (
    <svg
      className={[
        'animate-spin',
        sizeStyles[size] || sizeStyles.md,
        'text-nis-primary',
        className,
      ].join(' ')}
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
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center" role="status">
      {spinner}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
