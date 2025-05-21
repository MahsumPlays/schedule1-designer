import React, { useState, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import { handleDragStop, useFurnitureDrop, useKeyboardShortcuts } from '../../services/GridService';
import '../CustomGrid.scss';
import './StorageGrid.scss';
import '../../styles/variables.scss';

const StorageGrid = ({ layout, setLayout, layoutUf, setLayoutUf, floor, keyboardShortcutsDisabled }) => {
  const cols = 10;
  const rows = 19;
  const cellSize = 30;
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  const [layoutKey, setLayoutKey] = useState(0);
  const isDragging = useRef(false);
  const [activeItemKey, setActiveItemKey] = useState(null);


  const blockedCells = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
    { x: 0, y: 5 },
    { x: 0, y: 6 },
  ];

  const door = [
    { x: 2, y: 0 }, 
    { x: 3, y: 0 }, 
  ]

  const blocked = [
    { x: 1, y: 0 }, 
    { x: 4, y: 0 }, 
  ]

  const sink = [
    { x: 1, y: 1 },
  ]

  const totalBlockedCells = [...blockedCells, ...door, ...sink, ...blocked];

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
    disabled: keyboardShortcutsDisabled,
    totalBlockedCells,
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
        <div className="rgl-bg-storage" />
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
        {blocked.map((cell, idx) => {
          return (
            <div
              className="door-area"
              style={{
                position: 'absolute',
                left: Math.min(...blocked.map(cell => cell.x)) * cellSize,
                top: Math.min(...blocked.map(cell => cell.y)) * cellSize,
                width: (Math.max(...blocked.map(cell => cell.x)) - Math.min(...blocked.map(cell => cell.x)) + 1) * cellSize,
                height: (Math.max(...blocked.map(cell => cell.y)) - Math.min(...blocked.map(cell => cell.y)) + 1) * cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                backgroundColor: '#000',
                color: 'black',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
              DOOR
            </div>
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
                writingMode: 'vertical-rl',
                textOrientation: 'upright',
                fontWeight: 'bold',
                fontSize: '18px',
                backgroundColor: 'rgba(0, 119, 255, 0.8)',
                color: 'black',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            > S
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

export default StorageGrid;
