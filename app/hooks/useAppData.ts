import { useUserData } from "@/app/context/UserDataContext";
import { canAccess } from "@/app/utils/accessControl";
import { isUploaded } from "@/app/utils/documentManager";

export const useAppData = () => {
  const { userData, setUserData } = useUserData();

  return {
    userData,
    setUserData,

    // SERVICES
    canAccess: (service: string) =>
      canAccess(userData, service),

    // DOCUMENTS
    isUploaded: (key: string) =>
      isUploaded(userData, key),
  };
};