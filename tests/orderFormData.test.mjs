import test from 'node:test'
import assert from 'node:assert/strict'
import { buildOrderFormData } from '../app/utils/orderFormData.ts'

const project = (jobName, uploadFiles = []) => ({
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
  },
  uploadFiles
})

test('multipart fields use ASP.NET Core nested collection binding names', async () => {
  const logo = new File([Uint8Array.of(0, 127, 255)], 'brand-logo.png', { type: 'image/png' })
  const artwork = new File(['print-ready'], 'artwork.pdf', { type: 'application/pdf' })
  const secondProject = new File(['cover'], 'cover.svg', { type: 'image/svg+xml' })
  const form = buildOrderFormData({
    customer: 'Acme Print',
    noOfJobs: 2,
    jobRequests: [project('Brochure', [logo, artwork]), project('Booklet', [secondProject])]
  })

  assert.equal(form.get('customer'), 'Acme Print')
  assert.equal(form.get('noOfJobs'), '2')
  assert.equal(form.get('jobRequests[0].jobName'), 'Brochure')
  assert.equal(form.get('jobRequests[1].jobName'), 'Booklet')
  assert.equal(form.get('jobRequests[0].finishingOptions.binding'), 'saddle-stitch')
  assert.equal(form.get('jobRequests[0].finishingOptions.additionalOptions[1]'), 'embossing')
  assert.equal(form.get('jobRequests[0].finishingOptions.surfaceFinish'), 'lamination:gloss')

  const files = form.getAll('jobRequests[0].uploadFiles')
  assert.equal(files.length, 2)
  assert.equal(files[0].name, 'brand-logo.png')
  assert.equal(files[0].type, 'image/png')
  assert.deepEqual(new Uint8Array(await files[0].arrayBuffer()), Uint8Array.of(0, 127, 255))
  assert.equal(files[1].name, 'artwork.pdf')
  assert.equal(form.getAll('jobRequests[1].uploadFiles')[0].name, 'cover.svg')
  assert.equal(form.has('jobRequests[0].uploadFiles[0]'), false)

  const request = new Request('https://example.test', { method: 'POST', body: form })
  assert.match(request.headers.get('content-type'), /^multipart\/form-data; boundary=/)
})

test('an order with no files still sends its other form fields', () => {
  const form = buildOrderFormData({ customer: 'G-PAK', jobRequests: [project('Labels')] })
  assert.equal(form.get('jobRequests[0].jobName'), 'Labels')
  assert.equal(form.has('jobRequests[0].uploadFiles'), false)
})
