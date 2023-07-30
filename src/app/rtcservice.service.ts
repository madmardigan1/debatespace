import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RtcService {
  pc: RTCPeerConnection | null = null;

  constructor() { }

  startStream() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        this.pc = new RTCPeerConnection();
        stream.getTracks().forEach(track => this.pc!.addTrack(track, stream));

        // send the offer to the server
        this.pc!.createOffer()
          .then(offer => this.pc!.setLocalDescription(offer))
          .then(() => {
            // send the offer to the server here
          });

        // when receiving an answer from the server
        this.pc!.onicecandidate = event => {
          if (event.candidate) {
            // send the candidate to the other peer via the server
          }
        };

        this.pc!.ontrack = event => {
          // when receiving a track from the other peer, add it to the audio element
          const audio = document.querySelector('audio');
          audio!.srcObject = event.streams[0];
        };
      });
  }
}
