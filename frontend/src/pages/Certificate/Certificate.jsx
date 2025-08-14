import React from 'react';
import './Certificate.css';

const Certificate = ({ certificateData, onClose, onDownload }) => {
  if (!certificateData) return null;

  return (
    <div className="certificate-modal-overlay">
      <div className="certificate-container">
        <button className="certificate-close-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="certificate-header">
          <h1>CERTIFICATE OF PARTICIPATION</h1>
          <div className="certificate-border"></div>
        </div>
        
        <div className="certificate-body">
          <p className="certificate-text">This is to certify that</p>
          <h2 className="student-name">{certificateData.student_name}</h2>
          <p className="enrollment">Enrollment No: {certificateData.enrollment_number}</p>
          
          <div className="participation-details">
            <p>has successfully participated in</p>
            <h3 className="event-name">{certificateData.event_name}</h3>
            <p>held on {new Date(certificateData.event_date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <div className="certificate-footer">
            <div className="signature">
              <h10><strong>BPIT</strong></h10>
              <div className="signature-line"></div>
              <p>Authorized Signature</p>
            </div>
            <div className="certificate-id">
              <p>Certificate ID: {certificateData.certificate_id}</p>
              <p>Issued on: {new Date(certificateData.issued_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div className="certificate-actions">
          {/* <button className="download-btn" onClick={onDownload}>
            Download Certificate
          </button> */}
          <button className="print-btn" onClick={() => window.print()}>
            Print Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;