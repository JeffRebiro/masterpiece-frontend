import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const likeFunction = (el) => {
      el.innerHTML = '<b><i class="fa fa-thumbs-up"></i> Liked</b>';
    };

    const myFunction = (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
      }
    };

    window.likeFunction = likeFunction;
    window.myFunction = myFunction;
  }, []);

  return (
    <>


      <div className="w3-light-grey">
        <div>
          <div className="w3-content" style={{ maxWidth: '1600px' }}>
            <header className="w3-display-container w3-wide" id="home">
              <img
                className="w3-image"
                src="/images/pws.png"
                alt="Fashion Blog"
                width="600"
                height="1060"
              />

            </header>

            {/* MEGAMALL */}
            <div className="w3-row w3-padding w3-border">
              <div className="w3-col l8 s12">
                <div className="w3-container w3-white w3-margin w3-padding-large">
                  <div className="w3-center">
                    <a href="/products">
                    <h3>Masterpiece Megamall</h3>
                    </a>
                  </div>
                  <div className="w3-justify">
                    <a href="/products"> 
                      <img src="/images/mmall.jpg" alt="Girl Hat" style={{ width: '100%' }} className="w3-padding-16" />
                    </a>
                    <p><strong>More Hats!</strong>I am crazy about hats these days. Some text about this blog entry. Fashion fashion and mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl.</p>
                    <p className="w3-left">
                      <button className="w3-button w3-white w3-border" onClick={(e) => window.likeFunction(e.target)}>
                        <b><i className="fa fa-thumbs-up"></i> Like</b>
                      </button>
                    </p>

                    <div className="w3-clear"></div>
                    <div className="w3-row w3-margin-bottom" id="demo1" style={{ display: 'none' }}>
                      <hr />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w3-col l4">
                <div className="w3-white w3-margin">
                  <img src="/images/Megamall.png" alt="Jane" className="w3-grayscale" />
                  <div className="w3-container w3-black">
                    <h4>At Megamall, we offer solutions tailored to your needs. Whether you’re short on time to shop online or looking for something unique and special, we’ve got you covered.</h4>
                  </div>
                </div>
                <div className="w3-white w3-margin">
                  <div className="w3-container w3-padding w3-black">
                    <h4>Popular Products</h4>
                  </div>
                  <ul className="w3-ul w3-hoverable w3-white">
                    <li className="w3-padding-16">
                      <img
                        src="/images/s1.jpg"
                        alt="Image"
                        className="w3-left w3-margin-right"
                        style={{ width: '69px' }}
                      />
                      <a href="/category/printing-services">
                      <span className="w3-large">Flag Stands</span>
                      </a>
                      <br />
                      <span>Silver and Gold</span>
                    </li>
                    <li className="w3-padding-16">
                      <img
                        src="/images/s2.jpg"
                        alt="Image"
                        className="w3-left w3-margin-right"
                        style={{ width: '69px' }}
                      />
                      <a href="/category/bicycles-accessories">
                      <span className="w3-large">Helmets</span>
                      </a>
                      <br />
                      <span>Motorcycle and Construction</span>
                    </li>
                    <li className="w3-padding-16">
                      <img
                        src="/images/s3.jpg"
                        alt="Image"
                        className="w3-left w3-margin-right"
                        style={{ width: '69px' }}
                      />
                      <a href="/category/skincare">
                      <span className="w3-large">Skincare</span>
                      </a>
                      <br />
                      <span>For Male and Female</span>
                    </li>
                    <li className="w3-padding-16">
                      <img
                        src="/images/s4.jpg"
                        alt="Image"
                        className="w3-left w3-margin-right w3-sepia"
                        style={{ width: '69px' }}
                      />
                      <a href="/category/safety-equipment-protective-gear">
                      <span className="w3-large">Safety Equipment</span>
                      </a>
                      <br />
                      <span>Quality Protection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* LAW EXPRESS */}
      <div className="w3-light-grey">
        <div>
          <div className="w3-content" style={{ maxWidth: '1600px' }}>
            <div className="w3-row w3-padding w3-border">
              <div className="w3-col l8 s12">
                <div className="w3-container w3-white w3-margin w3-padding-large">
                  <div className="w3-center">
                    <a href="/courier">
                    <h3>Courier Services</h3>
                    </a>
                  </div>
                  <div className="w3-justify">
                    <a href="/courier">
                    <img src="/images/courier.png" alt="Girl Hat" style={{ width: '100%' }} className="w3-padding-16" />
                    </a>
                    <p><strong>More Hats!</strong>I am crazy about hats these days. Some text about this blog entry. Fashion fashion and mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. </p>
                    <p className="w3-left">
                      <button className="w3-button w3-white w3-border" onClick={(e) => window.likeFunction(e.target)}>
                        <b><i className="fa fa-thumbs-up"></i> Like</b>
                      </button>
                    </p>
                    <div className="w3-clear"></div>
                    <div className="w3-row w3-margin-bottom" id="demo1" style={{ display: 'none' }}>
                      <hr />
                      <div className="w3-col l2 m3">
                        <img src="/w3images/avatar_smoke.jpg" style={{ width: '90px' }} alt="Avatar" />
                      </div>
                      <div className="w3-col l10 m9">
                        <h4>George <span className="w3-opacity w3-medium">May 3, 2015, 6:32 PM</span></h4>
                        <p>Great blog post! Following</p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w3-col l4">
                <div className="w3-white w3-margin">
                  <img src="/images/law.png" alt="Jane" style={{ width: '100%' }} className="w3-grayscale" />
                  <div className="w3-container w3-black">
                    <h4>Our courier service company provides fast, reliable, and secure delivery solutions tailored to meet personal and business needs. </h4>
                  </div>
                </div>
                <div className="w3-white w3-margin">
                  <div className="w3-container w3-padding w3-black">
                    <h4>Popular Deliveries</h4>
                  </div>
                  <ul className="w3-ul w3-hoverable w3-white">
                    <li className="w3-padding-16">
                      <img
                        src="/images/s5.jpg"
                        alt="Image"
                        className="w3-left w3-margin-right"
                        style={{ width: '80px' }}
                      />
                      <a href='/courier'>
                      <span className="w3-large">Documents</span>
                      <br />
                      </a>
                      <span>Invoices or school documents</span>
                    </li>
                    <li className="w3-padding-16">
                      <img
                        src="/images/s6.jpg"
                        alt="Image"
                        className="w3-left w3-margin-right"
                        style={{ width: '80px' }}
                      />
                      <a href='/courier'>
                      <span className="w3-large">Small Luggage</span>
                      </a>
                      <br />
                      <span>Bags or Boxes</span>
                    </li>
                    <li className="w3-padding-16">
                      <img
                        src="/images/s7.webp"
                        alt="Image"
                        className="w3-left w3-margin-right"
                        style={{ width: '68px' }}
                      />
                      <a href='/courier'>
                      <span className="w3-large">Big Parcels</span>
                      </a>
                      <br />
                      <span>Refrigirators or TV'S</span>
                    </li>

                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FOR HIRE */}
      <div className="w3-light-grey">
        <div>
          <div className="w3-content" style={{ maxWidth: '1600px' }}>
            {/* Blog content placeholder */}
            <div className="w3-row w3-padding w3-border">
              <div className="w3-col l8 s12">
                <div className="w3-container w3-white w3-margin w3-padding-large">
                  <div className="w3-center">
                    <a href="/hire-items">
                    <h3>Items for Hire</h3>
                    </a>
                  </div>
                  <div className="w3-justify">
                    <a href="/hire-items">
                    <img src="/images/forhire.png" alt="Girl Hat" style={{ width: '100%', height: '9%' }} className="w3-padding-16" />
                    </a>
                    <p><strong>More Hats!</strong>I am crazy about hats these days. Some text about this blog entry. Fashion fashion and mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl.</p>
                    <p className="w3-left">
                      <button className="w3-button w3-white w3-border" onClick={(e) => window.likeFunction(e.target)}>
                        <b><i className="fa fa-thumbs-up"></i> Like</b>
                      </button>
                    </p>
                    <div className="w3-clear"></div>
                    <div className="w3-row w3-margin-bottom" id="demo1" style={{ display: 'none' }}>
                      <hr />

                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w3-col l4">
                <div className="w3-white w3-margin">
                  <img src="/images/4H.png" alt="Jane" style={{ width: '100%' }} className="w3-grayscale" />
                  <div className="w3-container w3-black">
                    <h4>Whether you're planning a project or hosting an occasion, we provide flexible rental options at affordable rates. </h4>
                  </div>
                </div>
                <div className="w3-white w3-margin">
                  <div className="w3-container w3-padding w3-black">
                    <h4>Popular Products</h4>
                  </div>
                  <ul className="w3-ul w3-hoverable w3-white">
                    <li className="w3-padding-16">
                      <img
                        src="/images/s8.webp"
                        alt="Image"
                        className="w3-left w3-margin-right"
                        style={{ width: '63px' }}
                      />
                      <a href='/hire-items'>
                      <span className="w3-large">Skates</span>
                      </a>
                      <br />
                      <span>All Sizes Available</span>
                    </li>
                    <li className="w3-padding-16">
                      <img
                        src="/images/s9.jpeg"
                        alt="Image"
                        className="w3-left w3-margin-right"
                        style={{ width: '69px' }}
                      />
                      <a href='/hire-items'>
                      <span className="w3-large">Bikes</span>
                      </a>
                      <br />
                      <span>Bikes For Everyone</span>
                    </li>
                    <li className="w3-padding-16">
                      <img
                        src="/images/s10.png"
                        alt="Image"
                        className="w3-left w3-margin-right"
                        style={{ width: '65px' }}
                      />
                      <a href='/hire-items'>
                      <span className="w3-large">Tents</span>
                      </a>
                      <br />
                      <span>All Types in one place</span>
                    </li>
                    <li className="w3-padding-16">
                      <img
                        src="/images/s11.jpg"
                        alt="Image"
                        className="w3-left w3-margin-right w3-sepia"
                        style={{ width: '69px' }}
                      />
                      <a href='/hire-items'>
                      <span className="w3-large">Tractors</span>
                      </a>
                      <br />
                      <span>At An Affordable Rate</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
