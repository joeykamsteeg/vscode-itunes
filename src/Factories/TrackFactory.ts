import ITrack, { MediaType } from "../ITrack";

export default class TrackFactory {
    public static create( trackData: string ): ITrack {
        if( trackData == null ) {
            return {};
        }

        const track: ITrack = {};
        const data = trackData.split("|");
        track.artist = data[0];
        track.name = data[1];
        track.album = data[2];
        track.kind = data[3] as MediaType;
        track.state = data[4];
        track.volume = parseInt( data[5], 0);
        track.muted = data[6] === "false" ? false : true;
        track.shuffle = data[7];
        track.repeat_song = data[8];
        track.loved = data[9] === "true" ? true : false;
        track.disliked = data[10] === "true" ? true : false;

        return track;
    }
}
