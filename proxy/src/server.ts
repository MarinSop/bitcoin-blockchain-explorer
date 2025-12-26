import { buildApp } from './app';

const start = async () => {
  try {
    const server = await buildApp();
    await server.ready();
    await server.listen({ port: server.config.PORT, host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${server.config.PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
