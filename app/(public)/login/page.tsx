import Image from "next/image";

export default function Login() {
    return (
        <>
            {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-gray-50">
          <body class="h-full">
          ```
        */}
            <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Image
                        alt="Sua Empresa"
                        src="/assets/images/crawlerx-logo.png"
                        className="mx-auto size-[180px]"
                        width={180}
                        height={180}
                    />
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                            Login
                        </h2>
                        <form action="#" method="POST" className="space-y-6 mt-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    Endereço de e-mail
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-brand-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Senha
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-brand-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-3">
                                    <div className="flex h-6 shrink-0 items-center">
                                        <div className="group grid size-4 grid-cols-1">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-brand-600 checked:bg-brand-600 indeterminate:border-brand-600 indeterminate:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                            />
                                            <svg
                                                fill="none"
                                                viewBox="0 0 14 14"
                                                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                            >
                                                <path
                                                    d="M3 8L6 11L11 3.5"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="opacity-0 group-has-[:checked]:opacity-100"
                                                />
                                                <path
                                                    d="M3 7H11"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <label htmlFor="remember-me" className="block text-sm/6 text-gray-900">
                                        Lembrar de mim
                                    </label>
                                </div>

                                <div className="text-sm/6">
                                    <a href="#" className="font-semibold text-brand-600 hover:text-brand-500">
                                        Esqueceu a senha?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-brand-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                                >
                                    Entrar
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Ainda não é membro?{' '}
                        <a href="#" className="font-semibold text-brand-600 hover:text-brand-500">
                            Comece seu teste gratuito de 14 dias
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
