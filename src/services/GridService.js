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

  const isFree = (x, y) =>
    x >= 0 &&
    y >= 0 &&
    x + w <= cols &&
    y + h <= rows &&
    !isOverlapping(x, y, w, h, blockedCells);

  // Zuerst Originalposition versuchen
  if (isFree(startX, startY)) {
    return { x: startX, y: startY };
  }

  for (let d = 1; d < maxDistance; d++) {
    for (let dx = -d; dx <= d; dx++) {
      for (let dy = -d; dy <= d; dy++) {
        const x = startX + dx;
        const y = startY + dy;

        if (Math.abs(dx) !== d && Math.abs(dy) !== d) continue; // Nur Rand prüfen

        if (isFree(x, y)) {
          return { x, y };
        }
      }
    }
  }

  return { x: startX, y: startY }; // Fallback (eigentlich immer belegt)
};

const getOccupiedCells = (layout, ignoreKey = null) => {
  return layout.flatMap(item => {
    if (item.i === ignoreKey) return [];
    const cells = [];
    for (let dx = 0; dx < item.w; dx++) {
      for (let dy = 0; dy < item.h; dy++) {
        cells.push({ x: item.x + dx, y: item.y + dy });
      }
    }
    return cells;
  });
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

      if (event.key.toLowerCase() === 'd') {
        setLayout(prev => {
          const itemToDuplicate = prev.find(item => item.i === activeItemKey);
          if (!itemToDuplicate) return prev;

          const occupiedCells = getOccupiedCells(prev);
          const blocked = totalBlockedCells.concat(occupiedCells);

          const startX = itemToDuplicate.x;
          const startY = itemToDuplicate.y + 1;

          const pos = findNearestValidPosition(
            itemToDuplicate.w,
            itemToDuplicate.h,
            startX,
            startY,
            cols,
            rows,
            blocked
          );

          // Kein Platz gefunden
          const isOriginalBlocked = isOverlapping(pos.x, pos.y, itemToDuplicate.w, itemToDuplicate.h, blocked);
          const isSamePos = pos.x === itemToDuplicate.x && pos.y === itemToDuplicate.y;
          if (isOriginalBlocked && isSamePos) return prev;

          const overlapsLayout = isOverlappingWithLayout(pos.x, pos.y, itemToDuplicate.w, itemToDuplicate.h, prev);
          if (overlapsLayout) return prev;

          const newItem = {
            ...itemToDuplicate,
            i: `${itemToDuplicate.type}-${Date.now()}`,
            x: pos.x,
            y: pos.y
          };

          const newLayout = [...prev, newItem];
          return removeItemsOutsideBounds(newLayout, cols, rows);
        });

        setLayoutKey(prev => prev + 1);
      }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [activeItemKey, setLayout, setLayoutKey, cols, rows, totalBlockedCells]);
  };
  
  const removeItemsOutsideBounds = (layout, cols, rows) => {
  return layout.filter(item => {
    const withinX = item.x >= 0 && item.x + item.w <= cols;
    const withinY = item.y >= 0 && item.y + item.h <= rows;
    return withinX && withinY;
  });
};

const isOverlappingWithLayout = (x, y, w, h, layoutItems) => {
  return layoutItems.some(item => {
    const itemRight = item.x + item.w;
    const itemBottom = item.y + item.h;
    const newRight = x + w;
    const newBottom = y + h;

    const horizontalOverlap = x < itemRight && newRight > item.x;
    const verticalOverlap = y < itemBottom && newBottom > item.y;

    return horizontalOverlap && verticalOverlap;
  });
};

const cleanLayout = (layout, cols, rows, blockedCells) => {
  const cleaned = [];
  const occupiedSet = new Set();
  const isInsideBounds = (x, y, w, h) => {
    return x >= 0 && y >= 0 && x + w <= cols && y + h <= rows;
  };

  const overlapsBlocked = (x, y, w, h) => {
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        if (blockedCells.some(cell => cell.x === x + dx && cell.y === y + dy)) {
          return true;
        }
      }
    }
    return false;
  };

  const isOverlappingOccupied = (x, y, w, h) => {
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        const key = `${x + dx}:${y + dy}`;
        if (occupiedSet.has(key)) {
          return true;
        }
      }
    }
    return false;
  };

  const markOccupied = (x, y, w, h) => {
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        occupiedSet.add(`${x + dx}:${y + dy}`);
      }
    }
  };

  for (const item of layout) {
    if (!isInsideBounds(item.x, item.y, item.w, item.h)) continue;
    if (overlapsBlocked(item.x, item.y, item.w, item.h)) continue;
    if (isOverlappingOccupied(item.x, item.y, item.w, item.h)) continue;

    cleaned.push(item);
    markOccupied(item.x, item.y, item.w, item.h);
  }

  return cleaned;
};



  
  export { isOverlapping, findNearestValidPosition, handleDragStop, useFurnitureDrop, useKeyboardShortcuts, cleanLayout};
  