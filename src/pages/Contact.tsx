import React from 'react';

const Contact: React.FC = () => (
  <div className="container mx-auto p-8">
    <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
    <form className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow space-y-4">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input type="text" className="input input-bordered w-full" placeholder="Your Name" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input type="email" className="input input-bordered w-full" placeholder="you@example.com" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Message</label>
        <textarea className="textarea textarea-bordered w-full" rows={4} placeholder="How can we help?" />
      </div>
      <button type="submit" className="btn btn-primary w-full">Send Message</button>
    </form>
  </div>
);

export default Contact; 