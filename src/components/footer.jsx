import React from 'react';
import { Link } from 'react-router-dom';
import '../style/footer.css';

function Footer() {
    return (
        <>
            <footer>
                <div className="section">
                    <h2>Chi siamo?</h2>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </p>
                    {/*Sostituisci la riga 12 con il testo */}
                </div>

                <div className="section">
                    <h2>Info</h2>
                    <ul>
                        <li><Link to="/policy">Policy</Link></li>
                        <li><a href="https://dsc.gg/ximipvp" target="_blank" rel="noopener noreferrer">Contatti</a></li>
                    </ul>
                </div>

                <div className="section">
                    <h2>Social</h2>
                    <ul>
                        <li><a href="https://dsc.gg/ximipvp" target="_blank" rel="noopener noreferrer">Discord</a></li>
                        <li><a href="https://t.me/XimiPvP" target="_blank" rel="noopener noreferrer">Telegram</a></li>
                        <li><Link to="/store">Store</Link></li>
                    </ul>
                </div>
            </footer>

            <div className="under">
                © {new Date().getFullYear()} XimiPVP. Tutti i diritti riservati. Non affiliato con Mojang Studios. <a href="https://lc.cx/p4L-AP" target="_blank" rel="noopener noreferrer"> Designed by ZeRo</a>
            </div>
        </>
    );
}

export default Footer;
