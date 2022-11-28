import * as vscode from "vscode"
import { decorations } from "../decorator"
import { getParamsFromUrl } from "../helpers"

const colorizeUrls = (editor: vscode.TextEditor, text: string): void => {
	if (!text.includes("http")) {
		editor.setDecorations(decorations.link, [])
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
			`<p><b>URL Params</b>\n\n<code>${getParamsFromUrl(url)}</code></p>`
		)
		content.supportHtml = true

		content.isTrusted = true
		return {
			range: new vscode.Range(startPos, endPos),
			hoverMessage: content,
		} as vscode.DecorationOptions
	})

	editor.setDecorations(decorations.link, ranges)
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
