export declare type MediaType = "alert tone" | "audiobook" | "book" | "‌home video" | "iTunesU" | "movie" | "song" | "music video" | "podcast" | "ringtone" | "TV show" | "voice memo" | "unknown";

export default interface ITrack {
    artist?: string;
    name?: string;
    state?: string;
    repeat_song?: string;
    muted?: boolean;
    volume?: number;
    shuffle?: any;
    album?: string;
    kind?: MediaType;
}
