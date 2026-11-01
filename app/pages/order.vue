<script setup lang="ts">
import { reactive, ref, computed, nextTick, onMounted } from 'vue'
import { getRawMaterials, submitOrderRequest } from '~/services/productionOrder'
import type { RawMaterial } from '~/models'

useSeoMeta({ title: 'Request a Quote | G-PAK Limited', description: 'Tell G-PAK Limited about your print or packaging project and request a tailored quote.' })

const steps = ['Your details', 'Project details', 'Finishing', 'Review & send']
const step = ref(0)
const errorMessage = ref('')
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const rawMaterials = ref<RawMaterial[]>([])
const materialsError = ref(false)
const wizardTop = ref<HTMLElement | null>(null)
const finishGroups = [
  { key: 'laminate', label: 'Lamination', options: ['Gloss', 'Matt', 'Soft touch', 'Saudy'] },
  { key: 'vanish', label: 'Varnish', options: ['UV varnish', 'Waterbase varnish', 'Oil varnish'] },
  { key: 'spot', label: 'Spot finish', options: ['3D matt', '3D gloss', '3D pattern'] },
  { key: 'windowPatching', label: 'Window patching', options: ['Window patching'] }
] as const
const bindings = ['Saddle stitch', 'Perfect bind', 'Case bind', 'Wire O', 'Spiral bind', 'Side stab', 'Padding']
const addOns = ['Die cutting', 'Embossing', 'Folding', 'Numbering', 'Perforating', 'Punching', 'Cutting', 'Sewing', 'Fold/Glue', 'Glue']
const toApiOption = (value: string) => ({ 'UV varnish': 'uv-vanish', 'Waterbase varnish': 'waterbase-vanish', 'Oil varnish': 'oil-vanish' }[value] || value.toLowerCase().replace(/[ \/]+/g, '-'))
const emptyJob = () => ({
  jobName: '', pages: 1, quantity: 1, size: '', customSize: '',
  noOfColoursCover: 1, noOfColoursText: 1,
  paperInside: '', paperInsideRawMaterialId: '', paperInsideVariant: '',
  paperCover: '', paperCoverRawMaterialId: '', paperCoverVariant: '',
  binding: '', bindingCustom: '', addons: [] as string[], addonsCustom: '',
  laminate: '', laminateCustom: '', vanish: '', vanishCustom: '',
  spot: '', spotCustom: '', windowPatching: '', windowPatchingCustom: '', otherInstructions: ''
})
type Job = ReturnType<typeof emptyJob>
type FinishKey = 'laminate' | 'vanish' | 'spot' | 'windowPatching'
const projectKeys = ref([0])
let nextProjectKey = 1
const projectAnnouncement = ref('')
const form = reactive({ customer: '', contactName: '', phoneNo: '', emailAddress: '', location: '', noOfJobs: 1, jobRequests: [emptyJob()] })
const touched = ref(false)
const phoneValid = computed(() => form.phoneNo.replace(/\D/g, '').length >= 9)
const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress.trim()))
const detailsValid = computed(() => !!form.customer.trim() && !!form.contactName.trim() && phoneValid.value && emailValid.value)
const jobsValid = computed(() => form.jobRequests.every(job => !!job.jobName.trim() && Number(job.quantity) > 0 && Number(job.pages) > 0 && (job.size !== 'custom' || !!job.customSize.trim())))
const progress = computed(() => `${((step.value + 1) / steps.length) * 100}%`)

function scrollTop() { nextTick(() => wizardTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })) }
function goTo(index: number) {
  if (index > step.value) return
  errorMessage.value = ''
  step.value = index
  scrollTop()
}
function focusFirstInvalid() {
  nextTick(() => {
    const field = wizardTop.value?.querySelector<HTMLInputElement>('.invalid')
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    field?.focus({ preventScroll: true })
  })
}
function next() {
  touched.value = true
  if (step.value === 0 && !detailsValid.value) { errorMessage.value = 'Please complete the required contact details before continuing.'; focusFirstInvalid(); return }
  if (step.value === 1 && !jobsValid.value) { errorMessage.value = 'Add a project name, valid quantity and page count, and any custom size.'; focusFirstInvalid(); return }
  errorMessage.value = ''
  touched.value = false
  step.value++
  scrollTop()
}
async function addJob() {
  const projectId = nextProjectKey++
  form.jobRequests.push(emptyJob())
  projectKeys.value.push(projectId)
  form.noOfJobs = form.jobRequests.length
  projectAnnouncement.value = `Project ${form.noOfJobs} added. Complete its details below.`

  // The new card is rendered on the next tick. Scroll to its beginning rather
  // than the bottom of the form, then place keyboard focus in its first field.
  await nextTick()
  const card = document.getElementById(`project-${projectId}`)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  card?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  document.getElementById(`jobName-${projectId}`)?.focus({ preventScroll: true })
}
function removeJob(index: number) {
  if (form.jobRequests.length <= 1) return
  form.jobRequests.splice(index, 1)
  projectKeys.value.splice(index, 1)
  form.noOfJobs = form.jobRequests.length
  projectAnnouncement.value = `Project removed. ${form.noOfJobs} project${form.noOfJobs === 1 ? '' : 's'} remaining.`
}
function selectFinish(job: Job, key: FinishKey, value: string) {
  const alreadySelected = job[key] === value
  for (const group of finishGroups) { job[group.key] = ''; job[`${group.key}Custom`] = '' }
  if (!alreadySelected) job[key] = value
}
function finishLabel(job: Job) {
  for (const group of finishGroups) if (job[group.key]) return `${group.label}: ${job[group.key] === 'custom' ? job[`${group.key}Custom`] || 'Custom' : job[group.key]}`
  return 'None selected'
}
async function handleSubmit() {
  if (isSubmitting.value) return
  if (!detailsValid.value) { step.value = 0; touched.value = true; errorMessage.value = 'Please complete the required contact details.'; scrollTop(); return }
  if (!jobsValid.value) { step.value = 1; touched.value = true; errorMessage.value = 'Please complete the required project details.'; scrollTop(); return }
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    const payload = {
      ...form,
      noOfJobs: form.jobRequests.length,
      jobRequests: form.jobRequests.map(job => ({
        ...job,
        binding: job.binding === 'custom' ? 'custom' : toApiOption(job.binding),
        addons: job.addons.map(toApiOption),
        laminate: job.laminate === 'custom' ? 'custom' : toApiOption(job.laminate),
        vanish: job.vanish === 'custom' ? 'custom' : toApiOption(job.vanish),
        spot: job.spot === 'custom' ? 'custom' : toApiOption(job.spot),
        windowPatching: job.windowPatching === 'custom' ? 'custom' : toApiOption(job.windowPatching),
        paperInside: rawMaterials.value.find(m => m.id === job.paperInsideRawMaterialId)?.name || job.paperInside,
        paperCover: rawMaterials.value.find(m => m.id === job.paperCoverRawMaterialId)?.name || job.paperCover,
        paperInsideRawMaterialId: job.paperInsideRawMaterialId || '00000000-0000-0000-0000-000000000000',
        paperCoverRawMaterialId: job.paperCoverRawMaterialId || '00000000-0000-0000-0000-000000000000'
      }))
    }
    if (!await submitOrderRequest(payload)) throw new Error('Request unsuccessful')
    submitSuccess.value = true
    Object.assign(form, { customer: '', contactName: '', phoneNo: '', emailAddress: '', location: '', noOfJobs: 1, jobRequests: [emptyJob()] })
    step.value = 0
    projectKeys.value = [0]
    nextProjectKey = 1
    projectAnnouncement.value = ''
    touched.value = false
  } catch {
    errorMessage.value = 'We could not send your request. Please try again, or contact us directly.'
  } finally { isSubmitting.value = false }
}
onMounted(async () => {
  try { rawMaterials.value = await getRawMaterials() || [] }
  catch { materialsError.value = true }
})
</script>

<template>
  <div>
    <AppHeader />
    <main class="order-page">
      <div class="container">
        <div class="order-intro"><div><p class="section-kicker">LET'S GET STARTED</p><h1>Tell us what you're<br /><em>imagining.</em></h1><p>Share a few details about your project and our team will take it from there. You can review everything before sending.</p></div><div class="intro-aside"><span>YOUR PROJECT, OUR PRIORITY</span><p>Thoughtful print begins<br />with a conversation.</p></div></div>
        <div ref="wizardTop" class="wizard-shell">
          <aside class="wizard-sidebar" aria-label="Quote request progress">
            <span class="sidebar-eyebrow">REQUEST A QUOTE</span>
            <h2>Let's make<br />it happen.</h2>
            <p>Four simple steps to bring your idea to life.</p>
            <nav class="step-list" aria-label="Form steps">
              <button v-for="(label, index) in steps" :key="label" type="button" :disabled="index > step" :class="{ active: step === index, done: step > index }" :aria-current="step === index ? 'step' : undefined" @click="goTo(index)"><span class="step-number">{{ step > index ? '✓' : String(index + 1).padStart(2, '0') }}</span><span>{{ label }}</span></button>
            </nav>
            <div class="sidebar-help"><span>NEED A HAND?</span><a href="tel:+233302666052">+233 (0) 302 666 052 ↗</a><a href="mailto:gpakltd@graphic.com.gh">gpakltd@graphic.com.gh ↗</a></div>
          </aside>
          <div class="wizard-main">
            <div class="mobile-progress"><span>STEP {{ step + 1 }} OF {{ steps.length }}</span><span>{{ steps[step] }}</span><div class="progress-track"><div :style="{ width: progress }"></div></div></div>
            <form novalidate @submit.prevent="handleSubmit">
              <div v-if="step === 0" class="step-panel">
                <div class="panel-heading"><p class="panel-eyebrow">01 / YOUR DETAILS</p><h2>First, let's get to know you.</h2><p>So we know who to speak with about your project.</p></div>
                <div class="field-grid">
                  <div class="field"><label for="customer">Business or organisation name <span>*</span></label><input id="customer" v-model="form.customer" type="text" autocomplete="organization" placeholder="Your business name" :class="{ invalid: touched && !form.customer.trim() }" /><small v-if="touched && !form.customer.trim()">Please enter a business name.</small></div>
                  <div class="field"><label for="contactName">Your name <span>*</span></label><input id="contactName" v-model="form.contactName" type="text" autocomplete="name" placeholder="Your full name" :class="{ invalid: touched && !form.contactName.trim() }" /><small v-if="touched && !form.contactName.trim()">Please enter your name.</small></div>
                  <div class="field"><label for="phoneNo">Phone number <span>*</span></label><input id="phoneNo" v-model="form.phoneNo" type="tel" autocomplete="tel" placeholder="e.g. 024 000 0000" :class="{ invalid: touched && !phoneValid }" /><small v-if="touched && !phoneValid">Enter a valid phone number.</small></div>
                  <div class="field"><label for="emailAddress">Email address <span>*</span></label><input id="emailAddress" v-model="form.emailAddress" type="email" autocomplete="email" placeholder="name@company.com" :class="{ invalid: touched && !emailValid }" /><small v-if="touched && !emailValid">Enter a valid email address.</small></div>
                  <div class="field field-full"><label for="location">Your location <span class="optional">OPTIONAL</span></label><input id="location" v-model="form.location" type="text" autocomplete="address-level2" placeholder="City or delivery location" /></div>
                </div>
              </div>
              <div v-else-if="step === 1" class="step-panel">
                <div class="panel-heading"><p class="panel-eyebrow">02 / PROJECT DETAILS</p><h2>What are we creating?</h2><p>Give us the essentials. Not sure about a detail? Leave optional fields blank and we'll help you work it out.</p></div>
                <OrderProjectCard
                  v-for="(job, index) in form.jobRequests"
                  :key="projectKeys[index]"
                  :job="job"
                  :index="index"
                  :project-id="projectKeys[index]!"
                  :can-remove="form.jobRequests.length > 1"
                  :touched="touched"
                  :raw-materials="rawMaterials"
                  :materials-error="materialsError"
                  @remove="removeJob(index)"
                />
                <p class="add-project-help">Have another item in mind? You can include multiple projects in one request.</p>
                <button type="button" class="add-project" @click="addJob"><span>＋</span> Add another project</button>
                <p class="sr-only" role="status" aria-live="polite">{{ projectAnnouncement }}</p>
              </div>
              <div v-else-if="step === 2" class="step-panel">
                <div class="panel-heading"><p class="panel-eyebrow">03 / FINISHING TOUCHES</p><h2>Make it yours.</h2><p>Choose any finishing details you know. Everything here is optional.</p></div>
                <div v-for="(job, index) in form.jobRequests" :key="index" class="job-block"><div class="job-heading"><div><span>PROJECT {{ String(index + 1).padStart(2, '0') }}</span><h3>{{ job.jobName }}</h3></div></div>
                  <div class="option-section"><h4>Binding</h4><p>How should the pages be held together?</p><div class="choice-grid"><label v-for="option in bindings" :key="option" class="choice" :class="{ chosen: job.binding === option }"><input v-model="job.binding" type="radio" :name="`binding-${index}`" :value="option" /><span>{{ option }}</span></label><label class="choice" :class="{ chosen: job.binding === 'custom' }"><input v-model="job.binding" type="radio" :name="`binding-${index}`" value="custom" /><span>Other</span></label><button type="button" class="choice choice-button" :class="{ chosen: !job.binding }" @click="job.binding = ''; job.bindingCustom = ''">Decide later</button></div><input v-if="job.binding === 'custom'" v-model="job.bindingCustom" class="option-custom" type="text" :aria-label="`Custom binding for ${job.jobName}`" placeholder="Describe your binding" /></div>
                  <div class="option-section"><h4>Additional options</h4><p>Choose as many as you need.</p><div class="choice-grid"><label v-for="option in addOns" :key="option" class="choice" :class="{ chosen: job.addons.includes(option) }"><input v-model="job.addons" type="checkbox" :value="option" /><span>{{ option }}</span></label><label class="choice" :class="{ chosen: job.addons.includes('custom') }"><input v-model="job.addons" type="checkbox" value="custom" /><span>Other</span></label></div><input v-if="job.addons.includes('custom')" v-model="job.addonsCustom" class="option-custom" type="text" :aria-label="`Other add-ons for ${job.jobName}`" placeholder="Describe your add-on" /></div>
                  <div class="option-section"><h4>Surface finish</h4><p>Choose just one of the following, or skip it for now.</p><div v-for="group in finishGroups" :key="group.key" class="finish-group"><span>{{ group.label }}</span><div class="choice-grid"><button v-for="option in group.options" :key="option" type="button" class="choice choice-button" :class="{ chosen: job[group.key] === option }" :aria-pressed="job[group.key] === option" @click="selectFinish(job, group.key, option)">{{ option }}</button><button type="button" class="choice choice-button" :class="{ chosen: job[group.key] === 'custom' }" :aria-pressed="job[group.key] === 'custom'" @click="selectFinish(job, group.key, 'custom')">Other</button></div><input v-if="job[group.key] === 'custom'" v-model="job[`${group.key}Custom`]" class="option-custom" type="text" :aria-label="`Custom ${group.label.toLowerCase()} for ${job.jobName}`" :placeholder="`Describe your ${group.label.toLowerCase()}`" /></div></div>
                  <div class="field notes-field"><label :for="`instructions-${index}`">Anything else we should know? <span class="optional">OPTIONAL</span></label><textarea :id="`instructions-${index}`" v-model="job.otherInstructions" rows="4" placeholder="Tell us about a deadline, special requirements, or anything we should keep in mind."></textarea></div>
                </div>
              </div>
              <div v-else class="step-panel"><div class="panel-heading"><p class="panel-eyebrow">04 / REVIEW & SEND</p><h2>Looking good?</h2><p>Check the details below before sending your request. Our team will get back to you about the next steps.</p></div>
                <div class="review-block"><div class="review-title"><h3>Your details</h3><button type="button" @click="goTo(0)">Edit ↗</button></div><div class="review-grid"><div><span>BUSINESS</span><strong>{{ form.customer }}</strong></div><div><span>CONTACT</span><strong>{{ form.contactName }}</strong></div><div><span>PHONE</span><strong>{{ form.phoneNo }}</strong></div><div><span>EMAIL</span><strong>{{ form.emailAddress }}</strong></div><div v-if="form.location"><span>LOCATION</span><strong>{{ form.location }}</strong></div></div></div>
                <div v-for="(job, index) in form.jobRequests" :key="index" class="review-block"><div class="review-title"><h3>Project {{ String(index + 1).padStart(2, '0') }} · {{ job.jobName }}</h3><button type="button" @click="goTo(1)">Edit ↗</button></div><div class="review-grid"><div><span>QUANTITY</span><strong>{{ job.quantity }}</strong></div><div><span>PAGES</span><strong>{{ job.pages }}</strong></div><div><span>SIZE</span><strong>{{ job.size === 'custom' ? job.customSize : job.size || 'To be discussed' }}</strong></div><div><span>PAPER</span><strong>{{ job.paperInside || 'To be discussed' }}</strong></div><div><span>COVER PAPER</span><strong>{{ job.paperCover || 'To be discussed' }}</strong></div><div><span>TEXT / COVER COLOURS</span><strong>{{ job.noOfColoursText }} / {{ job.noOfColoursCover }}</strong></div><div><span>BINDING</span><strong>{{ job.binding === 'custom' ? job.bindingCustom || 'Custom' : job.binding || 'To be discussed' }}</strong></div><div><span>FINISH</span><strong>{{ finishLabel(job) }}</strong></div><div><span>ADD-ONS</span><strong>{{ job.addons.length ? job.addons.map(item => item === 'custom' ? job.addonsCustom || 'Custom' : item).join(', ') : 'None selected' }}</strong></div><div v-if="job.otherInstructions"><span>OTHER INSTRUCTIONS</span><strong>{{ job.otherInstructions }}</strong></div></div><button type="button" class="review-finish-edit" @click="goTo(2)">Edit finishing & notes ↗</button></div>
                <div class="review-assurance"><span>✳</span><p>Once submitted, your details go directly to our team. We'll be in touch to discuss your requirements and a tailored quote.</p></div>
              </div>
              <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
              <div class="wizard-actions"><button v-if="step > 0" type="button" class="back-button" @click="goTo(step - 1)">← Back</button><span v-else class="action-hint">* Required information</span><button v-if="step < 3" type="button" class="button button-red next-button" @click="next">Continue <span aria-hidden="true">↗</span></button><button v-else type="submit" class="button button-red next-button" :disabled="isSubmitting">{{ isSubmitting ? 'Sending request…' : 'Send request' }} <span v-if="!isSubmitting" aria-hidden="true">↗</span></button></div>
            </form>
          </div>
        </div>
        <p class="below-wizard">Prefer to talk it through? <a href="tel:+233302666052">Give us a call ↗</a></p>
      </div>
    </main>
    <AppFooter />
    <div v-if="submitSuccess" class="success-overlay" role="dialog" aria-modal="true" aria-labelledby="success-title"><div class="success-card"><span class="success-icon">✓</span><p class="panel-eyebrow">REQUEST RECEIVED</p><h2 id="success-title">Thank you for reaching out.</h2><p>Your project details have been sent to our team. We'll be in touch to discuss the next steps.</p><button type="button" class="button button-red" @click="submitSuccess = false">Back to the website ↗</button></div></div>
  </div>
</template>

<style scoped>
.order-page{background:#f5f6f2;padding:70px 0 90px}.order-intro{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:49px}.order-intro h1{font-family:var(--font-display);font-size:clamp(48px,5vw,76px);line-height:1.1;letter-spacing:-.06em;margin:18px 0 16px}.order-intro h1 em{font-family:Georgia,serif;font-weight:400;color:var(--color-primary)}.order-intro p:not(.section-kicker){max-width:580px;color:#67716c;font-size:15px;margin-bottom:0}.intro-aside{text-align:right;border-left:1px solid #d2d8d2;padding-left:32px;flex:none}.intro-aside span,.sidebar-eyebrow,.sidebar-help>span,.panel-eyebrow,.job-heading span,.review-grid span{font-size:10px;letter-spacing:.17em;font-weight:800;color:var(--color-primary)}.intro-aside p{font-family:var(--font-display);font-size:16px!important;font-weight:700;color:#283330!important;margin:10px 0 0!important;line-height:1.4}.wizard-shell{display:grid;grid-template-columns:305px minmax(0,1fr);background:#fff;min-height:640px;box-shadow:0 16px 50px rgba(27,41,36,.045);scroll-margin-top:20px}.wizard-sidebar{background:#202c2c;color:white;padding:47px 34px;display:flex;flex-direction:column}.sidebar-eyebrow{color:#d86a74}.wizard-sidebar h2{font-family:var(--font-display);font-size:29px;line-height:1.2;letter-spacing:-.055em;margin:20px 0 8px}.wizard-sidebar>p{font-size:12px;line-height:1.6;color:#aab8b3;margin-bottom:50px}.step-list{display:flex;flex-direction:column;gap:0}.step-list button{display:flex;align-items:center;text-align:left;gap:16px;min-height:60px;background:none;border:0;color:#899b96;font-size:13px;font-weight:600;padding:0;position:relative}.step-list button:not(:last-child):before{content:'';position:absolute;left:16px;top:47px;bottom:-14px;width:1px;background:#536361}.step-list button.active{color:white}.step-list button.done{color:#d7e4df;cursor:pointer}.step-list button:disabled{cursor:not-allowed}.step-number{display:grid;place-items:center;flex:none;width:33px;height:33px;border:1px solid #596a67;border-radius:50%;font-size:10px;color:#9baea8;position:relative;z-index:1;background:#202c2c}.active .step-number{background:#ce2435;border-color:#ce2435;color:white}.done .step-number{background:#516d61;border-color:#516d61;color:#fff}.sidebar-help{border-top:1px solid #4a5854;padding-top:26px;margin-top:auto;display:flex;flex-direction:column;gap:10px}.sidebar-help>span{color:#c9d2cc;margin-bottom:7px}.sidebar-help a{font-size:12px;color:#d9e4df;word-break:break-word}.sidebar-help a:hover{color:white}.wizard-main{padding:48px min(6vw,78px) 45px;min-width:0}.mobile-progress{display:none}.panel-heading{margin-bottom:33px}.panel-eyebrow{margin:0 0 12px}.panel-heading h2{font-family:var(--font-display);font-size:clamp(27px,2.6vw,39px);letter-spacing:-.05em;line-height:1.2;margin:0 0 10px}.panel-heading>p:last-child{font-size:13px;color:#76807a;max-width:550px;line-height:1.6;margin:0}.field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:23px 20px}.field{min-width:0}.field-full{grid-column:1/-1}.field label{display:block;font-size:12px;font-weight:700;margin-bottom:9px;color:#2b3531}.field label>span:not(.optional){color:#ce2435}.optional{font-size:9px;letter-spacing:.13em;color:#a0a9a3;font-weight:700;margin-left:5px}.field input,.field select,.field textarea,.option-custom{display:block;width:100%;height:47px;border:1px solid #dce2dc;background:#fbfcfa;color:#26322d;border-radius:0;padding:0 13px;font-size:13px;outline:0;transition:border-color .2s,box-shadow .2s}.field textarea{height:auto;min-height:106px;padding-top:13px;resize:vertical}.field input:focus,.field select:focus,.field textarea:focus,.option-custom:focus{border-color:#ce2435;box-shadow:0 0 0 3px rgba(206,36,53,.08)}.field input::placeholder,.field textarea::placeholder,.option-custom::placeholder{color:#9da8a0}.field select:disabled{color:#a2aaa5;background:#f3f5f2}.field .invalid{border-color:#ce2435}.field small{display:block;color:#be2234;margin-top:5px;font-size:11px}.wizard-actions{border-top:1px solid #e9ede8;margin-top:42px;padding-top:25px;display:flex;align-items:center;justify-content:space-between;gap:15px}.next-button{min-width:172px;cursor:pointer;border:0}.next-button:disabled{opacity:.65;cursor:wait}.back-button{border:0;background:none;color:#2b3631;font-size:13px;font-weight:700;padding:10px 0}.back-button:hover{color:#ce2435}.action-hint{font-size:11px;color:#939d96}.form-error{background:#fff1f2;color:#ae1e30;padding:12px 15px;border-left:3px solid #ce2435;font-size:12px;margin:25px 0 0}.job-block{border:1px solid #e1e7e1;padding:25px;margin:0 0 24px}.job-heading{display:flex;align-items:start;justify-content:space-between;gap:15px;margin-bottom:25px}.job-heading h3{font-family:var(--font-display);font-size:20px;letter-spacing:-.04em;margin:8px 0 0}.remove-button{border:0;background:none;color:#b72737;font-size:12px;font-weight:700;padding:0}.add-project{width:100%;padding:18px;border:1px dashed #b8c6bc;background:#f9fbf8;color:#263931;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;gap:10px}.add-project:hover{border-color:#ce2435;color:#ce2435}.add-project span{font-size:19px;line-height:1}.material-note{font-size:11px;color:#a46020;margin:18px 0 0}.option-section{border-top:1px solid #e6ebe5;padding:21px 0}.option-section h4{font-family:var(--font-display);font-size:15px;margin:0 0 4px}.option-section>p{font-size:12px;color:#78827a;margin:0 0 15px}.choice-grid{display:flex;flex-wrap:wrap;gap:8px}.choice{display:inline-flex;align-items:center;min-height:36px;border:1px solid #dce4db;background:#fff;color:#48544c;padding:8px 12px;font-size:11px;line-height:1.4;cursor:pointer;transition:all .2s}.choice:hover{border-color:#ce2435}.choice.chosen{border-color:#ce2435;color:#ba2132;background:#fff4f4}.choice input{position:absolute;opacity:0;width:1px;height:1px}.choice:has(input:focus-visible),.choice-button:focus-visible{outline:2px solid #ce2435;outline-offset:2px}.choice-button{font:inherit}.option-custom{margin-top:10px;max-width:340px}.finish-group{margin:16px 0 22px}.finish-group>span{display:block;font-size:11px;font-weight:800;margin-bottom:10px;color:#6d786f}.notes-field{margin-top:12px}.review-block{border:1px solid #e1e7e1;padding:24px;margin-bottom:16px}.review-title{display:flex;justify-content:space-between;align-items:start;gap:15px;margin-bottom:22px}.review-title h3{font-family:var(--font-display);font-size:18px;letter-spacing:-.03em;margin:0}.review-title button,.review-finish-edit{background:none;border:0;color:#bb2233;font-weight:700;font-size:12px;white-space:nowrap;padding:0}.review-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.review-grid>div{min-width:0;display:flex;flex-direction:column;gap:5px}.review-grid span{color:#8b9a90;font-size:9px}.review-grid strong{font-size:13px;font-weight:600;overflow-wrap:anywhere}.review-finish-edit{margin-top:22px}.review-assurance{background:#f5f7f3;display:flex;align-items:start;gap:14px;padding:17px 20px}.review-assurance span{color:#ce2435;font-size:24px;line-height:1}.review-assurance p{margin:0;color:#66736b;font-size:12px}.below-wizard{text-align:center;color:#79857e;font-size:12px;margin:24px 0 0}.below-wizard a{color:#bf2435;font-weight:700}.success-overlay{position:fixed;inset:0;z-index:200;background:rgba(17,29,26,.75);display:grid;place-items:center;padding:20px}.success-card{background:white;padding:50px;max-width:480px;text-align:center}.success-icon{display:grid;place-items:center;width:60px;height:60px;background:#e7f3eb;color:#32714c;border-radius:50%;font-size:27px;margin:0 auto 24px}.success-card h2{font-family:var(--font-display);font-size:32px;letter-spacing:-.05em}.success-card>p:not(.panel-eyebrow){color:#68746d;font-size:14px;margin-bottom:25px}.success-card .button{border:0;margin:auto}
@media(max-width:1000px){.wizard-shell{grid-template-columns:245px 1fr}.wizard-sidebar{padding:35px 24px}.wizard-main{padding:37px 32px}.intro-aside{display:none}}@media(max-width:720px){.order-page{padding:50px 0 70px}.order-intro{margin-bottom:30px}.order-intro h1{font-size:clamp(43px,10vw,65px)}.wizard-shell{display:block}.wizard-sidebar{display:none}.wizard-main{padding:27px 20px 32px}.mobile-progress{display:block;margin-bottom:30px;font-size:10px;font-weight:800;letter-spacing:.12em;color:#7c8a80}.mobile-progress>span:nth-child(2){float:right;color:#ce2435}.progress-track{height:3px;background:#e5eae3;margin-top:14px}.progress-track>div{height:100%;background:#ce2435;transition:width .3s}.panel-heading h2{font-size:29px}.field-grid,.review-grid{grid-template-columns:1fr;gap:19px}.field-full{grid-column:auto}.job-block,.review-block{padding:19px}.wizard-actions{margin-top:30px}.next-button{min-width:145px}.success-card{padding:34px 23px}}

.add-project-help{font-size:12px;color:#78827a;margin:0 0 12px}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
</style>
