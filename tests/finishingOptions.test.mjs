import test from 'node:test'
import assert from 'node:assert/strict'
import { buildFinishingOptions } from '../app/utils/finishingOptions.ts'

const blank = () => ({
  binding: '', bindingCustom: '', addons: [], addonsCustom: '',
  laminate: '', laminateCustom: '', vanish: '', vanishCustom: '',
  spot: '', spotCustom: '', windowPatching: '', windowPatchingCustom: ''
})

test('unselected finishing options have the expected empty API shape', () => {
  assert.deepEqual(buildFinishingOptions(blank()), {
    Binding: '', AdditionalOptions: [], SurfaceFinish: ''
  })
})

test('binding, add-ons and lamination use lower-case API values', () => {
  assert.deepEqual(buildFinishingOptions({
    ...blank(), binding: 'Saddle stitch', addons: ['Die cutting', 'Fold/Glue'], laminate: 'Gloss'
  }), {
    Binding: 'saddle-stitch', AdditionalOptions: ['die-cutting', 'fold-glue'], SurfaceFinish: 'lamination:gloss'
  })
})

test('varnish uses the requested category and selected label', () => {
  assert.equal(buildFinishingOptions({ ...blank(), vanish: 'Waterbase varnish' }).SurfaceFinish, 'varnish:waterbase-varnish')
})

test('custom choices retain their entered descriptions in slug form', () => {
  assert.deepEqual(buildFinishingOptions({
    ...blank(), binding: 'custom', bindingCustom: 'Hand sewn', addons: ['custom'], addonsCustom: 'Foil Stamping', spot: 'custom', spotCustom: 'Raised UV'
  }), {
    Binding: 'hand-sewn', AdditionalOptions: ['foil-stamping'], SurfaceFinish: 'spot:raised-uv'
  })
})
