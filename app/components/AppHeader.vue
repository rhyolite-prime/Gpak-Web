<template>
  <header class="app-header glass" :class="{ 'scrolled': isScrolled }">
    <div class="container header-content">
      <NuxtLink to="/" class="logo">
        <img src="/images/PHOTO-2025-04-23-19-12-494.jpg" alt="G-PAK LTD" class="logo-img" />
      </NuxtLink>
      
      <nav class="desktop-nav">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <a href="#about" class="nav-link">About</a>
        <a href="#services" class="nav-link">Services</a>
        <a href="#contact" class="nav-link">Contact</a>
      </nav>

      <div class="header-actions">
        <NuxtLink to="/order" class="btn btn-outline">Place an Order</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1.5rem 0;
  transition: all var(--transition-normal);
}

.app-header.scrolled {
  padding: 1rem 0;
  background: rgba(13, 13, 13, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}

.logo-img {
  max-height: 40px;
  width: auto;
  border-radius: 4px;
}

.desktop-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-weight: 500;
  font-size: 1rem;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--color-primary);
  transition: width var(--transition-normal);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
}
</style>
