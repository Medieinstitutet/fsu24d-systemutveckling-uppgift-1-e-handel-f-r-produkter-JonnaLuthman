import "../styles/contactUs.css";

export const ContactUs = () => {
  return (
    <div>
      <section className="contact-section">
        <div className="contact-intro">
          <h2 className="contact-title">Get in Touch</h2>
          <p className="contact-description">
            If you have any questions or inquiries, feel free to reach out to us
            using the form below. We are here to help and will get back to you
            as soon as possible.
          </p>
        </div>

        <form className="contact-form">
          <div className="form-group-container">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name *
              </label>
              <input
                required
                id="name"
                name="name"
                className="form-input"
                placeholder="Your name"
                type="text"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                required
                id="email"
                name="email"
                className="form-input"
                placeholder="Your email"
                type="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone *
              </label>
              <input
                required
                id="phone"
                name="phone"
                className="form-input"
                placeholder="Phone"
                type="text"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Message *
              </label>
              <textarea
                required
                className="form-textarea"
                id="message"
                name="message"
                placeholder="Your message"
              ></textarea>
            </div>
          </div>
          <button className="form-submit">Send Message</button>
        </form>
      </section>
    </div>
  );
};
