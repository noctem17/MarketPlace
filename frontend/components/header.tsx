import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../constants/Styles';
import { Ionicons } from '@expo/vector-icons';

const COLOR = '#b85555';
const COLOR_LIGHT = '#c97070';

interface Props {
  onOpenMenu: () => void;
}

export default function Header({ onOpenMenu }: Props) {
  return (
    <View style={styles.header}>
      {/* Botón hamburguesa */}
      <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
        <Ionicons name="menu" size={28} color={COLOR} />
      </TouchableOpacity>

      {/* Barra de color */}
      <View style={styles.barra} />
    </View>
  );
}
