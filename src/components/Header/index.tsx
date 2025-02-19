'use client'

export interface HeaderProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

export default function Header({ title, description, children }: HeaderProps) {
    return (
        <div className="mx-auto px-8 pt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-base font-bold text-gray-900">{title}</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            {description}
                        </p>
                    </div>
                </div>
                {children && (
                    <div className="flex items-center gap-4">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
