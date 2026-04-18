import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { styles, COLOR_LIGHT } from '../../constants/Styles';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const botones = [
  { label: 'Buscar',          icon: 'search', ruta: '/(tabs)/BuscarProducto'},
  { label: 'Historial',       icon: 'cart',   ruta: '/(tabs)/historialComprador'},
  { label: 'Tiendas físicas', icon: 'map',    ruta: '/tiendas-fisicas'       },
  { label: 'Deseo Vender',    icon: null,     ruta: '/deseo-vender'          },
];

const vendedores = ['User', 'User', 'User'];

export default function HubComprador() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={localStyles.colorBlock} />
        <View style={{ flex: 1 }} />
      </View>

      {/* Grid de botones */}
      <View style={styles.grid}>
        {botones.map((btn) => (
          <TouchableOpacity
            key={btn.label}
            style={styles.boton}
            onPress={() => router.push(btn.ruta as any)}
          >
            {btn.icon && (
              <Ionicons name={btn.icon as any} size={36} color="white" />
            )}
            <Text style={styles.botonTexto}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vendedores destacados */}
      <Text style={styles.seccionTitulo}>Vendedores destacados</Text>
      {vendedores.map((v, i) => (
        <View key={i} style={styles.vendedorRow}>
          <View style={styles.avatar} />
          <Text style={styles.vendedorNombre}>{v}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  colorBlock: {
    width: 50,
    height: '100%',
    backgroundColor: COLOR_LIGHT,
  },
});