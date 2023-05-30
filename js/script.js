var context = [];

function sendMessage() {
  var message = document.querySelector('input[name="content"]').value;

  if (message === "") {
    return; 
  }

  var chatArticle = document.getElementById("chat");
  var newMessageBlock = document.createElement("blockquote");
  newMessageBlock.id = "message-" + context.length;
  newMessageBlock.innerHTML = `
    <div>${message}</div>
    <footer>
      <cite><i>User</i> ${new Date().toLocaleString()}</cite>
    </footer>
  `;
  chatArticle.appendChild(newMessageBlock);
  chatArticle.scrollTop = chatArticle.scrollHeight;
  context.push({ role: "User", message: message });
  console.log(context);

  var payload = {
    prompt: message,
    context: context
  };
  fetch(
    "https://bke4e6dko6.execute-api.sa-east-1.amazonaws.com/dev/hackathon/gpt",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var benefits = data.response.benefits;
      var benefitsHtml = benefits.map(function (benefit) {
        return `<span class="benefit-btn">${benefit}</span>`;
      }).join(", ");
      benefitsHtml = benefitsHtml.replace(/,/g, '');

      var responseBlock = document.createElement("blockquote");
      responseBlock.id = "message-" + context.length;
      responseBlock.innerHTML = `
        <div>${data.response.message}</div>
        <br/>
        ${benefitsHtml}
        <footer>
          <cite><i>🦜 Empathia</i> ${new Date().toLocaleString()}</cite>
        </footer>
      `;
      chatArticle.appendChild(responseBlock);
      chatArticle.scrollTop = chatArticle.scrollHeight;
      context.push({ role: "Empathia", message: data.response.message });
      console.log(context);
    })
    .catch(function (error) {
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

var chatArticle = document.getElementById("chat");

var initialMessageBlock = document.createElement("blockquote");
initialMessageBlock.id = "message-" + context.length;
var initial_date = new Date().toLocaleString();
initialMessageBlock.innerHTML = `
    <div>How are you feeling today?</div>
    <footer>
      <cite><i>🦜 Empathia</i> ${initial_date}</cite>
    </footer>
  `;
chatArticle.appendChild(initialMessageBlock);
context.push({ role: "Empathia", message: "How are you feeling today?" });
