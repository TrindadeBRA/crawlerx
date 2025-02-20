'use client'

import { ListBulletIcon } from "@heroicons/react/24/solid";

export interface HeaderProps {
    title: string;
    description: string;
    children?: React.ReactNode;
    icon?: React.ElementType;
}

export default function Header({ title, description, children, icon: Icon = ListBulletIcon }: HeaderProps) {
    return (
        <div className="mx-auto px-8 pt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Icon className="size-12 text-primary border-2 border-primary rounded-full p-2" />
                    <div className="flex flex-col gap-y-1">
                        <h1 className="text-base font-bold text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-700">
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
