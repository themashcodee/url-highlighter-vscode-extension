import * as vscode from "vscode"

export const decorations = {
	link: vscode.window.createTextEditorDecorationType({
		backgroundColor: "#222222",
		textDecoration: "none",
	}),
	base_url: vscode.window.createTextEditorDecorationType({
		color: "#777777",
	}),
	params_key: vscode.window.createTextEditorDecorationType({
		color: "#FEFFCD",
	}),
	params_value: vscode.window.createTextEditorDecorationType({
		color: "#B698F5",
	}),
	characters: vscode.window.createTextEditorDecorationType({
		color: "#777777",
	}),
}
