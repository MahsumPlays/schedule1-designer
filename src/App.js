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
      </div>
    </div>
  );
}

export default App;
