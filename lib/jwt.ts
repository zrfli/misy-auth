import { SignJWT } from 'jose';

interface Props {
  id?: string;
  role: string;
  bucketId?: string;
  bucketRegion?: string
}

const secretKey = process.env.JWT_SECRET_KEY || '';

export async function generateAuthJwt({ id, role, bucketId, bucketRegion }: Props): Promise<string> {
  if (!secretKey) throw new Error('JWT secret key is not defined');
  if (!id || !role) throw new Error('User ID and role are required');

  const encoder = new TextEncoder();
  const secret = encoder.encode(secretKey);

  const token = await new SignJWT({ userId: id, role: role, bucketId: bucketId, bucketRegion: bucketRegion })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  return token;
}
