export function getCompressedFilename(filename: string, maxLength: number = 30): string {
  if (filename.length <= maxLength) return filename

  const extensionIndex = filename.lastIndexOf('.')
  const hasExtension = extensionIndex > 0 && extensionIndex < filename.length - 1
  const name = hasExtension ? filename.slice(0, extensionIndex) : filename
  const extension = hasExtension ? filename.slice(extensionIndex) : ''

  const sliceLength = maxLength - 3 - extension.length
  const start = name.slice(0, Math.ceil(sliceLength / 2))
  const end = name.slice(-Math.floor(sliceLength / 2))

  return `${start}...${end}${extension}`
}