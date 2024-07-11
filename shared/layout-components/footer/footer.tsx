import React from 'react'

const Footer = () => {
  return (
    // <!-- Footer Start -->
    <div className="footer mt-auto py-3 bg-white text-center">
      <div className="container">
        <div className="text-muted">
          <div className="col-md-12">
            <span>Copyright © {new Date().getFullYear()} <a href="#!" className="text-dark fw-semibold">Skooltym</a> Designed With <span className="bi bi-heart-fill text-danger"></span> by <a target='_blank' href="https://malticard.com"><span className="fw-semibold text-primary text-decoration-underline">Malticard</span></a> All rights reserved</span>
          </div>
        </div>
      </div>
    </div>
    // <!-- end footer -->
  )
}

export default Footer