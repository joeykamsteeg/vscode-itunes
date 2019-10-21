if application "iTunes" is running then
	tell application "iTunes"
		set itrack to artist of current track & "|"
		set itrack to itrack & name of current track & "|"
		set itrack to itrack & album of current track & "|"
		set itrack to itrack & media kind of current track & "|"
		set itrack to itrack & player state & "|"
		set itrack to itrack & sound volume & "|"
		set itrack to itrack & mute & "|"
		set itrack to itrack & shuffle enabled & "|"
		set itrack to itrack & song repeat
		
		return itrack
	end tell
end if