import * as LucideIcons from 'lucide-react-native';

const LucideIcon = (props: {
  iconName: keyof typeof LucideIcons;
  width?: number;
  height?: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
}) => {
  const { iconName, width, height, color, size, strokeWidth, fill = 'none' } = props;

  const Icon = LucideIcons[iconName] as React.ComponentType<{
    width?: number;
    height?: number;
    color?: string;
    size?: number;
    strokeWidth?: number;
    fill?: string;
  }>;
  if (size) {
    return <Icon width={size} height={size} color={color} strokeWidth={strokeWidth} fill={fill} />;
  } else {
    return (
      <Icon width={width} height={height} color={color} strokeWidth={strokeWidth} fill={fill} />
    );
  }
};

export { LucideIcon };
