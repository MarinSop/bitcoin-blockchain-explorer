import { Type, Static } from '@sinclair/typebox';

export const EnvSchema = Type.Object({
  PORT: Type.Number({ default: 3001 }),
  BTC_RPC_URL: Type.String({ default: 'http://127.0.0.1' }),
  BTC_RPC_PORT: Type.Number({ default: 8332 }),
  BTC_RPC_USER: Type.String(),
  BTC_RPC_PASS: Type.String(),
});

export type EnvConfig = Static<typeof EnvSchema>;
