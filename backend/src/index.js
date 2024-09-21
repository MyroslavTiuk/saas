import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import App from "./App";
import { makeGetRequest } from "./APIs/request";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

const defaultQueryFn = ({ queryKey }) => {
  return makeGetRequest(queryKey.join("/"));
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      queryFn: defaultQueryFn,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
