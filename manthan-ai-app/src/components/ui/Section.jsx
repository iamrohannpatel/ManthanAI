export default function Section({ className = '', children, padded = true }) {
  return (
    <section className={`${padded ? 'py-10 md:py-14' : ''} ${className}`}>
      {children}
    </section>
  )}
