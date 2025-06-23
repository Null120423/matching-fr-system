import { useAuth } from "@/contexts/AuthContext";
import { ENDPOINTS } from "@/services/endpoints";
import { rootApi } from "@/services/rootApi";
import { useMutation } from "@tanstack/react-query";
import { SignInRequest, SignInResponse } from "./dto";

const useLogin = () => {
  const { expoToken } = useAuth();
  const { onSignIn } = useAuth();
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: SignInRequest) => {
      return rootApi.post<SignInRequest, SignInResponse>(
        ENDPOINTS.AUTH.SIGNIN,
        { ...variables, expoToken }
      );
    },
    onSuccess: async (data: SignInResponse) => {
      onSignIn({
        user: data.user,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onLogin: mutateAsync,
  };
};

export default useLogin;
