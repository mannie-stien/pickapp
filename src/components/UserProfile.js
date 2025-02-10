import { useState, useEffect } from "react";
import { supabase } from "../firebase/supabaseClient"; // Import your Supabase client
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaImage, FaSpinner } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import Layout from "./Layout";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch user profile from Supabase
  const fetchProfile = async () => {
    setLoading(true);
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      toast.error("Error fetching user.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      toast.error("Error fetching profile.");
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Update profile in Supabase
  const updateProfile = async () => {
    setUpdating(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        username: profile.username,
        bio: profile.bio,
        location: profile.location,
        avatar_url: profile.avatar_url,
      })
      .eq("user_id", profile.user_id);

    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated successfully!");
    }
    setUpdating(false);
  };

const deleteAccount = async () => {
    console.log(profile)
  try {
    // Ensure correct user_id is being passed from the profile
    const { data, error } = await supabase.rpc('delete_user_and_profile', {
      user_id: profile.user_id, // Ensure this exists and is correct
    });

    if (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete account.");
      return;
    } else {
      console.log("User and profile deleted successfully");
      toast.success("Account deleted successfully.");
      navigate("/"); // Redirect to homepage
    }
  } catch (err) {
    console.error("Unexpected error:", err.message);
    toast.error("An unexpected error occurred.");
  }
};



  // Delete user account
//   const deleteAccount = async () => {
//     // Delete profile from "profiles" table
//     await supabase.from("profiles").delete().eq("user_id", profile.user_id);

//     // Delete user from Supabase auth
//     const { error } = await supabase.auth.admin.deleteUser(profile.user_id);
//     if (error) {
//       toast.error("Failed to delete account.");
//       console.log(error)
//       return;
//     }

//     toast.success("Account deleted successfully.");
//     navigate("/"); // Redirect to homepage
//   };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <FaSpinner className="spinner" size={32} />
      </div>
    );
  }

  return (
    <Layout>
    <div className="profile-container p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">User Profile</h2>

        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label">
            <FaUser className="me-2" /> Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={profile?.full_name || ""}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your full name"
          />
        </div>

        {/* Username */}
        <div className="mb-3">
          <label className="form-label">
            <FaEnvelope className="me-2" /> Username
          </label>
          <input
            type="text"
            name="username"
            value={profile?.username || ""}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your username"
          />
        </div>

        {/* Bio */}
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea
            name="bio"
            value={profile?.bio || ""}
            onChange={handleChange}
            className="form-control"
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label">
            <FaMapMarkerAlt className="me-2" /> Location
          </label>
          <input
            type="text"
            name="location"
            value={profile?.location || ""}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your location"
          />
        </div>

        {/* Avatar URL */}
        <div className="mb-4">
          <label className="form-label">
            <FaImage className="me-2" /> Avatar URL
          </label>
          <input
            type="text"
            name="avatar_url"
            value={profile?.avatar_url || ""}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter avatar URL"
          />
          {profile?.avatar_url && (
            <div className="mt-2">
              <img
                src={profile.avatar_url}
                alt="Avatar Preview"
                className="img-thumbnail"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          )}
        </div>

        {/* Update Profile Button */}
        <button
          onClick={updateProfile}
          disabled={updating}
          className="btn btn-primary w-100 mb-3"
        >
          {updating ? <FaSpinner className="spinner" /> : "Update Profile"}
        </button>

        {/* Delete Account Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="btn btn-danger w-100"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAccount}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </Layout>
  );
};

export default UserProfile;