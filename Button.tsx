import {
  Text,
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";

export const Button = ({
  children,
  loading,
  ...props
}: Omit<TouchableOpacityProps, "children"> & {
  children: string;
  loading?: boolean;
}) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: 4,
          padding: 10,
          width: "100%",
          marginVertical: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        props.style,
      ]}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Text
          style={{
            color: props.disabled ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.5)",
            fontStyle: props.disabled ? "italic" : "normal",
          }}
        >
          {children}
        </Text>
        {loading && <ActivityIndicator size="small" color="rgba(0,0,0,0.3)" />}
      </View>
    </TouchableOpacity>
  );
};
