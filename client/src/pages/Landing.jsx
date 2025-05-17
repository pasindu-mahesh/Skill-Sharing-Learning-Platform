import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 hero-gradient">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Showcase Your <span className="gradient-text">Photography</span> to the World
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-muted-foreground"
              >
                A community built for photographers to share their work, get inspired, and connect with clients around the globe.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start"
              >
                <Link to="/signup">
                  <Button size="lg" className="rounded-full">Get Started</Button>
                </Link>
                <Link to="/explore">
                  <Button size="lg" variant="outline" className="rounded-full">Explore Photos</Button>
                </Link>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full md:w-1/2 grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60"
                  alt="Photography showcase" 
                  className="w-full h-40 md:h-48 lg:h-64 object-cover rounded-lg shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1554080353-321e452ccf19?w=500&auto=format&fit=crop&q=60" 
                  alt="Photography showcase" 
                  className="w-full h-32 md:h-48 object-cover rounded-lg shadow-lg" 
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src="https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=500&auto=format&fit=crop&q=60" 
                  alt="Photography showcase" 
                  className="w-full h-32 md:h-48 object-cover rounded-lg shadow-lg" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60" 
                  alt="Photography showcase" 
                  className="w-full h-40 md:h-48 lg:h-64 object-cover rounded-lg shadow-lg" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Photographers Love Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-lg p-6 shadow-md"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Hear From Our Community
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-lg p-6 shadow-md border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/20">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">{testimonial.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Showcase Your Work?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of photographers who are sharing their passion and growing their audience every day.
          </p>
          <Link to="/signup">
            <Button size="lg" className="rounded-full">Sign Up Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-secondary mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center">
                <h1 className="text-xl font-bold gradient-text">Photogram</h1>
              </Link>
              <p className="text-muted-foreground mt-2">Showcase your photography to the world</p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div>
                <h3 className="font-semibold mb-2">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                  <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                  <li><Link to="/press" className="text-muted-foreground hover:text-primary transition-colors">Press</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                  <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
                  <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center md:text-left text-muted-foreground text-sm">
            © {new Date().getFullYear()} Photogram. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature data
const features = [
  {
    title: "Showcase Your Work",
    description: "Create stunning portfolios to display your photography in an elegant, customizable format.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
  },
  {
    title: "Connect with Clients",
    description: "Build your audience and connect with potential clients who are looking for your unique style.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  },
  {
    title: "Grow Your Skills",
    description: "Learn from a community of photographers through feedback, collaborations and challenges.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path><path d="m14.5 17.5 2.5 2.5"></path></svg>
  }
];

// Testimonial data
const testimonials = [
  {
    name: "Alex Morgan",
    role: "Wildlife Photographer",
    quote: "Photogram helped me reach clients I never thought possible. My photography business has grown 3x since joining!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Sarah Lee",
    role: "Portrait Photographer",
    quote: "The community feedback has improved my skills tremendously. Plus, I've landed several major clients through my profile.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "David Chen",
    role: "Landscape Photographer",
    quote: "The focused platform for photographers makes it easy to showcase my work in a professional way that social media can't match.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60"
  }
];

export default Landing;