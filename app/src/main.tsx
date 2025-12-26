import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.ts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home.tsx';
import { TxPage } from './pages/TxPage.tsx';
import { BlockPage } from './pages/BlockPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tx/:txId" element={<TxPage />} />
          <Route path="/block/:hash" element={<BlockPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
