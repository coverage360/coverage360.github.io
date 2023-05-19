function typeWriter(elementId, words, speed) {
  let wordIndex = 0;
  let charIndex = 0;
  const element = document.getElementById(elementId);
  element.textContent = "";

  function type() {
    const currentWord = words[wordIndex];
    if (charIndex < currentWord.length) {
      element.textContent += currentWord.charAt(charIndex);
      charIndex++;
      setTimeout(type, speed);
    }
  }
  type();
}

typeWriter("reponse-1", ["How are you feeling today?"], 50);
