import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Checks if the given JWT token is still valid based on its expiration time.
 * 
 * @param token - The JWT token to check.
 * @returns boolean - True if the token is valid, false otherwise.
 */
export const isTokenValid = (token: string): boolean => {
  try {
    // Decode the token without verifying the signature to extract the payload
    const decodedToken = jwt.decode(token) as JwtPayload;

    if (!decodedToken || !decodedToken.exp) {
      // Token is invalid if it has no 'exp' field
      return false;
    }

    // Current time in seconds (Unix time)
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if the token is still valid
    return decodedToken.exp > currentTime;
  } catch (error) {
    // Return false if any error occurs during decoding
    return false;
  }
};
