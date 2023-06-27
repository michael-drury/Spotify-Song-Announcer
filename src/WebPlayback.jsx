import React, { useState, useEffect, useCallback } from 'react';
import Logout from './Logout';

function CallOutSong(toBeCalledOut) {
    const instanceOfspeech = new SpeechSynthesisUtterance(toBeCalledOut);
    window.speechSynthesis.speak(instanceOfspeech);
}

async function getCurrentTrack(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken },
    });
    return response.json();
}

function WebPlayback({ token }) {
    const [isAnnouncerActive, setIsAnnouncerActive] = useState(false);

    const readTrackInfo = useCallback(async () => {
        const trackInformation = await getCurrentTrack(token);
        if (!trackInformation) return;

        const { artists, name: song, duration_ms: durationMs} = trackInformation.item;
        const {name: album} = trackInformation.item.album;
        const { progress_ms: progressMs } = trackInformation;
        const artist = artists[0].name;

        const trackData = `Now playing ${song} by ${artist} from ${album}`;
        console.log(trackData);

        if (progressMs < 5000) {
            console.log("Calling out song info");
            CallOutSong(trackData);
        }
        else{
            console.log("Not speaking song name");
        }
        
        const remainingMs = (durationMs - progressMs);
        setTimeout(readTrackInfo, remainingMs + 1000);
    }, [token]);

    useEffect(() => {
        if (!isAnnouncerActive) {
            setIsAnnouncerActive(true);
            readTrackInfo();
        }
    }, [readTrackInfo, isAnnouncerActive]);

    return <Logout />;
}

export default WebPlayback;