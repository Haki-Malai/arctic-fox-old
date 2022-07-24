import React from 'react';
import { Pressable, Text, Image, View, Linking } from 'react-native';
import styles from '../../../style';

export default class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
			accessToken: localStorage.getItem('token'),
        }
        this.uploadImage = this.uploadImage.bind(this);
    }

    uploadImage() {
        const file = document.querySelector('input[type="file"]').files[0];
        if (file && this.state.accessToken) {
            var formData = new FormData();
            formData.append('image', this.state.file);
            formData.append('user_id', this.props.data.id);
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + this.state.accessToken,
                    'Accept': '*/*'
                },
				mode: 'cors',
				body: formData
            }

            fetch(this.props.url+'upload_avatar', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Image uploaded successfully!');
                    } else {
                        alert('Something went wrong, please try again!');
                    }
                })
                .catch(e => {
                    console.log(e);
            });
        }
    }

    render() {
        return(
            <View style={styles.avatarContainer}>
                <Image
                    source={this.props.avatar}
                    style={this.state.hover? styles.avatarHover: styles.avatar}
                    blurRadius={this.state.hover? 1: 0}
                    onMouseEnter={ () => this.setState({ hover: true})}
                    onMouseLeave={ () => this.setState({ hover: false})}
                />
                { this.state.hover? 
                    <View style={styles.avatarUploadContainer}>
                        <Image 
                            source={require('../../../assets/account/upload.png')} 
                            style={styles.avatarUpload}
                            onMouseEnter={ () => this.setState({ hover: true})}
                        />
                        <input 
                            id="upload"
                            type="file"
                            onChange={() => this.uploadImage()}
                            accept="image/*"
                            style={{ opacity: 0, width: '10em', height: '10em', cursor: 'pointer' }}
                            onMouseEnter={ () => this.setState({ hover: true})}
                        />
                    </View>
                    : null
                }
            </View>
        );
    }
}