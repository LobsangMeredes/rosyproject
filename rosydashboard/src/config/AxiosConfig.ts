import axios from 'axios';

// Crear una instancia de Axios
const apiClient = axios.create({
  baseURL: 'http://34.41.100.138:3001',  // URL de tu backend en App Engine
  timeout: 40000, // Tiempo de espera en milisegundos (opcional)
  headers: {
    'Content-Type': 'application/json', // Tipo de contenido que estás enviando
  },
});

// Interceptor de solicitudes para manejar encabezados comunes
apiClient.interceptors.request.use(
  config => {
    // Puedes agregar token de autenticación o configuraciones adicionales aquí si lo necesitas.
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejar errores globales
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Manejar errores globales, como redirección en caso de 401 o mostrar mensajes
    return Promise.reject(error);
  }
);

export default apiClient;
