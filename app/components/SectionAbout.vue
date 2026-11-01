<template>
  <section id="about" class="section about-section">
    <div class="container">
      <div class="about-header text-center mb-xl">
        <h5 class="text-primary subtitle">About Us</h5>
        <h2 class="section-title">Need Amazing Printing & Packaging?</h2>
        <p class="section-desc mx-auto text-muted">
          We have three main product lines which are Bookwork, Commercial printing and Light packaging. We offer bespoke products to our clients. Some of our products include Textbooks, supplementary readers, directories, brochures, magazines, newsletters, leaflets, stationery, folders, newspapers, annual reports, calendars, labels and skillets.
        </p>
      </div>

      <div class="grid grid-cols-4 services-grid">
        <!-- Bookwork -->
        <div class="service-card glass">
          <div class="icon-wrapper">
            <img src="/images/29302-1d13fdd6.png" alt="Bookwork Icon" class="service-icon" />
          </div>
          <h4 class="service-title">Bookwork</h4>
          <p class="text-muted service-desc">Crafting high-quality, bespoke textbooks, directories, and readers with precision from typesetting through binding.</p>
        </div>

        <!-- Packaging -->
        <div class="service-card glass">
          <div class="icon-wrapper">
            <img src="/images/1370329-2e761276.png" alt="Packaging Icon" class="service-icon" />
          </div>
          <h4 class="service-title">Packaging</h4>
          <p class="text-muted service-desc">Providing custom polypropylene labels and lightweight sleeves that protect and promote your products with style.</p>
        </div>

        <!-- Commercial Printing -->
        <div class="service-card glass">
          <div class="icon-wrapper">
            <img src="/images/3022251-02668111.png" alt="Commercial Printing Icon" class="service-icon" />
          </div>
          <h4 class="service-title">Commercial Printing</h4>
          <p class="text-muted service-desc">Delivering vibrant brochures, magazines, annual reports, calendars and newspapers at any scale with rapid turnaround.</p>
        </div>

        <!-- Graphic Design -->
        <div class="service-card glass">
          <div class="icon-wrapper">
            <img src="/images/2554812-c5e08fa0.png" alt="Graphic Design Icon" class="service-icon" />
          </div>
          <h4 class="service-title">Graphic Design</h4>
          <p class="text-muted service-desc">Creating cohesive, on-brand visuals from logos to leaflets and stationery that captivate your audience.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  background-color: var(--bg-card);
  position: relative;
}

.subtitle {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.section-title {
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 700;
  margin-bottom: var(--space-md);
}

.section-desc {
  max-width: 800px;
  font-size: 1.1rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.service-card {
  padding: var(--space-xl) var(--space-lg);
  border-radius: var(--radius-lg);
  text-align: left;
  transition: all var(--transition-normal);
  background: rgba(26, 26, 26, 0.4);
}

.service-card:hover {
  transform: translateY(-10px);
  background: rgba(26, 26, 26, 0.8);
  border-color: rgba(241, 197, 14, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
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
  transition: transform var(--transition-normal);
}

.service-card:hover .icon-wrapper {
  transform: scale(1.1);
  background: rgba(241, 197, 14, 0.2);
}

.service-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.service-desc {
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
