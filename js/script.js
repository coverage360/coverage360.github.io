function sendMessage() {
  // Obter a mensagem do usuário
  var message = document.querySelector('input[name="content"]').value;

  // Adicionar a mensagem ao artigo de chat
  var chatArticle = document.getElementById("chat");
  var newMessageBlock = document.createElement("blockquote");
  newMessageBlock.innerHTML = `
    <div>${message}</div>
    <footer>
      <cite>- <i>User</i> ${new Date().toLocaleString()}</cite>
    </footer>
  `;
  chatArticle.appendChild(newMessageBlock);

  // Enviar a mensagem para a API
  var payload = {
    prompt: message,
  };
  fetch("https://1j66to3zu3.execute-api.sa-east-1.amazonaws.com/dev/hackathon/gpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Adicionar a resposta ao artigo de chat
      var responseBlock = document.createElement("blockquote");
      responseBlock.innerHTML = `
        <div>${data.response.response}</div>
        <footer>
          <cite>- <i>BotCouch</i> ${new Date().toLocaleString()}</cite>
        </footer>
      `;
      chatArticle.appendChild(responseBlock);

      // Exibir a resposta no console
      console.log(data.response.response);

      // Chamar a função typeWriter para exibir a resposta na interface do usuário
      var increment = document.querySelectorAll('[id^="reponse-"]').length;
      var responseId = `reponse-${increment}`;
      var responseMessage = data.response.response;
      
      typeWriter(responseId, [responseMessage], 50);
    })
    .catch(function(error) {
      console.error("Error:", error);
    });
  document.querySelector('input[name="content"]').value = "";
}


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