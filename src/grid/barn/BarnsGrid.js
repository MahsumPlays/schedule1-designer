import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import GridLayout from 'react-grid-layout';
import Button from 'react-bootstrap/Button';
import '../CustomGrid.scss';

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

  useEffect(() => {
    floorRef.current = floor;
  }, [floor]);

  const isOverlapping = (x, y, w, h) => {
    let blocked = [];
    if (floorRef.current === 0) {
      blocked = [...blockedCells, ...stairs];
    } else if (floorRef.current === 1) {
      blocked = [...blockedCellsUf, ...stairsUf];
    }
  
    return blocked.some(cell =>
      cell.x >= x && cell.x < x + w &&
      cell.y >= y && cell.y < y + h
    );
  };
  

  const findNearestValidPosition = (w, h, startX, startY) => {
    const maxDistance = Math.max(cols, rows);
    for (let d = 1; d < maxDistance; d++) {
      const directions = [
        { x: startX + d, y: startY },
        { x: startX - d, y: startY },
        { x: startX, y: startY + d },
        { x: startX, y: startY - d },
      ];

      for (const pos of directions) {
        if (
          pos.x >= 0 && pos.y >= 0 &&
          pos.x + w <= cols && pos.y + h <= rows &&
          !isOverlapping(pos.x, pos.y, w, h)
        ) {
          return pos;
        }
      }
    }
    return { x: startX, y: startY };
  };

  const handleDragStop = (layoutItems, oldItem, newItem) => {
    const overlaps = isOverlapping(newItem.x, newItem.y, newItem.w, newItem.h);

    if (overlaps) {
      const newPos = findNearestValidPosition(newItem.w, newItem.h, newItem.x, newItem.y);
      if (floor === 0) {
        setLayout(prev =>
          prev.map(item => item.i === newItem.i
            ? { ...item, x: newPos.x, y: newPos.y }
            : item
          )
        );
        setLayoutKey(prev => prev + 1);
      } else if (floor === 1) {
        setLayoutUf(prev =>
          prev.map(item => item.i === newItem.i
            ? { ...item, x: newPos.x, y: newPos.y }
            : item
          )
        );
        setLayoutKeyUf(prev => prev + 1);
      }
    } else {
      if (floorRef.current === 0) {
        setLayout(prevLayout =>
          prevLayout.map(item => {
            const updatedItem = layoutItems.find(i => i.i === item.i);
            return updatedItem ? { ...item, ...updatedItem } : item;
          })
        );
      } else if (floorRef.current === 1) {
        setLayoutUf(prevLayout =>
          prevLayout.map(item => {
            const updatedItem = layoutItems.find(i => i.i === item.i);
            return updatedItem ? { ...item, ...updatedItem } : item;
          })
        );
      }

    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'furniture',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const gridRect = document.querySelector('.grid-container')?.getBoundingClientRect();
      if (!offset || !gridRect) return;

      const relativeX = offset.x - gridRect.left;
      const relativeY = offset.y - gridRect.top;

      const x = Math.floor(relativeX / cellSize);
      const y = Math.floor(relativeY / cellSize);

      if (!isOverlapping(x, y, item.w, item.h)) {
        const newItem = {
          i: `${item.type}-${Date.now()}`,
          x,
          y,
          w: item.w,
          h: item.h,
          type: item.type,
          image: item.image,
          rotation: 0,
        };
        if (floorRef.current === 0) {
          setLayout(prev => [...prev, newItem]);
        } else {
          setLayoutUf(prev => [...prev, newItem]);
        }
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'r') {
        if (floorRef.current === 0) {
          setLayout(prev =>
            prev.map(item =>
              item.i === activeItemKey
                ? {
                    ...item,
                    rotation: (item.rotation || 0) + 90 >= 360 ? 0 : (item.rotation || 0) + 90,
                    w: item.h,
                    h: item.w
                  }
                : item
            )
          );
          setLayoutKey(prev => prev + 1);
        } else {
          setLayoutUf(prev =>
            prev.map(item =>
              item.i === activeItemKey
                ? {
                    ...item,
                    rotation: (item.rotation || 0) + 90 >= 360 ? 0 : (item.rotation || 0) + 90,
                    w: item.h,
                    h: item.w
                  }
                : item
            )
          );
          setLayoutKeyUf(prev => prev + 1);
        }
      }
      if (event.key.toLowerCase() === 'd') {
        if (floorRef.current === 0) {
          setLayout(prev => prev.filter(item => item.i !== activeItemKey));
          setLayoutKey(prev => prev + 1); 
        } else {
          setLayoutUf(prev => prev.filter(item => item.i !== activeItemKey));
          setLayoutKeyUf(prev => prev + 1); 
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeItemKey]);

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
  //commit test

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
          className='btn btn-default'>Switch Floor</Button>
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
          }}
          onDragStop={(layoutItems, oldItem, newItem) => {
            isDragging.current = false;
            handleDragStop(layoutItems, oldItem, newItem);
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
          }}
          onDragStop={(layoutItems, oldItem, newItem) => {
            isDragging.current = false;
            handleDragStop(layoutItems, oldItem, newItem);
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
