function App() {
  const [greeting, setGreeting] = React.useState('');
  const [recommendations, setRecommendations] = React.useState([]);
  const [answer, setAnswer] = React.useState('');
  const [grade, setGrade] = React.useState(null);
  const [chatInput, setChatInput] = React.useState('');
  const [chatResponse, setChatResponse] = React.useState('');

  function sayHello() {
    fetch('http://localhost:3001/api/hello')
      .then(res => res.json())
      .then(data => setGreeting(data.message))
      .catch(() => setGreeting('Backend unavailable'));
  }

  function getRecommendations() {
    fetch('http://localhost:3001/api/recommendations')
      .then(res => res.json())
      .then(data => setRecommendations(data.recommendations || []))
      .catch(() => setRecommendations([]));
  }

  function submitAnswer(e) {
    e.preventDefault();
    fetch('http://localhost:3001/api/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: [answer] })
    })
      .then(res => res.json())
      .then(data => setGrade(data.score))
      .catch(() => setGrade(null));
  }

  function sendChat(e) {
    e.preventDefault();
    fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: chatInput })
    })
      .then(res => res.json())
      .then(data => setChatResponse(data.response))
      .catch(() => setChatResponse(''));
  }

  return React.createElement(
    React.Fragment,
    null,
    React.createElement('header', null, 'Educational Platform'),
    React.createElement(
      'main',
      null,
      React.createElement('h1', null, 'Welcome!'),
      React.createElement(
        'p',
        null,
        'This platform helps you learn with personalized recommendations, automatic grading, and a chatbot assistant.'
      ),
      React.createElement(
        'section',
        null,
        React.createElement(
          'button',
          { onClick: sayHello },
          'Say Hello'
        ),
        greeting && React.createElement('p', null, greeting)
      ),
      React.createElement(
        'section',
        null,
        React.createElement(
          'button',
          { onClick: getRecommendations },
          'Get Recommendations'
        ),
        recommendations.length > 0 &&
          React.createElement(
            'ul',
            null,
            recommendations.map(function(rec) {
              return React.createElement('li', { key: rec.id }, rec.title + ' (' + rec.type + ')');
            })
          )
      ),
      React.createElement(
        'section',
        null,
        React.createElement(
          'form',
          { onSubmit: submitAnswer },
          React.createElement('input', {
            value: answer,
            onChange: function(e) { setAnswer(e.target.value); },
            placeholder: 'Type your answer here'
          }),
          React.createElement(
            'button',
            { type: 'submit' },
            'Submit Answer'
          )
        ),
        grade !== null && React.createElement('p', null, 'Score: ' + grade)
      ),
      React.createElement(
        'section',
        null,
        React.createElement(
          'form',
          { onSubmit: sendChat },
          React.createElement('input', {
            value: chatInput,
            onChange: function(e) { setChatInput(e.target.value); },
            placeholder: 'Talk to the assistant'
          }),
          React.createElement(
            'button',
            { type: 'submit' },
            'Send'
          )
        ),
        chatResponse && React.createElement('p', null, chatResponse)
      )
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
