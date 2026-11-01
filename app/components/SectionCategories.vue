<template>
  <section id="services" class="section categories-section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2 class="section-title">Explore All Categories</h2>
        <div class="divider mx-auto"></div>
      </div>

      <div class="grid grid-cols-4 categories-grid">
        <!-- Labels -->
        <div class="category-card">
          <div class="img-container">
            <img src="/images/cat_labels_new.jpg" alt="Labels" />
            <div class="overlay"></div>
          </div>
          <div class="category-content">
            <h4 class="category-title">Labels</h4>
          </div>
        </div>

        <!-- Books -->
        <div class="category-card">
          <div class="img-container">
            <img src="/images/cat_books_new.jpg" alt="Books" />
            <div class="overlay"></div>
          </div>
          <div class="category-content">
            <h4 class="category-title">Books</h4>
          </div>
        </div>

        <!-- Packaging -->
        <div class="category-card">
          <div class="img-container">
            <img src="/images/cat_packaging_new.jpg" alt="Packaging" />
            <div class="overlay"></div>
          </div>
          <div class="category-content">
            <h4 class="category-title">Packaging</h4>
          </div>
        </div>

        <!-- Posters -->
        <div class="category-card">
          <div class="img-container">
            <img src="/images/cat_posters_new.jpg" alt="Posters" />
            <div class="overlay"></div>
          </div>
          <div class="category-content">
            <h4 class="category-title">Posters</h4>
          </div>
        </div>
      </div>

      <div class="text-center mt-xl">
        <a href="#contact" class="btn btn-outline">Browse More</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.categories-section {
  background-color: var(--bg-dark);
}

.section-title {
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 700;
  margin-bottom: var(--space-md);
}

.divider {
  width: 60px;
  height: 3px;
  background-color: var(--color-primary);
  margin-left: auto;
  margin-right: auto;
}

.category-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 4/5;
}

.img-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
  transition: opacity var(--transition-normal);
}

.category-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: var(--space-lg);
  z-index: 2;
  transform: translateY(10px);
  transition: transform var(--transition-normal);
}

.category-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
}

.category-card:hover .img-container img {
  transform: scale(1.1);
}

.category-card:hover .category-content {
  transform: translateY(0);
}

.category-card:hover .category-title {
  color: var(--color-primary);
}
</style>
