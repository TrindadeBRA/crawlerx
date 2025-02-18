import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

interface ButtonProps extends ComponentProps<'button'> {
    isLoading?: boolean
    onClick?: () => void
    label?: string
}

export const Button = ({ isLoading, onClick, label, ...props }: ButtonProps) => {
    return (
        <div>
            <button
                disabled={isLoading}
                className={twMerge(
                    "w-full rounded-md bg-primary px-3.5 py-2.5",
                    "text-center text-sm font-semibold text-white",
                    "shadow-sm hover:bg-primary/90",
                    "focus-visible:outline focus-visible:outline-2",
                    "focus-visible:outline-offset-2 focus-visible:outline-primary",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                {...props}
                onClick={onClick}
            >
                {label}
            </button>
        </div>
    )
}