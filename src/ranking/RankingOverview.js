import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './RankingOverview.scss';
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import DesignPreview from './designPreview/DesignPreview';
import { useNavigate } from 'react-router-dom';

const RankingOverview = () => {
  const [allDesigns, setAllDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const designsPerPage = 21;

  useEffect(() => {
    const fetchGrid = async () => {
      const db = getFirestore();    
      const q = query(collection(db, "designs"));
      const snapshot = await getDocs(q);

      setAllDesigns(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    };
  
    fetchGrid();
  }, []);

  const uniqueProperties = [...new Set(allDesigns.map(design => design.property))];

  const filteredDesigns = allDesigns
    .filter(design => !selectedProperty || design.property === selectedProperty)
    .sort((a, b) => {
      const ratingA = (a.likes || 0) - (a.dislikes || 0);
      const ratingB = (b.likes || 0) - (b.dislikes || 0);
      return ratingB - ratingA;
  });

  const totalPages = Math.ceil(filteredDesigns.length / designsPerPage);
  const startIndex = (currentPage - 1) * designsPerPage;
  const currentDesigns = filteredDesigns.slice(startIndex, startIndex + designsPerPage);


  return (
    <div className="ranking-overview-container">
      {!selectedDesign && (
        <div className="ranking-overview-header">
          <div className="property-buttons">
            {uniqueProperties.map((property, index) => (
              <Button
                key={index}
                variant={selectedProperty === property ? "primary" : "secondary"}
                onClick={() => setSelectedProperty(selectedProperty === property ? null : property)}
                style={{color: "white" , margin: "0.5rem" }}
              >
                {property}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className="ranking-overview-content">
      {!selectedDesign && currentDesigns.map((design, index) => (
        <div className="design-items" key={index} onClick={() => {
          setSelectedDesign(design);
          navigate(`/design/${design.id}`);
        }}>
          <DesignPreview design={design} selectedDesign={selectedDesign} setSelectedDesign={setSelectedDesign} />
        </div>
      ))}
      </div>
      {!selectedDesign && (
        <div className="pagination-controls">
          <Button
            variant="outline-light"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            &lt; Back
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "secondary" : "primary"}
              onClick={() => setCurrentPage(i + 1)}
              style={{ margin: "0 0.25rem" }}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline-light"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next &gt;
          </Button>
        </div>
      )}
    </div>
  );
};

export default RankingOverview;
