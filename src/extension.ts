import * as vscode from "vscode"
import { decorationType } from "./decorator"
import { getParamsFromUrl, jsonToString } from "./helpers"

const colorizeUrls = (editor: vscode.TextEditor, text: string): void => {
	if (!text.includes("http")) {
		editor.setDecorations(decorationType, [])
		return
	}

	const urlRegex = /(https?:\/\/[^\s,',"]+)/g
	const matches = [...text.matchAll(urlRegex)]

	const ranges = matches.map((match) => {
		const index = match.index ?? 0
		const [url] = match
		const startPos = editor.document.positionAt(index)
		const endPos = editor.document.positionAt(index + url.length)

		const content = new vscode.MarkdownString(
			`<p><b>URL Params</b>\n\n<code>${jsonToString(
				getParamsFromUrl(url)
			)}</code></p>`
		)
		content.supportHtml = true

		content.isTrusted = true
		return {
			range: new vscode.Range(startPos, endPos),
			hoverMessage: content,
		} as vscode.DecorationOptions
	})

	editor.setDecorations(decorationType, ranges)
}

export function activate(context: vscode.ExtensionContext) {
	const editor = vscode.window.activeTextEditor

	if (editor) {
		colorizeUrls(editor, editor.document.getText())
	}

	vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (editor) {
			colorizeUrls(editor, editor.document.getText())
		}
	})

	vscode.workspace.onDidChangeTextDocument((event) => {
		const editor = vscode.window.activeTextEditor
		if (editor) {
			colorizeUrls(editor, event.document.getText())
		}
	})
}

export function deactivate() {
	console.log("URL Highlighter deactivated!")
}
