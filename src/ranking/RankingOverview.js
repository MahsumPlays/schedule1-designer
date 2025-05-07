import { React, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './RankingOverview.scss';
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { furnitureItems } from '../data/items'; 
import DesignView from './DesignView';

const RankingOverview = () => {
  const [allDesigns, setAllDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrid = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) return;
  
      const q = query(collection(db, "designs"));
      const snapshot = await getDocs(q);
      setAllDesigns(snapshot.docs.map(doc => doc.data()));
      setLoading(false);
    };
  
    fetchGrid();
  }, []);

  if (loading) return <p>Loading...</p>;

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
      property: design.property || 'Barn', // Fallback
    });
  };
  

  return (
    <div className="ranking-overview-container">
      <h3>Ranking Overview</h3>
      <div className="ranking-overview-content">
        <p>Here you can see the ranking overview of your buildings.</p>
        {allDesigns.map((design, index) => (
          <div key={index} className="design-item">
            <Button
              type='button'
              size='lg'
              className='btn btn-default'
              id={`design-${index}`}
              onClick={() => handleOpenDesign(design)}
            >
              Open Design {index}
            </Button>
          </div>
        ))}
        {selectedDesign && (
          <DesignView
            layout={selectedDesign.layout}
            layoutUf={selectedDesign.layoutUf}
            property={selectedDesign.property}
          />
        )}
      </div>
    </div>
  );
};

export default RankingOverview;
