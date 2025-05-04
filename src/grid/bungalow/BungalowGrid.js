import React, { useState, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import '../CustomGrid.scss';
import './BungalowGrid.scss';
import { handleDragStop, useFurnitureDrop, useKeyboardShortcuts } from '../../services/GridService';

const BungalowGrid = ({ layout, setLayout, layoutUf, setLayoutUf }) => {
  const cols = 24;
  const rows = 24;
  const cellSize = 25;
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  const [layoutKey, setLayoutKey] = useState(0);
  const isDragging = useRef(false);
  const [activeItemKey, setActiveItemKey] = useState(null);

  const blockedCells = [
    { x: 12, y: 0 },
    { x: 13, y: 0 },
    { x: 14, y: 0 },
    { x: 15, y: 0 },
    { x: 16, y: 0 },
    { x: 17, y: 0 },
    { x: 18, y: 0 },
    { x: 19, y: 0 },
    { x: 20, y: 0 },
    { x: 21, y: 0 },
    { x: 22, y: 0 },
    { x: 23, y: 0 },
    { x: 12, y: 1 },
    { x: 13, y: 1 },
    { x: 14, y: 1 },
    { x: 15, y: 1 },
    { x: 16, y: 1 },
    { x: 17, y: 1 },
    { x: 18, y: 1 },
    { x: 19, y: 1 },
    { x: 20, y: 1 },
    { x: 21, y: 1 },
    { x: 22, y: 1 },
    { x: 23, y: 1 },
    { x: 12, y: 2 },
    { x: 13, y: 2 },
    { x: 14, y: 2 },
    { x: 15, y: 2 },
    { x: 16, y: 2 },
    { x: 17, y: 2 },
    { x: 18, y: 2 },
    { x: 19, y: 2 },
    { x: 20, y: 2 },
    { x: 21, y: 2 },
    { x: 22, y: 2 },
    { x: 23, y: 2 },
    { x: 12, y: 3 },
    { x: 13, y: 3 },
    { x: 14, y: 3 },
    { x: 15, y: 3 },
    { x: 16, y: 3 },
    { x: 17, y: 3 },
    { x: 18, y: 3 },
    { x: 19, y: 3 },
    { x: 20, y: 3 },
    { x: 21, y: 3 },
    { x: 22, y: 3 },
    { x: 23, y: 3 },
    { x: 12, y: 4 },
    { x: 13, y: 4 },
    { x: 14, y: 4 },
    { x: 15, y: 4 },
    { x: 16, y: 4 },
    { x: 17, y: 4 },
    { x: 18, y: 4 },
    { x: 19, y: 4 },
    { x: 20, y: 4 },
    { x: 21, y: 4 },
    { x: 22, y: 4 },
    { x: 23, y: 4 },
    { x: 12, y: 5 },
    { x: 13, y: 5 },
    { x: 14, y: 5 },
    { x: 15, y: 5 },
    { x: 16, y: 5 },
    { x: 17, y: 5 },
    { x: 18, y: 5 },
    { x: 19, y: 5 },
    { x: 20, y: 5 },
    { x: 21, y: 5 },
    { x: 22, y: 5 },
    { x: 23, y: 5 },
    { x: 12, y: 6 },
    { x: 13, y: 6 },
    { x: 14, y: 6 },
    { x: 15, y: 6 },
    { x: 16, y: 6 },
    { x: 17, y: 6 },
    { x: 18, y: 6 },
    { x: 19, y: 6 },
    { x: 20, y: 6 },
    { x: 21, y: 6 },
    { x: 22, y: 6 },
    { x: 23, y: 6 },
    { x: 12, y: 7 },
    { x: 13, y: 7 },
    { x: 14, y: 7 },
    { x: 15, y: 7 },
    { x: 16, y: 7 },
    { x: 17, y: 7 },
    { x: 18, y: 7 },
    { x: 19, y: 7 },
    { x: 20, y: 7 },
    { x: 21, y: 7 },
    { x: 22, y: 7 },
    { x: 23, y: 7 },
    { x: 12, y: 8 },
    { x: 13, y: 8 },
    { x: 14, y: 8 },
    { x: 15, y: 8 },
    { x: 16, y: 8 },
    { x: 17, y: 8 },
    { x: 18, y: 8 },
    { x: 19, y: 8 },
    { x: 20, y: 8 },
    { x: 21, y: 8 },
    { x: 22, y: 8 },
    { x: 23, y: 8 },
    { x: 12, y: 9 },
    { x: 13, y: 9 },
    { x: 14, y: 9 },
    { x: 15, y: 9 },
    { x: 16, y: 9 },
    { x: 17, y: 9 },
    { x: 18, y: 9 },
    { x: 19, y: 9 },
    { x: 20, y: 9 },
    { x: 21, y: 9 },
    { x: 22, y: 9 },
    { x: 23, y: 9 },
    { x: 12, y: 10 },
    { x: 13, y: 10 },
    { x: 14, y: 10 },
    { x: 15, y: 10 },
    { x: 16, y: 10 },
    { x: 17, y: 10 },
    { x: 18, y: 10 },
    { x: 19, y: 10 },
    { x: 20, y: 10 },
    { x: 21, y: 10 },
    { x: 22, y: 10 },
    { x: 23, y: 10 },
    { x: 12, y: 11 },
    { x: 13, y: 11 },
    { x: 14, y: 11 },
    { x: 15, y: 11 },
    { x: 16, y: 11 },
    { x: 17, y: 11 },
    { x: 18, y: 11 },
    { x: 19, y: 11 },
    { x: 20, y: 11 },
    { x: 21, y: 11 },
    { x: 22, y: 11 },
    { x: 23, y: 11 },
  ];

  const doorOut = [
    { x: 14, y: 13}, 
    { x: 14, y: 13 }, 
    { x: 14, y: 13 }, 
    { x: 15, y: 12}, 
    { x: 15, y: 12}, 
    { x: 15, y: 12}, 

  ]

  const doorLR = [
    { x: 11, y: 13 }, 
    { x: 11, y: 14 }, 
    { x: 11, y: 15 }, 
    { x: 11, y: 20 }, 
    { x: 11, y: 21}, 
    { x: 11, y: 22 }, 
  ]
  
  const doorK = [
    { x: 5, y: 11 }, 
    { x: 6, y: 11 }, 
    { x: 5, y: 12 }, 
    { x: 6, y: 12 }, 
  ]

  const doorGarden = [
    { x: 19, y: 23 },
    { x: 18, y: 23 },  
  ]

  const wallLR = [
    { x: 11, y: 12 },
    { x: 11, y: 15 }, 
    { x: 11, y: 16 }, 
    { x: 11, y: 17 }, 
    { x: 11, y: 18 }, 
    { x: 11, y: 19 }, 
    { x: 11, y: 23 }, 
  ]

  const wallK = [
    { x: 11, y: 12 },
    { x: 10, y: 12 }, 
    { x: 9, y: 12 }, 
    { x: 8, y: 12 }, 
    { x: 7, y: 12 }, 
    { x: 4, y: 12 }, 
    { x: 3, y: 12 },
    { x: 2, y: 12 }, 
    { x: 1, y: 12 }, 
    { x: 0, y: 12 }, 
  ]

  const kitchen = [
    { x: 0, y: 23 },
    { x: 1, y: 23 },
    { x: 2, y: 23 },
    { x: 3, y: 23 },
    { x: 4, y: 23 },
    { x: 5, y: 23 },
    { x: 6, y: 23 },
    { x: 7, y: 23 },
    { x: 0, y: 22 },
    { x: 1, y: 22 },
    { x: 2, y: 22 },
    { x: 3, y: 22 },
    { x: 4, y: 22 },
    { x: 5, y: 22 },
    { x: 6, y: 22 },
    { x: 7, y: 22 },
  ]

  const kitchen2 = [
    { x: 0, y: 21 },
    { x: 1, y: 21 },
    { x: 0, y: 20 },
    { x: 1, y: 20 },
    { x: 0, y: 19 },
    { x: 1, y: 19 },
  ]

  const totalBlockedCells = [...blockedCells, ...doorOut, ...doorK, ...kitchen, ...kitchen2];

  const [{ isOver }, drop] = useFurnitureDrop({
    cellSize,
    totalBlockedCells,
    setLayout,
    setLayoutUf: null,
    floorRef: null
  });

  useKeyboardShortcuts({
    activeItemKey,
    setLayout,
    setLayoutKey,
    cols,
    rows,
  });
  
  const getCellBordersFree = (x, y) => {
    const isBlocked = (x, y) => freeCells.some(cell => cell.x === x && cell.y === y);
    const isDoorGarden = (x, y) => doorGarden.some(cell => cell.x === x && cell.y === y);
    return {
      borderTop: !isBlocked(x, y - 1) ? '3px solid black' : '',
      borderBottom: !isBlocked(x, y + 1) && !isDoorGarden(x, y) ? '3px solid black' : '',
      borderLeft: !isBlocked(x - 1, y) ? '3px solid black' : '',
      borderRight: !isBlocked(x + 1, y) ? '3px solid black' : '',
    };
  };

  const freeCells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!blockedCells.some(cell => cell.x === x && cell.y === y)) {
        freeCells.push({ x, y });
      }
    }
  }

  const isCellInDoorLR = (cell) => {
    return doorLR.some(existingCell => existingCell.x === cell.x && existingCell.y === cell.y);
  };
  const isCellInDoorK = (cell) => {
    return doorK.some(existingCell => existingCell.x === cell.x && existingCell.y === cell.y);
  };
  
  return (
    <div className="custom-grid-container">
      <div
        className="grid-container"
        ref={drop}
        style={{ width: gridWidth, height: gridHeight, background: isOver ? '#f0f0f0' : undefined }}
      >
        <div className="rgl-bg-bungalow" />
        {blockedCells.map((cell, idx) => {
          return (
              <div
                key={`blocked-${idx}`}
                className="border-cell"
                style={{
                  width: cellSize,
                  height: cellSize,
                  left: cell.x * cellSize,
                  top: cell.y * cellSize,
                  position: 'absolute',
                  boxSizing: 'border-box',
                }}
              />
            );
        })}
        {doorOut.map((cell, idx) => {
          return (
            <div
              className="door-area-blocked"
              style={{
                position: 'absolute',
                left: Math.min(...doorOut.map(cell => cell.x)) * cellSize,
                top: Math.min(...doorOut.map(cell => cell.y)) * cellSize,
                width: (Math.max(...doorOut.map(cell => cell.x)) - Math.min(...doorOut.map(cell => cell.x)) + 1) * cellSize,
                height: (Math.max(...doorOut.map(cell => cell.y)) - Math.min(...doorOut.map(cell => cell.y)) + 1) * cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                color: 'black',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
              DOOR
            </div>
            );
        })}
        {wallLR.map((cell, idx) => {
          const borders = {
            borderRight: !isCellInDoorLR(cell.x, cell.y) && cell.y !== 15  ? '3px solid black' : 'none',
          };
          return (
            <div
              className="door-area"
              style={{
                position: 'absolute',
                left: cell.x * cellSize,
                top: cell.y * cellSize,
                width: cellSize,
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                color: 'black',
                boxSizing: 'border-box',
                ...borders,
              }}
            >
            </div>
          );
        })}
        {doorK.map((cell, idx) => {
          return (
            <div
              key={`free-${idx}`}
              className="door-area-blocked"
              style={{
                position: 'absolute',
                left: Math.min(...doorK.map(cell => cell.x)) * cellSize,
                top: Math.min(...doorK.map(cell => cell.y)) * cellSize,
                width: (Math.max(...doorK.map(cell => cell.x)) - Math.min(...doorK.map(cell => cell.x)) + 1) * cellSize,
                height: (Math.max(...doorK.map(cell => cell.y)) - Math.min(...doorK.map(cell => cell.y)) + 1) * cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                color: 'black',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
              DOOR
            </div>
          );
        })}
        {wallK.map((cell, idx) => {
          const borders = {
            borderTop: !isCellInDoorK(cell.x, cell.y) ? '3px solid black' : 'none',
          };
          return (
            <div
              className="door-area"
              style={{
                position: 'absolute',
                left: cell.x * cellSize,
                top: cell.y * cellSize,
                width: cellSize,
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                color: 'black',
                boxSizing: 'border-box',
                ...borders,
              }}
            >
            </div>
          );
        })}
          {doorGarden.map((cell, idx) => {
          return (
            <div
              key={`free-${idx}`}
              className="border-cell"
              style={{
                position: 'absolute',
                left: Math.min(...doorGarden.map(cell => cell.x)) * cellSize,
                top: Math.min(...doorGarden.map(cell => cell.y)) * cellSize,
                width: (Math.max(...doorGarden.map(cell => cell.x)) - Math.min(...doorGarden.map(cell => cell.x)) + 1) * cellSize,
                height: (Math.max(...doorGarden.map(cell => cell.y)) - Math.min(...doorGarden.map(cell => cell.y)) + 1) * cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                backgroundColor: 'transparent',
                color: 'black',
                border: '3px dashed green',
                borderLeftStyle: 'none',
                borderRightStyle: 'none',
                borderTopStyle: 'none',
                borderBottomStyle: '2px solid black',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
              DOOR
            </div>
          );
        })}
        {kitchen.map((cell, idx) => {
          return (
            <div
              key={`free-${idx}`}
              className="sink-area-blocked"
              style={{
                position: 'absolute',
                left: Math.min(...kitchen.map(cell => cell.x)) * cellSize,
                top: Math.min(...kitchen.map(cell => cell.y)) * cellSize,
                width: (Math.max(...kitchen.map(cell => cell.x)) - Math.min(...kitchen.map(cell => cell.x)) + 1) * cellSize,
                height: (Math.max(...kitchen.map(cell => cell.y)) - Math.min(...kitchen.map(cell => cell.y)) + 1) * cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                color: 'black',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
              KITCHEN
            </div>
          );
        })}
        {kitchen2.map((cell, idx) => {
          return (
            <div
              key={`free-${idx}`}
              className="sink-area-blocked"
              style={{
                position: 'absolute',
                left: Math.min(...kitchen2.map(cell => cell.x)) * cellSize,
                top: Math.min(...kitchen2.map(cell => cell.y)) * cellSize,
                width: (Math.max(...kitchen2.map(cell => cell.x)) - Math.min(...kitchen2.map(cell => cell.x)) + 1) * cellSize,
                height: (Math.max(...kitchen2.map(cell => cell.y)) - Math.min(...kitchen2.map(cell => cell.y)) + 1) * cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                color: 'black',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
            </div>
          );
        })}
        {freeCells.map((cell, idx) => {
          const borders = getCellBordersFree(cell.x, cell.y);
          return (
            <div
              key={`free-${idx}`}
              className="border-cell"
              style={{
                width: cellSize,
                height: cellSize,
                left: cell.x * cellSize,
                top: cell.y * cellSize,
                position: 'absolute',
                backgroundColor: 'transparent',
                boxSizing: 'border-box',
                pointerEvents: 'none',
                ...borders,
              }}
            />
          );
        })}
        <GridLayout
          key={layoutKey}
          className="react-grid-layout"
          layout={layout}
          cols={cols}
          rowHeight={cellSize}
          width={gridWidth}
          margin={[0, 0]}
          isDraggable={true}
          isResizable={false}
          compactType={null}
          preventCollision={true}
          autoSize={false}
          verticalCompact={false}
          onDragStart={(layout, oldItem, newItem, placeholder, event, element) => {
            isDragging.current = true;
            setActiveItemKey(newItem.i);
          }}
          onDragStop={(layoutItems, oldItem, newItem) => {
            isDragging.current = false;
              handleDragStop({
                layoutItems: layoutItems,
                oldItem: oldItem,
                newItem: newItem,
                blockedCells: totalBlockedCells,
                cols: cols,
                rows: rows,
                setLayout: setLayout,
                setLayoutKey: setLayoutKey,
                floor: 0,
              });
        }}
        >
          {layout.map(item => (
          <div
            key={item.i}
            data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h }}
            className="grid-item"
            style={{
              width: item.w * cellSize,
              height: item.h * cellSize,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid black',
              transform: `rotate(${item.rotation || 0}deg)`,
            }}
            onClick={() => setActiveItemKey(item.i)}
          >
            <img
              src={item.image}
              alt={item.type}
              style={{
                border: '1px solid black',
                padding: '1px',
                width: item.rotation === 90 || item.rotation === 270 ? item.h * cellSize : item.w * cellSize,
                height: item.rotation === 90 || item.rotation === 270 ? item.w * cellSize : item.h * cellSize,        
                transform: `rotate(${item.rotation || 0}deg)`,
              }}
            />
          </div>
        ))}

        </GridLayout>
      </div>
    </div>
  );
}

export default BungalowGrid;
