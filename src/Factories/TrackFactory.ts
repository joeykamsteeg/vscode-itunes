import ITrack from "../ITrack";

export default class TrackFactory {
    public static create( trackData: any[] ): ITrack {
        const track: ITrack = {};

        trackData.map( ( str ) => {
            if( str !== "null" ) {
                const keyvalue = str.split(":");
                const key =  keyvalue[0];
                let value = keyvalue[1];

                // Remove quotes around value if the are exists
                if( value[0] === "\"" && value[ value.length - 1] === "\"") {
                    value = value.substring(1, keyvalue[1].length - 1 );
                }

                // Unescape double quotes
                value = value.replace(/\\\"/g, '"');

                track[key] = value;
            }
        });

        return track;
    }
}
