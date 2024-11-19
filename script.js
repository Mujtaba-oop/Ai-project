const form = document.querySelector(".typing-form");  
const userInput = document.getElementById("user-input");  
const chatList = document.querySelector(".chat-list"); // Assuming there's a chat list to append messages  
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDd3MdT4UziOcCXU7OO4fJvkE4okMDZ_aI";  

// Function to handle outgoing chat  
const handleOutgoingChat = () => {  
    const userMessage = userInput.value.trim();  
    if (!userMessage) return; // Exit if there is no message  

    const html = `  
        <div class="message-content">  
            <img src="vector.jpg"  alt="">  
            <p class="text">${userMessage}</p>  
        </div>  
    `;  

    const outgoingMessageDiv = createMessageElement(html, "outgoing");  
    chatList.appendChild(outgoingMessageDiv);  

    userInput.value = ""; // Clear input field  
    chatList.scrollTop = chatList.scrollHeight; // Scroll to the bottom   
    GenerateApiResponse(userMessage);   
};  

// Function to generate API response  
const GenerateApiResponse = async (userMessage) => {  
    const response = await fetch(API_URL, {  
        method: "POST",  
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify({  
            contents: [{  
                role: "user",  
                parts: [{ text: userMessage }]  
            }]  
        })  
    });  

    // Check if the response was successful  
    if (!response.ok) {  
        console.error('Network response was not ok', response.statusText);  
        return; // Exit the function in case of error  
    }   
    
    const jsonResponse = await response.json();   
    const contentText = jsonResponse.candidates[0].content.parts[0].text;  
    modifiend=convertToHTML(contentText);
    // Create a new message element for the API response
    console.log(modifiend)  
    const responseHtml = `  
        <div class="message-content">  
            <img src="artificial.jpg"  alt="">  
           <div class="try">${modifiend}</div>   
        </div>  
    `;  

    const incomingMessageDiv = createMessageElement(responseHtml, "incoming");  
    chatList.appendChild(incomingMessageDiv);  
    
    chatList.scrollTop = chatList.scrollHeight; // Scroll to the bottom after appending  
};  

// Function to create message element  
const createMessageElement = (content, className) => {  
    const div = document.createElement("div");  
    div.classList.add("message", className);  
    div.innerHTML = content;  
    return div;  
};  

// Event listener for form submission  
form.addEventListener("submit", (e) => {  
    e.preventDefault();  
    handleOutgoingChat();  


});

// conversion************************
const convertToHTML = (text) => {
    // Handle multi-line code blocks (triple backticks)
    text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<pre><code>${escapeHTML(code.trim())}</code></pre>`;
    });

    // Handle inline code (single backticks)
    text = text.replace(/`([^`]+)`/g, (match, code) => {
        return `<code>${escapeHTML(code)}</code>`;
    });

    // Handle lists (both `*` and `-` for bullet points)
    if (text.includes("- ") || text.includes("* ")) {
        const lines = text.split("\n");
        let inList = false;
        text = lines
            .map((line) => {
                if (/^[-*]\s/.test(line)) {
                    if (!inList) {
                        inList = true;
                        return "<ul><li>" + line.slice(2).trim() + "</li>";
                    }
                    return "<li>" + line.slice(2).trim() + "</li>";
                } else if (inList) {
                    inList = false;
                    return "</ul>" + line;
                }
                return line;
            })
            .join("\n");
        if (inList) text += "</ul>"; // Close open list
    }

    // Replace **bold** with <strong> elements
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Replace line breaks with <br> tags for preserving structure
    text = text.replace(/\n/g, "<br>");

    return text.trim();
};

/**
 * Escapes HTML characters to prevent injection and preserve code formatting.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
const escapeHTML = (str) => {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};
