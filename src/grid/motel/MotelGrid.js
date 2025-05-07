import React, { useState, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import { handleDragStop, useFurnitureDrop, useKeyboardShortcuts } from '../../services/GridService';
import '../CustomGrid.scss';
import './MotelGrid.scss';

const BarnsGrid = ({ layout, setLayout, layoutUf, setLayoutUf }) => {
  const cols = 12;
  const rows = 10;
  const cellSize = 40;
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  const [layoutKey, setLayoutKey] = useState(0);
  const isDragging = useRef(false);
  const [activeItemKey, setActiveItemKey] = useState(null);


  const blockedCells = [
    { x: 11, y: 9 }, 
    { x: 11, y: 8 },
    { x: 11, y: 7 },
    { x: 10, y: 9 },
    { x: 10, y: 8 },
    { x: 10, y: 7 },
    { x: 9, y: 9 },
    { x: 9, y: 8 },
    { x: 9, y: 7 },
    { x: 8, y: 9 },
    { x: 8, y: 8 },
    { x: 8, y: 7 },
    { x: 7, y: 9 },
    { x: 7, y: 8 },
    { x: 7, y: 7 },
  ];

  const door = [
    { x: 0, y: 1 }, 
    { x: 0, y: 2 }, 
    { x: 0, y: 3 },
    { x: 1, y: 1 }, 
    { x: 1, y: 2 }, 
    { x: 1, y: 3 },
  ]

  const sink = [
    { x: 7, y: 6 }, 
    { x: 8, y: 6 }, 
    { x: 9, y: 6 }, 
    { x: 10, y: 6 }, 
    { x: 11, y: 6 }, 

  ];

  const totalBlockedCells = [...blockedCells, ...door, ...sink];

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
  
    return {
      borderTop: !isBlocked(x, y - 1) ? '3px solid black' : '',
      borderBottom: !isBlocked(x, y + 1) ? '3px solid black' : '',
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
  
  return (
    <div className="custom-grid-container">
      <div
        className="grid-container"
        ref={drop}
        style={{ width: gridWidth, height: gridHeight, background: isOver ? '#f0f0f0' : undefined }}
      >
        <div className="rgl-bg-motel" />
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
        {door.map((cell, idx) => {
          return (
            <div
              className="door-area-blocked"
              style={{
                position: 'absolute',
                left: Math.min(...door.map(cell => cell.x)) * cellSize,
                top: Math.min(...door.map(cell => cell.y)) * cellSize,
                width: (Math.max(...door.map(cell => cell.x)) - Math.min(...door.map(cell => cell.x)) + 1) * cellSize,
                height: (Math.max(...door.map(cell => cell.y)) - Math.min(...door.map(cell => cell.y)) + 1) * cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                writingMode: 'vertical-rl',
                textOrientation: 'upright',
                fontWeight: 'bold',
                fontSize: '20px',
                color: 'black',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
              DOOR
            </div>
            );
        })}
        {sink.map((cell, idx) => {
          return (
            <div
              className="sink-area-blocked"
              style={{
                position: 'absolute',
                left: Math.min(...sink.map(cell => cell.x)) * cellSize,
                top: Math.min(...sink.map(cell => cell.y)) * cellSize,
                width: (Math.max(...sink.map(cell => cell.x)) - Math.min(...sink.map(cell => cell.x)) + 1) * cellSize,
                height: (Math.max(...sink.map(cell => cell.y)) - Math.min(...sink.map(cell => cell.y)) + 1) * cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '20px',
                color: 'black',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
              SINK
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
              console.log(layout)
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
              transform: `rotate(${item.rotation || 0}deg)`,
            }}
            onClick={() => setActiveItemKey(item.i)}
          >
            <img
              src={item.image}
              alt={item.type}
              style={{
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

export default BarnsGrid;
