import React, { useEffect, useState } from 'react';
import './planer-header.scss';
import { auth, provider } from '../firebase'; 
import { signInWithPopup, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

const PlanerHeader = ({ onSelectBuilding }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPropertiesDropdown, setShowPropertiesDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [showControlsDialog, setShowControlsDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.displayName) {
        setIsEditingUsername(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handleSaveUsername = async () => {
    if (username.trim()) {

      const isValidUsername = /^[a-zA-Z0-9_]{3,20}$/.test(username.trim());
      if (!isValidUsername) {
        alert("Username must be 3–20 characters long and can only contain letters, numbers, and underscore (_).");
        return;
      }

      const db = getFirestore();
      const designsRef = collection(db, "designs");
      const usernameQuery = query(designsRef, where("username", "==", username.trim()));
      const existingUsers = await getDocs(usernameQuery);

      // Wenn bereits ein Benutzer mit diesem Namen existiert (außer dir selbst)
      const nameTaken = existingUsers.docs.some(doc => doc.id !== user.uid);

      if (nameTaken) {
        alert("Dieser Username ist bereits vergeben. Bitte wähle einen anderen.");
        return;
      }


      try {
        await updateProfile(auth.currentUser, {
          displayName: username,
        });
        setIsEditingUsername(false); 
        setUser({ ...user, displayName: username });
        updateUsernameInDesigns(user.uid, username);
        console.log("Username updated successfully:", user);
      } catch (error) {
        console.error("Fehler beim Speichern des Usernamens:", error);
      }
    }
  };

  const updateUsernameInDesigns = async (userId, newUsername) => {
  const db = getFirestore();
  const q = query(collection(db, "designs"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  const updates = snapshot.docs.map(async (docSnap) => {
    await updateDoc(doc(db, "designs", docSnap.id), {
      username: newUsername
    });
  });

  await Promise.all(updates);
};

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const togglePropertiesDropdown = () => {
    setShowPropertiesDropdown(prev => !prev);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
      if (!event.target.closest('.properties-dropdown-container')) {
        setShowPropertiesDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const handleGridChange = (grid) => {
    onSelectBuilding(grid);
    togglePropertiesDropdown();
  }

  return (
    <header className='header-container'>
      <h2 className='header-title' onClick={() => navigate('/')}>Schedule I - Designer</h2>

      <div className='header-buttons-container'>
        <div 
          className='properties-dropdown-container' 
          onMouseEnter={() => setShowPropertiesDropdown(true)} 
          onMouseLeave={() => setShowPropertiesDropdown(false)}
        >
          <button className='header-button'>Properties</button>
          {showPropertiesDropdown && (
            <div className='properties-dropdown'>
              <button onClick={() => { handleGridChange('Motel'); navigate('/'); }}>Motel</button>
              <button onClick={() => { handleGridChange('Sweatshop'); navigate('/'); }}>Sweatshop</button>
              <button onClick={() => { handleGridChange('Bungalow'); navigate('/'); }}>Bungalow</button>
              <button onClick={() => { handleGridChange('Barn'); navigate('/'); }}>Barn</button>
              <button onClick={() => { handleGridChange('Docks'); navigate('/'); }}>Docks</button>
              <button onClick={() => { handleGridChange('Storage'); navigate('/'); }}>Storage</button>
            </div>
          )}
        </div>
        <button className='header-button' onClick={() => {
          onSelectBuilding('Ranking')
          navigate('/ranking');
        }}>Ranking</button>
      </div>

      <div className="login-section">
      {user ? (
          <div className={`user-menu ${showDropdown ? 'open' : ''}`}>
            <span className="username">{user.displayName}</span>
            <img
              src={user.photoURL}
              alt="Profil"
              className="user-avatar"
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => {
                  setIsEditingUsername(true); 
                  setShowControlsDialog(true);
                }}>
                  Change Username
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
        </div>
        ) : (
          <button className='header-button' onClick={handleLogin}>Login</button>
        )}
      </div>
      {isEditingUsername && (
                <div className="username-dialog">
                  <Modal
                    show={showControlsDialog}
                    onHide={() => setShowControlsDialog(false)}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Change your username</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <input
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                    <button onClick={handleSaveUsername}>SAVE</button>
                    <button onClick={() => setIsEditingUsername(false)}>CANCEL</button>
                    </Modal.Body>
                  </Modal>

                </div>
              )}
    </header>
  );
};

export default PlanerHeader;
