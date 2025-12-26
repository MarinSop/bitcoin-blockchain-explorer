import { FastifyInstance } from 'fastify';
import * as blockController from '../controllers/block.controller.js';

export async function blockRoutes(fastify: FastifyInstance) {
  fastify.get('/latest', blockController.getLatestBlock);

  fastify.get('/info', blockController.getBlockchainInfo);

  fastify.get('/:hash', blockController.getBlockByHash);
}
