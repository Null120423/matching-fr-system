import { UserDTO } from "@/dto";
import { AuthTokenService } from "@/helper";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
interface AuthContextType {
  currentUser: UserDTO | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  onSignIn: (data: {
    user: UserDTO;
    tokens: { accessToken: string; refreshToken: string };
  }) => Promise<void>;
  setAuthAccessToken: (token: string | null) => Promise<void>;
  signOut: () => Promise<void>;
}

// Tạo Context với giá trị mặc định ban đầu
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Các biến toàn cục để Axios interceptor có thể truy cập
// Chúng ta sẽ gán giá trị cho chúng trong AuthContextProvider
let _setAuthAccessTokenGlobal:
  | ((token: string | null) => Promise<void>)
  | null = null;
let _clearAuthGlobal: (() => Promise<void>) | null = null;

// Export các hàm này để coreHelper.ts có thể import và sử dụng
export const getSetAuthAccessTokenGlobal = () => _setAuthAccessTokenGlobal;
export const getClearAuthGlobal = () => _clearAuthGlobal;

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true); // Để quản lý trạng thái loading ban đầu

  // Hàm hydrate để khôi phục trạng thái từ SecureStore
  const hydrate = useCallback(async () => {
    try {
      setIsAuthenticating(true);
      const storedAccessToken = await AuthTokenService.getAccessToken();
      const storedRefreshToken = await AuthTokenService.getRefreshToken();

      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);

      // TODO: Nếu có access token, bạn có thể gọi API /users/me để lấy lại thông tin user
      // và xác thực token ở đây. Nếu API trả về lỗi (ví dụ token không hợp lệ), hãy clearAuth.
      // try {
      //   if (storedAccessToken) {
      //     const { AuthService } = await import('../services/users'); // Import động để tránh circular dependency
      //     const user = await AuthService.getCurrentUser();
      //     setCurrentUser(user);
      //   }
      // } catch (fetchError) {
      //   console.warn('Failed to fetch current user after hydrate, clearing auth:', fetchError);
      //   await signOut(); // Clear any invalid tokens
      // }
    } catch (error) {
      console.error("Failed to hydrate AuthContext from SecureStore", error);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const onSignIn = useCallback(
    async (data: {
      user: UserDTO;
      tokens: { accessToken: string; refreshToken: string };
    }) => {
      setCurrentUser(data.user);
      setAccessToken(data.tokens.accessToken);
      setRefreshToken(data.tokens.refreshToken);
      await AuthTokenService.saveAccessToken(data.tokens.accessToken);
      await AuthTokenService.saveRefreshToken(data.tokens.refreshToken);
    },
    []
  );

  const setAuthAccessToken = useCallback(async (token: string | null) => {
    setAccessToken(token);
    if (token) {
      await AuthTokenService.saveAccessToken(token);
    } else {
      await AuthTokenService.deleteAccessToken();
    }
  }, []);

  const signOut = useCallback(async () => {
    setCurrentUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    await AuthTokenService.clearAllTokens();
  }, []);

  useEffect(() => {
    _setAuthAccessTokenGlobal = setAuthAccessToken;
    _clearAuthGlobal = signOut;
    return () => {
      _setAuthAccessTokenGlobal = null;
      _clearAuthGlobal = null;
    };
  }, [setAuthAccessToken, signOut]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const contextValue = {
    currentUser,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken && !!currentUser?.id,
    isAuthenticating,
    onSignIn,
    setAuthAccessToken,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook để sử dụng AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
