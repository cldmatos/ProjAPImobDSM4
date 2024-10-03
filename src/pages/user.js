import React, {Component} from 'react';
import api from '../services/api';
import {
  Container,
  Header,
  Avatarperfil,
  Nameperfil,
  Bioperfil,
  Starred,
  Stars,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  state = {
    episodes: [],
  };

  async componentDidMount() {
    const {route} = this.props;
    const {user} = route.params;

    // Consultando os episódios associados ao personagem
    const episodeUrls = user.episode; // Array de URLs dos episódios
    const episodesPromises = episodeUrls.map(url => api.get(url));

    const episodesResponses = await Promise.all(episodesPromises);
    const episodes = episodesResponses.map(response => response.data.name);

    this.setState({episodes});
  }

  render() {
    const {route} = this.props;
    const {user} = route.params;
    const {episodes} = this.state;

    return (
      <Container>
        <Header>
          <Avatarperfil source={{uri: user.avatar}} />
          <Nameperfil>{user.name} ({user.gender})</Nameperfil>
          <Bioperfil>{`${user.status} - ${user.species} - ${user.type}`}</Bioperfil>
        </Header>

        <Stars
          data={episodes}
          keyExtractor={episode => episode}
          renderItem={({item}) => (
            <Starred>
              <Info>
                <Title>{item}</Title>
              </Info>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
