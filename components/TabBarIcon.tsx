import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';

export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) => {
  return <FontAwesome size={28} className="mb-[-3px]" {...props} />;
};

export const TabBarIcon2 = (props: {
  inactiveName?: React.ComponentProps<typeof FontAwesome>['name'];
  activeName: React.ComponentProps<typeof FontAwesome>['name'];
  focused: boolean;
}) => {
  const { inactiveName, activeName, focused } = props;
  return (
    <FontAwesome
      size={28}
      className="mb-[-3px]"
      name={
        focused
          ? activeName
          : inactiveName
            ? inactiveName
            : (`${activeName}-o` as typeof FontAwesome.defaultProps.name)
      }
      color={focused ? 'black' : 'gray'}
    />
  );
};
