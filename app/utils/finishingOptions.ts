export interface FinishingSelection {
  binding: string
  bindingCustom: string
  addons: string[]
  addonsCustom: string
  laminate: string
  laminateCustom: string
  vanish: string
  vanishCustom: string
  spot: string
  spotCustom: string
  windowPatching: string
  windowPatchingCustom: string
}

const formatOption = (value: string) => value.trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

/** Convert the form's display labels into the API's finishingOptions contract. */
export function buildFinishingOptions(job: FinishingSelection) {
  const selected = (value: string, custom: string) =>
    formatOption(value === 'custom' ? custom || 'custom' : value)

  const surfaceGroups = [
    ['lamination', job.laminate, job.laminateCustom],
    ['varnish', job.vanish, job.vanishCustom],
    ['spot', job.spot, job.spotCustom],
    ['window-patching', job.windowPatching, job.windowPatchingCustom]
  ] as const
  const surface = surfaceGroups.find(([, value]) => !!value)

  return {
    Binding: selected(job.binding, job.bindingCustom),
    AdditionalOptions: job.addons.map(value => selected(value, job.addonsCustom)).filter(Boolean),
    SurfaceFinish: surface ? `${surface[0]}:${selected(surface[1], surface[2])}` : ''
  }
}
