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
			url: '',
			lang: 'en',
			fontsLoaded: false,
			page: 'welcome',
			accessToken: localStorage.getItem('token'),
			userData: {},
			avatar: '',
			remember: false,
			data: require('./data.json'),
			level: [[5, 3, 0], [8, 5, 100], [15, 8, 200], [17, 15, 300], [20, 22, 400], [23, 60, 500]]
		}
		this.setPage = this.setPage.bind(this);
		this.setToken = this.setToken.bind(this);
		this.setUserData = this.setUserData.bind(this);
		this.setLang = this.setLang.bind(this);
		this.setRemember = this.setRemember.bind(this);
		this.logout = this.logout.bind(this);
		this.getAuthorized = this.getAuthorized.bind(this);
		this.refreshUserData = this.refreshUserData.bind(this);
		this.setUserAvatar = this.setUserAvatar.bind(this);
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

	setUserAvatar(data) {
		this.setState({avatar: "data:image/jpg;base64," + data});
	}

	getAuthorized() {
		// Authorization from saved cookie
		if (this.state.accessToken) {
			const requestOptions = {
				method: 'GET',
				headers: { 
					'Authorization': 'Bearer ' + this.state.accessToken,
					'Content-Type': 'application/json',
					'Accept': '*/*'
				},
				mode: 'cors',
			}

			fetch(this.state.url + 'user', requestOptions)
				.then(response => response.json())
				.then(data => {
					if (data.status === 200) {
						this.setState({userData: JSON.parse(data.userData)});
						this.setState({page: 'home'});
						this.setUserAvatar(data.avatar);
					} else if (data.status === 400) {
						console.log(data.status);
						this.setState({page: 'login'});
					}
				})
				.catch(e => {
					console.log(e);
					console.log(e.lineNumber);
				});
		}
	}

	refreshUserData() {
		// Authorization from saved cookie
		if (this.state.accessToken) {
			const requestOptions = {
				method: 'GET',
				headers: { 
					'Authorization': 'Bearer ' + this.state.accessToken,
					'Content-Type': 'application/json',
					'Accept': '*/*'
				},
				mode: 'cors',
			}

			fetch(this.state.url + 'user', requestOptions)
				.then(response => response.json())
				.then(data => {
					if (data.status === 200) {
						this.setState({userData: JSON.parse(data.userData)});
						this.setUserAvatar(data.avatar);
					} else if (data.status === 400) {
						console.log(data.status);
						this.setState({page: 'welcome'});
					}
				})
				.catch(e => {
					console.log(e);
					console.log(e.lineNumber);
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
		fetch(this.state.url+'logout', requestOptions)

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
				url={this.state.url}
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
				url={this.state.url}
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
				url={this.state.url}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
				avatar={this.state.avatar}
			/>
		} else if (this.state.page === 'earn') {
			toRender = <Earn 
				url={this.state.url}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
				level={this.state.level}
				owaspList={this.state.data.owaspList}
				avatar={this.state.avatar}
			/>
		} else if (this.state.page === 'task') {
			toRender = <Task 
				url={this.state.url}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
				level={this.state.level}
				owaspList={this.state.data.owaspList}
				avatar={this.state.avatar}
			/>
		} else if (this.state.page === 'account') {
			toRender = <Account 
				url={this.state.url}
				setLang={this.setLang}
				lang={this.state.lang}
				setPage={this.setPage} 
				setToken={this.setToken}
				setUserData={this.setUserData}
				refreshUserData={this.refreshUserData}
				userData={this.state.userData}
				level={this.state.level}
				logout={this.logout}
				avatar={this.state.avatar}
			/>
		}
		return (
			<View style={styles.container}>
				{toRender}
			</View>
		);
    }
}