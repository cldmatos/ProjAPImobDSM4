import React, { Component } from 'react';
import { Linking, View, Text } from 'react-native';
import api from '../services/api';

import {
  Container,
  Header,
  Avatarperfil,
  Nameperfil,
  Bioperfil,
  Starred,
  Stars,
  Info,
  Title,
} from './styles';

export default class User extends Component {
  state = {
    episodes: [], // Lista de episódios
    error: null,  // Para capturar possíveis erros
  };

  async componentDidMount() {
    const { route } = this.props;
    const { user } = route.params;

    try {
      // Consultando os episódios associados ao personagem
      const episodeUrls = user.episode || []; // Usar um array vazio se episode não estiver definido
      if (episodeUrls.length > 0) {
        const episodesPromises = episodeUrls.map(url => api.get(url));
        const episodesResponses = await Promise.all(episodesPromises);
        const episodes = episodesResponses.map(response => response.data.name); // Nome de cada episódio
        this.setState({ episodes });
      }
    } catch (error) {
      console.error('Erro ao carregar episódios:', error);
      this.setState({ error: 'Erro ao carregar episódios' });
    }
  }

  render() {
    const { route } = this.props;
    const { user } = route.params;
    const { episodes, error } = this.state;

    return (
      <Container>
        <Header>
          {/* Avatar do personagem */}
          <Avatarperfil source={{ uri: user.avatar }} />

          {/* Primeira linha: Nome e Gênero */}
          <Nameperfil style={{ fontSize: 14, fontWeight: 'bold' }}>
            {user.name} ({user.gender})
          </Nameperfil>

          {/* Segunda linha: Status, Species e Type com indicador de status */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: user.status === 'Alive' ? 'green' : 'red',
                marginRight: 5,
              }}
            />
            <Bioperfil style={{ fontSize: 12 }}>
              {`${user.status} - ${user.species} - ${user.type || 'N/A'}`}
            </Bioperfil>
          </View>

          {/* Terceira linha: Origem e Localização */}
          <Bioperfil style={{ fontSize: 12 }}>
            {`${user.origin.name} - ${user.location.name}`}
          </Bioperfil>

          {/* Quarta linha: URL do personagem como link */}
          <Bioperfil
            style={{ fontSize: 12, color: 'blue' }}
            onPress={() => Linking.openURL(user.url)}
          >
            {user.url}
          </Bioperfil>

          {/* Quinta linha: Data de criação exatamente como está */}
          <Bioperfil style={{ fontSize: 12 }}>
            {`Data de criação: ${user.created}`}
          </Bioperfil>

          {/* Renderizando episódios */}
          {error ? (
            <Text style={{ fontSize: 12, color: 'red' }}>{error}</Text>
          ) : (
            <Stars
              data={episodes}
              keyExtractor={episode => episode}
              renderItem={({ item }) => (
                <Starred>
                  <Info>
                    <Title>{item}</Title>
                  </Info>
                </Starred>
              )}
            />
          )}
        </Header>
      </Container>
    );
  }
}