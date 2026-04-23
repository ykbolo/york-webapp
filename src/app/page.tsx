import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div 
          className={styles.heroBg} 
          style={{ backgroundImage: 'url("/hero-bg.png")' }}
        />
        <div className="animate-fade-in">
          <h1 className={styles.title}>York's Digital Space</h1>
          <p className={styles.subtitle}>
            Crafting premium digital experiences with modern web technologies. 
            Full-stack developer, designer, and tech enthusiast.
          </p>
          <div className={styles.ctaGrid}>
            <a href="#projects" className={styles.btnPrimary}>View Projects</a>
            <a href="#contact" className={styles.btnSecondary}>Get in Touch</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.section}>
        <div className="glass animate-fade-in" style={{ padding: '3rem', borderRadius: '32px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>About Me</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '800px' }}>
            I am a passionate developer focused on building scalable, performant, and beautiful 
            web applications. With expertise in Next.js, React, and cloud architecture, 
            I bridge the gap between design and technology to create products that people love to use.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={styles.section}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Selected Projects</h2>
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.card}>
              <div style={{ 
                height: '200px', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '16px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Project Preview {i}</span>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Project Title {i}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                A brief description of the project and the technologies used in its development.
              </p>
              <a href="#" style={{ color: 'var(--primary)', fontWeight: '600' }}>Learn More →</a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.section} style={{ marginBottom: '4rem' }}>
        <div className="glass" style={{ padding: '4rem', borderRadius: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Let's Build Something Together</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.2rem' }}>
            Currently open to new opportunities and collaborations.
          </p>
          <a href="mailto:hello@york.dev" className={styles.btnPrimary}>
            Start a Conversation
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', borderTop: '1px solid var(--card-border)', width: '100%', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>© {new Date().getFullYear()} York. Built with Next.js & Passion.</p>
      </footer>
    </main>
  );
}
