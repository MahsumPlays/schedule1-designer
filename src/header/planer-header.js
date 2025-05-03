import React from 'react';
import './planer-header.scss';

const PlanerHeader = ({ onSelectBuilding }) => {
  return (
    <header className='header-container'>
      <h2 className='header-title'>Schedule I - Designer</h2>
      <div className='header-buttons-container'>
        <button className='header-button' onClick={() => onSelectBuilding('Motel')}>Motel</button>     
        <button className='header-button' onClick={() => onSelectBuilding('Sweatshop')}>Sweatshop</button>
        <button className='header-button' onClick={() => onSelectBuilding('Bungalow')}>Bungalow</button>
        <button className='header-button' onClick={() => onSelectBuilding('Barn')}>Barn</button>
        <button className='header-button' onClick={() => onSelectBuilding('Docks')}>Docks</button>
        <button className='header-button' onClick={() => onSelectBuilding('Storage')}>Storage</button>
      </div>
    </header>
  );
};

export default PlanerHeader;
