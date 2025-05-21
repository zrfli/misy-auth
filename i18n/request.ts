import { getRequestConfig } from 'next-intl/server';
//import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  //const locales = ['en_US', 'tr'];
  const locale = 'tr';

  /*const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

  const locale: string = locales.includes(cookieLocale ?? '') ? cookieLocale! : defaultLocale;*/

  return { locale, messages: (await import(`./languages/${locale}.json`)).default };
});