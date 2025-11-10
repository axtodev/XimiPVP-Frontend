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
<<<<<<< HEAD
=======
<<<<<<< HEAD
                        XimiPvP è un server Minecraft dedicato al PvP e al divertimento. Nato dalla passione per Java, offriamo un’esperienza unica con modalità competitive e una community attiva.
=======
>>>>>>> 0c76dc1 (Initial commit)
                        XimiPvP è un server Minecraft dedicato ai veri appassionati del PvP e delle modalità competitive. Offriamo un ambiente curato e sempre aggiornato, con modalità come KitPvP, Practice, Speedbridge e, a breve, Skyblock.

Il nostro obiettivo è creare un'esperienza di gioco fluida, bilanciata e divertente, sia per i nuovi giocatori che per i più esperti. Il team di XimiPvP lavora costantemente per migliorare le prestazioni del server, introdurre nuove funzionalità e mantenere una community attiva e rispettosa.

Che tu voglia allenarti, competere o semplicemente divertirti con gli amici, su XimiPvP troverai sempre qualcosa da fare. Unisciti a noi e diventa parte della nostra community!
<<<<<<< HEAD
=======
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
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
