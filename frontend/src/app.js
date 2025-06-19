const { BrowserRouter, Route, Switch, Link, Redirect } = ReactRouterDOM;

const AuthContext = React.createContext();

function useAuth() {
  return React.useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [token, setToken] = React.useState(null);
  const [role, setRole] = React.useState(null);

  const login = async (email, password) => {
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      setRole(data.role);
      return true;
    }
    return false;
  };

  const register = async (name, email, password) => {
    const res = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      setRole('student');
      return true;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setRole(null);
  };

  const value = { token, role, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function PrivateRoute({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.token ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  );
}

function AdminRoute({ children, ...rest }) {
  const auth = useAuth();
  return (
    <PrivateRoute
      {...rest}
      render={({ location }) =>
        auth.role === 'admin' ? (
          children
        ) : (
          <Redirect to={{ pathname: '/', state: { from: location } }} />
        )
      }
    />
  );
}

function Home() {
  const [courses, setCourses] = React.useState([]);
  const [greeting, setGreeting] = React.useState('');
  const auth = useAuth();

  React.useEffect(() => {
    if (auth.token) {
      fetch('http://localhost:3001/api/courses', {
        headers: { Authorization: 'Bearer ' + auth.token }
      })
        .then(res => res.json())
        .then(data => setCourses(data.courses || []))
        .catch(() => setCourses([]));
    }
    fetch('http://localhost:3001/api/hello')
      .then(res => res.json())
      .then(data => setGreeting(data.message))
      .catch(() => setGreeting(''));
  }, [auth.token]);

  return (
    <div>
      <h1>Home</h1>
      <p>{greeting}</p>
      {auth.token ? (
        <>
          <h2>Available Courses</h2>
          <ul>
            {courses.map(c => (
              <li key={c.id}>{c.title}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Please log in to view courses.</p>
      )}
    </div>
  );
}

function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const auth = useAuth();
  const history = ReactRouterDOM.useHistory();

  const handleSubmit = async e => {
    e.preventDefault();
    const ok = await auth.login(email, password);
    if (ok) history.push('/');
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const auth = useAuth();
  const history = ReactRouterDOM.useHistory();

  const handleSubmit = async e => {
    e.preventDefault();
    const ok = await auth.register(name, email, password);
    if (ok) history.push('/');
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

function Profile() {
  const auth = useAuth();
  return (
    <div>
      <h1>Profile</h1>
      {auth.token ? (
        <>
          <p>Role: {auth.role}</p>
          <button onClick={auth.logout}>Logout</button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

function Recommendations() {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:3001/api/recommendations')
      .then(res => res.json())
      .then(data => setItems(data.recommendations || []));
  }, []);

  return (
    <div>
      <h1>Recommendations</h1>
      <ul>
        {items.map(i => (
          <li key={i.id}>{i.title}</li>
        ))}
      </ul>
    </div>
  );
}

function Quiz() {
  const [answer, setAnswer] = React.useState('');
  const [score, setScore] = React.useState(null);

  const submit = e => {
    e.preventDefault();
    fetch('http://localhost:3001/api/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    })
      .then(res => res.json())
      .then(data => setScore(data.score));
  };

  return (
    <div>
      <h1>Quiz</h1>
      <form onSubmit={submit}>
        <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Your answer" />
        <button type="submit">Submit</button>
      </form>
      {score !== null && <p>Your score: {score}</p>}
    </div>
  );
}

function Chat() {
  const [message, setMessage] = React.useState('');
  const [response, setResponse] = React.useState('');

  const send = e => {
    e.preventDefault();
    fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
      .then(res => res.json())
      .then(data => setResponse(data.response));
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <form onSubmit={send}>
        <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Say something" />
        <button type="submit">Send</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
}

function Admin() {
  const [title, setTitle] = React.useState('');
  const [courses, setCourses] = React.useState([]);
  const auth = useAuth();

  const addCourse = e => {
    e.preventDefault();
    fetch('http://localhost:3001/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      },
      body: JSON.stringify({ title })
    })
      .then(res => res.json())
      .then(data => setCourses([...courses, { id: data.id, title }]));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <form onSubmit={addCourse}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Course title" />
        <button type="submit">Add Course</button>
      </form>
      <ul>
        {courses.map(c => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  );
}

function Navigation() {
  const auth = useAuth();
  return (
    <nav>
      <Link to="/">Home</Link> |{' '}
      <Link to="/recommendations">Recommendations</Link> |{' '}
      <Link to="/quiz">Quiz</Link> |{' '}
      <Link to="/chat">Chat</Link> |{' '}
      {auth.token ? (
        <>
          <Link to="/profile">Profile</Link>{' '}
          {auth.role === 'admin' && <Link to="/admin">Admin</Link>}
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/recommendations" component={Recommendations} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/chat" component={Chat} />
          <PrivateRoute path="/profile">
            <Profile />
          </PrivateRoute>
          <PrivateRoute path="/admin">
            <Admin />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

===
function App() {

 my48cv-codex/set-up-project-repository-and-structure
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


 main
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
 fwblsu-codex/set-up-project-repository-and-structure

    my48cv-codex/set-up-project-repository-and-structure
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
main
      )
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
