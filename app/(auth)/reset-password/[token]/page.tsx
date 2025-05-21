import { auth } from "@/auth";
import { redis } from "@/lib/redis";
import { CACHE } from "@/utils/cacheConfig";
import ResetPassword from "@/components/Auth/Password-Reset";

export default async function forgotPassword({ params }: { params : Promise<{ token : string }> }) {
    const session = await auth();

    if (session) return <div>oturum açık</div>

    const token = ((await params).token);

    const cachedData = await redis.get(CACHE.passwordReset.KEY_PREFIX + CACHE.symbol + token);
    const data = cachedData || null;

    if (!data) return <div>expired or missing</div>

    return <ResetPassword token={token} />
}