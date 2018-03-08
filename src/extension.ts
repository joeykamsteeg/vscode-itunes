'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Player from './Player';
import Config from './Config';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const config = new Config();
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

    const commandRepeatOne = vscode.commands.registerCommand("itunes.repeat.set.one", () => {
        player.setRepeat("One");
    });

    const commandRepeatOff = vscode.commands.registerCommand("itunes.repeat.set.off", () => {
        player.setRepeat("Off");
    });

    const commandRepeatAll = vscode.commands.registerCommand("itunes.repeat.set.all", () => {
        player.setRepeat("All");
    });

    context.subscriptions.push( player );
    context.subscriptions.push( commandPlay );
    context.subscriptions.push( commandPause );
    context.subscriptions.push( commandNextTrack );
    context.subscriptions.push( commandPreviousTrack );
    context.subscriptions.push( commandOpen );
    context.subscriptions.push( commandRepeatOne );
    context.subscriptions.push( commandRepeatOff );
    context.subscriptions.push( commandRepeatAll );
}

// this method is called when your extension is deactivated
export function deactivate() {
    Player.Instance.dispose();
}
