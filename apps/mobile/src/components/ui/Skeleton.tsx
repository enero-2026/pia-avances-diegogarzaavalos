import React, { useEffect } from 'react';
import { type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: object;
};

export function Skeleton({ width = '100%', height = 14, radius, style }: Props) {
  const t = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius ?? t.radius.sm,
          backgroundColor: t.colors.background.muted,
        },
        animated,
        style,
      ]}
    />
  );
}
