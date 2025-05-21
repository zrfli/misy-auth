import Link from "next/link";

interface Props {
  privacyPolicyUrl: string
  termsOfServiceUrl: string
  fullName: string
  appName: string
}

export default function oAuthFooter({ privacyPolicyUrl, termsOfServiceUrl, fullName, appName }: Props) {
  return (
    <footer className="bottom-0 z-50 border-t w-full border-neutral-300 dark:border-neutral-600 bg-white dark:bg-black">
      <nav className="px-4 lg:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <span className="text-xs font-medium text-center md:text-left">
            {appName}{" "}
            <Link href={privacyPolicyUrl} target="_blank" className="text-blue-600 hover:underline">Privacy Policy</Link>{" "}
            and{" "}
            <Link href={termsOfServiceUrl} target="_blank" className="text-blue-600 hover:underline">Terms of Service</Link>
          </span>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button className="text-black bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 font-medium rounded-lg text-xs sm:w-auto px-4 py-2 text-center cursor-pointer transition-colors duration-300">
              Not Now
            </button>
            <button className="text-white bg-blue-500 hover:bg-blue-600 border border-neutral-300 font-semibold rounded-lg text-xs sm:w-auto px-4 py-2 text-center cursor-pointer transition-colors duration-300">
              Continue as {fullName}
            </button>
          </div>
        </div>
      </nav>
    </footer>
  )
}