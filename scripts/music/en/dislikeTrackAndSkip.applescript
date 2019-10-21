if application "Music" is running then
	tell application "Music"
		set disliked of current track to true
        next track
	end tell
end if
