if application "iTunes" is running then
	set payload to "{"
	set payload to payload & "\"appState\": \"running\""
	set payload to payload & "}"

    return payload
else
	set payload to "{"
    set payload to payload & "\"appState\": \"not_running\""
	set payload to payload & "}"

	return payload
end if