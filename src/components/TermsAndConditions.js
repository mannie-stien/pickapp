import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap"; // Assuming you're using React-Bootstrap for modals
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Check if the user has already accepted the terms
  useEffect(() => {
    const acceptedTerms = localStorage.getItem("acceptedTerms");
    if (!acceptedTerms) {
      setShowModal(true); // Show modal if terms are not accepted
    }
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem("acceptedTerms", "true"); // Set flag in localStorage
    setShowModal(false); // Close the modal
    navigate("/"); // Redirect to home or another route after acceptance
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Terms and Conditions</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <h5>Welcome to PickApp</h5>
        <p>
          By accessing or using our website and mobile application (the "App"), you agree to comply with and be bound by these Terms and Conditions ("Terms"). Please read these Terms carefully before using our services.
        </p>

        <h6>1. Acceptance of Terms</h6>
        <p>
          By using PickApp, you agree to these Terms and Conditions. If you do not agree with any part of these Terms, you must not use the App.
        </p>

        <h6>2. Eligibility</h6>
        <p>
          You must be at least 13 years old to use the App. If you are under the age of 18, you must have the consent of a parent or guardian to use our services.
        </p>

        <h6>3. Account Registration</h6>
        <p>
          To use certain features of the App, you may be required to create an account. You agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information during the registration process.</li>
          <li>Maintain the confidentiality of your login credentials.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
        </ul>
        <p>You are responsible for all activities that occur under your account.</p>

        <h6>4. Use of the App</h6>
        <p>
          You agree to use the App in compliance with applicable laws and regulations. You may not use the App to:
        </p>
        <ul>
          <li>Engage in illegal activities.</li>
          <li>Upload or share content that is offensive, harmful, or violates the rights of others.</li>
          <li>Interfere with the proper functioning of the App or access the App through unauthorized means.</li>
          <li>Use automated systems or scripts to access or interact with the App.</li>
        </ul>

        <h6>5. User-Generated Content</h6>
        <p>
          You may have the opportunity to submit, post, or share content (such as game information, profile details, etc.) on the App. You retain ownership of your content, but you grant us a non-exclusive, royalty-free license to use, modify, and distribute the content in connection with the App’s operation.
        </p>
        <p>You are solely responsible for the content you share, and by submitting content, you confirm that you have all necessary rights to do so.</p>

        <h6>6. Privacy</h6>
        <p>
          Your privacy is important to us. Please review our <a href="/privacy-policy">Privacy Policy</a>, which explains how we collect, use, and protect your personal information.
        </p>

        <h6>7. Events and Scheduling</h6>
        <p>
          PickApp allows users to create and join sports activities and events. When using this feature, you agree to:
        </p>
        <ul>
          <li>Follow any specific rules or guidelines set for each activity.</li>
          <li>Respect other users’ participation and interactions.</li>
          <li>Not engage in any behavior that disrupts or harms the event or other users.</li>
        </ul>

        <h6>8. Payment and Fees</h6>
        <p>
          Some features of the App may require payment, such as event registration fees. By using these services, you agree to pay the specified fees. Payments will be processed by our third-party payment processors, and any transactions are subject to their terms.
        </p>

        <h6>9. Disclaimer of Warranties</h6>
        <p>
          The App is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to the accuracy, completeness, or fitness for a particular purpose of the App’s content. We do not guarantee that the App will be error-free or available at all times.
        </p>

        <h6>10. Limitation of Liability</h6>
        <p>
          To the fullest extent permitted by law, PickApp is not liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the App, including but not limited to loss of data, profits, or reputation.
        </p>

        <h6>11. Indemnification</h6>
        <p>
          You agree to indemnify and hold PickApp and its affiliates, employees, and partners harmless from any claims, losses, or damages arising from your use of the App, violation of these Terms, or infringement of any third-party rights.
        </p>

        <h6>12. Modifications to the Terms</h6>
        <p>
          We reserve the right to modify these Terms at any time. Any changes will be posted on this page with the updated date. By continuing to use the App after any modifications, you agree to be bound by the revised Terms.
        </p>

        <h6>13. Termination</h6>
        <p>
          We may suspend or terminate your access to the App at our discretion, without notice, if you violate these Terms or engage in any harmful activities. Upon termination, your right to use the App will immediately cease.
        </p>

        <h6>14. Governing Law</h6>
        {/* <p>
          These Terms are governed by and construed in accordance with the laws of [Your Country or State]. Any disputes arising from these Terms shall be resolved in the competent courts of [Your Jurisdiction].
        </p> */}

        <h6>15. Contact Us</h6>
        <p>
          If you have any questions or concerns about these Terms, please contact us at:
        </p>
        <p>
          <strong>PickApp Support</strong><br />
          Email: <a href="mailto:support@pickapp.com">support@pickapp.com</a><br />
          Website: <a href="https://www.pickapp.com">https://www.pickapp.com</a>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAcceptTerms}>
          Accept
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TermsAndConditions;