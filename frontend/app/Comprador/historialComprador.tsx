// app/(tabs)/historial.tsx
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles, COLOR, COLOR_LIGHT } from '../../constants/Styles';

const historial = [
  { nombre: 'User', descripcion: 'Descripcion del producto' },
  { nombre: 'User', descripcion: 'Descripcion del producto' },
  { nombre: 'User', descripcion: 'Descripcion del producto' },
];

export default function Historial() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={localStyles.colorBlock} />
        <Text style={localStyles.headerTitulo}>historial</Text>
        <TouchableOpacity onPress={() => router.back()} style={localStyles.backBtn}>
          <Ionicons name="return-up-back-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Lista de productos */}
      <View style={localStyles.lista}>
        {historial.map((item, i) => (
          <View key={i} style={localStyles.card}>
            {/* Botón eliminar */}
            <TouchableOpacity style={localStyles.deleteBtn}>
              <Ionicons name="close-circle" size={24} color={COLOR} />
            </TouchableOpacity>

            {/* Fila usuario */}
            <View style={localStyles.usuarioRow}>
              <View style={styles.avatar} />
              <Text style={localStyles.usuarioNombre}>{item.nombre}</Text>
            </View>

            {/* Descripción */}
            <View style={localStyles.descripcionBox}>
              <Text style={localStyles.descripcionTexto}>{item.descripcion}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  colorBlock: {
    width: 50,
    height: '100%',
    backgroundColor: COLOR_LIGHT,
  },
  headerTitulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  backBtn: {
    padding: 12,
    marginRight: 8,
  },
  lista: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    position: 'relative',
  },
  deleteBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
  },
  usuarioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  usuarioNombre: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  descripcionBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descripcionTexto: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});