import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl focus:ring-primary',
    secondary: 'bg-surface border border-slate-600 hover:border-slate-500 text-slate-200 hover:text-white hover:bg-slate-700 focus:ring-slate-500',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800 focus:ring-slate-500',
    danger: 'bg-gradient-to-r from-error to-red-600 hover:from-error/90 hover:to-red-600/90 text-white shadow-lg hover:shadow-xl focus:ring-error',
    accent: 'bg-gradient-to-r from-accent to-pink-600 hover:from-accent/90 hover:to-pink-600/90 text-white shadow-lg hover:shadow-xl focus:ring-accent'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? disabledClasses : ''}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;