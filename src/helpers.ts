export const getParamsFromUrl = (url: string): Record<string, string> => {
	const params: Record<string, string> = {}
	const urlParams = new URLSearchParams(url.split("?")[1])

	for (const [key, value] of urlParams) {
		params[key] = value
	}

	return params
}

export const jsonToString = (json: Record<string, string>): string => {
	const str = JSON.stringify(json, null, 3)
	return str.replace(/,/g, ",\n").replace(/{/g, "{\n").replace(/}/g, "\n}")
}
