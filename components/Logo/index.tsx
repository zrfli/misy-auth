//import { ASSETS } from '@/utils/bucketContent';
import Image from 'next/image';

interface LogoProps { LogoClass?: string }

export const Logo = ({ LogoClass }: LogoProps) => {
    return <Image priority={true} className={`${LogoClass} dark:invert`} src={'/logo.svg'} width={96} height={96} alt="" />
}