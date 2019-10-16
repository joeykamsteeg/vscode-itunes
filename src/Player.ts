import { window, StatusBarAlignment, StatusBarItem } from "vscode";
import iTunes from "./iTunes";
import ITrack, { MediaType } from "./ITrack";
import Config from "./Config";
import TrackFactory from "./Factories/TrackFactory";

export default class Player {

    public static Instance: Player;

    private iTunes: iTunes;
    private titleBarItem: StatusBarItem = null;
    private artistBarItem: StatusBarItem = null;
    private albumBarItem: StatusBarItem = null;
    private playerButton: StatusBarItem = null;
    private previousTrackButton: StatusBarItem = null;
    private nextTrackButton: StatusBarItem = null;
    private stateButton: StatusBarItem = null;
    private updateInterval: NodeJS.Timer;
    private repeatButton: StatusBarItem = null;
    private shuffleButton: StatusBarItem = null;

    private statusBarPositionOffset: number = 10;
    
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
        this.previousTrackButton = window.createStatusBarItem( StatusBarAlignment.Left, 13 + this.statusBarPositionOffset );
        this.previousTrackButton.text = "$(chevron-left)";
        this.previousTrackButton.command = "itunes.previousTrack";
        this.previousTrackButton.tooltip = "Play Previous Track";

        this.playerButton = window.createStatusBarItem( StatusBarAlignment.Left, 12 + this.statusBarPositionOffset );

        this.nextTrackButton = window.createStatusBarItem( StatusBarAlignment.Left, 11 + this.statusBarPositionOffset );
        this.nextTrackButton.text = "$(chevron-right)";
        this.nextTrackButton.command = "itunes.nextTrack";
        this.nextTrackButton.tooltip = "Play Next Track";

        this.artistBarItem = window.createStatusBarItem( StatusBarAlignment.Left, 9 + this.statusBarPositionOffset );
        this.artistBarItem.command = "itunes.open";
        this.artistBarItem.tooltip = "Show iTunes";
        this.artistBarItem.show();

        this.titleBarItem = window.createStatusBarItem( StatusBarAlignment.Left, 10 + this.statusBarPositionOffset );
        this.titleBarItem.command = "itunes.open";
        this.titleBarItem.tooltip = "Show iTunes";
        this.titleBarItem.show();

        this.albumBarItem = window.createStatusBarItem( StatusBarAlignment.Left, 8 + this.statusBarPositionOffset );
        this.albumBarItem.command = "itunes.open";
        this.albumBarItem.tooltip = "Show iTunes";
        this.albumBarItem.show();

        this.stateButton = window.createStatusBarItem( StatusBarAlignment.Left, 7 + this.statusBarPositionOffset );
        this.stateButton.text = "$(mute)";
        this.stateButton.command = "itunes.volume";
        this.stateButton.show();

        this.shuffleButton = window.createStatusBarItem( StatusBarAlignment.Left, 6 + this.statusBarPositionOffset );
        this.repeatButton = window.createStatusBarItem( StatusBarAlignment.Left, 5 + this.statusBarPositionOffset );
    }

    private updateStatusBarItem(){
        this.iTunes.getAppState()
            .then( ( app: any ) => {
                if( app.appState === "running" ){
                    this.iTunes.getCurrentTrack()
                        .then( ( track: any ) => {
                            console.log( track );
                            track = TrackFactory.create( track );

                            if( track.artist != null && track.name != null ){
                                this.titleBarItem.text = this.getStatusText( track.artist, track.name, track.album );

                                this.updateStatusText( track.artist, track.name, track.album, track.kind );

                                this.titleBarItem.show();
                                this.stateButton.show();
                            }

                            if( parseFloat( track.volume ) >= 1 ){
                                this.stateButton.text = "$(unmute)";
                                this.stateButton.tooltip = "Mute Volume";
                            }else{
                                this.stateButton.text = "$(mute)";
                                this.stateButton.tooltip = "Unmute Volume";
                            }
                            
                            switch( track.state ){
                                case "playing" :
                                    this.playerButton.text = "$(primitive-square)";
                                    this.playerButton.command = "itunes.pause";
                                    this.playerButton.tooltip = "Pause Track";
                                    break;
                                
                                case "paused" :
                                case "stopped" :
                                    this.playerButton.text = "$(triangle-right)";
                                    this.playerButton.command = "itunes.play";
                                    this.playerButton.tooltip = "Play Track";
                                    break;
                            }

                            switch( track.repeat_song ){
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

                            if( track.shuffle === "true" ) {
                                this.shuffleButton.text = "$(git-compare) On";
                                this.shuffleButton.command = "itunes.shuffle.off";
                                this.shuffleButton.tooltip = "Turn Shuffle Off";
                            } else {
                                this.shuffleButton.text = "$(git-compare) Off";
                                this.shuffleButton.command = "itunes.shuffle.on";
                                this.shuffleButton.tooltip = "Turn Shuffle On";
                            }

                            this.showMediaControls();
                        })
                        .catch( ( err ) => {
                            console.log( err );
                        });
                }else{
                    this.hideMediaControls();
                }
            });
    }

    private getStatusText( artist: string, name: string, album: string ): string {
        let status = ""; 
        if( name.length > 0 ) {
            status += name;
        }

        if( artist.length > 0 ) {
            if( status.length > 0 ){
                status += " - ";
            }

            status += artist;
        }

        if( album.length > 0 && artist !== album ) {
            if( status.length > 0 ){
                status += " - ";
            }

            status += album;
        }
        return status;
    }

    private updateStatusText( artist: string, name: string, album: string, kind: MediaType ) {
        this.titleBarItem.show();
        this.artistBarItem.show();
        this.albumBarItem.show();

        const albumText = ( name.length > 0 || artist.length > 0 ) ? `-     ${album}` : album;
        
        this.titleBarItem.text = name;
        this.albumBarItem.text = albumText;
        this.artistBarItem.text = name.length > 0 ? `-     ${artist}` : artist;

        if( kind !== "podcast" ) {
            this.albumBarItem.hide();
        }

        if( name.length === 0 ) {
            this.titleBarItem.hide();
        }

        if( album.length=== 0 ) {
            this.albumBarItem.hide();
        }

        if( artist.length === 0 ) {
            this.artistBarItem.hide();
        }

        if( artist === album ) {
            this.albumBarItem.hide();
        }
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

    public shuffleOn(): void {
        this.iTunes.shuffle( true );
    }
    
    public shuffleOff(): void {
        this.iTunes.shuffle( false );
    }

    public setRepeat( repeat: string ): void {
        this.iTunes.setRepeat( repeat );
    }

    public dispose(): void {
        this.titleBarItem.dispose();
        clearInterval( this.updateInterval );
    }

    private showMediaControls(): void {
        this.previousTrackButton.show();
        this.playerButton.show();
        this.nextTrackButton.show();
        this.repeatButton.show();
        this.titleBarItem.show();
        this.stateButton.show();
        this.shuffleButton.show();
    }

    private hideMediaControls(): void {
        this.previousTrackButton.hide();
        this.playerButton.hide();
        this.nextTrackButton.hide();
        this.repeatButton.hide();
        this.titleBarItem.hide();
        this.stateButton.hide();
        this.shuffleButton.hide();
    }

    public volume(): void {
        if( this.stateButton.text === "$(mute)"){
            this.iTunes.unmute();
        }else{
            this.iTunes.mute();
        }
    }
}
