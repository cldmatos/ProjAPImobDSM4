import React, {Component} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

import api from '../services/api';

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

      // Fazendo a requisição para buscar personagem pelo nome
      const response = await api.get(`/character/?name=${newUser}`);

      if (response.data.results.length === 0) {
        alert('Personagem não encontrado!');
        this.setState({loading: false});
        return;
      }

      const character = response.data.results[0]; // Pegando o primeiro resultado

      if (users.find(user => user.name === character.name)) {
        alert('Personagem já adicionado!');
        this.setState({
          loading: false,
        });
        return;
      }

      const data = {
        name: character.name,
        status: character.status,
        species: character.species,
        avatar: character.image,
        location: character.location.name,
        episodes: character.episodes.name,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });

      Keyboard.dismiss();
    } catch (error) {
      alert('Erro ao buscar o personagem!');
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
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar personagem"
            value={newUser}
            onChangeText={text => this.setState({newUser: text})}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={22} color="#fff" />
            )}
          </SubmitButton>
        </Form>
        <List
          showsVerticalScrollIndicator={false}
          data={users}
          keyExtractor={user => user.name}
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.avatar}} />
              <Name>{item.name}</Name>
              <Bio>{`${item.status} - ${item.species}`}</Bio>
              <Bio>{`Last known location: ${item.location}`}</Bio>
              <Bio>{`First seen in: ${item.episodes.name}`}</Bio>

              <ProfileButton
                onPress={() => {
                  this.props.navigation.navigate('user', {user: item});
                }}
              >
                <ProfileButtonText>Ver Perfil</ProfileButtonText>
              </ProfileButton>
              <ProfileButton
                onPress={() => {
                  this.setState({
                    users: this.state.users.filter(
                      user => user.name !== item.name
                    ),
                  });
                }}
                style={{backgroundColor: '#FFC0CB'}}
              >
                <ProfileButtonText>Excluir</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
