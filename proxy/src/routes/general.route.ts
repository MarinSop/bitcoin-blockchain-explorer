import { FastifyInstance } from 'fastify';
import * as generalController from '../controllers/general.controller';

export async function generalRoutes(fastify: FastifyInstance) {
  fastify.get('/search/:query', generalController.search);
}
