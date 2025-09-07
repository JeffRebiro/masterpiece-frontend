// Preloader.jsx
import React from 'react';
import Lottie from 'lottie-react';
import './Preloader.css';

const Preloader = () => {
  return (
    <div className="preloader">
      <Lottie
        path="https://lottie.host/45194ef5-c958-4dc1-b1bb-577307389b2c/u8154wBHVh.json"
        loop
        autoplay
        style={{ width: 150, height: 150 }}
      />
    </div>
  );
};

export default Preloader;
