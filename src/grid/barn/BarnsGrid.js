import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import GridLayout from 'react-grid-layout';
import Button from 'react-bootstrap/Button';
import '../CustomGrid.scss';
import { handleDragStop, useFurnitureDrop, useKeyboardShortcuts } from '../../services/GridService';

const BarnsGrid = () => {
  const cols = 37;
  const rows = 30;
  const colsUf = 18;
  const rowsUf = 11;
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
    { x: 0, y: 0 },
    { x: 9, y: 0 },
    { x: 18, y: 0 },
    { x: 27, y: 0 },
    { x: 36, y: 0 },
    { x: 0, y: 9 },
    { x: 0, y: 20 },
    { x: 0, y: 29 },
    { x: 0, y: 38 },
    { x: 9, y: 9 },
    { x: 9, y: 20 },
    { x: 9, y: 29 },
    { x: 9, y: 38 },
    { x: 18, y: 9 },
    { x: 18, y: 20 },
    { x: 18, y: 29 },
    { x: 18, y: 38 },
    { x: 27, y: 9 },
    { x: 27, y: 20 },
    { x: 27, y: 29 },
    { x: 27, y: 38 },
    { x: 36, y: 20 },
    { x: 36, y: 29 },
    { x: 36, y: 38 }
  ];

  const stairs = [
    { x: 36, y: 9 }, { x: 36, y: 10 }, { x: 36, y: 11 }, { x: 36, y: 12 },
    { x: 36, y: 13 }, { x: 36, y: 14 }, { x: 36, y: 15 }, { x: 36, y: 16 },
    { x: 35, y: 9 }, { x: 35, y: 10 }, { x: 35, y: 11 }, { x: 35, y: 12 },
    { x: 35, y: 13 }, { x: 35, y: 14 }, { x: 35, y: 15 }, { x: 35, y: 16 },
    { x: 34, y: 9 }, { x: 34, y: 10 }, { x: 34, y: 11 }, { x: 34, y: 12 },
    { x: 34, y: 13 }, { x: 34, y: 14 }, { x: 34, y: 15 }, { x: 34, y: 16 },
    { x: 33, y: 9 }, { x: 33, y: 10 }, { x: 33, y: 11 }, { x: 33, y: 12 },
    { x: 33, y: 13 }, { x: 33, y: 14 }, { x: 33, y: 15 }, { x: 33, y: 16 }, 
    { x: 33, y: 17 }, { x: 34, y: 17 }, { x: 35, y: 17 }, { x: 36, y: 17 }, 
  ];

  const door = [
    { x: 0, y: 12 }, 
    { x: 0, y: 13 }, 
    { x: 0, y: 14}, 
    { x: 0, y: 15 }, 
    { x: 0, y: 16 }, 
    { x: 0, y: 17 }, 
  ]
  const blockedCellsUf = [
    { x: 8, y: 0 },
    { x: 8, y: 10}
  ]

  const stairsUf = [
    { x: 14, y: 0 }, { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 14, y: 3 },
    { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 },
    { x: 14, y: 8 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 15, y: 0 }, 
    { x: 15, y: 1 }, { x: 15, y: 2 }, { x: 15, y: 3 }, { x: 15, y: 4 },
    { x: 15, y: 5 }, { x: 15, y: 6 }, { x: 15, y: 7 }, { x: 15, y: 8 },
    { x: 15, y: 9 }, { x: 15, y: 10 }, { x: 16, y: 0 }, { x: 16, y: 1 },
    { x: 16, y: 2 }, { x: 16, y: 3 }, { x: 16, y: 4 }, { x: 16, y: 5 },
    { x: 16, y: 6 }, { x: 16, y: 7 }, { x: 16, y: 8 }, { x: 16, y: 9 },
    { x: 16, y: 10 }, { x: 17, y: 0 }, { x: 17, y: 1 }, { x: 17, y: 2 },
    { x: 17, y: 3 }, { x: 17, y: 4 }, { x: 17, y: 5 }, { x: 17, y: 6 },
    { x: 17, y: 7 }, { x: 17, y: 8 }, { x: 17, y: 9 }, { x: 17, y: 10 },
]

const totalBlockedCells = [...blockedCells, ...stairs, ...door];

const totalBlockedCellsUf = [...blockedCellsUf, ...stairsUf];

  useEffect(() => {
    floorRef.current = floor;
  }, [floor]);

  const handleButtonSwitchFloor = () => {
    if (floor === 0) {
      setFloor(1);
      setLayoutKeyUf(prev => prev + 1);
    } else {
      setFloor(0);
      setLayoutKey(prev => prev + 1);
    }
  }

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
    const isDoorGarden = (x, y) => door.some(cell => cell.x === x && cell.y === y);
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
      freeCells.push({ x, y });

    }
  }

  const freeCellsEg = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        freeCellsEg.push({ x, y });
    }
  }

  return (
    <div className="custom-grid-container">
      <div className='grid-floor-switch' style={{ marginBottom: '10px' }}>
        <Button type='button' size='lg' onClick={() => {handleButtonSwitchFloor()}}
          className='btn btn-primary'>Switch Floor</Button>
      </div>
      {floor === 0 && (
      <div
        className="grid-container"
        ref={drop}
        style={{ width: gridWidth, height: gridHeight, background: isOver ? '#f0f0f0' : undefined }}
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
        {door.map((cell, idx) => {
          return (
            <div
            className="door-area"
            style={{
              position: 'absolute',
              left: door[0].x * cellSize,
              top: door[0].y * cellSize,
              width: cellSize,
              height: cellSize * door.length,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              fontWeight: 'bold',
              fontSize: '20px',
              color: 'black',
              border: '4px dashed  green',
              borderLeftStyle: '2px solid black',
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
        {stairs.map((cell, idx) => (
          <div
          className="stairs-area"
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
            fontSize: '20px',
            backgroundColor: '#a16642',
            color: 'black',
            boxSizing: 'border-box',
            userSelect: 'none',
          }}
        >
          STAIRS
        </div>
        ))}
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
            console.log("active item",newItem.i)
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
            onClick={() => {setActiveItemKey(item.i); console.log("active item",item.i)}}
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
              position: 'absolute',
              left: Math.min(...stairsUf.map(cell => cell.x)) * cellSize,
              top: Math.min(...stairsUf.map(cell => cell.y)) * cellSize,
              width: (Math.max(...stairsUf.map(cell => cell.x)) - Math.min(...stairsUf.map(cell => cell.x)) + 1) * cellSize,
              height: (Math.max(...stairsUf.map(cell => cell.y)) - Math.min(...stairsUf.map(cell => cell.y)) + 1) * cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '18px',
              backgroundColor: '#a16642',
              color: 'black',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          >
            STAIRS
          </div>
        ))}
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
            console.log("active item",newItem.i)
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
            onClick={() => {setActiveItemKey(item.i); console.log("active item",item.i)}}
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
