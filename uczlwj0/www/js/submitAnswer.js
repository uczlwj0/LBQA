// uczlwj0 - Code Source - the code is adapted from Claire's Web GIS practical

var client;


function submitAnswer() {
var question_id = document.getElementById("question_id").value;
var correct_answer = document.getElementById("correct_answer").value;
var postString = "question_id="+question_id +"&correct_answer="+correct_answer; 


// now get the radio button values
if (document.getElementById("answer1").checked) {
postString=postString+"&user_answer="+document.getElementById("answer1").value;
}
if (document.getElementById("answer2").checked) {
postString=postString+"&user_answer="+document.getElementById("answer2").value;
}
if (document.getElementById("answer3").checked) {
postString=postString+"&user_answer="+document.getElementById("answer3").value;
}
if (document.getElementById("answer4").checked) {
postString=postString+"&user_answer="+document.getElementById("answer4").value;
}

processData(postString);}

function processData(postString) {
client = new XMLHttpRequest();
client.open('POST','http://developer.cege.ucl.ac.uk:30275/submitAnswer',true);
client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
client.onreadystatechange = dataUploaded;
client.send(postString);

}
// create the code to wait for the response from the data server, and process the response once it is received

function dataUploaded() {
// this function listens out for the server to say that the data is ready - i.e. has state 4
if (client.readyState == 4) {
// change the DIV to show the response
document.getElementById("dataUploadResult").innerHTML = client.responseText;
}
}