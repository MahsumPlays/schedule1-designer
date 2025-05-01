import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import GridLayout from 'react-grid-layout';
import '../CustomGrid.scss';
import './SweatshopGrid.scss';

const SweatshopGrid = () => {
  const cols = 12;
  const rows = 18;
  const cellSize = 30;
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  const [layout, setLayout] = useState([]);
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

  const isOverlapping = (x, y, w, h) => {
    let blocked = [];
    blocked = [...blockedCells, ...door, ...sink];
  
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
        setLayout(prev =>
          prev.map(item => item.i === newItem.i
            ? { ...item, x: newPos.x, y: newPos.y }
            : item
          )
        );
        setLayoutKey(prev => prev + 1);
    } else {
        setLayout(prevLayout =>
          prevLayout.map(item => {
            const updatedItem = layoutItems.find(i => i.i === item.i);
            return updatedItem ? { ...item, ...updatedItem } : item;
          })
        );
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
        setLayout(prev => [...prev, newItem]);

      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'r') {
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
      }
      if (event.key.toLowerCase() === 'd') {
          setLayout(prev => prev.filter(item => item.i !== activeItemKey));
          setLayoutKey(prev => prev + 1); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeItemKey]);

  
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
              className="door-area"
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
                backgroundColor: 'rgba(200, 200, 200, 0.7)',
                color: 'black',
                boxSizing: 'border-box',
              }}
            >
              DOOR
            </div>
            );
        })}
          {sink.map((cell, idx) => {
          return (
            <div
              className="door-area"
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
                backgroundColor: 'rgba(200, 200, 200, 0.7)',
                color: 'black',
                boxSizing: 'border-box',
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
