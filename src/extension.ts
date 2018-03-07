'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Player from './Player';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const player = new Player();

    const commandPlay = vscode.commands.registerCommand('itunes.play', () => {
        player.play();
    });

    const commandPause = vscode.commands.registerCommand('itunes.pause', () => {
        player.pause();
    });

    context.subscriptions.push( player );
    context.subscriptions.push( commandPlay );
    context.subscriptions.push( commandPause );
}

// this method is called when your extension is deactivated
export function deactivate() {
    Player.Instance.dispose();
}
