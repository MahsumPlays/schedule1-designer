import React from 'react';
import BarnsGrid from '../grid/barn/BarnsGrid';
import MotelGrid from '../grid/motel/MotelGrid';
import BungalowGrid from '../grid/bungalow/BungalowGrid';
import SweatshopGrid from '../grid/sweatshop/SweatshopGrid';
import DocksGrid from '../grid/docks/DocksGrid';
import StorageGrid from '../grid/storage/StorageGrid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DesignView = ({ layout, layoutUf, property }) => {
  const gridProps = {
    layout,
    setLayout: () => {}, // falls nicht editierbar, leer lassen oder per Props übergeben
    layoutUf,
    setLayoutUf: () => {},
    floor: 0,
  };

  const renderGrid = () => {
    switch (property) {
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
        return <p>Unknown property type: {property}</p>;
    }
  };

  return (
    <div className="design-view-container">
      <DndProvider backend={HTML5Backend}>
        {renderGrid()}
      </DndProvider>
    </div>
  );
};

export default DesignView;
