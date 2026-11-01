<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const updateVisibility = () => { visible.value = window.scrollY > 500 }

onMounted(() => {
  updateVisibility()
  window.addEventListener('scroll', updateVisibility, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', updateVisibility))

function scrollToTop() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
}
</script>

<template>
  <Transition name="back-to-top">
    <button v-if="visible" type="button" class="scroll-top" aria-label="Scroll to top" title="Scroll to top" @click="scrollToTop">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
    </button>
  </Transition>
</template>

<style scoped>
.scroll-top{position:fixed;right:28px;bottom:28px;z-index:80;width:50px;height:50px;display:grid;place-items:center;background:#ce2435;color:#fff;border:1px solid #ce2435;box-shadow:0 8px 24px rgba(29,39,40,.24);cursor:pointer;transition:background .2s,transform .2s,opacity .2s}
.scroll-top:hover{background:#a91b2c;transform:translateY(-3px)}
.scroll-top:focus-visible{outline:3px solid #202c2c;outline-offset:3px}
.back-to-top-enter-active,.back-to-top-leave-active{transition:opacity .2s,transform .2s}
.back-to-top-enter-from,.back-to-top-leave-to{opacity:0;transform:translateY(12px)}
@media(max-width:640px){.scroll-top{right:18px;bottom:18px;width:46px;height:46px}}
@media(prefers-reduced-motion:reduce){.scroll-top,.back-to-top-enter-active,.back-to-top-leave-active{transition:none}}
</style>
