if application "iTunes" is running then
	tell application "iTunes"
		set itrack to "{"
		set itrack to itrack & "\"artist\": \"" & artist of current track & "\","
		set itrack to itrack & "\"name\": \"" & name of current track & "\","
		set itrack to itrack & "\"album\": \"" & album of current track & "\","
		set itrack to itrack & "\"state\": \"" & player state & "\","
		set itrack to itrack & "\"volume\": \"" & sound volume & "\","
		set itrack to itrack & "\"muted\": \"" & mute & "\","
		set itrack to itrack & "\"shuffle\": \"" & shuffle enabled & "\","
		set itrack to itrack & "\"repeat\": \"" & song repeat & "\""
		set itrack to itrack & "}"
		
		return itrack
	end tell
end if