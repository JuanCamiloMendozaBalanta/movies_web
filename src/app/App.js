import React from 'react';

//STYLE
import './app.scss';

//CONTEXT
import { MProvider } from '../provider/provider';

//COMPONENTS
import Home from '../components/home/home';

function App() {
  return (
    <div className="App">
      <MProvider>
        <Home />
      </MProvider>
    </div>
  );
}

export default App;
