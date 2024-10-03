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
    const { user } = route.params || {}; // Protegendo o acesso
    const { episodes, error } = this.state;

    if (!user) {
      return <Text>Usuário não encontrado.</Text>; // Mensagem de erro
    }

    return (
      <Container>
        <Header>
          <Avatarperfil source={{ uri: user.avatar || 'default_avatar_url' }} />
          <Nameperfil>{user.name || 'Nome não disponível'} ({user.gender || 'Gênero não disponível'})</Nameperfil>

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
            <Bioperfil>{`${user.status || 'Status desconhecido'} - ${user.species || 'Espécie desconhecida'} - ${user.type || 'N/A'}`}</Bioperfil>
          </View>

          <Bioperfil>
            {`${user.origin?.name || 'Origem desconhecida'} - ${user.location?.name || 'Localização desconhecida'}`}
          </Bioperfil>

          <Bioperfil onPress={() => Linking.openURL(user.url)}>
            {user.url || 'URL não disponível'}
          </Bioperfil>

          <Bioperfil>{`Data de criação: ${user.created || 'Data não disponível'}`}</Bioperfil>

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
