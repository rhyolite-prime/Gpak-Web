<script setup lang="ts">
import type { RawMaterial } from '~/models'

type ProjectDetails = {
  jobName: string
  quantity: number
  pages: number
  size: string
  customSize: string
  noOfColoursText: number
  noOfColoursCover: number
  paperInside: string
  paperInsideRawMaterialId: string
  paperInsideVariant: string
  paperCover: string
  paperCoverRawMaterialId: string
  paperCoverVariant: string
}

const props = defineProps<{
  job: ProjectDetails
  index: number
  projectId: number
  canRemove: boolean
  touched: boolean
  rawMaterials: RawMaterial[]
  materialsError: boolean
}>()
const emit = defineEmits<{ remove: [] }>()
const job = props.job
const sizes = ['A2 - 420 x 594mm', 'A3 - 297 x 420mm', 'A4 - 210 x 297mm', 'A5 - 148 x 210mm', 'Quarto - 180 x 240mm']

function variants(id: string): { name: string }[] {
  return (props.rawMaterials.find(material => material.id === id) as RawMaterial & { variants?: { name: string }[] })?.variants ?? []
}

function selectPaper(part: 'Inside' | 'Cover') {
  const id = job[`paper${part}RawMaterialId`]
  job[`paper${part}`] = props.rawMaterials.find(material => material.id === id)?.name ?? ''
  job[`paper${part}Variant`] = ''
}
</script>

<template>
  <section :id="`project-${projectId}`" class="project-card" :aria-labelledby="`project-title-${projectId}`">
    <div class="project-heading">
      <div>
        <span class="project-overline">PROJECT {{ String(index + 1).padStart(2, '0') }}</span>
        <h3 :id="`project-title-${projectId}`">{{ job.jobName || `Your project ${index + 1}` }}</h3>
      </div>
      <button v-if="canRemove" type="button" class="remove-button" :aria-label="`Remove project ${index + 1}`" @click="emit('remove')">Remove project ×</button>
    </div>

    <div class="project-group">
      <div class="group-heading"><h4>The essentials</h4><p>What would you like us to make?</p></div>
      <div class="field-grid">
        <div class="field field-full">
          <label :for="`jobName-${projectId}`">What are you printing? <span>*</span></label>
          <input :id="`jobName-${projectId}`" v-model="job.jobName" type="text" placeholder="e.g. Company brochure, textbook, product box" :class="{ invalid: touched && !job.jobName.trim() }" :aria-invalid="touched && !job.jobName.trim()" />
          <small v-if="touched && !job.jobName.trim()">Please name this project.</small>
        </div>
        <div class="field">
          <label :for="`quantity-${projectId}`">Quantity <span>*</span></label>
          <input :id="`quantity-${projectId}`" v-model.number="job.quantity" type="number" min="1" :class="{ invalid: touched && !(Number(job.quantity) > 0) }" :aria-invalid="touched && !(Number(job.quantity) > 0)" />
          <small v-if="touched && !(Number(job.quantity) > 0)">Enter at least 1.</small>
        </div>
        <div class="field">
          <label :for="`pages-${projectId}`">Number of pages <span>*</span></label>
          <input :id="`pages-${projectId}`" v-model.number="job.pages" type="number" min="1" :class="{ invalid: touched && !(Number(job.pages) > 0) }" :aria-invalid="touched && !(Number(job.pages) > 0)" />
          <small v-if="touched && !(Number(job.pages) > 0)">Enter at least 1.</small>
        </div>
        <div class="field">
          <label :for="`size-${projectId}`">Finished size <span class="optional">OPTIONAL</span></label>
          <select :id="`size-${projectId}`" v-model="job.size"><option value="">Not sure yet</option><option v-for="size in sizes" :key="size">{{ size }}</option><option value="custom">Custom size</option></select>
        </div>
        <div v-if="job.size === 'custom'" class="field">
          <label :for="`customSize-${projectId}`">Custom dimensions <span>*</span></label>
          <input :id="`customSize-${projectId}`" v-model="job.customSize" type="text" placeholder="e.g. 100 x 200mm" :class="{ invalid: touched && !job.customSize.trim() }" :aria-invalid="touched && !job.customSize.trim()" />
          <small v-if="touched && !job.customSize.trim()">Enter your dimensions.</small>
        </div>
      </div>
    </div>

    <div class="project-group specifications">
      <div class="group-heading"><h4>Print specifications</h4><p>Not sure yet? We can help you choose the right materials.</p></div>
      <div class="field-grid">
        <div class="field"><label :for="`insideColours-${projectId}`">Colours — inside / text</label><select :id="`insideColours-${projectId}`" v-model.number="job.noOfColoursText"><option v-for="n in 4" :key="n" :value="n">{{ n }} colour{{ n > 1 ? 's' : '' }}</option></select></div>
        <div class="field"><label :for="`coverColours-${projectId}`">Colours — cover</label><select :id="`coverColours-${projectId}`" v-model.number="job.noOfColoursCover"><option v-for="n in 4" :key="n" :value="n">{{ n }} colour{{ n > 1 ? 's' : '' }}</option></select></div>
        <div class="field"><label :for="`insidePaper-${projectId}`">Inside paper <span class="optional">OPTIONAL</span></label><select :id="`insidePaper-${projectId}`" v-model="job.paperInsideRawMaterialId" @change="selectPaper('Inside')"><option value="">Choose later</option><option v-for="material in rawMaterials" :key="material.id" :value="material.id">{{ material.name }}</option></select></div>
        <div class="field"><label :for="`insideVariant-${projectId}`">Inside paper variant</label><select :id="`insideVariant-${projectId}`" v-model="job.paperInsideVariant" :disabled="!variants(job.paperInsideRawMaterialId).length"><option value="">Choose later</option><option v-for="variant in variants(job.paperInsideRawMaterialId)" :key="variant.name" :value="variant.name">{{ variant.name }}</option></select></div>
        <div class="field"><label :for="`coverPaper-${projectId}`">Cover paper <span class="optional">OPTIONAL</span></label><select :id="`coverPaper-${projectId}`" v-model="job.paperCoverRawMaterialId" @change="selectPaper('Cover')"><option value="">Choose later</option><option v-for="material in rawMaterials" :key="material.id" :value="material.id">{{ material.name }}</option></select></div>
        <div class="field"><label :for="`coverVariant-${projectId}`">Cover paper variant</label><select :id="`coverVariant-${projectId}`" v-model="job.paperCoverVariant" :disabled="!variants(job.paperCoverRawMaterialId).length"><option value="">Choose later</option><option v-for="variant in variants(job.paperCoverRawMaterialId)" :key="variant.name" :value="variant.name">{{ variant.name }}</option></select></div>
      </div>
      <p v-if="materialsError" class="material-note">Paper choices are temporarily unavailable. You can still continue and discuss paper with our team.</p>
    </div>
  </section>
</template>

<style scoped>
.project-card{border:1px solid #e1e7e1;background:#fff;padding:26px;margin:0 0 24px;scroll-margin-top:130px}.project-heading{display:flex;justify-content:space-between;align-items:start;gap:16px;margin-bottom:26px}.project-overline{font-size:10px;letter-spacing:.17em;font-weight:800;color:var(--color-primary)}.project-heading h3{font-family:var(--font-display);font-size:20px;letter-spacing:-.04em;margin:8px 0 0}.remove-button{border:0;background:none;color:#b72737;font-size:12px;font-weight:700;padding:0;white-space:nowrap}.remove-button:hover{text-decoration:underline}.project-group{margin:0}.project-group.specifications{border-top:1px solid #e7ece6;padding-top:25px;margin-top:29px}.group-heading{margin-bottom:19px}.group-heading h4{font-family:var(--font-display);font-size:14px;margin:0 0 3px}.group-heading p{font-size:12px;color:#78827a;margin:0}.field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 20px}.field{min-width:0}.field-full{grid-column:1/-1}.field label{display:block;font-size:12px;font-weight:700;margin-bottom:9px;color:#2b3531}.field label>span:not(.optional){color:#ce2435}.optional{font-size:9px;letter-spacing:.13em;color:#a0a9a3;font-weight:700;margin-left:5px}.field input,.field select{display:block;width:100%;height:47px;border:1px solid #dce2dc;background:#fbfcfa;color:#26322d;border-radius:0;padding:0 13px;font-size:13px;outline:0;transition:border-color .2s,box-shadow .2s}.field input:focus,.field select:focus{border-color:#ce2435;box-shadow:0 0 0 3px rgba(206,36,53,.08)}.field input::placeholder{color:#9da8a0}.field select:disabled{color:#a2aaa5;background:#f3f5f2}.field .invalid{border-color:#ce2435}.field small{display:block;color:#be2234;margin-top:5px;font-size:11px}.material-note{font-size:11px;color:#a46020;margin:18px 0 0}@media(max-width:720px){.project-card{padding:19px}.field-grid{grid-template-columns:1fr;gap:19px}.field-full{grid-column:auto}.project-heading{flex-wrap:wrap}}
</style>
