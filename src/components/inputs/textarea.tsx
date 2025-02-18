import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

interface TextAreaProps extends ComponentProps<'textarea'> {
    label: string
    error?: string
}

export const TextArea = ({ label, error, ...props }: TextAreaProps) => {
    return (
        <div>
            <label htmlFor={props.id} className="block text-sm/6 text-gray-900 font-bold">
                {label}
            </label>
            <div className="mt-2">
                <textarea
                    {...props}
                    id={props.id}
                    placeholder={props.placeholder}
                    className={twMerge(
                        "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900",
                        "outline-none h-64",
                        "placeholder:text-gray-500",
                        "focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary",
                        "border border-gray-300 active:border-primary",
                        "sm:text-sm/6",
                        error && "outline-red-500 focus:outline-red-500"
                    )}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500">
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}