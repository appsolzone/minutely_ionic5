var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

// var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
// var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
// alert("SpeechRecognition", SpeechRecognition)
var recognition = null;
if(SpeechRecognition){
  var recognition = new SpeechRecognition();
  // alert("recognition", recognition)
  // var speechRecognitionList = new SpeechGrammarList();
  // speechRecognitionList.addFromString(grammar, 1);
  // recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'en-US'; //'bn-IN'
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}


// var diagnostic = document.querySelector('.output');
// var bg = document.querySelector('html');
// var hints = document.querySelector('.hints');

// var colorHTML= '';
// colors.forEach(function(v, i, a){
//   console.log(v, i);
//   colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
// });
// hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }

// recognition.onresult = function(event) {
// //   // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
// //   // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
// //   // It has a getter so it can be accessed like an array
// //   // The first [0] returns the SpeechRecognitionResult at the last position.
// //   // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
// //   // These also have getters so they can be accessed like arrays.
// //   // The second [0] returns the SpeechRecognitionAlternative at position 0.
// //   // We then return the transcript property of the SpeechRecognitionAlternative object
// //   // var color = event.results[0][0].transcript;
// //   // diagnostic.textContent = 'Result received: ' + color + '.';
// //   // bg.style.backgroundColor = color;
// //   // console.log('Confidence: ' + event.results[0][0].confidence);
//   var text = event.results[0][0].transcript;
//   return({text: text});
// }

// recognition.onspeechend = function() {
//   console.log('stop 1: ', new Date());
//   recognition.stop();
//   console.log('stop 2: ', new Date());
// }

// recognition.onnomatch = function(event) {
//   // diagnostic.textContent = "I didn't recognise that color.";
//   alert("Could not recognize the speech")
// }
//
// recognition.onerror = function(event) {
//   // diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
//   alert('Error occurred in recognition: ' + event.error)
// }

export {recognition};
