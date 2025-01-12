import { Link, BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import React from "react";
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import "./App.css";
import { Home } from "./pages/home.tsx";
import { Programmes } from "./pages/programmes.tsx";
import { Schedule } from "./pages/schedule.tsx";
import { Selected } from "./pages/selected.tsx";
import { NotFound } from "./pages/notfound.tsx";
import Navbar from "./components/header.tsx";
import '@mantine/core/styles.css';
import {MantineProvider } from '@mantine/core';

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
    <>
    <MantineProvider>
        <ErrorBoundary
          fallbackRender={ErrorFallBack}
        >
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/programmes" element={<Programmes />} />
              <Route path="/selected" element={<Selected />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
        </MantineProvider>
    </>
  );
}

export default App;
