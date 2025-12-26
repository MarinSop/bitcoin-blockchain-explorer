import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import Client from 'bitcoin-core';
import { EnvSchema, EnvConfig } from './config/env';
import { blockRoutes } from './routes/block.route';
import { txRoutes } from './routes/transaction.route';
import { generalRoutes } from './routes/general.route';

interface BitcoinRpcClient extends Client {
  getBlockchainInfo(): Promise<any>;
  getBestBlockHash(): Promise<string>;
  getBlock(hash: string, verbosity?: number): Promise<any>;
  getRawTransaction(txid: string, verbose?: boolean): Promise<any>;
  getBlockHash(height: number): Promise<string>;
  getBlockHeader(hash: string): Promise<any>;
  getBlockStats(hash: string, stats?: string[]): Promise<any>;

  [methodName: string]: any;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvConfig;
    rpc: BitcoinRpcClient;
  }
}

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  await app.register(fastifyEnv, {
    schema: EnvSchema,
    dotenv: true,
  });

  const client = new Client({
    host: app.config.BTC_RPC_URL,
    username: app.config.BTC_RPC_USER,
    password: app.config.BTC_RPC_PASS,
    timeout: 10000,
  });

  app.decorate('rpc', client as BitcoinRpcClient);

  await app.register(cors, { origin: true });

  app.register(generalRoutes, { prefix: '/api' });
  app.register(blockRoutes, { prefix: '/api/block' });
  app.register(txRoutes, { prefix: '/api/tx' });

  return app;
}
