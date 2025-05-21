const BUCKET_ENDPOINT = process.env.NEXT_PUBLIC_S3_ENDPOINT;
const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

export const ASSETS = {
  logo: `${BUCKET_ENDPOINT}/${BUCKET_NAME}/main/logo.svg`,
  icons: {
    eDevlet: `${BUCKET_ENDPOINT}/${BUCKET_NAME}/main/auth/icon/e-devlet-icon.svg`,
    forgotPasswordSuccess: `${BUCKET_ENDPOINT}/${BUCKET_NAME}/main/auth/icon/forgot-password-success.webp`
  },
  profile: {
    defaultAvatar: `${BUCKET_ENDPOINT}/${BUCKET_NAME}/main/profile/avatar/default.webp`
  }
};