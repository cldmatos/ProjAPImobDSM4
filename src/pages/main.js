import React, {Component} from 'react';
import {Keyboard, ActivityIndicator, View} from 'react-native';
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

      // Verifica se o personagem já foi adicionado
      if (users.find(user => user.name === character.name)) {
        alert('Personagem já adicionado!');
        this.setState({
          loading: false,
        });
        return;
      }

      // Fazendo a requisição para buscar o nome do primeiro episódio
      const episodeUrl = character.episode[0]; // Primeiro episódio da lista
      const episodeResponse = await api.get(episodeUrl); // Requisição à URL do episódio

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
            placeholder="Buscar personagem"
            value={newUser}
            onChangeText={text => this.setState({newUser: text})}
            returnKeyType="send"
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
          showsVerticalScrollIndicator={false}
          data={users}
          keyExtractor={user => user.name}
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.avatar}} />
              <Name>{item.name}</Name>
              {/* Indicador de status (verde para "alive", vermelho para outros) */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: item.status === 'Alive' ? 'green' : 'red',
                    marginRight: 5,
                  }}
                />
                <Bio>{`${item.status} - ${item.species}`}</Bio>
              </View>
              <Bio>{`Last known location: ${item.location}`}</Bio>
              <Bio>{`First seen in: ${item.episodeName}`}</Bio>

              <ProfileButton
                onPress={() => {
                  this.props.navigation.navigate('user', {user: item});
                }}
              >
                <ProfileButtonText>Ver mais detalhes</ProfileButtonText>
              </ProfileButton>
              <ProfileButton
                onPress={() => {
                  this.setState({
                    users: this.state.users.filter(
                      user => user.name !== item.name
                    ),
                  });
                }}
                style={{backgroundColor: '#FF6347'}}
              >
                <ProfileButtonText>Apagar</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}