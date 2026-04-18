import { StyleSheet } from 'react-native';

export const COLOR = '#b85555';
export const COLOR_LIGHT = '#c97070'; // ← agregamos esta

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Header (fusionado en uno solo)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 0,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuBtn: {
    backgroundColor: COLOR_LIGHT,
    padding: 10,
    marginLeft: 0,
  },
  barra: {
    flex: 1,
    backgroundColor: COLOR,
  },
  // Grid de botones
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  boton: {
    backgroundColor: COLOR,
    width: '46%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  botonTexto: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  // Vendedores
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  vendedorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  vendedorNombre: {
    fontSize: 15,
    color: '#333',
  },
});