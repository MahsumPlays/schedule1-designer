import { useEffect } from 'react';
import BarnsGrid from '../grid/barn/BarnsGrid';
import MotelGrid from '../grid/motel/MotelGrid';
import BungalowGrid from '../grid/bungalow/BungalowGrid';
import SweatshopGrid from '../grid/sweatshop/SweatshopGrid';
import DocksGrid from '../grid/docks/DocksGrid';
import StorageGrid from '../grid/storage/StorageGrid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { furnitureItems } from '../data/items';
import Calculator from '../calculator/Calculator';
import { useParams } from 'react-router-dom';
import { getFirestore, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import './DesignView.scss';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const DesignView = ({ layout: initialLayout, layoutUf: initialLayoutUf, property: initialProperty, floor: initialFloor }) => {
  const { id } = useParams();
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [layout, setLayout] = useState(initialLayout || []);
  const [layoutUf, setLayoutUf] = useState(initialLayoutUf || []);
  const [property, setProperty] = useState(initialProperty);
  const [floor, setFloor] = useState(initialFloor || 0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesign = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (!id) return;
      const docRef = doc(db, 'designs', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedDesign({ id: docSnap.id, ...data });
        setLayout(data.layout || []);
        setLayoutUf(data.layoutUf || []);
        setProperty(data.property || 'Barn');
        setFloor(data.floor || 0);
      }
    };
    fetchDesign();
  }, [id]);


  const filledLayout = layout.map(item => {
    const base = furnitureItems.find(f => f.type === item.type);
    const i = `${item.type}-${Date.now()}`;
    return base ? { ...base, ...item, i } : { ...item, i };
  });

  const filledLayoutUf = Array.isArray(layoutUf)
    ? layoutUf.map(item => {
        const base = furnitureItems.find(f => f.type === item.type);
        const i = `${item.type}-${Date.now()}`;
        return base ? { ...base, ...item, i } : { ...item, i };
      })
    : [];

  const gridProps = {
    layout: filledLayout ? filledLayout : [],
    setLayout: () => {},
    layoutUf: filledLayoutUf,
    setLayoutUf: () => {},
    floor: floor,
  };

  const sendLike = async () => {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in.");
    return;
  }

  if (!id) {
    console.error("Design ID not found.");
    return;
  }

  if (selectedDesign.likedBy?.includes(user.uid)) {
    alert("You already liked this design.");
    return;
  }

  const updatedDislikedBy = selectedDesign.dislikedBy?.filter(uid => uid !== user.uid) || [];

  try {
    const newLikes = (selectedDesign.likes || 0) + 1;
    const newDislikes = selectedDesign.dislikedBy?.includes(user.uid) ? (selectedDesign.dislikes || 0) - 1 : (selectedDesign.dislikes || 0);

    await updateDoc(doc(db, "designs", selectedDesign.id), {
      likedBy: arrayUnion(user.uid),
      dislikedBy: updatedDislikedBy,
      likes: newLikes,
      dislikes: newDislikes,
    });

    setSelectedDesign(prev => ({
      ...prev,
      likedBy: [...(prev.likedBy || []), user.uid],
      dislikedBy: updatedDislikedBy,
      likes: newLikes,
      dislikes: newDislikes,
    }));
  } catch (error) {
    console.error("Error updating like:", error);
    alert("There was an error updating the like.");
  }
};

const sendDislike = async () => {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in.");
    return;
  }

  if (!selectedDesign?.id) {
    console.error("Design ID not found.");
    return;
  }

  // Prüfen ob bereits disliked
  if (selectedDesign.dislikedBy?.includes(user.uid)) {
    alert("You already disliked this design.");
    return;
  }

  // Optional: Like entfernen, falls vorher gedrückt
  const updatedLikedBy = selectedDesign.likedBy?.filter(uid => uid !== user.uid) || [];

  try {
    const newDislikes = (selectedDesign.dislikes || 0) + 1;
    const newLikes = selectedDesign.likedBy?.includes(user.uid) ? (selectedDesign.likes || 0) - 1 : (selectedDesign.likes || 0);

    await updateDoc(doc(db, "designs", selectedDesign.id), {
      dislikedBy: arrayUnion(user.uid),
      likedBy: updatedLikedBy,
      dislikes: newDislikes,
      likes: newLikes,
    });

    setSelectedDesign(prev => ({
      ...prev,
      dislikedBy: [...(prev.dislikedBy || []), user.uid],
      likedBy: updatedLikedBy,
      dislikes: newDislikes,
      likes: newLikes,
    }));
  } catch (error) {
    console.error("Error updating dislike:", error);
    alert("There was an error updating the dislike.");
  }
};

  const handleButtonSwitchFloor = () => {
    setFloor((prevFloor) => (prevFloor === 0 ? 1 : 0));
  };


  const renderGrid = () => {
    switch (property) {
      case 'Barn':
        return <BarnsGrid {...gridProps} />;
      case 'Motel':
        return <MotelGrid {...gridProps} />;
      case 'Bungalow':
        return <BungalowGrid {...gridProps} />;
      case 'Sweatshop':
        return <SweatshopGrid {...gridProps} />;
      case 'Docks':
        return <DocksGrid {...gridProps} />;
      case 'Storage':
        return <StorageGrid {...gridProps} />;
      default:
        return <p>Unknown property type: {property}</p>;
    }
  };

  return (
    <div className="design-view-container">
      <div className="design-view-header">
          <div className='design-view'>
            <div className="design-view-buttons"></div>
            <Button
              className='like-button-container'
              variant="link"
              onClick={() => sendLike()}
            >
              <FontAwesomeIcon className={`like-button${selectedDesign?.likedBy?.includes(getAuth().currentUser?.uid) ? ' liked-button' : ''}`} icon={faThumbsUp} />
            </Button>
            <Button
              variant="btn btn-secondary"
              onClick={() => {
                setSelectedDesign(null);
                navigate('/ranking');
              }}
              style={{color: "white" , width: "7rem" }}
            >
              Back
            </Button>
            <Button
              className='like-button-container'
              variant="link"
              onClick={() => sendDislike()}
            >
              <FontAwesomeIcon className={`like-button${selectedDesign?.dislikedBy?.includes(getAuth().currentUser?.uid) ? ' disliked-button' : ''}`} icon={faThumbsDown} />
            </Button>
          </div>
          {(property === "Docks" || property === "Barn") && (
            <div className='switch-floor'>
              <Button className='btn btn-secondary like-button-container' style={{ color: "white" }} onClick={() => handleButtonSwitchFloor()}>
                Switch Floor
              </Button>
            </div>
          )}
    </div>
    <div className='design-view-grid'>
      <div className=''></div>
      <DndProvider backend={HTML5Backend}>
        {renderGrid()}
      </DndProvider>
      <div className='tutorial'>
        <Calculator layout={[...filledLayout, ...filledLayoutUf]} />
      </div>
    </div>
    </div>
  );
};

export default DesignView;
