import * as vscode from "vscode"
import { decorations } from "./decorator"
import { getBaseUrlRange, getParamsFromUrl, getParamsRange } from "./helpers"

export function activate(context: vscode.ExtensionContext) {
	const highlighDisposable = vscode.commands.registerCommand(
		"extension.highlightUrl",
		() => {
			try {
				const editor = vscode.window.activeTextEditor
				if (!editor) return
				if (editor.selection.isEmpty) {
					vscode.window.showErrorMessage("Please select an url")
					return
				}

				const startPo = editor.selection.start
				const endPo = editor.selection.end
				const url = editor.document.getText(new vscode.Range(startPo, endPo))

				if (!url.includes("http")) {
					vscode.window.showErrorMessage("Please select an valid url")
					return
				}

				// SHOW OBJECT ON HOVER
				const paramsJson = getParamsFromUrl(url)
				const content = new vscode.MarkdownString(
					`<div><b>URL Params</b> (copied to your clipboard 🚀)\n\n<pre><code>${paramsJson}</code></pre></div>`
				)
				content.supportHtml = true
				content.isTrusted = true

				// COPYING PARAMS JSON TO CLIPBOARD
				vscode.env.clipboard.writeText(paramsJson)

				// SETTING BACKGROUND COLOR TO URL
				const linkRange = [
					{
						range: new vscode.Range(startPo, endPo),
						hoverMessage: content,
					} as vscode.DecorationOptions,
				]
				editor.setDecorations(decorations.link, linkRange)

				// SETTING COLOR TO BASE URL
				const baseUrlRange = getBaseUrlRange({
					end: endPo,
					start: startPo,
					url,
				})
				editor.setDecorations(decorations.base_url, baseUrlRange)

				// SETTING COLOR TO PARAMS
				const paramsRange = getParamsRange({
					end: endPo,
					start: startPo,
					url,
				})
				editor.setDecorations(decorations.params_key, paramsRange.keys)
				editor.setDecorations(decorations.params_value, paramsRange.values)
				editor.setDecorations(decorations.characters, paramsRange.characters)
			} catch (err) {
				vscode.window.showErrorMessage(
					"Something went wrong. Please try again."
				)
			}
		}
	)

	const unhighlightDisposable = vscode.commands.registerCommand(
		"extension.unhighlightUrl",
		() => {
			const editor = vscode.window.activeTextEditor
			if (!editor) return
			editor.setDecorations(decorations.link, [])
			editor.setDecorations(decorations.characters, [])
			editor.setDecorations(decorations.base_url, [])
			editor.setDecorations(decorations.params_key, [])
			editor.setDecorations(decorations.params_value, [])
		}
	)

	context.subscriptions.push(highlighDisposable)
	context.subscriptions.push(unhighlightDisposable)
}
export function deactivate() {
	console.log("URL Highlighter deactivated!")
}
