<template>
  <section class="section why-us-section">
    <div class="container">
      <div class="grid grid-cols-2 align-center">
        <div class="why-content">
          <h2 class="section-title">Why G-PAK Ltd</h2>
          <div class="divider mb-lg"></div>
          <p class="text-muted mb-md">
            We are a trusted and most preferred choice in commercial, book and packaging printing in Ghana. We have built our reputation through years of nurtured commitment to deliver on quality and on our promise to exceed customer expectation.
          </p>
          <p class="text-muted mb-lg">
            Our entire factory is monitored by CCTV and you are assured of the confidentiality of your work. This is further enhanced by a company attitude that encourages building strong bridges of beneficial relationship with our business partners, who are the reason for our continued existence.
          </p>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number text-primary">100%</span>
              <span class="stat-label">Confidentiality</span>
            </div>
            <div class="stat-item">
              <span class="stat-number text-primary">24/7</span>
              <span class="stat-label">Security Monitored</span>
            </div>
          </div>
        </div>
        <div class="why-image">
          <div class="img-wrapper glass">
            <!-- Using original strip image from GPAK site -->
            <img src="/images/GPAK-strip.jpg" alt="G-PAK Facility" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why-us-section {
  background-color: var(--bg-card);
}

.align-center {
  align-items: center;
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

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.img-wrapper {
  border-radius: var(--radius-lg);
  overflow: hidden;
  padding: 10px;
}

.img-wrapper img {
  width: 100%;
  height: auto;
  border-radius: calc(var(--radius-lg) - 5px);
  display: block;
}

@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}
</style>
