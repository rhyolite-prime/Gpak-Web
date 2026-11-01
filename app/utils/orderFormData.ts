import type { OrderRequest } from '~/models'

/**
 * Flatten the order into ASP.NET Core [FromForm] field names. Array indexes
 * bind jobRequests and additionalOptions. The top-level List<IFormFile>
 * binds from repeated multipart parts named exactly "uploadFiles".
 */
export function buildOrderFormData(order: OrderRequest): FormData {
  const form = new FormData()

  function append(path: string, value: unknown) {
    if (value == null) return
    if (value instanceof Blob) {
      form.append(path, value, value instanceof File ? value.name : 'file')
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof Blob) append(path, item)
        else append(`${path}[${index}]`, item)
      })
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([key, item]) => append(path ? `${path}.${key}` : key, item))
    } else {
      form.append(path, String(value))
    }
  }

  append('', order)
  return form
}
