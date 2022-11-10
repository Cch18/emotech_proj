import React from 'react';
import './App.css';
import MicRecorder from 'mic-recorder-to-mp3';

const Recorder = new MicRecorder({ bitRate: 128 });

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false, // recording permission.
      inProgress: false,
    };
  }

  // fiired when record button is clicked.
  start = () => {
    if (this.state.isBlocked) {
      alert('Permission Denied. Please enable Mircophone.');
    } else { // start recording by calling Mp3Recorder instance
      Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
          this.setState({ inProgress: true});
        }).catch((e) => console.error(e));
    }
  };
  /* fiired when stop button is clicked.
  stop() will 
  1. stop recording 
  2. show audio recording result
  3. send audio record to backend.
  */
  stop = () => {
    Recorder //calling stop() method to terminate this recording
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, 'beautiful-voices.mp3', {
          type: blob.type,
          lastModified: Date.now() // marked datetime.
        });

        // display the audio result first.
        const blobURL = URL.createObjectURL(blob); 
        const li = document.createElement('li');
        const player = new Audio(URL.createObjectURL(file));
        player.controls = true;
        li.appendChild(player);
        document.querySelector('#playlist').appendChild(li);

        // send file to backend
        var FileUploadFailed = document.querySelector('#FileUploadFailed');
        var FileUploadPassed = document.querySelector('#FileUploadPassed');
        var formData = new FormData();
        formData.append("file", file);

        var xhr = new XMLHttpRequest();
        // call XMLHttpRequest open() method to configure its request.
        xhr.open("POST", "/upload"); 
        //send data ...
        xhr.send(formData);
        xhr.onload = function() {
          var data = JSON.parse(xhr.responseText);

          if(xhr.status === 200) {
            // use DOM method to control CSS and HTML
            FileUploadFailed.style.display = "none";
            FileUploadPassed.innerHTML = "<p>File Uploaded Successfully.</p><p>Uploaded File Size : " + data + " bytes !</p>" ;
            FileUploadPassed.style.display = "block";
          } else {
            FileUploadPassed.style.display = "none";
            FileUploadFailed.innerHTML = (data && data.message) || "Some Error Occurred";
          }
        }

        // change the buttons state
        this.setState({ blobURL, isRecording: false });
        this.setState({ inProgress: false});
       }).catch((e) => console.log(e));
  };

  componentDidMount() { // call componetDidMount to add or exexute these cmdlines when file has just been loaded 
    navigator.getUserMedia({ audio: true }, // get recording permission.
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
  }
  

  render(){
    return (
      <div className="App">
        <header className="App-header">
        <ul id="recording" style={{display: this.state.inProgress ? 'block' : 'none'}}> Recording in progress ... </ul>
          <button onClick={this.start} disabled={this.state.isRecording}>Record</button>
          <button onClick={this.stop} disabled={!this.state.isRecording}>Stop</button>
          <ul id="playlist"></ul> {/* where the recorded audio will be displayed*/}
          <div className="upload-result"> {/* show upload file result, either failure or success*/}
              <div id="FileUploadFailed"></div>
              <div id="FileUploadPassed"></div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;

