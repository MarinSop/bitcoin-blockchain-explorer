import { FastifyInstance } from 'fastify';
import * as txController from '../controllers/transaction.controller';

export async function txRoutes(fastify: FastifyInstance) {
  fastify.get('/:txid', txController.getTransaction);
}
