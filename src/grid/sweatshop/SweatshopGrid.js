import React, { useState, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import { handleDragStop, useFurnitureDrop, useKeyboardShortcuts } from '../../services/GridService';
import '../CustomGrid.scss';
import './SweatshopGrid.scss';

const SweatshopGrid = ({ layout, setLayout, layoutUf, setLayoutUf, floor, keyboardShortcutsDisabled }) => {
  const cols = 12;
  const rows = 18;
  const cellSize = 30;
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  const [layoutKey, setLayoutKey] = useState(0);
  const isDragging = useRef(false);
  const [activeItemKey, setActiveItemKey] = useState(null);


  const blockedCells = [
    { x: 0, y: 10 },
    { x: 0, y: 11 },
    { x: 0, y: 12 },
    { x: 0, y: 13 },
    { x: 0, y: 14 },
    { x: 0, y: 15 },
    { x: 0, y: 16 },
    { x: 0, y: 17 },
    { x: 1, y: 10 },
    { x: 1, y: 11 },
    { x: 1, y: 12 },
    { x: 1, y: 13 },
    { x: 1, y: 14 },
    { x: 1, y: 15 },
    { x: 1, y: 16 },
    { x: 1, y: 17 },
    { x: 2, y: 10 },
    { x: 2, y: 11 },
    { x: 2, y: 12 },
    { x: 2, y: 13 },
    { x: 2, y: 14 },
    { x: 2, y: 15 },
    { x: 2, y: 16 },
    { x: 2, y: 17 },
    { x: 3, y: 10 },
    { x: 3, y: 11 },
    { x: 3, y: 12 },
    { x: 3, y: 13 },
    { x: 3, y: 14 },
    { x: 3, y: 15 },
    { x: 3, y: 16 },
    { x: 3, y: 17 },
    { x: 4, y: 10 },
    { x: 4, y: 11 },
    { x: 4, y: 12 },
    { x: 4, y: 13 },
    { x: 4, y: 14 },
    { x: 4, y: 15 },
    { x: 4, y: 16 },
    { x: 4, y: 17 },
    { x: 5, y: 10 },
    { x: 5, y: 11 },
    { x: 5, y: 12 },
    { x: 5, y: 13 },
    { x: 5, y: 14 },
    { x: 5, y: 15 },
    { x: 5, y: 16 },
    { x: 5, y: 17 },

  ];

  const door = [
    { x: 11, y: 0 }, 
    { x: 11, y: 1 }, 
    { x: 11, y: 2 }, 
    { x: 10, y: 0 }, 
    { x: 10, y: 1 }, 
    { x: 10, y: 2 }, 
  ]

  const sink = [
    { x: 11, y: 10 }, 
    { x: 11, y: 11}, 
    { x: 10, y: 10 }, 
    { x: 10, y: 11 }, 
  ]

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
    disabled: keyboardShortcutsDisabled,
    totalBlockedCells
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
        <div className="rgl-bg-sweatshop" />
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
                fontWeight: 'bold',
                fontSize: '18px',
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

            // Maximal erlaubte y-Position = rows - item.h (damit Item nicht rausgeht)
            const maxY = rows - newItem.h;
            if (newItem.y > maxY) {
              newItem.y = maxY;
            }

            // Auch alle anderen Items im Layout prüfen (optional)
            const fixedLayout = layoutItems.map(item => {
              const maxYForItem = rows - item.h;
              if (item.y > maxYForItem) {
                return { ...item, y: maxYForItem };
              }
              return item;
            });

            handleDragStop({
              layoutItems: fixedLayout,
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

export default SweatshopGrid;
