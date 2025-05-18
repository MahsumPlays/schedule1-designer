import React, { useState, useEffect } from 'react';
import './App.scss';
import CustomGrid from './grid/CustomGrid';
import PlanerHeader from './header/planer-header';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { furnitureItems } from './data/items';
import ItemPicker from './item-picker/ItemPicker';
import ReactGA from 'react-ga4';
import Calculator from './calculator/Calculator';
import RankingOverview from './ranking/RankingOverview';
import Footer from './footer/Footer';
import { Routes, Route } from 'react-router-dom';
import DesignView from './ranking/DesignView';

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState('Barn');
  const [layout, setLayout] = useState([]);
  const [layoutUf, setLayoutUf] = useState([]);
  const TRACKING_ID = "G-96L8929EGY";
  ReactGA.initialize(TRACKING_ID);

  useEffect(() => { ReactGA.send({ hitType: "pageview", page: window.location.pathname }); }, []);

  const handleSelectBuilding = (newBuilding) => {
    setSelectedBuilding(newBuilding);
    setLayout([]);
    setLayoutUf([]);
  };
  return (
    <div className="App">
      <div className='first-view'>
        <PlanerHeader onSelectBuilding={handleSelectBuilding} />
        <Routes>
          <Route
            path="/"
            element={
              <div className="app-content">
                <DndProvider backend={HTML5Backend}>
                  <ItemPicker items={furnitureItems} />
                  <CustomGrid
                    selectedBuilding={selectedBuilding}
                    layout={layout}
                    setLayout={setLayout}
                    layoutUf={layoutUf}
                    setLayoutUf={setLayoutUf}
                  />
                </DndProvider>
                <div className='tutorial'>
                  <Calculator layout={[...layout, ...layoutUf]} />
                </div>
              </div>
            }
          />
          <Route path="/ranking" element={<RankingOverview />} />
          <Route path="/design/:id" element={<DesignView />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
