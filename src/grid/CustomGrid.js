import {React, useState} from 'react';
import BarnsGrid from './barn/BarnsGrid';
import MotelGrid from './motel/MotelGrid';
import BungalowGrid from './bungalow/BungalowGrid';
import SweatshopGrid from './sweatshop/SweatshopGrid';
import DocksGrid from './docks/DocksGrid';
import StorageGrid from './storage/StorageGrid';
import './CustomGrid.scss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const CustomGrid = ({ selectedBuilding, layout, setLayout, layoutUf, setLayoutUf }) => {
  const [floor, setFloor] = useState(0);
  const [showControlsDialog, setShowControlsDialog] = useState(false);

  const renderSelectedGrid = () => {
    const gridProps = { layout, setLayout, layoutUf, setLayoutUf, floor }; 
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

  const handleButtonSwitchFloor = () => {
    setFloor((prevFloor) => (prevFloor === 0 ? 1 : 0));
  };

  return (
    <div className="grid-content">
      <div className='grid-buttons' style={{ marginBottom: '10px' }}>
        {(selectedBuilding === 'Barn' || selectedBuilding === 'Docks') && (
          <Button
            type='button'
            size='lg'
            onClick={handleButtonSwitchFloor}
            className='btn btn-default'
          >
            Switch Floor
          </Button>
        )}
          <Button
            type='button'
            size='lg'
            onClick={() => setShowControlsDialog(true)}
            className='btn btn-default'
            style={{ marginLeft: '10px' }}
          >
            Controls
          </Button>
      </div>
      {renderSelectedGrid()}
      <Modal
        show={showControlsDialog}
        onHide={() => setShowControlsDialog(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Controls</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="controls-dialog">
            <p>Click and drag to place items on the grid</p>
            <p>Press R to rotate last dragged item</p>
            <p>Press D to duplicate last dragged item</p>
            <p>Press Delete to remove last dragged item</p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};


export default CustomGrid;
