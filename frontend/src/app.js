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
            alert('More features coming soon!');
          },
        },
        'Get Started'
      )
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
