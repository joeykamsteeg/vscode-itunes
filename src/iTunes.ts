import ITrack from "./ITrack";
import * as util from "util";
import { exec } from "child_process";
import * as applescript from "applescript";
import * as path from "path";
import { window } from "vscode";
import vscode = require("vscode");
import { release, userInfo } from "os";
import { env } from "process";
import * as os from "os";
import * as fs from "fs";
import Config from "./Config";

export default class iTunes {

    private _application = "itunes";

    constructor(){
        const version = release();
        const majorVersion = version.split(".")[0] || 0;
        if( majorVersion >= 19 ){
            this._application = "music";
        }
    }

    public getAppState(): Promise<{}> {
        return this.executeScript("appState");
    }

    public getCurrentTrack(): Promise<{}> {
        return this.executeScript("currentTrack", false);
    }

    public play(): void {
        this.executeScript("play");
    }

    public pause(): void {
        this.executeScript("pause");
    }

    public nextTrack(): void {
        this.executeScript("nextTrack");
    }

    public previousTrack(): void {
        this.executeScript("previousTrack");
    }

    public open(): void {
        this.executeScript("open");
    }

    public unmute(): void {
        this.executeScript("unmute");
    }

    public mute(): void {
        this.executeScript("mute");
    }

    public like(): void {
        this.executeScript("likeTrack");
    }

    public dislikeTrack(): void {
        this.executeScript("dislikeTrack");
    }

    public dislikeTrackAndSkip(): void {
        this.executeScript("dislikeTrackAndSkip");
    }
    
    public shuffle( enable: boolean ): void {
        if( enable === true ) {
            this.executeScript("shuffleOn");
        } else {
            this.executeScript("shuffleOff");
        }
    }

    public addTrack(): void {
        this.executeScript("addToLibrary");
    }

    public setRepeat( repeat: string ): void {
        this.executeScript(`repeatSet${repeat}`)
            .then( ( result ) => {
                if( result == null ){
                    window.showErrorMessage("Visual Studio Code hasn't access to Accessibilty of your macOS. Please enable at System Preferences -> Security & Privacy");
                }
            })
            .catch( () => {
                window.showErrorMessage("Visual Studio Code hasn't access to Accessibilty of your macOS. Please enable at System Preferences -> Security & Privacy");
            });
    }

    private getScript( filename, app: string = "music", language: string = "en" ): string {
        const file = path.resolve(__dirname, `../../scripts/${app}/${language}/${filename}.applescript`);
        if ( fs.existsSync( file ) ) {
            return file;
        }

        return path.resolve(__dirname, `../../scripts/${app}/en/${filename}.applescript`);
    }

    private executeScript( filename: string, isJson: boolean = true ) : Promise<{}>{
        return new Promise( ( resolve, reject ) => {
            const language = Config.Instance.getLanguageOverride();
            const script = this.getScript( filename, this._application, language );
            applescript.execFile( script, ( err, result ) => {
                if( err ){
                    reject( err );
                }

                if( result != null ){
                    try {
                        if( isJson === true ) {
                            const parsedString = JSON.parse( result.toString() );
                            resolve( parsedString );
                        } else {
                            resolve( result );
                        }
                    }catch( exception ){ }
                }else{
                    resolve({});
                }
            });
        });
    }
}
