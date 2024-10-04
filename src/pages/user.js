import React, { Component } from 'react';
import { Linking, View, Text, Image } from 'react-native';
import api from '../services/api';
import Footer from '/ProjAPImobDSM4/src/pages/footer';

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
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white', 
    textAlign: 'left', 
  },
field: {
    fontSize: 11,
    color: 'lightgray', 
    textAlign: 'left', 
  },
  details: {
    fontSize: 12,
    color: 'white', 
    textAlign: 'left', 
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
  },
  statusIndicator: {
    width: 8, 
    height: 8,
    borderRadius: 4, 
    marginRight: 5,
  },
  locationContainer: {
    marginTop: 5, 
    alignItems: 'flex-start', 
  },
  label: {
    fontWeight: 'bold', 
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
      console.error('Error loading episodes:', error);
      this.setState({ error: 'Error loading episodes' });
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
                <Bioperfil style={styles.field}>
                  {`Last known location:`}
                </Bioperfil>
                <Text style={styles.details}>
                  {user.location}
                </Text>
              </View>

              {/* First seen */}
              <View style={styles.locationContainer}>                
                <Bioperfil style={styles.field}>
                  {`First seen: `}
                </Bioperfil>
                <Text style={styles.details}>
                 {user.episodeName}
                </Text>
              </View>

              {/* Created */}
              <View style={styles.locationContainer}>                
                <Bioperfil style={styles.field}>
                  {`Created: `}
                  </Bioperfil>
                  <Text style={styles.field}>
                  {user.created}
                  </Text>
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
        <Footer />
      </Container>
    );
  }
}
