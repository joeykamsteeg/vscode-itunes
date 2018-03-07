import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from "vscode";
import iTunes from "./iTunes";
import ITrack from "./ITrack";

export default class Player {

    public static Instance: Player;

    private iTunes: iTunes;
    private statusBarItem: StatusBarItem = null;
    private playerButton: StatusBarItem = null;
    private updateInterval: NodeJS.Timer;

    constructor() {
        Player.Instance = this;

        this.iTunes = new iTunes();

        this.createStatusBarItem();

        this.onUpdate = this.onUpdate.bind( this );
        this.updateInterval = setInterval( this.onUpdate, 1000 );

        this.updateStatusBarItem();
    }

    private onUpdate(){
        this.updateStatusBarItem();
    }

    private createStatusBarItem(){
        this.statusBarItem = window.createStatusBarItem( StatusBarAlignment.Left );
        this.statusBarItem.show();
        
        this.playerButton = window.createStatusBarItem( StatusBarAlignment.Left );
        this.playerButton.show();
    }

    private updateStatusBarItem(){
        this.iTunes.getAppState()
            .then( ( app: any ) => {
                if( app.appState === "running" ){
                    this.iTunes.getCurrentTrack()
                        .then( ( track: ITrack ) => {
                            this.statusBarItem.text = `$(unmute) ${ track.name } - ${ track.artist }`;
                            
                            switch( track.state ){
                                case "playing" :
                                    this.playerButton.text = "$(primitive-square)";
                                    this.playerButton.command = "itunes.pause";
                                    break;
                                
                                case "paused" :
                                case "stopped" :
                                    this.playerButton.text = "$(triangle-right)";
                                    this.playerButton.command = "itunes.play";
                                    break;
                            }

                            this.playerButton.show();
                        })
                        .catch( () => {
                            this.statusBarItem.text = "$(mute) iTunes Idle";
                            this.playerButton.hide();
                        });
                }else{
                    this.statusBarItem.text = "$(mute) iTunes Offline";
                    this.playerButton.hide();
                }
            });
    }

    public play(): void {
        this.iTunes.play();
    }

    public pause(): void {
        this.iTunes.pause();
    }

    public dispose(): void {
        this.statusBarItem.dispose();
        clearInterval( this.updateInterval );
    }
}
