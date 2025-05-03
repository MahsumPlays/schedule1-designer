import React from 'react';
import BarnsGrid from './barn/BarnsGrid';
import MotelGrid from './motel/MotelGrid';
import BungalowGrid from './bungalow/BungalowGrid';
import SweatshopGrid from './sweatshop/SweatshopGrid';
import DocksGrid from './docks/DocksGrid';
import StorageGrid from './storage/StorageGrid';
import './CustomGrid.scss';

const CustomGrid = ({ selectedBuilding }) => {

  const renderSelectedGrid = () => {
    switch (selectedBuilding) {
      case 'Barn':
        return <BarnsGrid />;
      case 'Motel':
        return <MotelGrid />;
      case 'Bungalow':
        return <BungalowGrid />;
      case 'Sweatshop':
        return <SweatshopGrid />;
      case 'Docks':
        return <DocksGrid />;
      case 'Storage':
        return <StorageGrid />;
      default:
        return <div>Select a Grid</div>;
    }
  };

  return (
    <div>
      <div className="grid-content">
        {renderSelectedGrid()}
      </div>
    </div>
  );
};

export default CustomGrid;
