<<<<<<< HEAD
=======
<<<<<<< HEAD
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../style/slider.css"; 
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";

const slides = [
  //Sostituisci con le immagini
  { image: "https://www.coralmc.it/_next/static/media/survival.e216a487.jpg" },
  { image: "https://www.coralmc.it/_next/static/media/bwpractice.61da28cb.jpg" },
  { image: "https://www.coralmc.it/_next/static/media/sandbox.71daa8fa.jpg" },
  { image: "https://www.coralmc.it/_next/static/media/roleplay.ebe9b37e.jpg" },
];

export default function Slider() {
  return (
    <div className="slider-container">
        <h2>Le nostre modalità</h2>
        <br />
        <br />
        <Swiper
          slidesPerView={2}
          spaceBetween={0}
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}          
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
          }}
        >

          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="slide">
                <div className="image">
                  <img src={slide.image} alt={`Slide ${index + 1}`} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

    </div>
  );
}
=======
>>>>>>> 0c76dc1 (Initial commit)
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../style/slider.css"; 
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";

const slides = [
  //Sostituisci con le immagini
  { image: "https://www.coralmc.it/_next/static/media/survival.e216a487.jpg" },
  { image: "https://www.coralmc.it/_next/static/media/bwpractice.61da28cb.jpg" },
  { image: "https://www.coralmc.it/_next/static/media/sandbox.71daa8fa.jpg" },
  { image: "https://www.coralmc.it/_next/static/media/roleplay.ebe9b37e.jpg" },
];

export default function Slider() {
  return (
    <div className="slider-container">
        <h2>Le nostre modalità</h2>
        <br />
        <br />
        <Swiper
          slidesPerView={2}
          spaceBetween={0}
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}          
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
          }}
        >

          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="slide">
                <div className="image">
                  <img src={slide.image} alt={`Slide ${index + 1}`} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

    </div>
  );
}
<<<<<<< HEAD
=======
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
