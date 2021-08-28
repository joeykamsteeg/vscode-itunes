import { workspace, WorkspaceConfiguration } from "vscode";

export default class Config {

    public static Instance: Config;
    private workspace: WorkspaceConfiguration;

    constructor(){
        this.workspace = workspace.getConfiguration('itunes');
        Config.Instance = this;
    }

    getStatusCheckInterval(){
        const interval = this.workspace.get("updateInterval", 5000 );
        if( interval < 1000 ){
            return 1000;
        }

        return interval;
    }

    getLanguageOverride(){
        const languageOverride = this.workspace.get("languageOverride", "en" );
        return languageOverride;
    }

    getSkipTrackDislike(): boolean {
        const skipTrackByTrackDislike = this.workspace.get("skipTrackByTrackDislike", true);
        return skipTrackByTrackDislike;
    }

    getTitleStringLimit(): number {
        const titleStringLimit = this.workspace.get("titleStringLimit", 0);
        return titleStringLimit;
    }

    getShowMediaControls(): boolean {
        const showControls = this.workspace.get("showMediaControls", true)
        return showControls;
    }
}