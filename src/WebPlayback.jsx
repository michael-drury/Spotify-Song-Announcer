import React, { useState, useEffect, useMemo } from 'react';
import { render } from 'react-dom';
import { SayUtterance } from 'react-say';
import Speech from 'react-speech';
import Logout from './Logout';

window.announcer = false;

function CallOutSong(toBeCalledOut) {

    console.log("Arg " + toBeCalledOut);
    const instanceOfspeech = new SpeechSynthesisUtterance(toBeCalledOut);
    window.speechSynthesis.speak(instanceOfspeech);
}

function WebPlayback(props) {

    console.log(props.token);
    if(!window.announcer)
    {
        console.log("Starting main");
        window.announcer = true;
        main(props.token);
    }
    return <Logout/>;
}

async function main(access_tok) {


    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_tok },
    })
        .then((response) => response.json())
        .then((data) => {
            readTrackInfo(data, access_tok)
        })
        .catch((err) => {
            console.log(err.message);
        });
    
}

function readTrackInfo(trackInformation, access_tok) {
    console.log(trackInformation);
    if (!trackInformation) return;

    const artist = trackInformation.item.artists[0].name;
    const song = trackInformation.item.name;
    const album = trackInformation.item.album.name;
    const duration = trackInformation.item.duration_ms;
    const progress = trackInformation.progress_ms;

    /** TODO: Split into different functions  */

    var remaining = (duration - progress);
    var startTime = new Date();

    const trackData = "Now playing " + song + " by " + artist + " from " + album;

    if (!trackData) return;
    console.log(trackData);

    if (progress < 5000) {
        console.log("Speaking");
        CallOutSong(trackData)
    }
    else console.log("Not speaking");
    var endTime = new Date();
    var durationSpeaking = endTime - startTime;
    var  nextCheckSong = remaining + 600 - durationSpeaking
    console.log("Next api ping in " + nextCheckSong)
    setTimeout(main, nextCheckSong, access_tok);
}

export default WebPlayback


/** TODO: Refresh tokens. Display text of currently playing + any errors 
 *  TODO: Ping API every min when no song playing
*/