import './Icon.css';

export default function Icon({ name, className = '', title }) {
  return (
    <span
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      className={`material-symbols-rounded app-icon ${className}`.trim()}
    >
      {name}
    </span>
  );
}
