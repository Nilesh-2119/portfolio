import React from "react";

const Contact = () => (
  <section id="contact">
    <h2>Contact</h2>
    <form>
      <input type="text" placeholder="Your Name" required />
      <input type="email" placeholder="Your Email" required />
      <textarea placeholder="Message" required></textarea>
      <button type="submit">Send</button>
    </form>
  </section>
);

export default Contact;
