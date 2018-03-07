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

    const commandNextTrack = vscode.commands.registerCommand("itunes.nextTrack", () => {
        player.nextTrack();
    });

    const commandPreviousTrack = vscode.commands.registerCommand("itunes.previousTrack", () => {
        player.previousTrack();
    });

    const commandOpen = vscode.commands.registerCommand("itunes.open", () => {
        player.open();
    });

    context.subscriptions.push( player );
    context.subscriptions.push( commandPlay );
    context.subscriptions.push( commandPause );
    context.subscriptions.push( commandNextTrack );
    context.subscriptions.push( commandPreviousTrack );
    context.subscriptions.push( commandOpen );
}

// this method is called when your extension is deactivated
export function deactivate() {
    Player.Instance.dispose();
}
