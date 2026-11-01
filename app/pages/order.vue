<template>
  <div>
    <AppHeader />
    <main class="page-container pt-xl pb-xl">
      <div class="container">
        <div class="header text-center mb-xl">
          <h1 class="title">G-PAK LIMITED</h1>
          <h2 class="subtitle">SPECIFICATION FORM</h2>
        </div>

        <div class="form-wrapper glass-light">
          <form @submit.prevent="handleSubmit" class="spec-form" ref="formRef">
            
            <!-- Basic Info Section -->
            <h3 class="section-title text-center">BASIC INFO</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="customer">Business Name <span class="required">*</span></label>
                <input type="text" id="customer" v-model="v$.customer.$model" :class="{'error': v$.customer.$error}" placeholder="e.g. Esther Adjei" />
                <span class="error-msg" v-if="v$.customer.$error">Business name is required</span>
              </div>
              <div class="form-group">
                <label for="contactName">Contact Name <span class="required">*</span></label>
                <input type="text" id="contactName" v-model="v$.contactName.$model" :class="{'error': v$.contactName.$error}" />
                <span class="error-msg" v-if="v$.contactName.$error">Contact name is required</span>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="tel">Tel <span class="required">*</span></label>
                <input type="tel" id="tel" v-model="v$.phoneNo.$model" :class="{'error': v$.phoneNo.$error}" />
                <span class="error-msg" v-if="v$.phoneNo.$error">Valid phone number is required</span>
              </div>
              <div class="form-group">
                <label for="emailAddress">Email Address <span class="required">*</span></label>
                <input type="email" id="emailAddress" v-model="v$.emailAddress.$model" :class="{'error': v$.emailAddress.$error}" />
                <span class="error-msg" v-if="v$.emailAddress.$error">Valid email address is required</span>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="location">Location</label>
                <input type="text" id="location" v-model="v$.location.$model" />
              </div>
               
            </div>

            <hr class="divider" />

            <!-- Request Details Section -->
            <h3 class="section-title text-center">REQUEST DETAILS</h3>
            
            <div v-for="(job, index) in form.jobRequests" :key="index" class="job-card mb-lg p-md">
              
              <div class="flex justify-between items-center mb-md">
                <h4 class="job-title">Job Request {{ index + 1 }}</h4>
                <button type="button" @click="removeJob(index)" class="btn btn-danger btn-sm" v-if="form.jobRequests.length > 1">Remove Job</button>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label :for="'jobName-'+index">Job Name(s)</label>
                  <input type="text" :id="'jobName-'+index" v-model="job.jobName" placeholder="e.g. My First Copy Book" />
                </div>
                 <div class="form-group">
                  <label :for="'pages-'+index">Pages</label>
                  <input type="number" :id="'pages-'+index" v-model="job.pages" />
                </div>
              </div>

              <div class="form-grid">

                <div class="form-group">
                  <label :for="'coloursCover-'+index">No. of Colours Cover</label>
                  <select :id="'coloursCover-'+index" v-model="job.noOfColoursCover">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>

                

                <div class="form-group">
                  <label :for="'coloursText-'+index">No. of Colours Text</label>
                    <select :id="'coloursText-'+index" v-model="job.noOfColoursText">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>

              </div>

              <div class="form-grid">

                <div class="form-group">
                  <label :for="'paperInside-'+index">Paper Inside</label>
                  <select :id="'paperInside-'+index" v-model="job.paperInsideRawMaterialId" @change="updatePaperInside(job, $event.target.value)">
                    <option value="">Select Paper Inside</option>
                    <option v-for="rawMaterial in rawMaterialList" :key="rawMaterial.id" :value="rawMaterial.id"> 
                      {{ rawMaterial.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label :for="'paperInside-'+index">Paper Inside Variant</label>
                  <select :id="'paperInside-'+index" v-model="job.paperInsideVariant" :disabled="!job.paperInsideRawMaterialId || getPaperInsideVariants(job).length === 0">
                    <option value="">Select Paper Inside</option>
                    <option
                      v-for="variant in getPaperInsideVariants(job)"
                      :key="variant.name"
                      :value="variant.name">{{ variant.name }}
                    </option>
                  </select>
                </div>
 
              </div>

              <div class="form-grid">

                <div class="form-group">
                  <label :for="'paperCover-'+index">Paper Cover</label>
                  <select :id="'paperCover-'+index" v-model="job.paperCoverRawMaterialId" @change="updatePaperCover(job, $event.target.value)">
                    <option value="">Select Paper Cover</option>
                    <option v-for="rawMaterial in rawMaterialList" :key="rawMaterial.id" :value="rawMaterial.id"> 
                      {{ rawMaterial.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label :for="'paperCover-'+index">Paper Cover Variant</label>
                  <select :id="'paperCover-'+index" v-model="job.paperCoverVariant"  :disabled="!job.paperCoverRawMaterialId || getPaperCoverVariants(job).length === 0">
                    <option value="">Select Paper Variant</option>
                    <option
                      v-for="variant in getPaperCoverVariants(job)"
                      :key="variant.name"
                      :value="variant.name">{{ variant.name }}
                   </option>
                  </select>
                </div>

              </div>

              <div class="form-grid">

                <div class="form-group">
                  <label :for="'quantity-'+index">Quantity</label>
                  <input type="number" :id="'quantity-'+index" v-model="job.quantity" />
                </div>

                  <div class="form-group">
                  <label :for="'size-'+index">Size</label>
                  <select :id="'size-'+index" v-model="job.size">
                    <option value="">Select a size</option>
                    <option>A2 - 420 x 594mm</option>
                    <option>A3 - 297 x 420mm</option>
                    <option>A4 - 210 x 297mm</option>
                    <option>A5 - 148 x 210mm</option>
                    <option>Quarto - 180 x 240mm</option>
                    <option value="custom">Custom size</option>
                  </select>
                </div>
 
              </div>

              <div class="form-grid">
 
                <div class="form-group" v-if="job.size === 'custom'">
                  <label :for="'customSize-'+index">Custom Size <span class="required">*</span></label>
                  <input type="text" :id="'customSize-'+index" v-model="job.customSize" placeholder="e.g. 100 x 200mm" :class="{'error': v$.$error && !job.customSize}" />
                </div>
                
              </div>

               <!-- REWORKED FINISHING OPTIONS SECTION WITH SUB-GROUPS -->
                <div class="mt-md finishing-options-wrapper">
                  <h5 class="finishing-title mb-sm">Finishing Options</h5>
                  
                  <!-- Binding Section (Single Select) -->
                  <div class="finishing-category">
                    <h6 class="category-title">Binding</h6>
                    <div class="finishing-grid">
                      <div class="checkbox-group" v-for="option in bindingOptions" :key="option.id">
                        <label class="custom-radio">
                          <input 
                            type="radio" 
                            :name="'binding-' + index" 
                            :value="option.id" 
                            v-model="job.binding" 
                          />
                          <span class="radio-mark"></span>
                          <span class="label-text">{{ option.name }}</span>
                        </label>
                      </div>
                      <div class="checkbox-group custom-option">
                        <label class="custom-radio">
                          <input 
                            type="radio" 
                            :name="'binding-' + index" 
                            value="custom" 
                            v-model="job.binding" 
                          />
                          <span class="radio-mark"></span>
                          <span class="label-text">Custom</span>
                        </label>
                        <input 
                          v-if="job.binding === 'custom'" 
                          type="text" 
                          v-model="job.bindingCustom" 
                          placeholder="Enter custom binding..." 
                          class="custom-input mt-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Adds/Add-ons Section (Multiple Select) -->
                  <div class="finishing-category">
                    <h6 class="category-title">Adds / Add-ons</h6>
                    <div class="finishing-grid">
                      <div class="checkbox-group" v-for="option in addOptions" :key="option.id">
                        <label class="custom-checkbox">
                          <input 
                            type="checkbox" 
                            :value="option.id" 
                            v-model="job.addons" 
                          />
                          <span class="checkmark"></span>
                          <span class="label-text">{{ option.name }}</span>
                        </label>
                      </div>
                      <div class="checkbox-group custom-option">
                        <label class="custom-checkbox">
                          <input 
                            type="checkbox" 
                            value="custom" 
                            v-model="job.addons" 
                          />
                          <span class="checkmark"></span>
                          <span class="label-text">Custom</span>
                        </label>
                        <input 
                          v-if="job.addons.includes('custom')" 
                          type="text" 
                          v-model="job.addonsCustom" 
                          placeholder="Enter custom add-on..." 
                          class="custom-input mt-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <h5 class="finishing-title mb-lg mt-xl">Finishing</h5>
                  <div> 
                    <!-- Finishing Governance Notice -->
                    <p class="governance-notice mb-sm">
                      ⚠️ Please note: You can only select one option from Laminate, Vanish, Spot, or Window Patching.
                    </p>

                    <!-- Laminate Section (Single Select) -->
                    <div class="finishing-category">
                      <h6 class="category-title">Laminate</h6>
                      <div class="finishing-grid">
                        <div class="checkbox-group" v-for="option in laminateOptions" :key="option.id">
                          <label class="custom-radio">
                            <input 
                              type="radio" 
                              :name="'laminate-' + index" 
                              :value="option.id" 
                              v-model="job.laminate" 
                              @change="clearOtherFinishingOptions(job, 'laminate')"
                            />
                            <span class="radio-mark"></span>
                            <span class="label-text">{{ option.name }}</span>
                          </label>
                        </div>
                        <div class="checkbox-group custom-option">
                          <label class="custom-radio">
                            <input 
                              type="radio" 
                              :name="'laminate-' + index" 
                              value="custom" 
                              v-model="job.laminate" 
                              @change="clearOtherFinishingOptions(job, 'laminate')"
                            />
                            <span class="radio-mark"></span>
                            <span class="label-text">Custom</span>
                          </label>
                          <input 
                            v-if="job.laminate === 'custom'" 
                            type="text" 
                            v-model="job.laminateCustom" 
                            placeholder="Enter custom laminate..." 
                            class="custom-input mt-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Vanish Section (Single Select) -->
                    <div class="finishing-category">
                      <h6 class="category-title">Vanish</h6>
                      <div class="finishing-grid">
                        <div class="checkbox-group" v-for="option in vanishOptions" :key="option.id">
                          <label class="custom-radio">
                            <input 
                              type="radio" 
                              :name="'vanish-' + index" 
                              :value="option.id" 
                              v-model="job.vanish" 
                              @change="clearOtherFinishingOptions(job, 'vanish')"
                            />
                            <span class="radio-mark"></span>
                            <span class="label-text">{{ option.name }}</span>
                          </label>
                        </div>
                        <div class="checkbox-group custom-option">
                          <label class="custom-radio">
                            <input 
                              type="radio" 
                              :name="'vanish-' + index" 
                              value="custom" 
                              v-model="job.vanish" 
                              @change="clearOtherFinishingOptions(job, 'vanish')"
                            />
                            <span class="radio-mark"></span>
                            <span class="label-text">Custom</span>
                          </label>
                          <input 
                            v-if="job.vanish === 'custom'" 
                            type="text" 
                            v-model="job.vanishCustom" 
                            placeholder="Enter custom vanish..." 
                            class="custom-input mt-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Spot Section (Single Select) -->
                    <div class="finishing-category">
                      <h6 class="category-title">Spot</h6>
                      <div class="finishing-grid">
                        <div class="checkbox-group" v-for="option in spotOptions" :key="option.id">
                          <label class="custom-radio">
                            <input 
                              type="radio" 
                              :name="'spot-' + index" 
                              :value="option.id" 
                              v-model="job.spot" 
                              @change="clearOtherFinishingOptions(job, 'spot')"
                            />
                            <span class="radio-mark"></span>
                            <span class="label-text">{{ option.name }}</span>
                          </label>
                        </div>
                        <div class="checkbox-group custom-option">
                          <label class="custom-radio">
                            <input 
                              type="radio" 
                              :name="'spot-' + index" 
                              value="custom" 
                              v-model="job.spot" 
                              @change="clearOtherFinishingOptions(job, 'spot')"
                            />
                            <span class="radio-mark"></span>
                            <span class="label-text">Custom</span>
                          </label>
                          <input 
                            v-if="job.spot === 'custom'" 
                            type="text" 
                            v-model="job.spotCustom" 
                            placeholder="Enter custom spot..." 
                            class="custom-input mt-xs"
                          />
                        </div>
                      </div>
                    </div>
 
                    <!-- Window Patching (Radio - Single Select) -->
                  <div class="finishing-category">
                    <h6 class="category-title">Window Patching</h6>
                    <div class="finishing-grid">
                      <div class="checkbox-group">
                        <label class="custom-radio">
                          <input 
                            type="radio" 
                            :name="'window-patching-' + index" 
                            value="window-patching" 
                            v-model="job.windowPatching"
                            @change="clearOtherFinishingOptions(job, 'windowPatching')"
                          />
                          <span class="radio-mark"></span>
                          <span class="label-text">Window Patching</span>
                        </label>
                      </div>
                      <div class="checkbox-group custom-option">
                        <label class="custom-radio">
                          <input 
                            type="radio" 
                            :name="'window-patching-' + index" 
                            value="custom" 
                            v-model="job.windowPatching"
                            @change="clearOtherFinishingOptions(job, 'windowPatching')"
                          />
                          <span class="radio-mark"></span>
                          <span class="label-text">Custom</span>
                        </label>
                        <input 
                          v-if="job.windowPatching === 'custom'" 
                          type="text" 
                          v-model="job.windowPatchingCustom" 
                          placeholder="Enter custom window patching..." 
                          class="custom-input mt-xs"
                        />
                      </div>
                    </div>
                  </div>


                  </div>
                </div>

              <div class="form-group mt-xl">
                <label :for="'instructions-'+index">Other Instructions</label>
                <textarea :id="'instructions-'+index" v-model="job.otherInstructions" rows="3"></textarea>
              </div>
            </div>

            <div class="text-center">
              <button type="button" @click="addJob" class="btn btn-secondary mt-md">
                + Add Another Job Request
              </button>
            </div>

            <hr class="divider" />

            <!-- Submit Button -->
            <div class="submit-wrapper mt-xl">
              <button type="submit" class="btn btn-primary btn-lg w-full" :disabled="isSubmitting">
                <span v-if="isSubmitting">Submitting...</span>
                <span v-else>Submit Order</span>
              </button>
            </div>
            
            <div v-if="submitError" class="error-msg mt-md text-center">
              Failed to submit order. Please try again.
            </div>

          </form>
        </div>
      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="submitSuccess" class="modal-overlay">
      <div class="modal-content text-center">
        <div class="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#52c41a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 class="modal-title">Order Placed Successfully!</h3>
        <p class="modal-desc">Thank you for your order. An agent will contact you shortly to get the finer details on your order.</p>
        <button @click="closeModal" class="btn btn-primary mt-md px-xl">Close</button>
      </div>
    </div>
    <AppFooter />
  </div>
</template>



<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import type { OrderRequest, RawMaterial } from '~/models'
import { submitOrderRequest, getRawMaterials } from '~/services/productionOrder'

// Static finishing options with new sub-groups
const bindingOptions = [
  { id: 'saddle-stitch', name: 'Saddle stitch' },
  { id: 'perfect-bind', name: 'Perfect bind' },
  { id: 'case-bind', name: 'Case bind' },
  { id: 'wire-o', name: 'Wire O' },
  { id: 'spiral-bind', name: 'Spiral bind' },
  { id: 'side-stab', name: 'Side Stab' },
  { id: 'padding', name: 'Padding' }
]

const EMPTY_UUID = '00000000-0000-0000-0000-000000000000';

const addOptions = [
  { id: 'die-cutting', name: 'Die cutting' },
  { id: 'embossing', name: 'Embossing' },
  { id: 'folding', name: 'Folding' },
  { id: 'numbering', name: 'Numbering' },
  { id: 'perforating', name: 'Perforating' },
  { id: 'punching', name: 'Punching' },
  { id: 'cutting', name: 'Cutting' },
  { id: 'sewing', name: 'Sewing' },
  { id: 'fold-glue', name: 'Fold/Glue' },
  { id: 'glue', name: 'Glue' }
]

// New sub-groups
const laminateOptions = [
  { id: 'gloss', name: 'Gloss' },
  { id: 'matt', name: 'Matt' },
  { id: 'soft-touch', name: 'Soft Touch' },
  { id: 'saudy', name: 'Saudy' }
]

const vanishOptions = [
  { id: 'uv-vanish', name: 'UV Vanish' },
  { id: 'waterbase-vanish', name: 'Waterbase Vanish' },
  { id: 'oil-vanish', name: 'Oil Vanish' }
]

const spotOptions = [
  { id: '3d-matt', name: '3D Matt' },
  { id: '3d-gloss', name: '3D Gloss' },
  { id: '3d-pattern', name: '3D Pattern' }
]

const formRef = ref<HTMLFormElement | null>(null)

// Updated governance function for radio buttons
const clearOtherFinishingOptions = (job: any, selectedCategory: string) => {
  // Only clear if the user actually selected something
  const hasSelection = (value: any) => {
    if (Array.isArray(value)) return value.length > 0
    return value && value !== '' && value !== null && value !== undefined
  }

  // Check if the selected category has a value
  const currentValue = job[selectedCategory]
  if (!hasSelection(currentValue)) return

  // Clear other categories
  if (selectedCategory !== 'laminate' && job.laminate) {
    job.laminate = ''
    job.laminateCustom = ''
  }
  if (selectedCategory !== 'vanish' && job.vanish) {
    job.vanish = ''
    job.vanishCustom = ''
  }
  if (selectedCategory !== 'spot' && job.spot) {
    job.spot = ''
    job.spotCustom = ''
  }
  if (selectedCategory !== 'windowPatching' && job.windowPatching) {
    job.windowPatching = ''
    job.windowPatchingCustom = ''
  }
}

const getDefaultJob = () => ({
  jobName: '',
  size: '',
  customSize: '',
  quantity: 1,
  pages: 1,
  paperInside: '', // This will store the actual label name
  paperInsideRawMaterialId: '', // This will store the raw material ID for paper inside
  paperCover: '', // This will store the actual label name
  paperCoverVariant: '',
  paperInsideVariant: '',
  paperCoverRawMaterialId: '', // This will store the raw material ID for paper cover
  noOfColoursText: 1,
  noOfColoursCover: 1,
  binding: '',
  bindingCustom: '',
  addons: [],
  addonsCustom: '',
  laminate: '',
  laminateCustom: '',
  vanish: '',
  vanishCustom: '',
  spot: '',
  spotCustom: '',
  windowPatching: '',
  windowPatchingCustom: '',
  otherInstructions: ''
})

const rawMaterialList = ref<RawMaterial[]>([]);

const form = reactive<OrderRequest>({
  customer: '',
  contactName: '',
  phoneNo: '',
  location: '',
  emailAddress: '',
  noOfJobs: 1,
  jobRequests: [getDefaultJob()]
})

const rules = {
  customer: { required },
  contactName: { required },
  phoneNo: { required },
  location: {},
  emailAddress: { required, email }
}

const v$ = useVuelidate(rules, form)

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

// Helper function to get material name by ID
const getMaterialName = (id: string) => {
  const material = rawMaterialList.value.find(m => m.id === id)
  return material ? material.name : ''
}

// Helper function to get material ID by name
const getMaterialId = (name: string) => {
  const material = rawMaterialList.value.find(m => m.name === name)
  return material ? material.id : ''
}

// Watch for changes on paperInside selection
const updatePaperInside = (job: any, selectedId: string) => {
  if (selectedId) {
    const material = rawMaterialList.value.find(m => m.id === selectedId)
    job.paperInside = material ? material.name : ''
    job.paperInsideRawMaterialId = selectedId
  } else {
    job.paperInside = ''
    job.paperInsideRawMaterialId = ''
  }
}

// Watch for changes on paperCover selection
const updatePaperCover = (job: any, selectedId: string) => {
  if (selectedId) {
    const material = rawMaterialList.value.find(m => m.id === selectedId)
    job.paperCover = material ? material.name : ''
    job.paperCoverRawMaterialId = selectedId
  } else {
    job.paperCover = ''
    job.paperCoverRawMaterialId = ''
  }
}

// Initialize material names when raw materials are loaded
const initializeMaterialNames = () => {
  form.jobRequests.forEach(job => {
    if (job.paperInsideRawMaterialId) {
      job.paperInside = getMaterialName(job.paperInsideRawMaterialId)
    }
    if (job.paperCoverRawMaterialId) {
      job.paperCover = getMaterialName(job.paperCoverRawMaterialId)
    }
  })
}

const addJob = () => {
  form.jobRequests.push(getDefaultJob())
  form.noOfJobs = form.jobRequests.length
}

const removeJob = (index: number) => {
  if (form.jobRequests.length > 1) {
    form.jobRequests.splice(index, 1)
    form.noOfJobs = form.jobRequests.length
  }
}

const scrollToFirstError = () => {
  // Find all error inputs within the form
  const errorInputs = formRef.value?.querySelectorAll('.error, input.error, select.error, textarea.error')
  
  if (errorInputs && errorInputs.length > 0) {
    const firstError = errorInputs[0] as HTMLElement
    
    // Scroll to the element with smooth behavior
    firstError.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
    
    // Focus on the element
    if (firstError instanceof HTMLInputElement || 
        firstError instanceof HTMLSelectElement || 
        firstError instanceof HTMLTextAreaElement) {
      firstError.focus()
    }
    
    // Also add a subtle highlight effect
    firstError.style.transition = 'background-color 0.3s ease'
    firstError.style.backgroundColor = '#fff3cd'
    setTimeout(() => {
      firstError.style.backgroundColor = ''
    }, 2000)
  } else {
    // Fallback: scroll to top if no error elements found
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Helper function to find the first invalid field and scroll to it
const focusFirstInvalidField = () => {
  // Check Vuelidate errors
  if (v$.value.$invalid) {
    // Check each field in the rules
    const errorFields = ['customer', 'contactName', 'phoneNo', 'emailAddress']
    
    for (const field of errorFields) {
      // Use $anyDirty to check if the field has been touched and is invalid
      if (v$.value[field]?.$invalid && v$.value[field]?.$anyDirty) {
        const input = document.getElementById(field)
        if (input) {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' })
          input.focus()
          return
        }
      }
    }
  }

  // Check for custom size validation errors
  if (form.value.jobRequests.some(job => job.size === 'custom' && !job.customSize)) {
    const customSizeInputs = formRef.value?.querySelectorAll('[id$="customSize"]')
    if (customSizeInputs && customSizeInputs.length > 0) {
      const firstInvalid = customSizeInputs[0] as HTMLElement
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' })
      firstInvalid.focus()
      return
    }
  }

  // If no specific field found, use the generic error scroll
  scrollToFirstError()
}

// ── Variant helpers ───────────────────────────────────────────────────────────
const getVariantsForMaterial = (materialId: string): any[] => {
  const mat = rawMaterialList.value.find(m => m.id === materialId);
  return mat?.variants ?? [];
};

const getPaperCoverVariants = (job: ReturnType<typeof getDefaultJob>) =>
  getVariantsForMaterial(job.paperCoverRawMaterialId);

const getPaperInsideVariants = (job: ReturnType<typeof getDefaultJob>) =>
  getVariantsForMaterial(job.paperInsideRawMaterialId);


const handleSubmit = async () => {
  v$.value.$touch()
  
  // Only validate custom size if size is 'custom'
  const jobsValid = form.jobRequests.every(job => {
    if (job.size === 'custom' && !job.customSize) return false
    return true
  })

  if (v$.value.$invalid || !jobsValid) {
    console.log('Validation failed')
    
    // Wait for DOM to update with error classes, then scroll to first error
    await nextTick()
    focusFirstInvalidField()
    return
  }

  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false

  // Ensure paperInside and paperCover have the correct names before submitting
  form.jobRequests.forEach(job => {
    if (job.paperInsideRawMaterialId) {
      job.paperInside = getMaterialName(job.paperInsideRawMaterialId)
    }
    if (job.paperCoverRawMaterialId) {
      job.paperCover = getMaterialName(job.paperCoverRawMaterialId)
    }

    if (!job.paperCoverRawMaterialId) {
      job.paperCoverRawMaterialId = EMPTY_UUID
    }
    if (!job.paperInsideRawMaterialId) {
      job.paperInsideRawMaterialId = EMPTY_UUID
    }
  })


  try {
    const success = await submitOrderRequest(form)
    if (success) {
      submitSuccess.value = true
      Object.assign(form, {
        customer: '',
        contactName: '',
        phoneNo: '',
        location: '',
        emailAddress: '',
        noOfJobs: 1,
        jobRequests: [getDefaultJob()]
      })
      v$.value.$reset()
    } else {
      submitError.value = true
    }
  } catch (error) {
    console.error('Submission error:', error)
    submitError.value = true
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  submitSuccess.value = false
}

const getAllRawMaterials = async () => {
  let result = await getRawMaterials();
  rawMaterialList.value = result;
  // Initialize material names after loading
  initializeMaterialNames()
}

onMounted(async () => {
  await getAllRawMaterials();
})
</script>



<style scoped>
.job-card {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}
.flex { display: flex; }
.justify-between { justify-content: space-between; }
.items-center { align-items: center; }
.btn-danger { background-color: #ff4d4f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
.btn-danger:hover { background-color: #d9363e; }
.btn-sm { font-size: 0.85rem; }
.btn-secondary { background-color: #f0f0f0; color: #333; border: 1px solid #ccc; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
.btn-secondary:hover { background-color: #e4e4e4; }
.p-md { padding: var(--space-md); }
.mb-lg { margin-bottom: var(--space-lg); }
.mb-sm { margin-bottom: var(--space-sm); margin-top: 0; }
.mt-xs { margin-top: 6px; }

.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 120px;
}

.header {
  margin-bottom: var(--space-xl);
}

.title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: var(--space-xs);
  color: #333;
}

.subtitle {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  letter-spacing: 1px;
}

.form-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-xl);
  border-radius: var(--radius-lg, 12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-light {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
}

.required {
  color: var(--color-primary, #f1c50e);
}

input, textarea, select {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  border-radius: 6px;
  color: #333;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s ease;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--color-primary, #f1c50e);
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(241, 197, 14, 0.1);
}

input.error, select.error {
  border-color: #ff4d4f;
}

.error-msg {
  color: #ff4d4f;
  font-size: 0.85rem;
  margin-top: 4px;
}

.success-msg {
  color: #52c41a;
  font-size: 1rem;
  font-weight: 500;
}

.divider {
  border: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: var(--space-xl) 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: var(--space-lg);
  color: #333;
}

/* Finishing Options Styles */
.finishing-options-wrapper {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: var(--space-md);
}

.finishing-category {
  margin-top: var(--space-md);
}

.finishing-category:first-child {
  margin-top: 0;
}

.category-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #333;
  margin-bottom: var(--space-sm);
  padding-bottom: 4px;
  border-bottom: 2px solid rgba(241, 197, 14, 0.3);
}

.finishing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-sm);
}

.custom-option {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.custom-input {
  flex: 1;
  min-width: 200px;
}

/* Custom Radio */
.custom-radio {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  user-select: none;
}

.custom-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.radio-mark {
  height: 20px;
  width: 20px;
  background-color: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.custom-radio:hover input ~ .radio-mark {
  border-color: var(--color-primary, #f1c50e);
}

.custom-radio input:checked ~ .radio-mark {
  border-color: var(--color-primary, #f1c50e);
}

.custom-radio input:checked ~ .radio-mark:after {
  content: "";
  width: 10px;
  height: 10px;
  background: var(--color-primary, #f1c50e);
  border-radius: 50%;
}

/* Custom Checkbox */
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  user-select: none;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.governance-notice {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 8px 12px;
  color: #856404;
  font-size: 0.9rem;
}

.checkmark {
  height: 20px;
  width: 20px;
  background-color: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.custom-checkbox:hover input ~ .checkmark {
  border-color: var(--color-primary, #f1c50e);
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: var(--color-primary, #f1c50e);
  border-color: var(--color-primary, #f1c50e);
}

.custom-checkbox .checkmark:after {
  content: "";
  display: none;
  width: 5px;
  height: 10px;
  border: solid #000;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-top: -2px;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.label-text {
  color: rgba(0, 0, 0, 0.85);
  font-size: 0.95rem;
}

.job-title {
  font-weight: 700 !important;
  color: #1a1a1a !important;
  font-size: 1.1rem;
}

.finishing-title {
  font-weight: 700 !important;
  color: #1a1a1a !important;
  font-size: 1.05rem;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
}

.w-full {
  width: 100%;
}

@media (max-width: 767px) {
  .hide-mobile {
    display: none;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: var(--space-xl);
  border-radius: var(--radius-lg, 12px);
  max-width: 450px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: modalIn 0.3s ease-out;
}

.modal-icon {
  margin-bottom: var(--space-md);
  display: flex;
  justify-content: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: var(--space-sm);
}

.modal-desc {
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: var(--space-md);
}

.px-xl {
  padding-left: 32px;
  padding-right: 32px;
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>