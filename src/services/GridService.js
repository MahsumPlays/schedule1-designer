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
  
  const enforceGridBounds = (item, cols, rows) => {
    const newItem = { ...item };
  
    // Rechtsbegrenzung
    if (newItem.x + newItem.w > cols) {
      newItem.x = cols - newItem.w;
    }
  
    // Untenbegrenzung
    if (newItem.y + newItem.h > rows) {
      newItem.y = rows - newItem.h;
    }
    return newItem;
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
    // Begrenze das gezogene Item sofort auf gültige Koordinaten
    const boundedNewItem = enforceGridBounds(newItem, cols, rows, setLayoutKey);
  
    const overlaps = isOverlapping(
      boundedNewItem.x,
      boundedNewItem.y,
      boundedNewItem.w,
      boundedNewItem.h,
      blockedCells
    );
  
    if (overlaps) {
      const newPos = findNearestValidPosition(
        boundedNewItem.w,
        boundedNewItem.h,
        boundedNewItem.x,
        boundedNewItem.y,
        cols,
        rows,
        blockedCells
      );
      setLayout(prev =>
        prev.map(item =>
          item.i === boundedNewItem.i
            ? { ...item, x: newPos.x, y: newPos.y }
            : item
        )
      );
      setLayoutKey(prev => prev + 1);
    } else {
      const update = layoutItems.map(item => enforceGridBounds(item, cols, rows));
      setLayout(prev =>
        prev.map(item => {
          const updated = update.find(i => i.i === item.i);
          return updated ? { ...item, ...updated } : item;
        })
      );
      setLayoutKey(prev => prev + 1);
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
            w: item.rotation === 0 || item.rotation === 180 ? item.h : item.w,
            h: item.rotation === 0 || item.rotation === 180 ? item.w : item.h,
            name: item.name,
            price: item.price,
            type: item.type,
            image: item.image,
            rotation: item.rotation || 0,
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


  const useKeyboardShortcuts = ({ activeItemKey, setLayout, setLayoutKey, cols, rows, totalBlockedCells }) => {
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (!activeItemKey) return;
  
if (event.key.toLowerCase() === 'r') {
  setLayout(prev => {
    return prev.map(item => {
      if (item.i !== activeItemKey) return item; // Alle anderen Items unangetastet

      // Neue Rotation
      const newRotation = (item.rotation || 0) + 90 >= 360 ? 0 : (item.rotation || 0) + 90;
      const newW = item.h;
      const newH = item.w;

      let rotatedItem = {
        ...item,
        rotation: newRotation,
        w: newW,
        h: newH,
      };

      // Nur das rotierte Item prüfen & ggf. verschieben
      rotatedItem = enforceGridBounds(rotatedItem, cols, rows);

      if (
        isOverlapping(rotatedItem.x, rotatedItem.y, rotatedItem.w, rotatedItem.h, totalBlockedCells)
      ) {
        const newPos = findNearestValidPosition(
          rotatedItem.w,
          rotatedItem.h,
          rotatedItem.x,
          rotatedItem.y,
          cols,
          rows,
          totalBlockedCells
        );

        rotatedItem.x = newPos.x;
        rotatedItem.y = newPos.y;
      }

      return rotatedItem;
    });
  });

  setLayoutKey(prev => prev + 1);
}

  
        if (['Delete', 'Backspace'].includes(event.key)) {
          setLayout(prev => prev.filter(item => item.i !== activeItemKey));
          setLayoutKey(prev => prev + 1);
        }
  
        // Duplizieren mit Taste "d"
        if (event.key.toLowerCase() === 'd') {
          setLayout(prev => {
            const itemToDuplicate = prev.find(item => item.i === activeItemKey);
            if (!itemToDuplicate) return prev;
  
            // Neues Item mit leicht versetzter Position
            const rawNewItem = {
              ...itemToDuplicate,
              i: `${itemToDuplicate.type}-${Date.now()}`,
              x: itemToDuplicate.x + 1,
              y: itemToDuplicate.y + 1,
            };
  
            // Begrenzung auf gültiges Grid
            const newItem = enforceGridBounds(rawNewItem, cols, rows);
  
            return [...prev, newItem];
          });
  
          setLayoutKey(prev => prev + 1);
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [activeItemKey, setLayout, setLayoutKey, cols, rows]);
  };
  
  
  
  export { isOverlapping, findNearestValidPosition, handleDragStop, useFurnitureDrop, useKeyboardShortcuts };
  