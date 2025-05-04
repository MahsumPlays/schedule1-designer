import React from 'react';
import BarnsGrid from './barn/BarnsGrid';
import MotelGrid from './motel/MotelGrid';
import BungalowGrid from './bungalow/BungalowGrid';
import SweatshopGrid from './sweatshop/SweatshopGrid';
import DocksGrid from './docks/DocksGrid';
import StorageGrid from './storage/StorageGrid';
import './CustomGrid.scss';

const CustomGrid = ({ selectedBuilding, layout, setLayout, layoutUf, setLayoutUf }) => {

  const renderSelectedGrid = () => {
    const gridProps = { layout, setLayout, layoutUf, setLayoutUf }; 
    switch (selectedBuilding) {
      case 'Barn':
        return <BarnsGrid {...gridProps} />;
      case 'Motel':
        return <MotelGrid {...gridProps} />;
      case 'Bungalow':
        return <BungalowGrid {...gridProps} />;
      case 'Sweatshop':
        return <SweatshopGrid {...gridProps} />;
      case 'Docks':
        return <DocksGrid {...gridProps} />;
      case 'Storage':
        return <StorageGrid {...gridProps} />;
      default:
        return <div>Select a Grid</div>;
    }
  };

  return (
    <div className="grid-content">
      {renderSelectedGrid()}
    </div>
  );
};


export default CustomGrid;
