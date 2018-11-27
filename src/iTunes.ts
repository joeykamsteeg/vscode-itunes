import ITrack from "./ITrack";
import * as util from "util";
import { exec } from "child_process";
import * as applescript from "applescript";
import * as path from "path";
import { window } from "vscode";

export default class iTunes {

    constructor(){

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
    
    public shuffle( enable: boolean ): void {
        if( enable === true ) {
            this.executeScript("shuffleOn");
        } else {
            this.executeScript("shuffleOff");
        }
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

    private executeScript( filename: string, isJson: boolean = true ) : Promise<{}>{
        return new Promise( ( resolve, reject ) => {
            let file = path.resolve(__dirname, `../../scripts/${filename}.applescript`);
            applescript.execFile( file , ( err, result ) => {
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
