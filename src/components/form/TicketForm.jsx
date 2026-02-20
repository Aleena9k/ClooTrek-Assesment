import { useState } from "react";
import api from "../../api";
import "./TicketForm.css";

function TicketForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 LLM CLASSIFICATION CALL
  const classifyTicket = async (desc) => {
    if (!desc || desc.trim().length < 10) return;

    try {
      setLoading(true);

      const res = await api.post("/tickets/classify/", {
        description: desc,
      });

      if (res.data?.suggested_category) {
        setFormData((prev) => ({
          ...prev,
          category: res.data.suggested_category,
          priority: res.data.suggested_priority,
        }));
      }
    } catch (err) {
      console.error("LLM classify failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionBlur = () => {
    classifyTicket(formData.description);
  };

  // 🔥 SUBMIT TICKET API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/tickets/", formData);

      alert("Ticket submitted successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
      });
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ticket-page">
      <h2 className="page-title">Submit New Support Ticket</h2>

      <form className="ticket-card" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <div className="label-row">
            <label>Title</label>
            <span className="char-count">
              {formData.title.length} / 200
            </span>
          </div>
          <input
            type="text"
            name="title"
            placeholder="What can we help you with?"
            value={formData.title}
            onChange={handleChange}
            maxLength={200}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Please provide details about the issue you are experiencing..."
            rows="6"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleDescriptionBlur}
            required
          ></textarea>
          {loading && <small>Analyzing issue...</small>}
        </div>

        {/* Category & Priority */}
        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="general">General</option>
            </select>
            <small className="helper-text">
              Auto-suggested based on text
            </small>
          </div>

          <div className="form-group">
            <label>Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <small className="helper-text">Estimated severity</small>
          </div>
        </div>

        {/* Footer */}
        <div className="form-footer">
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Ticket →"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TicketForm;
