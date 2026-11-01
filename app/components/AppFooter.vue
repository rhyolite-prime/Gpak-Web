<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-intro">
          <NuxtLink to="/" class="footer-wordmark" aria-label="G-PAK Limited home">G-PAK<span>.</span></NuxtLink>
          <p>Thoughtfully printed.<br />Made to leave an impression.</p>
        </div>
        <div class="footer-column">
          <h3>Explore</h3>
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/#about">About us</NuxtLink>
          <NuxtLink to="/#services">Our services</NuxtLink>
          <NuxtLink to="/order">Request a quote</NuxtLink>
        </div>
        <div class="footer-column">
          <h3>Get in touch</h3>
          <a href="tel:+233302666052">+233 (0) 302 666 052</a>
          <a href="mailto:gpakltd@graphic.com.gh">gpakltd@graphic.com.gh</a>
          <p>No. 3 Graphic Road<br />Accra, Ghana</p>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} G-PAK Limited. All rights reserved.</span>
        <span>Printing possibilities in Accra, Ghana.</span>
      </div>
    </div>
  </footer>
</template>
