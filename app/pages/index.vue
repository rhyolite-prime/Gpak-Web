<script setup lang="ts">
useSeoMeta({
  title: 'G-PAK Limited | Printing & Packaging in Ghana',
  description: 'G-PAK Limited creates quality bookwork, commercial print, packaging and graphic design in Accra, Ghana. Bring your next idea to life with us.'
})

const services = [
  { number: '01', title: 'Bookwork', description: 'Textbooks, supplementary readers and directories, carefully produced from page to binding.', image: '/images/PHOTO-2025-04-23-19-12-50.jpg', alt: 'G-PAK printed textbooks and readers' },
  { number: '02', title: 'Commercial printing', description: 'Brochures, magazines, annual reports, stationery and more that make every message count.', image: '/images/PHOTO-2025-04-23-19-12-492.jpg', alt: 'G-PAK printed labels and commercial print samples' },
  { number: '03', title: 'Packaging & labels', description: 'Thoughtful light packaging and labels designed to protect your product and elevate your brand.', image: '/images/PHOTO-2025-04-23-19-12-502.jpg', alt: 'G-PAK printed packaging and cartons' },
  { number: '04', title: 'Graphic design', description: 'Distinctive visual communication that brings clarity, character and consistency to your ideas.', image: '/images/GPAK-flyer.jpg', alt: 'G-PAK graphic design and printed product samples' }
]
</script>

<template>
  <div>
    <AppHeader />
    <main>
      <HeroCarousel />

      <section id="about" class="intro-section section-space">
        <div class="container intro-grid">
          <div><p class="section-kicker"><span>01 / ABOUT G-PAK</span></p><h2 class="section-heading">More than print.<br /><em>A lasting impression.</em></h2></div>
          <div class="intro-right"><p class="intro-lead">We believe what you put into the world should be worth holding onto.</p><p>G-PAK Limited is a Ghanaian commercial printing and packaging company bringing together skilled production, creative thinking and a commitment to quality. From books and business essentials to packaging that stands out, we make every detail matter.</p><a class="inline-link" href="#why-gpak">Get to know us <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>

      <section id="services" class="services-section section-space">
        <div class="container">
          <div class="services-heading-row"><div><p class="section-kicker">02 / WHAT WE DO</p><h2 class="section-heading">Our expertise,<br /><em>your possibilities.</em></h2></div><p>One trusted partner for the work that brings your brand, story and products into the world.</p></div>
          <div class="services-grid">
            <article v-for="service in services" :key="service.number" class="service-card">
              <div class="service-image"><img :src="service.image" :alt="service.alt" loading="lazy" /></div>
              <div class="service-info"><div><span class="service-number">{{ service.number }} / SERVICE</span><h3>{{ service.title }}</h3><p>{{ service.description }}</p></div><NuxtLink to="/order" class="round-arrow" :aria-label="`Enquire about ${service.title}`">↗</NuxtLink></div>
            </article>
          </div>
        </div>
      </section>

      <section id="why-gpak" class="why-section">
        <div class="why-image"><img src="/images/Screenshot2025-04-30at1.23.36AM.png" alt="Printed materials coming off the production press" loading="lazy" /><div class="why-image-caption"><span>THE G-PAK APPROACH</span><span>CRAFTED WITH CARE →</span></div></div>
        <div class="why-content"><p class="section-kicker">03 / WHY G-PAK</p><h2 class="section-heading">Good work<br />is in the <em>details.</em></h2><p class="why-lead">Your project deserves more than just ink on paper. It deserves a partner who cares about the result as much as you do.</p><div class="why-points"><div><span>01</span><div><h3>Made around your brief</h3><p>Bespoke solutions shaped to fit your purpose, not the other way around.</p></div></div><div><span>02</span><div><h3>Quality from start to finish</h3><p>Careful attention at every stage, from design and production to the final finish.</p></div></div><div><span>03</span><div><h3>A partner you can count on</h3><p>Built on trust, confidentiality and lasting relationships with our clients.</p></div></div></div></div>
      </section>

      <section class="cta-section"><div class="container cta-inner"><div><p class="section-kicker">LET'S MAKE SOMETHING GREAT</p><h2>Have a project<br />in <em>mind?</em></h2></div><div class="cta-right"><p>Big idea or small detail, we'd love to hear what you're working on.</p><NuxtLink to="/order" class="button button-light">Request a quote <span aria-hidden="true">↗</span></NuxtLink></div><span class="cta-decoration" aria-hidden="true">✳</span></div></section>

      <section id="contact" class="contact-section section-space"><div class="container"><div class="contact-top"><div><p class="section-kicker">04 / GET IN TOUCH</p><h2 class="section-heading">Let's talk about<br /><em>what's next.</em></h2></div><p>Tell us about your next print or packaging project. We're here to help make it happen.</p></div><div class="contact-grid"><div class="contact-item"><span class="contact-label">01 / VISIT US</span><h3>Find us in Accra</h3><p>No. 3 Graphic Road<br />P. O. Box GP 742<br />Accra, Ghana</p></div><div class="contact-item"><span class="contact-label">02 / GIVE US A CALL</span><h3>Let's have a conversation</h3><a href="tel:+233302666052">+233 (0) 302 666 052 ↗</a><a href="tel:+233208180381">+233 (0) 208 180 381 ↗</a></div><div class="contact-item"><span class="contact-label">03 / SEND AN EMAIL</span><h3>Drop us a line</h3><a href="mailto:gpakltd@graphic.com.gh">gpakltd@graphic.com.gh ↗</a><a href="mailto:gpakltd@gmail.com">gpakltd@gmail.com ↗</a></div></div></div></section>
    </main>
    <AppFooter />
  </div>
</template>
