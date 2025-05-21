import {React, useState} from 'react';
import BarnsGrid from './barn/BarnsGrid';
import MotelGrid from './motel/MotelGrid';
import BungalowGrid from './bungalow/BungalowGrid';
import SweatshopGrid from './sweatshop/SweatshopGrid';
import DocksGrid from './docks/DocksGrid';
import StorageGrid from './storage/StorageGrid';
import './CustomGrid.scss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CustomGrid = ({ selectedBuilding, layout, setLayout, layoutUf, setLayoutUf }) => {
  const [floor, setFloor] = useState(0);
  const [showControlsDialog, setShowControlsDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [designTitle, setDesignTitle] = useState("");

  const renderSelectedGrid = () => {
    const gridProps = { layout, setLayout, layoutUf, setLayoutUf, floor, keyboardShortcutsDisabled: showUploadDialog  }; 
    switch (selectedBuilding) {
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
        return <BarnsGrid {...gridProps} />;
    }
  };

  const handleButtonSwitchFloor = () => {
    setFloor((prevFloor) => (prevFloor === 0 ? 1 : 0));
  };
  
  const handleLayoutUpload = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      alert("You must be logged in.");
      return;
    }
  
    // Calculate timestamp for 7 days ago
    const oneWeekAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  
    // Find all uploads by the user in the last 7 days
    const q = query(
      collection(db, "designs"),
      where("userId", "==", user.uid),
      where("createdAt", ">=", oneWeekAgo)
    );
  
    const snapshot = await getDocs(q);
  
    if (snapshot.size >= 10) {
      alert("You have reached the upload limit of 10 designs per week.");
      return;
    }

    if (!designTitle.trim()) {
      alert("Please enter a valid title.");
      return;
    }

    if (!/^[a-zA-Z0-9 _]{3,50}$/.test(designTitle.trim())) {
      alert("Title must be 3–50 characters and only contain letters, numbers, spaces, - or _.");
      return;
    }

    // Allow upload
    try {
      const cleanLayout = layout.map(({ x, y, type, rotation }) => ({ x, y, type, rotation }));
      const cleanLayoutUf = layoutUf.length > 0
        ? layoutUf.map(({ x, y, type, rotation }) => ({ x, y, type, rotation }))
        : null;

      // Add selectedBuilding to the upload
      await addDoc(collection(db, "designs"), {
        userId: user.uid,
        username: user.displayName,
        title: designTitle,
        layout: cleanLayout,
        layoutUf: cleanLayoutUf,
        property: selectedBuilding, 
        likes: 0, 
        dislikes: 0, 
        likedBy: [],
        dislikedBy: [],   
        createdAt: serverTimestamp()
      });
  
      alert("Design uploaded successfully!");
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Error during upload. Please try again.");
    }
  };

  return (
    <div className="grid-content">
      <div className='grid-buttons' style={{ marginBottom: '10px' }}>
        {(selectedBuilding === 'Barn' || selectedBuilding === 'Docks') && (
          <Button
            type='button'
            size='lg'
            onClick={handleButtonSwitchFloor}
            className='btn btn-default'
          >
            Switch Floor
          </Button>
        )}
        <Button
          type='button'
          size='lg'
          onClick={() => setShowControlsDialog(true)}
          className='btn btn-default'
          style={{ marginLeft: '10px' }}
        >
          Controls
        </Button>
        <Button
          type='button'
          size='lg'
          onClick={() => setShowUploadDialog(true)}
          className='btn btn-default'
          style={{ marginLeft: '10px' }}
        >
          Upload Design
        </Button>
      </div>
      {renderSelectedGrid()}
      <Modal
        show={showControlsDialog}
        onHide={() => setShowControlsDialog(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Controls</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="controls-dialog">
            <p>Click and drag to place items on the grid</p>
            <p>Press R to rotate last dragged item</p>
            <p>Press D to duplicate last dragged item</p>
            <p>Press Delete to remove last dragged item</p>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showUploadDialog}
        onHide={() => setShowUploadDialog(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Design</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="upload-dialog">
            <input
              type="text"
              placeholder="Enter a title for your design"
              value={designTitle}
              onChange={(e) => setDesignTitle(e.target.value)}
              className="form-control"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUploadDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleLayoutUpload(designTitle);
              setShowUploadDialog(false);
            }}
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};


export default CustomGrid;
