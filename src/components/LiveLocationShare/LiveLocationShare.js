import React from "react";

const LiveLocationShare = () => {
    return (
      <>
        <div className="vertical-menu live-sharing-map">
            <div data-simplebar="init" className="h-100">
                <div to="" className="logo logo-dark">
                    <span className="logo-sm">
                        <a href="/"><img src="/assets/images/live-logo.png" alt="logo-sm" height="35"/></a> 
                    </span>
                    <span className="logo-lg">
                        <a href="/"><img src="/assets/images/live-logo.png" alt="logo-dark" height="35"/></a>
                    </span>
                </div>
                <div className="refresh-tag-btnn">
                    <a href="/"><i className="ri-send-plane-fill"></i> ABC Trans Inc</a>
                    <button type="button" className="btn btn border border-color d-block  mx-2"><i className="ti ti-refresh"></i></button>
                </div>
                <div className="driver-vech-detail">
                    <p className="heading-details">Vehicle Number<strong>7000</strong></p>
                    <p className="heading-details">Driver Name<strong>Corey Goodman</strong></p>
                    <p className="heading-details">Phone Number<strong>+1 (000) 000-0000</strong></p>
                    <p className="heading-details">Trailer Number<strong>LR048965</strong></p>
                    <p className="heading-details">Shipping Document<strong>BOL-23SDGBHJ23</strong></p>
                    <p className="heading-details">Current Location<strong>2mi NE from Pittsburg, PA</strong></p>
                    <p className="heading-details">Time<strong>Jan 15, 2022 - 03:35:14 PM EDT</strong></p>
                </div>
            </div>
        </div>
        <div className="live-map-frame">
        <iframe title="drivermap" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26371286.49766774!2d-113.7164386566357!3d36.21152009978547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sin!4v1653560499738!5m2!1sen!2sin" width="100%" height="100%" style={{ "border": 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </>
    );
}

export default LiveLocationShare;