import React from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import styles from "../../../style";

export default class Payment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            new_address: "",
            password: "",
			accessToken: localStorage.getItem("token"),
            paymentExpanded: false,
            payments: [],
            requestsExpanded: false,
            requests: []
        }
        this.changeAddress = this.changeAddress.bind(this);
        this.requestPayment = this.requestPayment.bind(this);
        this.expandPayment = this.expandPayment.bind(this);
    }

    changeAddress() {
        if (this.state.new_address) {
			const requestOptions = {
				method: "POST",
				headers: { 
					"Authorization": "Bearer " + this.state.accessToken,
                    "Content-Type": "application/json",
					"Accept": "*/*"
				},
				mode: "cors",
				body: JSON.stringify({
                    password: this.state.password,
                    address: this.state.new_address
                })
			}

			fetch(this.props.url+"change_address", requestOptions)
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						alert("Address changed!");
                        this.setState({new_address: ""});
                        this.setState({password: ""});
                        this.props.refreshUserData();
					} else {
						alert("Something went wrong!");
					}
				})
				.catch(e => {
					console.log(e);
				});
        }
    }

    requestPayment() {
        if (this.props.userData.balance == 0) {
            alert("Low balance!");
        } else if (this.state.accessToken) {
			const requestOptions = {
				method: "GET",
				headers: {
					"Authorization": "Bearer " + this.state.accessToken,
					"Accept": "*/*"
				},
				mode: "cors",
			}

			fetch(this.props.url+"request_payment", requestOptions)
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						alert("Request has been submitted!");
                        this.props.refreshUserData();
					} else {
						alert("Something went wrong!");
					}
				})
				.catch(e => {
					console.log(e);
				});
        }
    }

    expandPayment() {
        if (this.state.accessToken) {
			const requestOptions = {
				method: "GET",
				headers: { 
					"Authorization": "Bearer " + this.state.accessToken,
					"Accept": "*/*"
				},
				mode: "cors",
			}

			fetch(this.props.url+"payment_history", requestOptions)
				.then(response => response.json())
				.then(data => {
					if (data.payments) {
                        this.setState({payments: data.payments});
                        this.setState({paymentExpanded: !this.state.paymentExpanded});
					} else {
						alert("Something went wrong!");
					}
				})
				.catch(e => {
					console.log(e);
				});
        }
    }

    expandRequests() {
        if (this.state.accessToken) {
			const requestOptions = {
				method: "GET",
				headers: { 
					"Authorization": "Bearer " + this.state.accessToken,
					"Accept": "*/*"
				},
				mode: "cors",
			}

			fetch(this.props.url+"payment_requests", requestOptions)
				.then(response => response.json())
				.then(data => {
					if (data.requests) {
                        this.setState({requests: data.requests});
                        this.setState({requestsExpanded: !this.state.requestsExpanded});
					} else {
						alert("Something went wrong!");
					}
				})
				.catch(e => {
					console.log(e);
				});
        }
    }

    render() {
        var paymentHistory = [];
        if (this.state.paymentExpanded) {
            for (let i=0; i<this.state.payments.length; i++) {
                var paymentData = JSON.parse(this.state.payments[i])
                paymentHistory.push(
                    <View key={i} style={styles.paymentMiniContainer} >
                        <Text >Payment #{i+1}</Text>
                        <Text >Amount: {paymentData.amount}</Text>
                        <Text >TxID: {paymentData.tx_id}</Text>
                    </View>
                )
            }
        }

        var requestHistory = [];
        if (this.state.requestsExpanded) {
            for (let i=0; i<this.state.requests.length; i++) {
                var requestData = JSON.parse(this.state.requests[i])
                requestHistory.push(
                    <View key={i} style={styles.paymentMiniContainer} >
                        <Text >Request #{i+1}</Text>
                        <Text >Amount: {requestData.amount}</Text>
                    </View>
                )
            }
        }
        return(
            <View style={styles.paymentContainer}>
                <Text > {this.props.lang=="en"? "Current BTC Address": "Τωρινή BTC διεύθυνση"}:</Text>
                <Text >{this.props.userData.bitcoin_address}</Text>

                <View style={styles.paymentContainer}>
                    <TextInput 
                        style={styles.paymentInput} 
                        placeholder={this.props.lang=="en"? "New Address": "Νέα Διεύθυνση"}
                        value={this.state.new_address}
                        onChangeText={input => this.setState({new_address: input})}
                    >
                    </TextInput>
                    <TextInput 
                        secureTextEntry={true}
                        style={styles.paymentInput} 
                        placeholder={this.props.lang=="en"? "Password": "Κωδικός"}
                        value={this.state.password}
                        onChangeText={input => this.setState({password: input})}
                    >
                    </TextInput>
                    <Pressable style={styles.paymentPressable} onPress={() => this.changeAddress()} >
                        <Text style={styles.paymentPressableText}>{this.props.lang=="en"? "Change Address": "Αλλαγή Διεύθυνσης"}</Text>
                    </Pressable>
                </View>

                <View style={styles.paymentContainer}>
                    <Text >Balance: {this.props.userData.balance}€</Text>
                    <Pressable style={styles.paymentPressable} onPress={() => this.requestPayment()} >
                        <Text style={styles.paymentPressableText}>{this.props.lang=="en"? "Request for payment": "Αίτημα για πληρωμή"}</Text>
                    </Pressable>
                </View>

                <View style={styles.paymentContainer}>
                    <Pressable style={styles.paymentPressableMini} onPress={() => this.expandPayment()} >
                        <Text style={styles.paymentPressableText}>{this.props.lang=="en"? "Payment history": "Ιστορικό πληρωμών"}</Text>
                    </Pressable>
                    {paymentHistory}
                </View>

                <View style={styles.paymentContainer}>
                    <Pressable style={styles.paymentPressableMini} onPress={() => this.expandRequests()} >
                        <Text style={styles.paymentPressableText}>{this.props.lang=="en"? "Unpaid requests": "Μη πληρωμένες αιτήσεις"}</Text>
                    </Pressable>
                    {requestHistory}
                </View>
            </View>
        )
    }
}