import React, { useEffect, useState } from 'react';
import { DragPreviewImage, useDrag } from 'react-dnd';
import './ItemPicker.scss';

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'furniture',
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = item.image;
    img.onload = () => {
      const maxSize = 80;
      const aspectRatio = img.width / img.height;
      let width = maxSize;
      let height = maxSize;

      if (aspectRatio > 1) {
        // Querformat
        height = maxSize / aspectRatio;
      } else {
        // Hochformat oder quadratisch
        width = maxSize * aspectRatio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      setPreviewImg(canvas.toDataURL());
    };
  }, [item.image]);

  return (
    <div
      ref={drag}
      className="draggable-item"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        margin: '8px',
        padding: '10px',
        background: '#eee',
        border: '1px solid #ccc',
      }}
    >
      {previewImg && <DragPreviewImage connect={preview} src={previewImg} />}
      <img
        src={item.image}
        alt={item.name}
        style={{ width: 60, height: 60, objectFit: 'contain' }}
      />
      <div className="item-label">{item.name}</div>
    </div>
  );
};

const ItemPicker = ({ items }) => {
  return (
    <div className="item-picker">
      <div className="item-list">
        {items.map((item) => (
          <DraggableItem key={item.type} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemPicker;
