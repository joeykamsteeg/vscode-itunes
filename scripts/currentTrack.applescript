if application "iTunes" is running then
	tell application "iTunes"
		set itrack to {artist:artist of current track, name:name of current track, album:album of current track, kind:media kind of current track, state:player state, volume:sound volume, muted:mute, shuffle:shuffle enabled, repeat_song:song repeat}
		return itrack
	end tell
end if