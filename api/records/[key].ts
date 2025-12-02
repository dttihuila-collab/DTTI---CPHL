import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRecords, addRecord, deleteRecord } from '../_db';
import { ApiKey } from '../../types';

const isValidApiKey = (key: any): key is ApiKey => {
    return ['criminalidade', 'sinistralidade', 'resultados', 'transportes', 'logistica'].includes(key);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { key } = req.query;

  if (typeof key !== 'string' || !isValidApiKey(key)) {
      return res.status(400).json({ message: 'Chave de API inválida.' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const records = getRecords(key);
        res.status(200).json(records);
      } catch (error) {
        res.status(500).json({ message: `Erro ao buscar registos para ${key}.` });
      }
      break;

    case 'POST':
      try {
        const newRecord = addRecord(key, req.body);
        res.status(201).json(newRecord);
      } catch (error) {
        res.status(500).json({ message: `Erro ao adicionar registo para ${key}.` });
      }
      break;

    case 'DELETE':
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ message: 'ID do registo é obrigatório.' });

            const success = deleteRecord(key, Number(id));
            if (success) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: 'Registo não encontrado.' });
            }
        } catch (error) {
            res.status(500).json({ message: `Erro ao eliminar registo para ${key}.` });
        }
        break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
