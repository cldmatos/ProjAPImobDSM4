import React, { Component } from 'react';
import { Linking, View, Text, Image } from 'react-native';
import api from '../services/api';

import {
  Container,
  Header,
  Nameperfil,
  Bioperfil,
  Starred,
  Stars,
  Info,
  Title,
} from './styles';

const styles = {
  card: {
    flexDirection: 'row', // Alterado para 'row' para colocar a imagem à esquerda
    backgroundColor: '#333', // Cor cinza escuro
    borderRadius: 10, // Bordas arredondadas do card
    padding: 10,
    margin: 10,
    alignItems: 'center', // Mantém a imagem e o texto alinhados verticalmente
  },
  avatar: {
    width: '50%', // Imagem ocupa metade da largura do card
    height: '100%', // Altura do card
    borderRadius: 10, // Para bordas arredondadas
    marginRight: 10, // Remove a margem
  },
  infoContainer: {
    flex: 1, // Para ocupar o espaço restante
    alignItems: 'flex-start', // Alinha o texto à esquerda
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white', // Cor do texto
    textAlign: 'left', // Alinhamento à esquerda
  },
  details: {
    fontSize: 11,
    color: 'lightgray', // Cor dos detalhes
    textAlign: 'left', // Alinhamento à esquerda
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Alinha o status à esquerda
  },
  statusIndicator: {
    width: 8, // Diminuindo o tamanho da bola
    height: 8,
    borderRadius: 4, // Mantendo a forma circular
    marginRight: 5,
  },
  locationContainer: {
    marginTop: 5, // Espaçamento superior
    alignItems: 'flex-start', // Alinha os textos à esquerda
  },
  label: {
    fontWeight: 'bold', // Para destacar os rótulos
    color: 'white',
  },
};

export default class User extends Component {
  state = {
    episodes: [],
    error: null,
  };

  async componentDidMount() {
    const { route } = this.props;
    const { user } = route.params;

    try {
      const episodeUrls = user.episode || [];
      if (episodeUrls.length > 0) {
        const episodesPromises = episodeUrls.map(url => api.get(url));
        const episodesResponses = await Promise.all(episodesPromises);
        const episodes = episodesResponses.map(response => response.data.name);
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
          <View style={styles.card}>
            <Image style={styles.avatar} source={{ uri: user.avatar }} />

            <View style={styles.infoContainer}>
              <Nameperfil style={styles.name}>
                {user.name} ({user.gender})
              </Nameperfil>

              <View style={styles.statusContainer}>
                <View
                  style={[styles.statusIndicator, { backgroundColor: user.status === 'Alive' ? 'green' : 'red' }]}
                />
                <Bioperfil style={styles.details}>
                  {`${user.status} - ${user.species}`}
                </Bioperfil>
              </View>

              {/* Last known location */}
              <View style={styles.locationContainer}>                
                <Bioperfil style={styles.details}>
                  {`Last known location: ${user.location}`}
                </Bioperfil>
              </View>

              {/* First seen */}
              <View style={styles.locationContainer}>                
                <Bioperfil style={styles.details}>
                  {`First seen: ${user.episodeName}`}
                </Bioperfil>
              </View>

              {/* URL */}
              <View style={styles.locationContainer}>                
                <Bioperfil
                  style={[styles.details, { color: 'blue' }]}
                  onPress={() => Linking.openURL(user.url)}
                >
                  {user.url}
                </Bioperfil>
              </View>

              {/* Created */}
              <View style={styles.locationContainer}>                
                <Bioperfil style={styles.details}>
                  {`Created: ${user.created}`}
                </Bioperfil>
              </View>
            </View>
          </View>

          {error ? (
            <Text style={{ fontSize: 12, color: 'red', textAlign: 'center' }}>{error}</Text>
          ) : (
            <Stars
              data={episodes}
              keyExtractor={episode => episode}
              renderItem={({ item }) => (
                <Starred>
                  <Info>
                    <Title style={{ textAlign: 'center' }}>{item}</Title>
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
