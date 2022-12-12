import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
axios.defaults.baseURL = "http://localhost:5000";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </PersistGate>
    </Provider>
);
