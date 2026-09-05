const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voiceSelect");

const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");

const rateSlider = document.getElementById("rate");
const pitchSlider = document.getElementById("pitch");

const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");

const status = document.getElementById("status");

let voices = [];


// Load available voices
function loadVoices() {
    voices = speechSynthesis.getVoices();

    voiceSelect.innerHTML = "";

    if (voices.length === 0) {
        const option = document.createElement("option");

        option.textContent = "No voices available";
        option.value = "";

        voiceSelect.appendChild(option);

        status.textContent = "No voices available";
        return;
    }

    voices.forEach((voice, index) => {
        const option = document.createElement("option");

        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;

        voiceSelect.appendChild(option);
    });

    status.textContent = `${voices.length} voices available`;
}


// Load voices when browser provides them
speechSynthesis.onvoiceschanged = loadVoices;

// Initial load
loadVoices();


// Speak button
speakBtn.addEventListener("click", function () {

    const text = textInput.value.trim();

    // Check empty text
    if (text === "") {
        status.textContent = "Please enter some text first.";
        return;
    }

    // Stop previous speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Get selected voice
    const selectedVoice = voices[voiceSelect.value];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // Set rate
    utterance.rate = parseFloat(rateSlider.value);

    // Set pitch
    utterance.pitch = parseFloat(pitchSlider.value);


    utterance.onstart = function () {
        status.textContent = "Speaking...";
    };


    utterance.onend = function () {
        status.textContent = "Speech finished.";
    };


    utterance.onerror = function () {
        status.textContent = "Speech error occurred.";
    };


    // Start speech
    speechSynthesis.speak(utterance);
});


// Stop button
stopBtn.addEventListener("click", function () {

    speechSynthesis.cancel();

    status.textContent = "Speech stopped.";
});


// Rate slider
rateSlider.addEventListener("input", function () {

    rateValue.textContent = rateSlider.value;

    // Restart speech if already speaking
    if (speechSynthesis.speaking) {
        speakBtn.click();
    }
});


// Pitch slider
pitchSlider.addEventListener("input", function () {

    pitchValue.textContent = pitchSlider.value;

    // Restart speech if already speaking
    if (speechSynthesis.speaking) {
        speakBtn.click();
    }
});


// Change voice
voiceSelect.addEventListener("change", function () {

    // Restart speech with new voice
    if (speechSynthesis.speaking) {
        speakBtn.click();
    }
});
