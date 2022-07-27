import React from "react";
import { View, Text, ScrollView } from "react-native";
import Navigator from "./navigator.component";
import TaskNavigator from "./task/taskNavigator.component";
import Media from "./task/media.component";
import styles from "../../style";

export default class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            loading: false,
            page: "process",
            tasks: "",
			accessToken: localStorage.getItem("token"),
        }
        this.setPage = this.setPage.bind(this);
    }
    setPage(page) {
        this.setState({page: page});
    }
    fetchTasks() {
		// Retrieve tasks from server
		if (this.props.userData) {
			const requestOptions = {
				method: "GET",
                headers: { 
                    "Authorization": "Bearer " + this.state.accessToken,
                    "Accept": "*/*"
                },
				mode: "cors",
			}

			fetch(this.props.url+"user_tasks", requestOptions)
				.then(response => response.json())
				.then(data => {
					if (data.tasks) {
                        var tasks = [];
                        for (let i=0; i<data.tasks.length; i++) {
                            var obj = data.tasks[i];
                            tasks.push(JSON.parse(obj));
                        }
						this.setState({tasks: tasks});
					} else {
                        alert("Couldn't retrieve user data!");
					}
				})
				.catch(e => {
					console.log(e);
				});
        } else {
            alert("Couldn't retrieve user data!");
        }
        setTimeout(() => this.fetchTasks(), 10000);
    }
    componentDidMount() {
        this.fetchTasks();
		this.props.refreshUserData();
    }
    render() {
        var toRender = [];
        if (this.state.page==="process") {
            var noData = true;
            for (let i=0; i<this.state.tasks.length; i++) {
                var task_data = this.state.tasks[i];
                if (task_data.status === 0) {
                    noData = false;
                    toRender.push(<Media key={i} mkey={i} enabled={true} data={task_data} lang={this.props.lang} url={this.props.url}></Media>);
                }
            }
            if (noData) {
                toRender = <Text style={styles.noData}>No Data Available</Text>
            } 
        } else if (this.state.page==="pending") {
            var noData = true;
            for (let i=0; i<this.state.tasks.length; i++) {
                var task_data = this.state.tasks[i];
                if (task_data.status === 1) {
                    noData = false;
                    toRender.push(<Media key={i} mkey={i} enabled={true} data={task_data} lang={this.props.lang} url={this.props.url}></Media>);
                }
            }
            if (noData) {
                toRender = <Text style={styles.noData}>No Data Available</Text>
            } 
        } else if (this.state.page==="approved") {
            var noData = true;
            for (let i=0; i<this.state.tasks.length; i++) {
                var task_data = this.state.tasks[i];
                if (task_data.status === 2) {
                    noData = false;
                    toRender.push(<Media key={i} mkey={i} enabled={true} data={task_data} lang={this.props.lang} url={this.props.url}></Media>);
                }
            }
            if (noData) {
                toRender = <Text style={styles.noData}>No Data Available</Text>
            } 
        } else if (this.state.page==="others") {
            var noData = true;
            for (let i=0; i<this.state.tasks.length; i++) {
                var task_data = this.state.tasks[i];
                if (task_data.status === 3) {
                    noData = false;
                    toRender.push(<Media key={i} mkey={i} enabled={true} data={task_data} lang={this.props.lang} url={this.props.url}></Media>);
                }
            }
            if (noData) {
                toRender = <Text style={styles.noData}>No Data Available</Text>
            } 
        }
        return(
            <View style={styles.container}>
                <View style={styles.container}>
                    <TaskNavigator setPage={this.setPage} page={this.state.page} lang={this.props.lang}></TaskNavigator>
                    {toRender}
                </View>
                <Navigator lang={this.props.lang} setPage={this.props.setPage} page={2}/>
            </View>
        );
    }
}