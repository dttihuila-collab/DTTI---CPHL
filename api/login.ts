import type { VercelRequest, VercelResponse } from '@vercel/node';
import { findUserByCredentials } from './_db';
import { User } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }

  const user = findUserByCredentials(username, password);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(401).json({ message: 'Credenciais inválidas.' });
  }
}
