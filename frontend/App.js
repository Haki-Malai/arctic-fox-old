import React from 'react';
import * as Font from 'expo-font';
import { View } from 'react-native';
import Welcome from './src/notLogged/welcome.component';
import Login from './src/notLogged/login.component';
import Signup  from './src/notLogged/signup.component';
import Home from './src/logged/home.component';
import Account from './src/logged/account.component';
import Earn from './src/logged/earn.component';
import Task from './src/logged/task.component';
import styles from './style';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lang: 'en',
			fontsLoaded: false,
			page: 'welcome',
			accessToken: localStorage.getItem('token'),
			userData: {},
			remember: false,
			data: require('./data.json'),
			level: [[0.5, 3, 0], [0.8, 5, 100], [1.5, 8, 300], [1.7, 15, 600], [2, 22, 1000], [2.3, 60, 3000]]
		}
		this.setPage = this.setPage.bind(this);
		this.setToken = this.setToken.bind(this);
		this.setUserData = this.setUserData.bind(this);
		this.setLang = this.setLang.bind(this);
		this.setRemember = this.setRemember.bind(this);
		this.logout = this.logout.bind(this);
		this.getAuthorized = this.getAuthorized.bind(this);
		this.refreshUserData = this.refreshUserData.bind(this);
	}

	setRemember(bool) {
		this.setState({remember: bool});
	}

	setLang(lang) {
		this.setState({lang: lang});
	}

	setPage(page) {
		this.setState({page: page});
	} 

	setToken(token) {
		localStorage.setItem('token', token);
		this.setState({accessToken: token});
	} 

	setUserData(data) {
		this.setState({userData: data});
	}

	getAuthorized() {
		// Authorization from saved cookie
		if (this.state.accessToken) {
			const requestOptions = {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Accept': '*/*'
				},
				mode: 'cors',
				body: JSON.stringify({access_token: this.state.accessToken})
			}

			fetch(this.state.data.url, requestOptions)
				.then(response => response.json())
				.then(data => {
					if (data.user_data) {
						this.setState({userData: data.user_data});
						this.setState({page: 'home'});
					} else {
						this.setState({page: 'welcome'});
					}
				})
				.catch(e => {
					console.log(e);
				});
		}
	}

	refreshUserData() {
		// Authorization from saved cookie
		if (this.state.accessToken) {
			const requestOptions = {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Accept': '*/*'
				},
				mode: 'cors',
				body: JSON.stringify({access_token: this.state.accessToken})
			}

			fetch(this.state.data.url, requestOptions)
				.then(response => response.json())
				.then(data => {
					if (data.user_data) {
						this.setState({userData: data.user_data});
					} else {
						this.setState({page: 'welcome'});
					}
				})
				.catch(e => {
					console.log(e);
				});
		}
	}

	logout() {
		const requestOptions = {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Accept': '*/*'
			},
			mode: 'cors',
			body: JSON.stringify({access_token: this.state.accessToken})
		}
		fetch(this.state.data.url+'logout', requestOptions)

		localStorage.setItem('token', null);
		localStorage.setItem('userdata', null);
		location.reload();
	}

    async loadFonts() {
        await Font.loadAsync({
            Roboto: require('./assets/fonts/Roboto-Regular.ttf'),

            'Roboto-Bold': {
                uri: require('./assets/fonts/Roboto-Bold.ttf'),
                display: Font.FontDisplay.FALLBACK,
            },
        });
        this.setState({fontsLoaded: true })
    }

    componentDidMount() {
		document.title = "Arctic Fox";
        this.loadFonts();
		this.getAuthorized();
		this.refreshUserData();
    }

    render() {
		// Warn user if font didn't load
		if (!this.state.fontsLoaded) console.warn('Error, unable to load fonts');

		var toRender;

		if (this.state.page === 'welcome') {
			toRender = <Welcome 
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
			/>
		} else if (this.state.page === 'login') {
			toRender = <Login 
				url={this.state.data.url}
				setRemember={this.setRemember}
				remember={this.state.remember}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
			/>
		} else if (this.state.page === 'signup') {
			toRender = <Signup 
				url={this.state.data.url}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
			/>
		} else if (this.state.page === 'home') {
			toRender = <Home 
				url={this.state.data.url}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
			/>
		} else if (this.state.page === 'earn') {
			toRender = <Earn 
				url={this.state.data.url}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
				level={this.state.level}
				owaspList={this.state.data.owaspList}
			/>
		} else if (this.state.page === 'task') {
			toRender = <Task 
				url={this.state.data.url}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
				level={this.state.level}
				owaspList={this.state.data.owaspList}
			/>
		} else if (this.state.page === 'account') {
			toRender = <Account 
				url={this.state.data.url}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
				level={this.state.level}
				logout={this.logout}
			/>
		}
		return (
			<View style={styles.container}>
				{toRender}
			</View>
		);
    }
}