import React, { useState } from 'react';
import './App.css';

function App() {
  const [llmChoice, setLlmChoice] = useState('');
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://backendhyperlex.vercel.app/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ llm_choice: llmChoice, user_input: userInput })
    });

    if (res.ok) {
      const data = await res.json();
      const newResponse = { llm: llmChoice, text: data.response };
      setResponses([...responses, newResponse]);
      setUserInput('');
    } else {
      console.error('Failed to fetch response');
    }
  };

  const getLlmName = (llm) => {
    switch (llm) {
      case 'openai':
        return 'OpenAI';
      case 'gemini':
        return 'Gemini';
      case 'claude':
        return 'Claude';
      default:
        return 'LLM';
    }
  };

  const handleLlmSelect = (choice) => {
    setLlmChoice(choice);
    setDropdownOpen(false);
  };

  return (
    <div className="App">
      <div className="menu-bar">
        <div className="dropdown">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-button">
            {getLlmName(llmChoice)}
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <div className='option1' onClick={() => handleLlmSelect('openai')}>OpenAI</div>
              <div className='option2' onClick={() => handleLlmSelect('gemini')}>Gemini</div>
              <div className='option3' onClick={() => handleLlmSelect('claude')}>Claude</div>
            </ul>
          )}
        </div>
      </div>
      <div className="output-area">
        {responses.length === 0 ? (
          <div className="project-name">Hyperlex</div>
        ) : (
          <div className="responses">
            {responses.map((response, index) => (
              <div key={index} className="response">
                <div className="response-header">{getLlmName(response.llm)}</div>
                <div className="response-text">{response.text}</div>
              </div>
            ))}
          </div>
        )}
        {responses.length === 0 && (
          <div className="footer">
            <p>A multi LLM chatbot</p>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your prompt here..."
          className="input-textarea"
        />
        <button type="submit" className="submit-button">{'\u2191'}</button>
      </form>
    </div>
  );
}

export default App;
