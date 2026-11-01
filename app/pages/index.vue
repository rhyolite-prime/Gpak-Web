<template>
  <div>
    <AppHeader />
    <main>
      <SectionHero />
      <SectionAbout />
      <SectionCategories />
      <SectionWhyUs />
      
      <!-- CTA Banner -->
      <section class="cta-banner text-center py-xl glass-dark">
        <div class="container">
          <h2>We Deliver to your door step</h2>
          <NuxtLink to="/order" class="btn btn-primary mt-md">Order Now</NuxtLink>
        </div>
      </section>

      <SectionContact />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.cta-banner {
  background-color: var(--bg-card);
  padding: var(--space-xl) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.cta-banner h2 {
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 700;
  margin-bottom: var(--space-md);
}

.glass-dark {
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(10px);
}
</style>
