const selectTags = document.querySelectorAll("select");
const translateBtn = document.querySelector("#translate");
const fromText = document.querySelector("#fromText");
const toText = document.querySelector("#toText");
const icons = document.querySelectorAll("img");

selectTags.forEach((tag, id) => {
  for (const countryCode in countries) {
    let option = document.createElement("option");
    option.value = countryCode;
    option.textContent = countries[countryCode];

    if (id === 0 && countryCode === "en-GB") {
      option.selected = true;
    } else if (id === 1 && countryCode === "hi-IN") {
      option.selected = true;
    }

    tag.appendChild(option);
  }
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  let translateFrom = selectTags[0].value;
  let translateTo = selectTags[1].value;

  if (!text) {
    alert("Please enter text to translate.");
    return;
  }

  const apiURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiURL)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      toText.value =
        data.responseData.translatedText || "Translation not available.";
    })
    .catch((error) => {
      console.error("Error fetching translation:", error);
      toText.value = "Error fetching translation. Please try again.";
    });
});

// Add event listeners for icons
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("copy")) {
      if (target.id === "from") {
        navigator.clipboard
          .writeText(fromText.value)
          .then(() => {
            alert("Copied from text to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy from text: ", err);
          });
      } else {
        navigator.clipboard
          .writeText(toText.value)
          .then(() => {
            alert("Copied translated text to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy translated text: ", err);
          });
      }
    } else if (target.classList.contains("speaker")) {
      let utterance;

      if (target.id === "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTags[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTags[1].value;
      }

      speechSynthesis.speak(utterance);
    } else if (target.classList.contains("mic")) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        fromText.value = transcript;
      };
    }
  });
});
