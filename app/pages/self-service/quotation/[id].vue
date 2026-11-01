<template>
  <div class="quote-page-wrapper">
    <div class="quote-container">
      <!-- Loader -->
      <div v-if="isLoading" class="loader-wrapper">
        <div class="loader"></div>
      </div>
      
      <div v-else-if="quotation" class="quote-content">
        <!-- Status Message -->
        <div v-if="quotation.status === 'Customer Approved' || quotation.status === 'Customer Rejected'" class="status-message no-print" :class="quotation.status === 'Customer Approved' ? 'status-approved' : 'status-rejected'">
          <div class="status-icon" v-if="quotation.status === 'Customer Approved'">&#10003;</div>
          <div class="status-icon" v-else>&#10005;</div>
          <div class="status-text">
            <h4 class="status-title">{{ quotation.status === 'Customer Approved' ? 'Quotation Approved' : 'Quotation Declined' }}</h4>
            <p>An action has already been taken on this quotation.</p>
          </div>
        </div>

        <!-- Quotation Header -->
        <div class="quote-header">
          <div class="header-left">
            <p class="date">{{ currentDate }}</p>
            <p class="quote-no">QUOTATION NO. <span class="quote-no-val">{{ quotation.quotationNumber || '(GENERATED ON SAVE)' }}</span></p>
            <div class="greeting">
              <p>Dear Sir,</p>
              <p>We thank you for your enquiry and have the pleasure in submitting our quotation as follows:</p>
            </div>
          </div>

          <div class="header-right">
            <img src="/img/gpak.jpeg" alt="G-PAK Limited Logo" class="logo" />
            <div class="company-info">
              <p class="company-title">Subsidiary of the Graphic Communications Group Limited</p>
              <p>No. 3 Graphic Road, P.O. Box GP 742, Accra, Ghana</p>
              <p>Tel: +233 302 684 000</p>
              <p>Direct: +233 302 666 052 / +233 302 674 071</p>
              <p>Fax: +233 302 675 364  E-mail: gpak@graphic.com.gh</p>
            </div>
          </div>
        </div>

        <div class="client-name">
          {{ quotation.businessName }}
        </div>

        <!-- Table -->
        <table class="quote-table">
          <thead>
            <tr>
              <th class="col-desc">DESC.</th>
              <th class="col-size">Size(MM)</th>
              <th class="col-paper">Paper GSM</th>
              <th class="col-colour">COLOUR</th>
              <th class="col-qty text-center">QTY</th>
              <th class="col-unit text-right">UNIT (GH¢)</th>
              <th class="col-tax text-right">{{ nhilTaxRate }}%<br>NHIL/GETF/COVID</th>
              <th class="col-vat text-right">{{ vatTaxRate }}%<br>VAT</th>
              <th class="col-total text-right">TOTAL (GH¢)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in quotation.details" :key="index">
              <td class="col-desc font-bold whitespace-pre-wrap">{{ item.itemName }}</td>
              <td class="col-size whitespace-pre-wrap">{{ item.size }}</td>
              <td class="col-paper whitespace-pre-wrap">{{ item.paperGsm }}</td>
              <td class="col-colour whitespace-pre-wrap">{{ item.colour }}</td>
              <td class="col-qty text-center">{{ item.quantity }}</td>
              <td class="col-unit text-right">{{ formatCurrency(item.unitPrice) }}</td>
              <td class="col-tax text-right">{{ formatCurrency(item.getflNhil) }}</td>
              <td class="col-vat text-right">{{ formatCurrency(item.vatTax) }}</td>
              <td class="col-total text-right font-bold">{{ formatCurrency(item.unitPrice || 0) }}</td>
            </tr>
            <tr class="row-total">
               <td colspan="8" class="text-right label-total font-bold uppercase">Total Amount</td>
               <td class="text-right val-total font-bold">{{ formatCurrency(quotation.quotedPrice) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Additional Details Readonly -->
        <div class="details-section">
          <div class="detail-row">
            <div class="detail-label">SPECIFICATION:</div>
            <div class="detail-value">{{ quotation.specification || 'N/A' }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">ORIGINATION:</div>
            <div class="detail-value">{{ quotation.origination || 'N/A' }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">TERMS:</div>
            <div class="detail-value">{{ quotation.terms || 'N/A' }}</div>
          </div>
          
          <div class="detail-row row-validity">
            <div class="detail-label">VALIDITY:</div>
            <div class="detail-value" style="flex-grow: 0; width: 200px;">
              <span v-if="quotation.validUntil && quotation.validUntil.length > 0">{{ quotation.validityInDays }} Days</span>
              <span v-else>N/A</span>
            </div>
          </div>
        </div>

        <!-- Signatories (Moved before Legal like in screenshot 1?) 
             Wait, screenshot 1 shows Signatories at the bottom, but above the buttons. 
             Screenshot 2 shows Legal text, then Bank details, then Signatures at the bottom.
        -->

        <!-- Legal and Bank Details -->
        <div class="legal-section">
          <p class="legal-text italic font-medium">
            This Quotation is given subject to any revision in price and the availability of materials the Standard Conditions of the Printing Trade and such Conditions shall be deemed to be embodied in any Contract arising out of this Estimate and the acceptance thereof, unless otherwise provided. Quantities stated above are subject to a +/-5% change.
          </p>
          <p class="legal-text font-bold italic mt-sm">Prices quoted include statutory charges. (VAT)</p>
          
          <div class="bank-details">
            <p class="italic uppercase">TRANSFER</p>
            <p class="italic uppercase font-medium">BANK: G-PAK LIMITED</p>
            <p class="italic ml-indent">GCB Bank Limited</p>
            <p class="italic ml-indent">High Street; 1011130028940</p>
            <p class="italic uppercase font-medium mt-xs">MOMO: 0241982631 (G-PAK LIMITED)</p>
            <p class="font-bold italic mt-sm">Kindly indicate your name when making a transfer for easy acknowledgment of receipt.</p>
          </div>
          
          <p class="legal-text italic mt-md">We trust we shall be favoured with your esteemed order, which will receive our prompt and careful attention.</p>
          
          <div class="sign-off">
            <p class="italic">Yours faithfully,</p>
            <p class="italic">for G- Pak Limited.</p>
          </div>
        </div>

        <!-- Signatures -->
        <div class="signatures-grid">
          <div v-for="(sig, index) in (quotation.signatories || [])" :key="index" class="signature-block" :class="{'align-right': index === 1}">
            <div v-if="sig.signatureImageUrl" class="signature-img-wrapper">
               <img :src="sig.signatureImageUrl" class="signature-img" />
            </div>
            <div class="signature-line"></div>
            <p class="sig-name">{{ sig.name }}</p>
            <p class="sig-title">({{ sig.designation }})</p>
            <p class="sig-phone" v-if="sig.phoneNo">({{ sig.phoneNo }})</p>
          </div>
        </div>

        <!-- Actions based on url params -->
        <div v-if="(action === 'approve' || action === 'reject') && quotation.status !== 'Customer Approved' && quotation.status !== 'Customer Rejected'" class="actions-section no-print">
           <div v-if="action === 'approve'" class="action-approve">
               <button @click="$router.back()" class="btn-outline">Cancel</button>
               <button @click="handleActionCall" :disabled="isSubmitting" class="btn-success">
                   <span v-if="isSubmitting" class="spinner"></span>
                   Approve Quotation
               </button>
           </div>

           <div v-else-if="action === 'reject'" class="action-reject">
               <div class="reject-reason-wrapper">
                  <label>Reason for Rejection</label>
                  <textarea v-model="rejectReason" class="reject-textarea" placeholder="Please provide a reason for rejecting this quotation..."></textarea>
               </div>
               <div class="action-buttons">
                   <button @click="$router.back()" class="btn-outline">Cancel</button>
                   <button @click="handleActionCall" :disabled="isSubmitting || !rejectReason.trim()" class="btn-danger">
                       <span v-if="isSubmitting" class="spinner"></span>
                       Reject Quotation
                   </button>
               </div>
           </div>
        </div>
        
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <p>Quotation details could not be loaded.</p>
      </div>
    </div>

    <!-- Modal for Success/Failure -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div v-if="modalState === 'success'" class="modal-icon success-icon">
          &#10003;
        </div>
        <div v-else class="modal-icon error-icon">
          &#10005;
        </div>
        
        <h3 class="modal-title">{{ modalTitle }}</h3>
        <p class="modal-desc">{{ modalMessage }}</p>
        
        <button @click="closeModal" class="btn-modal-close">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getQuotationDetails, approveQuotation, rejectQuotation } from '~/services/productionOrder';
import type { Quotation } from '~/models';

const route = useRoute();
const router = useRouter();
const quotationId = route.params.id as string;
const action = computed(() => route.query.action as string);

const isLoading = ref(true);
const isSubmitting = ref(false);
const quotation = ref<Quotation | null>(null);
const rejectReason = ref('');

// Modal State
const showModal = ref(false);
const modalState = ref<'success' | 'error'>('success');
const modalTitle = ref('');
const modalMessage = ref('');

const currentDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options).toUpperCase();
});

const nhilTaxRate = computed(() => {
  if (!(quotation.value as any)?.taxes) return 6;
  const tax = (quotation.value as any).taxes.find((t: any) => t.taxName.includes('NHIL') || t.taxName.includes('GETFUND') || t.taxName.includes('COVID'));
  return tax ? tax.rate : 6;
});

const vatTaxRate = computed(() => {
  if (!(quotation.value as any)?.taxes) return 15;
  const tax = (quotation.value as any).taxes.find((t: any) => t.taxName.includes('VAT'));
  return tax ? tax.rate : 15;
});

const formatCurrency = (value: number) => {
  if (value == null) return '0.00';
  return value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatNumber = (value: number) => {
  if (value == null || isNaN(value)) return '0';
  return value.toLocaleString('en-US');
};

const loadData = async () => {
  if (!quotationId) {
    isLoading.value = false;
    return;
  }
  
  try {
    isLoading.value = true;
    const data = await getQuotationDetails(quotationId);
    if (data && data.quotationInfo) {
      quotation.value = data.quotationInfo;
    }
  } catch (error) {
    console.error('Error fetching quotation:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleActionCall = async () => {
  if (!quotation.value) return;
  
  isSubmitting.value = true;
  try {
    let result: any;
    if (action.value === 'approve') {
       result = await approveQuotation(quotation.value.id);
    } else if (action.value === 'reject') {
       result = await rejectQuotation({ id: quotation.value.id, reason: rejectReason.value });
    }
    
    if (result && result.success !== false) {
       modalState.value = 'success';
       modalTitle.value = action.value === 'approve' ? 'Quotation Approved' : 'Quotation Rejected';
       modalMessage.value = action.value === 'approve' ? 'Thank you. The quotation has been successfully approved.' : 'The quotation has been rejected. Thank you for your feedback.';
       showModal.value = true;
    } else {
       throw new Error('API reported failure');
    }
  } catch (error) {
    console.error('Error processing quotation action:', error);
    modalState.value = 'error';
    modalTitle.value = 'Action Failed';
    modalMessage.value = 'An error occurred while processing your request. Please try again.';
    showModal.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  router.push(`/self-service/quotation/${quotationId}`);
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

/* Reset global dark mode styles just for this page */
.quote-page-wrapper {
  background-color: #f3f4f6;
  min-height: 100vh;
  padding: 2rem 1rem;
}

.quote-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 3rem;
  background-color: #ffffff !important;
  color: #000000 !important;
  font-family: 'Sora', Arial, Helvetica, sans-serif;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.quote-container * {
  color: #000000; /* Override any global white text */
}

/* Typography */
.font-bold { font-weight: bold; }
.italic { font-style: italic; }
.uppercase { text-transform: uppercase; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Header */
.quote-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.header-left {
  padding-top: 1rem;
}

.date {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.quote-no {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.quote-no-val {
  font-weight: normal;
  font-style: italic;
  color: #666;
}

.greeting p {
  margin-bottom: 0.5rem;
}

.header-right {
  text-align: right;
  font-size: 0.75rem;
  line-height: 1.4;
}

.logo {
  height: 80px;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.company-title {
  font-weight: bold;
  font-style: italic;
  text-transform: uppercase;
}

.client-name {
  text-align: right;
  font-size: 1.25rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

/* Table */
.quote-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.quote-table th, .quote-table td {
  border: 1px solid #999;
  padding: 0.75rem;
  vertical-align: top;
}

.quote-table th {
  background-color: #f9f9f9;
  font-weight: bold;
  text-transform: uppercase;
}

.item-meta {
  color: #555;
}

.row-total td {
  border-top: 2px solid #999;
  font-weight: bold;
}
.val-total {
  font-size: 1.125rem;
}

/* Details Section */
.details-section {
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.detail-label {
  width: 150px;
  font-weight: bold;
  text-transform: uppercase;
  flex-shrink: 0;
  padding-top: 0.5rem;
}

.detail-value {
  flex-grow: 1;
  padding-top: 0.5rem;
  white-space: pre-wrap;
}

.row-validity {
  align-items: flex-start;
}

/* Legal and Bank */
.legal-section {
  font-size: 0.875rem;
  margin-bottom: 3rem;
}

.mt-sm { margin-top: 0.5rem; }
.mt-md { margin-top: 1.5rem; }
.mt-xs { margin-top: 0.25rem; }

.bank-details {
  margin: 1.5rem 0;
}

.ml-indent {
  margin-left: 3rem;
}

.sign-off {
  margin-top: 2rem;
}

/* Signatures */
.signatures-grid {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  margin-bottom: 2rem;
}

.signature-block {
  width: 250px;
}

.align-right {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signature-img-wrapper {
  height: 60px;
  margin-bottom: 0.5rem;
}
.signature-img {
  max-height: 100%;
  object-fit: contain;
}

.signature-line {
  border-bottom: 1px solid #000;
  width: 100%;
  margin-bottom: 0.5rem;
}

.sig-name { font-weight: bold; }

/* Actions */
.actions-section {
  border-top: 1px solid #eee;
  padding-top: 2rem;
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.action-approve, .action-buttons {
  display: flex;
  gap: 1rem;
}

.action-reject {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.reject-reason-wrapper {
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
}

.reject-reason-wrapper label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.reject-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 100px;
  font-family: inherit;
}

.btn-outline {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-outline:hover { background: #f9f9f9; }

.btn-success {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #10b981;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-success:hover { background: #059669; }
.btn-success:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-danger:hover { background: #dc2626; }
.btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Status Message */
.status-message {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.status-approved {
  background-color: #d1fae5;
  border: 1px solid #10b981;
  color: #065f46;
}
.status-rejected {
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  color: #991b1b;
}
.status-icon {
  font-size: 1.5rem;
  font-weight: bold;
}
.status-text p {
  margin: 0;
}
.status-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: bold;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 1.5rem;
}

.success-icon { background: #d1fae5; color: #10b981; }
.error-icon { background: #fee2e2; color: #ef4444; }

.modal-title { font-size: 1.5rem; font-weight: 900; color: #000; margin-bottom: 0.5rem; }
.modal-desc { color: #666; margin-bottom: 1.5rem; }

.btn-modal-close {
  width: 100%;
  padding: 0.75rem;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.btn-modal-close:hover { background: #111827; }

/* Loader */
.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
.loader {
  width: 48px;
  height: 48px;
  border: 4px solid #ef4444;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@media print {
  @page { margin: 0.5cm; }
  body { background: white; }
  .quote-page-wrapper { padding: 0; background: white; }
  .quote-container { box-shadow: none; padding: 0; }
  .no-print { display: none !important; }
}
</style>
