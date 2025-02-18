import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface Option {
    id: number
    name: string
    value: string
    disabled?: boolean
}

interface SelectProps extends ComponentProps<'select'> {
    label: string
    error?: string
    options: Option[]
}

export const Select = ({ label, error, options, ...props }: SelectProps) => {
    return (
        <div>
            <label htmlFor={props.id} className="block text-sm/6 text-gray-900 font-bold">
                {label}
            </label>
            <div className="mt-2 grid grid-cols-1">
                <select
                    {...props}
                    id={props.id}
                    className={twMerge(
                        "col-start-1 row-start-1 w-full appearance-none rounded-md bg-white px-3 py-1.5 text-base text-gray-900",
                        "outline-none",
                        "placeholder:text-gray-500",
                        "focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary",
                        "border border-gray-300 active:border-primary",
                        "sm:text-sm/6",
                        error && "outline-red-500 focus:outline-red-500"
                    )}
                >
                    {options.map((option) => (
                        <option 
                            key={option.id} 
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.name}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
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
