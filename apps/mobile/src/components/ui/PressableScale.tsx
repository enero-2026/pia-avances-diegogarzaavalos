import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, type PressableProps, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: ViewStyle | ViewStyle[];
  /** Cuánto se encoge al presionar (1 = nada, 0.96 default). */
  scaleTo?: number;
  /** Si dispara haptic suave al tocar. */
  haptic?: boolean | 'light' | 'medium' | 'heavy';
  children?: React.ReactNode;
};

/**
 * Botón "premium" que en cada tap escala con spring + opcional haptic.
 * Reemplaza a `TouchableOpacity` sin perder accesibilidad.
 */
export function PressableScale({
  scaleTo = 0.96,
  haptic = 'light',
  onPressIn,
  onPressOut,
  onPress,
  style,
  children,
  ...props
}: Props) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - scaleTo) }],
    opacity: 1 - pressed.value * 0.04,
  }));

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(e) => {
        pressed.value = withSpring(1, { damping: 22, stiffness: 320 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = withTiming(0, { duration: 180 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) {
          const style =
            haptic === 'heavy'
              ? Haptics.ImpactFeedbackStyle.Heavy
              : haptic === 'medium'
              ? Haptics.ImpactFeedbackStyle.Medium
              : Haptics.ImpactFeedbackStyle.Light;
          Haptics.impactAsync(style).catch(() => {
            /* haptics opcionales */
          });
        }
        onPress?.(e);
      }}
      style={[style as ViewStyle, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
