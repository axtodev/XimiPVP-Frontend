import React from 'react';
import '../style/footer.css';

function Footer(){
    return(
        <>
            <footer>
               <div className="section">
                 <h2>Chi siamo?</h2>
                 <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
               </div>

               <div className="section">
                <h2>Info</h2>
                <ul>
                    <li>Regolamento</li>
                    <li>Contatti</li>
                    <li>FAQ</li>
                </ul>
               </div>

               <div className="section">
                <h2>Social</h2>
                <ul>
                    <li>Discord</li>
                    <li>Telegram</li>
                    <li>Store</li>
                </ul>
               </div>
            </footer>

            <div className="under">
               © {new Date().getFullYear()} XimiPVP. Tutti i diritti riservati. Non affiliato con Mojang Studios. <a href="https://lc.cx/p4L-AP"> Designed by ZeRo</a>
            </div>
        </>
    )
}

export default Footer;