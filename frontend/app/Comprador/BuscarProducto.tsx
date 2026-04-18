import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles as globalStyles, COLOR, COLOR_LIGHT } from '../../constants/Styles';

const productos = ['User', 'User', 'User', 'User', 'User', 'User'];

export default function Buscar() {
  return (
    <ScrollView style={localStyles.container}>
      {/* Header */}
      <View style={globalStyles.header}>
        <View style={localStyles.colorBlock} />
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => router.back()} style={localStyles.backBtn}>
          <Ionicons name="return-up-back-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={localStyles.titulo}>lista de productos</Text>

      {/* Barra de búsqueda */}
      <View style={localStyles.searchContainer}>
        <TextInput
          style={localStyles.searchInput}
          placeholder='buscar "hojas examen"'
          placeholderTextColor="#999"
        />
        <Ionicons name="search" size={20} color="#999" style={localStyles.searchIcon} />
      </View>

      {/* Lista */}
      <Text style={localStyles.seccionTitulo}>productos destacados</Text>
      {productos.map((p, i) => (
        <View key={i} style={localStyles.productoRow}>
          <View style={localStyles.avatar} />
          <Text style={localStyles.productoNombre}>{p}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  colorBlock: {
    width: 50,
    height: '100%',
    backgroundColor: COLOR_LIGHT,
  },
  backBtn: {
    padding: 12,
    marginRight: 8,
  },
  titulo: {
    fontSize: 13,
    color: '#999',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 8,
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
    color: '#333',
  },
  productoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#ccc',
  },
  productoNombre: {
    fontSize: 15,
    color: '#333',
  },
});