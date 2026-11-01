import test from 'node:test'
import assert from 'node:assert/strict'
import { buildOrderFormData } from '../app/utils/orderFormData.ts'

const project = (jobName) => ({
  jobName,
  quantity: 100,
  pages: 4,
  size: 'A4',
  paperInside: '',
  paperCover: '',
  finishingOptions: {
    binding: 'saddle-stitch',
    additionalOptions: ['die-cutting', 'embossing'],
    surfaceFinish: 'lamination:gloss'
  }
})

test('multipart fields put binary files in the top-level ASP.NET List<IFormFile> uploadFiles', async () => {
  const logo = new File([Uint8Array.of(0, 127, 255)], 'brand-logo.png', { type: 'image/png' })
  const artwork = new File(['print-ready'], 'artwork.pdf', { type: 'application/pdf' })
  const form = buildOrderFormData({
    customer: 'Acme Print',
    noOfJobs: 2,
    jobRequests: [project('Brochure'), project('Booklet')],
    uploadFiles: [logo, artwork]
  })

  assert.equal(form.get('customer'), 'Acme Print')
  assert.equal(form.get('noOfJobs'), '2')
  assert.equal(form.get('jobRequests[0].jobName'), 'Brochure')
  assert.equal(form.get('jobRequests[1].jobName'), 'Booklet')
  assert.equal(form.get('jobRequests[0].finishingOptions.binding'), 'saddle-stitch')
  assert.equal(form.get('jobRequests[0].finishingOptions.additionalOptions[1]'), 'embossing')
  assert.equal(form.get('jobRequests[0].finishingOptions.surfaceFinish'), 'lamination:gloss')

  const files = form.getAll('uploadFiles')
  assert.equal(files.length, 2)
  assert.equal(files[0].name, 'brand-logo.png')
  assert.equal(files[0].type, 'image/png')
  assert.deepEqual(new Uint8Array(await files[0].arrayBuffer()), Uint8Array.of(0, 127, 255))
  assert.equal(files[1].name, 'artwork.pdf')
  assert.equal(form.has('jobRequests[0].uploadFiles'), false)

  const request = new Request('https://example.test', { method: 'POST', body: form })
  assert.match(request.headers.get('content-type'), /^multipart\/form-data; boundary=/)
})

test('an order with no files still sends its other form fields', () => {
  const form = buildOrderFormData({ customer: 'G-PAK', jobRequests: [project('Labels')], uploadFiles: [] })
  assert.equal(form.get('jobRequests[0].jobName'), 'Labels')
  assert.equal(form.has('uploadFiles'), false)
})
