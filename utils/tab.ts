export async function gotoTab<T>(
  path: string,
  data: T & { [key: string]: string }
) {
  const url = new URL(chrome.runtime.getURL(`/tabs/${path}`))
  for (const [key, value] of Object.entries(data)) {
    url.searchParams.append(key, value)
  }
  chrome.tabs.create({ url: url.toString() })
}

export function tabHref<T>(path: string, data: T & { [key: string]: string }) {
  const url = new URL(chrome.runtime.getURL(`/tabs/${path}`))
  for (const [key, value] of Object.entries(data)) {
    url.searchParams.append(key, value)
  }
  return url.toString()
}
