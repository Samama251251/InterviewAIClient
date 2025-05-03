import { Link } from "react-router-dom";
import { Terminal } from 'lucide-react';

// SVG icons for social media (not deprecated, using current brand SVGs)
const TwitterIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <title>Twitter</title>
    <path d="M22.46 5.924c-.793.352-1.646.59-2.542.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082 4.48 4.48 0 0 0-7.635 4.085A12.72 12.72 0 0 1 3.11 4.86a4.48 4.48 0 0 0 1.387 5.976 4.44 4.44 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.593 4.393 4.5 4.5 0 0 1-2.025.077 4.48 4.48 0 0 0 4.184 3.11A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.77 0-.195-.004-.39-.013-.583A9.1 9.1 0 0 0 24 4.59a8.93 8.93 0 0 1-2.54.697z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <title>YouTube</title>
    <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.19 3.5 12 3.5 12 3.5s-7.19 0-9.391.566A2.994 2.994 0 0 0 .502 6.186C0 8.39 0 12 0 12s0 3.61.502 5.814a2.994 2.994 0 0 0 2.107 2.12C4.81 20.5 12 20.5 12 20.5s7.19 0 9.391-.566a2.994 2.994 0 0 0 2.107-2.12C24 15.61 24 12 24 12s0-3.61-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <title>Facebook</title>
    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <title>LinkedIn</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.025-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.358V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.37-1.849 3.602 0 4.267 2.369 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z"/>
  </svg>
);

export function Footer() {
  // Social media components with their respective icons
  const socialLinks = [
    { name: 'Twitter', icon: <TwitterIcon /> },
    { name: 'YouTube', icon: <YoutubeIcon /> },
    { name: 'Facebook', icon: <FacebookIcon /> },
    { name: 'LinkedIn', icon: <LinkedinIcon /> }
  ];

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="footer py-14 container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 px-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          {/* Updated logo to match header */}
          <Link to="/" className="flex items-center mb-6">
            <Terminal className="h-6 w-6 text-primary mr-2" />
            <span className="text-2xl font-bold">Interview<span className="text-primary">AI</span></span>
          </Link>
          <p className="max-w-xs text-neutral-content/80 mb-6">
            Automating technical interviews to make hiring faster, fairer, and more efficient.
          </p>
          {/* Social Links - Using primary color for consistency */}
          <div className="flex space-x-4">
            {socialLinks.map((social, i) => (
              <a 
                key={i} 
                className="btn btn-circle btn-sm btn-outline border-neutral-content/30 hover:bg-primary hover:border-primary"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <nav> 
          <h6 className="footer-title text-lg font-semibold mb-4 opacity-90">Company</h6>
          <ul className="space-y-3">
            <li><a className="link link-hover transition-all hover:text-primary">About us</a></li>
            <li><a className="link link-hover transition-all hover:text-primary">Contact</a></li>
            <li><a className="link link-hover transition-all hover:text-primary">Careers</a></li>
            <li><a className="link link-hover transition-all hover:text-primary">Press kit</a></li>
          </ul>
        </nav>

        <nav>
          <h6 className="footer-title text-lg font-semibold mb-4 opacity-90">Product</h6>
          <ul className="space-y-3">
            <li><a className="link link-hover transition-all hover:text-primary">Features</a></li>
            <li><a className="link link-hover transition-all hover:text-primary">Pricing</a></li>
            <li><a className="link link-hover transition-all hover:text-primary">Demo</a></li>
            <li><a className="link link-hover transition-all hover:text-primary">Integrations</a></li>
          </ul>
        </nav>

        <nav>
          <h6 className="footer-title text-lg font-semibold mb-4 opacity-90">Legal</h6>
          <ul className="space-y-3">
            <li><a className="link link-hover transition-all hover:text-primary">Terms of use</a></li>
            <li><a className="link link-hover transition-all hover:text-primary">Privacy policy</a></li>
            <li><a className="link link-hover transition-all hover:text-primary">Cookie policy</a></li>
          </ul>
        </nav>
      </div>

      <div className="bg-neutral-focus text-neutral-content/70">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} InterviewAI · All rights reserved.</p>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <a className="hover:text-primary transition-colors">Accessibility</a>
            <a className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 