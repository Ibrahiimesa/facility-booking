import React from 'react';
import { View } from 'react-native';

type SpacerProps = {
  width?: number;
  height?: number;
};

const Spacer: React.FC<SpacerProps> = ({ width = 0, height = 0 }) => {
  return <View style={{ width, height }} />;
};

export default Spacer;
