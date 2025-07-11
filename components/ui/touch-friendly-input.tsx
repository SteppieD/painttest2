import * as React from "react"
export interface TouchFriendlyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
}

const TouchFriendlyInput = React.forwardRef<HTMLInputElement, TouchFriendlyInputProps>(
  ({ className, type, label, helperText, error, ...props }, ref) => {
    const inputId = React.useId()
    
    return (
      <div>
        {label && (
          <label 
            htmlFor={inputId} 
           
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
         
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {helperText && !error && (
          <p id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    )
  }
)
TouchFriendlyInput.displayName = "TouchFriendlyInput"

export { TouchFriendlyInput }