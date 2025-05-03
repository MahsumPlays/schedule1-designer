import React, { useState, useRef, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import Button from 'react-bootstrap/Button';
import '../CustomGrid.scss';
import './DocksGrid.scss';
import { handleDragStop, useFurnitureDrop, useKeyboardShortcuts } from '../../services/GridService';

const BarnsGrid = () => {
  const cols = 40;
  const rows = 28;
  const colsUf = 28;
  const rowsUf = 27;
  const cellSize = 20;
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;
  const gridWidthUf = colsUf * cellSize;
  const gridHeightUf = rowsUf * cellSize;

  const [floor, setFloor] = useState(0);
  const [layout, setLayout] = useState([]);
  const [layoutUf, setLayoutUf] = useState([]);
  const [layoutKey, setLayoutKey] = useState(0);
  const [layoutKeyUf, setLayoutKeyUf] = useState(0);
  const [activeItemKey, setActiveItemKey] = useState(null);
  const isDragging = useRef(false);
  const floorRef = useRef(floor);

  const blockedCells = [
    { x: 14, y: 3 },
    { x: 14, y: 24 },
    { x: 30, y: 3 },
    { x: 30, y: 8 },
    { x: 30, y: 9 },
    { x: 30, y: 10 },
    { x: 30, y: 11 },
    { x: 30, y: 12 },
    { x: 30, y: 13 },
    { x: 30, y: 14 },
    { x: 30, y: 15 },
    { x: 30, y: 16 },
    { x: 30, y: 17 },
    { x: 30, y: 18 },
    { x: 30, y: 19 },
    { x: 30, y: 24 },
  ];

  const stairs = [
    { x: 29, y: 11 },
    { x: 29, y: 12 }, { x: 29, y: 13 }, { x: 29, y: 14 },
    { x: 29, y: 15 }, { x: 29, y: 16 }, { x: 29, y: 17 }, { x: 29, y: 18 },
    { x: 28, y: 11 }, { x: 28, y: 12 }, { x: 28, y: 13 }, { x: 28, y: 14 },
    
    { x: 28, y: 15 }, { x: 28, y: 16 }, { x: 28, y: 17 }, { x: 28, y: 18 },
    { x: 27, y: 11 }, { x: 27, y: 12 }, { x: 27, y: 13 }, { x: 27, y: 14 },
    { x: 27, y: 15 }, { x: 27, y: 16 }, { x: 27, y: 17 }, { x: 27, y: 18 },
  ];
  
  const stairsTop = [
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 7, y: 0 },
    { x: 8, y: 0 },
    { x: 9, y: 0 },
    { x: 3, y: 1 }, 
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
    { x: 8, y: 1 },
    { x: 9, y: 1 },
    { x: 3, y: 2 }, 
    { x: 4, y: 2 }, 
    { x: 5, y: 2 }, 
    { x: 6, y: 2 }, 
    { x: 7, y: 2 }, 
    { x: 8, y: 2 }, 
    { x: 9, y: 2 }, 
  ];
  
  const stairsBottom = [
    { x: 3, y: 27 },
    { x: 4, y: 27 },
    { x: 5, y: 27 },
    { x: 6, y: 27 },
    { x: 7, y: 27 },
    { x: 8, y: 27 },
    { x: 9, y: 27 },
    { x: 3, y: 26 }, 
    { x: 4, y: 26 },
    { x: 5, y: 26 },
    { x: 6, y: 26 },
    { x: 7, y: 26 },
    { x: 8, y: 26 },
    { x: 9, y: 26 },
    { x: 3, y: 25 }, 
    { x: 4, y: 25 }, 
    { x: 5, y: 25 }, 
    { x: 6, y: 25 }, 
    { x: 7, y: 25 }, 
    { x: 8, y: 25 }, 
    { x: 9, y: 25 },
  ];

  const blockedCellsUf = [
    { x: 0, y: 3 },
    { x: 0, y: 23 },
    { x: 16, y: 9 }, 
    { x: 17, y: 9 },
    { x: 16, y: 10 }, 
    { x: 17, y: 10 },
    { x: 16, y: 11 }, 
    { x: 17, y: 11 },
    { x: 16, y: 12 }, 
    { x: 17, y: 12 },
    { x: 16, y: 13 }, 
    { x: 17, y: 13 },
    { x: 16, y: 14 }, 
    { x: 17, y: 14 },
    { x: 16, y: 15 }, 
    { x: 17, y: 15 },
    { x: 16, y: 16 }, 
    { x: 17, y: 16 },
    { x: 16, y: 17 }, 
    { x: 17, y: 17 },
    { x: 16, y: 18 }, 
    { x: 17, y: 18 },
    { x: 16, y: 19 }, 
    { x: 17, y: 19 },
    { x: 16, y: 20 }, 
    { x: 17, y: 20 },
    { x: 16, y: 21 }, 
    { x: 17, y: 21 },
    { x: 16, y: 22 }, 
    { x: 17, y: 22 },
    { x: 18, y: 19 },
    { x: 18, y: 20 },
    { x: 18, y: 21 },
    { x: 18, y: 22 },
    { x: 27, y: 8 },
    { x: 27, y: 9 },
    { x: 27, y: 10 },
    { x: 27, y: 11 },
    { x: 27, y: 12 },
    { x: 27, y: 13 },
    { x: 27, y: 14 },
    { x: 27, y: 15 },
    { x: 27, y: 16 },
    { x: 27, y: 17 },
    { x: 27, y: 18 }
  ]
  for (let y = 4; y <= 22; y++) {
    for (let x = 0; x <= 15; x++) {
      blockedCellsUf.push({ x, y });
    }
  }

  const blockedCellsWallUf = [
    { x: 18, y: 8 },
    { x: 18, y: 9 },
    { x: 18, y: 10 },
    { x: 18, y: 11 },
    { x: 18, y: 12 },
    { x: 18, y: 13 },
    { x: 18, y: 14 },
    { x: 18, y: 15 },
    { x: 18, y: 16 },
    { x: 18, y: 17 },
    { x: 18, y: 18 },
  ]

  const wallTop = [
    { x: 19, y: 8 },
    { x: 22, y: 8 },
    { x: 23, y: 8 },
    { x: 24, y: 8 },
    { x: 25, y: 8 },
    { x: 26, y: 8 },
    
    { x: 19, y: 19 },
    { x: 22, y: 19 },
    { x: 23, y: 19 },
    { x: 24, y: 19 },
    { x: 25, y: 19 },
    { x: 26, y: 19 },
  ];

  const doorTop = [    
    { x: 20, y: 8 },
    { x: 21, y: 8 },
    { x: 20, y: 19 },
    { x: 21, y: 19 }
  ];

  const doorOut = [    
    { x: 0, y: 8 },
    { x: 0, y: 9 },
    { x: 0, y: 10 },
    { x: 0, y: 11 },
    { x: 0, y: 12 },
    { x: 0, y: 13 },
    { x: 0, y: 14 },
    { x: 0, y: 15 },
    { x: 0, y: 16 },
    { x: 0, y: 17 },
    { x: 0, y: 18 },
    { x: 0, y: 19 },

  ];

  const stairsUf = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 24 },
    { x: 0, y: 25},
    { x: 0, y: 26 },
    { x: 16, y: 8 }, 
    { x: 17, y: 8 }
  ]

  const totalBlockedCells = [...blockedCells, ...stairs, ...stairsTop, ...stairsBottom, ];

  const totalBlockedCellsUf = [...blockedCellsUf, ...stairsUf, ...blockedCellsWallUf];
  

  useEffect(() => {
    floorRef.current = floor;
  }, [floor]);

  const [{ isOver }, drop] = useFurnitureDrop({
    cellSize: cellSize,
    totalBlockedCells: totalBlockedCells,
    setLayout: setLayout,
    setLayoutUf: setLayoutUf,
    floorRef: floorRef,
  });

  useKeyboardShortcuts({
    activeItemKey: activeItemKey,
    setLayout: floor === 0 ? setLayout : setLayoutUf,
    setLayoutKey: floor === 0 ? setLayoutKey : setLayoutKeyUf,
  });


  const handleButtonSwitchFloor = () => {
    if (floor === 0) {
      setFloor(1);
      setLayoutKeyUf(prev => prev + 1);
    } else {
      setFloor(0);
      setLayoutKey(prev => prev + 1);
    }
  }

  const getCellBordersFree = (x, y) => {
    const isBlocked = (x, y) => freeCells.some(cell => cell.x === x && cell.y === y);
    return {
      borderTop: !isBlocked(x, y - 1) ? '3px solid black' : '',
      borderBottom: !isBlocked(x, y + 1) ? '3px solid black' : '',
      borderLeft: !isBlocked(x - 1, y) ? '3px solid black' : '',
      borderRight: !isBlocked(x + 1, y) ? '3px solid black' : '',
    };
  };
  
  
  const getCellBordersEG = (x, y) => {
    const isBlocked = (x, y) => freeCellsEg.some(cell => cell.x === x && cell.y === y);
    const isDoorGarden = (x, y) => doorOut.some(cell => cell.x === x && cell.y === y);
    return {
      borderTop: !isBlocked(x, y - 1) ? '3px solid black' : '',
      borderBottom: !isBlocked(x, y + 1) ? '3px solid black' : '',
      borderLeft: !isBlocked(x - 1, y) && !isDoorGarden(x, y) ? '3px solid black' : '',
      borderRight: !isBlocked(x + 1, y) ? '3px solid black' : '',
    };
  };

  const freeCells = [];
  for (let y = 0; y < rowsUf; y++) {
    for (let x = 0; x < colsUf; x++) {
      if (!blockedCellsUf.some(cell => cell.x === x && cell.y === y)) {
        freeCells.push({ x, y });
      }
    }
  }
  const freeCellsEg = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        freeCellsEg.push({ x, y });
    }
  }

  const isCellInDoorK = (cell) => {
    return doorTop.some(existingCell => existingCell.x === cell.x && existingCell.y === cell.y);
  };

  return (
    <div className="custom-grid-container">
      <div className='grid-floor-switch' style={{ marginBottom: '10px' }}>
        <Button type='button' size='lg' onClick={() => {handleButtonSwitchFloor()}}
          className='btn btn-default'>Switch Floor</Button>
      </div>
      {floor === 0 && (
      <div
        className="grid-container"
        ref={drop}
        style={{ width: gridWidth, height: gridHeight, background: isOver ? '#f0f0f0' : undefined}}
      >
        <div className="rgl-bg" />
        {blockedCells.map((cell, idx) => (
          <div
            key={`blocked-${idx}`}
            className="blocked-cell"
            style={{
              width: cellSize,
              height: cellSize,
              left: cell.x * cellSize,
              top: cell.y * cellSize,
            }}
          />
        ))}
        {stairs.map((cell, idx) => (
          <div
            key={`stairs-${idx}`}
            className="stairs"
            style={{
              position: 'absolute',
              left: Math.min(...stairs.map(cell => cell.x)) * cellSize,
              top: Math.min(...stairs.map(cell => cell.y)) * cellSize,
              width: (Math.max(...stairs.map(cell => cell.x)) - Math.min(...stairs.map(cell => cell.x)) + 1) * cellSize,
              height: (Math.max(...stairs.map(cell => cell.y)) - Math.min(...stairs.map(cell => cell.y)) + 1) * cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              backgroundColor: '#a16642',
              color: 'black',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          > 
          STAIRS
          </div>
        ))}
        {stairsTop.map((cell, idx) => (
          <div
            key={`stairs-${idx}`}
            className="stairs"
            style={{
              position: 'absolute',
              left: Math.min(...stairsTop.map(cell => cell.x)) * cellSize,
              top: Math.min(...stairsTop.map(cell => cell.y)) * cellSize,
              width: (Math.max(...stairsTop.map(cell => cell.x)) - Math.min(...stairsTop.map(cell => cell.x)) + 1) * cellSize,
              height: (Math.max(...stairsTop.map(cell => cell.y)) - Math.min(...stairsTop.map(cell => cell.y)) + 1) * cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              backgroundColor: '#a16642',
              color: 'black',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          > 
          STAIRS
          </div>
        ))}
        {stairsBottom.map((cell, idx) => (
          <div
            key={`stairs-${idx}`}
            className="stairs"
            style={{
              position: 'absolute',
              left: Math.min(...stairsBottom.map(cell => cell.x)) * cellSize,
              top: Math.min(...stairsBottom.map(cell => cell.y)) * cellSize,
              width: (Math.max(...stairsBottom.map(cell => cell.x)) - Math.min(...stairsBottom.map(cell => cell.x)) + 1) * cellSize,
              height: (Math.max(...stairsBottom.map(cell => cell.y)) - Math.min(...stairsBottom.map(cell => cell.y)) + 1) * cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              backgroundColor: '#a16642',
              color: 'black',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          > 
          STAIRS
          </div>
        ))}
        {doorOut.map((cell, idx) => {
          return (
            <div
              key={`free-${idx}`}
              className="border-cell"
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
                fontSize: '20px',
                writingMode: 'vertical-rl',
                textOrientation: 'upright',
                backgroundColor: 'transparent',
                color: 'black',
                border: '3px dashed green',
                borderLeftStyle: 'dashed',
                borderRightStyle: 'none',
                borderTopStyle: 'none',
                borderBottomStyle: 'none',
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
              DOOR
            </div>
          );
        })}
        {freeCellsEg.map((cell, idx) => {
          const borders = getCellBordersEG(cell.x, cell.y);
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
      )}
    {floor === 1 && (
      <div className='grid-container'
        ref={drop}
        style={{ width: gridWidthUf, height: gridHeightUf, background: isOver ? '#f0f0f0' : undefined }}
      >
        <div className="rgl-bg" />
        {blockedCellsUf.map((cell, idx) => (
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
        ))}
        {blockedCellsWallUf.map((cell, idx) => (
          <div
            key={`blocked-${idx}`}
            className="blocked-cell"
            style={{
              width: cellSize,
              height: cellSize,
              left: cell.x * cellSize,
              top: cell.y * cellSize,
            }}
          />
        ))}
        {stairsUf.map((cell, idx) => (
          <div
            key={`stairs-${idx}`}
            className="stairs"
            style={{
              width: cellSize,
              height: cellSize,
              left: cell.x * cellSize,
              top: cell.y * cellSize,
              backgroundColor: '#a16642'
            }}
          />
        ))}
        {wallTop.map((cell, idx) => {
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
                zIndex: 1,
                ...borders,
              }}
            >
            </div>
          );
        })}
        {doorTop.map((cell, idx) => {
          return (
            <div
              key={`free-${idx}`}
              className="door-area"
              style={{
                position: 'absolute',
                left: Math.min(...doorTop.map(cell => cell.x)) * cellSize,
                top: cell.y * cellSize,
                width: (Math.max(...doorTop.map(cell => cell.x)) - Math.min(...doorTop.map(cell => cell.x)) + 1) * cellSize,
                height: cellSize,
                border: '3px dashed green',
                borderLeftStyle: 'none',
                borderRightStyle: 'none',
                borderTopStyle: 'dashed',
                borderBottomStyle: 'none',
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
          key={layoutKeyUf}
          className="react-grid-layout"
          layout={layoutUf}
          cols={colsUf}
          rowHeight={cellSize}
          width={gridWidthUf}
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
              blockedCells: totalBlockedCellsUf,
              cols: cols,
              rows: rows,
              setLayout: setLayoutUf,
              setLayoutKey: setLayoutKeyUf,
              floor: 1,
            }); 
         }}
        >
        {layoutUf.map(item => (
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
    )}

    </div>
  );
}

export default BarnsGrid;
