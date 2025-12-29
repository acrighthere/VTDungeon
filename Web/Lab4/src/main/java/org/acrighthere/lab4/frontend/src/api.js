import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
    withCredentials: true
});

function getAccessToken() {
    return localStorage.getItem("accessToken");
}

function saveAccessToken(token) {
    localStorage.setItem("accessToken", token);
}

let isRefreshing = false;
let subscribers = [];

function subscribe(callback) {
    subscribers.push(callback);
}

function notifySubscribers(token) {
    subscribers.forEach(cb => cb(token));
    subscribers = [];
}

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    response => response,
    async (error) => {
        const original = error.config;

        // ===== RATE LIMIT =====
        if (error.response?.status === 429) {
            const retryAfter = error.response.headers["retry-after"] ||
                error.response.data?.retryAfter || 60;
            const seconds = Number(retryAfter);

            if (typeof window.showToast === "function") {
                window.showToast(
                    `Слишком много запросов! Подожди ${seconds} сек.`,
                    "warning",
                    seconds * 1000
                );
            } else {
                alert(`Слишком много попыток! Подожди ${seconds} секунд`);
            }

            return Promise.reject({
                ...error,
                isRateLimited: true,
                retryAfter: seconds,
                message: `Rate limited. Wait ${seconds}s`
            });
        }

        // ===== 401 =====
        const isVerifyEndpoint = original.url?.includes("/auth/verify");
        const isAuthEndpoint = original.url?.includes("/auth/login") || original.url?.includes("/auth/register");

        if (error.response?.status === 401 && !original._retry && !isVerifyEndpoint && !isAuthEndpoint) {
            original._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const res = await axios.post(
                        "http://localhost:8080/api/auth/refresh",
                        {},
                        { withCredentials: true }
                    );

                    const newToken = res.data.accessToken;
                    saveAccessToken(newToken);
                    isRefreshing = false;
                    notifySubscribers(newToken);

                    original.headers.Authorization = `Bearer ${newToken}`;
                    return api(original);

                } catch (refreshError) {
                    isRefreshing = false;
                    subscribers = [];
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            }

            return new Promise((resolve) => {
                subscribe((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    resolve(api(original));
                });
            });
        }

        return Promise.reject(error);
    }
);

export default api;
