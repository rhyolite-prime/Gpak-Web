<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <NuxtLink to="/" class="logo">
            <img src="/images/PHOTO-2025-04-23-19-12-494.jpg" alt="G-PAK LTD" class="logo-img" />
          </NuxtLink>
          <p class="text-muted mt-md">Premium printing and packaging solutions tailored for your business needs.</p>
        </div>
        
        <div class="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-contact">
          <h3>Contact</h3>
          <p class="text-muted">No.3 Graphic Road, P. O. Box GP 742, Accra, Ghana</p>
          <p class="text-muted mt-sm">info@gpak.com.gh</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="text-muted text-sm">&copy; {{ new Date().getFullYear() }} G-PAK Limited. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #050505;
  padding: var(--space-2xl) 0 0 0;
  border-top: 1px solid var(--color-border);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-2xl);
  margin-bottom: var(--space-xl);
}

.logo {
  font-size: 1.8rem;
  font-weight: 800;
  display: flex;
  align-items: center;
}

.logo-img {
  max-height: 50px;
  width: auto;
  border-radius: 6px;
}

.footer-links h3, .footer-contact h3 {
  font-size: 1.2rem;
  margin-bottom: var(--space-md);
  color: #fff;
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--space-sm);
}

.footer-links a {
  color: var(--color-text-muted);
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: var(--space-lg) 0;
  text-align: center;
}

.text-sm {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
}
</style>
