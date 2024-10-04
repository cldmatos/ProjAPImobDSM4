import React, {Component} from 'react';
import {Keyboard, ActivityIndicator, View, Text, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Footer from '/ProjAPImobDSM4/src/pages/footer';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  ProfileButton,
  ProfileButtonText,
} from './styles';
import api from '../services/api';

const styles = {
  card: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  avatar: {
    width: '50%',
    height: '100%',
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  field: {
    fontSize: 12,
    color: 'lightgray',
  },
  details: {
    fontSize: 12,
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  locationContainer: {
    marginTop: 5,
  },
};

export default class Main extends Component {
  state = {
    newUser: '',
    users: [],
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');
    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  async componentDidUpdate(_, prevState) {
    const {users} = this.state;
    if (prevState.users !== users) {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    try {
      const {users, newUser} = this.state;
      this.setState({loading: true});

<<<<<<< HEAD
      let apiUrl = '';

      if (!isNaN(newUser)) {
        apiUrl = `/character/${newUser}`;
      } else {
        apiUrl = `/character/?name=${newUser}`;
      }

      const response = await api.get(apiUrl);

      let character;

      if (response.data.results) {
        if (response.data.results.length === 0) {
          alert('Character not found!');
          this.setState({loading: false});
          return;
        }
        character = response.data.results[0];
      } else {
        character = response.data;
      }
=======
      const response = await api.get(`/character/?name=${newUser}`);

      if (response.data.results.length === 0) {
        alert('Character not found!');
        this.setState({loading: false});
        return;
      }

      const character = response.data.results[0]; 
>>>>>>> 2c201d5e6ff46b25d90f62e2345977aabe174179

      if (users.find(user => user.name === character.name)) {
        alert('Character already added!');
        this.setState({
          loading: false,
        });
        return;
      }

<<<<<<< HEAD
      const episodeUrl = character.episode[0];
      const episodeResponse = await api.get(episodeUrl);
=======
      const episodeUrl = character.episode[0]; 
      const episodeResponse = await api.get(episodeUrl); 
>>>>>>> 2c201d5e6ff46b25d90f62e2345977aabe174179

      const data = {
        name: character.name,
        status: character.status,
        species: character.species,
        type: character.type,
        gender: character.gender,
        origin: character.origin.name,
        location: character.location.name,
        avatar: character.image,
        episodeName: episodeResponse.data.name,
        url: character.url,
        created: character.created,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });

      Keyboard.dismiss();
    } catch (error) {
      alert('Error searching character!');
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const {users, newUser, loading} = this.state;

    return (
      <Container>
        <Form>
          <Input
<<<<<<< HEAD
            placeholder="Search character (name or ID)"
=======
            placeholder="Search character"
>>>>>>> 2c201d5e6ff46b25d90f62e2345977aabe174179
            value={newUser}
            onChangeText={text => this.setState({newUser: text})}
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="search" size={22} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.name}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Image style={styles.avatar} source={{uri: item.avatar}} />

              <View style={styles.infoContainer}>
                <Text style={styles.name}>
                  {item.name}
                </Text>

                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusIndicator,
                      {backgroundColor: item.status === 'Alive' ? 'green' : 'red'},
                    ]}
                  />
                  <Text style={styles.details}>
                    {`${item.status} - ${item.species}`}
                  </Text>
                </View>

                <View style={styles.locationContainer}>
                  <Text style={styles.field}>Last known location:</Text>
                  <Text style={styles.details}>{item.location}</Text>
                </View>

                <View style={styles.locationContainer}>
                  <Text style={styles.field}>First seen in:</Text>
                  <Text style={styles.details}>{item.episodeName}</Text>
                </View>

                <ProfileButton
                  onPress={() => {
                    this.props.navigation.navigate('user', {user: item});
                  }}
                >
                  <ProfileButtonText>See more details</ProfileButtonText>
                </ProfileButton>

                <ProfileButton
                  onPress={() => {
                    this.setState({
                      users: this.state.users.filter(user => user.name !== item.name),
                    });
                  }}
                  style={{backgroundColor: '#FF6347'}}
                >
                  <ProfileButtonText>Delete</ProfileButtonText>
                </ProfileButton>
              </View>
            </View>
          )}
        />
        <Footer />
      </Container>
    );
  }
}
