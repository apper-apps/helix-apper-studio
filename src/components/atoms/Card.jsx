import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'elevated', 
  hover = true, 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseClasses = 'rounded-xl overflow-hidden transition-all duration-200';
  
  const variants = {
    elevated: 'bg-surface shadow-lg border border-slate-700',
    glass: 'glass-morphism',
    flat: 'bg-slate-800 border border-slate-700',
    gradient: 'bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20'
  };
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1' : '';
  
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${hoverClasses}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;