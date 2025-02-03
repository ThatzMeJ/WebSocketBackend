import * as bcrypt from 'bcrypt';

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // Adjust as needed for security and performance
  const salt = await bcrypt.genSalt(saltRounds); 
  return await bcrypt.hash(password, salt);
}

// Compare a password with a hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
}