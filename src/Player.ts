import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from "vscode";
import iTunes from "./iTunes";
import ITrack from "./ITrack";
import Config from "./Config";

export default class Player {

    public static Instance: Player;

    private iTunes: iTunes;
    private statusBarItem: StatusBarItem = null;
    private playerButton: StatusBarItem = null;
    private previousTrackButton: StatusBarItem = null;
    private nextTrackButton: StatusBarItem = null;
    private stateButton: StatusBarItem = null;
    private updateInterval: NodeJS.Timer;
    private repeatButton: StatusBarItem = null;

    private currentStatusIndex: number = 0;

    constructor() {
        Player.Instance = this;

        this.iTunes = new iTunes();

        this.createStatusBarItem();

        this.onUpdate = this.onUpdate.bind( this );
        this.updateInterval = setInterval( this.onUpdate, Config.Instance.getStatusCheckInterval() );

        this.updateStatusBarItem();
    }

    private onUpdate(){
        this.updateStatusBarItem();
    }

    private createStatusBarItem(){
        this.repeatButton = window.createStatusBarItem( StatusBarAlignment.Left, 0 );

        this.statusBarItem = window.createStatusBarItem( StatusBarAlignment.Left, 2 );
        this.statusBarItem.command = "itunes.open";
        this.statusBarItem.show();

        this.previousTrackButton = window.createStatusBarItem( StatusBarAlignment.Left, 3 );
        this.previousTrackButton.text = "$(chevron-left)";
        this.previousTrackButton.command = "itunes.previousTrack";

        this.playerButton = window.createStatusBarItem( StatusBarAlignment.Left, 3 );

        this.nextTrackButton = window.createStatusBarItem( StatusBarAlignment.Left, 3 );
        this.nextTrackButton.text = "$(chevron-right)";
        this.nextTrackButton.command = "itunes.nextTrack";

        this.stateButton = window.createStatusBarItem( StatusBarAlignment.Left, 1 );
        this.stateButton.text = "$(mute)";
        this.stateButton.command = "itunes.open";
        this.stateButton.show();
    }

    private updateStatusBarItem(){
        this.iTunes.getAppState()
            .then( ( app: any ) => {
                if( app.appState === "running" ){
                    this.iTunes.getCurrentTrack()
                        .then( ( track: ITrack ) => {
                            if( track.artist != null && track.name != null ){
                                const status = `${ track.name } - ${ track.artist }`;
                                this.statusBarItem.text = status;

                                this.statusBarItem.show();
                                this.stateButton.show();
                            }
                            
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

                            switch( track.repeat ){
                                case "all":
                                    this.repeatButton.text = "$(sync) All";
                                    this.repeatButton.command = "itunes.repeat.set.one";
                                    break;

                                case "one":
                                    this.repeatButton.text = "$(sync) One";
                                    this.repeatButton.command = "itunes.repeat.set.off";
                                    break;

                                case "off":
                                    this.repeatButton.text = "$(sync) Off";
                                    this.repeatButton.command = "itunes.repeat.set.all";
                                    break;
                            }

                            this.stateButton.text = "$(unmute)";
                            this.showMediaControls();
                        })
                        .catch( () => {
                            this.statusBarItem.hide();
                            this.stateButton.hide();
                            this.hideMediaControls();
                        });
                }else{
                    this.statusBarItem.hide();
                    this.stateButton.hide();
                    this.hideMediaControls();
                }
            });
    }

    public open(): void {
        this.iTunes.open();
    }

    public play(): void {
        this.iTunes.play();
    }

    public pause(): void {
        this.iTunes.pause();
    }

    public nextTrack(): void {
        this.iTunes.nextTrack();
    }

    public previousTrack(): void {
        this.iTunes.previousTrack();
    }

    public setRepeat( repeat: string ): void {
        this.iTunes.setRepeat( repeat );
    }

    public dispose(): void {
        this.statusBarItem.dispose();
        clearInterval( this.updateInterval );
    }

    private showMediaControls(): void {
        this.previousTrackButton.show();
        this.playerButton.show();
        this.nextTrackButton.show();
        this.repeatButton.show();
    }

    private hideMediaControls(): void {
        this.previousTrackButton.hide();
        this.playerButton.hide();
        this.nextTrackButton.hide();
        this.repeatButton.hide();
    }
}
