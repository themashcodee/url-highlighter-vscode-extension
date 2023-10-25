import * as vscode from "vscode"
import { parse } from "qs"

export const getParamsFromUrl = (url: string) => {
	const params = url.split("?").splice(1).join("?")
	if (!params) return JSON.stringify({}, null, 4)
	return JSON.stringify(parse(params), null, 4)
}

type Payload = {
	url: string
	start: vscode.Position
	end: vscode.Position
}
export function getBaseUrlRange(params: Payload) {
	const { end, start, url } = params

	if (!url.includes("?")) {
		return [{ range: new vscode.Range(start, end) }]
	}

	const baseUrl = url.split("?")[0]
	const endPos = start.with(start.line, start.character + baseUrl.length + 1)
	return [{ range: new vscode.Range(start, endPos) }]
}
export function getParamsRange(params: Payload) {
	const { start, url } = params

	if (!url.includes("?")) {
		return {
			keys: [] as vscode.DecorationOptions[],
			values: [] as vscode.DecorationOptions[],
			characters: [] as vscode.DecorationOptions[],
		}
	}

	const paramsString =url.split("?").splice(1).join("?")
	const queries = paramsString.split("&")
	const keys: vscode.DecorationOptions[] = []
	const values: vscode.DecorationOptions[] = []
	const characters: vscode.DecorationOptions[] = []

	queries.forEach((query) => {
		const key = query.split("=")[0]
		const value  = query.split("=").splice(1).join("=")

		const keyStartPos = start.with(
			start.line,
			start.character + url.indexOf(key)
		)
		const keyEndPos = start.with(
			start.line,
			start.character + url.indexOf(key) + key.length
		)

		const valueStatPos = start.with(
			start.line,
			start.character + url.indexOf(key) + key.length + 1
		)
		const valueEndPos = start.with(
			start.line,
			start.character + url.indexOf(key) + key.length + 1 + value.length
		)

		const charStartPos = start.with(
			start.line,
			start.character + url.indexOf(key) + key.length
		)
		const charEndPos = start.with(
			start.line,
			start.character + url.indexOf(key) + key.length + 1
		)

		keys.push({ range: new vscode.Range(keyStartPos, keyEndPos) })
		values.push({ range: new vscode.Range(valueStatPos, valueEndPos) })
		characters.push({ range: new vscode.Range(charStartPos, charEndPos) })
	})

	const andSignCharacters = url.matchAll(/&/g)
	for (const match of andSignCharacters) {
		if (match.index === undefined) continue
		const charStartPos = start.with(start.line, start.character + match.index)
		const charEndPos = start.with(start.line, start.character + match.index + 1)
		characters.push({ range: new vscode.Range(charStartPos, charEndPos) })
	}

	return { keys, values, characters }
}
