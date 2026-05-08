export const getApiUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL || "";

  if (typeof window === "undefined") {
    return configuredUrl;
  }

  const isLocalPage = ["localhost", "127.0.0.1"].includes(
    window.location.hostname,
  );
  const isLocalApi =
    configuredUrl.includes("localhost") ||
    configuredUrl.includes("127.0.0.1");

  if (!isLocalPage && isLocalApi) {
    return "";
  }

  return configuredUrl.replace(/\/$/, "");
};
