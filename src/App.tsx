import * as React from 'react'
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
  withRouter
} from 'react-router-dom'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb: () => void) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb: () => void) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends React.Component<RouteComponentProps<any>> {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    return (
      <div>
        <p>You must log in to view the page {from && `at ${from.pathname}`}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

// A route to keep unauthed users from accessing private content
const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  // Must verify that component exists before creating it
  if (Component) {
    const routeRenderProp = (props: RouteComponentProps<any>) => (
      fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
    );
    return <Route {...rest} render={routeRenderProp} />
  }
  return null;
}

// A route to keep authed users from reaching pages that should only
// be exposed to unauthed users (login, signup)
const PublicOnlyRoute = ({ component: Component, ...rest }: RouteProps) => {
  // Must verify that component exists before creating it
  if (Component) {
    const routeRenderProp = (props: RouteComponentProps<any>) => (
      fakeAuth.isAuthenticated === false
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/protected',
        state: { from: props.location }
      }} />
    );
    return <Route {...rest} render={routeRenderProp} />
  }
  return null;
}

const AuthButton = withRouter(({ history }) => {
  const signOut = () => fakeAuth.signout(() => history.push('/'));

  return (
    fakeAuth.isAuthenticated ?
      <p>Welcome! <button onClick={signOut}>Sign out</button></p>
      : <p>You are not logged in.</p>
  )
})

export default function AuthExample() {
  return (
    <Router>
      <div>
        <AuthButton />
        <ul>
          <li><Link to="/public">Public Page</Link></li>
          <li><Link to="/protected">Protected Page</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
        <Route path="/public" component={Public} />
        <PublicOnlyRoute path="/login" component={Login} />
        <PrivateRoute path='/protected' component={Protected} />
      </div>
    </Router>
  )
}
