<template>
  <section class="hero-section">
    <div class="hero-bg">
      <img src="/images/PHOTO-2025-04-23-19-12-50.jpg" alt="Printing and Packaging Machinery" />
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container hero-content">
      <div class="hero-text animate-fade-in-up">
        <h1 class="hero-title">Premium <span class="text-primary">Printing</span> <br/>& Packaging</h1>
        <p class="hero-subtitle delay-100">Elevate your brand with our bespoke printing solutions and world-class packaging design.</p>
        <div class="hero-actions delay-200">
          <NuxtLink to="/order" class="btn btn-primary">Order Now</NuxtLink>
          <a href="#about" class="btn btn-outline" style="margin-left: 1rem;">Explore Services</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 80px; /* Offset for header */
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.7) 50%, rgba(13,13,13,0.3) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
}

.hero-text {
  max-width: 650px;
}

.hero-title {
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--space-md);
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-xl);
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .hero-overlay {
    background: linear-gradient(0deg, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.8) 50%, rgba(13,13,13,0.5) 100%);
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .hero-actions .btn {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
