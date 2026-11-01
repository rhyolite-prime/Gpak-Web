<template>
  <section id="contact" class="section contact-section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2 class="section-title">Contact Us</h2>
        <div class="divider mx-auto mb-lg"></div>
        <p class="text-muted mx-auto max-w-2xl">
          We'd love to discuss how we can bring your next project to life. For bespoke quotes or general inquiries, please reach out via contact details. Our team is ready to respond within one business day!
        </p>
      </div>

      <div class="grid grid-cols-3 contact-grid">
        <!-- Main Office -->
        <div class="contact-card glass text-center">
          <div class="icon-wrapper mx-auto">
            <img src="/images/535239-1ea32e23.png" alt="Office Icon" class="contact-icon" />
          </div>
          <h4 class="contact-title">Our Main Office</h4>
          <p class="text-muted">No.3 Graphic Road, P. O. Box GP 742, Accra, Ghana</p>
        </div>

        <!-- Call Us -->
        <div class="contact-card glass text-center">
          <div class="icon-wrapper mx-auto">
            <img src="/images/159832-fb20dbc6.png" alt="Phone Icon" class="contact-icon" />
          </div>
          <h4 class="contact-title">Call Us</h4>
          <p class="text-muted">0208 180381<br>0244 472358<br>0242 566771<br>0302 666052</p>
        </div>

        <!-- Email -->
        <div class="contact-card glass text-center">
          <div class="icon-wrapper mx-auto">
            <img src="/images/561127-70a8afb1.png" alt="Email Icon" class="contact-icon" />
          </div>
          <h4 class="contact-title">Email</h4>
          <p class="text-muted">
            <a href="mailto:info@gpak.com.gh">info@gpak.com.gh</a><br>
            <a href="mailto:sales@gpak.com.gh">sales@gpak.com.gh</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  background-color: var(--bg-dark);
}

.section-title {
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.divider {
  width: 60px;
  height: 3px;
  background-color: var(--color-primary);
}

.max-w-2xl {
  max-width: 42rem;
}

.contact-card {
  padding: var(--space-xl) var(--space-lg);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.contact-card:hover {
  transform: translateY(-5px);
  border-color: rgba(241, 197, 14, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(241, 197, 14, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-md);
}

.contact-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.contact-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.contact-card a {
  color: var(--color-text-muted);
}

.contact-card a:hover {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
