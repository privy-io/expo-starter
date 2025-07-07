import type { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack - Main navigation structure
export type RootStackParamList = {
  // Auth flow screens
  Auth: NavigatorScreenParams<AuthStackParamList>;
  // Main app screens (after authentication)
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Auth Stack - Authentication related screens
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email: string };
};

// Main Tab Navigator - Bottom tabs for authenticated users
export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Modal Stack - For modal screens that overlay the main app
export type ModalStackParamList = {
  EditProfile: undefined;
  ChangePassword: undefined;
  Notifications: undefined;
};

// Feature-specific navigation params
export type TodoStackParamList = {
  TodoList: undefined;
  TodoDetail: { todoId: string };
  TodoCreate: undefined;
  TodoEdit: { todoId: string };
};

// Type helpers for navigation
export type ScreenProps<
  T extends keyof RootStackParamList | 
           keyof AuthStackParamList | 
           keyof MainTabParamList | 
           keyof ModalStackParamList |
           keyof TodoStackParamList
> = T extends keyof RootStackParamList
  ? RootStackParamList[T]
  : T extends keyof AuthStackParamList
  ? AuthStackParamList[T]
  : T extends keyof MainTabParamList
  ? MainTabParamList[T]
  : T extends keyof ModalStackParamList
  ? ModalStackParamList[T]
  : T extends keyof TodoStackParamList
  ? TodoStackParamList[T]
  : never;

// Export all param lists for use in features
export type AllNavigationParamLists = 
  | RootStackParamList
  | AuthStackParamList
  | MainTabParamList
  | ModalStackParamList
  | TodoStackParamList;