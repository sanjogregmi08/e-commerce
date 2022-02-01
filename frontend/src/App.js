import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Screens
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';

const App = () => {
	return (
		<BrowserRouter>
			<Header />
			<main>
				<Container className='py-3'>
					<Switch>
						<Route path="/" component={HomeScreen} exact />
						<Route path="/product/:id" component={ProductScreen} />
						<Route path="/cart/:id?" component={CartScreen} />
						<Route path="/login" component={LoginScreen} />
						<Route path="/register" component={RegisterScreen} />
						<Route path="/profile" component={ProfileScreen} />
						<Route path="/shipping" component={ShippingScreen} />
					</Switch>
				</Container>
			</main>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
