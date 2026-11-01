<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const slides = [
  {
    service: 'Commercial printing', shortLabel: 'Commercial',
    heading: 'Print that makes', emphasis: 'an impression.',
    description: 'From brochures and magazines to annual reports and stationery, we make every message feel considered.',
    image: '/images/ghana-print-team.jpg',
    alt: 'Illustrative image of Ghanaian print professionals reviewing a printed sheet',
    imageNote: 'ILLUSTRATIVE IMAGE',
    theme: 'photo'
  },
  {
    service: 'Bookwork', shortLabel: 'Bookwork',
    heading: 'Stories made', emphasis: 'to last.',
    description: 'Bring your words to life with beautifully produced textbooks, readers and directories, made with care from page to binding.',
    image: '/images/PHOTO-2025-04-23-19-12-50.jpg',
    alt: 'G-PAK textbooks and supplementary readers',
    imageNote: 'G-PAK BOOKWORK',
    theme: 'product'
  },
  {
    service: 'Packaging & labels', shortLabel: 'Packaging',
    heading: 'Packaging with', emphasis: 'purpose.',
    description: 'Give your products a standout first impression with considered light packaging and labels made for your brand.',
    image: '/images/PHOTO-2025-04-23-19-12-502.jpg',
    alt: 'G-PAK printed packaging and cartons',
    imageNote: 'G-PAK PACKAGING',
    theme: 'product'
  },
  {
    service: 'Graphic design', shortLabel: 'Design',
    heading: 'Ideas with', emphasis: 'impact.',
    description: 'Turn your vision into confident, cohesive visuals that connect with your audience before the first page is printed.',
    image: '/images/GPAK-flyer.jpg',
    alt: 'G-PAK design and print samples',
    imageNote: 'G-PAK DESIGN',
    theme: 'product'
  }
] as const

const activeIndex = ref(0)
const activeSlide = computed(() => slides[activeIndex.value]!)
const isPlaying = ref(true)
const isVisible = ref(true)
const prefersReducedMotion = ref(false)
const announcement = ref('')
let timer: ReturnType<typeof setInterval> | undefined

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = undefined
}
function syncTimer() {
  stopTimer()
  if (isPlaying.value && isVisible.value) {
    timer = setInterval(() => changeSlide(activeIndex.value + 1, false), 5500)
  }
}
function changeSlide(index: number, announce = true) {
  activeIndex.value = (index + slides.length) % slides.length
  if (announce) announcement.value = `${activeSlide.value.service}, slide ${activeIndex.value + 1} of ${slides.length}`
  syncTimer()
}
function togglePlayback() {
  isPlaying.value = !isPlaying.value
  syncTimer()
}
function onVisibilityChange() {
  isVisible.value = !document.hidden
  syncTimer()
}
onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion.value) isPlaying.value = false
  isVisible.value = !document.hidden
  document.addEventListener('visibilitychange', onVisibilityChange)
  syncTimer()
})
onUnmounted(() => {
  stopTimer()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <section class="service-carousel" aria-label="Explore G-PAK services">
    <div class="carousel-copy">
      <div class="copy-inner">
        <Transition name="slide-copy" mode="out-in">
          <div :key="activeIndex" class="copy-content" aria-live="off">
            <p class="eyebrow"><span class="eyebrow-line"></span> {{ String(activeIndex + 1).padStart(2, '0') }} / {{ activeSlide.service.toUpperCase() }}</p>
            <h1>{{ activeSlide.heading }}<br /><em>{{ activeSlide.emphasis }}</em></h1>
            <p class="hero-description">{{ activeSlide.description }}</p>
            <div class="hero-buttons">
              <NuxtLink to="/order" class="button button-red">Start your project <span aria-hidden="true">↗</span></NuxtLink>
              <a href="#services" class="text-link">Explore services <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </Transition>
        <div class="carousel-bottom">
          <div class="hero-note"><span class="note-symbol">✳</span><span>Made with care in Accra, Ghana</span></div>
          <div class="carousel-controls">
            <button type="button" class="arrow-control" aria-label="Previous service" @click="changeSlide(activeIndex - 1)">←</button>
            <button type="button" class="arrow-control" aria-label="Next service" @click="changeSlide(activeIndex + 1)">→</button>
            <button type="button" class="pause-control" :aria-label="isPlaying ? 'Pause slideshow' : 'Play slideshow'" :aria-pressed="!isPlaying" @click="togglePlayback">
              <svg v-if="isPlaying" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="2" y="1" width="2.5" height="10" /><rect x="7.5" y="1" width="2.5" height="10" /></svg>
              <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M2 1 11 6 2 11Z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="carousel-visual" :class="activeSlide.theme">
      <Transition name="slide-image">
        <img :key="activeSlide.image" :src="activeSlide.image" :alt="activeSlide.alt" :fetchpriority="activeIndex === 0 ? 'high' : 'auto'" />
      </Transition>
      <div class="visual-shade"></div>
      <div class="visual-label"><span class="label-mark">G<span>•</span>PAK</span><span>PRINT WITH PURPOSE<br />PRINT WITH PRECISION</span></div>
      <div class="visual-index">{{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(slides.length).padStart(2, '0') }} <span></span> {{ activeSlide.imageNote }}</div>
    </div>
    <nav class="slide-pagination" aria-label="Choose a service slide">
      <button v-for="(slide, index) in slides" :key="slide.service" type="button" :class="{ active: activeIndex === index }" :aria-label="`Show ${slide.service} slide, ${index + 1} of ${slides.length}`" :aria-current="activeIndex === index ? 'true' : undefined" @click="changeSlide(index)"><span class="pagination-number">{{ String(index + 1).padStart(2, '0') }}</span><span class="pagination-name">{{ slide.shortLabel }}</span><span class="pagination-rule"></span></button>
    </nav>
    <span class="sr-only" role="status" aria-live="polite">{{ announcement }}</span>
  </section>
</template>

<style scoped>
.service-carousel{display:grid;grid-template-columns:52% 48%;grid-template-rows:minmax(610px,auto) auto;background:#f3f3ee;position:relative;overflow:hidden}.carousel-copy{grid-column:1;grid-row:1;display:flex;justify-content:flex-end;align-items:center;padding:65px 8% 40px 40px}.copy-inner{width:min(100%,640px);display:flex;flex-direction:column;justify-content:space-between;min-height:460px}.copy-content{min-height:315px}.eyebrow{display:flex;align-items:center;gap:13px;margin:0 0 31px;font-size:11px;font-weight:800;letter-spacing:.18em;color:#ce2435}.eyebrow-line{width:27px;height:1px;background:#ce2435}.copy-content h1{font-family:var(--font-display);font-size:clamp(58px,6.2vw,105px);font-weight:800;letter-spacing:-.075em;line-height:1.05;margin:0 0 26px;color:#1d2728}.copy-content h1 em{font-family:Georgia,serif;font-weight:400;letter-spacing:-.06em;color:#ce2435}.hero-description{font-size:16px;line-height:1.8;max-width:490px;color:#586260;margin:0 0 28px}.hero-buttons{display:flex;align-items:center;gap:30px;flex-wrap:wrap}.text-link{font-size:13px;font-weight:800;display:inline-flex;gap:18px;align-items:center;border-bottom:1px solid #1d2728;padding:10px 0;white-space:nowrap}.text-link:hover{color:#ce2435;border-color:#ce2435}.carousel-bottom{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:38px}.hero-note{display:flex;align-items:center;gap:11px;font-size:11px;color:#717a77}.note-symbol{font-size:24px;color:#ce2435;line-height:1}.carousel-controls{display:flex;align-items:center;gap:7px}.arrow-control,.pause-control{width:34px;height:34px;display:grid;place-items:center;border:1px solid #cdd3cd;background:transparent;color:#263330;font-size:17px;transition:background .2s,color .2s,border-color .2s}.pause-control{font-size:11px;margin-left:5px}.arrow-control:hover,.pause-control:hover{background:#263330;border-color:#263330;color:#fff}.arrow-control:focus-visible,.pause-control:focus-visible,.slide-pagination button:focus-visible{outline:2px solid #ce2435;outline-offset:3px}.carousel-visual{grid-column:2;grid-row:1;position:relative;overflow:hidden;min-height:610px;background:#e9ece7}.carousel-visual>img{position:absolute;inset:0;width:100%;height:100%}.carousel-visual.photo>img{object-fit:cover;object-position:center;filter:brightness(.82)}.carousel-visual.product>img{object-fit:contain;padding:35px 20px 60px;background:#f1f2ee}.visual-shade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(3,13,14,.58),transparent 45%);pointer-events:none}.carousel-visual.product .visual-shade{background:linear-gradient(0deg,rgba(26,39,36,.1),transparent 32%)}.visual-label{position:absolute;bottom:37px;left:38px;color:#fff;display:flex;align-items:center;gap:21px}.label-mark{font-family:var(--font-display);font-weight:800;font-style:italic;font-size:25px;letter-spacing:-.07em}.label-mark span{color:#d8293b}.visual-label>span:last-child{font-size:9px;font-weight:700;letter-spacing:.15em;line-height:1.6;padding-left:21px;border-left:1px solid currentColor}.visual-index{position:absolute;right:30px;bottom:45px;color:#fff;font-size:9px;letter-spacing:.1em;font-weight:800;display:flex;align-items:center;gap:8px}.visual-index span{width:18px;height:1px;background:currentColor}.carousel-visual.product .visual-label,.carousel-visual.product .visual-index{color:#25322e}.slide-pagination{grid-column:1/-1;grid-row:2;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));background:#fff;min-height:75px;padding:0 max(40px,calc((100vw - 1360px)/2));border-bottom:1px solid #e6e9e4}.slide-pagination button{border:0;background:transparent;display:flex;align-items:center;gap:12px;padding:17px 17px 16px 0;min-width:0;text-align:left;color:#8b9690;cursor:pointer}.pagination-number{font-size:10px;font-weight:800;color:#a4afa8}.pagination-name{font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pagination-rule{margin-left:auto;margin-right:15px;height:2px;width:35px;background:#d9dfd9;flex:none}.slide-pagination button.active,.slide-pagination button.active .pagination-number{color:#c92336}.slide-pagination button.active .pagination-rule{background:#c92336}.slide-copy-enter-active,.slide-copy-leave-active{transition:opacity .22s,transform .22s}.slide-copy-enter-from{opacity:0;transform:translateY(15px)}.slide-copy-leave-to{opacity:0;transform:translateY(-10px)}.slide-image-enter-active,.slide-image-leave-active{transition:opacity .4s}.slide-image-enter-from,.slide-image-leave-to{opacity:0}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media(max-width:1150px){.carousel-copy{padding-right:5%}.copy-content h1{font-size:clamp(54px,6.2vw,82px)}.pagination-rule{width:20px;margin-right:8px}.visual-index{display:none}}
@media(max-width:850px){.service-carousel{grid-template-rows:minmax(540px,auto) auto}.carousel-copy{padding:50px 24px 42px 28px}.carousel-visual{min-height:540px}.copy-inner{min-height:435px}.copy-content h1{font-size:clamp(48px,6.5vw,68px)}.hero-description{font-size:14px}.hero-buttons{gap:14px}.slide-pagination{padding:0 28px}.pagination-name{font-size:10px}.pagination-rule{display:none}.visual-label{left:22px;bottom:26px}.visual-index{display:none}}
@media(max-width:640px){.service-carousel{display:flex;flex-direction:column}.carousel-copy{order:1;padding:58px 18px 32px;justify-content:flex-start}.copy-inner{min-height:0;width:100%}.copy-content{min-height:0}.eyebrow{margin-bottom:22px}.copy-content h1{font-size:clamp(53px,11.7vw,78px);margin-bottom:20px}.hero-description{font-size:14px;margin-bottom:22px}.hero-buttons{gap:10px 22px}.hero-buttons .button{padding:15px 17px}.carousel-bottom{margin-top:33px}.hero-note{font-size:10px}.carousel-visual{order:2;min-height:350px}.carousel-visual.product>img{padding:12px 10px 45px}.visual-label{left:18px;bottom:18px}.label-mark{font-size:21px}.visual-label>span:last-child{font-size:8px;padding-left:14px}.slide-pagination{order:3;display:grid;grid-template-columns:repeat(4,1fr);min-height:65px;padding:0 12px}.slide-pagination button{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:3px;padding:10px 5px;overflow:hidden}.pagination-number{font-size:9px}.pagination-name{font-size:9px;width:100%}}
@media(prefers-reduced-motion:reduce){.slide-copy-enter-active,.slide-copy-leave-active,.slide-image-enter-active,.slide-image-leave-active{transition:none}}
</style>
