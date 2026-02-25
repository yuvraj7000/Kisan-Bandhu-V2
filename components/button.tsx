import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';


const Button = ({ handleDone, buttonName }) => {
  const { t } = useTranslation();
  return (
    <View>
      <TouchableOpacity onPress={handleDone} style={{
        width: '100%',
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
      }}>
        <Text style={{ color: 'white', fontSize: 18 }}>{t(buttonName)}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Button;