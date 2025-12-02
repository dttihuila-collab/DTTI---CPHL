import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUsers, addUser, updateUser, deleteUser } from './_db';
import { User } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
    
  switch (req.method) {
    case 'GET':
      try {
        const users = getUsers();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
      }
      break;

    case 'POST':
      try {
        const newUser = addUser(req.body as Omit<User, 'id'>);
        res.status(201).json(newUser);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar usuário.' });
      }
      break;
      
    case 'PUT':
      try {
          const { id } = req.query;
          if (!id) return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
          
          const updatedUser = updateUser({ ...req.body, id: Number(id) } as User);
          if (updatedUser) {
              res.status(200).json(updatedUser);
          } else {
              res.status(404).json({ message: 'Usuário não encontrado.' });
          }
      } catch (error) {
          res.status(500).json({ message: 'Erro ao atualizar usuário.' });
      }
      break;

    case 'DELETE':
      try {
          const { id } = req.query;
          if (!id) return res.status(400).json({ message: 'ID do usuário é obrigatório.' });

          const success = deleteUser(Number(id));
          if (success) {
              res.status(204).end();
          } else {
              res.status(404).json({ message: 'Usuário não encontrado.' });
          }
      } catch (error) {
          res.status(500).json({ message: 'Erro ao eliminar usuário.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
