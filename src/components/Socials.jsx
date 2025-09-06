import React from "react";

const images = [
  { img: "/images/instagram-01.jpg", label: "Fashion" },
  { img: "/images/instagram-02.jpg", label: "New" },
  { img: "/images/instagram-03.jpg", label: "Brand" },
  { img: "/images/instagram-04.jpg", label: "Makeup" },
  { img: "/images/instagram-05.jpg", label: "Leather" },
  { img: "/images/instagram-06.jpg", label: "Bag" },
];

const SocialSection = () => {
  return (
    <section className="section" id="social">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading">
              <h2>Social Media</h2>
              <span>
                Details to details is what makes Megamall different from the others.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row images">
          {images.map((item, index) => (
            <div className="col-2" key={index}>
              <div className="thumb">
                <div className="icon">
                  <a href="http://instagram.com" target="_blank" rel="noopener noreferrer">
                    <h6>{item.label}</h6>
                    <i className="fa fa-instagram"></i>
                  </a>
                </div>
                <img src={item.img} alt={item.label} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
