<template>
  <div class="site-header-wrap">
    <div class="utility-bar">
      <div class="container utility-inner">
        <span>Quality in every detail. Made in Ghana.</span>
        <div class="utility-links">
          <a href="tel:+233302666052">+233 (0) 302 666 052</a>
          <span class="utility-separator"></span>
          <a href="mailto:gpakltd@graphic.com.gh">gpakltd@graphic.com.gh</a>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container header-inner">
        <NuxtLink to="/" class="brand" aria-label="G-PAK Limited home" @click="closeMenu">
          <img src="/images/PHOTO-2025-04-23-19-12-494.jpg" alt="G-PAK LTD." />
        </NuxtLink>
        <nav class="main-nav" :class="{ 'nav-open': menuOpen }" aria-label="Main navigation">
          <NuxtLink to="/" @click="closeMenu">Home</NuxtLink>
          <NuxtLink to="/#about" @click="closeMenu">About us</NuxtLink>
          <NuxtLink to="/#services" @click="closeMenu">What we do</NuxtLink>
          <NuxtLink to="/#why-gpak" @click="closeMenu">Why G-PAK</NuxtLink>
          <NuxtLink to="/#contact" @click="closeMenu">Contact</NuxtLink>
          <NuxtLink to="/order" class="mobile-quote" @click="closeMenu">Request a quote <span aria-hidden="true">↗</span></NuxtLink>
        </nav>
        <NuxtLink to="/order" class="header-cta">Request a quote <span aria-hidden="true">↗</span></NuxtLink>
        <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-label="Toggle navigation" @click="menuOpen = !menuOpen">
          <span></span><span></span>
        </button>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuOpen = ref(false)
const closeMenu = () => { menuOpen.value = false }
</script>
