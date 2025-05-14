import React from 'react';
import { BadgeDollarSign, Star, Briefcase } from 'lucide-react';

const plans = [
  {
    icon: <BadgeDollarSign className="w-8 h-8 text-primary mb-2" />, 
    title: 'Free',
    price: '$0',
    description: 'Basic access to interview features',
    features: [
      'Practice interviews',
      'Limited analytics',
      'Access to coding problems',
    ],
    highlight: false,
    button: 'Get Started',
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-500 mb-2" />, 
    title: 'Pro',
    price: '$19/mo',
    description: 'Advanced analytics and unlimited interviews',
    features: [
      'Unlimited interviews',
      'Advanced analytics',
      'Priority support',
      'System design rounds',
    ],
    highlight: true,
    button: 'Upgrade',
  },
  {
    icon: <Briefcase className="w-8 h-8 text-primary mb-2" />, 
    title: 'Enterprise',
    price: 'Contact Us',
    description: 'Custom solutions for teams',
    features: [
      'Team management',
      'Custom integrations',
      'Dedicated support',
      'Onboarding & training',
    ],
    highlight: false,
    button: 'Contact Sales',
  },
];

const Pricing: React.FC = () => (
  <div className="container mx-auto p-8">
    <h1 className="text-4xl font-bold mb-4 text-center">Pricing Plans</h1>
    <p className="text-lg text-center mb-10 text-base-content/70 max-w-2xl mx-auto">
      Choose the plan that fits your needs. Start for free, or unlock advanced features with Pro or Enterprise.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan, idx) => (
        <div
          key={idx}
          className={`p-8 rounded-xl shadow flex flex-col items-center bg-base-200 relative border-2 transition-all ${plan.highlight ? 'border-primary scale-105 z-10' : 'border-transparent'}`}
        >
          {plan.highlight && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-content px-4 py-1 rounded-full text-xs font-semibold shadow">Most Popular</span>
          )}
          {plan.icon}
          <h2 className="text-2xl font-semibold mb-1">{plan.title}</h2>
          <div className="text-3xl font-bold mb-2">{plan.price}</div>
          <p className="mb-4 text-base-content/80 text-center">{plan.description}</p>
          <ul className="mb-6 w-full space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button className={`btn btn-primary btn-sm w-full ${plan.highlight ? '' : 'btn-outline'}`}>{plan.button}</button>
        </div>
      ))}
    </div>
  </div>
);

export default Pricing; 