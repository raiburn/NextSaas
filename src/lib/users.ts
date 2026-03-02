import bcrypt from "bcryptjs";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
};

// Usuario demo (en producción esto viene de DB)
const demoPasswordHash = bcrypt.hashSync("Password123!", 10);

const users: User[] = [
  { id: "u_1", email: "oscar@example.com", passwordHash: demoPasswordHash },
];

export async function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}