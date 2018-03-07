tell application "iTunes"
	set itrack to "{"
	set itrack to itrack & "\"artist\": \"" & artist of current track & "\","
	set itrack to itrack & "\"name\": \"" & name of current track & "\","
		set itrack to itrack & "\"state\": \"" & player state & "\""
	set itrack to itrack & "}"
	
	return itrack
end tell