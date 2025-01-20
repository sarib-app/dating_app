import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LottieAnimation = ({ source, style ,animationStyle}) => {
  return (
    <View style={[styles.container, style]}>
      <LottieView source={source} autoPlay loop  style={animationStyle}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LottieAnimation;
