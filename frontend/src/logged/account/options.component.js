import React from "react";
import { View, Text, Image, Pressable } from 'react-native';
import Password from './password.component';
import Support from './support.component';
import Guide from './guide.component'
import styles from '../../../style';

export default class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: 'none'
        }
    }
    render() {
        var toExpand;
        if (this.state.option === 'support') {
            toExpand = <Support lang={this.props.lang}></Support>
        }else if (this.state.option === 'guide') {
            toExpand = <Guide url={this.props.url} lang={this.props.lang}></Guide>
        } else if (this.state.option === 'password') {
            toExpand = <Password url={this.props.url} lang={this.props.lang} username={this.props.username}></Password>
        }
        return(
            <View style={styles.accountOptions}>
                <Pressable style={styles.accountOption} onPress={() => this.state.option!='support'? this.setState({option: 'support'}): this.setState({option: 'none'})} >
                    <Image style={styles.accountOptionPressableIcon} source={require('../../../assets/account/headset.png')}/>
                    <Text style={styles.accountOptionPressableText}>{this.props.lang==='en'? 'Customer service': 'Εξυπηρέτηση πελατών'}</Text>
                </Pressable>
                {this.state.option==='support'? toExpand: null}
                <Pressable style={styles.accountOption} onPress={() => this.state.option!='guide'? this.setState({option: 'guide'}): this.setState({option: 'none'})} >
                    <Image style={styles.accountOptionPressableIcon} source={require('../../../assets/account/book.png')}/>
                    <Text style={styles.accountOptionPressableText}>{this.props.lang==='en'? 'User guidance': 'Οδηγίες χρήσης'}</Text>
                </Pressable>
                {this.state.option==='guide'? toExpand: null}
                <Pressable style={styles.accountOption} onPress={() => this.state.option!='password'? this.setState({option: 'password'}): this.setState({option: 'none'})} >
                    <Image style={styles.accountOptionPressableIcon} source={require('../../../assets/account/lock.png')}/>
                    <Text style={styles.accountOptionPressableText}>{this.props.lang==='en'? 'Change password': 'Αλλαγή κωδικού'}</Text>
                </Pressable>
                {this.state.option==='password'? toExpand: null}
                <Pressable style={styles.accountLogout} onPress={() => this.props.logout()} >
                    <Text style={styles.accountOptionPressableText}>{this.props.lang==='en'? 'Log Out': 'Αποσύνδεση'}</Text>
                </Pressable>
            </View>
        );
    }
}