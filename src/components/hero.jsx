import React from 'react';
import "../style/hero.css";
import Card from './card';
import {Shield, Sword} from 'lucide-react';

function Hero(){
    return(
        <>
        <div className="content-wrapper">
        <section>
            <div className="title">
            <h2>Chi siamo?</h2>
            </div> 
            <div className="par">
            <p>XimiPvP è un server Minecraft dedicato ai veri appassionati del PvP e delle modalità competitive. Offriamo un ambiente curato e sempre aggiornato, con modalità come KitPvP, Practice, Speedbridge e, a breve, Skyblock.

Il nostro obiettivo è creare un'esperienza di gioco fluida, bilanciata e divertente, sia per i nuovi giocatori che per i più esperti. Il team di XimiPvP lavora costantemente per migliorare le prestazioni del server, introdurre nuove funzionalità e mantenere una community attiva e rispettosa.

Che tu voglia allenarti, competere o semplicemente divertirti con gli amici, su XimiPvP troverai sempre qualcosa da fare. Unisciti a noi e diventa parte della nostra community!</p>
           {/*Sostituisci la riga 15 con il testo */}
            </div>
        </section>

        <Card info="Staff Attivo" icon={Shield} />

        <Card info="PVP innovativo" icon={Sword} />
        </div>
        </>
    )
}

export default Hero;