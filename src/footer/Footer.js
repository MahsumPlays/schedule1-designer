import './Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {


    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h5>About</h5>
                    <p className="footer-text">
                        This is a fan project for the game Schedule 1. 
                        It does not promote or glorify drug use in any way.
                    </p>
                </div>
                <div className="footer-column">
                    <h5>Socials</h5>
                    <div className="social-icons">
                        <a href="https://www.youtube.com/mahsumplays" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <FontAwesomeIcon icon={faYoutube} style={{color: "#ff0000", width: "2.5rem", height: "fit-content"}} />
                        </a>
                        <a href="https://www.twitch.tv/mahsumplays" target="_blank" rel="noopener noreferrer" aria-label="Twitch">
                            <FontAwesomeIcon icon={faTwitch} style={{color: "#7651e6", width: "2.5rem", height: "fit-content"}} />
                        </a>
                    </div>
                </div>
            </div>
            <p className="footer-text" style={{ textTransform: "none", marginTop: "1rem" }}>© 2025 Schedule 1 Designer v0.2.</p>
        </footer>
    )
}

export default Footer;