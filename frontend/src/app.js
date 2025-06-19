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
  }, [auth.token]);

  return (
    <div>
      <h1>Home</h1>
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
