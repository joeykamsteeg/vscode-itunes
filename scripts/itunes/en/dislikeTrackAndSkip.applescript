if application "iTunes" is running then
	tell application "iTunes"
		set disliked of current track to true
        next track
	end tell
end if
