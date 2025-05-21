import { furnitureItems } from '../../data/items'; 
import './DesignPreview.scss';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const DesignPreview = ({ design, setSelectedDesign, selectedDesign }) => {
  const handleOpenDesign = (design) => {
    const enrichedLayout = (design.layout || []).map(item => {
      const base = furnitureItems.find(f => f.type === item.type);
      const i = `${item.type}-${Date.now()}`;
      return base ? { ...base, ...item, i } : { ...item, i };
    });

    const enrichedLayoutUf = (design.layoutUf || []).map(item => {
      const base = furnitureItems.find(f => f.type === item.type);
      return base ? { ...base, ...item } : item;
    });

    setSelectedDesign({
      layout: enrichedLayout,
      layoutUf: enrichedLayoutUf,
      property: design.property || 'Barn',
    });
  };

  return (
    <div className="design-preview-container" onClick={() => handleOpenDesign(design)}>
      <h4 className="design-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'none'  }}>
        {design.title}
      </h4>
      <div>
        <p className="design-property" style={{ textTransform: 'none', marginBottom:"0" }}>{design.property}</p>
        <p className="design-username" style={{ textTransform: 'none' }}>by {design.username}</p>
      </div>
      <div className="design-rating">
        <FaThumbsUp className="icon-like" /> {design.likes || 0}
        <FaThumbsDown className="icon-dislike" style={{ marginLeft: '1rem' }} /> {design.dislikes || 0}
        <span className="rating-score">
          ⟶ Score: {(design.likes || 0) - (design.dislikes || 0)}
        </span>
      </div>
    </div>
  );
};

export default DesignPreview;
