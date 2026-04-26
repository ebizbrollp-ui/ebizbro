export const canAccess = (userData: any, service: string) => {
  const services = userData?.services || {};

  switch (service) {
    case "itr":
      return services.taxation || services.cfo;

    case "gst":
      return services.gst || services.cfo;

    case "cfo":
      return services.cfo;

    case "legal":
      return services.legal;

    default:
      return false;
  }
};