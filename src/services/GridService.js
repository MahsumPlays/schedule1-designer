import { useDrop } from 'react-dnd';
import { useEffect } from 'react';

const isOverlapping = (x, y, w, h, blockedCells) => {
    return blockedCells.some(cell =>
      cell.x >= x && cell.x < x + w &&
      cell.y >= y && cell.y < y + h
    );
  };
  
  const findNearestValidPosition = (w, h, startX, startY, cols, rows, blockedCells) => {
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
          !isOverlapping(pos.x, pos.y, w, h, blockedCells)
        ) {
          return pos;
        }
      }
    }
    return { x: startX, y: startY };
  };
  

const handleDragStop = ({
    layoutItems,
    oldItem,
    newItem,
    blockedCells,
    cols,
    rows,
    setLayout,
    setLayoutKey,
    floor,
}) => {  
    const overlaps = isOverlapping(newItem.x, newItem.y, newItem.w, newItem.h, blockedCells);
    if (overlaps) {
      const newPos = findNearestValidPosition(newItem.w, newItem.h, newItem.x, newItem.y, cols, rows, blockedCells);
        setLayout(prev =>
          prev.map(item => item.i === newItem.i
            ? { ...item, x: newPos.x, y: newPos.y }
            : item
          )
        );
        setLayoutKey(prev => prev + 1);
      
    } else {
      const update = layoutItems.map(item => ({
        ...item,
      }));
        setLayout(prev =>
          prev.map(item => {
            const updated = update.find(i => i.i === item.i);
            return updated ? { ...item, ...updated } : item;
          })
        );
    }
  };

const useFurnitureDrop = ({
    cellSize,
    totalBlockedCells,
    setLayout,
    setLayoutUf,
    floorRef
  }) => {
    return useDrop(() => ({
      accept: 'furniture',
      drop: (item, monitor) => {
        const offset = monitor.getClientOffset();
        const gridRect = document.querySelector('.grid-container')?.getBoundingClientRect();
        if (!offset || !gridRect) return;
  
        const relativeX = offset.x - gridRect.left;
        const relativeY = offset.y - gridRect.top;
  
        const x = Math.floor(relativeX / cellSize);
        const y = Math.floor(relativeY / cellSize);
  
        if (!isOverlapping(x, y, item.w, item.h, totalBlockedCells)) {
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
          if (floorRef !== null) {
            if (floorRef.current === 0) {
              setLayout(prev => [...prev, newItem]);
            } else {
              setLayoutUf(prev => [...prev, newItem]);
            }   
          } else {
            setLayout(prev => [...prev, newItem]);
          }
     
        }
      },
      collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    }));
  };


  const useKeyboardShortcuts = ({ activeItemKey, setLayout, setLayoutKey }) => {
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (!activeItemKey) return;
        if (event.key.toLowerCase() === 'r') {
          setLayout(prev =>
            prev.map(item =>
              item.i === activeItemKey
                ? {
                    ...item,
                    rotation: (item.rotation || 0) + 90 >= 360 ? 0 : (item.rotation || 0) + 90,
                    w: item.h,
                    h: item.w,
                  }
                : item
            )
          );
          setLayoutKey(prev => prev + 1);
        }
  
        if (['Delete', 'Backspace', 'd'].includes(event.key)) {
          setLayout(prev => prev.filter(item => item.i !== activeItemKey));
          setLayoutKey(prev => prev + 1);
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [activeItemKey, setLayout, setLayoutKey]);
  };
  
  export { isOverlapping, findNearestValidPosition, handleDragStop, useFurnitureDrop, useKeyboardShortcuts };
  