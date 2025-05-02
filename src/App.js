import React, { useState, useEffect } from 'react';
import './App.scss';
import CustomGrid from './grid/CustomGrid';
import PlanerHeader from './header/planer-header';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { furnitureItems } from './data/items';
import ItemPicker from './item-picker/ItemPicker';
import ReactGA from 'react-ga4';

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState('Barn');
  const TRACKING_ID = "G-96L8929EGY";
  ReactGA.initialize(TRACKING_ID);

  useEffect(() => { ReactGA.send({ hitType: "pageview", page: window.location.pathname }); }, []);

  return (
    <div className="App">
      <PlanerHeader onSelectBuilding={setSelectedBuilding} />
      <div className="app-content">
        <DndProvider backend={HTML5Backend}>
          <ItemPicker items={furnitureItems} />
          <CustomGrid selectedBuilding={selectedBuilding} />
        </DndProvider>
        <div className='tutorial'>
            <h2>Controls</h2>
            <p>Click and drag to place items on the grid</p>
            <p>Press R to rotate last dragged item</p>
            <p>Press Delete to remove last dragged item</p>
          </div>
      </div>
    </div>
  );
}

export default App;
