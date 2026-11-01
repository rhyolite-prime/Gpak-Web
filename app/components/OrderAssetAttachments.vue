<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ files: File[]; projectId: number }>()
const emit = defineEmits<{ 'update:files': [files: File[]] }>()
const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const error = ref('')
const allowed = new Set(['pdf', 'png', 'jpg', 'jpeg', 'svg', 'ai', 'psd', 'eps', 'zip'])
const maxFiles = 5
const maxFileBytes = 10 * 1024 * 1024
const maxTotalBytes = 20 * 1024 * 1024
const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`

function addFiles(incoming: FileList | File[]) {
  error.value = ''
  const updated = [...props.files]
  const issues: string[] = []
  for (const file of Array.from(incoming)) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!allowed.has(extension)) { issues.push(`${file.name}: unsupported file type`); continue }
    if (file.size > maxFileBytes) { issues.push(`${file.name}: over 10 MB`); continue }
    if (updated.some(existing => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified)) continue
    if (updated.length >= maxFiles) { issues.push('Maximum 5 files per project'); break }
    if (updated.reduce((sum, item) => sum + item.size, 0) + file.size > maxTotalBytes) { issues.push('Maximum 20 MB per project'); continue }
    updated.push(file)
  }
  error.value = [...new Set(issues)].join('. ')
  emit('update:files', updated)
  if (input.value) input.value.value = ''
}

function onSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files) addFiles(files)
}
function onDrop(event: DragEvent) {
  dragging.value = false
  if (event.dataTransfer?.files) addFiles(event.dataTransfer.files)
}
function removeFile(index: number) {
  error.value = ''
  emit('update:files', props.files.filter((_, current) => current !== index))
}
</script>

<template>
  <div class="assets-section">
    <div class="assets-heading"><h4>Design assets & references <span>OPTIONAL</span></h4><p>Have a logo, artwork, brief or reference? Select it here so you can keep track of what to share with us.</p></div>
    <div class="drop-zone" :class="{ dragging }" @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="onDrop">
      <input :id="`design-assets-${projectId}`" ref="input" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.svg,.ai,.psd,.eps,.zip" class="visually-hidden" @change="onSelect" />
      <span class="upload-icon" aria-hidden="true">↑</span>
      <div><label :for="`design-assets-${projectId}`">Choose files</label><span> or drag and drop</span></div>
      <p>PDF, PNG, JPG, SVG, AI, PSD, EPS or ZIP · up to 5 files, 10 MB each</p>
    </div>
    <p v-if="error" class="asset-error" role="alert">{{ error }}</p>
    <ul v-if="files.length" class="asset-list" aria-label="Selected design files">
      <li v-for="(file, index) in files" :key="`${file.name}-${file.size}-${file.lastModified}`"><div><span class="file-icon" aria-hidden="true">▤</span><span class="file-name">{{ file.name }}</span><span class="file-size">{{ formatSize(file.size) }}</span></div><button type="button" :aria-label="`Remove ${file.name}`" @click="removeFile(index)">Remove ×</button></li>
    </ul>
    <p class="delivery-note"><strong>How files are shared:</strong> Files are not uploaded with this form yet. After you send your request, we'll give you an email link and ask you to attach these files from your device.</p>
  </div>
</template>

<style scoped>
.assets-section{border-top:1px solid #e7ece6;padding-top:25px;margin-top:29px}.assets-heading{margin-bottom:16px}.assets-heading h4{font-family:var(--font-display);font-size:14px;margin:0 0 4px}.assets-heading h4 span{font-family:var(--font-main);font-size:9px;letter-spacing:.12em;color:#a0a9a3;margin-left:5px}.assets-heading p{font-size:12px;color:#78827a;margin:0}.drop-zone{display:flex;align-items:center;flex-direction:column;justify-content:center;min-height:140px;padding:20px;text-align:center;background:#f9fbf8;border:1px dashed #b9c7bd;transition:border-color .2s,background .2s}.drop-zone.dragging,.drop-zone:focus-within{border-color:#ce2435;background:#fff6f6}.upload-icon{display:grid;place-items:center;width:30px;height:30px;border:1px solid #cfddcf;border-radius:50%;color:#bb293a;font-size:20px;line-height:1;margin-bottom:10px}.drop-zone label{color:#b42233;text-decoration:underline;text-underline-offset:2px;font-size:13px;font-weight:700;cursor:pointer}.drop-zone span:not(.upload-icon){font-size:12px;color:#65736a}.drop-zone p{font-size:10px;color:#8a968e;margin:9px 0 0}.visually-hidden{position:absolute;width:1px;height:1px;opacity:0;overflow:hidden}.asset-error{color:#b42233;font-size:11px;margin:9px 0 0}.asset-list{list-style:none;padding:0;margin:12px 0 0}.asset-list li{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #e3e9e2;padding:9px 12px;margin-bottom:7px}.asset-list li>div{display:flex;gap:9px;align-items:center;min-width:0}.file-icon{color:#b72737}.file-name{font-size:12px;color:#344239;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-size{font-size:10px;color:#8a968e;white-space:nowrap}.asset-list button{border:0;background:none;color:#b72737;font-size:11px;font-weight:700;white-space:nowrap}.asset-list button:hover{text-decoration:underline}.delivery-note{font-size:11px;line-height:1.6;color:#64766a;background:#eef5ee;padding:11px 13px;margin:14px 0 0}.delivery-note strong{color:#314f3b}
</style>
