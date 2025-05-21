import OAuthHeader from "@/components/oAuth/Layouts/header";
import OAuthFooter from "@/components/oAuth/Layouts/footer";
import OAuthSignOut from "@/components/oAuth/Layouts/sign-out";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function oAuth({ params }: { params: Promise<{ clientId: string }> }) {
  const session = await auth();
  const fullName = session?.user?.fullName || '--';
  const clientId = (await params).clientId;
  console.log(clientId)
  if (!session) return "session is not valid";

  const appName = "Misy";
  const appImage = "https://s3.misy.cloud/8ba04d58-ff2d-4f80-811b-29d368968265/avatar/d2bd42e7-55d3-4e6b-9d0f-5c024f7bf9a6.png?X-Amz-Acl=private&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=sem3YNqmguNsDro22prR%2F20250406%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250406T092156Z&X-Amz-Expires=21600&X-Amz-SignedHeaders=host&X-Amz-Signature=9efd1f9dd53f2ccf6130f13fc11cd87bcc6300affb39b653e3a8f0d56ace01b4";
  const privacyPolicyUrl = "https://example.com/privacy-policy";
  const termsOfServiceUrl = "https://example.com/terms-of-service";

  return (
    <div className="min-h-dvh h-full flex flex-col">
      <OAuthHeader authToken={session?.authToken} />
      
      <div className="flex flex-1 justify-center items-center">
        <div className="relative h-auto w-full max-w-lg">
          <div className="flex flex-col items-center">
            <Image src={appImage} className="object-cover" width={96} height={96} alt="" unoptimized />
            <div className="mt-4 text-center text-black dark:text-white">
              <p className="text-xl font-semibold">Continue as {fullName}?</p>
              <p className="text-sm font-medium">{appName} will receive your name and profile picture.</p>
              <OAuthSignOut fullName={fullName} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 text-center text-xs font-medium text-black">
        <p>By continuing, {appName} will receive ongoing access to the information you share and Meta will record when {appName} accesses it.</p>
        <p> 
          <Link href={termsOfServiceUrl} target="_blank" className="text-blue-600 hover:underline">Learn more</Link>{" "}
          about this sharing and the settings you have.
        </p>
      </div>

      <OAuthFooter 
        fullName={fullName} 
        appName={appName}
        termsOfServiceUrl={termsOfServiceUrl}
        privacyPolicyUrl={privacyPolicyUrl}
      />
    </div>
  );
}