import '@mantine/core/styles.css';
import { Link, BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import react from "react";
import React, { JSX } from "npm:@types/react";
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import {MantineProvider } from '@mantine/core';

import "./App.css";
import { Home } from "./pages/home.tsx";
import { Programmes } from "./pages/programmes.tsx";
import { Schedule } from "./pages/schedule.tsx";
import { Selected } from "./pages/selected.tsx";
import { NotFound } from "./pages/notfound.tsx";
import { ConfigContext } from "./contexts/ConfigContext.ts";
import Navbar from "./components/header.tsx";
import config from '../config/config.json' with { type: "json" };

'use client';

const ErrorFallBack: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Error encountered</p>
      <pre>{error.message}</pre>
    </div>
  );
}

function App() {
  return (
    <MantineProvider>
      <ErrorBoundary
        fallbackRender={ErrorFallBack}
      >
        <ConfigContext.Provider value={config}>
          <BrowserRouter>
              <Navbar />
                <div style={{marginTop: "3em"}}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/programmes" element={<Programmes />} />
                    <Route path="/selected" element={<Selected />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
          </BrowserRouter>
        </ConfigContext.Provider>
      </ErrorBoundary>
    </MantineProvider>
  );
}

export default App;
