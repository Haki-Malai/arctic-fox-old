import React from "react";
import {
    Pressable,
    Text,
    TextInput,
    View,
    Image,
    ActivityIndicator,
    CheckBox,
} from "react-native";
import Lang from "../lang.component";
import styles from "../../style";

var data = require("../../data.json");

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loading: false,
        };
        this.commitLogin = this.commitLogin.bind(this);
    }
    commitLogin() {
        this.setState({ loading: true });
        if (this.state.username == "" || this.state.password == "") {
            alert(
                this.props.lang == "en"
                    ? "Please fill out the fields."
                    : "Παρακαλούμε συμπληρώστε τα πεδία"
            );
        } else if (
            this.state.username.length > 25 ||
            this.state.username.length < 8
        ) {
            alert(
                this.props.lang == "en"
                    ? "Username must be at least 8 characters and no more than 25."
                    : "Το όνομα χρήστη πρέπει να είναι τουλάχιστον 8 ψηφία και δεν μπορεί να ξεπερνάει τους 25 χαρακτήρες."
            );
        } else if (
            this.state.password.length > 25 ||
            this.state.password.length < 8
        ) {
            alert(
                this.props.lang == "en"
                    ? "Password must be at least 8 characters and no more than 25."
                    : "Ο κωδικός πρόσβασης πρέπει να είναι τουλάχιστον 8 ψηφία και δεν μπορεί να ξεπερνάει τους 25 χαρακτήρες."
            );
        } else {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
                mode: "cors",
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                }),
            };
            fetch(this.props.url + "login", requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        localStorage.setItem("token", data.access_token);
                        location.reload();
                    } else {
                        alert(
                            this.props.lang == "en"
                                ? "Invalid username/password compination"
                                : "Λανθασμένος συνδιασμός όνομα χρήστη και κωδικού"
                        );
                        this.setState({ loading: false });
                    }
                })
                .catch((e) => {
                    this.setState({ loading: false });
                    alert(e);
                });
        }
    }
    render() {
        return (
            <View style={[styles.container, styles.menuContainer]}>
                <Image
                    style={styles.welcomeLogo}
                    source={require("../../assets/logo.png")}
                />
                <Text style={styles.welcomeTitle}>ArcticFox</Text>
                <TextInput
                    style={styles.menuInput}
                    placeholder={
                        this.props.lang == "en" ? "Username" : "Όνομα χρήστη"
                    }
                    value={this.state.username}
                    onChangeText={(input) => this.setState({ username: input })}
                ></TextInput>
                <TextInput
                    style={styles.menuInput}
                    placeholder={
                        this.props.lang == "en" ? "Password" : "Κωδικός"
                    }
                    onChangeText={(input) => this.setState({ password: input })}
                    value={this.state.password}
                    secureTextEntry={true}
                ></TextInput>
                <View style={styles.loginCheckbox}>
                    <CheckBox
                        value={this.props.remember}
                    ></CheckBox>
                    <Text style={styles.loginCheckboxLabel}>
                        {this.props.lang == "en" ? "Remember me" : "Θυμήσου με"}
                    </Text>
                </View>
                <Pressable
                    style={styles.menuPressable}
                    onPress={() => {
                        this.commitLogin();
                    }}
                >
                    <Text style={styles.textPressable}>
                        {this.props.lang === "en" ? "Log In" : "Σύνδεση"}
                    </Text>
                    {this.state.loading && (
                        <ActivityIndicator
                            style={styles.menuLoading}
                            color={"#fff"}
                        />
                    )}
                </Pressable>
                <Text
                    style={styles.link}
                    onPress={() => {
                        this.props.setPage("signup");
                    }}
                >
                    {this.props.lang === "en"
                        ? "Don't have an account? Sign up"
                        : "Δεν έχετε λογαριασμό; Εγγραφή"}
                </Text>
                <Lang
                    lang={this.props.lang}
                    setLang={this.props.setLang}
                ></Lang>
            </View>
        );
    }
}
