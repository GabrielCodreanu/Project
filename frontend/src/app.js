function App() {
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
        'button',
        {
          onClick: function () {
            fetch('http://localhost:3001/api/hello')
              .then(function (res) { return res.json(); })
              .then(function (data) { alert(data.message); })
              .catch(function () { alert('Backend unavailable'); });
          },
        },
        'Say Hello'
      )
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
