import React from 'react';
import NewtonSimulation from './NewtonSimulation';

/**
 * Main App Entry Point
 * This renders the NewtonSimulation component developed for the IDT assignment.
 */
function App() {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh' }}>
      <NewtonSimulation />
    </div>
  );
}

export default App;